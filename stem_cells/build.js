const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("/root/.claude/skills/synced/e8943a24-8032-480b-b8fb-1f328f82916f_c68b403d-b633-483e-8892-01c09df4ca88/pptx/scripts/apply_theme.js");

const THEME = {
  name: "Stem Cells",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "1B2B34", lt1: "FFFFFF", dk2: "0B4F6C", lt2: "EAF4F4",
    accent1: "0B4F6C", accent2: "F26B5B", accent3: "20A39E", accent4: "FFBA49",
    accent5: "7B6CB7", accent6: "5C6B73", hlink: "0B4F6C", folHlink: "7B6CB7",
  },
};
const H = THEME.colors;
const RTL = { rtlMode: true, lang: "ar-SA", align: "right" };

async function icon(name, color) {
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.rtlMode = true;
  pres.title = "الخلايا الجذعية";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: H.lt1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.13, h: 0.9, fontSize: 36, bold: true, color: C.text2, align: "right", rtlMode: true, margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 0.6, y: 6.95, w: 0.6, h: 0.35, fontSize: 11, color: H.accent6 },
  });
  pres.defineSlideMaster({ title: "DARK", background: { color: H.dk2 } });

  const T = (s, text, o) => s.addText(text, { isTextBox: true, ...RTL, fontSize: 16, color: C.text1, valign: "top", ...o });

  // circle icon helper (motif: icons in colored circles)
  async function badge(s, x, y, d, ic, fill) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
    const p = d * 0.25;
    s.addImage({ data: await icon(ic, "FFFFFF"), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  }

  // 1. Title
  pres.addSection({ title: "المقدمة" });
  let s = pres.addSlide({ masterName: "DARK", sectionTitle: "المقدمة" });
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.2, w: 6, h: 6, fill: { color: H.accent3, transparency: 70 }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: 1.8, y: 1.2, w: 2.6, h: 2.6, fill: { color: H.accent2, transparency: 40 }, line: { type: "none" } });
  s.addImage({ data: await icon("FaDna", "FFFFFF"), x: 2.45, y: 1.85, w: 1.3, h: 1.3 });
  T(s, "الخلايا الجذعية", { x: 5.2, y: 2.0, w: 7.5, h: 1.3, fontSize: 54, bold: true, color: C.background1 });
  T(s, "تعريفها • وظيفتها • استخداماتها", { x: 5.2, y: 3.35, w: 7.5, h: 0.7, fontSize: 24, color: "CDE7E6" });
  T(s, "عرض تعليمي", { x: 5.2, y: 4.4, w: 7.5, h: 0.5, fontSize: 16, italic: true, color: H.accent4 });
  s.addNotes("مرحباً بكم. سنتعرف اليوم على الخلايا الجذعية: ما هي، وما دورها في الجسم، وكيف يستفيد منها الطب.");

  // 2. Definition
  pres.addSection({ title: "التعريف" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "التعريف" });
  s.addText("ما هي الخلايا الجذعية؟", { placeholder: "title" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.6, w: 12.13, h: 1.5, rectRadius: 0.15, fill: { color: C.background2 }, line: { type: "none" } });
  T(s, "خلايا غير متخصصة (غير متمايزة) قادرة على الانقسام لإنتاج نسخ مطابقة لنفسها، وعلى التحول إلى أنواع مختلفة من الخلايا المتخصصة مثل خلايا الدم والعضلات والأعصاب.",
    { x: 0.9, y: 1.75, w: 11.5, h: 1.2, fontSize: 20, valign: "middle" });
  const props = [
    ["FaSyncAlt", H.accent3, "التجديد الذاتي", "تنقسم مرات عديدة لتنتج خلايا جذعية جديدة مماثلة لها، فتحافظ على مخزونها في الجسم."],
    ["FaCodeBranch", H.accent2, "التمايز", "تستجيب لإشارات معينة فتتحول إلى خلايا متخصصة ذات شكل ووظيفة محددين."],
  ];
  for (let i = 0; i < 2; i++) {
    const [ic, col, h, b] = props[i];
    const x = i === 0 ? 6.85 : 0.6; // RTL: first item on the right
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.5, w: 5.88, h: 3.0, rectRadius: 0.15, fill: { color: C.background1 }, line: { color: "D5E3E3", width: 1 }, shadow: { type: "outer", blur: 6, offset: 2, angle: 90, color: "000000", opacity: 0.12 } });
    await badge(s, x + 4.48, 3.8, 1.1, ic, col);
    T(s, h, { x: x + 0.3, y: 3.95, w: 4.0, h: 0.6, fontSize: 24, bold: true, color: C.text2, margin: 0 });
    T(s, b, { x: x + 0.3, y: 5.05, w: 5.28, h: 1.2, fontSize: 16, margin: 0 });
  }
  s.addNotes("الخاصيتان الأساسيتان هما التجديد الذاتي والقدرة على التمايز، وهما ما يميز الخلية الجذعية عن غيرها.");

  // 3. Types
  pres.addSection({ title: "الأنواع" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الأنواع" });
  s.addText("أنواع الخلايا الجذعية", { placeholder: "title" });
  const types = [
    ["FaBaby", H.accent1, "الجنينية", "تؤخذ من الجنين في أيامه الأولى (الكيسة الأريمية)، ويمكنها التحول إلى أي نوع من خلايا الجسم."],
    ["FaUserAlt", H.accent3, "البالغة", "توجد في أنسجة البالغين كنخاع العظم والدهون والجلد، وتنتج خلايا النسيج الذي توجد فيه."],
    ["FaFlask", H.accent5, "المحفزة (iPSCs)", "خلايا بالغة أُعيدت برمجتها مخبرياً لتعود إلى حالة تشبه الجنينية. اكتُشفت عام 2006."],
    ["FaHeartbeat", H.accent2, "دم الحبل السري", "تُجمع من الحبل السري والمشيمة بعد الولادة، وهي غنية بالخلايا المكوّنة للدم."],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, h, b] = types[i];
    const w = 2.83, gap = 0.27, x = 12.73 - w - i * (w + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w, h: 4.4, rectRadius: 0.15, fill: { color: C.background2 }, line: { type: "none" } });
    await badge(s, x + (w - 1.2) / 2, 1.95, 1.2, ic, col);
    T(s, h, { x: x + 0.2, y: 3.35, w: w - 0.4, h: 0.6, fontSize: 20, bold: true, color: C.text2, align: "center", margin: 0 });
    T(s, b, { x: x + 0.25, y: 4.05, w: w - 0.5, h: 2.4, fontSize: 15, margin: 0 });
  }
  s.addNotes("تختلف الأنواع في مصدرها وفي مدى قدرتها على التحول إلى أنواع أخرى من الخلايا.");

  // 4. Potency levels
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الأنواع" });
  s.addText("درجات القدرة على التمايز", { placeholder: "title" });
  const pot = [
    ["كاملة القدرة", "Totipotent", "تكوّن الجنين كاملاً مع المشيمة (البويضة المخصبة)"],
    ["وافرة القدرة", "Pluripotent", "تكوّن جميع خلايا الجسم (الجنينية والمحفزة)"],
    ["متعددة القدرات", "Multipotent", "تكوّن عدة أنواع ضمن عائلة واحدة (خلايا الدم)"],
    ["أحادية القدرة", "Unipotent", "تكوّن نوعاً واحداً فقط (خلايا الجلد)"],
  ];
  const shades = [H.dk2, "1F6E8C", H.accent3, "7CC6C2"];
  for (let i = 0; i < 4; i++) {
    const w = 2.75, gap = 0.37, x = 12.73 - w - i * (w + gap);
    s.addShape(pres.shapes.CHEVRON, { x, y: 1.9, w, h: 1.5, fill: { color: shades[i] }, line: { type: "none" }, flipH: true });
    T(s, String(i + 1), { x, y: 1.9, w, h: 1.5, fontSize: 40, bold: true, color: C.background1, align: "center", valign: "middle" });
    T(s, pot[i][0], { x, y: 3.7, w, h: 0.55, fontSize: 22, bold: true, color: C.text2, align: "center", margin: 0 });
    T(s, pot[i][1], { x, y: 4.25, w, h: 0.4, fontSize: 14, italic: true, color: H.accent6, align: "center", margin: 0, rtlMode: false, lang: "en-US" });
    T(s, pot[i][2], { x: x + 0.1, y: 4.8, w: w - 0.2, h: 1.3, fontSize: 15, align: "center", margin: 0 });
  }
  T(s, "كلما اتجهنا يساراً قلّت قدرة الخلية على التحول إلى أنواع أخرى", { x: 0.6, y: 6.3, w: 12.13, h: 0.45, fontSize: 14, italic: true, color: H.accent6, align: "center" });

  // 5. Function
  pres.addSection({ title: "الوظيفة" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الوظيفة" });
  s.addText("وظيفتها في جسم الإنسان", { placeholder: "title" });
  const funcs = [
    ["FaSeedling", H.accent3, "بناء الجسم في المرحلة الجنينية", "تتمايز لتكوين جميع الأنسجة والأعضاء أثناء نمو الجنين."],
    ["FaTint", H.accent2, "تجديد خلايا الدم", "ينتج نخاع العظم مليارات خلايا الدم الحمراء والبيضاء والصفائح يومياً."],
    ["FaBandAid", H.accent4, "إصلاح الأنسجة التالفة", "تعوّض الخلايا المصابة أو الميتة عند الجروح والإصابات."],
    ["FaRedo", H.accent5, "صيانة الأنسجة باستمرار", "تجدد بطانة الأمعاء والجلد التي تُستبدل خلاياها كل بضعة أيام أو أسابيع."],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, h, b] = funcs[i];
    const col2 = i % 2, row = Math.floor(i / 2);
    const x = col2 === 0 ? 6.85 : 0.6, y = 1.7 + row * 2.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.88, h: 2.25, rectRadius: 0.15, fill: { color: C.background2 }, line: { type: "none" } });
    await badge(s, x + 4.63, y + 0.5, 1.0, ic, col);
    T(s, h, { x: x + 0.3, y: y + 0.35, w: 4.1, h: 0.6, fontSize: 20, bold: true, color: C.text2, margin: 0 });
    T(s, b, { x: x + 0.3, y: y + 1.0, w: 4.1, h: 1.1, fontSize: 15, margin: 0 });
  }

  // 6. Medical uses
  pres.addSection({ title: "الاستخدامات" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الاستخدامات" });
  s.addText("استخداماتها في العلاج", { placeholder: "title" });
  const uses = [
    ["FaTint", H.accent2, "أمراض الدم", "زراعة نخاع العظم لعلاج سرطان الدم (اللوكيميا) والأنيميا اللاتنسّجية"],
    ["FaHandPaper", H.accent4, "الحروق والجلد", "زراعة جلد مستنبت لتغطية الحروق الواسعة"],
    ["FaEye", H.accent3, "العيون", "إصلاح القرنية التالفة واستعادة الإبصار"],
    ["FaHeart", H.accent2, "القلب", "أبحاث لإصلاح عضلة القلب بعد الجلطات"],
    ["FaBrain", H.accent5, "الجهاز العصبي", "أبحاث لعلاج باركنسون وإصابات الحبل الشوكي"],
    ["FaSyringe", H.accent1, "السكري", "أبحاث لإنتاج خلايا بيتا المفرزة للإنسولين"],
  ];
  for (let i = 0; i < 6; i++) {
    const [ic, col, h, b] = uses[i];
    const c = i % 2, r = Math.floor(i / 3), cc = i % 3;
    const x = 12.73 - 3.9 - cc * (3.9 + 0.22), y = 1.6 + r * 2.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.9, h: 2.35, rectRadius: 0.15, fill: { color: C.background1 }, line: { color: "D5E3E3", width: 1 } });
    await badge(s, x + 2.95, y + 0.25, 0.75, ic, col);
    T(s, h, { x: x + 0.25, y: y + 0.3, w: 2.55, h: 0.6, fontSize: 19, bold: true, color: C.text2, margin: 0, valign: "middle" });
    T(s, b, { x: x + 0.25, y: y + 1.15, w: 3.45, h: 1.05, fontSize: 15, margin: 0 });
  }
  T(s, "الثلاثة الأولى علاجات معتمدة • الثلاثة الأخيرة ما زالت قيد البحث والتجارب السريرية", { x: 0.6, y: 6.85, w: 11.0, h: 0.4, fontSize: 12, italic: true, color: H.accent6 });
  s.addNotes("مهم التفريق: زراعة نخاع العظم علاج راسخ منذ عقود، بينما علاجات القلب والدماغ والسكري ما زالت تجريبية.");

  // 7. Research uses + stats
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الاستخدامات" });
  s.addText("استخداماتها في البحث العلمي", { placeholder: "title" });
  const res = [
    ["FaPills", "اختبار الأدوية الجديدة", "تجربة فعالية الدواء وسميته على خلايا بشرية قبل التجارب على المرضى."],
    ["FaMicroscope", "فهم الأمراض", "تحويل خلايا المريض إلى الأنسجة المصابة لدراسة كيف ينشأ المرض."],
    ["FaCubes", "هندسة الأنسجة", "استنبات أنسجة وأعضاء صغيرة (عضيّات) في المختبر بهدف زراعتها مستقبلاً."],
  ];
  for (let i = 0; i < 3; i++) {
    const [ic, h, b] = res[i], y = 1.65 + i * 1.7;
    await badge(s, 11.73, y, 1.0, ic, H.accent3);
    T(s, h, { x: 5.6, y: y - 0.05, w: 5.9, h: 0.55, fontSize: 20, bold: true, color: C.text2, margin: 0 });
    T(s, b, { x: 5.6, y: y + 0.5, w: 5.9, h: 0.9, fontSize: 15, margin: 0 });
  }
  const stats = [["1968", "أول زراعة ناجحة لنخاع العظم من متبرع غير توأم"], ["2012", "جائزة نوبل لاكتشاف الخلايا المحفزة (ياماناكا)"]];
  for (let i = 0; i < 2; i++) {
    const y = 1.65 + i * 2.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 4.4, h: 2.3, rectRadius: 0.15, fill: { color: C.text2 }, line: { type: "none" } });
    T(s, stats[i][0], { x: 0.8, y: y + 0.2, w: 4.0, h: 1.1, fontSize: 60, bold: true, color: H.accent4, align: "center", valign: "middle", margin: 0 });
    T(s, stats[i][1], { x: 0.8, y: y + 1.35, w: 4.0, h: 0.8, fontSize: 15, color: C.background1, align: "center", margin: 0 });
  }

  // 8. Challenges & ethics
  pres.addSection({ title: "التحديات" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "التحديات" });
  s.addText("التحديات والجوانب الأخلاقية", { placeholder: "title" });
  const ch = [
    ["FaShieldAlt", H.accent2, "رفض المناعة", "قد يهاجم جهاز المناعة الخلايا المزروعة إن لم تكن متوافقة مع المريض."],
    ["FaExclamationTriangle", H.accent4, "خطر الأورام", "الانقسام غير المنضبط قد يؤدي إلى تكوّن أورام."],
    ["FaBalanceScale", H.accent5, "الجدل الأخلاقي", "استخدام الأجنة البشرية يثير نقاشاً أخلاقياً ودينياً، وتنظمه قوانين صارمة."],
    ["FaUserShield", H.accent1, "العيادات غير المرخصة", "بعض المراكز تروّج لعلاجات غير مثبتة علمياً؛ يجب الحذر والتحقق."],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, h, b] = ch[i];
    const y = 1.6 + i * 1.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 12.13, h: 1.1, rectRadius: 0.12, fill: { color: C.background2 }, line: { type: "none" } });
    await badge(s, 11.73, y + 0.15, 0.8, ic, col);
    T(s, h, { x: 8.4, y: y + 0.2, w: 3.1, h: 0.7, fontSize: 20, bold: true, color: C.text2, margin: 0, valign: "middle" });
    T(s, b, { x: 0.9, y: y + 0.2, w: 7.3, h: 0.7, fontSize: 16, margin: 0, valign: "middle" });
  }

  // 9. Summary
  pres.addSection({ title: "الخلاصة" });
  s = pres.addSlide({ masterName: "DARK", sectionTitle: "الخلاصة" });
  s.addShape(pres.shapes.OVAL, { x: 9.5, y: -2, w: 6, h: 6, fill: { color: H.accent3, transparency: 70 }, line: { type: "none" } });
  T(s, "الخلاصة", { x: 0.6, y: 0.6, w: 12.13, h: 0.9, fontSize: 40, bold: true, color: C.background1 });
  const sum = [
    "الخلايا الجذعية خلايا غير متخصصة تتجدد ذاتياً وتتمايز إلى خلايا متخصصة.",
    "أنواعها: جنينية، بالغة، محفزة، ومن دم الحبل السري.",
    "وظيفتها: بناء الجسم، تجديد الدم، وإصلاح الأنسجة وصيانتها.",
    "تُستخدم فعلياً في علاج أمراض الدم والحروق والقرنية، وتَعِد بالمزيد مستقبلاً.",
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.9 + i * 1.15;
    s.addShape(pres.shapes.OVAL, { x: 12.03, y, w: 0.7, h: 0.7, fill: { color: H.accent2 }, line: { type: "none" } });
    T(s, String(i + 1), { x: 12.03, y, w: 0.7, h: 0.7, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
    T(s, sum[i], { x: 1.5, y, w: 10.3, h: 0.7, fontSize: 20, color: C.background1, valign: "middle", margin: 0 });
  }
  T(s, "شكراً لحسن استماعكم", { x: 0.6, y: 6.6, w: 12.13, h: 0.5, fontSize: 18, italic: true, color: H.accent4, align: "center" });

  // 10. References
  pres.addSection({ title: "المراجع" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "المراجع" });
  s.addText("المراجع العلمية", { placeholder: "title" });
  const refs = [
    ["تعريف الخلايا الجذعية وخصائصها وأنواعها", "National Institutes of Health (NIH). Stem Cell Information – Stem Cell Basics.", "https://stemcells.nih.gov/"],
    ["مدخل عام موثوق للخلايا الجذعية", "U.S. National Library of Medicine. MedlinePlus: Stem Cells.", "https://medlineplus.gov/stemcells.html"],
    ["الأنواع والاستخدامات العلاجية والبحثية", "Mayo Clinic. Stem cells: What they are and what they do.", "https://www.mayoclinic.org/tests-procedures/bone-marrow-transplant/in-depth/stem-cells/art-20048117"],
    ["التحديات والتحذير من العلاجات غير المثبتة", "International Society for Stem Cell Research (ISSCR). The ISSCR Guide to Stem Cell Treatments, 2024.", "https://www.isscr.org/patients"],
    ["اكتشاف الخلايا المحفزة وجائزة نوبل 2012", "The Nobel Assembly at Karolinska Institutet. Press release: The Nobel Prize in Physiology or Medicine 2012.", "https://www.nobelprize.org/prizes/medicine/2012/press-release/"],
    ["أول زراعة ناجحة لنخاع العظم عام 1968", "M Health Fairview. Celebrating 50 years of blood and marrow transplant history (Robert A. Good, 1968).", "https://www.mhealthfairview.org/blog/aug-24-celebrating-50-years-blood-and-marrow-transplant-history"],
  ];
  for (let i = 0; i < refs.length; i++) {
    const [topic, cite, url] = refs[i], y = 1.55 + i * 0.88;
    s.addShape(pres.shapes.OVAL, { x: 12.18, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: H.accent3 }, line: { type: "none" } });
    T(s, String(i + 1), { x: 12.18, y: y + 0.08, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
    T(s, topic, { x: 0.6, y, w: 11.35, h: 0.36, fontSize: 15, bold: true, color: C.text2, margin: 0 });
    s.addText([
      { text: cite + " ", options: { color: H.dk1 } },
      { text: url, options: { hyperlink: { url }, color: H.accent1, underline: { style: "sng" } } },
    ], { isTextBox: true, x: 0.6, y: y + 0.37, w: 11.35, h: 0.42, fontSize: 11, align: "right", rtlMode: false, lang: "en-US", margin: 0, valign: "top", fit: "shrink" });
  }
  s.addNotes("المراجع مأخوذة من مؤسسات علمية وطبية رسمية. تمت مراجعة الروابط في نوفمبر 2026.");

  await pres.writeFile({ fileName: "stem_cells.pptx" });
  await applyTheme("stem_cells.pptx", THEME);
  console.log("done");
})();
