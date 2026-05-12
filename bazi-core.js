/* ═══════════════════════════════════════════════════════════════
   八字命理计算引擎 — 共享核心模块 (bazi-core.js)
   从 index.html 抽取的纯计算代码 + 数据常量
   ═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════
// §0 PROVINCE / CITY DATA & INPUT HELPERS
// ══════════════════════════════════════
var PROVINCE_CITY = {
  "北京": [["北京", 116.4]],
  "天津": [["天津", 117.2]],
  "上海": [["上海", 121.5]],
  "重庆": [["重庆", 106.5]],
  "河北": [["石家庄", 114.5], ["唐山", 118.2], ["秦皇岛", 119.6], ["邯郸", 114.5], ["邢台", 114.5], ["保定", 115.5], ["张家口", 114.9], ["承德", 117.9], ["沧州", 116.9], ["廊坊", 116.7], ["衡水", 115.7]],
  "山西": [["太原", 112.5], ["大同", 113.3], ["阳泉", 113.6], ["长治", 113.1], ["晋城", 112.8], ["朔州", 112.4], ["忻州", 112.7], ["吕梁", 111.1], ["晋中", 112.7], ["临汾", 111.5], ["运城", 111.0]],
  "辽宁": [["沈阳", 123.4], ["大连", 121.6], ["鞍山", 123.0], ["抚顺", 123.9], ["本溪", 123.8], ["丹东", 124.4], ["锦州", 121.1], ["营口", 122.2], ["阜新", 121.7], ["辽阳", 123.2], ["盘锦", 122.1], ["铁岭", 123.8], ["朝阳", 120.5], ["葫芦岛", 120.8]],
  "吉林": [["长春", 125.3], ["吉林", 126.5], ["四平", 124.4], ["辽源", 125.1], ["通化", 125.9], ["白山", 126.4], ["松原", 124.8], ["白城", 122.8], ["延边", 129.5]],
  "黑龙江": [["哈尔滨", 126.6], ["齐齐哈尔", 124.0], ["鸡西", 130.9], ["鹤岗", 130.3], ["双鸭山", 131.2], ["大庆", 125.0], ["伊春", 128.9], ["佳木斯", 130.4], ["牡丹江", 129.6], ["黑河", 127.5], ["绥化", 127.0], ["大兴安岭", 124.1]],
  "江苏": [["南京", 118.8], ["无锡", 120.3], ["徐州", 117.2], ["常州", 119.9], ["苏州", 120.6], ["南通", 120.9], ["连云港", 119.2], ["淮安", 119.0], ["盐城", 120.1], ["扬州", 119.4], ["镇江", 119.4], ["泰州", 119.9], ["宿迁", 118.3]],
  "浙江": [["杭州", 120.2], ["宁波", 121.5], ["温州", 120.7], ["嘉兴", 120.8], ["湖州", 120.1], ["绍兴", 120.6], ["金华", 119.6], ["衢州", 118.9], ["舟山", 122.1], ["台州", 121.4], ["丽水", 119.9]],
  "安徽": [["合肥", 117.3], ["芜湖", 118.4], ["蚌埠", 117.4], ["淮南", 117.0], ["马鞍山", 118.5], ["淮北", 116.8], ["铜陵", 117.8], ["安庆", 117.0], ["黄山", 118.3], ["滁州", 118.3], ["阜阳", 115.8], ["宿州", 116.9], ["六安", 116.5], ["亳州", 115.8], ["池州", 117.5], ["宣城", 118.8]],
  "福建": [["福州", 119.3], ["厦门", 118.1], ["莆田", 119.0], ["三明", 117.6], ["泉州", 118.6], ["漳州", 117.6], ["南平", 118.2], ["龙岩", 117.0], ["宁德", 119.5]],
  "江西": [["南昌", 115.9], ["景德镇", 117.2], ["萍乡", 113.9], ["九江", 116.0], ["新余", 114.9], ["鹰潭", 117.1], ["赣州", 114.9], ["吉安", 115.0], ["宜春", 114.4], ["抚州", 116.4], ["上饶", 117.9]],
  "山东": [["济南", 117.0], ["青岛", 120.4], ["淄博", 118.1], ["枣庄", 117.3], ["东营", 118.7], ["烟台", 121.4], ["潍坊", 119.1], ["济宁", 116.6], ["泰安", 117.1], ["威海", 122.1], ["日照", 119.5], ["临沂", 118.3], ["德州", 116.4], ["聊城", 116.0], ["滨州", 118.0], ["菏泽", 115.5]],
  "河南": [["郑州", 113.6], ["开封", 114.3], ["洛阳", 112.4], ["平顶山", 113.2], ["安阳", 114.4], ["鹤壁", 114.3], ["新乡", 113.9], ["焦作", 113.2], ["濮阳", 115.0], ["许昌", 113.9], ["漯河", 114.0], ["三门峡", 111.2], ["南阳", 112.5], ["商丘", 115.6], ["信阳", 114.1], ["周口", 114.6], ["驻马店", 114.0]],
  "湖北": [["武汉", 114.3], ["黄石", 115.1], ["十堰", 110.8], ["宜昌", 111.3], ["襄阳", 112.1], ["鄂州", 114.9], ["荆门", 112.2], ["孝感", 113.9], ["荆州", 112.2], ["黄冈", 114.9], ["咸宁", 114.3], ["随州", 113.4], ["恩施", 109.5]],
  "湖南": [["长沙", 113.0], ["株洲", 113.1], ["湘潭", 112.9], ["衡阳", 112.6], ["邵阳", 111.5], ["岳阳", 113.1], ["常德", 111.7], ["张家界", 110.5], ["益阳", 112.4], ["郴州", 113.0], ["永州", 111.6], ["怀化", 110.0], ["娄底", 112.0], ["湘西", 109.7]],
  "广东": [["广州", 113.3], ["韶关", 113.6], ["深圳", 114.1], ["珠海", 113.6], ["汕头", 116.7], ["佛山", 113.1], ["江门", 113.1], ["湛江", 110.4], ["茂名", 110.9], ["肇庆", 112.5], ["惠州", 114.4], ["梅州", 116.1], ["汕尾", 115.4], ["河源", 114.7], ["阳江", 111.9], ["清远", 113.1], ["东莞", 113.7], ["中山", 113.4], ["潮州", 116.6], ["揭阳", 116.4], ["云浮", 112.0]],
  "广西": [["南宁", 108.3], ["柳州", 109.4], ["桂林", 110.3], ["梧州", 111.3], ["北海", 109.1], ["防城港", 108.3], ["钦州", 108.6], ["贵港", 109.6], ["玉林", 110.2], ["百色", 106.6], ["贺州", 111.6], ["河池", 108.1], ["来宾", 109.2], ["崇左", 107.4]],
  "海南": [["海口", 110.3], ["三亚", 109.5], ["三沙", 112.3], ["儋州", 109.6]],
  "四川": [["成都", 104.1], ["自贡", 104.8], ["攀枝花", 101.7], ["泸州", 105.4], ["德阳", 104.4], ["绵阳", 104.7], ["广元", 105.8], ["遂宁", 105.6], ["内江", 105.1], ["乐山", 103.8], ["南充", 106.1], ["眉山", 103.8], ["宜宾", 104.6], ["广安", 106.6], ["达州", 107.5], ["雅安", 103.0], ["巴中", 106.8], ["资阳", 104.6], ["阿坝", 102.2], ["甘孜", 101.9], ["凉山", 102.3]],
  "贵州": [["贵阳", 106.7], ["六盘水", 104.8], ["遵义", 106.9], ["安顺", 105.9], ["毕节", 105.3], ["铜仁", 109.2], ["黔西南", 104.9], ["黔东南", 107.9], ["黔南", 107.5]],
  "云南": [["昆明", 102.7], ["曲靖", 103.8], ["玉溪", 102.5], ["保山", 99.2], ["昭通", 103.7], ["丽江", 100.2], ["普洱", 101.0], ["临沧", 100.1], ["楚雄", 101.5], ["红河", 103.4], ["文山", 104.2], ["西双版纳", 100.8], ["大理", 100.2], ["德宏", 98.6], ["怒江", 98.9], ["迪庆", 99.7]],
  "西藏": [["拉萨", 91.1], ["日喀则", 88.9], ["昌都", 97.2], ["林芝", 94.4], ["山南", 91.8], ["那曲", 92.1], ["阿里", 80.1]],
  "陕西": [["西安", 108.9], ["铜川", 109.1], ["宝鸡", 107.1], ["咸阳", 108.7], ["渭南", 109.5], ["延安", 109.5], ["汉中", 107.0], ["榆林", 109.7], ["安康", 109.0], ["商洛", 109.9]],
  "甘肃": [["兰州", 103.8], ["嘉峪关", 98.3], ["金昌", 102.2], ["白银", 104.2], ["天水", 105.7], ["武威", 102.6], ["张掖", 100.4], ["平凉", 106.7], ["酒泉", 98.5], ["庆阳", 107.6], ["定西", 104.6], ["陇南", 104.9], ["临夏", 103.2], ["甘南", 102.9]],
  "青海": [["西宁", 101.8], ["海东", 102.1], ["海北", 100.9], ["黄南", 102.0], ["海南州", 100.6], ["果洛", 100.2], ["玉树", 97.0], ["海西", 97.4]],
  "宁夏": [["银川", 106.3], ["石嘴山", 106.4], ["吴忠", 106.2], ["固原", 106.2], ["中卫", 105.2]],
  "新疆": [["乌鲁木齐", 87.6], ["克拉玛依", 84.9], ["吐鲁番", 89.2], ["哈密", 93.5], ["昌吉", 87.3], ["博尔塔拉", 82.1], ["巴音郭楞", 86.1], ["阿克苏", 80.3], ["克孜勒苏", 76.2], ["喀什", 75.9], ["和田", 79.9], ["伊犁", 81.3], ["塔城", 82.9], ["阿勒泰", 88.1]],
  "内蒙古": [["呼和浩特", 111.7], ["包头", 110.0], ["乌海", 106.8], ["赤峰", 118.9], ["通辽", 122.3], ["鄂尔多斯", 110.0], ["呼伦贝尔", 119.8], ["巴彦淖尔", 107.4], ["乌兰察布", 113.1], ["兴安", 122.0], ["锡林郭勒", 116.1], ["阿拉善", 105.7]],
  "香港": [["香港", 114.2]],
  "澳门": [["澳门", 113.5]],
  "台湾": [["台北", 121.5], ["高雄", 120.3], ["台中", 120.7], ["台南", 120.2], ["新竹", 120.9], ["基隆", 121.7], ["嘉义", 120.4], ["花莲", 121.6], ["台东", 121.1]]
};

function hourMinToBranch(hh, mm) {
  // 23:00-00:59 → 子(0), 01:00-02:59 → 丑(1), ...
  var h = hh;
  if (h === 23) return 0;
  return Math.floor((h + 1) / 2);
}

// ══════════════════════════════════════
// §1 CONSTANTS & LOOKUP TABLES
// ══════════════════════════════════════

var TG = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var DZ = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
var WX = ['木', '火', '土', '金', '水'];
var WX_COLOR = ['#2d8a4e', '#d94f4f', '#b8922e', '#7a7a7a', '#2e6bc5'];
var SHI_SHEN = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];
var SS_SHORT = ['比', '劫', '食', '伤', '偏财', '正财', '杀', '官', '偏印', '正印'];
var STAGE_NAME = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

// 天干→五行: φ_T(i) = floor(i/2)
function tgWx(t) { return Math.floor(t / 2); }
// 天干→阴阳: 偶数=阳(1), 奇数=阴(0)
function tgYy(t) { return (t + 1) % 2; }
// 地支→阴阳
function dzYy(d) { return (d + 1) % 2; }
// 地支→五行
function dzWx(d) {
  var k = (d - 2 + 12) % 12, s = Math.floor(k / 3), p = k % 3;
  if (p === 2) return 2; // 土
  return s + Math.floor(s / 2); // ω(s)
}

// 五行生克: G(w)=(w+1)%5, K(w)=(w+2)%5
function wxSheng(w) { return (w + 1) % 5; }
function wxKe(w) { return (w + 2) % 5; }
// 反生: G^{-1}(w)=(w+4)%5
function wxFanSheng(w) { return (w + 4) % 5; }

// 藏干表: [地支] → [{t:天干编号, w:权重}, ...]
var CANG_GAN = [
  [{ t: 9, w: 1.0 }],                          // 子: 癸
  [{ t: 5, w: 0.6 }, { t: 9, w: 0.3 }, { t: 7, w: 0.1 }],  // 丑: 己癸辛
  [{ t: 0, w: 0.6 }, { t: 2, w: 0.3 }, { t: 4, w: 0.1 }],  // 寅: 甲丙戊
  [{ t: 1, w: 1.0 }],                          // 卯: 乙
  [{ t: 4, w: 0.6 }, { t: 1, w: 0.3 }, { t: 9, w: 0.1 }],  // 辰: 戊乙癸
  [{ t: 2, w: 0.6 }, { t: 6, w: 0.3 }, { t: 4, w: 0.1 }],  // 巳: 丙庚戊
  [{ t: 3, w: 0.7 }, { t: 5, w: 0.3 }],              // 午: 丁己
  [{ t: 5, w: 0.6 }, { t: 3, w: 0.3 }, { t: 1, w: 0.1 }],  // 未: 己丁乙
  [{ t: 6, w: 0.6 }, { t: 8, w: 0.3 }, { t: 4, w: 0.1 }],  // 申: 庚壬戊
  [{ t: 7, w: 1.0 }],                          // 酉: 辛
  [{ t: 4, w: 0.6 }, { t: 7, w: 0.3 }, { t: 3, w: 0.1 }],  // 戌: 戊辛丁
  [{ t: 8, w: 0.7 }, { t: 0, w: 0.3 }]               // 亥: 壬甲
];

// 位置权重 λ: [年干,月干,日干,时干, 年支,月支,日支,时支]
var POS_WT = [1.0, 1.2, 1.0, 1.0, 1.0, 1.5, 1.2, 1.0];

// 月令旺衰乘数: (w-w_s)%5 → multiplier
var WANG_SHUAI_MUL = [1.5, 1.2, 0.5, 0.7, 1.0]; // 旺相死囚休
var WANG_SHUAI_NAME = ['旺', '相', '死', '囚', '休'];

// 长生十二宫 γ 值 (定义3.15)
var GAMMA = [0.7, 0.3, 0.8, 1.0, 1.2, 0.5, 0.3, 0.1, 0.4, 0.05, 0.1, 0.2];
// Alternative conservative γ for day master (Definition 3.15)
var GAMMA_DM = [0.7, 0.3, 0.8, 1.0, 1.2, 0.5, 0.3, 0.1, 0.4, 0.05, 0.1, 0.2];

// 阳干长生位 L: indexed by stem (only Yang stems used for 五行旺衰向量)
// 甲(0):L=11(亥), 丙(2):L=2(寅), 戊(4):L=2(寅), 庚(6):L=5(巳), 壬(8):L=8(申)
var YANG_L = { 0: 11, 2: 2, 4: 2, 6: 5, 8: 8 };
// 阴干长生位 L (reverse cycle)
var YIN_L = { 1: 6, 3: 9, 5: 9, 7: 0, 9: 3 };

function changShengStage(t, d) {
  // Returns the 12-stage index (0=长生, ..., 11=养)
  var isYang = (t % 2 === 0);
  var L = isYang ? YANG_L[t] : YIN_L[t];
  if (L === undefined) {
    // For even stems not in table, follow 丙戊 pattern
    var base = t - (t % 2);
    L = isYang ? YANG_L[base] : YIN_L[base];
  }
  if (isYang) return (d - L + 12) % 12;
  else return (L - d + 12) % 12;
}

function gammaVal(t, d, conservative) {
  var stage = changShengStage(t, d);
  return conservative ? GAMMA_DM[stage] : GAMMA[stage];
}

// 寒暖计分
var ETA_T = [+3, +1, +6, +4, +5, -4, -1, -3, -5, -6]; // 甲乙丙丁戊己庚辛壬癸
var ETA_D = [-6, -4, +3, +1, -4, +5, +6, +3, -2, -3, +4, -5]; // 子丑寅卯辰巳午未申酉戌亥

// 《五行结构论》地支六气分类（温度+湿燥二维）
// 亥子=冷 / 寅卯=温 / 巳午=热 / 申酉=凉 / 辰丑=湿 / 戌未=燥
var LIU_QI = ['冷','湿','温','温','湿','热','热','燥','凉','凉','燥','冷']; // 按子丑寅...亥顺序
function getLiuQi(d) { return LIU_QI[d]; }
// η_M indexed by month branch (d_月) — 月令作为季节独裁者，权重加大 (定义5.11修正)
// ETA_M 季节主导值（寒暖基调）
// 申月传统为"凉金当令·炎威始退"，应偏凉；原值 +3 反映残余暑气但命理定性应接近 0
// 参考《穷通宝鉴》申月"庚金司令，壬水进气"—— 申月已是金水相生的凉燥节点
var ETA_M = [-8, -5, -1, +3, +6, +10, +12, +8, 0, -2, -4, -6]; // 子丑寅卯辰巳午未申酉戌亥

// 十神颜色
var SS_COLOR = ['#6c7a89', '#6c7a89', '#b8860b', '#b8860b', '#d4a017', '#d4a017', '#c0392b', '#c0392b', '#2e7d46', '#2e7d46'];

// 空亡检测 (定义1.12-1.13)
// K(t,d) = {(d-t+10)%12, (d-t+11)%12}
var KONG_WANG_EPS = 0.1; // ε_空 ≈ 0.1
function calcKongWang(t_day, d_day) {
  return [(d_day - t_day + 10 + 120) % 12, (d_day - t_day + 11 + 120) % 12];
}

// ── 纳音六十甲子 ──
var NA_YIN_NAMES = ['海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火', '涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土', '霹雳火', '松柏木', '长流水', '砂中金', '山下火', '平地木', '壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金', '桑拓木', '大溪水', '砂中土', '天上火', '石榴木', '大海水'];
var NA_YIN_WX = [3, 1, 0, 2, 3, 1, 4, 2, 3, 0, 4, 2, 1, 0, 4, 3, 1, 0, 2, 3, 1, 4, 2, 3, 0, 4, 2, 1, 0, 4]; // 五行索引
function getNaYin(t, d) {
  // 枚举60甲子找到序号，再查纳音表
  var idx60 = -1;
  for (var k = 0; k < 60; k++) { if (k % 10 === t && k % 12 === d) { idx60 = k; break; } }
  if (idx60 < 0) return { name: '?', wx: -1 };
  var pair = Math.floor(idx60 / 2);
  return { name: NA_YIN_NAMES[pair], wx: NA_YIN_WX[pair], wxName: WX[NA_YIN_WX[pair]] };
}

// ── 神煞查表 ──
// 天乙贵人: 甲戊并牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，庚辛逢马虎
var TIAN_YI = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [6, 2], [6, 2], [3, 5], [3, 5]];
// 文昌贵人 (日干→地支)
var WEN_CHANG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
// 学堂 (日干所属五行的长生位): 木亥 火寅 土申 金巳 水申
var XUE_TANG = [11, 11, 2, 2, 8, 8, 5, 5, 8, 8]; // 甲乙丙丁戊己庚辛壬癸
// 词馆 (日干的临官/禄位): 与 LU_SHEN 相同 — 但词馆特指文化才艺意涵
// 国印贵人 (日干→地支): 文治武功印信
var GUO_YIN = [11, 0, 2, 5, 2, 5, 5, 6, 8, 9]; // 甲亥/乙子/丙寅/丁巳/戊寅/己巳/庚巳/辛午/壬申/癸酉
// 驿马 (年支/日支 所在三合局 → 冲出位)
var YI_MA = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5];
// 桃花/咸池 (年支/日支 所在三合局 → 沐浴位)
var TAO_HUA = [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0];
// 华盖 (年支/日支 所在三合局 → 墓库位)
var HUA_GAI = [4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7];
// 将星 (年支/日支 所在三合局 → 帝旺位)
var JIANG_XING = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];
// 禄神 (日干→地支)
var LU_SHEN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
// 羊刃 (日干→地支, 阴干为-1无阳刃)
var YANG_REN_SHEN = [3, -1, 6, -1, 6, -1, 9, -1, 0, -1];
// 月德 (月支→天干): 寅午戌→丙，巳酉丑→庚，申子辰→壬，亥卯未→甲
var YUE_DE = [8, 6, 2, 0, 8, 6, 2, 0, 8, 6, 2, 0];
// 天德 (月支→天干/地支混合，存 {isStem, v})
var TIAN_DE = [
  { isStem: false, v: 5 }, { isStem: true, v: 6 }, { isStem: true, v: 3 }, { isStem: false, v: 8 },
  { isStem: true, v: 8 }, { isStem: true, v: 7 }, { isStem: false, v: 11 }, { isStem: true, v: 0 },
  { isStem: true, v: 9 }, { isStem: false, v: 2 }, { isStem: true, v: 2 }, { isStem: true, v: 1 }
]; // 子→巳,丑→庚,寅→丁,卯→申,辰→壬,巳→辛,午→亥,未→甲,申→癸,酉→寅,戌→丙,亥→乙
// 金舆 (日干→地支)
var JIN_YU = [4, 5, 7, 8, 7, 8, 10, 11, 1, 2];
// 太极贵人 (日干→地支对)
var TAI_JI = [[0, 6], [0, 6], [3, 9], [3, 9], [4, 10, 1, 7], [4, 10, 1, 7], [2, 11], [2, 11], [5, 8], [5, 8]];
// 天医 (月支→地支): 月支+1取正
var TIAN_YI_STAR = function (mBranch) { return (mBranch + 1) % 12; };

function calcShenSha(pillars) {
  var sha = [];
  var stems = pillars.stems, branches = pillars.branches;
  var dm = stems[2]; // 日干
  var dBranch = branches[2]; // 日支
  var yBranch = branches[0]; // 年支
  var mBranch = branches[1]; // 月支
  var posName = ['年', '月', '日', '时'];

  // 天乙贵人 (以日干查)
  var ty = TIAN_YI[dm];
  for (var i = 0; i < 4; i++) {
    for (var k = 0; k < ty.length; k++) {
      if (branches[i] === ty[k]) sha.push({ name: '天乙贵人', pos: posName[i] + '支', star: '贵', desc: '逢凶化吉，贵人相助' });
    }
  }
  // 文昌 (以日干查四支)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === WEN_CHANG[dm]) sha.push({ name: '文昌贵人', pos: posName[i] + '支', star: '文', desc: '聪颖好学，利考试科举' });
  }
  // 学堂 (日干长生位 — 自然才艺启蒙地)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === XUE_TANG[dm]) sha.push({ name: '学堂', pos: posName[i] + '支', star: '文', desc: '天生擅长学习与研究，利专业深造' });
  }
  // 国印贵人 (掌权印信之象，利文治武功)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === GUO_YIN[dm]) sha.push({ name: '国印', pos: posName[i] + '支', star: '权', desc: '掌权印信之象，利公职/管理/授权型岗位' });
  }
  // 驿马 (以年支和日支查四支)
  var yiMa_y = YI_MA[yBranch], yiMa_d = YI_MA[dBranch];
  for (var i = 0; i < 4; i++) {
    if (branches[i] === yiMa_y || branches[i] === yiMa_d)
      sha.push({ name: '驿马', pos: posName[i] + '支', star: '动', desc: '奔波劳碌，利远行迁徙' });
  }
  // 桃花/咸池 (以年支和日支查四支)
  var th_y = TAO_HUA[yBranch], th_d = TAO_HUA[dBranch];
  for (var i = 0; i < 4; i++) {
    if (branches[i] === th_y || branches[i] === th_d)
      sha.push({ name: '桃花', pos: posName[i] + '支', star: '情', desc: '异性缘佳，风流多情' });
  }
  // 华盖 (以年支查四支)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === HUA_GAI[yBranch]) sha.push({ name: '华盖', pos: posName[i] + '支', star: '孤', desc: '聪明孤高，利宗教艺术' });
  }
  // 将星 (以年支查四支)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === JIANG_XING[yBranch]) sha.push({ name: '将星', pos: posName[i] + '支', star: '权', desc: '领导能力强，有威望' });
  }
  // 禄神 (以日干查四支)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === LU_SHEN[dm]) sha.push({ name: '禄神', pos: posName[i] + '支', star: '禄', desc: '天赐俸禄，衣食无忧' });
  }
  // 羊刃 (以日干查四支, 仅阳干)
  if (YANG_REN_SHEN[dm] >= 0) {
    for (var i = 0; i < 4; i++) {
      if (branches[i] === YANG_REN_SHEN[dm]) sha.push({ name: '羊刃', pos: posName[i] + '支', star: '刃', desc: '性格刚烈，主灾厄亦主成就' });
    }
  }
  // 月德贵人 (以月支查四干)
  var yd = YUE_DE[mBranch];
  for (var i = 0; i < 4; i++) {
    if (stems[i] === yd) sha.push({ name: '月德贵人', pos: posName[i] + '干', star: '德', desc: '逢灾有救，为人慈祥' });
  }
  // 天德贵人 (以月支查四干/四支)
  var td = TIAN_DE[mBranch];
  if (td.isStem) {
    for (var i = 0; i < 4; i++) {
      if (stems[i] === td.v) sha.push({ name: '天德贵人', pos: posName[i] + '干', star: '德', desc: '遇难呈祥，品德高尚' });
    }
  } else {
    for (var i = 0; i < 4; i++) {
      if (branches[i] === td.v) sha.push({ name: '天德贵人', pos: posName[i] + '支', star: '德', desc: '遇难呈祥，品德高尚' });
    }
  }
  // 金舆 (以日干查四支)
  for (var i = 0; i < 4; i++) {
    if (branches[i] === JIN_YU[dm]) sha.push({ name: '金舆', pos: posName[i] + '支', star: '舆', desc: '配偶贤良，得妻(夫)之助' });
  }
  // 太极贵人 (以日干查四支)
  var tj = TAI_JI[dm];
  for (var i = 0; i < 4; i++) {
    for (var k = 0; k < tj.length; k++) {
      if (branches[i] === tj[k]) sha.push({ name: '太极贵人', pos: posName[i] + '支', star: '慧', desc: '好学深思，近神佛有悟性' });
    }
  }
  // 天医 (以月支查四支)
  var tyBr = TIAN_YI_STAR(mBranch);
  for (var i = 0; i < 4; i++) {
    if (branches[i] === tyBr) sha.push({ name: '天医', pos: posName[i] + '支', star: '医', desc: '利从医，逢病有救' });
  }
  // 去重 (同名+同位只保留一条)
  var seen = {};
  sha = sha.filter(function (s) {
    var key = s.name + s.pos;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
  return sha;
}

// ★ 神煞与十神联动文案生成器 (V2.1.1)
// 根据神煞所在宫位的十神属性，生成语境化的深层解读
function shenShaLinkage(shenSha, pillars) {
  var dm = pillars.dayMaster || pillars.stems[2];
  var posIdx = { '年支': 0, '月支': 1, '日支': 2, '时支': 3, '年干': 0, '月干': 1, '日干': 2, '时干': 3 };
  // 十神联动文案库: {神煞名: {十神索引: 文案}}
  var LINK = {
    '文昌贵人': {
      2: '文昌坐食神，才华横溢，以专业技能获得社会地位',
      3: '文昌坐伤官，思维敏捷锐利，适合创意型职业',
      7: '文昌坐正官，学业出众，利考试仕途',
      6: '文昌坐七杀，智谋过人，适合竞争激烈的领域',
      9: '文昌坐正印，好学深思，学术根基深厚',
      8: '文昌坐偏印，独特学习天赋，利研究与玄学',
      4: '文昌坐偏财，聪明善经营，以智慧生财',
      5: '文昌坐正财，理财有方，学以致用'
    },
    '天乙贵人': {
      4: '天乙坐偏财，贵人多助财运，偏财运旺',
      5: '天乙坐正财，贵人助正财，稳定收入来源',
      7: '天乙坐正官，贵人助仕途，利升迁',
      6: '天乙坐七杀，逢险有贵人化解，绝处逢生',
      2: '天乙坐食神，贵人赏识才华，知遇之恩',
      3: '天乙坐伤官，贵人惜才，不拘一格的提携',
      9: '天乙坐正印，长辈贵人扶持，学业/职业皆有助力',
      8: '天乙坐偏印，特殊领域贵人相助'
    },
    '禄神': {
      0: '禄坐比肩，自力更生，不假外力',
      1: '禄坐劫财，财来财去，需防因友耗财',
      2: '禄坐食神，技艺精湛，以才艺换取财禄',
      3: '禄坐伤官，才高八斗，但需防口舌招祸',
      4: '禄坐偏财，经商手段灵活，偏财运佳',
      5: '禄坐正财，正当收入丰厚，安稳之禄'
    },
    '桃花': {
      4: '桃花坐偏财，风流多情，异性缘极旺',
      5: '桃花坐正财，配偶美貌，因缘而得财',
      7: '桃花坐正官，配偶端正有气质，正缘桃花',
      6: '桃花坐七杀，感情波折多，烂桃花防不胜防',
      2: '桃花坐食神，才艺出众引人注目',
      3: '桃花坐伤官，多才多艺但感情不定'
    },
    '羊刃': {
      6: '羊刃逢七杀，刃杀相济，武职大贵',
      7: '羊刃逢正官，性刚能任重事',
      0: '羊刃逢比肩，好勇斗狠，需防灾伤',
      1: '羊刃逢劫财，争财好胜，慎防破耗',
      9: '羊刃逢正印，刚中带柔，化煞为权'
    },
    '华盖': {
      8: '华盖坐偏印，孤高深思，利宗教哲学玄学',
      9: '华盖坐正印，聪慧好学，清高自守',
      2: '华盖坐食神，才华清高，艺术造诣深',
      6: '华盖坐七杀，孤独中蕴藏权威',
      7: '华盖坐正官，为人正直清廉'
    },
    '将星': {
      7: '将星坐正官，天生领导力，利仕途管理',
      6: '将星坐七杀，威权过人，适合军警',
      0: '将星坐比肩，独立自主，同辈中领头',
      2: '将星坐食神，以才华服众',
      5: '将星坐正财，管理理财能力强'
    },
    '驿马': {
      4: '驿马坐偏财，奔波生财，适合流动性行业',
      5: '驿马坐正财，外出求财，远方得利',
      7: '驿马坐正官，因公出差频繁，利外派升迁',
      2: '驿马坐食神，四海为家以技谋生',
      8: '驿马坐偏印，漂泊不定，行踪难测'
    }
  };

  for (var i = 0; i < shenSha.length; i++) {
    var s = shenSha[i];
    var linkMap = LINK[s.name];
    if (!linkMap) continue;
    var pi = posIdx[s.pos];
    if (pi === undefined) continue;
    // 计算该宫位的十神
    var ssIdx;
    if (s.pos.indexOf('干') >= 0) {
      // 天干神煞: 直接用该柱天干算十神
      ssIdx = shiShen(dm, pillars.stems[pi]);
    } else {
      // 地支神煞: 用藏干本气算十神
      ssIdx = shiShen(dm, CANG_GAN[pillars.branches[pi]][0].t);
    }
    var linkedDesc = linkMap[ssIdx];
    if (linkedDesc) {
      s.linkedDesc = linkedDesc;
      s.linkedSS = SHI_SHEN[ssIdx];
    }
  }
  return shenSha;
}

// ── 暗合对照表 ──
// 寅丑(甲己合+丙辛合)，卯申(乙庚合)，午亥(丁壬合+甲己合)
var AN_HE_PAIRS = [[2, 1], [3, 8], [6, 11]];
var AN_HE_NAMES = {
  '2_1': '寅丑暗合(甲己合、丙辛合)',
  '3_8': '卯申暗合(乙庚合)',
  '6_11': '午亥暗合(丁壬合、甲己合)'
};

// ── 破 对照表 ──
// 子酉, 午卯, 辰丑, 未戌 (去掉与六合重叠的寅亥、巳申)
var PO_PAIRS = [[0, 9], [6, 3], [4, 1], [7, 10]];

// 九级强弱标度
var STRENGTH_SCALE = [
  { min: 0.85, name: '极强', level: 4 }, { min: 0.75, name: '很强', level: 3 },
  { min: 0.65, name: '强', level: 2 }, { min: 0.55, name: '稍强', level: 1 },
  { min: 0.45, name: '中和', level: 0 }, { min: 0.35, name: '稍弱', level: -1 },
  { min: 0.25, name: '弱', level: -2 }, { min: 0.15, name: '很弱', level: -3 },
  { min: 0, name: '极弱', level: -4 }
];

function strengthName(r) {
  for (var i = 0; i < STRENGTH_SCALE.length; i++) {
    if (r >= STRENGTH_SCALE[i].min) return STRENGTH_SCALE[i].name;
  }
  return '极弱';
}

// ══════════════════════════════════════
// §2 ASTRONOMICAL CALCULATIONS
// ══════════════════════════════════════

function gregorianToJDN(Y, M, D) {
  var a = Math.floor((14 - M) / 12);
  var y = Y - a + 4800;
  var m = M + 12 * a - 3;
  return D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToGregorian(jdn) {
  var a = jdn + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(146097 * b / 4);
  var d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153);
  var D = e - Math.floor((153 * m + 2) / 5) + 1, M = m + 3 - 12 * Math.floor(m / 10), Y = 100 * b + d - 4800 + Math.floor(m / 10);
  return { y: Y, m: M, d: D };
}

// Solar longitude (Meeus algorithm, accuracy ~0.01°)
function solarLongitude(jd) {
  var T = (jd - 2451545.0) / 36525;
  var L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  if (L0 < 0) L0 += 360;
  var M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
  if (M < 0) M += 360;
  var Mr = M * Math.PI / 180;
  var C = (1.914602 - 0.004817 * T) * Math.sin(Mr) + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr);
  var lon = (L0 + C) % 360;
  if (lon < 0) lon += 360;
  // Nutation + aberration (simplified)
  var omega = (125.04 - 1934.136 * T) * Math.PI / 180;
  lon = lon - 0.00569 - 0.00478 * Math.sin(omega);
  lon = lon % 360; if (lon < 0) lon += 360;
  return lon;
}

// Find JDN when solar longitude crosses a target angle (bisection)
// direction: 1=search forward(default), -1=search backward
function findSolarLonCrossing(jdStart, targetLon, direction) {
  direction = direction || 1;
  var lo, hi;
  if (direction >= 0) {
    // Search forward: from jdStart-5 to jdStart+40
    lo = jdStart - 5; hi = jdStart + 40;
  } else {
    // Search backward: from jdStart-40 to jdStart+5
    lo = jdStart - 40; hi = jdStart + 5;
  }
  for (var i = 0; i < 50; i++) {
    var mid = (lo + hi) / 2;
    var lon = solarLongitude(mid); // evaluate at mid (JD直接计算，不偏移)
    var diff = (lon - targetLon + 360) % 360;
    if (diff > 180) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// Get 立春 JDN for a given year
function getLiChunJDN(year) {
  // 立春: solar longitude = 315°
  // Usually around Feb 3-5
  var approx = gregorianToJDN(year, 2, 4);
  return findSolarLonCrossing(approx - 3, 315);
}

// Determine month branch from solar longitude
function getMonthFromSolarLon(lon) {
  var m = Math.floor(((lon - 315 + 360) % 360) / 30);
  return { monthIdx: m, branch: (m + 2) % 12 };
}

// Get month branch for a given JDN
function getMonthBranch(jd) {
  var lon = solarLongitude(jd); // jd应传入精确JD（非整数JDN）
  return getMonthFromSolarLon(lon);
}

// Get seasonal element from month branch
function getSeasonWx(d_month) {
  var k = (d_month - 2 + 12) % 12;
  var s = Math.floor(k / 3);
  return s + Math.floor(s / 2); // ω(s): 0→0(木), 1→1(火), 2→3(金), 3→4(水)
}

// ══════════════════════════════════════
// §3 FOUR PILLAR CALCULATION
// ══════════════════════════════════════

// ══════════════════════════════════════
// §2b 中国夏令时 (DST) 1986–1991
// ══════════════════════════════════════
// 中国1986-1991年实行夏令时：4月第二个星期日02:00拨快1小时，9月第二个星期日02:00拨回。
// 输入：钟表时间(Y,M,D,hh,mm)，输出：{isDST, stdHH, stdMM, stdY, stdM, stdD}

var CHINA_DST = [
  // [年份, DST开始月, 开始日, DST结束月, 结束日]
  // 均为02:00切换，开始日/结束日为该年4月/9月的第二个星期日
  [1986, 4, 13, 9, 14],
  [1987, 4, 12, 9, 13],
  [1988, 4, 10, 9, 11],
  [1989, 4, 16, 9, 17],
  [1990, 4, 15, 9, 16],
  [1991, 4, 14, 9, 15]
];

function chinaDST(Y, M, D, hh, mm) {
  var result = { isDST: false, stdHH: hh, stdMM: mm, stdY: Y, stdM: M, stdD: D };
  if (Y < 1986 || Y > 1991) return result;

  var entry = null;
  for (var i = 0; i < CHINA_DST.length; i++) {
    if (CHINA_DST[i][0] === Y) { entry = CHINA_DST[i]; break; }
  }
  if (!entry) return result;

  var startM = entry[1], startD = entry[2], endM = entry[3], endD = entry[4];

  // 用JDN精确比较：JDN*1440+分钟数 → 绝对分钟时间戳
  function toAbsMin(y, m, d, h, mi) { return gregorianToJDN(y, m, d) * 1440 + h * 60 + mi; }
  var now = toAbsMin(Y, M, D, hh, mm);
  var start = toAbsMin(Y, startM, startD, 2, 0);  // DST开始：当日02:00
  var end = toAbsMin(Y, endM, endD, 2, 0);       // DST结束：当日02:00

  if (now >= start && now < end) {
    result.isDST = true;
    // 标准时间 = 钟表时间 - 1小时
    var totalMin = hh * 60 + mm - 60;
    if (totalMin < 0) {
      totalMin += 1440;
      // 需要回退一天
      var jd = gregorianToJDN(Y, M, D) - 1;
      var gd = jdnToGregorian(jd);
      result.stdY = gd.y;
      result.stdM = gd.m;
      result.stdD = gd.d;
    }
    result.stdHH = Math.floor(totalMin / 60);
    result.stdMM = totalMin % 60;
  }
  return result;
}

// 真太阳时修正：均时差 + 经度差
function trueSolarTimeAdj(jd, lon) {
  // Equation of Time (EoT) in minutes, simplified Meeus
  var T = (jd - 2451545.0) / 36525.0;
  var L0 = (280.46646 + 36000.76983 * T) % 360;
  var M = (357.52911 + 35999.05029 * T) % 360;
  var e = 0.016708634 - 0.000042037 * T;
  var Mrad = M * Math.PI / 180;
  var y = Math.tan(((23.439291 - 0.0130042 * T) / 2) * Math.PI / 180);
  y = y * y;
  var L0rad = L0 * Math.PI / 180;
  var EoT = y * Math.sin(2 * L0rad) - 2 * e * Math.sin(Mrad) + 4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad)
    - 0.5 * y * y * Math.sin(4 * L0rad) - 1.25 * e * e * Math.sin(2 * Mrad);
  var EoTmin = EoT * 229.18; // radians to minutes
  // 经度差修正: 每度 = 4 分钟, 基准 120°E (北京时间)
  var lonAdj = (lon - 120) * 4; // minutes
  return { eot: EoTmin, lonAdj: lonAdj, totalMin: EoTmin + lonAdj };
}

// lateZiMode: 'sameDay' (晚子时归本日，主流) | 'nextDay' (子初换日派)
function calcPillars(Y, M, D, hour, lon, rawHH, rawMM, lateZiMode) {
  // ★ 第0步：夏令时修正（1986-1991中国DST，钟表时间→标准时间）
  var dst = { isDST: false };
  if (rawHH !== undefined && rawMM !== undefined) {
    dst = chinaDST(Y, M, D, rawHH, rawMM);
    if (dst.isDST) {
      Y = dst.stdY; M = dst.stdM; D = dst.stdD;
      rawHH = dst.stdHH; rawMM = dst.stdMM;
      hour = hourMinToBranch(rawHH, rawMM);
    }
  }

  var jd = gregorianToJDN(Y, M, D);

  // 真太阳时修正
  var tsAdj = trueSolarTimeAdj(jd, lon);
  tsAdj.dst = dst; // 附带DST信息供UI展示

  // ★ Step A: 真太阳时修正 → 确定真实时辰（必须最先计算，用于夜子时判断）
  var d_hour = hour; // 默认用北京时间时辰
  var trueHH = rawHH, trueMM = rawMM;
  if (rawHH !== undefined && rawMM !== undefined && tsAdj) {
    var totalMin = rawHH * 60 + rawMM + tsAdj.totalMin;
    // 先四舍五入到整分钟，再规整到 [0,1440)，最后拆 HH/MM
    totalMin = Math.round(totalMin);
    totalMin = ((totalMin % 1440) + 1440) % 1440;
    trueHH = Math.floor(totalMin / 60);
    trueMM = totalMin % 60;
    d_hour = hourMinToBranch(trueHH, trueMM);
  }
  tsAdj.trueHH = trueHH;
  tsAdj.trueMM = trueMM;
  tsAdj.trueBranch = d_hour;
  tsAdj.origBranch = hour;

  // ★ Step B: 夜子时检测（23:00-23:59 属于子时）
  //  - 'sameDay' (默认·主流): 晚子时归本日，日柱不变
  //  - 'nextDay' (子初换日派): 23:xx 日柱推进一天
  var isLateZiRaw = (trueHH !== undefined && trueHH >= 23);
  if (!lateZiMode) lateZiMode = 'sameDay';
  var advanceDay = isLateZiRaw && lateZiMode === 'nextDay';
  tsAdj.isLateZi = isLateZiRaw;
  tsAdj.lateZiMode = lateZiMode;
  tsAdj.advanceDay = advanceDay;

  // ★ Step C: 精确出生JD（用于节气边界判定）
  // JDN.0 = noon UTC, 偏移 = (北京时时分 - 20小时) / 24
  // 节气是绝对天文事件，必须用绝对时间(UTC)比较
  var birthJD;
  if (rawHH !== undefined && rawMM !== undefined) {
    birthJD = jd + (rawHH + rawMM / 60 - 20) / 24;
    // 夜子时且子初换日派：birthJD 推进一天用于节气判定
    if (advanceDay) birthJD += 1;
  } else {
    birthJD = jd; // fallback: noon UTC
  }

  // 1. Year pillar: use 立春 as boundary (精确到分钟级)
  var liChunJD = getLiChunJDN(Y);
  // 夜子时跨年检测：仅 nextDay 派需要跨年
  var yearForBirthJD = advanceDay && M === 12 && D === 31 ? Y + 1 : Y;
  var liChunJDCheck = getLiChunJDN(yearForBirthJD);
  var yearForPillar = birthJD < liChunJDCheck ? yearForBirthJD - 1 : yearForBirthJD;
  var n_year = ((yearForPillar - 4) % 60 + 60) % 60;
  var t_year = n_year % 10;
  var d_year = n_year % 12;

  // 2. Month pillar (用精确出生JD判定所在节气)
  var mInfo = getMonthBranch(birthJD);
  var d_month = mInfo.branch;
  var monthIdx = mInfo.monthIdx; // 0-based (0=正月)
  var t_month = (2 * (t_year % 5) + 2 + monthIdx) % 10;

  // 3. Day pillar — 夜子时仅在 nextDay 派推进一天
  var jdDay = advanceDay ? jd + 1 : jd;
  var n_day = (jdDay + 49) % 60;
  var t_day = n_day % 10;
  var d_day = n_day % 12;

  // 4. Hour pillar — 从日柱推算时干
  var t_hour = (2 * (t_day % 5) + d_hour) % 10;

  return {
    jd: jd,
    birthJD: birthJD, // 精确出生JD（含时分，用于节气边界判定）
    tsAdj: tsAdj, // 真太阳时修正数据
    yearForPillar: yearForPillar,
    year: { t: t_year, d: d_year, n: n_year },
    month: { t: t_month, d: d_month, n: null, idx: monthIdx },
    day: { t: t_day, d: d_day, n: n_day },
    hour: { t: t_hour, d: d_hour, n: null },
    // Convenience
    stems: [t_year, t_month, t_day, t_hour],
    branches: [d_year, d_month, d_day, d_hour],
    dayMaster: t_day,
    dayMasterWx: tgWx(t_day)
  };
}

// ══════════════════════════════════════
// §3b MOCK INJECTION MODE (测试专用)
// ══════════════════════════════════════

// 绕过万年历引擎，直接注入指定四柱用于测试极端拓扑结构
// 用法: var p = mockPillars([甲,己,甲,己], [辰,巳,午,未])
// stems/branches 用编号: 甲=0,乙=1,...癸=9 / 子=0,丑=1,...亥=11
function mockPillars(stems, branches, kongWang) {
  return {
    jd: 0,
    birthJD: 0,
    tsAdj: { totalMin: 0, eot: 0, lonAdj: 0, trueHH: 12, trueMM: 0, trueBranch: branches[3], origBranch: branches[3] },
    yearForPillar: 2000,
    year: { t: stems[0], d: branches[0] },
    month: { t: stems[1], d: branches[1], idx: ((branches[1] - 2 + 12) % 12) },
    day: { t: stems[2], d: branches[2] },
    hour: { t: stems[3], d: branches[3] },
    stems: stems,
    branches: branches,
    dayMaster: stems[2],
    dayMasterWx: tgWx(stems[2]),
    kongWang: kongWang || [],
    isMock: true
  };
}

// ══════════════════════════════════════
// §3c 暗物质引擎：胎元、命宫、身宫 (Hidden Pillars)
// ══════════════════════════════════════

// 五虎遁：年干 → 正月(寅月)起始天干
// 甲己→丙寅, 乙庚→戊寅, 丙辛→庚寅, 丁壬→壬寅, 戊癸→甲寅
var WU_HU_DUN = [2, 4, 6, 8, 0]; // yearStem%5 → 寅月天干

function calcHiddenPillars(pillars) {
  var tM = pillars.month.t;  // 月干
  var dM = pillars.branches[1]; // 月支
  var dH = pillars.branches[3]; // 时支
  var tY = pillars.stems[0]; // 年干

  // ── 胎元 (Fetal Origin) ──
  var taiT = (tM + 1) % 10;
  var taiD = (dM + 3) % 12;

  // ── 命宫 (Life Palace) ──
  // 以寅=1为绝对索引: I = (branch - 2 + 12) % 12 + 1 → [1..12]
  var I_month = (dM - 2 + 12) % 12 + 1; // 1=寅, 2=卯...11=子, 12=丑
  var I_hour = (dH - 2 + 12) % 12 + 1;
  var mingRaw = (26 - I_month - I_hour) % 12;
  if (mingRaw <= 0) mingRaw += 12;
  var mingD = (mingRaw + 2 - 1 + 12) % 12; // 转回标准编号(子=0)
  // 命宫天干：五虎遁，年干起寅月，顺推到命宫地支
  var mingBaseT = WU_HU_DUN[tY % 5]; // 寅月天干
  var mingMonthIdx = (mingD - 2 + 12) % 12; // 寅=0, 卯=1...
  var mingT = (mingBaseT + mingMonthIdx) % 10;

  // ── 身宫 (Body Palace) ──
  var shenRaw = (I_month + I_hour) % 12;
  if (shenRaw <= 0) shenRaw += 12;
  var shenD = (shenRaw + 2 - 1 + 12) % 12;
  var shenMonthIdx = (shenD - 2 + 12) % 12;
  var shenT = (mingBaseT + shenMonthIdx) % 10;

  return {
    tai: { t: taiT, d: taiD, label: '胎元' },
    ming: { t: mingT, d: mingD, label: '命宫' },
    shen: { t: shenT, d: shenD, label: '身宫' }
  };
}

// 检测暗物质节点能否凑成三合局/三会局 (幽灵引力)
// 只检测隐藏节点参与的组合，不检测冲/刑/害
// 返回 { notes: [...], vDelta: [0,0,0,0,0] }
// vDelta: 暗合补完对五行向量的增量（暗三合+0.30，暗三会+0.40，同元素多次补完边际递减50%）
function detectHiddenCombos(branches, hiddenPillars) {
  var notes = [];
  var vDelta = [0, 0, 0, 0, 0];
  var wxHitCount = [0, 0, 0, 0, 0]; // 同五行被补完的次数，用于边际递减
  var hiddenNodes = [
    { d: hiddenPillars.tai.d, label: '胎元' },
    { d: hiddenPillars.ming.d, label: '命宫' },
    { d: hiddenPillars.shen.d, label: '身宫' }
  ];

  // 三合局配置: [中心支, 开端支, 终端支] → 化五行
  var SAN_HE = [
    { center: 8, wings: [0, 4], wx: 4, name: '水' },  // 申子辰
    { center: 2, wings: [6, 10], wx: 1, name: '火' }, // 寅午戌
    { center: 11, wings: [3, 7], wx: 0, name: '木' },  // 亥卯未
    { center: 5, wings: [9, 1], wx: 3, name: '金' }   // 巳酉丑
  ];
  // 三会局配置: [三支] → 化五行
  var SAN_HUI = [
    { branches: [2, 3, 4], wx: 0, name: '木' },   // 寅卯辰
    { branches: [5, 6, 7], wx: 1, name: '火' },   // 巳午未
    { branches: [8, 9, 10], wx: 3, name: '金' },  // 申酉戌
    { branches: [11, 0, 1], wx: 4, name: '水' }   // 亥子丑
  ];

  var HIDDEN_BOOST_SANHE = 0.30;  // 暗三合补完增量
  var HIDDEN_BOOST_SANHUI = 0.40; // 暗三会补完增量（三会力大于三合）
  var MARGINAL_DECAY = 0.50;      // 同五行重复补完边际递减

  // 收集原局地支set
  var brSet = {};
  for (var i = 0; i < 4; i++) brSet[branches[i]] = true;

  // 检测三合局：原局已有2支，暗物质补第3支
  for (var s = 0; s < SAN_HE.length; s++) {
    var sh = SAN_HE[s];
    var all3 = [sh.center, sh.wings[0], sh.wings[1]];
    var inOrig = 0, missing = -1, missingLabel = '';
    for (var k = 0; k < 3; k++) {
      if (brSet[all3[k]]) inOrig++;
      else missing = all3[k];
    }
    if (inOrig === 2 && missing >= 0) {
      // 原局差一支，看暗物质能否补上
      for (var h = 0; h < hiddenNodes.length; h++) {
        if (hiddenNodes[h].d === missing) {
          var boost = HIDDEN_BOOST_SANHE * Math.pow(MARGINAL_DECAY, wxHitCount[sh.wx]);
          vDelta[sh.wx] += boost;
          wxHitCount[sh.wx]++;
          notes.push({
            type: '暗三合', wx: sh.wx, boost: boost,
            desc: DZ[all3[0]] + DZ[all3[1]] + DZ[all3[2]] + '三合' + sh.name + '局（' + hiddenNodes[h].label + DZ[missing] + '补完，V[' + WX[sh.wx] + ']+' + boost.toFixed(2) + '）'
          });
        }
      }
    }
  }

  // 检测三会局：原局已有2支，暗物质补第3支
  for (var s = 0; s < SAN_HUI.length; s++) {
    var sh = SAN_HUI[s];
    var inOrig = 0, missing = -1;
    for (var k = 0; k < 3; k++) {
      if (brSet[sh.branches[k]]) inOrig++;
      else missing = sh.branches[k];
    }
    if (inOrig === 2 && missing >= 0) {
      for (var h = 0; h < hiddenNodes.length; h++) {
        if (hiddenNodes[h].d === missing) {
          var boost = HIDDEN_BOOST_SANHUI * Math.pow(MARGINAL_DECAY, wxHitCount[sh.wx]);
          vDelta[sh.wx] += boost;
          wxHitCount[sh.wx]++;
          notes.push({
            type: '暗三会', wx: sh.wx, boost: boost,
            desc: DZ[sh.branches[0]] + DZ[sh.branches[1]] + DZ[sh.branches[2]] + '三会' + sh.name + '局（' + hiddenNodes[h].label + DZ[missing] + '补完，V[' + WX[sh.wx] + ']+' + boost.toFixed(2) + '）'
          });
        }
      }
    }
  }

  return { notes: notes, vDelta: vDelta };
}

// ══════════════════════════════════════
// §4 FIVE ELEMENT VECTOR
// ══════════════════════════════════════

function calcWxVector(pillars) {
  var V = [0, 0, 0, 0, 0];
  var stems = pillars.stems;
  var branches = pillars.branches;
  // 空亡地支 (定义1.12)
  var kongWang = calcKongWang(pillars.dayMaster, pillars.branches[2]);
  pillars.kongWang = kongWang; // 存储供后续使用

  // Heavenly stems contribution
  for (var i = 0; i < 4; i++) {
    var w = tgWx(stems[i]);
    V[w] += POS_WT[i]; // λ^T
  }
  // Earthly branches contribution (hidden stems)
  for (var i = 0; i < 4; i++) {
    var cg = CANG_GAN[branches[i]];
    var kwMul = (kongWang.indexOf(branches[i]) >= 0) ? KONG_WANG_EPS : 1.0;
    for (var j = 0; j < cg.length; j++) {
      var w = tgWx(cg[j].t);
      V[w] += POS_WT[i + 4] * cg[j].w * kwMul; // λ^D * α * ε_空
    }
  }
  return V;
}

// Monthly correction
function calcMonthlyCorrection(V, d_month) {
  var ws = getSeasonWx(d_month);
  var Vstar = new Array(5);
  var muls = new Array(5);
  for (var w = 0; w < 5; w++) {
    var dist = (w - ws + 5) % 5;
    muls[w] = WANG_SHUAI_MUL[dist];
    Vstar[w] = V[w] * muls[w];
  }
  return { V: Vstar, muls: muls, ws: ws };
}

// ══════════════════════════════════════
// §5 COMBINATIONS, CLASHES, PUNISHMENTS
// ══════════════════════════════════════

// 天干五合 detection
function detectTianGanHe(stems) {
  var combos = [];
  for (var i = 0; i < 3; i++) {
    for (var j = i + 1; j < 4; j++) {
      if ((stems[i] + 5) % 10 === stems[j]) {
        var p = Math.min(stems[i], stems[j]) % 5;
        var chi = (p + 2) % 5; // 化气五行
        combos.push({ i: i, j: j, t1: stems[i], t2: stems[j], chi: chi });
      }
    }
  }
  return combos;
}

// 天干相冲 detection: 甲庚(0,6), 乙辛(1,7), 丙壬(2,8), 丁癸(3,9)
// 《五行结构论》(闻晨植) 阴阳矛盾四级分类:
//   外在主要矛盾 (阳-阳): 甲庚, 丙壬  — 正面对抗, 冲力最强
//   内在主要矛盾 (阴-阴): 乙辛, 丁癸  — 内耗型对立, 冲力较弱
//   次要矛盾 / 矛盾转化 = 阴阳异性对 → 五合, 不作冲处理
function detectTianGanChong(stems) {
  var clashes = [];
  for (var i = 0; i < 3; i++) {
    for (var j = i + 1; j < 4; j++) {
      var lo = Math.min(stems[i], stems[j]);
      var hi = Math.max(stems[i], stems[j]);
      if (lo < 4 && hi === lo + 6) {
        // 阴阳判定 (偶数=阳, 奇数=阴)
        var polarity = (lo % 2 === 0) ? 'external' : 'internal';
        clashes.push({ i: i, j: j, t1: stems[i], t2: stems[j], level: polarity });
      }
    }
  }
  return clashes;
}

// 根据矛盾层级返回冲力系数 (用于 applyDzEffects 中的天干冲处理)
// 外在主要 (阳阳): 1.0 (基准强度)
// 内在主要 (阴阴): 0.7 (内耗型减弱30%)
function tgConflictMul(level) {
  return level === 'internal' ? 0.7 : 1.0;
}

// 地支六合
function liuHe(d) { return (1 - d + 12) % 12; }
// 地支六冲
function liuChong(d) { return (d + 6) % 12; }
// 地支六害
function liuHai(d) { return (7 - d + 12) % 12; }

// 六合合化五行: min(d1,d2) → 化气五行
// 子丑→土, 寅亥→木, 卯戌→火, 辰酉→金, 巳申→水, 午未→火
var LIU_HE_HUA = { 0: 2, 1: 2, 2: 0, 3: 1, 4: 3, 5: 4, 6: 1, 7: 1, 8: 4, 9: 3, 10: 1, 11: 0 };
function liuHeHuaWx(d1, d2) {
  // Return the 化气五行 for a 六合 pair
  var pair = [d1, d2].sort(function (a, b) { return a - b; });
  return LIU_HE_HUA[pair[0]];
}

// 地支三合局: [成员地支, 成员地支, 成员地支, 化气五行]
var SAN_HE = [
  [8, 0, 4, 4],  // 申子辰 → 水局
  [2, 6, 10, 1], // 寅午戌 → 火局
  [5, 9, 1, 3],  // 巳酉丑 → 金局
  [11, 3, 7, 0]  // 亥卯未 → 木局
];

function detectDzRelations(branches) {
  var rels = [];
  // 优先级记录：每对位置(i,j)只保留最高级关系
  // 优先级(定义4.11)：三会 > 三合 > 六合 > 六冲 > 刑 > 害
  var pairHas = {}; // key: "i-j" → highest relation type
  function pairKey(i, j) { return Math.min(i, j) + '-' + Math.max(i, j); }
  function setPair(i, j, type) { pairHas[pairKey(i, j)] = type; }
  function hasPair(i, j) { return pairHas[pairKey(i, j)] || null; }

  // 第负一轮：检测暗合与破（低优先级，仅标记不影响力量计算）
  for (var i = 0; i < 3; i++) {
    for (var j = i + 1; j < 4; j++) {
      var d1 = branches[i], d2 = branches[j];
      // 暗合
      for (var a = 0; a < AN_HE_PAIRS.length; a++) {
        var ap = AN_HE_PAIRS[a];
        if ((d1 === ap[0] && d2 === ap[1]) || (d1 === ap[1] && d2 === ap[0])) {
          var key = ap[0] + '_' + ap[1];
          rels.push({ type: '暗合', i: i, j: j, d1: d1, d2: d2, desc: AN_HE_NAMES[key] });
        }
      }
      // 破
      for (var a = 0; a < PO_PAIRS.length; a++) {
        var pp = PO_PAIRS[a];
        if ((d1 === pp[0] && d2 === pp[1]) || (d1 === pp[1] && d2 === pp[0])) {
          rels.push({ type: '破', i: i, j: j, d1: d1, d2: d2 });
        }
      }
    }
  }

  // 第零轮：检测三会局（最高优先级，定义4.6）
  var SAN_HUI = [
    { members: [2, 3, 4], huaWx: 0, name: '木' },   // 寅卯辰→木
    { members: [5, 6, 7], huaWx: 1, name: '火' },   // 巳午未→火
    { members: [8, 9, 10], huaWx: 3, name: '金' },  // 申酉戌→金
    { members: [11, 0, 1], huaWx: 4, name: '水' }   // 亥子丑→水
  ];
  for (var s = 0; s < SAN_HUI.length; s++) {
    var sh = SAN_HUI[s], shIdxs = [], shUniqueD = [];
    for (var i = 0; i < branches.length; i++) {
      if (sh.members.indexOf(branches[i]) >= 0) {
        shIdxs.push(i);
        if (shUniqueD.indexOf(branches[i]) < 0) shUniqueD.push(branches[i]);
      }
    }
    if (shUniqueD.length >= 3) {
      rels.push({ type: '三会', idxs: shIdxs, branches: shUniqueD, huaWx: sh.huaWx, full: true });
      // 标记三会所有涉及的对为已用
      for (var a = 0; a < shIdxs.length; a++) {
        for (var b = a + 1; b < shIdxs.length; b++) {
          setPair(shIdxs[a], shIdxs[b], '三会');
        }
      }
    }
  }

  // 三合局检测（次优先级） — 需要3个不同地支
  for (var s = 0; s < SAN_HE.length; s++) {
    var grp = SAN_HE[s], members = [grp[0], grp[1], grp[2]], idxs = [], uniqueD = [];
    for (var i = 0; i < branches.length; i++) {
      if (members.indexOf(branches[i]) >= 0) {
        idxs.push(i);
        if (uniqueD.indexOf(branches[i]) < 0) uniqueD.push(branches[i]);
      }
    }
    if (uniqueD.length >= 3) {
      rels.push({ type: '三合', idxs: idxs, branches: uniqueD, huaWx: grp[3], full: true });
      for (var a = 0; a < idxs.length; a++) {
        for (var b = a + 1; b < idxs.length; b++) {
          setPair(idxs[a], idxs[b], '三合');
        }
      }
    } else if (uniqueD.length === 2) {
      var zhong = grp[1];
      if (uniqueD.indexOf(zhong) >= 0) {
        rels.push({ type: '半三合', idxs: idxs, branches: uniqueD, huaWx: grp[3], full: false });
      }
    }
  }
  // 第一轮：检测六合（优先于六冲，定义4.11）
  for (var i = 0; i < branches.length; i++) {
    for (var j = i + 1; j < branches.length; j++) {
      if (hasPair(i, j)) continue; // 已有三会/三合，跳过
      var d1 = branches[i], d2 = branches[j];
      if (liuHe(d1) === d2) {
        var huaWx = liuHeHuaWx(d1, d2);
        rels.push({ type: '六合', i: i, j: j, d1: d1, d2: d2, huaWx: huaWx });
        setPair(i, j, '六合');
      }
    }
  }
  // 第二轮：检测六冲（已有合的对不再施加冲）
  for (var i = 0; i < branches.length; i++) {
    for (var j = i + 1; j < branches.length; j++) {
      if (hasPair(i, j)) continue; // 已有合，跳过
      var d1 = branches[i], d2 = branches[j];
      if (liuChong(d1) === d2) {
        rels.push({ type: '六冲', i: i, j: j, d1: d1, d2: d2 });
        setPair(i, j, '六冲');
      }
    }
  }
  // 第三轮：检测相刑（已有更高优先级关系的对不再施加刑）
  var xingGroups = [[0, 3], [2, 5, 8], [1, 10, 7]];
  for (var g = 0; g < xingGroups.length; g++) {
    var grp = xingGroups[g];
    for (var i = 0; i < branches.length; i++) {
      for (var j = i + 1; j < branches.length; j++) {
        if (branches[i] === branches[j]) continue;
        if (hasPair(i, j)) continue; // ★ 已有冲/合，不叠加刑
        var a = grp.indexOf(branches[i]), b = grp.indexOf(branches[j]);
        if (a >= 0 && b >= 0) {
          rels.push({ type: '相刑', i: i, j: j, d1: branches[i], d2: branches[j] });
          setPair(i, j, '相刑');
        }
      }
    }
  }
  // 第四轮：检测六害（已有更高级关系的对不再施加害）
  for (var i = 0; i < branches.length; i++) {
    for (var j = i + 1; j < branches.length; j++) {
      if (hasPair(i, j)) continue; // 已有冲/合/刑，不叠加害
      var d1 = branches[i], d2 = branches[j];
      if (liuHai(d1) === d2) {
        rels.push({ type: '六害', i: i, j: j, d1: d1, d2: d2 });
        setPair(i, j, '六害');
      }
    }
  }
  // 自刑: 辰辰, 午午, 酉酉, 亥亥
  var ziXing = [4, 6, 9, 11];
  for (var i = 0; i < branches.length; i++) {
    for (var j = i + 1; j < branches.length; j++) {
      if (branches[i] === branches[j] && ziXing.indexOf(branches[i]) >= 0) {
        rels.push({ type: '自刑', i: i, j: j, d1: branches[i], d2: branches[j] });
      }
    }
  }
  return rels;
}

// ── 藏干级合冲刑害修正 ──
// 返回 {V: 修正后向量, mods: 每支修正说明数组, details: 详细变化}
function applyDzEffects(Vstar, branches, rels, stems, kongWang) {
  kongWang = kongWang || [];
  // 计算每个地支位的藏干乘数 (默认1.0)
  var branchMul = [1.0, 1.0, 1.0, 1.0];
  var branchWxBoost = {}; // ★ 土冲土分元素增减: branchWxBoost[pos][wxIdx] = multiplier
  // 合化转化记录: branchIdx → {transform: true, targetWx: n}
  var branchTransform = {};
  var modNotes = []; // 修正说明

  // ★ 预扫描：检测"合解冲"情况 (定义4.11修正版)
  // 建立每个位置参与的关系类型集合
  var posRels = [{}, {}, {}, {}]; // posRels[i] = {type: [rel, ...]}
  for (var r = 0; r < rels.length; r++) {
    var rel = rels[r];
    if (rel.i !== undefined) {
      // 六合/六冲/相刑/六害等成对关系
      if (!posRels[rel.i][rel.type]) posRels[rel.i][rel.type] = [];
      posRels[rel.i][rel.type].push(rel);
      if (!posRels[rel.j][rel.type]) posRels[rel.j][rel.type] = [];
      posRels[rel.j][rel.type].push(rel);
    }
    if (rel.idxs) {
      // 三会/三合/半三合等多支关系
      for (var k = 0; k < rel.idxs.length; k++) {
        var idx = rel.idxs[k];
        if (!posRels[idx][rel.type]) posRels[idx][rel.type] = [];
        posRels[idx][rel.type].push(rel);
      }
    }
  }
  // 检测合解刑冲：空间感知版 (定义4.11修正)
  // 核心规则: 三会/三合(完整)无视距离拥有最高特权; 六合/半三合必须"合距≤冲距"才可解冲解刑
  // 物理逻辑: 近身的冲/刑不能被远处的弱合挡住 (介质阻断原则)
  var heJieChong = {}; // 位置idx → 'full'(三会完全阻断) 或 'partial'(其他合减弱)
  var heJieXing = {};
  for (var p = 0; p < 4; p++) {
    var hasSanHui = posRels[p]['三会'];
    var hasSanHe = posRels[p]['三合'];
    var hasLiuHe = posRels[p]['六合'];
    var hasBanSanHe = posRels[p]['半三合'];
    if (!hasSanHui && !hasSanHe && !hasLiuHe && !hasBanSanHe) continue;
    // 三会/三合拥有Root Privilege，无视距离
    var heLevel = hasSanHui ? 2 : (hasSanHe ? 1 : 0);
    // 六合/半三合需要计算合方最近距离
    var minHeDist = 99;
    if (heLevel < 1) {
      var heT = ['六合', '半三合'];
      for (var ht = 0; ht < heT.length; ht++) {
        var hrs = posRels[p][heT[ht]];
        if (!hrs) continue;
        for (var hr = 0; hr < hrs.length; hr++) {
          var r2 = hrs[hr];
          if (r2.idxs) { for (var k2 = 0; k2 < r2.idxs.length; k2++) { if (r2.idxs[k2] !== p) minHeDist = Math.min(minHeDist, Math.abs(r2.idxs[k2] - p)); } }
          if (r2.i !== undefined && r2.j !== undefined) { var pp = (r2.i === p) ? r2.j : r2.i; minHeDist = Math.min(minHeDist, Math.abs(pp - p)); }
        }
      }
    }
    // 合解冲判定
    if (posRels[p]['六冲']) {
      if (heLevel >= 2) { heJieChong[p] = 'full'; }
      else if (heLevel >= 1) { heJieChong[p] = 'partial'; }
      else {
        // 六合/半三合: 射线追踪 — 只有合距≤冲距才可解
        var crs = posRels[p]['六冲'], minCD = 99;
        for (var cr = 0; cr < crs.length; cr++) { var cp2 = (crs[cr].i === p) ? crs[cr].j : crs[cr].i; minCD = Math.min(minCD, Math.abs(cp2 - p)); }
        if (minHeDist <= minCD) heJieChong[p] = 'partial';
        // else: 合远冲近，合力被阻断，无法解冲
      }
    }
    // 合解刑判定
    if (posRels[p]['相刑']) {
      if (heLevel >= 2) { heJieXing[p] = 'full'; }
      else if (heLevel >= 1) { heJieXing[p] = 'partial'; }
      else {
        var xrs = posRels[p]['相刑'], minXD = 99;
        for (var xr = 0; xr < xrs.length; xr++) { var xp2 = (xrs[xr].i === p) ? xrs[xr].j : xrs[xr].i; minXD = Math.min(minXD, Math.abs(xp2 - p)); }
        if (minHeDist <= minXD) heJieXing[p] = 'partial';
      }
    }
  }

  // 距离衰减：邻接权重 W_adj (定义2.5修正)
  // 同柱(距0):1.0, 相邻(距1):0.9(微衰减), 隔一柱(距2):0.4, 年时(距3):0.1
  function distDecay(i, j) {
    var d = Math.abs(i - j); return d === 0 ? 1.0 : d === 1 ? 0.9 : d === 2 ? 0.4 : 0.1;
  }
  // 将基础乘数按距离衰减: 1-(1-baseMul)*decay
  function decayMul(baseMul, i, j) {
    return 1 - (1 - baseMul) * distDecay(i, j);
  }

  // ★ 从势合化判定：当命局中某五行本气占3支以上，该五行的合局可从势化成
  function congShiHua(targetWx) {
    var count = 0;
    for (var b = 0; b < branches.length; b++) {
      var benQiWx = tgWx(CANG_GAN[branches[b]][0].t);
      if (benQiWx === targetWx) count++;
    }
    return count >= 3; // 3/4支本气为目标五行 → 从势
  }

  // ★ 同类算子防连乘机制 (定义4.9修正)
  // 同一地支位置被多个六冲命中时，首次全额施加，后续边际递减30%
  var chongRecord = {}; // branchIdx → {mul: 首次乘数, count: 命中次数}
  var CHONG_MARGINAL = 0.30; // 后续冲力为首次的30%

  for (var r = 0; r < rels.length; r++) {
    var rel = rels[r];
    if (rel.type === '六冲') {
      // 冲: 非对称弱化 (定义4.9修正版 — 季节质量加权)
      // 《五行结构论》冲战三级分层:
      //   将之战 子午/卯酉 (四正,气冲): gamma0=0.80, 最烈
      //   臣之战 寅申/巳亥 (四生,利冲): gamma0=0.70, 中烈
      //   众之战 辰戌/丑未 (四墓,地冲): 走土冲土特例分支
      var isJiangChong = ((rel.d1 === 0 && rel.d2 === 6) || (rel.d1 === 6 && rel.d2 === 0) ||
                         (rel.d1 === 3 && rel.d2 === 9) || (rel.d1 === 9 && rel.d2 === 3));
      var gamma0 = isJiangChong ? 0.80 : 0.70;
      var chongTypeNote = isJiangChong ? '将之战' : '臣之战';
      var ws = getSeasonWx(branches[1]);
      var cg_i = CANG_GAN[rel.d1], cg_j = CANG_GAN[rel.d2];
      var wx_i = tgWx(cg_i[0].t), wx_j = tgWx(cg_j[0].t);

      // ★ 土冲土特例: 辰戌冲/丑未冲 — 土越冲越旺，杂质碾碎
      // 物理逻辑：两块泥土对撞，翻松激增，但内含的水木金火杂质被碾碎
      var isEarthClash = (wx_i === 2 && wx_j === 2); // 双方本气均为土
      if (isEarthClash) {
        var EARTH_BOOST = 1.3;    // 土本气翻松激增30%
        var IMPURITY_CRUSH = 0.3; // 杂质碾碎至30%
        var positions = [rel.i, rel.j];
        var dzLabels = [rel.d1, rel.d2];
        for (var p = 0; p < 2; p++) {
          var pos = positions[p];
          if (heJieChong[pos] === 'full') continue; // 三会完全阻断
          if (!branchWxBoost[pos]) branchWxBoost[pos] = {};
          var scale = (heJieChong[pos] === 'partial') ? 0.5 : 1.0;
          for (var w = 0; w < 5; w++) {
            var factor = (w === 2) ? (1 + (EARTH_BOOST - 1) * scale) : (1 - (1 - IMPURITY_CRUSH) * scale);
            branchWxBoost[pos][w] = (branchWxBoost[pos][w] || 1.0) * factor;
          }
        }
        var noteI = heJieChong[rel.i] === 'full' ? DZ[rel.d1] + '(' + ['年', '月', '日', '时'][rel.i] + '支)×1.00(三会解冲)' : DZ[rel.d1] + '(' + ['年', '月', '日', '时'][rel.i] + '支)土↑×' + EARTH_BOOST + '杂↓×' + IMPURITY_CRUSH;
        var noteJ = heJieChong[rel.j] === 'full' ? DZ[rel.d2] + '(' + ['年', '月', '日', '时'][rel.j] + '支)×1.00(三会解冲)' : DZ[rel.d2] + '(' + ['年', '月', '日', '时'][rel.j] + '支)土↑×' + EARTH_BOOST + '杂↓×' + IMPURITY_CRUSH;
        modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '六冲（土冲土激增）：' + noteI + '、' + noteJ);
      } else {
        // 常规六冲处理
        var vigor_i = WANG_SHUAI_MUL[(wx_i - ws + 5) % 5];
        var vigor_j = WANG_SHUAI_MUL[(wx_j - ws + 5) % 5];
        var psi_i = 0, psi_j = 0;
        for (var k = 0; k < cg_i.length; k++) psi_i += cg_i[k].w;
        for (var k = 0; k < cg_j.length; k++) psi_j += cg_j[k].w;
        // ★ Bug8 衰神冲旺旺神发：有效质量 = 本气权重 × 季节旺衰 × 图谱元素实力
        var chartBack_i = Math.max(0.1, Vstar[wx_i]);
        var chartBack_j = Math.max(0.1, Vstar[wx_j]);
        var eff_i = psi_i * vigor_i * chartBack_i;
        var eff_j = psi_j * vigor_j * chartBack_j;
        var effTotal = eff_i + eff_j;
        // ★ 质量差 > 3倍时触发不对称湮灭
        var massRatio = Math.max(eff_i, eff_j) / Math.min(eff_i, eff_j);
        var ANNIHIL_THRESHOLD = 3.0;
        var raw_mul_i, raw_mul_j;
        if (massRatio >= ANNIHIL_THRESHOLD) {
          // 弱方湮灭，强方微损
          var weakIsI = (eff_i < eff_j);
          var weakMul = 0.05 + 0.15 * (ANNIHIL_THRESHOLD / massRatio); // 比值越大惩罚越重
          var strongMul = 0.95;
          raw_mul_i = weakIsI ? weakMul : strongMul;
          raw_mul_j = weakIsI ? strongMul : weakMul;
        } else {
          raw_mul_i = 1 - gamma0 * eff_j / effTotal;
          raw_mul_j = 1 - gamma0 * eff_i / effTotal;
        }
        var mul_i = heJieChong[rel.i] === 'full' ? 1.0 : (heJieChong[rel.i] === 'partial' ? Math.max(raw_mul_i, 0.85) : raw_mul_i);
        var mul_j = heJieChong[rel.j] === 'full' ? 1.0 : (heJieChong[rel.j] === 'partial' ? Math.max(raw_mul_j, 0.85) : raw_mul_j);

        // ★ 防连乘：首次冲全额施加，后续冲边际递减
        var actual_mul_i = mul_i, actual_mul_j = mul_j;
        var noteExtra_i = '', noteExtra_j = '';
        if (!chongRecord[rel.i]) {
          chongRecord[rel.i] = { mul: mul_i, count: 1 };
        } else {
          // 后续冲：只施加(1-mul)的30%边际惩罚
          actual_mul_i = 1 - (1 - mul_i) * CHONG_MARGINAL;
          chongRecord[rel.i].count++;
          noteExtra_i = '(第' + chongRecord[rel.i].count + '冲,边际递减)';
        }
        if (!chongRecord[rel.j]) {
          chongRecord[rel.j] = { mul: mul_j, count: 1 };
        } else {
          actual_mul_j = 1 - (1 - mul_j) * CHONG_MARGINAL;
          chongRecord[rel.j].count++;
          noteExtra_j = '(第' + chongRecord[rel.j].count + '冲,边际递减)';
        }
        branchMul[rel.i] *= actual_mul_i;
        branchMul[rel.j] *= actual_mul_j;
        var noteI = heJieChong[rel.i] === 'full' ? '×1.00(三会解冲，完全阻断)' : (heJieChong[rel.i] === 'partial' ? '×' + actual_mul_i.toFixed(2) + '(合解冲)' : '×' + actual_mul_i.toFixed(2) + noteExtra_i);
        var noteJ = heJieChong[rel.j] === 'full' ? '×1.00(三会解冲，完全阻断)' : (heJieChong[rel.j] === 'partial' ? '×' + actual_mul_j.toFixed(2) + '(合解冲)' : '×' + actual_mul_j.toFixed(2) + noteExtra_j);
        var asymNote = (massRatio >= ANNIHIL_THRESHOLD) ? '【衰神冲旺·质量比' + massRatio.toFixed(1) + 'x】' : '';
        modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '六冲·' + chongTypeNote + asymNote + '：' + DZ[rel.d1] + '(' + ['年', '月', '日', '时'][rel.i] + '支)' + noteI + '(eff=' + eff_i.toFixed(3) + ')、' + DZ[rel.d2] + '(' + ['年', '月', '日', '时'][rel.j] + '支)' + noteJ + '(eff=' + eff_j.toFixed(3) + ')');
      } // end else (常规六冲)
    } else if (rel.type === '六合') {
      // 合: 判断是否合化成功
      var huaWx = rel.huaWx;
      var monthWx = getSeasonWx(branches[1]);
      var huaSuccess = (monthWx === huaWx);
      var dFactor = distDecay(rel.i, rel.j);
      var distNote = dFactor < 1 ? '(距离衰减' + Math.round((1 - dFactor) * 100) + '%)' : '';
      if (huaSuccess) {
        // 合化成功: 两支藏干转化为合化五行，力量保留80%
        branchTransform[rel.i] = { transform: true, targetWx: huaWx };
        branchTransform[rel.j] = { transform: true, targetWx: huaWx };
        var heMul = decayMul(0.8, rel.i, rel.j);
        branchMul[rel.i] *= heMul;
        branchMul[rel.j] *= heMul;
        modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '六合化' + WX[huaWx] + '（成功，月令' + WX[monthWx] + '当旺）：藏干→' + WX[huaWx] + '，力量×' + heMul.toFixed(2) + distNote);
      } else {
        // 合化不成功: 两支藏干互绊减力
        var heMul = decayMul(0.85, rel.i, rel.j);
        branchMul[rel.i] *= heMul;
        branchMul[rel.j] *= heMul;
        modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '六合化' + WX[huaWx] + '（不成功，月令' + WX[monthWx] + '非' + WX[huaWx] + '）：双方藏干互绊×' + heMul.toFixed(2) + distNote);
      }
    } else if (rel.type === '三会') {
      // 三会局(定义4.6): 最强合局，支持从势合化
      var huaWx = rel.huaWx;
      var monthWx = getSeasonWx(branches[1]);
      var congShi = congShiHua(huaWx);
      var huaSuccess = (monthWx === huaWx) || congShi;
      var alpha = huaSuccess ? 0.95 : 0.5;
      for (var k = 0; k < rel.idxs.length; k++) {
        if (huaSuccess) branchTransform[rel.idxs[k]] = { transform: true, targetWx: huaWx, ratio: 1.0 };
        branchMul[rel.idxs[k]] *= (1 - alpha);
      }
      var huaReason = (monthWx === huaWx) ? '月令' + WX[monthWx] + '当旺' : '从势(' + WX[huaWx] + '本气占3支)';
      if (huaSuccess) {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '三会' + WX[huaWx] + '局（化成，' + huaReason + '）：藏干→' + WX[huaWx] + '，吸收率' + alpha.toFixed(2));
      } else {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '三会' + WX[huaWx] + '局（不化，月令' + WX[monthWx] + '非' + WX[huaWx] + '）：藏干互绊×' + (1 - alpha).toFixed(2));
      }
    } else if (rel.type === '三合') {
      // 三合成局: 各支藏干转化为合化五行，支持从势合化
      var huaWx = rel.huaWx;
      var monthWx = getSeasonWx(branches[1]);
      var congShi3 = congShiHua(huaWx);
      var huaSuccess3 = (monthWx === huaWx) || congShi3;
      var alpha3 = huaSuccess3 ? 0.9 : 0.3;
      for (var k = 0; k < rel.idxs.length; k++) {
        if (huaSuccess3) branchTransform[rel.idxs[k]] = { transform: true, targetWx: huaWx, ratio: 0.85 };
        branchMul[rel.idxs[k]] *= (1 - alpha3);
      }
      var huaReason3 = (monthWx === huaWx) ? '月令当旺' : '从势(' + WX[huaWx] + '本气占3支)';
      if (huaSuccess3) {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '三合' + WX[huaWx] + '局（化成，' + huaReason3 + '）：藏干85%→' + WX[huaWx] + '(15%保留原气)，力量×' + (1 - alpha3).toFixed(2));
      } else {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '三合' + WX[huaWx] + '局（不化）：藏干互绊×' + (1 - alpha3).toFixed(2));
      }
    } else if (rel.type === '半三合') {
      // 半三合: 合而不化时α=0.15，化成时α=0.45 (定义4.8修正，支持从势)
      // ★ 空间感知: 隔柱(d>=2)时引力衰减50%(介质阻断)
      var huaWx = rel.huaWx;
      var monthWx = getSeasonWx(branches[1]);
      var congShiBan = congShiHua(huaWx);
      var banHuaSuccess = (monthWx === huaWx) || congShiBan;
      // ★ 计算半三合"最紧密键"距离 (Min-Distance Priority)
      // 物理逻辑: 多胞胎地支(伏吟)时，引力由最近的异支键决定
      // 例: 午(0)-寅(2)-午(3) → 最近异支键=寅(2)-午(3)的d=1，而非午(0)-午(3)的d=3
      var minBanDist = 99;
      for (var k = 0; k < rel.idxs.length; k++) {
        for (var l = k + 1; l < rel.idxs.length; l++) {
          // 只计算不同地支之间的距离（同支=伏吟，不构成合的有效键）
          if (branches[rel.idxs[k]] !== branches[rel.idxs[l]]) {
            minBanDist = Math.min(minBanDist, Math.abs(rel.idxs[k] - rel.idxs[l]));
          }
        }
      }
      if (minBanDist === 99) minBanDist = 1; // fallback: 全同支时视为相邻
      var banDistMul = minBanDist <= 1 ? 1.0 : (minBanDist === 2 ? 0.7 : 0.4); // 最紧密键决定衰减
      // ★ 重复支引力加成 (V2.1.1): 同一地支出现多次 → 合键密度增加 → 引力增强
      // 物理逻辑: "两酉夹一丑"比"一酉一丑"的金属萃取效率更高（矿藏被过度开采）
      // dupeBonus = 1 + 0.2 × (实际参与支数 - 不同支数), 最高 ×1.4
      var dupeBranch = rel.idxs.length - rel.branches.length; // 0=无重复, 1=一组重复, ...
      var dupeBonus = dupeBranch > 0 ? Math.min(1 + dupeBranch * 0.2, 1.4) : 1.0;
      var alphaBan = (banHuaSuccess ? 0.45 : 0.15) * banDistMul * dupeBonus;
      alphaBan = Math.min(alphaBan, 0.65); // 安全上限：半三合不应超过三合(0.9)
      var ratioBan = banHuaSuccess ? Math.min(0.6 * banDistMul * dupeBonus, 0.85) : 0;
      for (var k = 0; k < rel.idxs.length; k++) {
        if (banHuaSuccess && ratioBan > 0.01) branchTransform[rel.idxs[k]] = { transform: true, targetWx: huaWx, ratio: ratioBan };
        branchMul[rel.idxs[k]] *= (1 - alphaBan);
      }
      var banDistNote = minBanDist >= 2 ? '，隔柱衰减×' + banDistMul.toFixed(1) : '';
      var dupeNote = dupeBranch > 0 ? '，重复支加成×' + dupeBonus.toFixed(1) : '';
      var banReason = (monthWx === huaWx) ? '月令' + WX[monthWx] + '当旺' : '从势(' + WX[huaWx] + '本气占3支)';
      if (banHuaSuccess) {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '半三合' + WX[huaWx] + '局（化成，' + banReason + banDistNote + dupeNote + '）：藏干' + Math.round(ratioBan * 100) + '%→' + WX[huaWx] + '，力量×' + (1 - alphaBan).toFixed(2));
      } else {
        modNotes.push(rel.branches.map(function (b) { return DZ[b]; }).join('') + '半三合' + WX[huaWx] + '局（不化' + banDistNote + dupeNote + '）：合力牵绊×' + (1 - alphaBan).toFixed(2));
      }
    } else if (rel.type === '相刑') {
      // 刑: "无礼之刑"主要影响心性/人际，对五行力量影响轻
      // 基础折损 8%（原 20%）；同支被多次刑时，第 2 次及以后按 0.5 折（边际递减）
      // 合解刑: 三会完全化解(×1.00), 六合/三合/半三合有合力消耗(×0.98)
      var heXI = heJieXing[rel.i];
      var heXJ = heJieXing[rel.j];
      var baseMul_i = heXI ? (heXI === 'full' ? 1.0 : 0.98) : 0.92;
      var baseMul_j = heXJ ? (heXJ === 'full' ? 1.0 : 0.98) : 0.92;
      // 边际递减：该支被刑次数>=2时，第 2 次及以后削弱幅度 ×0.5
      var xingCountI = (posRels[rel.i] && posRels[rel.i]['相刑']) ? posRels[rel.i]['相刑'].length : 1;
      var xingCountJ = (posRels[rel.j] && posRels[rel.j]['相刑']) ? posRels[rel.j]['相刑'].length : 1;
      if (xingCountI > 1 && !heXI) baseMul_i = 1 - (1 - baseMul_i) * 0.5;
      if (xingCountJ > 1 && !heXJ) baseMul_j = 1 - (1 - baseMul_j) * 0.5;
      var xMul_i = baseMul_i < 1.0 ? (heXI ? baseMul_i : decayMul(baseMul_i, rel.i, rel.j)) : 1.0;
      var xMul_j = baseMul_j < 1.0 ? (heXJ ? baseMul_j : decayMul(baseMul_j, rel.i, rel.j)) : 1.0;
      branchMul[rel.i] *= xMul_i;
      branchMul[rel.j] *= xMul_j;
      var dFactor = distDecay(rel.i, rel.j);
      var distNote = (dFactor < 1 && !heXI && !heXJ && (baseMul_i < 1 || baseMul_j < 1)) ? '(距离衰减' + Math.round((1 - dFactor) * 100) + '%)' : '';
      var xNoteI = heXI ? (heXI === 'full' ? '×1.00(合解刑，三会完全化解)' : '×0.95(合解刑，合力消耗)') : '×' + xMul_i.toFixed(2) + distNote;
      var xNoteJ = heXJ ? (heXJ === 'full' ? '×1.00(合解刑，三会完全化解)' : '×0.95(合解刑，合力消耗)') : '×' + xMul_j.toFixed(2) + distNote;
      modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '相刑：' + DZ[rel.d1] + '(' + ['年', '月', '日', '时'][rel.i] + '支)' + xNoteI + '、' + DZ[rel.d2] + '(' + ['年', '月', '日', '时'][rel.j] + '支)' + xNoteJ);
    } else if (rel.type === '六害') {
      // 害: 受害方藏干减力10%，加距离衰减
      var haiMul = decayMul(0.9, rel.i, rel.j);
      branchMul[rel.i] *= haiMul;
      branchMul[rel.j] *= haiMul;
      var dFactor = distDecay(rel.i, rel.j);
      var distNote = dFactor < 1 ? '(距离衰减' + Math.round((1 - dFactor) * 100) + '%)' : '';
      modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '六害：双方藏干力量×' + haiMul.toFixed(2) + distNote);
    } else if (rel.type === '自刑') {
      // 自刑: 质量守恒 — 同元素内部摩擦不减总量，只增加熵(锋芒/破坏力)
      // 不施加 branchMul 惩罚，仅标记为定性指标
      modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '自刑：同质相撞，内部熵增（质量守恒，不减力）');
    } else if (rel.type === '破') {
      // 破: 《五行结构论》定义为"金水一派与木火一派将星间的不和谐"
      //     比六害更轻微 — 双方藏干 ×0.93, 加距离衰减
      var poMul = decayMul(0.93, rel.i, rel.j);
      branchMul[rel.i] *= poMul;
      branchMul[rel.j] *= poMul;
      var dFactorPo = distDecay(rel.i, rel.j);
      var distNotePo = dFactorPo < 1 ? '(距离衰减' + Math.round((1 - dFactorPo) * 100) + '%)' : '';
      modNotes.push(DZ[rel.d1] + DZ[rel.d2] + '相破：双方藏干力量×' + poMul.toFixed(2) + distNotePo + '（将星不和谐，破损残缺）');
    }
  }

  // 天干五合也影响天干力量 (如有)
  var stemMul = [1.0, 1.0, 1.0, 1.0];
  var stemTransform = {}; // pos → {targetWx: n} 合化成功转化
  var tgCombos = stems ? detectTianGanHe(stems) : [];
  // 争合/妒合检测：同一位置出现在多个合中 → 所有相关合都失败
  var posCount = {}; // 统计每个位置参与合的次数
  for (var c = 0; c < tgCombos.length; c++) {
    posCount[tgCombos[c].i] = (posCount[tgCombos[c].i] || 0) + 1;
    posCount[tgCombos[c].j] = (posCount[tgCombos[c].j] || 0) + 1;
  }
  var validCombos = [];
  for (var c = 0; c < tgCombos.length; c++) {
    var combo = tgCombos[c];
    if (posCount[combo.i] > 1 || posCount[combo.j] > 1) {
      // 争合：此位置参与多个合，合力分散，全部失败
      modNotes.push(TG[combo.t1] + TG[combo.t2] + '天干五合（争合/妒合，合力分散，合化失败）');
      continue;
    }
    validCombos.push(combo);
  }
  for (var c = 0; c < validCombos.length; c++) {
    var combo = validCombos[c];
    var monthWx = getSeasonWx(branches[1]);
    var huaSuccess = (monthWx === combo.chi);
    var dFactor = distDecay(combo.i, combo.j);
    var distNote = dFactor < 1 ? '(距离衰减' + Math.round((1 - dFactor) * 100) + '%)' : '';
    if (huaSuccess) {
      // 合化成功: 两干转化为合化五行
      stemTransform[combo.i] = { targetWx: combo.chi };
      stemTransform[combo.j] = { targetWx: combo.chi };
      var heMul = decayMul(0.8, combo.i, combo.j);
      stemMul[combo.i] *= heMul;
      stemMul[combo.j] *= heMul;
      modNotes.push(TG[combo.t1] + TG[combo.t2] + '天干五合化' + WX[combo.chi] + '（成功）：天干→' + WX[combo.chi] + '，力量×' + heMul.toFixed(2) + distNote);
    } else {
      // 合化不成功: 两干互绊减力，加距离衰减
      var heMul = decayMul(0.7, combo.i, combo.j);
      stemMul[combo.i] *= heMul;
      stemMul[combo.j] *= heMul;
      modNotes.push(TG[combo.t1] + TG[combo.t2] + '天干五合化' + WX[combo.chi] + '（不成功，互绊）：天干力量×' + heMul.toFixed(2) + distNote);
    }
  }

  // 天干相冲检测与处理
  var tgChongs = stems ? detectTianGanChong(stems) : [];
  // 合解冲：已参与有效五合的位置不再参与冲
  var stemInHe = {};
  for (var c = 0; c < validCombos.length; c++) {
    stemInHe[validCombos[c].i] = true;
    stemInHe[validCombos[c].j] = true;
  }
  var stemChongRecord = {};
  var STEM_CHONG_MARGINAL = 0.30;
  for (var c = 0; c < tgChongs.length; c++) {
    var clash = tgChongs[c];
    // 合解冲：跳过已被合住的位置
    if (stemInHe[clash.i] && stemInHe[clash.j]) {
      modNotes.push(TG[clash.t1] + TG[clash.t2] + '天干冲（被五合解冲，无效）');
      tgChongs[c].resolved = true;
      continue;
    }
    // 《五行结构论》阴阳矛盾四级：外在(阳阳)冲力足额，内在(阴阴)冲力打7折
    var conflictScale = tgConflictMul(clash.level);
    var levelNote = clash.level === 'internal' ? '(内在矛盾·阴阴冲,冲力×0.7)' : '';
    if (stemInHe[clash.i] || stemInHe[clash.j]) {
      // 一方被合，冲力减半
      var baseMul = 1 - (1 - 0.75) * conflictScale; // 75% base, 内在更温和
      var partialNote = '(一方被合，冲力减半)' + levelNote;
    } else {
      var baseMul = 1 - (1 - 0.70) * conflictScale; // 70% base
      var partialNote = levelNote;
    }
    var dFactor = distDecay(clash.i, clash.j);
    var mul_i = 1 - (1 - baseMul) * dFactor;
    var mul_j = mul_i;
    var noteExtra_i = '', noteExtra_j = '';
    // 防连乘：同一位置被多个冲命中
    if (!stemChongRecord[clash.i]) {
      stemChongRecord[clash.i] = { mul: mul_i, count: 1 };
    } else {
      var actual_mul_i = 1 - (1 - mul_i) * STEM_CHONG_MARGINAL;
      mul_i = actual_mul_i;
      stemChongRecord[clash.i].count++;
      noteExtra_i = '(第' + stemChongRecord[clash.i].count + '冲,边际递减)';
    }
    if (!stemChongRecord[clash.j]) {
      stemChongRecord[clash.j] = { mul: mul_j, count: 1 };
    } else {
      var actual_mul_j = 1 - (1 - mul_j) * STEM_CHONG_MARGINAL;
      mul_j = actual_mul_j;
      stemChongRecord[clash.j].count++;
      noteExtra_j = '(第' + stemChongRecord[clash.j].count + '冲,边际递减)';
    }
    stemMul[clash.i] *= mul_i;
    stemMul[clash.j] *= mul_j;
    var distNote = dFactor < 1 ? '(距离衰减' + Math.round((1 - dFactor) * 100) + '%)' : '';
    modNotes.push(TG[clash.t1] + TG[clash.t2] + '天干冲：' + TG[clash.t1] + '力量×' + mul_i.toFixed(2) + noteExtra_i + '，' + TG[clash.t2] + '力量×' + mul_j.toFixed(2) + noteExtra_j + distNote + partialNote);
  }

  // 重新计算修正后的V
  var V = [0, 0, 0, 0, 0];
  var details = []; // 记录每一项的变化

  // 天干部分
  for (var i = 0; i < 4; i++) {
    var t = stems[i];
    var w = stemTransform[i] ? stemTransform[i].targetWx : tgWx(t);
    var val = POS_WT[i] * stemMul[i];
    V[w] += val;
    if (stemMul[i] < 1.0 || stemTransform[i]) {
      var noteStr = stemTransform[i] ? '合化→' + WX[w] : (stemChongRecord[i] ? '天干冲' : '天干互绊');
      if (stemInHe[i] && stemChongRecord[i]) noteStr = '天干互绊+冲';
      details.push({ pos: ['年干', '月干', '日干', '时干'][i], char: TG[t], wx: WX[w], orig: (POS_WT[i]).toFixed(2), mul: stemMul[i].toFixed(2), final: val.toFixed(2), note: noteStr });
    }
  }

  // 地支藏干部分（含空亡衰减，定义1.13，会合填实规则）
  var kongWangNotes = [];
  for (var i = 0; i < 4; i++) {
    var d = branches[i];
    var cg = CANG_GAN[d];
    var posLabel = ['年支', '月支', '日支', '时支'][i];
    var isKongWang = (kongWang.indexOf(d) >= 0);
    // 会合填实：参与三会/三合/六合/半三合的空亡地支，空亡被强制消除
    var heShiTian = false;
    if (isKongWang) {
      var hasHeForKW = posRels[i]['三会'] || posRels[i]['三合'] || posRels[i]['六合'] || posRels[i]['半三合'];
      if (hasHeForKW) heShiTian = true;
    }
    var kwMul = (isKongWang && !heShiTian) ? KONG_WANG_EPS : 1.0;
    if (isKongWang && heShiTian) {
      kongWangNotes.push(DZ[d] + '(' + posLabel + ')空亡，但会合填实→空亡消除');
    } else if (isKongWang) {
      kongWangNotes.push(DZ[d] + '(' + posLabel + ')空亡，藏干力量×' + KONG_WANG_EPS);
    }
    if (branchTransform[i]) {
      // 合化成功 — 藏干按 ratio 部分转化为合化五行（三会1.0/三合0.85/半三合0.6）
      var targetW = branchTransform[i].targetWx;
      var tRatio = branchTransform[i].ratio || 1.0;
      for (var j = 0; j < cg.length; j++) {
        var origWx = tgWx(cg[j].t);
        var wxB = branchWxBoost[i] ? (branchWxBoost[i][origWx] || 1.0) : 1.0;
        var origVal = POS_WT[i + 4] * cg[j].w * branchMul[i] * kwMul * wxB;
        var toTarget = origVal * tRatio;
        var remain = origVal * (1 - tRatio);
        V[targetW] += toTarget;
        if (remain > 0.001) V[origWx] += remain;
      }
      var totalOrig = POS_WT[i + 4] * cg.reduce(function (s, c) { return s + c.w; }, 0);
      var totalFinal = totalOrig * branchMul[i] * kwMul;
      var ratioNote = tRatio < 1 ? '(' + Math.round(tRatio * 100) + '%→' + WX[targetW] + ',' + Math.round((1 - tRatio) * 100) + '%保留原气)' : '';
      details.push({ pos: posLabel, char: DZ[d], wx: WX[targetW], orig: totalOrig.toFixed(2), mul: (branchMul[i] * kwMul).toFixed(2), final: totalFinal.toFixed(2), note: '合化→' + WX[targetW] + ratioNote + (kwMul < 1 ? '(空亡)' : '') });
    } else {
      // 正常计算，乘以修正系数
      for (var j = 0; j < cg.length; j++) {
        var w = tgWx(cg[j].t);
        var origVal = POS_WT[i + 4] * cg[j].w;
        var wxB = branchWxBoost[i] ? (branchWxBoost[i][w] || 1.0) : 1.0;
        var val = origVal * branchMul[i] * kwMul * wxB;
        V[w] += val;
        if (branchMul[i] < 1.0 || kwMul < 1.0) {
          var cgLabel = ['本气', '中气', '余气'][j] || '余气';
          details.push({ pos: posLabel, char: DZ[d] + '·' + TG[cg[j].t], wx: WX[w], orig: origVal.toFixed(2), mul: (branchMul[i] * kwMul).toFixed(2), final: val.toFixed(2), note: cgLabel + (kwMul < 1 ? ' (空亡)' : '') });
        }
      }
    }
  }
  if (kongWangNotes.length) modNotes.push('空亡：' + kongWangNotes.join('、'));

  // 月令旺衰修正 (在修正后的V上)
  var ws = getSeasonWx(branches[1]);
  var Vmc = new Array(5);
  for (var w = 0; w < 5; w++) {
    var dist = (w - ws + 5) % 5;
    Vmc[w] = V[w] * WANG_SHUAI_MUL[dist];
  }

  // Clamp to 0
  for (var i = 0; i < 5; i++) if (Vmc[i] < 0) Vmc[i] = 0;

  return {
    V: V,           // 合冲刑害修正后的基础向量
    Vmc: Vmc,       // 再经月令修正的最终向量
    branchMul: branchMul,
    stemMul: stemMul,
    branchTransform: branchTransform,
    stemTransform: stemTransform,
    tgChongs: tgChongs,
    modNotes: modNotes,
    details: details,
    rels: rels       // V2.1.1: 暴露关系列表供宫位拓扑分析使用
  };
}

// ══════════════════════════════════════
// §6 DAY MASTER STRENGTH & TEN GODS
// ══════════════════════════════════════

function calcDayMasterStrength(Vstar, w0, branches, t0, H, kongWang) {
  // 同方 A(w0) = {w0, G^{-1}(w0)} (self + 印星)
  var wYin = wxFanSheng(w0); // 生我者
  var S_tong = (Vstar[w0] || 0) + (Vstar[wYin] || 0);

  // 旺衰修正: γ̄₀ 月令为提纲
  // 月令权重动态化：
  //   - 月令本气强且未空亡、未被合化 → 85%（传统提纲满权重）
  //   - 月支空亡 或 参与合化成其它五行 → 55%（提纲虚浮，权重下调）
  //   - 其它三支平分剩余
  var monthBranch = branches[1];
  var kw = kongWang || [];
  var monthKw = kw.indexOf(monthBranch) >= 0;
  // 月支参与合化的检测：简化判断（依赖上游 branchTransform 状态，如不可得则按非合化处理）
  var monthTransformed = false; // placeholder，实装时可由上游传入
  var MONTH_WT = (monthKw || monthTransformed) ? 0.55 : 0.85;
  var OTHER_WT = (1 - MONTH_WT) / 3;
  var gamma0 = 0;
  for (var i = 0; i < branches.length; i++) {
    var wt = (i === 1) ? MONTH_WT : OTHER_WT;
    gamma0 += gammaVal(t0, branches[i], true) * wt;
  }

  // ★ 燥土脆金 / 寒金不生水 — H值感知的印星生扶衰减
  // 物理逻辑：极端温度下，生克关系发生质变
  //   燥土脆金: w0=金(3), wYin=土(2), H>6时土的生扶逐渐失效
  //   湿土不克水: w0=水(4), wYin=金(3), H<-6时金的生扶也可能减弱(待扩展)
  var yinFactor = 1.0;
  if (H !== undefined && H !== null) {
    if (w0 === 3 && wYin === 2 && H > 6) {
      // 燥土脆金：H>6时土对金的生扶线性衰减，H≥30时完全失效
      yinFactor = Math.max(0, 1 - (H - 6) / 24);
    }
  }

  var S_tong_adj = Vstar[w0] * gamma0 + Vstar[wYin] * yinFactor;

  // 异方 O(w0)
  var S_yi = 0;
  for (var w = 0; w < 5; w++) {
    if (w !== w0 && w !== wYin) S_yi += (Vstar[w] || 0);
  }

  var r = S_tong_adj / (S_tong_adj + S_yi);

  // ★ 通根检测：传统命理"有根"定义 = 地支藏干中有日主同类五行（比劫），不是仅看长生状态
  // 例如庚金在未属"冠带"(γ=0.8) 但未土藏干是己丁乙，无金 → 庚金并未"通根"
  // 必须同时满足：① γ ≥ 0.7（长生/冠带/临官/帝旺）② 地支藏干中有日主同类五行
  // ★ 合化修正：若日主天干合化（如甲己化土），hasRoot 应按合化后的五行 (w0) 判断，非原天干
  var hasRoot = false;
  var rootInfo = [];
  var STAGE_NAMES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];
  var dmWxRoot = w0;
  for (var i = 0; i < branches.length; i++) {
    var gRoot = gammaVal(t0, branches[i], true);
    if (gRoot >= 0.7) {
      var cg = CANG_GAN[branches[i]];
      var hasSameWx = false;
      for (var cj = 0; cj < cg.length; cj++) {
        if (tgWx(cg[cj].t) === dmWxRoot) { hasSameWx = true; break; }
      }
      if (hasSameWx) {
        hasRoot = true;
        var stageIdx = changShengStage(t0, branches[i]);
        rootInfo.push(DZ[branches[i]] + '(' + STAGE_NAMES[stageIdx] + ')');
      }
    }
  }

  // ★ 假从格检测：虽有根但根被严重克破（V[同类+印]占比 < 8%）→ 允许入从格
  // 《滴天髓》"假从之象，亦有之" — 根虚到一定程度等同无根
  if (hasRoot && r < 0.10) {
    var tongV = (Vstar[w0] || 0) + (Vstar[wYin] || 0);
    var totalV = 0;
    for (var vi = 0; vi < 5; vi++) totalV += (Vstar[vi] || 0);
    var tongPct = totalV > 0 ? tongV / totalV : 0;
    if (tongPct < 0.08) {
      hasRoot = false; // 降级为"假从候选"
      rootInfo.push('(根虚小于8%，按无根处理·可入假从格)');
    }
  }

  return { r: r, gamma0: gamma0, S_tong: S_tong, S_tong_adj: S_tong_adj, S_yi: S_yi, yinFactor: yinFactor, name: strengthName(r), hasRoot: hasRoot, rootInfo: rootInfo };
}

// 五行旺衰向量
function calcGammaVector(branches) {
  var gv = [];
  for (var w = 0; w < 5; w++) {
    var tw = w * 2; // 阳干代表
    var sum = 0;
    for (var i = 0; i < branches.length; i++) sum += gammaVal(tw, branches[i], false);
    gv.push(sum / 4);
  }
  return gv;
}

// 十神: s = 2d + ρ
function shiShen(t0, t) {
  var d = (tgWx(t) - tgWx(t0) + 5) % 5;
  var rho = (t0 + t) % 2; // 同阴阳=0, 异阴阳=1
  return (2 * d + rho) % 10;
}

function shiShenName(s) { return SHI_SHEN[s]; }

// ══════════════════════════════════════
// §6b 宫位事件总线 (Palace Event Bus)
// ══════════════════════════════════════

// 宫位空间映射: 位置 → 人生领域
var PALACE_MAP = {
  0: { name: '年柱', period: '1-15岁(少年)', body: '头面', relative: '祖辈/父亲', palace: '祖业宫' },
  1: { name: '月柱', period: '16-30岁(青年)', body: '胸背', relative: '父母/兄弟', palace: '事业宫' },
  2: { name: '日柱', period: '31-45岁(壮年)', body: '腹腰', relative: '配偶', palace: '夫妻宫' },
  3: { name: '时柱', period: '46岁后(晚年)', body: '下肢', relative: '子女', palace: '子女宫' }
};

// 十神 → 六亲映射 (gender-aware)
// ss: 0比肩 1劫财 2食神 3伤官 4偏财 5正财 6七杀 7正官 8偏印 9正印
function ssToRelative(ss, gender) {
  var isMale = (gender === 1);
  var map = {
    0: '兄弟/同辈',
    1: '姐妹/竞争者',
    2: isMale ? '女儿/晚辈' : '儿子/晚辈',
    3: isMale ? '儿子/创造力' : '女儿/才华',
    4: isMale ? '父亲/偏财运' : '婆婆/偏财运',
    5: isMale ? '妻子/正财运' : '公公/正财运',
    6: isMale ? '小人/压力' : '偏夫/情人',
    7: isMale ? '上司/权威' : '丈夫/正缘',
    8: '偏贵人/副业',
    9: '母亲/正贵人'
  };
  return map[ss] || '';
}

// 生成命局事件报告
function generateLifeEvents(pillars, dzEffects, strength, gender, hiddenPillars) {
  var events = []; // {level:'warn'|'alert'|'good', palace:string, desc:string}
  var t0 = pillars.dayMaster;
  var notes = dzEffects.modNotes;
  var branchMul = dzEffects.branchMul;

  var reported = {}; // 去重: palace+level → true

  // ── 1. 扫描六冲事件 → 宫位损害 ──
  for (var i = 0; i < notes.length; i++) {
    var n = notes[i];
    // 检测衰神冲旺
    if (n.indexOf('衰神冲旺') >= 0) {
      // 解析涉及的位置
      var posNames = ['年支', '月支', '日支', '时支'];
      for (var p = 0; p < 4; p++) {
        var rk1 = 'annihil_' + p;
        if (branchMul[p] < 0.2 && !reported[rk1]) {
          reported[rk1] = true;
          var pm = PALACE_MAP[p];
          var mainT = CANG_GAN[pillars.branches[p]][0].t;
          var ss = shiShen(t0, mainT);
          var relName = ssToRelative(ss, gender);
          events.push({
            level: 'alert', palace: pm.palace,
            desc: pm.palace + '（' + pm.relative + '）受到强烈压制，' + DZ[pillars.branches[p]] + '力量被大幅削弱（×' + branchMul[p].toFixed(2) + '）。' + shiShenName(ss) + '星（' + relName + '）能量失稳，' + pm.period + '阶段此宫相关领域宜稳守、多沟通、勿强求。'
          });
        }
      }
      // 强方：爆发事件
      for (var p = 0; p < 4; p++) {
        var rk2 = 'surge_' + p;
        if (branchMul[p] >= 0.9 && !reported[rk2] && n.indexOf(PALACE_MAP[p].name.charAt(0) + '支') >= 0 && n.indexOf('×0.95') >= 0) {
          reported[rk2] = true;
          var pm = PALACE_MAP[p];
          var mainT2 = CANG_GAN[pillars.branches[p]][0].t;
          var ss2 = shiShen(t0, mainT2);
          events.push({
            level: 'warn', palace: pm.palace,
            desc: pm.palace + '旺神受冲反激，' + WX[tgWx(mainT2)] + '气偏旺。' + shiShenName(ss2) + '星能量充沛，' + pm.period + '注意刚柔并济，避免过度用力反伤自身。'
          });
        }
      }
    }
    // 检测普通六冲（非衰神冲旺）
    else if (n.indexOf('六冲') >= 0 && n.indexOf('土冲土') < 0 && n.indexOf('衰神') < 0) {
      for (var p = 0; p < 4; p++) {
        var rk3 = 'clash_' + p;
        if (branchMul[p] < 0.6 && !reported[rk3]) {
          reported[rk3] = true;
          var pm = PALACE_MAP[p];
          var mainT3 = CANG_GAN[pillars.branches[p]][0].t;
          var ss3 = shiShen(t0, mainT3);
          var relName3 = ssToRelative(ss3, gender);
          events.push({
            level: 'warn', palace: pm.palace,
            desc: pm.palace + '受六冲震荡（×' + branchMul[p].toFixed(2) + '）。' + shiShenName(ss3) + '星（' + relName3 + '）不稳，' + pm.period + '多变动。'
          });
        }
      }
    }
    // 土冲土：激增事件（正面）
    else if (n.indexOf('土冲土激增') >= 0) {
      for (var p = 0; p < 4; p++) {
        var pm = PALACE_MAP[p];
        var rk4 = 'earth_' + p;
        if (n.indexOf(pm.name.charAt(0) + '支') >= 0 && !reported[rk4]) {
          reported[rk4] = true;
          events.push({
            level: 'good', palace: pm.palace,
            desc: pm.palace + '土冲土翻松激增，' + pm.relative + '方面根基越冲越旺。'
          });
        }
      }
    }
  }

  // ── 2. 扫描合化事件 → 宫位转化 ──
  for (var p = 0; p < 4; p++) {
    if (dzEffects.branchTransform[p] && dzEffects.branchTransform[p].transform) {
      var pm = PALACE_MAP[p];
      var targetWx = dzEffects.branchTransform[p].targetWx;
      events.push({
        level: 'good', palace: pm.palace,
        desc: pm.palace + '合化成' + WX[targetWx] + '，' + pm.relative + '关系发生质变，' + pm.period + '有转机。'
      });
    }
  }

  // ── 3. 日主合化变身 ──
  if (dzEffects.stemTransform && dzEffects.stemTransform[2]) {
    events.push({
      level: 'alert', palace: '夫妻宫',
      desc: '日主天干合化变身（' + WX[pillars.dayMasterWxOrig || tgWx(t0)] + '→' + WX[dzEffects.stemTransform[2].targetWx] + '），人生底色发生根本转变。'
    });
  }

  // ── 4. 夫妻宫特别关注 ──
  if (branchMul[2] < 0.3 && events.filter(function (e) { return e.palace === '夫妻宫' && e.level === 'alert'; }).length === 0) {
    events.push({
      level: 'alert', palace: '夫妻宫',
      desc: '日支力量大幅受损（×' + branchMul[2].toFixed(2) + '），感情关系更易起伏，沟通磨合是关键，不宜仓促决定重大情感变动。'
    });
  } else if (branchMul[2] < 0.6 && events.filter(function (e) { return e.palace === '夫妻宫'; }).length === 0) {
    events.push({
      level: 'warn', palace: '夫妻宫',
      desc: '日支受冲刑（×' + branchMul[2].toFixed(2) + '），感情多波折，需经营维护。'
    });
  }

  // ── 5. 空亡宫位提示 ──
  var kwSet = {};
  if (pillars.kongWang) for (var k = 0; k < pillars.kongWang.length; k++) kwSet[pillars.kongWang[k]] = true;
  for (var p = 0; p < 4; p++) {
    if (kwSet[pillars.branches[p]] && branchMul[p] < 0.15) {
      var pm = PALACE_MAP[p];
      events.push({
        level: 'warn', palace: pm.palace,
        desc: pm.palace + DZ[pillars.branches[p]] + '空亡且力量极弱，' + pm.relative + '缘分淡薄。'
      });
    }
  }

  // ── 6. 跨宫六冲拓扑预警 (V2.1.1) ──
  // 物理逻辑: 六冲不仅损害单个宫位，更重要的是两宫之间的"社会关系断裂"
  // 例: 日支(夫妻宫)冲年支(祖业宫) → 婚姻受长辈干预 / 婚后离祖居
  if (dzEffects.rels) {
    // 跨宫冲的社会学文案库: key = 'posA_posB' (小→大排序)
    var CROSS_CHONG_MAP = {
      '0_2': {  // 年支↔日支: 祖业宫↔夫妻宫
        warn: '长辈宫与夫妻宫产生能量张力，婚姻可能受长辈看法影响，或婚后倾向异地发展',
        alert: '长辈宫与夫妻宫对冲显著，婚姻与原生家庭的磨合更明显，提前沟通边界有助长期稳定'
      },
      '0_1': {  // 年支↔月支: 祖业宫↔事业宫
        warn: '祖业宫与事业宫能量对冲，祖辈基业难以直接延续，事业方向倾向与家族传统不同',
        alert: '祖业宫与事业宫对冲显著，青年期更宜凭己力开拓新路，家族资源借鉴但不依赖'
      },
      '0_3': {  // 年支↔时支: 祖业宫↔子女宫
        warn: '祖业宫与子女宫远距共振，祖辈与后代之间缘分偏淡，隔代关系需主动经营',
        alert: '祖业宫与子女宫对冲显著，家族传承方式更可能由子女一代主动重塑'
      },
      '1_2': {  // 月支↔日支: 事业宫↔夫妻宫
        warn: '事业宫与夫妻宫产生内部张力，事业与家庭难以兼顾，工作繁忙易影响感情',
        alert: '事业宫与夫妻宫对冲显著，职业变动期更宜预留与伴侣沟通的时间'
      },
      '1_3': {  // 月支↔时支: 事业宫↔子女宫
        warn: '事业宫与子女宫能量对冲，事业发展期与养育期互相掣肘',
        alert: '事业宫与子女宫对冲显著，职业巅峰期需要意识地为亲子时间留出空间'
      },
      '2_3': {  // 日支↔时支: 夫妻宫↔子女宫
        warn: '夫妻宫与子女宫能量拉扯，配偶与子女之间关系微妙，需注意平衡',
        alert: '夫妻宫与子女宫对冲显著，婚后对子女的期待与伴侣可能存在分歧，需共识前置'
      }
    };
    for (var ri = 0; ri < dzEffects.rels.length; ri++) {
      var rel = dzEffects.rels[ri];
      if (rel.type !== '六冲') continue;
      var posA = Math.min(rel.i, rel.j);
      var posB = Math.max(rel.i, rel.j);
      var crossKey = posA + '_' + posB;
      var crossEntry = CROSS_CHONG_MAP[crossKey];
      if (!crossEntry) continue;
      var rkCross = 'cross_' + crossKey;
      if (reported[rkCross]) continue;
      reported[rkCross] = true;
      // 判断严重程度: 任一方 branchMul < 0.3 → alert, 否则 warn
      var severeA = branchMul[posA] < 0.3;
      var severeB = branchMul[posB] < 0.3;
      var crossLevel = (severeA || severeB) ? 'alert' : 'warn';
      var pmA = PALACE_MAP[posA], pmB = PALACE_MAP[posB];
      var crossText = crossEntry[crossLevel];
      // 附加距离信息: 年日冲(d=2)为远距，相邻冲(d=1)为近距
      var dist = posB - posA;
      var distTag = dist >= 2 ? '（远距冲·力度衰减但影响深远）' : '';
      events.push({
        level: crossLevel,
        palace: pmA.palace + '↔' + pmB.palace,
        desc: crossText + distTag
      });
    }
  }

  // ── 7. 暗物质节点补完提示 ──
  if (hiddenPillars) {
    var hcResult = detectHiddenCombos(pillars.branches, hiddenPillars);
    var hcNotes = hcResult.notes;
    for (var h = 0; h < hcNotes.length; h++) {
      events.push({
        level: 'good', palace: '暗物质',
        desc: hcNotes[h].desc + '，暗中增强' + WX[hcNotes[h].wx] + '气场。'
      });
    }
  }

  // ── 7. 燥土脆金警告 ──
  if (pillars.dayMasterWx === 3) { // 金日主
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].indexOf && notes[i].indexOf('yinFactor') >= 0) {
        events.push({
          level: 'alert', palace: '全局',
          desc: '燥土脆金：命局过燥(H值过高)，印星(土)无法生扶日主(金)，金在烈火中熔化。'
        });
        break;
      }
    }
  }

  // ── 8. 神煞×大运×格局联合推演 ──
  var shenShaList = calcShenSha(pillars);

  // 8a: 驿马检测 → 如果命带驿马，提示地域变动
  var yiMaCount = 0;
  for (var si = 0; si < shenShaList.length; si++) {
    if (shenShaList[si].name === '驿马') yiMaCount++;
  }
  // 检测夫妻宫(日支)是否有冲
  var dayBranchChong = false;
  for (var bi = 0; bi < 4; bi++) {
    if (bi === 2) continue;
    if ((pillars.branches[2] + 6) % 12 === pillars.branches[bi] || (pillars.branches[bi] + 6) % 12 === pillars.branches[2]) {
      dayBranchChong = true; break;
    }
  }

  if (yiMaCount > 0) {
    if (yiMaCount >= 2 && dayBranchChong) {
      // P1: 驿马重重+夫妻宫冲→主动应动建议
      events.push({
        level: 'warn', palace: '全局·婚姻',
        desc: '驿马重重（' + yiMaCount + '颗）且夫妻宫受冲，一生多迁徙变动，婚姻亦易因异地产生波折。' +
          '命理建议：通过"主动应动"化解——如跨国/跨城业务、分居两地办公、定期旅行等，' +
          '主动消耗驿马冲动之能量，避免被动遭遇突发变动。驿马与冲同论，不动则冲，主动则吉。'
      });
    } else if (yiMaCount >= 2) {
      events.push({
        level: 'warn', palace: '全局',
        desc: '驿马重重（' + yiMaCount + '颗），一生多迁徙变动。大运走比劫时，易因合伙、创业而奔波异地。' +
          '建议主动规划异地发展，以"动中求财"为策略。'
      });
    } else {
      events.push({
        level: 'warn', palace: '全局',
        desc: '命带驿马星，一生多迁徙变动。大运走比劫时，易因合伙、创业而奔波异地。建议提前规划异地资源。'
      });
    }
  }

  // 8b: 日主弱 → 职业倦怠预警
  var dm8 = pillars.dayMaster;
  var dmWx8 = tgWx(dm8);
  var pianCaiWx8 = (dmWx8 + 2) % 5; // 日主所克 = 财星
  if (strength.r < 0.5) {
    events.push({
      level: 'warn', palace: '全局',
      desc: '日主' + TG[dm8] + '偏弱（r*=' + strength.r.toFixed(2) + '），财星（' + WX[pianCaiWx8] + '）消耗精力。长期恐有职业倦怠风险，建议定期休整、培养印星（学习/贵人）资源。'
    });
  }

  // 8c: 华盖 → 艺术/孤独提示
  for (var si = 0; si < shenShaList.length; si++) {
    if (shenShaList[si].name === '华盖') {
      events.push({
        level: 'good', palace: '全局',
        desc: '命带华盖星，天赋异禀，适合文艺、学术、宗教、技术等需要独立思考的领域。但华盖也主孤高，注意维护社交关系。'
      });
      break;
    }
  }

  // 8d: 天乙贵人 → 贵人运提示
  for (var si = 0; si < shenShaList.length; si++) {
    if (shenShaList[si].name === '天乙贵人') {
      events.push({
        level: 'good', palace: shenShaList[si].pos || '全局',
        desc: '命带天乙贵人（' + shenShaList[si].pos + '），一生多得贵人相助。遇困难时主动求助，往往能逢凶化吉。'
      });
      break;
    }
  }

  return events;
}

// ══════════════════════════════════════
// §7 PATTERN & USEFUL GOD
// ══════════════════════════════════════

function determinePattern(pillars, t0) {
  var d_month = pillars.branches[1];
  var cg = CANG_GAN[d_month];
  var mainStem = cg[0].t;
  var mainSS = shiShen(t0, mainStem);

  // 建禄格 / 阳刃格 优先判定 (定义5.12)
  // 禄(临官): 甲寅 乙卯 丙巳 丁午 戊巳 己午 庚申 辛酉 壬亥 癸子
  var LU_MAP = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  // 阳刃(帝旺, 仅阳干): 甲卯 丙午 戊午 庚酉 壬子
  var YANG_REN_MAP = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };
  if (mainSS === 0 || mainSS === 1) {
    // 阳刃格优先于建禄格（阳刃力量更大）
    if (t0 % 2 === 0 && YANG_REN_MAP[t0] === d_month) {
      return { ss: mainSS, name: '阳刃格', stem: mainStem, special: '阳刃' };
    }
    if (LU_MAP[t0] === d_month) {
      return { ss: mainSS, name: '建禄格', stem: mainStem, special: '建禄' };
    }
    // Check 透出算子: any hidden stem of month branch transparent in the four stems?
    var otherStems = [pillars.stems[0], pillars.stems[1], pillars.stems[3]]; // exclude day master
    for (var k = 0; k < cg.length; k++) {
      if (otherStems.indexOf(cg[k].t) >= 0) {
        var ss = shiShen(t0, cg[k].t);
        if (ss !== 0 && ss !== 1) return { ss: ss, name: shiShenName(ss) + '格', stem: cg[k].t };
      }
    }
    // Fall back to 中气
    if (cg.length > 1) {
      var ss2 = shiShen(t0, cg[1].t);
      return { ss: ss2, name: shiShenName(ss2) + '格', stem: cg[1].t };
    }
  }
  return { ss: mainSS, name: shiShenName(mainSS) + '格', stem: mainStem };
}

function selectUsefulGod(w0, r, Vstar, ws, H, hasRoot, stems, branches) {
  var result = { primary: null, secondary: null, enemy: null, weights: [0, 0, 0, 0, 0], candidates: [], specialPattern: null };

  var wGuanSha = (w0 + 3) % 5; // 官杀 G^{-2}(w0)
  var wShiShang = wxSheng(w0); // 食伤 G(w0)
  var wCai = (w0 + 2) % 5; // 财星 G^2(w0)
  var wYin = wxFanSheng(w0); // 印星 G^{-1}(w0)

  // 特殊格局检测 (定义5.13-5.15)
  // ★ 通根安全阀：日主有通根(长生/冠带/临官/帝旺)时，绝不入从格
  // 传统命理铁律："从格必须无根"——有根再弱也是身弱硬抗，不可弃命从势
  if (r < 0.15 && !hasRoot) {
    // 从格: 弃命从势，取最强五行为用神（仅在真正无根时触发）
    var wMax = 0;
    for (var w = 1; w < 5; w++) if (Vstar[w] > Vstar[wMax]) wMax = w;
    result.primary = wMax;
    var congType = '';
    // 从势格判定: 异方(食伤+财+官杀)中无单一力量超过60%，则为从势格
    var yiFang = Vstar[wShiShang] + Vstar[wCai] + Vstar[wGuanSha];
    var maxRatio = yiFang > 0 ? Vstar[wMax] / yiFang : 1;
    if (maxRatio < 0.6 && wMax !== w0 && wMax !== wYin) {
      congType = '从势格';
    } else if (wMax === wCai) congType = '从财格';
    else if (wMax === wGuanSha) congType = '从杀格';
    else if (wMax === wShiShang) congType = '从儿格';
    else congType = '从格';
    result.specialPattern = congType;
    // §Issue4: 从格忌神按类型细分
    // 从财格：最忌比劫(争财)，次忌印(生身破从)
    // 从杀格：最忌食伤(制杀破格)，次忌印(化杀)
    // 从儿格：最忌印(夺食伤)，次忌官杀(克身引发矛盾)
    // 从势格：忌印和比劫(逆势扶身)
    if (congType === '从财格') result.enemy = w0; // 比劫争财
    else if (congType === '从杀格') result.enemy = wShiShang; // 食伤制杀破格
    else if (congType === '从儿格') result.enemy = wYin; // 印夺食
    else result.enemy = wYin; // 从势格/通用: 忌印
    result.candidates = [{ w: wMax, p: 0.7, name: WX[wMax] + '(' + congType + '·从势)' },
    { w: wShiShang, p: 0.2, name: WX[wShiShang] + '(泄秀)' }];
  } else if (r > 0.85) {
    // 专旺格: 顺势泄秀 (定义5.15)
    // 《滴天髓》："独象喜行财地，而财神要旺"
    var wangNames = ['曲直格', '炎上格', '稼穑格', '从革格', '润下格'];
    result.specialPattern = wangNames[w0];
    result.primary = wShiShang; // 食伤泄秀
    result.secondary = wYin; // 或印星顺势
    result.enemy = wGuanSha; // 忌官杀犯旺
    result.candidates = [{ w: wShiShang, p: 0.6, name: WX[wShiShang] + '(' + wangNames[w0] + '·泄秀)' },
    { w: wYin, p: 0.2, name: WX[wYin] + '(助势)' }];
  }

  // ══════════════════════════════════════
  // §5.16 两神成象格检测 (Two-Element Image Pattern)
  // ══════════════════════════════════════
  // 《滴天髓》原文："两气合而成象，象不可破也。"
  // 徐注："两气合而成象，谓干支各半，气势相均，有相生及相剋两类。"
  // 条件：(1) 两五行合计占总力量75%以上 (2) 两者比例不超过2:1 (3) 非特殊格局
  // 相生成象：木火通明、火土成慈、土金毓秀、金水相涵、水木清华
  // 相克成象：金木交战取火通关、木土相争取火泄木生土、水火既济取木通关…
  if (!result.specialPattern) {
    var totalV = 0;
    for (var w = 0; w < 5; w++) totalV += Vstar[w];
    if (totalV > 0) {
      var sorted5 = [];
      for (var w = 0; w < 5; w++) sorted5.push({ w: w, v: Vstar[w], pct: Vstar[w] / totalV });
      sorted5.sort(function (a, b) { return b.v - a.v; });
      var s1 = sorted5[0], s2 = sorted5[1];
      var twoPct = s1.pct + s2.pct;
      var ratio12 = s2.v > 0 ? s1.v / s2.v : 99;

      // 两神占总量75%以上，且比例在2:1以内
      if (twoPct >= 0.75 && ratio12 <= 2.0 && ratio12 >= 0.5) {
        var d12 = (s2.w - s1.w + 5) % 5;
        var xiangsheng = (d12 === 1 || d12 === 4); // 相生关系
        var xiangke = (d12 === 2 || d12 === 3);   // 相克关系

        // ── 相生成象（最佳格局）──
        // 《滴天髓》："两气成象...象不可破也"
        if (xiangsheng) {
          var shengNames = {
            '01': '水木清华', '10': '水木清华',  // 木+水(水生木)
            '12': '木火通明', '21': '木火通明',  // 木+火(木生火)
            '23': '火土成慈', '32': '火土成慈',  // 火+土(火生土)
            '34': '土金毓秀', '43': '土金毓秀',  // 土+金(土生金)
            '40': '金水相涵', '04': '金水相涵'   // 金+水(金生水)
          };
          var pairKey = '' + s1.w + s2.w;
          var xiangName = shengNames[pairKey] || '两神成象';
          result.specialPattern = xiangName;
          // 两神成象取泄秀五行为用（被生方再生的五行）
          // 如木火通明→取土泄火；金水相涵→取木泄水
          var shengFang = d12 === 1 ? s1.w : s2.w; // 被生方
          var xieWx = wxSheng(shengFang); // 泄秀五行
          // 也喜被克方（财星）作为化气出口
          result.primary = xieWx;
          result.enemy = (w0 + 3) % 5; // 忌破象之五行（克局中较弱一方的五行）
          var keFang = d12 === 1 ? s2.w : s1.w; // 生方（较弱一端）
          var poXiang = (keFang + 3) % 5; // 克生方的五行 = 破象
          result.enemy = poXiang;
          result.candidates = [
            { w: xieWx, p: 0.5, name: WX[xieWx] + '(' + xiangName + '·泄秀)' },
            { w: shengFang, p: 0.3, name: WX[shengFang] + '(顺象)' }
          ];
        }

        // ── 相克成象（需通关）──
        // 《滴天髓》："两神...相剋两类...忌剋其象之连"
        // 相克成象格局较低，需要通关五行调和
        if (xiangke) {
          var attacker = d12 === 2 ? s1.w : s2.w; // 克方
          var defender = d12 === 2 ? s2.w : s1.w; // 被克方
          var bridge = wxSheng(attacker); // 通关五行=克方所生
          result.specialPattern = WX[attacker] + WX[defender] + '相战成象';
          result.primary = bridge;
          result.enemy = null; // 相克成象不宜简单定忌神
          result.candidates = [
            { w: bridge, p: 0.6, name: WX[bridge] + '(通关化解' + WX[attacker] + WX[defender] + '交战)' },
            { w: wxSheng(defender), p: 0.2, name: WX[wxSheng(defender)] + '(泄' + WX[defender] + ')' }
          ];
        }
      }
    }
  }
  // END 两神成象格
  // ══════════════════════════════════════

  if (result.specialPattern) {
    // 特殊格局已确定（从格/专旺/两神成象），跳过常规取用
  } else if (r < 0.45) {
    // 身弱: 首选印星，次选比劫 (定义5.6)
    result.primary = wYin; // 印星 (生我)
    result.secondary = w0; // 比劫 (同我)
    result.enemy = wGuanSha; // 官杀 (克我的五行)
    result.candidates = [{ w: result.primary, p: 0.6, name: WX[result.primary] + '(印星)' },
    { w: result.secondary, p: 0.2, name: WX[result.secondary] + '(比劫)' }];
  } else if (r > 0.55) {
    // 身强: 首选官杀，次选食伤，再次财星 (定义5.6)
    result.primary = wGuanSha; // 官杀(克我)
    result.secondary = wShiShang; // 食伤(泄我)
    result.enemy = wYin; // 印星(生身为忌)
    // 检查官杀在命局中是否有力
    var guanShaV = Vstar[wGuanSha] || 0;
    if (guanShaV < 0.3) {
      // 官杀无力，改用食伤泄秀
      // §Issue5: 食伤生财格局加分——如果食伤→财形成流通链，财星额外加分
      var caiV = Vstar[wCai] || 0;
      var ssV = Vstar[wShiShang] || 0;
      var totalVs = 0; for (var wi = 0; wi < 5; wi++) totalVs += Vstar[wi];
      var caiBoost = 0.2;
      // 食伤和财都有力(各占>10%)→"食伤生财"致富格局
      if (totalVs > 0 && ssV / totalVs > 0.10 && caiV / totalVs > 0.10) {
        caiBoost = 0.35;
        result.shiShangShengCai = true;
      }
      result.candidates = [{ w: wShiShang, p: 0.5, name: WX[wShiShang] + '(食伤泄秀)' },
      { w: wCai, p: caiBoost, name: WX[wCai] + (result.shiShangShengCai ? '(食伤生财)' : '(财星)') },
      { w: wGuanSha, p: 0.1, name: WX[wGuanSha] + '(官杀，力弱)' }];
    } else {
      result.candidates = [{ w: wGuanSha, p: 0.4, name: WX[wGuanSha] + '(官杀克制)' },
      { w: wShiShang, p: 0.3, name: WX[wShiShang] + '(食伤泄秀)' },
      { w: wCai, p: 0.1, name: WX[wCai] + '(财星)' }];
    }
  } else {
    // 中和(0.45~0.55): flexible，取食伤泄秀为主
    result.primary = wShiShang;
    result.secondary = wYin;
    // §Issue2: 中和命局忌神——取命局中最过旺且非用神的五行为忌
    var zhTotalV = 0; for (var wi = 0; wi < 5; wi++) zhTotalV += Vstar[wi];
    var zhMaxW = -1, zhMaxV = 0;
    for (var wi = 0; wi < 5; wi++) {
      if (wi === wShiShang || wi === wYin) continue; // 跳过用神/喜神
      if (Vstar[wi] > zhMaxV) { zhMaxV = Vstar[wi]; zhMaxW = wi; }
    }
    result.enemy = zhMaxW >= 0 && zhTotalV > 0 && zhMaxV / zhTotalV > 0.25 ? zhMaxW : null;
    result.candidates = [{ w: result.primary, p: 0.4, name: WX[result.primary] + '(食伤)' },
    { w: result.secondary, p: 0.3, name: WX[result.secondary] + '(印星)' }];
  }

  // ══════════════════════════════════════
  // §5.18 泄秀格局保护 (Elegant Flow Preservation)
  // ══════════════════════════════════════
  // 《滴天髓》："金水伤官喜见官，因格局清奇而贵。"
  // 《穷通宝鉴》："庚金遇壬水...秀气流行，忌土塞流。"
  // 核心原理：身弱但食伤成秀（透干有力），命局灵气在于日主→食伤的流通。
  //   印星虽能生扶日主，但印必克食伤（枭印夺食），堵塞灵气。
  //   比劫助身则日主强后更能生食伤，流通不断，灵气更甚。
  // 判定条件：
  //   (1) 身弱但非从格 (0.15 ≤ r < 0.50)
  //   (2) 食伤五行力量占比 ≥ 18%
  //   (3) 食伤透天干（有根基，非虚浮）
  // 效果：比劫权重大幅提升，印星权重下调并附注"印来浊格"
  if (!result.specialPattern && r >= 0.15 && r < 0.50) {
    var xieWx = wShiShang; // 食伤五行 = G(w0)
    var xieV = Vstar[xieWx] || 0;
    var totalVxie = 0;
    for (var w = 0; w < 5; w++) totalVxie += Vstar[w];
    var xiePct = totalVxie > 0 ? xieV / totalVxie : 0;

    // 食伤是否透干
    var xieTouGan = false;
    if (stems) {
      for (var si = 0; si < 4; si++) {
        if (si === 2) continue;
        if (tgWx(stems[si]) === xieWx) xieTouGan = true;
      }
    }

    if (xiePct >= 0.18 && xieTouGan) {
      // ── 泄秀格局确认 ──
      // 比劫(w0)→提升为首选：助身不堵流，金生水/木生火/...
      // 印星(wYin)→降级：虽助身但克食伤，灵气受损
      var biIdx = result.candidates.findIndex(function (c) { return c.w === w0; });
      var yinIdx = result.candidates.findIndex(function (c) { return c.w === wYin; });

      if (yinIdx >= 0 && biIdx >= 0) {
        // 互换权重：比劫成为首选，印星降为辅助
        var oldBiP = result.candidates[biIdx].p;
        var oldYinP = result.candidates[yinIdx].p;
        result.candidates[biIdx].p = Math.max(oldBiP, oldYinP) + 0.10;
        result.candidates[biIdx].name = WX[w0] + '(比劫·护秀)';
        result.candidates[yinIdx].p = Math.min(oldBiP, oldYinP) * 0.5;
        result.candidates[yinIdx].name = WX[wYin] + '(印星·浊格)';
      } else if (biIdx < 0 && yinIdx >= 0) {
        // 比劫不在候选集中，添加并调整
        result.candidates.push({ w: w0, p: result.candidates[yinIdx].p + 0.10, name: WX[w0] + '(比劫·护秀)' });
        result.candidates[yinIdx].p *= 0.5;
        result.candidates[yinIdx].name = WX[wYin] + '(印星·浊格)';
      }

      // 食伤本身也可适度作为喜神（顺势而泄）
      var xieIdx = result.candidates.findIndex(function (c) { return c.w === xieWx; });
      if (xieIdx < 0) {
        result.candidates.push({ w: xieWx, p: 0.10, name: WX[xieWx] + '(食伤·秀气)' });
      }

      result.primary = w0;
      result.secondary = xieWx;
      // 忌神：不变（官杀仍克身），但印星也需警惕
      result.xieXiuNote = '泄秀格局——' + WX[w0] + '身弱但' + WX[xieWx] + '(食伤)成秀透干(占比' +
        Math.round(xiePct * 100) + '%)，喜' + WX[w0] + '(比劫)助身护秀，忌' + WX[wYin] +
        '(印星)克' + WX[xieWx] + '堵流。印来虽能助身，但折损灵气，最多得浊富。';
      result.xieXiuData = { xieWx: xieWx, xiePct: xiePct, biW: w0, yinW: wYin };
    }
  }
  // END 泄秀格局保护

  // ══════════════════════════════════════
  // §5.19 印旺夺食保护 (Seal-Overwhelms-Food Protection)
  // ══════════════════════════════════════
  // 《子平真诠》："枭印夺食，最为凶害。"
  // 身强用食伤泄秀时，若印星极旺，印必克食伤（火克金、土克水...），
  // 泄秀被堵塞。此时需要财星来克制印星，保护食伤的泄秀功能。
  // 判定条件：
  //   (1) 身强 (r > 0.55)，非特殊格局
  //   (2) 食伤为首选/次选用神（食伤在候选集中且权重较高）
  //   (3) 印星力量占比 ≥ 22%（印旺到足以威胁食伤）
  // 效果：财星权重提升（财克印→护食伤），并附注说明
  if (!result.specialPattern && r > 0.55) {
    var yinV = Vstar[wYin] || 0;
    var totalVyin = 0;
    for (var wi = 0; wi < 5; wi++) totalVyin += Vstar[wi];
    var yinPct = totalVyin > 0 ? yinV / totalVyin : 0;

    // 食伤是否在候选集中且权重较高
    var ssInCand = result.candidates.findIndex(function (c) { return c.w === wShiShang; });
    var ssIsTop = ssInCand >= 0 && result.candidates[ssInCand].p >= 0.25;

    if (yinPct >= 0.22 && ssIsTop) {
      // 印旺夺食确认——需要财星克印保护食伤
      var caiIdx = result.candidates.findIndex(function (c) { return c.w === wCai; });
      var caiBoostAmt = 0.20 + (yinPct - 0.22) * 0.5; // 印越旺，财的需求越大
      caiBoostAmt = Math.min(caiBoostAmt, 0.40);

      if (caiIdx >= 0) {
        result.candidates[caiIdx].p += caiBoostAmt;
        result.candidates[caiIdx].name = WX[wCai] + '(财制印·护食伤)';
      } else {
        result.candidates.push({ w: wCai, p: caiBoostAmt, name: WX[wCai] + '(财制印·护食伤)' });
      }

      result.yinDuoShiNote = '印旺夺食——' + WX[wYin] + '(印星)占比' + Math.round(yinPct * 100) +
        '%极旺，会克制' + WX[wShiShang] + '(食伤)的泄秀功能。需' + WX[wCai] +
        '(财星)克印护食，保障才华输出。';
      result.yinDuoShiData = { yinW: wYin, yinPct: yinPct, caiW: wCai, ssW: wShiShang };
    }
  }
  // END 印旺夺食保护

  // ══════════════════════════════════════
  // §5.7 通关十神化取用 (Mediation with ShiShen Perspective)
  // ══════════════════════════════════════
  // 《滴天髓》原文："关内有织女，关外有牛郎。此关若通也，相邀入洞房。"
  // 传统通关只看五行克战；十神化后可精准判断：
  //   官杀vs食伤 → 印星通关（化杀生身，印能制食伤之过）
  //   财星vs印星 → 官杀通关（官能泄财生印，或比劫助印制财）
  //   比劫vs官杀 → 食伤通关（泄比生财弱化克战）
  // 通关成功 → 格局大幅提升；通关失败 → 两败俱伤
  if (!result.specialPattern && r >= 0.35 && r <= 0.65) {
    var sorted = [];
    for (var w = 0; w < 5; w++) sorted.push({ w: w, v: Vstar[w] });
    sorted.sort(function (a, b) { return b.v - a.v; });
    var top1 = sorted[0], top2 = sorted[1];
    var totalV = 0; for (var w = 0; w < 5; w++) totalV += Vstar[w];
    // 两强：前二占总量60%+且互克
    if (top1.v + top2.v > totalV * 0.6) {
      var d12 = (top2.w - top1.w + 5) % 5;
      if (d12 === 2 || d12 === 3) { // 互克关系
        var attacker = d12 === 2 ? top1.w : top2.w; // 克方
        var defender = d12 === 2 ? top2.w : top1.w; // 被克方
        var bridge = wxSheng(attacker); // 基础通关=G(克方), 泄克方生被克方

        // ── 十神化精准通关 ──
        // 根据日主与交战双方的十神关系选择最优通关策略
        var atkSS = (tgWx(attacker * 2) === w0) ? -1 : shiShen(w0 * 2, attacker * 2); // 简化: 用阳干计算十神类别
        var defSS = (tgWx(defender * 2) === w0) ? -1 : shiShen(w0 * 2, defender * 2);
        var tongguanNote = '';

        // 官杀(克我) vs 食伤(我生) 交战 → 取印星通关
        // 印能化杀生身，同时克制过旺食伤
        if ((attacker === (w0 + 3) % 5 || defender === (w0 + 3) % 5) && (attacker === wxSheng(w0) || defender === wxSheng(w0))) {
          bridge = wxFanSheng(w0); // 印星五行
          tongguanNote = '官杀与食伤交战→取印星通关（印能化杀，又制食伤之过）';
        }
        // 财星(我克) vs 印星(生我) 交战 → 取官杀通关
        // 官能泄财之气转生印，调和财印之争
        else if ((attacker === (w0 + 2) % 5 || defender === (w0 + 2) % 5) && (attacker === wxFanSheng(w0) || defender === wxFanSheng(w0))) {
          bridge = (w0 + 3) % 5; // 官杀五行
          tongguanNote = '财星与印星交战→取官杀通关（官泄财气转生印，财印两全）';
        }
        // 比劫(同我) vs 官杀(克我) 交战 → 取食伤通关
        // 食伤泄比劫之旺气，转生财星弱化克战
        else if ((attacker === w0 || defender === w0) && (attacker === (w0 + 3) % 5 || defender === (w0 + 3) % 5)) {
          bridge = wxSheng(w0); // 食伤五行
          tongguanNote = '比劫与官杀交战→取食伤通关（泄比劫旺气，化解克战）';
        }
        // 其他：维持传统五行通关
        else {
          tongguanNote = WX[attacker] + '克' + WX[defender] + '交战→取' + WX[bridge] + '通关（泄' + WX[attacker] + '生' + WX[defender] + '）';
        }

        var bridgeBoost = 0.3;
        // 交战越激烈（两者力量越接近），通关越重要
        var warRatio = Math.min(top1.v, top2.v) / Math.max(top1.v, top2.v);
        if (warRatio > 0.7) bridgeBoost = 0.4; // 势均力敌，通关极其关键

        var bridgeIdx = result.candidates.findIndex(function (c) { return c.w === bridge; });
        if (bridgeIdx >= 0) {
          result.candidates[bridgeIdx].p += bridgeBoost;
          result.candidates[bridgeIdx].name += '(十神通关)';
        } else {
          result.candidates.push({ w: bridge, p: bridgeBoost, name: WX[bridge] + '(通关·' + tongguanNote.split('→')[0].trim() + ')' });
        }
        result.tongguanNote = tongguanNote;
        result.tongguanWar = { attacker: attacker, defender: defender, bridge: bridge, warRatio: warRatio };
      }
    }
  }

  // 调候 adjustment (定义5.8修正版)
  // ★ 核心原则：调候方向由月令季节决定，不由命局H值正负决定
  // 冬月(亥子丑)必须用火暖局，夏月(巳午未)必须用水润局
  // H值只决定调候的紧迫程度，不能反转季节方向
  var monthSeason = ws; // ws即月令当旺五行(由calcMonthlyCorrection传入)
  var tiaohouWx = -1; // -1 = 无需调候
  var tiaohouBoost = 0;
  if (monthSeason === 4) { // 冬：水旺 → 需火暖局
    tiaohouWx = 1;
    // H越负(命局本身也偏寒)越紧急；H正(命局火多自暖)则降低紧迫度
    if (H < -6) tiaohouBoost = 0.35;       // 命局本身也寒，极度紧急
    else if (H <= 6) tiaohouBoost = 0.20;   // 命局尚可，但冬天仍需暖
    else tiaohouBoost = 0.08;              // 命局自身火旺已可御寒，轻微调候
    result.tiaohouNote = H > 6 ? '冬月生人，原局火旺自暖，调候需求降低' : '冬月生人，急需火暖局';
  } else if (monthSeason === 1) { // 夏：火旺 → 需水润局
    tiaohouWx = 4;
    if (H > 6) tiaohouBoost = 0.35;
    else if (H >= -6) tiaohouBoost = 0.20;
    else tiaohouBoost = 0.08;
    result.tiaohouNote = H < -6 ? '夏月生人，原局水旺自润，调候需求降低' : '夏月生人，急需水润局';
  } else if (monthSeason === 3) { // 秋：金旺 → 偏燥酌用水，偏寒酌用火
    if (H > 10) {
      tiaohouWx = 4; tiaohouBoost = 0.12;
      result.tiaohouNote = '秋月偏燥，酌用水润';
    } else if (H < -10) {
      tiaohouWx = 1; tiaohouBoost = 0.15;
      result.tiaohouNote = '秋月偏寒，酌用火暖';
    }
  } else if (monthSeason === 0) { // 春：木旺 → 偏寒酌用火，偏热酌用水
    if (H < -10) {
      tiaohouWx = 1; tiaohouBoost = 0.12;
      result.tiaohouNote = '春月余寒，酌用火暖';
    } else if (H > 10) {
      tiaohouWx = 4; tiaohouBoost = 0.12;
      result.tiaohouNote = '春月偏热，酌用水润';
    }
  }
  if (tiaohouWx >= 0 && tiaohouBoost > 0) {
    var thIdx = result.candidates.findIndex(function (c) { return c.w === tiaohouWx; });
    if (thIdx >= 0) result.candidates[thIdx].p += tiaohouBoost;
    else result.candidates.push({ w: tiaohouWx, p: tiaohouBoost, name: WX[tiaohouWx] + '(调候)' });

    // §Issue3: 调候与泄秀协同——当调候五行恰好也是泄秀/护秀所需时，额外加分
    // 例：庚金夏月，调候需水，泄秀也走水路→水一石二鸟，权重叠加
    if (result.xieXiuData && tiaohouWx === result.xieXiuData.xieWx) {
      // 调候方向=泄秀出口→协同加分
      var synIdx = result.candidates.findIndex(function (c) { return c.w === tiaohouWx; });
      if (synIdx >= 0) {
        result.candidates[synIdx].p += tiaohouBoost * 0.5; // 额外50%协同加分
        if (result.candidates[synIdx].name.indexOf('调候') < 0)
          result.candidates[synIdx].name += '·调候协同';
      }
      result.tiaohouNote = (result.tiaohouNote || '') + '（与泄秀方向一致，协同加分）';
    }
    // 印旺夺食时，如果调候方向=财星(克印)，也协同
    if (result.yinDuoShiData && tiaohouWx === result.yinDuoShiData.caiW) {
      var synIdx2 = result.candidates.findIndex(function (c) { return c.w === tiaohouWx; });
      if (synIdx2 >= 0) {
        result.candidates[synIdx2].p += tiaohouBoost * 0.5;
        if (result.candidates[synIdx2].name.indexOf('调候') < 0)
          result.candidates[synIdx2].name += '·调候协同';
      }
      result.tiaohouNote = (result.tiaohouNote || '') + '（与财制印方向一致，协同加分）';
    }
  }
  // 存储调候参数供流年加成使用
  result.tiaohouWx = tiaohouWx;
  result.tiaohouBoost = tiaohouBoost;

  // ══════════════════════════════════════
  // §5.9 十干性情修正 (Nature of Ten Stems)
  // ══════════════════════════════════════
  // 古籍依据：《穷通宝鉴》《滴天髓》《子平真诠》
  // 核心思想：每一天干有其独特"性情"，对特定干支的喜忌
  // 超越五行生克的一般规律，需要专项修正。
  // stems参数：四柱天干数组 [年干,月干,日干,时干]

  // ★ 快照：性情修正前的候选集，供 UI 展示修正过程
  result.candidatesPreNature = result.candidates.map(function (c) { return { w: c.w, p: c.p, name: c.name }; });
  // 同步计算修正前的归一化权重向量（仅供 UI 展示用）
  (function () {
    var preWeights = [0, 0, 0, 0, 0];
    var preTotal = 0;
    result.candidatesPreNature.forEach(function (c) { preTotal += c.p; });
    if (preTotal > 0) result.candidatesPreNature.forEach(function (c) { preWeights[c.w] += c.p / preTotal; });
    if (result.enemy !== null) preWeights[result.enemy] = -1;
    result.weightsPreNature = preWeights;
  })();

  if (stems && stems.length === 4) {
    var t0 = stems[2]; // 日主天干编号
    var otherStems = [stems[0], stems[1], stems[3]]; // 年/月/时干
    var hasStem = function (t) { return otherStems.indexOf(t) >= 0; };
    var natureNotes = []; // 记录触发的性情规则

    // ── 辅助：向候选集追加/增强权重 ──
    var boostCandidate = function (wx, dp, label) {
      var idx = result.candidates.findIndex(function (c) { return c.w === wx; });
      if (idx >= 0) result.candidates[idx].p += dp;
      else result.candidates.push({ w: wx, p: dp, name: WX[wx] + '(' + label + ')' });
    };

    // ────────────────────────────────────
    // 甲木(t0=0)：身强喜庚金雕琢，忌己土合绊
    // 《滴天髓》："甲木参天，脱胎要火；春不容金，秋不容土。"
    // 《穷通宝鉴》：甲木身强取庚金为首选用神
    // ────────────────────────────────────
    if (t0 === 0) {
      if (r > 0.6 && hasStem(6)) { // 庚金在天干透出
        boostCandidate(3, 0.30, '庚金雕琢'); // 金
        natureNotes.push({ rule: '甲木身强见庚金', desc: '参天大木喜斧斤雕琢，庚金七杀为成器之关键', src: '《穷通宝鉴》《滴天髓》', effect: '+金权重0.30' });
        // 庚丁齐见 → 木火通明，金木成器，极贵格局
        if (hasStem(3)) {
          boostCandidate(1, 0.15, '丁火通明'); // 火
          natureNotes.push({ rule: '甲木庚丁齐见——木火通明', desc: '庚金砍伐甲木为栋梁，丁火引暖照耀，金木成器之大贵格局', src: '《穷通宝鉴》《滴天髓》', effect: '+火权重0.15（庚丁双美）' });
        }
      }
      if (r > 0.6 && !hasStem(6)) {
        natureNotes.push({ rule: '甲木身强无庚金', desc: '无庚金砍伐，大材难用，格局受限', src: '《穷通宝鉴》', effect: '格局评分下调' });
      }
      if (hasStem(5)) { // 己土合绊 (甲己合)
        natureNotes.push({ rule: '甲己合化——贪合忘官', desc: '甲木被己土合绊，丧失进取心，主优柔寡断', src: '《子平真诠·论合》', effect: '注意合化影响' });
      }
    }

    // ────────────────────────────────────
    // 乙木(t0=1)：喜丙火向阳，怕癸水过湿
    // 《滴天髓》："乙木虽柔，刲羊解牛。"
    // 乙木为花草藤蔓，最需阳光(丙火)照耀
    // ────────────────────────────────────
    if (t0 === 1) {
      if (hasStem(2)) { // 丙火
        boostCandidate(1, 0.20, '丙火向阳'); // 火
        natureNotes.push({ rule: '乙木见丙火', desc: '花草向阳，生机勃勃，主才华展现', src: '《穷通宝鉴》', effect: '+火权重0.20' });
      }
      if (H < -6) {
        // 寒冷环境中丙火比丁火更重要
        boostCandidate(1, 0.10, '寒木需阳');
        natureNotes.push({ rule: '乙木寒月急需丙火', desc: '花草逢冬，无阳则枯。丙火调候价值远高于丁火', src: '《穷通宝鉴》', effect: '+火权重0.10' });
      }
      // 藤萝系甲：乙木极弱时见甲木可借力
      if (r < 0.4 && hasStem(0)) {
        boostCandidate(0, 0.15, '藤萝系甲'); // 木
        natureNotes.push({ rule: '乙木身弱见甲木——藤萝系甲', desc: '花草身弱如藤蔓，攀附参天大木(甲)借力成就，克泄虽多亦不惧', src: '《穷通宝鉴》《滴天髓》', effect: '+木权重0.15（借甲木之力）' });
      }
    }

    // ────────────────────────────────────
    // 丙火(t0=2)：喜壬水映照(水火既济)，极忌己土晦光
    // 《滴天髓》："丙火猛烈，欺霜侮雪。能煅庚金，逢辛反怯。"
    // 丙为太阳，壬为江海，日照江湖主大贵
    // ────────────────────────────────────
    if (t0 === 2) {
      if (hasStem(8)) { // 壬水
        boostCandidate(4, 0.25, '壬水映照'); // 水
        natureNotes.push({ rule: '丙火见壬水——日照江湖', desc: '太阳照大海，波光粼粼，主名气与贵气', src: '《穷通宝鉴》《滴天髓》', effect: '+水权重0.25' });
      } else if (hasStem(9)) { // 癸水（次选，调候意义在但嫌阴柔）
        boostCandidate(4, 0.10, '癸水调候');
        natureNotes.push({ rule: '丙火见癸水——云遮日', desc: '癸水如阴雨云层，可调候但嫌阴柔，若大运见壬则格局大进', src: '《穷通宝鉴》', effect: '+水权重0.10（弱于壬）' });
      }
      if (hasStem(5)) { // 己土晦火
        var eidx = result.candidates.findIndex(function (c) { return c.w === 2; });
        if (eidx >= 0) result.candidates[eidx].p *= 0.7;
        natureNotes.push({ rule: '丙火见己土——晦火', desc: '己土如云层遮日，吸收丙火光芒，主才华受阻、忧郁', src: '《穷通宝鉴》', effect: '土权重×0.7' });
      }
      // 丙火自坐长生（日支=寅）
      if (branches[2] === 2) {
        natureNotes.push({ rule: '丙火坐寅——日坐长生', desc: '太阳自立于木气升发之地，印星为自家根本，心性通达、学养自生', src: '《穷通宝鉴》', effect: '自坐印星，根基稳固' });
      }
    }

    // ────────────────────────────────────
    // 丁火(t0=3)：喜甲木引燃，乙木(湿木)效果极差
    // 《滴天髓》："丁火柔中，内性昭融。抱乙而孝，合壬而忠。"
    // 丁为灯烛，需甲木(干柴)持续供薪
    // ────────────────────────────────────
    if (t0 === 3) {
      if (r < 0.45 && hasStem(0)) { // 甲木
        boostCandidate(0, 0.25, '甲木引丁'); // 木
        natureNotes.push({ rule: '丁火身弱见甲木', desc: '灯烛得干柴续命，甲木印星为第一用神', src: '《穷通宝鉴》《滴天髓》', effect: '+木权重0.25' });
      }
      if (r < 0.45 && !hasStem(0) && hasStem(1)) {
        natureNotes.push({ rule: '丁火身弱仅见乙木', desc: '湿木(花草)引火效果极差，易生浓烟反伤丁火', src: '《穷通宝鉴》', effect: '乙木印星效力不足' });
      }
    }

    // ────────────────────────────────────
    // 戊土(t0=4)：喜甲木疏通，冬月必见丙火
    // 《滴天髓》："戊土固重，既中且正。静翕动辟，万物司命。"
    // 《穷通宝鉴》：戊土身强取甲木疏土为第一用神
    // ────────────────────────────────────
    if (t0 === 4) {
      if (r > 0.55 && hasStem(0)) { // 甲木疏土
        boostCandidate(0, 0.25, '甲木疏土'); // 木
        natureNotes.push({ rule: '戊土身强见甲木', desc: '厚土得甲木疏通，方能生养万物。无甲则为顽土', src: '《穷通宝鉴》《滴天髓》', effect: '+木权重0.25' });
      }
      if (ws === 4 && hasStem(2)) { // 冬月见丙火
        boostCandidate(1, 0.20, '丙火暖土'); // 火
        natureNotes.push({ rule: '戊土冬月见丙火', desc: '冻土逢阳，解冻方能耕种。冬戊必以丙火为先', src: '《穷通宝鉴》', effect: '+火权重0.20' });
      }
    }

    // ────────────────────────────────────
    // 己土(t0=5)：喜丙火照暖、癸水滋润，忌壬水冲溃
    // 《滴天髓》："己土卑湿，中正蓄藏。不愁木盛，不畏水狂。"
    // 己为田园湿土，丙癸并透为最佳组合
    // ────────────────────────────────────
    if (t0 === 5) {
      if (hasStem(2) && hasStem(9)) { // 丙癸并透
        boostCandidate(1, 0.15, '丙火照田'); // 火
        boostCandidate(4, 0.15, '癸水润田'); // 水
        natureNotes.push({ rule: '己土见丙癸并透', desc: '田园得阳光雨露，万物丰收。丙癸为己土最佳配置', src: '《穷通宝鉴》', effect: '+火水各0.15' });
      } else {
        if (hasStem(2)) natureNotes.push({ rule: '己土见丙火', desc: '田园有阳光，但缺雨露灌溉', src: '《穷通宝鉴》', effect: '部分有利' });
        if (hasStem(9)) natureNotes.push({ rule: '己土见癸水', desc: '田园有雨露，但缺阳光照暖', src: '《穷通宝鉴》', effect: '部分有利' });
      }
      // 己土极怕壬水冲溃（洪水象）
      if (hasStem(8)) {
        var widx = result.candidates.findIndex(function (c) { return c.w === 4; }); // 水
        if (widx >= 0) result.candidates[widx].p *= 0.7; // 壬水破坏性，降低水的正面权重
        natureNotes.push({ rule: '己土见壬水——洪水冲田', desc: '壬水为大江大河，冲溃己土田园，主生活颠沛流离、居无定所', src: '《穷通宝鉴》《滴天髓》', effect: '壬水破坏力大，水权重×0.7' });
      }
    }

    // ────────────────────────────────────
    // 庚金(t0=6)：喜丁火煅炼，丙火次之
    // 《滴天髓》："庚金带煞，刚健为最。得水而清，得火而锐。"
    // 庚为顽铁，丁火(炉火)煅炼成器，丙火只照不炼
    // ────────────────────────────────────
    if (t0 === 6) {
      if (r > 0.6 && hasStem(3)) { // 丁火
        boostCandidate(1, 0.30, '丁火锻金'); // 火
        natureNotes.push({ rule: '庚金身强见丁火', desc: '顽铁入红炉煅炼，方成宝剑利器。丁火价值远超丙火', src: '《穷通宝鉴》《滴天髓》', effect: '+火权重0.30' });
      } else if (r > 0.6 && hasStem(2) && !hasStem(3)) {
        boostCandidate(1, 0.10, '丙火照金');
        natureNotes.push({ rule: '庚金身强仅见丙火', desc: '丙火照亮庚金，但无法改变形态。有丁更佳', src: '《穷通宝鉴》', effect: '+火权重0.10（弱于丁火）' });
      }
      // 金水冷寒：冬月水旺无火，庚金沉入海底
      if (ws === 4 && !hasStem(2) && !hasStem(3)) {
        natureNotes.push({ rule: '庚金冬月无火——金水冷寒', desc: '冬月水旺，庚金无火温暖则沉入海底。主漂泊孤独，缺乏温暖', src: '《穷通宝鉴》', effect: '急需火来调候暖局' });
        boostCandidate(1, 0.20, '冬金急需火'); // 火
      }
    }

    // ────────────────────────────────────
    // 辛金(t0=7)：喜壬水涤洗，忌土多埋金
    // 《滴天髓》："辛金软弱，温润而清。畏土之叠，乐水之盈。"
    // 辛为珠宝，壬水洗涤方显光华
    // ────────────────────────────────────
    if (t0 === 7) {
      if (hasStem(8)) { // 壬水
        boostCandidate(4, 0.25, '壬水洗金'); // 水
        natureNotes.push({ rule: '辛金见壬水', desc: '珠宝经清水涤洗，光华尽显。壬水为辛金第一用神', src: '《滴天髓》', effect: '+水权重0.25' });
      }
      if (Vstar[2] > 2.0 && !hasStem(0) && !hasStem(1)) { // 土旺且无木疏土
        natureNotes.push({ rule: '辛金土旺无木——埋金', desc: '土多埋金且无甲乙木疏通，辛金被厚土深埋，才华难显', src: '《滴天髓》："畏土之叠"', effect: '土旺为忌，急需木来疏土' });
        boostCandidate(0, 0.15, '木疏埋金'); // 木
      } else if (Vstar[2] > 2.0) {
        natureNotes.push({ rule: '辛金土旺有木——轻埋', desc: '土多但有木疏通，埋金之患减轻', src: '《滴天髓》', effect: '土旺有木解，尚可' });
      }
      // 丙辛合：合官损己
      if (hasStem(2)) {
        natureNotes.push({ rule: '辛金见丙火——丙辛合（合官损己）', desc: '辛金合丙化水，名为"合官"实则损己。名声虽有但牺牲自我主体性，得名不得利', src: '《子平真诠·论合》《滴天髓》', effect: '注意合化影响，自我主体性减弱' });
      }
    }

    // ────────────────────────────────────
    // 壬水(t0=8)：喜戊土筑堤，忌己土混浊
    // 《滴天髓》："壬水通河，能泄金气。刚中之德，周流不滞。"
    // 壬为江海，需戊土(高山)为堤岸
    // ────────────────────────────────────
    if (t0 === 8) {
      if (r > 0.65 && hasStem(4)) { // 戊土
        boostCandidate(2, 0.25, '戊土筑堤'); // 土
        natureNotes.push({ rule: '壬水身强见戊土', desc: '奔腾之水得高山为堤，方能蓄势成湖。戊土七杀为首选', src: '《穷通宝鉴》《滴天髓》', effect: '+土权重0.25' });
      }
      if (hasStem(5)) {
        // 降低"土"的用神权重——壬水正官本为戊己土，己土浊水使正官虚浮失效
        var tuIdxR = result.candidates.findIndex(function (c) { return c.w === 2; });
        if (tuIdxR >= 0) result.candidates[tuIdxR].p *= 0.75;
        natureNotes.push({ rule: '壬水见己土——浊水', desc: '己土为散沙，无法筑堤反令江水浑浊，主思路不清、正官虚浮', src: '《穷通宝鉴》', effect: '土权重×0.75（正官失效折扣）' });
      }
    }

    // ────────────────────────────────────
    // 癸水(t0=9)：喜丙火蒸腾，极怕戊土合绊
    // 《滴天髓》："癸水至弱，达于天津。龙德而运，功化斯神。"
    // 癸为雨露，丙火蒸腾形成云雨循环
    // ────────────────────────────────────
    if (t0 === 9) {
      if (hasStem(2)) { // 丙火
        boostCandidate(1, 0.20, '丙火蒸腾'); // 火
        natureNotes.push({ rule: '癸水见丙火', desc: '雨露遇阳光蒸腾，化为云雨循环，主灵动聪慧', src: '《穷通宝鉴》《滴天髓》', effect: '+火权重0.20' });
      }
      if (hasStem(4)) { // 戊癸合
        // 癸水的正官是戊土，戊癸合→雨露化泥，正官被合绊失效
        var tuIdxC = result.candidates.findIndex(function (c) { return c.w === 2; });
        if (tuIdxC >= 0) result.candidates[tuIdxC].p *= 0.75;
        natureNotes.push({ rule: '戊癸合——雨露化泥', desc: '戊土合绊癸水，雨露变泥泞，主被动受制、缺乏自主；正官被合，功名虚浮', src: '《子平真诠·论合》', effect: '土权重×0.75（正官合绊折扣）' });
      }
    }

    // ────────────────────────────────────
    // 日主自坐：通用正/负向 gamma 评估
    // 日干坐日支的十二长生状态，给出结构性描述
    // ────────────────────────────────────
    var dayBranch = branches[2];
    var dmG = gammaVal(t0, dayBranch, true);
    var stageMap = {0:'长生',1:'沐浴',2:'冠带',3:'临官',4:'帝旺',5:'衰',6:'病',7:'死',8:'墓',9:'绝',10:'胎',11:'养'};
    var stageIdx = changShengStage(t0, dayBranch);
    var stageName = stageMap[stageIdx];
    // 12 长生全态自坐叙事（补全）
    var SELF_SITE_RULES = {
      0: { rule:'日坐长生', desc:'日主坐在生机萌发之地，天生带学养与文气，贵人缘与才艺俱佳', eff:'印星自带' },
      1: { rule:'日坐沐浴', desc:'日主坐桃花败地，感情波澜起伏、少年易有情感纠葛；但亦主才艺风流', eff:'感情起伏' },
      2: { rule:'日坐冠带', desc:'日主坐在行将成器之地，少年有志、中年得势，适合稳步上升路径', eff:'根基偏强' },
      3: { rule:'日坐禄位', desc:'日主自立于本家禄位，根气深厚、自力更生；忌比劫来争夺', eff:'根基稳固' },
      4: { rule:'日坐帝旺', desc:'日主坐在本家极旺之地，性格刚强、决断有力；但过刚易折，宜有官杀制衡', eff:'根基稳固·防过刚' },
      5: { rule:'日坐衰', desc:'日主坐在气势渐弱之地，行事稳重内敛、不善张扬；需靠印比扶助发挥', eff:'偏弱但不至虚浮' },
      6: { rule:'日坐病', desc:'日主坐在力道衰弱之地，早年或有身体/家庭的起伏；中年后须主动修复根基', eff:'根基虚' },
      7: { rule:'日坐死', desc:'日主于日支无根，需依赖印比扶助；配偶宫偏虚，感情更看磨合', eff:'根基偏虚' },
      8: { rule:'日坐墓库', desc:'日主坐自家墓库，内秀深藏、不露锋芒；中年后厚积薄发', eff:'潜能待发' },
      9: { rule:'日坐绝', desc:'日主于日支彻底无根，性格独立但易有孤感；须靠外力（印比/用神大运）补位', eff:'根基极虚' },
      10:{ rule:'日坐胎', desc:'日主坐在酝酿之地，早年多变、中年后方显定向；适合慢工出细活', eff:'待发' },
      11:{ rule:'日坐养', desc:'日主坐在温养之地，性格温和、善于守成；但主动攻势略弱，宜借势而非亲征', eff:'守多于攻' }
    };
    var ssr = SELF_SITE_RULES[stageIdx];
    if (ssr) natureNotes.push({ rule: ssr.rule, desc: ssr.desc, src: '《滴天髓》《穷通宝鉴》', effect: ssr.eff });

    // ── 各日主喜干·通用触发（补充：原先只针对特定日主的规则，现按"日主 × 天干"二维补齐） ──
    // 触发条件：其它三柱天干有该"喜干"
    var DM_LIKES = {
      0: [{wantTg:6, note:'甲木喜庚金——参天大木喜斧斤雕琢成栋梁', cond:function(r){return r>0.4;}}],
      1: [{wantTg:2, note:'乙木喜丙火——花草向阳，生机勃发', cond:function(r){return true;}}],
      2: [{wantTg:8, note:'丙火喜壬水——日照江湖，光辉映海（同已有规则）', cond:function(r){return true;}}],
      3: [{wantTg:0, note:'丁火喜甲木——灯烛得干柴续焰', cond:function(r){return true;}}, {wantTg:8, note:'丁火见壬水——星河映月，主清贵', cond:function(r){return r>0.4;}}],
      4: [{wantTg:0, note:'戊土喜甲木——厚土得疏通方生万物', cond:function(r){return true;}}, {wantTg:2, note:'戊土喜丙火——高山得阳，万物向荣', cond:function(r){return true;}}],
      5: [{wantTg:2, note:'己土喜丙火——田园得阳光照暖', cond:function(r){return true;}}, {wantTg:9, note:'己土喜癸水——田园得雨露润泽', cond:function(r){return true;}}],
      6: [{wantTg:3, note:'庚金喜丁火——顽铁入炉方成利器', cond:function(r){return r>0.5;}}, {wantTg:0, note:'庚金喜甲木——劈甲引丁，金木成器', cond:function(r){return r>0.5;}}],
      7: [{wantTg:8, note:'辛金喜壬水——珠玉得清水洗磨，光华自显（同已有规则）', cond:function(r){return true;}}],
      8: [{wantTg:6, note:'壬水喜庚金——源头清澈，金水相生', cond:function(r){return true;}}, {wantTg:2, note:'壬水夏月喜丙火——水火既济', cond:function(r){var mWx = getSeasonWx(branches[1]); return mWx===1;}}],
      9: [{wantTg:6, note:'癸水喜庚金——清源活水，滋养万物', cond:function(r){return true;}}, {wantTg:2, note:'癸水冬月喜丙火——阳光融冰，调候第一', cond:function(r){var mWx = getSeasonWx(branches[1]); return mWx===4;}}]
    };
    var likeTriggers = DM_LIKES[t0] || [];
    var existingRuleSet = {}; natureNotes.forEach(function(n){ existingRuleSet[n.rule] = true; });
    likeTriggers.forEach(function(lk){
      if (hasStem(lk.wantTg) && lk.cond(r)) {
        // 只有在该规则未被特定触发时才补这条通用的
        var generic = TG[t0]+'日喜见'+TG[lk.wantTg];
        if (!existingRuleSet[generic]) {
          natureNotes.push({ rule: generic, desc: lk.note, src:'《穷通宝鉴·十干论》', effect:'格局加分项' });
          existingRuleSet[generic] = true;
        }
      }
    });

    result.natureNotes = natureNotes;
  } else {
    result.natureNotes = [];
  }
  // ══════════════════════════════════════
  // END 十干性情修正
  // ══════════════════════════════════════

  // Normalize weights and sort by descending priority
  var total = 0;
  result.candidates.forEach(function (c) { total += c.p; });
  result.candidates.forEach(function (c) { c.p /= total; });
  result.candidates.sort(function (a, b) { return b.p - a.p; });

  // ══════════════════════════════════════
  // §5.17 真假神判定 (True/False God Detection)
  // ══════════════════════════════════════
  // 《滴天髓》原文："真神得用平生贵，用若无情绝不灵。"
  // 又："假杀假官虚受福，莫把官杀再言嗔。"
  // 白鹤鸣注：真神 = 月令本气所属五行透出天干，且为用神所需
  //           假神 = 用神五行非月令当旺，或虽有其五行但不透天干
  // 真神得用 → 格局高贵，一生顺遂
  // 假神当权 → 外表风光实则虚浮，大运不配合则败
  if (branches && branches.length >= 2) {
    var monthBranch = branches[1];
    var benQiTg = CANG_GAN[monthBranch][0].t; // 月令本气天干
    var benQiWx = tgWx(benQiTg);              // 月令本气五行
    // 收集四柱天干中出现的五行
    var stemWxSet = {};
    if (stems && stems.length === 4) {
      for (var si = 0; si < 4; si++) {
        if (si === 2) continue; // 日主不计
        stemWxSet[tgWx(stems[si])] = true;
      }
    }
    // 月令藏干中所有五行（含中气余气）
    var monthCgWx = {};
    CANG_GAN[monthBranch].forEach(function (cg) { monthCgWx[tgWx(cg.t)] = cg.w; });

    // 结构性假神判定：日主/用神 与 月令五行属于"天然不可得令"关系
    // 例：冬月(水)火用木火 —— 月令永远是水，用神木火本就克/被克关系，不可能"得月令真气"
    // 这类假神是结构必然，不是缺陷；区别于"缺陷性假神"（原本可得月令但巧合未得）
    var monthBenWx = benQiWx;
    var dmWxLocal = typeof dayMasterWx !== 'undefined' ? dayMasterWx : (stems ? tgWx(stems[2]) : -1);
    // 结构性假神判定：当"扶抑/调候/格局"推出的用神 与 月令五行 天然冲突（克/被克/同气但不当令）
    function isStructuralFake(candWx) {
      if (candWx === monthBenWx) return false; // 本就得令，不可能是结构性假神
      // 日主所在的季节 vs 用神所需：冬火/夏水/秋木/春金 这些日主天然不得月令扶助
      var dmSeason = [0,0,1,1,1,2,2,2,3,3,3,0][monthBranch]; // 寅卯辰=春 巳午未=夏 申酉戌=秋 亥子丑=冬
      var dmWxBySeason = [0,1,3,4][dmSeason]; // 春令木、夏令火、秋令金、冬令水
      if (dmWxLocal !== dmWxBySeason) {
        // 日主本来就不当令 → 用印比扶身就是结构性假神（必然现象）
        var wYinL = (dmWxLocal + 4) % 5;
        var wBiL = dmWxLocal;
        if (candWx === wYinL || candWx === wBiL) return true;
      }
      return false;
    }

    result.candidates.forEach(function (c) {
      var deLing = (c.w === benQiWx);
      var touGan = !!stemWxSet[c.w];
      var deQi = !!monthCgWx[c.w];
      var structural = isStructuralFake(c.w);

      if (deLing && touGan) {
        c.isTrue = true;
        c.zhenJiaKind = 'true';
        c.zhenJiaNote = '真神得用——' + WX[c.w] + '为月令' + WX[benQiWx] + '本气且透天干';
      } else if (deQi && touGan) {
        c.isTrue = true;
        c.zhenJiaKind = 'trueMinor';
        c.zhenJiaNote = '真神得用——' + WX[c.w] + '得月令中余气且透天干（力稍逊本气）';
      } else if (deLing && !touGan) {
        c.isTrue = false;
        c.zhenJiaKind = 'halfTrue';
        c.zhenJiaNote = '半真半假——' + WX[c.w] + '虽为月令本气但未透天干，力量藏而不显';
      } else if (structural && touGan) {
        c.isTrue = false;
        c.zhenJiaKind = 'structural';
        c.zhenJiaNote = '结构性假神——' + WX[c.w] + '透天干但月令非其时；此为"季节结构必然"（日主非当令），借助外力即可，无需理解为缺陷';
      } else if (structural && !touGan) {
        c.isTrue = false;
        c.zhenJiaKind = 'structural';
        c.zhenJiaNote = '结构性假神——' + WX[c.w] + '既不得月令也未透干，但属季节必然（日主非当令），大运流年来补即可';
      } else if (touGan && !deQi) {
        c.isTrue = false;
        c.zhenJiaKind = 'weak';
        c.zhenJiaNote = '待补用神——' + WX[c.w] + '透天干但未得月令之气，根基偏虚，喜大运来扶';
      } else if (!touGan && deQi) {
        c.isTrue = false;
        c.zhenJiaKind = 'weak';
        c.zhenJiaNote = '待补用神——' + WX[c.w] + '得月令中余气但未透天干，深藏不显，喜大运引出';
      } else {
        c.isTrue = false;
        c.zhenJiaKind = 'defect';
        c.zhenJiaNote = '缺陷性假神——' + WX[c.w] + '既不得月令亦不透干、原局占比低，取用偏虚，大运补救为要';
      }
    });

    // 真假神总结
    var trueGods = result.candidates.filter(function (c) { return c.isTrue; });
    var structuralFakes = result.candidates.filter(function (c) { return c.zhenJiaKind === 'structural'; });
    var defectFakes = result.candidates.filter(function (c) { return c.zhenJiaKind === 'defect' || c.zhenJiaKind === 'weak'; });
    var verdict, tone;
    if (trueGods.length > 0) {
      verdict = '真神得用——' + trueGods.map(function (c) { return WX[c.w]; }).join('、') + '为真神，格局有力';
      tone = 'good';
    } else if (structuralFakes.length > 0 && defectFakes.length === 0) {
      verdict = '结构性假神（季节必然）——日主非当令，用神借助大运流年补位即可，非格局缺陷';
      tone = 'neutral';
    } else {
      verdict = '用神偏虚——' + result.candidates.filter(function(c){return !c.isTrue;}).slice(0,2).map(function(c){return WX[c.w];}).join('、') + '需大运流年补位';
      tone = 'warn';
    }
    result.zhenJiaSummary = {
      hasTrueGod: trueGods.length > 0,
      isStructuralOnly: trueGods.length === 0 && structuralFakes.length > 0 && defectFakes.length === 0,
      trueGods: trueGods.map(function (c) { return WX[c.w]; }),
      structuralFakes: structuralFakes.map(function (c) { return WX[c.w]; }),
      defectFakes: defectFakes.map(function (c) { return WX[c.w]; }),
      verdict: verdict,
      tone: tone
    };
  }
  // END 真假神判定
  // ══════════════════════════════════════

  // Build evaluation vector w
  result.candidates.forEach(function (c) { result.weights[c.w] += c.p; });
  if (result.enemy !== null) result.weights[result.enemy] = -1;

  return result;
}

// 寒暖计分
function calcTemperature(pillars) {
  var H = 0;
  var kw = pillars.kongWang || [];
  var notes = [];
  // 天干贡献（空亡不影响天干）
  for (var i = 0; i < 4; i++) H += ETA_T[pillars.stems[i]];
  // 地支贡献：空亡地支按 ε=0.1 折损（寒暖气势随藏干一起虚浮）
  var posLabel = ['年','月','日','时'];
  for (var i = 0; i < 4; i++) {
    var d = pillars.branches[i];
    var isKw = kw.indexOf(d) >= 0;
    var contrib = ETA_D[d];
    if (isKw) {
      var reduced = contrib * KONG_WANG_EPS;
      H += reduced;
      if (Math.abs(contrib) >= 1) notes.push(posLabel[i] + '支' + DZ[d] + '空亡 → ' + (contrib>=0?'+':'') + contrib + ' × 0.1 = ' + (reduced>=0?'+':'') + reduced.toFixed(1));
    } else {
      H += contrib;
    }
  }
  // 月支加权（提纲寒暖最关键）——若月支空亡，月令提纲虚浮，加权同样折损
  var mb = pillars.branches[1];
  var mEta = ETA_M[mb];
  if (kw.indexOf(mb) >= 0) {
    var mReduced = mEta * KONG_WANG_EPS;
    H += mReduced;
    notes.push('月支' + DZ[mb] + '空亡（提纲）→ ETA_M ' + (mEta>=0?'+':'') + mEta + ' × 0.1 = ' + (mReduced>=0?'+':'') + mReduced.toFixed(1));
  } else {
    H += mEta;
  }
  var level = Math.abs(H) <= 6 ? '中和' : (Math.abs(H) <= 15 ? '中度偏' + (H > 0 ? '暖' : '寒') : '极' + (H > 0 ? '暖' : '寒'));
  return { H: Math.round(H * 10) / 10, level: level, kwNotes: notes };
}

// ══════════════════════════════════════
// §7.5 清浊评分 (Clarity Score)
// ══════════════════════════════════════
// 《滴天髓》原文："一清到底有精神，管取平生富贵真。澄浊求清清得去，时来寒谷也回春。"
// 清 = 用神专一不杂、十神不混、全局五行有流通
// 浊 = 用神太多太杂、互相矛盾、干支乖戾
// 评分0~100：80+ = 清、60~80 = 偏清、40~60 = 半清半浊、<40 = 浊
function calcClarity(pillars, Vstar, usefulGod, strength, dzEffects) {
  var score = 50; // 基准分
  var notes = [];
  var w0 = pillars.dayMasterWx;
  var stems = pillars.stems;
  var branches = pillars.branches;

  // ── 1. 官杀混杂检测 ──
  // 《滴天髓》："官杀混杂不清，须制须化。"
  // 正官(偶数差)和七杀(奇数差)同时出现在天干 → 官杀混杂 → -15分
  var guanCount = 0, shaCount = 0;
  for (var i = 0; i < 4; i++) {
    if (i === 2) continue; // 日主跳过
    var ss = shiShen(stems[2], stems[i]);
    if (ss === 6) guanCount++; // 正官
    if (ss === 7) shaCount++;  // 七杀
  }
  if (guanCount > 0 && shaCount > 0) {
    score -= 15;
    notes.push({ type: '浊', desc: '官杀混杂——正官与七杀同透天干，清气受损', src: '《滴天髓·论清浊》', delta: -15 });
  } else if (guanCount > 0 || shaCount > 0) {
    // 官杀纯一 → +5分
    score += 5;
    notes.push({ type: '清', desc: '官杀纯一（' + (guanCount > 0 ? '纯正官' : '纯七杀') + '），格局清晰', src: '《子平真诠》', delta: +5 });
  }

  // ── 2. 食伤混杂检测 ──
  // 食神(偶)和伤官(奇)同透 → -10分
  var shiCount = 0, shangCount = 0;
  for (var i = 0; i < 4; i++) {
    if (i === 2) continue;
    var ss = shiShen(stems[2], stems[i]);
    if (ss === 4) shiCount++;  // 食神
    if (ss === 5) shangCount++; // 伤官
  }
  if (shiCount > 0 && shangCount > 0) {
    score -= 10;
    notes.push({ type: '浊', desc: '食伤混杂——食神与伤官同透', src: '《滴天髓·论清浊》', delta: -10 });
  }

  // ── 3. 用神专一度 ──
  // 用神候选集中，最高权重占比越高越清
  if (usefulGod.candidates && usefulGod.candidates.length > 0) {
    var maxP = 0;
    usefulGod.candidates.forEach(function (c) { if (c.p > maxP) maxP = c.p; });
    if (maxP >= 0.5) {
      score += 10;
      notes.push({ type: '清', desc: '用神专一（首选权重' + Math.round(maxP * 100) + '%），取用明确', src: '《滴天髓》："一清到底有精神"', delta: +10 });
    } else if (maxP < 0.3) {
      score -= 8;
      notes.push({ type: '浊', desc: '用神分散（最高仅' + Math.round(maxP * 100) + '%），取用不明', src: '《滴天髓·论清浊》', delta: -8 });
    }
  }

  // ── 4. 五行流通链检测 ──
  // 《滴天髓》原文："始其所始，终其所终...周流不滞，为情和气协。"
  // 检测四柱天干是否构成顺生链
  var flowCount = 0; // 顺生次数
  var keCount = 0;   // 相克次数
  var stemWx = [];
  for (var i = 0; i < 4; i++) stemWx.push(tgWx(stems[i]));
  // 检查相邻柱天干关系
  for (var i = 0; i < 3; i++) {
    var w1 = stemWx[i], w2 = stemWx[i + 1];
    if (wxSheng(w1) === w2) flowCount++; // w1生w2
    if (wxSheng(w2) === w1) flowCount++; // w2生w1
    if ((w1 + 2) % 5 === w2 || (w2 + 2) % 5 === w1) keCount++; // 相克
  }
  if (flowCount >= 2) {
    score += 12;
    notes.push({ type: '清', desc: '天干顺生流通（' + flowCount + '组相生），气势周流不滞', src: '《滴天髓》："始其所始，终其所终"', delta: +12 });
  }
  if (keCount >= 2) {
    score -= 8;
    notes.push({ type: '浊', desc: '天干多克战（' + keCount + '组相克），气势对峙不和', src: '《滴天髓·论清浊》', delta: -8 });
  }

  // ── 5. 日主坐支（日支）有情检测 ──
  // 日支为日主的禄/刃/长生/正官/正财 → +8分（有情）
  var dayBranch = branches[2];
  var dayCG = CANG_GAN[dayBranch];
  if (dayCG && dayCG.length > 0) {
    var benQi = dayCG[0].t;
    var ssBenQi = shiShen(stems[2], benQi);
    // 比肩/劫财=有根, 正官/正财/正印=有情
    if (ssBenQi === 0 || ssBenQi === 1 || ssBenQi === 6 || ssBenQi === 8 || ssBenQi === 2) {
      score += 8;
      notes.push({ type: '清', desc: '日坐' + shiShenName(ssBenQi) + '，干支有情配合', src: '《滴天髓》："天覆地载，万物司命"', delta: +8 });
    }
    // 日坐七杀无制 → -5
    if (ssBenQi === 7) {
      // 检查是否有食伤制杀
      var hasZhi = false;
      for (var i = 0; i < 4; i++) {
        if (i === 2) continue;
        var ssI = shiShen(stems[2], stems[i]);
        if (ssI === 4 || ssI === 5) hasZhi = true; // 食伤制杀
      }
      if (!hasZhi) {
        score -= 5;
        notes.push({ type: '浊', desc: '日坐七杀无食伤制，身受压制', src: '《滴天髓》', delta: -5 });
      }
    }
  }

  // ── 6. 合化成功加分 / 争合妒合扣分 ──
  if (dzEffects && dzEffects.modNotes) {
    var heCheng = 0, zhengHe = 0;
    dzEffects.modNotes.forEach(function (n) {
      if (typeof n === 'string') {
        if (n.indexOf('成功') >= 0) heCheng++;
        if (n.indexOf('争合') >= 0 || n.indexOf('妒合') >= 0) zhengHe++;
      }
    });
    if (heCheng > 0) {
      score += heCheng * 5;
      notes.push({ type: '清', desc: '有' + heCheng + '组合化成功，精气团结', src: '《滴天髓》："地旺宜静"', delta: heCheng * 5 });
    }
    if (zhengHe > 0) {
      score -= zhengHe * 8;
      notes.push({ type: '浊', desc: '有' + zhengHe + '组争合/妒合，合力散漫', src: '《滴天髓·论驳绊》', delta: -zhengHe * 8 });
    }
  }

  // ── 7. 偏枯检测 ──
  // 五行中有占50%以上且有0%的 → 偏枯 → -10
  var totalV = 0;
  for (var w = 0; w < 5; w++) totalV += Vstar[w];
  if (totalV > 0) {
    var maxPct = 0, zeroCnt = 0;
    for (var w = 0; w < 5; w++) {
      var pct = Vstar[w] / totalV;
      if (pct > maxPct) maxPct = pct;
      if (Vstar[w] < 0.01) zeroCnt++;
    }
    if (maxPct > 0.50 && zeroCnt >= 2) {
      score -= 10;
      notes.push({ type: '浊', desc: '五行偏枯（最旺占' + Math.round(maxPct * 100) + '%，' + zeroCnt + '行缺失），格局不全', src: '《滴天髓·论形象》', delta: -10 });
    }
    // 五行分布较均匀 → +5
    if (maxPct < 0.35 && zeroCnt === 0) {
      score += 5;
      notes.push({ type: '清', desc: '五行俱全且分布较均，气势中和', src: '《滴天髓》', delta: +5 });
    }
  }

  // ── 8. 特殊格局（两神成象/专旺/从格）额外评价 ──
  if (usefulGod.specialPattern) {
    var pat = usefulGod.specialPattern;
    if (pat.indexOf('成象') >= 0 || pat.indexOf('通明') >= 0 || pat.indexOf('相涵') >= 0 ||
      pat.indexOf('清华') >= 0 || pat.indexOf('成慈') >= 0 || pat.indexOf('毓秀') >= 0) {
      score += 15;
      notes.push({ type: '清', desc: '两神成象格——' + pat + '，气势相均，格局高', src: '《滴天髓·论形象》："两气合而成象，象不可破也"', delta: +15 });
    }
    if (pat.indexOf('格') >= 0 && (pat.indexOf('曲直') >= 0 || pat.indexOf('炎上') >= 0 ||
      pat.indexOf('稼穑') >= 0 || pat.indexOf('从革') >= 0 || pat.indexOf('润下') >= 0)) {
      score += 10;
      notes.push({ type: '清', desc: '专旺格——' + pat + '，一行得气独旺，格局纯粹', src: '《滴天髓·论形象》："独象喜行财地"', delta: +10 });
    }
  }

  // Clamp 0~100
  score = Math.max(0, Math.min(100, score));

  var level;
  if (score >= 80) level = '清';
  else if (score >= 60) level = '偏清';
  else if (score >= 40) level = '半清半浊';
  else level = '浊';

  return { score: score, level: level, notes: notes };
}

// ══════════════════════════════════════
// §7.8 恩怨标注 (Grace & Resentment Annotation)
// ══════════════════════════════════════
// 《滴天髓》原文：
//   "生平只见恩中怨，几个能知怨是恩。"
//   "恩不可太过，过则为害；怨不可太深，深则难解。"
// 白鹤鸣注：天干之间、干支之间的关系不仅看生克，还要看：
//   (1) 位置远近：紧贴(相邻柱)为"情深"，隔柱为"情薄"，年时为"无情"
//   (2) 十神性质：正星(正官正印正财)多为"恩"，偏星(七杀偏印偏财)多带"怨"
//   (3) 阴阳配合：阴阳相济为有情，同性相遇为无情
//   (4) 特殊组合：恩中有怨(如印星太旺夺食)，怨中有恩(如七杀有制化权)
function calcEnYuan(pillars, usefulGod, strength) {
  var stems = pillars.stems;
  var branches = pillars.branches;
  var dm = stems[2]; // 日主天干
  var w0 = pillars.dayMasterWx;
  var pillarNames = ['年干', '月干', '日干', '时干'];
  var relations = [];

  // ── 天干恩怨分析（日主与其他三柱天干的关系）──
  for (var i = 0; i < 4; i++) {
    if (i === 2) continue; // 跳过日主自身
    var t = stems[i];
    var ss = shiShen(dm, t);
    var ssName = SHI_SHEN[ss];
    var dist = Math.abs(i - 2); // 距离：1=紧贴，2=隔柱(年干/时干中较远的)

    // 十神分类
    var isZheng = (ss % 2 === 0); // 正星(偶数)：比肩食神偏财七杀偏印 → wait
    // 十神编号: 0比肩 1劫财 2食神 3伤官 4偏财 5正财 6七杀 7正官 8偏印 9正印
    // 正星 = 正官(7) 正印(9) 正财(5) 食神(2) 比肩(0)
    // 偏星 = 七杀(6) 偏印(8) 偏财(4) 伤官(3) 劫财(1)
    var isZhengStar = (ss === 0 || ss === 2 || ss === 5 || ss === 7 || ss === 9);

    // 恩怨基础判定
    var enYuan = ''; // 恩/怨/恩怨兼有
    var qingFen = ''; // 有情/无情/半情
    var detail = '';

    // 生我为恩（印星），克我为怨（官杀），我生为泄（食伤），我克为耗（财星），同我为助（比劫）
    var wxRel = (tgWx(t) - w0 + 5) % 5; // 0同 1我生 2我克 3克我 4生我

    if (wxRel === 4) { // 印星生我 → 恩
      enYuan = '恩';
      if (isZhengStar) {
        detail = ssName + '紧贴生身——母慈子孝，得长辈/贵人关爱';
        if (strength.r > 0.55) detail = ssName + '生身太旺——恩过成害，印旺夺食，思想保守';
      } else {
        detail = ssName + '暗中生身——偏门助力，得异路贵人';
        if (strength.r > 0.55) detail = ssName + '生身太旺——恩中有怨，枭神夺食之忧';
      }
      // 身强则印为忌，恩变怨
      if (strength.r > 0.55) enYuan = '恩中有怨';
    } else if (wxRel === 3) { // 官杀克我 → 怨
      enYuan = '怨';
      if (isZhengStar) { // 正官
        detail = ssName + '管束日主——正当约束，怨中有恩，主名誉地位';
        enYuan = '怨中有恩';
      } else { // 七杀
        detail = ssName + '攻克日主——凶悍压制，主压力磨难';
        // 有食伤制杀则转化
        var hasZhi = false;
        for (var j = 0; j < 4; j++) {
          if (j === 2) continue;
          var ssJ = shiShen(dm, stems[j]);
          if (ssJ === 2 || ssJ === 3) hasZhi = true;
        }
        if (hasZhi) {
          detail = ssName + '有制化权——七杀得食伤制，化怨为恩，主威权';
          enYuan = '怨中有恩';
        }
      }
      // 身弱则官杀为大忌
      if (strength.r < 0.45) detail += '（身弱受克，压力极大）';
    } else if (wxRel === 1) { // 食伤泄我 → 泄
      if (strength.r >= 0.50) {
        enYuan = '恩';
        detail = ssName + '泄秀吐气——身强喜泄，才华外溢，主聪慧表达';
      } else {
        enYuan = '怨';
        detail = ssName + '泄耗元气——身弱被泄，精力涣散';
        if (isZhengStar) detail = ssName + '温和泄秀——食神虽泄但有节制，怨中留情';
      }
    } else if (wxRel === 2) { // 财星耗我 → 耗
      if (strength.r >= 0.50) {
        enYuan = '恩';
        detail = ssName + '财来就我——身强任财，主富裕享受';
      } else {
        enYuan = '怨';
        detail = ssName + '耗我元气——身弱见财反为祸，主劳碌';
      }
    } else if (wxRel === 0) { // 比劫助我
      if (strength.r < 0.50) {
        enYuan = '恩';
        detail = ssName + '助身——身弱得帮，兄弟朋友相扶';
      } else {
        enYuan = '怨';
        detail = ssName + '争夺——身强比劫为争财之敌，主竞争纷争';
      }
    }

    // 情分：距离修正
    if (dist === 1) qingFen = '有情（紧贴）';
    else qingFen = '薄情（隔柱）';

    // 恩怨翻转检测
    var isUgWx = usefulGod.candidates && usefulGod.candidates.length > 0 && usefulGod.candidates[0].w === tgWx(t);
    var isEnemyWx = usefulGod.enemy !== null && usefulGod.enemy === tgWx(t);
    var flipNote = '';
    if (isUgWx && enYuan === '怨') {
      flipNote = '虽克泄日主，但为用神所需之五行，怨中存恩';
      enYuan = '怨中有恩';
    } else if (isEnemyWx && enYuan === '恩') {
      flipNote = '虽生助日主，但为忌神五行，恩中藏怨';
      enYuan = '恩中有怨';
    }

    relations.push({
      from: pillarNames[i],
      to: '日主',
      stem: TG[t],
      shiShen: ssName,
      ssIdx: ss,
      dist: dist,
      enYuan: enYuan,
      qingFen: qingFen,
      detail: detail,
      flipNote: flipNote,
      isZhengStar: isZhengStar
    });
  }

  // ── 天干之间相邻关系（非日主视角）──
  // 年干-月干，月干(skip日干)-时干 也有相互影响
  var pairwise = [[0, 1, '年干→月干'], [1, 3, '月干→时干']];
  pairwise.forEach(function (pair) {
    var t1 = stems[pair[0]], t2 = stems[pair[1]];
    var w1 = tgWx(t1), w2 = tgWx(t2);
    var rel5 = (w2 - w1 + 5) % 5;
    var pairNote = '';
    if (rel5 === 1) pairNote = TG[t1] + '生' + TG[t2] + '——' + pair[2] + '顺生，气势流通';
    else if (rel5 === 4) pairNote = TG[t2] + '生' + TG[t1] + '——' + pair[2] + '逆生回哺';
    else if (rel5 === 2) pairNote = TG[t1] + '克' + TG[t2] + '——' + pair[2] + '相克，有冲突';
    else if (rel5 === 3) pairNote = TG[t2] + '克' + TG[t1] + '——' + pair[2] + '逆克，受压';
    else pairNote = TG[t1] + '同' + TG[t2] + '——' + pair[2] + '同气，互助';
    if (pairNote) relations.push({ from: pillarNames[pair[0]], to: pillarNames[pair[1]], pairNote: pairNote, isPair: true });
  });

  // ── 总体恩怨评估 ──
  var enCount = 0, yuanCount = 0, mixCount = 0;
  relations.forEach(function (r) {
    if (r.isPair) return;
    if (r.enYuan === '恩') enCount++;
    else if (r.enYuan === '怨') yuanCount++;
    else mixCount++; // 恩中有怨 / 怨中有恩
  });

  var verdict = '';
  if (enCount >= 2 && yuanCount === 0) verdict = '恩多怨少——贵人环绕，一生顺遂';
  else if (enCount > yuanCount) verdict = '恩多于怨——助力为主，虽有波折但终有贵人';
  else if (yuanCount > enCount) verdict = '怨多于恩——压力为主，需自强不息';
  else if (yuanCount >= 2 && enCount === 0) verdict = '怨深恩浅——六亲缘薄，凡事靠自己';
  else verdict = '恩怨参半——人生起伏，祸福相依';

  return {
    relations: relations,
    enCount: enCount,
    yuanCount: yuanCount,
    mixCount: mixCount,
    verdict: verdict
  };
}

// ══════════════════════════════════════
// §7.6 阴阳乘位检测 (Yin-Yang Position Purity)
// ══════════════════════════════════════
// 《滴天髓》原文：
//   "阳乘阳位阳气昌，最要行程安顿。"
//   "阴乘阴位阴气盛，切忌锋芒太露。"
// 白鹤鸣注：阳干坐阳支为阳乘阳位(得位)，阴干坐阴支为阴乘阴位(得位)。
// 全局得位→纯粹有力；失位过多→气势驳杂。
// 另有"阳乘阴位"(如甲坐丑)和"阴乘阳位"(如乙坐子)属交叉，
// 非不吉但需看配合。
function calcYinYangPosition(pillars) {
  var stems = pillars.stems;
  var branches = pillars.branches;
  var pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  // 《滴天髓》位置阴阳：年柱=阳位(1), 月柱=阴位(0), 日柱=阳位(1), 时柱=阴位(0)
  // 注：60甲子中阳干必配阳支、阴干必配阴支，故干支阴阳恒一致。
  // 真正的"阴阳乘位"是看天干阴阳是否与所在宫位阴阳匹配：
  //   阳干(甲丙戊庚壬)在阳位(年/日) = 阳乘阳位 = 得位
  //   阴干(乙丁己辛癸)在阴位(月/时) = 阴乘阴位 = 得位
  var posYy = [1, 0, 1, 0]; // 年=阳, 月=阴, 日=阳, 时=阴
  var details = [];
  var deWeiCount = 0;
  var yangCount = 0, yinCount = 0;

  for (var i = 0; i < 4; i++) {
    var tYy = tgYy(stems[i]);   // 天干阴阳: 1=阳, 0=阴
    var pYy = posYy[i];          // 宫位阴阳: 1=阳位, 0=阴位
    var tgName = TG[stems[i]];
    var dzName = DZ[branches[i]];
    var isDeWei = (tYy === pYy);

    if (isDeWei) {
      deWeiCount++;
      if (tYy === 1) yangCount++;
      else yinCount++;
    }

    details.push({
      pillar: pillarNames[i],
      ganZhi: tgName + dzName,
      ganYy: tYy === 1 ? '阳' : '阴',
      posYy: pYy === 1 ? '阳位' : '阴位',
      deWei: isDeWei,
      type: isDeWei ? (tYy === 1 ? '阳乘阳位' : '阴乘阴位') : (tYy === 1 ? '阳乘阴位' : '阴乘阳位'),
      note: isDeWei ?
        (tYy === 1 ? '阳气昌盛，行事刚健果断' : '阴气凝聚，处事细腻周密') :
        (tYy === 1 ? '阳干入阴位，锋芒收敛' : '阴干入阳位，柔中有刚')
    });
  }

  // 纯度评估
  var purity = '';
  var purityScore = 0;
  if (deWeiCount === 4) {
    purityScore = 100;
    purity = '四柱全得位——阴阳各安其位，气势纯粹有力';
  } else if (deWeiCount === 3) {
    purity = '三柱得位——阴阳基本纯粹，略有交叉反增灵活'; purityScore = 75;
  } else if (deWeiCount === 2) {
    purity = '两柱得位——阴阳交错，刚柔并济'; purityScore = 50;
  } else if (deWeiCount === 1) {
    purity = '仅一柱得位——阴阳驳杂，气势不专'; purityScore = 25;
  } else {
    purity = '四柱皆失位——阴阳全部交叉，主人生波折多变'; purityScore = 10;
  }

  // 全阳/全阴天干检测（独立于乘位）
  var allYang = stems.every(function (t) { return tgYy(t) === 1; });
  var allYin = stems.every(function (t) { return tgYy(t) === 0; });
  var pureNote = '';
  if (allYang) pureNote = '四干纯阳——甲丙戊庚壬全阳干，刚健之极，主魄力过人';
  else if (allYin) pureNote = '四干纯阴——乙丁己辛癸全阴干，柔顺之极，主心思缜密';

  // 日柱得位尤为重要（日主安身之所）
  var dayDeWei = details[2].deWei;
  var dayNote = dayDeWei ?
    '日柱得位——日主居阳位，阳干坐阳位主行事果断有力' :
    '日柱失位——日主坐位阴阳不协，主内心矛盾或行事迟疑';

  return {
    details: details,
    deWeiCount: deWeiCount,
    yangDeWei: yangCount,
    yinDeWei: yinCount,
    purity: purity,
    purityScore: purityScore,
    pureNote: pureNote,
    dayDeWei: dayDeWei,
    dayNote: dayNote
  };
}

// ══════════════════════════════════════
// §7.7 源流检测 (Five-Element Source-Flow Chain)
// ══════════════════════════════════════
// 《滴天髓》原文："何知其人富，财气通门户。何知其人贵，官星有理会。"
// 又："始其所始，终其所终。"
// 白鹤鸣注：命局五行当如河流般源源不断——从源头(印)经日主到终点(财官)，
// 形成完整的"源流"链条。源流通畅→格局通达；源流断裂→才能受阻。
// 例：金→水→木→火，金为源(印)，水为日主，木为食伤，火为财星 → 通畅四节
function calcSourceFlow(pillars, Vstar, usefulGod) {
  var w0 = pillars.dayMasterWx;
  var totalV = 0;
  for (var w = 0; w < 5; w++) totalV += Vstar[w];
  if (totalV <= 0) return null;

  // 判定五行是否"存在"（占总力量5%以上即视为有效存在）
  var threshold = totalV * 0.05;
  var exists = [];
  for (var w = 0; w < 5; w++) exists.push(Vstar[w] >= threshold);

  // ── 气 vs 力：每个五行的"质量"评估 ──
  // 气通 = exists（占比 >= 5%）；力足 = 天干透出 且 原局占比 >= 12%
  // 若节点仅"气通力不足"（无透干或占比偏低），整条链虽拓扑连通但实际带宽不足
  var stemWxSet = {};
  for (var si = 0; si < 4; si++) stemWxSet[tgWx(pillars.stems[si])] = true;
  var nodeQuality = []; // 每个五行的质量：full | paper | none
  for (var w = 0; w < 5; w++) {
    var pct = totalV > 0 ? Vstar[w] / totalV : 0;
    if (!exists[w]) { nodeQuality.push('none'); continue; }
    var touGan = !!stemWxSet[w];
    if (touGan && pct >= 0.12) nodeQuality.push('full');
    else if (touGan || pct >= 0.15) nodeQuality.push('medium');
    else nodeQuality.push('paper'); // 仅地支藏干、占比也低
  }

  // ── 顺生链检测 ──
  // 从日主出发，顺生方向(木→火→土→金→水→木)能走几步
  var forwardChain = [w0]; // 从日主开始
  var fw = w0;
  for (var step = 0; step < 4; step++) {
    var next = wxSheng(fw); // 下一个被生的五行
    if (exists[next]) {
      forwardChain.push(next);
      fw = next;
    } else {
      break;
    }
  }

  // ── 逆查源头 ──
  // 从日主逆推，找到生我的源头链
  var backChain = [];
  var bw = w0;
  for (var step = 0; step < 4; step++) {
    var prev = wxFanSheng(bw); // 生我的五行
    if (exists[prev]) {
      backChain.unshift(prev);
      bw = prev;
    } else {
      break;
    }
  }

  // 完整链 = 源头 → 日主 → 终点
  var fullChain = backChain.concat(forwardChain);
  var chainLength = fullChain.length;

  // ── 断流点检测 ──
  // 检查五行相生的5个环节，哪些断裂了
  var breaks = [];
  for (var w = 0; w < 5; w++) {
    var next = wxSheng(w);
    if (exists[w] && !exists[next]) {
      breaks.push({ from: w, to: next, desc: WX[w] + '生' + WX[next] + '——' + WX[next] + '不存在，源流在此断裂' });
    }
  }

  // ── 用神连通性 ──
  // 检查用神是否在源流链上
  var primaryW = usefulGod.candidates && usefulGod.candidates.length > 0 ? usefulGod.candidates[0].w : -1;
  var ugInChain = fullChain.indexOf(primaryW) >= 0;
  var ugConnectNote = '';
  if (primaryW >= 0) {
    if (ugInChain) {
      ugConnectNote = '用神' + WX[primaryW] + '在源流链上——财气通达，用神有力';
    } else {
      ugConnectNote = '用神' + WX[primaryW] + '不在源流链上——用神孤立，需大运接通';
    }
  }

  // ── 评级 ──
  var flowScore = 0;
  var flowLevel = '';

  // 基础分：链长度
  if (chainLength >= 5) flowScore = 40;      // 五行全通
  else if (chainLength >= 4) flowScore = 30;  // 四节通
  else if (chainLength >= 3) flowScore = 20;  // 三节通
  else flowScore = 10;                       // 短链

  // 加分：断流点少
  if (breaks.length === 0) flowScore += 30;
  else if (breaks.length === 1) flowScore += 15;
  // 否则不加分

  // 加分：用神在链上
  if (ugInChain) flowScore += 20;

  // 加分：从源头到财/官的完整通路
  var wCai = (w0 + 2) % 5; // 财星
  var wGuan = (w0 + 3) % 5; // 官杀
  var reachesCai = fullChain.indexOf(wCai) >= 0;
  var reachesGuan = fullChain.indexOf(wGuan) >= 0;
  if (reachesCai) flowScore += 5;
  if (reachesGuan) flowScore += 5;

  // ── 气-力质量系数：气通但不透干的节点，链路带宽打折 ──
  // 若链上有 paper 节点，整链评分打折（气通但力弱）
  var qualityPenalty = 0;
  var paperSeen = {}, mediumSeen = {};
  var paperNodes = [];
  var mediumNodes = [];
  // 分级扣分：paper 严重(4分)/一般(3分)，medium 2分
  // 严重 = 占比 < 3% 且不透干；一般 = 占比 3-5% 或藏干但弱
  for (var ci = 0; ci < fullChain.length; ci++) {
    var wci = fullChain[ci];
    var q = nodeQuality[wci];
    if (q === 'paper' && !paperSeen[wci]) {
      var pct = totalV > 0 ? Vstar[wci] / totalV : 0;
      var penalty = pct < 0.03 ? 4 : 3;
      qualityPenalty += penalty;
      paperNodes.push(WX[wci]);
      paperSeen[wci] = true;
    } else if (q === 'medium' && !mediumSeen[wci]) {
      qualityPenalty += 2;
      mediumNodes.push(WX[wci]);
      mediumSeen[wci] = true;
    }
  }
  qualityPenalty = Math.min(qualityPenalty, 20); // 最多扣 20 分（原 35）
  var rawScore = flowScore;
  flowScore = Math.max(0, flowScore - qualityPenalty);
  flowScore = Math.min(100, flowScore);

  var qualityNote = '';
  if (paperNodes.length > 0) qualityNote = '气通但力不足：'+paperNodes.join('、')+'仅在地支藏干且占比偏低，缺少天干支撑，链路实际带宽受限';
  else if (mediumNodes.length > 0) qualityNote = '链路基本可用，但'+mediumNodes.join('、')+'支撑力中等，大运流年未助时易打折';
  else qualityNote = '链路各节点均有天干透出且占比充足，气与力同步';

  if (flowScore >= 80) flowLevel = '源远流长';
  else if (flowScore >= 60) flowLevel = '流通有力';
  else if (flowScore >= 40) flowLevel = '流通一般';
  else if (flowScore >= 20) flowLevel = '气通力弱';
  else flowLevel = '断流滞塞';

  // 标注每段的十神含义
  var chainLabels = fullChain.map(function (w) {
    if (w === w0) return WX[w] + '(日主)';
    var d = (w - w0 + 5) % 5;
    var ssNames = ['比劫', '食伤', '财星', '官杀', '印星'];
    return WX[w] + '(' + ssNames[d] + ')';
  });

  return {
    fullChain: fullChain,
    chainLabels: chainLabels,
    chainLength: chainLength,
    forwardSteps: forwardChain.length - 1,
    backSteps: backChain.length,
    breaks: breaks,
    ugInChain: ugInChain,
    ugConnectNote: ugConnectNote,
    reachesCai: reachesCai,
    reachesGuan: reachesGuan,
    flowScore: flowScore,
    flowLevel: flowLevel,
    rawScore: rawScore,
    qualityPenalty: qualityPenalty,
    qualityNote: qualityNote,
    nodeQuality: nodeQuality,
    paperNodes: paperNodes,
    mediumNodes: mediumNodes
  };
}

// ══════════════════════════════════════
// §8 MAJOR LUCK PERIODS & ANNUAL FORTUNE
// ══════════════════════════════════════

function calcDaYun(pillars, gender, birthYear) {
  var t_year = pillars.stems[0];
  var isYang = (t_year % 2 === 0);
  // ε = +1 if (阳男 or 阴女), -1 if (阴男 or 阳女)
  var epsilon = ((isYang && gender === 1) || (!isYang && gender === 0)) ? 1 : -1;

  // Month pillar sexagenary number
  var t_m = pillars.month.t, d_m = pillars.month.d;
  // CRT: find n where n%10=t_m, n%12=d_m
  var n_month = (6 * t_m - 5 * d_m + 600) % 60;

  // Starting age (simplified: use approximate days to next/prev solar term)
  // For accurate calculation, we'd find the exact solar term boundary
  var jd = pillars.birthJD || pillars.jd; // 优先用精确出生JD
  var lon = solarLongitude(jd);
  var solarTermAngle;
  var targetJD;
  if (epsilon === 1) {
    // 顺排: count to NEXT solar term (next 节 boundary forward)
    var currentM = Math.floor(((lon - 315 + 360) % 360) / 30);
    solarTermAngle = (315 + (currentM + 1) * 30) % 360;
    targetJD = findSolarLonCrossing(jd, solarTermAngle, 1);
  } else {
    // 逆排: count to PREVIOUS solar term (previous 节 boundary backward)
    var currentM = Math.floor(((lon - 315 + 360) % 360) / 30);
    solarTermAngle = (315 + currentM * 30) % 360;
    targetJD = findSolarLonCrossing(jd, solarTermAngle, -1);
  }
  var deltaDays = Math.abs(targetJD - jd);
  var startAge = Math.floor(deltaDays / 3);
  var remainder = deltaDays % 3;
  var startMonths = Math.round(remainder * 4);
  if (startAge > 10) startAge = Math.round(deltaDays / 3); // sanity

  // Generate 大运 sequence (8-9 periods)
  var periods = [];
  var startYear = birthYear + startAge;
  for (var i = 1; i <= 9; i++) {
    var n = ((n_month + epsilon * i) % 60 + 60) % 60;
    var t = n % 10, d = n % 12;
    var age0 = startAge + (i - 1) * 10;
    var age1 = age0 + 9;
    var yr0 = birthYear + age0;
    var yr1 = birthYear + age1;
    var ss = shiShen(pillars.dayMaster, t);
    periods.push({
      n: n, t: t, d: d, ss: ss,
      age0: age0, age1: age1, yr0: yr0, yr1: yr1,
      name: TG[t] + DZ[d], god: shiShenName(ss)
    });
  }

  return { epsilon: epsilon, startAge: startAge, startMonths: startMonths, startYear: startYear, periods: periods, direction: epsilon === 1 ? '顺排' : '逆排' };
}

// Calculate F_综 for a specific year
function calcYearFortune(year, pillars, daYun, strength, usefulGod, gammaVec) {
  var n_flow = ((year - 4) % 60 + 60) % 60;
  var t_flow = n_flow % 10;
  var d_flow = n_flow % 12;

  // Find current 大运
  var currentDY = null;
  for (var i = 0; i < daYun.periods.length; i++) {
    if (year >= daYun.periods[i].yr0 && year <= daYun.periods[i].yr1) {
      currentDY = daYun.periods[i]; break;
    }
  }
  if (!currentDY) return null;

  // 大运 + 流年 五行增量
  // 大运权重 1.0（10年期常数）；流年权重 1.2（每年轮换）
  // ★ 大运/流年地支若落原局空亡旬 → 地支藏干力量 ×0.8（救应打折）
  var kw = (pillars && pillars.kongWang) || [];
  var delta = [0, 0, 0, 0, 0];
  // 大运天干
  var wDyT = tgWx(currentDY.t);
  delta[wDyT] += 1.0;
  // 大运地支(藏干)
  var dyKwMul = kw.indexOf(currentDY.d) >= 0 ? 0.8 : 1.0;
  var cgDy = CANG_GAN[currentDY.d];
  for (var k = 0; k < cgDy.length; k++) delta[tgWx(cgDy[k].t)] += cgDy[k].w * dyKwMul;
  // 流年天干
  var wFlT = tgWx(t_flow);
  delta[wFlT] += 1.2;
  // 流年地支(藏干)
  var flKwMul = kw.indexOf(d_flow) >= 0 ? 0.8 : 1.0;
  var cgFl = CANG_GAN[d_flow];
  for (var k = 0; k < cgFl.length; k++) delta[tgWx(cgFl[k].t)] += cgFl[k].w * 1.0 * flKwMul;

  // 五行旺衰逐元修正 (定义3.18): DeltaV_eff_w = DeltaV_w * Gamma_dynamic_w / gamma_bar_w
  var alpha_dyn = 0.5; // 动态 vs 原局旺衰混合系数
  for (var w = 0; w < 5; w++) {
    if (gammaVec && gammaVec[w] > 0.01 && delta[w] !== 0) {
      var tw = w * 2; // 阳干代表
      var gammaDyn = alpha_dyn * gammaVal(tw, currentDY.d, false) + (1 - alpha_dyn) * gammaVec[w];
      var ratio = gammaDyn / gammaVec[w];
      // 限制修正幅度在 [0.3, 2.5] 避免极端值
      ratio = Math.max(0.3, Math.min(2.5, ratio));
      delta[w] *= ratio;
    }
  }

  // 非线性饱和修正 (定义3.8): kappa ≈ 0.3
  var kappa_sat = 0.3;
  var Vavg = 0; for (var w = 0; w < 5; w++) Vavg += (gammaVec ? gammaVec[w] : 1); Vavg /= 5;
  // (简化实现：仅对较大增量施加饱和)
  for (var w = 0; w < 5; w++) {
    if (delta[w] > 0.5) {
      var baseV = gammaVec ? gammaVec[w] : 1;
      delta[w] = delta[w] * (baseV + Vavg) / (baseV + kappa_sat * delta[w] + Vavg);
    }
  }

  // 流年对大运的调和：流年天干克大运天干 → 削弱大运能量堆叠 (避免忌神连年线性叠加)
  // 五行相克: 0木克2土, 1火克3金, 2土克4水, 3金克0木, 4水克1火
  var WX_KE_MAP = {0:2, 1:3, 2:4, 3:0, 4:1};
  var flowRestrainsDy = (WX_KE_MAP[wFlT] === wDyT);
  var dyRestrainsFlow = (WX_KE_MAP[wDyT] === wFlT);
  if (flowRestrainsDy) {
    // 流年克大运：大运天干五行受挫，减30%
    delta[wDyT] *= 0.7;
  } else if (dyRestrainsFlow) {
    // 大运克流年：流年天干五行受挫，减20%（较轻，因流年本已乘0.8）
    delta[wFlT] *= 0.8;
  }

  // 极性反转 / 调候预计算
  var gammaRun = gammaVal(pillars.dayMaster, currentDY.d, false);
  var signR = strength.r < 0.5 ? 1 : (strength.r > 0.5 ? -1 : 0);
  var tiaohouExtra = 0;
  if (usefulGod.tiaohouWx >= 0 && usefulGod.tiaohouBoost > 0.10) {
    var thWx = usefulGod.tiaohouWx;
    if (delta[thWx] > 0.5) tiaohouExtra = usefulGod.tiaohouBoost * 0.4 * Math.min(delta[thWx], 2.0);
  }

  // 置信区间：参数扰动 3×3 网格
  //   用神权重缩放 wScale ∈ {0.80, 1.00, 1.20} — 反映"各法分歧"带来的 w 不确定性
  //   极性反转 mu ∈ {0.5, 0.8, 1.1} — 反映旺衰映射强度的争议
  var wScaleVariants = [0.80, 1.00, 1.20];
  var muVariants = [0.5, 0.8, 1.1];
  var Fsamples = [];
  var s_sat = 1.5;
  wScaleVariants.forEach(function(wScale){
    muVariants.forEach(function(mu){
      var fb = 0;
      for (var wi = 0; wi < 5; wi++) {
        // 只对正权重（用神/喜神）做扰动，忌神权重固定 -1 不动
        var w = usefulGod.weights[wi];
        var wAdj = (w > 0) ? w * wScale : w;
        fb += wAdj * delta[wi];
      }
      var f = fb + mu * signR * (gammaRun - strength.gamma0) + tiaohouExtra;
      Fsamples.push(s_sat * Math.tanh(f / s_sat));
    });
  });
  Fsamples.sort(function(a,b){return a-b;});
  var F_sat = Fsamples[4]; // 中位数
  var F_lo = Fsamples[0];
  var F_hi = Fsamples[8];
  // F_raw（默认参数）
  var F_base_default = 0;
  for (var w = 0; w < 5; w++) F_base_default += usefulGod.weights[w] * delta[w];
  var F_raw = F_base_default + 0.8 * signR * (gammaRun - strength.gamma0) + tiaohouExtra;
  var F_width = F_hi - F_lo;

  return {
    year: year, n: n_flow,
    t_flow: t_flow, d_flow: d_flow,
    dayun: currentDY,
    flowGZ: TG[t_flow] + DZ[d_flow],
    flowSS: shiShen(pillars.dayMaster, t_flow),
    delta: delta,
    F: F_sat,
    F_raw: F_raw,
    F_lo: F_lo,
    F_hi: F_hi,
    F_width: F_width,
    flowRestrainsDy: flowRestrainsDy,
    dyRestrainsFlow: dyRestrainsFlow
  };
}

// ══════════════════════════════════════
// §8c 时间微积分引擎 (Fractal Time Calculus)
// ══════════════════════════════════════

// JD → 精确日期+时刻字符串
function jdToDateStr(jd) {
  var jdn = Math.floor(jd + 0.5);
  var frac = (jd + 0.5) - jdn; // 一天中的小数部分 (0=午夜)
  var g = jdnToGregorian(jdn);
  var totalMin = Math.round(frac * 1440);
  var hh = Math.floor(totalMin / 60);
  var mm = totalMin % 60;
  return g.y + '年' + g.m + '月' + g.d + '日 ' + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
}

// 精确交运日期计算：3天折1年，1天=120天，1小时=5天，1分钟≈2小时
function calcPreciseTransitDates(pillars, daYun, birthYear) {
  var birthJD = pillars.birthJD || pillars.jd;
  var epsilon = daYun.epsilon;

  // 找到每段大运对应的节气JD (精确到分钟)
  var lon0 = solarLongitude(birthJD);
  var currentM = Math.floor(((lon0 - 315 + 360) % 360) / 30);

  // 起运节气JD
  var firstTermAngle, firstTermJD;
  if (epsilon === 1) {
    firstTermAngle = (315 + (currentM + 1) * 30) % 360;
    firstTermJD = findSolarLonCrossing(birthJD, firstTermAngle, 1);
  } else {
    firstTermAngle = (315 + currentM * 30) % 360;
    firstTermJD = findSolarLonCrossing(birthJD, firstTermAngle, -1);
  }

  var deltaDays = Math.abs(firstTermJD - birthJD);
  // 3天折1年 → deltaDays / 3 = 起运年数(含小数)
  var startYears = deltaDays / 3;

  // 起运精确JD = birthJD + startYears * 365.2422
  var transitJDs = [];
  for (var i = 0; i < daYun.periods.length; i++) {
    var yearsFromBirth = startYears + i * 10;
    var transitJD = birthJD + yearsFromBirth * 365.2422;
    transitJDs.push({
      period: daYun.periods[i],
      transitJD: transitJD,
      transitDate: jdToDateStr(transitJD),
      age: yearsFromBirth
    });
  }
  return transitJDs;
}

// ── 流月干支计算 (五虎遁) ──
// year: 流年, monthIdx: 0=寅月(正月), 1=卯月...11=丑月
function getFlowMonthGZ(yearStem, monthIdx) {
  var baseT = WU_HU_DUN[yearStem % 5]; // 寅月天干
  var t = (baseT + monthIdx) % 10;
  var d = (2 + monthIdx) % 12; // 寅=2, 卯=3...丑=1
  return { t: t, d: d };
}

// ── 流月 F_月 计算 ──
function calcMonthFortune(year, monthIdx, pillars, daYun, strength, usefulGod, gammaVec) {
  // 流年干支
  var n_flow = ((year - 4) % 60 + 60) % 60;
  var t_flow = n_flow % 10;
  var d_flow = n_flow % 12;

  // 当前大运
  var currentDY = null;
  for (var i = 0; i < daYun.periods.length; i++) {
    if (year >= daYun.periods[i].yr0 && year <= daYun.periods[i].yr1) {
      currentDY = daYun.periods[i]; break;
    }
  }
  if (!currentDY) return null;

  // 流月干支
  var fm = getFlowMonthGZ(t_flow, monthIdx);

  // 构建五行增量：大运(权重1.0) + 流年(0.8) + 流月(0.5)
  var delta = [0, 0, 0, 0, 0];
  // 大运
  delta[tgWx(currentDY.t)] += 1.0;
  var cgDy = CANG_GAN[currentDY.d];
  for (var k = 0; k < cgDy.length; k++) delta[tgWx(cgDy[k].t)] += cgDy[k].w;
  // 流年
  delta[tgWx(t_flow)] += 0.8;
  var cgFl = CANG_GAN[d_flow];
  for (var k = 0; k < cgFl.length; k++) delta[tgWx(cgFl[k].t)] += cgFl[k].w * 0.8;
  // 流月
  delta[tgWx(fm.t)] += 0.5;
  var cgFm = CANG_GAN[fm.d];
  for (var k = 0; k < cgFm.length; k++) delta[tgWx(cgFm[k].t)] += cgFm[k].w * 0.5;

  // 旺衰修正 (动态月令来自流月地支)
  var alpha_dyn = 0.4;
  for (var w = 0; w < 5; w++) {
    if (gammaVec && gammaVec[w] > 0.01 && delta[w] !== 0) {
      var tw = w * 2;
      var gammaDyn = alpha_dyn * gammaVal(tw, fm.d, false) + (1 - alpha_dyn) * gammaVec[w];
      var ratio = gammaDyn / gammaVec[w];
      ratio = Math.max(0.3, Math.min(2.5, ratio));
      delta[w] *= ratio;
    }
  }

  // 饱和修正
  var kappa_sat = 0.3;
  var Vavg = 0; for (var w = 0; w < 5; w++) Vavg += (gammaVec ? gammaVec[w] : 1); Vavg /= 5;
  for (var w = 0; w < 5; w++) {
    if (delta[w] > 0.5) {
      var baseV = gammaVec ? gammaVec[w] : 1;
      delta[w] = delta[w] * (baseV + Vavg) / (baseV + kappa_sat * delta[w] + Vavg);
    }
  }

  // F_月 = w^T * delta
  var F = 0;
  for (var w = 0; w < 5; w++) F += usefulGod.weights[w] * delta[w];

  // 极性反转
  var gammaRun = gammaVal(pillars.dayMaster, currentDY.d, false);
  var mu = 0.8;
  var signR = strength.r < 0.5 ? 1 : (strength.r > 0.5 ? -1 : 0);
  F += mu * signR * (gammaRun - strength.gamma0) * 0.5; // 流月权重减半

  // 流月与原局冲合检测 (简化版：只检冲)
  var clashBonus = 0;
  var dayBranch = pillars.branches[2];
  var CHONG_MAP = { 0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5 };
  if (CHONG_MAP[fm.d] === dayBranch) {
    clashBonus = -0.3; // 流月冲日支：动荡
  }
  if (CHONG_MAP[fm.d] === pillars.branches[1]) {
    clashBonus += -0.2; // 流月冲月支
  }
  F += clashBonus;

  var MONTH_NAMES = ['正月(寅)', '二月(卯)', '三月(辰)', '四月(巳)', '五月(午)', '六月(未)',
    '七月(申)', '八月(酉)', '九月(戌)', '十月(亥)', '冬月(子)', '腊月(丑)'];

  return {
    monthIdx: monthIdx,
    monthName: MONTH_NAMES[monthIdx],
    t: fm.t, d: fm.d,
    gz: TG[fm.t] + DZ[fm.d],
    ss: shiShen(pillars.dayMaster, fm.t),
    F: F,
    clashNote: clashBonus < -0.2 ? '冲日支' : (clashBonus < 0 ? '冲月支' : ''),
    delta: delta
  };
}

// ══════════════════════════════════════
// §8d 合婚引擎 (Synastry Engine)
// ══════════════════════════════════════

// 完整计算一个人的命盘数据包

function calcFullChart(Y, M, D, h, lon, hh, mm, gender, lateZiMode) {
  var pillars = calcPillars(Y, M, D, h, lon, hh, mm, lateZiMode);
  var V = calcWxVector(pillars);
  var mc = calcMonthlyCorrection(V.slice(), pillars.month.d);
  var rels = detectDzRelations(pillars.branches);
  var eff = applyDzEffects(mc.V, pillars.branches, rels, pillars.stems, pillars.kongWang);
  pillars.dayMasterWxOrig = pillars.dayMasterWx;
  if (eff.stemTransform[2]) pillars.dayMasterWx = eff.stemTransform[2].targetWx;
  var temp = calcTemperature(pillars);
  var str = calcDayMasterStrength(eff.Vmc, pillars.dayMasterWx, pillars.branches, pillars.dayMaster, temp.H, pillars.kongWang);
  var gammaVec = calcGammaVector(pillars.branches);
  var ug = selectUsefulGod(pillars.dayMasterWx, str.r, eff.Vmc, mc.ws, temp.H, str.hasRoot, pillars.stems, pillars.branches);
  var clarity = calcClarity(pillars, eff.Vmc, ug, str, eff);
  var yyPos = calcYinYangPosition(pillars);
  var sourceFlow = calcSourceFlow(pillars, eff.Vmc, ug);
  var enYuan = calcEnYuan(pillars, ug, str);
  var daYun = calcDaYun(pillars, gender, Y);
  var hp = calcHiddenPillars(pillars);
  var lifeEvents = (typeof generateLifeEvents === 'function') ? generateLifeEvents(pillars, eff, str, gender, hp) : [];
  var shenSha = (typeof calcShenSha === 'function') ? calcShenSha(pillars) : [];
  return {
    pillars: pillars, V: V, Vfinal: eff.Vmc, strength: str, usefulGod: ug,
    clarity: clarity, yyPos: yyPos, sourceFlow: sourceFlow, enYuan: enYuan,
    gammaVec: gammaVec, daYun: daYun, temp: temp, gender: gender, birthYear: Y,
    hiddenPillars: hp, dzEffects: eff,
    lifeEvents: lifeEvents, shenSha: shenSha
  };
}

// ══════════════════════════════════════
// §8e 大运信号分析 (DaYun Signal Analysis)
// ══════════════════════════════════════
// P0: 假神大运救应 + 财生官杀警示
// P1: 官杀混杂流年治理信号
function analyzeDaYunSignals(pillars, daYun, usefulGod, strength, Vfinal, clarity) {
  var signals = []; // {period, type, level, title, desc}
  var dm = pillars.dayMaster;
  var w0 = pillars.dayMasterWx;
  var stems = pillars.stems;
  var branches = pillars.branches;

  // 检测命局是否官杀混杂（从清浊评分结果读取）
  var hasGuanShaHunZa = false;
  if (clarity && clarity.notes) {
    for (var ni = 0; ni < clarity.notes.length; ni++) {
      if (clarity.notes[ni].desc && clarity.notes[ni].desc.indexOf('官杀混杂') >= 0) {
        hasGuanShaHunZa = true; break;
      }
    }
  }

  // 用神五行
  var ugWx = usefulGod.candidates && usefulGod.candidates.length > 0 ? usefulGod.candidates[0].w : -1;
  // 忌神五行
  var enemyWx = usefulGod.enemy;
  // 官杀五行 = 克日主的五行
  var guanShaWx = (w0 + 3) % 5;
  // 财星五行 = 日主所克
  var caiWx = (w0 + 2) % 5;
  // 印星五行 = 生日主
  var yinWx = (w0 + 4) % 5;
  // 食伤五行 = 日主所生
  var shiShangWx = (w0 + 1) % 5;

  // 原局用神力量
  var ugBaseV = ugWx >= 0 ? Vfinal[ugWx] : 0;

  // 假神判定数据
  var isFalseGodRegime = usefulGod.zhenJiaSummary && !usefulGod.zhenJiaSummary.hasTrueGod;

  for (var pi = 0; pi < daYun.periods.length; pi++) {
    var p = daYun.periods[pi];
    var dyT = p.t; // 大运天干index
    var dyD = p.d; // 大运地支index
    var dySS = shiShen(dm, dyT); // 大运天干十神
    var dyTWx = tgWx(dyT); // 大运天干五行
    var dyDWx = -1;
    var cg = CANG_GAN[dyD];

    // 计算大运带来的五行增量
    var dyDelta = [0, 0, 0, 0, 0];
    dyDelta[dyTWx] += 1.0;
    for (var ck = 0; ck < cg.length; ck++) dyDelta[tgWx(cg[ck].t)] += cg[ck].w;

    // ── P0-1: 假神大运救应 ──
    if (isFalseGodRegime && ugWx >= 0) {
      var ugBoost = dyDelta[ugWx];
      if (ugBoost >= 0.8) {
        var boostPct = Math.round(ugBoost / Math.max(ugBaseV, 0.1) * 100);
        signals.push({
          periodIdx: pi, period: p, type: 'jia_shen_jiu_ying',
          level: 'good',
          title: '假神得运救应',
          desc: '原局用神' + WX[ugWx] + '(' + usefulGod.candidates[0].name + ')为假神，' +
            '大运' + p.name + '带来' + WX[ugWx] + '力量+' + ugBoost.toFixed(1) + '（提升约' + boostPct + '%），' +
            '假神得大运补救，格局显著改善。建议此运中强化' + usefulGod.candidates[0].name + '代表的领域' +
            (function(n){
              if(n.indexOf('印')>=0) return '（印星=学习、文化修养、身心灵提升）';
              if(n.indexOf('比')>=0||n.indexOf('劫')>=0) return '（比劫=合作、人脉、团队力量）';
              if(n.indexOf('财')>=0) return '（财星=实业经营、理财投资）';
              if(n.indexOf('食')>=0||n.indexOf('伤')>=0) return '（食伤=创意、技术、表达展示）';
              if(n.indexOf('官')>=0||n.indexOf('杀')>=0) return '（官杀=事业、权力、管理）';
              return '';
            })(usefulGod.candidates[0].name) + '。'
        });
      }
    }

    // ── P0-2: 大运财生官杀警示 ──
    // 条件：大运天干为财星 + 命局官杀旺(占比>25%或为忌神)
    var dyIsCai = (dySS === 4 || dySS === 5); // 偏财或正财
    if (dyIsCai) {
      var totalV = 0; for (var vw = 0; vw < 5; vw++) totalV += Vfinal[vw];
      var guanShaPct = totalV > 0 ? Vfinal[guanShaWx] / totalV : 0;
      var guanShaIsEnemy = (enemyWx === guanShaWx);
      if (guanShaPct > 0.25 || guanShaIsEnemy) {
        signals.push({
          periodIdx: pi, period: p, type: 'cai_sheng_guan_sha',
          level: 'warn',
          title: '因财招压',
          desc: '大运' + p.name + '天干透' + TG[dyT] + '(' + shiShenName(dySS) + ')，' +
            '财星生官杀(' + WX[guanShaWx] + ')，' +
            (guanShaIsEnemy ? '而官杀恰为忌神，' : '命局官杀已旺(占' + Math.round(guanShaPct * 100) + '%)，') +
            '形成"因财招压"之象。此运需警惕因钱财引发的压力、官非、竞争。' +
            (strength.r < 0.4 ? '日主偏弱，压力尤重，宜低调守成，不宜冒进投资。' : '宜稳健理财，避免高杠杆操作。')
        });
      }
    }

    // ── P1-2: 官杀混杂流年治理信号 ──
    if (hasGuanShaHunZa) {
      // 检测大运天干是否能"合杀"或"制杀"
      // 合杀：大运天干与命局七杀天干能天干五合
      // 制杀：大运天干为食伤
      var canHeSha = false, canZhiSha = false;
      // 查找命局中的七杀天干
      for (var si = 0; si < 4; si++) {
        if (si === 2) continue;
        var ssSi = shiShen(dm, stems[si]);
        if (ssSi === 6) { // 七杀 (shiShen编码: 6=七杀,7=正官)
          // 检查大运天干是否与此七杀天干五合
          if ((dyT + 5) % 10 === stems[si]) { // 天干五合: 甲己(0,5)乙庚(1,6)...
            canHeSha = true;
          }
        }
      }
      // 制杀：大运天干为食神或伤官
      if (dySS === 2 || dySS === 3) canZhiSha = true; // 食神=2, 伤官=3
      if (canHeSha) {
        signals.push({
          periodIdx: pi, period: p, type: 'he_sha_liu_guan',
          level: 'good',
          title: '合杀留官',
          desc: '大运' + p.name + '天干' + TG[dyT] + '能合住命局七杀，' +
            '实现"合杀留官"，官杀混杂之患得以化解。' +
            '此运有利于职场晋升、获取正当权力，宜主动争取机会。'
        });
      }
      if (canZhiSha) {
        signals.push({
          periodIdx: pi, period: p, type: 'zhi_sha_liu_guan',
          level: 'good',
          title: '制杀留官',
          desc: '大运' + p.name + '天干' + TG[dyT] + '(' + shiShenName(dySS) + ')能制七杀，' +
            '实现"制杀留官"。食伤制杀，化压力为动力，' +
            '此运宜以才华/技术制服竞争对手，变被动为主动。'
        });
      }
    }
  }

  return {
    signals: signals,
    hasGuanShaHunZa: hasGuanShaHunZa,
    isFalseGodRegime: isFalseGodRegime
  };
}

// 六冲对照表
var CHONG_PAIRS = { 0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5 };
// 六合对照表: branch → partner
var HE_PAIRS = { 0: 1, 1: 0, 2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2 };
// 天干五合: i → partner
var TG_HE_PAIRS = { 0: 5, 1: 6, 2: 7, 3: 8, 4: 9, 5: 0, 6: 1, 7: 2, 8: 3, 9: 4 };

// ══════════════════════════════════════════════════════════════
// §L  农历 ↔ 公历 转换模块
// ══════════════════════════════════════════════════════════════
// 数据编码：每个 hex 值对应一年（1900–2100）
//   bit 0-3  : 闰月月份（0=无闰月, 1-12）
//   bit 4-15 : 月份大小（bit 16-m => 1=大月30天, 0=小月29天）
//   bit 16   : 闰月大小（1=30天, 0=29天）
// 基准日：1900-01-31 = 农历 庚子年 正月初一
var LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990-1999
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0, // 2050-2059
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252, // 2090-2099
  0x0d520  // 2100
];

/* 农历某年的闰月月份（0=无闰月） */
function lunarLeapMonth(y){ return LUNAR_INFO[y-1900] & 0xf; }

/* 农历某年闰月天数（无闰月返回0） */
function lunarLeapDays(y){
  if(lunarLeapMonth(y)) return (LUNAR_INFO[y-1900] & 0x10000) ? 30 : 29;
  return 0;
}

/* 农历某年某月天数（正常月，非闰月） */
function lunarMonthDays(y, m){ return (LUNAR_INFO[y-1900] & (0x10000 >> m)) ? 30 : 29; }

/* 农历某年总天数 */
function lunarYearDays(y){
  var sum = 348; // 12 × 29
  for(var i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[y-1900] & i) ? 1 : 0;
  return sum + lunarLeapDays(y);
}

/**
 * 农历 → 公历
 * @param {number} lunarY  农历年 (1901-2099)
 * @param {number} lunarM  农历月 (1-12)
 * @param {number} lunarD  农历日 (1-30)
 * @param {boolean} isLeap 是否闰月
 * @returns {{year,month,day}|null}
 */
function lunarToSolar(lunarY, lunarM, lunarD, isLeap){
  if(lunarY < 1901 || lunarY > 2099) return null;
  var leap = lunarLeapMonth(lunarY);
  // 验证闰月请求
  if(isLeap && lunarM !== leap) return null;
  // 验证日期范围
  var maxDay = isLeap ? lunarLeapDays(lunarY) : lunarMonthDays(lunarY, lunarM);
  if(lunarD < 1 || lunarD > maxDay) return null;

  // 累计天数：从 1900-01-31 起算
  var offset = 0;
  for(var y = 1900; y < lunarY; y++) offset += lunarYearDays(y);

  var lm = lunarLeapMonth(lunarY);
  for(var m = 1; m < lunarM; m++){
    offset += lunarMonthDays(lunarY, m);
    if(m === lm) offset += lunarLeapDays(lunarY);
  }
  // 如果目标是闰月，先加上该月的正常天数
  if(isLeap) offset += lunarMonthDays(lunarY, lunarM);
  // 如果目标不是闰月，但闰月=目标月，正常月排在闰月前，无需额外处理

  offset += lunarD - 1;

  // 1900-01-31 的 JDN
  var baseJDN = gregorianToJDN(1900, 1, 31);
  var g = jdnToGregorian(baseJDN + offset);
  return { year: g.y, month: g.m, day: g.d };
}

/**
 * 公历 → 农历
 * @returns {{year,month,day,isLeap,monthName}}
 */
function solarToLunar(sY, sM, sD){
  var baseJDN = gregorianToJDN(1900, 1, 31);
  var targetJDN = gregorianToJDN(sY, sM, sD);
  var offset = targetJDN - baseJDN;
  if(offset < 0) return null;

  var y = 1900, temp = 0;
  for(; y < 2101 && offset > 0; y++){
    temp = lunarYearDays(y);
    offset -= temp;
  }
  if(offset < 0){ offset += temp; y--; }

  var leap = lunarLeapMonth(y);
  var isLeap = false;
  var m = 1;
  for(; m <= 12 && offset > 0; m++){
    // 先数正常月
    temp = lunarMonthDays(y, m);
    if(offset < temp) break;
    offset -= temp;
    // 再数闰月（如果有）
    if(m === leap){
      temp = lunarLeapDays(y);
      if(offset < temp){ isLeap = true; break; }
      offset -= temp;
    }
  }
  var LUNAR_MONTH_NAMES = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  return { year: y, month: m, day: offset + 1, isLeap: isLeap,
           monthName: (isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[m-1] + '月' };
}

/**
 * 获取某农历年的月份列表（含闰月），用于 UI 下拉
 * @returns [{value, label, isLeap}]
 */
function getLunarMonthList(lunarY){
  var NAMES = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
  var list = [];
  var leap = lunarLeapMonth(lunarY);
  for(var m = 1; m <= 12; m++){
    list.push({ value: m, label: NAMES[m-1], isLeap: false, days: lunarMonthDays(lunarY, m) });
    if(m === leap){
      list.push({ value: m, label: '闰' + NAMES[m-1], isLeap: true, days: lunarLeapDays(lunarY) });
    }
  }
  return list;
}

// ══════════════════════════════════════════════════════════════
// §R  八字反查日期
// ══════════════════════════════════════════════════════════════
/**
 * 根据四柱干支反查对应的公历日期（自动从年柱推算可能年份）
 * @param {string} yGZ 年柱 如 "壬戌"
 * @param {string} mGZ 月柱 如 "丁未"
 * @param {string} dGZ 日柱 如 "庚子"
 * @param {string} hGZ 时柱 如 "己卯"
 * @returns {Array<{year,month,day,hour,minute}>}
 */
function findDateFromBazi(yGZ, mGZ, dGZ, hGZ){
  var S = '甲乙丙丁戊己庚辛壬癸', B = '子丑寅卯辰巳午未申酉戌亥';
  function parse(gz){ return [S.indexOf(gz[0]), B.indexOf(gz[1])]; }
  function gzIdx(s, b){ return ((6*s - 5*b) % 60 + 60) % 60; }

  var ys = parse(yGZ), ms = parse(mGZ), ds = parse(dGZ), hs = parse(hGZ);
  if(ys[0]<0||ms[0]<0||ds[0]<0||hs[0]<0) return [];

  // calcPillars 的 hour 参数是地支序号(0-11)，不是钟表时
  var targetBranch = hs[1];
  // 用于 URL 的钟表时近似值（取时辰中间值）
  var clockHH = targetBranch === 0 ? 0 : targetBranch * 2;

  // 从年柱推算所有可能的公历年份（60年一轮）
  var yearIdx = gzIdx(ys[0], ys[1]);
  var candidateYears = [];
  for(var y = 1920; y <= 2060; y++){
    if(((y - 4) % 60 + 60) % 60 === yearIdx) candidateYears.push(y);
  }

  // 从 day pillar 的六十甲子序号推算 JDN 候选
  var dayIdx = gzIdx(ds[0], ds[1]);
  var matches = [];

  for(var ci = 0; ci < candidateYears.length; ci++){
    var approxYear = candidateYears[ci];
    var startJDN = gregorianToJDN(approxYear - 1, 11, 1);
    var rem = ((dayIdx - 49) % 60 + 60) % 60;
    var firstJDN = startJDN + ((rem - startJDN % 60) % 60 + 60) % 60;

    for(var jdn = firstJDN; jdn < startJDN + 500; jdn += 60){
      var g = jdnToGregorian(jdn);
      try {
        var p = calcPillars(g.y, g.m, g.d, targetBranch);
        if(p.stems[0]===ys[0] && p.branches[0]===ys[1] &&
           p.stems[1]===ms[0] && p.branches[1]===ms[1] &&
           p.stems[2]===ds[0] && p.branches[2]===ds[1] &&
           p.stems[3]===hs[0] && p.branches[3]===hs[1]){
          matches.push({ year:g.y, month:g.m, day:g.d, hour:clockHH, minute:0 });
        }
      } catch(e){}
    }
  }
  return matches;
}
