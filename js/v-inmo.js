/* Pantallas de la inmobiliaria adherida (más ingreso, alta y guía de estilo). */
(function () {
  const A = APP, { esc, num, $, $$, fdate, fdt, left, ago } = APP, { H, D } = DEMO;
  const S = () => A.S();
  const ME = DEMO.ME, TIPOS = DEMO.TIPOS, LOCS = DEMO.LOCS;
  const R = A.routes;
  const stageLbl = { espera: ['Espera respuesta', 'rs'], visita: ['Visita', 'az'], oferta: ['Oferta', 'az'], sena: ['Seña', 'vd'], boleto: ['Boleto', 'vd'], cerrada: ['Cerrada', 'gr'], caida: ['Caída', 'gr'] };
  A.stagePill = e => '<span class="st ' + stageLbl[e][1] + '">' + stageLbl[e][0] + '</span>';
  const pillCom = e => '<span class="st ' + { pendiente: 'rs', facturada: 'az', cobrada: 'vd' }[e] + '">' + { pendiente: 'Pendiente', facturada: 'Facturada', cobrada: 'Cobrada' }[e] + '</span>';
  const money$ = n => 'u$s ' + num(n);
  const k = n => (n / 1000).toFixed(1).replace('.', ',') + ' k';

  /* ---------- ingreso ---------- */
  R.login = () => ({
    doc: 'Ingreso',
    html: '<div class="top2"><span class="logo">P</span><b>PUYELLA</b><span>Red de inmobiliarias</span><div class="fl"></div><span>Soporte · 336 442 1180</span></div>' +
      '<div class="login"><div class="l"><div class="lab" style="color:var(--rojo2)">Acceso para inmobiliarias adheridas</div>' +
      '<h1>Comercializá la cartera de Puyella y el proyecto LIVERA</h1>' +
      '<p class="lead">Una sola lista de precios para toda la red, bloqueo de unidades por 48 horas y registro de comprador en el acto. Puyella cierra las operaciones; tu inmobiliaria cobra su comisión.</p>' +
      '<div class="steps"><div><b>01</b><span>Tomás la unidad y queda bloqueada para tu inmobiliaria mientras cerrás.</span></div><div><b>02</b><span>Registrás al comprador y queda asentado que es tuyo, con respuesta inmediata.</span></div><div><b>03</b><span>Mandás la ficha por WhatsApp con tu logo y tu teléfono.</span></div></div>' +
      '<div class="mosaic">' + A.pic(A.F('dext', 4), 'Edificio', 'm1') + A.pic(A.F('casa', 0), 'Casa', 'm2') + A.pic(A.F('sala', 1), 'Departamento', 'm3') + '</div></div>' +
      '<div class="r"><div style="max-width:440px"><h2 class="h3" style="font-size:26px;letter-spacing:.02em;text-transform:uppercase">Ingresar</h2><p class="mut" style="margin-bottom:22px">Con el mail que Puyella habilitó para tu inmobiliaria.</p>' +
      '<form id="lf" novalidate><label class="fld"><span class="lab">Mail</span><input class="in" id="lm" type="email" value="ventas@rossipropiedades.com.ar" autocomplete="username"></label>' +
      '<label class="fld"><span class="lab">Contraseña</span><span style="position:relative;display:block"><input class="in" id="lp" type="password" value="demo1234" autocomplete="current-password" style="padding-right:72px"><button type="button" class="lk" data-a="ver" style="position:absolute;right:14px;top:12px;font:500 12px var(--mono);letter-spacing:.1em">VER</button></span></label>' +
      '<div class="ln" style="margin-bottom:18px;flex-wrap:wrap"><label class="chk"><input type="checkbox" checked> Mantener la sesión abierta</label><button type="button" class="lk" data-a="demo:Es una demo: no hace falta recuperar la contraseña">¿Olvidaste la contraseña?</button></div>' +
      '<button class="btn p w" type="submit" style="min-height:52px">Entrar al portal</button></form>' +
      '<div class="demo-as"><div class="lab az">Ver la demo como</div><div class="row"><button class="btn sm" data-a="rol:admin">Administración de Puyella</button><button class="btn sm" data-a="rol:inversor">Panel del inversor</button></div></div>' +
      '<div class="demo-as"><div class="lab">Tu inmobiliaria no está en la red</div><p class="mut" style="margin:8px 0 14px">Puyella suma inmobiliarias matriculadas de San Nicolás y la zona. El alta la revisa y la aprueba Puyella.</p><a class="btn w" href="#/alta">Solicitar el alta</a></div></div></div></div>',
    bind: r => { $('#lf', r).onsubmit = e => { e.preventDefault(); if (!/.+@.+\..+/.test($('#lm').value)) { A.toast('Revisá el mail', true); return; } A.acts.rol('inmo'); }; }
  });
  A.acts.ver = () => { const i = $('#lp'); i.type = i.type === 'password' ? 'text' : 'password'; };

  R.alta = () => ({
    doc: 'Alta de inmobiliaria',
    html: '<div class="top2"><span class="logo">P</span><b>PUYELLA</b><div class="fl"></div><span>1 · Datos de la inmobiliaria</span><span style="opacity:.6">2 · Documentación</span><span style="opacity:.6">3 · Revisión de Puyella</span></div>' +
      '<div class="page" style="max-width:1180px;margin:0 auto"><div class="grid g21 ais"><div>' +
      A.ph('Alta de inmobiliaria', 'Completá el perfil con el que tu inmobiliaria va a figurar en la red y con el que se van a armar las fichas que mandás a tus compradores.') +
      '<form id="af" novalidate><div class="card"><div class="lab">Datos de la inmobiliaria</div><div class="grid g2">' +
      [['Nombre de la inmobiliaria *', 'an', 'text', 'Rossi Propiedades'], ['Martillero responsable *', 'am', 'text', 'Hugo A. Rossi'], ['Matrícula *', 'at', 'text', 'MAT. 4821'], ['Colegio *', 'ac', 'text', 'C.M.C.P. San Nicolás'], ['Domicilio de la oficina *', 'ad', 'text', 'Bartolomé Mitre 268'], ['Localidad *', 'al', 'text', 'San Nicolás'], ['Teléfono *', 'atl', 'tel', '336 442 3907'], ['WhatsApp para las fichas *', 'aw', 'tel', '336 15 442 3907'], ['Mail *', 'ae', 'email', 'ventas@rossipropiedades.com.ar'], ['Web o Instagram', 'ai', 'text', '']].map(f =>
        '<label class="fld"><span class="lab">' + f[0] + '</span><input class="in" id="' + f[1] + '" type="' + f[2] + '" value="' + esc(f[3]) + '"' + (f[0].includes('*') ? ' required' : ' placeholder="@rossipropiedades"') + '></label>').join('') + '</div></div>' +
      '<div class="card mt"><div class="lab">Logo de la inmobiliaria</div><div class="logo-row"><div class="ph-img" style="height:120px;border-radius:14px;border:2px dashed var(--hueso)">Arrastrá el logo<br>PNG o SVG · fondo claro</div><div><p>Tu logo y tu teléfono son los que salen en las fichas que mandás por WhatsApp. Las fichas no llevan datos de Puyella: el comprador es tuyo y te contesta a vos.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><span class="pill-c az">Matrícula vigente</span><span class="pill-c az">Constancia de inscripción AFIP</span><span class="pill-c">CBU para liquidar comisiones</span></div></div></div></div>' +
      '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:22px"><button class="btn p" type="submit">Enviar la solicitud</button><button class="btn" type="button" data-a="demo:Borrador guardado en este navegador">Guardar borrador</button><span class="mut">Podés completar la documentación después.</span></div></form></div>' +
      '<aside class="grid"><div class="card"><div class="lab" style="color:var(--rojo2)">El alta la aprueba Puyella</div><p style="margin-bottom:14px">La inmobiliaria se registra; no se habilita sola. Puyella revisa la matrícula y firma el acuerdo de comercialización antes de dar acceso a la cartera.</p>' +
      '<ol style="list-style:none;padding:0">' + ['Enviás la solicitud.', 'Puyella verifica matrícula y datos.', 'Se firma el acuerdo y se define qué cartera ves.', 'Te llega el acceso al portal.'].map((t, i) => '<li style="display:flex;gap:12px;padding:6px 0"><b class="mono" style="color:var(--rojo2);font-weight:500">0' + (i + 1) + '</b><span>' + t + '</span></li>').join('') + '</ol></div>' +
      '<div><div class="lab">Mientras tanto</div><p style="margin-top:8px">El estado de tu solicitud queda visible acá y te avisamos por mail. La revisión demora entre 24 y 72 horas hábiles.</p></div>' +
      '<p class="lab">Consultas del alta · altas@puyella.com.ar · 336 442 1180</p><a class="lk" href="#/login">← Volver al ingreso</a></aside></div></div>',
    bind: r => { $('#af', r).onsubmit = e => { e.preventDefault(); const miss = $$('[required]', r).filter(i => !i.value.trim()); if (miss.length) { miss[0].focus(); A.toast('Completá los campos obligatorios', true); return; } $('#af').innerHTML = '<div class="card"><h2 class="h3">Solicitud enviada</h2><p class="mut mt">Puyella revisa la matrícula y los datos. Te avisamos por mail en 24 a 72 horas hábiles.</p><p class="mt"><a class="btn" href="#/login">Volver al ingreso</a></p></div>'; }; }
  });

  /* ---------- panel ---------- */
  A.acts.cat = t => { A.catF.tipo = t; A.catF.op = 'todos'; A.catF.q = ''; location.hash = '#/catalogo'; };
  R.panel = () => {
    const s = S(), mine = A.mine(), cons = A.myConsultas(), abiertas = cons.filter(c => !['cerrada', 'caida', 'boleto'].includes(c.etapa));
    const esp = cons.filter(c => c.etapa === 'espera').length;
    const aCobrar = s.coms.filter(x => x.estado !== 'cobrada' && x.mon === 'u').reduce((a, x) => a + x.com, 0);
    const anio = new Date().getFullYear();
    const cobAnio = s.coms.filter(x => x.estado === 'cobrada' && x.mon === 'u' && new Date(x.cierre).getFullYear() === anio).reduce((a, x) => a + x.com, 0);
    const mesCom = new Date().toLocaleDateString('es-AR', { month: 'long' });
    const disp = s.props.filter(p => p.estado === 'disponible'), lv = s.lv;
    const cnt = st => lv.filter(u => u.estado === st).length;
    const tipoCnt = TIPOS.map(t => [t, disp.filter(p => p.tipo === t).length]);
    const seg = (st, c) => '<i style="width:' + (100 * cnt(st) / lv.length) + '%;background:' + c + '"></i>';
    const urg = mine.filter(u => u.exp - Date.now() < 12 * H);
    const sum = e => s.coms.filter(x => x.estado === e && x.mon === 'u').reduce((a, x) => a + x.com, 0);
    const tot = sum('pendiente') + sum('facturada') + sum('cobrada');
    const alertas = (urg.length || esp) ? '<div class="card alert" style="margin-bottom:18px"><div class="lab" style="color:var(--rojo2)">Requiere tu atención</div>' +
      urg.map(u => '<a href="#/ficha/' + u.id + '" class="al">' + A.ring(u) + '<span><b>' + esc(A.title(u)) + '</b><small>El bloqueo vence pronto. Renovalo o liberalo.</small></span><span class="go">›</span></a>').join('') +
      (esp ? '<a href="#/consultas" class="al"><span class="ic-c">' + A.ic('chat', 26) + '</span><span><b>' + esp + (esp === 1 ? ' consulta espera' : ' consultas esperan') + ' respuesta</b><small>Puyella todavía no las tomó.</small></span><span class="go">›</span></a>' : '') + '</div>' : '';
    return {
      doc: 'Panel',
      html: A.shell(
        A.ph('Buen día, Rossi Propiedades', 'Tenés ' + mine.length + ' unidades tomadas, ' + esp + ' consultas esperando respuesta y ' + money$(aCobrar) + ' a cobrar.', '<a class="btn" href="#/catalogo">Ver catálogo</a><button class="btn p" data-a="reg">Registrar comprador</button>') +
        '<div class="qa">' + [['grid', 'Catálogo', 'go:#/catalogo'], ['plus', 'Registrar comprador', 'reg'], ['building', 'Livera', 'go:#/livera'], ['chat', 'Consultas', 'go:#/consultas']].map((q, i) => '<button data-a="' + q[2] + '" class="' + (i === 1 ? 'hot' : '') + '"><span>' + A.ic(q[0], 26) + '</span>' + q[1] + '</button>').join('') + '</div>' +
        alertas +
        '<div class="card"><div class="ln"><span class="lab">Stock disponible para comercializar · ' + disp.length + ' unidades</span><a class="lab" href="#/catalogo" data-a="cat:todos">Ver todo el catálogo</a></div>' +
        '<div class="tiles">' + tipoCnt.map(x => '<button data-a="cat:' + x[0] + '" class="tile"><span class="ti">' + A.ic(A.tipoIc(x[0]), 22) + '</span><span class="big">' + x[1] + '</span><span class="tn">' + x[0] + '</span></button>').join('') +
        '<a href="#/livera" class="tile lvt"><span class="ti">' + A.ic('building', 22) + '</span><span class="big">' + cnt('disponible') + '</span><span class="tn">LIVERA · unidades de ejemplo</span></a></div></div>' +
        '<div class="card dark lvcard mt" id="lvcard"><div class="lvimg">' + A.pic(A.F('dext', 4), 'Render de LIVERA') + '</div>' +
        '<div style="padding:26px 28px"><div class="ln" style="flex-wrap:wrap;justify-content:flex-start;gap:8px"><span class="pill-c rj">Proyecto LIVERA</span><span class="pill-c" style="background:#ffffff1f;color:#e8e6df">Datos de ejemplo</span><span class="lab" style="margin-left:auto">Lista vigente <b style="color:#fff;font:600 20px var(--sans);letter-spacing:0;display:block;text-align:right;text-transform:none">01/09/2026</b></span></div>' +
        '<h2 class="h3" style="font-size:28px;margin:10px 0 8px">Ya podés ofrecer LIVERA a tus compradores</h2><p style="color:#d8d5c9;max-width:680px">Puyella tiene la licencia de comercialización del proyecto y la reparte entre las inmobiliarias de la red. Una sola lista de precios, la misma para todas.</p>' +
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-top:18px"><div style="flex:1;min-width:180px"><div class="bar-p" style="background:#ffffff26">' + seg('disponible', '#3fae7a') + seg('bloqueada', '#e8e6df') + seg('reservada', '#f0b43c') + seg('vendida', '#8d8a7e') + '</div>' +
        '<div class="lab" style="margin-top:8px;line-height:1.7">' + cnt('disponible') + ' disponibles · ' + cnt('bloqueada') + ' bloqueadas · ' + cnt('reservada') + ' reservadas · ' + cnt('vendida') + ' vendidas</div></div><a class="btn dk" href="#/livera">Ver el proyecto</a></div></div></div>' +
        '<div class="grid g3 mt">' +
        '<div class="card"><div class="ln"><span class="lab">Mis unidades tomadas</span><span class="pill-c rj">' + mine.length + '</span></div>' +
        (mine.length ? mine.map(u => '<a href="#/ficha/' + u.id + '" class="rowc">' + A.ring(u) + '<span class="rt"><b>' + esc(A.title(u)) + '</b><small>' + u.id + ' · vence en ' + A.tm(u.exp) + '</small></span></a>').join('') : A.empty('Todavía no tomaste unidades', '<a class="btn mt" href="#/catalogo">Buscar en el catálogo</a>')) +
        '<p class="hint" style="margin-bottom:0;margin-top:14px">El bloqueo dura 48 h y podés renovarlo una vez.</p></div>' +
        '<div class="card"><div class="ln"><span class="lab">Mis consultas abiertas</span><a class="lab" href="#/consultas">Ver todas</a></div>' +
        (abiertas.length ? abiertas.slice(0, 4).map(c => { const u = A.unit(c.prop); return '<a href="#/consultas/' + c.id + '" class="rowc">' + A.thumb(u) + '<span class="rt"><b>' + esc(A.title(u)) + '</b><small>' + esc(c.comprador) + ' · ' + ago(c.ts) + '</small>' + A.steps(c.etapa) + '</span>' + A.stagePill(c.etapa) + '</a>'; }).join('') : A.empty('Sin consultas abiertas')) +
        '<p class="hint" style="margin-bottom:0;margin-top:14px">' + A.esperan().filter(c => c.ag === ME).length + ' esperan que Puyella las tome.</p></div>' +
        '<div class="card"><div class="ln"><span class="lab">Mis comisiones · ' + mesCom + '</span><a class="lab" href="#/comisiones">Estado de cuenta</a></div>' +
        '<div class="lab" style="margin-top:6px">A cobrar</div><div class="big" style="margin:4px 0 14px">' + money$(aCobrar) + '</div>' +
        '<div class="bar-p" style="height:12px" role="img" aria-label="Comisiones cobradas, facturadas y pendientes"><i style="width:' + (100 * sum('cobrada') / tot) + '%;background:var(--verde)"></i><i style="width:' + (100 * sum('facturada') / tot) + '%;background:var(--azul)"></i><i style="width:' + (100 * sum('pendiente') / tot) + '%;background:#d79a22"></i></div>' +
        '<div class="legend"><span><i style="background:var(--verde)"></i>Cobrado</span><span><i style="background:var(--azul)"></i>Facturado</span><span><i style="background:#d79a22"></i>Pendiente</span></div>' +
        '<div class="ln" style="border-top:1px solid var(--line);padding-top:12px;margin-top:12px"><div><div class="lab">Cerradas</div><b style="font:600 28px var(--sans)">' + s.coms.length + '</b></div><div style="text-align:right"><div class="lab">Cobrado en el año</div><b style="font:600 28px var(--sans);color:var(--verde)">' + money$(cobAnio) + '</b></div></div>' +
        '<p class="hint" style="margin-bottom:0;margin-top:14px">Puyella liquida a los 10 días de la escritura.</p></div></div>' +
        '<div class="card mt"><div class="lab">Novedades de la cartera · últimos 7 días</div>' + s.novedades.map(n => { const p = n.prop && A.unit(n.prop); return '<a href="' + (n.prop ? '#/ficha/' + n.prop : n.ruta) + '" class="nov">' + (p ? A.thumb(p) : A.pic(A.F('dext', 4), 'Livera', 'th')) + '<span class="st ' + { nueva: 'az', precio: 'rs', liberada: 'vd', livera: 'rs' }[n.tag] + '">' + { nueva: 'Nueva', precio: 'Precio', liberada: 'Liberada', livera: 'Livera' }[n.tag] + '</span><span class="nt">' + esc(n.txt) + '</span><span class="mut mono nc">' + n.cuando + '</span></a>'; }).join('') + '</div>',
        { title: 'Inicio', search: A.searchBox('gq', '', 'Buscar por código, calle o barrio') })
    };
  };
  document.addEventListener('keydown', e => { if (e.target.id === 'gq' && e.key === 'Enter') { A.catF.q = e.target.value; A.catF.tipo = 'todos'; A.catF.op = 'todos'; A.catF.solo = false; location.hash = '#/catalogo'; } });

  /* ---------- catálogo ---------- */
  A.catF = { q: '', op: 'venta', tipo: 'todos', loc: 'todas', solo: true };
  A.acts.fx = t => { t.closest('.fbar').classList.toggle('open'); };
  R.catalogo = () => {
    const F = A.catF;
    const list = () => S().props.filter(p => (F.op === 'todos' || p.op === F.op) && (F.tipo === 'todos' || p.tipo === F.tipo) && (F.loc === 'todas' || p.loc === F.loc) && (!F.solo || p.estado === 'disponible' || (p.estado === 'bloqueada' && p.by === ME)) &&
      (!F.q || (p.id + ' ' + p.titulo + ' ' + p.loc + ' ' + p.desc + ' ' + p.tipo).toLowerCase().includes(F.q.toLowerCase())));
    const card = p => {
      const dim = ['vendida', 'reservada'].includes(p.estado);
      const foot = p.estado === 'bloqueada' ? '<span class="tm">' + (p.by === ME ? 'Te quedan ' : 'Se libera en ') + A.tm(p.exp).replace(/<[^>]+>/g, '') + '</span>' : p.nota ? '<span class="tm">' + p.nota + '</span>' : '<span></span>';
      return '<article class="pc' + (dim ? ' dim' : '') + '" tabindex="0" role="link" data-a="go:#/ficha/' + p.id + '" aria-label="' + esc(p.titulo) + '"><div class="im">' + A.pic(A.fotos(p)[0], p.titulo, 'full') + A.pill(p) + '<span class="cd">' + p.id + '</span></div>' +
        '<div class="bd"><div class="pr"><b>' + A.money(p) + '</b><small>' + (p.op === 'venta' ? 'Venta' : 'Alquiler') + '</small></div><div class="tt">' + esc(p.titulo) + '</div><small class="mono mut" style="font-size:12px">' + p.loc + ' · ' + p.sup + '</small><div>' + esc(p.desc) + '</div>' +
        '<div class="ft"><span class="mono mut" style="font-size:12px">COMISIÓN ' + p.com + (typeof p.com === 'number' ? ' %' : '') + '</span>' + foot + '<a href="#/ficha/' + p.id + '" style="font-weight:500">Ver ficha</a></div></div></article>';
    };
    const paint = () => {
      const l = list(), el = $('#plist'); if (!el) return;
      $('#pcount').textContent = l.length + (l.length === 1 ? ' propiedad' : ' propiedades') + (S().props.length > l.length ? ' de ' + S().props.length : '');
      el.innerHTML = l.length ? l.map(card).join('') : '<div class="card" style="grid-column:1/-1">' + A.empty('No hay propiedades con esos filtros', '<button class="btn mt" data-a="limpiar">Limpiar filtros</button>') + '</div>';
      const n = [F.q, F.tipo !== 'todos', F.loc !== 'todas', !F.solo].filter(Boolean).length; $('#fcount').textContent = n ? n + (n === 1 ? ' filtro aplicado' : ' filtros aplicados') : 'Sin filtros extra'; const b = $('#fbadge'); if (b) { b.textContent = n; b.hidden = !n; }
    };
    A.acts.limpiar = () => { Object.assign(A.catF, { q: '', op: 'venta', tipo: 'todos', loc: 'todas', solo: true }); A.refresh(); };
    return {
      doc: 'Catálogo',
      html: A.shell(
        '<div class="chips" id="tt">' + ['todos'].concat(TIPOS).map(t => '<button data-t="' + t + '" class="' + (F.tipo === t ? 'on' : '') + '">' + (t === 'todos' ? A.ic('grid', 18) + 'Todos' : A.ic(A.tipoIc(t), 18) + t) + '</button>').join('') + '<a class="lvchip" href="#/livera">' + A.ic('building', 18) + 'LIVERA</a></div>' +
        '<div class="fbar"><div class="srch only-m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="q2" type="search" value="' + esc(F.q) + '" placeholder="Buscar por código, calle o barrio" aria-label="Buscar"></div>' +
        '<div class="seg" id="op">' + [['venta', 'Venta'], ['alquiler', 'Alquiler'], ['todos', 'Todas']].map(x => '<button data-o="' + x[0] + '" class="' + (F.op === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>' +
        '<button class="btn sm only-m fxb" data-a="fx">' + A.ic('filter', 18) + 'Filtros <span class="badge" id="fbadge" hidden></span></button>' +
        '<div class="fx"><select class="in" id="lc" style="width:auto;min-height:44px" aria-label="Localidad"><option value="todas">Localidad: todas</option>' + LOCS.map(l => '<option' + (F.loc === l ? ' selected' : '') + '>' + l + '</option>').join('') + '</select>' +
        '<span class="pill-c az" id="fcount"></span><label class="chk" style="margin-left:auto"><input type="checkbox" id="so"' + (F.solo ? ' checked' : '') + '> Sólo disponibles</label></div></div>' +
        '<div class="ln" style="margin:6px 0 14px;flex-wrap:wrap"><span class="lab" id="pcount"></span><span class="lab leg">' + ['<span class="st ok">Disponible</span>', '<span class="st otra">Bloqueada</span>', '<span class="st mia">Bloqueada por mí</span>', '<span class="st res">Reservada</span>', '<span class="st vend">Vendida</span>'].join('') + '</span></div>' +
        '<div class="cards" id="plist"></div>', { title: 'Catálogo', search: A.searchBox('q1', F.q, 'Buscar por código, calle o barrio') }),
      bind: r => {
        paint();
        const setQ = v => { F.q = v; paint(); const a = $('#q1'), b = $('#q2'); if (a && a.value !== v) a.value = v; if (b && b.value !== v) b.value = v; };
        ['q1', 'q2'].forEach(id => { const i = $('#' + id, r); i && i.addEventListener('input', () => setQ(i.value)); });
        $('#tt', r).onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; F.tipo = b.dataset.t; $$('#tt [data-t]').forEach(x => x.classList.toggle('on', x === b)); paint(); };
        $('#op', r).onclick = e => { const b = e.target.closest('[data-o]'); if (!b) return; F.op = b.dataset.o; $$('#op button').forEach(x => x.classList.toggle('on', x === b)); paint(); };
        $('#lc', r).onchange = e => { F.loc = e.target.value; paint(); };
        $('#so', r).onchange = e => { F.solo = e.target.checked; paint(); };
        $('#plist', r).addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('pc')) location.hash = e.target.dataset.a.slice(3); });
      }
    };
  };

  /* ---------- ficha ---------- */
  R.ficha = ([id]) => {
    const adm = S().role === 'admin';
    const u = A.unit(id); if (!u) return { html: A.shell(A.empty('No encontramos esa unidad', '<a class="btn mt" href="#/catalogo">Volver al catálogo</a>'), { title: 'Ficha' }) };
    const lv = A.isLV(u), mia = !adm && u.estado === 'bloqueada' && u.by === ME, otra = u.estado === 'bloqueada' && !mia;
    const fotos = A.fotos(u);
    const comTxt = lv ? 'A definir' : typeof u.com === 'number' ? u.com + ' % · ' + money$(Math.round(u.precio * u.com / 100)) : u.com + ' de alquiler';
    let primary;
    if (u.estado === 'disponible') primary = '<button class="btn p w" style="min-height:56px;font-size:16px" data-a="tomar:' + u.id + '">Tomar la unidad</button><p class="hint">Queda bloqueada 48 h para Rossi Propiedades. Ninguna otra inmobiliaria de la red la puede ofrecer mientras la tengas.</p>';
    else if (mia) primary = '<div class="card soft" style="padding:16px"><div class="lab">Tu bloqueo activo</div><div style="display:flex;gap:16px;align-items:center;margin:8px 0 4px">' + A.ring(u) + '<div style="font:600 30px var(--sans)">' + A.tm(u.exp, '') + '</div></div><div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn sm" data-a="renovar:' + u.id + '"' + (u.renovada ? ' disabled' : '') + '>' + (u.renovada ? 'Ya renovaste' : 'Renovar 48 h') + '</button><button class="btn sm d" data-a="liberar:' + u.id + '">Liberar</button></div></div>';
    else if (otra) primary = '<button class="btn p w" style="min-height:56px" disabled>Tomar la unidad</button><div class="note mt" style="margin-bottom:6px"><span>La tiene otra inmobiliaria. Se libera en ' + A.tm(u.exp) + '. La plataforma no informa cuál.</span></div><button class="btn w" data-a="avisar:' + u.id + '">' + (S().avisos[u.id] ? '✓ Te vamos a avisar' : 'Avisarme cuando se libere') + '</button>';
    else primary = '<button class="btn p w" style="min-height:56px" disabled>No disponible</button><p class="hint">' + (u.estado === 'reservada' ? 'Tiene seña acreditada y va camino al boleto.' : 'Está fuera de la oferta y queda en el historial.') + '</p>';
    const cart = [['Código', u.id], ['Tipo', lv ? 'Departamento · ' + u.tipo : u.tipo.replace(/s$/, '')], ['Operación', lv ? 'Venta' : u.op === 'venta' ? 'Venta' : 'Alquiler'], ['Dirección', lv ? 'LIVERA · Piso ' + u.piso : u.titulo], ['Localidad', lv ? 'San Nicolás' : u.loc], ['Superficie', lv ? '—  (a definir)' : u.sup]].concat(lv ? [['Entrega', 'A definir'], ['Precio', 'Según lista vigente']] : (u.cart || []));
    const back = adm ? '#/operaciones' : lv ? '#/livera' : '#/catalogo';
    const crumb = '<a href="' + (adm ? '#/operaciones' : '#/catalogo') + '">' + (adm ? 'Operaciones' : 'Catálogo') + '</a> <span>/</span> <a href="' + (lv ? '#/livera' : '#/catalogo') + '">' + (lv ? 'Livera' : u.tipo) + '</a> <span>/</span> <span>' + u.id + '</span>';
    return {
      doc: A.title(u),
      html: A.shell('<div class="fi"><div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">' + A.pill(u) + '<span class="lab">' + u.id + ' · ' + (lv ? 'Livera' : u.tipo.replace(/s$/, '')) + ' · ' + (u.op || 'venta') + '</span></div>' +
        '<h1 class="ft1">' + esc(A.title(u)) + '</h1><p class="mut" style="font-size:19px;margin:6px 0 20px">' + esc(u.sub || (lv ? 'Edificio de uno a cuatro ambientes en el centro de San Nicolás' : u.loc + ' · ' + u.desc)) + '</p>' +
        '<div class="gal"><div class="m" id="gmain">' + A.pic(fotos[0], A.title(u), 'full') + '</div><div class="s" id="gth">' + fotos.map((f, i) => '<button type="button" data-f="' + f + '" class="' + (i === 0 ? 'on' : '') + '" aria-label="Foto ' + (i + 1) + '">' + A.pic(f, 'Foto ' + (i + 1), 'full') + '</button>').join('') + '<div class="plano-t">Plano<br>PDF</div></div></div>' +
        '<div class="card mt"><div class="lab">Cartilla</div><div class="cart">' + cart.map(c => '<div><span>' + c[0] + '</span><span>' + esc(c[1]) + '</span></div>').join('') + '</div>' +
        '<div class="lab" style="margin:22px 0 8px">Descripción</div><p style="font-size:18px">' + esc(u.texto || (lv ? 'Unidad de ejemplo de LIVERA, proyecto en desarrollo. Superficie, precio y fecha de entrega se definen con la lista vigente.' : u.desc + '. ' + u.sup + '. Se muestra con turno previo.')) + '</p></div></div>' +
        '<aside class="stick"><div class="card"><div class="lab">Precio de lista</div><div class="big" style="margin:6px 0 14px">' + (lv ? 'A definir' : A.money(u)) + '</div><div class="ln" style="border-top:1px solid var(--line);padding-top:14px"><div><div class="lab">Comisión declarada</div><div style="font:600 26px var(--sans);margin-top:4px">' + comTxt + '</div></div>' + A.pill(u) + '</div></div>' +
        (adm ? '<div class="card soft"><div class="lab">Vista de administración</div><p class="mt">' + (u.by ? 'La tiene ' + esc(A.agency(u.by).nombre) + '.' : 'Sin bloqueos activos.') + '</p></div>' : '<div class="card">' + primary + '<button class="btn w mt" data-a="reg:' + u.id + '">Registrar al comprador</button><p class="hint">Responde sí o no en el acto. Si el comprador ya está registrado, la pantalla no dice de quién es.</p><button class="btn w" data-a="ficha:' + u.id + '">Mandar la ficha</button><p class="hint">Arma un WhatsApp con la ficha, tu logo y teléfono. Sin datos de Puyella.</p><div style="display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:14px"><button class="btn sm" style="flex:1" data-a="demo:Descarga de la cartilla en PDF: disponible en la versión real">Descargar cartilla</button><button class="btn sm" style="flex:1" data-a="demo:Pedido de tasación enviado a Puyella (demo)">Pedir tasación</button></div></div>') +
        '<div class="card soft"><div class="lab">Cómo se ve si la tiene otra inmobiliaria</div><div class="card" style="padding:16px;margin-top:10px"><div class="ln"><span class="st otra">Bloqueada</span><span class="tm">Se libera en 19 h 04 m</span></div><button class="btn w mt" disabled>Tomar la unidad</button><p class="hint" style="margin:10px 0 0">La plataforma no informa qué inmobiliaria la tomó. Podés pedir aviso cuando se libere.</p></div>' +
        '<div class="card" style="padding:16px;margin-top:12px"><div class="lab" style="color:var(--rojo2)">Registro de comprador · rechazado</div><p style="margin-top:6px">Ese comprador ya está registrado para esta propiedad. No se informa por quién ni desde cuándo.</p></div></div></aside></div>' +
        (adm ? '' : '<div class="mbar"><div><b>' + (lv ? 'A definir' : A.money(u)) + '</b><small>' + (u.estado === 'bloqueada' ? (mia ? 'Te quedan ' : 'Se libera en ') + A.tm(u.exp).replace(/<[^>]+>/g, '') : u.estado === 'disponible' ? 'Disponible' : 'No disponible') + '</small></div>' +
          (u.estado === 'disponible' ? '<button class="btn p" data-a="tomar:' + u.id + '">Tomar</button>' : '') + '<button class="btn" data-a="reg:' + u.id + '">Registrar</button></div>'), { crumb, title: 'Ficha', back, detail: true }),
      bind: r => { $('#gth', r).addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('#gth [data-f]').forEach(x => x.classList.toggle('on', x === b)); $('#gmain img').src = b.dataset.f; }); }
    };
  };

  /* ---------- livera ---------- */
  R.livera = () => {
    const s = S(), lv = s.lv, admin = s.role === 'admin', cnt = st => lv.filter(u => u.estado === st).length;
    const vend = s.agencies.filter(a => a.livera && a.estado === 'activa').length;
    const row = u => {
      const who = u.estado === 'disponible' ? 'Lista vigente' : u.estado === 'bloqueada' ? (u.by === ME && !admin ? 'Te quedan ' : 'Se libera en ') + A.tm(u.exp) : u.estado === 'reservada' ? 'Seña acreditada' : 'Cerrada';
      const act = (!admin && u.estado === 'disponible') ? '<button class="btn xs" data-a="tomar:' + u.id + '">Tomar</button>' : '';
      return '<div class="r click" data-a="go:#/ficha/' + u.id + '"><span data-l="Unidad"><b class="mono" style="font-weight:500">' + u.id.slice(3) + '</b></span><span data-l="Tipo">' + u.tipo + '</span><span data-l="Superficie" class="mut">— m²</span><span data-l="Estado">' + A.pill(u) + '</span><span data-l="Precio / tiempo">' + who + '</span><span data-l="Acción" style="display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap">' + act + '<a href="#/ficha/' + u.id + '">Ver unidad</a></span></div>';
    };
    const ECl = { disponible: 'ok', bloqueada: 'otra', reservada: 'res', vendida: 'vend' };
    const plano = '<div class="card"><div class="ln" style="flex-wrap:wrap"><span class="lab">Plano del edificio · tocá una unidad</span><span class="lab leg"><span class="st ok">Disponible</span><span class="st otra">Bloqueada</span><span class="st res">Reservada</span><span class="st vend">Vendida</span></span></div>' +
      '<div class="plano"><div class="pl-roof">Terraza</div>' + [4, 3, 2, 1].map(f => '<div class="pl-row"><span class="pl-f">Piso ' + f + '</span>' + lv.filter(u => u.piso === f).map(u => '<a href="#/ficha/' + u.id + '" class="pl-c e-' + ECl[u.estado] + '" aria-label="Unidad ' + u.id.slice(3) + ', ' + u.estado + '"><b>' + u.id.slice(3) + '</b><small>' + u.tipo.replace(' ambientes', ' amb.').replace(' ambiente', ' amb.') + '</small></a>').join('') + '</div>').join('') + '<div class="pl-base">Planta baja · cocheras y amenities</div></div></div>';
    const body = '<section class="hero" style="background-image:linear-gradient(90deg,rgba(24,24,31,.92),rgba(24,24,31,.55)),url(' + A.F('dext', 4) + ')"><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="pill-c rj">En desarrollo</span><span class="pill-c" style="background:#ffffff26;color:#fff">San Nicolás · Bs. As.</span></div><h1>LIVERA</h1><p>Edificio de unidades de uno a cuatro ambientes en el centro de San Nicolás. Puyella tiene la licencia de comercialización y la reparte entre las inmobiliarias de la red.</p>' +
      '<div class="hero-k"><div><b>' + cnt('disponible') + '</b><span>Disponibles</span></div><div><b>' + cnt('bloqueada') + '</b><span>Bloqueadas</span></div><div><b>' + cnt('reservada') + '</b><span>Reservadas</span></div><div><b>' + cnt('vendida') + '</b><span>Vendidas</span></div></div></section>' +
      '<div class="grid g21 mt ais"><div class="grid">' +
      '<div class="note err"><span><b>Datos de ejemplo.</b> LIVERA está en desarrollo: todavía no hay cantidad de unidades, precios, superficies ni fecha de entrega definidos. Los valores de esta pantalla son de muestra y no son un compromiso.</span></div>' +
      '<div class="rend">' + [['Fachada', A.F('dext', 4)], ['Living', A.F('sala', 1)], ['Terraza', A.F('dext', 0)], ['Mapa · ubicación', A.F('terreno', 4)]].map(x => '<figure>' + A.pic(x[1], x[0], 'full') + '<figcaption>' + x[0] + '</figcaption></figure>').join('') + '</div>' + plano +
      '<div class="card"><div class="lab">El proyecto</div><div class="grid g2" style="gap:24px"><p>Unidades de uno a cuatro ambientes con cocheras y amenities en planta baja, sobre un terreno del centro de San Nicolás, a pocas cuadras de la peatonal y de la costanera. Obra en pozo, con avance financiado por los inversores del proyecto.</p><p>La comercialización es de toda la red: cada inmobiliaria adherida trabaja las mismas unidades, con la misma lista de precios y las mismas formas de pago. Puyella cierra las operaciones y cada inmobiliaria cobra su comisión.</p></div>' +
      '<div class="grid g4" style="border-top:1px solid var(--line);margin-top:18px;padding-top:16px">' + [['Ubicación', 'San Nicolás · zona centro'], ['Unidades', 'A definir · ' + lv.length + ' de ejemplo'], ['Entrega', 'A definir'], ['Inmobiliarias en la red', vend + ' comercializando']].map(f => '<div><div class="lab">' + f[0] + '</div><div style="font-size:18px;margin-top:4px">' + f[1] + '</div></div>').join('') + '</div></div>' +
      '<div class="tbl card" id="lvu" style="--cols:70px 1.3fr 90px 1.3fr 1.3fr 1.1fr"><div class="ln" style="padding:18px 20px;flex-wrap:wrap"><span class="lab">Unidades y estado · ' + cnt('disponible') + ' disponibles de ' + lv.length + '</span><span class="pill-c rj">Datos de ejemplo</span></div>' +
      '<div class="r h"><span>Unidad</span><span>Tipo</span><span>Sup.</span><span>Estado</span><span>Precio / tiempo</span><span class="num">Acción</span></div>' + lv.map(row).join('') + '</div>' +
      '<div class="grid g2"><div class="card"><div class="lab">Formas de pago</div>' + [['Contado a la firma del boleto', 'según lista'], ['Anticipo y cuotas en pesos', 'a definir'], ['Propiedad en parte de pago', 'con tasación']].map(x => '<div class="ln" style="padding:12px 0;border-top:1px solid var(--line)"><span style="font-size:18px">' + x[0] + '</span><span class="lab">' + x[1] + '</span></div>').join('') + '</div>' +
      '<div class="card"><div class="lab">Planos y renders para descargar</div>' + [['Plantas por piso', 'PDF · 4,2 MB'], ['Renders en alta', 'ZIP · 38 MB'], ['Ficha para mandar al comprador', 'WhatsApp']].map(x => '<button class="ln" style="width:100%;background:none;border:0;border-top:1px solid var(--line);padding:12px 0;cursor:pointer;text-align:left" data-a="demo"><span style="font-size:18px">' + x[0] + '</span><span class="lab az">' + x[1] + '</span></button>').join('') + '</div></div></div>' +
      '<aside class="stick"><div class="card dark"><div class="ln"><span class="lab">Lista de precios vigente</span><span class="pill-c rj">Única vigente</span></div><div class="big" style="font-size:36px;margin:10px 0">01/09/2026</div><p style="color:#d8d5c9">Es la misma lista para todas las inmobiliarias de la red. Ninguna cotiza distinto: si Puyella la actualiza, cambia para todas a la vez.</p><div style="border-top:1px solid #ffffff2e;margin-top:14px;padding-top:12px">' + ['1A · 1 amb.', '2B · 2 amb.', '3C · 3 amb.', '4D · semipiso'].map(x => '<div class="ln" style="padding:6px 0"><span style="font-size:18px">Unidad ' + x + '</span><span class="lab">u$s —</span></div>').join('') + '</div><p class="lab" style="margin:10px 0 14px">Valores a definir por el desarrollo</p><button class="btn dk w" data-a="demo:Descarga de la lista: disponible en la versión real">Descargar la lista</button></div>' +
      '<div class="card"><div class="lab">Tu comisión en LIVERA</div><div class="big" style="font-size:34px;margin:8px 0">A definir</div><p class="mut">Queda declarada en la ficha de cada unidad cuando el desarrollo cierre la lista.</p></div>' +
      (admin ? '' : '<div class="card"><button class="btn p w" data-a="ir:lvu">Tomar una unidad</button><button class="btn w mt" data-a="reg">Registrar al comprador</button><button class="btn w mt" data-a="demo:Elegí una unidad para mandar su ficha">Mandar la ficha</button><p class="hint" style="margin:12px 0 0">El bloqueo de una unidad de LIVERA también dura 48 h y la ficha sale con tu logo y tu teléfono.</p></div>') +
      '<div class="card soft"><div class="lab">Contacto del proyecto</div><p style="margin-top:6px">Las consultas de LIVERA las toma Puyella y te responde por el portal. El comprador sigue siendo tuyo.</p></div></aside></div>';
    return { doc: 'Livera', html: A.shell(body, { title: 'Proyecto LIVERA' }) };
  };
  A.acts.ir = id => { const e = document.getElementById(id); e && e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  /* ---------- consultas ---------- */
  R.consultas = ([id]) => {
    const list = A.myConsultas(), cur = list.find(c => c.id === id) || (id ? null : list[0]);
    const esp = list.filter(c => c.etapa === 'espera').length;
    const steps = ['Consulta enviada', 'Puyella toma la consulta', 'Visita con el comprador', 'Oferta y contraoferta', 'Seña y boleto'];
    const prog = { espera: [1, 1], visita: [2, 2], oferta: [3, 3], sena: [4, 4], boleto: [5, -1], cerrada: [5, -1], caida: [2, -1] };
    const next = { espera: 'Puyella confirma si toma la consulta y coordina la visita. Te avisamos por el portal y por WhatsApp.', visita: 'Se coordina la visita con el propietario.', oferta: 'Puyella negocia la contraoferta con el vendedor.', sena: 'Se prepara el boleto y se acredita la seña.', boleto: 'Queda la escritura.', cerrada: 'Operación cerrada.', caida: 'La consulta cayó. Si el comprador vuelve, cargala de nuevo.' };
    const detail = c => {
      const u = A.unit(c.prop), p = prog[c.etapa];
      return '<div class="card" style="border-color:var(--azul);border-width:1.5px;padding:0;overflow:hidden"><div class="dimg">' + A.pic(A.fotos(u)[0], A.title(u), 'full') + '</div><div style="padding:22px"><div class="ln"><span class="lab az">' + c.prop + '</span>' + A.stagePill(c.etapa) + '</div><h2 style="font:600 28px/1.15 var(--sans);margin:10px 0 4px">' + esc(A.title(u)) + '</h2><p class="mut">' + (A.isLV(u) ? 'LIVERA · comisión a definir' : (u.op === 'venta' ? 'Venta · ' : 'Alquiler · ') + A.money(u) + ' · comisión ' + u.com + (typeof u.com === 'number' ? ' %' : '')) + '</p>' +
        '<div class="card soft mt" style="padding:16px"><div class="lab">Comprador registrado por vos</div><div style="font-size:22px;margin:4px 0">' + esc(c.comprador) + '</div><div class="mut">' + esc(c.tel) + ' · ' + esc(c.mail) + '</div><div class="lab" style="color:var(--verde);margin-top:8px">Registro confirmado ' + fdt(c.ts) + '</div></div>' +
        '<div class="lab mt2" style="margin-bottom:12px">Etapas</div><ul class="tl">' + steps.map((t, i) => '<li class="' + (i < p[0] ? 'done' : i === p[1] ? 'now' : 'todo') + '">' + t + (i === 0 ? '<small>' + fdt(c.ts) + '</small>' : i === p[1] ? '<small>' + (c.etapa === 'espera' ? 'Pendiente · vence hoy 18:00' : c.cuando ? 'Agendada ' + fdt(c.cuando) : 'En curso') + '</small>' : '') + '</li>').join('') + '</ul>' +
        '<div class="lab" style="margin-top:6px">Próximo paso</div><p style="font-size:18px;margin-top:6px">' + next[c.etapa] + '</p></div></div>' +
        '<div class="card mt"><div class="lab">Tu mensaje</div><p style="font-size:18px;margin:8px 0 14px">' + esc(c.msg) + '</p>' + c.mensajes.map(m => '<p style="border-top:1px solid var(--line);padding:10px 0"><span class="lab">' + fdt(m.ts) + '</span><br>' + esc(m.t) + '</p>').join('') + '<button class="btn w" data-a="msg:' + c.id + '">Agregar un mensaje</button></div>';
    };
    const rows = list.map(c => { const u = A.unit(c.prop); return '<a class="cr' + (cur && cur.id === c.id ? ' on' : '') + '" href="#/consultas/' + c.id + '">' + A.thumb(u, 'lg') + '<span class="ci"><b>' + esc(A.title(u)) + '</b><small>' + esc(c.comprador) + ' · ' + ago(c.ts) + '</small>' + A.steps(c.etapa) + '</span>' + A.stagePill(c.etapa) + '</a>'; }).join('');
    const body = A.ph('Mis consultas', esp + ' esperan respuesta', '<button class="btn p" data-a="nueva">Nueva consulta</button>') +
      '<div class="split' + (id ? '' : ' nosel') + '"><div class="card cl"><div class="ln" style="padding:18px 20px"><span class="lab">' + list.length + ' consultas · últimos 90 días</span><button class="lab" data-a="demo:Exportación a planilla: disponible en la versión real">Exportar</button></div>' + (rows || A.empty('Todavía no cargaste consultas', '<button class="btn p mt" data-a="nueva">Nueva consulta</button>')) + '</div>' +
      '<div class="det">' + (cur ? detail(cur) : id ? '<div class="card">' + A.empty('No encontramos esa consulta', '<a class="btn mt" href="#/consultas">Volver al listado</a>') + '</div>' : '') + '</div></div>';
    return { doc: 'Mis consultas', html: A.shell(body, { title: 'Mis consultas', back: id ? '#/consultas' : '', detail: !!id }) };
  };
  A.acts.nueva = () => {
    const opts = A.units().filter(u => !['vendida'].includes(u.estado)).map(u => '<option value="' + u.id + '">' + esc(A.isLV(u) ? u.id + ' · LIVERA' : u.id + ' · ' + u.titulo) + '</option>').join('');
    A.modal('<h3>Nueva consulta</h3><p class="mut">Puyella la recibe y la toma. El comprador queda registrado a tu nombre.</p><form id="nc" class="mt" novalidate><label class="fld"><span class="lab">Propiedad</span><select class="in" id="np">' + opts + '</select></label><label class="fld"><span class="lab">Nombre del comprador</span><input class="in" id="nn" required></label><label class="fld"><span class="lab">Teléfono</span><input class="in" id="nt" inputmode="tel" required></label><label class="fld"><span class="lab">Mensaje para Puyella</span><textarea class="in" id="nm"></textarea></label><div class="acts"><button type="button" class="btn" data-a="close">Cancelar</button><button class="btn p">Enviar consulta</button></div></form>');
    $('#nc').onsubmit = e => {
      e.preventDefault(); const n = $('#nn').value.trim(), t = $('#nt').value.trim();
      if (!n || t.replace(/\D/g, '').length < 8) { A.toast('Completá el nombre y un teléfono válido', true); return; }
      const c = { id: 'c' + Date.now(), prop: $('#np').value, comprador: n, tel: t, mail: '—', ag: ME, etapa: 'espera', ts: Date.now(), msg: $('#nm').value.trim() || 'Sin mensaje.', mensajes: [] };
      S().consultas.push(c); A.save(); A.closeModal(); A.toast('Consulta enviada a Puyella'); location.hash = '#/consultas/' + c.id; A.refresh();
    };
  };
  A.acts.msg = id => {
    A.modal('<h3>Agregar un mensaje</h3><form id="mf" class="mt"><label class="fld"><span class="lab">Mensaje</span><textarea class="in" id="mt" required></textarea></label><div class="acts"><button type="button" class="btn" data-a="close">Cancelar</button><button class="btn p">Enviar</button></div></form>');
    $('#mf').onsubmit = e => { e.preventDefault(); const t = $('#mt').value.trim(); if (!t) { A.toast('Escribí el mensaje', true); return; } const c = S().consultas.find(x => x.id === id); c.mensajes.push({ t, ts: Date.now() }); A.save(); A.closeModal(); A.toast('Mensaje enviado'); A.refresh(); };
  };

  /* ---------- unidades tomadas ---------- */
  R.tomadas = () => {
    const mine = A.mine();
    return {
      doc: 'Mis unidades tomadas',
      html: A.shell(A.ph('Mis unidades tomadas', mine.length ? 'El bloqueo dura 48 h y podés renovarlo una vez.' : '', '<a class="btn" href="#/catalogo">Ver catálogo</a>') +
        (mine.length ? '<div class="grid g3">' + mine.map(u => '<div class="card" style="padding:0;overflow:hidden"><div class="dimg">' + A.pic(A.fotos(u)[0], A.title(u), 'full') + '</div><div style="padding:18px"><div class="ln"><span class="mono mut" style="font-size:12px">' + u.id + '</span>' + A.tm(u.exp, 'Vence en ') + '</div><div style="display:flex;gap:14px;align-items:center;margin:10px 0 14px">' + A.ring(u) + '<a href="#/ficha/' + u.id + '" style="color:inherit;font-size:21px;line-height:1.25">' + esc(A.title(u)) + '</a></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sm" data-a="renovar:' + u.id + '"' + (u.renovada ? ' disabled' : '') + '>' + (u.renovada ? 'Ya renovaste' : 'Renovar 48 h') + '</button><button class="btn sm d" data-a="liberar:' + u.id + '">Liberar</button></div></div></div>').join('') + '</div>'
          : '<div class="card">' + A.empty('No tenés unidades tomadas', 'Elegí una del catálogo y queda bloqueada 48 h para tu inmobiliaria.<br><a class="btn p mt" href="#/catalogo">Ir al catálogo</a>') + '</div>'), { title: 'Unidades tomadas' })
    };
  };

  /* ---------- comisiones ---------- */
  A.per = '90';
  A.acts.per = p => { A.per = p; A.refresh(); };
  A.acts.print = () => window.print();
  R.comisiones = () => {
    const s = S(), now = Date.now(), anio = new Date().getFullYear();
    const all = s.coms, inPer = x => A.per === '90' ? now - x.cierre <= 90 * D : A.per === 'anio' ? new Date(x.cierre).getFullYear() === anio : true;
    const rows = all.filter(inPer).sort((a, b) => b.cierre - a.cierre);
    const sum = (arr, m) => arr.filter(x => x.mon === m).reduce((a, x) => a + x.com, 0);
    const pend = all.filter(x => x.estado === 'pendiente' && x.mon === 'u'), fact = all.filter(x => x.estado === 'facturada' && x.mon === 'u');
    const aCobrar = sum(pend.concat(fact), 'u'), prox = fact.filter(x => x.cobro > now).sort((a, b) => a.cobro - b.cobro)[0];
    const cobAnio = sum(all.filter(x => x.estado === 'cobrada' && new Date(x.cierre).getFullYear() === anio), 'u'), alq = sum(all.filter(x => x.estado === 'cobrada' && new Date(x.cierre).getFullYear() === anio), 'p');
    const m = (x, n) => (x.mon === 'u' ? 'u$s ' : '$ ') + num(n);
    const part = e => sum(all.filter(x => x.estado === e), 'u'), tot = part('pendiente') + part('facturada') + part('cobrada');
    const meses = [5, 4, 3, 2, 1, 0].map(i => { const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1); const v = sum(all.filter(x => { const c = new Date(x.cierre); return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth(); }), 'u'); return [d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '').toUpperCase(), v]; });
    const mx = Math.max(1, ...meses.map(x => x[1]));
    const body = A.ph('Mis comisiones', 'Estado de cuenta · Rossi Propiedades', '<button class="btn" data-a="print">Descargar resumen</button>') +
      '<div class="grid g4 kp"><div class="card"><div class="lab">Cuánto me llevo · a cobrar</div><div class="big" style="margin:8px 0">' + money$(aCobrar) + '</div><p class="mut">' + fact.length + ' facturadas · ' + pend.length + ' pendiente' + (pend.length === 1 ? '' : 's') + '</p></div>' +
      '<div class="card"><div class="lab">Cuándo cobro · próxima liquidación</div><div class="big" style="margin:8px 0">' + (prox ? fdate(prox.cobro).slice(0, 5) : '—') + '</div><p class="mut">' + (prox ? money$(prox.com) + ' · ' + esc(prox.ptxt) : 'Sin liquidaciones agendadas') + '</p></div>' +
      '<div class="card"><div class="lab">Cobrado en el año</div><div class="big" style="margin:8px 0;color:var(--verde)">' + money$(cobAnio) + '</div><p class="mut">+ $ ' + num(alq) + ' en alquileres</p></div>' +
      '<div class="card"><div class="lab">Operaciones cerradas</div><div class="big" style="margin:8px 0">' + all.length + '</div><p class="mut">Desde el alta en marzo 2026</p></div></div>' +
      '<div class="grid g2 mt"><div class="card"><div class="lab">De dónde viene tu plata</div><div class="bar-p" style="height:14px" role="img" aria-label="Reparto entre cobrado, facturado y pendiente"><i style="width:' + (100 * part('cobrada') / tot) + '%;background:var(--verde)"></i><i style="width:' + (100 * part('facturada') / tot) + '%;background:var(--azul)"></i><i style="width:' + (100 * part('pendiente') / tot) + '%;background:#d79a22"></i></div>' +
      '<div class="grid g3" style="margin-top:16px;gap:10px">' + [['Cobrado', part('cobrada'), 'var(--verde)'], ['Facturado', part('facturada'), 'var(--azul)'], ['Pendiente', part('pendiente'), '#d79a22']].map(x => '<div><div class="lab"><i class="dotc" style="background:' + x[2] + '"></i>' + x[0] + '</div><div style="font:600 22px var(--sans);margin-top:4px">' + money$(x[1]) + '</div></div>').join('') + '</div></div>' +
      '<div class="card"><div class="lab">Comisiones por mes (u$s)</div><div class="ritmo" style="height:150px">' + meses.map(x => '<div><b style="font-size:15px">' + (x[1] ? k(x[1]) : '') + '</b><i style="height:' + Math.max(x[1] ? 4 : 0, x[1] / mx * 100 * .7) + '%"></i><span>' + x[0] + '</span></div>').join('') + '</div></div></div>' +
      '<div class="tbl card mt" style="--cols:90px 90px 1.8fr 1.2fr 1fr 60px 1fr 1fr 90px"><div class="ln" style="padding:18px 20px;flex-wrap:wrap;gap:12px"><div class="seg" role="group" aria-label="Período">' + [['90', 'Últimos 90 días'], ['anio', 'Año ' + anio], ['todo', 'Desde el alta']].map(x => '<button data-a="per:' + x[0] + '" class="' + (A.per === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div><span class="lab leg">' + pillCom('pendiente') + pillCom('facturada') + pillCom('cobrada') + '</span></div>' +
      '<div class="r h"><span>Cierre</span><span>Operación</span><span>Propiedad</span><span>Comprador</span><span class="num">Monto</span><span class="num">%</span><span class="num">Mi comisión</span><span>Estado</span><span>Cobro</span></div>' +
      (rows.length ? rows.map(x => { const pu = x.prop && A.unit(x.prop); return '<div class="r"><span data-l="Cierre" class="mono" style="font-size:13px">' + fdate(x.cierre) + '</span><span data-l="Operación">' + x.op + '</span><span data-l="Propiedad" class="full pcell">' + (pu ? A.thumb(pu) : '') + '<span>' + esc(x.ptxt) + (x.prop ? '<small>' + x.prop + '</small>' : '') + '</span></span><span data-l="Comprador">' + esc(x.comprador) + '</span><span data-l="Monto" class="num">' + (x.op === 'Alquiler' ? '$ ' + num(x.monto) + '<small>1 mes</small>' : m(x, x.monto)) + '</span><span data-l="%" class="num mono" style="font-size:13px">' + (x.pct ? x.pct + ' %' : '1 mes') + '</span><span data-l="Mi comisión" class="num" style="font:600 20px var(--sans)">' + m(x, x.com) + '</span><span data-l="Estado">' + pillCom(x.estado) + '</span><span data-l="Cobro" class="mono" style="font-size:13px">' + (x.estado === 'pendiente' ? 'a escriturar' : fdate(x.cobro)) + '</span></div>'; }).join('') + '<div class="r" style="background:var(--papel2);font-weight:600"><span class="full" style="grid-column:1/-1;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><span class="lab">Total del período · ' + rows.length + ' operaciones</span><span style="font:600 22px var(--sans)">' + money$(sum(rows, 'u')) + (sum(rows, 'p') ? ' <span class="mut mono" style="font-size:13px;font-weight:400">+ $ ' + num(sum(rows, 'p')) + '</span>' : '') + '</span></span></div>' : '<div class="r" style="display:block">' + A.empty('No hay operaciones en este período', '<button class="btn mt" data-a="per:todo">Ver desde el alta</button>') + '</div>') + '</div>' +
      '<div class="grid g2 mt"><div class="card soft"><div class="lab">Cómo se liquida</div><p style="font-size:18px">Puyella cierra la operación, cobra la comisión total y liquida la parte de la inmobiliaria adherida a los 10 días de la escritura o de la firma del contrato de alquiler. La factura la emitís vos contra el aviso de liquidación.</p></div>' +
      '<div class="card"><div class="ln" style="flex-wrap:wrap;gap:14px"><div><div class="lab">Datos de cobro</div><div style="font-size:22px;margin:8px 0 4px">Rossi Propiedades S.R.L.</div><div class="mono mut" style="font-size:13px">CUIT 30-71204558-4 · CBU ····9042</div></div><button class="btn" data-a="demo:Edición de datos de cobro: disponible en la versión real">Editar</button></div></div></div>';
    return { doc: 'Mis comisiones', html: A.shell(body, { title: 'Comisiones' }) };
  };

  /* ---------- guía de estilo ---------- */
  R.sistema = () => {
    const col = [['Rojo de marca', '#cd181f', 'Logo, botón primario y acción destructiva'], ['Rojo texto', '#901218', 'Texto rojo sobre fondo claro'], ['Papel', '#f2f1ec', 'Fondo de pantalla'], ['Hueso', '#d9d6cc', 'Líneas y bordes'], ['Tinta', '#16161a', 'Texto principal'], ['Grafito', '#18181f', 'Menú lateral'], ['Azul', '#0047d6', 'Foco, selección, enlaces, filtros'], ['Verde', '#19784c', 'Disponible y cobrado'], ['Gris de apoyo', '#5b5850', 'Texto secundario · 5,9:1 sobre papel']];
    const body = A.ph('Guía de estilo', 'Mismo diseño aprobado, con las mejoras de legibilidad y uso aplicadas.') +
      '<div class="card"><div class="lab">Paleta</div><div class="sw8">' + col.map(c => '<div><i style="background:' + c[1] + '"></i><span><b>' + c[0] + '</b><br>' + c[1] + '</span></div>').join('') + '</div></div>' +
      '<div class="grid g2 mt"><div class="card"><div class="lab">Tipografía</div><div style="font:600 34px/1.1 var(--sans)">Catálogo de la red</div><p class="mt" style="font-size:18px">Texto de lectura en Source Serif 4, 16–18 px. Los rótulos en IBM Plex Mono arrancan en 11,5 px.</p><p class="mono mt" style="font-size:13px;letter-spacing:.08em">PY-0412 · MAT. 4821 · 31 H 12 M</p></div>' +
      '<div class="card"><div class="lab">Botones y estados</div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn p">Tomar la unidad</button><button class="btn">Secundario</button><button class="btn d">Destructivo</button><button class="btn" disabled>Deshabilitado</button></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><span class="st ok">Disponible</span><span class="st otra">Bloqueada</span><span class="st mia">Bloqueada por mí</span><span class="st res">Reservada</span><span class="st vend">Vendida</span></div></div></div>' +
      '<div class="card mt"><div class="lab">Mejoras aplicadas sobre el diseño</div><ul style="padding-left:20px;display:grid;gap:6px;font-size:17px"><li>Rótulos de 9–10 px pasan a 11,5–12 px y los grises ganan contraste hasta cumplir 4,5:1.</li><li>El estado se lee por el punto y el texto, no solo por el color. «Bloqueada por mí» pasa a azul; el rojo queda para marca, el botón principal y lo destructivo.</li><li>«Cortar acceso» y «Liberar» van en un menú con confirmación, no como botones sueltos en cada fila.</li><li>Foco visible, textos de ayuda legibles y botones de 40 px como mínimo.</li><li>Estados vacíos, avisos de error y confirmaciones donde antes no había.</li><li>Móvil: barra de navegación inferior con íconos, botón Volver en los detalles, datos con gráficos (anillos de tiempo, plano del edificio, barras) y fotos de ejemplo.</li></ul></div>';
    return { doc: 'Guía de estilo', html: S().role ? A.shell(body, { title: 'Guía de estilo' }) : '<div class="top2"><span class="logo">P</span><b>PUYELLA</b><div class="fl"></div><a href="#/login" style="color:#fff">Volver</a></div><div class="page">' + body + '</div>' };
  };
})();
