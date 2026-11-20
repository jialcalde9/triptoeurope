# Registro de cambios — Rumbo a Mussy

Lo más nuevo arriba. Cada cambio publicado agrega una entrada.

## 2026-11-20
- **Línea de tiempo** sobre el mapa: una franja con cada parada (más ancha si hay más noches) y el medio de transporte entre ellas (🚆 ✈️ 🚗 con horas). Al tocar una parada baja a su detalle.
- **Más pulido**: las secciones y tarjetas aparecen suavemente al bajar, y las fotos de países y paradas reaccionan al pasar el mouse.
- **Celular**: el menú queda en una sola fila deslizable, los datos de la portada caben en una línea y las rutas armadas se deslizan de lado.
- Versión de enlaces subida a `?v=4`.
- **Ruta arrastrable**: en el itinerario se pueden mover las paradas arrastrándolas (o con las flechas ▲ ▼, que sirven en el celular) y sumar/restar noches con − y +. París queda siempre primero y Beaune siempre después de Mussy. El tren/vuelo entre ciudades y el presupuesto se recalculan solos.
- **Países plegables** en el armador: cada país es una tarjeta que se abre y cierra y muestra cuántas de sus ciudades van en la ruta.
- **Barra fija** al pie mientras ves la ruta: días, paradas y costo por persona siempre a la vista.
- **Versión en los enlaces** (`?v=2`) de todos los HTML: los cambios se ven sin esperar el caché del navegador. Al cambiar JS/CSS, subir el número.
- **Git conectado**: la carpeta `sitio-viaje` es ahora el repo y se publica con commit + push (ya no se suben archivos a mano por la web).
- Se agregó este registro de cambios.

## 2026-11-19
- **Estimado por ruta**: cada ruta armada muestra cuánto sale por persona, y bajo el armador aparece "Esta ruta sale ~X M CLP por persona". Todo se recalcula al cambiar ruta, días, noches o los ajustes del simulador (alojamiento, comida, trenes).
- **Financiamiento**: el sello de la portada dice "Financiado por" (antes "Financiado en parte por").
- **Firma** al pie de todas las páginas: "Hecho por Juan Ignacio Alcalde Gueneau de Mussy".
- **Menú**: arriba quedan Francia, Italia y España; el resto de los países va en un desplegable "Otros países".
- **Fichas completas para todo el catálogo** (mapa, lugares con foto, qué hacer, qué comer, datos útiles):
  - Italia: Milán y lago de Como, Verona, Venecia, Pisa, Nápoles y Costa Amalfitana.
  - España: Granada, Sevilla.
  - Páginas nuevas de país: Suiza (Zúrich, Lucerna, Interlaken), Reino Unido (Londres), Países Bajos (Ámsterdam), Bélgica (Brujas), Alemania (Múnich), Austria (Salzburgo, Viena), Chequia (Praga), Portugal (Oporto, Lisboa).
  - Las ciudades fuera de la ruta base aparecen como "Opcional, se suma en el armador".
  - Sin foto todavía: Mirador de San Nicolás, Niederdorf, Weinmarkt.
