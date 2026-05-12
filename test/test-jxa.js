var app = Application.currentApplication();
app.includeStandardAdditions = true;
var code = app.read(Path('/Users/hotcan/Downloads/八字计算/bazi-core.js'));
try {
  eval(code);
  console.log("EVAL OK");
} catch(e) {
  console.log(e.toString());
}
