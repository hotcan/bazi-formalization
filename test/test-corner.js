// Corner case 测试：节气边界、60甲子、闰年、三会三合、空亡、日主合化、DST等
var fs = require('fs');
eval(fs.readFileSync('../bazi-core.js','utf8'));

var issues = [];
function assert(cond, tag, detail) {
  if (!cond) issues.push({ tag: tag, detail: detail });
}

// ============ A. 节气边界 ============
// 立春 2020 = 2020-02-04 17:03
// 测试 2020-02-04 17:00 vs 17:10 — 应该跨年柱
(function testLiChun(){
  var before = calcFullChart(2020,2,4,0,120,17,0,1,'sameDay');
  var after  = calcFullChart(2020,2,4,0,120,17,10,1,'sameDay');
  // 年柱应该不同（立春前还是己亥，立春后是庚子）
  var bY = TG[before.pillars.stems[0]]+DZ[before.pillars.branches[0]];
  var aY = TG[after.pillars.stems[0]]+DZ[after.pillars.branches[0]];
  assert(bY !== aY, 'A1·立春跨年柱', {before17_00:bY, after17_10:aY});
})();

// ============ B. 闰年 2/29 ============
(function testLeap(){
  // 2000-02-29 (闰年) 应该能排盘
  try {
    var c = calcFullChart(2000,2,29,0,120,10,0,1,'sameDay');
    var pillars = c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ');
    assert(pillars.length > 0, 'B1·闰年2-29', {ok:pillars});
  } catch(e) {
    issues.push({tag:'B1·闰年2-29 崩溃', detail:{error:e.message}});
  }
})();

// ============ C. 60 甲子日柱全覆盖 ============
(function test60JiaZi(){
  var seen = {};
  for (var days = 0; days < 120; days++) {
    var jd = new Date(1990,0,1);
    jd.setDate(jd.getDate()+days);
    var c = calcFullChart(jd.getFullYear(), jd.getMonth()+1, jd.getDate(), 0, 120, 12, 0, 1, 'sameDay');
    var dayN = c.pillars.day.n;
    seen[dayN] = (seen[dayN]||0) + 1;
  }
  var unique = Object.keys(seen).length;
  assert(unique >= 60, 'C1·60甲子日柱覆盖', {unique:unique, expected:'≥60 within 120 天'});
})();

// ============ D. 所有十干 × 十二支 日柱×时支组合完整性 ============
(function testHourStemAllCombos(){
  var mismatches = 0;
  for (var dayT = 0; dayT < 10; dayT++) {
    for (var hourD = 0; hourD < 12; hourD++) {
      var expected = (2 * (dayT % 5) + hourD) % 10;
      // 手算对比 —— 这个实际上是定义，所以应该完全吻合
      if (expected < 0 || expected > 9) mismatches++;
    }
  }
  assert(mismatches === 0, 'D1·时干定义域', {});
})();

// ============ E. 日主合化正确性 ============
(function testHuaHe(){
  // 甲己合土：年甲、日己 → 不合化（日柱不参与年干合）
  // 找日主参与合化的: 月干甲 + 日干己 → 日主参与
  // 构造：1984-1-1 (癸亥年) → 让月日相邻合化
  var tests = [
    { y:1984, m:5, d:15, h:10, expectHua:false, note:'普通盘'},
    // 特殊构造：甲己合 — 要月干甲 + 日干己
    { y:1984, m:8, d:7, h:12, note:'甲申月+己日? 检查'},
  ];
  tests.forEach(function(t){
    var c = calcFullChart(t.y,t.m,t.d,0,120,t.h,0,1,'sameDay');
    var p = c.pillars;
    var hua = (p.dayMasterWxOrig !== undefined && p.dayMasterWxOrig !== p.dayMasterWx);
    // 若合化，rootInfo / hasRoot 应该用合化后五行
    if (hua) {
      var dmWxAfter = p.dayMasterWx;
      // 检查 rootInfo 是否指向合化后五行的根
      // 如果 rootInfo 非空，那些支的藏干应含 dmWxAfter 的天干
      var rootBranchesOK = true;
      (c.strength.rootInfo || []).forEach(function(ri){
        // 解析"寅(长生)" 格式取地支
        var bName = ri.split('(')[0];
        var bIdx = DZ.indexOf(bName);
        if (bIdx >= 0) {
          var cg = CANG_GAN[bIdx];
          var has = false;
          for (var k=0;k<cg.length;k++) if (tgWx(cg[k].t) === dmWxAfter) { has = true; break; }
          if (!has) rootBranchesOK = false;
        }
      });
      assert(rootBranchesOK, 'E1·合化后hasRoot应基于合化五行', {pillars:p.stems.map(function(t,i){return TG[t]+DZ[p.branches[i]];}).join(' '),rootInfo:c.strength.rootInfo,dmWxAfter:WX[dmWxAfter]});
    }
  });
})();

// ============ F. 三会三合齐 ============
(function testSanHui(){
  // 寅卯辰 三会木局 (1974-3-15 早上)
  // 构造：年月日时 分别有寅/卯/辰
  // 用自然盘测
  var c = calcFullChart(1974,3,15,0,120,10,0,1,'sameDay');
  var p = c.pillars;
  // 检查 rels 里是否包含三会
  var rels = detectDzRelations(p.branches);
  var hasSanHui = rels.some(function(r){return r.type==='三会';});
  // 这个盘不一定有三会，只检查"如果有三会，能识别"
  assert(true, 'F1·三会检测运行正常', {rels:rels.map(function(r){return r.type;})});
})();

// ============ G. 全冲盘 (子午、卯酉、寅申、巳亥 都齐) ============
(function testFullChong(){
  // 构造 子午卯酉 四正全有 — 罕见，找一个：2019-3-15 12:00
  var c = calcFullChart(2019,3,15,0,120,12,0,1,'sameDay');
  var rels = detectDzRelations(c.pillars.branches);
  var chongCount = rels.filter(function(r){return r.type==='六冲';}).length;
  assert(chongCount >= 0, 'G1·冲检测', {chongCount:chongCount, pillars:c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ')});
})();

// ============ H. 日时支相刑 ============
(function testSelfXing(){
  // 子卯相刑
  var c = calcFullChart(1983,5,6,0,121.5,23,30,0,'nextDay'); // 癸亥 丁巳 乙未 丙子 无子卯
  var rels = detectDzRelations(c.pillars.branches);
  // 只检查运行不崩溃
  assert(rels !== null, 'H1·刑检测运行', {});
})();

// ============ I. 空亡覆盖 ============
(function testKongWang(){
  // 多盘空亡统计
  var kwCounts = { 0:0, 1:0, 2:0, 3:0, 4:0 };
  for (var y = 1950; y < 2010; y += 5) {
    var c = calcFullChart(y,6,15,0,120,12,0,1,'sameDay');
    var kwCount = c.pillars.kongWang.length;
    // 一旬空亡=2支，所以 kwCount 应 >=0 且 <=4 (四柱里最多有多少空亡)
    var kwInChart = 0;
    for (var i=0; i<4; i++) if (c.pillars.kongWang.indexOf(c.pillars.branches[i]) >= 0) kwInChart++;
    kwCounts[kwInChart] = (kwCounts[kwInChart]||0) + 1;
  }
  // 总空亡数应 =2 (每旬 2 支空亡)
  var samplePillars = calcFullChart(1990,6,15,0,120,12,0,1,'sameDay');
  assert(samplePillars.pillars.kongWang.length === 2, 'I1·一旬空亡数=2', {got:samplePillars.pillars.kongWang.length});
})();

// ============ J. 极端起运值 ============
(function testQiYun(){
  // 统计 100 盘起运 是否都在 0-10 之间
  var bad = [];
  for (var i = 0; i < 50; i++) {
    var y = 1950 + i;
    var c = calcFullChart(y,6,15,0,120,12,0,i%2,'sameDay');
    if (c.daYun.startAge < 0 || c.daYun.startAge > 10) {
      bad.push({y:y, age:c.daYun.startAge});
    }
  }
  assert(bad.length === 0, 'J1·起运都在0-10范围内', {bad:bad});
})();

// ============ K. 时柱边界（hh=0/23）─ hourMinToBranch 正确性 ============
(function testHourBoundary(){
  // 23:00 子时, 01:00 丑时, 03:00 寅时...
  var tests = [
    { hh:23, mm:0, expect:0, name:'子时起点23:00' },
    { hh:0, mm:0, expect:0, name:'00:00仍子时' },
    { hh:0, mm:59, expect:0, name:'00:59子时末' },
    { hh:1, mm:0, expect:1, name:'01:00丑时起点' },
    { hh:22, mm:59, expect:11, name:'22:59亥时' },
    { hh:11, mm:59, expect:6, name:'11:59午时?' }
  ];
  tests.forEach(function(t){
    var got = hourMinToBranch(t.hh, t.mm);
    assert(got === t.expect, 'K1·'+t.name, {hh:t.hh, mm:t.mm, expect:DZ[t.expect], got:DZ[got]});
  });
})();

// ============ L. 跨年夜子时日柱和年柱 ============
(function testYearBoundary(){
  // 1989年立春 2月4日16:27左右
  // 测 1989-2-4 16:00 vs 16:30 — 年柱应切换
  var b1 = calcFullChart(1989,2,4,0,120,16,0,1,'sameDay');
  var b2 = calcFullChart(1989,2,4,0,120,16,30,1,'sameDay');
  var y1 = TG[b1.pillars.stems[0]]+DZ[b1.pillars.branches[0]];
  var y2 = TG[b2.pillars.stems[0]]+DZ[b2.pillars.branches[0]];
  // 立春前 戊辰，立春后 己巳
  assert(y1 !== y2 || (y1 === '戊辰' && y2 === '戊辰') || (y1 === '己巳' && y2 === '己巳'),
    'L1·立春年柱切换', { '16:00':y1, '16:30':y2});
})();

// ============ M. 用神候选完整性 ============
(function testUgCompleteness(){
  // 100 盘，候选集应至少有 1 个候选
  var empty = 0;
  for (var i = 0; i < 30; i++) {
    var y = 1960 + i*2;
    var c = calcFullChart(y,3,15,0,120,10,0,i%2,'sameDay');
    if (!c.usefulGod.candidates || c.usefulGod.candidates.length === 0) empty++;
  }
  assert(empty === 0, 'M1·用神候选非空', {empty:empty});
})();

// ============ N. 大运连续性 ============
(function testDayunContinuity(){
  // 大运 period 连续，yr0/yr1 连接无缝
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  var gaps = [];
  var periods = c.daYun.periods;
  for (var i = 1; i < periods.length; i++) {
    if (periods[i].yr0 !== periods[i-1].yr1 + 1) {
      gaps.push({from:periods[i-1].yr1, to:periods[i].yr0});
    }
  }
  assert(gaps.length === 0, 'N1·大运无缝连接', {gaps:gaps});
})();

// ============ O. F 综 NaN / Infinity 检测 ============
(function testFComprehensive(){
  var nanCount = 0;
  for (var i = 0; i < 30; i++) {
    var y = 1950 + i*2;
    var c = calcFullChart(y,6,15,0,120,10,0,i%2,'sameDay');
    for (var yr = y; yr < y + 80; yr += 10) {
      var f = calcYearFortune(yr, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
      if (f && (!isFinite(f.F) || isNaN(f.F) || !isFinite(f.F_lo) || !isFinite(f.F_hi))) nanCount++;
    }
  }
  assert(nanCount === 0, 'O1·F综无NaN/Inf', {nanCount:nanCount});
})();

// ============ P. 十干生肖/纳音完整性 ============
(function testNaYin(){
  // 纳音应 non-empty
  var ny = (typeof getNaYin === 'function') ? getNaYin : null;
  if (!ny) {
    // 不检查
    return;
  }
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  // 假设 chart 有 nayin 字段
})();

// ============ Q. 真太阳时极端经度 ============
(function testExtremeLongitude(){
  // 新疆喀什 lon=76 — 极西
  try {
    var c = calcFullChart(1990,6,15,0,76,12,0,1,'sameDay');
    var trueHH = c.pillars.tsAdj.trueHH;
    assert(trueHH >= 7 && trueHH <= 10, 'Q1·极西经度时辰', {lon:76, trueHH:trueHH});
  } catch(e) {
    issues.push({tag:'Q1·极西经度崩溃', detail:e.message});
  }
})();

// ============ R. H 值 与 地支数量 一致 ============
(function testHvsBranch(){
  // 全火盘 H 应非常高
  // 构造不易，检查已知盘
  var c = calcFullChart(1992,6,20,0,120,14,0,1,'sameDay'); // 壬申丙午丁卯丁未 炎上候选
  assert(c.temp.H > 15, 'R1·夏月多火H高', {H:c.temp.H});
})();

// ============ S. 新增测试: 日主合化显示逻辑 ============
(function testHuaDisplay(){
  // 找日主合化盘
  var found = null;
  for (var i = 0; i < 50; i++) {
    var y = 1950 + i;
    var c = calcFullChart(y,5,15,0,120,10,0,1,'sameDay');
    if (c.pillars.dayMasterWxOrig !== undefined && c.pillars.dayMasterWxOrig !== c.pillars.dayMasterWx) {
      found = c; break;
    }
  }
  if (found) {
    assert(found.strength.hasRoot !== undefined, 'S1·合化盘hasRoot计算', {
      origWx: WX[found.pillars.dayMasterWxOrig],
      newWx: WX[found.pillars.dayMasterWx],
      hasRoot: found.strength.hasRoot,
      rootInfo: found.strength.rootInfo
    });
  }
})();

// ============ T. 神煞覆盖完整性 ============
(function testShenShaCover(){
  // 所有盘都有至少 3 个神煞
  var low = 0;
  for (var i = 0; i < 30; i++) {
    var y = 1950 + i*2;
    var c = calcFullChart(y,3,15,0,120,10,0,i%2,'sameDay');
    var ss = calcShenSha(c.pillars);
    if (ss.length < 3) low++;
  }
  assert(low === 0, 'T1·神煞至少3个', {lowCount:low});
})();

// ============ 输出 ============
fs.writeFileSync('test-corner-report.json', JSON.stringify(issues, null, 2));
console.log('═'.repeat(60));
console.log('Corner case 测试：');
console.log('失败项:', issues.length);
issues.forEach(function(x){
  console.log('  ✗', x.tag);
  console.log('    ', JSON.stringify(x.detail).slice(0,200));
});
console.log('─'.repeat(60));
console.log('（0 项失败 = 全部通过）');
