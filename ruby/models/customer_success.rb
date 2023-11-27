require_relative 'customer'

class CustomerSuccess
  attr_accessor :id, :score, :customers

  def initialize(id: 0, score: 0)
    @customers = []
    @id = id
    @score = score
  end

  def add_customer(customer)
    customer.add_customer_success(self)
    @customers << customer
  end

  def size_of_customers
    @customers.size
  end
end