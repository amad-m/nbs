"""Builds the Syrian revolution timeline video: HTML slides -> PNG, espeak-ng narration, ffmpeg assembly."""
import subprocess, json, os, sys

D = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(D, "syria.mp4")

# (year label, title, body, narration) — narration uses words for numbers so espeak reads them well.
S = [
 ("2011 – 2024", "الثورة السورية", "من صرخة الحرية في درعا إلى سقوط النظام في دمشق",
  "الثورة السورية. من صرخة الحرية في درعا، إلى سقوط النظام في دمشق."),
 ("آذار 2011", "شرارة درعا", "أطفال يكتبون على جدار مدرستهم: «إجاك الدور يا دكتور»<br>اعتقالهم وتعذيبهم يُشعل أولى المظاهرات في 18 آذار",
  "في آذار عام ألفين وأحد عشر، كتب أطفال في درعا عبارات على جدار مدرستهم. اعتقلتهم الأجهزة الأمنية وعذبتهم، فخرج الأهالي في أولى المظاهرات، مطالبين بالكرامة والحرية."),
 ("ربيع وصيف 2011", "سلمية سلمية", "المظاهرات تمتد إلى حمص وحماة وبانياس ودير الزور وريف دمشق<br>ساحة العاصي في حماة تجمع مئات الآلاف",
  "امتدت المظاهرات السلمية إلى حمص وحماة وبانياس ودير الزور وريف دمشق. وفي ساحة العاصي بحماة، اجتمع مئات الآلاف. لكن النظام واجه الهتافات بالرصاص والاعتقال والدبابات."),
 ("تموز 2011", "الجيش السوري الحر", "ضباط وجنود ينشقون رفضاً لإطلاق النار على المتظاهرين<br>ويُعلنون تشكيل الجيش السوري الحر",
  "في تموز ألفين وأحد عشر، أعلن ضباط منشقون رفضوا إطلاق النار على المتظاهرين، تشكيل الجيش السوري الحر. وبدأت الثورة تتحول إلى مواجهة مسلحة."),
 ("2012", "من بابا عمرو إلى حلب", "حصار وقصف حي بابا عمرو في حمص<br>ومعركة حلب تبدأ في تموز 2012",
  "في عام ألفين واثني عشر، حوصر حي بابا عمرو في حمص وقصف لأسابيع. وفي الصيف، امتدت المعارك إلى حلب، أكبر مدن البلاد."),
 ("21 آب 2013", "مجزرة الكيماوي في الغوطة", "صواريخ محمّلة بغاز السارين تضرب الغوطتين<br>مئات الضحايا، كثير منهم أطفال، يموتون اختناقاً",
  "في الحادي والعشرين من آب ألفين وثلاثة عشر، قصفت الغوطة بصواريخ محملة بغاز السارين. مات المئات اختناقا وهم نيام، وكثير منهم أطفال."),
 ("2014", "صعود تنظيم داعش", "التنظيم يسيطر على الرقة ومساحات واسعة شرق سوريا<br>وتحالف دولي يبدأ ضرباته الجوية",
  "في عام ألفين وأربعة عشر، سيطر تنظيم داعش على الرقة ومساحات واسعة من شرق البلاد، فتعقد المشهد، وبدأ تحالف دولي ضرباته الجوية."),
 ("أيلول 2015", "التدخل الروسي", "روسيا تبدأ حملة جوية واسعة دعماً للنظام<br>وتقلب موازين المعركة",
  "في أيلول ألفين وخمسة عشر، تدخلت روسيا عسكريا بحملة جوية واسعة لدعم النظام، إلى جانب إيران والميليشيات الحليفة، فانقلبت موازين المعركة."),
 ("كانون الأول 2016", "سقوط حلب الشرقية", "حصار وقصف ثم تهجير عشرات الآلاف<br>بالحافلات الخضراء نحو الشمال",
  "في كانون الأول ألفين وستة عشر، سقطت أحياء حلب الشرقية بعد حصار وقصف عنيف، وهجر عشرات الآلاف من أهلها بالحافلات الخضراء نحو الشمال."),
 ("2017 – 2018", "خان شيخون والغوطة ودرعا", "هجوم كيماوي جديد على خان شيخون<br>ثم سقوط الغوطة الشرقية ودرعا وموجات تهجير جديدة",
  "في عام ألفين وسبعة عشر، ضرب هجوم كيماوي جديد بلدة خان شيخون. وفي العام التالي، استعاد النظام الغوطة الشرقية ودرعا، وتواصلت موجات التهجير."),
 ("2020 – 2023", "سنوات الجمود والمعاناة", "خطوط الجبهة تتجمد وإدلب تحتضن الملايين من المهجرين<br>انهيار اقتصادي وزلزال شباط 2023",
  "بعد عام ألفين وعشرين، تجمدت خطوط الجبهة، واحتضنت إدلب والشمال ملايين المهجرين. وانهار الاقتصاد، ثم ضرب زلزال مدمر في شباط ألفين وثلاثة وعشرين."),
 ("الثمن", "مأساة القرن", "مئات آلاف الشهداء • أكثر من مئة ألف مختفٍ قسرياً<br>ونحو نصف الشعب السوري بين نازح ولاجئ",
  "كان الثمن باهظا. مئات آلاف الشهداء، وأكثر من مئة ألف مختف قسريا، ونحو نصف الشعب السوري بين نازح ولاجئ."),
 ("27 تشرين الثاني 2024", "معركة ردع العدوان", "فصائل المعارضة تنطلق من إدلب<br>حلب في 29 تشرين الثاني • حماة في 5 كانون الأول • حمص في 7 كانون الأول",
  "في السابع والعشرين من تشرين الثاني ألفين وأربعة وعشرين، انطلقت معركة ردع العدوان من إدلب. وخلال أيام، تحررت حلب، ثم حماة، ثم حمص، وتقدمت فصائل الجنوب نحو العاصمة."),
 ("8 كانون الأول 2024", "سقوط النظام", "دخول دمشق وهروب بشار الأسد إلى موسكو<br>نهاية 54 عاماً من حكم عائلة الأسد • فتح أبواب سجن صيدنايا",
  "في الثامن من كانون الأول ألفين وأربعة وعشرين، دخل الثوار دمشق، وهرب بشار الأسد إلى موسكو. انتهت أربعة وخمسون عاما من حكم عائلة الأسد، وفتحت أبواب سجن صيدنايا."),
 ("", "المجد للشهداء", "والحرية لسوريا",
  "المجد للشهداء. والحرية لسوريا."),
]

HTML = """<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:C;src:url(file://%(d)s/cairo400.ttf);font-weight:400}
@font-face{font-family:C;src:url(file://%(d)s/cairo900.ttf);font-weight:900}
@font-face{font-family:A;src:url(file://%(d)s/amiri.ttf)}
*{margin:0;box-sizing:border-box}html{overflow:hidden;background:#050606}
body{width:1920px;height:1080px;overflow:hidden;font-family:C;color:#f4f1ea;
 background:radial-gradient(ellipse at 70%% 30%%,#1d2a22 0%%,#0b0f0d 60%%,#050606 100%%)}
.flag{position:absolute;top:0;left:0;right:0;height:18px;display:flex;flex-direction:column}
.flag i{flex:1}.g{background:#007a3d}.w{background:#fff}.b{background:#000}
.wm{position:absolute;left:30px;bottom:120px;font:900 340px C;color:rgba(255,255,255,.04);white-space:nowrap;direction:ltr}
.wrap{position:absolute;inset:150px 170px 220px 170px;display:flex;flex-direction:column;justify-content:center}
.year{font:900 54px C;color:#3fbf6f;letter-spacing:1px}
.bar{width:140px;height:8px;background:#ce1126;margin:24px 0 30px}
h1{font:400 130px/1.25 A;margin-bottom:36px;text-shadow:0 6px 30px rgba(0,0,0,.6)}
p{font:400 46px/1.75 C;color:#d8d3c8;max-width:1500px}
.stars{position:absolute;top:70px;left:170px;display:flex;gap:26px}
.stars svg{width:46px;height:46px}
.tl{position:absolute;bottom:90px;left:170px;right:170px;height:4px;background:#2a332e}
.tl b{position:absolute;top:-9px;width:22px;height:22px;border-radius:50%%;background:#2a332e;transform:translateX(50%%)}
.tl b.on{background:#ce1126;box-shadow:0 0 0 8px rgba(206,17,38,.25)}.tl b.past{background:#3fbf6f}
.center .wrap{align-items:center;text-align:center}.center .bar{margin:24px auto 30px}.center h1{font-size:170px}
</style></head><body class="%(cls)s">
<div class="flag"><i class="g"></i><i class="w"></i><i class="b"></i></div>
<div class="stars">%(stars)s</div>
<div class="wm">%(wm)s</div>
<div class="wrap"><div class="year">%(year)s</div><div class="bar"></div><h1>%(title)s</h1><p>%(body)s</p></div>
<div class="tl">%(tl)s</div>
</body></html>"""
STAR = '<svg viewBox="0 0 24 24"><path fill="#ce1126" d="M12 1.5l3.1 6.9 7.4.7-5.6 5 1.7 7.4L12 17.6 5.4 21.5l1.7-7.4-5.6-5 7.4-.7z"/></svg>'


def sh(*a):
    subprocess.run(a, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))


os.makedirs(f"{D}/build", exist_ok=True)
B = f"{D}/build"
n = len(S)
for i, (year, title, body, _) in enumerate(S):
    center = i in (0, n - 1)
    tl = "".join(f'<b class="{"on" if j == i else "past" if j < i else ""}" style="right:{j / (n - 1) * 100:.2f}%"></b>' for j in range(n))
    open(f"{B}/s{i:02}.html", "w").write(HTML % dict(d=D, cls="center" if center else "", stars=STAR * 3,
        wm=year.split(" ")[-1] if i not in (0, n - 1) else "سوريا", year=year, title=title, body=body, tl=tl))
subprocess.run(["node", "-e", """
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(let i=0;i<%d;i++){const f=process.argv[1]+'/s'+String(i).padStart(2,'0');await p.goto('file://'+f+'.html');await p.waitForTimeout(300);await p.screenshot({path:f+'.png'});}
await b.close();})()""" % n, B], check=True)

clips = []
for i, (*_, narr) in enumerate(S):
    sh("espeak-ng", "-v", "ar", "-s", "128", "-p", "38", "-a", "160", "-w", f"{B}/n{i:02}.wav", narr)
    t = dur(f"{B}/n{i:02}.wav") + 2.0  # 1s lead-in, 1s tail
    fr = int(t * 25)
    sh("ffmpeg", "-y", "-loop", "1", "-i", f"{B}/s{i:02}.png", "-i", f"{B}/n{i:02}.wav",
       "-filter_complex",
       f"[0:v]scale=3840:-1,zoompan=z='1+0.06*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1920x1080:fps=25,"
       f"fade=in:0:15,fade=out:{fr - 15}:15,format=yuv420p[v];"
       f"[1:a]adelay=1000|1000,apad,atrim=0:{t:.3f},aformat=sample_rates=44100:channel_layouts=stereo[a]",
       "-map", "[v]", "-map", "[a]", "-t", f"{t:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
       "-c:a", "aac", "-b:a", "160k", f"{B}/c{i:02}.mp4")
    clips.append(f"{B}/c{i:02}.mp4")

with open(f"{B}/list.txt", "w") as f:
    f.writelines(f"file '{c}'\n" for c in clips)
sh("ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", f"{B}/list.txt", "-c", "copy", f"{B}/voice.mp4")
T = dur(f"{B}/voice.mp4")

# Ambient minor-key pad (A minor / F / C / G), slow tremolo, quiet under the voice.
chords = [(110, 130.81, 164.81), (87.31, 110, 130.81), (130.81, 164.81, 196), (98, 123.47, 146.83)]
expr = "+".join(
    f"if(eq(mod(floor(t/8),4),{k}),{'+'.join(f'sin(2*PI*{fq}*t)+0.3*sin(4*PI*{fq}*t)' for fq in c)},0)" for k, c in enumerate(chords))
sh("ffmpeg", "-y", "-f", "lavfi", "-i", f"aevalsrc='0.05*({expr})*(0.75+0.25*sin(2*PI*0.15*t))':s=44100:d={T:.2f}",
   "-af", f"lowpass=f=900,aecho=0.8:0.7:400|900:0.35|0.25,afade=in:0:3,afade=out:st={T - 4:.2f}:d=4", f"{B}/music.wav")
sh("ffmpeg", "-y", "-i", f"{B}/voice.mp4", "-i", f"{B}/music.wav", "-filter_complex",
   "[1:a]volume=0.6[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]",
   "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT)
assert abs(dur(OUT) - T) < 1, "final duration mismatch"
print(OUT, round(T, 1), "s")
