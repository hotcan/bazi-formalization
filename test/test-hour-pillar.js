// 时柱验证测试：100 盘随机 1900-2000
// 对每个盘：
//   1. 独立计算时支 d_hour (基于真太阳时)
//   2. 独立计算时干 t_hour = (2*(t_day%5) + d_hour) % 10
//   3. 与系统输出对比
//   4. 特别检查：晚子时（23:xx）两派模式下日柱/时柱的组合
var fs = require('fs');
eval(fs.readFileSync('../bazi-core.js','utf8'));

// ─ 固定种子 ─
var seed = 19002000;
Math.random = function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

// ─ 独立时支计算（参考实现） ─
function refHourBranch(hh, mm) {
  var h = hh;
  if (h === 23) return 0; // 子时开始 23:00
  return Math.floor((h + 1) / 2);
}
// ─ 独立时干计算 ─
function refHourStem(t_day, d_hour) {
  return (2 * (t_day % 5) + d_hour) % 10;
}

var mismatches = [];
var lateZiAnalysis = [];
var boundaryBranches = { 0:0, 2:0, 4:0, 6:0, 8:0, 10:0 }; // 偶数时段边界

var N = 100;
var MODES = ['sameDay','nextDay'];
for (var i = 0; i < N; i++) {
  var y = 1900 + Math.floor(Math.random() * 100);
  var m = 1 + Math.floor(Math.random() * 12);
  var d = 1 + Math.floor(Math.random() * 28);
  var h = Math.floor(Math.random() * 24);
  var mm = Math.floor(Math.random() * 60);
  var lon = 100 + Math.random() * 25; // 拉萨~台北经度范围
  var gender = Math.floor(Math.random() * 2);
  var mode = MODES[Math.floor(Math.random() * 2)];

  var chart;
  try { chart = calcFullChart(y, m, d, 0, lon, h, mm, gender, mode); }
  catch(e) { mismatches.push({ name:i+'·'+y+'-'+m+'-'+d+' '+h+':'+mm, error:e.message }); continue; }

  var p = chart.pillars;
  var sysHourT = p.stems[3];
  var sysHourD = p.branches[3];
  var sysDayT = p.stems[2];
  var trueHH = p.tsAdj.trueHH;
  var trueMM = p.tsAdj.trueMM;
  var advanceDay = p.tsAdj.advanceDay;

  // ─ 独立验证 ─
  var refD = refHourBranch(trueHH, trueMM);
  var refT = refHourStem(sysDayT, refD);

  var bmatch = (sysHourD === refD);
  var tmatch = (sysHourT === refT);

  if (!bmatch || !tmatch) {
    mismatches.push({
      idx: i,
      date: y+'-'+m+'-'+d+' '+h+':'+(mm<10?'0':'')+mm,
      lon: lon.toFixed(1),
      mode: mode,
      trueTime: trueHH+':'+(trueMM<10?'0':'')+trueMM,
      lateZi: p.tsAdj.isLateZi,
      advanceDay: advanceDay,
      sysDay: TG[sysDayT],
      sysHour: TG[sysHourT]+DZ[sysHourD],
      refHour: TG[refT]+DZ[refD],
      branchMatch: bmatch,
      stemMatch: tmatch,
      reason: !bmatch ? 'branch' : 'stem'
    });
  }

  // 特征统计
  if (p.tsAdj.isLateZi) lateZiAnalysis.push({
    idx:i, mode:mode, trueHH:trueHH, advanceDay:advanceDay,
    day: TG[sysDayT]+DZ[p.branches[2]],
    hour: TG[sysHourT]+DZ[sysHourD]
  });

  // 子时/午时 边界统计（d_hour 偶数值出现频率）
  if (boundaryBranches[sysHourD] !== undefined) boundaryBranches[sysHourD]++;
}

// 真太阳时修正覆盖
var lonTests = [91, 100, 110, 120, 125]; // 拉萨 重庆 西安 北京 台北
var lonReport = lonTests.map(function(ln){
  var c = calcFullChart(1980, 6, 15, 0, ln, 12, 0, 1, 'sameDay');
  return { lon:ln, trueHH:c.pillars.tsAdj.trueHH, trueMM:c.pillars.tsAdj.trueMM, eot:c.pillars.tsAdj.eot, lonAdj:c.pillars.tsAdj.lonAdj, hour:TG[c.pillars.stems[3]]+DZ[c.pillars.branches[3]] };
});

// 夜子时跨日正确性
var dayAdvanceCases = [
  { y:1999, m:12, d:31, h:23, mm:30, lon:120, mode:'nextDay', note:'跨年夜子时nextDay'},
  { y:1999, m:12, d:31, h:23, mm:30, lon:120, mode:'sameDay', note:'跨年夜子时sameDay'},
  { y:1983, m:5, d:6, h:23, mm:30, lon:121.5, mode:'nextDay', note:'review用过 nextDay'},
  { y:1983, m:5, d:6, h:23, mm:30, lon:121.5, mode:'sameDay', note:'review用过 sameDay'}
];
var dayAdvanceReport = dayAdvanceCases.map(function(c){
  var ch = calcFullChart(c.y,c.m,c.d,0,c.lon,c.h,c.mm,1,c.mode);
  var p = ch.pillars;
  return {
    note: c.note,
    pillars: p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' '),
    trueHH: p.tsAdj.trueHH,
    isLateZi: p.tsAdj.isLateZi,
    advanceDay: p.tsAdj.advanceDay
  };
});

fs.writeFileSync('test-hour-report.json', JSON.stringify({
  total: N,
  mismatches: mismatches,
  lateZiCount: lateZiAnalysis.length,
  lateZiSamples: lateZiAnalysis.slice(0,10),
  boundaryBranches: boundaryBranches,
  longitudeScan: lonReport,
  dayAdvanceScan: dayAdvanceReport
}, null, 2));

console.log('═'.repeat(60));
console.log('时柱验证 — 100 盘（1900-2000，lon 91-125，模式混合）');
console.log('─'.repeat(60));
console.log('不符数:', mismatches.length, '/', N);
if (mismatches.length) {
  mismatches.slice(0,10).forEach(function(m){
    console.log('  ✗', m.date, m.mode, '真太阳:'+m.trueTime, '系统:'+m.sysHour, '参考:'+m.refHour, '('+m.reason+'不一致)');
  });
}
console.log('');
console.log('晚子时触发:', lateZiAnalysis.length, '例');
console.log('  其中 nextDay 进位:', lateZiAnalysis.filter(function(x){return x.advanceDay;}).length);
console.log('  其中 sameDay 不进位:', lateZiAnalysis.filter(function(x){return !x.advanceDay;}).length);
console.log('');
console.log('时支分布（偶数时段 子/寅/辰/午/申/戌）:', boundaryBranches);
console.log('');
console.log('─ 经度扫描（1980-6-15 12:00）─');
lonReport.forEach(function(r){
  console.log('  lon='+r.lon+' → 真太阳 '+r.trueHH+':'+(r.trueMM<10?'0':'')+r.trueMM,
    '(EoT '+(r.eot>=0?'+':'')+r.eot.toFixed(1)+'min, 经度差 '+(r.lonAdj>=0?'+':'')+r.lonAdj.toFixed(1)+'min)',
    '时柱='+r.hour);
});
console.log('');
console.log('─ 夜子时跨日 ─');
dayAdvanceReport.forEach(function(r){
  console.log('  '+r.note+' → '+r.pillars+' | trueHH='+r.trueHH+' advanceDay='+r.advanceDay);
});
