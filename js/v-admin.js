/* Pantallas de administración de Puyella y panel del inversor. */
(function () {
  const A = APP, { esc, num, $, $$, fdate, fdt, ago } = APP, { H, D, TIPOS, LOCS } = DEMO;
  const S = () => A.S(), R = A.routes;
  const aStPill = e => '<span class="st ' + { activa: 'vd', pendiente: 'rs', suspendida: 'gr' }[e] + '">' + { activa: 'Activa', pendiente: 'Pendiente de alta', suspendida: 'Suspendida' }[e] + '</span>';
  const tomadas = id => A.blocks().filter(u => u.by === id).length;
  const cons30 = id => S().consultas.filter(c => c.ag === id && Date.now() - c.ts <= 30 * D).length;
  const livCount = () => S().agencies.filter(a => a.livera && a.estado === 'activa').length;

  /* ---------- inmobiliarias adheridas ---------- */
  A.admF = { tab: 'todas', q: '' };
  R.adheridas = () => {
    const F = A.admF, ags = S().agencies, n = e => ags.filter(a => a.estado === e).length;
    const list = () => ags.filter(a => (F.tab === 'todas' || a.estado === F.tab) && (!F.q || (a.nombre + a.titular + a.mat).toLowerCase().includes(F.q.toLowerCase())));
    const row = a => {
      const tags = (a.livera ? ['LIVERA'] : []).concat(a.tipos.map((x, i) => x ? ['Deptos', 'Casas', 'Terrenos', 'Lotes', 'Locales', 'Naves', 'Proyectos'][i] : null).filter(Boolean)).slice(0, 4);
      const acc = a.estado === 'pendiente' ? '<button class="btn p xs" data-a="alta:' + a.id + '">Dar de alta</button>' : '';
      const menu = A.menu([{ t: 'Ver acceso', a: 'go:#/acceso/' + a.id }].concat(a.estado === 'activa' ? [{ t: 'Cortar acceso', a: 'cortar:' + a.id, d: 1 }] : a.estado === 'suspendida' ? [{ t: 'Reactivar', a: 'reactivar:' + a.id }] : []));
      return '<div class="r"><span data-l="Inmobiliaria" class="full acell">' + A.avatar(a) + '<span><b style="font:400 19px var(--serif)">' + esc(a.nombre) + '</b><small>' + esc(a.titular) + ' · Mat. ' + a.mat + '</small></span></span><span data-l="Estado">' + aStPill(a.estado) + '</span><span data-l="En la red" class="mono" style="font-size:13px">' + a.desde + '</span>' +
        '<span data-l="Qué vende" class="full" style="display:flex;gap:6px;flex-wrap:wrap">' + (a.estado === 'activa' ? tags.map(t => '<span class="pill-c' + (t === 'LIVERA' ? ' az' : '') + '">' + t + '</span>').join('') : '<span class="pill-c">' + (a.estado === 'pendiente' ? 'Sin acceso' : 'Acceso cortado') + '</span>') + '</span>' +
        '<span data-l="Tomadas" class="num" style="font:600 22px var(--sans)">' + (a.estado === 'pendiente' ? '—' : tomadas(a.id)) + '</span><span data-l="Cons. 30 d" class="num">' + (a.estado === 'pendiente' ? '—' : cons30(a.id)) + '</span><span data-l="Cerradas" class="num">' + (a.cerradas == null ? '—' : a.cerradas) + '</span>' +
        '<span data-l="Acciones" class="full" style="display:flex;gap:8px;align-items:center;justify-content:flex-end">' + acc + menu + '</span></div>';
    };
    const paint = () => { const l = list(), el = $('#arows'); if (!el) return; el.innerHTML = l.length ? l.map(row).join('') : '<div class="r" style="display:block">' + A.empty('Ninguna inmobiliaria coincide', '<button class="btn mt" data-a="limpiaA">Limpiar búsqueda</button>') + '</div>'; };
    A.acts.limpiaA = () => { A.admF.q = ''; A.admF.tab = 'todas'; A.refresh(); };
    return {
      doc: 'Inmobiliarias',
      html: A.shell('<div class="grid g4 kp">' + [['Inmobiliarias en la red', ags.length], ['Comercializando LIVERA', livCount()], ['Unidades tomadas ahora', A.blocks().length], ['Esperan el alta', n('pendiente')]].map((k, i) => '<div class="card"' + (i === 3 && k[1] ? ' style="border:1.5px solid var(--azul)"' : '') + '><div class="lab">' + k[0] + '</div><div class="big" style="margin-top:8px">' + k[1] + '</div></div>').join('') + '</div>' +
        '<div class="tbl card mt" style="--cols:2fr 1.2fr 1fr 1.8fr 70px 70px 80px 150px"><div class="tabs" id="at" style="padding:0 14px;align-items:center">' + [['todas', 'Todas', ags.length], ['activa', 'Activas', n('activa')], ['pendiente', 'Pendientes de alta', n('pendiente')], ['suspendida', 'Suspendidas', n('suspendida')]].map(t => '<button data-t="' + t[0] + '" class="' + (F.tab === t[0] ? 'on' : '') + '">' + t[1] + ' · ' + t[2] + '</button>').join('') + '<button style="margin-left:auto;color:var(--azul);font:500 12px var(--mono);letter-spacing:.1em" data-a="demo:Exportación a planilla: disponible en la versión real">EXPORTAR LISTADO</button></div>' +
        '<div class="r h"><span>Inmobiliaria</span><span>Estado</span><span>En la red</span><span>Qué está vendiendo</span><span class="num">Tomadas</span><span class="num">Cons. 30 d</span><span class="num">Cerradas</span><span class="num">Acciones</span></div><div id="arows"></div></div>' +
        '<div class="note mt"><span>Cortar el acceso deja las operaciones en curso a nombre de la inmobiliaria, pero le saca el catálogo y los bloqueos activos vuelven a la cartera.</span></div>',
        { title: 'Inmobiliarias adheridas', search: A.searchBox('aq', F.q, 'Buscar inmobiliaria o martillero') }),
      bind: r => {
        paint();
        $('#aq', r).addEventListener('input', e => { F.q = e.target.value; paint(); });
        $('#at', r).onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; F.tab = b.dataset.t; $$('#at [data-t]').forEach(x => x.classList.toggle('on', x === b)); paint(); };
      }
    };
  };
  const hist = (a, txt) => { a.hist.unshift({ txt, ts: Date.now(), by: 'M. Puyella' }); };
  A.acts.cortar = id => {
    const a = A.agency(id), n = tomadas(id);
    A.confirm({ title: 'Cortar el acceso de ' + a.nombre + '?', text: 'Pierde el catálogo' + (n ? ' y sus ' + n + ' bloqueos activos vuelven a la cartera' : '') + '. Las operaciones en curso siguen a su nombre.', ok: 'Cortar acceso', danger: true }, () => {
      A.blocks().filter(u => u.by === id).forEach(u => { u.estado = 'disponible'; u.by = null; u.exp = null; });
      a.estado = 'suspendida'; a.desde = 'Suspendida hoy'; hist(a, 'Se cortó el acceso'); A.save(); A.toast('Acceso cortado'); A.refresh();
    });
  };
  A.acts.reactivar = id => { const a = A.agency(id); a.estado = 'activa'; a.desde = 'Reactivada hoy'; hist(a, 'Se reactivó el acceso'); A.save(); A.toast('Acceso reactivado'); A.refresh(); };
  A.acts.alta = id => { const a = A.agency(id); a.estado = 'activa'; a.desde = 'Alta hoy'; a.livera = false; hist(a, 'Alta en la red'); A.save(); A.toast(a.nombre + ' ya está en la red'); A.refresh(); };

  /* ---------- accesos por inmobiliaria ---------- */
  R.acceso = ([id]) => {
    const ags = S().agencies, a = A.agency(id) || ags[1];
    const cartera = t => S().props.filter(p => p.tipo === t).length;
    const sw = (name, on, lbl, extra) => '<label class="swr' + (on ? '' : ' off') + '"><span style="font-size:18px">' + lbl + (extra ? ' <span class="mut">· ' + extra + '</span>' : '') + '</span><span class="sw"><input type="checkbox" name="' + name + '"' + (on ? ' checked' : '') + '><i></i></span></label>';
    const permisos = ['Tomar unidades 48 h', 'Registrar compradores', 'Mandar la ficha con su logo', 'Descargar planos de LIVERA', 'Ver datos del propietario'];
    const body = '<div class="ph"><div><label class="lab" for="asel">Inmobiliaria</label><br><select class="in" id="asel" style="width:auto;min-width:min(340px,100%);margin-top:6px">' + ags.map(x => '<option value="' + x.id + '"' + (x.id === a.id ? ' selected' : '') + '>' + esc(x.nombre) + '</option>').join('') + '</select></div><div>' + aStPill(a.estado) + '</div></div>' +
      (a.estado !== 'activa' ? '<div class="note err" style="margin-bottom:18px"><span>' + (a.estado === 'pendiente' ? 'El alta está pendiente: todavía no tiene acceso a la cartera.' : 'El acceso está cortado. Para que vuelva a ver la cartera, reactivalo desde Inmobiliarias.') + '</span></div>' : '') +
      '<form id="acf"><div class="fi acc"><div class="grid">' +
      '<div class="card" style="border:1.5px solid var(--azul)"><span class="pill-c rj">Livera</span> <span class="lab" style="margin-left:6px">Proyecto con licencia de comercialización</span><div class="swr" style="border:0"><div><h2 class="h3" style="font-size:24px">Puede comercializar LIVERA</h2><p class="mut">Ve el proyecto, la lista de precios vigente, toma unidades y registra compradores. Se suma a las ' + livCount() + ' inmobiliarias que ya lo están vendiendo.</p></div><span class="sw"><input type="checkbox" name="livera"' + (a.livera ? ' checked' : '') + '><i></i></span></div></div>' +
      '<div class="card"><div class="ln"><span class="lab">Tipos de inmueble que ve</span><span class="lab az" id="tcount"></span></div>' + TIPOS.map((t, i) => sw('tipo' + i, a.tipos[i], t, cartera(t) + ' en cartera')).join('') + '</div>' +
      '<div class="grid g2"><div class="card"><div class="lab">Localidades</div>' + LOCS.map((l, i) => '<label class="chk" style="display:flex;min-height:46px"><input type="checkbox" name="loc' + i + '"' + (a.locs[i] ? ' checked' : '') + '> <span style="font-size:18px">' + l + '</span></label>').join('') + '</div>' +
      '<div class="card"><div class="lab">Permisos</div>' + permisos.map((p, i) => sw('perm' + i, a.perms[i], p)).join('') + '</div></div></div>' +
      '<aside class="grid" style="align-content:start"><div class="card"><div style="display:flex;gap:14px;align-items:center">' + A.avatar(a, true) + '<div><h2 class="h3">' + esc(a.nombre) + '</h2><span class="mono mut" style="font-size:12px">MAT. ' + a.mat + ' · C.M.C.P. SAN NICOLÁS</span></div></div>' +
      [['Martillero/a', a.titular], ['Oficina', a.oficina], ['En la red desde', a.desde], ['Operaciones cerradas', a.cerradas == null ? '—' : a.cerradas]].map(r => '<div class="ln" style="padding:12px 0;border-top:1px solid var(--line)"><span class="mut">' + r[0] + '</span><span style="text-align:right">' + esc(r[1]) + '</span></div>').join('') + '</div>' +
      '<div class="card soft"><div class="lab" style="color:var(--rojo2)">Pantalla de Puyella</div><p style="margin-top:6px">Las inmobiliarias no configuran su propio acceso. Cada cambio queda registrado con fecha, hora y usuario.</p></div>' +
      '<div class="card"><div class="lab">Historial del acceso</div>' + a.hist.slice(0, 5).map(h => '<div style="padding:8px 0"><div style="font-size:18px">' + esc(h.txt) + '</div><span class="mono mut" style="font-size:12px">' + fdate(h.ts) + ' · ' + h.by + '</span></div>').join('') + '</div>' +
      '<button class="btn p w" type="submit" style="min-height:54px"' + (a.estado === 'pendiente' ? ' disabled' : '') + '>Guardar cambios</button>' +
      (a.estado === 'activa' ? '<button class="btn d w" type="button" data-a="cortar:' + a.id + '">Cortar el acceso</button>' : '') + '</aside></div></form>';
    return {
      doc: 'Acceso · ' + a.nombre,
      html: A.shell(body, { crumb: '<a href="#/adheridas">Accesos</a> <span>/</span> ' + esc(a.nombre), title: 'Acceso', back: '#/adheridas', detail: !!id }),
      bind: r => {
        $('#asel', r).onchange = e => { location.hash = '#/acceso/' + e.target.value; };
        const upd = () => { $('#tcount').textContent = $$('[name^=tipo]:checked', r).length + ' de ' + TIPOS.length + ' habilitados'; $$('.swr', r).forEach(x => x.classList.toggle('off', !$('input', x).checked)); };
        r.addEventListener('change', upd); upd();
        $('#acf', r).onsubmit = e => {
          e.preventDefault();
          a.livera = $('[name=livera]').checked; a.tipos = TIPOS.map((t, i) => $('[name=tipo' + i + ']').checked); a.locs = LOCS.map((l, i) => $('[name=loc' + i + ']').checked); a.perms = permisos.map((p, i) => $('[name=perm' + i + ']').checked);
          if (!a.locs.some(Boolean)) { A.toast('Dejá al menos una localidad habilitada', true); return; }
          hist(a, 'Se modificó el acceso'); A.save(); A.toast('Cambios guardados y registrados en el historial'); A.refresh();
        };
      }
    };
  };

  /* ---------- operaciones ---------- */
  A.opF = 'red';
  A.acts.opf = v => { A.opF = v; A.refresh(); };
  A.acts.soltarC = id => { const c = S().consultas.find(x => x.id === id); c.etapa = 'espera'; delete c.cuando; A.save(); A.toast('Volvió a consultas entrantes'); A.refresh(); };
  A.acts.tomarC = id => { const c = S().consultas.find(x => x.id === id); c.etapa = 'visita'; c.cuando = Date.now() + 2 * D; A.save(); A.toast('Consulta tomada: pasa a Visita. Podés soltarla desde su tarjeta.'); A.refresh(); };
  R.operaciones = () => {
    const s = S(), esp = A.esperan(), blocks = A.blocks().sort((a, b) => a.exp - b.exp);
    const stages = [['visita', 'Visita'], ['oferta', 'Oferta'], ['sena', 'Seña'], ['boleto', 'Boleto y escritura']];
    const enCurso = s.consultas.filter(c => stages.some(x => x[0] === c.etapa));
    const f = c => A.opF === 'red' || A.isLV(A.unit(c.prop));
    const cerr = s.consultas.filter(c => c.etapa === 'cerrada').length;
    const fn = [['Sin tomar', esp.length]].concat(stages.map(x => [x[1], enCurso.filter(c => c.etapa === x[0]).length])), fmx = Math.max(1, ...fn.map(x => x[1]));
    const funnel = '<div class="card mt"><div class="lab">Embudo de operaciones · de la consulta al boleto</div><div class="funnel">' + fn.map((x, i) => '<div class="fn"><span class="fl2">' + x[0] + '</span><span class="ft2"><i style="width:' + Math.max(6, 100 * x[1] / fmx) + '%;opacity:' + (1 - i * .13).toFixed(2) + '"></i></span><b>' + x[1] + '</b></div>').join('') + '</div></div>';
    const det = c => c.etapa === 'visita' && c.cuando ? '<span class="mono" style="font-size:12px;color:var(--azul)">' + fdt(c.cuando) + '</span>' : c.etapa === 'oferta' ? '<span class="mono mut" style="font-size:12px">Contraoferta en curso</span>' : c.etapa === 'sena' ? '<span class="mono" style="font-size:12px;color:var(--verde)">Seña acreditada</span>' : c.etapa === 'boleto' ? '<span class="mono" style="font-size:12px;color:var(--azul)">Boleto firmado</span>' : '';
    const body = '<div class="grid g4 kp">' + [['Consultas entrantes sin tomar', esp.length, esp.length], ['Unidades bloqueadas ahora', blocks.length], ['Operaciones en curso', enCurso.length], ['Cerradas', cerr]].map((k, i) => '<div class="card"' + (k[2] ? ' style="border:1.5px solid var(--azul)"' : '') + '><div class="lab">' + k[0] + '</div><div class="big" style="margin-top:8px">' + k[1] + '</div></div>').join('') + '</div>' +
      funnel + '<div class="grid mt ais" id="opg"><div class="card"><div class="ln"><span class="lab">Consultas entrantes</span><span class="pill-c rj">' + esp.length + '</span></div>' +
      (esp.length ? esp.map(c => { const u = A.unit(c.prop); return '<div style="padding:14px 0;border-top:1px solid var(--line)"><div class="ln"><span class="mono mut" style="font-size:12px">' + c.prop + '</span><span class="mono mut" style="font-size:12px">' + ago(c.ts) + '</span></div><div style="font-size:21px;margin:2px 0">' + esc(c.comprador) + '</div><div class="mut">La trajo ' + esc(A.agency(c.ag).nombre) + ' · ' + esc(A.title(u)) + '</div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn p sm" data-a="tomarC:' + c.id + '">Tomar</button><a class="btn sm" href="#/ficha/' + c.prop + '">Ver ficha</a></div></div>'; }).join('') : A.empty('No hay consultas sin tomar', 'Todo al día.')) + '</div>' +
      '<div><div class="ln" style="margin-bottom:12px;flex-wrap:wrap"><span class="lab">Operaciones en curso por etapa</span><span class="seg"><button data-a="opf:red" class="' + (A.opF === 'red' ? 'on' : '') + '">Toda la red</button><button data-a="opf:lv" class="' + (A.opF === 'lv' ? 'on' : '') + '">Sólo LIVERA</button></span></div>' +
      '<div class="kan">' + stages.map(st => { const cs = enCurso.filter(c => c.etapa === st[0] && f(c)); return '<div class="kc"><div class="ln"><span class="lab">' + st[1] + '</span><span class="lab">' + cs.length + '</span></div>' + (cs.map(c => { const u = A.unit(c.prop); return '<div class="card" style="padding:14px;margin-top:10px">' + A.thumb(u, 'wide') + '<span class="mono mut" style="font-size:11.5px">' + c.prop + '</span><div style="font-size:18px;line-height:1.25;margin:2px 0">' + esc(A.title(u)) + '</div><div class="mut" style="font-size:15px">' + esc(c.comprador) + ' · ' + esc(A.agency(c.ag).nombre.split(' ')[0]) + '</div>' + det(c) + (c.etapa === 'visita' ? '<button class="btn xs" style="margin-top:10px" data-a="soltarC:' + c.id + '">Soltar</button>' : '') + '</div>'; }).join('') || '<p class="mut" style="padding:14px 0 0">Sin operaciones</p>') + '</div>'; }).join('') + '</div></div></div>' +
      '<div class="tbl card mt" style="--cols:90px 1.6fr 1.5fr 1fr 1fr 60px"><div class="ln" style="padding:18px 20px;flex-wrap:wrap"><span class="lab">Unidades bloqueadas ahora · ' + blocks.length + '</span><span class="lab az">Sólo Puyella ve quién tiene cada unidad</span></div><div class="r h"><span>Código</span><span>Propiedad</span><span>La tomó</span><span>Estado</span><span>Se libera en</span><span class="num">Acción</span></div>' +
      (blocks.length ? blocks.map(u => '<div class="r"><span data-l="Código" class="mono" style="font-size:13px">' + u.id + '</span><span data-l="Propiedad" class="full pcell">' + A.thumb(u) + '<span style="font-size:18px">' + esc(A.title(u)) + '</span></span><span data-l="La tomó" style="font-size:18px">' + esc(A.agency(u.by).nombre) + '</span><span data-l="Estado">' + A.pill(u) + '</span><span data-l="Se libera en">' + A.tm(u.exp) + '</span><span data-l="Acción" class="num full" style="display:flex;justify-content:flex-end">' + A.menu([{ t: 'Liberar unidad', a: 'liberar:' + u.id, d: 1 }, { t: 'Ver ficha', a: 'go:#/ficha/' + u.id }]) + '</span></div>').join('') : '<div class="r" style="display:block">' + A.empty('No hay unidades bloqueadas') + '</div>') + '</div>';
    return { doc: 'Operaciones', html: A.shell(body, { title: 'Operaciones de la red' }) };
  };
  const st = document.createElement('style');
  st.textContent = '.kan{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kc{background:var(--papel2);border-radius:16px;padding:14px;min-width:0}@media(max-width:1200px){#opg{grid-template-columns:1fr!important}}@media(max-width:1100px){.kan{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.kan{grid-template-columns:1fr}}';
  document.head.appendChild(st);

  /* ---------- panel del inversor ---------- */
  R.inversor = () => {
    const s = S(), lv = s.lv, cnt = e => lv.filter(u => u.estado === e).length;
    const ops = lv.filter(u => ['vendida', 'reservada'].includes(u.estado)), by = {};
    ops.forEach(u => { by[u.by] = (by[u.by] || 0) + 1; });
    const dist = Object.values(by).sort((a, b) => b - a), tot = ops.length, pct = v => Math.round(100 * v / tot);
    const top = dist[0] ? pct(dist[0]) : 0, nAg = dist.length;
    const meses = [1, 1, 2, 2, 3, 1], now = new Date(), mx = Math.max(...meses);
    const mlbl = i => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '').toUpperCase();
    const seg = (e, c) => '<i style="width:' + (100 * cnt(e) / lv.length) + '%;background:' + c + '"></i>';
    const dot = c => '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:' + c + ';margin-right:8px"></span>';
    const tt = lv.length, C = 2 * Math.PI * 40, comp = Math.round(100 * (cnt('vendida') + cnt('reservada')) / tt);
    let off = 0;
    const dseg = (n, c) => { const l = C * n / tt, r = '<circle cx="50" cy="50" r="40" fill="none" stroke="' + c + '" stroke-width="16" stroke-dasharray="' + l.toFixed(1) + ' ' + (C - l).toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 50 50)"/>'; off += l; return r; };
    const donut = '<svg viewBox="0 0 100 100" role="img" aria-label="' + comp + ' % de las unidades con seña o vendidas">' + dseg(cnt('disponible'), '#19784c') + dseg(cnt('bloqueada'), '#a9a595') + dseg(cnt('reservada'), '#d79a22') + dseg(cnt('vendida'), '#16161a') + '</svg><div class="dn-c"><b>' + comp + ' %</b><small>comprometido</small></div>';
    const obra = '<div class="card mt"><div class="obra"><div class="dn">' + donut + '</div><div><div class="lab">Avance de obra · fotos de ejemplo</div><p class="mut" style="margin:6px 0 12px">El porcentaje comprometido cuenta unidades con seña acreditada o vendidas sobre el total de ejemplo.</p><div class="obrag">' + [0, 1, 2].map(i => A.pic(A.F('obra', i), 'Obra ' + (i + 1), 'full')).join('') + '</div></div></div></div>';
    const body = '<div class="iv"><div class="ph"><div><div style="display:flex;gap:8px;margin-bottom:10px"><span class="pill-c rj">Livera</span><span class="pill-c">Datos de ejemplo</span></div><h1>Avance de la comercialización</h1><p>La red de inmobiliarias de Puyella comercializa el proyecto. Este panel se actualiza solo, con cada movimiento de la plataforma.</p></div><div class="acts"><button class="btn" data-a="print">Descargar informe</button></div></div>' +
      '<div class="card"><div class="ln" style="flex-wrap:wrap"><span class="lab">Unidades por estado · ' + lv.length + ' unidades de ejemplo</span><span class="lab">Cantidad total a definir por el desarrollo</span></div><div class="grid g4 kp mt" style="margin-bottom:16px">' + [['disponible', 'Disponibles', '#19784c'], ['bloqueada', 'Bloqueadas', '#6e6b5f'], ['reservada', 'Reservadas', '#8a5a00'], ['vendida', 'Vendidas', '#16161a']].map(x => '<div><div class="lab">' + dot(x[2]) + x[1] + '</div><div class="big" style="margin-top:6px">' + cnt(x[0]) + '</div></div>').join('') + '</div>' +
      '<div class="bar-p" style="height:12px" role="img" aria-label="Proporción de unidades por estado">' + seg('disponible', '#19784c') + seg('bloqueada', '#a9a595') + seg('reservada', '#d79a22') + seg('vendida', '#16161a') + '</div></div>' +
      obra + '<div class="card mt"><div class="grid g12 c"><div><div class="lab" style="color:var(--azul)">Concentración de la venta</div><div style="font:600 clamp(70px,11vw,120px)/1 var(--sans);color:var(--azul);margin:10px 0">' + top + ' %</div><p style="font-size:21px">es lo máximo que concentra una sola inmobiliaria sobre el total vendido.</p><p class="mut mt">El ' + (100 - top) + ' % restante lo trajeron las otras ' + (['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'][nAg - 1] || nAg - 1) + '. ' + (['Cero', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'][nAg] || nAg) + ' inmobiliarias de San Nicolás y la zona están comercializando LIVERA en este momento.</p><div class="grid g2 mt" style="border-top:1px solid var(--line);padding-top:14px"><div><div class="lab">Inmobiliarias comercializando</div><div class="big" style="font-size:34px;margin-top:4px">' + livCount() + '</div></div><div><div class="lab">Operaciones con seña o venta</div><div class="big" style="font-size:34px;margin-top:4px">' + tot + '</div></div></div></div>' +
      '<div><div class="ln" style="flex-wrap:wrap"><span class="lab">Reparto de las ventas entre las inmobiliarias de la red</span><span class="lab">Sin nombres · identificadas por número</span></div><div class="cbars mt">' + dist.map((v, i) => '<div class="b"><span class="lab" style="' + (i === 0 ? 'color:var(--azul)' : '') + '">Inmobiliaria ' + A.p2(i + 1) + '</span><span class="t"><i style="width:' + (100 * v / dist[0]) + '%"></i></span><span>' + pct(v) + ' %</span></div>').join('') + '</div><p class="mut mt" style="border-top:1px solid var(--line);padding-top:14px">Cuantas más inmobiliarias venden, más baja esta barra. El panel no muestra qué inmobiliaria es cada una: el reparto se mira como dato, no como ranking.</p></div></div></div>' +
      '<div class="grid g2 mt"><div class="card"><div class="ln" style="flex-wrap:wrap"><span class="lab">Ritmo de venta por mes</span><span class="lab">' + meses.reduce((a, b) => a + b, 0) + ' operaciones en 6 meses</span></div><div class="ritmo">' + meses.map((v, i) => '<div><b>' + v + '</b><i style="height:' + (v / mx * 100 * .75) + '%"></i><span>' + mlbl(i) + '</span></div>').join('') + '</div><p class="mut mt" style="border-top:1px solid var(--line);padding-top:12px">Cada operación es una unidad con seña acreditada. ' + mlbl(5).charAt(0) + mlbl(5).slice(1).toLowerCase() + ' está en curso.</p></div>' +
      '<div class="card"><div class="ln" style="flex-wrap:wrap"><span class="lab">Lista de precios</span><span class="pill-c">Datos de ejemplo</span></div><div class="big" style="font-size:36px;margin:12px 0 8px">01/09/2026</div><p style="font-size:18px">Las inmobiliarias de la red cotizan con la misma lista, así que el descuento se negocia una sola vez y queda a la vista.</p><p class="mut mt">Los precios todavía no están definidos por el desarrollo. Cuando existan, acá vas a ver la distancia entre precio de lista y precio de cierre de cada unidad vendida.</p><div style="border-top:1px solid var(--line);margin-top:14px">' + lv.filter(u => u.estado === 'vendida').map(u => '<div class="ln" style="padding:10px 0;border-bottom:1px solid var(--line)"><span style="font-size:18px">Unidad ' + u.id.slice(3) + ' · ' + u.tipo.toLowerCase() + '</span><span class="lab">Lista y cierre a definir</span></div>').join('') + '</div></div></div>' +
      '<div class="note mt" style="margin-bottom:24px"><span class="pill-c" style="margin-right:8px">Sólo lectura</span><span>Este panel no muestra datos de compradores ni nombres de inmobiliarias, y no permite operar sobre las unidades. Las consultas del proyecto las responde Puyella.</span></div></div>';
    return {
      doc: 'Panel del inversor',
      html: '<div class="top2"><span class="logo">P</span><b>PUYELLA</b><span style="border-left:1px solid #ffffff33;padding-left:14px;color:#fff;letter-spacing:.14em">Panel del inversor</span><span class="pill-c" style="background:none;border:1px solid #ffffff55;color:#e8e6df">Sólo lectura</span><div class="fl"></div><button class="me" data-a="perfil" style="width:auto;padding:6px 12px"><span class="av">IF</span><span><b style="font-size:14px">Inversores LIVERA</b><small>Fideicomiso · 4 miembros</small></span></button></div>' + body
    };
  };
  A.routes.inversor.__ = 1;
})();
