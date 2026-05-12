var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function() { return null; } };
eval(code);

// 时支 → 钟表小时 (每个时辰中点)
var HH_FOR = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

var types = {};
for (var y = 1960; y <= 2010; y++) {
  for (var m = 1; m <= 12; m++) {
    for (var d = 1; d <= 28; d++) {
      for (var h = 0; h < 12; h++) {
        try {
          var hh = HH_FOR[h];
          // 注意：把 h 和 hh 对齐，避免真太阳时换算误差
          var p = calcPillars(y, m, d, h, 120, hh + 1, 0); // lon=120 避开时差；hh+1分钟稳居时辰中段
          // 检查 calcPillars 实际使用的时支是否等于 h
          var realHourBranch = p.branches[3];
          if (realHourBranch !== h) continue; // 跳过真太阳时飘移的情况
          var hp = calcHiddenPillars(p);
          var hc = detectHiddenCombos(p.branches, hp);
          if (hc.notes.length > 0) {
            hc.notes.forEach(function(n) {
              var key = n.desc.split('（')[0];
              if (!types[key]) types[key] = [];
              if (types[key].length < 1) {
                types[key].push({
                  date: y+'-'+m+'-'+d+' '+DZ[h]+'时(hh='+hh+')',
                  bazi: TG[p.stems[0]]+DZ[p.branches[0]]+' '+TG[p.stems[1]]+DZ[p.branches[1]]+' '+TG[p.stems[2]]+DZ[p.branches[2]]+' '+TG[p.stems[3]]+DZ[p.branches[3]],
                  hidden: '胎:'+TG[hp.tai.t]+DZ[hp.tai.d]+' 命:'+TG[hp.ming.t]+DZ[hp.ming.d]+' 身:'+TG[hp.shen.t]+DZ[hp.shen.d],
                  note: n.desc
                });
              }
            });
          }
        } catch(e) {}
      }
    }
  }
}

Object.keys(types).sort().forEach(function(k) {
  console.log('\n【' + k + '】');
  types[k].forEach(function(f) {
    console.log('  公历: ' + f.date);
    console.log('  八字: ' + f.bazi);
    console.log('  暗物质: ' + f.hidden);
    console.log('  补完: ' + f.note);
  });
});
