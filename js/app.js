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
      <nav aria-label="Secciones">${links.map(enlace).join("")}${mas}${enlace(["presupuesto", "Presupuesto", `${BASE}#presupuesto`])}</nav>
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

    <section class="wrap bloque" id="ruta">
      <div class="cabeza"><p class="eyebrow">Arma la ruta</p><h2>¿Por dónde vamos?</h2>
        <p>Elige una ruta armada, o los países y días que quieras. El sitio ordena las ciudades desde París, reparte las noches y recalcula el presupuesto. Puedes sacar ciudades o sumarles noches con − y +, y reordenar las paradas arrastrándolas en el itinerario.</p></div>
      <div class="armador" id="armador"></div>
      <p class="arm-total" id="arm-total" aria-live="polite"></p>
      <div class="ruta-grid">
        <div class="mapa grande" id="mapa-ruta" aria-label="Mapa de la ruta completa"></div>
        <ol class="itinerario" id="itinerario"></ol>
      </div>
      <div class="paradas" id="paradas"></div>
      <div class="barra-fija" id="barra" aria-live="polite"></div>
    </section>

    <section class="wrap bloque">
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

    <section class="wrap bloque">
      <div class="cabeza"><p class="eyebrow">Para decidir</p><h2>Lo que falta definir</h2></div>
      <div class="pendientes">${V.pendientes.map(([t, d]) => `<article><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
    </section>`;

    let sim = null;
    const nombrePais = id => (window.CATALOGO.paises.find(p => p.id === id) || {}).nombre || id;
    // Se llama cada vez que el armador cambia la ruta
    function render(r) {
      rutaActual = r;
      const ult = r.paradas[r.paradas.length - 1].ciudad;
      $("#h-dias").textContent = r.dias;
      $("#h-paises").textContent = r.paises.length;
      $("#h-paradas").textContent = r.paradas.length;
      $("#itinerario").innerHTML = `<li class="vuelo-li"><span class="dia">Día 0</span><div><b>Vuelo Santiago → París</b><small>Noche a bordo</small></div></li>` +
        r.paradas.map((p, i) => {
          const t = r.tramos[i];
          const mov = p.id !== "paris" && p.id !== "beaune";
          const ctl = mov ? `<span class="it-ctl"><button type="button" data-sube="${p.id}" aria-label="Subir ${esc(p.ciudad.nombre)}">▲</button><button type="button" data-baja="${p.id}" aria-label="Bajar ${esc(p.ciudad.nombre)}">▼</button>${p.ciudad.fija ? "" : `<button type="button" data-n="${p.id}" data-d="-1" aria-label="Una noche menos">−</button><button type="button" data-n="${p.id}" data-d="1" aria-label="Una noche más">+</button>`}</span>` : "";
          return `<li data-id="${p.id}"${mov ? ' draggable="true"' : ""} class="${p.id === "mussy" ? "raiz " : ""}${mov ? "mov" : ""}"><span class="dia">${mov ? '<i class="asa" aria-hidden="true">⠿</i>' : ""}${p.desde === p.hasta ? p.desde : `${p.desde}–${p.hasta}`}</span>
            <div><a href="#parada-${p.id}"><b>${i + 1}. ${esc(p.ciudad.nombre)}</b></a><small>${esc(nombrePais(p.ciudad.pais))} · ${nochesTxt(p.noches)}</small>
            ${t ? `<small class="tramo">→ ${t.tipo} a ${esc(r.paradas[i + 1].ciudad.nombre)} · ~${t.horas} h</small>` : ""}${ctl}</div></li>`;
        }).join("") + `<li class="vuelo-li"><span class="dia">Día ${r.dias}</span><div><b>Vuelo ${esc(ult.nombre)} → Santiago</b></div></li>`;
      $("#paradas").innerHTML = r.paradas.filter(p => p.id !== "beaune").map(p => {
        const c = p.ciudad, cred = c.credito && !c.credito.local ? `Foto: ${esc(c.credito.autor)}, ${esc(c.credito.lic)}` : "";
        return `<article class="parada${p.id === "mussy" ? " raiz" : ""}" id="parada-${p.id}">
          ${c.foto ? `<img src="${BASE}${c.foto}" alt="${esc(c.nombre)}" loading="lazy" title="${cred}">` : ""}
          <div><p class="eyebrow">${esc(nombrePais(c.pais))} · ${diasTxt(p)} · ${nochesTxt(p.noches)}</p><h3>${esc(c.nombre)}</h3>
          <p>${esc(c.resumen || "")}</p><ul>${c.imperdibles.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          ${c.ficha ? `<a class="cta" href="${urlCiudad(p.id)}">Ver ficha completa →</a>` : ""}</div></article>`;
      }).join("");
      dibujarRuta();
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
      $("#arm-total").innerHTML = `Esta ruta sale <b>~${millones(sim.estimar(armador.ruta()))} CLP por persona</b> · <a href="#presupuesto">ver el detalle</a>`;
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
  function pais(id) {
    const p = V.paises.find(x => x.id === id);
    document.title = `${p.nombre} · ${V.titulo}`;
    $("main").innerHTML = `
    <section class="hero corto" style="--foto:url('${IMGABS}${p.foto}')">
      <div class="wrap hero-in"><p class="eyebrow">${esc(p.lema)}</p><h1>${esc(p.nombre)}</h1><p class="lede">${esc(p.intro)}</p>
      <nav class="saltos" aria-label="Ciudades">${p.ciudades.map(c => `<a href="#${c}">${esc(ciudad(c).nombre)}</a>`).join("")}</nav></div>
    </section>
    <section class="wrap bloque"><div class="mapa medio" id="mapa-pais" aria-label="Mapa de ${esc(p.nombre)}"></div></section>
    <div class="wrap">${p.ciudades.map(ficha).join("")}</div>`;
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
  else pais(PAGE);
  footer();
  if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 50);
  clave();
})();
