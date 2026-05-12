// 测试套件 v4 - 100 盘大样本 + 新维度检查
var fs = require('fs');
var code = fs.readFileSync('../bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function(){ return null; }, addEventListener: function(){} };
eval(code);

var seed = 2026;
Math.random = function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

var CASES = [];
for (var i = 0; i < 100; i++) {
  var y = 1950 + Math.floor(Math.random() * 60);
  var m = 1 + Math.floor(Math.random() * 12);
  var d = 1 + Math.floor(Math.random() * 27);
  var h = Math.floor(Math.random() * 24);
  var g = Math.floor(Math.random() * 2);
  var lateZi = Math.random() < 0.5 ? 'sameDay' : 'nextDay';
  CASES.push({ idx:i, y:y, m:m, d:d, h:h, mm:0, lon:120, gender:g, mode:lateZi });
}

var issues = {
  r_extreme: [],       // r* 落在 0 或 1 附近
  pattern_missing: [], // 应触发特殊格局但没有
  useGod_conflict: [], // 多法分歧但没有标注
  hua_not_marked: [],  // 日主合化但未正确标记
  temp_extreme: [],    // H 超过 30 或低于 -30
  neutral_fake: [],    // 调候相关的假神矛盾
  kw_month_no_boost: [],// 月支空亡但权重仍然满
  advise_empty: []     // usefulGod 无候选
};

var distrib = {
  r_star: { '<0.15':0, '0.15-0.35':0, '0.35-0.55':0, '0.55-0.75':0, '0.75-0.85':0, '>0.85':0 },
  patterns: {},
  strength: {},
  hua_count: 0,
  lateZi_advance_count: 0,
  r_star_special_pattern: { '从':0, '专旺':0, '相战':0, '泄秀':0 }
};

var results = [];
CASES.forEach(function(c) {
  var chart;
  try { chart = calcFullChart(c.y, c.m, c.d, 0, c.lon, c.h, c.mm, c.gender, c.mode); }
  catch(e){ issues.advise_empty.push('ERR: '+c.idx+' '+e.message); return; }

  var p = chart.pillars, str = chart.strength, ug = chart.usefulGod, temp = chart.temp;
  var r = str.r;

  // r* 分布
  if (r < 0.15) distrib.r_star['<0.15']++;
  else if (r < 0.35) distrib.r_star['0.15-0.35']++;
  else if (r < 0.55) distrib.r_star['0.35-0.55']++;
  else if (r < 0.75) distrib.r_star['0.55-0.75']++;
  else if (r < 0.85) distrib.r_star['0.75-0.85']++;
  else distrib.r_star['>0.85']++;

  distrib.strength[str.name] = (distrib.strength[str.name]||0) + 1;
  distrib.patterns[ug.specialPattern || '正格'] = (distrib.patterns[ug.specialPattern||'正格']||0) + 1;
  if (p.dayMasterWxOrig !== undefined && p.dayMasterWxOrig !== p.dayMasterWx) distrib.hua_count++;
  if (p.tsAdj && p.tsAdj.advanceDay) distrib.lateZi_advance_count++;

  // 异常检测
  if (r < 0.05 || r > 0.95) issues.r_extreme.push({ idx:c.idx, r:r, pattern:ug.specialPattern||'正格', pillars: p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ') });

  // 极弱 / 极强 但格局是"正格" — 这是潜在 bug
  if ((r < 0.08 && ug.specialPattern !== '从格' && ug.specialPattern !== '从财格' && ug.specialPattern !== '从杀格' && ug.specialPattern !== '从儿格' && ug.specialPattern !== '从势格')) {
    issues.pattern_missing.push({ idx:c.idx, r:r, reason:'r<0.08 但非从格', pattern:ug.specialPattern, pillars:p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' '), hasRoot:str.hasRoot });
  }
  if (r > 0.92 && ug.specialPattern === null) {
    issues.pattern_missing.push({ idx:c.idx, r:r, reason:'r>0.92 但非专旺', pattern:null, pillars:p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ') });
  }

  // H 极端值
  if (Math.abs(temp.H) > 30) issues.temp_extreme.push({ idx:c.idx, H:temp.H, level:temp.level, pillars:p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ') });

  // 月支空亡但未经 kwNotes
  if (p.kongWang && p.kongWang.indexOf(p.branches[1]) >= 0 && !(temp.kwNotes && temp.kwNotes.length > 0)) {
    issues.kw_month_no_boost.push({ idx:c.idx, monthBranch:DZ[p.branches[1]], kwNotes:temp.kwNotes });
  }

  // 用神无候选
  if (!ug.candidates || ug.candidates.length === 0) issues.advise_empty.push({ idx:c.idx, pillars:p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' ') });

  // 日主合化但 zhenJia 结论没体现
  if (p.dayMasterWxOrig !== undefined && p.dayMasterWxOrig !== p.dayMasterWx) {
    if (!ug.zhenJiaSummary || !ug.zhenJiaSummary.verdict) {
      issues.hua_not_marked.push({ idx:c.idx, orig:WX[p.dayMasterWxOrig], now:WX[p.dayMasterWx] });
    }
  }

  // 特殊格局 + r* 关系
  if (ug.specialPattern) {
    if (ug.specialPattern.indexOf('从') >= 0) distrib.r_star_special_pattern['从']++;
    else if (ug.specialPattern.indexOf('专旺')>=0 || /[曲直炎上稼穑从革润下]格/.test(ug.specialPattern)) distrib.r_star_special_pattern['专旺']++;
    else if (ug.specialPattern.indexOf('相战')>=0) distrib.r_star_special_pattern['相战']++;
    else if (ug.specialPattern.indexOf('泄秀')>=0 || /[水木清华木火通明土金毓秀金水相涵火土夹杂]/.test(ug.specialPattern)) distrib.r_star_special_pattern['泄秀']++;
  }

  results.push({ idx:c.idx, r:r.toFixed(3), strength:str.name, pattern:ug.specialPattern||null });
});

fs.writeFileSync('test-report3.json', JSON.stringify({ distrib:distrib, issues:issues, results:results }, null, 2));

console.log('═'.repeat(60));
console.log('100 盘大样本分布：');
console.log('  r* 分布:', JSON.stringify(distrib.r_star));
console.log('  身强弱:', JSON.stringify(distrib.strength));
console.log('  格局:', JSON.stringify(distrib.patterns));
console.log('  日主合化占比:', distrib.hua_count+'/100');
console.log('  子初换日占比:', distrib.lateZi_advance_count+'/100');
console.log('  特殊格局类型:', JSON.stringify(distrib.r_star_special_pattern));
console.log('');
console.log('─ 异常检测 ─');
console.log('  r* 极端 (<0.05 / >0.95):', issues.r_extreme.length);
if (issues.r_extreme.length) issues.r_extreme.slice(0,5).forEach(function(x){ console.log('    ', x); });
console.log('  格局缺失 (r 极端但未成特殊格局):', issues.pattern_missing.length);
if (issues.pattern_missing.length) issues.pattern_missing.slice(0,5).forEach(function(x){ console.log('    ', JSON.stringify(x)); });
console.log('  H 极端 (|H|>30):', issues.temp_extreme.length);
if (issues.temp_extreme.length) issues.temp_extreme.slice(0,3).forEach(function(x){ console.log('    ', JSON.stringify(x)); });
console.log('  月支空亡但 kwNotes 空:', issues.kw_month_no_boost.length);
if (issues.kw_month_no_boost.length) issues.kw_month_no_boost.slice(0,3).forEach(function(x){ console.log('    ', JSON.stringify(x)); });
console.log('  用神无候选:', issues.advise_empty.length);
console.log('  日主合化但 zhenJia 未标:', issues.hua_not_marked.length);
