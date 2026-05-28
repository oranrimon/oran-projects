import React, { useState } from 'react';
import './App.css';

const SL = {
  info: 'מידע', submit: 'הגשה', spatial: 'בקרה מרחבית',
  committee: 'ועדה', design: 'בקרת תכן', permit: 'היתר', start: 'תחילת עבודות'
};

const TRK = {
  'מלא': ['info','submit','spatial','design','permit','start'],
  'הקלות': ['info','submit','committee','design','permit','start']
};

const PROJECTS = [
  {id:1,num:'001',addr:'ברזילי 12, ראשל"צ',auth:'ראשון לציון',track:'הקלות',stage:'start',atC:false,status:'ok',due:'2026-06-01',
   ic:{req:'10000361355',int:'3945061000',gush:'6746',helka:'320',magram:'',checker:'דור עוקשי',chPhone:'03-9547275',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'1389',mWork:'3945061000',mDate:'15/01/25',plot:'820',balconyArea:'42',infoExp:'01/03/27',infoNum:'2024-001-RS',pikadu:true,pikaduNum:'PKD-2024-1234',floorsUp:6,floorsDown:1,units:24,balconies:8}},
  {id:2,num:'002',addr:'חלמונית 22, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'spatial',atC:true,status:'urgent',due:'2026-05-25',
   ic:{req:'10000409453',int:'15700200',gush:'5036',helka:'65',magram:'',checker:'',chPhone:'',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'767',mWork:'15700200',mDate:'10/03/25',plot:'1240',balconyArea:'56',infoExp:'20/11/26',infoNum:'2024-002-RS',pikadu:false,pikaduNum:'',floorsUp:8,floorsDown:2,units:32,balconies:12}},
  {id:3,num:'003',addr:'חי טייב 4, רמת גן',auth:'רמת גן',track:'מלא',stage:'spatial',atC:false,status:'urgent',due:'2026-05-18',
   ic:{req:'10000423415',int:'15661001',gush:'6181',helka:'456',magram:'',checker:'שיטה קשקש',chPhone:'03-6789001',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'1306',mWork:'15661001',mDate:'20/02/25',plot:'980',balconyArea:'38',infoExp:'10/01/27',infoNum:'2024-003-RG',pikadu:true,pikaduNum:'PKD-2024-1456',floorsUp:7,floorsDown:1,units:28,balconies:10}},
  {id:4,num:'004',addr:'חב"ד 15, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'spatial',atC:true,status:'warning',due:'2026-06-10',
   ic:{req:'10000474712',int:'35200560',gush:'3929',helka:'820',magram:'3',checker:'דור עוקשי',chPhone:'03-9547275',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'1306',mWork:'35200560',mDate:'15/01/25',plot:'650',balconyArea:'44',infoExp:'01/09/26',infoNum:'2024-004-RS',pikadu:true,pikaduNum:'PKD-2024-1789',floorsUp:5,floorsDown:1,units:20,balconies:8}},
  {id:5,num:'005',addr:'שד\' חן 7א, נתניה',auth:'נתניה',track:'מלא',stage:'submit',atC:false,status:'warning',due:'2026-06-15',
   ic:{req:'10000475461',int:'6225',gush:'8262',helka:'78',magram:'',checker:'אריאלה רוזה תמם',chPhone:'',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'05/12/26',infoNum:'2024-005-NT',pikadu:false,pikaduNum:'',floorsUp:6,floorsDown:1,units:24,balconies:8}},
  {id:6,num:'006',addr:'גולדה מאיר 4, נתניה',auth:'נתניה',track:'מלא',stage:'submit',atC:false,status:'ok',due:'2026-07-01',
   ic:{req:'10000445683',int:'6049',gush:'7928',helka:'15',magram:'',checker:'רלי שאתי',chPhone:'',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'20/02/27',infoNum:'2024-006-NT',pikadu:false,pikaduNum:'',floorsUp:7,floorsDown:1,units:28,balconies:10}},
  {id:7,num:'007',addr:'קאפח 9-13, ראשל"צ',auth:'ראשון לציון',track:'הקלות',stage:'submit',atC:false,status:'ok',due:'2026-06-20',
   ic:{req:'',int:'',gush:'5114',helka:'35',magram:'',checker:'דור עוקשי',chPhone:'03-9547275',eng:'שמואל פנט',engLic:'5678/44',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'01/04/27',infoNum:'2024-007-RS',pikadu:false,pikaduNum:'',floorsUp:5,floorsDown:1,units:20,balconies:6}},
  {id:8,num:'008',addr:'הרותם 1-3, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'submit',atC:false,status:'urgent',due:'2026-05-25',
   ic:{req:'',int:'17400010',gush:'5036',helka:'32',magram:'',checker:'סטפני יחזקאל',chPhone:'09-9682394',eng:'שמואל פנט',engLic:'5678/44',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'15/10/26',infoNum:'2024-008-RS',pikadu:false,pikaduNum:'',floorsUp:6,floorsDown:1,units:24,balconies:8}},
  {id:9,num:'009',addr:'אוסקר שינדלר 18, בת ים',auth:'בת ים',track:'מלא',stage:'design',atC:true,status:'ok',due:'2026-07-15',
   ic:{req:'10000445343',int:'',gush:'7146',helka:'278',magram:'',checker:'גלי',chPhone:'03-5556099',eng:'שמואל פנט',engLic:'5678/44',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'30/08/26',infoNum:'2024-009-BY',pikadu:true,pikaduNum:'PKD-2109',floorsUp:8,floorsDown:2,units:32,balconies:10}},
  {id:10,num:'010',addr:'חיל חימוש 7, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'start',atC:false,status:'ok',due:'2026-11-19',
   ic:{req:'10000229530',int:'90600240',gush:'2717',helka:'4',magram:'',checker:'דור עוקשי',chPhone:'03-9547275',eng:'שמואל פנט',engLic:'5678/44',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'01/06/27',infoNum:'2023-010-RS',pikadu:true,pikaduNum:'PKD-0999',floorsUp:5,floorsDown:1,units:20,balconies:6}},
  {id:11,num:'011',addr:'בן אליעזר 30, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'submit',atC:false,status:'ok',due:'2026-06-01',
   ic:{req:'10000462892',int:'41500300',gush:'3926',helka:'1045',magram:'',checker:'',chPhone:'',eng:'מופדי נעאמנה',engLic:'1234/55',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'01/11/26',infoNum:'2024-011-RS',pikadu:false,pikaduNum:'',floorsUp:6,floorsDown:1,units:24,balconies:8}},
  {id:12,num:'012',addr:'תל חי 31, אשדוד',auth:'אשדוד',track:'מלא',stage:'info',atC:false,status:'ok',due:'2026-07-01',
   ic:{req:'10000554043',int:'6199',gush:'2649',helka:'2',magram:'',checker:'',chPhone:'',eng:'',engLic:'',mNum:'',mWork:'',mDate:'',plot:'',balconyArea:'',infoExp:'01/05/27',infoNum:'2024-012-AS',pikadu:false,pikaduNum:'',floorsUp:5,floorsDown:1,units:20,balconies:6}},
];

function dueStr(d) {
  return new Date(d).toLocaleDateString('he-IL', {day:'numeric',month:'numeric',year:'2-digit'});
}

function IDCard({ ic }) {
  const infoSoon = ic.infoExp && (() => {
    const pts = ic.infoExp.split('/');
    return (new Date(+('20'+pts[2]), pts[1]-1, pts[0]) - new Date()) < 90*86400000;
  })();
  return (
    <div className="l2-grid">
      <div className="l2-sec">זיהוי</div>
      <div className="l2-row full"><div className="l2-lbl">מספר בקשה / פנימי</div><div className="l2-val">{ic.req||'—'} / {ic.int||'—'}</div></div>
      <div className="l2-sec">בודקת</div>
      <div className="l2-row"><div className="l2-lbl">שם</div><div className="l2-val">{ic.checker||'לא הוגדר'}</div></div>
      <div className="l2-row"><div className="l2-lbl">טלפון</div><div className="l2-val">{ic.chPhone||'—'}</div></div>
      <div className="l2-sec">מהנדס שלד</div>
      <div className="l2-row"><div className="l2-lbl">שם</div><div className="l2-val">{ic.eng||'—'}</div></div>
      <div className="l2-row"><div className="l2-lbl">רישיון</div><div className="l2-val">{ic.engLic||'—'}</div></div>
      <div className="l2-sec">מדידה</div>
      <div className="l2-row"><div className="l2-lbl">מודד / מדידה</div><div className="l2-val">{ic.mNum||'—'} / {ic.mWork||'—'}</div></div>
      <div className="l2-row"><div className="l2-lbl">תאריך מדידה</div><div className="l2-val">{ic.mDate||'—'}</div></div>
      <div className="l2-sec">שטחים ובניין</div>
      <div className="l2-row"><div className="l2-lbl">מגרש / מרפסות (מ"ר)</div><div className="l2-val">{ic.plot||'—'} / {ic.balconyArea||'—'}</div></div>
      <div className="l2-row"><div className="l2-lbl">קומות מעל / מתחת</div><div className="l2-val">{ic.floorsUp||'—'} / {ic.floorsDown||'—'}</div></div>
      <div className="l2-row"><div className="l2-lbl">יחידות / מרפסות</div><div className="l2-val">{ic.units||'—'} / {ic.balconies||'—'}</div></div>
      <div className="l2-sec">תיק מידע</div>
      <div className="l2-row"><div className="l2-lbl">מספר תיק</div><div className="l2-val">{ic.infoNum||'—'}</div></div>
      <div className="l2-row"><div className="l2-lbl">תוקף</div><div className={`l2-val ${infoSoon?'warn':'ok'}`}>{ic.infoExp||'—'}{infoSoon?' ⚠️':''}</div></div>
      <div className="l2-sec">פיקוד העורף</div>
      <div className="l2-row"><div className="l2-lbl">אישור</div><div className={`l2-val ${ic.pikadu?'ok':'warn'}`}>{ic.pikadu?'✓ יש':'✗ אין'}</div></div>
      <div className="l2-row"><div className="l2-lbl">מספר תיק פקע"ר</div><div className="l2-val">{ic.pikaduNum||'—'}</div></div>
    </div>
  );
}

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const stages = TRK[p.track] || TRK['מלא'];
  const ci = stages.indexOf(p.stage);
  const ic = p.ic;
  const gushStr = ic.gush ? `גוש ${ic.gush} חלקה ${ic.helka}${ic.magram?' מגרש '+ic.magram:''}` : '';

  return (
    <div className={`pcard ${p.atC ? 'committee' : 'mine'}`}>
      <div className="card-l1" onClick={() => setOpen(!open)}>
        <div className="card-top">
          <div>
            <div className="card-title">{p.num} — {p.addr} {gushStr && <span className="card-gush">· {gushStr}</span>}</div>
            <div className="card-sub">{p.auth} · {p.track}</div>
          </div>
          <div className="card-right">
            <span className={`side-tag ${p.atC ? 'com' : 'mine-tag'}`}>
              {p.atC ? 'בצד הוועדה' : 'בצד שלי'}
            </span>
          </div>
        </div>
        <div className="timeline">
          {stages.map((s, i) => {
            const cls = i < ci ? 'done' : s === p.stage ? (p.atC ? 'ccom' : 'cmine') : 'locked';
            const isCur = s === p.stage;
            return (
              <div key={s} className={`ts ${cls}`}>
                <div className="ts-due-lbl">{isCur ? 'תאריך יעד' : '\u00a0'}</div>
                <div className={`ts-due ${isCur ? 'cur' : ''}`}>{isCur ? dueStr(p.due) : '\u00a0'}</div>
                <div className="ts-dot">{cls === 'done' ? '✓' : cls === 'cmine' ? '✏' : cls === 'ccom' ? '⏳' : '·'}</div>
                <div className="ts-label">{SL[s]}</div>
              </div>
            );
          })}
        </div>
        <div className="card-btns" onClick={e => e.stopPropagation()}>
          <button className="btn btn-p">דרישות ומשימות</button>
          <button className="btn">קבצים</button>
          <button className="btn">תשלומים</button>
          <button className="btn">Dropbox</button>
        </div>
      </div>
      {open && (
        <div className="card-l2">
          <IDCard ic={ic} />
          <div className="card-btns" style={{marginTop:'10px',paddingTop:'10px',borderTop:'1px solid #eee'}}>
            <button className="btn btn-p">דרישות ומשימות</button>
            <button className="btn">קבצים</button>
            <button className="btn">תשלומים</button>
            <button className="btn">Dropbox</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState('all');
  const today = new Date().toLocaleDateString('he-IL', {weekday:'long',day:'numeric',month:'long'});

  const filtered = PROJECTS.filter(p => {
    if (filter === 'mine') return !p.atC;
    if (filter === 'committee') return p.atC;
    return true;
  });

  const urgent = filtered.filter(p => p.status !== 'ok');
  const ok = filtered.filter(p => p.status === 'ok');

  return (
    <div className="app" dir="rtl">
      <div className="topbar">
        <div className="topbar-right">
          <div className="topbar-title">אורן רימון | ניהול פרויקטים</div>
          <div className="topbar-date">{today}</div>
        </div>
        <div className="topbar-left">
          <button className="btn btn-p">+ פרויקט</button>
        </div>
      </div>

      <div className="main">
        <div className="filter-bar">
          {['all','mine','committee'].map(f => (
            <button
              key={f}
              className={`fbtn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'הכל' : f === 'mine' ? 'בצד שלי' : 'ועדה'}
            </button>
          ))}
        </div>

        {urgent.length > 0 && (
          <>
            {urgent.map(p => <ProjectCard key={p.id} p={p} />)}
          </>
        )}

        <div className="sec-title">בתהליך</div>
        {ok.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

export default App;