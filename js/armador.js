// Armador de rutas: eliges países y días, y ordena las ciudades y reparte las noches.
// crearArmador(raíz, alCambiar) → { ruta() }. alCambiar(ruta) se llama cada vez que cambia algo.
window.crearArmador = function (raiz, alCambiar) {
  const V = window.VIAJE, K = window.CATALOGO, FOTOS = window.FOTOS || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = "rm-ruta";

  // Une el catálogo con las fichas completas de datos.js
  const C = {};
  Object.entries(K.ciudades).forEach(([id, k]) => {
    const v = V.ciudades[id] || {};
    C[id] = { id, ...k, nombre: k.nombre || v.nombre, pais: k.pais || v.pais, c: k.c || v.c,
      resumen: k.resumen || v.intro, imperdibles: k.imperdibles || (v.hacer || []).slice(0, 3), ficha: !!V.ciudades[id],
      foto: v.foto ? `img/${v.foto}` : FOTOS[k.nombre] ? `img/${FOTOS[k.nombre].f}` : "", credito: FOTOS[k.nombre] };
  });
  const nombrePais = id => (K.paises.find(p => p.id === id) || {}).nombre || id;

  function desdeRuta(r) {
    const fuera = Object.keys(C).filter(id => r.paises.includes(C[id].pais) && !C[id].fija && !(id in r.noches));
    return { ruta: r.id, entrada: r.entrada || "paris", salida: r.salida || "ultima", orden: r.orden ? [...r.orden] : null, paises: [...r.paises], fuera, noches: { ...r.noches }, dias: Object.values(r.noches).reduce((a, b) => a + b, 0) + 1 };
  }
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)) || desdeRuta(K.rutas[0]); } catch (e) { s = desdeRuta(K.rutas[0]); }
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

  // ---------- Cálculo ----------
  const km = (a, b) => {
    const R = 6371, r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  const largo = ids => ids.slice(1).reduce((t, id, i) => t + km(C[ids[i]].c, C[id].c), 0);

  // Vecino más cercano desde la ciudad de llegada y luego 2-opt para quitar cruces. Beaune va siempre después de Mussy.
  // ent = ciudad de llegada; sal = "ultima" (vuelo desde la última parada) o una ciudad (Madrid/París) desde donde se vuelve.
  // Si se vuelve desde la misma ciudad de llegada, el recorrido se trata como un circuito cerrado.
  function ordenar(ids, manual, ent, sal) {
    const finFijo = sal !== "ultima" && sal !== ent && ids.includes(sal) ? sal : null;
    const cerrado = sal === ent;
    const mid = ids.filter(id => id !== ent && id !== finFijo && id !== "beaune");
    let medio;
    if (manual && manual.length) medio = [...manual.filter(id => mid.includes(id)), ...mid.filter(id => !manual.includes(id))];
    else {
      const resto = [...mid], orden = [ent];
      while (resto.length) {
        const ult = C[orden[orden.length - 1]].c;
        resto.sort((a, b) => km(ult, C[a].c) - km(ult, C[b].c));
        orden.push(resto.shift());
      }
      if (finFijo) orden.push(finFijo);
      const L = o => largo(o) + (cerrado && o.length > 1 ? km(C[o[o.length - 1]].c, C[o[0]].c) : 0);
      const tope = finFijo ? orden.length - 1 : orden.length;
      for (let mejora = true; mejora;) {
        mejora = false;
        for (let i = 1; i < tope - 1; i++) for (let j = i + 1; j < tope; j++) {
          const prueba = [...orden.slice(0, i), ...orden.slice(i, j + 1).reverse(), ...orden.slice(j + 1)];
          if (L(prueba) < L(orden) - 1) { orden.splice(0, orden.length, ...prueba); mejora = true; }
        }
      }
      medio = orden.slice(1, finFijo ? -1 : undefined);
    }
    const o = [ent, ...medio, ...(finFijo ? [finFijo] : [])];
    const im = o.indexOf("mussy");
    if (im >= 0 && ids.includes("beaune")) o.splice(im + 1, 0, "beaune");
    return o;
  }

  // Reparte noches: todos parten en su mínimo; las que sobran van primero a las imperdibles.
  function repartir(ids, total, prot = ["paris"]) {
    const n = {}, quitadas = [];
    let lista = ids.filter(id => !C[id].fija);
    const minimo = () => lista.reduce((t, id) => t + C[id].min, 0);
    while (minimo() > total && lista.length > 1) {
      const peor = lista.filter(id => !prot.includes(id)).sort((a, b) => C[b].prio - C[a].prio || C[a].max - C[b].max)[0];
      lista = lista.filter(id => id !== peor); quitadas.push(peor);
    }
    lista.forEach(id => (n[id] = C[id].min));
    let libres = total - minimo();
    for (let extra = 0; libres > 0 && extra < 6; extra++) {
      for (const p of [1, 2, 3]) for (const id of lista.filter(x => C[x].prio === p)) {
        if (libres > 0 && n[id] < C[id].max + extra) { n[id]++; libres--; }
      }
    }
    return { n, quitadas };
  }

  // st = estado a calcular (por defecto el actual; también sirve para estimar una ruta armada sin elegirla)
  function ruta(st = s) {
    const ent = st.entrada || "paris", sal = st.salida || "ultima";
    const forzadas = [ent, sal !== "ultima" ? sal : null].filter(Boolean);
    const enPais = Object.keys(C).filter(id => forzadas.includes(id) || (st.paises.includes(C[id].pais) && !st.fuera.includes(id)));
    let n, quitadas = [];
    if (Object.keys(st.noches).length) {
      n = {};
      enPais.filter(id => !C[id].fija).forEach(id => (n[id] = st.noches[id] ?? Math.max(1, C[id].min)));
    } else ({ n, quitadas } = repartir(enPais, st.dias - 1, forzadas));
    const ids = enPais.filter(id => C[id].fija || id in n);
    let dia = 1;
    const paradas = ordenar(ids, st.orden, ent, sal).map(id => {
      const noches = n[id] || 0, p = { id, ciudad: C[id], noches, desde: dia, hasta: noches ? dia + noches - 1 : dia };
      dia += noches;
      return p;
    });
    const unTramo = (a, b) => {
      const d = Math.round(km(a.c, b.c) * 1.25);
      const auto = [a.id, b.id].includes("beaune") || a.id === "mussy";
      const tipo = auto ? "Auto" : d > 850 ? "Vuelo" : "Tren";
      return { de: a.id, a: b.id, km: d, tipo, horas: tipo === "Vuelo" ? 2 : Math.round((d / 140 + 0.3) * 2) / 2,
        eur: tipo === "Vuelo" ? 85 : tipo === "Auto" ? 0 : Math.round(12 + d * 0.12) };
    };
    const tramos = paradas.slice(1).map((p, i) => unTramo(paradas[i].ciudad, p.ciudad));
    const ult = paradas[paradas.length - 1].ciudad;
    const finFijo = sal !== "ultima" && sal !== ent && ids.includes(sal) ? sal : null;
    // Si se vuelve desde la ciudad de llegada, hay un último tramo para regresar a ella antes del vuelo
    const regreso = sal === ent && paradas.length > 1 ? unTramo(ult, C[ent]) : null;
    return { paradas, tramos, quitadas, dias: dia, noches: dia - 1, modo: 0, entrada: ent, finFijo, forzadas, regreso,
      salidaId: finFijo || (sal === ent ? ent : ult.id),
      ciudades: new Set(paradas.map(p => p.id)), paises: [...new Set(paradas.map(p => p.ciudad.pais))],
      trenesEur: tramos.reduce((t, x) => t + x.eur, 0) + (regreso ? regreso.eur : 0) };
  }

  // ---------- Interfaz ----------
  const abiertos = new Map();
  raiz.addEventListener("toggle", e => { if (e.target.dataset.det) abiertos.set(e.target.dataset.det, e.target.open); }, true);
  function render() {
    const r = ruta();
    const conAjuste = Object.keys(s.noches).length > 0;
    raiz.innerHTML = `
      <div class="arm-rutas" role="group" aria-label="Rutas armadas">${K.rutas.map(x =>
        `<button type="button" data-ruta="${x.id}" aria-pressed="${s.ruta === x.id}"><b>${esc(x.n)}</b><small>${esc(x.d)}</small><span class="arm-costo" data-costo="${x.id}"></span></button>`).join("")}</div>
      <div class="arm-ctrl">
        <div><p class="eyebrow">Países</p><div class="chips">${K.paises.map(p =>
          `<button type="button" class="chip" data-pais="${p.id}" aria-pressed="${s.paises.includes(p.id)}"${p.fijo ? " disabled" : ""}>${esc(p.nombre)}</button>`).join("")}</div></div>
        <label class="rango"><span>Días de viaje <output>${r.dias}</output></span>
          <input type="range" id="arm-dias" min="14" max="35" step="1" value="${conAjuste ? r.dias : s.dias}"></label>
      </div>
      <div class="arm-vuelos">
        <label>Llegamos a <select id="arm-ent"><option value="paris"${(s.entrada || "paris") === "paris" ? " selected" : ""}>París</option><option value="madrid"${s.entrada === "madrid" ? " selected" : ""}>Madrid</option><option value="barcelona"${s.entrada === "barcelona" ? " selected" : ""}>Barcelona</option></select></label>
        <label>Volvemos desde <select id="arm-sal"><option value="ultima"${(s.salida || "ultima") === "ultima" ? " selected" : ""}>La última ciudad</option><option value="madrid"${s.salida === "madrid" ? " selected" : ""}>Madrid</option><option value="barcelona"${s.salida === "barcelona" ? " selected" : ""}>Barcelona</option><option value="paris"${s.salida === "paris" ? " selected" : ""}>París</option></select></label>
        <small>Desde Santiago, Madrid y Barcelona suelen salir más baratos que París: conviene comparar pasajes en Google Flights con las fechas tentativas.</small>
      </div>
      ${r.quitadas.length ? `<p class="aviso">No alcanzan los días para ${r.quitadas.map(id => esc(C[id].nombre)).join(", ")}. Sube los días o elige menos países.</p>` : ""}
      <div class="arm-ciudades">${s.paises.map(p => {
        const ids = Object.keys(C).filter(id => C[id].pais === p && !C[id].fija);
        const dentro = ids.filter(id => r.ciudades.has(id)).length;
        const abierto = abiertos.has(p) ? abiertos.get(p) : dentro > 0;
        return `<details class="arm-pais" data-det="${p}"${abierto ? " open" : ""}><summary><span>${esc(nombrePais(p))}</span><small>${dentro} de ${ids.length}</small></summary>${ids.map(id => {
          const en = r.ciudades.has(id), par = r.paradas.find(x => x.id === id);
          return `<div class="ciu${en ? " en" : ""}"><button type="button" class="ciu-t" data-ciudad="${id}" aria-pressed="${en}"${r.forzadas.includes(id) ? " disabled" : ""}>${esc(C[id].nombre)}</button>
            ${en ? `<span class="noches"><button type="button" data-mas="${id}" data-d="-1" aria-label="Una noche menos en ${esc(C[id].nombre)}">−</button><b>${par.noches}</b><button type="button" data-mas="${id}" data-d="1" aria-label="Una noche más en ${esc(C[id].nombre)}">+</button></span>` : ""}</div>`;
        }).join("")}</details>`;
      }).join("")}</div>`;
    alCambiar(r);
  }

  raiz.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    const r = ruta();
    const congelar = () => { if (!Object.keys(s.noches).length) r.paradas.forEach(p => { if (!p.ciudad.fija) s.noches[p.id] = p.noches; }); };
    if (b.dataset.ruta) s = desdeRuta(K.rutas.find(x => x.id === b.dataset.ruta));
    else if (b.dataset.pais) {
      const p = b.dataset.pais;
      s.paises = s.paises.includes(p) ? s.paises.filter(x => x !== p) : [...s.paises, p];
      s.noches = {}; s.ruta = null; s.orden = null;
    } else if (b.dataset.ciudad) {
      const id = b.dataset.ciudad;
      if (s.fuera.includes(id)) s.fuera = s.fuera.filter(x => x !== id); else { s.fuera.push(id); delete s.noches[id]; }
      s.ruta = null;
    } else if (b.dataset.mas) {
      congelar();
      const id = b.dataset.mas, v = (s.noches[id] || 0) + +b.dataset.d;
      if (v < 1) { s.fuera.push(id); delete s.noches[id]; } else s.noches[id] = Math.min(v, 10);
      s.ruta = null;
    } else return;
    guardar(); render();
  });
  // Mientras se arrastra solo cambia el número; al soltar se rearma la ruta
  raiz.addEventListener("input", e => {
    if (e.target.id === "arm-dias") e.target.closest("label").querySelector("output").textContent = e.target.value;
  });
  raiz.addEventListener("change", e => {
    if (e.target.id === "arm-ent" || e.target.id === "arm-sal") {
      if (e.target.id === "arm-ent") s.entrada = e.target.value; else s.salida = e.target.value;
      s.noches = {}; s.ruta = null; s.orden = null; guardar(); render(); return;
    }
    if (e.target.id !== "arm-dias") return;
    s.dias = +e.target.value; s.noches = {}; s.ruta = null; s.orden = null;
    guardar(); render();
  });

  // Acciones desde el itinerario: mover una parada a otra posición y sumar/restar noches
  function congelar() { const r = ruta(); if (!Object.keys(s.noches).length) r.paradas.forEach(p => { if (!p.ciudad.fija) s.noches[p.id] = p.noches; }); }
  function mover(id, destino) {
    const r0 = ruta(), o = r0.paradas.map(p => p.id).filter(x => x !== r0.entrada && x !== r0.finFijo && x !== "beaune");
    const i = o.indexOf(id);
    if (i < 0) return;
    o.splice(i, 1); o.splice(Math.max(0, Math.min(destino, o.length)), 0, id);
    s.orden = o; s.ruta = null; guardar(); render();
  }
  function noches(id, d) {
    congelar();
    const v = (s.noches[id] || 0) + d;
    if (v < 1) { s.fuera.push(id); delete s.noches[id]; } else s.noches[id] = Math.min(v, 10);
    s.ruta = null; guardar(); render();
  }
  const todas = () => [...K.rutas, ...(K.finalistas || [])];
  function cargar(id) { s = desdeRuta(todas().find(x => x.id === id)); guardar(); render(); }
  const estado = () => ({ paises: s.paises, fuera: s.fuera, noches: s.noches, dias: ruta().dias, orden: s.orden || null, entrada: s.entrada || "paris", salida: s.salida || "ultima" });
  render();
  return { estado, mover, noches, ruta: () => ruta(), rutaArmada: id => ruta(desdeRuta(todas().find(x => x.id === id))), cargar, rutas: K.rutas, C };
};
