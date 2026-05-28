import React, { useState } from 'react';

const STAGES_DEF = {
  'מלא': ['info','submit','spatial','design','permit','start'],
  'הקלות': ['info','submit','committee','design','permit','start']
};

const SL = {
  info:'מידע', submit:'הגשה', spatial:'בקרה מרחבית',
  committee:'ועדה', design:'בקרת תכן', permit:'היתר', start:'תחילת עבודות'
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
    {req:'נסח טאבו עדכני',code:'',simple:true,inv:true,s:'red',done:'',own:'יזם',irrel:false,completed:false,note:'תוקף 3 חודשים'},
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
    {req:'הצהרת עורך בקשה',code:'',simple:true,inv:false,s:'red',done:'',own:'אני',irrel:false,completed:false},
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

function dueStr(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('he-IL',{day:'numeric',month:'numeric',year:'2-digit'}); }
  catch(e) { return d; }
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

  const toggleStage = (s) => {
    setOpenStages(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  };

  const toggleReq = (key) => {
    setOpenReqs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cycleTask = (stageId, ri, ti) => {
    setReqs(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      const t = n[stageId][ri].tasks[ti];
      t.s = t.s === 'red' ? 'yellow' : t.s === 'yellow' ? 'green' : 'red';
      if (t.s === 'green') t.done = new Date().toLocaleDateString('he-IL');
      else t.done = '';
      return n;
    });
  };

  const cycleSimple = (stageId, ri) => {
    setReqs(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      const r = n[stageId][ri];
      r.s = r.s === 'red' ? 'yellow' : r.s === 'yellow' ? 'green' : 'red';
      if (r.s === 'green') r.done = new Date().toLocaleDateString('he-IL');
      else r.done = '';
      return n;
    });
  };

  const toggleIrrel = (stageId, ri) => {
    setReqs(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[stageId][ri].irrel = !n[stageId][ri].irrel;
      return n;
    });
  };

  const toggleCompleted = (stageId, ri) => {
    setReqs(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[stageId][ri].completed = !n[stageId][ri].completed;
      return n;
    });
  };

  const addTask = (stageId, ri) => {
    const name = prompt('שם המשימה החדשה:');
    if (!name) return;
    setReqs(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[stageId][ri].tasks.push({t:name,own:'אני',s:'red',due:'',done:''});
      return n;
    });
  };

  return (
    <div className="modal-overlay" onClick={e => { if(e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="modal-box">
        <div className="modal-hdr">
          <span className="modal-close" onClick={onClose}>×</span>
          <div>
            <div className="modal-title">{project.num} — {project.addr}</div>
            <div className="modal-sub">דרישות ומשימות · {SL[project.stage]}</div>
          </div>
        </div>
        <div className="modal-col-hdrs">
          <div style={{width:40,flexShrink:0,textAlign:'center'}}>מספר</div>
          <div style={{width:20,flexShrink:0}}></div>
          <div style={{flex:1}}>דרישה / משימה</div>
          <div style={{width:48,textAlign:'center',flexShrink:0}}>אחראי</div>
          <div style={{width:62,textAlign:'center',flexShrink:0}}>יעד</div>
          <div style={{width:64,textAlign:'center',flexShrink:0}}>הושלם</div>
          <div style={{width:52,flexShrink:0}}></div>
        </div>
        <div className="modal-body">
          {stages.map((s, si) => {
            const isOpen = openStages.has(s);
            const stageReqs = reqs[s] || [];
            const total = stageReqs.filter(r=>!r.irrel).reduce((a,r)=>a+(r.simple?1:(r.tasks||[]).length),0);
            const done = stageReqs.filter(r=>!r.irrel).reduce((a,r)=>{
              if(r.simple) return a+(r.s==='green'?1:0);
              return a+(r.tasks||[]).filter(t=>t.s==='green').length;
            },0);
            const isCur = s === project.stage;
            const isPast = si < ci;
            const stageCls = isPast ? 'stage-done' : isCur ? (project.atC?'stage-com':'stage-mine') : 'stage-future';

            return (
              <div key={s} className="stage-block">
                <div className={`stage-hdr ${stageCls}`} onClick={() => toggleStage(s)}>
                  <span style={{fontSize:11,color:'#999',marginLeft:6}}>{isOpen?'▴':'▾'}</span>
                  <span className={`stage-lbl-tag ${stageCls}`}>
                    {isPast?'הושלם':isCur?(project.atC?'ועדה':'נוכחי'):'עתידי'}
                  </span>
                  <div className="stage-name">{SL[s]}</div>
                  <span className="stage-prog">{done}/{total}</span>
                </div>
                {isOpen && (
                  <div>
                    {stageReqs.map((r, ri) => {
                      const key = `${s}-${ri}`;
                      const isReqOpen = openReqs[key] !== false && openReqs[key] !== undefined
                        ? openReqs[key]
                        : !(r.tasks||[]).every(t=>t.s==='green') && !r.irrel && !r.completed;

                      if (r.simple) return (
                        <div key={ri} className={`req-row-simple ${r.irrel?'irrel':''}`}>
                          <div style={{width:40,flexShrink:0,fontSize:9,color:'#999',textAlign:'center'}}>{r.code}</div>
                          <div style={{width:20,flexShrink:0,paddingTop:2}}>
                            <div className={`chk3 ${r.s}`} onClick={()=>cycleSimple(s,ri)}>
                              {r.s==='red'?'!':r.s==='yellow'?'✓':'✔'}
                            </div>
                          </div>
                          <div style={{flex:1}}>
                            <div className={`req-name ${r.irrel?'line-through':''}`}>{r.req}{r.inv&&<span className="izm-b"> יזם</span>}</div>
                            {r.note&&<div className="task-note">{r.note}</div>}
                          </div>
                          <div style={{width:48,textAlign:'center',flexShrink:0}}>
                            <span className={r.own==='אני'?'own-me':'own-inv'}>{r.own}</span>
                          </div>
                          <div style={{width:62,flexShrink:0}}></div>
                          <div style={{width:64,textAlign:'center',flexShrink:0,fontSize:10,color:'#3B6D11'}}>{r.done||'—'}</div>
                          <div style={{width:52,flexShrink:0,display:'flex',gap:3,justifyContent:'center'}}>
                            <button className={`r-btn ${r.completed?'done-a':''}`} onClick={()=>toggleCompleted(s,ri)}>✓</button>
                            <button className={`r-btn ${r.irrel?'irrel-a':''}`} onClick={()=>toggleIrrel(s,ri)}>ל.ר</button>
                          </div>
                        </div>
                      );

                      return (
                        <div key={ri}>
                          <div className={`req-row-complex ${r.irrel?'irrel':''}`} onClick={()=>toggleReq(key)}>
                            <div style={{width:40,flexShrink:0,fontSize:9,color:'#999',textAlign:'center'}}>{r.code}</div>
                            <div style={{width:20,flexShrink:0,fontSize:11,color:'#999'}}>{isReqOpen?'▾':'▸'}</div>
                            <div style={{flex:1}}>
                              <div style={{display:'flex',alignItems:'baseline',gap:5}}>
                                <span className={`req-name ${r.irrel?'line-through':''}`}>{r.req}{r.inv&&<span className="izm-b"> יזם</span>}</span>
                                <span className="req-prog-badge">{(r.tasks||[]).filter(t=>t.s==='green').length}/{(r.tasks||[]).length}</span>
                              </div>
                            </div>
                            <div style={{width:48,flexShrink:0}}></div>
                            <div style={{width:62,flexShrink:0}}></div>
                            <div style={{width:64,flexShrink:0}}></div>
                            <div style={{width:52,flexShrink:0,display:'flex',gap:3,justifyContent:'center'}} onClick={e=>e.stopPropagation()}>
                              <button className={`r-btn ${r.completed?'done-a':''}`} onClick={()=>toggleCompleted(s,ri)}>✓</button>
                              <button className={`r-btn ${r.irrel?'irrel-a':''}`} onClick={()=>toggleIrrel(s,ri)}>ל.ר</button>
                            </div>
                          </div>
                          {isReqOpen && !r.irrel && !r.completed && (
                            <div className="req-tasks">
                              {(r.tasks||[]).map((t,ti)=>(
                                <div key={ti} className="task-row-m">
                                  <div className="task-indent"></div>
                                  <div style={{width:20,flexShrink:0,paddingTop:2}}>
                                    <div className={`chk3 ${t.s}`} onClick={()=>cycleTask(s,ri,ti)}>
                                      {t.s==='red'?'!':t.s==='yellow'?'✓':'✔'}
                                    </div>
                                  </div>
                                  <div style={{flex:1}}>
                                    <div className={`task-txt ${t.s==='green'?'line-through':''}`}>{t.t}</div>
                                    {t.note&&<div className="task-note">{t.note}</div>}
                                  </div>
                                  <div style={{width:48,textAlign:'center',flexShrink:0}}>
                                    <span className={t.own==='אני'?'own-me':'own-inv'}>{t.own}</span>
                                  </div>
                                  <div style={{width:62,textAlign:'center',flexShrink:0,fontSize:10,color:'#999'}}>{dueStr(t.due)}</div>
                                  <div style={{width:64,textAlign:'center',flexShrink:0,fontSize:10,color:'#3B6D11'}}>{t.done||'—'}</div>
                                  <div style={{width:52,flexShrink:0}}></div>
                                </div>
                              ))}
                              <div style={{padding:'5px 0 3px 10px'}}>
                                <button className="btn" style={{fontSize:9}} onClick={()=>addTask(s,ri)}>+ משימה חדשה</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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