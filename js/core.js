/* Núcleo: estado guardado en el navegador, enrutador por hash, estructura común y acciones compartidas. */
(function () {
  const { H, D, TIPOS, LOCS, ME, seed } = DEMO;
  const KEY = 'livera-demo-v2';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = n => Number(n).toLocaleString('es-AR');
  const p2 = n => String(n).padStart(2, '0');
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const fdate = ts => { const d = new Date(ts); return p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2); };
  const fdt = ts => { const d = new Date(ts); return DIAS[d.getDay()] + ' ' + p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); };
  const left = ts => { const ms = ts - Date.now(); if (ms <= 0) return null; return Math.floor(ms / H) + ' h ' + p2(Math.floor(ms % H / 6e4)) + ' m'; };
  const ago = ts => { const h = (Date.now() - ts) / H; if (h < 1) return 'hace minutos'; if (h < 24) return 'hace ' + Math.floor(h) + ' h'; const d = Math.floor(h / 24); return d === 1 ? 'ayer' : 'hace ' + d + ' días'; };

  let S;
  function load() {
    try { const j = JSON.parse(localStorage.getItem(KEY)); if (j && j.v === 2 && Date.now() - j.seededAt < 6 * H) return j; } catch (e) { /* sin almacenamiento: se usa memoria */ }
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ } }
  S = load() || seed();

  const A = window.APP = { S: () => S, save, $, $$, esc, num, p2, fdate, fdt, left, ago, DEMO, routes: {}, acts: {} };
  const root = () => $('#root');

  /* ---------- consultas sobre los datos ---------- */
  A.units = () => S.props.concat(S.lv);
  A.unit = id => A.units().find(u => u.id === id);
  A.agency = id => S.agencies.find(a => a.id === id);
  A.isLV = u => u.id.startsWith('LV-');
  A.title = u => A.isLV(u) ? 'LIVERA · Unidad ' + u.id.slice(3) : u.titulo;
  A.money = u => u.mon === '$' ? '$ ' + num(u.precio) + (u.op === 'alquiler' ? ' /mes' : '') : 'u$s ' + num(u.precio);
  A.mine = () => A.units().filter(u => u.estado === 'bloqueada' && u.by === ME).sort((a, b) => a.exp - b.exp);
  A.blocks = () => A.units().filter(u => u.estado === 'bloqueada');
  A.myConsultas = () => S.consultas.filter(c => c.ag === ME).sort((a, b) => b.ts - a.ts);
  A.esperan = () => S.consultas.filter(c => c.etapa === 'espera');
  function sweep() {
    A.units().forEach(u => { if (u.estado === 'bloqueada' && u.exp && u.exp < Date.now()) { u.estado = 'disponible'; u.by = null; u.exp = null; u.renovada = false; } });
  }

  /* ---------- piezas visuales ---------- */
  A.pill = u => {
    if (u.estado === 'disponible') return '<span class="st ok">Disponible</span>';
    if (u.estado === 'bloqueada') return u.by === ME && S.role === 'inmo' ? '<span class="st mia">Bloqueada por mí</span>' : '<span class="st otra">Bloqueada</span>';
    if (u.estado === 'reservada') return '<span class="st res">Reservada</span>';
    return '<span class="st vend">' + (u.op === 'alquiler' ? 'Alquilada' : 'Vendida') + '</span>';
  };
  A.tm = (ts, pre) => {
    const l = left(ts); const urg = ts - Date.now() < 12 * H;
    return '<span class="tm' + (urg ? ' urg' : '') + '" data-exp="' + ts + '">' + (pre || '') + (l || 'Vencida') + '</span>';
  };
  A.ph = (h, sub, acts) => '<div class="ph"><div><h1>' + h + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</div>';
  A.menu = items => '<div class="mn"><button data-a="mn" aria-haspopup="true" aria-label="Más acciones">⋯</button><div class="pop" hidden>' +
    items.map(i => '<button class="' + (i.d ? 'dg' : '') + '" data-a="' + i.a + '">' + i.t + '</button>').join('') + '</div></div>';
  A.empty = (t, s) => '<div class="empty"><b>' + t + '</b>' + (s || '') + '</div>';

  /* ---------- modal y avisos ---------- */
  A.modal = html => { const m = $('#modal'); m.innerHTML = '<div class="box" role="dialog" aria-modal="true">' + html + '</div>'; m.classList.add('on'); const f = $('input,select,textarea,button.p,.btn', m); f && f.focus(); };
  A.closeModal = () => { const m = $('#modal'); m.classList.remove('on'); m.innerHTML = ''; };
  A.confirm = (o, cb) => {
    A.modal('<h3>' + o.title + '</h3><p class="mut">' + (o.text || '') + '</p><div class="acts"><button class="btn" data-a="close">Cancelar</button><button class="btn ' + (o.danger ? 'd' : 'p') + '" id="okc">' + (o.ok || 'Confirmar') + '</button></div>');
    $('#okc').onclick = () => { A.closeModal(); cb(); };
  };
  let tt;
  A.toast = (msg, err) => { const t = $('#toast'); t.textContent = msg; t.className = 'on' + (err ? ' er' : ''); clearTimeout(tt); tt = setTimeout(() => { t.className = ''; }, 3200); };

  /* ---------- estructura común ---------- */
  const NAV = {
    inmo: () => [['PORTAL'], ['#/panel', 'Panel', 'panel'], ['#/catalogo', 'Catálogo', 'catalogo,ficha'], ['#/livera', 'LIVERA', 'livera', 'nuevo'],
      ['#/consultas', 'Mis consultas', 'consultas', A.myConsultas().filter(c => c.etapa === 'espera').length || ''], ['#/tomadas', 'Mis unidades tomadas', 'tomadas'], ['#/comisiones', 'Mis comisiones', 'comisiones'],
      ['DEMO'], ['#/sistema', 'Guía de estilo', 'sistema']],
    admin: () => [['#/operaciones', 'Operaciones', 'operaciones', A.esperan().length || ''], ['#/adheridas', 'Inmobiliarias', 'adheridas'], ['#/acceso', 'Accesos', 'acceso'], ['#/livera', 'LIVERA', 'livera'], ['#/inversor', 'Panel del inversor', 'inversor'],
      ['DEMO'], ['#/sistema', 'Guía de estilo', 'sistema']]
  };
  const HOME = { inmo: '#/panel', admin: '#/operaciones', inversor: '#/inversor' };
  const ALLOWED = {
    inmo: ['panel', 'catalogo', 'ficha', 'livera', 'consultas', 'tomadas', 'comisiones', 'sistema'],
    admin: ['operaciones', 'adheridas', 'acceso', 'livera', 'inversor', 'ficha', 'sistema'],
    inversor: ['inversor', 'sistema']
  };
  A.logo = '<span class="logo">P</span>';
  A.shell = (content, o) => {
    o = o || {};
    const seg = (location.hash.replace(/^#\/?/, '').split('/')[0]) || '';
    const items = NAV[S.role]().map(i => i.length === 1 ? '<div class="nl">' + i[0] + '</div>'
      : '<a href="' + i[0] + '"' + (i[2].split(',').includes(seg) ? ' class="on"' : '') + '>' + i[1] + (i[3] === 'nuevo' ? '<span class="nuevo">NUEVO</span>' : i[3] ? '<span class="cnt">' + i[3] + '</span>' : '') + '</a>').join('');
    const ag = S.role === 'inmo' ? A.agency(ME) : null;
    const d = new Date();
    return '<div class="app" id="app"><aside class="side" aria-label="Menú"><div class="brand">' + A.logo + '<div><b>PUYELLA</b><small>' + (S.role === 'admin' ? 'Bienes raíces' : 'Red de inmobiliarias') + '</small></div></div>' +
      (S.role === 'admin' ? '<span class="chip-admin">ADMINISTRACIÓN</span>' : '') +
      '<nav class="nav">' + items + '</nav><div class="sp"></div>' +
      '<button class="me" data-a="perfil" aria-label="Cambiar de perfil"><span class="av">' + (ag ? 'RP' : 'MP') + '</span><span><b>' + (ag ? 'Rossi Propiedades' : 'Mariano Puyella') + '</b><small>' + (ag ? 'Mat. 4821 · Adherida' : 'Titular') + '</small></span></button></aside>' +
      '<div class="mainw"><header class="bar"><button class="menu-btn" data-a="drawer" aria-label="Abrir menú"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      (o.crumb ? '<div class="crumb">' + o.crumb + '</div>' : '<h2>' + (o.title || '') + '</h2>') +
      (o.search || '<div class="fl"></div>') +
      '<span class="date">' + DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + '</span>' +
      '<button class="av" data-a="perfil" aria-label="Cambiar de perfil" style="border:0;cursor:pointer">' + (ag ? 'RP' : 'MP') + '</button></header>' +
      '<main class="page" id="main">' + content + '</main></div></div>';
  };
  A.searchBox = (id, val, ph) => '<div class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="' + id + '" type="search" value="' + esc(val || '') + '" placeholder="' + esc(ph) + '" aria-label="' + esc(ph) + '"></div>';

  /* ---------- enrutador ---------- */
  let lastRoute = '';
  function render(keepScroll) {
    sweep();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    let name = parts[0] || '';
    const pub = ['login', 'alta', 'sistema'];
    if (!S.role) { if (!pub.includes(name)) name = 'login'; }
    else if (!name || name === 'login' || !ALLOWED[S.role].includes(name)) { const h = HOME[S.role]; if (location.hash !== h) { location.hash = h; return; } name = h.slice(2); }
    const r = A.routes[name];
    if (!r) { location.hash = S.role ? HOME[S.role] : '#/login'; return; }
    const y = window.scrollY;
    const out = r(parts.slice(1));
    root().innerHTML = out.html;
    document.title = (out.doc ? out.doc + ' · ' : '') + 'Red de inmobiliarias · Puyella';
    out.bind && out.bind(root());
    const key = name + '/' + parts.slice(1).join('/');
    if (keepScroll || key === lastRoute) window.scrollTo(0, y); else window.scrollTo(0, 0);
    lastRoute = key;
    $('#app') && $('#app').classList.remove('open');
  }
  A.refresh = () => render(true);
  addEventListener('hashchange', () => { A.closeModal(); render(false); });

  /* ---------- acciones compartidas ---------- */
  A.acts.mn = t => { const p = t.nextElementSibling; const open = !p.hidden; $$('.pop').forEach(x => x.hidden = true); p.hidden = open; };
  A.acts.close = () => A.closeModal();
  A.acts.drawer = () => $('#app').classList.toggle('open');
  A.acts.go = (h) => { location.hash = h; };
  A.acts.perfil = () => A.modal('<h3>Ver la demo como…</h3><p class="mut">Elegí un perfil. Los datos son de ejemplo y se guardan solo en este navegador.</p>' +
    '<div class="grid mt"><button class="btn w" data-a="rol:inmo">Inmobiliaria adherida</button><button class="btn w" data-a="rol:admin">Administración de Puyella</button><button class="btn w" data-a="rol:inversor">Panel del inversor</button></div>' +
    '<div class="acts"><button class="lk" data-a="reset">Reiniciar los datos de ejemplo</button><button class="btn" data-a="close">Cerrar</button></div>');
  A.acts.rol = r => { A.closeModal(); S.role = r; save(); location.hash = HOME[r]; if (location.hash === HOME[r]) render(false); };
  A.acts.reset = () => { const role = S.role; S = seed(); S.role = role; save(); A.closeModal(); A.toast('Datos de ejemplo reiniciados'); render(true); };
  A.acts.salir = () => { S.role = null; save(); location.hash = '#/login'; render(false); };

  A.acts.tomar = id => {
    const u = A.unit(id); if (!u) return;
    if (u.estado !== 'disponible') { A.toast('Esa unidad ya no está disponible', true); A.refresh(); return; }
    u.estado = 'bloqueada'; u.by = ME; u.exp = Date.now() + 48 * H; u.renovada = false; save();
    A.toast('Unidad tomada: queda bloqueada 48 h para tu inmobiliaria'); A.refresh();
  };
  A.acts.renovar = id => {
    const u = A.unit(id); if (!u || u.renovada) return;
    u.exp = Date.now() + 48 * H; u.renovada = true; save(); A.toast('Bloqueo renovado 48 h más'); A.refresh();
  };
  A.acts.liberar = id => {
    const u = A.unit(id); if (!u) return;
    const who = S.role === 'admin' ? 'La unidad vuelve a la cartera y queda disponible para toda la red.' : 'Queda disponible para toda la red y otra inmobiliaria puede tomarla.';
    A.confirm({ title: 'Liberar ' + A.title(u) + '?', text: who, ok: 'Liberar', danger: true }, () => {
      u.estado = 'disponible'; u.by = null; u.exp = null; u.renovada = false; save(); A.toast('Unidad liberada'); A.refresh();
    });
  };
  A.acts.avisar = id => { S.avisos[id] = !S.avisos[id]; save(); A.toast(S.avisos[id] ? 'Te avisamos por el portal cuando se libere' : 'Aviso desactivado'); A.refresh(); };
  A.acts.ficha = id => {
    const u = A.unit(id); if (!u) return;
    const ag = A.agency(ME);
    const txt = (A.isLV(u) ? 'LIVERA · Unidad ' + u.id.slice(3) : u.titulo + ' · ' + u.loc) + (A.isLV(u) ? '' : ' — ' + A.money(u)) + '\n' + ag.nombre + ' · 336 15 442 3907';
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  };
  A.acts.demo = m => A.toast(m || 'En la versión real, esta acción se conecta al sistema');
  A.acts.reg = id => A.registrar(id);

  const norm = v => { let d = String(v).replace(/\D/g, ''); if (d.length === 12 && d.slice(3, 5) === '15') d = d.slice(0, 3) + d.slice(5); return d.slice(-10); };
  A.registrar = id => {
    const opts = A.units().filter(u => !['vendida'].includes(u.estado)).map(u => '<option value="' + u.id + '"' + (u.id === id ? ' selected' : '') + '>' + esc(A.isLV(u) ? u.id + ' · LIVERA' : u.id + ' · ' + u.titulo) + '</option>').join('');
    A.modal('<h3>Registrar al comprador</h3><p class="mut">Con el teléfono alcanza. La respuesta es inmediata y nunca dice de quién es un registro ajeno.</p>' +
      '<form id="fr" class="mt" novalidate><label class="fld"><span class="lab">Propiedad</span><select class="in" id="rp">' + opts + '</select></label>' +
      '<label class="fld"><span class="lab">Teléfono del comprador</span><input class="in" id="rt" inputmode="tel" autocomplete="off" placeholder="336 15 000 0000"></label>' +
      '<div id="rr" aria-live="polite"></div><p class="hint">Para probar el rechazo: 336 400 0111 ya está registrado por otra inmobiliaria.</p>' +
      '<div class="acts"><button type="button" class="btn" data-a="close">Cerrar</button><button class="btn p" type="submit">Registrar</button></div></form>');
    $('#fr').onsubmit = e => {
      e.preventDefault();
      const ph = norm($('#rt').value), pid = $('#rp').value, out = $('#rr');
      if (ph.length < 10) { out.innerHTML = '<div class="note err">Revisá el número: necesitamos código de área y teléfono (10 dígitos).</div>'; return; }
      const k = pid + '|' + ph, ex = S.registro[k];
      if (ex && ex !== ME) out.innerHTML = '<div class="note err"><span><b>Registro rechazado.</b> Ese comprador ya está registrado para esta propiedad. No se informa por quién ni desde cuándo.</span></div>';
      else if (ex === ME) out.innerHTML = '<div class="note"><span>Ya lo habías registrado vos para esta propiedad.</span></div>';
      else { S.registro[k] = ME; save(); out.innerHTML = '<div class="note" style="background:#e1f1e8"><span><b>Registrado.</b> Queda asentado que este comprador es tuyo para esta propiedad.</span></div>'; }
    };
  };

  /* ---------- eventos globales ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a]');
    if (!e.target.closest('.mn')) $$('.pop').forEach(x => x.hidden = true);
    if (e.target.id === 'modal') { A.closeModal(); return; }
    const ap = $('#app'); if (ap && ap.classList.contains('open') && !e.target.closest('.side,.menu-btn')) ap.classList.remove('open');
    if (!t) return;
    const [fn, ...args] = t.dataset.a.split(':');
    if (A.acts[fn]) { if (t.tagName === 'A') e.preventDefault(); A.acts[fn](...args, t, e); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { A.closeModal(); $$('.pop').forEach(x => x.hidden = true); const a = $('#app'); a && a.classList.remove('open'); } });
  setInterval(() => {
    let vencio = false;
    $$('[data-exp]').forEach(el => { const ts = +el.dataset.exp, l = left(ts); if (!l) vencio = true; else { el.textContent = (el.dataset.pre || '') + l; el.classList.toggle('urg', ts - Date.now() < 12 * H); } });
    if (vencio) A.refresh();
  }, 30000);

  A.start = () => { if (!location.hash) location.hash = S.role ? HOME[S.role] : '#/login'; render(false); };
  A.HOME = HOME;
})();
