import React, { useState } from "react";
import { Lead, LeadPriority, LeadStage, LeadStatus } from "../types";
import { markLeadContacted, updateLeadStage } from "../intelligenceService";

interface Props {
  lead: Lead;
  onClose: () => void;
  onLeadUpdated?: (lead: Lead) => void;
}

const LeadDetailPanel: React.FC<Props> = ({ lead, onClose, onLeadUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const leadId = lead._id || lead.id;

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

  const handleContacted = async () => {
    const token = localStorage.getItem("token");

    if (!leadId || !token || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedLead = await markLeadContacted(token, leadId);
      onLeadUpdated?.(updatedLead);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update lead";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageUpdate = async (stage: LeadStage) => {
    const token = localStorage.getItem("token");

    if (!leadId || !token || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedLead =
        stage === LeadStage.CONTACTED
          ? await markLeadContacted(token, leadId)
          : await updateLeadStage(token, leadId, stage);

      onLeadUpdated?.(updatedLead);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update lead stage";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stageButtons = [
    { label: "Move to Contacted", stage: LeadStage.CONTACTED },
    { label: "Move to Qualified", stage: LeadStage.QUALIFIED },
    { label: "Send Proposal", stage: LeadStage.PROPOSAL },
    { label: "Mark Won", stage: LeadStage.CLOSED_WON },
    { label: "Mark Lost", stage: LeadStage.CLOSED_LOST }
  ];

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
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
              Stage: {(lead.stage || LeadStage.NEW).replace(/_/g, " ")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

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

        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 text-gray-300">
            Pipeline Actions
          </h3>

          <div className="flex flex-wrap gap-3">
            {stageButtons.map(button => {
              const isCurrentStage = (lead.stage || LeadStage.NEW) === button.stage;

              return (
                <button
                  key={button.stage}
                  type="button"
                  onClick={() =>
                    button.stage === LeadStage.CONTACTED
                      ? handleContacted()
                      : handleStageUpdate(button.stage)
                  }
                  disabled={isSubmitting || isCurrentStage}
                  className="px-5 py-2 rounded-xl primary-gradient text-sm font-bold text-white hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && button.stage === LeadStage.CONTACTED
                    ? "Updating..."
                    : button.label}
                </button>
              );
            })}
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
