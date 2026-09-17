 "use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ErrorItem = { id:number; type:string; source:string; mine:string; better:string; reason:string; status:string; };
export type VocabItem = { id:number; cn:string; ar:string; type:string; topic:string; mastery:string; example:string; };
export type Task = { id:number; title:string; minutes:number; done:boolean; };

const initialErrors:ErrorItem[]=[
 {id:1,type:"术语错误",source:"碳排放交易体系",mine:"نظام تجارة انبعاثات الكربون",better:"نظام تداول انبعاثات الكربون",reason:"“تداول”更符合政策和专业语境。",status:"待复习"},
 {id:2,type:"漏译",source:"推动绿色转型",mine:"دفع التحول الأخضر",better:"دفع عجلة التحول الأخضر",reason:"漏掉了“推动”的力度表达。",status:"已掌握"},
 {id:3,type:"数字错误",source:"增长率达到 6.5%",mine:"بلغت نسبة النمو 5.6٪",better:"بلغ معدل النمو 6.5٪",reason:"听辨数字时注意重复确认。",status:"待复习"}
];
const initialVocab:VocabItem[]=[
 {id:1,cn:"推动绿色转型",ar:"دفع عجلة التحول الأخضر",type:"固定搭配",topic:"环境政策",mastery:"不熟悉",example:"تسعى الحكومة إلى دفع عجلة التحول الأخضر."},
 {id:2,cn:"加强国际合作",ar:"تعزيز التعاون الدولي",type:"新闻表达",topic:"国际关系",mastery:"熟悉",example:"ندعو إلى تعزيز التعاون الدولي."},
 {id:3,cn:"应对气候变化",ar:"التصدي لتغير المناخ",type:"专业术语",topic:"环境政策",mastery:"复习中",example:"يتطلب التصدي لتغير المناخ جهوداً مشتركة."}
];
const initialTasks:Task[]=[{id:1,title:"完成一段新闻听抄",minutes:25,done:true},{id:2,title:"进行 15 分钟中译阿练习",minutes:15,done:true},{id:3,title:"整理 10 个阿语表达",minutes:20,done:false},{id:4,title:"复习 5 条错误记录",minutes:15,done:false}];

type Ctx={errors:ErrorItem[];vocab:VocabItem[];tasks:Task[];addError:(x:Omit<ErrorItem,"id">)=>void;addVocab:(x:Omit<VocabItem,"id">)=>void;toggleTask:(id:number)=>void;};
const AppContext=createContext<Ctx|null>(null);
export function AppProvider({children}:{children:React.ReactNode}){
 const [errors,setErrors]=useState<ErrorItem[]>(initialErrors),[vocab,setVocab]=useState<VocabItem[]>(initialVocab),[tasks,setTasks]=useState<Task[]>(initialTasks);
 useEffect(()=>{try{const x=localStorage.getItem("ail-data");if(x){const d=JSON.parse(x);setErrors(d.errors||initialErrors);setVocab(d.vocab||initialVocab);setTasks(d.tasks||initialTasks)}}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("ail-data",JSON.stringify({errors,vocab,tasks}))}catch{}},[errors,vocab,tasks]);
 const addError=(x:Omit<ErrorItem,"id">)=>setErrors(v=>[{...x,id:Date.now()},...v]);
 const addVocab=(x:Omit<VocabItem,"id">)=>setVocab(v=>[{...x,id:Date.now()},...v]);
 const toggleTask=(id:number)=>setTasks(v=>v.map(t=>t.id===id?{...t,done:!t.done}:t));
 return <AppContext.Provider value={{errors,vocab,tasks,addError,addVocab,toggleTask}}>{children}</AppContext.Provider>;
}
export function useApp(){const x=useContext(AppContext);if(!x)throw new Error("useApp must be inside AppProvider");return x;}