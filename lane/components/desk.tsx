"use client";

import { columnsFor, resolveScreen } from "@/lib/catalog";
import { isModule, type Field, type ModuleKey, type ScreenDef } from "@/lib/model";
import { useLane, type Entity } from "@/lib/store";
import { Badge, Button, Empty, FieldLabel, TextArea, TextInput } from "@/components/ui";
import {
  AccessView,
  AuditView,
  ComposeView,
  CustomReport,
  Dashboard,
  DriverView,
  GuideView,
  ImportView,
  InboxView,
  Kpis,
  ModuleHome,
  PodView,
  ProfileView,
  RateShop,
  RecycleView,
  RulesView,
  StationView,
  SystemView,
  Tower,
  TrackingBoard
} from "@/components/views";
import { useEffect, useMemo, useState } from "react";

const PAGE = 8;

export function ScreenRouter({ moduleKey, slug }: { moduleKey: string; slug?: string }) {
  const lane = useLane();
  useEffect(() => {
    const screen = slug ? resolveScreen(moduleKey, slug) : null;
    document.title = `${screen?.label || moduleKey} · Lane`;
  }, [moduleKey, slug]);

  if (!isModule(moduleKey)) return <Empty title="Unknown app" body="That module is not part of Lane." />;
  if (!slug) {
    if (moduleKey === "dashboard") return <Dashboard />;
    return <ModuleHome moduleKey={moduleKey} />;
  }
  const screen = resolveScreen(moduleKey, slug);
  if (!screen) return <Empty title="This menu is not on the desk" body="The address does not match a Lane screen." />;
  const rights = lane.rightsFor(`${moduleKey}/${slug === "overview" ? "overview" : slug}`);
  const utility = ["guide", "compose", "automations", "overview"].includes(slug);
  if (!rights.view && !utility) return <Empty title="This menu is hidden for your role" body="An administrator can grant it from Access control." />;
  if (slug === "overview" && moduleKey === "dashboard") return <Dashboard />;
  if (slug === "overview") return <ModuleHome moduleKey={moduleKey as ModuleKey} />;
  if (screen.kind === "guide") return <GuideView moduleKey={moduleKey} />;
  if (screen.kind === "compose") return <ComposeView moduleKey={moduleKey} />;
  if (screen.kind === "rules") return <RulesView moduleKey={moduleKey} />;
  if (screen.kind === "access") return <AccessView />;
  if (screen.kind === "kpis") return <Kpis />;
  if (screen.kind === "rateshop") return <RateShop />;
  if (screen.kind === "tower") return <Tower />;
  if (screen.kind === "pod") return <PodView />;
  if (screen.kind === "driver") return <DriverView />;
  if (screen.kind === "import") return <ImportView />;
  if (screen.kind === "recycle") return <RecycleView />;
  if (screen.kind === "audit") return <AuditView />;
  if (screen.kind === "inbox") return <InboxView />;
  if (screen.kind === "system") return <SystemView />;
  if (screen.kind === "profile") return <ProfileView />;
  if (screen.kind === "custom-report") return <CustomReport />;
  if (screen.kind === "station") return <StationView />;
  if (screen.kind === "dashboard") return <Dashboard />;
  if (slug === "tracking") return <TrackingBoard />;
  return <RecordDesk screen={screen} />;
}

function RecordDesk({ screen }: { screen: ScreenDef }) {
  const lane = useLane();
  const key = `${screen.module}/${screen.slug}`;
  const rights = lane.rightsFor(key);
  const extras = lane.extraFields(key);
  const fields = useMemo(() => {
    const base = (screen.fields ?? []).map((field) => {
      if (field.key !== "role") return field;
      const roles = lane.list("settings/roles").map((row) => row.values.key).filter(Boolean);
      return { ...field, options: roles.length ? roles : field.options };
    });
    const known = new Set(base.map((field) => field.key));
    return [...base, ...extras.filter((field) => field.key && !known.has(field.key))];
  }, [screen.fields, extras, lane]);
  const columns = columnsFor({ ...screen, fields });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState(columns[0]?.key || "");
  const [dir, setDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Entity | "new" | null>(null);
  const rows = lane.list(key);
  const statusField = fields.find((field) => field.key === "status" || field.key === "stage");
  const filtered = rows.filter((row) => {
    const blob = Object.values(row.values).join(" ").toLowerCase();
    const matchesQuery = blob.includes(q.trim().toLowerCase());
    const matchesFilter = filter === "All" || !statusField || row.values[statusField.key] === filter;
    return matchesQuery && matchesFilter;
  }).sort((a, b) => String(a.values[sort] || "").localeCompare(String(b.values[sort] || "")) * dir);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const visible = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const options = statusField ? ["All", ...(statusField.options ?? [])] : [];

  function exportCsv() {
    const header = columns.map((column) => column.label);
    const body = filtered.map((row) => columns.map((column) => `"${String(row.values[column.key] || "").replaceAll('"', '""')}"`).join(","));
    const blob = new Blob([[header.join(","), ...body].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${screen.slug}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">{screen.group}</p>
          <h1 className="font-serif text-4xl">{screen.label}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{screen.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {rights.export && <Button variant="ghost" onClick={exportCsv}>Export</Button>}
          {rights.create && <Button onClick={() => setEditing("new")}>New</Button>}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <TextInput aria-label={`Search ${screen.label}`} placeholder="Search" value={q} onChange={(event) => { setQ(event.target.value); setPage(0); }} />
        {statusField && (
          <select aria-label="Filter" className="h-11 rounded-xl border border-line bg-white px-3" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(0); }}>
            {options.map((option) => <option key={option}>{option}</option>)}
          </select>
        )}
      </div>
      {visible.length === 0 ? (
        <div className="mt-4"><Empty title={rows.length === 0 ? "Nothing here yet" : "No rows match"} body={rows.length === 0 ? "Create the first record, or switch company." : "Try another search or filter."} /></div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-3xl border border-line bg-white md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  {columns.map((column) => (
                    <th key={column.key} className="px-3 py-3">
                      <button type="button" onClick={() => { setSort(column.key); setDir(sort === column.key && dir === 1 ? -1 : 1); }}>{column.label}</button>
                    </th>
                  ))}
                  <th className="px-3 py-3"> </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-3">{column.key === "status" || column.key === "stage" ? <Badge value={row.values[column.key] || ""} /> : row.values[column.key]}</td>
                    ))}
                    <td className="px-3 py-3 text-right"><button type="button" className="font-semibold text-sea" onClick={() => setEditing(row)}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-3 md:hidden">
            {visible.map((row) => (
              <li key={row.id}>
                <button type="button" onClick={() => setEditing(row)} className="w-full rounded-3xl border border-line bg-white p-4 text-left">
                  <span className="font-semibold">{row.values[columns[0]?.key || ""] || "Record"}</span>
                  {columns.slice(1, 4).map((column) => (
                    <span key={column.key} className="mt-1 block text-sm text-muted">{column.label}: {row.values[column.key]}</span>
                  ))}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted">{filtered.length} records</span>
        <span className="flex gap-2">
          <Button variant="ghost" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>Previous</Button>
          <Button variant="ghost" disabled={page + 1 >= pages} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </span>
      </div>
      {editing && (
        <Editor
          screen={screen}
          fields={fields}
          row={editing === "new" ? null : editing}
          rights={rights}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function Editor({
  screen,
  fields,
  row,
  rights,
  onClose
}: {
  screen: ScreenDef;
  fields: Field[];
  row: Entity | null;
  rights: ReturnType<ReturnType<typeof useLane>["rightsFor"]>;
  onClose: () => void;
}) {
  const lane = useLane();
  const [values, setValues] = useState<Record<string, string>>(row?.values ?? {});
  const [notes, setNotes] = useState(row?.notes ?? "");
  const [attachment, setAttachment] = useState(row?.attachment ?? "");
  const [error, setError] = useState("");
  const locked = new Set(screen.locked ?? []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function save() {
    const missing = fields.filter((field) => field.required && !String(values[field.key] || "").trim() && !(locked.has(field.key) && row));
    if (missing.length) {
      setError(`${missing.map((field) => field.label).join(", ")} required.`);
      return;
    }
    if (row) {
      if (!rights.update) return;
      lane.update(row.id, values, notes, attachment);
    } else {
      if (!rights.create) return;
      lane.create(`${screen.module}/${screen.slug}`, values, notes, attachment);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" role="presentation" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={screen.label} className="h-full w-full overflow-y-auto bg-paper p-5 shadow-2xl sm:max-w-lg" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-3xl">{row ? "Edit" : "New"} {screen.label}</h2>
          <button type="button" className="text-sm font-semibold" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          {fields.map((field) => (
            <label key={field.key}>
              <FieldLabel>{field.label}{field.required ? " *" : ""}</FieldLabel>
              {field.kind === "textarea" ? (
                <TextArea value={values[field.key] || ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
              ) : field.kind === "select" ? (
                <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={values[field.key] || ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}>
                  <option value="">Select</option>
                  {(field.options ?? []).map((option) => <option key={option} value={option}>{field.key === "role" ? option.replaceAll("_", " ") : option}</option>)}
                </select>
              ) : (
                <TextInput type={field.kind === "date" ? "date" : field.kind === "number" || field.kind === "money" ? "number" : "text"} disabled={Boolean(row && locked.has(field.key))} value={values[field.key] || ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
              )}
            </label>
          ))}
          <label><FieldLabel>Notes</FieldLabel><TextArea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
          <label><FieldLabel>Attachment</FieldLabel><input type="file" onChange={(event) => setAttachment(event.target.files?.[0]?.name || attachment)} /><span className="mt-1 block text-xs text-muted">{attachment || "No file name stored"}</span></label>
        </div>
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {(row ? rights.update : rights.create) && <Button onClick={save}>Save</Button>}
          {row && rights.approve && row.values.status && <Button variant="ghost" onClick={() => { lane.approve(row.id); onClose(); }}>Approve</Button>}
          {screen.module === "documents" && <Button variant="ghost" onClick={() => window.print()}>Print</Button>}
          {screen.slug === "integrations" && row && <Button variant="ghost" onClick={() => { lane.testIntegration(row.id); onClose(); }}>Test</Button>}
          {row && rights.delete && <Button variant="danger" onClick={() => { lane.trash(row.id); onClose(); }}>Move to bin</Button>}
        </div>
        {screen.module === "documents" && (
          <article className="mt-6 hidden border border-line bg-white p-4 print:block">
            <h1 className="font-serif text-2xl">{values.name || values.waybill || screen.label}</h1>
            {Object.entries(values).map(([key, value]) => <p key={key}>{key}: {value}</p>)}
          </article>
        )}
      </div>
    </div>
  );
}
