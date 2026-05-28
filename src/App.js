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
  {id:1,num:'001',addr:'ברזילי 12, ראשל"צ',auth:'ראשון לציון',track:'הקלות',stage:'start',atC:false,status:'ok',due:'2026-06-01'},
  {id:2,num:'002',addr:'חלמונית 22, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'spatial',atC:true,status:'urgent',due:'2026-05-25'},
  {id:3,num:'003',addr:'חי טייב 4, רמת גן',auth:'רמת גן',track:'מלא',stage:'spatial',atC:false,status:'urgent',due:'2026-05-18'},
  {id:4,num:'004',addr:'חב"ד 15, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'spatial',atC:true,status:'warning',due:'2026-06-10'},
  {id:5,num:'005',addr:'שד\' חן 7א, נתניה',auth:'נתניה',track:'מלא',stage:'submit',atC:false,status:'warning',due:'2026-06-15'},
  {id:6,num:'006',addr:'גולדה מאיר 4, נתניה',auth:'נתניה',track:'מלא',stage:'submit',atC:false,status:'ok',due:'2026-07-01'},
  {id:7,num:'007',addr:'קאפח 9-13, ראשל"צ',auth:'ראשון לציון',track:'הקלות',stage:'submit',atC:false,status:'ok',due:'2026-06-20'},
  {id:8,num:'008',addr:'הרותם 1-3, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'submit',atC:false,status:'urgent',due:'2026-05-25'},
  {id:9,num:'009',addr:'אוסקר שינדלר 18, בת ים',auth:'בת ים',track:'מלא',stage:'design',atC:true,status:'ok',due:'2026-07-15'},
  {id:10,num:'010',addr:'חיל חימוש 7, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'start',atC:false,status:'ok',due:'2026-11-19'},
  {id:11,num:'011',addr:'בן אליעזר 30, ראשל"צ',auth:'ראשון לציון',track:'מלא',stage:'submit',atC:false,status:'ok',due:'2026-06-01'},
  {id:12,num:'012',addr:'תל חי 31, אשדוד',auth:'אשדוד',track:'מלא',stage:'info',atC:false,status:'ok',due:'2026-07-01'},
];

function dueStr(d) {
  return new Date(d).toLocaleDateString('he-IL', {day:'numeric',month:'numeric',year:'2-digit'});
}

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const stages = TRK[p.track] || TRK['מלא'];
  const ci = stages.indexOf(p.stage);
 

  return (
    <div className={`pcard ${p.atC ? 'committee' : 'mine'}`}>
      <div className="card-l1" onClick={() => setOpen(!open)}>
        <div className="card-top">
          <div>
            <div className="card-title">{p.num} — {p.addr}</div>
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
          <div className="l2-placeholder">תעודת זהות — בקרוב</div>
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
            <div className="sec-title">דורש טיפול</div>
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