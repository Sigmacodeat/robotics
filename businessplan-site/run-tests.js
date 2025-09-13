const path = require('path');

const tests = [
  require('./__tests__/repair-json.test.js'),
  require('./__tests__/restore-cv.test.js')
];

let passed = 0;
let failed = 0;

tests.forEach(testModule => {
  Object.keys(testModule).forEach(testName => {
    if (testName.startsWith('test')) {
      try {
        testModule[testName]();
        console.log(`✅ ${testName}`);
        passed++;
      } catch (error) {
        console.error(`❌ ${testName}: ${error.message}`);
        failed++;
      }
    }
  });
});

console.log(`\nTests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
