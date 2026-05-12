// Load bazi-core.js in Node.js context
var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');

// Provide minimal browser stubs
var window = {};
var document = { getElementById: function() { return null; } };

eval(code);

// ═══ Helper: dump key values ═══
function dumpCase(label, Y, M, D, hourBranch, hh, mm, lon, gender) {
  console.log('\n' + '═'.repeat(60));
  console.log(label);
  console.log('═'.repeat(60));

  var chart = calcFullChart(Y, M, D, hourBranch, lon, hh, mm, gender);
  var p = chart.pillars;
  var str = chart.strength;
  var ug = chart.usefulGod;
  var dy = chart.daYun;
  var gv = chart.gammaVec;

  console.log('\n── 四柱 ──');
  console.log('年柱:', TG[p.stems[0]] + DZ[p.branches[0]]);
  console.log('月柱:', TG[p.stems[1]] + DZ[p.branches[1]]);
  console.log('日柱:', TG[p.stems[2]] + DZ[p.branches[2]], '(日主:', TG[p.dayMaster] + ')');
  console.log('时柱:', TG[p.stems[3]] + DZ[p.branches[3]]);

  console.log('\n── 五行向量 V (原始) ──');
  console.log('V =', chart.V.map(function(v){return v.toFixed(2);}));

  console.log('\n── 五行向量 V* (最终, 含月令+合冲修正) ──');
  console.log('V*=', chart.Vfinal.map(function(v){return v.toFixed(2);}));

  console.log('\n── 日主强弱 ──');
  console.log('gamma0 =', str.gamma0.toFixed(4));
  console.log('S_tong_adj =', str.S_tong_adj.toFixed(4));
  console.log('S_yi =', str.S_yi.toFixed(4));
  console.log('r =', str.r.toFixed(4), '(' + str.name + ')');
  console.log('hasRoot =', str.hasRoot, str.rootInfo);
  console.log('yinFactor =', str.yinFactor);

  console.log('\n── 五行旺衰向量 γ̄ ──');
  console.log('gammaVec =', gv.map(function(v){return v.toFixed(4);}));

  console.log('\n── 调候 ──');
  console.log('H =', chart.temp.H);

  console.log('\n── 用神 ──');
  console.log('weights =', ug.weights.map(function(v){return v.toFixed(2);}));
  if (ug.tiaohouWx >= 0) console.log('tiaohouWx =', ug.tiaohouWx, 'boost =', ug.tiaohouBoost);

  console.log('\n── 大运 ──');
  console.log('direction:', dy.direction, 'startAge:', dy.startAge);
  dy.periods.forEach(function(per) {
    // Calculate gamma for day master in this 大运 branch
    var gRun = gammaVal(p.dayMaster, per.d, false);
    var stage = changShengStage(p.dayMaster, per.d);
    console.log(per.name, '(' + per.god + ')',
      per.age0 + '-' + per.age1, per.yr0 + '-' + per.yr1,
      'γ_运=' + gRun.toFixed(2), STAGE_NAME[stage]);
  });

  console.log('\n── 大运 gamma 表 (日主在大运地支的旺衰) ──');
  dy.periods.forEach(function(per) {
    var gRun = gammaVal(p.dayMaster, per.d, false);
    var deltaG = gRun - str.gamma0;
    var signR = str.r < 0.5 ? 1 : (str.r > 0.5 ? -1 : 0);
    var muCorr = 0.8 * signR * deltaG;
    console.log(per.name + ': γ_运=' + gRun.toFixed(2) +
      ', Δγ=' + deltaG.toFixed(3) +
      ', μ·sgn·Δγ=' + muCorr.toFixed(3));
  });

  // ── F_综 for key years ──
  console.log('\n── 关键流年 F_综 ──');
  var keyYears;
  if (gender === 1) {
    // 曾国藩
    keyYears = [1838, 1852, 1864, 1870, 1872];
  } else {
    // 宋庆龄
    keyYears = [1915, 1925, 1927, 1949, 1981];
  }

  keyYears.forEach(function(yr) {
    var result = calcYearFortune(yr, p, dy, str, ug, gv);
    if (result) {
      console.log(yr + ' (' + result.flowGZ + ', 大运:' + result.dayun.name + '):',
        'F_综=' + result.F.toFixed(3),
        'delta=' + result.delta.map(function(v){return v.toFixed(2);}).join(','));
    } else {
      console.log(yr + ': 不在大运范围内');
    }
  });

  // ── F_综 for every year in each 大运 period (sampled: middle year) ──
  console.log('\n── 各大运中间年 F_综 ──');
  dy.periods.forEach(function(per) {
    var midYr = per.yr0 + 5;
    var result = calcYearFortune(midYr, p, dy, str, ug, gv);
    if (result) {
      console.log(per.name + ' mid(' + midYr + ', ' + result.flowGZ + '):',
        'F_综=' + result.F.toFixed(3));
    }
  });

  // ── Full yearly F_综 for chart data ──
  console.log('\n── 逐年 F_综 (用于图表) ──');
  var startYr = dy.periods[0].yr0;
  var endYr = dy.periods[dy.periods.length - 1].yr1;
  var yearFs = [];
  for (var yr = startYr; yr <= endYr; yr++) {
    var result = calcYearFortune(yr, p, dy, str, ug, gv);
    if (result) yearFs.push(yr + ':' + result.F.toFixed(2));
  }
  console.log(yearFs.join(' | '));

  return chart;
}

// ═══ 曾国藩: 1811年11月26日辰时, 男, 湖南湘乡 lon≈112.5 ═══
// 辰时 = 7:00-9:00, use 8:00
dumpCase('曾国藩 (1811-11-26 辰时, 男)', 1811, 11, 26, 4, 8, 0, 112.5, 1);

// ═══ 宋庆龄: 1893年1月27日卯时, 女, 上海 lon≈121.5 ═══
// 卯时 = 5:00-7:00, use 6:00
dumpCase('宋庆龄 (1893-01-27 卯时, 女)', 1893, 1, 27, 3, 6, 0, 121.5, 0);
