class BalancingConditions {
    constructor({ customerSuccessAway, customerSuccess, availableCustomerSuccess, customers }) {
     this.customerSuccessAway = customerSuccessAway;
     this.customerSuccess = customerSuccess;
     this.availableCustomerSuccess = availableCustomerSuccess;
     this.customers = customers;
    }


    minNumberAvailableCustomerSuccess = () => {
      return this.customerSuccessAway.length <= parseFloat(this.customerSuccess.length / 2)
    }

    availableCustomerSuccessNotEmpty = () => {
      return this.availableCustomerSuccess.length < 2 ? this.availableCustomerSuccess[0].id : this.maxNumberCustomerSuccess();
    }

    whenTieBetweenTwoCustomerSuccess = () => {
      console.log(this.availableCustomerSuccess[0], "availableCustomerSuccess")
      return this.availableCustomerSuccess[0].customers.length == this.availableCustomerSuccess[1].customers.length ? 0 : this.availableCustomerSuccess[0].id;
    }

    maxNumberCustomerSuccess = () => {
      // console.log(this.customerSuccess.length < 1000, "customerSuccess")
      return this.customerSuccess.length < 1000 ? this.whenTieBetweenTwoCustomerSuccess() : 0;
    }

    maxNumberCustomers = () => {
      return this.customers.length < 1000000
    }
}

module.exports = { BalancingConditions };