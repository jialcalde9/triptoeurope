// Arma todas las páginas a partir de datos.js. Cada HTML solo declara data-page y data-base.
(function () {
  const V = window.VIAJE;
  const body = document.body;
  const PAGE = body.dataset.page;
  const BASE = body.dataset.base || "";
  // Ruta absoluta para fondos: un url() dentro de una variable CSS se resolvería contra css/
  const IMGABS = new URL(BASE + "img/", location.href).href;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clp = n => "$" + n.toLocaleString("es-CL");
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const ciudad = id => V.ciudades[id];
  const paisDe = id => V.paises.find(p => p.id === ciudad(id).pais);
  const urlCiudad = id => `${BASE}${ciudad(id).pais}/#${id}`;
  const SLIDES = [["paris", "París al atardecer"], ["cinque", "Vernazza, Cinque Terre"], ["florencia", "Florencia"], ["roma", "Roma"], ["niza", "Niza, Costa Azul"]];

  // ---------- Modo 3 / 4 semanas (compartido entre páginas) ----------
  let modo = store.get("rm-modo") === "4" ? 1 : 0;
  const enRuta = id => ciudad(id).noches[modo] > 0 || ciudad(id).paso;
  function calendario() {
    let dia = 1; const out = [];
    V.orden.forEach(id => {
      const c = ciudad(id);
      if (!enRuta(id)) return;
      const n = c.noches[modo];
      out.push({ id, desde: dia, hasta: n ? dia + n - 1 : dia, n });
      dia += n;
    });
    return { paradas: out, total: dia };
  }

  // ---------- Tema ----------
  const tema = store.get("rm-tema") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = tema;

  // ---------- Encabezado y pie ----------
  function header() {
    // Países de la ruta base arriba; los que solo tienen ciudades opcionales van en "Otros países"
    const base = V.paises.filter(p => p.ciudades.some(id => !ciudad(id).extra));
    const otros = V.paises.filter(p => !base.includes(p));
    const enlace = ([id, t, u]) => `<a href="${u}"${id === PAGE ? ' aria-current="page"' : ""}>${t}</a>`;
    const links = [["inicio", "Inicio", `${BASE}`], ...base.map(p => [p.id, p.nombre, `${BASE}${p.id}/`])];
    const mas = otros.length ? `<details class="mas"><summary${otros.some(p => p.id === PAGE) ? ' aria-current="page"' : ""}>Otros países</summary>
      <div class="mas-menu">${otros.map(p => enlace([p.id, p.nombre, `${BASE}${p.id}/`])).join("")}</div></details>` : "";
    const h = document.createElement("header");
    h.className = "top";
    h.innerHTML = `<div class="wrap top-in">
      <a class="logo" href="${BASE}"><span class="logo-mark" aria-hidden="true"></span>${esc(V.titulo)}</a>
      <nav aria-label="Secciones">${links.map(enlace).join("")}${mas}${enlace(["rutas", "Rutas", `${BASE}rutas/`])}${enlace(["gastos", "Gastos", `${BASE}gastos/`])}${enlace(["presupuesto", "Presupuesto", `${BASE}#presupuesto`])}</nav>
      <button class="tema" id="btn-tema" type="button" aria-label="Cambiar tema claro u oscuro">◐</button>
    </div>`;
    body.prepend(h);
    // Cierra "Otros países" al hacer clic fuera o con Escape
    const det = h.querySelector(".mas");
    if (det) {
      document.addEventListener("click", e => { if (det.open && !det.contains(e.target)) det.open = false; });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && det.open) { det.open = false; det.querySelector("summary").focus(); } });
    }
    $("#btn-tema").addEventListener("click", () => {
      const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = t; store.set("rm-tema", t); mapas.forEach(m => m.tiles());
    });
  }
  function footer() {
    const f = document.createElement("footer");
    f.className = "pie";
    f.innerHTML = `<div class="wrap pie-in">
      <p class="merci">Merci, ${esc(V.financian.replace(" & ", " y "))}.</p>
      <p>Versión en construcción · se va afinando entre hermanos.</p>
      <details><summary>Créditos de fotos y mapas</summary><ul>
        ${V.creditos.map(([l, a, lic, u]) => `<li>${esc(l)}: <a href="${u}" target="_blank" rel="noopener">${esc(a)}</a>, ${esc(lic)} (Wikimedia Commons)</li>`).join("")}
        <li>Mapas: © OpenStreetMap, con Leaflet.</li>
      </ul></details>
      <p class="firma">Hecho por Juan Ignacio Alcalde Gueneau de Mussy</p>
    </div>`;
    body.append(f);
  }

  // ---------- Mapas ----------
  const mapas = [];
  // Teselas de OpenStreetMap; en modo oscuro se invierten con CSS (.leaflet-tile-pane).
  function crearMapa(el, opts = {}) {
    const m = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true, ...opts });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m);
    mapas.push({ m, tiles() {} });
    return m;
  }
  const pin = (html, cls) => L.divIcon({ className: "", html: `<span class="pin ${cls || ""}">${html}</span>`, iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
  // Inicia los mapas solo cuando aparecen en pantalla
  function alVer(el, fn) {
    if (!("IntersectionObserver" in window)) return fn();
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: "200px" });
    io.observe(el);
  }

  let mapaRuta = null, capaRuta = null, rutaActual = null;
  const diasTxt = p => p.desde === p.hasta ? `Día ${p.desde}` : `Días ${p.desde}–${p.hasta}`;
  const nochesTxt = n => n ? `${n} noche${n > 1 ? "s" : ""}` : "de paso";
  function dibujarRuta() {
    const r = rutaActual;
    if (!mapaRuta || !r) return;
    if (capaRuta) mapaRuta.removeLayer(capaRuta);
    capaRuta = L.layerGroup().addTo(mapaRuta);
    r.tramos.forEach((t, i) => L.polyline([r.paradas[i].ciudad.c, r.paradas[i + 1].ciudad.c],
      { className: "ruta" + (t.tipo === "Vuelo" ? " vuelo" : "") }).addTo(capaRuta));
    r.paradas.forEach((p, i) => {
      const c = p.ciudad;
      L.marker(c.c, { icon: pin(i + 1, c.id === "mussy" ? "raiz" : "") }).addTo(capaRuta)
        .bindPopup(`<b>${esc(c.nombre)}</b><br>${diasTxt(p)} · ${nochesTxt(p.noches)}<br><a href="#parada-${p.id}">Ver detalle →</a>`);
    });
    mapaRuta.fitBounds(L.latLngBounds(r.paradas.map(p => p.ciudad.c)).pad(0.08));
  }

  // ---------- Bloques reutilizables ----------
  const selectorModo = () => `<div class="modo" role="group" aria-label="Duración del viaje">
      <button type="button" data-modo="0" aria-pressed="${!modo}">3 semanas</button>
      <button type="button" data-modo="1" aria-pressed="${!!modo}">4 semanas</button></div>`;
  function enlazarModo(rerender) {
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-modo]");
      if (!b) return;
      modo = +b.dataset.modo; store.set("rm-modo", modo ? "4" : "3");
      document.querySelectorAll("[data-modo]").forEach(x => x.setAttribute("aria-pressed", +x.dataset.modo === modo));
      rerender();
    });
  }
  const noches = c => c.paso ? "De paso"
    : c.extra ? `Opcional, se suma en el armador · ${c.noches[0] === c.noches[1] ? c.noches[0] : c.noches.join("–")} noche${c.noches[1] > 1 ? "s" : ""}`
    : c.solo4 ? `${c.noches[1]} noches · solo 4 semanas`
    : c.noches[0] === c.noches[1] ? `${c.noches[0]} noche${c.noches[0] > 1 ? "s" : ""}` : `${c.noches[0]} noches · ${c.noches[1]} con 4 semanas`;

  // ---------- Inicio ----------
  function inicio() {
    const main = $("main");
    // ---------- Enlace para compartir la ruta (sin servidor: la ruta viaja en el enlace) ----------
    const CAT = window.CATALOGO;
    const codificar = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const decodificar = q => JSON.parse(decodeURIComponent(escape(atob(q.replace(/-/g, "+").replace(/_/g, "/")))));
    const VK = "rm-votos";
    let VT = { yo: "", personas: {} };
    try { const g = JSON.parse(localStorage.getItem(VK)); if (g && g.personas && typeof g.personas === "object") VT = { yo: String(g.yo || "").slice(0, 20), personas: g.personas }; } catch (e) {}
    const guardarVotos = () => { try { localStorage.setItem(VK, JSON.stringify(VT)); } catch (e) {} };
    const limpiar = n => String(n || "").replace(/[^\p{L}\p{N} ._-]/gu, "").trim().slice(0, 20);
    const kp = n => "p:" + n;
    let avisoImport = false;
    (function importar() {
      const q = new URLSearchParams(location.search).get("r");
      if (!q) return;
      try {
        const d = decodificar(q), s = d.s || d, ok = id => typeof id === "string" && Object.prototype.hasOwnProperty.call(CAT.ciudades, id);
        const paises = (Array.isArray(s.paises) ? s.paises : []).filter(p => CAT.paises.some(x => x.id === p));
        if (!paises.length) return;
        const noches = {};
        Object.entries(s.noches && typeof s.noches === "object" ? s.noches : {}).forEach(([k, v]) => { if (ok(k) && Number.isFinite(+v)) noches[k] = Math.max(1, Math.min(10, Math.round(+v))); });
        const orden = (Array.isArray(s.orden) ? s.orden : []).filter(ok);
        localStorage.setItem("rm-ruta", JSON.stringify({ ruta: null, paises, fuera: (Array.isArray(s.fuera) ? s.fuera : []).filter(ok), noches,
          dias: Math.max(14, Math.min(35, Math.round(+s.dias) || 21)), orden: orden.length ? orden : null,
          entrada: ["paris", "madrid", "barcelona"].includes(s.entrada) ? s.entrada : "paris", salida: ["ultima", "paris", "madrid", "barcelona"].includes(s.salida) ? s.salida : "ultima" }));
        avisoImport = true;
        const nom = limpiar(d.n);
        if (nom && nom !== VT.yo && d.v && typeof d.v === "object") {
          const v = {};
          Object.entries(d.v).forEach(([k, x]) => { if (ok(k) && (x === 1 || x === -1 || x === 2)) v[k] = x; });
          VT.personas[kp(nom)] = v; guardarVotos();
        }
        history.replaceState(null, "", location.pathname + location.hash);
      } catch (e) {}
    })();
    main.innerHTML = `
    <section class="portada" aria-label="Portada">
      <div class="slides" aria-hidden="true">${SLIDES.map(([f], i) => `<div class="slide${i ? "" : " on"}" style="background-image:url('${IMGABS}portada/${f}.jpg')"></div>`).join("")}</div>
      <div class="wrap portada-in">
        <p class="eyebrow">Viaje de hermanos · 2027</p>
        <h1 class="titulo-epico">Europa <em>entre hermanos</em></h1>
        <p class="lede">${esc(V.bajada)}</p>
        <div class="acciones"><a class="btn" href="#ruta">Ver la ruta</a><a class="btn ghost" href="#presupuesto">Armar el presupuesto</a></div>
        <div class="portada-pie">
        <div class="hechos">
          <div><b id="h-dias">21</b><span>días</span></div>
          <div><b id="h-paises">3</b><span>países</span></div>
          <div><b id="h-paradas">11</b><span>paradas</span></div>
          <div><b id="h-costo">3,3 M</b><span>CLP por persona</span></div>
        </div>
        <div class="sello"><span>Financiado por</span><b>${esc(V.financian)}</b><small>Unos cracks. Merci infiniment.</small></div>
        </div>
      </div>
      <div class="slide-info"><span id="slide-lugar">${SLIDES[0][1]}</span>
        <div class="puntos">${SLIDES.map(([, n], i) => `<button type="button" data-slide="${i}" aria-label="Ver ${n}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div></div>
    </section>
    <nav class="indice" aria-label="Secciones de esta página"><div class="wrap"><a href="#ruta">Ruta</a><a href="#clima">Clima</a><a href="#paises">Países</a><a href="#presupuesto">Presupuesto</a><a href="#antes">Antes de viajar</a></div></nav>

    <section class="wrap bloque" id="ruta">
      <div class="cabeza"><p class="eyebrow">Arma la ruta</p><h2>¿Por dónde vamos?</h2>
        <p>Elige una ruta armada, o los países y días que quieras. El sitio ordena las ciudades desde la ciudad de llegada (París, Madrid o Barcelona), reparte las noches y recalcula el presupuesto. Puedes sacar ciudades o sumarles noches con − y +, y reordenar las paradas arrastrándolas en el itinerario.</p></div>
      <div class="armador" id="armador"></div>
      <p class="arm-total" id="arm-total" aria-live="polite"></p>
      ${avisoImport ? '<p class="aviso-ok">Se cargó una ruta compartida contigo. Puedes cambiarla como quieras.</p>' : ""}
      <div class="acciones-ruta">
        <button type="button" class="btn ghost" id="btn-compartir">🔗 Copiar enlace de esta ruta</button>
        <button type="button" class="btn ghost" id="btn-wsp">💬 Copiar resumen para WhatsApp</button>
        <button type="button" class="btn ghost" id="btn-ics">📅 Descargar calendario (.ics)</button>
        <button type="button" class="btn ghost" id="btn-imprimir">🖨 Imprimir / guardar PDF</button>
        <span id="cmp-msg" aria-live="polite"></span>
      </div>
      <details class="comparar" id="comparar"><summary>Comparar dos rutas</summary>
        <div class="cmp-sel"><label>Ruta A <select id="cmp-a"></select></label><label>Ruta B <select id="cmp-b"></select></label></div>
        <div class="cmp-tabla" id="cmp-tabla"></div>
      </details>
      <div class="linea-wrap"><div class="linea" id="linea" aria-label="Línea de tiempo de la ruta"></div></div>
      <div class="ruta-grid">
        <div class="mapa grande" id="mapa-ruta" aria-label="Mapa de la ruta completa"></div>
        <ol class="itinerario" id="itinerario"></ol>
      </div>
      <details class="votar" id="votar"${avisoImport && Object.keys(VT.personas).length ? " open" : ""}><summary>Votar entre hermanos</summary><div class="votos-panel" id="votos"></div></details>
      <div class="paradas" id="paradas"></div>
      <div class="barra-fija" id="barra" aria-live="polite"></div>
    </section>

    <section class="wrap bloque" id="clima">
      <div class="cabeza"><p class="eyebrow">Clima</p><h2>¿Cuándo conviene viajar?</h2>
        <p>Promedios de 2015 a 2024 de las ciudades de tu ruta, pesados por las noches en cada una. Toca un mes para ver el detalle por ciudad.</p></div>
      <div class="meses" id="meses" role="group" aria-label="Meses del año"></div>
      <div class="clima-det" id="clima-det" aria-live="polite"></div>
      <p class="nota-chica">Julio y agosto son temporada alta en Europa (más caro y con más gente); en mayo, junio, septiembre y octubre suele haber mejores precios. Es una regla general: confirmar con precios reales de pasajes y alojamientos.</p>
    </section>

    <section class="wrap bloque" id="paises">
      <div class="cabeza"><p class="eyebrow">Fichas completas</p><h2>Cada país en detalle</h2>
        <p>Mapas con lugares, fotos, qué comer y datos útiles de cada ciudad.</p></div>
      <div class="paises">${V.paises.map(p => `
        <a class="pais" href="${BASE}${p.id}/">
          <img src="${BASE}img/${p.foto}" alt="" loading="lazy">
          <div><p class="eyebrow">${esc(p.lema)}</p><h3>${esc(p.nombre)}</h3>
          <p>${p.ciudades.map(id => esc(ciudad(id).nombre)).join(" · ")}</p></div></a>`).join("")}
      </div>
    </section>

    <section class="wrap bloque" id="presupuesto">
      <div class="cabeza"><p class="eyebrow">Presupuesto por persona</p><h2>Arma tu presupuesto</h2>
        <p>Elige un perfil o ajusta cada cosa: dónde dormir, cuánto gastar en comida, si arrendamos auto y qué entradas compramos. Usa la ruta que armaste arriba y se guarda en tu navegador.</p></div>
      <div class="sim" id="simulador"></div>
    </section>

    <section class="wrap bloque" id="antes">
      <div class="cabeza"><p class="eyebrow">Antes de viajar</p><h2>Cuenta regresiva y reservas</h2>
        <p>Pon la fecha de salida y el sitio calcula cuánto falta y hasta cuándo conviene hacer cada cosa. Lo que marques queda guardado en tu navegador.</p></div>
      <div class="antes-fecha"><label>Fecha de salida <input type="date" id="a-fecha"></label><p id="a-cuenta" aria-live="polite"></p></div>
      <div class="antes-grid">
        <div><h3>Lista de tareas</h3><ul class="check" id="a-tareas"></ul></div>
        <div><h3>Reservas con anticipación</h3><p class="nota-chica">Solo lugares de tu ruta. Plazos aproximados: confirma siempre en el sitio oficial.</p><ul class="check" id="a-reservas"></ul></div>
      </div>
      <details class="plan equipaje" id="equipaje"><summary>Qué llevar en la maleta</summary><p class="nota-chica" id="eq-nota"></p><ul class="check" id="a-equipaje"></ul></details>
    </section>

    <section class="wrap bloque">
      <div class="cabeza"><p class="eyebrow">Para decidir</p><h2>Lo que falta definir</h2></div>
      <div class="pendientes">${V.pendientes.map(([t, d]) => `<article><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
    </section>`;

    if ($("#votar").open) $("#ruta").classList.add("votando");
    document.addEventListener("toggle", e => { if (e.target.id === "votar") $("#ruta").classList.toggle("votando", e.target.open); }, true);
    const ajustarTop = () => document.documentElement.style.setProperty("--top-h", (document.querySelector(".top")?.offsetHeight || 60) + "px");
    ajustarTop(); window.addEventListener("resize", ajustarTop);
    let sim = null;
    const nombrePais = id => (window.CATALOGO.paises.find(p => p.id === id) || {}).nombre || id;
    // Se llama cada vez que el armador cambia la ruta
    function render(r) {
      rutaActual = r;
      const ult = r.paradas[r.paradas.length - 1].ciudad;
      $("#h-dias").textContent = r.dias;
      $("#h-paises").textContent = r.paises.length;
      $("#h-paradas").textContent = r.paradas.length;
      const ICO = { Tren: "🚆", Vuelo: "✈️", Auto: "🚗" };
      $("#linea").innerHTML = r.paradas.map((p, i) => {
        const tr = r.tramos[i];
        return `<a class="lt-par${p.id === "mussy" ? " raiz" : ""}" href="#parada-${p.id === "beaune" ? "mussy" : p.id}" style="flex-grow:${Math.max(p.noches, 0.7)}" title="${esc(p.ciudad.nombre)} · ${nochesTxt(p.noches)}"><b>${esc(p.ciudad.nombre)}</b><small>${p.noches ? p.noches + "n" : "paso"}</small></a>` +
          (tr ? `<span class="lt-tr" title="${tr.tipo} · ~${tr.horas} h">${ICO[tr.tipo]}<small>${tr.horas}h</small></span>` : "");
      }).join("");
      $("#itinerario").innerHTML = `<li class="vuelo-li"><span class="dia">Día 0</span><div><b>Vuelo Santiago → ${esc(r.paradas[0].ciudad.nombre)}</b><small>Noche a bordo</small></div></li>` +
        r.paradas.map((p, i) => {
          const t = r.tramos[i] || (i === r.paradas.length - 1 ? r.regreso : null);
          const mov = p.id !== r.entrada && p.id !== r.finFijo && p.id !== "beaune";
          const ctl = mov ? `<span class="it-ctl"><button type="button" data-sube="${p.id}" aria-label="Subir ${esc(p.ciudad.nombre)}">▲</button><button type="button" data-baja="${p.id}" aria-label="Bajar ${esc(p.ciudad.nombre)}">▼</button>${p.ciudad.fija ? "" : `<button type="button" data-n="${p.id}" data-d="-1" aria-label="Una noche menos">−</button><button type="button" data-n="${p.id}" data-d="1" aria-label="Una noche más">+</button>`}</span>` : "";
          return `<li data-id="${p.id}"${mov ? ' draggable="true"' : ""} class="${p.id === "mussy" ? "raiz " : ""}${mov ? "mov" : ""}"><span class="dia">${mov ? '<i class="asa" aria-hidden="true">⠿</i>' : ""}${p.desde === p.hasta ? p.desde : `${p.desde}–${p.hasta}`}</span>
            <div><a href="#parada-${p.id}"><b>${i + 1}. ${esc(p.ciudad.nombre)}</b></a><small>${esc(nombrePais(p.ciudad.pais))} · ${nochesTxt(p.noches)}</small>
            ${t ? `<small class="tramo">→ ${t.tipo} a ${esc((t === r.regreso ? r.paradas[0] : r.paradas[i + 1]).ciudad.nombre)}${t === r.regreso ? " (para volver a Santiago)" : ""} · ~${t.horas} h</small>` : ""}${ctl}</div></li>`;
        }).join("") + `<li class="vuelo-li"><span class="dia">Día ${r.dias}</span><div><b>Vuelo ${esc(ciudad(r.salidaId).nombre)} → Santiago</b></div></li>`;
      $("#paradas").innerHTML = r.paradas.filter(p => p.id !== "beaune").map(p => {
        const c = p.ciudad, cred = c.credito && !c.credito.local ? `Foto: ${esc(c.credito.autor)}, ${esc(c.credito.lic)}` : "";
        return `<article class="parada${p.id === "mussy" ? " raiz" : ""}" id="parada-${p.id}">
          ${c.foto ? `<img src="${BASE}${c.foto}" alt="${esc(c.nombre)}" loading="lazy" title="${cred}">` : ""}
          <div><p class="eyebrow">${esc(nombrePais(c.pais))} · ${diasTxt(p)} · ${nochesTxt(p.noches)}</p><h3>${esc(c.nombre)}</h3>
          <p>${esc(c.resumen || "")}</p><ul>${c.imperdibles.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          ${planHtml(p)}
          <div class="voto" data-voto="${p.id}"></div>
          ${c.ficha ? `<a class="cta" href="${urlCiudad(p.id)}">Ver ficha completa →</a>` : ""}</div></article>`;
      }).join("");
      dibujarRuta();
      pintarVotos();
      pintarAntes();
      pintarClima();
      if (sim) sim.actualizar();
    }
    const millones = t => (t / 1e6).toFixed(1).replace(".", ",") + " M";
    // Estimado por persona de cada ruta armada y de la ruta actual, con los ajustes del simulador
    function costos() {
      if (!sim) return;
      armador.rutas.forEach(x => {
        const el = document.querySelector(`[data-costo="${x.id}"]`);
        if (el) el.textContent = `~${millones(sim.estimar(armador.rutaArmada(x.id)))} por persona`;
      });
      $("#barra").innerHTML = `<span><b>${rutaActual.dias}</b> días</span><span><b>${rutaActual.paradas.length}</b> paradas</span><span><b>~${millones(sim.estimar(armador.ruta()))}</b> CLP por persona</span><a href="#armador">Ajustar</a>`;
      comparar();
      $("#arm-total").innerHTML = `Esta ruta sale <b>~${millones(sim.estimar(armador.ruta()))} CLP por persona</b> · <a href="#presupuesto">ver el detalle</a>`;
    }
    // Comparar dos rutas lado a lado
    function opciones() {
      const o = `<option value="actual">Mi ruta actual</option>` + armador.rutas.map(x => `<option value="${x.id}">${esc(x.n)}</option>`).join("");
      ["a", "b"].forEach((l, i) => { const el = $("#cmp-" + l); if (!el.options.length) { el.innerHTML = o; el.value = i ? armador.rutas[0].id : "actual"; } });
    }
    function comparar() {
      if (!sim) return;
      opciones();
      const get = v => v === "actual" ? armador.ruta() : armador.rutaArmada(v);
      const A = get($("#cmp-a").value), B = get($("#cmp-b").value);
      const cA = sim.estimar(A), cB = sim.estimar(B);
      const nombres = r => r.paradas.filter(p => p.id !== "beaune").map(p => esc(p.ciudad.nombre)).join(", ");
      const paises = r => r.paises.map(id => esc(nombrePais(id))).join(", ");
      const fila = (t, a, b, mejor) => `<tr><th>${t}</th><td${mejor === "a" ? ' class="mejor"' : ""}>${a}</td><td${mejor === "b" ? ' class="mejor"' : ""}>${b}</td></tr>`;
      $("#cmp-tabla").innerHTML = `<table><tbody>
        ${fila("Costo por persona", "~" + millones(cA) + " CLP", "~" + millones(cB) + " CLP", cA < cB ? "a" : cB < cA ? "b" : "")}
        ${fila("Días", A.dias, B.dias)}
        ${fila("Países", paises(A), paises(B))}
        ${fila("Paradas", A.paradas.length, B.paradas.length)}
        ${fila("Trenes y vuelos", A.tramos.length + " tramos · ~" + A.trenesEur + " €", B.tramos.length + " tramos · ~" + B.trenesEur + " €", A.trenesEur < B.trenesEur ? "a" : B.trenesEur < A.trenesEur ? "b" : "")}
        ${fila("Ciudades", nombres(A), nombres(B))}</tbody></table>`;
    }
    document.addEventListener("change", e => { if (e.target.id === "cmp-a" || e.target.id === "cmp-b") comparar(); });
    document.addEventListener("click", async e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.id === "btn-imprimir") window.print();
      if (b.id === "btn-wsp") {
        const r = rutaActual, url = location.origin + location.pathname + "?r=" + codificar({ s: armador.estado(), n: VT.yo, v: (VT.yo && VT.personas[kp(VT.yo)]) || {} });
        const lineas = r.paradas.filter(p => p.id !== "beaune").map((p, i) => `${i + 1}. ${p.ciudad.nombre}${p.noches ? ` (${nochesTxt(p.noches)})` : " (de paso)"}`);
        const txt = ["*Rumbo a Mussy* · ruta de " + r.dias + " días", "Llegada: " + r.paradas[0].ciudad.nombre + " · Vuelta desde: " + ciudad(r.salidaId).nombre, "", ...lineas, "", "Sale ~" + millones(sim.estimar(armador.ruta())) + " CLP por persona (aprox.)", "Mírala y vota: " + url].join("\n");
        let ok = false;
        try { await navigator.clipboard.writeText(txt); ok = true; } catch (err) {}
        if (!ok) prompt("Copia este texto:", txt);
        $("#cmp-msg").textContent = ok ? "¡Resumen copiado! Pégalo en WhatsApp." : "";
      }
      if (b.id === "btn-compartir") {
        const url = location.origin + location.pathname + "?r=" + codificar({ s: armador.estado(), n: VT.yo, v: (VT.yo && VT.personas[kp(VT.yo)]) || {} });
        let ok = false;
        try { await navigator.clipboard.writeText(url); ok = true; } catch (err) {}
        if (!ok) prompt("Copia este enlace:", url);
        $("#cmp-msg").textContent = ok ? "¡Enlace copiado!" : "";
      }
    });
    // ---------- Antes de viajar: cuenta regresiva, tareas y reservas ----------
    const TAREAS = [
      ["Definir fechas y quiénes viajan", 10, "Sin esto no se puede reservar nada."],
      ["Revisar pasaportes (vigencia y estado)", 9, "Conviene que duren varios meses después del regreso."],
      ["Comprar pasajes Santiago ⇄ Europa", 7, "Ida y vuelta según la ciudad de llegada y salida que elijan (Madrid suele salir más barato que París)."],
      ["Reservar alojamientos", 5, "Con cancelación gratuita mientras se pueda."],
      ["Revisar si hace falta ETIAS u otro permiso de entrada", 3, "Confirmar en el sitio oficial de la Unión Europea."],
      ["Reservar trenes de larga distancia", 2, "Los pasajes baratos se agotan primero."],
      ["Contratar seguro de viaje", 2, "Con cobertura médica y de equipaje."],
      ["Licencia internacional (si arrendamos auto)", 2, "Para la parada en Mussy y Beaune."],
      ["Avisar al banco y revisar tarjetas", 1, "Y probar un retiro o pago antes de salir."],
      ["Comprar eSIM o chip, y copias de documentos", 0.5, "Copia digital de pasaportes y reservas."]
    ];
    const RESERVAS = [
      ["milan", "La Última Cena (Milán)", "Se agota con 2 a 3 meses de anticipación", 12],
      ["como", "La Última Cena (Milán)", "Se agota con 2 a 3 meses de anticipación", 12],
      ["granada", "Alhambra (Granada)", "Entradas se agotan con meses de anticipación", 12],
      ["paris", "Torre Eiffel (subida a la cima)", "Las entradas se abren con unos 2 meses de anticipación", 8],
      ["paris", "Museo del Louvre", "Horario reservado, mejor con semanas de anticipación", 4],
      ["roma", "Coliseo y Foro Romano", "Reservar con 1 a 2 meses", 6],
      ["roma", "Galería Borghese", "Reserva obligatoria; se agota rápido", 6],
      ["florencia", "Galería de los Uffizi y Galería de la Academia (David)", "Reservar con 3 a 4 semanas", 4],
      ["barcelona", "Sagrada Familia y Parque Güell", "Reservar con 3 a 4 semanas", 4],
      ["venecia", "Basílica de San Marcos / Palacio Ducal", "Reservar con 2 a 3 semanas", 3]
    ];
    const AK = "rm-antes";
    let AN = { fecha: "", hechos: {} };
    try { const g = JSON.parse(localStorage.getItem(AK)); if (g && typeof g === "object") AN = { fecha: typeof g.fecha === "string" ? g.fecha : "", hechos: g.hechos && typeof g.hechos === "object" ? g.hechos : {} }; } catch (e) {}
    const guardarAN = () => { try { localStorage.setItem(AK, JSON.stringify(AN)); } catch (e) {} };
    const fmtF = d => d.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
    function pintarAntes() {
      const f = AN.fecha ? new Date(AN.fecha + "T12:00:00") : null, ok = f && !isNaN(f);
      const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
      $("#a-fecha").value = AN.fecha || "";
      $("#a-cuenta").innerHTML = ok ? (f >= hoy ? `Faltan <b>${Math.round((f - hoy) / 864e5)}</b> días para salir.` : "¡Ya salimos! Buen viaje.") : "Elige una fecha para ver los plazos.";
      const limite = sem => { if (!ok) return ""; const d = new Date(f.getTime() - sem * 7 * 864e5); return `<small class="${d < hoy ? "vencido" : ""}">hasta ${fmtF(d)}</small>`; };
      const item = (k, txt, nota, sem) => `<li><label><input type="checkbox" data-chk="${k}"${AN.hechos[k] ? " checked" : ""}><span><b>${esc(txt)}</b> ${limite(sem)}<small>${esc(nota)}</small></span></label></li>`;
      $("#a-tareas").innerHTML = TAREAS.map(([n, m, nota], i) => item("t" + i, n, nota, m * 4.345)).join("");
      const en = rutaActual ? rutaActual.ciudades : new Set();
      const vistos = new Set();
      const res = RESERVAS.filter(([c, n]) => en.has(c) && !vistos.has(n) && vistos.add(n));
      $("#a-reservas").innerHTML = res.length ? res.map(([c, n, nota, sem]) => item("r" + n, n, nota, sem)).join("") : "<li class='nota-chica'>Ninguna de las ciudades de tu ruta actual requiere reserva anticipada.</li>";
    }
    document.addEventListener("change", e => {
      if (e.target.id === "a-fecha") { AN.fecha = e.target.value; guardarAN(); pintarAntes(); }
      else if (e.target.dataset && e.target.dataset.chk) { AN.hechos[e.target.dataset.chk] = e.target.checked; guardarAN(); }
    });
    const PTS = { "2": 3, "1": 1, "-1": -2 };
    let msgArmar = "";
    const vtAbiertos = new Map();
    document.addEventListener("toggle", e => { if (e.target.dataset && e.target.dataset.vtp) vtAbiertos.set(e.target.dataset.vtp, e.target.open); }, true);
    const puntosCiudades = () => {
      const p = {};
      Object.values(VT.personas).forEach(v => Object.entries(v || {}).forEach(([id, x]) => { p[id] = (p[id] || 0) + (PTS[x] || 0); }));
      return p;
    };
    function pintarVotos() {
      const mios = VT.personas[kp(VT.yo)] || {};
      const botones = id => `<button type="button" data-v="2" data-id="${id}" aria-pressed="${mios[id] === 2}" aria-label="Sí o sí" title="Sí o sí">⭐</button><button type="button" data-v="1" data-id="${id}" aria-pressed="${mios[id] === 1}" aria-label="Me gusta" title="Me gusta">👍</button><button type="button" data-v="-1" data-id="${id}" aria-pressed="${mios[id] === -1}" aria-label="Descartar" title="Descartar">👎</button>`;
      const quienes = id => Object.entries(VT.personas).filter(([, v]) => v && v[id]).map(([k, v]) => [k.slice(2), v[id]]);
      const resumen = id => {
        const q = quienes(id), de = n => q.filter(x => x[1] === n).map(x => x[0]), es = de(2), si = de(1), no = de(-1);
        return [es.length ? `⭐ ${es.length} (${esc(es.join(", "))})` : "", si.length ? `👍 ${si.length} (${esc(si.join(", "))})` : "", no.length ? `👎 ${no.length} (${esc(no.join(", "))})` : ""].filter(Boolean).join(" · ");
      };
      document.querySelectorAll("[data-voto]").forEach(el => {
        const id = el.dataset.voto, r = resumen(id);
        el.innerHTML = `<span>¿Vamos?</span>${botones(id)}${r ? `<small>${r}</small>` : ""}`;
      });
      // Ranking de todas las ciudades con votos, estén o no en la ruta
      const enRuta = rutaActual ? rutaActual.ciudades : new Set(), pts = puntosCiudades();
      const filas = Object.keys(pts).filter(id => ciudad(id) && quienes(id).length).map(id => {
        const q = quienes(id), c = n => q.filter(y => y[1] === n).length;
        return { id, n: ciudad(id).nombre, estrella: c(2), si: c(1), no: c(-1), pts: pts[id] };
      }).sort((a, b) => b.pts - a.pts || b.estrella - a.estrella);
      const sin = (rutaActual ? rutaActual.paradas.filter(x => !x.ciudad.fija) : []).filter(x => !quienes(x.id).length).map(x => x.ciudad.nombre);
      const estrellas = filas.filter(f => f.estrella).map(f => f.n), polemicas = filas.filter(f => f.no && (f.estrella || f.si)).map(f => f.n);
      const ranking = filas.length ? `<div class="ranking"><h3>Ciudades más votadas</h3><ol>${filas.slice(0, 10).map(f => `<li>${enRuta.has(f.id) ? `<a href="#parada-${f.id}">${esc(f.n)}</a>` : `<span>${esc(f.n)}</span>`}<span class="${f.pts < 0 ? "neg" : ""}">${f.pts > 0 ? "+" : ""}${f.pts}</span><small>⭐ ${f.estrella} · 👍 ${f.si} · 👎 ${f.no}</small></li>`).join("")}</ol>
        ${estrellas.length ? `<p>⭐ <b>Sí o sí:</b> ${estrellas.map(esc).join(", ")}</p>` : ""}
        ${polemicas.length ? `<p>⚖️ <b>Para conversar</b> (a unos les gustan y otros las descartan): ${polemicas.map(esc).join(", ")}</p>` : ""}
        ${sin.length ? `<p class="votos-nota">De tu ruta actual, sin votos todavía: ${sin.map(esc).join(", ")}</p>` : ""}
        <p class="votos-nota">Puntaje: ⭐ vale 3, 👍 vale 1 y 👎 resta 2.</p></div>` : "";
      // Todas las ciudades por país, para votar también las que no están en la ruta
      const lista = CAT.paises.map(pa => {
        const ids = Object.keys(CAT.ciudades).filter(id => ciudad(id) && !CAT.ciudades[id].fija && (CAT.ciudades[id].pais || ciudad(id).pais) === pa.id);
        if (!ids.length) return "";
        const abierto = vtAbiertos.has(pa.id) ? vtAbiertos.get(pa.id) : !!(rutaActual && rutaActual.paises.includes(pa.id));
        return `<details class="vt-pais" data-vtp="${pa.id}"${abierto ? " open" : ""}><summary>${esc(pa.nombre)}<small>${ids.filter(id => quienes(id).length).length} de ${ids.length} votadas</small></summary><ul>${ids.map(id => {
          const r = resumen(id);
          return `<li><span class="vt-n">${esc(ciudad(id).nombre)}${enRuta.has(id) ? " <i>en la ruta</i>" : ""}</span><span class="vt-b">${botones(id)}</span>${r ? `<small>${r}</small>` : ""}</li>`;
        }).join("")}</ul></details>`;
      }).join("");
      const otros = Object.keys(VT.personas).map(k => k.slice(2));
      $("#votos").innerHTML = `<div class="votos-fila"><label>Tu nombre <input id="v-nombre" maxlength="20" placeholder="Ej: Juan" value="${esc(VT.yo)}"></label><span id="v-msg" aria-live="polite"></span></div>
        <p class="votos-nota">Pon tu nombre y marca cada ciudad: ⭐ sí o sí, 👍 me gusta, 👎 descartar. Luego usa «Copiar enlace de esta ruta»: el enlace lleva tus votos, y al abrirlo tus hermanos los ven y suman los suyos.</p>
        <div class="vt-lista"><h3>Votar ciudades</h3>${lista}</div>
        <div class="vt-armar"><button type="button" class="btn" id="v-armar">🧭 Armar ruta con lo más votado</button>
          <p class="votos-nota">Arma una ruta con las ciudades de mayor puntaje que quepan en los días elegidos, con la llegada y salida que tengas puestas y sin demasiado traslado. Después puedes ajustarla.</p>
          <p class="vt-msg" id="v-armar-msg" aria-live="polite">${esc(msgArmar)}</p></div>
        ${ranking}
        ${otros.length ? `<p class="votos-quienes">Votos de: ${otros.map(n => `<span class="chip-v">${esc(n)}${n === VT.yo ? "" : ` <button type="button" data-quitar="${esc(n)}" aria-label="Quitar votos de ${esc(n)}">×</button>`}</span>`).join(" ")}</p>` : ""}`;
    }
    document.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.v) {
        if (!VT.yo) { const n = $("#v-nombre"); n.focus(); $("#v-msg").textContent = "Primero escribe tu nombre."; return; }
        const k = kp(VT.yo), v = VT.personas[k] = VT.personas[k] || {};
        if (v[b.dataset.id] === +b.dataset.v) delete v[b.dataset.id]; else v[b.dataset.id] = +b.dataset.v;
        guardarVotos(); pintarVotos();
      } else if (b.dataset.quitar) {
        delete VT.personas[kp(b.dataset.quitar)]; guardarVotos(); pintarVotos();
      } else if (b.id === "v-armar") {
        const res = armador.armarVotados(puntosCiudades()), nom = id => ciudad(id).nombre;
        msgArmar = !res.ok ? "Todavía no hay ciudades con puntaje positivo: vota con ⭐ o 👍."
          : "Listo, ruta armada con " + res.usadas.length + " ciudades: " + res.usadas.map(nom).join(", ") + "."
            + (res.sinCupo.length ? " No cupieron: " + res.sinCupo.slice(0, 6).map(nom).join(", ") + ". Prueba con más días o cambiando la llegada y la salida." : "");
        pintarVotos();
      }
    });
    document.addEventListener("change", e => {
      if (e.target.id !== "v-nombre") return;
      const n = limpiar(e.target.value), antes = VT.yo;
      if (antes && n && n !== antes && VT.personas[kp(antes)]) { VT.personas[kp(n)] = VT.personas[kp(antes)]; delete VT.personas[kp(antes)]; }
      VT.yo = n; guardarVotos(); pintarVotos();
    });
    // Calendario (.ics): vuelos, cada ciudad con sus noches y los plazos pendientes, a partir de la fecha de salida
    function descargarICS() {
      const msg = $("#cmp-msg");
      const [y, m, d] = String(AN.fecha || "").split("-").map(Number);
      if (!y) { msg.textContent = "Primero pon la fecha de salida en «Antes de viajar»."; return; }
      const base = Date.UTC(y, m - 1, d), CRLF = "\r\n";
      const fmt = ms => new Date(ms).toISOString().slice(0, 10).replace(/-/g, "");
      const dia = n => fmt(base + n * 864e5);
      const esc2 = s => String(s).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
      const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
      const ev = [];
      const add = (uid, ini, fin, titulo, desc) => ev.push(["BEGIN:VEVENT", "UID:" + uid + "@rumbo-a-mussy", "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + ini, "DTEND;VALUE=DATE:" + fin, "SUMMARY:" + esc2(titulo), desc ? "DESCRIPTION:" + esc2(desc) : "", "END:VEVENT"].filter(Boolean).join(CRLF));
      const r = rutaActual;
      add("ida", dia(0), dia(1), "Vuelo Santiago → " + r.paradas[0].ciudad.nombre, "Noche a bordo.");
      r.paradas.forEach((p, i) => {
        if (p.id === "beaune") return;
        const nombre = p.id === "mussy" ? "Mussy-la-Fosse y Beaune (de paso)" : p.ciudad.nombre + " · " + nochesTxt(p.noches);
        const tr = r.tramos[i];
        add("par" + i, dia(p.desde), dia(p.hasta + 1), nombre, tr ? tr.tipo + " siguiente, ~" + tr.horas + " h" : "");
      });
      add("vuelta", dia(r.dias), dia(r.dias + 1), "Vuelo " + ciudad(r.salidaId).nombre + " → Santiago", "");
      const hoy = Date.now(), plazo = (uid, sem, titulo, nota) => {
        const ms = base - sem * 7 * 864e5;
        if (ms >= hoy) add(uid, fmt(ms), fmt(ms + 864e5), "Plazo: " + titulo, nota);
      };
      TAREAS.forEach(([n, mes, nota], i) => { if (!AN.hechos["t" + i]) plazo("t" + i, mes * 4.345, n, nota); });
      const vistos = new Set();
      RESERVAS.filter(([c, n]) => r.ciudades.has(c) && !vistos.has(n) && vistos.add(n))
        .forEach(([c, n, nota, sem]) => { if (!AN.hechos["r" + n]) plazo("r" + c + n, sem, "reservar " + n, nota); });
      const txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rumbo a Mussy//ES", "CALSCALE:GREGORIAN", ...ev, "END:VCALENDAR"].join(CRLF) + CRLF;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar;charset=utf-8" }));
      a.download = "rumbo-a-mussy.ics";
      document.body.appendChild(a); a.click(); a.remove();
      msg.textContent = "Calendario descargado. Ábrelo para agregarlo a tu calendario.";
    }
    document.addEventListener("click", e => { if (e.target.closest("#btn-ics")) descargarICS(); });
    // ---------- Clima: promedios por mes de las ciudades de la ruta ----------
    const MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const MESL = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    let mesSel = -1;
    const banda = (tx, ll) => tx >= 30 ? ["Calor fuerte", "cal"] : tx >= 18 && ll <= 9 ? ["Ideal", "ideal"] : tx >= 14 ? ["Agradable", "agr"] : ["Fresco o frío", "fri"];
    function climaRuta(r) {
      const CL = window.CLIMA || {};
      const ps = r.paradas.filter(p => p.noches > 0 && CL[p.id]);
      const peso = ps.reduce((s, p) => s + p.noches, 0);
      if (!peso) return null;
      return MES.map((_, m) => {
        const x = k => ps.reduce((s, p) => s + CL[p.id][m][k] * p.noches, 0) / peso;
        return { tx: x(0), tn: x(1), ll: x(2) };
      });
    }
    function pintarClima() {
      const el = $("#meses");
      if (!el) return;
      const datos = rutaActual ? climaRuta(rutaActual) : null;
      if (!datos) { el.innerHTML = ""; $("#clima-det").innerHTML = ""; pintarEquipaje(null, -1); return; }
      const fm = AN.fecha ? new Date(AN.fecha + "T12:00:00").getMonth() : -1;
      const sel = mesSel >= 0 ? mesSel : fm;
      const ideales = datos.map((d, i) => [i, banda(d.tx, d.ll)[1]]).filter(x => x[1] === "ideal").map(x => MESL[x[0]]);
      el.innerHTML = datos.map((d, i) => { const [txt, cls] = banda(d.tx, d.ll);
        return `<button type="button" class="mes ${cls}" data-mes="${i}" aria-pressed="${sel === i}"><b>${MES[i]}</b><span>${Math.round(d.tx)}° / ${Math.round(d.tn)}°</span><small>${txt}</small></button>`; }).join("");
      let det = `<p class="clima-res">${ideales.length ? `Para tu ruta, los meses más cómodos (18 °C o más de máxima, con poca lluvia y sin calor fuerte) son: <b>${ideales.join(", ")}</b>.` : "Ningún mes cumple del todo con 18 °C o más, poca lluvia y sin calor fuerte para esta ruta; mira el detalle de cada mes."}</p>`;
      if (sel >= 0) {
        const CL = window.CLIMA, ps = rutaActual.paradas.filter(p => p.id !== "beaune");
        det += `<table class="clima-tabla"><caption>Detalle de ${MESL[sel]}</caption><thead><tr><th>Ciudad</th><th>Máx. / mín.</th><th>Días con lluvia</th></tr></thead><tbody>` +
          ps.filter(p => CL[p.id]).map(p => { const [tx, tn, ll] = CL[p.id][sel]; return `<tr><td>${esc(p.ciudad.nombre)}<small>${p.noches ? nochesTxt(p.noches) : "de paso"}</small></td><td class="${banda(tx, ll)[1]}">${Math.round(tx)}° / ${Math.round(tn)}°</td><td>${ll} de 30</td></tr>`; }).join("") + `</tbody></table>`;
      }
      $("#clima-det").innerHTML = det;
      pintarEquipaje(datos, sel);
    }
    document.addEventListener("click", e => { const b = e.target.closest("[data-mes]"); if (b) { mesSel = mesSel === +b.dataset.mes ? -1 : +b.dataset.mes; pintarClima(); } });
    document.addEventListener("change", e => { if (e.target.id === "a-fecha") { mesSel = -1; pintarClima(); } });
    // Plan sugerido por día: reparte lo que hacer de la ciudad según sus noches
    function planHtml(p) {
      const v = ciudad(p.id), hacer = (v && v.hacer) || [];
      if (!hacer.length || !p.noches) return "";
      const n = p.noches, por = Math.ceil(hacer.length / n);
      const filas = Array.from({ length: n }, (_, k) => {
        const it = hacer.slice(k * por, (k + 1) * por);
        return `<li><b>Día ${p.desde + k}</b><span>${it.length ? it.map(esc).join(" · ") : "Día libre: pasear sin apuro o repetir lo que más gustó."}</span></li>`;
      }).join("");
      const comer = (v.comer || []).slice(0, 2);
      return `<details class="plan"><summary>Plan sugerido por día</summary><ul class="plan-dias">${filas}</ul>${comer.length ? `<p class="nota-chica">Para comer: ${comer.map(esc).join(" · ")}</p>` : ""}</details>`;
    }
    // Maleta: lista base más lo que depende del mes elegido y de las ciudades de la ruta
    function pintarEquipaje(datos, sel) {
      const el = $("#a-equipaje");
      if (!el) return;
      const base = [["Pasaportes, tarjetas y copias digitales de todo", ""], ["Zapatillas cómodas y ya usadas", "Se camina mucho"],
        ["Mochila liviana o maleta de mano", "Hay mucha escalera y tren"], ["Adaptador universal y power bank", "Los enchufes de dos patas redondas (tipo C) sirven en casi toda Europa"],
        ["Botella reutilizable", ""], ["Ropa por capas", ""], ["Remedios personales con receta", ""]];
      const extra = [], ciu = rutaActual ? rutaActual.ciudades : new Set();
      if (datos && sel >= 0) {
        const { tx, tn, ll } = datos[sel], g = Math.round(tx) + "° de máxima promedio";
        if (tx < 12) extra.push(["Abrigo grueso, gorro, guantes y ropa térmica", g]);
        else if (tx < 18) extra.push(["Chaqueta abrigadora y polerón", g]);
        if (tn < 6 && tx >= 12) extra.push(["Algo cálido para las mañanas y las noches", Math.round(tn) + "° de mínima promedio"]);
        if (tx >= 24) extra.push(["Ropa liviana, sombrero y lentes de sol", g]);
        if (tx >= 28) extra.push(["Protector solar y un plan para evitar el calor del mediodía", g]);
        if (ll >= 9) extra.push(["Paraguas compacto o cortaviento impermeable", Math.round(ll) + " días de lluvia al mes"]);
      }
      if (["roma", "florencia", "venecia", "napoles", "pisa", "verona", "como"].some(c => ciu.has(c))) extra.push(["Algo que cubra hombros y rodillas para entrar a iglesias", "El Vaticano y varias catedrales lo exigen"]);
      if (ciu.has("cinque")) extra.push(["Zapatillas con buen agarre para los senderos", "Cinque Terre"]);
      $("#eq-nota").textContent = datos && sel >= 0 ? "Incluye lo que depende del clima de " + MESL[sel] + " en tu ruta." : "Elige un mes en «¿Cuándo conviene viajar?» o pon la fecha de salida para sumar lo que depende del clima.";
      el.innerHTML = [...extra, ...base].map(([n, nota]) => `<li><label><input type="checkbox" data-chk="${esc("e:" + n)}"${AN.hechos["e:" + n] ? " checked" : ""}><span><b>${esc(n)}</b>${nota ? `<small>${esc(nota)}</small>` : ""}</span></label></li>`).join("");
    }
    const it = $("#itinerario");
    const ids = () => [...it.querySelectorAll("li.mov")].map(l => l.dataset.id);
    it.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.n) return armador.noches(b.dataset.n, +b.dataset.d);
      const id = b.dataset.sube || b.dataset.baja;
      if (id) armador.mover(id, ids().indexOf(id) + (b.dataset.sube ? -1 : 1));
    });
    let arrastrando = null;
    it.addEventListener("dragstart", e => { const l = e.target.closest("li.mov"); if (!l) return; arrastrando = l.dataset.id; l.classList.add("arrastrando"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", arrastrando); });
    it.addEventListener("dragover", e => { if (!arrastrando) return; const l = e.target.closest("li.mov"); if (!l) return; e.preventDefault(); it.querySelectorAll(".sobre").forEach(x => x.classList.remove("sobre")); if (l.dataset.id !== arrastrando) l.classList.add("sobre"); });
    it.addEventListener("drop", e => { const l = e.target.closest("li.mov"); if (!arrastrando || !l) return; e.preventDefault(); const d = ids().indexOf(l.dataset.id), id = arrastrando; arrastrando = null; armador.mover(id, d); });
    it.addEventListener("dragend", () => { arrastrando = null; it.querySelectorAll(".arrastrando,.sobre").forEach(x => x.classList.remove("arrastrando", "sobre")); });
    const armador = window.crearArmador($("#armador"), r => { render(r); costos(); });
    sim = window.crearSimulador($("#simulador"), armador.ruta,
      t => { $("#h-costo").textContent = millones(t); costos(); });
    costos();
    // Portada: fotos que se van cruzando cada 6 s (quieta si el usuario prefiere menos movimiento)
    let actual = 0, timer = null;
    const slides = [...document.querySelectorAll(".slide")];
    function irA(i) {
      actual = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("on", j === actual));
      document.querySelectorAll("[data-slide]").forEach(b => b.toggleAttribute("aria-current", +b.dataset.slide === actual));
      $("#slide-lugar").textContent = SLIDES[actual][1];
    }
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const andar = () => { clearInterval(timer); if (!quieto) timer = setInterval(() => irA(actual + 1), 6000); };
    document.addEventListener("click", e => { const b = e.target.closest("[data-slide]"); if (b) { irA(+b.dataset.slide); andar(); } });
    andar();

    alVer($("#mapa-ruta"), () => { mapaRuta = crearMapa("mapa-ruta"); dibujarRuta(); });
  }

  // ---------- Ficha de ciudad ----------
  const TIPOS = { ver: "Para ver", comer: "Para comer", panorama: "Panorama" };
  const FOTOS = window.FOTOS || {};
  function fotoLugar(l, i) {
    const f = FOTOS[l.n];
    const cred = !f ? "" : f.local ? "Foto: Wikimedia Commons (ver créditos al pie)"
      : `Foto: <a href="${f.url}" target="_blank" rel="noopener">${esc(f.autor)}</a>, ${esc(f.lic)}`;
    return `${f ? `<img src="${BASE}img/${f.f}" alt="${esc(l.n)}">` : `<div class="sin-foto">Sin foto todavía</div>`}
      <figcaption><span class="pin ${l.t}">${i + 1}</span><span><b>${esc(l.n)}</b><small>${TIPOS[l.t]} · ${cred}</small></span></figcaption>`;
  }
  // Muestra la foto del lugar, lo marca en la lista y lo centra en el mapa
  function seleccionar(id, i, mover = true) {
    const c = ciudad(id);
    document.getElementById("foto-" + id).innerHTML = fotoLugar(c.lugares[i], i);
    document.querySelectorAll(`[data-mapa="${id}"]`).forEach(b => b.toggleAttribute("aria-current", +b.dataset.i === i));
    const mk = marcadores[id];
    if (mk && mover) { mk.m.setView(mk.ms[i].getLatLng(), Math.max(mk.m.getZoom(), 14)); mk.ms[i].openPopup(); }
  }
  function ficha(id) {
    const c = ciudad(id);
    return `<article class="ciudad${c.raiz ? " raiz" : ""}" id="${id}">
      <figure class="ciudad-foto"><img src="${BASE}img/${c.foto}" alt="${esc(c.nombre)}" loading="lazy"></figure>
      <div class="ciudad-txt">
        <p class="eyebrow">${esc(noches(c))}</p>
        <h2>${esc(c.nombre)}</h2>
        <p class="lede">${esc(c.intro)}</p>
      </div>
      <div class="ciudad-grid">
        <div><h3>Qué hacer</h3><ul>${c.hacer.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          <h3>Qué comer</h3><ul>${c.comer.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          <h3>Datos útiles</h3><ul>${c.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          <p class="sale">Siguiente tramo: ${esc(c.sale)}</p></div>
        <div class="lugares-col"><div class="mapa" id="mapa-${id}" aria-label="Mapa de ${esc(c.nombre)}"></div>
          <figure class="lugar-foto" id="foto-${id}" aria-live="polite">${fotoLugar(c.lugares[0], 0)}</figure>
          <ol class="lugares">${c.lugares.map((l, i) => `<li><button type="button" data-mapa="${id}" data-i="${i}"${i ? "" : ' aria-current="true"'}>
            <span class="mini">${FOTOS[l.n] ? `<img src="${BASE}img/${FOTOS[l.n].f}" alt="" loading="lazy">` : ""}<span class="pin ${l.t}">${i + 1}</span></span>
            <span>${esc(l.n)}<small>${TIPOS[l.t]}</small></span></button></li>`).join("")}</ol></div>
      </div>
    </article>`;
  }
  const marcadores = {};
  function mapaCiudad(id) {
    const c = ciudad(id), el = document.getElementById("mapa-" + id);
    if (!el) return;
    alVer(el, () => {
      const m = crearMapa(el);
      marcadores[id] = { m, ms: c.lugares.map((l, i) => L.marker(l.c, { icon: pin(i + 1, l.t) }).addTo(m)
        .on("click", () => seleccionar(id, i, false))
        .bindPopup(`<b>${esc(l.n)}</b><br>${TIPOS[l.t]}<br><a href="https://www.google.com/maps/search/?api=1&query=${l.c[0]},${l.c[1]}" target="_blank" rel="noopener">Cómo llegar →</a>`)) };
      if (c.lugares.length > 1) m.fitBounds(L.latLngBounds(c.lugares.map(l => l.c)).pad(0.25), { maxZoom: 15 });
      else m.setView(c.lugares[0].c, 15);
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-mapa]");
    if (b) seleccionar(b.dataset.mapa, +b.dataset.i);
  });

  // ---------- Página de país ----------
  const FRASES = {
    francia: ["Francés básico", [
      ["Buenos días / hola", "Bonjour", "bon-yur"], ["Gracias", "Merci", "mer-si"], ["Por favor", "S'il vous plaît", "sil vu ple"],
      ["Disculpe", "Excusez-moi", "eks-kiu-sé mua"], ["¿Habla español o inglés?", "Parlez-vous espagnol ou anglais ?", "par-lé vu es-pa-ñol u an-gle"],
      ["No entiendo", "Je ne comprends pas", "yu nu com-prán pa"], ["¿Dónde está…?", "Où est… ?", "u e"],
      ["La cuenta, por favor", "L'addition, s'il vous plaît", "la-di-sión sil vu ple"], ["Una mesa para cuatro", "Une table pour quatre", "iun tabl pur catr"],
      ["Tengo alergia a…", "J'ai une allergie à…", "ye iun a-ler-yi a"], ["Agua de la llave (gratis)", "Une carafe d'eau", "iun ca-raf do"],
      ["¿Cuánto cuesta?", "C'est combien ?", "se com-biên"]]],
    italia: ["Italiano básico", [
      ["Buenos días / hola", "Buongiorno", "buon-yorno"], ["Gracias", "Grazie", "gra-tsie"], ["Por favor", "Per favore", "per fa-vore"],
      ["Disculpe", "Scusi", "scu-si"], ["¿Habla español o inglés?", "Parla spagnolo o inglese?", "par-la spa-ñolo o in-gle-se"],
      ["No entiendo", "Non capisco", "non ca-pis-co"], ["¿Dónde está…?", "Dov'è… ?", "do-ve"],
      ["La cuenta, por favor", "Il conto, per favore", "il con-to per fa-vore"], ["Una mesa para cuatro", "Un tavolo per quattro", "un ta-volo per cuat-tro"],
      ["Tengo alergia a…", "Ho un'allergia a…", "o un a-ler-yi-a a"], ["Un boleto para…", "Un biglietto per…", "un bi-lietto per"],
      ["¿Cuánto cuesta?", "Quanto costa?", "cuan-to cos-ta"]]],
    espana: ["Español de España (no es igual al chileno)", [
      ["Vale", "Quiere decir «ok» o «de acuerdo»", ""], ["Coger", "Tomar: «coger el metro» es normal allá", ""],
      ["Zumo", "Jugo", ""], ["Patatas", "Papas (la tortilla española es de papas)", ""], ["Móvil", "Celular", ""],
      ["Ordenador", "Computador", ""], ["Piso", "Departamento", ""], ["Vosotros", "Ustedes (informal, entre amigos)", ""],
      ["Caña", "Cerveza chica de barril", ""], ["Tapas y raciones", "Porciones para compartir; la ración es más grande", ""],
      ["La cuenta", "Se pide con «la cuenta, por favor»; la propina no es obligatoria", ""],
      ["Pronunciación", "La «c» antes de e/i y la «z» suenan como «th» en inglés (Barcelona, Zaragoza)", ""]]]
  };
  // ---------- Rutas finalistas: comparar de 3 a 4 rutas de 3 semanas ----------
  function rutasPage() {
    document.title = `Rutas finalistas · ${V.titulo}`;
    const K = window.CATALOGO, CL = window.CLIMA || {};
    // Se usan el armador y el simulador sin mostrarlos, solo para calcular rutas y costos con los ajustes del presupuesto
    const armador = window.crearArmador(document.createElement("div"), () => {});
    const sim = window.crearSimulador(document.createElement("div"), armador.ruta, () => {});
    const millones = x => (x / 1e6).toFixed(1).replace(".", ",") + " M";
    const MESL = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const mesesBuenos = r => {
      const ps = r.paradas.filter(p => p.noches > 0 && CL[p.id]), w = ps.reduce((s, p) => s + p.noches, 0);
      if (!w) return [];
      return MESL.filter((m, i) => {
        const tx = ps.reduce((s, p) => s + CL[p.id][i][0] * p.noches, 0) / w, ll = ps.reduce((s, p) => s + CL[p.id][i][2] * p.noches, 0) / w;
        return tx >= 18 && tx < 30 && ll <= 9;
      });
    };
    const filas = K.finalistas.map(f => {
      const r = armador.rutaArmada(f.id), tramos = r.regreso ? [...r.tramos, r.regreso] : r.tramos;
      return { f, r, costo: sim.estimar(r), largo: Math.max(0, ...tramos.map(x => x.horas)), nTramos: tramos.length, meses: mesesBuenos(r),
        ent: r.paradas[0].ciudad.nombre, sal: ciudad(r.salidaId).nombre };
    });
    const minimo = Math.min(...filas.map(x => x.costo));
    const lista = a => a.map(esc).join(", ");
    const tarjeta = x => `<article class="rf" id="ruta-${x.f.id}">
      <header><span class="rf-letra">${esc(x.f.letra)}</span><div><h3>${esc(x.f.n)}</h3><p>${esc(x.f.d)}</p></div>
        <b class="rf-costo">~${millones(x.costo)}<small>CLP por persona</small></b></header>
      ${x.costo === minimo ? '<p class="rf-barata">La más barata de las cuatro</p>' : ""}
      <p class="rf-vuelos">✈ Llegada: <b>${esc(x.ent)}</b> · Salida: <b>${esc(x.sal)}</b></p>
      <ol class="rf-ruta">${x.r.paradas.filter(p => p.id !== "beaune").map(p => `<li><b>${esc(p.ciudad.nombre)}</b><small>${p.noches ? p.noches + " noche" + (p.noches > 1 ? "s" : "") : "de paso"}</small></li>`).join("")}</ol>
      <dl class="rf-datos"><div><dt>Trenes y vuelos internos</dt><dd>${x.nTramos} tramos · ~${x.r.trenesEur} €</dd></div>
        <div><dt>Tramo más largo</dt><dd>~${x.largo} h</dd></div>
        <div><dt>Meses más cómodos</dt><dd>${x.meses.length ? lista(x.meses) : "ninguno cumple del todo"}</dd></div></dl>
      <div class="rf-pc"><div><h4>A favor</h4><ul>${x.f.pros.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div><div><h4>En contra</h4><ul>${x.f.contras.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div></div>
      <button type="button" class="btn" data-cargar="${esc(x.f.id)}">Cargar en el armador</button></article>`;
    const fila = (t, fn, mejor) => `<tr><th>${t}</th>${filas.map(x => `<td${mejor && mejor(x) ? ' class="mejor"' : ""}>${fn(x)}</td>`).join("")}</tr>`;
    $("main").innerHTML = `<section class="wrap bloque rutas-pg">
      <div class="cabeza"><p class="eyebrow">Para decidir</p><h2>Rutas finalistas de 3 semanas</h2>
        <p>Cuatro formas de armar el viaje, entrando y saliendo por Madrid o Barcelona. Los costos usan los ajustes de tu presupuesto (alojamiento, comida, trenes); el pasaje lo pones tú en el simulador, porque Madrid y Barcelona pueden salir distinto. Para ver una en detalle, cárgala en el armador.</p></div>
      <div class="rf-grid">${filas.map(tarjeta).join("")}</div>
      <h3 class="rf-lado">Lado a lado</h3>
      <div class="cmp-tabla"><table class="rf-tabla"><thead><tr><th></th>${filas.map(x => `<th>${esc(x.f.letra)} · ${esc(x.f.n)}</th>`).join("")}</tr></thead><tbody>
        ${fila("Costo por persona", x => "~" + millones(x.costo) + " CLP", x => x.costo === minimo)}
        ${fila("Llegada y salida", x => esc(x.ent) + " → " + esc(x.sal))}
        ${fila("Ciudades", x => x.r.paradas.filter(p => p.id !== "beaune").length)}
        ${fila("Trenes y vuelos", x => x.nTramos + " tramos · ~" + x.r.trenesEur + " €")}
        ${fila("Tramo más largo", x => "~" + x.largo + " h")}
        ${fila("Meses más cómodos", x => x.meses.length ? lista(x.meses) : "—")}</tbody></table></div>
      <p class="nota-chica">Costos aproximados, calculados con el simulador de presupuesto del inicio. Los vuelos internos se estiman por distancia; confirmar precios reales de pasajes y trenes. «Meses más cómodos»: 18 °C o más de máxima, poca lluvia y sin calor fuerte, con datos de 2015 a 2024.</p>
    </section>`;
    $("main").addEventListener("click", e => {
      const b = e.target.closest("[data-cargar]");
      if (!b) return;
      armador.cargar(b.dataset.cargar);
      location.href = `${BASE}#ruta`;
    });
  }

  // ---------- Gastos compartidos (todo se guarda en este navegador; se sincroniza con un enlace) ----------
  function gastos() {
    document.title = `Gastos · ${V.titulo}`;
    const KG = "rm-gastos";
    const limpiar = n => String(n || "").replace(/[^\p{L}\p{N} ._-]/gu, "").trim().slice(0, 20);
    const b64 = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const deb64 = q => JSON.parse(decodeURIComponent(escape(atob(q.replace(/-/g, "+").replace(/_/g, "/")))));
    let G = { moneda: "EUR", personas: [], gastos: [] };
    try {
      const g = JSON.parse(localStorage.getItem(KG));
      if (g && Array.isArray(g.personas) && Array.isArray(g.gastos)) G = { moneda: g.moneda === "CLP" ? "CLP" : "EUR", personas: g.personas.map(limpiar).filter(Boolean), gastos: g.gastos };
    } catch (e) {}
    const guardar = () => { try { localStorage.setItem(KG, JSON.stringify(G)); } catch (e) {} };
    // Los montos se guardan en centavos (enteros) para no arrastrar errores de decimales
    const mon = m => G.moneda === "CLP" ? "$" + Math.round(m / 100).toLocaleString("es-CL") : (m / 100).toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    let aviso = "";
    (function importar() {
      const q = new URLSearchParams(location.search).get("g");
      if (!q) return;
      try {
        const d = deb64(q);
        history.replaceState(null, "", location.pathname);
        if ((d.c === "CLP" || d.c === "EUR") && d.c !== G.moneda && G.gastos.length) { aviso = "El enlace usa otra moneda que tus gastos: no se sumó nada."; return; }
        if (d.c === "CLP" || d.c === "EUR") G.moneda = d.c;
        (Array.isArray(d.p) ? d.p : []).map(limpiar).filter(Boolean).slice(0, 12).forEach(n => { if (!G.personas.includes(n)) G.personas.push(n); });
        const ids = new Set(G.gastos.map(x => x.id));
        let nuevos = 0;
        (Array.isArray(d.g) ? d.g : []).slice(0, 500).forEach(x => {
          const g = { id: String(x.i || "").slice(0, 30), d: String(x.d || "").slice(0, 60), m: Math.round(+x.m), p: limpiar(x.p),
            e: (Array.isArray(x.e) ? x.e : []).map(limpiar).filter(n => G.personas.includes(n)), f: String(x.f || "").slice(0, 10) };
          if (x.x && typeof x.x === "object") {
            const xx = {};
            g.e.forEach(n => { const v = Math.round(+x.x[n]); if (v >= 0 && v < 1e11) xx[n] = v; });
            if (Object.keys(xx).length === g.e.length && g.e.reduce((s, n) => s + xx[n], 0) === g.m) g.x = xx; else return;
          }
          if (!g.id || ids.has(g.id) || !(g.m > 0 && g.m < 1e11) || !G.personas.includes(g.p) || !g.e.length) return;
          ids.add(g.id); G.gastos.push(g); nuevos++;
        });
        guardar();
        aviso = nuevos ? `Se sumaron ${nuevos} gasto${nuevos > 1 ? "s" : ""} nuevo${nuevos > 1 ? "s" : ""} desde el enlace.` : "El enlace no traía gastos nuevos.";
      } catch (e) {}
    })();

    function calcular() {
      const pago = new Map(G.personas.map(n => [n, 0])), corr = new Map(G.personas.map(n => [n, 0]));
      G.gastos.forEach(g => {
        const n = g.e.length, base = Math.floor(g.m / n), resto = g.m - base * n;
        pago.set(g.p, (pago.get(g.p) || 0) + g.m);
        g.e.forEach((nom, i) => corr.set(nom, (corr.get(nom) || 0) + (g.x ? g.x[nom] : base + (i < resto ? 1 : 0))));
      });
      const neto = new Map(G.personas.map(n => [n, (pago.get(n) || 0) - (corr.get(n) || 0)]));
      const deb = [...neto].filter(x => x[1] < 0).map(x => [x[0], -x[1]]).sort((a, b) => b[1] - a[1]);
      const acr = [...neto].filter(x => x[1] > 0).map(x => [x[0], x[1]]).sort((a, b) => b[1] - a[1]);
      const tr = [];
      for (let i = 0, j = 0; i < deb.length && j < acr.length;) {
        const m = Math.min(deb[i][1], acr[j][1]);
        if (m > 0) tr.push([deb[i][0], acr[j][0], m]);
        deb[i][1] -= m; acr[j][1] -= m;
        if (deb[i][1] === 0) i++;
        if (acr[j][1] === 0) j++;
      }
      return { pago, corr, neto, tr };
    }

    function pintar() {
      const c = calcular(), pp = G.personas;
      const total = G.gastos.reduce((s, g) => s + g.m, 0);
      $("main").innerHTML = `<section class="wrap bloque gastos">
        <div class="cabeza"><p class="eyebrow">Durante el viaje</p><h2>Gastos compartidos</h2>
          <p>Anota quién pagó cada cosa y entre quiénes se reparte. El sitio calcula cuánto le debe cada uno a quién. Todo queda en este navegador; para juntar lo que anotó cada hermano, usa el enlace de sincronizar.</p></div>
        ${aviso ? `<p class="aviso-ok">${esc(aviso)}</p>` : ""}
        <details class="g-ayuda"${G.personas.length ? "" : " open"}><summary>¿Cómo funciona?</summary><ol>
          <li><b>Nombres.</b> Escribe quiénes viajan, separados por coma, y toca «Guardar nombres».</li>
          <li><b>Cada gasto.</b> Cuando alguien pague algo, anota qué fue, cuánto, quién pagó y entre quiénes se reparte.</li>
          <li><b>Si no se reparte parejo.</b> Por ejemplo, en un restaurante donde uno pidió más: elige «Cada uno pagó una parte distinta» y escribe cuánto le toca a cada persona. Los montos tienen que sumar la cuenta.</li>
          <li><b>Las cuentas.</b> Abajo ves el saldo de cada uno (verde: le deben; rojo: debe) y quién le paga a quién para quedar a mano.</li>
          <li><b>Juntar con tus hermanos.</b> Tus gastos quedan solo en este teléfono. Toca «Copiar enlace para sincronizar» y mándaselo: al abrirlo, el sitio suma lo que les falte, sin repetir lo que ya tenían.</li>
          <li><b>Consejo.</b> Lo más simple es que una sola persona anote todos los gastos y comparta el resumen por WhatsApp.</li></ol></details>
        <div class="g-fila"><label>Quiénes viajan <input id="g-pers" placeholder="Ej: Juan, Pedro, Ana" value="${esc(pp.join(", "))}"></label>
          <button type="button" class="btn ghost" id="g-guardar-pers">Guardar nombres</button>
          <label>Moneda <select id="g-moneda"><option value="EUR"${G.moneda === "EUR" ? " selected" : ""}>Euros (€)</option><option value="CLP"${G.moneda === "CLP" ? " selected" : ""}>Pesos chilenos</option></select></label></div>
        ${pp.length < 2 ? `<p class="nota-chica">Escribe al menos dos nombres separados por coma para empezar.</p>` : `
        <form class="g-form" id="g-form"><h3>Anotar un gasto</h3>
          <div class="g-campos"><label>Qué fue <input id="g-desc" maxlength="60" placeholder="Ej: Cena en Roma" required></label>
          <label>Monto <input id="g-monto" inputmode="decimal" placeholder="0" required></label>
          <label>Pagó <select id="g-pago">${pp.map(n => `<option>${esc(n)}</option>`).join("")}</select></label></div>
          <fieldset class="g-entre"><legend>Se reparte entre</legend>${pp.map(n => `<label class="g-chk"><input type="checkbox" name="g-ent" value="${esc(n)}" checked> ${esc(n)}</label>`).join("")}</fieldset>
          <label class="g-modo">Cómo se reparte <select id="g-modo"><option value="iguales">En partes iguales</option><option value="x">Cada uno pagó una parte distinta</option></select></label>
          <div class="g-x" id="g-x" hidden>${pp.map(n => `<label data-xn="${esc(n)}">${esc(n)} <input inputmode="decimal" data-x="${esc(n)}" placeholder="0"></label>`).join("")}<p class="nota-chica" id="g-falta"></p></div>
          <button class="btn" type="submit">Agregar gasto</button><span id="g-msg" role="status"></span></form>
        <div class="g-saldos"><h3>Cómo van las cuentas <small>Total gastado: ${mon(total)}</small></h3>
          <table><thead><tr><th>Quién</th><th>Pagó</th><th>Le tocaba</th><th>Saldo</th></tr></thead><tbody>${pp.map(n => { const s = c.neto.get(n) || 0;
            return `<tr><td>${esc(n)}</td><td>${mon(c.pago.get(n) || 0)}</td><td>${mon(c.corr.get(n) || 0)}</td><td class="${s > 0 ? "pos" : s < 0 ? "neg" : ""}">${s > 0 ? "+" : ""}${mon(s)}</td></tr>`; }).join("")}</tbody></table>
          <p class="nota-chica">Saldo positivo: le deben plata. Negativo: debe.</p>
          ${c.tr.length ? `<h4>Para dejar todo a mano</h4><ul class="g-pagos">${c.tr.map(([a, b, m]) => `<li><b>${esc(a)}</b> le paga <b>${mon(m)}</b> a <b>${esc(b)}</b></li>`).join("")}</ul>` : G.gastos.length ? `<p class="g-ok">Están a mano. 🎉</p>` : ""}
          <div class="g-acciones"><button type="button" class="btn ghost" id="g-wsp">💬 Copiar resumen para WhatsApp</button><button type="button" class="btn ghost" id="g-link">🔗 Copiar enlace para sincronizar</button><span id="g-msg2" role="status"></span></div></div>
        <div class="g-lista"><h3>Gastos anotados (${G.gastos.length})</h3>${G.gastos.length ? `<ul>${[...G.gastos].reverse().map(g => `<li><span><b>${esc(g.d)}</b><small>${esc(g.f)} · pagó ${esc(g.p)} · ${g.x ? "reparto distinto (" + g.e.map(n => esc(n) + " " + mon(g.x[n])).join(", ") + ")" : "entre " + (g.e.length === pp.length ? "todos" : esc(g.e.join(", ")))}</small></span><span class="g-m">${mon(g.m)}</span><button type="button" data-del="${esc(g.id)}" aria-label="Borrar ${esc(g.d)}">×</button></li>`).join("")}</ul>` : `<p class="nota-chica">Todavía no hay gastos.</p>`}</div>`}
      </section>`;
    }
    pintar();

    const main = $("main");
    const copiar = async (txt, msgId, ok) => {
      let hecho = false;
      try { await navigator.clipboard.writeText(txt); hecho = true; } catch (e) {}
      if (!hecho) prompt("Copia este texto:", txt);
      const m = $("#" + msgId); if (m) m.textContent = hecho ? ok : "";
    };
    function repartoUI() {
      const modo = $("#g-modo");
      if (!modo) return;
      const custom = modo.value === "x", x = $("#g-x");
      x.hidden = !custom;
      const marcados = new Set([...main.querySelectorAll('[name="g-ent"]:checked')].map(c => c.value));
      x.querySelectorAll("[data-xn]").forEach(l => { l.hidden = !marcados.has(l.dataset.xn); });
      if (!custom) return;
      const num = v => Math.round(parseFloat(String(v || "0").replace(",", ".")) * 100) || 0;
      const suma = [...x.querySelectorAll("[data-x]")].filter(i => marcados.has(i.dataset.x)).reduce((s, i) => s + num(i.value), 0), dif = num($("#g-monto").value) - suma;
      $("#g-falta").textContent = dif === 0 ? "Los montos cuadran con la cuenta." : dif > 0 ? "Falta repartir " + mon(dif) + "." : "Te pasaste por " + mon(-dif) + ".";
    }
    main.addEventListener("input", e => { if (e.target.id === "g-monto" || e.target.dataset.x !== undefined) repartoUI(); });
    main.addEventListener("change", e => { if (e.target.id === "g-modo" || e.target.name === "g-ent") repartoUI(); });
    main.addEventListener("submit", e => {
      if (e.target.id !== "g-form") return;
      e.preventDefault();
      const desc = limpiarTexto($("#g-desc").value), monto = Math.round(parseFloat($("#g-monto").value.replace(",", ".")) * 100);
      const ent = [...main.querySelectorAll('[name="g-ent"]:checked')].map(x => x.value);
      if (!desc || !(monto > 0) || !ent.length) { $("#g-msg").textContent = "Revisa: qué fue, un monto mayor a cero y al menos una persona."; return; }
      const nuevo = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), d: desc, m: monto, p: $("#g-pago").value, e: ent, f: new Date().toISOString().slice(0, 10) };
      if ($("#g-modo").value === "x") {
        const x = {};
        ent.forEach(n => { const i = [...main.querySelectorAll("[data-x]")].find(c => c.dataset.x === n); const v = Math.round(parseFloat(((i && i.value) || "0").replace(",", ".")) * 100) || 0; if (v > 0) x[n] = v; });
        const suma = Object.values(x).reduce((s, v) => s + v, 0);
        if (suma !== monto) { $("#g-msg").textContent = "Los montos de cada uno suman " + mon(suma) + " y la cuenta es de " + mon(monto) + "."; return; }
        nuevo.x = x; nuevo.e = Object.keys(x);
      }
      G.gastos.push(nuevo);
      guardar(); aviso = ""; pintar();
    });
    const limpiarTexto = s => String(s).replace(/[<>]/g, "").trim().slice(0, 60);
    main.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.id === "g-guardar-pers") {
        const nuevos = [...new Set($("#g-pers").value.split(",").map(limpiar).filter(Boolean))].slice(0, 12);
        const usados = new Set(G.gastos.flatMap(g => [g.p, ...g.e]));
        G.personas = [...nuevos, ...[...usados].filter(n => !nuevos.includes(n))];
        guardar(); aviso = ""; pintar();
      } else if (b.dataset.del) {
        if (confirm("¿Borrar este gasto?")) { G.gastos = G.gastos.filter(g => g.id !== b.dataset.del); guardar(); aviso = ""; pintar(); }
      } else if (b.id === "g-wsp") {
        const c = calcular(), l = ["*Gastos del viaje* · total " + mon(G.gastos.reduce((s, g) => s + g.m, 0)), ""];
        G.personas.forEach(n => { const s = c.neto.get(n) || 0; l.push(n + ": " + (s > 0 ? "+" : "") + mon(s)); });
        l.push("", c.tr.length ? "Para dejar todo a mano:" : "Estamos a mano.");
        c.tr.forEach(([a, bb, m]) => l.push(a + " le paga " + mon(m) + " a " + bb));
        copiar(l.join("\n"), "g-msg2", "¡Resumen copiado!");
      } else if (b.id === "g-link") {
        const data = { c: G.moneda, p: G.personas, g: G.gastos.map(g => ({ i: g.id, d: g.d, m: g.m, p: g.p, e: g.e, f: g.f, x: g.x })) };
        copiar(location.origin + location.pathname + "?g=" + b64(data), "g-msg2", "¡Enlace copiado! Al abrirlo, los demás suman tus gastos a los suyos.");
      }
    });
    main.addEventListener("change", e => {
      if (e.target.id === "g-moneda") {
        if (G.gastos.length && !confirm("Ya hay gastos anotados. Cambiar la moneda no los convierte: los montos quedarán igual. ¿Seguir?")) { e.target.value = G.moneda; return; }
        G.moneda = e.target.value; guardar(); aviso = ""; pintar();
      }
    });
  }

  function frasesHtml(id) {
    const f = FRASES[id];
    if (!f) return "";
    return `<section class="wrap bloque" id="frases"><div class="cabeza"><p class="eyebrow">Para el viaje</p><h2>Frases útiles</h2><p>${esc(f[0])}. Arriba va lo que quieres decir, en negrita cómo se dice y debajo cómo se lee.</p></div>
      <div class="frases">${f[1].map(([es, x, pron]) => `<div><small>${esc(es)}</small><b>${esc(x)}</b>${pron ? `<i>${esc(pron)}</i>` : ""}</div>`).join("")}</div></section>`;
  }

  // Transporte y cuidados por país (escrito de memoria: confirmar antes de viajar)
  const VIAJE = {
    francia: {
      transporte: [
        ["Trenes", "SNCF Connect (app y web) vende los trenes de toda Francia. Los TGV llevan asiento reservado y los pasajes se abren unos 3 meses antes: comprar temprano sale mucho más barato."],
        ["Low cost", "OUIGO es el TGV económico: más barato, pero cobra maletas extra y a veces sale de estaciones más lejos del centro."],
        ["Validar el boleto", "Los pasajes digitales (código QR) no se validan. Los de papel sin reserva, como muchos regionales TER, hay que validarlos («composter») en las máquinas del andén antes de subir."],
        ["Dentro de París", "Metro, bus y RER funcionan con la tarjeta Navigo Easy o la app de Île-de-France Mobilités; confirmar tarifas vigentes. Desde el aeropuerto CDG, el RER B."],
        ["Auto", "Para Mussy y Beaune: licencia de conducir internacional recomendada y peajes en las autopistas."]],
      cuidado: [
        ["París", "Carteristas en el metro, el Louvre, la Torre Eiffel y las escaleras de Montmartre. Ojo con quien pide firmar una petición o te ata una pulsera «de regalo»: es para cobrar o robar."],
        ["París", "Los restaurantes con carta de fotos junto a los monumentos suelen ser caros y malos: caminar dos calles."],
        ["Niza", "Cuidar bolsos y celulares en la Promenade y en la playa; no dejarlos sobre la mesa."]]
    },
    italia: {
      transporte: [
        ["Trenes", "Trenitalia (Frecciarossa y regionales) e Italo (alta velocidad, privado) compiten entre las ciudades grandes: comparar precio en ambos. Las Frecce llevan asiento reservado."],
        ["Validar el boleto", "Los regionales sin hora ni asiento hay que validarlos en las máquinas del andén antes de subir; sin eso hay multa. Los digitales con QR no."],
        ["Cinque Terre", "Para moverse entre los pueblos conviene la Cinque Terre Card con trenes; el servicio va muy lleno: salir temprano."],
        ["En las ciudades", "Florencia se recorre a pie y en Venecia el transporte es el vaporetto (bus acuático). Roma tiene un metro limitado: se camina o se usa bus y tranvía."],
        ["Auto", "Los centros históricos tienen ZTL (zonas de tráfico limitado): entrar en auto sin permiso da multas altas que llegan meses después. Mejor no usar auto en las ciudades."]],
      cuidado: [
        ["Roma", "Carteristas en la línea A del metro y en buses llenos. Falsos «gladiadores» cobran por las fotos. Tomar solo taxis oficiales (blancos, con taxímetro)."],
        ["Roma", "El «coperto» es un cobro por cubierto, normal en Italia; revisar si el servicio ya viene incluido antes de dejar propina."],
        ["Florencia", "Carteristas cerca del Duomo y el Ponte Vecchio."],
        ["Venecia", "Preguntar el precio antes en los bares y restaurantes de la plaza San Marcos: un café en mesa cuesta mucho más que en la barra."],
        ["Milán", "Quienes ofrecen pulseritas o maíz para las palomas frente al Duomo cobran después."],
        ["Nápoles", "Cuidar celulares y bolsos en las zonas llenas y en el tren a Pompeya; pactar la tarifa del taxi antes de subir."]]
    },
    espana: {
      transporte: [
        ["Trenes", "Renfe (AVE, Alvia, Avant) y los privados Ouigo e Iryo unen las ciudades grandes. Todos llevan asiento reservado; comprar con anticipación baja el precio."],
        ["En la estación", "Para los trenes de alta velocidad hay revisión de equipaje tipo aeropuerto: llegar unos 30 minutos antes."],
        ["En las ciudades", "Madrid y Barcelona tienen metro con tarjetas recargables (en Barcelona, la T-casual para varios viajes); confirmar precios vigentes. De los aeropuertos hay metro y bus al centro."],
        ["Sevilla", "El aeropuerto no tiene tren: hay bus directo al centro."]],
      cuidado: [
        ["Barcelona", "Es de las ciudades con más carteristas: Las Ramblas, el metro, la Sagrada Familia y la playa. Bolso adelante y nada en el bolsillo de atrás."],
        ["Madrid", "En la Puerta del Sol y la Plaza Mayor, quienes regalan «ramitas de romero» o leen la mano piden dinero después."],
        ["Sevilla y Granada", "La misma estafa del romero cerca de la catedral y la Alhambra: no aceptar regalos de desconocidos."]]
    }
  };
  function viajeHtml(id) {
    const v = VIAJE[id];
    if (!v) return "";
    const li = ([a, b]) => `<li><b>${esc(a)}</b> ${esc(b)}</li>`;
    return `<section class="wrap bloque" id="moverse"><div class="cabeza"><p class="eyebrow">Para el viaje</p><h2>Moverse y cuidarse</h2>
      <p>Escrito de memoria y con lo más conocido: confirmar horarios, precios y reglas en los sitios oficiales antes de viajar.</p></div>
      <div class="viaje-grid"><div><h3>Transporte</h3><ul>${v.transporte.map(li).join("")}</ul></div>
      <div><h3>Cuidado con…</h3><ul>${v.cuidado.map(li).join("")}</ul><p class="nota-chica">Emergencias en toda la Unión Europea: 112.</p></div></div></section>`;
  }

  function pais(id) {
    const p = V.paises.find(x => x.id === id);
    document.title = `${p.nombre} · ${V.titulo}`;
    $("main").innerHTML = `
    <section class="hero corto" style="--foto:url('${IMGABS}${p.foto}')">
      <div class="wrap hero-in"><p class="eyebrow">${esc(p.lema)}</p><h1>${esc(p.nombre)}</h1><p class="lede">${esc(p.intro)}</p>
      <nav class="saltos" aria-label="Ciudades">${p.ciudades.map(c => `<a href="#${c}">${esc(ciudad(c).nombre)}</a>`).join("")}${FRASES[id] ? '<a href="#frases">Frases útiles</a>' : ""}${VIAJE[id] ? '<a href="#moverse">Moverse y cuidarse</a>' : ""}</nav></div>
    </section>
    <section class="wrap bloque"><div class="mapa medio" id="mapa-pais" aria-label="Mapa de ${esc(p.nombre)}"></div></section>
    <div class="wrap">${p.ciudades.map(ficha).join("")}</div>
    ${frasesHtml(id)}
    ${viajeHtml(id)}`;
    alVer($("#mapa-pais"), () => {
      const m = crearMapa("mapa-pais");
      const pts = p.ciudades.map(id => ciudad(id).c);
      L.polyline(p.ciudades.filter(id => !ciudad(id).extra).map(id => ciudad(id).c), { className: "ruta" }).addTo(m);
      p.ciudades.forEach((cid, i) => {
        const c = ciudad(cid);
        L.marker(c.c, { icon: pin(i + 1, c.raiz ? "raiz" : c.solo4 || c.extra ? "alt" : "") }).addTo(m)
          .bindPopup(`<b>${esc(c.nombre)}</b><br>${esc(noches(c))}<br><a href="#${cid}">Ver detalle →</a>`);
      });
      if (pts.length > 1) m.fitBounds(L.latLngBounds(pts).pad(0.15));
      else m.setView(pts[0], 10);
    });
    p.ciudades.forEach(mapaCiudad);
  }

  // ---------- Clave ----------
  async function sha256(t) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  function abrir() { document.documentElement.classList.remove("bloqueado"); $("#clave")?.remove(); }
  function clave() {
    if (store.get("rm-clave") === V.claveHash || !(window.crypto && crypto.subtle)) return abrir();
    const d = document.createElement("div");
    d.id = "clave";
    d.innerHTML = `<form class="clave-box"><p class="eyebrow">Viaje de hermanos</p><h1>Rumbo a <em>Mussy</em></h1>
      <label for="clave-in">Clave</label><input id="clave-in" type="password" autocomplete="current-password" required>
      <button type="submit">Entrar</button><p class="clave-err" id="clave-err" hidden>Clave incorrecta. Pídesela a Juan.</p></form>`;
    document.documentElement.append(d);
    $("#clave-in").focus();
    d.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault();
      if (await sha256($("#clave-in").value.trim()) === V.claveHash) { store.set("rm-clave", V.claveHash); abrir(); }
      else $("#clave-err").hidden = false;
    });
  }

  header();
  if (PAGE === "inicio") inicio();
  else if (PAGE === "mussy") return location.replace(`${BASE}francia/#mussy`); // página antigua: ahora Mussy es una parada dentro de Francia
  else if (PAGE === "gastos") gastos();
  else if (PAGE === "rutas") rutasPage();
  else pais(PAGE);
  footer();
  if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 50);
  clave();
})();
