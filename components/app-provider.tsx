"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type Material={id:number;title:string;kind:string;direction:string;topic:string;source:string;original:string;translation?:string;aiTranslation?:string;notes?:string;pdfName?:string;pdfData?:string};
export type Session={id:number;title:string;direction:string;minutes:number;date:string;reflection?:string;goal?:string};
export type ErrorItem={id:number;type:string;source:string;mine:string;better?:string;reason?:string;status:string};
export type VocabItem={id:number;cn:string;ar:string;type:string;topic?:string;mastery:string;example?:string};
export type Task={id:number;title:string;minutes:number;done:boolean};
export type Dictation={id:number;topic:string;source:string;link:string;original:string;transcript:string;translation:string;notes?:string};
const initialMaterials:Material[]=[{id:1,title:"联合国气候变化相关讲话",kind:"新闻讲话",direction:"中译阿",topic:"环境政策",source:"示例材料",original:"",notes:""},{id:2,title:"阿拉伯世界经济发展报告",kind:"外刊文章",direction:"阿译中",topic:"经济",source:"示例材料",original:"",notes:""}];
const initialSessions:Session[]=[{id:1,title:"联合国气候变化相关讲话",direction:"中译阿",minutes:15,date:"2026-09-17",reflection:"",goal:""}];
const initialErrors:ErrorItem[]=[{id:1,type:"术语错误",source:"碳排放交易体系",mine:"نظام تجارة انبعاثات الكربون",better:"نظام تداول انبعاثات الكربون",reason:"更符合政策语境",status:"待复习"}];
const initialVocab:VocabItem[]=[{id:1,cn:"推动绿色转型",ar:"دفع عجلة التحول الأخضر",type:"固定搭配",topic:"环境政策",mastery:"不熟悉",example:"تسعى الحكومة إلى دفع عجلة التحول الأخضر."}];
const initialDictations:Dictation[]=[{id:1,topic:"新闻听抄示例",source:"示例音频",link:"",original:"",transcript:"",translation:"",notes:""}];
const initialTasks:Task[]=[{id:1,title:"完成一段新闻听抄",minutes:25,done:true},{id:2,title:"进行 15 分钟中译阿练习",minutes:15,done:false},{id:3,title:"整理 10 个阿语表达",minutes:20,done:false}];
type Ctx={materials:Material[];sessions:Session[];errors:ErrorItem[];vocab:VocabItem[];tasks:Task[];dictations:Dictation[];saveMaterial:(x:Omit<Material,"id">,id?:number)=>void;saveSession:(x:Omit<Session,"id">,id?:number)=>void;saveError:(x:Omit<ErrorItem,"id">,id?:number)=>void;saveVocab:(x:Omit<VocabItem,"id">,id?:number)=>void;saveTask:(x:Omit<Task,"id">,id?:number)=>void;saveDictation:(x:Omit<Dictation,"id">,id?:number)=>void;remove:(type:string,id:number)=>void};
const AppContext=createContext<Ctx|null>(null);
export function AppProvider({children}:{children:React.ReactNode}){const [materials,setMaterials]=useState(initialMaterials),[sessions,setSessions]=useState(initialSessions),[errors,setErrors]=useState(initialErrors),[vocab,setVocab]=useState(initialVocab),[tasks,setTasks]=useState(initialTasks),[dictations,setDictations]=useState(initialDictations);
useEffect(()=>{try{const raw=localStorage.getItem("ail-data");if(raw){const d=JSON.parse(raw);setMaterials(d.materials||initialMaterials);setSessions(d.sessions||initialSessions);setErrors(d.errors||initialErrors);setVocab(d.vocab||initialVocab);setTasks(d.tasks||initialTasks);setDictations(d.dictations||initialDictations)}}catch{}},[]);
useEffect(()=>{try{localStorage.setItem("ail-data",JSON.stringify({materials,sessions,errors,vocab,tasks,dictations}))}catch{}},[materials,sessions,errors,vocab,tasks,dictations]);
const save=(setter:any,x:any,id?:number)=>setter((old:any[])=>id?old.map(v=>v.id===id?{...x,id}:v):[{...x,id:Date.now()},...old]);
const remove=(type:string,id:number)=>({materials:setMaterials,sessions:setSessions,errors:setErrors,vocab:setVocab,tasks:setTasks,dictations:setDictations} as any)[type]((old:any[])=>old.filter(v=>v.id!==id));
return <AppContext.Provider value={{materials,sessions,errors,vocab,tasks,dictations,saveMaterial:(x,id)=>save(setMaterials,x,id),saveSession:(x,id)=>save(setSessions,x,id),saveError:(x,id)=>save(setErrors,x,id),saveVocab:(x,id)=>save(setVocab,x,id),saveTask:(x,id)=>save(setTasks,x,id),saveDictation:(x,id)=>save(setDictations,x,id),remove}}>{children}</AppContext.Provider>}
export function useApp(){const x=useContext(AppContext);if(!x)throw new Error("useApp must be inside AppProvider");return x;}
