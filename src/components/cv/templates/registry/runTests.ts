import { DEMO_CV_DATA } from '../../CVTypes';
import { runTemplateLayoutTests } from './TemplateValidation';

console.log("====================================================");
console.log("RUNNING AUTOMATED CROSS-TEMPLATE PAGINATION TESTS...");
console.log("====================================================");

const mockCustomHeights = {
  'block-career-0': 150, // simulate long team history
  'block-stats-0': 200    // simulate heavy stats
};

const results = runTemplateLayoutTests(DEMO_CV_DATA, mockCustomHeights);

let passedAll = true;
results.forEach(res => {
  console.log(`\nTemplate: ${res.name} (${res.templateId})`);
  console.log(`Status:   ${res.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Pages:    ${res.pageCount}`);
  if (res.errors.length > 0) {
    passedAll = false;
    console.log("Errors:");
    res.errors.forEach(err => console.log(`  - ${err}`));
  }
});

console.log("\n====================================================");
if (passedAll) {
  console.log("🎉 ALL TEMPLATE VALIDATION TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.log("🚨 SOME TEMPLATE VALIDATION TESTS FAILED.");
  process.exit(1);
}
