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
  
  if (!code.includes('import ChatbotHelper')) {
    code = "import ChatbotHelper from './ChatbotHelper';\n" + code;
  }
  
  // Find where showResults is true and before it add ChatbotHelper
  // Usually the structure is:
  // if (showResults) {
  //   return ( ... );
  // }
  // return (
  //   <div className="max-w-4xl mx-auto space-y-8">
  // We can just add <ChatbotHelper /> before the final return. Actually, inside the final return's wrapper.
  
  // Find the final `return (` and inject it inside the wrapper
  // Or simply inject it before the last `</div>` of the component. But wait, if it returns early for showResults, then the bottom of the component is ONLY executed when showResults is false!
  
  // Check if it already has ChatbotHelper 
  if (!code.includes('<ChatbotHelper />')) {
      code = code.replace(/<\/div>\s*;\s*};\s*export default/g, "  <ChatbotHelper />\n    </div>\n  );\n};\n\nexport default");
  }

  fs.writeFileSync(p, code);
}
console.log('Done!');
