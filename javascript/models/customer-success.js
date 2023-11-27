class CustomerSuccess {
    constructor({ id, score }) {
     this.customers = [];
     this.id = id;
     this.score = score;
    }

    addCustomer = (customer) => {
      this.customers.push(customer);
      customer.addCustomerSuccess(this);
    }
}

module.exports = { CustomerSuccess };