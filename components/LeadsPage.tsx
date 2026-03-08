import React, { useState } from "react";
import { UserRole } from "../types";

interface Props {
  leads:any[];
  role:UserRole;
  onDeleteLead:(id:string)=>void;
  onSelectLead:(lead:any)=>void;
  filterStatus?:string|null;
}

const LeadsPage:React.FC<Props> = ({leads,role,onDeleteLead,onSelectLead,filterStatus}) => {
const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

const visibleLeads=filterStatus
? leads.filter((lead:any)=>lead.status===filterStatus)
: leads;

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

const confirmDelete = () => {
if (!leadToDelete) return;
onDeleteLead(leadToDelete);
setLeadToDelete(null);
};

return(

<>
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

{visibleLeads.map((lead:any)=>(

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
onClick={()=>setLeadToDelete(lead._id)}
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

{leadToDelete && (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-[400px] shadow-xl">
    <h3 className="text-lg font-semibold text-white mb-2">
      Delete Lead
    </h3>

    <p className="text-gray-400 mb-6">
      Are you sure you want to delete this lead? This action cannot be undone.
    </p>

    <div className="flex justify-end gap-3">
      <button
        onClick={() => setLeadToDelete(null)}
        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
      >
        Cancel
      </button>

      <button
        onClick={confirmDelete}
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
</div>
)}

</>

);

};

export default LeadsPage;
