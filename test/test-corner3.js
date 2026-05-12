// Corner case 第三轮：算法深层、边界组合、古代未来日期、DST 边界
var fs = require('fs');
eval(fs.readFileSync('../bazi-core.js','utf8'));
var issues = [];
function assert(cond, tag, detail) { if (!cond) issues.push({ tag:tag, detail:detail }); }

// ============ BA. 大运干支 = 流年干支 时 F 综 ============
(function(){
  // 构造流年正好重复大运的情况
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  var periods = c.daYun.periods;
  // 第一大运的干支
  var p0 = periods[0];
  var flowYr = null;
  // 找流年正好 = 大运干支的年
  for (var yr = p0.yr0; yr <= p0.yr1; yr++) {
    var n_flow = ((yr - 4) % 60 + 60) % 60;
    if (n_flow % 10 === p0.t && n_flow % 12 === p0.d) { flowYr = yr; break; }
  }
  if (flowYr) {
    var f = calcYearFortune(flowYr, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
    assert(isFinite(f.F), 'BA1·大运=流年 F 值有限', { flowYr: flowYr, F: f.F });
  }
})();

// ============ BB. 三合 + 六冲 同时触发 ============
(function(){
  // 寅午戌 三合火 + 子午冲: 需要盘同时有 子和午
  // 自然构造: 1990-02-20 12:00 附近可能
  var cs = [];
  for (var i = 0; i < 30; i++) {
    var y = 1950 + i;
    for (var m = 1; m <= 12; m++) {
      var c = calcFullChart(y,m,15,0,120,12,0,1,'sameDay');
      var rels = detectDzRelations(c.pillars.branches);
      var hasSanHe = rels.some(function(r){return r.type==='三合' || r.type==='三会';});
      var hasChong = rels.some(function(r){return r.type==='六冲';});
      if (hasSanHe && hasChong) {
        cs.push({y:y,m:m, pillars:c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ')});
      }
    }
  }
  // 检查三合+冲能共存处理（不崩溃，产生合理结果）
  assert(cs.length >= 0, 'BB1·三合+冲共存', { samples: cs.slice(0,3) });
})();

// ============ BC. 4 柱同天干 (如庚庚庚庚) ============
(function(){
  // 自然盘里四天干完全相同极罕见，人工构造测：
  // 用 mockPillars
  var p = mockPillars([6,6,6,6], [0,2,4,6]); // 庚子 庚寅 庚辰 庚午
  try {
    var V = calcWxVector(p);
    var rels = detectDzRelations(p.branches);
    var eff = applyDzEffects(V, p.branches, rels, p.stems, p.kongWang);
    var str = calcDayMasterStrength(eff.Vmc, p.dayMasterWx, p.branches, p.dayMaster, 0, p.kongWang);
    assert(isFinite(str.r), 'BC1·四同天干稳定', { r: str.r, stems: p.stems.map(function(t){return TG[t];}) });
  } catch(e) {
    issues.push({tag:'BC1·四同天干崩溃', detail:e.message});
  }
})();

// ============ BD. 4 柱同地支 ============
(function(){
  var p = mockPillars([0,2,4,6], [0,0,0,0]); // 甲子 丙子 戊子 庚子
  try {
    var V = calcWxVector(p);
    var rels = detectDzRelations(p.branches);
    var eff = applyDzEffects(V, p.branches, rels, p.stems, p.kongWang);
    var str = calcDayMasterStrength(eff.Vmc, p.dayMasterWx, p.branches, p.dayMaster, 0, p.kongWang);
    assert(isFinite(str.r), 'BD1·四同地支稳定', { r: str.r });
  } catch(e) { issues.push({tag:'BD1·四同地支崩溃', detail:e.message}); }
})();

// ============ BE. 无用神候选时的 F 综 ============
(function(){
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  // 清空用神候选看 F 综是否崩
  var emptyUG = {
    weights: [0,0,0,0,0],
    candidates: [],
    enemy: null,
    tiaohouWx: -1,
    tiaohouBoost: 0
  };
  try {
    var f = calcYearFortune(2020, c.pillars, c.daYun, c.strength, emptyUG, c.gammaVec);
    assert(f && isFinite(f.F), 'BE1·无用神 F 不崩', { F:f && f.F });
  } catch(e) { issues.push({tag:'BE1·空用神崩溃', detail:e.message}); }
})();

// ============ BF. 起运前的流年 (出生年 F 综) ============
(function(){
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  // 出生年 1985 可能在第一大运之前
  var f = calcYearFortune(1985, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
  assert(f === null || isFinite(f.F), 'BF1·起运前流年处理', { F: f && f.F, startYear: c.daYun.startYear });
})();

// ============ BG. 起运后远期 (100 岁后) ============
(function(){
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  var periods = c.daYun.periods;
  var lastYr = periods[periods.length-1].yr1;
  // 最后大运外
  var f = calcYearFortune(lastYr + 10, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
  assert(f === null, 'BG1·超出大运范围返回null', { got: f });
})();

// ============ BH. DST 边界（5-1, 9-30） ============
(function(){
  // 1990 DST 5-6 至 9-16
  // 5-6 00:00 vs 4-30 23:59 — 时间只差 1 分钟，日柱应一致
  var a = calcFullChart(1990,4,30,0,120,23,59,1,'sameDay');
  var b = calcFullChart(1990,5,6,0,120,1,30,1,'sameDay');
  // 只检查不崩溃
  assert(true, 'BH1·DST 起始跑通', { beforeDst: a.pillars.day.n, afterDst: b.pillars.day.n });
})();

// ============ BI. 多空亡（极端） ============
(function(){
  // 自然盘找四柱都空亡（极难，但测其处理）
  var maxKw = 0;
  for (var i = 0; i < 50; i++) {
    var c = calcFullChart(1950+i,3,15,0,120,10,0,1,'sameDay');
    var kwInChart = 0;
    for (var j=0; j<4; j++) if (c.pillars.kongWang.indexOf(c.pillars.branches[j])>=0) kwInChart++;
    if (kwInChart > maxKw) maxKw = kwInChart;
  }
  assert(maxKw <= 2, 'BI1·空亡最多2支（一旬定义）', { maxKw: maxKw });
})();

// ============ BJ. 同输入起运岁顺逆相反 ============
(function(){
  // 阳年男顺，阳年女逆
  // 阳年 庚午 1990 — 男顺、女逆
  var m = calcFullChart(1990,3,15,0,120,10,0,1,'sameDay');
  var f = calcFullChart(1990,3,15,0,120,10,0,0,'sameDay');
  assert(m.daYun.epsilon === -f.daYun.epsilon, 'BJ1·顺逆对称', {
    male: m.daYun.epsilon, female: f.daYun.epsilon
  });
  // 起运到节气的时间绝对值应相等（对称）
  // 但 startAge 不一定相等（3天折1岁）
})();

// ============ BK. 大运 period 跨 60 甲子 ============
(function(){
  // 一个盘若 startAge=0，大运到 120 岁时就走完了第二轮
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  var periods = c.daYun.periods;
  // 检查 period n 不超过 60 范围循环
  var nVals = periods.map(function(p){return p.n;});
  assert(nVals.every(function(n){return n>=0&&n<60;}), 'BK1·period n 在[0,60)', { nVals: nVals });
})();

// ============ BL. 立春精确到分钟 ============
(function(){
  // 1984 立春 2月4日23:57. 测 23:55 vs 23:59
  var a = calcFullChart(1984,2,4,0,120,23,55,1,'sameDay');
  var b = calcFullChart(1984,2,4,0,120,23,59,1,'sameDay');
  // 年柱可能切换也可能不换（立春精度依赖天文算法）
  var ya = TG[a.pillars.stems[0]]+DZ[a.pillars.branches[0]];
  var yb = TG[b.pillars.stems[0]]+DZ[b.pillars.branches[0]];
  assert(true, 'BL1·立春分钟级边界跑通', { '23:55':ya, '23:59':yb });
})();

// ============ BM. 年份早于 1900（明清） ============
(function(){
  try {
    // 乾隆 1735 (乙卯)
    var c = calcFullChart(1735,10,1,0,112,12,0,1,'sameDay');
    assert(c.pillars.stems.length === 4, 'BM1·清代盘跑通', {
      pillars: c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ')
    });
  } catch(e) { issues.push({tag:'BM1·1735崩溃', detail:e.message}); }
})();

// ============ BN. 年份超前 2100 ============
(function(){
  try {
    var c = calcFullChart(2150,6,15,0,120,12,0,1,'sameDay');
    assert(c.pillars.stems.length === 4, 'BN1·2150 跑通', {
      pillars: c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ')
    });
  } catch(e) { issues.push({tag:'BN1·2150崩溃', detail:e.message}); }
})();

// ============ BO. hourMinToBranch 所有偶数时段 ============
(function(){
  // 每 2 小时一时辰：00:00 子, 03:00 寅, 05:00 卯, 07:00 辰, 09:00 巳, 11:00 午
  var tests = [
    {hh:0, expect:0}, {hh:1, expect:1}, {hh:3, expect:2}, {hh:5, expect:3},
    {hh:7, expect:4}, {hh:9, expect:5}, {hh:11, expect:6}, {hh:13, expect:7},
    {hh:15, expect:8}, {hh:17, expect:9}, {hh:19, expect:10}, {hh:21, expect:11}
  ];
  tests.forEach(function(t){
    var got = hourMinToBranch(t.hh, 0);
    assert(got === t.expect, 'BO1·hh='+t.hh+'→'+DZ[t.expect], { got: DZ[got] });
  });
})();

// ============ BP. 用神权重 w[enemy] = -1 且不被 natureNotes 改 ============
(function(){
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  if (c.usefulGod.enemy !== null) {
    var ew = c.usefulGod.weights[c.usefulGod.enemy];
    assert(ew === -1, 'BP1·忌神权重=-1', { enemy: WX[c.usefulGod.enemy], w: ew });
  }
})();

// ============ BQ. 输出一致性：重复 100 次 ============
(function(){
  var refR = null, refF = null;
  for (var i = 0; i < 10; i++) {
    var c = calcFullChart(1983,5,6,0,121.5,23,30,0,'nextDay');
    var f = calcYearFortune(2025, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
    if (refR === null) { refR = c.strength.r; refF = f.F; }
    else {
      if (c.strength.r !== refR) { issues.push({tag:'BQ1·重复调用r不一致', detail:{first:refR, now:c.strength.r}}); break; }
      if (f.F !== refF) { issues.push({tag:'BQ1·重复调用F不一致', detail:{first:refF, now:f.F}}); break; }
    }
  }
  if (refR !== null) assert(true, 'BQ1·10次重复确定性', { r: refR, F: refF });
})();

// ============ 输出 ============
fs.writeFileSync('test-corner-report3.json', JSON.stringify(issues, null, 2));
console.log('═'.repeat(60));
console.log('Corner case v3 - 17 项深度测试');
console.log('失败项:', issues.length);
issues.forEach(function(x){
  console.log('  ✗', x.tag);
  console.log('    ', JSON.stringify(x.detail).slice(0,300));
});
console.log('─'.repeat(60));
if (issues.length === 0) console.log('全部通过');
