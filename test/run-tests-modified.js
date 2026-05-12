// 自动化测试套件 v2 - 聚焦计算正确性、规则覆盖率、边界条件
var fs = {}; fs.readFileSync = function(){return "";}; fs.writeFileSync = function(){};
var code = fs.readFileSync('../bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function(){ return null; }, addEventListener: function(){} };
var app = Application.currentApplication(); app.includeStandardAdditions=true; eval(app.read(Path("/Users/hotcan/Downloads/八字计算/bazi-core.js")));

// 测试用例分类：每组覆盖一类计算
var CASES = [
  // === 组 A: 经典历史人物/标准盘（用于四柱正确性验证） ===
  { name:'A1·曾国藩 1811-11-26 04:00', y:1811, m:11, d:26, h:4, mm:0, lon:112, gender:1, mode:'sameDay',
    expect: { pillars:'辛未 己亥 丙辰 庚寅' } },
  { name:'A2·宋庆龄 1893-01-27 03:00', y:1893, m:1, d:27, h:3, mm:0, lon:121, gender:0, mode:'sameDay',
    expect: { pillars:'壬辰 癸丑 癸酉 甲寅' } },
  { name:'A3·蒋介石 1887-10-31 12:00', y:1887, m:10, d:31, h:12, mm:0, lon:121, gender:1, mode:'sameDay',
    expect: { pillars:'丁亥 庚戌 己巳 庚午' } },

  // === 组 B: 各日主 × 各季节（测十干规则库触发率） ===
  { name:'B1·甲木春 (寅月)', y:1994, m:2, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B2·甲木夏 (午月)', y:1990, m:6, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B3·甲木秋 (酉月)', y:1995, m:9, d:20, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B4·甲木冬 (子月)', y:1992, m:12, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B5·丙火春', y:1991, m:3, d:10, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B6·丙火夏', y:1991, m:6, d:10, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B7·丙火秋', y:1991, m:9, d:10, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B8·丙火冬', y:1991, m:12, d:10, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B9·庚金夏 炼金', y:1990, m:7, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'B10·壬水春', y:1990, m:3, d:15, h:10, mm:0, lon:120, gender:1, mode:'sameDay' },

  // === 组 C: 特殊格局（测格局识别） ===
  { name:'C1·炎上格候选', y:1990, m:6, d:20, h:14, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'C2·稼穑格候选', y:1976, m:7, d:15, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'C3·从杀格候选', y:1970, m:10, d:1, h:16, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'C4·从财格候选', y:1980, m:9, d:10, h:16, mm:0, lon:120, gender:1, mode:'sameDay' },

  // === 组 D: 合冲刑害（测藏干修正） ===
  { name:'D1·天地大冲 (子午冲)', y:1984, m:6, d:15, h:0, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'D2·三合火局', y:1990, m:2, d:5, h:14, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'D3·六合水 (子丑)', y:2000, m:1, d:15, h:1, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'D4·天干相合甲己', y:1994, m:8, d:10, h:12, mm:0, lon:120, gender:1, mode:'sameDay' },
  { name:'D5·双刑 (寅巳)', y:1992, m:5, d:20, h:3, mm:0, lon:120, gender:1, mode:'sameDay' },

  // === 组 E: 真太阳时 / 夜子时 / 空亡 ===
  { name:'E1·晚子时 sameDay', y:1990, m:6, d:15, h:23, mm:30, lon:120, gender:1, mode:'sameDay' },
  { name:'E2·晚子时 nextDay', y:1990, m:6, d:15, h:23, mm:30, lon:120, gender:1, mode:'nextDay' },
  { name:'E3·经度西偏 (拉萨)', y:1990, m:6, d:15, h:12, mm:0, lon:91, gender:1, mode:'sameDay' },
  { name:'E4·经度东偏 (上海)', y:1990, m:6, d:15, h:12, mm:0, lon:121.5, gender:1, mode:'sameDay' },

  // === 组 F: 先前报告中涉及的参考盘 ===
  { name:'F1·女命 1983-5-6 23:30 子初换日', y:1983, m:5, d:6, h:23, mm:30, lon:121.5, gender:0, mode:'nextDay' },
  { name:'F2·女命 1983-5-6 23:30 晚子时', y:1983, m:5, d:6, h:23, mm:30, lon:121.5, gender:0, mode:'sameDay' },
  { name:'F3·男命 1980-8-9 贵阳', y:1980, m:8, d:9, h:14, mm:30, lon:106.7, gender:1, mode:'sameDay' }
];

function snapshot(c) {
  var chart;
  try {
    chart = calcFullChart(c.y, c.m, c.d, 0, c.lon, c.h, c.mm, c.gender, c.mode);
  } catch(e) {
    return { name:c.name, ERROR: e.message };
  }
  var p = chart.pillars;
  var pillarsStr = p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ');
  var dmLabel = TG[p.dayMaster] + WX[p.dayMasterWxOrig!==undefined?p.dayMasterWxOrig:p.dayMasterWx]
    + (p.dayMasterWxOrig!==undefined && p.dayMasterWxOrig!==p.dayMasterWx ? '→合化'+WX[p.dayMasterWx] : '');

  var str = chart.strength || {};
  var ug = chart.usefulGod || {};
  var temp = chart.temp || {};
  var dy = chart.daYun || {};
  var ss = chart.shenSha || [];
  var evt = chart.lifeEvents || [];

  var r = {
    name: c.name,
    pillars: pillarsStr,
    pillars_match: c.expect && c.expect.pillars ? (pillarsStr === c.expect.pillars ? '✓' : '✗ 期望:'+c.expect.pillars) : '(无期望)',
    dayMaster: dmLabel,
    r_star: str.r && str.r.toFixed(3),
    strength: str.name,
    H: temp.H,
    specialPattern: ug.specialPattern || null,
    primaryGod: ug.candidates && ug.candidates[0] ? WX[ug.candidates[0].w] + '('+ug.candidates[0].name+')' : '?',
    enemy: ug.enemy !== null && ug.enemy !== undefined ? WX[ug.enemy] : 'none',
    zhenJia: ug.zhenJiaSummary && ug.zhenJiaSummary.tone,
    natureNotes: (ug.natureNotes||[]).map(function(n){return n.rule;}),
    shenShaCount: ss.length,
    shenShaList: ss.map(function(s){return s.name;}).filter(function(v,i,a){return a.indexOf(v)===i;}),
    dyStartAge: dy.startAge,
    dyDir: dy.epsilon > 0 ? '顺' : '逆',
    dyFirst3: (dy.periods||[]).slice(0,3).map(function(x){return TG[x.t]+DZ[x.d];}),
    lifeEvents_count: evt.length,
    alerts: evt.filter(function(e){return e.level==='alert';}).map(function(e){return e.palace;}),
    goods: evt.filter(function(e){return e.level==='good';}).map(function(e){return e.palace;})
  };
  return r;
}

var results = CASES.map(snapshot);

// 统计
var stats = {
  total: results.length,
  errors: results.filter(function(r){return r.ERROR;}).length,
  pillarsMatched: results.filter(function(r){return r.pillars_match === '✓';}).length,
  pillarsMismatched: results.filter(function(r){return r.pillars_match && r.pillars_match.charAt(0) === '✗';}),
  zhenJia: {},
  specialPatterns: {},
  natureNoteRates: { 0:0, '1-2':0, '3-5':0, '6+':0 },
  shenShaRates: { 0:0, '1-3':0, '4-6':0, '7+':0 },
  strengthDist: {},
  avgNatureNotes: 0,
  avgShenSha: 0,
  noPatternPct: 0
};
var sumN = 0, sumS = 0, noPat = 0;
results.forEach(function(r){
  if (r.ERROR) return;
  var t = r.zhenJia || 'none';
  stats.zhenJia[t] = (stats.zhenJia[t]||0) + 1;
  var sp = r.specialPattern || '正格';
  stats.specialPatterns[sp] = (stats.specialPatterns[sp]||0) + 1;
  if (!r.specialPattern) noPat++;
  var nLen = (r.natureNotes||[]).length;
  sumN += nLen;
  if (nLen === 0) stats.natureNoteRates['0']++;
  else if (nLen <= 2) stats.natureNoteRates['1-2']++;
  else if (nLen <= 5) stats.natureNoteRates['3-5']++;
  else stats.natureNoteRates['6+']++;
  var sLen = r.shenShaCount || 0;
  sumS += sLen;
  if (sLen === 0) stats.shenShaRates['0']++;
  else if (sLen <= 3) stats.shenShaRates['1-3']++;
  else if (sLen <= 6) stats.shenShaRates['4-6']++;
  else stats.shenShaRates['7+']++;
  stats.strengthDist[r.strength||'?'] = (stats.strengthDist[r.strength||'?']||0) + 1;
});
var nonErr = results.length - stats.errors;
stats.avgNatureNotes = (sumN / nonErr).toFixed(2);
stats.avgShenSha = (sumS / nonErr).toFixed(2);
stats.noPatternPct = Math.round(noPat/nonErr*100) + '%';

fs.writeFileSync('test-report.json', JSON.stringify({ runAt: new Date().toISOString(), stats: stats, results: results }, null, 2));
console.log('═'.repeat(60));
console.log('总盘:', stats.total, '错误:', stats.errors);
console.log('四柱预期对比:', stats.pillarsMatched, '/', results.filter(function(r){return r.pillars_match && r.pillars_match !== '(无期望)';}).length);
console.log('avg 十干规则:', stats.avgNatureNotes, 'avg 神煞:', stats.avgShenSha);
console.log('natureNotes 分布:', JSON.stringify(stats.natureNoteRates));
console.log('神煞分布:', JSON.stringify(stats.shenShaRates));
console.log('真假神:', JSON.stringify(stats.zhenJia));
console.log('特殊格局:', JSON.stringify(stats.specialPatterns));
console.log('日主强弱:', JSON.stringify(stats.strengthDist));
if (stats.pillarsMismatched.length) {
  console.log('\n─ 四柱不符 ─');
  stats.pillarsMismatched.forEach(function(m){console.log(' ', m.name, '→', m.pillars, m.pillars_match);});
}

console.log(JSON.stringify(stats.pillarsMismatched, null, 2));
