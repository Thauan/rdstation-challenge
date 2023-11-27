require 'minitest/autorun'
require 'timeout'
require_relative 'models/customer_success'
require_relative 'models/customer'

class CustomerSuccessBalancing
  def initialize(customer_success, customers, away_customer_success)
    @customer_success = customer_success
    @customers = customers
    @away_customer_success = away_customer_success
    @available_customer_success = []
  end

  # Returns the ID of the customer success with most customers
  def execute
    return unless min_available_customer_success && max_customers

    @available_customer_success = @customer_success
                                    .reject { |cs| @away_customer_success.include?(cs[:id]) }
                                    .map { |cs| CustomerSuccess.new(id: cs[:id], score: cs[:score]) }
                                    .sort_by(&:score)

    @sorted_customers = @customers
                          .map { |customer| Customer.new(id: customer[:id], score: customer[:score]) }
                          .sort_by(&:score)

    @available_customer_success = assign_customers_to_customer_success(
                                    @sorted_customers,
                                    @available_customer_success)
                                  .sort_by(&:size_of_customers).reverse!

    @available_customer_success.size.zero? ? 0 : available_customer_success_selected
  end

  private

  def assign_customers_to_customer_success(customers, available_customer_success)
    customers.each do |customer|
      available_success = available_customer_success.find { |cs| customer.score <= cs.score }
      available_success&.add_customer(customer) if available_success && customer.customer_success.nil?
    end
    available_customer_success
  end

  def min_available_customer_success
    @away_customer_success.size <= (@customer_success.size / 2).floor
  end

  def available_customer_success_selected
    @available_customer_success.size < 2 ? @available_customer_success.first.id : max_customer_success_available
  end

  def when_tie_between_customers
    @available_customer_success.first.customers.count == @available_customer_success[1].customers.count ? 0 : @available_customer_success.first.id
  end

  def max_customer_success_available
    @customer_success.size < 1000 ? when_tie_between_customers : 0
  end

  def max_customers
    @customers.size < 1_000_000
  end
end

class CustomerSuccessBalancingTests < Minitest::Test
  def test_scenario_one
    balancer = CustomerSuccessBalancing.new(
      build_scores([60, 20, 95, 75]),
      build_scores([90, 20, 70, 40, 60, 10]),
      [2, 4]
    )
    assert_equal 1, balancer.execute
  end

  def test_scenario_two
    balancer = CustomerSuccessBalancing.new(
      build_scores([11, 21, 31, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_three
    balancer = CustomerSuccessBalancing.new(
      build_scores(Array(1..999)),
      build_scores(Array.new(10000, 998)),
      [999]
    )
    result = Timeout.timeout(1.0) { balancer.execute }
    assert_equal 998, result
  end

  def test_scenario_four
    balancer = CustomerSuccessBalancing.new(
      build_scores([1, 2, 3, 4, 5, 6]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_five
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 2, 3, 6, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 1, balancer.execute
  end

  def test_scenario_six
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 99, 88, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      [1, 3, 2]
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_seven
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 99, 88, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      [4, 5, 6]
    )
    assert_equal 3, balancer.execute
  end

  def test_scenario_eight
    balancer = CustomerSuccessBalancing.new(
      build_scores([60, 40, 95, 75]),
      build_scores([90, 70, 20, 40, 60, 10]),
      [2, 4]
    )
    assert_equal 1, balancer.execute
  end

  private

  def build_scores(scores)
    scores.map.with_index do |score, index|
      { id: index + 1, score: score }
    end
  end
end
