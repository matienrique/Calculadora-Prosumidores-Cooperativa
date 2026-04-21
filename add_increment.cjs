const fs = require('fs');
const files = [
  'NotProsumerResidentialFlow.tsx',
  'NotProsumerCommercialFlow.tsx',
  'NotProsumerIndustrialFlow.tsx',
  'NotProsumerAssociationsFlow.tsx',
  'NotProsumerLargeDemandFlow.tsx',
  'ResidentialProsumerFlow.tsx',
  'CommercialProsumerFlow.tsx',
  'IndustrialProsumerFlow.tsx',
  'LargeDemandProsumerFlow.tsx',
  'AssociationsProsumerFlow.tsx'
];

for (const file of files) {
  const p = './components/' + file;
  let code = fs.readFileSync(p, 'utf8');
  
  if (!code.includes('import { incrementCompletedCount }')) {
    code = "import { incrementCompletedCount } from './incrementCompleted';\n" + code;
  }
  
  // Replace setShowResults(true); with incrementCompletedCount(); setShowResults(true);
  code = code.replace(/setShowResults\(true\);/g, "incrementCompletedCount();\n            setShowResults(true);");

  fs.writeFileSync(p, code);
}
console.log('Added incrementCompletedCount successfully!');
