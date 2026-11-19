// Simulador de presupuesto por persona. Lee la configuración de VIAJE.presupuesto (datos.js).
// crearSimulador(raíz, getRuta, alCambiar) — getRuta() devuelve { modo, noches, dias, ciudades:Set }.
window.crearSimulador = function (raiz, getRuta, alCambiar) {
  const P = window.VIAJE.presupuesto;
  const CIUDADES = window.VIAJE.ciudades;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clp = n => "$" + Math.round(n).toLocaleString("es-CL");
  const eur = n => n.toLocaleString("es-CL", { maximumFractionDigits: 1 }) + " €";
  const porId = (lista, id) => lista.find(x => x.id === id) || lista[0];
  const KEY = "rm-presu";

  function desdePerfil(id, base = {}) {
    const p = P.perfiles[id];
    const ent = p.entradas === "todas" ? P.entradas : P.entradas.filter(e => e[p.entradas]);
    return { ...base, perfil: id, alojamiento: p.alojamiento, comida: p.comida, trenes: p.trenes,
      autos: [...p.autos], entradas: ent.map(e => e.id), imprevistos: p.imprevistos };
  }
  const inicial = () => desdePerfil(P.inicial.perfil, { viajeros: P.inicial.viajeros, pasaje: P.inicial.pasaje, fx: P.fx });
  let s;
  try { s = { ...inicial(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (e) { s = inicial(); }
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

  function calcular() {
    const r = getRuta();
    const en = e => r.ciudades.has(e.ciudad);
    const aloj = porId(P.alojamiento, s.alojamiento), com = porId(P.comida, s.comida), tren = porId(P.trenes, s.trenes);
    const trenesEur = r.trenesEur ?? P.trenesBase[r.modo];
    const autos = P.autos.filter(a => r.ciudades.has(a.ciudad))
      .reduce((t, a) => t + (s.autos.includes(a.id) ? a.eur / s.viajeros : a.sinAuto), 0);
    const ents = P.entradas.filter(e => en(e) && s.entradas.includes(e.id));
    const filas = [
      ["Pasaje Santiago ↔ Europa", s.pasaje, "Ida y vuelta, multidestino"],
      ["Alojamiento", r.noches * aloj.eur * s.fx, `${r.noches} noches × ${eur(aloj.eur)}`],
      ["Comida", r.dias * com.eur * s.fx, `${r.dias} días × ${eur(com.eur)}`],
      ["Trenes y vuelos internos", trenesEur * tren.f * s.fx, tren.n],
      ["Autos y traslados", autos * s.fx, s.autos.length ? `Auto dividido entre ${s.viajeros}` : "Sin auto"],
      ["Transporte en ciudades", r.dias * P.urbanoDia * s.fx, `${eur(P.urbanoDia)} por día`],
      ["Entradas", ents.reduce((t, e) => t + e.eur, 0) * s.fx, `${ents.length} entradas`],
      ["Seguro de viaje", r.dias * P.seguroDia * s.fx, `${r.dias} días`]
    ];
    const sub = filas.reduce((t, f) => t + f[1], 0);
    filas.push(["Imprevistos", sub * s.imprevistos / 100, `${s.imprevistos} % del total`]);
    return { filas, total: sub * (1 + s.imprevistos / 100) };
  }

  const radios = (name, lista, fmt) => lista.map(o => `<label class="opc"><input type="radio" name="${name}" value="${o.id}"${s[name] === o.id ? " checked" : ""}>
    <span>${esc(o.n)}<small>${fmt(o)}</small></span></label>`).join("");

  function controles() {
    const r = getRuta();
    const grupos = {};
    P.entradas.filter(e => r.ciudades.has(e.ciudad)).forEach(e => (grupos[e.ciudad] = grupos[e.ciudad] || []).push(e));
    raiz.querySelector(".sim-ctrl").innerHTML = `
      <div class="perfiles" role="group" aria-label="Perfil de gasto">${Object.entries(P.perfiles).map(([id, p]) =>
        `<button type="button" data-perfil="${id}" aria-pressed="${s.perfil === id}">${esc(p.n)}</button>`).join("")}
        <span class="perfil-libre"${s.perfil === "libre" ? "" : " hidden"}>Personalizado</span></div>
      <div class="dos">
        <label class="rango"><span>Viajeros <output id="o-viajeros">${s.viajeros}</output></span>
          <input type="range" id="s-viajeros" name="viajeros" min="2" max="6" step="1" value="${s.viajeros}"></label>
        <label class="rango"><span>Pasaje ida y vuelta <output id="o-pasaje">${clp(s.pasaje)}</output></span>
          <input type="range" id="s-pasaje" name="pasaje" min="500000" max="1500000" step="50000" value="${s.pasaje}"></label>
      </div>
      <fieldset><legend>Alojamiento</legend>${radios("alojamiento", P.alojamiento, o => `${eur(o.eur)} por persona por noche`)}</fieldset>
      <fieldset><legend>Comida</legend>${radios("comida", P.comida, o => `${eur(o.eur)} por persona por día`)}</fieldset>
      <fieldset><legend>Trenes y vuelos internos</legend>${radios("trenes", P.trenes, o => `~${eur(Math.round((r.trenesEur ?? P.trenesBase[r.modo]) * o.f))} por persona`)}</fieldset>
      <fieldset><legend>Autos</legend>${P.autos.filter(a => r.ciudades.has(a.ciudad)).map(a => `<label class="opc"><input type="checkbox" name="autos" value="${a.id}"${s.autos.includes(a.id) ? " checked" : ""}>
        <span>${esc(a.n)}<small>${eur(a.eur)} entre todos · sin auto: ${esc(a.sinAutoN)}, ${eur(a.sinAuto)} por persona</small></span></label>`).join("")}</fieldset>
      <fieldset><legend>Entradas</legend>
        <div class="ent-acciones"><button type="button" data-ent="rec">Recomendadas</button><button type="button" data-ent="todas">Todas</button><button type="button" data-ent="ninguna">Ninguna</button></div>
        <div class="entradas">${Object.entries(grupos).map(([c, es]) => `<div><p class="eyebrow">${esc(CIUDADES[c].nombre)}</p>
          ${es.map(e => `<label class="chk"><input type="checkbox" name="entradas" value="${e.id}"${s.entradas.includes(e.id) ? " checked" : ""}><span>${esc(e.n)}</span><b>${eur(e.eur)}</b></label>`).join("")}</div>`).join("")}</div>
      </fieldset>
      <div class="dos">
        <label class="rango"><span>Imprevistos <output id="o-imprevistos">${s.imprevistos} %</output></span>
          <input type="range" id="s-imprevistos" name="imprevistos" min="0" max="15" step="1" value="${s.imprevistos}"></label>
        <label class="rango"><span>Tipo de cambio (CLP por €)</span>
          <input type="number" id="s-fx" name="fx" min="800" max="1500" step="10" value="${s.fx}"></label>
      </div>`;
  }

  function resultado() {
    const { filas, total } = calcular();
    const tope = P.tope, dif = tope - total, max = Math.max(...filas.map(f => f[1]));
    raiz.querySelector(".sim-res").innerHTML = `
      <p class="eyebrow">Total por persona</p>
      <p class="sim-total">${clp(total)}</p>
      <div class="riel${dif < 0 ? " pasa" : ""}"><i style="width:${Math.min(100, total / tope * 100)}%"></i></div>
      <p class="sim-dif${dif < 0 ? " pasa" : ""}">${dif >= 0 ? `Quedan ${clp(dif)} de ${clp(tope)}` : `Se pasa ${clp(-dif)} sobre ${clp(tope)}`}</p>
      <ul class="desglose">${filas.map(([n, v, d]) => `<li><span>${esc(n)}<small>${esc(d)}</small></span><b>${clp(v)}</b><i style="width:${v / max * 100}%"></i></li>`).join("")}</ul>
      <p class="nota">Para los ${s.viajeros}: ${clp(total * s.viajeros)}. Precios aproximados, confirmar en los sitios oficiales antes de comprar.</p>
      <button type="button" class="reset" data-reset>Volver a los valores iniciales</button>`;
    alCambiar(total);
  }

  raiz.innerHTML = `<div class="sim-ctrl"></div><aside class="sim-res" aria-live="polite"></aside>`;
  raiz.addEventListener("input", e => {
    const t = e.target, n = t.name;
    if (!n) return;
    if (n === "autos" || n === "entradas") s[n] = [...raiz.querySelectorAll(`[name="${n}"]:checked`)].map(x => x.value);
    else if (t.type === "range" || t.type === "number") s[n] = +t.value || s[n];
    else s[n] = t.value;
    const o = raiz.querySelector("#o-" + n);
    if (o) o.textContent = n === "pasaje" ? clp(s.pasaje) : n === "imprevistos" ? s.imprevistos + " %" : s[n];
    if (n !== "viajeros" && n !== "pasaje" && n !== "fx") marcarLibre();
    guardar(); resultado();
  });
  function marcarLibre() {
    s.perfil = "libre";
    raiz.querySelectorAll("[data-perfil]").forEach(b => b.setAttribute("aria-pressed", "false"));
    raiz.querySelector(".perfil-libre").hidden = false;
  }
  raiz.addEventListener("click", e => {
    const p = e.target.closest("[data-perfil]"), en = e.target.closest("[data-ent]"), rs = e.target.closest("[data-reset]");
    if (p) s = desdePerfil(p.dataset.perfil, s);
    else if (en) {
      const k = en.dataset.ent;
      s.entradas = k === "ninguna" ? [] : (k === "todas" ? P.entradas : P.entradas.filter(x => x.rec)).map(x => x.id);
      s.perfil = "libre";
    } else if (rs) s = inicial();
    else return;
    guardar(); controles(); resultado();
  });

  controles(); resultado();
  return { actualizar() { controles(); resultado(); } };
};
