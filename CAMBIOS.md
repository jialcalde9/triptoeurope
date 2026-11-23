# Registro de cambios — Rumbo a Mussy

Lo más nuevo arriba. Cada cambio publicado agrega una entrada.

## 2026-11-20
- **Más ordenado, para no perderse**: barra pegada arriba con atajos (Ruta, Clima, Países, Presupuesto, Antes de viajar). La votación ahora va plegada ("Votar entre hermanos") y los botones 👍👎 de cada ciudad solo aparecen al abrirla; si alguien te manda un enlace con votos, se abre sola.
- **Plan sugerido por día**: en cada ciudad de la ruta, un desplegable ("Plan sugerido por día") reparte lo que hacer según las noches (Día 1: …, Día 2: …) y sugiere qué comer.
- **Qué llevar en la maleta**: desplegable dentro de "Antes de viajar" con una lista base y lo que suma según el clima del mes elegido y las ciudades de la ruta (paraguas, abrigo, protector solar, ropa para iglesias en Italia, etc.), con casillas para marcar. En celular solo queda pegado el índice (el encabezado se desplaza) para no tapar la pantalla. Revisado en 375 px sin desbordes. Versión de enlaces `?v=17`.
- **¿Cuándo conviene viajar?** (sección nueva, bajo la ruta): 12 tarjetas, una por mes, con la temperatura máxima/mínima promedio de las ciudades de tu ruta (pesada por las noches en cada una) y una etiqueta: Ideal, Agradable, Calor fuerte o Fresco/frío. Dice qué meses son más cómodos para esa ruta, y al tocar un mes muestra el detalle por ciudad con días de lluvia. Si pones la fecha de salida en "Antes de viajar", abre ese mes. Datos reales de 2015 a 2024 (Open-Meteo), guardados en el sitio: no consulta nada en línea. Incluye la nota general de temporada alta/baja. Versión de enlaces `?v=14`.
- **Calendario (.ics)**: botón "Descargar calendario" que genera un archivo para Google Calendar, Outlook o el calendario del celular, con la fecha de salida de "Antes de viajar": los vuelos, cada ciudad con sus noches y los plazos pendientes de tareas y reservas. Si falta la fecha de salida, avisa.
- **Frases útiles** en las páginas de Francia, Italia y España: frases de viaje en francés e italiano con cómo se leen, y en España las diferencias con el español chileno (vale, coger, zumo, etc.). Versión de enlaces `?v=13`.
- **Vista previa al compartir**: al pegar el enlace del sitio en WhatsApp u otras apps ahora aparece una foto de París, el título y una descripción corta (antes salía solo el texto del enlace).
- **Copiar resumen para WhatsApp**: botón nuevo que copia un texto listo para pegar con la llegada y salida, las ciudades con sus noches, el costo aproximado por persona y el enlace para ver y votar. Versión de enlaces `?v=12`.
- **Llegada y salida por Madrid o París**: nuevo selector en el armador ("Llegamos a" y "Volvemos desde"). Se puede entrar por Madrid, y volver desde Madrid, París o la última ciudad. La ruta se ordena desde la ciudad de llegada; si entran y salen por la misma, arma un circuito y agrega el tramo de regreso (con su costo) antes del vuelo a Santiago. El itinerario muestra "Vuelo Santiago → Madrid" y "Vuelo Madrid → Santiago". Se avisa que Madrid suele salir más barato desde Santiago; falta confirmar precios en Google Flights. El presupuesto sigue usando el pasaje que se ponga a mano en el simulador. Versión de enlaces `?v=11`.
- **Fotos nuevas**: Mirador de San Nicolás (Granada, con la iglesia de San Nicolás) y Niederdorf (Zúrich). Solo falta Weinmarkt (Lucerna): no hay foto libre en Wikipedia.
- **Celular**: revisado todo en pantalla de 375 px, sin desbordes; los botones − y + y los de voto se agrandan para el dedo. Versión de enlaces `?v=10`.
- **Datos corregidos** tras una revisión por internet (Francia, Italia, España): Louvre sube de 22 a 32 € para chilenos; Cinque Terre Card pasa a ~30 € y se avisa que varía entre 22 y 35 € según el día; el tip de papeles dice que el ETIAS aún no está en vigor (y que rige el registro EES en la frontera); el aeropuerto de Sevilla no tiene tren, es bus. Versión de enlaces `?v=9`.
- **Ranking de votos**: en el panel de votos aparece "Ciudades más votadas" (de más a menos, con el saldo 👍 menos 👎), las que tienen todos a favor, las que hay que conversar (con votos en contra) y las que aún no tienen votos. Cada ciudad lleva a su detalle. Versión de enlaces `?v=8`.
- **Votación entre hermanos**: cada uno escribe su nombre y vota 👍 o 👎 en cada ciudad de la ruta. El botón "Copiar enlace de esta ruta" ahora lleva la ruta y los votos de quien lo manda; al abrirlo, los demás los ven sumados a los suyos (con los nombres) y pueden quitar los de alguien. No hay servidor: los votos viajan en el enlace y se guardan en cada navegador.
- Versión de enlaces subida a `?v=7`.
- **Antes de viajar** (sección nueva): se pone la fecha de salida y aparece cuántos días faltan. Hay una lista de tareas (pasaportes, pasajes, alojamientos, seguro, etc.) y las reservas con anticipación (Última Cena, Alhambra, Torre Eiffel, Coliseo, Uffizi, Sagrada Familia…) solo de las ciudades de la ruta, cada una con su fecha límite. Lo marcado queda guardado en el navegador. Los plazos son aproximados: confirmar en los sitios oficiales.
- Versión de enlaces subida a `?v=6`.
- **Compartir la ruta**: botón "Copiar enlace de esta ruta". Quien abre el enlace ve la misma ruta (ciudades, noches, orden y días) y puede cambiarla.
- **Imprimir / guardar PDF**: botón que deja solo el itinerario y la línea de tiempo, limpios y en blanco y negro, para mostrar o imprimir.
- **Comparar dos rutas**: desplegable con dos selectores (mi ruta actual o cualquiera de las armadas) y una tabla con costo por persona, días, países, paradas, trenes/vuelos y ciudades; marca en verde lo más barato.
- Versión de enlaces subida a `?v=5`.
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
