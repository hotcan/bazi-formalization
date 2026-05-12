// 测试套件 v3 - 聚焦 F综系数分布、r* 分布、起运合理性、交叉验证
var fs = require('fs');
var code = fs.readFileSync('../bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function(){ return null; }, addEventListener: function(){} };
eval(code);

// 大样本：20 个随机生成的盘 + 10 个典型盘
function randomCase(i){
  var y = 1950 + Math.floor(Math.random() * 60);
  var m = 1 + Math.floor(Math.random() * 12);
  var d = 1 + Math.floor(Math.random() * 27);
  var h = Math.floor(Math.random() * 24);
  var g = Math.floor(Math.random() * 2);
  return { name:'R'+i+' '+y+'-'+m+'-'+d+' '+h+':00 '+(g?'男':'女'), y:y, m:m, d:d, h:h, mm:0, lon:120, gender:g, mode:'sameDay' };
}

var CASES = [
  { name:'T1 曾国藩', y:1811, m:11, d:26, h:4, mm:0, lon:112, gender:1, mode:'sameDay' },
  { name:'T2 蒋介石', y:1887, m:10, d:31, h:12, mm:0, lon:121, gender:1, mode:'sameDay' },
  { name:'T3 女命1983', y:1983, m:5, d:6, h:23, mm:30, lon:121.5, gender:0, mode:'nextDay' },
  { name:'T4 男1990', y:1990, m:1, d:1, h:23, mm:30, lon:120, gender:1, mode:'sameDay' },
  { name:'T5 男1980', y:1980, m:8, d:9, h:14, mm:30, lon:106.7, gender:1, mode:'sameDay' },
  { name:'T6 专旺甲', y:1994, m:2, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'T7 从财', y:1980, m:9, d:10, h:16, mm:0, lon:120, gender:1, mode:'sameDay' }
];
// 固定种子用于可复现
var seed = 42;
Math.random = function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
for (var i = 0; i < 25; i++) CASES.push(randomCase(i+1));

function test(c){
  var chart;
  try { chart = calcFullChart(c.y, c.m, c.d, 0, c.lon, c.h, c.mm, c.gender, c.mode); }
  catch(e){ return { name:c.name, ERROR:e.message }; }
  var p = chart.pillars, str = chart.strength, ug = chart.usefulGod, dy = chart.daYun;
  var pillarsStr = p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ');

  // 检查起运岁数 (应 < 12)
  var startAgeOK = dy.startAge !== undefined && dy.startAge >= 0 && dy.startAge < 12;

  // 跑 90 年的 F 综 分布
  var fs_arr = [];
  for (var yr = c.y; yr < c.y + 90; yr++) {
    var f = calcYearFortune(yr, p, dy, str, ug, chart.gammaVec);
    if (f) fs_arr.push({yr:yr, F:f.F, lo:f.F_lo, hi:f.F_hi});
  }
  var fVals = fs_arr.map(function(x){return x.F;});
  var mean = fVals.reduce(function(a,b){return a+b;},0) / fVals.length;
  var max = Math.max.apply(null, fVals);
  var min = Math.min.apply(null, fVals);
  // 判定分布
  var judgeCounts = { 大吉:0, 吉:0, 平:0, 凶:0, 大凶:0 };
  fVals.forEach(function(f){
    if (f>1.1) judgeCounts['大吉']++;
    else if (f>0.45) judgeCounts['吉']++;
    else if (f>-0.45) judgeCounts['平']++;
    else if (f>-1.1) judgeCounts['凶']++;
    else judgeCounts['大凶']++;
  });
  // 连续 X 年极端同向 (连续 >=10 年 凶/大凶 或 吉/大吉 才视为异常)
  // |F|>0.45 才算"非平"
  var consecMax = 0, consecSame = 0, lastSign = 0;
  fVals.forEach(function(f){
    var sign = f>0.45?1:f<-0.45?-1:0;
    if (sign !== 0 && sign === lastSign) consecSame++;
    else { consecSame = 1; lastSign = sign; }
    if (consecSame > consecMax) consecMax = consecSame;
  });

  // 用神权重 —— 不应 所有五行都负或都正
  var w = ug.weights || [0,0,0,0,0];
  var positives = w.filter(function(x){return x>0;}).length;
  var negatives = w.filter(function(x){return x<0;}).length;

  // 置信区间宽 — 均值
  var widths = fs_arr.map(function(x){return (x.hi||x.F) - (x.lo||x.F);});
  var avgWidth = widths.reduce(function(a,b){return a+b;},0) / widths.length;

  return {
    name: c.name,
    pillars: pillarsStr,
    dm: TG[p.dayMaster]+WX[p.dayMasterWxOrig!==undefined?p.dayMasterWxOrig:p.dayMasterWx],
    r: str.r.toFixed(3),
    strength: str.name,
    H: chart.temp.H,
    pattern: ug.specialPattern || '正格',
    primaryGod: ug.candidates[0] ? WX[ug.candidates[0].w] : '?',
    dyAge: dy.startAge,
    dyAgeOK: startAgeOK,
    F_mean: mean.toFixed(2),
    F_min: min.toFixed(2),
    F_max: max.toFixed(2),
    F_width: avgWidth.toFixed(2),
    judges: judgeCounts,
    extremeRun: consecMax,
    extremeRunAlert: consecMax >= 10 ? 'ALERT' : '',
    wPos: positives,
    wNeg: negatives,
    natureNotes: (ug.natureNotes||[]).length
  };
}

var results = CASES.map(test);

// 聚合统计
var agg = {
  total: results.length,
  errors: results.filter(function(r){return r.ERROR;}).length,
  startAgeBad: results.filter(function(r){return r.dyAgeOK === false;}).map(function(r){return r.name+'→'+r.dyAge;}),
  extremeRuns: results.filter(function(r){return r.extremeRunAlert;}).map(function(r){return r.name+'→'+r.extremeRun+'连';}),
  F_means: results.map(function(r){return parseFloat(r.F_mean);}),
  r_stars: results.map(function(r){return parseFloat(r.r);}),
  avgNatureNotes: 0,
  patternDist: {},
  strengthDist: {}
};
// F_mean 分布
var meanAll = agg.F_means.reduce(function(a,b){return a+b;},0) / agg.F_means.length;
agg.F_mean_overall = meanAll.toFixed(3);
agg.F_mean_abs_max = Math.max.apply(null, agg.F_means.map(Math.abs)).toFixed(3);
agg.r_mean = (agg.r_stars.reduce(function(a,b){return a+b;},0) / agg.r_stars.length).toFixed(3);
results.forEach(function(r){
  agg.patternDist[r.pattern||'?'] = (agg.patternDist[r.pattern||'?']||0) + 1;
  agg.strengthDist[r.strength||'?'] = (agg.strengthDist[r.strength||'?']||0) + 1;
  if (r.natureNotes) agg.avgNatureNotes += r.natureNotes;
});
agg.avgNatureNotes = (agg.avgNatureNotes / results.length).toFixed(2);

// 判定分布合计
var totalJudges = { 大吉:0, 吉:0, 平:0, 凶:0, 大凶:0 };
results.forEach(function(r){
  if (r.judges) Object.keys(r.judges).forEach(function(k){ totalJudges[k] += r.judges[k]; });
});
var totJ = 0; Object.keys(totalJudges).forEach(function(k){ totJ += totalJudges[k]; });
agg.judgeDistPct = {};
Object.keys(totalJudges).forEach(function(k){ agg.judgeDistPct[k] = (totalJudges[k]/totJ*100).toFixed(1)+'%'; });

fs.writeFileSync('test-report2.json', JSON.stringify({ agg: agg, results: results }, null, 2));
console.log('═'.repeat(60));
console.log('总盘:', agg.total, '错误:', agg.errors);
console.log('起运异常:', agg.startAgeBad.length, agg.startAgeBad.slice(0,5));
console.log('连续 10+ 年同向:', agg.extremeRuns.length, agg.extremeRuns.slice(0,3));
console.log('F_mean 整体均值:', agg.F_mean_overall, '|绝对值最大:', agg.F_mean_abs_max);
console.log('r* 均值:', agg.r_mean);
console.log('avg 十干规则:', agg.avgNatureNotes);
console.log('判定分布:', agg.judgeDistPct);
console.log('格局分布:', agg.patternDist);
console.log('日主强弱:', agg.strengthDist);
