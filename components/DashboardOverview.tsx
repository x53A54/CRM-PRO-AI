import React from "react";

interface Props {
  leads: any[];
}

const DashboardOverview: React.FC<Props> = ({ leads }) => {

  const total = leads.length;

  const newLeads = leads.filter((l:any)=>l.status==="new").length;

  const progress = leads.filter((l:any)=>l.status==="in_progress").length;

  const closed = leads.filter((l:any)=>l.status==="closed").length;

  const lost = leads.filter((l:any)=>l.status==="lost").length;

  return (

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
        <p className="text-gray-400 text-xs uppercase">Total</p>
        <p className="text-2xl font-bold text-white">{total}</p>
      </div>

      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <p className="text-green-400 text-xs uppercase">New</p>
        <p className="text-2xl font-bold text-green-400">{newLeads}</p>
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
        <p className="text-yellow-400 text-xs uppercase">In Progress</p>
        <p className="text-2xl font-bold text-yellow-400">{progress}</p>
      </div>

      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <p className="text-green-400 text-xs uppercase">Closed</p>
        <p className="text-2xl font-bold text-green-400">{closed}</p>
      </div>

      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400 text-xs uppercase">Lost</p>
        <p className="text-2xl font-bold text-red-400">{lost}</p>
      </div>

    </div>

  );
};

export default DashboardOverview;