class Customer {
   constructor({ id, score, customerSuccess }) {
    this.id = id;
    this.score = score;
    this.customerSuccess = customerSuccess || [];
   }

   addCustomerSuccess = (customerSuccess) => {
    return this.customerSuccess = customerSuccess;
   }
}

module.exports = { Customer };