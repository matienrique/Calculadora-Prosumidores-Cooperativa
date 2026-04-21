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
  
  code = code.replace('<ChatbotHelper />', '{!showResults && <ChatbotHelper />}');

  fs.writeFileSync(p, code);
}
console.log('Done replacement!');
