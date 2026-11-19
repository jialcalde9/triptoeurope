// Todo el contenido del sitio vive aquí. Para cambiar textos, lugares o noches, edita este archivo.
// Coordenadas en [latitud, longitud]. Tipos de lugar: "ver", "comer", "panorama".
window.VIAJE = {
  titulo: "Rumbo a Mussy",
  bajada: "Tres o cuatro semanas entre hermanos para conocer el pueblo de donde viene la familia, recorrer Francia a concho, cruzar a Italia y cerrar en España.",
  financian: "Antoine Gueneau de Mussy & Patricia Salas",
  // SHA-256 de la clave de entrada. Para cambiarla, ver README.md.
  claveHash: "e290f853bb8f79caf118a49c5728afa7a52cce9c843f252aa97f11e7cb763e97",

  paises: [
    { id: "francia", nombre: "Francia", lema: "El origen", foto: "paris.jpg",
      intro: "Entramos por París, bajamos a Borgoña para conocer Mussy-la-Fosse y seguimos al sur por Lyon, Provenza y la Costa Azul.",
      ciudades: ["paris", "mussy", "beaune", "lyon", "annecy", "avignon", "niza"] },
    { id: "italia", nombre: "Italia", lema: "La costa y el Renacimiento", foto: "florencia.jpg",
      intro: "Cruzamos por la Riviera hasta Cinque Terre y de ahí a Florencia y Roma.",
      ciudades: ["cinque", "florencia", "roma"] },
    { id: "espana", nombre: "España", lema: "El cierre", foto: "barcelona.jpg",
      intro: "Volamos de Roma a Barcelona y terminamos en Madrid, desde donde volvemos a Santiago.",
      ciudades: ["barcelona", "donostia", "madrid"] }
  ],

  // Orden de la ruta. "solo4" = parada que solo existe en la opción de 4 semanas.
  ciudades: {
    paris: {
      nombre: "París", pais: "francia", c: [48.8566, 2.3522], noches: [4, 4], foto: "paris.jpg",
      intro: "La entrada al viaje. Cuatro días para caminarla sin apuro, con un día aparte para Versalles.",
      hacer: ["Notre-Dame reabierta, Île de la Cité y picnic en la Île Saint-Louis", "Louvre u Orsay: elegir uno y reservar con hora", "Torre Eiffel al atardecer y el Sena en bici", "Montmartre y Sacré-Cœur", "Un día completo en Versalles"],
      comer: ["Croissant de panadería de barrio, no de cadena", "Crêpes en el barrio de Montparnasse", "Falafel en la rue des Rosiers, en el Marais"],
      tips: ["Desde el aeropuerto CDG, el RER B llega directo al centro.", "Los museos nacionales son gratis para menores de 26 de la UE, no para chilenos: presupuestar entradas."],
      sale: "TGV París-Gare de Lyon → Montbard · ~1 h 05",
      lugares: [
        { n: "Torre Eiffel", c: [48.8584, 2.2945], t: "ver" },
        { n: "Museo del Louvre", c: [48.8606, 2.3376], t: "ver" },
        { n: "Notre-Dame", c: [48.8530, 2.3499], t: "ver" },
        { n: "Museo de Orsay", c: [48.8600, 2.3266], t: "ver" },
        { n: "Montmartre y Sacré-Cœur", c: [48.8867, 2.3431], t: "panorama" },
        { n: "Le Marais y Place des Vosges", c: [48.8556, 2.3655], t: "comer" },
        { n: "Palacio de Versalles", c: [48.8049, 2.1204], t: "ver" }
      ]
    },
    mussy: {
      nombre: "Mussy-la-Fosse", pais: "francia", c: [47.5267, 4.4386], noches: [2, 3], foto: "mussy.jpg", raiz: true,
      intro: "El pueblo de la familia, en el Auxois (Borgoña, Côte-d'Or). Muy chico, entre colinas verdes y casas de piedra, al lado del monte donde estuvo Alesia.",
      hacer: ["Caminar el pueblo y entrar a la iglesia Saint-Léger", "Pasar por la mairie (municipalidad) y el cementerio a buscar el apellido", "MuséoParc Alésia: donde César venció a Vercingétorix", "Flavigny-sur-Ozerain: los anises y el pueblo donde se filmó Chocolat", "Abadía de Fontenay (UNESCO)", "Foto de los hermanos con el letrero del pueblo para los abuelos"],
      comer: ["Bœuf bourguignon y œufs en meurette", "Quesos de la zona: époisses", "Anís de Flavigny para llevar de regalo"],
      tips: ["Sin auto es muy difícil moverse: arrendar en Montbard.", "Antes del viaje, pedirle al abuelo nombres, casas, fotos y lugares que quiere que veamos.", "No confundir con Mussy-sur-Seine ni con Mussy-sous-Dun."],
      sale: "Auto Mussy → Beaune y tren Dijon → Lyon · ~3 h 30",
      lugares: [
        { n: "Mussy-la-Fosse e iglesia Saint-Léger", c: [47.5267, 4.4386], t: "ver" },
        { n: "MuséoParc Alésia", c: [47.5375, 4.4936], t: "ver" },
        { n: "Flavigny-sur-Ozerain", c: [47.5133, 4.5300], t: "panorama" },
        { n: "Semur-en-Auxois", c: [47.4917, 4.3333], t: "comer" },
        { n: "Abadía de Fontenay", c: [47.6394, 4.3897], t: "ver" },
        { n: "Estación de Montbard", c: [47.6236, 4.3375], t: "panorama" }
      ]
    },
    beaune: {
      nombre: "Beaune", pais: "francia", c: [47.0216, 4.8379], noches: [0, 0], foto: "beaune.jpg", paso: true,
      intro: "Parada de un día entre Mussy y Lyon, por la ruta de los grandes vinos de Borgoña.",
      hacer: ["Hospices de Beaune y sus techos de colores", "Cata en una bodega de la Côte de Nuits"],
      comer: ["Escargots de Bourgogne", "Gougères con un vaso de vino"],
      tips: ["Devolver el auto en Dijon y seguir en tren a Lyon."],
      sale: "TGV Dijon → Lyon · ~1 h 40",
      lugares: [{ n: "Hospices de Beaune", c: [47.0216, 4.8379], t: "ver" }]
    },
    lyon: {
      nombre: "Lyon", pais: "francia", c: [45.7640, 4.8357], noches: [2, 2], foto: "lyon.jpg",
      intro: "La capital gastronómica de Francia, con un casco antiguo lleno de pasajes escondidos.",
      hacer: ["Vieux Lyon y sus traboules, pasajes secretos entre edificios", "Subir a la basílica de Fourvière", "Place Bellecour y orillas del Ródano"],
      comer: ["Un bouchon lyonnais: quenelles y saucisson", "Les Halles Paul Bocuse"],
      tips: ["Comprar el funicular de Fourvière con el ticket de metro."],
      sale: "TGV Lyon → Aviñón · ~1 h 05 (o Lyon → Annecy en la opción de 4 semanas)",
      lugares: [
        { n: "Basílica de Fourvière", c: [45.7623, 4.8227], t: "panorama" },
        { n: "Vieux Lyon", c: [45.7609, 4.8273], t: "ver" },
        { n: "Place Bellecour", c: [45.7578, 4.8320], t: "ver" },
        { n: "Les Halles Paul Bocuse", c: [45.7630, 4.8508], t: "comer" }
      ]
    },
    annecy: {
      nombre: "Annecy", pais: "francia", c: [45.8992, 6.1294], noches: [0, 2], foto: "annecy.jpg", solo4: true,
      intro: "La «Venecia de los Alpes»: canales, casas de colores y un lago turquesa. Solo en la opción de 4 semanas.",
      hacer: ["Caminar la vieja ciudad y el Palais de l'Isle", "Nadar en el lago o arrendar un bote", "Excursión opcional a Chamonix para ver el Mont Blanc"],
      comer: ["Tartiflette y raclette", "Helado en la vieja ciudad"],
      tips: ["Lyon → Annecy ~2 h en tren; Annecy → Aviñón ~4 h."],
      sale: "Tren Annecy → Aviñón · ~4 h",
      lugares: [
        { n: "Palais de l'Isle", c: [45.8992, 6.1294], t: "ver" },
        { n: "Pont des Amours y lago", c: [45.9010, 6.1340], t: "panorama" }
      ]
    },
    avignon: {
      nombre: "Aviñón", pais: "francia", c: [43.9493, 4.8055], noches: [2, 2], foto: "avignon.jpg",
      intro: "La Provenza: piedra clara, ciudad amurallada y ruinas romanas a una hora.",
      hacer: ["Palacio de los Papas", "El puente de Aviñón", "Pont du Gard: acueducto romano, y nadar abajo si hace calor", "Arles y su anfiteatro"],
      comer: ["Ratatouille y tapenade", "Mercado de Les Halles"],
      tips: ["Para Pont du Gard y Arles conviene bus o un auto por el día."],
      sale: "TGV Aviñón → Niza · ~3 h",
      lugares: [
        { n: "Palacio de los Papas", c: [43.9508, 4.8076], t: "ver" },
        { n: "Puente de Aviñón", c: [43.9539, 4.8050], t: "ver" },
        { n: "Pont du Gard", c: [43.9475, 4.5353], t: "panorama" },
        { n: "Anfiteatro de Arles", c: [43.6777, 4.6309], t: "ver" }
      ]
    },
    niza: {
      nombre: "Niza y Mónaco", pais: "francia", c: [43.7034, 7.2663], noches: [2, 2], foto: "niza.jpg",
      intro: "Costa Azul: mar, mercado y una tarde en Mónaco, el cuarto país del viaje.",
      hacer: ["Promenade des Anglais y playa", "Subir a la Colline du Château", "Pueblo de Èze, colgado sobre el mar", "Tarde en Mónaco y el casino de Montecarlo"],
      comer: ["Socca y pan bagnat", "Mercado del Cours Saleya"],
      tips: ["El tren regional a Mónaco y Èze es barato y rápido."],
      sale: "Tren Niza → Ventimiglia → La Spezia · ~4 h",
      lugares: [
        { n: "Promenade des Anglais", c: [43.6950, 7.2650], t: "panorama" },
        { n: "Colline du Château", c: [43.6952, 7.2810], t: "panorama" },
        { n: "Cours Saleya", c: [43.6956, 7.2757], t: "comer" },
        { n: "Èze", c: [43.7280, 7.3617], t: "ver" },
        { n: "Casino de Montecarlo", c: [43.7393, 7.4276], t: "ver" }
      ]
    },
    cinque: {
      nombre: "Cinque Terre", pais: "italia", c: [44.1350, 9.6847], noches: [1, 1], foto: "cinque.jpg",
      intro: "Cinco pueblos de colores colgados sobre el mar, unidos por senderos y tren.",
      hacer: ["Sendero Vernazza → Monterosso", "Baño en el mar en Monterosso", "Atardecer en Manarola"],
      comer: ["Focaccia y pesto, que se inventaron aquí", "Cono de pescado frito"],
      tips: ["La Cinque Terre Card incluye trenes entre pueblos y senderos."],
      sale: "Tren La Spezia → Florencia · ~2 h",
      lugares: [
        { n: "Vernazza", c: [44.1350, 9.6847], t: "ver" },
        { n: "Monterosso", c: [44.1460, 9.6545], t: "panorama" },
        { n: "Manarola", c: [44.1067, 9.7286], t: "panorama" },
        { n: "Riomaggiore", c: [44.0996, 9.7385], t: "ver" }
      ]
    },
    florencia: {
      nombre: "Florencia", pais: "italia", c: [43.7696, 11.2558], noches: [2, 3], foto: "florencia.jpg",
      intro: "El Renacimiento en una ciudad que se recorre a pie.",
      hacer: ["Duomo y subir a la cúpula", "Galería Uffizi (reservar)", "Ponte Vecchio", "Atardecer en Piazzale Michelangelo", "Medio día en Siena o Pisa"],
      comer: ["Bistecca alla fiorentina", "Lampredotto en un carrito callejero", "Gelato"],
      tips: ["Reservar la cúpula del Duomo con semanas de anticipación."],
      sale: "Frecciarossa Florencia → Roma · ~1 h 35",
      lugares: [
        { n: "Duomo", c: [43.7731, 11.2560], t: "ver" },
        { n: "Galería Uffizi", c: [43.7678, 11.2553], t: "ver" },
        { n: "Ponte Vecchio", c: [43.7680, 11.2531], t: "ver" },
        { n: "Piazzale Michelangelo", c: [43.7629, 11.2650], t: "panorama" },
        { n: "Mercado Central", c: [43.7764, 11.2534], t: "comer" }
      ]
    },
    roma: {
      nombre: "Roma", pais: "italia", c: [41.9028, 12.4964], noches: [2, 3], foto: "roma.jpg",
      intro: "Dos mil años de historia en cada esquina.",
      hacer: ["Coliseo, Foro y Palatino", "Vaticano y Capilla Sixtina (reservar)", "Fontana di Trevi y Panteón", "Noche en Trastevere"],
      comer: ["Carbonara y cacio e pepe", "Supplì y pizza al taglio", "Gelato"],
      tips: ["Revisar qué entrada cubre Foro y Palatino además del Coliseo."],
      sale: "Vuelo low cost Roma → Barcelona · ~1 h 45",
      lugares: [
        { n: "Coliseo", c: [41.8902, 12.4922], t: "ver" },
        { n: "Basílica de San Pedro", c: [41.9022, 12.4539], t: "ver" },
        { n: "Fontana di Trevi", c: [41.9009, 12.4833], t: "panorama" },
        { n: "Panteón", c: [41.8986, 12.4769], t: "ver" },
        { n: "Trastevere", c: [41.8897, 12.4700], t: "comer" }
      ]
    },
    barcelona: {
      nombre: "Barcelona", pais: "espana", c: [41.3874, 2.1686], noches: [2, 2], foto: "barcelona.jpg",
      intro: "Gaudí, barrios medievales y playa en la misma ciudad.",
      hacer: ["Sagrada Familia (reservar, decidir si suben a las torres)", "Barrio Gótico y el Born", "Park Güell", "Tarde de playa en la Barceloneta"],
      comer: ["Tapas y vermut", "Pan con tomate", "Mercado de la Boquería"],
      tips: ["Ojo con los carteristas en las Ramblas y el metro."],
      sale: "AVE Barcelona → Madrid · ~2 h 30 (o → San Sebastián en la opción de 4 semanas)",
      lugares: [
        { n: "Sagrada Familia", c: [41.4036, 2.1744], t: "ver" },
        { n: "Park Güell", c: [41.4145, 2.1527], t: "panorama" },
        { n: "Barrio Gótico", c: [41.3839, 2.1762], t: "ver" },
        { n: "Casa Batlló", c: [41.3917, 2.1649], t: "ver" },
        { n: "Mercado de la Boquería", c: [41.3817, 2.1716], t: "comer" },
        { n: "Barceloneta", c: [41.3784, 2.1925], t: "panorama" }
      ]
    },
    donostia: {
      nombre: "San Sebastián", pais: "espana", c: [43.3183, -1.9812], noches: [0, 2], foto: "donostia.jpg", solo4: true,
      intro: "Pintxos, playa urbana y costa vasca. Solo en la opción de 4 semanas.",
      hacer: ["Pintxos en la Parte Vieja", "Playa de La Concha", "Atardecer en el monte Igueldo", "Biarritz, en Francia, a 45 min"],
      comer: ["Pintxos y txakoli", "Tarta de queso de La Viña"],
      tips: ["Barcelona → San Sebastián ~5 h 30 en tren; San Sebastián → Madrid ~5 h."],
      sale: "Tren San Sebastián → Madrid · ~5 h",
      lugares: [
        { n: "Playa de La Concha", c: [43.3176, -1.9866], t: "panorama" },
        { n: "Parte Vieja", c: [43.3237, -1.9856], t: "comer" },
        { n: "Monte Igueldo", c: [43.3215, -2.0064], t: "panorama" }
      ]
    },
    madrid: {
      nombre: "Madrid", pais: "espana", c: [40.4168, -3.7038], noches: [1, 1], foto: "madrid.jpg",
      intro: "Último día del viaje y vuelo de vuelta a Santiago.",
      hacer: ["Museo del Prado o el Retiro", "Plaza Mayor y Palacio Real", "Tapas en La Latina para cerrar"],
      comer: ["Bocadillo de calamares", "Churros con chocolate en San Ginés"],
      tips: ["Dejar margen para llegar a Barajas: el metro o el Cercanías tardan ~40 min."],
      sale: "Vuelo Madrid → Santiago",
      lugares: [
        { n: "Museo del Prado", c: [40.4138, -3.6921], t: "ver" },
        { n: "Parque del Retiro", c: [40.4153, -3.6845], t: "panorama" },
        { n: "Plaza Mayor", c: [40.4155, -3.7074], t: "comer" },
        { n: "Palacio Real", c: [40.4180, -3.7143], t: "ver" }
      ]
    }
  },

  orden: ["paris", "mussy", "beaune", "lyon", "annecy", "avignon", "niza", "cinque", "florencia", "roma", "barcelona", "donostia", "madrid"],

  // Simulador de presupuesto. Montos en EUR salvo el pasaje (CLP). Precios aproximados: confirmar antes de comprar.
  presupuesto: {
    tope: 4000000,
    fx: 1100,
    alojamiento: [
      { id: "hostal", n: "Hostal, pieza compartida", eur: 25 },
      { id: "airbnb", n: "Departamento entre hermanos", eur: 40 },
      { id: "hotel", n: "Hotel 3 estrellas", eur: 65 }
    ],
    comida: [
      { id: "super", n: "Supermercado y picnic", eur: 20 },
      { id: "mixto", n: "Mixto: menú del día y algunas comidas buenas", eur: 35 },
      { id: "restoran", n: "Restoranes casi siempre", eur: 55 }
    ],
    // Suma de trenes + vuelo Roma–Barcelona por persona: [3 semanas, 4 semanas]
    trenesBase: [340, 435],
    trenes: [
      { id: "anticipado", n: "Comprados con 2–3 meses", f: 0.75 },
      { id: "normal", n: "Precio normal", f: 1 },
      { id: "ultimo", n: "A última hora", f: 1.35 }
    ],
    // Auto: costo total del grupo (se divide por viajeros). Sin auto: costo por persona.
    autos: [
      { id: "borgona", n: "Auto en Borgoña (3 días, Montbard → Mussy → Dijon)", eur: 240, sinAuto: 35, sinAutoN: "tren a Les Laumes-Alésia + traslados reservados" },
      { id: "provenza", n: "Auto un día en Provenza (Pont du Gard y Arles)", eur: 90, sinAuto: 12, sinAutoN: "buses" }
    ],
    urbanoDia: 7,
    seguroDia: 2.7,
    // rec: recomendada en perfil equilibrado · basica: incluida en perfil mochilero
    entradas: [
      { id: "louvre", n: "Museo del Louvre", ciudad: "paris", eur: 22, rec: true, basica: true },
      { id: "orsay", n: "Museo de Orsay", ciudad: "paris", eur: 16 },
      { id: "eiffel", n: "Torre Eiffel, cima en ascensor", ciudad: "paris", eur: 36, rec: true },
      { id: "versalles", n: "Versalles, pasaporte", ciudad: "paris", eur: 32, rec: true },
      { id: "notredame", n: "Torres de Notre-Dame", ciudad: "paris", eur: 16 },
      { id: "alesia", n: "MuséoParc Alésia", ciudad: "mussy", eur: 12, rec: true, basica: true },
      { id: "fontenay", n: "Abadía de Fontenay", ciudad: "mussy", eur: 13, rec: true },
      { id: "hospices", n: "Hospices de Beaune", ciudad: "beaune", eur: 13 },
      { id: "papas", n: "Palacio de los Papas", ciudad: "avignon", eur: 15, rec: true },
      { id: "pontdugard", n: "Pont du Gard", ciudad: "avignon", eur: 10 },
      { id: "casino", n: "Casino de Montecarlo", ciudad: "niza", eur: 18 },
      { id: "cinqueterre", n: "Cinque Terre Card con trenes (1 día)", ciudad: "cinque", eur: 33, rec: true, basica: true },
      { id: "cupula", n: "Cúpula del Duomo", ciudad: "florencia", eur: 30, rec: true },
      { id: "uffizi", n: "Galería Uffizi", ciudad: "florencia", eur: 25 },
      { id: "coliseo", n: "Coliseo, Foro y Palatino", ciudad: "roma", eur: 18, rec: true, basica: true },
      { id: "vaticano", n: "Museos Vaticanos y Capilla Sixtina", ciudad: "roma", eur: 25, rec: true, basica: true },
      { id: "sagrada", n: "Sagrada Familia con torre", ciudad: "barcelona", eur: 36, rec: true, basica: true },
      { id: "guell", n: "Park Güell", ciudad: "barcelona", eur: 18 },
      { id: "batllo", n: "Casa Batlló", ciudad: "barcelona", eur: 35 },
      { id: "prado", n: "Museo del Prado", ciudad: "madrid", eur: 15, rec: true }
    ],
    perfiles: {
      mochilero: { n: "Mochilero", alojamiento: "hostal", comida: "super", trenes: "anticipado", autos: [], entradas: "basica", imprevistos: 5 },
      equilibrado: { n: "Equilibrado", alojamiento: "airbnb", comida: "mixto", trenes: "normal", autos: ["borgona"], entradas: "rec", imprevistos: 7 },
      comodo: { n: "Cómodo", alojamiento: "hotel", comida: "restoran", trenes: "normal", autos: ["borgona", "provenza"], entradas: "todas", imprevistos: 10 }
    },
    inicial: { perfil: "equilibrado", viajeros: 4, pasaje: 700000 }
  },

  pendientes: [
    ["Fechas", "¿Cuándo vamos? Mayo–junio o septiembre tienen mejor clima; enero–febrero calza con vacaciones."],
    ["Duración", "¿3 o 4 semanas? 4 semanas suma Annecy y San Sebastián, pero queda justo con el presupuesto."],
    ["Viajeros", "Confirmar cuántos hermanos van y días libres en común."],
    ["Papeles", "Pasaporte vigente y ETIAS, la autorización electrónica de la UE."],
    ["Pasajes", "Alertas de precio para llegar a ~700 mil, comprando 5–6 meses antes."],
    ["Mussy", "Preguntar a los abuelos por familia, casas y lugares en el pueblo."]
  ],

  creditos: [
    ["París", "Benh LIEU SONG", "Dominio público", "https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons_(cropped).jpg"],
    ["Mussy-la-Fosse", "Pierre Lapointe", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Mussy-la-Fosse.jpg"],
    ["Iglesia Saint-Léger", "WCOMFR", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:MUSSY_LA_FOSSE.jpg"],
    ["Beaune", "Benjamin Smith", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Beaune_-_H%C3%B4tel-Dieu_-_Cour_-_05.jpg"],
    ["Lyon", "Karldupart", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Vieuxlyon_saintjean_toits.jpg"],
    ["Annecy", "Carsten Steger", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Lake_Annecy_(view_from_the_south).jpg"],
    ["Aviñón", "François de Dijon", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Avignon_Palais_des_Papes_2013.jpg"],
    ["Niza", "3602kiva", "CC0", "https://commons.wikimedia.org/wiki/File:CollineDuChateau_NiceFrance2022.png"],
    ["Cinque Terre", "Usuario de Flickr 150594450@N07", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Vernazza_and_the_sea,_Cinque_Terre,_Italy.jpg"],
    ["Florencia", "Gary Campbell-Hall", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Cattedrale_di_Santa_Maria_del_Fiore_%E2%80%93_Il_Duomo_di_Firenze.jpg"],
    ["Roma", "FeaturedPics", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg"],
    ["Barcelona", "Canaan", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:SF_maig_2_cropped.jpg"],
    ["San Sebastián", "Daniel Díez Sanquirce", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Panoramic-bahia-concha.jpg"],
    ["Madrid", "Jorge Franganillo", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Madrid_Plaza_Mayor_(48733706273).jpg"]
  ]
};
