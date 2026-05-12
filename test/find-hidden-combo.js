// 搜索暗物质能补全原局三合/三会的八字
var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function() { return null; } };
eval(code);

var found = [];
// 扫描 1970-2010 年每月1号、10号、20号，各时辰
for (var y = 1970; y <= 2010 && found.length < 20; y++) {
  for (var m = 1; m <= 12; m++) {
    for (var d of [1, 5, 10, 15, 20, 25]) {
      for (var h = 0; h < 12; h++) {
        try {
          var pillars = calcPillars(y, m, d, h, 116.4, 12, 0);
          var hp = calcHiddenPillars(pillars);
          var hc = detectHiddenCombos(pillars.branches, hp);
          if (hc.notes.length > 0) {
            var gz = ['年','月','日','时'].map(function(_,i){return TG[pillars.stems[i]]+DZ[pillars.branches[i]];}).join(' ');
            found.push({
              date: y+'-'+m+'-'+d+' 时支='+DZ[h],
              bazi: gz,
              hidden: '胎:'+TG[hp.tai.t]+DZ[hp.tai.d]+' 命:'+TG[hp.ming.t]+DZ[hp.ming.d]+' 身:'+TG[hp.shen.t]+DZ[hp.shen.d],
              notes: hc.notes.map(function(n){return n.type+': '+n.desc;}).join(' | '),
              vDelta: hc.vDelta.map(function(v,i){return v>0?WX[i]+'+'+v.toFixed(2):null;}).filter(Boolean).join(',')
            });
          }
        } catch(e) {}
      }
    }
  }
}

// 按类型分组
var sanHe = found.filter(function(f){return f.notes.indexOf('暗三合')>=0;});
var sanHui = found.filter(function(f){return f.notes.indexOf('暗三会')>=0;});

console.log('═══ 暗三合案例（前10）═══');
sanHe.slice(0,10).forEach(function(f,i){
  console.log('\n['+(i+1)+'] '+f.date);
  console.log('  八字:', f.bazi);
  console.log('  暗物质:', f.hidden);
  console.log('  补完:', f.notes);
  console.log('  向量增量:', f.vDelta);
});

console.log('\n═══ 暗三会案例（前10）═══');
sanHui.slice(0,10).forEach(function(f,i){
  console.log('\n['+(i+1)+'] '+f.date);
  console.log('  八字:', f.bazi);
  console.log('  暗物质:', f.hidden);
  console.log('  补完:', f.notes);
  console.log('  向量增量:', f.vDelta);
});

console.log('\n总计:', found.length, '个，三合:', sanHe.length, '三会:', sanHui.length);
