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
  const urlCiudad = id => id === "mussy" ? `${BASE}mussy/` : `${BASE}${ciudad(id).pais}/#${id}`;

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
    const links = [["inicio", "Inicio", `${BASE}`], ["francia", "Francia", `${BASE}francia/`], ["mussy", "Mussy-la-Fosse", `${BASE}mussy/`],
      ["italia", "Italia", `${BASE}italia/`], ["espana", "España", `${BASE}espana/`], ["presupuesto", "Presupuesto", `${BASE}#presupuesto`]];
    const h = document.createElement("header");
    h.className = "top";
    h.innerHTML = `<div class="wrap top-in">
      <a class="logo" href="${BASE}"><span class="logo-mark" aria-hidden="true"></span>${esc(V.titulo)}</a>
      <nav aria-label="Secciones">${links.map(([id, t, u]) => `<a href="${u}"${id === PAGE ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
      <button class="tema" id="btn-tema" type="button" aria-label="Cambiar tema claro u oscuro">◐</button>
    </div>`;
    body.prepend(h);
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

  let mapaRuta = null, capaRuta = null;
  function dibujarRuta() {
    if (!mapaRuta) return;
    if (capaRuta) mapaRuta.removeLayer(capaRuta);
    capaRuta = L.layerGroup().addTo(mapaRuta);
    const { paradas } = calendario();
    const pts = paradas.map(p => ciudad(p.id).c);
    const iRoma = paradas.findIndex(p => p.id === "roma");
    L.polyline(pts.slice(0, iRoma + 1), { className: "ruta" }).addTo(capaRuta);
    L.polyline(pts.slice(iRoma, iRoma + 2), { className: "ruta vuelo" }).addTo(capaRuta);
    L.polyline(pts.slice(iRoma + 1), { className: "ruta" }).addTo(capaRuta);
    if (!modo) V.orden.filter(id => ciudad(id).solo4).forEach(id => {
      L.marker(ciudad(id).c, { icon: pin("+", "alt") }).addTo(capaRuta)
        .bindPopup(`<b>${esc(ciudad(id).nombre)}</b><br>Solo en la opción de 4 semanas`);
    });
    paradas.forEach((p, i) => {
      const c = ciudad(p.id);
      const dias = p.desde === p.hasta ? `Día ${p.desde}` : `Días ${p.desde}–${p.hasta}`;
      L.marker(c.c, { icon: pin(i + 1, c.raiz ? "raiz" : "") }).addTo(capaRuta)
        .bindPopup(`<b>${esc(c.nombre)}</b><br>${dias}${p.n ? ` · ${p.n} noche${p.n > 1 ? "s" : ""}` : " · de paso"}<br><a href="${urlCiudad(p.id)}">Ver detalle →</a>`);
    });
    mapaRuta.fitBounds(L.latLngBounds(pts).pad(0.08));
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
  const noches = c => c.paso ? "De paso" : c.solo4 ? `${c.noches[1]} noches · solo 4 semanas`
    : c.noches[0] === c.noches[1] ? `${c.noches[0]} noche${c.noches[0] > 1 ? "s" : ""}` : `${c.noches[0]} noches · ${c.noches[1]} con 4 semanas`;

  // ---------- Inicio ----------
  function inicio() {
    const main = $("main");
    main.innerHTML = `
    <section class="hero" style="--foto:url('${IMGABS}mussy.jpg')">
      <div class="wrap hero-in">
        <p class="eyebrow">Viaje de hermanos · Francia, Italia y España</p>
        <h1>Rumbo a <em>Mussy</em></h1>
        <p class="lede">${esc(V.bajada)}</p>
        <div class="hechos">
          <div><b id="h-dias">21</b><span>días</span></div>
          <div><b>4</b><span>países</span></div>
          <div><b id="h-paradas">11</b><span>paradas</span></div>
          <div><b id="h-costo">3,3 M</b><span>CLP por persona</span></div>
        </div>
        <div class="sello"><span>Financiado en parte por</span><b>${esc(V.financian)}</b><small>Unos cracks. Merci infiniment.</small></div>
      </div>
    </section>

    <section class="wrap bloque" id="ruta">
      <div class="cabeza"><p class="eyebrow">La ruta</p><h2>De París a Madrid</h2>
        <p>Toca un número para ver cuántos días estamos ahí y saltar al detalle.</p>${selectorModo()}</div>
      <div class="ruta-grid">
        <div class="mapa grande" id="mapa-ruta" aria-label="Mapa de la ruta completa"></div>
        <ol class="itinerario" id="itinerario"></ol>
      </div>
    </section>

    <section class="wrap bloque">
      <div class="cabeza"><p class="eyebrow">Los países</p><h2>Tres países y uno de regalo</h2></div>
      <div class="paises">${V.paises.map(p => `
        <a class="pais" href="${BASE}${p.id}/">
          <img src="${BASE}img/${p.foto}" alt="" loading="lazy">
          <div><p class="eyebrow">${esc(p.lema)}</p><h3>${esc(p.nombre)}</h3>
          <p>${p.ciudades.map(id => esc(ciudad(id).nombre)).join(" · ")}</p></div></a>`).join("")}
      </div>
    </section>

    <section class="wrap bloque">
      <a class="raiz-banner" href="${BASE}mussy/">
        <img src="${BASE}img/mussy-iglesia.jpg" alt="Iglesia Saint-Léger de Mussy-la-Fosse" loading="lazy">
        <div><p class="eyebrow">Parada obligatoria</p><h2>Mussy-la-Fosse</h2>
        <p>El pueblo de donde viene la familia. Un día completo para caminarlo, buscar el apellido y conocer el Auxois.</p>
        <span class="cta">Ver el plan del pueblo →</span></div>
      </a>
    </section>

    <section class="wrap bloque" id="presupuesto">
      <div class="cabeza"><p class="eyebrow">Presupuesto por persona</p><h2>Arma tu presupuesto</h2>
        <p>Elige un perfil o ajusta cada cosa: dónde dormir, cuánto gastar en comida, si arrendamos auto y qué entradas compramos. Se guarda en tu navegador.</p>${selectorModo()}</div>
      <div class="sim" id="simulador"></div>
    </section>

    <section class="wrap bloque">
      <div class="cabeza"><p class="eyebrow">Para decidir</p><h2>Lo que falta definir</h2></div>
      <div class="pendientes">${V.pendientes.map(([t, d]) => `<article><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
    </section>`;

    const ruta = () => {
      const { paradas, total } = calendario();
      return { modo, dias: total, noches: total - 1, ciudades: new Set(paradas.map(p => p.id)) };
    };
    const sim = window.crearSimulador($("#simulador"), ruta,
      t => { $("#h-costo").textContent = (t / 1e6).toFixed(1).replace(".", ",") + " M"; });

    function render() {
      const { paradas, total } = calendario();
      $("#h-dias").textContent = total;
      $("#h-paradas").textContent = paradas.length;
      sim.actualizar();
      $("#itinerario").innerHTML = `<li class="vuelo-li"><span class="dia">Día 0</span><div><b>Vuelo Santiago → París</b><small>Noche a bordo</small></div></li>` +
        paradas.map((p, i) => {
          const c = ciudad(p.id);
          return `<li${c.raiz ? ' class="raiz"' : ""}><span class="dia">${p.desde === p.hasta ? p.desde : `${p.desde}–${p.hasta}`}</span>
            <div><a href="${urlCiudad(p.id)}"><b>${i + 1}. ${esc(c.nombre)}</b></a><small>${esc(paisDe(p.id).nombre)} · ${p.n ? `${p.n} noche${p.n > 1 ? "s" : ""}` : "de paso"}</small></div></li>`;
        }).join("") + `<li class="vuelo-li"><span class="dia">Día ${total}</span><div><b>Vuelo Madrid → Santiago</b></div></li>`;
      dibujarRuta();
    }
    enlazarModo(render);
    alVer($("#mapa-ruta"), () => { mapaRuta = crearMapa("mapa-ruta"); dibujarRuta(); });
    render();
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
        ${c.raiz && PAGE !== "mussy" ? `<a class="cta" href="${BASE}mussy/">Ver la página del pueblo →</a>` : ""}
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
      L.polyline(pts, { className: "ruta" }).addTo(m);
      p.ciudades.forEach((cid, i) => {
        const c = ciudad(cid);
        L.marker(c.c, { icon: pin(i + 1, c.raiz ? "raiz" : c.solo4 ? "alt" : "") }).addTo(m)
          .bindPopup(`<b>${esc(c.nombre)}</b><br>${esc(noches(c))}<br><a href="#${cid}">Ver detalle →</a>`);
      });
      m.fitBounds(L.latLngBounds(pts).pad(0.15));
    });
    p.ciudades.forEach(mapaCiudad);
  }

  // ---------- Página de Mussy ----------
  function mussy() {
    document.title = `Mussy-la-Fosse · ${V.titulo}`;
    $("main").innerHTML = `
    <section class="hero" style="--foto:url('${IMGABS}mussy.jpg')">
      <div class="wrap hero-in"><p class="eyebrow">Borgoña · Côte-d'Or · el origen de la familia</p>
      <h1>Mussy-<em>la-Fosse</em></h1>
      <p class="lede">Gueneau de Mussy: el apellido lo dice todo. Aquí pasamos un día completo, sin apuro, para conocer el pueblo y el Auxois.</p></div>
    </section>
    <section class="wrap bloque preguntas">
      <div class="cabeza"><p class="eyebrow">Antes de ir</p><h2>Preguntas para el abuelo</h2></div>
      <ol><li>¿Qué recuerda del pueblo? ¿Hay una casa o calle de la familia?</li>
        <li>¿Quedan parientes o conocidos en Mussy o en los pueblos cercanos?</li>
        <li>¿Dónde buscar el apellido: iglesia, cementerio, archivos de la mairie?</li>
        <li>¿Hay fotos antiguas que podamos llevar para comparar?</li>
        <li>¿Qué lugar de la zona no nos podemos perder?</li></ol>
    </section>
    <div class="wrap">${ficha("mussy")}</div>`;
    mapaCiudad("mussy");
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
  else if (PAGE === "mussy") mussy();
  else pais(PAGE);
  footer();
  if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 50);
  clave();
})();
