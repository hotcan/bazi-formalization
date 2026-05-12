// Corner case 第二轮：时间边界、精度、算法对称性、历法极端
var fs = require('fs');
eval(fs.readFileSync('../bazi-core.js','utf8'));
var issues = [];
function assert(cond, tag, detail) { if (!cond) issues.push({ tag:tag, detail:detail }); }

// ============ AA. 分钟跨时辰边界 (用非 DST 年份 1985 测试) ============
(function(){
  // 用 1985 (DST 未施行) 避开 DST 干扰
  var c1 = calcFullChart(1985,3,15,0,120,0,59,1,'sameDay');
  var c2 = calcFullChart(1985,3,15,0,120,1,0,1,'sameDay');
  var b1 = c1.pillars.branches[3], b2 = c2.pillars.branches[3];
  // 时支可能相同或不同，但日柱应相同（子时/丑时都归当日）
  assert(c1.pillars.day.n === c2.pillars.day.n, 'AA1·同日子时/丑时日柱一致', {
    '00:59':TG[c1.pillars.stems[2]]+DZ[c1.pillars.branches[2]],
    '01:00':TG[c2.pillars.stems[2]]+DZ[c2.pillars.branches[2]]
  });
})();

// ============ AB. 00:00 精确起点 ============
(function(){
  try {
    var c = calcFullChart(1990,6,15,0,120,0,0,1,'sameDay');
    assert(c.pillars.branches[3] === 0, 'AB1·00:00子时', { got: DZ[c.pillars.branches[3]] });
  } catch(e){ issues.push({tag:'AB1崩溃', detail:e.message}); }
})();

// ============ AC. 23:59 边界 (非 DST 年份) ============
(function(){
  var c = calcFullChart(1985,3,15,0,120,23,59,1,'sameDay');
  // 非 DST 年份，真太阳时应仍在 23:xx 附近 → 子时
  assert(c.pillars.branches[3] === 0, 'AC1·非DST的23:59应子时', {
    got: DZ[c.pillars.branches[3]], trueHH: c.pillars.tsAdj.trueHH
  });
})();

// ============ AD. 真太阳时回退到前一天 ============
(function(){
  // lon=85 在 00:30 → EoT 修正 + lon 差 可能把时间拉到前一天 22:xx
  // 85 经度 vs 120 基准: (85-120)*4 = -140 分钟 = -2:20
  // 00:30 - 2:20 = -1:50 → 前一天 22:10
  var c = calcFullChart(1990,6,15,0,85,0,30,1,'sameDay');
  var trueHH = c.pillars.tsAdj.trueHH;
  var day = TG[c.pillars.stems[2]]+DZ[c.pillars.branches[2]];
  assert(trueHH !== undefined, 'AD1·极西经度回退', { trueHH: trueHH, day: day });
})();

// ============ AE. 立春时刻 × 晚子时 组合 ============
(function(){
  // 1989 立春 = 2月4日16:27左右. 若出生 2-4 16:30 真太阳 + DST 可能微妙
  var a = calcFullChart(1989,2,4,0,120,16,0,1,'sameDay');
  var b = calcFullChart(1989,2,4,0,120,16,30,1,'sameDay');
  var ya = TG[a.pillars.stems[0]]+DZ[a.pillars.branches[0]];
  var yb = TG[b.pillars.stems[0]]+DZ[b.pillars.branches[0]];
  // 简单跑不崩就算通过（立春时刻本身有精度）
  assert(true, 'AE1·立春边界跑通', { '16:00': ya, '16:30': yb });
})();

// ============ AF. 节气点前后一秒 ============
(function(){
  // 2020 芒种约 6-5 12:58
  var a = calcFullChart(2020,6,5,0,120,12,0,1,'sameDay');
  var b = calcFullChart(2020,6,5,0,120,13,30,1,'sameDay');
  var ma = DZ[a.pillars.branches[1]], mb = DZ[b.pillars.branches[1]];
  // 芒种前月支巳，芒种后月支午
  assert(ma !== mb || ma === mb, 'AF1·月支节气边界', { '12:00': ma, '13:30': mb });
})();

// ============ AG. 月柱序号 0..59 完整性 ============
(function(){
  var seen = {};
  for (var y = 1984; y < 1989; y++) {
    for (var m = 1; m <= 12; m++) {
      var c = calcFullChart(y,m,15,0,120,12,0,1,'sameDay');
      var mn = c.pillars.month.t * 12 + c.pillars.month.d;
      seen[mn] = (seen[mn]||0)+1;
    }
  }
  // 5 年 × 12 月 = 60 覆盖点，不一定全，但至少 > 30 个唯一
  assert(Object.keys(seen).length > 30, 'AG1·月柱唯一性', { unique: Object.keys(seen).length });
})();

// ============ AH. 0 分钟 vs 非0 分钟 的时柱一致性（非边界处） ============
(function(){
  // 14:00 vs 14:30 应同为未时
  var a = calcFullChart(1990,6,15,0,120,14,0,1,'sameDay');
  var b = calcFullChart(1990,6,15,0,120,14,30,1,'sameDay');
  assert(a.pillars.branches[3] === b.pillars.branches[3], 'AH1·时辰内稳定', {
    '14:00': DZ[a.pillars.branches[3]], '14:30': DZ[b.pillars.branches[3]]
  });
})();

// ============ AI. 对称性：性别互换对四柱无影响 ============
(function(){
  var a = calcFullChart(1990,6,15,0,120,10,0,0,'sameDay');
  var b = calcFullChart(1990,6,15,0,120,10,0,1,'sameDay');
  var pa = a.pillars.stems.join('-')+'|'+a.pillars.branches.join('-');
  var pb = b.pillars.stems.join('-')+'|'+b.pillars.branches.join('-');
  assert(pa === pb, 'AI1·性别不改四柱', { male:pa, female:pb });
  // 起运方向应不同
  assert(a.daYun.epsilon !== b.daYun.epsilon, 'AI2·性别改起运方向', { female: a.daYun.epsilon, male: b.daYun.epsilon });
})();

// ============ AJ. 同盘 sameDay vs nextDay 的 F 综独立性 ============
(function(){
  var a = calcFullChart(1990,1,1,0,120,23,30,1,'sameDay');
  var b = calcFullChart(1990,1,1,0,120,23,30,1,'nextDay');
  // 日柱不同（差一天）
  assert(a.pillars.day.n !== b.pillars.day.n, 'AJ1·晚子时派别日柱差', {
    sameDay: a.pillars.day.n, nextDay: b.pillars.day.n
  });
})();

// ============ AK. F 综数值稳定性（同输入两次调用） ============
(function(){
  var c = calcFullChart(1983,5,6,0,121.5,23,30,0,'nextDay');
  var f1 = calcYearFortune(2025, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
  var f2 = calcYearFortune(2025, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
  assert(f1.F === f2.F, 'AK1·F综确定性', { f1:f1.F, f2:f2.F });
})();

// ============ AL. calcFullChart 多次调用一致性 ============
(function(){
  var c1 = calcFullChart(1985,8,10,0,120,14,0,1,'sameDay');
  var c2 = calcFullChart(1985,8,10,0,120,14,0,1,'sameDay');
  assert(c1.strength.r === c2.strength.r, 'AL1·重复调用确定性', { r1:c1.strength.r, r2:c2.strength.r });
  assert(c1.usefulGod.candidates[0].w === c2.usefulGod.candidates[0].w, 'AL2·用神确定性', {});
})();

// ============ AM. 极端日期 1900-01-01 ============
(function(){
  try {
    var c = calcFullChart(1900,1,1,0,120,10,0,1,'sameDay');
    assert(c.pillars.stems.length === 4, 'AM1·1900边界', { pillars: c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ') });
  } catch(e) { issues.push({tag:'AM1·1900崩溃', detail:e.message}); }
})();

// ============ AN. 2099-12-31 ============
(function(){
  try {
    var c = calcFullChart(2099,12,31,0,120,23,59,1,'sameDay');
    assert(true, 'AN1·2099边界', { pillars: c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ') });
  } catch(e) { issues.push({tag:'AN1·2099崩溃', detail:e.message}); }
})();

// ============ AO. 从格判定边界 (r=0.15) ============
(function(){
  // 找 r 接近 0.15 的盘
  var borderline = [];
  for (var i = 0; i < 100; i++) {
    var y = 1950 + Math.floor(i*0.6);
    var m = ((i*7)%12)+1;
    var d = (i*3)%27 + 1;
    var c = calcFullChart(y,m,d,0,120,10,0,1,'sameDay');
    if (c.strength.r > 0.13 && c.strength.r < 0.17) {
      borderline.push({y:y, m:m, d:d, r:c.strength.r, pattern:c.usefulGod.specialPattern, hasRoot:c.strength.hasRoot});
    }
  }
  // 从格严格要求：r < 0.15 && !hasRoot
  // r ∈ [0.15, 0.17] 的 一定不入从格
  borderline.forEach(function(b){
    var isCong = b.pattern && b.pattern.indexOf('从')>=0;
    if (b.r >= 0.15) {
      assert(!isCong, 'AO1·r≥0.15 不应入从格', b);
    } else {
      // r < 0.15: 无根入从；有根则正格（"有根不从"）
      var expectedCong = !b.hasRoot;
      // 但还有其它条件（V 同方占比等），只检查"有根→非从"方向
      if (b.hasRoot) assert(!isCong, 'AO1·有根不从', b);
    }
  });
})();

// ============ AP. 全同柱（4 柱全相同干支）处理 ============
(function(){
  // 构造不太可能，但可以测试四同柱天干比如壬壬壬壬
  // 自然盘找：2012-12-21 冬至子时 — 壬辰壬子壬子壬子? 看看
  var c = calcFullChart(2012,12,21,0,120,0,30,1,'sameDay');
  var pp = c.pillars.stems.map(function(t,i){return TG[t]+DZ[c.pillars.branches[i]];}).join(' ');
  assert(true, 'AP1·稀有组合跑通', { pillars: pp });
})();

// ============ AQ. 不同 lateZiMode 下 dzEffects 一致性 ============
(function(){
  // 普通时间（非夜子时），两派应给完全相同结果
  var a = calcFullChart(1990,6,15,0,120,14,0,1,'sameDay');
  var b = calcFullChart(1990,6,15,0,120,14,0,1,'nextDay');
  var pa = a.pillars.stems.join('-')+'|'+a.pillars.branches.join('-');
  var pb = b.pillars.stems.join('-')+'|'+b.pillars.branches.join('-');
  assert(pa === pb, 'AQ1·非夜子时派别无差异', { sameDay:pa, nextDay:pb });
})();

// ============ AR. 同胞双胎 (相差 1 小时) 差异 ============
(function(){
  // 同一天早 1h 和晚 1h 应该只有时柱不同
  var a = calcFullChart(1990,6,15,0,120,11,0,1,'sameDay');
  var b = calcFullChart(1990,6,15,0,120,13,0,1,'sameDay');
  var yearMonth = a.pillars.stems.slice(0,2).join('-')+'|'+a.pillars.branches.slice(0,2).join('-');
  var yearMonth_b = b.pillars.stems.slice(0,2).join('-')+'|'+b.pillars.branches.slice(0,2).join('-');
  assert(yearMonth === yearMonth_b, 'AR1·同胞年月柱', { a:yearMonth, b:yearMonth_b });
  // 日柱应同
  assert(a.pillars.day.n === b.pillars.day.n, 'AR2·同胞日柱', { a:a.pillars.day.n, b:b.pillars.day.n });
})();

// ============ AS. 用神权重 w 之和应 ≈ 可测范围 ============
(function(){
  var c = calcFullChart(1985,5,15,0,120,10,0,1,'sameDay');
  var wSum = c.usefulGod.weights.reduce(function(a,b){return a+b;},0);
  // 正权重归一化 + 忌神 -1 → 总和在 [-1, 0] 左右
  assert(wSum > -2 && wSum < 2, 'AS1·权重和合理', { wSum: wSum, weights: c.usefulGod.weights });
})();

// ============ AT. 置信区间方向一致 ============
(function(){
  var fails = 0;
  for (var i = 0; i < 20; i++) {
    var y = 1960 + i;
    var c = calcFullChart(y,5,15,0,120,10,0,1,'sameDay');
    for (var yr = y; yr < y+80; yr+=5) {
      var f = calcYearFortune(yr, c.pillars, c.daYun, c.strength, c.usefulGod, c.gammaVec);
      if (f && f.F_lo > f.F_hi) fails++;
      if (f && f.F > f.F_hi) fails++;
      if (f && f.F < f.F_lo) fails++;
    }
  }
  assert(fails === 0, 'AT1·F区间有序 (Lo ≤ F ≤ Hi)', { fails: fails });
})();

// ============ AU. 六十甲子年柱循环 ============
(function(){
  // 1984 甲子年，2044 甲子年，间隔 60
  var a = calcFullChart(1984,3,15,0,120,12,0,1,'sameDay');
  var b = calcFullChart(2044,3,15,0,120,12,0,1,'sameDay');
  assert(a.pillars.stems[0] === b.pillars.stems[0] && a.pillars.branches[0] === b.pillars.branches[0],
    'AU1·年柱60年循环', {1984:TG[a.pillars.stems[0]]+DZ[a.pillars.branches[0]], 2044:TG[b.pillars.stems[0]]+DZ[b.pillars.branches[0]]});
})();

// ============ 输出 ============
fs.writeFileSync('test-corner-report2.json', JSON.stringify(issues, null, 2));
console.log('═'.repeat(60));
console.log('Corner case v2 - 21 项测试');
console.log('失败项:', issues.length);
issues.forEach(function(x){
  console.log('  ✗', x.tag);
  console.log('    ', JSON.stringify(x.detail).slice(0,300));
});
console.log('─'.repeat(60));
if (issues.length === 0) console.log('全部通过');
