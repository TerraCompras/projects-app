import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const PORTAL_URL = "https://erp-portal-fawn.vercel.app";
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

/* ── SIDEBAR ── */
.sidebar{width:235px;min-width:235px;background:var(--navy);display:flex;flex-direction:column;box-shadow:2px 0 8px rgba(33,51,99,.15);transition:transform .25s}
.sidebar-header{border-bottom:1px solid rgba(255,255,255,.1)}
.sidebar-logo-wrap{padding:20px 18px 16px;display:flex;align-items:center;gap:12px}
.sidebar-logo-img{width:36px;height:36px;object-fit:cover;border-radius:50%;border:2px solid rgba(255,255,255,.2)}
.sidebar-logo-main{font-size:13px;font-weight:700;color:#fff;letter-spacing:2px;text-transform:uppercase}
.sidebar-logo-sub{font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.5px}
.nav-section{padding:12px 18px 4px;font-family:var(--mono);font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.35);text-transform:uppercase}
.ni{display:flex;align-items:center;gap:9px;padding:7px 18px;font-size:12px;font-weight:500;cursor:pointer;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .12s;user-select:none}
.ni:hover{color:#fff;background:rgba(255,255,255,.06)}
.ni.active{color:#fff;border-left-color:var(--light);background:rgba(255,255,255,.1);font-weight:600}
.ni.back{color:rgba(255,255,255,.4);font-size:11px;border-top:1px solid rgba(255,255,255,.08);margin-top:4px}
.ni.back:hover{color:rgba(255,255,255,.8)}
.ni-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0}

/* ── MAIN ── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:13px 28px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(33,51,99,.06);gap:12px}
.topbar-title{font-size:12px;font-weight:600;letter-spacing:1px;color:var(--navy);text-transform:uppercase;white-space:nowrap}
.content{flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(33,51,99,.06)}
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
.btn-danger{background:transparent;color:var(--danger);border-color:var(--danger)}.btn-danger:hover{background:#FEE2E2}
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
.flex-gap{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.flex-between{display:flex;justify-content:space-between;align-items:center;gap:8px}
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
.dia-btn{padding:5px 12px;border-radius:var(--r);font-size:11px;font-weight:600;cursor:pointer;user-select:none;transition:all .12s;border:1px solid var(--border)}
.dia-btn.active{background:var(--blue);color:#fff;border-color:var(--blue)}
.dia-btn.inactive{background:var(--surface2);color:var(--muted)}
.fullscreen-overlay{position:fixed;inset:0;background:#fff;z-index:200;display:flex;flex-direction:column;animation:fadeIn .2s}
.fs-topbar{background:var(--navy);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.fs-title{color:#fff;font-size:14px;font-weight:700;letter-spacing:.5px}
.fs-content{flex:1;overflow:auto;padding:24px;background:var(--bg)}
.fs-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:var(--r);padding:6px 12px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;gap:6px;transition:all .15s}
.fs-btn:hover{background:rgba(255,255,255,.25)}

/* ── HAMBURGER (mobile) ── */
.hamburger{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:4px}
.hamburger span{display:block;width:20px;height:2px;background:var(--navy);border-radius:2px;transition:all .2s}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:49}

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:50;transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .sidebar-overlay.open{display:block}
  .hamburger{display:flex}
  .topbar{padding:10px 16px}
  .content{padding:16px}
  .stats{grid-template-columns:repeat(2,1fr)}
  .form-grid{grid-template-columns:1fr}
  .form-grid-3{grid-template-columns:1fr}
  .gantt-wrap{overflow-x:auto}
  .req-title{font-size:13px}
  .modal{max-width:100%;margin:0;border-radius:12px 12px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:90vh;overflow-y:auto}
  .overlay{align-items:flex-end;padding:0}
  .flex-between{flex-wrap:wrap}
  .filter-row{gap:6px}
  .filter-select{min-width:0;flex:1}
}
@media(max-width:480px){
  .stats{grid-template-columns:repeat(2,1fr)}
  .stat-value{font-size:22px}
  .btn{padding:6px 10px;font-size:10px}
  .topbar-title{font-size:11px}
}
`;

const STATUS_PROYECTO = {
  planificado: { label: "Planificado", color: "b-gray" },
  en_curso:    { label: "En curso",    color: "b-blue" },
  completado:  { label: "Completado",  color: "b-green" },
  cancelado:   { label: "Cancelado",   color: "b-red" },
};

const STATUS_TAREA = {
  pendiente:  { label: "Pendiente",  color: "b-gray" },
  en_curso:   { label: "En curso",   color: "b-blue" },
  completada: { label: "Completada", color: "b-green" },
  atrasada:   { label: "Atrasada",   color: "b-amber" },
  bloqueada:  { label: "Bloqueada",  color: "b-red" },
};

const DIAS_SEMANA  = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DIAS_DEFAULT = [true, true, true, true, true, false, false];

const fmtDate  = d => d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR") : "—";
const diffDays = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);
const today    = () => new Date().toISOString().split("T")[0];

function calcFechaFin(inicio, duracion, diasHabiles) {
  if (!inicio || !duracion || !diasHabiles?.some(d => d)) return "";
  let cur = new Date(inicio + "T00:00:00");
  let restante = parseInt(duracion);
  while (restante > 0) {
    const dow = (cur.getDay() + 6) % 7;
    if (diasHabiles[dow]) restante--;
    if (restante > 0) cur.setDate(cur.getDate() + 1);
  }
  return cur.toISOString().split("T")[0];
}

// ─── API ─────────────────────────────────────────────────────────────────────
const api = {
  async getPerfiles() {
    const { data, error } = await supabase.from("perfiles").select("id, nombre, email").eq("activo", true).order("nombre");
    if (error) throw error;
    return data || [];
  },
  async getRecursosCatalogo() {
    const { data, error } = await supabase.from("proyecto_recursos_catalogo").select("*").eq("activo", true).order("nombre");
    if (error) throw error;
    return data || [];
  },
  async agregarRecursoCatalogo(nombre) {
    const { data, error } = await supabase.from("proyecto_recursos_catalogo").insert([{ nombre, tipo: "otro" }]).select().single();
    if (error) throw error;
    return data;
  },
  async getProyectos(filtros = {}) {
    let q = supabase.from("proyectos").select("*, proyecto_recursos(*), proyecto_tareas(*)").order("created_at", { ascending: false });
    if (filtros.empresa) q = q.eq("empresa", filtros.empresa);
    if (filtros.status)  q = q.eq("status",  filtros.status);
    const { data, error } = await q;
    if (error) throw error;
    // Cargar contactos por separado para evitar problemas de schema cache
    const proyectos = data || [];
    if (proyectos.length) {
      const ids = proyectos.map(p => p.id);
      const { data: contactos } = await supabase.from("proyecto_contactos").select("*").in("proyecto_id", ids);
      if (contactos) {
        proyectos.forEach(p => {
          p.proyecto_contactos = contactos.filter(c => c.proyecto_id === p.id);
        });
      }
    }
    return proyectos;
  },
  async crearProyecto(proy, recursos, contactos) {
    // Insert sin select de relaciones para evitar schema cache
    const { data, error } = await supabase.from("proyectos").insert([proy]).select("id, nombre, empresa, status, tipo, cliente, responsable, fecha_inicio, fecha_fin, descripcion, created_at").single();
    if (error) throw error;
    if (recursos?.length)
      await supabase.from("proyecto_recursos").insert(recursos.map(r => ({ nombre: r, proyecto_id: data.id })));
    if (contactos?.length)
      await supabase.from("proyecto_contactos").insert(contactos.map(c => ({ ...c, proyecto_id: data.id })));
    return data;
  },
  async actualizarProyecto(id, cambios, recursos, contactos) {
    // Solo actualizar columnas propias de proyectos, sin relaciones
    const camposProyecto = { updated_at: new Date().toISOString() };
    const camposPermitidos = ["nombre","empresa","tipo","cliente","descripcion","fecha_inicio","fecha_fin","responsable","status"];
    camposPermitidos.forEach(k => { if (cambios[k] !== undefined) camposProyecto[k] = cambios[k]; });
    const { error: errUpdate } = await supabase.from("proyectos").update(camposProyecto).eq("id", id);
    if (errUpdate) throw new Error("Error actualizando proyecto: " + errUpdate.message);
    // Reemplazar recursos
    if (recursos !== undefined) {
      await supabase.from("proyecto_recursos").delete().eq("proyecto_id", id);
      if (recursos.length) await supabase.from("proyecto_recursos").insert(recursos.map(r => ({ nombre: r, proyecto_id: id })));
    }
    // Reemplazar contactos
    if (contactos !== undefined) {
      const { error: errDelC } = await supabase.from("proyecto_contactos").delete().eq("proyecto_id", id);
      if (errDelC) throw new Error("Error borrando contactos: " + errDelC.message);
      if (contactos.length) {
        const { error: errInsC } = await supabase.from("proyecto_contactos").insert(contactos.map(c => ({ ...c, proyecto_id: id })));
        if (errInsC) throw new Error("Error insertando contactos: " + errInsC.message);
      }
    }
  },
  async eliminarProyecto(id) {
    const { error: e1 } = await supabase.from("proyecto_tareas").delete().eq("proyecto_id", id);
    if (e1) throw e1;
    const { error: e2 } = await supabase.from("proyecto_recursos").delete().eq("proyecto_id", id);
    if (e2) throw e2;
    const { error: e3 } = await supabase.from("proyecto_contactos").delete().eq("proyecto_id", id);
    if (e3) throw e3;
    const { error: e4 } = await supabase.from("proyectos").delete().eq("id", id);
    if (e4) throw e4;
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
  async getAdjuntos(proyectoId) {
    const { data, error } = await supabase.from("proyecto_adjuntos").select("*").eq("proyecto_id", proyectoId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async subirAdjunto(file, proyectoId, tareaId = null) {
    const ext = file.name.split(".").pop();
    const path = `proyectos/${proyectoId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: errUp } = await supabase.storage.from("proyecto-adjuntos").upload(path, file, { upsert: true });
    if (errUp) throw errUp;
    const { data: urlData } = supabase.storage.from("proyecto-adjuntos").getPublicUrl(path);
    const adjunto = {
      proyecto_id: proyectoId,
      tarea_id: tareaId || null,
      nombre: file.name,
      url: urlData.publicUrl,
      tipo: file.type || ext,
      tamanio: file.size,
    };
    const { data, error } = await supabase.from("proyecto_adjuntos").insert([adjunto]).select().single();
    if (error) throw error;
    return data;
  },
  async eliminarAdjunto(id, url) {
    const path = url.split("/proyecto-adjuntos/")[1];
    if (path) await supabase.storage.from("proyecto-adjuntos").remove([path]);
    const { error } = await supabase.from("proyecto_adjuntos").delete().eq("id", id);
    if (error) throw error;
  },
  async getSubtareas(tareaId) {
    const { data, error } = await supabase.from("proyecto_subtareas").select("*").eq("tarea_id", tareaId).order("fecha_inicio", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async crearSubtarea(subtarea) {
    const { data, error } = await supabase.from("proyecto_subtareas").insert([subtarea]).select().single();
    if (error) throw error;
    return data;
  },
  async actualizarSubtarea(id, cambios) {
    const { data, error } = await supabase.from("proyecto_subtareas").update(cambios).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async eliminarSubtarea(id) {
    const { error } = await supabase.from("proyecto_subtareas").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcularCaminoCritico(tareas) {
  if (!tareas?.length) return new Set();
  const duracion = t => Math.max(parseInt(t.duracion_dias) || 1, 1);
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

// ─── MODAL PROYECTO ───────────────────────────────────────────────────────────
function ProyectoModal({ proyecto, onClose, onSave }) {
  const [form, setForm] = useState({
    empresa: "Parana Logistica", nombre: "", tipo: "interno", cliente: "",
    descripcion: "", fecha_inicio: "", fecha_fin: "", responsable: "", status: "planificado",
    ...(proyecto || {}),
  });

  // Recursos: array de strings (nombres)
  const [recursos, setRecursos] = useState(proyecto?.proyecto_recursos?.map(r => r.nombre) || []);
  // Contactos: array de {nombre, email}
  const [contactos, setContactos] = useState(proyecto?.proyecto_contactos || []);
  // Catálogo de recursos desde Supabase
  const [recursosCatalogo, setRecursosCatalogo] = useState([]);
  // Perfiles desde Supabase
  const [perfiles, setPerfiles] = useState([]);
  // Estado para agregar recurso manual
  const [nuevoRecursoManual, setNuevoRecursoManual] = useState("");
  const [agregandoRecurso, setAgregandoRecurso] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    Promise.all([api.getPerfiles(), api.getRecursosCatalogo()])
      .then(([p, r]) => { setPerfiles(p); setRecursosCatalogo(r); });
  }, []);

  // ── Recursos ──
  const toggleRecurso = (nombre) => {
    setRecursos(prev =>
      prev.includes(nombre) ? prev.filter(r => r !== nombre) : [...prev, nombre]
    );
  };

  const handleAgregarRecursoManual = async () => {
    const nombre = nuevoRecursoManual.trim();
    if (!nombre) return;
    setAgregandoRecurso(true);
    try {
      const nuevo = await api.agregarRecursoCatalogo(nombre);
      setRecursosCatalogo(prev => [...prev, nuevo]);
      setRecursos(prev => [...prev, nuevo.nombre]);
      setNuevoRecursoManual("");
    } catch (e) {
      // Si ya existe, simplemente agregarlo a la selección
      if (!recursos.includes(nombre)) setRecursos(prev => [...prev, nombre]);
      setNuevoRecursoManual("");
    } finally { setAgregandoRecurso(false); }
  };

  // ── Contactos ──
  const addContacto = () => setContactos(prev => [...prev, { nombre: "", email: "" }]);
  const setContacto = (i, k, v) => {
    const arr = [...contactos];
    arr[i] = { ...arr[i], [k]: v };
    setContactos(arr);
  };
  const removeContacto = (i) => setContactos(prev => prev.filter((_, j) => j !== i));

  const handleSave = async () => {
    if (!form.nombre || !form.empresa) return alert("Completá nombre y empresa");
    setSaving(true);
    try {
      const contactosValidos = contactos.filter(c => c.nombre?.trim() || c.email?.trim());
      if (proyecto) {
        await api.actualizarProyecto(proyecto.id, form, recursos, contactosValidos);
      } else {
        await api.crearProyecto(form, recursos, contactosValidos);
      }
      onSave();
    } catch (e) { console.error("Error completo:", e); alert("Error: " + (e.message || JSON.stringify(e))); }
    finally { setSaving(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">{proyecto ? "Editar proyecto" : "Nuevo proyecto"}</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">

          {/* ── Datos generales ── */}
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
              <input value={form.cliente || ""} onChange={e => set("cliente", e.target.value)} placeholder="Ej: Fugro" />
            </FG>
            <FG label="Responsable">
              <select value={form.responsable || ""} onChange={e => set("responsable", e.target.value)}>
                <option value="">Sin asignar</option>
                {perfiles.map(p => (
                  <option key={p.id} value={p.nombre}>{p.nombre}</option>
                ))}
              </select>
            </FG>
            <FG label="Fecha inicio">
              <input type="date" value={form.fecha_inicio || ""} onChange={e => set("fecha_inicio", e.target.value)} />
            </FG>
            <FG label="Fecha fin estimada">
              <input type="date" value={form.fecha_fin || ""} onChange={e => set("fecha_fin", e.target.value)} />
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
            <textarea value={form.descripcion || ""} onChange={e => set("descripcion", e.target.value)} placeholder="Descripción del proyecto..." />
          </FG>

          {/* ── Contactos de cliente ── */}
          <div className="form-section">Contactos de cliente</div>
          {contactos.length === 0 && (
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Sin contactos — opcional</div>
          )}
          {contactos.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 8, alignItems: "end" }}>
              <FG label={i === 0 ? "Nombre" : ""}>
                <input value={c.nombre || ""} onChange={e => setContacto(i, "nombre", e.target.value)} placeholder="Ej: Juan Pérez" />
              </FG>
              <FG label={i === 0 ? "Email" : ""}>
                <input type="email" value={c.email || ""} onChange={e => setContacto(i, "email", e.target.value)} placeholder="juan@empresa.com" />
              </FG>
              <button
                onClick={() => removeContacto(i)}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--r)", color: "var(--muted2)", cursor: "pointer", fontSize: 14, padding: "8px 10px", marginBottom: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--muted2)"}
              >✕</button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addContacto}>+ Agregar contacto</button>

          {/* ── Recursos asignados ── */}
          <div className="form-section">Recursos asignados</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {recursosCatalogo.map(r => (
              <div
                key={r.id}
                onClick={() => toggleRecurso(r.nombre)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: recursos.includes(r.nombre) ? "var(--blue)" : "var(--surface2)",
                  color: recursos.includes(r.nombre) ? "#fff" : "var(--muted)",
                  border: `1px solid ${recursos.includes(r.nombre) ? "var(--blue)" : "var(--border)"}`,
                  borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                  cursor: "pointer", transition: "all .12s", userSelect: "none",
                }}
              >
                {recursos.includes(r.nombre) ? "✓ " : ""}{r.nombre}
              </div>
            ))}
          </div>
          {/* Agregar recurso manual */}
          <div className="flex-gap">
            <input
              value={nuevoRecursoManual}
              onChange={e => setNuevoRecursoManual(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAgregarRecursoManual()}
              placeholder="Agregar recurso nuevo..."
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "7px 10px", fontSize: 12, fontFamily: "var(--sans)", outline: "none" }}
            />
            <button className="btn btn-ghost btn-sm" onClick={handleAgregarRecursoManual} disabled={agregandoRecurso || !nuevoRecursoManual.trim()}>
              {agregandoRecurso ? "..." : "+ Agregar"}
            </button>
          </div>
          <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 6 }}>
            Los recursos nuevos se guardan en el catálogo para usar en futuros proyectos.
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

// ─── MODAL TAREA ──────────────────────────────────────────────────────────────
function TareaModal({ tarea, proyectoId, tareas, onClose, onSave, onEliminar }) {
  const parseDias = (d) => Array.isArray(d) && d.length === 7 ? d : [...DIAS_DEFAULT];
  const [form, setForm] = useState({
    proyecto_id: proyectoId, nombre: "", owner: "", responsable: "",
    fecha_inicio: "", fecha_fin: "", duracion_dias: 1, dependencias: [],
    porcentaje_avance: 0, status: "pendiente", notas: "", dias_habiles: [...DIAS_DEFAULT],
    ...(tarea || {}),
    dias_habiles: parseDias(tarea?.dias_habiles),
  });
  const [perfiles, setPerfiles]         = useState([]);
  const [subtareas, setSubtareas]       = useState([]);
  const [saving, setSaving]             = useState(false);
  const [savingSubtarea, setSavingSubtarea] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState(false);
  const [tabModal, setTabModal]         = useState("datos");
  const [editSubtareaId, setEditSubtareaId] = useState(null);
  const [subForm, setSubForm]           = useState({ descripcion: "", fecha_inicio: "", fecha_fin: "", porcentaje_avance: 0, responsable: "" });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSub = (k, v) => setSubForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    api.getPerfiles().then(setPerfiles);
    if (tarea?.id) api.getSubtareas(tarea.id).then(setSubtareas);
  }, [tarea?.id]);

  useEffect(() => {
    const fin = calcFechaFin(form.fecha_inicio, form.duracion_dias, form.dias_habiles);
    if (fin) set("fecha_fin", fin);
  }, [form.fecha_inicio, form.duracion_dias, JSON.stringify(form.dias_habiles)]);

  const toggleDia = (i) => { const dias = [...form.dias_habiles]; dias[i] = !dias[i]; set("dias_habiles", dias); };
  const toggleDep = (id) => {
    const deps = form.dependencias || [];
    set("dependencias", deps.includes(id) ? deps.filter(d => d !== id) : [...deps, id]);
  };

  const handleSave = async () => {
    if (!form.nombre) return alert("El nombre es obligatorio");
    if (!form.dias_habiles.some(d => d)) return alert("Seleccioná al menos un día hábil");
    setSaving(true);
    try {
      tarea?.id ? await api.actualizarTarea(tarea.id, form) : await api.crearTarea(form);
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  // ── Subtareas ──
  const blankSubForm = () => ({ descripcion: "", fecha_inicio: form.fecha_inicio || "", fecha_fin: form.fecha_fin || "", porcentaje_avance: 0, responsable: "" });

  const handleGuardarSubtarea = async () => {
    if (!subForm.descripcion.trim()) return alert("La descripción es obligatoria");
    // Validar que fechas estén dentro de la tarea madre
    if (form.fecha_inicio && subForm.fecha_inicio && subForm.fecha_inicio < form.fecha_inicio)
      return alert(`La fecha de inicio no puede ser anterior a la tarea madre (${fmtDate(form.fecha_inicio)})`);
    if (form.fecha_fin && subForm.fecha_fin && subForm.fecha_fin > form.fecha_fin)
      return alert(`La fecha de fin no puede ser posterior a la tarea madre (${fmtDate(form.fecha_fin)})`);
    setSavingSubtarea(true);
    try {
      if (editSubtareaId) {
        const updated = await api.actualizarSubtarea(editSubtareaId, subForm);
        setSubtareas(prev => prev.map(s => s.id === editSubtareaId ? updated : s));
      } else {
        const nueva = await api.crearSubtarea({ ...subForm, tarea_id: tarea.id, proyecto_id: proyectoId });
        setSubtareas(prev => [...prev, nueva]);
      }
      setSubForm(blankSubForm());
      setEditSubtareaId(null);
    } catch (e) { alert("Error: " + e.message); }
    finally { setSavingSubtarea(false); }
  };

  const handleEditarSubtarea = (s) => {
    setEditSubtareaId(s.id);
    setSubForm({ descripcion: s.descripcion, fecha_inicio: s.fecha_inicio || "", fecha_fin: s.fecha_fin || "", porcentaje_avance: s.porcentaje_avance || 0, responsable: s.responsable || "" });
  };

  const handleEliminarSubtarea = async (id) => {
    if (!window.confirm("¿Eliminar esta subtarea?")) return;
    await api.eliminarSubtarea(id);
    setSubtareas(prev => prev.filter(s => s.id !== id));
  };

  const otrasTareas = tareas.filter(t => t.id !== tarea?.id);

  const inStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", color: "var(--text)", fontFamily: "var(--sans)", fontSize: 12, padding: "6px 10px", outline: "none", width: "100%" };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">{tarea?.id ? "Editar tarea" : "Nueva tarea"}</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>

        {/* Tabs del modal */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
          {[
            { id: "datos", label: "Datos" },
            { id: "subtareas", label: `Subtareas${subtareas.length ? ` (${subtareas.length})` : ""}` },
            { id: "adjuntos", label: "📎 Adjuntos" },
          ].map(t => (
            <div key={t.id}
              onClick={() => setTabModal(t.id)}
              style={{ padding: "9px 16px", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: .5, textTransform: "uppercase", color: tabModal === t.id ? "var(--blue)" : "var(--muted)", borderBottom: `2px solid ${tabModal === t.id ? "var(--blue)" : "transparent"}`, transition: "all .12s" }}
            >{t.label}</div>
          ))}
        </div>

        <div className="mbody">

          {/* ── TAB DATOS ── */}
          {tabModal === "datos" && <>
            <div className="form-grid">
              <FG label="Nombre *" full><input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Limpieza de casco" /></FG>
              <FG label="Owner (responsable final)">
                <select value={form.owner || ""} onChange={e => set("owner", e.target.value)}>
                  <option value="">Sin asignar</option>
                  {perfiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
              </FG>
              <FG label="Responsable de ejecución">
                <select value={form.responsable || ""} onChange={e => set("responsable", e.target.value)}>
                  <option value="">Sin asignar</option>
                  {perfiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
              </FG>
              <FG label="Status">
                <select value={form.status} onChange={e => set("status", e.target.value)}>
                  {Object.entries(STATUS_TAREA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </FG>
              <FG label="Fecha inicio *"><input type="date" value={form.fecha_inicio || ""} onChange={e => set("fecha_inicio", e.target.value)} /></FG>
              <FG label="Duración (días hábiles)"><input type="number" min={1} value={form.duracion_dias} onChange={e => set("duracion_dias", parseInt(e.target.value) || 1)} /></FG>
              <FG label="Fecha fin (calculada)"><input value={form.fecha_fin ? fmtDate(form.fecha_fin) : "—"} readOnly style={{ background: "var(--surface2)", color: "var(--muted)", cursor: "not-allowed" }} /></FG>
              <FG label="% Avance"><input type="number" min={0} max={100} value={form.porcentaje_avance} onChange={e => set("porcentaje_avance", parseInt(e.target.value) || 0)} /></FG>
            </div>
            <div className="form-section">Días hábiles</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {DIAS_SEMANA.map((d, i) => (
                <div key={d} onClick={() => toggleDia(i)} className={`dia-btn ${form.dias_habiles[i] ? "active" : "inactive"}`}>{d}</div>
              ))}
            </div>
            <FG label="Notas" full><textarea value={form.notas || ""} onChange={e => set("notas", e.target.value)} placeholder="Observaciones..." /></FG>
            {otrasTareas.length > 0 && <>
              <div className="form-section">Dependencias</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {otrasTareas.map(t => (
                  <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={(form.dependencias || []).includes(t.id)} onChange={() => toggleDep(t.id)} style={{ accentColor: "var(--blue)" }} />
                    <span>{t.nombre}</span>
                    {t.fecha_fin && <span style={{ fontSize: 10, color: "var(--muted)" }}>hasta {fmtDate(t.fecha_fin)}</span>}
                  </label>
                ))}
              </div>
            </>}
          </>}

          {/* ── TAB SUBTAREAS ── */}
          {tabModal === "subtareas" && <>
            {!tarea?.id
              ? <div className="info-box accent" style={{ fontSize: 12 }}>Guardá la tarea primero para poder agregar subtareas.</div>
              : <>
                  {/* Formulario nueva/editar subtarea */}
                  <div className="card" style={{ margin: 0, marginBottom: 14, padding: 14, background: "var(--surface2)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--blue)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                      {editSubtareaId ? "Editando subtarea" : "Nueva subtarea"}
                    </div>
                    <FG label="Descripción *">
                      <input value={subForm.descripcion} onChange={e => setSub("descripcion", e.target.value)} placeholder="Ej: Cotizar materiales" style={inStyle} />
                    </FG>
                    <div className="form-grid" style={{ marginTop: 10 }}>
                      <FG label="Fecha inicio">
                        <input type="date" value={subForm.fecha_inicio} onChange={e => setSub("fecha_inicio", e.target.value)}
                          min={form.fecha_inicio || undefined} max={form.fecha_fin || undefined} />
                      </FG>
                      <FG label="Fecha fin">
                        <input type="date" value={subForm.fecha_fin} onChange={e => setSub("fecha_fin", e.target.value)}
                          min={subForm.fecha_inicio || form.fecha_inicio || undefined} max={form.fecha_fin || undefined} />
                      </FG>
                      <FG label="% Avance">
                        <input type="number" min={0} max={100} value={subForm.porcentaje_avance} onChange={e => setSub("porcentaje_avance", parseInt(e.target.value) || 0)} />
                      </FG>
                      <FG label="Responsable">
                        <select value={subForm.responsable} onChange={e => setSub("responsable", e.target.value)}>
                          <option value="">Sin asignar</option>
                          {perfiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                        </select>
                      </FG>
                    </div>
                    {form.fecha_inicio && form.fecha_fin && (
                      <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 8 }}>
                        Rango de la tarea madre: {fmtDate(form.fecha_inicio)} → {fmtDate(form.fecha_fin)}
                      </div>
                    )}
                    <div className="flex-gap" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                      {editSubtareaId && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditSubtareaId(null); setSubForm(blankSubForm()); }}>Cancelar</button>
                      )}
                      <button className="btn btn-primary btn-sm" onClick={handleGuardarSubtarea} disabled={savingSubtarea || !subForm.descripcion.trim()}>
                        {savingSubtarea ? "..." : editSubtareaId ? "Guardar cambios" : "+ Agregar"}
                      </button>
                    </div>
                  </div>

                  {/* Lista subtareas */}
                  {subtareas.length === 0
                    ? <div className="empty-state" style={{ padding: "24px 0" }}>Sin subtareas</div>
                    : subtareas.map(s => (
                        <div key={s.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "12px 14px", marginBottom: 8 }}>
                          <div className="flex-between">
                            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)" }}>{s.descripcion}</div>
                            <div className="flex-gap">
                              <button className="btn btn-ghost btn-sm" onClick={() => handleEditarSubtarea(s)}>✏</button>
                              <button
                                onClick={() => handleEliminarSubtarea(s.id)}
                                style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", fontSize: 14 }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--muted2)"}
                              >✕</button>
                            </div>
                          </div>
                          <div className="req-meta mt8">
                            {s.responsable && <span>👤 {s.responsable}</span>}
                            {s.fecha_inicio && <><span>·</span><span>{fmtDate(s.fecha_inicio)} → {fmtDate(s.fecha_fin)}</span></>}
                            <span>·</span><span>{s.porcentaje_avance || 0}% avance</span>
                          </div>
                          <div className="mt8"><PctBar pct={s.porcentaje_avance || 0} /></div>
                        </div>
                      ))
                  }
                </>
            }
          </>}

          {/* ── TAB ADJUNTOS ── */}
          {tabModal === "adjuntos" && <>
            {!tarea?.id
              ? <div className="info-box accent" style={{ fontSize: 12 }}>Guardá la tarea primero para poder adjuntar archivos.</div>
              : <AdjuntosPanel proyectoId={proyectoId} tareaId={tarea.id} notify={() => {}} />
            }
          </>}

        </div>

        <div className="mftr" style={{ justifyContent: "space-between" }}>
          <div>
            {tarea?.id && !confirmEliminar && (
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmEliminar(true)}>✕ Eliminar tarea</button>
            )}
            {tarea?.id && confirmEliminar && (
              <div className="flex-gap">
                <span style={{ fontSize: 11, color: "var(--danger)" }}>¿Confirmar?</span>
                <button className="btn btn-danger btn-sm" onClick={() => onEliminar(tarea.id)}>Sí, eliminar</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmEliminar(false)}>No</button>
              </div>
            )}
          </div>
          <div className="flex-gap">
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar tarea"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PROYECTOS ───────────────────────────────────────────────────────────
function PageProyectos({ onSelectProyecto, notify }) {
  const [proyectos, setProyectos]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroStatus, setFiltroStatus]   = useState("");
  const [eliminandoId, setEliminandoId]   = useState(null);
  const [confirmId, setConfirmId]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProyectos(await api.getProyectos()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = proyectos.filter(p => {
    if (filtroEmpresa && p.empresa !== filtroEmpresa) return false;
    if (filtroStatus  && p.status  !== filtroStatus)  return false;
    return true;
  });

  const handleEliminar = async (e, id) => {
    e.stopPropagation();
    if (confirmId !== id) { setConfirmId(id); return; }
    setEliminandoId(id);
    try {
      await api.eliminarProyecto(id);
      notify("Proyecto eliminado", "warn");
      setConfirmId(null);
      load();
    } catch (err) {
      notify("Error al eliminar: " + err.message, "error");
    } finally {
      setEliminandoId(null);
    }
  };

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

      {loading
        ? <div className="loading"><span className="spin">◌</span> Cargando...</div>
        : filtrados.length === 0
          ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>Sin proyectos</div>
          : filtrados.map(p => {
              const s      = STATUS_PROYECTO[p.status] || { label: p.status, color: "b-gray" };
              const tareas = p.proyecto_tareas || [];
              const pct    = tareas.length ? Math.round(tareas.reduce((a, t) => a + (t.porcentaje_avance || 0), 0) / tareas.length) : 0;
              const atrasada = p.status === "en_curso" && p.fecha_fin && p.fecha_fin < today();
              const esConfirm = confirmId === p.id;
              return (
                <div key={p.id} className={`req-row ${atrasada ? "active-border" : ""}`}
                  onClick={() => { if (confirmId === p.id) { setConfirmId(null); return; } onSelectProyecto(p); }}
                  style={{ position: "relative" }}>
                  <div className="flex-between mb8">
                    <div className="flex-gap">
                      <span className={`badge ${s.color}`}>{s.label}</span>
                      <span className={`badge ${p.tipo === "externo" ? "b-purple" : "b-teal"}`}>{p.tipo}</span>
                      {atrasada && <span className="badge b-red">⚠ Atrasado</span>}
                    </div>
                    <div className="flex-gap">
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{p.empresa}</span>
                      {/* Botón eliminar */}
                      {!esConfirm ? (
                        <button
                          onClick={e => handleEliminar(e, p.id)}
                          disabled={eliminandoId === p.id}
                          title="Eliminar proyecto"
                          style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--r)", color: "var(--muted2)", cursor: "pointer", fontSize: 10, padding: "2px 8px", fontFamily: "var(--sans)", fontWeight: 600, transition: "all .12s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "var(--danger)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                        >
                          {eliminandoId === p.id ? "..." : "✕"}
                        </button>
                      ) : (
                        <div className="flex-gap" onClick={e => e.stopPropagation()}>
                          <span style={{ fontSize: 10, color: "var(--danger)", fontWeight: 600 }}>¿Eliminar?</span>
                          <button className="btn btn-danger btn-sm" onClick={e => handleEliminar(e, p.id)} disabled={eliminandoId === p.id}>
                            {eliminandoId === p.id ? "..." : "Sí"}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setConfirmId(null); }}>No</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="req-title">{p.nombre}</div>
                  <div className="req-meta">
                    {p.cliente    && <span>👤 {p.cliente}</span>}
                    {p.responsable && <><span>·</span><span>👤 {p.responsable}</span></>}
                    {p.fecha_inicio && <><span>·</span><span>{fmtDate(p.fecha_inicio)} → {fmtDate(p.fecha_fin)}</span></>}
                    <span>·</span><span>{tareas.length} tareas</span>
                    {(p.proyecto_recursos || []).length > 0 && <><span>·</span><span>{(p.proyecto_recursos || []).map(r => r.nombre).join(", ")}</span></>}
                    {(p.proyecto_contactos || []).length > 0 && <><span>·</span><span>📧 {(p.proyecto_contactos || []).map(c => c.nombre).join(", ")}</span></>}
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


// ─── ÍCONO POR TIPO DE ARCHIVO ────────────────────────────────────────────────
function FileIcon({ tipo, nombre }) {
  const ext = (nombre || "").split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return <span style={{ color: "#C0392B", fontSize: 16 }}>📄</span>;
  if (["xls","xlsx","csv"].includes(ext)) return <span style={{ color: "#1E7A4A", fontSize: 16 }}>📊</span>;
  if (["doc","docx"].includes(ext)) return <span style={{ color: "#235C96", fontSize: 16 }}>📝</span>;
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return <span style={{ color: "#B07D0A", fontSize: 16 }}>🖼</span>;
  if (["eml","msg"].includes(ext)) return <span style={{ color: "#6381A7", fontSize: 16 }}>✉️</span>;
  return <span style={{ fontSize: 16 }}>📎</span>;
}

function fmtTamanio(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── PANEL DE ADJUNTOS ────────────────────────────────────────────────────────
function AdjuntosPanel({ proyectoId, tareaId = null, notify }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const inputId = `adj-input-${proyectoId}-${tareaId || "proy"}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdjuntos(proyectoId);
      // Si es panel de tarea, filtrar por tareaId; si es panel de proyecto, mostrar los sin tarea
      setAdjuntos(tareaId
        ? data.filter(a => a.tarea_id === tareaId)
        : data.filter(a => !a.tarea_id)
      );
    } finally { setLoading(false); }
  }, [proyectoId, tareaId]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await api.subirAdjunto(file, proyectoId, tareaId);
      }
      notify(`${files.length > 1 ? files.length + " archivos subidos" : "Archivo subido"}`, "success");
      load();
    } catch (e) {
      notify("Error al subir: " + e.message, "error");
    } finally { setUploading(false); }
  };

  const handleEliminar = async (adj) => {
    if (!window.confirm(`¿Eliminar "${adj.nombre}"?`)) return;
    setEliminandoId(adj.id);
    try {
      await api.eliminarAdjunto(adj.id, adj.url);
      notify("Adjunto eliminado", "warn");
      load();
    } catch (e) {
      notify("Error: " + e.message, "error");
    } finally { setEliminandoId(null); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Zona de drop */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => document.getElementById(inputId).click()}
        style={{
          border: "2px dashed var(--border)", borderRadius: "var(--r2)",
          padding: "20px", textAlign: "center", cursor: "pointer",
          background: "var(--surface2)", transition: "all .15s", marginBottom: 12,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blue)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <input
          id={inputId}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={e => handleUpload(e.target.files)}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.eml,.msg,.txt"
        />
        {uploading
          ? <div style={{ fontSize: 12, color: "var(--muted)" }}><span className="spin" style={{ display: "inline-block" }}>◌</span> Subiendo...</div>
          : <div>
              <div style={{ fontSize: 22, marginBottom: 4 }}>📎</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Arrastrá archivos o hacé click para subir</div>
              <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 2 }}>PDF, Word, Excel, imágenes, correos (.eml)</div>
            </div>
        }
      </div>

      {/* Lista de adjuntos */}
      {loading
        ? <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 0" }}>Cargando...</div>
        : adjuntos.length === 0
          ? <div style={{ fontSize: 12, color: "var(--muted2)", padding: "4px 0" }}>Sin adjuntos</div>
          : adjuntos.map(adj => (
              <div key={adj.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: "var(--r)",
                marginBottom: 6, transition: "all .12s",
              }}>
                <FileIcon tipo={adj.tipo} nombre={adj.nombre} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a
                    href={adj.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, fontWeight: 600, color: "var(--blue)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {adj.nombre}
                  </a>
                  <div style={{ fontSize: 10, color: "var(--muted2)" }}>
                    {fmtTamanio(adj.tamanio)}{adj.created_at ? " · " + fmtDate(adj.created_at.slice(0,10)) : ""}
                  </div>
                </div>
                <button
                  onClick={() => handleEliminar(adj)}
                  disabled={eliminandoId === adj.id}
                  style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", fontSize: 14, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--muted2)"}
                >
                  {eliminandoId === adj.id ? "..." : "✕"}
                </button>
              </div>
            ))
      }
    </div>
  );
}

// ─── FULLSCREEN WRAPPER ───────────────────────────────────────────────────────
function FullscreenWrapper({ title, onClose, children }) {
  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fullscreen-overlay">
      <div className="fs-topbar">
        <div className="fs-title">🔲 {title}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Modo presentación</div>
          <button className="fs-btn" onClick={onClose}>✕ Cerrar</button>
        </div>
      </div>
      <div className="fs-content">
        {children}
      </div>
    </div>
  );
}

// ─── PAGE DETALLE ─────────────────────────────────────────────────────────────
function PageDetalle({ proyectoId, onBack, notify }) {
  const [proyecto, setProyecto]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState("gantt");
  const [modalTarea, setModalTarea]   = useState(null);
  const [editProyecto, setEditProyecto] = useState(false);
  const [fullscreen, setFullscreen]   = useState(null); // "gantt" | "detalle" | null

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

  const tareas   = proyecto.proyecto_tareas || [];
  const criticas = calcularCaminoCritico(tareas);
  const pct      = tareas.length ? Math.round(tareas.reduce((a, t) => a + (t.porcentaje_avance || 0), 0) / tareas.length) : 0;
  const atrasadas = tareas.filter(t => t.fecha_fin && t.fecha_fin < today() && t.porcentaje_avance < 100);

  const fechas   = tareas.filter(t => t.fecha_inicio && t.fecha_fin);
  const minFecha = fechas.length ? fechas.reduce((a, t) => t.fecha_inicio < a ? t.fecha_inicio : a, fechas[0].fecha_inicio) : proyecto.fecha_inicio;
  const maxFecha = fechas.length ? fechas.reduce((a, t) => t.fecha_fin   > a ? t.fecha_fin   : a, fechas[0].fecha_fin)   : proyecto.fecha_fin;
  const totalDias = minFecha && maxFecha ? Math.max(diffDays(minFecha, maxFecha), 1) : 90;

  const getBarStyle = (t) => {
    if (!t.fecha_inicio || !t.fecha_fin || !minFecha) return null;
    const left  = (diffDays(minFecha, t.fecha_inicio) / totalDias) * 100;
    const width = Math.max((diffDays(t.fecha_inicio, t.fecha_fin) / totalDias) * 100, 2);
    return { left: `${left}%`, width: `${width}%` };
  };

  const getBarClass = (t) => {
    if (t.porcentaje_avance >= 100) return "done";
    if (criticas.has(t.id))         return "critical";
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

  const cols = `180px ${meses.length > 0 ? `repeat(${meses.length}, 1fr)` : "1fr"}`;

  const handleEliminarTarea = async (id) => {
    try {
      await api.eliminarTarea(id);
      setModalTarea(null);
      notify("Tarea eliminada", "warn");
      load();
    } catch (e) { notify("Error: " + e.message, "error"); }
  };

  return (
    <div>
      <div className="flex-gap mb12">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Volver</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditProyecto(true)}>✏ Editar</button>
        <button className="btn btn-primary btn-sm" onClick={() => setModalTarea({})}>+ Nueva tarea</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setFullscreen("detalle")} style={{ marginLeft: "auto" }} title="Modo presentación">🔲 Presentación</button>
      </div>

      <div className="card mb12">
        <div className="flex-between">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{proyecto.nombre}</div>
            <div className="flex-gap">
              <span className={`badge ${STATUS_PROYECTO[proyecto.status]?.color || "b-gray"}`}>{STATUS_PROYECTO[proyecto.status]?.label}</span>
              <span className={`badge ${proyecto.tipo === "externo" ? "b-purple" : "b-teal"}`}>{proyecto.tipo}</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{proyecto.empresa}</span>
              {proyecto.cliente    && <span style={{ fontSize: 11, color: "var(--muted)" }}>· {proyecto.cliente}</span>}
              {proyecto.responsable && <span style={{ fontSize: 11, color: "var(--muted)" }}>· {proyecto.responsable}</span>}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 600, color: "var(--blue)" }}>{pct}%</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>avance global</div>
          </div>
        </div>
        {(proyecto.proyecto_recursos || []).length > 0 && (
          <div className="flex-gap mt8">{(proyecto.proyecto_recursos || []).map((r, i) => <div key={i} className="recurso-tag">{r.nombre}</div>)}</div>
        )}
        {proyecto.descripcion && <div className="info-box mt8" style={{ fontSize: 12 }}>{proyecto.descripcion}</div>}
        {(proyecto.proyecto_contactos || []).length > 0 && (
          <div className="mt8" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(proyecto.proyecto_contactos || []).map((c, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 10px", fontSize: 11 }}>
                <span style={{ fontWeight: 600, color: "var(--navy)" }}>{c.nombre}</span>
                {c.email && <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()} style={{ color: "var(--blue)", fontSize: 10 }}>{c.email}</a>}
              </div>
            ))}
          </div>
        )}
        <div className="mt8"><PctBar pct={pct} /></div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-label">Tareas</div><div className="stat-value" style={{ color: "var(--blue)" }}>{tareas.length}</div></div>
        <div className="stat"><div className="stat-label">Completadas</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{tareas.filter(t => t.porcentaje_avance >= 100).length}</div></div>
        <div className="stat"><div className="stat-label">Atrasadas</div><div className="stat-value" style={{ color: "var(--danger)" }}>{atrasadas.length}</div></div>
        <div className="stat"><div className="stat-label">Camino crítico</div><div className="stat-value" style={{ color: "var(--warn)" }}>{criticas.size}</div></div>
      </div>

      <div className="tabs-row" style={{ alignItems: "center" }}>
        {[{ id: "gantt", label: "Gantt" }, { id: "lista", label: "Lista de tareas" }, { id: "critico", label: "Camino crítico" }, { id: "adjuntos", label: "📎 Adjuntos" }].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
        {tab === "gantt" && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFullscreen("gantt")}
            style={{ marginLeft: "auto", marginBottom: 2 }}
            title="Ver Gantt en pantalla completa"
          >🔲 Ampliar Gantt</button>
        )}
      </div>

      {tab === "gantt" && (
        <div className="gantt-wrap" style={{ overflowX: "auto" }}>
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
                      <div className="gc-sub">{t.owner ? `🎯 ${t.owner}` : t.responsable || "—"} · {t.duracion_dias}d · {t.porcentaje_avance || 0}%</div>
                    </div>
                    <div className="gc-bars" style={{ gridColumn: `2 / ${meses.length + 2}` }}>
                      {barStyle
                        ? <div className={`bar ${getBarClass(t)}`} style={barStyle}>{t.nombre}</div>
                        : <div style={{ fontSize: 10, color: "var(--muted2)", padding: "0 12px" }}>Sin fechas</div>
                      }
                    </div>
                  </div>
                );
              })
          }
          <div style={{ padding: "10px 16px", display: "flex", gap: 14, borderTop: "1px solid var(--border)", background: "var(--surface2)", flexWrap: "wrap" }}>
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
                    {t.owner && <span>🎯 {t.owner}</span>}
                    {t.responsable && <><span>·</span><span>👤 {t.responsable}</span></>}
                    {t.fecha_inicio && <><span>·</span><span>{fmtDate(t.fecha_inicio)} → {fmtDate(t.fecha_fin)}</span></>}
                    <span>·</span><span>{t.duracion_dias} días hábiles</span>
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
                      <span>·</span><span>{t.duracion_dias} días hábiles</span>
                    </div>
                    <div className="mt8"><PctBar pct={t.porcentaje_avance || 0} critica /></div>
                  </div>
                );
              })
          }
        </div>
      )}

      {tab === "adjuntos" && (
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Adjuntos del proyecto</div>
          <AdjuntosPanel proyectoId={proyectoId} notify={notify} />
        </div>
      )}

      {modalTarea !== null && (
        <TareaModal
          tarea={modalTarea?.id ? modalTarea : null}
          proyectoId={proyectoId}
          tareas={tareas}
          onClose={() => setModalTarea(null)}
          onSave={() => { setModalTarea(null); notify("Tarea guardada", "success"); load(); }}
          onEliminar={handleEliminarTarea}
        />
      )}
      {editProyecto && (
        <ProyectoModal
          proyecto={proyecto}
          onClose={() => setEditProyecto(false)}
          onSave={() => { setEditProyecto(false); notify("Proyecto actualizado", "success"); load(); }}
        />
      )}

      {/* ── FULLSCREEN GANTT ── */}
      {fullscreen === "gantt" && (
        <FullscreenWrapper title={`Gantt — ${proyecto.nombre}`} onClose={() => setFullscreen(null)}>
          <div className="gantt-wrap" style={{ overflowX: "auto" }}>
            <div className="gantt-header" style={{ gridTemplateColumns: cols }}>
              <div className="gh-cell" style={{ textAlign: "left", borderRight: "1px solid var(--border)" }}>Tarea</div>
              {meses.map((m, i) => <div key={i} className="gh-cell">{m}</div>)}
              {meses.length === 0 && <div className="gh-cell">Línea de tiempo</div>}
            </div>
            {tareas.length === 0
              ? <div className="empty-state">Sin tareas</div>
              : tareas.map(t => {
                  const barStyle = getBarStyle(t);
                  return (
                    <div key={t.id} className="gantt-row" style={{ gridTemplateColumns: cols }}>
                      <div className="gc-label">
                        <div className="gc-name">{t.nombre}{criticas.has(t.id) && <span className="cc-badge">CC</span>}</div>
                        <div className="gc-sub">{t.owner ? `🎯 ${t.owner}` : t.responsable || "—"} · {t.duracion_dias}d · {t.porcentaje_avance || 0}%</div>
                      </div>
                      <div className="gc-bars" style={{ gridColumn: `2 / ${meses.length + 2}` }}>
                        {barStyle
                          ? <div className={`bar ${getBarClass(t)}`} style={barStyle}>{t.nombre}</div>
                          : <div style={{ fontSize: 10, color: "var(--muted2)", padding: "0 12px" }}>Sin fechas</div>
                        }
                      </div>
                    </div>
                  );
                })
            }
            <div style={{ padding: "10px 16px", display: "flex", gap: 14, borderTop: "1px solid var(--border)", background: "var(--surface2)", flexWrap: "wrap" }}>
              {[["var(--danger)", "Camino crítico"], ["var(--blue)", "En fecha"], ["var(--accent2)", "Completada"], ["var(--warn)", "Atrasada"]].map(([color, label]) => (
                <div key={label} className="flex-gap"><div style={{ width: 10, height: 10, borderRadius: 2, background: color }} /><span style={{ fontSize: 9, color: "var(--muted)" }}>{label}</span></div>
              ))}
            </div>
          </div>
        </FullscreenWrapper>
      )}

      {/* ── FULLSCREEN DETALLE ── */}
      {fullscreen === "detalle" && (
        <FullscreenWrapper title={proyecto.nombre} onClose={() => setFullscreen(null)}>
          {/* Card resumen */}
          <div className="card mb12">
            <div className="flex-between">
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{proyecto.nombre}</div>
                <div className="flex-gap">
                  <span className={`badge ${STATUS_PROYECTO[proyecto.status]?.color || "b-gray"}`}>{STATUS_PROYECTO[proyecto.status]?.label}</span>
                  <span className={`badge ${proyecto.tipo === "externo" ? "b-purple" : "b-teal"}`}>{proyecto.tipo}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{proyecto.empresa}</span>
                  {proyecto.cliente && <span style={{ fontSize: 11, color: "var(--muted)" }}>· {proyecto.cliente}</span>}
                  {proyecto.responsable && <span style={{ fontSize: 11, color: "var(--muted)" }}>· 👤 {proyecto.responsable}</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 32, fontWeight: 700, color: "var(--blue)" }}>{pct}%</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>avance global</div>
              </div>
            </div>
            <div className="mt8"><PctBar pct={pct} /></div>
          </div>
          {/* Stats */}
          <div className="stats mb12">
            <div className="stat"><div className="stat-label">Tareas</div><div className="stat-value" style={{ color: "var(--blue)" }}>{tareas.length}</div></div>
            <div className="stat"><div className="stat-label">Completadas</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{tareas.filter(t => t.porcentaje_avance >= 100).length}</div></div>
            <div className="stat"><div className="stat-label">Atrasadas</div><div className="stat-value" style={{ color: "var(--danger)" }}>{atrasadas.length}</div></div>
            <div className="stat"><div className="stat-label">Camino crítico</div><div className="stat-value" style={{ color: "var(--warn)" }}>{criticas.size}</div></div>
          </div>
          {/* Gantt */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "var(--surface2)", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase" }}>Gantt</div>
            <div className="gantt-wrap" style={{ overflowX: "auto" }}>
              <div className="gantt-header" style={{ gridTemplateColumns: cols }}>
                <div className="gh-cell" style={{ textAlign: "left", borderRight: "1px solid var(--border)" }}>Tarea</div>
                {meses.map((m, i) => <div key={i} className="gh-cell">{m}</div>)}
                {meses.length === 0 && <div className="gh-cell">Línea de tiempo</div>}
              </div>
              {tareas.map(t => {
                const barStyle = getBarStyle(t);
                return (
                  <div key={t.id} className="gantt-row" style={{ gridTemplateColumns: cols }}>
                    <div className="gc-label">
                      <div className="gc-name">{t.nombre}{criticas.has(t.id) && <span className="cc-badge">CC</span>}</div>
                      <div className="gc-sub">{t.owner ? `🎯 ${t.owner}` : t.responsable || "—"} · {t.duracion_dias}d · {t.porcentaje_avance || 0}%</div>
                    </div>
                    <div className="gc-bars" style={{ gridColumn: `2 / ${meses.length + 2}` }}>
                      {barStyle
                        ? <div className={`bar ${getBarClass(t)}`} style={barStyle}>{t.nombre}</div>
                        : <div style={{ fontSize: 10, color: "var(--muted2)", padding: "0 12px" }}>Sin fechas</div>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FullscreenWrapper>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                         = useState("proyectos");
  const [proyectoSeleccionado, setProyecto]     = useState(null);
  const [notif, setNotif]                       = useState(null);
  const [filtroSidebar, setFiltroSidebar]       = useState("");
  const [sidebarOpen, setSidebarOpen]           = useState(false);

  const notify = useCallback((text, type = "info") => {
    setNotif({ text, type });
    setTimeout(() => setNotif(null), 4000);
  }, []);

  const pageTitles = {
    proyectos: "Todos los proyectos",
    atrasados: "Proyectos atrasados",
    detalle: proyectoSeleccionado?.nombre || "Proyecto",
  };

  const NI = ({ id, icon, label }) => (
    <div className={`ni ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setSidebarOpen(false); }}>
      <span className="ni-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Overlay mobile */}
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

        <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo-wrap">
              <img src="/PL.png" alt="Parana Logística" className="sidebar-logo-img" onError={e => { e.currentTarget.style.display = "none"; }} />
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
            <div key={e}
              className={`ni ${filtroSidebar === e ? "active" : ""}`}
              onClick={() => { setFiltroSidebar(filtroSidebar === e ? "" : e); setPage("proyectos"); setSidebarOpen(false); }}>
              <span className="ni-icon">·</span>
              <span style={{ fontSize: 11 }}>{e}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
            <div className="ni back" onClick={() => window.open(PORTAL_URL, "_self")}>
              <span className="ni-icon">←</span><span>Volver al portal</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", fontFamily: "var(--mono)", letterSpacing: 1, marginTop: 8 }}>PROJECTS v1.1</div>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            {/* Hamburger mobile */}
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menú">
              <span /><span /><span />
            </button>
            <div className="topbar-title">{pageTitles[page] || page}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>G</div>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{USUARIO}</span>
            </div>
          </div>
          <div className="content">
            {(page === "proyectos" || page === "atrasados") && (
              <PageProyectos
                onSelectProyecto={p => { setProyecto(p); setPage("detalle"); }}
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
