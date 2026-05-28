import React, { useState } from 'react';

const STAGES_DEF = {
  'מלא': ['info','submit','spatial','design','permit','start'],
  'הקלות': ['info','submit','committee','design','permit','start']
};

const SL = {
  info:'מידע', submit:'הגשה', spatial:'בקרה מרחבית',
  committee:'ועדה', design:'בקרת תכן', permit:'היתר', start:'תחילת עבודות'
};

const LIBRARY = {
  'פטור ממיגון פקע"ר': [
    {t:'תכנית בקשה חתומה',own:'אני'},
    {t:'טופס בקשה לפטור',own:'אני'},
    {t:'צילומי מרחב מוגן + PDF',own:'יזם'},
    {t:'קבלת אישור/פטור פקע"ר',own:'אני'},
  ],
  'נסח טאבו עדכני': [
    {t:'בדיקת תוקף — 3 חודשים',own:'אני'},
    {t:'העלאה למערכת',own:'יזם'},
  ],
  'הסכמת בעלי זכויות (75%)': [
    {t:'הפצת טבלת הסכמות לדיירים',own:'יזם'},
    {t:'איסוף חתימות מינ\' 75%',own:'יזם'},
  ],
  'חישובים סטטיים והצהרת מהנדס': [
    {t:'העברת תכניות למהנדס שלד',own:'יזם'},
    {t:'קבלת חישובים + הצהרת מהנדס',own:'יזם'},
  ],
  'אישור תחילת עבודות': [
    {t:'הגשת בקשה ברישוי זמין',own:'אני'},
    {t:'מינוי קבלן רשום + תשלום אגרה',own:'יזם'},
    {t:'חתימת מהנדס ביקורת',own:'יזם'},
  ],
};

const DEFAULT_REQS = {
  info: [
    {req:'הגשת בקשת מידע',code:'',simple:false,inv:false,irrel:false,completed:false,tasks:[
      {t:'הגשה במערכת רישוי זמין',own:'אני',s:'red',due:'',done:''},
      {t:'תשלום אגרת מידע + תצהיר',own:'יזם',s:'red',due:'',done:''},
    ]},
    {req:'מפת מדידה בתוקף',code:'',simple:true,inv:true,s:'red',done:'',own:'יזם',irrel:false,completed:false},
    {req:'צילומי חזיתות',code:'',simple:true,inv:true,s:'red',done:'',own:'יזם',irrel:false,completed:false},
  ],
  submit: [
    {req:'נסח טאבו עדכני',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'בדיקת תוקף — 3 חודשים',own:'אני',s:'red',due:'',done:''},
      {t:'העלאה למערכת',own:'יזם',s:'red',due:'',done:''},
    ]},
    {req:'הסכמת בעלי זכויות (75%)',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'הפצת טבלת הסכמות לדיירים',own:'יזם',s:'red',due:'',done:''},
      {t:'איסוף חתימות מינ\' 75%',own:'יזם',s:'red',due:'',done:''},
    ]},
    {req:'פטור ממיגון פקע"ר',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'תכנית בקשה חתומה',own:'אני',s:'red',due:'',done:''},
      {t:'טופס בקשה לפטור',own:'אני',s:'red',due:'',done:''},
      {t:'צילומי מרחב מוגן + PDF',own:'יזם',s:'red',due:'',done:''},
      {t:'קבלת אישור/פטור פקע"ר',own:'אני',s:'red',due:'',done:''},
    ]},
    {req:'תשלום פיקדון',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'ביצוע תשלום + אסמכתה',own:'יזם',s:'red',due:'',done:''},
    ]},
  ],
  spatial: [
    {req:'מעקב הערות ועדה',code:'',simple:false,inv:false,irrel:false,completed:false,tasks:[
      {t:'בדיקה שוטפת ברישוי זמין',own:'אני',s:'red',due:'',done:''},
      {t:'עדכון תכניות לפי הערות',own:'אני',s:'red',due:'',done:''},
      {t:'הגשת תגובה מסודרת',own:'אני',s:'red',due:'',done:''},
    ]},
    {req:'חישובים סטטיים והצהרת מהנדס',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'העברת תכניות למהנדס שלד',own:'יזם',s:'red',due:'',done:''},
      {t:'קבלת חישובים + הצהרת מהנדס',own:'יזם',s:'red',due:'',done:''},
    ]},
  ],
  committee: [
    {req:'פרסום לפי סעיף 149א',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'הכנת מודעה + הפצה',own:'אני',s:'red',due:'',done:''},
      {t:'תיק פרסום מלא',own:'אני',s:'red',due:'',done:''},
    ]},
  ],
  design: [
    {req:'הצהרת עורך בקשה',code:'',simple:false,inv:false,irrel:false,completed:false,tasks:[
      {t:'עריכת הצהרת עורך + חתימה',own:'אני',s:'red',due:'',done:''},
    ]},
    {req:'חישובים סטטיים (בקרת תכן)',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'קבלת נספח יציבות',own:'יזם',s:'red',due:'',done:''},
    ]},
  ],
  permit: [
    {req:'תשלום אגרות והיטלים',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'קבלת דרישת תשלום',own:'אני',s:'red',due:'',done:''},
      {t:'ביצוע תשלום מלא',own:'יזם',s:'red',due:'',done:''},
    ]},
    {req:'קבלת היתר',code:'',simple:false,inv:false,irrel:false,completed:false,tasks:[
      {t:'הורדת היתר ממערכת רישוי זמין',own:'אני',s:'red',due:'',done:''},
      {t:'בדיקת תוכן ההיתר',own:'אני',s:'red',due:'',done:''},
    ]},
  ],
  start: [
    {req:'אישור תחילת עבודות',code:'',simple:false,inv:true,irrel:false,completed:false,tasks:[
      {t:'הגשת בקשה ברישוי זמין',own:'אני',s:'red',due:'',done:''},
      {t:'מינוי קבלן רשום + תשלום אגרה',own:'יזם',s:'red',due:'',done:''},
      {t:'חתימת מהנדס ביקורת',own:'יזם',s:'red',due:'',done:''},
    ]},
  ],
};

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  } catch(e) { return iso; }
}

function isoFrom(d) {
  if (!d) return '';
  try {
    const pts = d.split('/');
    if (pts.length===3) return `${pts[2]}-${pts[1].padStart(2,'0')}-${pts[0].padStart(2,'0')}`;
  } catch(e) {}
  return '';
}

function dueCls(iso) {
  if (!iso) return 'due-none';
  const diff = (new Date(iso) - new Date()) / 86400000;
  return diff < 0 ? 'due-late' : diff < 7 ? 'due-soon' : 'due-ok';
}

export default function RequirementsModal({ project, onClose }) {
  const stages = STAGES_DEF[project.track] || STAGES_DEF['מלא'];
  const ci = stages.indexOf(project.stage);

  const initReqs = () => {
    const r = {};
    stages.forEach(s => { r[s] = JSON.parse(JSON.stringify(DEFAULT_REQS[s] || [])); });
    return r;
  };

  const [reqs, setReqs] = useState(initReqs);
  const [openStages, setOpenStages] = useState(new Set([project.stage]));
  const [openReqs, setOpenReqs] = useState({});
  const [stageDues, setStageDues] = useState({});
  const [library, setLibrary] = useState(() => JSON.parse(JSON.stringify(LIBRARY)));
  const today = new Date().toISOString().split('T')[0];

  const toggleStage = (s) => {
    setOpenStages(prev => { const n=new Set(prev); n.has(s)?n.delete(s):n.add(s); return n; });
  };
  const toggleReq = (key) => {
    setOpenReqs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const upd = (fn) => setReqs(prev => { const n=JSON.parse(JSON.stringify(prev)); fn(n); return n; });

  const cycleTask = (s,ri,ti) => upd(n => {
    const t=n[s][ri].tasks[ti];
    t.s=t.s==='red'?'yellow':t.s==='yellow'?'green':'red';
    if(t.s==='green') t.done=formatDate(today);
    if(t.s==='red') t.done='';
  });

  const toggleOwn = (s,ri,ti) => upd(n => {
    n[s][ri].tasks[ti].own=n[s][ri].tasks[ti].own==='אני'?'יזם':'אני';
  });

  const setTaskDue = (s,ri,ti,val) => upd(n => { n[s][ri].tasks[ti].due=val; });
  const setTaskDone = (s,ri,ti,val) => upd(n => {
    const t=n[s][ri].tasks[ti];
    t.done=val?formatDate(val):'';
    if(val&&t.s!=='green') t.s='green';
  });

  const toggleIrrelTask = (s,ri,ti) => upd(n => {
    const t=n[s][ri].tasks[ti];
    t.irrel=!t.irrel;
  });
  const markDoneTask = (s,ri,ti) => upd(n => {
    const t=n[s][ri].tasks[ti];
    t.s='green';
    if(!t.done) t.done=formatDate(today);
  });

  const toggleIrrel = (s,ri) => upd(n => { n[s][ri].irrel=!n[s][ri].irrel; });
  const toggleCompleted = (s,ri) => upd(n => { n[s][ri].completed=!n[s][ri].completed; });

  const saveToLibrary = (s,ri,ti) => {
    const t = reqs[s][ri].tasks[ti];
    setLibrary(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      const key = reqs[s][ri].req;
      if (!n[key]) n[key] = [];
      if (!n[key].find(x=>x.t===t.t)) n[key].push({t:t.t,own:t.own});
      return n;
    });
    alert(`"${t.t}" נשמר לספרייה`);
  };

  const addTask = (s,ri) => {
    const name = prompt('שם המשימה החדשה:');
    if (!name) return;
    upd(n => { n[s][ri].tasks.push({t:name,own:'אני',s:'red',due:'',done:'',irrel:false}); });
  };

  const addReq = (s) => {
    const name = prompt('שם הדרישה החדשה:');
    if (!name) return;
    const libTasks = library[name] || [];
    upd(n => {
      n[s].push({
        req:name,code:'',simple:false,inv:false,irrel:false,completed:false,
        tasks: libTasks.length > 0
          ? libTasks.map(lt=>({t:lt.t,own:lt.own,s:'red',due:'',done:'',irrel:false}))
          : [{t:'משימה ראשונה',own:'אני',s:'red',due:'',done:'',irrel:false}]
      });
    });
    setOpenStages(prev => { const n=new Set(prev); n.add(s); return n; });
  };

  return (
    <div className="modal-overlay" onClick={e=>{if(e.target.classList.contains('modal-overlay'))onClose();}}>
      <div className="modal-box">
        <div className="modal-hdr">
          <span className="modal-close" onClick={onClose}>×</span>
          <div>
            <div className="modal-title">{project.num} — {project.addr}</div>
            <div className="modal-sub">דרישות ומשימות · {SL[project.stage]}</div>
          </div>
        </div>
        <div className="modal-col-hdrs">
          <div style={{width:20,flexShrink:0}}></div>
          <div style={{flex:1}}>דרישה / משימה</div>
          <div style={{width:48,textAlign:'center',flexShrink:0}}>אחראי</div>
          <div style={{width:100,textAlign:'center',flexShrink:0}}>יעד</div>
          <div style={{width:90,textAlign:'center',flexShrink:0}}>הושלם</div>
          <div style={{width:70,flexShrink:0}}></div>
        </div>
        <div className="modal-body">
          {stages.map((s,si)=>{
            const isOpen=openStages.has(s);
            const stageReqs=reqs[s]||[];
            const total=stageReqs.filter(r=>!r.irrel).reduce((a,r)=>a+(r.tasks||[]).filter(t=>!t.irrel).length,0);
            const done=stageReqs.filter(r=>!r.irrel).reduce((a,r)=>a+(r.tasks||[]).filter(t=>!t.irrel&&t.s==='green').length,0);
            const isCur=s===project.stage;
            const isPast=si<ci;
            const stageCls=isPast?'stage-done':isCur?(project.atC?'stage-com':'stage-mine'):'stage-future';
            const sd=stageDues[s];

            return (
              <div key={s} className="stage-block">
                <div className={`stage-hdr ${stageCls}`} onClick={()=>toggleStage(s)}>
                  <span style={{fontSize:11,color:'#999',marginLeft:4}}>{isOpen?'▴':'▾'}</span>
                  <span className={`stage-lbl-tag ${stageCls}`}>{isPast?'הושלם':isCur?(project.atC?'ועדה':'נוכחי'):'עתידי'}</span>
                  <div className="stage-name">{SL[s]}</div>
                  <input
                    type="date"
                    value={sd||''}
                    onClick={e=>e.stopPropagation()}
                    onChange={e=>{e.stopPropagation();setStageDues(prev=>({...prev,[s]:e.target.value}));}}
                    style={{fontSize:10,border:'1px solid #ddd',borderRadius:4,padding:'1px 4px',marginLeft:6,color:sd?({due_late:'#A32D2D',due_soon:'#854F0B',due_ok:'#3B6D11'}[dueCls(sd)]||'#333'):'#ccc'}}
                  />
                  {sd&&<span className={`stage-due-badge ${dueCls(sd)}`}>{formatDate(sd)}</span>}
                  <span className="stage-prog">{done}/{total}</span>
                </div>
                {isOpen&&(
                  <div>
                    {stageReqs.map((r,ri)=>{
                      const key=`${s}-${ri}`;
                      const isReqOpen=openReqs[key]!==undefined?openReqs[key]:!(r.tasks||[]).every(t=>t.s==='green')&&!r.irrel&&!r.completed;
                      return (
                        <div key={ri}>
                          <div className={`req-row-complex ${r.irrel?'irrel':''}`} onClick={()=>toggleReq(key)}>
                            <div style={{width:20,flexShrink:0,fontSize:11,color:'#999'}}>{isReqOpen?'▾':'▸'}</div>
                            <div style={{flex:1}}>
                              <div style={{display:'flex',alignItems:'baseline',gap:5}}>
                                <span className={`req-name ${r.irrel?'line-through':''}`}>{r.req}{r.inv&&<span className="izm-b"> יזם</span>}</span>
                                <span className="req-prog-badge">{(r.tasks||[]).filter(t=>!t.irrel&&t.s==='green').length}/{(r.tasks||[]).filter(t=>!t.irrel).length}</span>
                              </div>
                            </div>
                            <div style={{width:48,flexShrink:0}}></div>
                            <div style={{width:100,flexShrink:0}}></div>
                            <div style={{width:90,flexShrink:0}}></div>
                            <div style={{width:70,flexShrink:0,display:'flex',gap:2,justifyContent:'center'}} onClick={e=>e.stopPropagation()}>
                              <button className={`r-btn ${r.completed?'done-a':''}`} onClick={()=>toggleCompleted(s,ri)}>✓</button>
                              <button className={`r-btn ${r.irrel?'irrel-a':''}`} onClick={()=>toggleIrrel(s,ri)}>ל.ר</button>
                            </div>
                          </div>
                          {isReqOpen&&!r.irrel&&!r.completed&&(
                            <div className="req-tasks">
                              {(r.tasks||[]).map((t,ti)=>(
                                <div key={ti} className={`task-row-m ${t.irrel?'irrel':''}`}>
                                  <div className="task-indent"></div>
                                  <div style={{width:20,flexShrink:0,paddingTop:2}}>
                                    <div className={`chk3 ${t.s}`} onClick={()=>cycleTask(s,ri,ti)}>
                                      {t.s==='red'?'!':t.s==='yellow'?'✓':'✔'}
                                    </div>
                                  </div>
                                  <div style={{flex:1}}>
                                    <div className={`task-txt ${t.s!=='red'||t.irrel?'line-through':''}`}
                                      style={{color:t.s==='green'?'#aaa':t.s==='yellow'?'#854F0B':t.irrel?'#ccc':undefined}}>
                                      {t.t}
                                    </div>
                                    {t.note&&<div className="task-note">{t.note}</div>}
                                  </div>
                                  <div style={{width:48,textAlign:'center',flexShrink:0}}>
                                    <span className={t.own==='אני'?'own-me':'own-inv'} style={{cursor:'pointer'}} onClick={()=>toggleOwn(s,ri,ti)}>{t.own}</span>
                                  </div>
                                  <div style={{width:100,textAlign:'center',flexShrink:0}}>
                                    <input type="date" value={t.due||''} onClick={e=>e.stopPropagation()}
                                      onChange={e=>setTaskDue(s,ri,ti,e.target.value)}
                                      style={{fontSize:9,border:'1px solid #eee',borderRadius:3,padding:'1px 2px',width:95,color:t.due?({due_late:'#A32D2D',due_soon:'#854F0B',due_ok:'#3B6D11'}[dueCls(t.due)]||'#333'):'#ccc'}}/>
                                  </div>
                                  <div style={{width:90,textAlign:'center',flexShrink:0}}>
                                    <input type="date" value={t.done?isoFrom(t.done):''} onClick={e=>e.stopPropagation()}
                                      onChange={e=>setTaskDone(s,ri,ti,e.target.value)}
                                      style={{fontSize:9,border:'1px solid #eee',borderRadius:3,padding:'1px 2px',width:85,color:t.done?'#3B6D11':'#ccc'}}/>
                                  </div>
                                  <div style={{width:70,flexShrink:0,display:'flex',gap:2,justifyContent:'center'}} onClick={e=>e.stopPropagation()}>
                                    <button className={`r-btn ${t.s==='green'?'done-a':''}`} onClick={()=>markDoneTask(s,ri,ti)} title="סמן הושלם">✓</button>
                                    <button className={`r-btn ${t.irrel?'irrel-a':''}`} onClick={()=>toggleIrrelTask(s,ri,ti)} title="לא רלוונטי">ל.ר</button>
                                    <button className="r-btn" onClick={()=>saveToLibrary(s,ri,ti)} title="שמור לספרייה">📚</button>
                                  </div>
                                </div>
                              ))}
                              <div style={{padding:'5px 0 3px 10px',display:'flex',gap:5}}>
                                <button className="btn" style={{fontSize:9}} onClick={()=>addTask(s,ri)}>+ משימה</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div style={{padding:'6px 13px'}}>
                      <button className="btn" style={{fontSize:9}} onClick={()=>addReq(s)}>+ דרישה חדשה</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}