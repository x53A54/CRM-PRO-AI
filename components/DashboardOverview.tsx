import React, { useEffect, useState } from "react";
import { LeadStage, Task, TaskStatus } from "../types";

interface Props {
  leads: any[];
  tasks: Task[];
  onStatusClick?: (status: string) => void;
  onLeadSelect?: (lead: any) => void;
  onAddTask?: () => void;
}

const DashboardOverview: React.FC<Props> = ({
  leads,
  tasks,
  onStatusClick,
  onLeadSelect
}) => {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const currentUserName = (localStorage.getItem("name") || "").trim().toLowerCase();
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const parseDate = (value?: string) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatDate = (value?: string) => {
    const date = parseDate(value);
    return date ? date.toLocaleDateString() : "Not scheduled";
  };

  const isTodayOrOverdue = (value?: string) => {
    const date = parseDate(value);
    return date ? date.getTime() <= today.getTime() : false;
  };

  const isOverdue = (value?: string) => {
    const date = parseDate(value);
    return date ? date.getTime() < today.getTime() : false;
  };

  const isToday = (value?: string) => {
    const date = parseDate(value);
    return date ? date.getTime() === today.getTime() : false;
  };

  const total = safeLeads.length;
  const newLeads = safeLeads.filter((lead: any) => lead.status === "new").length;
  const progress = safeLeads.filter((lead: any) => lead.status === "in_progress").length;
  const closed = safeLeads.filter((lead: any) => lead.status === "closed").length;
  const lost = safeLeads.filter((lead: any) => lead.status === "lost").length;

  const urgentLeads = safeLeads
    .filter(
      (lead: any) =>
        [LeadStage.NEW, LeadStage.CONTACTED, LeadStage.QUALIFIED].includes(
          (lead.stage || LeadStage.NEW) as LeadStage
        ) &&
        (lead.priority === "high" || isTodayOrOverdue(lead.followUpDate))
    )
    .slice(0, 5);

  const openTasks = safeTasks
    .filter(task => task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const buildNotifications = () =>
    [
      ...safeLeads
        .filter((lead: any) => {
          const assignedName =
            typeof lead.assignedTo === "object" ? lead.assignedTo?.name : lead.assignedTo;

          return (
            typeof assignedName === "string" &&
            assignedName.trim().toLowerCase() === currentUserName
          );
        })
        .map((lead: any) => ({
          id: `assigned-${lead._id || lead.id || lead.email}`,
          text: `${lead.name} was assigned to you`
        })),
      ...safeLeads
        .filter((lead: any) => isOverdue(lead.followUpDate))
        .map((lead: any) => ({
          id: `overdue-${lead._id || lead.id || lead.email}`,
          text: `Follow-up overdue for ${lead.name}`
        })),
      ...safeTasks
        .filter(task => task.status !== TaskStatus.COMPLETED && isToday(task.dueDate))
        .map(task => ({
          id: `task-due-${task.id}`,
          text: `${task.title} is due today`
        }))
    ].slice(0, 5);

  const [notifications, setNotifications] = useState(buildNotifications);

  useEffect(() => {
    setNotifications(buildNotifications());
  }, [leads, tasks, currentUserName]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          type="button"
          onClick={() => onStatusClick?.("total")}
          className="p-4 bg-white/5 border border-white/10 rounded-xl text-center transition hover:bg-white/10"
        >
          <p className="text-gray-400 text-xs uppercase">Total</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </button>

        <button
          type="button"
          onClick={() => onStatusClick?.("new")}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center transition hover:bg-green-500/15"
        >
          <p className="text-green-400 text-xs uppercase">New</p>
          <p className="text-2xl font-bold text-green-400">{newLeads}</p>
        </button>

        <button
          type="button"
          onClick={() => onStatusClick?.("in_progress")}
          className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center transition hover:bg-yellow-500/15"
        >
          <p className="text-yellow-400 text-xs uppercase">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400">{progress}</p>
        </button>

        <button
          type="button"
          onClick={() => onStatusClick?.("closed")}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center transition hover:bg-green-500/15"
        >
          <p className="text-green-400 text-xs uppercase">Closed</p>
          <p className="text-2xl font-bold text-green-400">{closed}</p>
        </button>

        <button
          type="button"
          onClick={() => onStatusClick?.("lost")}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center transition hover:bg-red-500/15"
        >
          <p className="text-red-400 text-xs uppercase">Lost</p>
          <p className="text-2xl font-bold text-red-400">{lost}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Urgent Leads</h3>
            <span className="text-xs uppercase tracking-widest text-slate-500">Top 5</span>
          </div>

          <div className="space-y-3">
            {urgentLeads.length === 0 ? (
              <p className="text-sm text-slate-500">No urgent leads right now.</p>
            ) : (
              urgentLeads.map((lead: any) => (
                <button
                  key={lead._id || lead.id || lead.email}
                  type="button"
                  onClick={() => onLeadSelect?.(lead)}
                  className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-left transition hover:border-[#06D001]/40 hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                        Follow-up: {formatDate(lead.followUpDate)}
                      </p>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                      {lead.priority}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">My Tasks</h3>
          </div>

          <div className="space-y-3">
            {openTasks.length === 0 ? (
              <p className="text-sm text-slate-500">No open tasks.</p>
            ) : (
              openTasks.map(task => (
                <div
                  key={task.id}
                  className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"
                >
                  <p className="font-semibold text-white">{task.title}</p>
                  <div className="mt-1 flex flex-col gap-1 text-xs uppercase tracking-widest text-slate-500">
                    <span>Lead: {task.leadName || "Unassigned"}</span>
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            <span className="text-xs uppercase tracking-widest text-slate-500">Latest 5</span>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No new notifications.</p>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{notification.text}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications(prev =>
                          prev.filter((_, notificationIndex) => notificationIndex !== index)
                        )
                      }
                      className="text-sm text-gray-400 cursor-pointer hover:text-red-400"
                      aria-label={`Dismiss notification: ${notification.text}`}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
