import React from "react";
import { UserRole } from "../types";

interface Props {
  leads:any[];
  role:UserRole;
  onDeleteLead:(id:string)=>void;
  onSelectLead:(lead:any)=>void;
}

const LeadsPage:React.FC<Props> = ({leads,role,onDeleteLead,onSelectLead}) => {

const priorityColor=(p:string)=>{
switch(p){
case "urgent": return "text-red-400";
case "high": return "text-orange-400";
case "medium": return "text-yellow-400";
default:return "text-slate-400";
}
}

const statusColor=(s:string)=>{
switch(s){
case "new":return "text-blue-400";
case "in_progress":return "text-yellow-400";
case "closed":return "text-green-400";
case "lost":return "text-red-400";
default:return "text-slate-400";
}
}

return(

<div className="overflow-x-auto">

<table className="w-full text-sm text-left">

<thead className="text-gray-400 border-b border-white/10">

<tr>

<th className="py-3">Name</th>
<th>Email</th>
<th>Phone</th>
<th>Priority</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{leads.map((lead:any)=>(

<tr
key={lead._id}
className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
onClick={()=>onSelectLead(lead)}
>

<td className="py-3 text-white">{lead.name}</td>

<td>{lead.email}</td>

<td>{lead.phone}</td>

<td className={priorityColor(lead.priority)}>
{lead.priority}
</td>

<td className={statusColor(lead.status)}>
{lead.status}
</td>

<td onClick={(e)=>e.stopPropagation()}>

<button
onClick={()=>onDeleteLead(lead._id)}
className="text-red-400 text-xs hover:text-red-300"
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

};

export default LeadsPage;