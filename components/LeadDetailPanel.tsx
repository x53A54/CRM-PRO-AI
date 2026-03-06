import React from "react";
import { Lead, LeadStatus, LeadPriority } from "../types";

interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDetailPanel: React.FC<Props> = ({ lead, onClose }) => {

  const statusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return "bg-blue-500/20 text-blue-400";
      case LeadStatus.IN_PROGRESS: return "bg-yellow-500/20 text-yellow-400";
      case LeadStatus.CLOSED: return "bg-green-500/20 text-green-400";
      case LeadStatus.LOST: return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const priorityColor = (priority: LeadPriority) => {
    switch (priority) {
      case LeadPriority.URGENT: return "text-red-400";
      case LeadPriority.HIGH: return "text-orange-400";
      case LeadPriority.MEDIUM: return "text-yellow-400";
      case LeadPriority.LOW: return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#0f1115] border border-white/10 rounded-2xl p-8 text-white z-10 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">

          <div>
            <h2 className="text-3xl font-bold">{lead.name}</h2>
            <p className="text-gray-400">{lead.email}</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>

        {/* Lead Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Status</p>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Priority</p>
            <span className={`font-semibold ${priorityColor(lead.priority)}`}>
              {lead.priority}
            </span>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Phone</p>
            <p>{lead.phone || "—"}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Lead Value</p>
            <p className="text-green-400 font-bold">${lead.value}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Owner</p>
            <p>{lead.assignedTo?.name || "Unassigned"}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase mb-1">Follow Up</p>
            <p>{lead.followUpDate || "Not scheduled"}</p>
          </div>

        </div>

        {/* Activity Timeline */}
        <div>

          <h3 className="text-sm font-semibold mb-4 text-gray-300">
            Activity History
          </h3>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">

            {lead.activities && lead.activities.length > 0 ? (
              lead.activities.map((activity) => (
                <div key={activity.id} className="border-l border-white/10 pl-4">

                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="capitalize">{activity.type}</span>
                    <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm">{activity.content}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user}
                  </p>

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No activity yet</p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default LeadDetailPanel;