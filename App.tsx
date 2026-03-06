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

import { getLeads, deleteLead } from "./intelligenceService";
const userName = localStorage.getItem("name");

const App: React.FC = () => {

const [isAuthenticated,setIsAuthenticated]=useState(false);

const [role,setRole]=useState<UserRole|null>(null);

const [activeTab,setActiveTab]=useState("dashboard");

const [leads,setLeads]=useState<any[]>([]);

const [tasks,setTasks]=useState<Task[]>([]);

const [selectedLead,setSelectedLead]=useState<any|null>(null);

const [isCreateTaskModalOpen,setIsCreateTaskModalOpen]=useState(false);

const [isCreateLeadModalOpen,setIsCreateLeadModalOpen]=useState(false);

const loadLeads = async ()=>{

try{

const token=localStorage.getItem("token");

if(!token)return;

const data=await getLeads(token);

setLeads(data);

}catch(error){

console.error(error);

}

};

useEffect(()=>{

const token=localStorage.getItem("token");

const savedRole=localStorage.getItem("role") as UserRole | null;

if(token && savedRole){

setRole(savedRole);

setIsAuthenticated(true);

loadLeads();

}

},[]);

const handleLogin=(selectedRole:UserRole)=>{

localStorage.setItem("role",selectedRole);

setRole(selectedRole);

setIsAuthenticated(true);

loadLeads();

};

const handleLogout=()=>{

localStorage.removeItem("token");

localStorage.removeItem("role");

setIsAuthenticated(false);

setRole(null);

setActiveTab("dashboard");

};

const handleSaveLead=(lead:any)=>{

setLeads(prev=>[lead,...prev]);

setIsCreateLeadModalOpen(false);

};

const handleDeleteLead=async(leadId:string)=>{

const token=localStorage.getItem("token");

if(!token)return;

await deleteLead(token,leadId);

setLeads(prev=>prev.filter(l=>l._id!==leadId));

};

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

const handleCompleteTask=(id:string)=>{

setTasks(prev=>prev.map(t=>t.id===id?{...t,status:TaskStatus.COMPLETED}:t));

};

if(!isAuthenticated)return<AuthScreen onLogin={handleLogin}/>;

const userRole=role as UserRole;

return(

<Layout role={userRole} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>

<div className="flex justify-between items-center mb-8">

<h2 className="text-2xl font-bold text-white">

Welcome back, {localStorage.getItem("name") || "User"}.
</h2>

<button

onClick={()=>setIsCreateLeadModalOpen(true)}

className="px-6 py-2 rounded-xl primary-gradient text-sm font-bold text-white"

>

Create Lead

</button>

</div>

{activeTab==="dashboard" && (

<DashboardOverview leads={leads}/>

)}

{activeTab==="leads" && (

<LeadsPage
leads={leads}
role={userRole}
onDeleteLead={handleDeleteLead}
onSelectLead={setSelectedLead}
/>
)}

{activeTab==="tasks" && (

<TaskList

tasks={tasks}

role={userRole}

onCompleteTask={handleCompleteTask}

/>

)}

{selectedLead && (

<LeadDetailPanel lead={selectedLead} onClose={()=>setSelectedLead(null)}/>

)}

{isCreateLeadModalOpen && (

<CreateLeadModal onClose={()=>setIsCreateLeadModalOpen(false)} onSave={handleSaveLead}/>

)}

{isCreateTaskModalOpen && (

<CreateTaskModal leads={leads} onClose={()=>setIsCreateTaskModalOpen(false)} onSave={handleSaveTask}/>

)}

</Layout>

);

};

export default App;