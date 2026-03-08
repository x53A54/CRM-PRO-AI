import React, { useState, useEffect } from "react";
import { UserRole, Task, TaskStatus, LeadPriority } from "./types";

import Layout from "./components/Layout";
import DashboardOverview from "./components/DashboardOverview";
import LeadsPage from "./components/LeadsPage";
import TaskList from "./components/TaskList";

import LeadDetailPanel from "./components/LeadDetailPanel";
import AuthScreen from "./components/AuthScreen";

import CreateTaskModal from "./components/CreateTaskModal";
import CreateLeadModal from "./components/CreateLeadModal";
import BulkImportModal from "./components/BulkImportModal";

import { getLeads, deleteLead, getCompany } from "./intelligenceService";

const App: React.FC = () => {

const [isAuthenticated,setIsAuthenticated]=useState(false);
const [role,setRole]=useState<UserRole|null>(null);
const [activeTab,setActiveTab]=useState("dashboard");

const [leads,setLeads]=useState<any[]>([]);
const [tasks,setTasks]=useState<Task[]>([]);
const [leadFilter,setLeadFilter]=useState<string|null>(null);

const [selectedLead,setSelectedLead]=useState<any|null>(null);

const [isCreateTaskModalOpen,setIsCreateTaskModalOpen]=useState(false);
const [isCreateLeadModalOpen,setIsCreateLeadModalOpen]=useState(false);
const [isBulkImportModalOpen,setIsBulkImportModalOpen]=useState(false);

const [companyInfo,setCompanyInfo]=useState<{name:string;code:string}|null>(null);



/* ---------------- LOAD LEADS ---------------- */

const loadLeads = async ()=>{

try{

const token=localStorage.getItem("token");

if(!token) return;

const data=await getLeads(token);

setLeads(Array.isArray(data)?data:[]);

}catch(error){

console.error(error);

setLeads([]);

}

};



/* ---------------- LOAD COMPANY ---------------- */

const loadCompanyInfo = async (currentRole: UserRole, token: string)=>{

if(currentRole!==UserRole.ADMIN){
setCompanyInfo(null);
return;
}

try{

const company=await getCompany(token);

setCompanyInfo(company);

}catch(error){

console.error(error);

setCompanyInfo(null);

}

};



/* ---------------- INITIAL LOGIN CHECK ---------------- */

useEffect(()=>{

const token=localStorage.getItem("token");
const savedRole=localStorage.getItem("role") as UserRole | null;

if(token && savedRole){

setRole(savedRole);
setIsAuthenticated(true);

loadLeads();
loadCompanyInfo(savedRole,token);

}

},[]);



/* ---------------- LOGIN ---------------- */

const handleLogin=(selectedRole:UserRole)=>{

localStorage.setItem("role",selectedRole);

setRole(selectedRole);
setIsAuthenticated(true);

const token=localStorage.getItem("token");

loadLeads();

if(token){
loadCompanyInfo(selectedRole,token);
}

};



/* ---------------- LOGOUT ---------------- */

const handleLogout=()=>{

localStorage.removeItem("token");
localStorage.removeItem("role");
localStorage.removeItem("name");

setIsAuthenticated(false);
setRole(null);
setCompanyInfo(null);
setActiveTab("dashboard");

};



/* ---------------- SAVE LEAD ---------------- */

const handleSaveLead=(lead:any)=>{

setLeads(prev=>[lead,...prev]);

setIsCreateLeadModalOpen(false);

};

const handleBulkImportSuccess = async (summary:{
imported:number;
skipped:number;
errors:string[];
})=>{

await loadLeads();

alert(`${summary.imported} leads imported, ${summary.skipped} skipped`);

if(summary.errors.length){
console.warn("Bulk import warnings:",summary.errors);
}

};

const handleLeadUpdated = async (updatedLead:any)=>{
const updatedLeadId = updatedLead?._id || updatedLead?.id;

setSelectedLead(updatedLead);
setLeads(prev =>
prev.map((lead:any) =>
(lead._id || lead.id) === updatedLeadId
? { ...lead, ...updatedLead, followUpDate: updatedLead?.followUpDate ?? null }
: lead
)
);

try{

const token=localStorage.getItem("token");

if(!token) return;

const data=await getLeads(token);
const refreshedLeads=Array.isArray(data)?data:[];

setLeads(refreshedLeads);

if(updatedLeadId){
const matchingLead = refreshedLeads.find((lead:any)=>
(lead._id || lead.id) === updatedLeadId
);

if(matchingLead){
setSelectedLead(matchingLead);
}
}

}catch(error){
console.error(error);
}

};



/* ---------------- DELETE LEAD ---------------- */

const handleDeleteLead=async(leadId:string)=>{

const token=localStorage.getItem("token");

if(!token)return;

await deleteLead(token,leadId);

setLeads(prev=>prev.filter(l=>l._id!==leadId));

};



/* ---------------- SAVE TASK ---------------- */

const handleSaveTask=(taskData:Partial<Task>)=>{

const newTask:Task={

id:Math.random().toString(36).substr(2,9),

title:taskData.title||"Untitled Task",
description:taskData.description||"",
assignedTo:taskData.assignedTo||"Unassigned",

dueDate:taskData.dueDate||new Date().toISOString(),

status:taskData.status||TaskStatus.PENDING,

priority:taskData.priority||LeadPriority.MEDIUM,

leadId:taskData.leadId,
leadName:taskData.leadName

};

setTasks(prev=>[newTask,...prev]);

};



/* ---------------- COMPLETE TASK ---------------- */

const handleCompleteTask=(id:string)=>{

setTasks(prev=>prev.map(t=>t.id===id?{...t,status:TaskStatus.COMPLETED}:t));

};



/* ---------------- AUTH CHECK ---------------- */

if(!isAuthenticated) return <AuthScreen onLogin={handleLogin}/>;


/* ---------------- USER INFO ---------------- */

const userRole=role as UserRole;

const storedName = localStorage.getItem("name");

const userName = storedName && storedName !== "undefined" ? storedName : "User";

const capitalizeName = (name: string) => {

if (!name) return "User";

return name
.split(" ")
.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
.join(" ");

};

const canGoBack = Boolean(selectedLead) || activeTab === "leads" || activeTab === "tasks";

const headerTitle = (() => {
if (selectedLead || activeTab === "leads") return "Leads";
if (activeTab === "tasks") return "Tasks";
return `Welcome back, ${capitalizeName(userName)}.`;
})();

const handleBack = () => {
if (selectedLead) {
setSelectedLead(null);
return;
}

if (activeTab === "leads" || activeTab === "tasks") {
setActiveTab("dashboard");
}
};



/* ---------------- UI ---------------- */

return(

<Layout role={userRole} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>

<div className="flex justify-between items-center mb-8">

<div className="flex items-center gap-3">
{canGoBack && (
<button
type="button"
onClick={handleBack}
className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer"
aria-label="Go back"
>
<span aria-hidden="true">←</span>
</button>
)}

<h2 className="text-2xl font-bold text-white">
{headerTitle}
</h2>
</div>

<div className="flex items-center gap-4">

{userRole===UserRole.ADMIN && companyInfo?.code && (

<div
title="Share this code with your team to join the company."
className="px-4 py-2 rounded-xl border border-[#06D001]/20 bg-[#06D001]/10 text-sm text-[#b8f58b]"
>
Company Code: <span className="font-bold tracking-wider text-white">{companyInfo.code}</span>
</div>

)}

<button
onClick={()=>setIsCreateLeadModalOpen(true)}
className="px-6 py-2 rounded-xl primary-gradient text-sm font-bold text-white"
>
Create Lead
</button>

{activeTab==="leads" && (
<button
onClick={()=>setIsBulkImportModalOpen(true)}
className="px-6 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white"
>
Import Leads
</button>
)}

</div>

</div>



{/* DASHBOARD */}

{activeTab==="dashboard" && (
<DashboardOverview
leads={leads}
tasks={tasks}
onStatusClick={(status)=>{
setLeadFilter(status==="total"?null:status);
setActiveTab("leads");
}}
onLeadSelect={setSelectedLead}
onAddTask={()=>setIsCreateTaskModalOpen(true)}
/>
)}



{/* LEADS */}

{activeTab==="leads" && (

<LeadsPage
leads={leads}
role={userRole}
onDeleteLead={handleDeleteLead}
onSelectLead={setSelectedLead}
filterStatus={leadFilter}
/>

)}



{/* TASKS */}

{activeTab==="tasks" && (

<TaskList
tasks={tasks}
role={userRole}
onCompleteTask={handleCompleteTask}
/>

)}



{/* LEAD DETAIL */}

{selectedLead && (
<LeadDetailPanel
lead={selectedLead}
onClose={()=>setSelectedLead(null)}
onLeadUpdated={handleLeadUpdated}
/>
)}



{/* MODALS */}

{isCreateLeadModalOpen && (
<CreateLeadModal onClose={()=>setIsCreateLeadModalOpen(false)} onSave={handleSaveLead}/>
)}

{isBulkImportModalOpen && (
<BulkImportModal
onClose={()=>setIsBulkImportModalOpen(false)}
onImportSuccess={handleBulkImportSuccess}
/>
)}

{isCreateTaskModalOpen && (
<CreateTaskModal leads={leads} onClose={()=>setIsCreateTaskModalOpen(false)} onSave={handleSaveTask}/>
)}

</Layout>

);

};

export default App;
