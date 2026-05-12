var fs = require('fs');
var code = fs.readFileSync(__dirname + '/bazi-core.js', 'utf8');
var window = {};
var document = { getElementById: function() { return null; } };
eval(code);

var p = calcPillars(1960, 1, 15, 6, 116.4, 12, 2);
console.log('四柱:', TG[p.stems[0]]+DZ[p.branches[0]], TG[p.stems[1]]+DZ[p.branches[1]], TG[p.stems[2]]+DZ[p.branches[2]], TG[p.stems[3]]+DZ[p.branches[3]]);

var V = calcWxVector(p);
console.log('\nV原始:', V.map(function(v,i){return WX[i]+'='+v.toFixed(2);}).join(', '));

var mc = calcMonthlyCorrection(V.slice(), p.branches[1]);
var rels = detectDzRelations(p.branches);
console.log('\n地支关系:', rels.map(function(r){return r.type;}).join(', '));

var eff = applyDzEffects(mc.V, p.branches, rels, p.stems, p.kongWang);
console.log('\nbranchMul:', eff.branchMul);
console.log('stemTransform:', JSON.stringify(eff.stemTransform));
console.log('modNotes:');
eff.modNotes.forEach(function(n){console.log('  ', n);});

console.log('\neff.V (合冲后, 未含月令):', eff.V.map(function(v,i){return WX[i]+'='+v.toFixed(3);}).join(', '));
console.log('Δ (eff.V - V原始):', eff.V.map(function(v,i){return WX[i]+'='+(v-V[i]).toFixed(3);}).join(', '));

var hp = calcHiddenPillars(p);
var hc = detectHiddenCombos(p.branches, hp);
console.log('\n暗合:');
hc.notes.forEach(function(n){console.log('  ', n.desc);});
console.log('vDelta:', hc.vDelta.map(function(v,i){return WX[i]+'='+v.toFixed(2);}).join(', '));
