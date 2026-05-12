var app = Application.currentApplication();
app.includeStandardAdditions = true;
var coreCode = app.read(Path('/Users/hotcan/Downloads/八字计算/bazi-core.js'));
var testCode = app.read(Path('/Users/hotcan/Downloads/八字计算/test-suite.js'));
testCode = testCode.replace("var fs = require('fs');", "");
testCode = testCode.replace("var code = fs.readFileSync('../bazi-core.js', 'utf8');", "var code = coreCode;");
testCode = testCode.replace("fs.writeFileSync('test-report.json', JSON.stringify({ runAt: new Date().toISOString(), stats: stats, results: results }, null, 2));", "console.log(JSON.stringify(stats, null, 2));");
try {
  eval(testCode);
  console.log("RUN OK");
} catch(e) {
  console.log(e.toString());
}
