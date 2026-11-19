// Todo el contenido del sitio vive aquí. Para cambiar textos, lugares o noches, edita este archivo.
// Coordenadas en [latitud, longitud]. Tipos de lugar: "ver", "comer", "panorama".
window.VIAJE = {
  titulo: "Rumbo a Mussy",
  bajada: "Tres o cuatro semanas recorriendo Francia, Italia y España a concho, con una parada en Mussy-la-Fosse, el pueblo de donde viene la familia.",
  financian: "Antoine Gueneau de Mussy & Patricia Salas",
  // SHA-256 de la clave de entrada. Para cambiarla, ver README.md.
  claveHash: "e290f853bb8f79caf118a49c5728afa7a52cce9c843f252aa97f11e7cb763e97",

  paises: [
    { id: "francia", nombre: "Francia", lema: "El origen", foto: "paris.jpg",
      intro: "Entramos por París, bajamos a Borgoña para conocer Mussy-la-Fosse y seguimos al sur por Lyon, Provenza y la Costa Azul.",
      ciudades: ["paris", "mussy", "beaune", "lyon", "annecy", "avignon", "niza"] },
    { id: "italia", nombre: "Italia", lema: "La costa y el Renacimiento", foto: "florencia.jpg",
      intro: "Cruzamos por la Riviera hasta Cinque Terre y de ahí a Florencia y Roma. Más abajo, las ciudades opcionales del armador: el norte, Venecia, Pisa y Nápoles.",
      ciudades: ["cinque", "florencia", "roma", "como", "verona", "venecia", "pisa", "napoles"] },
    { id: "espana", nombre: "España", lema: "El cierre", foto: "barcelona.jpg",
      intro: "Volamos de Roma a Barcelona y terminamos en Madrid, desde donde volvemos a Santiago. Opcional: Andalucía, con Granada y Sevilla.",
      ciudades: ["barcelona", "donostia", "madrid", "granada", "sevilla"] },
    { id: "suiza", nombre: "Suiza", lema: "Los Alpes", foto: "lugares/interlaken.jpg",
      intro: "Opcional: lagos, trenes de montaña y nieve todo el año. Se suma en el armador entre Francia e Italia.",
      ciudades: ["zurich", "lucerna", "interlaken"] },
    { id: "reino-unido", nombre: "Reino Unido", lema: "Al otro lado del canal", foto: "lugares/londres.jpg",
      intro: "Opcional: Londres, a 2 h 20 de París en Eurostar. El Reino Unido no es parte de Schengen y pide autorización ETA antes de viajar.",
      ciudades: ["londres"] },
    { id: "paises-bajos", nombre: "Países Bajos", lema: "Canales y bicicletas", foto: "lugares/amsterdam.jpg",
      intro: "Opcional: Ámsterdam, a 3 h 20 de París en tren, con molinos a media hora.",
      ciudades: ["amsterdam"] },
    { id: "belgica", nombre: "Bélgica", lema: "Chocolate y canales medievales", foto: "lugares/brujas.jpg",
      intro: "Opcional: Brujas, ciudad medieval a 2 h 40 de París vía Bruselas y de camino a Ámsterdam.",
      ciudades: ["brujas"] },
    { id: "alemania", nombre: "Alemania", lema: "Baviera", foto: "lugares/munich.jpg",
      intro: "Opcional: Múnich, con cervecerías, palacios y el castillo de Neuschwanstein a un día de excursión.",
      ciudades: ["munich"] },
    { id: "austria", nombre: "Austria", lema: "Música y palacios", foto: "lugares/viena.jpg",
      intro: "Opcional: Salzburgo, a 1 h 30 de Múnich, y Viena imperial, con cafés y palacios.",
      ciudades: ["salzburgo", "viena"] },
    { id: "chequia", nombre: "Chequia", lema: "La ciudad de las cien torres", foto: "lugares/praga.jpg",
      intro: "Opcional: Praga, a 4 h de Viena en tren, con castillo, puentes góticos y cerveza barata.",
      ciudades: ["praga"] },
    { id: "portugal", nombre: "Portugal", lema: "Fado y azulejos", foto: "lugares/lisboa.jpg",
      intro: "Opcional: Oporto y Lisboa, a 3 h en tren entre ellas. Lisboa también sirve para volver a Santiago.",
      ciudades: ["oporto", "lisboa"] }
  ],

  // Orden de la ruta. "solo4" = parada que solo existe en la opción de 4 semanas.
  ciudades: {
    paris: {
      nombre: "París", pais: "francia", c: [48.8566, 2.3522], noches: [5, 5], foto: "paris.jpg",
      intro: "La entrada al viaje. Cinco días para caminarla sin apuro, con un día aparte para Versalles.",
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
      nombre: "Mussy-la-Fosse", pais: "francia", c: [47.5267, 4.4386], noches: [0, 0], foto: "mussy.jpg", raiz: true, paso: true,
      intro: "El pueblo de la familia, en el Auxois (Borgoña). Es muy chico, así que pasamos un par de horas camino a Beaune: lo justo para conocerlo y sacarnos la foto.",
      hacer: ["Caminar el pueblo y entrar a la iglesia Saint-Léger", "Buscar el apellido en el cementerio", "Foto de los hermanos con el letrero del pueblo para los abuelos", "Si sobra tiempo: MuséoParc Alésia, a 5 minutos"],
      comer: ["Almuerzo en Semur-en-Auxois o Flavigny, a 15–20 min"],
      tips: ["El mismo día: TGV París → Montbard, auto, Mussy, Beaune y tren a Lyon desde Dijon.", "Antes del viaje, preguntarle al abuelo qué casa o lugar quiere que veamos."],
      sale: "Auto Mussy → Beaune · ~1 h",
      lugares: [
        { n: "Mussy-la-Fosse e iglesia Saint-Léger", c: [47.5267, 4.4386], t: "ver" },
        { n: "MuséoParc Alésia", c: [47.5375, 4.4936], t: "ver" },
        { n: "Semur-en-Auxois", c: [47.4917, 4.3333], t: "comer" }
      ]
    },
    beaune: {
      nombre: "Beaune", pais: "francia", c: [47.0216, 4.8379], noches: [0, 0], foto: "beaune.jpg", paso: true,
      intro: "Tarde en Beaune, el mismo día de Mussy, por la ruta de los grandes vinos de Borgoña.",
      hacer: ["Hospices de Beaune y sus techos de colores", "Cata en una bodega de la Côte de Nuits"],
      comer: ["Escargots de Bourgogne", "Gougères con un vaso de vino"],
      tips: ["Devolver el auto en Dijon y seguir en tren a Lyon."],
      sale: "TGV Dijon → Lyon · ~1 h 40",
      lugares: [{ n: "Hospices de Beaune", c: [47.0216, 4.8379], t: "ver" }]
    },
    lyon: {
      nombre: "Lyon", pais: "francia", c: [45.7640, 4.8357], noches: [2, 3], foto: "lyon.jpg",
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
      nombre: "Cinque Terre", pais: "italia", c: [44.1350, 9.6847], noches: [2, 2], foto: "cinque.jpg",
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
    },

    // ---- Ciudades opcionales del armador (no están en la ruta base) ----
    como: {
      nombre: "Milán y lago de Como", pais: "italia", c: [45.8081, 9.0852], noches: [1, 2], foto: "lugares/milan-y-lago-de-como.jpg", extra: true,
      intro: "El Duomo de Milán y pueblos de postal a orillas del lago, a una hora en tren.",
      hacer: ["Duomo de Milán y sus terrazas", "Galería Vittorio Emanuele II", "La Última Cena de Da Vinci (reservar con meses)", "Ferry entre Bellagio, Varenna y Menaggio", "Aperitivo en los Navigli"],
      comer: ["Risotto alla milanese", "Cotoletta alla milanese", "Aperitivo con picoteo incluido"],
      tips: ["Tren Milán → Varenna ~1 h; desde ahí los ferries unen los pueblos del centro del lago.", "Las entradas a la Última Cena se agotan con meses de anticipación."],
      sale: "Tren Milán → Verona · ~1 h 15",
      lugares: [
        { n: "Duomo de Milán", c: [45.4642, 9.1916], t: "ver" },
        { n: "Galería Vittorio Emanuele II", c: [45.4659, 9.1900], t: "ver" },
        { n: "Navigli", c: [45.4520, 9.1760], t: "comer" },
        { n: "Bellagio", c: [45.9864, 9.2610], t: "panorama" },
        { n: "Varenna", c: [46.0106, 9.2836], t: "panorama" }
      ]
    },
    verona: {
      nombre: "Verona", pais: "italia", c: [45.4384, 10.9916], noches: [1, 1], foto: "lugares/verona.jpg", extra: true,
      intro: "Arena romana, Romeo y Julieta y la puerta al lago de Garda.",
      hacer: ["Arena de Verona (y ópera si hay en verano)", "Piazza delle Erbe y Torre dei Lamberti", "Casa de Julieta", "Atardecer en Castel San Pietro", "Medio día en Sirmione, lago de Garda"],
      comer: ["Risotto all'Amarone", "Vino Valpolicella", "Pandoro"],
      tips: ["La temporada de ópera en la Arena va de junio a septiembre: revisar la cartelera si coincide."],
      sale: "Tren Verona → Venecia · ~1 h 10",
      lugares: [
        { n: "Arena de Verona", c: [45.4390, 10.9944], t: "ver" },
        { n: "Casa de Julieta", c: [45.4419, 10.9984], t: "ver" },
        { n: "Piazza delle Erbe", c: [45.4430, 10.9975], t: "comer" },
        { n: "Castel San Pietro", c: [45.4475, 11.0030], t: "panorama" }
      ]
    },
    venecia: {
      nombre: "Venecia", pais: "italia", c: [45.4408, 12.3155], noches: [2, 3], foto: "lugares/venecia.jpg", extra: true,
      intro: "Ciudad sobre el agua: canales, góndolas y callejones sin autos.",
      hacer: ["Plaza y Basílica de San Marcos", "Palacio Ducal", "Puente de Rialto y su mercado", "Vaporetto línea 1 por el Gran Canal", "Islas de Murano y Burano"],
      comer: ["Cicchetti y spritz en un bacaro", "Sarde in saor", "Risotto al nero di seppia"],
      tips: ["Conviene el pase de vaporetto de 24–72 h.", "Revisar la tasa de acceso para visitantes por el día (fechas punta); quien duerme en Venecia paga la tasa de estadía."],
      sale: "Frecciarossa Venecia → Florencia · ~2 h 10",
      lugares: [
        { n: "Basílica de San Marcos", c: [45.4345, 12.3397], t: "ver" },
        { n: "Palacio Ducal", c: [45.4337, 12.3404], t: "ver" },
        { n: "Puente de Rialto", c: [45.4380, 12.3359], t: "ver" },
        { n: "Cannaregio", c: [45.4445, 12.3290], t: "comer" },
        { n: "Burano", c: [45.4853, 12.4167], t: "panorama" }
      ]
    },
    pisa: {
      nombre: "Pisa", pais: "italia", c: [43.7230, 10.3966], noches: [0, 1], foto: "lugares/pisa.jpg", extra: true,
      intro: "La torre inclinada y Lucca amurallada, a una hora de Florencia.",
      hacer: ["Piazza dei Miracoli", "Subir la torre (entrada con hora)", "Borgo Stretto", "Lucca y sus murallas en bicicleta (30 min en tren)"],
      comer: ["Cecina", "Schiacciata rellena"],
      tips: ["Alcanza con medio día; su aeropuerto tiene vuelos low cost."],
      sale: "Tren Pisa → Florencia · ~1 h",
      lugares: [
        { n: "Torre de Pisa", c: [43.7230, 10.3966], t: "ver" },
        { n: "Baptisterio de Pisa", c: [43.7233, 10.3941], t: "ver" },
        { n: "Borgo Stretto", c: [43.7185, 10.4033], t: "comer" },
        { n: "Lucca", c: [43.8429, 10.5027], t: "panorama" }
      ]
    },
    napoles: {
      nombre: "Nápoles y Costa Amalfitana", pais: "italia", c: [40.6281, 14.4850], noches: [2, 3], foto: "lugares/napoles-y-costa-amalfitana.jpg", extra: true,
      intro: "La pizza original, Pompeya y la costa más famosa de Italia.",
      hacer: ["Pizza en el centro histórico de Nápoles", "Ruinas de Pompeya", "Costa Amalfitana en bus o ferry: Positano y Amalfi", "Día en Capri", "Museo Arqueológico de Nápoles"],
      comer: ["Pizza napolitana", "Sfogliatella", "Spaghetti alle vongole", "Limoncello"],
      tips: ["Circumvesuviana Nápoles → Pompeya ~40 min y → Sorrento ~1 h.", "Ojo con los carteristas en Nápoles."],
      sale: "Frecciarossa Nápoles → Roma · ~1 h 10",
      lugares: [
        { n: "Spaccanapoli", c: [40.8484, 14.2559], t: "comer" },
        { n: "Pompeya", c: [40.7489, 14.4848], t: "ver" },
        { n: "Positano", c: [40.6281, 14.4850], t: "panorama" },
        { n: "Amalfi", c: [40.6340, 14.6027], t: "panorama" },
        { n: "Capri", c: [40.5532, 14.2222], t: "panorama" }
      ]
    },
    granada: {
      nombre: "Granada", pais: "espana", c: [37.1773, -3.5986], noches: [1, 2], foto: "lugares/granada.jpg", extra: true,
      intro: "La Alhambra, el Albaicín y tapas gratis con cada bebida.",
      hacer: ["Alhambra y Generalife (reservar con meses)", "Atardecer en el Mirador de San Nicolás", "Perderse en el Albaicín", "Flamenco en las cuevas del Sacromonte"],
      comer: ["Tapas que vienen gratis con la bebida", "Habas con jamón", "Piononos"],
      tips: ["La entrada a la Alhambra trae hora fija para los Palacios Nazaríes: llegar con tiempo."],
      sale: "Tren Granada → Sevilla · ~2 h 30 (o → Madrid ~3 h 15)",
      lugares: [
        { n: "Alhambra", c: [37.1761, -3.5881], t: "ver" },
        { n: "Mirador de San Nicolás", c: [37.1811, -3.5926], t: "panorama" },
        { n: "Albaicín", c: [37.1810, -3.5920], t: "ver" },
        { n: "Catedral de Granada", c: [37.1765, -3.5995], t: "ver" },
        { n: "Sacromonte", c: [37.1830, -3.5830], t: "panorama" }
      ]
    },
    sevilla: {
      nombre: "Sevilla", pais: "espana", c: [37.3891, -5.9845], noches: [2, 3], foto: "lugares/sevilla.jpg", extra: true,
      intro: "Patios, azulejos, flamenco y la plaza más fotogénica de España.",
      hacer: ["Real Alcázar (reservar)", "Catedral y subir a la Giralda", "Plaza de España y parque de María Luisa", "Barrio de Santa Cruz", "Tablao flamenco y tapas en Triana"],
      comer: ["Salmorejo", "Espinacas con garbanzos", "Pescaíto frito en Triana"],
      tips: ["En julio y agosto pasa los 40 °C: salir temprano y descansar a mediodía."],
      sale: "AVE Sevilla → Madrid · ~2 h 30",
      lugares: [
        { n: "Real Alcázar de Sevilla", c: [37.3831, -5.9902], t: "ver" },
        { n: "Giralda", c: [37.3862, -5.9926], t: "ver" },
        { n: "Plaza de España (Sevilla)", c: [37.3772, -5.9869], t: "panorama" },
        { n: "Barrio de Santa Cruz", c: [37.3860, -5.9883], t: "comer" },
        { n: "Setas de Sevilla", c: [37.3933, -5.9917], t: "panorama" },
        { n: "Triana", c: [37.3833, -6.0030], t: "comer" }
      ]
    },
    zurich: {
      nombre: "Zúrich", pais: "suiza", c: [47.3769, 8.5417], noches: [1, 1], foto: "lugares/zurich.jpg", extra: true,
      intro: "Ciudad ordenada a orillas del lago, con aeropuerto a 10 minutos en tren.",
      hacer: ["Casco antiguo y el Niederdorf", "Grossmünster y los vitrales de Chagall en el Fraumünster", "Mirador del Lindenhof", "Paseo por el lago", "Uetliberg, la montaña de la ciudad"],
      comer: ["Zürcher Geschnetzeltes con rösti", "Chocolates y Luxemburgerli de Sprüngli"],
      tips: ["El aeropuerto está a ~10 min en tren: buena puerta de entrada o salida."],
      sale: "Tren Zúrich → Lucerna · ~45 min (o → Múnich ~3 h 30)",
      lugares: [
        { n: "Grossmünster", c: [47.3700, 8.5440], t: "ver" },
        { n: "Fraumünster", c: [47.3698, 8.5413], t: "ver" },
        { n: "Lindenhof", c: [47.3730, 8.5409], t: "panorama" },
        { n: "Niederdorf", c: [47.3725, 8.5440], t: "comer" },
        { n: "Lago de Zúrich", c: [47.3620, 8.5440], t: "panorama" }
      ]
    },
    lucerna: {
      nombre: "Lucerna", pais: "suiza", c: [47.0502, 8.3093], noches: [1, 2], foto: "lugares/lucerna.jpg", extra: true,
      intro: "Puente de madera, lago y montañas: la postal de Suiza.",
      hacer: ["Puente de la Capilla y casco antiguo", "Monumento al León", "Monte Pilatus: barco, tren cremallera y teleférico (Golden Round Trip, mayo a octubre)", "Barco por el lago de los Cuatro Cantones", "Museo Suizo del Transporte"],
      comer: ["Rösti", "Fondue o raclette", "Luzerner Chügelipastete"],
      tips: ["Si hacen varias subidas o trenes, comparar Swiss Travel Pass con la Half Fare Card.", "Suiza es cara: los supermercados Coop y Migros salvan los almuerzos."],
      sale: "Tren Lucerna → Interlaken · ~1 h 50",
      lugares: [
        { n: "Puente de la Capilla", c: [47.0517, 8.3075], t: "ver" },
        { n: "Monumento al León", c: [47.0585, 8.3105], t: "ver" },
        { n: "Muralla de Musegg", c: [47.0545, 8.3060], t: "panorama" },
        { n: "Weinmarkt", c: [47.0518, 8.3038], t: "comer" },
        { n: "Monte Pilatus", c: [46.9790, 8.2530], t: "panorama" }
      ]
    },
    interlaken: {
      nombre: "Interlaken", pais: "suiza", c: [46.6863, 7.8632], noches: [1, 2], foto: "lugares/interlaken.jpg", extra: true,
      intro: "Base para los Alpes: valles con cascadas, trenes de montaña y nieve todo el año.",
      hacer: ["Valle de Lauterbrunnen y sus cascadas", "Mürren y Gimmelwald en teleférico", "Jungfraujoch (caro, pero épico)", "Atardecer en Harder Kulm", "Barco por el lago de Brienz"],
      comer: ["Älplermagronen", "Fondue", "Chocolate suizo"],
      tips: ["Mirar las webcams antes de subir: con nubes no se ve nada.", "El Jungfraujoch pasa los 200 CHF; Schilthorn o First son alternativas más baratas."],
      sale: "Tren Interlaken → Zúrich · ~2 h (o → Milán ~3 h 15)",
      lugares: [
        { n: "Lauterbrunnen", c: [46.5935, 7.9091], t: "panorama" },
        { n: "Cascadas de Trümmelbach", c: [46.5664, 7.9100], t: "ver" },
        { n: "Jungfraujoch", c: [46.5475, 7.9853], t: "panorama" },
        { n: "Harder Kulm", c: [46.6970, 7.8510], t: "panorama" },
        { n: "Lago de Brienz", c: [46.7280, 7.9700], t: "panorama" }
      ]
    },
    londres: {
      nombre: "Londres", pais: "reino-unido", c: [51.5074, -0.1278], noches: [3, 4], foto: "lugares/londres.jpg", extra: true,
      intro: "Museos gratis, mercados, pubs y la realeza, a un tren de París.",
      hacer: ["Westminster: Big Ben, Parlamento y Abadía", "Torre de Londres y Tower Bridge", "Museos gratis: Británico, National Gallery y Tate Modern", "Borough Market", "Camden y Notting Hill (Portobello Road los sábados)", "Un musical en el West End"],
      comer: ["Fish and chips", "Sunday roast en un pub", "Full English breakfast", "Curry en Brick Lane"],
      tips: ["Tramitar la ETA (autorización electrónica, tiene costo) antes del viaje: la piden a los chilenos.", "Pagar metro y buses con tarjeta contactless: hay tope diario automático.", "Los grandes museos son gratis; algunas exposiciones temporales se pagan."],
      sale: "Eurostar Londres → París · ~2 h 20 (o → Bruselas ~2 h)",
      lugares: [
        { n: "Palacio de Westminster", c: [51.4995, -0.1248], t: "ver" },
        { n: "Abadía de Westminster", c: [51.4994, -0.1273], t: "ver" },
        { n: "Museo Británico", c: [51.5194, -0.1270], t: "ver" },
        { n: "Torre de Londres", c: [51.5081, -0.0759], t: "ver" },
        { n: "Tower Bridge", c: [51.5055, -0.0754], t: "panorama" },
        { n: "Borough Market", c: [51.5055, -0.0910], t: "comer" },
        { n: "Camden Market", c: [51.5413, -0.1460], t: "comer" },
        { n: "Hyde Park", c: [51.5073, -0.1657], t: "panorama" }
      ]
    },
    amsterdam: {
      nombre: "Ámsterdam", pais: "paises-bajos", c: [52.3676, 4.9041], noches: [2, 3], foto: "lugares/amsterdam.jpg", extra: true,
      intro: "Canales, museos de primer nivel y toda la ciudad en bicicleta.",
      hacer: ["Paseo en barco por los canales", "Rijksmuseum", "Museo Van Gogh (reservar)", "Casa de Ana Frank (entradas solo online)", "Arrendar bicicleta y recorrer el Jordaan y el Vondelpark", "Molinos de Zaanse Schans, a media hora"],
      comer: ["Stroopwafel recién hecho", "Bitterballen con cerveza", "Arenque (haring) en un puesto callejero", "Pannenkoeken"],
      tips: ["Las entradas a la Casa de Ana Frank se liberan semanas antes y se agotan rápido.", "Ojo al caminar: las ciclovías son de las bicicletas y no frenan."],
      sale: "Tren Ámsterdam → Bruselas · ~1 h 50 (o → París ~3 h 20)",
      lugares: [
        { n: "Rijksmuseum", c: [52.3600, 4.8852], t: "ver" },
        { n: "Museo Van Gogh", c: [52.3584, 4.8811], t: "ver" },
        { n: "Casa de Ana Frank", c: [52.3752, 4.8840], t: "ver" },
        { n: "Jordaan", c: [52.3740, 4.8800], t: "comer" },
        { n: "Mercado Albert Cuyp", c: [52.3557, 4.8945], t: "comer" },
        { n: "Vondelpark", c: [52.3580, 4.8686], t: "panorama" },
        { n: "Zaanse Schans", c: [52.4740, 4.8170], t: "panorama" }
      ]
    },
    brujas: {
      nombre: "Brujas", pais: "belgica", c: [51.2093, 3.2247], noches: [1, 1], foto: "lugares/brujas.jpg", extra: true,
      intro: "Canales, casas medievales y chocolate en cada esquina.",
      hacer: ["Subir al Campanario (366 escalones)", "Paseo en bote por los canales", "Basílica de la Santa Sangre en el Burg", "Minnewater y el beguinaje", "Gante, a 30 min en tren, o la Grand-Place de Bruselas de paso"],
      comer: ["Papas fritas belgas en el Markt", "Gofres", "Chocolate", "Moules-frites", "Cervezas trapenses"],
      tips: ["Conviene dormir en Brujas: de día se llena de excursiones y en la tarde queda tranquila."],
      sale: "Tren Brujas → Ámsterdam · ~3 h (o → París ~2 h 40 vía Bruselas)",
      lugares: [
        { n: "Campanario de Brujas", c: [51.2085, 3.2241], t: "ver" },
        { n: "Markt de Brujas", c: [51.2089, 3.2247], t: "comer" },
        { n: "Basílica de la Santa Sangre", c: [51.2079, 3.2265], t: "ver" },
        { n: "Rozenhoedkaai", c: [51.2068, 3.2272], t: "panorama" },
        { n: "Beguinaje de Brujas", c: [51.2010, 3.2235], t: "ver" },
        { n: "Minnewater", c: [51.1990, 3.2250], t: "panorama" }
      ]
    },
    munich: {
      nombre: "Múnich", pais: "alemania", c: [48.1351, 11.5820], noches: [2, 3], foto: "lugares/munich.jpg", extra: true,
      intro: "Cervecerías, plazas bávaras y la puerta a los castillos de los Alpes.",
      hacer: ["Marienplatz y el carillón del Ayuntamiento (11:00)", "Viktualienmarkt", "Cerveza en el Hofbräuhaus o en un biergarten", "Surfistas del Eisbach en el Jardín Inglés", "Residencia o Palacio de Nymphenburg", "Día a Neuschwanstein (reservar)", "Memorial de Dachau"],
      comer: ["Weißwurst con pretzel (se come antes del mediodía)", "Schweinshaxe (codillo)", "Cerveza en jarra de litro"],
      tips: ["Neuschwanstein tiene entradas con hora: comprar online. Desde Múnich son ~2 h 30 en tren y bus.", "Durante el Oktoberfest (fines de septiembre) los alojamientos suben mucho.", "El Bayern-Ticket sirve para grupos en trenes regionales de Baviera."],
      sale: "Tren Múnich → Salzburgo · ~1 h 30 (o → Praga ~5 h)",
      lugares: [
        { n: "Marienplatz", c: [48.1374, 11.5755], t: "ver" },
        { n: "Viktualienmarkt", c: [48.1351, 11.5763], t: "comer" },
        { n: "Hofbräuhaus", c: [48.1376, 11.5797], t: "comer" },
        { n: "Residencia de Múnich", c: [48.1410, 11.5788], t: "ver" },
        { n: "Jardín Inglés", c: [48.1642, 11.6056], t: "panorama" },
        { n: "Palacio de Nymphenburg", c: [48.1583, 11.5033], t: "ver" },
        { n: "Memorial de Dachau", c: [48.2700, 11.4680], t: "ver" },
        { n: "Castillo de Neuschwanstein", c: [47.5576, 10.7498], t: "panorama" }
      ]
    },
    salzburgo: {
      nombre: "Salzburgo", pais: "austria", c: [47.8095, 13.0550], noches: [1, 1], foto: "lugares/salzburgo.jpg", extra: true,
      intro: "La ciudad de Mozart, con una fortaleza mirando los Alpes.",
      hacer: ["Subir a la Fortaleza en funicular", "Casa natal de Mozart y la Getreidegasse", "Jardines de Mirabell", "Catedral de Salzburgo", "Excursión a Hallstatt"],
      comer: ["Salzburger Nockerl", "Bombones Mozartkugeln", "Cerveza en el Augustiner Bräu"],
      tips: ["Hallstatt queda a ~2 h 30 en tren y ferry o en bus, y se llena: ir temprano."],
      sale: "Tren Salzburgo → Viena · ~2 h 30 (o → Múnich ~1 h 30)",
      lugares: [
        { n: "Fortaleza de Hohensalzburg", c: [47.7949, 13.0477], t: "panorama" },
        { n: "Casa natal de Mozart", c: [47.8000, 13.0433], t: "ver" },
        { n: "Getreidegasse", c: [47.7999, 13.0425], t: "comer" },
        { n: "Catedral de Salzburgo", c: [47.7980, 13.0470], t: "ver" },
        { n: "Jardines de Mirabell", c: [47.8058, 13.0419], t: "panorama" },
        { n: "Hallstatt", c: [47.5622, 13.6493], t: "panorama" }
      ]
    },
    viena: {
      nombre: "Viena", pais: "austria", c: [48.2082, 16.3738], noches: [2, 3], foto: "lugares/viena.jpg", extra: true,
      intro: "Capital imperial: palacios, Klimt, ópera y cafés de otro siglo.",
      hacer: ["Palacio de Schönbrunn", "Catedral de San Esteban", "Hofburg", "El beso de Klimt en el Belvedere", "Entradas de pie para la Ópera", "Naschmarkt", "Noria del Prater"],
      comer: ["Wiener Schnitzel", "Sachertorte", "Apfelstrudel en un café vienés", "Salchicha en un Würstelstand"],
      tips: ["Las entradas de pie para la Ópera son muy baratas y se compran el mismo día de la función.", "Comparar el Vienna Pass con pagar cada entrada: con pocos museos no conviene."],
      sale: "Tren Viena → Praga · ~4 h (o → Salzburgo ~2 h 30)",
      lugares: [
        { n: "Palacio de Schönbrunn", c: [48.1845, 16.3122], t: "ver" },
        { n: "Catedral de San Esteban", c: [48.2085, 16.3731], t: "ver" },
        { n: "Hofburg", c: [48.2066, 16.3656], t: "ver" },
        { n: "Ópera Estatal de Viena", c: [48.2030, 16.3690], t: "ver" },
        { n: "Belvedere", c: [48.1915, 16.3809], t: "ver" },
        { n: "Naschmarkt", c: [48.1985, 16.3630], t: "comer" },
        { n: "Noria del Prater", c: [48.2166, 16.3958], t: "panorama" }
      ]
    },
    praga: {
      nombre: "Praga", pais: "chequia", c: [50.0755, 14.4378], noches: [2, 3], foto: "lugares/praga.jpg", extra: true,
      intro: "Castillo, puentes góticos y cervecerías: una de las ciudades más lindas de Europa.",
      hacer: ["Puente de Carlos temprano, antes de las multitudes", "Castillo de Praga y Catedral de San Vito", "Reloj astronómico a la hora en punto", "Barrio judío (Josefov)", "Malá Strana", "Mirador de Petřín", "Atardecer en Vyšehrad"],
      comer: ["Svíčková (carne con salsa de crema)", "Goulash con knedlíky", "Cerveza checa en una hospoda"],
      tips: ["La moneda es la corona checa (CZK), no el euro: pagar con tarjeta y evitar las casas de cambio con comisión."],
      sale: "Tren Praga → Viena · ~4 h (o → Múnich ~5 h)",
      lugares: [
        { n: "Puente de Carlos", c: [50.0865, 14.4114], t: "ver" },
        { n: "Castillo de Praga", c: [50.0909, 14.4005], t: "ver" },
        { n: "Plaza de la Ciudad Vieja", c: [50.0875, 14.4213], t: "ver" },
        { n: "Reloj astronómico de Praga", c: [50.0870, 14.4207], t: "ver" },
        { n: "Josefov", c: [50.0900, 14.4180], t: "ver" },
        { n: "Malá Strana", c: [50.0880, 14.4040], t: "comer" },
        { n: "Mirador de Petřín", c: [50.0835, 14.3950], t: "panorama" },
        { n: "Vyšehrad", c: [50.0645, 14.4180], t: "panorama" }
      ]
    },
    oporto: {
      nombre: "Oporto", pais: "portugal", c: [41.1579, -8.6291], noches: [1, 2], foto: "lugares/oporto.jpg", extra: true,
      intro: "Puentes de hierro, casas de azulejos y bodegas de vino de Oporto junto al Duero.",
      hacer: ["Cruzar el puente Don Luis I por arriba", "Bajar a la Ribeira", "Cata en las bodegas de Vila Nova de Gaia", "Librería Lello", "Azulejos de la estación de São Bento", "Torre de los Clérigos", "Excursión al valle del Duero"],
      comer: ["Francesinha", "Vino de Oporto", "Bacalhau", "Tripas à moda do Porto"],
      tips: ["La entrada a la Librería Lello se compra online y se descuenta si compran un libro."],
      sale: "Tren Oporto → Lisboa · ~3 h",
      lugares: [
        { n: "Puente Don Luis I", c: [41.1400, -8.6094], t: "panorama" },
        { n: "Ribeira", c: [41.1405, -8.6130], t: "comer" },
        { n: "Bodegas de Gaia", c: [41.1370, -8.6130], t: "comer" },
        { n: "Librería Lello", c: [41.1469, -8.6149], t: "ver" },
        { n: "Torre de los Clérigos", c: [41.1458, -8.6140], t: "ver" },
        { n: "Estación de São Bento", c: [41.1456, -8.6105], t: "ver" }
      ]
    },
    lisboa: {
      nombre: "Lisboa", pais: "portugal", c: [38.7223, -9.1393], noches: [2, 3], foto: "lugares/lisboa.jpg", extra: true,
      intro: "Siete cerros, tranvías amarillos, fado y los mejores pasteles de nata.",
      hacer: ["Tranvía 28 por Alfama y Graça", "Castillo de San Jorge", "Belém: Torre, Jerónimos y pastéis de Belém", "Plaza del Comercio", "Bairro Alto de noche, con fado", "Día en Sintra y el Palacio da Pena"],
      comer: ["Pastéis de nata", "Bacalhau", "Sardinas asadas", "Bifana", "Ginjinha"],
      tips: ["Lisboa es de cerros y adoquines: zapatos cómodos.", "El tranvía 28 se llena: subir temprano o en la cabecera.", "El Palacio da Pena tiene entradas con hora: reservar."],
      sale: "Vuelo Lisboa → Santiago (o tren → Oporto ~3 h)",
      lugares: [
        { n: "Castillo de San Jorge", c: [38.7139, -9.1335], t: "panorama" },
        { n: "Alfama", c: [38.7114, -9.1300], t: "comer" },
        { n: "Plaza del Comercio", c: [38.7075, -9.1364], t: "ver" },
        { n: "Bairro Alto", c: [38.7130, -9.1450], t: "comer" },
        { n: "Monasterio de los Jerónimos", c: [38.6979, -9.2068], t: "ver" },
        { n: "Torre de Belém", c: [38.6916, -9.2160], t: "ver" },
        { n: "Palacio da Pena", c: [38.7876, -9.3906], t: "panorama" }
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
      { id: "borgona", ciudad: "mussy", n: "Auto un día en Borgoña (Montbard → Mussy → Beaune → Dijon)", eur: 130, sinAuto: 30, sinAutoN: "tren a Les Laumes-Alésia + taxi reservado" },
      { id: "provenza", ciudad: "avignon", n: "Auto un día en Provenza (Pont du Gard y Arles)", eur: 90, sinAuto: 12, sinAutoN: "buses" }
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
    ["Mussy", "Preguntarle al abuelo qué casa o lugar quiere que veamos en las horas que estemos ahí."]
  ],

  creditos: [
    ["Portada, París al atardecer", "Alexander Kachkaev", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Panorama_from_the_Eiffel_Tower_at_the_sunset,_Paris_20_April_2013.jpg"],
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
