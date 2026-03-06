import React, { useState } from "react";
import { createLead } from "../intelligenceService";

interface Props {
  onClose: () => void;
  onSave: (lead: any) => void;
}

const CreateLeadModal: React.FC<Props> = ({ onClose, onSave }) => {

const role = localStorage.getItem("role");

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [phone,setPhone]=useState("");
const [value,setValue]=useState(0);
const [priority,setPriority]=useState("medium");
const [assignedTo,setAssignedTo]=useState("");

const handleSubmit=async(e:React.FormEvent)=>{

e.preventDefault();

try{

const token=localStorage.getItem("token");

const leadData:any={
name,
email,
phone,
value,
priority
};

if(role==="admin"){
leadData.assignedTo=assignedTo;
}

const res=await createLead(token!,leadData);

if(!res.lead){
alert("Failed to create lead");
return;
}

onSave(res.lead);
onClose();

}catch(err){

console.error(err);
alert("Failed to create lead");

}

};

return(

<div className="fixed inset-0 z-50 flex items-center justify-center">

<div
className="absolute inset-0 bg-black/60 backdrop-blur-sm"
onClick={onClose}
/>

<div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 relative z-10">

<h3 className="text-2xl font-bold text-[#06D001] mb-6">
Create Lead
</h3>

<form onSubmit={handleSubmit} className="space-y-4">

<input
required
placeholder="Customer Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
/>

<input
type="number"
placeholder="Lead Value"
value={value}
onChange={(e)=>setValue(Number(e.target.value))}
className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
/>

<select
value={priority}
onChange={(e)=>setPriority(e.target.value)}
className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-white"
>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
<option value="urgent">Urgent</option>
</select>

{role==="admin" && (

<input
placeholder="Assign Executive (User ID)"
value={assignedTo}
onChange={(e)=>setAssignedTo(e.target.value)}
className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
/>

)}

<div className="flex justify-end gap-3 mt-6">

<button
type="button"
onClick={onClose}
className="px-6 py-2 bg-white/5 rounded-xl"
>
Cancel
</button>

<button
type="submit"
className="px-6 py-2 bg-[#06D001] text-black font-bold rounded-xl"
>
Create
</button>

</div>

</form>

</div>

</div>

);

};

export default CreateLeadModal;