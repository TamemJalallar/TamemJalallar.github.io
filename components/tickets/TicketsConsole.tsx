"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_TICKETS_BUCKET ?? "ticket-attachments";

const TICKET_TYPES = [
  "Incident",
  "Service Request",
  "Problem",
  "Change",
  "Task",
  "Access",
] as const;
type TicketType = (typeof TICKET_TYPES)[number];

const PRIORITIES = ["Critical", "High", "Moderate", "Low"] as const;
type TicketPriority = (typeof PRIORITIES)[number];

const STATES = [
  "New",
  "In Progress",
  "Pending",
  "Awaiting User",
  "Awaiting Approval",
  "Resolved",
  "Closed",
] as const;
type TicketState = (typeof STATES)[number];

const APPROVAL_STATUSES = ["Not Required", "Pending", "Approved", "Rejected"] as const;
type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

type TicketAttachment = {
  name: string;
  kind: "Photo" | "Video" | "Document";
  sizeLabel: string;
  size: number;
  mimeType: string;
  url: string;
  storagePath?: string;
};

type TicketNote = {
  id: string;
  author: string;
  text: string;
  at: string;
};

type TicketActivity = {
  id: string;
  at: string;
  actor: string;
  action: string;
  details: string;
};

type Ticket = {
  id: string;
  number: string;
  type: TicketType;
  shortDescription: string;
  description: string;
  requestedFor: string;
  requesterEmail: string;
  assignmentGroup: string;
  assignee: string;
  priority: TicketPriority;
  state: TicketState;
  category: string;
  subcategory: string;
  impact: "High" | "Medium" | "Low";
  urgency: "High" | "Medium" | "Low";
  approvalStatus: ApprovalStatus;
  approver: string;
  approvalNotes: string;
  openedAt: string;
  dueBy?: string;
  slaBreachAt: string;
  resolvedAt?: string;
  closedAt?: string;
  escalated: boolean;
  reopenCount: number;
  attachments: TicketAttachment[];
  workNotes: TicketNote[];
  activities: TicketActivity[];
  createdBy: string;
  source: "local" | "supabase";
  createdAt: string;
  updatedAt: string;
};

type TicketRow = {
  id: string;
  number: string;
  payload: Ticket;
  created_at: string;
  updated_at: string;
};

type NewEntryForm = {
  type: TicketType;
  shortDescription: string;
  description: string;
  requestedFor: string;
  requesterEmail: string;
  assignmentGroup: string;
  assignee: string;
  priority: TicketPriority;
  state: TicketState;
  category: string;
  subcategory: string;
  impact: "High" | "Medium" | "Low";
  urgency: "High" | "Medium" | "Low";
  dueBy: string;
  workNotes: string;
  autoAssign: boolean;
};

type DetailDraft = {
  state: TicketState;
  priority: TicketPriority;
  assignmentGroup: string;
  assignee: string;
  dueBy: string;
  approvalNotes: string;
};

type SavedView = {
  id: string;
  label: string;
  predicate: (ticket: Ticket, operatorName: string, operatorGroup: string, nowMs: number) => boolean;
};

const SLA_HOURS_BY_PRIORITY: Record<TicketPriority, number> = {
  Critical: 4,
  High: 8,
  Moderate: 24,
  Low: 72,
};

const PREFIX_BY_TYPE: Record<TicketType, string> = {
  Incident: "INC",
  "Service Request": "REQ",
  Problem: "PRB",
  Change: "CHG",
  Task: "TASK",
  Access: "ACC",
};

const REQUIRED_FIELDS_BY_TYPE: Record<TicketType, Array<keyof NewEntryForm>> = {
  Incident: ["shortDescription", "requestedFor", "category", "impact", "urgency"],
  "Service Request": ["shortDescription", "requestedFor", "category"],
  Problem: ["shortDescription", "category", "description"],
  Change: ["shortDescription", "category", "description", "dueBy"],
  Task: ["shortDescription", "assignmentGroup"],
  Access: ["shortDescription", "requestedFor", "category", "description"],
};

const ALLOWED_STATE_TRANSITIONS: Record<TicketState, TicketState[]> = {
  New: ["In Progress", "Pending", "Awaiting User", "Awaiting Approval", "Closed"],
  "In Progress": ["Pending", "Awaiting User", "Resolved", "Closed"],
  Pending: ["In Progress", "Awaiting User", "Resolved", "Closed"],
  "Awaiting User": ["In Progress", "Pending", "Resolved", "Closed"],
  "Awaiting Approval": ["New", "In Progress", "Closed"],
  Resolved: ["Closed", "In Progress"],
  Closed: ["In Progress"],
};

const ACCEPTED_ATTACHMENT_TYPES = [
  "image/*",
  "video/*",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
] as const;

const ENTRY_CATALOG: Array<{ type: TicketType; examples: string }> = [
  { type: "Incident", examples: "Outage, auth failure, degraded service" },
  { type: "Service Request", examples: "New laptop, software install, onboarding" },
  { type: "Problem", examples: "Root-cause analysis for recurring incidents" },
  { type: "Change", examples: "Firewall updates, patch windows, releases" },
  { type: "Task", examples: "Ops follow-up, implementation task, documentation" },
  { type: "Access", examples: "Role assignment, entitlement, group membership" },
];

const SAVED_VIEWS: SavedView[] = [
  {
    id: "all-open",
    label: "All Open",
    predicate: (ticket) => ticket.state !== "Resolved" && ticket.state !== "Closed",
  },
  {
    id: "my-queue",
    label: "My Queue",
    predicate: (ticket, operatorName, operatorGroup) =>
      ticket.assignmentGroup === operatorGroup || ticket.assignee === operatorName,
  },
  {
    id: "unassigned",
    label: "Unassigned",
    predicate: (ticket) => !ticket.assignee.trim(),
  },
  {
    id: "p1-p2",
    label: "P1/P2",
    predicate: (ticket) => ticket.priority === "Critical" || ticket.priority === "High",
  },
  {
    id: "awaiting-user",
    label: "Awaiting User",
    predicate: (ticket) => ticket.state === "Awaiting User",
  },
  {
    id: "needs-approval",
    label: "Needs Approval",
    predicate: (ticket) => ticket.approvalStatus === "Pending",
  },
  {
    id: "escalations",
    label: "Escalations",
    predicate: (ticket, _operatorName, _operatorGroup, nowMs) =>
      getSlaInfo(ticket, nowMs).status === "Breached" ||
      (getSlaInfo(ticket, nowMs).status === "At Risk" &&
        (ticket.priority === "Critical" || ticket.priority === "High")),
  },
  {
    id: "resolved-7d",
    label: "Resolved (7d)",
    predicate: (ticket, _operatorName, _operatorGroup, nowMs) => {
      if (!ticket.resolvedAt) return false;
      const resolvedMs = Date.parse(ticket.resolvedAt);
      return Number.isFinite(resolvedMs) && nowMs - resolvedMs <= 7 * 24 * 60 * 60 * 1000;
    },
  },
];

const INITIAL_FORM: NewEntryForm = {
  type: "Incident",
  shortDescription: "",
  description: "",
  requestedFor: "",
  requesterEmail: "",
  assignmentGroup: "",
  assignee: "",
  priority: "Moderate",
  state: "New",
  category: "General",
  subcategory: "",
  impact: "Medium",
  urgency: "Medium",
  dueBy: "",
  workNotes: "",
  autoAssign: true,
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "seed-inc-1",
    number: "INC0001043",
    type: "Incident",
    shortDescription: "Users unable to authenticate into Okta after policy update",
    description:
      "Authentication started failing for a subset of users after a conditional access policy change.",
    requestedFor: "Marketing Team",
    requesterEmail: "marketing-ops@tomfromit.com",
    assignmentGroup: "Identity Operations",
    assignee: "On-Call Engineer",
    priority: "Critical",
    state: "In Progress",
    category: "Identity",
    subcategory: "Okta",
    impact: "High",
    urgency: "High",
    approvalStatus: "Not Required",
    approver: "",
    approvalNotes: "",
    openedAt: "2026-03-02T14:10:00.000Z",
    dueBy: "2026-03-03",
    slaBreachAt: "2026-03-02T18:10:00.000Z",
    escalated: true,
    reopenCount: 0,
    attachments: [],
    workNotes: [
      {
        id: "seed-note-1",
        author: "Tom Jalallar",
        text: "Rollback path prepared. Collecting failed sign-in logs.",
        at: "2026-03-02T15:00:00.000Z",
      },
    ],
    activities: [
      {
        id: "seed-act-1",
        actor: "Tom Jalallar",
        action: "Ticket Created",
        details: "Created from identity operations queue.",
        at: "2026-03-02T14:10:00.000Z",
      },
      {
        id: "seed-act-2",
        actor: "Tom Jalallar",
        action: "State Updated",
        details: "State changed to In Progress.",
        at: "2026-03-02T14:40:00.000Z",
      },
    ],
    createdBy: "Tom Jalallar",
    source: "local",
    createdAt: "2026-03-02T14:10:00.000Z",
    updatedAt: "2026-03-02T15:00:00.000Z",
  },
  {
    id: "seed-req-1",
    number: "REQ0002091",
    type: "Service Request",
    shortDescription: "Provision Adobe Creative Cloud for new hire",
    description: "Creative team onboarding needs Adobe licensing and font package sync.",
    requestedFor: "Design Ops",
    requesterEmail: "design-ops@tomfromit.com",
    assignmentGroup: "End User Computing",
    assignee: "",
    priority: "Moderate",
    state: "New",
    category: "Software",
    subcategory: "Adobe",
    impact: "Medium",
    urgency: "Low",
    approvalStatus: "Not Required",
    approver: "",
    approvalNotes: "",
    openedAt: "2026-03-03T09:25:00.000Z",
    dueBy: "2026-03-05",
    slaBreachAt: "2026-03-04T09:25:00.000Z",
    escalated: false,
    reopenCount: 0,
    attachments: [],
    workNotes: [],
    activities: [
      {
        id: "seed-act-3",
        actor: "Tom Jalallar",
        action: "Ticket Created",
        details: "Service request opened.",
        at: "2026-03-03T09:25:00.000Z",
      },
    ],
    createdBy: "Tom Jalallar",
    source: "local",
    createdAt: "2026-03-03T09:25:00.000Z",
    updatedAt: "2026-03-03T09:25:00.000Z",
  },
  {
    id: "seed-chg-1",
    number: "CHG0000712",
    type: "Change",
    shortDescription: "Enable conditional access for unmanaged endpoints",
    description: "Rollout policy to require compliant device status for core SaaS apps.",
    requestedFor: "Security Engineering",
    requesterEmail: "security@tomfromit.com",
    assignmentGroup: "Change Advisory Board",
    assignee: "",
    priority: "High",
    state: "Awaiting Approval",
    category: "Security",
    subcategory: "Conditional Access",
    impact: "High",
    urgency: "Medium",
    approvalStatus: "Pending",
    approver: "CAB Team",
    approvalNotes: "",
    openedAt: "2026-03-01T11:30:00.000Z",
    dueBy: "2026-03-06",
    slaBreachAt: "2026-03-01T19:30:00.000Z",
    escalated: true,
    reopenCount: 0,
    attachments: [],
    workNotes: [],
    activities: [
      {
        id: "seed-act-4",
        actor: "Tom Jalallar",
        action: "Ticket Created",
        details: "Change request submitted and pending approval.",
        at: "2026-03-01T11:30:00.000Z",
      },
    ],
    createdBy: "Tom Jalallar",
    source: "local",
    createdAt: "2026-03-01T11:30:00.000Z",
    updatedAt: "2026-03-01T11:30:00.000Z",
  },
];

function nowIso(): string {
  return new Date().toISOString();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function resolveAttachmentKind(file: File): TicketAttachment["kind"] {
  if (file.type.startsWith("image/")) return "Photo";
  if (file.type.startsWith("video/")) return "Video";
  return "Document";
}

function getPriorityClass(priority: TicketPriority): string {
  if (priority === "Critical") return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300";
  if (priority === "High") return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
  if (priority === "Moderate") return "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
}

function getStateClass(state: TicketState): string {
  if (state === "Resolved" || state === "Closed") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
  }
  if (state === "Pending" || state === "Awaiting Approval") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
  }
  if (state === "In Progress") {
    return "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300";
  }
  return "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300";
}

function createActivity(actor: string, action: string, details: string): TicketActivity {
  return {
    id: `act-${crypto.randomUUID()}`,
    actor,
    action,
    details,
    at: nowIso(),
  };
}

function requiresApproval(type: TicketType): boolean {
  return type === "Change" || type === "Access";
}

function withDefaultState(type: TicketType): TicketState {
  return requiresApproval(type) ? "Awaiting Approval" : "New";
}

function computeSlaBreachAt(priority: TicketPriority, openedAtIso: string): string {
  const opened = Date.parse(openedAtIso);
  const hours = SLA_HOURS_BY_PRIORITY[priority] ?? 24;
  return new Date(opened + hours * 60 * 60 * 1000).toISOString();
}

function suggestAssignment(
  type: TicketType,
  category: string,
  priority: TicketPriority
): { assignmentGroup: string; assignee: string } {
  const normalizedCategory = category.trim().toLowerCase();

  if (type === "Change") {
    return { assignmentGroup: "Change Advisory Board", assignee: "" };
  }
  if (type === "Access" || normalizedCategory.includes("identity") || normalizedCategory.includes("access")) {
    return { assignmentGroup: "IAM Governance", assignee: "" };
  }
  if (normalizedCategory.includes("network") || normalizedCategory.includes("vpn")) {
    return { assignmentGroup: "Network Operations", assignee: "" };
  }
  if (normalizedCategory.includes("security")) {
    return { assignmentGroup: "Security Operations", assignee: "" };
  }
  if (normalizedCategory.includes("software") || normalizedCategory.includes("endpoint")) {
    return { assignmentGroup: "End User Computing", assignee: "" };
  }

  return {
    assignmentGroup: "Service Desk",
    assignee: priority === "Critical" ? "On-Call Engineer" : "",
  };
}

function getSlaInfo(ticket: Ticket, nowMs: number): {
  status: "Met" | "On Track" | "At Risk" | "Breached";
  label: string;
  breached: boolean;
  atRisk: boolean;
} {
  if (ticket.state === "Resolved" || ticket.state === "Closed") {
    return { status: "Met", label: "SLA met", breached: false, atRisk: false };
  }

  const breachAtMs = Date.parse(ticket.slaBreachAt);
  if (!Number.isFinite(breachAtMs)) {
    return { status: "On Track", label: "No SLA target", breached: false, atRisk: false };
  }

  const diff = breachAtMs - nowMs;
  if (diff <= 0) {
    return { status: "Breached", label: "Breached", breached: true, atRisk: false };
  }

  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const label = `${hours}h ${minutes}m remaining`;
  if (diff <= 60 * 60 * 1000) {
    return { status: "At Risk", label, breached: false, atRisk: true };
  }
  return { status: "On Track", label, breached: false, atRisk: false };
}

function buildLocalTicketFromPayload(payload: Partial<Ticket>, fallbackNumber = ""): Ticket {
  const openedAt = payload.openedAt ?? nowIso();
  const priority = payload.priority ?? "Moderate";
  return {
    id: payload.id ?? `local-${crypto.randomUUID()}`,
    number: payload.number ?? fallbackNumber,
    type: payload.type ?? "Incident",
    shortDescription: payload.shortDescription ?? "",
    description: payload.description ?? "",
    requestedFor: payload.requestedFor ?? "",
    requesterEmail: payload.requesterEmail ?? "",
    assignmentGroup: payload.assignmentGroup ?? "Service Desk",
    assignee: payload.assignee ?? "",
    priority,
    state: payload.state ?? withDefaultState(payload.type ?? "Incident"),
    category: payload.category ?? "General",
    subcategory: payload.subcategory ?? "",
    impact: payload.impact ?? "Medium",
    urgency: payload.urgency ?? "Medium",
    approvalStatus: payload.approvalStatus ?? (requiresApproval(payload.type ?? "Incident") ? "Pending" : "Not Required"),
    approver: payload.approver ?? "",
    approvalNotes: payload.approvalNotes ?? "",
    openedAt,
    dueBy: payload.dueBy,
    slaBreachAt: payload.slaBreachAt ?? computeSlaBreachAt(priority, openedAt),
    resolvedAt: payload.resolvedAt,
    closedAt: payload.closedAt,
    escalated: payload.escalated ?? false,
    reopenCount: payload.reopenCount ?? 0,
    attachments: payload.attachments ?? [],
    workNotes: payload.workNotes ?? [],
    activities: payload.activities ?? [],
    createdBy: payload.createdBy ?? "System",
    source: payload.source ?? "local",
    createdAt: payload.createdAt ?? openedAt,
    updatedAt: payload.updatedAt ?? openedAt,
  };
}

function mapRowToTicket(row: TicketRow): Ticket {
  const payload = row.payload ?? ({} as Ticket);
  return buildLocalTicketFromPayload(
    {
      ...payload,
      id: row.id,
      number: row.number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      source: "supabase",
    },
    row.number
  );
}

function formatDateTime(value?: string): string {
  if (!value) return "-";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "-";
  return new Date(timestamp).toLocaleString();
}

function createSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export default function TicketsConsole() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TicketType>("All");
  const [stateFilter, setStateFilter] = useState<"All" | TicketState>("All");
  const [groupFilter, setGroupFilter] = useState<"All" | string>("All");
  const [activeView, setActiveView] = useState<string>("all-open");
  const [form, setForm] = useState<NewEntryForm>(INITIAL_FORM);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [detailDraft, setDetailDraft] = useState<DetailDraft | null>(null);
  const [detailError, setDetailError] = useState("");
  const [newNote, setNewNote] = useState("");
  const [operatorName, setOperatorName] = useState("Tom Jalallar");
  const [operatorGroup, setOperatorGroup] = useState("Identity Operations");
  const [dataMode, setDataMode] = useState<"supabase" | "local">(
    SUPABASE_URL && SUPABASE_ANON_KEY ? "supabase" : "local"
  );
  const [dataStatus, setDataStatus] = useState(
    SUPABASE_URL && SUPABASE_ANON_KEY
      ? "Connecting to Supabase..."
      : "Supabase not configured. Running in local demo mode."
  );
  const [alerts, setAlerts] = useState<string[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported");
  const [nowMs, setNowMs] = useState<number>(Date.now());

  const supabaseRef = useRef<SupabaseClient | null>(null);
  const createdObjectUrlsRef = useRef<string[]>([]);

  if (!supabaseRef.current) {
    supabaseRef.current = createSupabaseClient();
  }

  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const pushAlert = (message: string) => {
    const timestamped = `${new Date().toLocaleTimeString()} - ${message}`;
    setAlerts((current) => [timestamped, ...current].slice(0, 8));
  };

  const notifyForNewTicket = (ticket: Ticket) => {
    pushAlert(`New ticket ${ticket.number}: ${ticket.shortDescription}`);

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(`New Ticket: ${ticket.number}`, {
        body: `${ticket.type} - ${ticket.shortDescription}`,
      });
    }
  };

  const persistInsert = async (ticket: Ticket): Promise<Ticket> => {
    const supabase = supabaseRef.current;
    if (!supabase) return ticket;

    const { data, error } = await supabase
      .from("tickets")
      .insert({
        number: ticket.number,
        payload: ticket,
      })
      .select("id, number, payload, created_at, updated_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to insert ticket into Supabase.");
    }

    return mapRowToTicket(data as TicketRow);
  };

  const persistUpdate = async (ticket: Ticket): Promise<Ticket> => {
    const supabase = supabaseRef.current;
    if (!supabase || ticket.source !== "supabase") return ticket;

    const payload: Ticket = {
      ...ticket,
      source: "supabase",
      updatedAt: nowIso(),
    };

    const { data, error } = await supabase
      .from("tickets")
      .update({ payload })
      .eq("id", ticket.id)
      .select("id, number, payload, created_at, updated_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update ticket in Supabase.");
    }

    return mapRowToTicket(data as TicketRow);
  };

  const uploadAttachments = async (
    files: File[],
    ticketNumber: string
  ): Promise<TicketAttachment[]> => {
    if (!files.length) return [];

    const supabase = supabaseRef.current;
    const uploads = await Promise.all(
      files.map(async (file) => {
        const baseAttachment: TicketAttachment = {
          name: file.name,
          kind: resolveAttachmentKind(file),
          sizeLabel: formatBytes(file.size),
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          url: "",
        };

        if (!supabase) {
          const localUrl = URL.createObjectURL(file);
          createdObjectUrlsRef.current.push(localUrl);
          return { ...baseAttachment, url: localUrl };
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${ticketNumber}/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
          upsert: false,
        });

        if (error) {
          const localUrl = URL.createObjectURL(file);
          createdObjectUrlsRef.current.push(localUrl);
          return { ...baseAttachment, url: localUrl };
        }

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return {
          ...baseAttachment,
          url: data.publicUrl,
          storagePath: path,
        };
      })
    );

    return uploads;
  };

  useEffect(() => {
    let cancelled = false;
    const supabase = supabaseRef.current;

    const loadTickets = async () => {
      if (!supabase) {
        setDataMode("local");
        setDataStatus("Supabase not configured. Running in local demo mode.");
        return;
      }

      const { data, error } = await supabase
        .from("tickets")
        .select("id, number, payload, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setDataMode("local");
        setDataStatus(`Supabase load failed: ${error.message}. Falling back to local mode.`);
        setTickets(INITIAL_TICKETS);
        return;
      }

      const mapped = (data as TicketRow[]).map((row) => mapRowToTicket(row));
      setTickets(mapped.length ? mapped : []);
      setDataMode("supabase");
      setDataStatus(
        mapped.length
          ? "Connected to Supabase. Realtime sync and alerts enabled."
          : "Connected to Supabase. No tickets yet."
      );
    };

    void loadTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;

    const channel = supabase
      .channel("tickets-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tickets" },
        (payload) => {
          const row = payload.new as TicketRow;
          const incoming = mapRowToTicket(row);

          setTickets((current) => {
            if (current.some((ticket) => ticket.id === incoming.id || ticket.number === incoming.number)) {
              return current;
            }
            return [incoming, ...current];
          });

          if (incoming.createdBy !== operatorName) {
            notifyForNewTicket(incoming);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tickets" },
        (payload) => {
          const row = payload.new as TicketRow;
          const incoming = mapRowToTicket(row);
          setTickets((current) =>
            current.map((ticket) => (ticket.id === incoming.id ? incoming : ticket))
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setDataStatus("Connected to Supabase. Realtime sync and alerts enabled.");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [operatorName]);

  const assignmentGroups = useMemo(
    () => Array.from(new Set(tickets.map((ticket) => ticket.assignmentGroup))).sort(),
    [tickets]
  );

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );

  useEffect(() => {
    if (!selectedTicket) {
      setDetailDraft(null);
      return;
    }

    setDetailDraft({
      state: selectedTicket.state,
      priority: selectedTicket.priority,
      assignmentGroup: selectedTicket.assignmentGroup,
      assignee: selectedTicket.assignee,
      dueBy: selectedTicket.dueBy ?? "",
      approvalNotes: selectedTicket.approvalNotes,
    });
    setDetailError("");
  }, [selectedTicket]);

  const filteredTickets = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const active = SAVED_VIEWS.find((view) => view.id === activeView) ?? SAVED_VIEWS[0];

    return tickets
      .filter((ticket) => active.predicate(ticket, operatorName, operatorGroup, nowMs))
      .filter((ticket) => {
        const matchSearch = !needle
          ? true
          : [
              ticket.number,
              ticket.shortDescription,
              ticket.requestedFor,
              ticket.assignmentGroup,
              ticket.assignee,
              ticket.category,
            ]
              .join(" ")
              .toLowerCase()
              .includes(needle);
        const matchType = typeFilter === "All" ? true : ticket.type === typeFilter;
        const matchState = stateFilter === "All" ? true : ticket.state === stateFilter;
        const matchGroup = groupFilter === "All" ? true : ticket.assignmentGroup === groupFilter;
        return matchSearch && matchType && matchState && matchGroup;
      })
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  }, [activeView, groupFilter, nowMs, operatorGroup, operatorName, search, stateFilter, tickets, typeFilter]);

  const metrics = useMemo(() => {
    const openTickets = tickets.filter((ticket) => ticket.state !== "Resolved" && ticket.state !== "Closed");
    const slaBreached = openTickets.filter((ticket) => getSlaInfo(ticket, nowMs).breached).length;
    const escalations = openTickets.filter((ticket) => {
      const info = getSlaInfo(ticket, nowMs);
      return info.breached || (info.atRisk && (ticket.priority === "Critical" || ticket.priority === "High"));
    }).length;

    const resolvedOrClosed = tickets.filter(
      (ticket) => ticket.state === "Resolved" || ticket.state === "Closed"
    );

    const mttrHours = resolvedOrClosed.length
      ? resolvedOrClosed.reduce((sum, ticket) => {
          const start = Date.parse(ticket.openedAt);
          const end = Date.parse(ticket.resolvedAt ?? ticket.closedAt ?? ticket.updatedAt);
          if (!Number.isFinite(start) || !Number.isFinite(end)) return sum;
          return sum + (end - start) / (1000 * 60 * 60);
        }, 0) / resolvedOrClosed.length
      : 0;

    const reopenedTickets = tickets.filter((ticket) => ticket.reopenCount > 0).length;
    const reopenedRate = resolvedOrClosed.length
      ? (reopenedTickets / resolvedOrClosed.length) * 100
      : 0;

    const backlogAgeDays = openTickets.length
      ? openTickets.reduce((sum, ticket) => {
          const opened = Date.parse(ticket.openedAt);
          if (!Number.isFinite(opened)) return sum;
          return sum + (nowMs - opened) / (1000 * 60 * 60 * 24);
        }, 0) / openTickets.length
      : 0;

    return {
      total: tickets.length,
      openCount: openTickets.length,
      slaBreached,
      escalations,
      mttrHours,
      reopenedRate,
      backlogAgeDays,
    };
  }, [nowMs, tickets]);

  const createTicketNumber = (type: TicketType): string => {
    const prefix = PREFIX_BY_TYPE[type];
    const maxExisting = tickets
      .filter((ticket) => ticket.number.startsWith(prefix))
      .map((ticket) => Number(ticket.number.replace(/[^0-9]/g, "")))
      .filter((num) => Number.isFinite(num))
      .reduce((max, num) => Math.max(max, num), 1000);

    return `${prefix}${String(maxExisting + 1).padStart(7, "0")}`;
  };

  const validateCreateForm = (entry: NewEntryForm): string | null => {
    const requiredFields = REQUIRED_FIELDS_BY_TYPE[entry.type];

    for (const field of requiredFields) {
      const value = String(entry[field] ?? "").trim();
      if (!value) {
        return `Missing required field for ${entry.type}: ${field}.`;
      }
    }

    return null;
  };

  const onCreateEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateCreateForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const openedAt = nowIso();
    const isApprovalRequired = requiresApproval(form.type);
    const autoAssignment = suggestAssignment(form.type, form.category, form.priority);
    const assignmentGroup = form.autoAssign
      ? autoAssignment.assignmentGroup
      : form.assignmentGroup.trim() || autoAssignment.assignmentGroup;
    const assignee = form.autoAssign
      ? autoAssignment.assignee
      : form.assignee.trim() || autoAssignment.assignee;

    const number = createTicketNumber(form.type);
    const attachments = await uploadAttachments(selectedFiles, number);

    const initialState = isApprovalRequired ? "Awaiting Approval" : form.state;
    const initialApprovalStatus: ApprovalStatus = isApprovalRequired ? "Pending" : "Not Required";

    const newTicket = buildLocalTicketFromPayload(
      {
        id: `local-${crypto.randomUUID()}`,
        number,
        type: form.type,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        requestedFor: form.requestedFor.trim(),
        requesterEmail: form.requesterEmail.trim(),
        assignmentGroup,
        assignee,
        priority: form.priority,
        state: initialState,
        category: form.category.trim(),
        subcategory: form.subcategory.trim(),
        impact: form.impact,
        urgency: form.urgency,
        approvalStatus: initialApprovalStatus,
        approver: isApprovalRequired ? "CAB Team" : "",
        approvalNotes: "",
        openedAt,
        dueBy: form.dueBy || undefined,
        slaBreachAt: computeSlaBreachAt(form.priority, openedAt),
        escalated: false,
        reopenCount: 0,
        attachments,
        workNotes: form.workNotes.trim()
          ? [
              {
                id: `note-${crypto.randomUUID()}`,
                author: operatorName,
                text: form.workNotes.trim(),
                at: nowIso(),
              },
            ]
          : [],
        activities: [
          createActivity(operatorName, "Ticket Created", `${form.type} created via Tickets form.`),
          createActivity(
            operatorName,
            "Auto Assignment",
            `Assigned to ${assignmentGroup}${assignee ? ` / ${assignee}` : ""}.`
          ),
        ],
        createdBy: operatorName,
        source: dataMode === "supabase" ? "supabase" : "local",
      },
      number
    );

    try {
      const persisted = await persistInsert(newTicket);
      setTickets((current) => [persisted, ...current.filter((ticket) => ticket.number !== persisted.number)]);
      setSelectedTicketId(persisted.id);
      setFormError("");
      pushAlert(`Created ${persisted.number}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create ticket.";
      setFormError(message);
      setTickets((current) => [newTicket, ...current]);
      setDataMode("local");
      setDataStatus(`Supabase write failed: ${message}. Working in local mode.`);
    }

    setForm((current) => ({
      ...INITIAL_FORM,
      type: current.type,
      priority: current.priority,
      impact: current.impact,
      urgency: current.urgency,
      autoAssign: current.autoAssign,
      assignmentGroup: current.autoAssign ? "" : current.assignmentGroup,
      assignee: current.autoAssign ? "" : current.assignee,
    }));
    setSelectedFiles([]);
  };

  const canTransition = (ticket: Ticket, nextState: TicketState): string | null => {
    if (ticket.state === nextState) return null;

    const allowed = ALLOWED_STATE_TRANSITIONS[ticket.state] ?? [];
    if (!allowed.includes(nextState)) {
      return `Invalid transition: ${ticket.state} -> ${nextState}.`;
    }

    if (
      requiresApproval(ticket.type) &&
      ticket.approvalStatus === "Pending" &&
      nextState !== "Awaiting Approval" &&
      nextState !== "Closed"
    ) {
      return "This ticket requires approval before moving out of Awaiting Approval.";
    }

    if (
      requiresApproval(ticket.type) &&
      ticket.approvalStatus === "Rejected" &&
      nextState !== "Closed"
    ) {
      return "Rejected approvals can only move to Closed.";
    }

    return null;
  };

  const updateTicket = async (currentTicket: Ticket, candidate: Ticket, action: string, details: string) => {
    const updatedTicket: Ticket = {
      ...candidate,
      updatedAt: nowIso(),
      activities: [createActivity(operatorName, action, details), ...candidate.activities],
      source: currentTicket.source,
      id: currentTicket.id,
      number: currentTicket.number,
    };

    setTickets((current) =>
      current.map((ticket) => (ticket.id === currentTicket.id ? updatedTicket : ticket))
    );

    try {
      const persisted = await persistUpdate(updatedTicket);
      setTickets((current) =>
        current.map((ticket) => (ticket.id === currentTicket.id ? persisted : ticket))
      );
      setSelectedTicketId((current) => (current === currentTicket.id ? persisted.id : current));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to persist ticket update.";
      setDetailError(message);
      setDataMode("local");
      setDataStatus(`Supabase update failed: ${message}. Continuing in local mode.`);
    }
  };

  const onSaveDetail = async () => {
    if (!selectedTicket || !detailDraft) return;

    const transitionError = canTransition(selectedTicket, detailDraft.state);
    if (transitionError) {
      setDetailError(transitionError);
      return;
    }

    const wasClosedLike = selectedTicket.state === "Resolved" || selectedTicket.state === "Closed";
    const reopens =
      wasClosedLike &&
      (detailDraft.state === "In Progress" || detailDraft.state === "Pending" || detailDraft.state === "Awaiting User")
        ? selectedTicket.reopenCount + 1
        : selectedTicket.reopenCount;

    const next: Ticket = {
      ...selectedTicket,
      state: detailDraft.state,
      priority: detailDraft.priority,
      assignmentGroup: detailDraft.assignmentGroup.trim() || selectedTicket.assignmentGroup,
      assignee: detailDraft.assignee.trim(),
      dueBy: detailDraft.dueBy || undefined,
      approvalNotes: detailDraft.approvalNotes,
      slaBreachAt:
        detailDraft.priority !== selectedTicket.priority
          ? computeSlaBreachAt(detailDraft.priority, selectedTicket.openedAt)
          : selectedTicket.slaBreachAt,
      resolvedAt:
        detailDraft.state === "Resolved"
          ? selectedTicket.resolvedAt ?? nowIso()
          : detailDraft.state === "In Progress"
            ? undefined
            : selectedTicket.resolvedAt,
      closedAt: detailDraft.state === "Closed" ? selectedTicket.closedAt ?? nowIso() : undefined,
      reopenCount: reopens,
      escalated:
        selectedTicket.escalated ||
        getSlaInfo(selectedTicket, nowMs).breached ||
        (getSlaInfo(selectedTicket, nowMs).atRisk &&
          (selectedTicket.priority === "Critical" || selectedTicket.priority === "High")),
    };

    await updateTicket(
      selectedTicket,
      next,
      "Ticket Updated",
      `State ${selectedTicket.state} -> ${next.state}; Priority ${selectedTicket.priority} -> ${next.priority}.`
    );

    setDetailError("");
  };

  const onAddNote = async () => {
    if (!selectedTicket || !newNote.trim()) return;

    const note: TicketNote = {
      id: `note-${crypto.randomUUID()}`,
      author: operatorName,
      text: newNote.trim(),
      at: nowIso(),
    };

    const next: Ticket = {
      ...selectedTicket,
      workNotes: [note, ...selectedTicket.workNotes],
    };

    await updateTicket(selectedTicket, next, "Work Note Added", note.text);
    setNewNote("");
  };

  const onApprove = async () => {
    if (!selectedTicket) return;

    if (!requiresApproval(selectedTicket.type)) {
      setDetailError("Approval is not required for this ticket type.");
      return;
    }

    const nextState = selectedTicket.state === "Awaiting Approval" ? "New" : selectedTicket.state;

    const next: Ticket = {
      ...selectedTicket,
      approvalStatus: "Approved",
      state: nextState,
      approver: operatorName,
      approvalNotes:
        detailDraft?.approvalNotes.trim() ||
        selectedTicket.approvalNotes ||
        `Approved by ${operatorName}`,
    };

    await updateTicket(
      selectedTicket,
      next,
      "Approval",
      `Ticket approved by ${operatorName}.`
    );

    setDetailDraft((current) =>
      current
        ? {
            ...current,
            state: nextState,
            approvalNotes: next.approvalNotes,
          }
        : current
    );
    setDetailError("");
  };

  const onReject = async () => {
    if (!selectedTicket) return;

    if (!requiresApproval(selectedTicket.type)) {
      setDetailError("Approval is not required for this ticket type.");
      return;
    }

    const next: Ticket = {
      ...selectedTicket,
      approvalStatus: "Rejected",
      state: "Closed",
      approver: operatorName,
      approvalNotes:
        detailDraft?.approvalNotes.trim() ||
        selectedTicket.approvalNotes ||
        `Rejected by ${operatorName}`,
      closedAt: nowIso(),
    };

    await updateTicket(
      selectedTicket,
      next,
      "Approval",
      `Ticket rejected and closed by ${operatorName}.`
    );

    setDetailDraft((current) =>
      current
        ? {
            ...current,
            state: "Closed",
            approvalNotes: next.approvalNotes,
          }
        : current
    );
    setDetailError("");
  };

  return (
    <div className="mt-8 grid gap-5">
      <section className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Platform Mode
            </p>
            <p className="mt-1 text-sm font-medium">
              {dataMode === "supabase" ? "Supabase Connected" : "Local Mode"}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{dataStatus}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={operatorName}
              onChange={(event) => setOperatorName(event.target.value)}
              placeholder="Operator name"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
            />
            <input
              value={operatorGroup}
              onChange={(event) => setOperatorGroup(event.target.value)}
              placeholder="Operator group"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
            />
            <button
              type="button"
              onClick={requestNotificationPermission}
              disabled={notificationPermission === "granted" || notificationPermission === "unsupported"}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
            >
              {notificationPermission === "granted"
                ? "Desktop Alerts On"
                : notificationPermission === "unsupported"
                  ? "Notifications Unsupported"
                  : "Enable Desktop Alerts"}
            </button>
          </div>
        </div>

        {alerts.length ? (
          <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-500/20 dark:bg-sky-500/10">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">
              Alert Feed
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              {alerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Open</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.openCount}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Total</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.total}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Escalations</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.escalations}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">SLA Breached</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.slaBreached}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">MTTR (hrs)</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.mttrHours.toFixed(1)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Reopened %</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.reopenedRate.toFixed(1)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Backlog Age (d)</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.backlogAgeDays.toFixed(1)}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="xl:col-span-7 rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap gap-2">
            {SAVED_VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  activeView === view.id
                    ? "bg-sky-600 text-white dark:bg-sky-500"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700/70 dark:text-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30 sm:w-[280px]"
              placeholder="Search number, summary, user, group, category"
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as "All" | TicketType)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
            >
              <option value="All">All types</option>
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value as "All" | TicketState)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
            >
              <option value="All">All states</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
            >
              <option value="All">All groups</option>
              {assignmentGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
            <table className="w-full min-w-[1280px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2">Number</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Short Description</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">State</th>
                  <th className="px-3 py-2">Approval</th>
                  <th className="px-3 py-2">SLA</th>
                  <th className="px-3 py-2">Attachments</th>
                  <th className="px-3 py-2">Assignment Group</th>
                  <th className="px-3 py-2">Assignee</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length ? (
                  filteredTickets.map((ticket) => {
                    const sla = getSlaInfo(ticket, nowMs);
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`cursor-pointer border-t border-black/10 bg-white/70 transition hover:bg-sky-50 dark:border-white/10 dark:bg-black/20 dark:hover:bg-sky-500/10 ${
                          selectedTicketId === ticket.id ? "bg-sky-100 dark:bg-sky-500/20" : ""
                        }`}
                      >
                        <td className="px-3 py-2 font-medium text-sky-700 dark:text-sky-300">{ticket.number}</td>
                        <td className="px-3 py-2">{ticket.type}</td>
                        <td className="px-3 py-2">{ticket.shortDescription}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStateClass(ticket.state)}`}>
                            {ticket.state}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-full bg-slate-200 px-2 py-1 text-xs dark:bg-slate-700/70">
                            {ticket.approvalStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              sla.status === "Breached"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                                : sla.status === "At Risk"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            }`}
                          >
                            {sla.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">{ticket.attachments.length}</td>
                        <td className="px-3 py-2">{ticket.assignmentGroup}</td>
                        <td className="px-3 py-2">{ticket.assignee || "Unassigned"}</td>
                        <td className="px-3 py-2">{formatDateTime(ticket.updatedAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
                      No tickets matched the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-5 xl:col-span-5">
          <form
            onSubmit={onCreateEntry}
            className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold">New Entry</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              ITIL create form with assignment logic, approvals, SLA targets, and attachments.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.type}
                  onChange={(event) => {
                    const type = event.target.value as TicketType;
                    const defaults = suggestAssignment(type, form.category, form.priority);
                    setForm((current) => ({
                      ...current,
                      type,
                      state: withDefaultState(type),
                      assignmentGroup: current.autoAssign ? defaults.assignmentGroup : current.assignmentGroup,
                      assignee: current.autoAssign ? defaults.assignee : current.assignee,
                    }));
                  }}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                >
                  {TICKET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  value={form.priority}
                  onChange={(event) => {
                    const priority = event.target.value as TicketPriority;
                    const defaults = suggestAssignment(form.type, form.category, priority);
                    setForm((current) => ({
                      ...current,
                      priority,
                      assignmentGroup: current.autoAssign ? defaults.assignmentGroup : current.assignmentGroup,
                      assignee: current.autoAssign ? defaults.assignee : current.assignee,
                    }));
                  }}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shortDescription: event.target.value }))
                }
                placeholder="Short description"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
              />

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={2}
                placeholder="Detailed description"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.requestedFor}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, requestedFor: event.target.value }))
                  }
                  placeholder="Requested for"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                />
                <input
                  value={form.requesterEmail}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, requesterEmail: event.target.value }))
                  }
                  placeholder="Requester email"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.category}
                  onChange={(event) => {
                    const category = event.target.value;
                    const defaults = suggestAssignment(form.type, category, form.priority);
                    setForm((current) => ({
                      ...current,
                      category,
                      assignmentGroup: current.autoAssign ? defaults.assignmentGroup : current.assignmentGroup,
                      assignee: current.autoAssign ? defaults.assignee : current.assignee,
                    }));
                  }}
                  placeholder="Category"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                />
                <input
                  value={form.subcategory}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, subcategory: event.target.value }))
                  }
                  placeholder="Subcategory"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.impact}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      impact: event.target.value as "High" | "Medium" | "Low",
                    }))
                  }
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                >
                  <option value="High">Impact: High</option>
                  <option value="Medium">Impact: Medium</option>
                  <option value="Low">Impact: Low</option>
                </select>

                <select
                  value={form.urgency}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      urgency: event.target.value as "High" | "Medium" | "Low",
                    }))
                  }
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                >
                  <option value="High">Urgency: High</option>
                  <option value="Medium">Urgency: Medium</option>
                  <option value="Low">Urgency: Low</option>
                </select>
              </div>

              <input
                type="date"
                value={form.dueBy}
                onChange={(event) => setForm((current) => ({ ...current, dueBy: event.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
              />

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.autoAssign}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    const defaults = suggestAssignment(form.type, form.category, form.priority);
                    setForm((current) => ({
                      ...current,
                      autoAssign: checked,
                      assignmentGroup: checked ? defaults.assignmentGroup : current.assignmentGroup,
                      assignee: checked ? defaults.assignee : current.assignee,
                    }));
                  }}
                  className="h-4 w-4"
                />
                Use auto-assignment logic
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.assignmentGroup}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, assignmentGroup: event.target.value }))
                  }
                  disabled={form.autoAssign}
                  placeholder="Assignment group"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring disabled:opacity-60 dark:border-white/10 dark:bg-black/30"
                />
                <input
                  value={form.assignee}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, assignee: event.target.value }))
                  }
                  disabled={form.autoAssign}
                  placeholder="Assignee"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring disabled:opacity-60 dark:border-white/10 dark:bg-black/30"
                />
              </div>

              <textarea
                value={form.workNotes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, workNotes: event.target.value }))
                }
                rows={2}
                placeholder="Initial work note"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
              />

              <div className="rounded-xl border border-dashed border-black/20 bg-white p-3 dark:border-white/20 dark:bg-black/20">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Attachments
                </p>
                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_ATTACHMENT_TYPES.join(",")}
                  onChange={(event) => {
                    const files = event.target.files ? Array.from(event.target.files) : [];
                    setSelectedFiles(files);
                  }}
                  className="mt-2 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-sky-700 dark:file:bg-sky-500 dark:hover:file:bg-sky-400"
                />
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Supports photos, videos, PDFs, Office docs, TXT, and CSV.
                </p>
                {selectedFiles.length ? (
                  <ul className="mt-2 space-y-1">
                    {selectedFiles.map((file) => (
                      <li
                        key={`${file.name}-${file.size}`}
                        className="text-xs text-slate-700 dark:text-slate-300"
                      >
                        {resolveAttachmentKind(file)} - {file.name} ({formatBytes(file.size)})
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {formError ? (
              <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              Create Entry
            </button>
          </form>

          <div className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold">Entry Types You Can Add</h2>
            <ul className="mt-3 space-y-3">
              {ENTRY_CATALOG.map((entry) => (
                <li key={entry.type} className="rounded-xl bg-slate-100/80 p-3 dark:bg-black/25">
                  <p className="text-sm font-semibold">{entry.type}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{entry.examples}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {selectedTicket && detailDraft ? (
        <section className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Ticket Detail
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{selectedTicket.number}</h2>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {selectedTicket.shortDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTicketId(null)}
              className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Close Detail
            </button>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className="space-y-3 xl:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    State
                  </label>
                  <select
                    value={detailDraft.state}
                    onChange={(event) =>
                      setDetailDraft((current) =>
                        current
                          ? {
                              ...current,
                              state: event.target.value as TicketState,
                            }
                          : current
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                  >
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Priority
                  </label>
                  <select
                    value={detailDraft.priority}
                    onChange={(event) =>
                      setDetailDraft((current) =>
                        current
                          ? {
                              ...current,
                              priority: event.target.value as TicketPriority,
                            }
                          : current
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Assignment Group
                  </label>
                  <input
                    value={detailDraft.assignmentGroup}
                    onChange={(event) =>
                      setDetailDraft((current) =>
                        current ? { ...current, assignmentGroup: event.target.value } : current
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Assignee
                  </label>
                  <input
                    value={detailDraft.assignee}
                    onChange={(event) =>
                      setDetailDraft((current) =>
                        current ? { ...current, assignee: event.target.value } : current
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Due By
                  </label>
                  <input
                    type="date"
                    value={detailDraft.dueBy}
                    onChange={(event) =>
                      setDetailDraft((current) =>
                        current ? { ...current, dueBy: event.target.value } : current
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Approval
                  </label>
                  <p className="mt-2 text-sm">{selectedTicket.approvalStatus}</p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Approval Notes
                </label>
                <textarea
                  value={detailDraft.approvalNotes}
                  onChange={(event) =>
                    setDetailDraft((current) =>
                      current ? { ...current, approvalNotes: event.target.value } : current
                    )
                  }
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onSaveDetail}
                  className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
                >
                  Save Updates
                </button>

                {requiresApproval(selectedTicket.type) && selectedTicket.approvalStatus === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={onApprove}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={onReject}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
              </div>

              {detailError ? (
                <p className="rounded-lg bg-rose-100 px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                  {detailError}
                </p>
              ) : null}

              <div className="rounded-xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Work Notes
                </p>
                <div className="mt-2 flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(event) => setNewNote(event.target.value)}
                    rows={2}
                    placeholder="Add work note"
                    className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-sky-400 focus:ring dark:border-white/10 dark:bg-black/30"
                  />
                  <button
                    type="button"
                    onClick={onAddNote}
                    className="h-fit rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-black dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                  >
                    Add Note
                  </button>
                </div>

                <ul className="mt-3 space-y-2">
                  {selectedTicket.workNotes.length ? (
                    selectedTicket.workNotes.map((note) => (
                      <li key={note.id} className="rounded-lg bg-slate-100 p-2 text-xs dark:bg-slate-700/60">
                        <p className="font-semibold">{note.author}</p>
                        <p className="mt-0.5">{note.text}</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
                          {formatDateTime(note.at)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 dark:text-slate-400">No notes yet.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Attachments
                </p>
                <ul className="mt-2 space-y-2">
                  {selectedTicket.attachments.length ? (
                    selectedTicket.attachments.map((attachment) => (
                      <li key={`${selectedTicket.id}-${attachment.name}`}>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-lg bg-slate-100 p-2 text-xs transition hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-600"
                        >
                          <p className="font-semibold">
                            {attachment.kind}: {attachment.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-300">
                            {attachment.sizeLabel} - {attachment.mimeType}
                          </p>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 dark:text-slate-400">No attachments.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Activity Timeline (Audit)
                </p>
                <ul className="mt-2 space-y-2">
                  {selectedTicket.activities.length ? (
                    selectedTicket.activities.map((activity) => (
                      <li key={activity.id} className="rounded-lg bg-slate-100 p-2 text-xs dark:bg-slate-700/60">
                        <p className="font-semibold">{activity.action}</p>
                        <p className="mt-0.5">{activity.details}</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
                          {activity.actor} - {formatDateTime(activity.at)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 dark:text-slate-400">No activity yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
