import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const EMPRESAS = ["Parana Logistica", "Clean Sea", "Terra Mare"];
const USUARIO = "Gerencia";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#213363;--blue:#235C96;--mid:#6381A7;--light:#A5B5CC;
  --bg:#F0F4F8;--surface:#FFF;--surface2:#F5F7FA;--border:#D6E0ED;--border2:#B0C4D8;
  --text:#213363;--muted:#6381A7;--muted2:#8FA3BC;--accent:#235C96;--accent2:#1E7E4A;
  --warn:#B07D0A;--danger:#C0392B;--teal:#1A7A6E;
  --sans:'Montserrat',sans-serif;--mono:'DM Mono',monospace;--r:6px;--r2:10px;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.5;min-height:100vh}
.app{display:flex;min-height:100vh}
.sidebar{width:235px;min-width:235px;background:var(--navy);display:flex;flex-direction:column;box-shadow:2px 0 8px rgba(33,51,99,.15)}
.sidebar-header{border-bottom:1px solid rgba(255,255,255,.1)}
.sidebar-logo-wrap{padding:20px 18px 16px;display:flex;align-items:center;gap:12px}
.sidebar-logo{width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
.sidebar-logo-main{font-size:13px;font-weight:700;color:#fff;letter-spacing:2px;text-transform:uppercase}
.sidebar-logo-sub{font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.5px}
.nav-section{padding:12px 18px 4px;font-family:var(--mono);font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.35);text-transform:uppercase}
.ni{display:flex;align-items:center;gap:9px;padding:7px 18px;font-size:12px;font-weight:500;cursor:pointer;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .12s;user-select:none}
.ni:hover{color:#fff;background:rgba(255,255,255,.06)}
.ni.active{color:#fff;border-left-color:var(--light);background:rgba(255,255,255,.1);font-weight:600}
.ni-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:13px 28px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(33,51,99,.06)}
.topbar-title{font-size:12px;font-weight:600;letter-spacing:1px;color:var(--navy);text-transform:uppercase}
.content{flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(33,51,99,.06)}
.card-title{font-size:10px;font-weight:600;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.badge{display:inline-flex;align-items:center;font-family:var(--mono);font-size:9px;font-weight:600;padding:3px 8px;border-radius:4px;white-space:nowrap;letter-spacing:.3px}
.b-blue{background:#DBEAFE;color:#1E40AF;border:1px solid #BFDBFE}
.b-green{background:#D1FAE5;color:#065F46;border:1px solid #A7F3D0}
.b-red{background:#FEE2E2;color:#991B1B;border:1px solid #FECACA}
.b-amber{background:#FEF3C7;color:#92400E;border:1px solid #FDE68A}
.b-gray{background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB}
.b-purple{background:#EDE9FE;color:#4C1D95;border:1px solid #DDD6FE}
.b-teal{background:#D1FAE5;color:#065F46;border:1px solid #A7F3D0}
.btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--sans);font-size:11px;font-weight:600;letter-spacing:.3px;padding:7px 14px;border-radius:var(--r);border:1px solid transparent;cursor:pointer;transition:all .15s;white-space:nowrap;text-transform:uppercase}
.btn-primary{background:var(--blue);color:#fff}.btn-primary:hover{background:var(--navy)}
.btn-ghost{background:transparent;color:var(--muted);border-color:var(--border)}.btn-ghost:hover{color:var(--text);background:var(--surface2)}
.btn-sm{padding:4px 10px;font-size:10px}
.btn:disabled{opacity:.4;cursor:not-allowed}
.overlay{position:fixed;inset:0;background:rgba(33,51,99,.5);display:flex;align-items:flex-start;justify-content:center;z-index:100;padding:20px;overflow-y:auto;animation:fadeIn .15s}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:760px;margin:auto;animation:slideUp .2s;box-shadow:0 8px 32px rgba(33,51,99,.18)}
.mhdr{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 22px;border-bottom:1px solid var(--border);background:var(--surface2);border-radius:12px 12px 0 0}
.mtitle{font-size:13px;font-weight:700;letter-spacing:.5px;color:var(--navy)}
.mbody{padding:22px}
.mftr{padding:14px 22px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;background:var(--surface2);border-radius:0 0 12px 12px}
.mclose{background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer}
.mclose:hover{color:var(--navy)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.fg{display:flex;flex-direction:column;gap:5px}
.fg label{font-size:10px;color:var(--navy);letter-spacing:.5px;text-transform:uppercase;font-weight:600}
.fg input,.fg select,.fg textarea{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--sans);font-size:13px;padding:8px 10px;outline:none;transition:border-color .15s}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--blue)}
.fg textarea{resize:vertical;min-height:65px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.form-section{font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--blue);text-transform:uppercase;margin:18px 0 12px;padding-bottom:6px;border-bottom:2px solid var(--light)}
.tabs-row{display:flex;border-bottom:2px solid var(--border);margin-bottom:18px;overflow-x:auto}
.tab{font-size:11px;font-weight:600;padding:9px 16px;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;transition:all .12s;text-transform:uppercase;letter-spacing:.5px;margin-bottom:-2px;white-space:nowrap}
.tab.active{color:var(--blue);border-bottom-color:var(--blue)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:16px 18px}
.stat-label{font-size:10px;color:var(--muted);font-weight:600;letter-spacing:.5px;margin-bottom:6px;text-transform:uppercase}
.stat-value{font-family:var(--mono);font-size:28px;font-weight:600}
.filter-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
.filter-select{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--sans);font-size:11px;padding:6px 10px;outline:none;cursor:pointer}
.req-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:16px 18px;margin-bottom:10px;cursor:pointer;transition:all .15s}
.req-row:hover{border-color:var(--blue);box-shadow:0 2px 8px rgba(35,92,150,.12)}
.req-row.active-border{border-left:4px solid var(--danger)}
.req-title{font-weight:600;font-size:14px;margin-bottom:6px;color:var(--navy)}
.req-meta{display:flex;gap:14px;font-size:11px;color:var(--muted);flex-wrap:wrap;align-items:center}
.info-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;font-size:13px}
.info-box.accent{border-left:3px solid var(--blue)}
.info-box.danger{border-left:3px solid var(--danger);background:#FEF2F2}
.flex-gap{display:flex;gap:8px;align-items:center}
.flex-between{display:flex;justify-content:space-between;align-items:center}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}
.mb8{margin-bottom:8px}.mb12{margin-bottom:12px}
.text-mono{font-family:var(--mono)}.text-muted{color:var(--muted)}
.empty-state{text-align:center;padding:48px 20px;color:var(--muted);font-size:13px}
.loading{display:flex;align-items:center;justify-content:center;padding:48px;color:var(--muted);gap:10px;font-size:13px}
.spin{animation:spin 1s linear infinite}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.notif{position:fixed;bottom:20px;right:20px;background:var(--surface);border:1px solid var(--border);border-left-width:3px;border-radius:var(--r2);padding:12px 16px;font-size:13px;animation:slideUp .2s;z-index:300;max-width:340px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 16px rgba(33,51,99,.15)}
.n-green{border-left-color:var(--accent2)}.n-red{border-left-color:var(--danger)}.n-amber{border-left-color:var(--warn)}.n-blue{border-left-color:var(--blue)}
.pct-bar{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;border:1px solid var(--border)}
.pct-fill{height:100%;border-radius:3px;background:var(--blue);transition:width .3s}
.pct-fill.critical{background:var(--danger)}
.pct-fill.done{background:var(--accent2)}
.recurso-tag{display:inline-flex;align-items:center;gap:5px;background:#DBEAFE;color:#1E40AF;border:1px solid #BFDBFE;border-radius:4px;padding:3px 8px;font-size:10px;font-family:var(--mono)}
.recurso-tag button{background:none;border:none;cursor:pointer;color:#1E40AF;font-size:11px;padding:0;line-height:1;opacity:.6}
.recurso-tag button:hover{opacity:1}
.gantt-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);overflow:hidden}
.gantt-header{display:grid;border-bottom:1px solid var(--border);background:var(--surface2)}
.gantt-row{display:grid;border-bottom:1px solid var(--border)}
.gantt-row:last-child{border-bottom:none}
.gantt-row:hover{background:var(--surface2)}
.gh-cell{padding:7px 10px;font-size:9px;font-weight:600;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;border-right:1px solid var(--border);text-align:center}
.gh-cell:last-child{border-right:none}
.gc-label{padding:8px 12px;border-right:1px solid var(--border);display:flex;flex-direction:column;justify-content:center;min-height:44px}
.gc-name{font-size:11px;font-weight:600;color:var(--navy)}
.gc-sub{font-size:9px;color:var(--muted);margin-top:2px}
.gc-bars{position:relative;display:flex;align-items:center;min-height:44px}
.bar{position:absolute;height:18px;border-radius:3px;display:flex;align-items:center;padding:0 6px;font-size:9px;color:#fff;white-space:nowrap;overflow:hidden;font-weight:600}
.bar.normal{background:var(--blue)}
.bar.critical{background:var(--danger)}
.bar.done{background:var(--accent2)}
.bar.late{background:var(--warn)}
.cc-badge{display:inline-block;font-size:7px;background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;border-radius:3px;padding:1px 4px;margin-left:4px;font-family:var(--mono);font-weight:700}
.tarea-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:14px 16px;margin-bottom:8px;cursor:pointer;transition:all .15s}
.tarea-row:hover{border-color:var(--blue)}
.tarea-row.critica{border-left:3px solid var(--danger)}
.tarea-row.atrasada{border-left:3px solid var(--warn)}
`;

const STATUS_PROYECTO = {
  planificado: { label: "Planificado", color: "b-gray" },
  en_curso: { label: "En curso", color: "b-blue" },
  completado: { label: "Completado", color: "b-green" },
  cancelado: { label: "Cancelado", color: "b-red" },
};

const STATUS_TAREA = {
  pendiente: { label: "Pendiente", color: "b-gray" },
  en_curso: { label: "En curso", color: "b-blue" },
  completada: { label: "Completada", color: "b-green" },
  atrasada: { label: "Atrasada", color: "b-amber" },
  bloqueada: { label: "Bloqueada", color: "b-red" },
};

const fmtDate = d => d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR") : "—";
const diffDays = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);
const today = () => new Date().toISOString().split("T")[0];

const api = {
  async getProyectos(filtros = {}) {
    let q = supabase.from("proyectos").select("*, proyecto_recursos(*), proyecto_tareas(*)").order("created_at", { ascending: false });
    if (filtros.empresa) q = q.eq("empresa", filtros.empresa);
    if (filtros.status) q = q.eq("status", filtros.status);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async crearProyecto(proy, recursos) {
    const { data, error } = await supabase.from("proyectos").insert([proy]).select().single();
    if (error) throw error;
    if (recursos?.length) {
      await supabase.from("proyecto_recursos").insert(recursos.map(r => ({ ...r, proyecto_id: data.id })));
    }
    return data;
  },
  async actualizarProyecto(id, cambios) {
    const { data, error } = await supabase.from("proyectos").update({ ...cambios, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async crearTarea(tarea) {
    const { data, error } = await supabase.from("proyecto_tareas").insert([tarea]).select().single();
    if (error) throw error;
    return data;
  },
  async actualizarTarea(id, cambios) {
    const { data, error } = await supabase.from("proyecto_tareas").update(cambios).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async eliminarTarea(id) {
    const { error } = await supabase.from("proyecto_tareas").delete().eq("id", id);
    if (error) throw error;
  },
};

function calcularCaminoCritico(tareas) {
  if (!tareas?.length) return new Set();
  const duracion = t => t.fecha_inicio && t.fecha_fin ? Math.max(diffDays(t.fecha_inicio, t.fecha_fin), 1) : (t.duracion_dias || 1);
  const earlyFinish = {};
  const sorted = [...tareas].sort((a, b) => (a.fecha_inicio || "") < (b.fecha_inicio || "") ? -1 : 1);
  sorted.forEach(t => {
    const deps = (t.dependencias || []).map(d => earlyFinish[d] || 0);
    earlyFinish[t.id] = (deps.length ? Math.max(...deps) : 0) + duracion(t);
  });
  const maxFinish = Math.max(...Object.values(earlyFinish));
  const lateFinish = {};
  const criticas = new Set();
  [...sorted].reverse().forEach(t => {
    const sucs = tareas.filter(s => (s.dependencias || []).includes(t.id));
    lateFinish[t.id] = sucs.length ? Math.min(...sucs.map(s => lateFinish[s.id] - duracion(s))) : maxFinish;
    if (Math.abs(lateFinish[t.id] - earlyFinish[t.id]) < 0.01) criticas.add(t.id);
  });
  return criticas;
}

function Notif({ msg, onClose }) {
  if (!msg) return null;
  const cls = { success: "n-green", error: "n-red", warn: "n-amber", info: "n-blue" }[msg.type] || "n-blue";
  return <div className={`notif ${cls}`}><span>{msg.text}</span><button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>✕</button></div>;
}

function FG({ label, hint, children, full }) {
  return <div className="fg" style={full ? { gridColumn: "1/-1" } : {}}>
    {label && <label>{label}</label>}
    {children}
    {hint && <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 2 }}>{hint}</div>}
  </div>;
}

function PctBar({ pct, critica }) {
  return <div className="pct-bar"><div className={`pct-fill ${critica ? "critical" : pct >= 100 ? "done" : ""}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>;
}

function ProyectoModal({ proyecto, onClose, onSave }) {
  const [form, setForm] = useState({
    empresa: "Parana Logistica", nombre: "", tipo: "interno", cliente: "",
    descripcion: "", fecha_inicio: "", fecha_fin: "", responsable: "", status: "planificado",
    ...(proyecto || {}),
  });
  const [recursos, setRecursos] = useState(proyecto?.proyecto_recursos?.map(r => r.nombre) || []);
  const [nuevoRecurso, setNuevoRecurso] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre || !form.empresa) return alert("Completá nombre y empresa");
    setSaving(true);
    try {
      if (proyecto) {
        await api.actualizarProyecto(proyecto.id, form);
      } else {
        await api.crearProyecto(form, recursos.map(r => ({ nombre: r })));
      }
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  const addRecurso = () => {
    if (!nuevoRecurso.trim()) return;
    setRecursos([...recursos, nuevoRecurso.trim()]);
    setNuevoRecurso("");
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">{proyecto ? "Editar proyecto" : "Nuevo proyecto"}</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="form-section">Datos generales</div>
          <div className="form-grid">
            <FG label="Empresa *">
              <select value={form.empresa} onChange={e => set("empresa", e.target.value)}>
                {EMPRESAS.map(e => <option key={e}>{e}</option>)}
              </select>
            </FG>
            <FG label="Tipo">
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)}>
                <option value="interno">Interno</option>
                <option value="externo">Externo</option>
              </select>
            </FG>
          </div>
          <div className="form-grid">
            <FG label="Nombre *" full>
              <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Varada Golondrina 2026" />
            </FG>
          </div>
          <div className="form-grid">
            <FG label="Cliente (opcional)">
              <input value={form.cliente} onChange={e => set("cliente", e.target.value)} placeholder="Ej: Fugro" />
            </FG>
            <FG label="Responsable">
              <input value={form.responsable} onChange={e => set("responsable", e.target.value)} />
            </FG>
            <FG label="Fecha inicio">
              <input type="date" value={form.fecha_inicio} onChange={e => set("fecha_inicio", e.target.value)} />
            </FG>
            <FG label="Fecha fin estimada">
              <input type="date" value={form.fecha_fin} onChange={e => set("fecha_fin", e.target.value)} />
            </FG>
          </div>
          <div className="form-grid">
            <FG label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                {Object.entries(STATUS_PROYECTO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FG>
          </div>
          <FG label="Descripción" full>
            <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Descripción del proyecto..." />
          </FG>
          <div className="form-section">Recursos asignados</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {recursos.map((r, i) => (
              <div key={i} className="recurso-tag">{r}<button onClick={() => setRecursos(recursos.filter((_, j) => j !== i))}>✕</button></div>
            ))}
          </div>
          <div className="flex-gap">
            <input value={nuevoRecurso} onChange={e => setNuevoRecurso(e.target.value)} onKeyDown={e => e.key === "Enter" && addRecurso()}
              placeholder="Ej: Atlantic Dama, Base Quequen..."
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "7px 10px", fontSize: 12, fontFamily: "var(--sans)", outline: "none" }} />
            <button className="btn btn-ghost btn-sm" onClick={addRecurso}>+ Agregar</button>
          </div>
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar proyecto"}</button>
        </div>
      </div>
    </div>
  );
}

function TareaModal({ tarea, proyectoId, tareas, onClose, onSave }) {
  const [form, setForm] = useState({
    proyecto_id: proyectoId, nombre: "", responsable: "", fecha_inicio: "",
    fecha_fin: "", duracion_dias: 1, dependencias: [], porcentaje_avance: 0,
    status: "pendiente", notas: "",
    ...(tarea || {}),
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleDep = (id) => {
    const deps = form.dependencias || [];
    set("dependencias", deps.includes(id) ? deps.filter(d => d !== id) : [...deps, id]);
  };

  const handleSave = async () => {
    if (!form.nombre) return alert("El nombre es obligatorio");
    setSaving(true);
    try {
      tarea?.id ? await api.actualizarTarea(tarea.id, form) : await api.crearTarea(form);
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">{tarea?.id ? "Editar tarea" : "Nueva tarea"}</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="form-grid">
            <FG label="Nombre *" full>
              <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Limpieza de casco" />
            </FG>
            <FG label="Responsable">
              <input value={form.responsable} onChange={e => set("responsable", e.target.value)} />
            </FG>
            <FG label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                {Object.entries(STATUS_TAREA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FG>
            <FG label="Fecha inicio">
              <input type="date" value={form.fecha_inicio} onChange={e => set("fecha_inicio", e.target.value)} />
            </FG>
            <FG label="Fecha fin">
              <input type="date" value={form.fecha_fin} onChange={e => set("fecha_fin", e.target.value)} />
            </FG>
            <FG label="Duración (días)">
              <input type="number" min={1} value={form.duracion_dias} onChange={e => set("duracion_dias", parseInt(e.target.value) || 1)} />
            </FG>
            <FG label="% Avance">
              <input type="number" min={0} max={100} value={form.porcentaje_avance} onChange={e => set("porcentaje_avance", parseInt(e.target.value) || 0)} />
            </FG>
          </div>
          <FG label="Notas" full>
            <textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Observaciones..." />
          </FG>
          {tareas.filter(t => t.id !== tarea?.id).length > 0 && <>
            <div className="form-section">Dependencias</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tareas.filter(t => t.id !== tarea?.id).map(t => (
                <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={(form.dependencias || []).includes(t.id)} onChange={() => toggleDep(t.id)} style={{ accentColor: "var(--blue)" }} />
                  <span>{t.nombre}</span>
                  {t.fecha_fin && <span style={{ fontSize: 10, color: "var(--muted)" }}>hasta {fmtDate(t.fecha_fin)}</span>}
                </label>
              ))}
            </div>
          </>}
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar tarea"}</button>
        </div>
      </div>
    </div>
  );
}

function PageProyectos({ onSelectProyecto, notify }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setProyectos(await api.getProyectos()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = proyectos.filter(p => {
    if (filtroEmpresa && p.empresa !== filtroEmpresa) return false;
    if (filtroStatus && p.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="stats">
        <div className="stat"><div className="stat-label">Total</div><div className="stat-value" style={{ color: "var(--blue)" }}>{proyectos.length}</div></div>
        <div className="stat"><div className="stat-label">En curso</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{proyectos.filter(p => p.status === "en_curso").length}</div></div>
        <div className="stat"><div className="stat-label">Atrasados</div><div className="stat-value" style={{ color: "var(--danger)" }}>{proyectos.filter(p => p.status === "en_curso" && p.fecha_fin && p.fecha_fin < today()).length}</div></div>
        <div className="stat"><div className="stat-label">Completados</div><div className="stat-value" style={{ color: "var(--muted)" }}>{proyectos.filter(p => p.status === "completado").length}</div></div>
      </div>
      <div className="filter-row">
        <select className="filter-select" value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)}>
          <option value="">Todas las empresas</option>
          {EMPRESAS.map(e => <option key={e}>{e}</option>)}
        </select>
        <select className="filter-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_PROYECTO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {(filtroEmpresa || filtroStatus) && <button className="btn btn-ghost btn-sm" onClick={() => { setFiltroEmpresa(""); setFiltroStatus(""); }}>✕ Limpiar</button>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{filtrados.length} proyectos</span>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Nuevo proyecto</button>
      </div>
      {loading ? <div className="loading"><span className="spin">◌</span> Cargando...</div> :
        filtrados.length === 0 ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>Sin proyectos</div> :
        filtrados.map(p => {
          const s = STATUS_PROYECTO[p.status] || { label: p.status, color: "b-gray" };
          const tareas = p.proyecto_tareas || [];
          const pct = tareas.length ? Math.round(tareas.reduce((a, t) => a + (t.porcentaje_avance || 0), 0) / tareas.length) : 0;
          const atrasada = p.status === "en_curso" && p.fecha_fin && p.fecha_fin < today();
          return (
            <div key={p.id} className={`req-row ${atrasada ? "active-border" : ""}`} onClick={() => onSelectProyecto(p)}>
              <div className="flex-between mb8">
                <div className="flex-gap">
                  <span className={`badge ${s.color}`}>{s.label}</span>
                  <span className={`badge ${p.tipo === "externo" ? "b-purple" : "b-teal"}`}>{p.tipo}</span>
                  {atrasada && <span className="badge b-red">⚠ Atrasado</span>}
                </div>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{p.empresa}</span>
              </div>
              <div className="req-title">{p.nombre}</div>
              <div className="req-meta">
                {p.cliente && <span>👤 {p.cliente}</span>}
                {p.responsable && <><span>·</span><span>{p.responsable}</span></>}
                {p.fecha_inicio && <><span>·</span><span>{fmtDate(p.fecha_inicio)} → {fmtDate(p.fecha_fin)}</span></>}
                <span>·</span><span>{tareas.length} tareas</span>
                {(p.proyecto_recursos || []).length > 0 && <><span>·</span><span>{(p.proyecto_recursos || []).map(r => r.nombre).join(", ")}</span></>}
              </div>
              {tareas.length > 0 && <div className="mt8"><PctBar pct={pct} /><div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "var(--mono)", marginTop: 3 }}>{pct}% avance global</div></div>}
            </div>
          );
        })
      }
      {modal && <ProyectoModal onClose={() => setModal(false)} onSave={() => { setModal(false); notify("Proyecto creado", "success"); load(); }} />}
    </div>
  );
}

function PageDetalle({ proyectoId, onBack, notify }) {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("gantt");
  const [modalTarea, setModalTarea] = useState(null);
  const [editProyecto, setEditProyecto] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProyectos();
      setProyecto(data.find(p => p.id === proyectoId));
    } finally { setLoading(false); }
  }, [proyectoId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="loading"><span className="spin">◌</span> Cargando...</div>;
  if (!proyecto) return <div className="empty-state">Proyecto no encontrado</div>;

  const tareas = proyecto.proyecto_tareas || [];
  const criticas = calcularCaminoCritico(tareas);
  const pct = tareas.length ? Math.round(tareas.reduce((a, t) => a + (t.porcentaje_avance || 0), 0) / tareas.length) : 0;
  const atrasadas = tareas.filter(t => t.fecha_fin && t.fecha_fin < today() && t.porcentaje_avance < 100);

  const fechas = tareas.filter(t => t.fecha_inicio && t.fecha_fin);
  const minFecha = fechas.length ? fechas.reduce((a, t) => t.fecha_inicio < a ? t.fecha_inicio : a, fechas[0].fecha_inicio) : proyecto.fecha_inicio;
  const maxFecha = fechas.length ? fechas.reduce((a, t) => t.fecha_fin > a ? t.fecha_fin : a, fechas[0].fecha_fin) : proyecto.fecha_fin;
  const totalDias = minFecha && maxFecha ? Math.max(diffDays(minFecha, maxFecha), 1) : 90;

  const getBarStyle = (t) => {
    if (!t.fecha_inicio || !t.fecha_fin || !minFecha) return null;
    const left = (diffDays(minFecha, t.fecha_inicio) / totalDias) * 100;
    const width = Math.max((diffDays(t.fecha_inicio, t.fecha_fin) / totalDias) * 100, 2);
    return { left: `${left}%`, width: `${width}%` };
  };

  const getBarClass = (t) => {
    if (t.porcentaje_avance >= 100) return "done";
    if (criticas.has(t.id)) return "critical";
    if (t.fecha_fin && t.fecha_fin < today()) return "late";
    return "normal";
  };

  const meses = [];
  if (minFecha && maxFecha) {
    let cur = new Date(minFecha);
    const end = new Date(maxFecha);
    while (cur <= end) {
      meses.push(cur.toLocaleString("es-AR", { month: "short", year: "2-digit" }));
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }
  }

  const cols = `160px ${meses.length > 0 ? `repeat(${meses.length}, 1fr)` : "1fr"}`;

  return (
    <div>
      <div className="flex-gap mb12">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Volver</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditProyecto(true)}>✏ Editar</button>
        <button className="btn btn-primary btn-sm" onClick={() => setModalTarea({})}>+ Nueva tarea</button>
      </div>

      <div className="card mb12">
        <div className="flex-between">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{proyecto.nombre}</div>
            <div className="flex-gap">
              <span className={`badge ${STATUS_PROYECTO[proyecto.status]?.color || "b-gray"}`}>{STATUS_PROYECTO[proyecto.status]?.label}</span>
              <span className={`badge ${proyecto.tipo === "externo" ? "b-purple" : "b-teal"}`}>{proyecto.tipo}</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{proyecto.empresa}</span>
              {proyecto.cliente && <span style={{ fontSize: 11, color: "var(--muted)" }}>· {proyecto.cliente}</span>}
              {proyecto.responsable && <span style={{ fontSize: 11, color: "var(--muted)" }}>· {proyecto.responsable}</span>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 600, color: "var(--blue)" }}>{pct}%</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>avance global</div>
          </div>
        </div>
        {(proyecto.proyecto_recursos || []).length > 0 && (
          <div className="flex-gap mt8">{(proyecto.proyecto_recursos || []).map((r, i) => <div key={i} className="recurso-tag">{r.nombre}</div>)}</div>
        )}
        {proyecto.descripcion && <div className="info-box mt8" style={{ fontSize: 12 }}>{proyecto.descripcion}</div>}
        <div className="mt8"><PctBar pct={pct} /></div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-label">Tareas</div><div className="stat-value" style={{ color: "var(--blue)" }}>{tareas.length}</div></div>
        <div className="stat"><div className="stat-label">Completadas</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{tareas.filter(t => t.porcentaje_avance >= 100).length}</div></div>
        <div className="stat"><div className="stat-label">Atrasadas</div><div className="stat-value" style={{ color: "var(--danger)" }}>{atrasadas.length}</div></div>
        <div className="stat"><div className="stat-label">Camino crítico</div><div className="stat-value" style={{ color: "var(--warn)" }}>{criticas.size}</div></div>
      </div>

      <div className="tabs-row">
        {[{ id: "gantt", label: "Gantt" }, { id: "lista", label: "Lista de tareas" }, { id: "critico", label: "Camino crítico" }].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {tab === "gantt" && (
        <div className="gantt-wrap">
          <div className="gantt-header" style={{ gridTemplateColumns: cols }}>
            <div className="gh-cell" style={{ textAlign: "left", borderRight: "1px solid var(--border)" }}>Tarea</div>
            {meses.map((m, i) => <div key={i} className="gh-cell">{m}</div>)}
            {meses.length === 0 && <div className="gh-cell">Línea de tiempo</div>}
          </div>
          {tareas.length === 0
            ? <div className="empty-state">Sin tareas — usá "+ Nueva tarea" para empezar</div>
            : tareas.map(t => {
                const barStyle = getBarStyle(t);
                return (
                  <div key={t.id} className="gantt-row" style={{ gridTemplateColumns: cols }} onClick={() => setModalTarea(t)}>
                    <div className="gc-label">
                      <div className="gc-name">{t.nombre}{criticas.has(t.id) && <span className="cc-badge">CC</span>}</div>
                      <div className="gc-sub">{t.responsable || "—"} · {t.porcentaje_avance || 0}%</div>
                    </div>
                    <div className="gc-bars" style={{ gridColumn: `2 / ${meses.length + 2}` }}>
                      {barStyle && <div className={`bar ${getBarClass(t)}`} style={barStyle}>{t.nombre}</div>}
                      {!barStyle && <div style={{ fontSize: 10, color: "var(--muted2)", padding: "0 12px" }}>Sin fechas</div>}
                    </div>
                  </div>
                );
              })
          }
          <div style={{ padding: "10px 16px", display: "flex", gap: 14, borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
            {[["var(--danger)", "Camino crítico"], ["var(--blue)", "En fecha"], ["var(--accent2)", "Completada"], ["var(--warn)", "Atrasada"]].map(([color, label]) => (
              <div key={label} className="flex-gap"><div style={{ width: 10, height: 10, borderRadius: 2, background: color }} /><span style={{ fontSize: 9, color: "var(--muted)" }}>{label}</span></div>
            ))}
          </div>
        </div>
      )}

      {tab === "lista" && (
        <div>
          {tareas.length === 0 ? <div className="empty-state">Sin tareas</div> :
            tareas.map(t => {
              const s = STATUS_TAREA[t.status] || { label: t.status, color: "b-gray" };
              const esAtrasada = t.fecha_fin && t.fecha_fin < today() && t.porcentaje_avance < 100;
              return (
                <div key={t.id} className={`tarea-row ${criticas.has(t.id) ? "critica" : esAtrasada ? "atrasada" : ""}`} onClick={() => setModalTarea(t)}>
                  <div className="flex-between mb8">
                    <div className="flex-gap">
                      <span className={`badge ${s.color}`}>{s.label}</span>
                      {criticas.has(t.id) && <span className="badge b-red">CC</span>}
                      {esAtrasada && <span className="badge b-amber">⚠ Atrasada</span>}
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{t.porcentaje_avance || 0}%</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)", marginBottom: 6 }}>{t.nombre}</div>
                  <div className="req-meta">
                    {t.responsable && <span>{t.responsable}</span>}
                    {t.fecha_inicio && <><span>·</span><span>{fmtDate(t.fecha_inicio)} → {fmtDate(t.fecha_fin)}</span></>}
                    {(t.dependencias || []).length > 0 && <><span>·</span><span>{t.dependencias.length} dep.</span></>}
                  </div>
                  <div className="mt8"><PctBar pct={t.porcentaje_avance || 0} critica={criticas.has(t.id)} /></div>
                </div>
              );
            })
          }
        </div>
      )}

      {tab === "critico" && (
        <div>
          <div className="info-box danger mb12" style={{ fontSize: 12 }}>
            Las tareas del camino crítico determinan la duración mínima del proyecto. Un atraso en cualquiera de estas tareas atrasa el proyecto completo.
          </div>
          {criticas.size === 0
            ? <div className="empty-state">Agregá tareas con fechas y dependencias para calcular el camino crítico</div>
            : tareas.filter(t => criticas.has(t.id)).map(t => {
                const esAtrasada = t.fecha_fin && t.fecha_fin < today() && t.porcentaje_avance < 100;
                return (
                  <div key={t.id} className="tarea-row critica" onClick={() => setModalTarea(t)}>
                    <div className="flex-between mb8">
                      <div className="flex-gap">
                        <span className="badge b-red">Camino crítico</span>
                        {esAtrasada && <span className="badge b-amber">⚠ Atrasada</span>}
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{t.porcentaje_avance || 0}%</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)", marginBottom: 6 }}>{t.nombre}</div>
                    <div className="req-meta">
                      {t.responsable && <span>{t.responsable}</span>}
                      {t.fecha_inicio && <><span>·</span><span>{fmtDate(t.fecha_inicio)} → {fmtDate(t.fecha_fin)}</span></>}
                      <span>·</span><span>{t.duracion_dias || (t.fecha_inicio && t.fecha_fin ? diffDays(t.fecha_inicio, t.fecha_fin) : "—")} días</span>
                    </div>
                    <div className="mt8"><PctBar pct={t.porcentaje_avance || 0} critica /></div>
                  </div>
                );
              })
          }
        </div>
      )}

      {modalTarea !== null && (
        <TareaModal
          tarea={modalTarea?.id ? modalTarea : null}
          proyectoId={proyectoId}
          tareas={tareas}
          onClose={() => setModalTarea(null)}
          onSave={() => { setModalTarea(null); notify("Tarea guardada", "success"); load(); }}
        />
      )}
      {editProyecto && (
        <ProyectoModal
          proyecto={proyecto}
          onClose={() => setEditProyecto(false)}
          onSave={() => { setEditProyecto(false); notify("Proyecto actualizado", "success"); load(); }}
        />
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("proyectos");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [notif, setNotif] = useState(null);
  const [filtroSidebar, setFiltroSidebar] = useState("");

  const notify = useCallback((text, type = "info") => {
    setNotif({ text, type });
    setTimeout(() => setNotif(null), 4000);
  }, []);

  const NI = ({ id, icon, label }) => (
    <div className={`ni ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
      <span className="ni-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );

  const pageTitles = {
    proyectos: "Todos los proyectos",
    atrasados: "Proyectos atrasados",
    detalle: proyectoSeleccionado?.nombre || "Proyecto",
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-wrap">
              <div className="sidebar-logo">📋</div>
              <div>
                <div className="sidebar-logo-main">Projects</div>
                <div className="sidebar-logo-sub">Terra Mare Group</div>
              </div>
            </div>
          </div>
          <div className="nav-section">Vistas</div>
          <NI id="proyectos" icon="▦" label="Todos los proyectos" />
          <NI id="atrasados" icon="⚠" label="Atrasados" />
          <div className="nav-section">Empresas</div>
          {EMPRESAS.map(e => (
            <div key={e} className={`ni ${filtroSidebar === e ? "active" : ""}`}
              onClick={() => { setFiltroSidebar(filtroSidebar === e ? "" : e); setPage("proyectos"); }}>
              <span className="ni-icon">·</span>
              <span style={{ fontSize: 11 }}>{e}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", fontFamily: "var(--mono)", letterSpacing: 1 }}>PROJECTS v1.0</div>
          </div>
        </nav>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{pageTitles[page] || page}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>G</div>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{USUARIO}</span>
            </div>
          </div>
          <div className="content">
            {(page === "proyectos" || page === "atrasados") && (
              <PageProyectos
                onSelectProyecto={p => { setProyectoSeleccionado(p); setPage("detalle"); }}
                notify={notify}
              />
            )}
            {page === "detalle" && proyectoSeleccionado && (
              <PageDetalle
                proyectoId={proyectoSeleccionado.id}
                onBack={() => setPage("proyectos")}
                notify={notify}
              />
            )}
          </div>
        </div>
      </div>
      <Notif msg={notif} onClose={() => setNotif(null)} />
    </>
  );
}
