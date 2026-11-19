# Rumbo a Mussy

Sitio del viaje de hermanos a Francia, Italia y España. Es estático (HTML, CSS y JS, sin compilar) y se publica con GitHub Pages.

## Estructura

| Archivo | Qué tiene |
|---|---|
| `js/datos.js` | **Todo el contenido**: países, ciudades, noches, lugares con coordenadas, presupuesto, pendientes, créditos |
| `js/app.js` | Arma las páginas a partir de `datos.js` (menú, mapas, itinerario, clave) |
| `css/estilo.css` | Diseño |
| `index.html`, `francia/`, `italia/`, `espana/`, `mussy/` | Páginas (solo cargan los archivos de arriba) |
| `img/` | Fotos de Wikimedia Commons (créditos en el pie de página) |

Para cambiar textos, noches o lugares, edita solo `js/datos.js`.

## Publicar en GitHub Pages

1. En el repositorio: **Add file → Upload files** y arrastra todo el contenido de esta carpeta (no la carpeta misma).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
3. En 1–2 minutos queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

## Clave de entrada

La clave actual es la que Juan compartió por WhatsApp. Es una protección simple: evita que entre cualquiera, pero no es seguridad real (el repositorio es público). No poner pasaportes, direcciones ni códigos de reserva.

Para cambiarla, calcula el SHA-256 de la nueva clave y reemplaza `claveHash` en `js/datos.js`:

```bash
python -c "import hashlib; print(hashlib.sha256(b'NUEVA-CLAVE').hexdigest())"
```
