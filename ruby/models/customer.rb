require_relative 'customer_success'

class Customer
  attr_accessor :id, :score, :customer_success

  def initialize(id: 0, score: 0)
    @id = id
    @score = score
    @customer_success = nil
  end

  def add_customer_success(customer_success)
    @customer_success = customer_success
  end
end