// Detailed audit script - outputs ALL intermediate values for document verification
var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function() { return null; } };
eval(code);

function auditCase(label, Y, M, D, hourBranch, hh, mm, lon, gender) {
  console.log('\n' + '═'.repeat(70));
  console.log(label);
  console.log('═'.repeat(70));

  var pillars = calcPillars(Y, M, D, hourBranch, lon, hh, mm);
  console.log('\n四柱:', TG[pillars.stems[0]]+DZ[pillars.branches[0]],
    TG[pillars.stems[1]]+DZ[pillars.branches[1]],
    TG[pillars.stems[2]]+DZ[pillars.branches[2]],
    TG[pillars.stems[3]]+DZ[pillars.branches[3]]);
  console.log('日主:', TG[pillars.dayMaster], '五行:', WX[pillars.dayMasterWx]);

  // Step 1: Original V
  var V = calcWxVector(pillars);
  console.log('\n── V (原始五行向量) ──');
  console.log('V =', V.map(function(v,i){return WX[i]+'='+v.toFixed(2);}));

  // Step 2: Monthly correction
  var mc = calcMonthlyCorrection(V.slice(), pillars.month.d);
  console.log('\n── V* (月令修正后) ──');
  console.log('季节五行:', WX[mc.ws], '乘数:', mc.muls.map(function(m,i){return WX[i]+'×'+m;}));
  console.log('V*=', mc.V.map(function(v,i){return WX[i]+'='+v.toFixed(2);}));

  // Step 3: 合冲刑害
  var rels = detectDzRelations(pillars.branches);
  console.log('\n── 地支关系 ──');
  rels.forEach(function(r) {
    console.log(r.type + ':', JSON.stringify(r));
  });

  var eff = applyDzEffects(mc.V, pillars.branches, rels, pillars.stems, pillars.kongWang);
  console.log('\n── 合冲刑害修正 ──');
  console.log('branchMul:', eff.branchMul);
  if (eff.modNotes) eff.modNotes.forEach(function(n){console.log('  ', n);});
  console.log('V (合冲后基础):', eff.V.map(function(v,i){return WX[i]+'='+v.toFixed(4);}));
  console.log('Vmc (最终V*\'):', eff.Vmc.map(function(v,i){return WX[i]+'='+v.toFixed(4);}));
  console.log('stemTransform:', JSON.stringify(eff.stemTransform));
  if (eff.stemTransform[2]) {
    console.log('*** 日主五行变化! 原:', WX[pillars.dayMasterWx], '→ 变:', WX[eff.stemTransform[2].targetWx]);
  }

  // Step 4: Temperature
  var temp = calcTemperature(pillars);
  console.log('\n── 调候 ──');
  console.log('H =', temp.H);

  // Step 5: Strength
  var str = calcDayMasterStrength(eff.Vmc, pillars.dayMasterWx, pillars.branches, pillars.dayMaster, temp.H);
  console.log('\n── 日主强弱 (用Vmc计算) ──');
  console.log('gamma0 =', str.gamma0.toFixed(4));
  console.log('S_tong (原始同方) =', str.S_tong.toFixed(4));
  console.log('S_tong_adj (旺衰修正后) =', str.S_tong_adj.toFixed(4));
  console.log('S_yi =', str.S_yi.toFixed(4));
  console.log('yinFactor =', str.yinFactor);
  console.log('r =', str.r.toFixed(4), '(' + str.name + ')');
  console.log('hasRoot =', str.hasRoot, str.rootInfo);

  // Break down S_tong_adj
  var w0 = pillars.dayMasterWx;
  var wYin = (w0 + 4) % 5;
  console.log('\nS_tong_adj breakdown:');
  console.log('  Vmc[w0=' + WX[w0] + '] =', eff.Vmc[w0].toFixed(4));
  console.log('  Vmc[wYin=' + WX[wYin] + '] =', eff.Vmc[wYin].toFixed(4));
  console.log('  S_tong_adj = Vmc[' + WX[w0] + '] × gamma0 + Vmc[' + WX[wYin] + '] × yinFactor');
  console.log('  = ' + eff.Vmc[w0].toFixed(4) + ' × ' + str.gamma0.toFixed(4) + ' + ' + eff.Vmc[wYin].toFixed(4) + ' × ' + str.yinFactor);
  console.log('  = ' + (eff.Vmc[w0] * str.gamma0).toFixed(4) + ' + ' + (eff.Vmc[wYin] * str.yinFactor).toFixed(4));
  console.log('  = ' + str.S_tong_adj.toFixed(4));

  console.log('\nS_yi breakdown:');
  for (var w = 0; w < 5; w++) {
    if (w !== w0 && w !== wYin) {
      console.log('  Vmc[' + WX[w] + '] =', eff.Vmc[w].toFixed(4));
    }
  }

  // Step 6: Gamma vector
  var gammaVec = calcGammaVector(pillars.branches);
  console.log('\n── 五行旺衰向量 ──');
  console.log('gammaVec =', gammaVec.map(function(v,i){return WX[i]+'='+v.toFixed(4);}));

  // Detail gamma vector calculation
  console.log('\nGamma vector detail:');
  for (var w = 0; w < 5; w++) {
    var tw = w * 2;
    var vals = [];
    for (var i = 0; i < pillars.branches.length; i++) {
      var gv = gammaVal(tw, pillars.branches[i], false);
      var stage = changShengStage(tw, pillars.branches[i]);
      vals.push(DZ[pillars.branches[i]] + ':' + STAGE_NAME[stage] + '(' + gv.toFixed(2) + ')');
    }
    console.log('  ' + WX[w] + '(' + TG[tw] + '): ' + vals.join(', ') + ' → avg=' + gammaVec[w].toFixed(4));
  }

  // Step 7: Useful God
  var ug = selectUsefulGod(pillars.dayMasterWx, str.r, eff.Vmc, mc.ws, temp.H, str.hasRoot, pillars.stems, pillars.branches);
  console.log('\n── 用神 ──');
  console.log('weights =', ug.weights.map(function(v,i){return WX[i]+'='+v.toFixed(2);}));
  if (ug.tiaohouWx >= 0) console.log('tiaohouWx =', WX[ug.tiaohouWx], 'boost =', ug.tiaohouBoost);
  if (ug.candidates) {
    try { console.log('candidates:', ug.candidates.map(function(c){return WX[c.w]+'('+(c.score||0).toFixed(2)+')';})); } catch(e) { console.log('candidates:', JSON.stringify(ug.candidates)); }
  }

  // Step 8: Da Yun
  var daYun = calcDaYun(pillars, gender, Y);
  console.log('\n── 大运 ──');
  console.log('direction:', daYun.direction, 'startAge:', daYun.startAge);
  daYun.periods.forEach(function(per) {
    var gRun = gammaVal(pillars.dayMaster, per.d, false);
    var stage = changShengStage(pillars.dayMaster, per.d);
    console.log(per.name, '(' + per.god + ')',
      per.age0 + '-' + per.age1, per.yr0 + '-' + per.yr1,
      'γ_运=' + gRun.toFixed(2), STAGE_NAME[stage]);
  });

  // Step 9: Key year F values
  console.log('\n── 关键流年 F_综 详细 ──');
  var keyYears = gender === 1 ? [1838, 1852, 1864, 1870, 1872] : [1915, 1925, 1927, 1949, 1981];
  keyYears.forEach(function(yr) {
    var result = calcYearFortune(yr, pillars, daYun, str, ug, gammaVec);
    if (result) {
      console.log(yr + ' (' + result.flowGZ + ', 大运:' + result.dayun.name + '):');
      console.log('  delta=' + result.delta.map(function(v,i){return WX[i]+'='+v.toFixed(3);}));
      console.log('  F_综=' + result.F.toFixed(3));
    }
  });

  return { pillars: pillars, V: V, eff: eff, str: str, gammaVec: gammaVec, ug: ug, daYun: daYun };
}

// 曾国藩
auditCase('曾国藩 (1811-11-26 辰时, 男)', 1811, 11, 26, 4, 8, 0, 112.5, 1);

// 宋庆龄
auditCase('宋庆龄 (1893-01-27 卯时, 女)', 1893, 1, 27, 3, 6, 0, 121.5, 0);
