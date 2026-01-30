import { createDefaultBasket } from './basket';

// Test cases from the specification
const testCases = [
  { products: ['B01', 'G01'], expected: 37.85 },
  { products: ['R01', 'R01'], expected: 54.37 },
  { products: ['R01', 'G01'], expected: 60.85 },
  { products: ['B01', 'B01', 'R01', 'R01', 'R01'], expected: 98.27 },
];

console.log('Running basket tests...\n');

let allPassed = true;

for (const testCase of testCases) {
  const basket = createDefaultBasket();
  for (const product of testCase.products) {
    basket.add(product);
  }
  const total = basket.total();
  const passed = total === testCase.expected;

  if (!passed) allPassed = false;

  console.log(`Products: ${testCase.products.join(', ')}`);
  console.log(`Expected: $${testCase.expected.toFixed(2)}`);
  console.log(`Got:      $${total.toFixed(2)}`);
  console.log(`Result:   ${passed ? 'PASS' : 'FAIL'}\n`);
}

console.log(allPassed ? 'All tests passed!' : 'Some tests failed!');
