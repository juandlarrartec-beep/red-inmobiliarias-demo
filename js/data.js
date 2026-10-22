/* Datos de ejemplo de la demo. Nada de esto es real: son valores de muestra coherentes entre pantallas.
   Los cálculos (totales, conteos, concentración) salen de estos registros, no están escritos a mano. */
(function () {
  const H = 36e5, D = 864e5;
  const TIPOS = ['Departamentos', 'Casas', 'Terrenos', 'Lotes', 'Locales', 'Naves industriales', 'Proyectos comerciales'];
  const LOCS = ['San Nicolás', 'La Emilia', 'Erézcano', 'Conesa', 'Ramallo', 'Parque Industrial COMIRSA'];
  const ME = 'rossi';

  function seed() {
    const t = Date.now();
    const P = (id, tipo, op, titulo, loc, precio, mon, sup, desc, com, estado, by, h, o) =>
      Object.assign({ id, tipo, op, titulo, loc, precio, mon, sup, desc, com, estado, by: by || null, exp: h != null ? t + h * H : null, renovada: false }, o || {});

    const props = [
      P('PY-0412', 'Departamentos', 'venta', 'Bartolomé Mitre 341, 4° B', 'San Nicolás', 96500, 'u$s', '68 m² cub.', '3 amb · 2 dorm · 1 baño', 3, 'disponible', null, null, {
        sub: 'San Nicolás · a dos cuadras de la peatonal', cart: [['Superficie total', '74 m²'], ['Ambientes', '3'], ['Dormitorios', '2'], ['Baños', '1'], ['Antigüedad', '12 años'], ['Cochera', 'Cubierta · 1'], ['Expensas', '$ 78.000 por mes'], ['Apto crédito', 'Sí']],
        texto: 'Departamento al frente en edificio de ocho pisos con portero, sobre Bartolomé Mitre entre Rivadavia y Belgrano. Living comedor con balcón corrido, cocina separada con lavadero, dos dormitorios con placard y baño completo. Cochera cubierta en el subsuelo. Ocupado por el propietario, se entrega a la escritura. Se muestra con turno previo de lunes a sábado.'
      }),
      P('PY-0387', 'Casas', 'venta', 'Urquiza 1244', 'San Nicolás', 168000, 'u$s', '142 m² cub. · lote 300 m²', '5 amb · 3 dorm · 2 baños · cochera', 3, 'bloqueada', ME, 31.2),
      P('PY-0455', 'Terrenos', 'venta', 'Ruta 9 km 232 · La Emilia', 'La Emilia', 42000, 'u$s', '1.200 m²', 'Apto dúplex · servicios en la vereda', 4, 'bloqueada', 'delatorre', 19.07),
      P('PY-0298', 'Locales', 'alquiler', 'Av. Savio 89', 'San Nicolás', 780000, '$', '54 m² cub.', 'Vidriera a la calle · baño · depósito', '1 mes', 'disponible'),
      P('PY-0501', 'Naves industriales', 'venta', 'Parque Industrial COMIRSA', 'Ramallo', 390000, 'u$s', '900 m² cub.', 'Playa de maniobras · trifásica · oficinas', 3, 'reservada', 'rossi', null, { nota: 'Seña acreditada' }),
      P('PY-0246', 'Departamentos', 'alquiler', 'De la Nación 578, 2° A', 'San Nicolás', 520000, '$', '45 m² cub.', '2 amb · 1 dorm · balcón', '1 mes', 'vendida', 'rossi', null, { nota: 'Alquiler firmado' }),
      P('PY-0470', 'Lotes', 'venta', 'Barrio Los Álamos · lote 27', 'San Nicolás', 38500, 'u$s', '450 m²', 'Servicios completos · esquina', 4, 'reservada', 'rossi', null, { nota: 'Seña acreditada' }),
      P('PY-0472', 'Lotes', 'venta', 'Barrio Los Álamos · lote 31', 'San Nicolás', 41000, 'u$s', '450 m²', 'Servicios completos · al frente', 4, 'disponible'),
      P('PY-0433', 'Casas', 'venta', 'Nuestra Señora del Rosario 812', 'San Nicolás', 235000, 'u$s', '188 m² cub. · lote 420 m²', '6 amb · 4 dorm · 2 baños · quincho', 3, 'reservada', 'rossi', null, { nota: 'Seña acreditada' }),
      P('PY-0362', 'Departamentos', 'venta', 'Belgrano 455, 1° C', 'San Nicolás', 72000, 'u$s', '52 m² cub.', '2 amb · 1 dorm · 1 baño', 3, 'bloqueada', ME, 9.67),
      P('PY-0419', 'Terrenos', 'venta', 'Chacabuco 2180', 'San Nicolás', 55000, 'u$s', '600 m²', 'Lote al frente · escritura inmediata', 4, 'bloqueada', ME, 44.08),
      P('PY-0466', 'Departamentos', 'venta', 'Rivadavia 190', 'San Nicolás', 84000, 'u$s', '61 m² cub.', '3 amb · 2 dorm · cochera', 3, 'bloqueada', 'delatorre', 22),
      P('PY-0355', 'Departamentos', 'venta', 'Rivadavia 118, 2° A', 'San Nicolás', 79000, 'u$s', '58 m² cub.', '2 amb · 1 dorm · balcón', 3, 'disponible'),
      P('PY-0340', 'Terrenos', 'venta', 'Erézcano 340', 'Erézcano', 31000, 'u$s', '800 m²', 'Lote interno · servicios en la calle', 4, 'disponible'),
      P('PY-0409', 'Casas', 'venta', 'Pellegrini 1530', 'San Nicolás', 149000, 'u$s', '130 m² cub. · lote 280 m²', '4 amb · 3 dorm · garage', 3, 'disponible'),
      P('PY-0431', 'Casas', 'venta', 'Barrio Parque · calle 12 Nº 330', 'San Nicolás', 198000, 'u$s', '176 m² cub. · lote 400 m²', '5 amb · 3 dorm · pileta', 3, 'disponible'),
      P('PY-0508', 'Naves industriales', 'venta', 'Ruta 188 km 4', 'San Nicolás', 275000, 'u$s', '600 m² cub.', 'Portón de camiones · oficinas', 3, 'disponible'),
      P('PY-0516', 'Proyectos comerciales', 'venta', 'Galería Av. Savio 600', 'San Nicolás', 520000, 'u$s', '1.100 m²', 'Cuatro locales · en obra', 3, 'disponible'),
      P('PY-0524', 'Locales', 'alquiler', 'Mitre 280', 'San Nicolás', 450000, '$', '38 m² cub.', 'A metros de la peatonal · baño', '1 mes', 'disponible'),
      P('PY-0360', 'Departamentos', 'alquiler', 'Rivadavia 54, 1° A', 'San Nicolás', 410000, '$', '48 m² cub.', '2 amb · 1 dorm · balcón', '1 mes', 'disponible'),
      P('PY-0344', 'Departamentos', 'venta', 'Garibaldi 622, 3° B', 'San Nicolás', 88000, 'u$s', '64 m² cub.', '3 amb · 2 dorm · balcón', 3, 'vendida', 'rossi', null, { nota: 'Operación cerrada' }),
      P('PY-0301', 'Locales', 'alquiler', 'Av. Savio 145', 'San Nicolás', 640000, '$', '70 m² cub.', 'Esquina · vidriera · baño', '1 mes', 'vendida', 'rossi', null, { nota: 'Alquiler firmado' }),
      P('PY-0289', 'Casas', 'venta', 'Falucho 1470', 'San Nicolás', 142000, 'u$s', '120 m² cub.', '4 amb · 2 dorm · patio', 3, 'vendida', 'rossi', null, { nota: 'Operación cerrada' }),
      P('PY-0277', 'Terrenos', 'venta', 'Aristóbulo del Valle 980', 'San Nicolás', 54000, 'u$s', '540 m²', 'Lote a metros de la avenida', 4, 'vendida', 'rossi', null, { nota: 'Operación cerrada' })
    ];

    // Livera: 16 unidades de ejemplo. Los precios no están definidos, por eso no se muestra ninguno.
    const tipoLV = { A: '1 ambiente', B: '2 ambientes', C: '3 ambientes', D: '4 ambientes' };
    const lvEstado = {
      '1A': ['vendida', 'rossi'], '1B': ['vendida', 'delatorre'], '1C': ['vendida', 'bertoldi'], '1D': ['vendida', 'rossi'],
      '2A': ['bloqueada', 'bertoldi', 12.63], '2B': ['disponible'], '2C': ['vendida', 'terra'], '2D': ['vendida', 'andrade'],
      '3A': ['reservada', 'casanorte'], '3B': ['bloqueada', 'bertoldi', 28], '3C': ['bloqueada', 'delatorre', 40], '3D': ['disponible'],
      '4A': ['reservada', 'rossi'], '4B': ['reservada', 'delatorre'], '4C': ['reservada', 'bertoldi'], '4D': ['disponible']
    };
    const lv = [];
    [1, 2, 3, 4].forEach(f => ['A', 'B', 'C', 'D'].forEach(l => {
      const k = f + l, e = lvEstado[k];
      lv.push({ id: 'LV-' + k, piso: f, tipo: f === 4 ? 'Semipiso' : tipoLV[l], estado: e[0], by: e[1] || null, exp: e[2] ? t + e[2] * H : null, renovada: false });
    }));

    const agencies = [
      { id: 'rossi', nombre: 'Rossi Propiedades', titular: 'Hugo A. Rossi', mat: 4821, estado: 'activa', desde: 'Mar 2026', oficina: 'Bartolomé Mitre 268', cerradas: 10 },
      { id: 'delatorre', nombre: 'Delatorre Bienes Raíces', titular: 'Silvina Delatorre', mat: 3907, estado: 'activa', desde: 'Abr 2026', oficina: 'De la Nación 1120', cerradas: 9 },
      { id: 'casanorte', nombre: 'Casa Norte Inmobiliaria', titular: 'Julián Ferrero', mat: 5140, estado: 'activa', desde: 'Abr 2026', oficina: 'Av. Savio 410', cerradas: 4 },
      { id: 'bertoldi', nombre: 'Bertoldi & Asociados', titular: 'Néstor Bertoldi', mat: 2688, estado: 'activa', desde: 'May 2026', oficina: 'Mitre 55', cerradas: 5 },
      { id: 'terra', nombre: 'Terra Nicoleña Propiedades', titular: 'Andrea Vitale', mat: 5302, estado: 'activa', desde: 'Jun 2026', oficina: 'Rivadavia 702', cerradas: 3 },
      { id: 'andrade', nombre: 'Andrade Servicios Inmobiliarios', titular: 'Ramiro Andrade', mat: 3121, estado: 'activa', desde: 'Jun 2026', oficina: 'Pellegrini 233', cerradas: 2 },
      { id: 'nuevacosta', nombre: 'Nueva Costa Propiedades', titular: 'Gabriel Ochoa', mat: 4415, estado: 'pendiente', desde: 'Solicitó hace 18 días', oficina: 'Av. Costanera 90', cerradas: null },
      { id: 'solares', nombre: 'Solares del Paraná', titular: 'Verónica Cabrera', mat: 4790, estado: 'suspendida', desde: 'Suspendida hace 40 días', oficina: 'Ameghino 310', cerradas: 1 }
    ].map(a => Object.assign(a, {
      livera: a.estado === 'activa',
      tipos: TIPOS.map((x, i) => i < 5),
      locs: LOCS.map((x, i) => i < 3),
      perms: [true, true, true, true, false],
      hist: [{ txt: 'Alta en la red', ts: t - 120 * D, by: 'M. Puyella' }]
    }));

    // Consultas: etapa = espera | visita | oferta | sena | boleto | cerrada | caida
    const C = (id, prop, comprador, tel, mail, ag, etapa, ageH, msg) => ({ id, prop, comprador, tel, mail, ag, etapa, ts: t - ageH * H, msg, mensajes: [] });
    const consultas = [
      C('c1', 'PY-0412', 'Fernando Quiroga', '336 15 447 2210', 'fquiroga@mail.com', 'rossi', 'espera', 6, 'El comprador tiene la plata disponible y quiere ver el departamento esta semana. Consulta si el propietario acepta u$s 92.000.'),
      C('c2', 'LV-2B', 'Estudio Ferrari', '336 15 520 8841', 'info@estudioferrari.com', 'rossi', 'espera', 24, 'Pidió la lista de precios y las formas de pago.'),
      C('c3', 'PY-0387', 'Mariela Beltrán', '336 15 601 3345', 'mbeltran@mail.com', 'rossi', 'visita', 48, 'Visita agendada con el propietario.'),
      C('c4', 'PY-0501', 'Logística del Sur S.A.', '336 15 722 1090', 'compras@logisticadelsur.com', 'rossi', 'oferta', 96, 'Contraoferta de Puyella al vendedor por u$s 360.000.'),
      C('c5', 'PY-0470', 'Carla Sosa', '336 15 480 7712', 'csosa@mail.com', 'rossi', 'sena', 120, 'Entrega un lote en parte de pago. Seña acreditada.'),
      C('c6', 'PY-0433', 'Grupo Peralta', '336 15 330 4455', 'peralta@mail.com', 'rossi', 'sena', 192, 'Seña acreditada, boleto en preparación.'),
      C('c7', 'PY-0246', 'Lucía Marconi', '336 15 900 1213', 'lmarconi@mail.com', 'rossi', 'cerrada', 288, 'Alquiler firmado.'),
      C('c8', 'PY-0355', 'Ariel Domínguez', '336 15 611 8820', 'adominguez@mail.com', 'rossi', 'caida', 360, 'El comprador no consiguió el crédito.'),
      C('c9', 'PY-0344', 'J. Alsina', '336 15 245 9087', 'jalsina@mail.com', 'rossi', 'boleto', 408, 'Boleto firmado, escritura en preparación.'),
      C('c10', 'PY-0289', 'Familia Ríos', '336 15 770 3321', 'rios@mail.com', 'rossi', 'boleto', 504, 'Boleto firmado.'),
      C('c11', 'PY-0466', 'Marcos Iturbe', '336 15 410 6602', 'miturbe@mail.com', 'delatorre', 'visita', 24, 'Visita agendada.'),
      C('c12', 'PY-0340', 'Marcos Iturbe', '336 15 410 6602', 'miturbe@mail.com', 'delatorre', 'espera', 30, 'Pregunta por servicios y escritura.'),
      C('c13', 'PY-0298', 'Transportes Lauro S.A.', '336 15 880 4100', 'lauro@transportes.com', 'bertoldi', 'espera', 48, 'Busca un local con depósito.'),
      C('c14', 'LV-3B', 'A. Lisi', '336 15 330 1180', 'alisi@mail.com', 'bertoldi', 'visita', 20, 'Visita al proyecto agendada.'),
      C('c15', 'LV-3A', 'R. Vidal', '336 15 202 9915', 'rvidal@mail.com', 'casanorte', 'sena', 150, 'Seña acreditada.')
    ];
    consultas.forEach(c => { if (c.etapa === 'visita') c.cuando = c.ts + 2 * D + (c.id === 'c3' ? 4 : 2) * H; });

    // Comisiones de Rossi. mon: 'u' = u$s, 'p' = pesos. Cierre = día de la seña.
    const K = (dias, op, ptxt, prop, comprador, monto, pct, estado, cobroDias, mon) => ({
      cierre: t - dias * D, op, ptxt, prop, comprador, monto, pct, mon: mon || 'u', estado,
      com: pct ? Math.round(monto * pct / 100) : monto, cobro: cobroDias == null ? null : t + cobroDias * D
    });
    const coms = [
      K(12, 'Alquiler', 'De la Nación 578, 2° A', 'PY-0246', 'L. Marconi', 520000, 0, 'cobrada', -7, 'p'),
      K(19, 'Venta', 'Nuestra Señora del Rosario 812', 'PY-0433', 'Grupo Peralta', 235000, 3, 'facturada', 3),
      K(26, 'Venta', 'Barrio Los Álamos · lote 27', 'PY-0470', 'C. Sosa', 38500, 4, 'pendiente', null),
      K(34, 'Venta', 'Garibaldi 622, 3° B', 'PY-0344', 'J. Alsina', 88000, 3, 'cobrada', -21),
      K(41, 'Alquiler', 'Av. Savio 145', 'PY-0301', 'Panadería Doña Ema', 640000, 0, 'cobrada', -35, 'p'),
      K(50, 'Venta', 'Falucho 1470', 'PY-0289', 'Familia Ríos', 142000, 3, 'cobrada', -36),
      K(60, 'Venta', 'Aristóbulo del Valle 980', 'PY-0277', 'D. Ferreyra', 54000, 4, 'facturada', 6),
      K(120, 'Venta', 'Mitre 1120', null, 'S. Aguirre', 160000, 3, 'cobrada', -95),
      K(160, 'Venta', 'Pellegrini 88, 2° A', null, 'M. Funes', 102000, 3, 'cobrada', -140),
      K(200, 'Venta', 'Barrio Parque · lote 12', null, 'E. Castro', 112000, 4, 'cobrada', -180)
    ];

    const novedades = [
      { tag: 'nueva', txt: 'Departamento en Rivadavia 118, 2° A · u$s 79.000', cuando: 'hace 2 h', prop: 'PY-0355' },
      { tag: 'precio', txt: 'Depto. Bartolomé Mitre 341 bajó de u$s 104.000 a u$s 96.500', cuando: 'hace 5 h', prop: 'PY-0412' },
      { tag: 'liberada', txt: 'Terreno en Erézcano 340 volvió a estar disponible', cuando: 'ayer', prop: 'PY-0340' },
      { tag: 'livera', txt: 'Lista de precios vigente actualizada al 01/09/2026', cuando: 'ayer', ruta: '#/livera' },
      { tag: 'nueva', txt: 'Lote 31 en Barrio Los Álamos · u$s 41.000', cuando: 'hace 2 días', prop: 'PY-0472' },
      { tag: 'precio', txt: 'Local en Av. Savio 89 pasó a $ 780.000 por mes', cuando: 'hace 3 días', prop: 'PY-0298' }
    ];

    return {
      v: 2, seededAt: t, role: null, props, lv, agencies, consultas, coms, novedades,
      registro: { 'PY-0412|3364472210': 'rossi', 'PY-0412|3364000111': 'delatorre' },
      avisos: {}
    };
  }
  window.DEMO = { H, D, TIPOS, LOCS, ME, seed };
})();
