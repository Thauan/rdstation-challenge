const { Customer } = require('./models/customer');
const { CustomerSuccess } = require('./models/customer-success');

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway,
 ) {


  const availableCustomerSuccess = getAvailableCustomerSuccess(customerSuccess, customerSuccessAway);

  const customerSuccessTeamByScore = searchCustomerSuccessByScore(
    availableCustomerSuccess,
    customers
  );

  const winningAttendantId = assignCustomerSuccessWithMostCustomers(customerSuccessTeamByScore);

  return winningAttendantId;
}

function getAvailableCustomerSuccess(customers, customerSuccessAway) {
  return customers
    .filter((customer) => !customerSuccessAway.includes(customer.id))
    .map(({ id, score }) => new Customer({ id, score }));
}

function searchCustomerSuccessByScore(customerSuccess, customers) {
  const sortedCustomerSuccess = [...customerSuccess].sort(
    (a, b) => a.score - b.score
  );

  const sortedCustomers = customers.sort((a, b) => a.score - b.score);

  sortedCustomers.forEach((customer) => {
    const availableSuccessIndex = sortedCustomerSuccess.findIndex(
      (cs) => cs.score >= customer.score
    );

    if(availableSuccessIndex >= 0) sortedCustomerSuccess[availableSuccessIndex].customerSuccess.push(customer);
  });

  return sortedCustomerSuccess;
}

const assignCustomerSuccessWithMostCustomers = (customerSuccessTeam) => {
  const customerSuccessHasQuantity = customerSuccessTeam.map(
    ({ customerSuccess }) => customerSuccess.length
  );

  const maxCustomerSuccess = Math.max(...customerSuccessHasQuantity);

  const maxIndexes = customerSuccessHasQuantity.reduce(
    (indexes, length, index) => {
      if (length === maxCustomerSuccess) {
        indexes.push(index);
      }
      return indexes;
    },
    []
  );

  return maxIndexes.length > 1 ? 0 : customerSuccessTeam[maxIndexes[0]].id;
};

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test('should create a customer object with default values', () => {
  const customer = new Customer({ id: 1, score: 100 });

  expect(customer.id).toBe(1);
  expect(customer.score).toBe(100);
  expect(customer.customerSuccess).toEqual([]);
});

test('should create a customer success object with default values', () => {
  const customerSuccess = new CustomerSuccess({ id: 2, score: 200 });

  expect(customerSuccess.id).toBe(2);
  expect(customerSuccess.score).toBe(200);
  expect(customerSuccess.customers).toEqual([]);
});
