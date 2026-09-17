 "use client";
import { Plus } from "lucide-react";
export function Header({eyebrow,title,desc,onAdd}:{eyebrow:string;title:string;desc?:string;onAdd?:()=>void}){return <div className="topbar"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{desc&&<div className="muted">{desc}</div>}</div>{onAdd&&<button className="btn" onClick={onAdd}><Plus size={16} style={{verticalAlign:"middle",marginRight:6}}/>新增记录</button>}</div>}
