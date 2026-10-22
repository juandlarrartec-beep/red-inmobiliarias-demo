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

  /* ---------- iconos, fotos y gráficos ---------- */
  const IC = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6', grid: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
    building: 'M5 21V4h9v17M14 9h5v12M3 21h18M8 8h2M8 12h2M8 16h2M16.5 13h.5M16.5 17h.5', chat: 'M4 5h16v11H9.5L5 20v-4H4z',
    more: 'M5 12h.01M12 12h.01M19 12h.01', wallet: 'M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3M3 7.5V18a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5.5A2.5 2.5 0 0 1 3 7.5zM16 14.5h2',
    lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16.5 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.8 3 2.6 3 4.7',
    chart: 'M4 20V10M10 20V4M16 20v-7M21 20H3', ops: 'M4 6h16M4 12h10M4 18h6', back: 'M15 5l-7 7 7 7', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
    filter: 'M4 6h16M7 12h10M10 18h4', apt: 'M6 21V3h12v18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3', house: 'M3 11l9-7 9 7v9H3zM9 20v-6h6v6',
    land: 'M3 18l5-8 4 5 3-4 6 7zM3 21h18', store: 'M4 9l1-5h14l1 5M4 9h16v11H4zM9 20v-6h6v6', warehouse: 'M3 9l9-5 9 5v11H3zM7 20v-6h10v6M7 17h10',
    office: 'M5 21V8l7-4 7 4v13M9 12h2M13 12h2M9 16h2M13 16h2', key: 'M14.5 9.5a4.5 4.5 0 1 1-3.4 7.5L4 17v-3l2-.5V12l2-.5.8-.9A4.5 4.5 0 0 1 14.5 9.5z', plus: 'M12 5v14M5 12h14',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
  };
  A.ic = (n, sz) => '<svg class="ic" width="' + (sz || 22) + '" height="' + (sz || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (n === 'more' ? 3 : 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + IC[n] + '"/></svg>';
  A.tipoIc = t => ({ Departamentos: 'apt', Casas: 'house', Terrenos: 'land', Lotes: 'land', Locales: 'store', 'Naves industriales': 'warehouse', 'Proyectos comerciales': 'office' }[t] || 'building');
  const POOL = { dext: 5, sala: 5, cocina: 2, dorm: 3, bano: 2, casa: 11, terreno: 5, local: 3, nave: 4, comercial: 4, obra: 3 };
  const F = (k, n) => 'img/fotos/' + k + '-' + String(((n % POOL[k]) + POOL[k]) % POOL[k] + 1).padStart(2, '0') + '.webp';
  A.F = F;
  const hsh = id => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  A.fotos = u => {
    const h = hsh(u.id);
    if (A.isLV(u)) { const f = +u.id.slice(3, 4); return [F('dext', 4 + f), F('sala', h), F('cocina', h), F('dorm', h)]; }
    switch (u.tipo) {
      case 'Departamentos': return h % 2 ? [F('dext', h), F('sala', h), F('cocina', h), F('dorm', h)] : [F('sala', h), F('cocina', h + 1), F('dorm', h + 1), F('bano', h)];
      case 'Casas': return [F('casa', h), F('sala', h + 2), F('cocina', h), F('dorm', h + 1)];
      case 'Terrenos': case 'Lotes': return [F('terreno', h), F('terreno', h + 1), F('terreno', h + 2), F('terreno', h + 3)];
      case 'Locales': return [F('local', h), F('local', h + 1), F('local', h + 2), F('dext', h)];
      case 'Naves industriales': return [F('nave', h), F('nave', h + 1), F('nave', h + 2), F('nave', h + 3)];
      default: return [F('comercial', h), F('comercial', h + 1), F('comercial', h + 2), F('obra', h)];
    }
  };
  A.pic = (src, alt, cls, st) => '<span class="pic ph-img ' + (cls || '') + '"' + (st ? ' style="' + st + '"' : '') + '><img src="' + src + '" alt="' + esc(alt || '') + '" loading="lazy" decoding="async" onerror="this.remove()"></span>';
  A.thumb = (u, cls) => A.pic(A.fotos(u)[0], A.title(u), 'th ' + (cls || ''));
  const COLS = ['#0047d6', '#19784c', '#8a5a00', '#6b3fa0', '#b3261e', '#006b7a', '#5b5850'];
  A.avatar = (a, big) => '<span class="avt' + (big ? ' big' : '') + '" style="background:' + COLS[hsh(a.id) % COLS.length] + '">' + a.nombre.split(/[ &]+/).filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('') + '</span>';
  A.ring = u => {
    const rest = Math.max(0, Math.min(1, (u.exp - Date.now()) / (48 * H))), urg = u.exp - Date.now() < 12 * H, C = 2 * Math.PI * 22;
    return '<span class="ring" data-ring="' + u.exp + '"><svg viewBox="0 0 56 56" width="60" height="60" role="img" aria-label="Tiempo restante del bloqueo"><circle cx="28" cy="28" r="22" fill="none" stroke="#e4e1d6" stroke-width="6"/><circle class="rf" cx="28" cy="28" r="22" fill="none" stroke="' + (urg ? '#cd181f' : '#0047d6') + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (rest * C).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 28 28)"/></svg><b>' + Math.max(0, Math.round((u.exp - Date.now()) / H)) + '<small>h</small></b></span>';
  };
  const STEPS = { espera: 1, visita: 2, oferta: 3, sena: 4, boleto: 5, cerrada: 5, caida: 2 };
  A.steps = e => '<span class="steps5" role="img" aria-label="Etapa ' + STEPS[e] + ' de 5">' + [1, 2, 3, 4, 5].map(i => '<i class="' + (i <= STEPS[e] ? (e === 'caida' ? 'x' : 'on') : '') + '"></i>').join('') + '</span>';

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
    const tabs = S.role === 'inmo' ? [['#/panel', 'Inicio', 'home', 'panel'], ['#/catalogo', 'Catálogo', 'grid', 'catalogo'], ['#/livera', 'Livera', 'building', 'livera'], ['#/consultas', 'Consultas', 'chat', 'consultas', A.myConsultas().filter(c => c.etapa === 'espera').length]]
      : [['#/operaciones', 'Operaciones', 'ops', 'operaciones', A.esperan().length], ['#/adheridas', 'Red', 'users', 'adheridas'], ['#/acceso', 'Accesos', 'lock', 'acceso'], ['#/livera', 'Livera', 'grid', 'livera']];
    const moreOn = S.role === 'inmo' ? ['tomadas', 'comisiones', 'sistema'].includes(seg) : ['inversor', 'sistema'].includes(seg);
    const tabbar = '<nav class="tabbar" aria-label="Navegación principal">' + tabs.map(t => '<a href="' + t[0] + '"' + (seg === t[3] ? ' class="on" aria-current="page"' : '') + '>' + A.ic(t[2], 24) + '<span>' + t[1] + '</span>' + (t[4] ? '<em>' + t[4] + '</em>' : '') + '</a>').join('') +
      '<button data-a="mas"' + (moreOn ? ' class="on"' : '') + '>' + A.ic('more', 24) + '<span>Más</span></button></nav>';
    return '<div class="app' + (o.detail ? ' detail' : '') + '" id="app"><aside class="side" aria-label="Menú"><div class="brand">' + A.logo + '<div><b>PUYELLA</b><small>' + (S.role === 'admin' ? 'Bienes raíces' : 'Red de inmobiliarias') + '</small></div></div>' +
      (S.role === 'admin' ? '<span class="chip-admin">ADMINISTRACIÓN</span>' : '') +
      '<nav class="nav">' + items + '</nav><div class="sp"></div>' +
      '<button class="me" data-a="perfil" aria-label="Cambiar de perfil"><span class="av">' + (ag ? 'RP' : 'MP') + '</span><span><b>' + (ag ? 'Rossi Propiedades' : 'Mariano Puyella') + '</b><small>' + (ag ? 'Mat. 4821 · Adherida' : 'Titular') + '</small></span></button></aside>' +
      '<div class="mainw"><header class="bar">' + (o.back ? '<button class="back-btn" data-a="back:' + o.back + '" aria-label="Volver">' + A.ic('back', 26) + '</button>' : '') +
      (o.crumb ? '<div class="crumb">' + o.crumb + '</div>' : '') + '<h2 class="ttl' + (o.crumb ? ' hascrumb' : '') + '">' + (o.title || '') + '</h2>' +
      (o.search || '<div class="fl"></div>') +
      '<span class="date">' + DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + '</span>' +
      '<button class="av" data-a="perfil" aria-label="Cambiar de perfil" style="border:0;cursor:pointer">' + (ag ? 'RP' : 'MP') + '</button></header>' +
      '<main class="page" id="main">' + content + '</main>' + tabbar + '</div></div>';
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
    if (A.hist[A.hist.length - 1] !== location.hash) A.hist.push(location.hash);
    if (A.hist.length > 30) A.hist.shift();
    $('#app') && $('#app').classList.remove('open');
  }
  A.refresh = () => render(true);
  addEventListener('hashchange', () => { A.closeModal(); render(false); });

  /* ---------- acciones compartidas ---------- */
  A.acts.mn = t => { const p = t.nextElementSibling; const open = !p.hidden; $$('.pop').forEach(x => x.hidden = true); p.hidden = open; };
  A.acts.close = () => A.closeModal();
  A.acts.drawer = () => $('#app').classList.toggle('open');
  A.acts.go = (h) => { location.hash = h; };
  A.hist = [];
  A.acts.back = fb => { const prev = A.hist.length > 1 ? A.hist[A.hist.length - 2] : null; if (prev && prev !== location.hash) { A.hist.length -= 2; location.hash = prev; } else location.hash = fb; };
  A.acts.mas = () => {
    const l = S.role === 'inmo' ? [['#/tomadas', 'Mis unidades tomadas', 'Bloqueos activos y tiempo restante', 'lock'], ['#/comisiones', 'Mis comisiones', 'Qué cobrás y cuándo', 'wallet'], ['#/sistema', 'Guía de estilo', 'Colores, tipografías y estados', 'star']]
      : [['#/inversor', 'Panel del inversor', 'Cómo lo ve el inversor', 'chart'], ['#/sistema', 'Guía de estilo', 'Colores, tipografías y estados', 'star']];
    A.modal('<h3>Más opciones</h3><div class="sheet">' + l.map(i => '<a href="' + i[0] + '">' + A.ic(i[3], 24) + '<span><b>' + i[1] + '</b><small>' + i[2] + '</small></span></a>').join('') + '<button data-a="perfil">' + A.ic('users', 24) + '<span><b>Cambiar de perfil</b><small>Inmobiliaria, administración o inversor</small></span></button></div><div class="acts"><button class="btn" data-a="close">Cerrar</button></div>');
  };
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
    $$('[data-ring]').forEach(el => { const ts = +el.dataset.ring, C = 2 * Math.PI * 22, rest = Math.max(0, Math.min(1, (ts - Date.now()) / (48 * H))); const c = $('.rf', el); c.setAttribute('stroke-dasharray', (rest * C).toFixed(1) + ' ' + C.toFixed(1)); c.setAttribute('stroke', ts - Date.now() < 12 * H ? '#cd181f' : '#0047d6'); $('b', el).firstChild.nodeValue = Math.max(0, Math.round((ts - Date.now()) / H)); });
    $$('[data-exp]').forEach(el => { const ts = +el.dataset.exp, l = left(ts); if (!l) vencio = true; else { el.textContent = (el.dataset.pre || '') + l; el.classList.toggle('urg', ts - Date.now() < 12 * H); } });
    if (vencio) A.refresh();
  }, 30000);

  A.start = () => { if (!location.hash) location.hash = S.role ? HOME[S.role] : '#/login'; render(false); };
  A.HOME = HOME;
})();
