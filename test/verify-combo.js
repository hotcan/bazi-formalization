var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function() { return null; } };
eval(code);

function show(label, Y, M, D, h) {
  console.log('\n' + '━'.repeat(60));
  console.log(label + '  ' + Y + '-' + M + '-' + D + ' ' + DZ[h] + '时');
  console.log('━'.repeat(60));
  var p = calcPillars(Y, M, D, h, 116.4, 12, 0);
  console.log('四柱: ' + TG[p.stems[0]]+DZ[p.branches[0]] + ' ' + TG[p.stems[1]]+DZ[p.branches[1]] + ' ' + TG[p.stems[2]]+DZ[p.branches[2]] + ' ' + TG[p.stems[3]]+DZ[p.branches[3]]);
  console.log('原局地支: ' + p.branches.map(function(b){return DZ[b];}).join(','));
  var hp = calcHiddenPillars(p);
  console.log('胎元: ' + TG[hp.tai.t]+DZ[hp.tai.d] + '   命宫: ' + TG[hp.ming.t]+DZ[hp.ming.d] + '   身宫: ' + TG[hp.shen.t]+DZ[hp.shen.d]);
  var hc = detectHiddenCombos(p.branches, hp);
  console.log('暗合检测:');
  hc.notes.forEach(function(n){ console.log('  • ' + n.desc); });
  console.log('vDelta: ' + hc.vDelta.map(function(v,i){return WX[i]+'='+v.toFixed(2);}).join(', '));
}

// 目标1: 寅午戌三合火局 — 原局已有寅+午，暗物质补戌
show('【例1 · 暗三合火局】', 1970, 1, 10, 6); // 午时

// 目标2: 巳午未三会火局 — 原局已有午+未，暗物质补巳
show('【例2 · 暗三会火局】', 1970, 2, 20, 6);

// 再找一个水局例子: 申子辰三合水 — 原局有申+子，暗物质补辰
// 月支=丑时胎元=(1+3)%12=4=辰，所以需要月丑+日子+时申 或类似
show('【例3 · 尝试申子辰】', 2004, 1, 15, 8); // 申时, 冬月
show('【例4 · 尝试亥子丑三会水】', 1996, 12, 20, 0); // 子时
