// Sala compartida (opcional): guarda votos y gastos en Firebase Realtime Database usando su API REST, sin librerías.
// Si js/nube-config.js no tiene "url", todo funciona como siempre (datos locales y enlaces para sincronizar).
// Cada sala se identifica por un código largo que nadie más conoce: se comparte por el enlace de invitación y no está en el código del sitio.
(function () {
  // Pide al navegador que no borre los datos de este sitio cuando falte espacio (no siempre lo concede)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}
  const base = String((window.NUBE_CONFIG || {}).url || "").replace(/\/+$/, "");
  const K = "rm-sala";
  const valida = s => typeof s === "string" && /^[A-Za-z0-9_-]{8,40}$/.test(s);
  let sala = "";
  try { const g = localStorage.getItem(K); if (valida(g)) sala = g; } catch (e) {}
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  async function pedir(metodo, ruta, cuerpo) {
    if (!base || !sala) throw new Error("sin sala");
    const r = await fetch(`${base}/salas/${sala}/${ruta}.json`, {
      method: metodo,
      headers: cuerpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return metodo === "GET" ? r.json() : null;
  }
  const decir = t => { const el = document.getElementById("nube-msg"); if (el) el.textContent = t; };

  window.Nube = {
    disponible: !!base,
    activa: () => !!(base && sala),
    codigo: () => sala,
    get: ruta => pedir("GET", ruta),
    put: (ruta, valor) => pedir("PUT", ruta, valor),
    del: ruta => pedir("DELETE", ruta),
    unirse(c) {
      if (!valida(c)) return false;
      sala = c;
      try { localStorage.setItem(K, c); } catch (e) {}
      return true;
    },
    crear() {
      const a = new Uint8Array(12), letras = "abcdefghjkmnpqrstuvwxyz23456789";
      crypto.getRandomValues(a);
      return this.unirse([...a].map(x => letras[x % letras.length]).join(""));
    },
    salir() { sala = ""; try { localStorage.removeItem(K); } catch (e) {} },
    enlace() { return new URL(document.body.dataset.base || "./", location.href).href + "?sala=" + sala; },
    // Cuadro para crear, unirse o salir de la sala
    html(msg) {
      if (!base) return "";
      if (!sala) return `<div class="nube"><p><b>Sala compartida</b>: así los votos y gastos de todos se ven solos, sin mandar enlaces. <b>Mientras no estés en una sala, lo que anotes solo queda en este teléfono.</b></p>
        <div class="nube-fila"><button type="button" class="btn ghost" id="n-crear">Crear sala nueva</button>
        <label>o entrar con un código <input id="n-cod" maxlength="40" placeholder="Código de la sala" autocomplete="off"></label>
        <button type="button" class="btn ghost" id="n-unir">Unirme</button></div><p class="nube-msg" id="nube-msg" role="status">${esc(msg || "")}</p></div>`;
      return `<div class="nube activa"><p>✅ <b>Sala compartida activa.</b> Tus hermanos ven tus datos y tú los suyos, sin mandar enlaces. Para que otro se una, mándale el enlace de invitación.</p>
        <div class="nube-fila"><button type="button" class="btn ghost" id="n-invitar">Copiar enlace de invitación</button>
        <button type="button" class="btn ghost" id="n-salir">Salir de la sala</button></div><p class="nube-msg" id="nube-msg" role="status">${esc(msg || "")}</p></div>`;
    },
    // Maneja los botones del cuadro; alCambiar se llama al crear, unirse o salir
    async click(e, alCambiar) {
      const b = e.target.closest("button");
      if (!b || !base) return;
      if (b.id === "n-crear") { this.crear(); await alCambiar("Sala creada. Mándales el enlace de invitación a tus hermanos."); }
      else if (b.id === "n-unir") {
        const c = ((document.getElementById("n-cod") || {}).value || "").trim();
        if (!this.unirse(c)) { decir("Ese código no es válido."); return; }
        await alCambiar("Te uniste a la sala.");
      } else if (b.id === "n-salir") {
        if (confirm("¿Salir de la sala? Tus datos quedan en este teléfono, pero dejas de ver los de tus hermanos.")) { this.salir(); await alCambiar("Saliste de la sala."); }
      } else if (b.id === "n-invitar") {
        let ok = false;
        try { await navigator.clipboard.writeText(this.enlace()); ok = true; } catch (err) {}
        if (!ok) prompt("Copia este enlace:", this.enlace());
        decir(ok ? "Enlace copiado: mándalo por WhatsApp. Quien lo abra queda dentro de la sala." : "");
      }
    }
  };
})();
