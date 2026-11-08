/* Lezione 3: tipi di navi. Definizioni dalle slide 2-14 della lezione 3 e dalle slide 2-18 della
   lezione 3.2 (layout esemplari). Le sagome sono schematiche, tutte costruite sullo stesso scafo comune.
   Le misure dei container sono quelle della slide 11 della lezione 3.2; la sezione della petroliera
   è schematica: le slide non danno le larghezze del doppio fondo e del doppio fianco */
(function () {
  const N = 3;
  const { COL, etichetta, maniglia, cuoci, segmento } = Tavola;

  const MISSIONI = [
    { id: 'petrolio', testo: 'Trova la nave che porta il petrolio greggio.' },
    { id: 'quattro', testo: 'Classifica una nave per ognuna delle quattro categorie.' },
    { id: 'semi', testo: 'Carica la piattaforma sulla nave semisommergibile.' },
    { id: 'quaranta', testo: 'Imbarca un container da 40 piedi: quanti TEU vale?' },
    { id: 'teu', testo: 'Arriva a 20 TEU con meno di 20 container.' },
    { id: 'doppio', testo: 'Apri una falla, con e senza doppio scafo.' },
  ];
  const QUIZ = [
    { n: 1, testo: 'Le navi mercantili si distinguono perché sono…', scelte: ['Una fonte di guadagno per una Compagnia', 'Sempre passeggeri', 'Di proprietà dello Stato'], giusta: 0, perche: 'Rappresentano una fonte di guadagno per una Compagnia normalmente privata.' },
    { n: 2, testo: 'Le bulk carrier trasportano…', scelte: ['Carico secco senza imballaggio', 'Solo petrolio', 'Animali vivi'], giusta: 0, perche: 'Carbone, minerali di ferro o granaglie.' },
    { n: 3, testo: 'Le navi da pesca sono navi…', scelte: ['Commerciali', 'Industriali', 'Di servizio'], giusta: 1, perche: 'Contribuiscono alla produzione di qualcosa, non al semplice trasporto.' },
    { n: 4, testo: 'Le bettoline servono per…', scelte: ['Il rifornimento (bunker)', 'Il pilotaggio', 'La pesca'], giusta: 0, perche: 'Provvedono alle operazioni di rifornimento.' },
    { n: 5, testo: 'Le piattaforme petrolifere amministrativamente sono…', scelte: ['Edifici', 'Navi', 'Porti'], giusta: 1, perche: 'Sono classificate come navi, anche se senza propulsione autonoma.' },
    { n: 6, testo: 'A che cosa serve una draga?', scelte: ['A rendere navigabili le acque', 'A posare cavi', 'A rompere il ghiaccio'], giusta: 0, perche: 'Anche per le navi con immersione più grande, in porto o in bassi fondali.' },
    // Lezione 3.2
    { n: 7, testo: 'Che cosa sono le boccaporte di una bulk carrier?', scelte: ['Chiusure stagne delle aperture sul ponte di coperta', 'Le stive del carico', 'Le gru di bordo'], giusta: 0, perche: 'Chiudono in navigazione le ampie aperture per immettere il carico nelle stive.' },
    { n: 8, testo: 'Versato su un piano orizzontale, un carico solido scorrevole prende la forma di…', scelte: ['uno strato piano', 'un cono', 'un cubo'], giusta: 1, perche: 'Un cono: la sua pendenza è l\'angolo di natural declivio.' },
    { n: 9, testo: 'Nel Gruppo A dell\'IMSBC Code ci sono le sostanze…', scelte: ['che possono liquefarsi oltre il Transportable Moisture Limit', 'chimiche infiammabili, radioattive o corrosive', 'non comprese negli altri gruppi'], giusta: 0, perche: 'Rame, nichel, zinco, carbone: con troppa umidità danneggiano la stabilità trasversale.' },
    { n: 10, testo: 'Che cosa trasporta una ore carrier?', scelte: ['Solo minerali alla rinfusa', 'Legname sfuso', 'Cemento'], giusta: 0, perche: 'Il legname va sulle timber carrier, il cemento sulle cement carrier.' },
    { n: 11, testo: 'Che cosa trasporta una product oil tanker?', scelte: ['Petrolio greggio', 'Prodotti della raffinazione', 'Gas liquefatto'], giusta: 1, perche: 'Il greggio viaggia sulle crude oil tanker.' },
    { n: 12, testo: 'Doppio fondo e doppio fianco insieme costituiscono…', scelte: ['il ponte di coperta', 'le boccaporte', 'il doppio scafo'], giusta: 2, perche: 'Separano fondo e fianchi delle stive dal fasciame esterno.' },
    { n: 13, testo: 'In che cosa si misura la capacità di una portacontainer?', scelte: ['In TEU', 'In metri lineari', 'In metri cubi di stiva'], giusta: 0, perche: 'Twenty-foot Equivalent Unit: il numero massimo di container da 20 piedi.' },
    { n: 14, testo: 'Nell\'IBC Code, la categoria X comprende le sostanze…', scelte: ['a basso rischio', 'senza requisiti particolari', 'a elevato rischio'], giusta: 2, perche: 'X elevato, Y moderato, Z basso; OS senza requisiti particolari.' },
    { n: 15, testo: 'Come si valuta la capacità di una nave traghetto ro-ro pax?', scelte: ['Passeggeri e metri lineari di veicoli', 'TEU', 'Tonnellate di greggio'], giusta: 0, perche: 'Numero massimo di passeggeri e metri lineari dei ponti garage.' },
    { n: 16, testo: 'Rispetto a una RORO, un ferry…', scelte: ['porta soprattutto passeggeri su rotte brevi', 'porta solo veicoli', 'fa rotte internazionali lunghe'], giusta: 0, perche: 'La RORO punta sulla capacità di veicoli, il ferry sui passeggeri.' },
  ];
  const CALCOLI = [
    { n: 21, testo: 'Un 20\' heavy tested container pesa 2400 kg vuoto e trasporta fino a 28 080 kg. Quanto pesa al massimo, pieno?', campi: [['Peso', 30480, 0, 'kg']], soluzione: '2400 + 28 080 = 30 480 kg' },
    { n: 22, testo: 'A bordo ci sono 10 container da 40 piedi e 6 da 20 piedi. Quanti TEU sono?', campi: [['Capacità', 26, 0, 'TEU']], soluzione: 'Un 40 piedi vale 2 TEU: 10 · 2 + 6 = 26 TEU' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ, calcoli: CALCOLI });

  const BIANCO = '#F4F0E6'; const GRIGIO = '#5B6B7C'; const VETRO = '#1F2A37'; const BLU = '#13315C'; const ORO = '#C9A227'; const ROSSO = '#B3362B';
  const cassa = (g, x0, x1, y0, y1, z0, z1, col) => {
    const m = new THREE.Mesh(cuoci(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), col), new THREE.MeshBasicMaterial({ vertexColors: true }));
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); g.add(m);
    return m;
  };
  const tuga = (g, x0, x1, alto) => { cassa(g, x0, x1, 8, alto, -5.5, 5.5, BIANCO); cassa(g, x0 + 0.5, x1 - 0.5, alto - 1.8, alto - 0.9, -5.55, 5.55, VETRO); };
  const torre = (g, x, y0, y1, r) => {
    [[-r, -r], [r, -r], [r, r], [-r, r]].forEach(([a, b]) => g.add(segmento(new THREE.Vector3(x + a, y0, b), new THREE.Vector3(x + a / 5, y1, b / 5), 0.2, COL.ocra)));
    for (let t = 0.2; t < 1; t += 0.2) { const q = r * (1 - 0.8 * t); const y = y0 + t * (y1 - y0); g.add(segmento(new THREE.Vector3(x - q, y, 0), new THREE.Vector3(x + q, y, 0), 0.12, COL.ocra)); }
  };
  function piattaforma(g, y = 0) {
    [[-16, -12], [16, -12], [-16, 12], [16, 12]].forEach(([x, z]) => cassa(g, x - 2.5, x + 2.5, y, y + 18, z - 2.5, z + 2.5, ORO));
    cassa(g, -22, 22, y + 18, y + 22, -16, 16, GRIGIO);
    cassa(g, -18, -4, y + 22, y + 26, -12, 12, BIANCO);
    torre(g, 12, y + 22, y + 42, 5);
  }

  // Slide 3-14. fa: sovrastrutture sullo scafo comune; sc: scala dello scafo; piena: niente scafo
  const TIPI = [
    { nome: 'Nave da crociera', en: 'cruise vessel', cat: 'c', t: 'Luogo di vacanza per viaggi solitamente circolari.', fa(g) { cassa(g, 8, 84, 8, 14, -6, 6, BIANCO); cassa(g, 8, 84, 10, 10.8, -6.05, 6.05, VETRO); cassa(g, 8, 84, 12, 12.8, -6.05, 6.05, VETRO); cassa(g, 14, 78, 14, 19, -5.5, 5.5, BIANCO); cassa(g, 14, 78, 16, 16.8, -5.55, 5.55, VETRO); cassa(g, 22, 68, 19, 23, -4.5, 4.5, BIANCO); cassa(g, 28, 36, 23, 28, -1.5, 1.5, BLU); } },
    { nome: 'Nave traghetto', en: 'ferry/ro-ro pax', cat: 'c', t: 'Tratte brevi: passeggeri, anche con auto al seguito, e mezzi rotabili.', fa(g) { cassa(g, 4, 80, 8, 13, -6, 6, BIANCO); cassa(g, 22, 62, 13, 17, -5, 5, BIANCO); cassa(g, 22, 62, 14.8, 15.6, -5.05, 5.05, VETRO); cassa(g, -4, 3, 7, 8, -3, 3, ORO); } },
    { nome: 'Portacontainer', en: 'container carrier', cat: 'c', t: 'Unità di carico con misure standard, facili da trasferire su altri mezzi.', fa(g) { tuga(g, 6, 15, 19); ['#B3362B', '#C9A227', GRIGIO, '#2F7A55', BLU, '#B3362B', '#C9A227'].forEach((c, i) => { cassa(g, 19 + i * 8.6, 27 + i * 8.6, 8, 12 + (i % 3) * 2, -5.4, 5.4, c); }); } },
    { nome: 'General cargo', en: 'multipurpose', cat: 'c', t: 'Estremamente versatile, per una grande varietà di merci generiche.', fa(g) { tuga(g, 6, 15, 15); [24, 42, 60].forEach((x) => { cassa(g, x, x + 12, 7.3, 8.6, -4.5, 4.5, GRIGIO); g.add(segmento(new THREE.Vector3(x - 2, 7.2, 0), new THREE.Vector3(x - 2, 16, 0), 0.25, COL.ocra), segmento(new THREE.Vector3(x - 2, 9, 0), new THREE.Vector3(x + 8, 14, 0), 0.14, COL.ocra)); }); } },
    { nome: 'Porta rinfuse', en: 'bulk carrier', cat: 'c', t: 'Carico secco senza imballaggio: carbone, minerali di ferro, granaglie.', fa(g) { tuga(g, 6, 16, 16); for (let i = 0; i < 6; i++) cassa(g, 22 + i * 10, 30 + i * 10, 7.3, 8.8, -4.8, 4.8, GRIGIO); } },
    { nome: 'Petroliera', en: 'oil tanker', cat: 'c', chiave: 'petrolio', t: 'Nave cisterna per il carico liquido: il petrolio.', fa(g) { tuga(g, 6, 16, 16); g.add(segmento(new THREE.Vector3(18, 8, 0), new THREE.Vector3(82, 8, 0), 0.5, 0xB3362B)); [-2.5, 2.5].forEach((z) => g.add(segmento(new THREE.Vector3(18, 7.9, z), new THREE.Vector3(82, 7.9, z), 0.22, 0xC9A227))); cassa(g, 46, 52, 7.4, 9.4, -6, 6, ORO); } },
    { nome: 'Nave per gas liquefatto', en: 'gas carrier', cat: 'c', t: 'Nave cisterna per il gas liquefatto.', fa(g) { tuga(g, 6, 15, 15); [28, 44, 60, 76].forEach((x) => { const m = new THREE.Mesh(cuoci(new THREE.SphereGeometry(1, 20, 12), BIANCO), new THREE.MeshBasicMaterial({ vertexColors: true })); m.scale.set(7, 5, 5.4); m.position.set(x, 8.2, 0); g.add(m); }); } },
    { nome: 'Car carrier', en: 'RO-RO solo cargo', cat: 'c', t: 'Auto nuove, dal mercato di produzione a quello di vendita.', fa(g) { cassa(g, 2, 86, 8, 20, -6, 6, BIANCO); cassa(g, 72, 80, 20, 22, -5, 5, VETRO); } },
    { nome: 'Nave da pesca', en: 'fishing vessel', cat: 'i', sc: 0.42, t: 'Contribuisce alla produzione, non al semplice trasporto.', fa(g) { tuga(g, 55, 75, 17); g.add(segmento(new THREE.Vector3(14, 7.4, -5), new THREE.Vector3(14, 19, 0), 0.5, 0xC9A227), segmento(new THREE.Vector3(14, 7.4, 5), new THREE.Vector3(14, 19, 0), 0.5, 0xC9A227)); } },
    { nome: 'Piattaforma petrolifera', en: 'offshore', cat: 'i', piena: true, t: 'Amministrativamente è una nave, anche senza propulsione autonoma.', fa(g) { const p = new THREE.Group(); p.position.set(45, 0, 0); piattaforma(p); g.add(p); } },
    { nome: 'Rimorchiatore', en: 'tug', cat: 's', sc: 0.34, t: 'Coadiuva la manovra delle navi.', fa(g) { cassa(g, 52, 76, 8, 13, -5.5, 5.5, BIANCO); tuga(g, 58, 72, 18); cassa(g, 14, 20, 8, 10, -2, 2, ORO); } },
    { nome: 'Bettolina', en: 'harbour tanker', cat: 's', sc: 0.42, t: 'Provvede alle operazioni di rifornimento (bunker).', fa(g) { tuga(g, 4, 18, 15); cassa(g, 24, 80, 8, 10, -5, 5, ROSSO); } },
    { nome: 'Chiatta', en: 'barge', cat: 's', piena: true, t: 'Fondo piatto, forma a scatola, senza sovrastrutture né propulsione.', fa(g) { cassa(g, 10, 80, -3, 3, -9, 9, GRIGIO); cassa(g, 10, 80, 3, 3.3, -9, 9, ROSSO); } },
    { nome: 'Pilotina', en: 'pilot vessel', cat: 's', sc: 0.24, t: 'Un servizio portuale: porta il pilota.', fa(g) { tuga(g, 40, 70, 16); } },
    { nome: 'Draga', en: 'dredge', cat: 'x', sc: 0.62, t: 'Rende le acque navigabili, in porto o in bassi fondali.', fa(g) { tuga(g, 6, 20, 16); cassa(g, 30, 74, 8, 12, -4, 4, GRIGIO); g.add(segmento(new THREE.Vector3(36, 8, 7), new THREE.Vector3(70, 0, 7), 0.8, 0xC9A227)); } },
    { nome: 'Posacavi', en: 'cable-laying ship', cat: 'x', sc: 0.78, t: 'Installa linee elettriche sottomarine.', fa(g) { tuga(g, 50, 72, 18); const d = new THREE.Mesh(cuoci(new THREE.CylinderGeometry(6, 6, 7, 24), ORO), new THREE.MeshBasicMaterial({ vertexColors: true })); d.rotation.x = Math.PI / 2; d.position.set(22, 14, 0); g.add(d); } },
    { nome: 'Rompighiaccio', en: 'icebreaker', cat: 'x', sc: 0.7, t: 'Una delle navi speciali, molto avanzate tecnologicamente.', fa(g) { cassa(g, 8, 62, 8, 14, -6, 6, ROSSO); tuga(g, 14, 50, 20); cassa(g, 26, 30, 20, 26, -2, 2, BIANCO); } },
    { nome: 'Nave oceanografica', en: 'oceanographic ship', cat: 'x', sc: 0.62, t: 'Per motivi di ricerca in ambito marino.', fa(g) { tuga(g, 34, 74, 18); g.add(segmento(new THREE.Vector3(8, 7.4, -6), new THREE.Vector3(2, 15, -6), 0.4, 0xC9A227), segmento(new THREE.Vector3(8, 7.4, 6), new THREE.Vector3(2, 15, 6), 0.4, 0xC9A227), segmento(new THREE.Vector3(2, 15, -6), new THREE.Vector3(2, 15, 6), 0.4, 0xC9A227)); } },
    { nome: 'Drillship', en: 'drillship', cat: 'x', t: 'Trivella il fondale per individuare i giacimenti.', fa(g) { tuga(g, 66, 80, 18); cassa(g, 36, 54, 8, 11, -5.5, 5.5, GRIGIO); torre(g, 45, 11, 34, 6); } },
  ];
  const CATEGORIE = { c: 'Commerciali', i: 'Industriali', s: 'Di servizio', x: 'Speciali' };
  const st = { i: 0, resto: 0, esito: null, risposte: {}, azzecca: new Set(), copie: [] };

  function posaGalleria() {
    const t = TIPI[st.i];
    st.copie.forEach((c) => {
      c.ponti.forEach((d, i) => { d.visible = i === st.i; });
      c.scafo.visible = !t.piena;
      const s = t.sc || 1;
      c.gruppo.scale.setScalar(s); c.gruppo.position.set(45 * (1 - s), -6 * s, 0);
      c.nomi.forEach((e, i) => { e.visible = i === st.i; });
    });
    if (t.chiave) lez.completa(t.chiave);
  }
  function cambia(d) { st.i = (st.i + d + TIPI.length) % TIPI.length; st.esito = null; posaGalleria(); }
  const creaGalleria = Lezione.simula({
    scala: 0.0115, centro: [45, 2], k: 3, pedana: [45, 44, 'a dritta'], dopo: posaGalleria,
    vista: () => ({ target: new THREE.Vector3(45, 4, 0), theta: 0.42, phi: 1.28, r: 124 }),
    modello(k, tocca) {
      const g = new THREE.Group(); const gruppo = new THREE.Group(); g.add(gruppo);
      const scafo = Scafo.crea(k, true); gruppo.add(scafo);
      const ponti = TIPI.map((t) => { const d = new THREE.Group(); t.fa(d); d.visible = false; gruppo.add(d); return d; });
      const nomi = TIPI.map((t) => { const e = etichetta(t.nome, 3 + k, '#FBFAF4'); e.position.set(45, 34, 0); g.add(e); return e; });
      st.copie.push({ scafo, gruppo, ponti, nomi });
      return g;
    },
  });
  function comandiGalleria(id) {
    if (id === 'g+') cambia(1);
    if (id === 'g-') cambia(-1);
    if (id.startsWith('c:')) {
      const t = TIPI[st.i]; const scelta = id.slice(2);
      if (scelta === t.cat) {
        st.esito = { tipo: 'giusto', testo: `${t.nome}: nave ${CATEGORIE[t.cat].toLowerCase()}.` };
        st.azzecca.add(t.cat);
        if (st.azzecca.size === 4) lez.completa('quattro');
      } else st.esito = { tipo: 'errato', testo: 'Non è questa categoria: rileggi la frase.' };
    }
    Motore.sporco();
  }

  /* Seconda simulazione: la nave semisommergibile carica una piattaforma (slide 14) --------------- */
  const se = { imm: 0, z: 34, a: false, copie: [] }; const MAX = 12;
  function posaSemi() {
    const dy = -se.imm * MAX; const a = se.z < 3;
    se.copie.forEach((c) => {
      c.nave.position.y = dy - 6;
      // A bordo la piattaforma sale e scende con la nave; prima galleggia
      c.carico.position.set(45, a ? dy + 2 : -10, se.z);
      c.pImm.position.set(82, 18 + dy, 0); c.pZ.position.set(45, 30 + (a ? dy + 14 : 0), se.z);
    });
  }
  const creaSemi = Lezione.simula({
    scala: 0.009, centro: [45, 2], k: 3, pedana: [45, 62, 'al largo'], dopo: posaSemi,
    vista: () => ({ target: new THREE.Vector3(45, 6, 8), theta: 0.5, phi: 1.26, r: 150 }),
    modello(k, tocca) {
      const g = new THREE.Group();
      const nave = new THREE.Group(); nave.add(Scafo.crea(k, true)); tuga(nave, 76, 86, 16); g.add(nave);
      const carico = new THREE.Group(); carico.scale.setScalar(0.72); piattaforma(carico); g.add(carico);
      const pImm = maniglia(2 + k * 0.4, 'imm'); const pZ = maniglia(2 + k * 0.4, 'zeta'); g.add(pImm, pZ); tocca(pImm); tocca(pZ);
      pImm.userData.vincolo = { asse: [0, 1, 0] }; pZ.userData.vincolo = { asse: [0, 0, 1] }; // la nave scende, la piattaforma scorre sopra
      se.copie.push({ nave, carico, pImm, pZ });
      return g;
    },
    trascina(id, dx, dy, info) {
      const eraA = se.z < 3; const prima = `${Math.round(se.imm * 4)}|${eraA}`;
      const giu = info ? -info.s / MAX : dy * 0.004; const dz = info ? info.s : dx * 0.1;
      if (id === 'imm') se.imm = Math.max(0, Math.min(1, se.imm + giu));
      // La piattaforma entra sopra la coperta solo con la nave affondata
      if (id === 'zeta' && (se.imm > 0.75 || se.z < 3)) se.z = Math.max(0, Math.min(34, se.z + dz));
      if (id === 'zeta' && se.imm <= 0.75 && !eraA) se.z = Math.max(16, Math.min(34, se.z + dz));
      posaSemi();
      if (se.z < 3 && se.imm < 0.08) lez.completa('semi');
      if (`${Math.round(se.imm * 4)}|${se.z < 3}` !== prima) Motore.ridisegna();
    },
  });
  function faseSemi() {
    if (se.z < 3) return se.imm < 0.08 ? 'La nave è risalita con il carico.' : 'Ora fai risalire la nave.';
    return se.imm > 0.75 ? 'Coperta sott\'acqua: porta la piattaforma sopra la nave.' : 'Abbassa la nave: la coperta deve andare sott\'acqua.';
  }

  /* Terza simulazione: la draga (slide 13) ---------------------------------------------------------- */
  const dr = { fondo: 4.5, x: -60, copie: [] }; const T = 6;
  function posaDraga() {
    dr.copie.forEach((c) => {
      c.fondale.position.y = -dr.fondo - 5; c.nave.position.x = dr.x; c.presa.position.y = -dr.fondo + 9;
    });
  }
  const creaDraga = Lezione.simula({
    scala: 0.0072, centro: [10, 0], k: 3, mare: false, pedana: [10, 60, 'davanti alla sezione'], dopo: posaDraga,
    vista: () => ({ target: new THREE.Vector3(14, -2, 0), theta: 0, phi: 1.54, r: 172 }),
    modello(k, tocca) {
      const g = new THREE.Group();
      // Sezione: l'acqua è una lastra trasparente, così si vede il fondale sotto la nave
      const acqua = new THREE.Mesh(new THREE.BoxGeometry(240, 22, 40), new THREE.MeshBasicMaterial({ color: COL.acqua, transparent: true, opacity: 0.3, depthWrite: false }));
      acqua.position.set(40, -11, 0); g.add(acqua);
      const prima = new THREE.Mesh(cuoci(new THREE.BoxGeometry(120, 10, 40), '#D9CFB5'), new THREE.MeshBasicMaterial({ vertexColors: true })); prima.position.set(70, -7.5, 0); g.add(prima);
      const fondale = new THREE.Mesh(cuoci(new THREE.BoxGeometry(120, 10, 40), '#C9B98E'), new THREE.MeshBasicMaterial({ vertexColors: true })); g.add(fondale);
      prima.position.set(-70, -24, 0);
      fondale.position.x = 40;
      const nave = new THREE.Group(); const sc = Scafo.crea(k); sc.scale.setScalar(0.8); sc.position.set(-36, -T, 0); nave.add(sc); g.add(nave);
      const presa = maniglia(2.4 + k * 0.5, 'fondo'); presa.position.set(40, 6, 16); g.add(presa); tocca(presa);
      presa.userData.vincolo = { asse: [0, 1, 0] }; // la sfera scende col fondale
      const e = etichetta('fondale da dragare', 4 + k, '#FBFAF4'); e.position.set(40, 14, 16); g.add(e);
      dr.copie.push({ fondale, nave, presa });
      return g;
    },
    trascina(id, dx, dy, info) {
      const prima = dr.fondo > T;
      dr.fondo = Math.max(4.5, Math.min(11, dr.fondo + (info ? -info.s : dy * 0.02)));
      posaDraga();
      if ((dr.fondo > T) !== prima) Motore.ridisegna();
    },
    frame(dt) {
      const meta = dr.fondo > T ? 60 : -60;
      if (Math.abs(dr.x - meta) < 0.2) return false;
      dr.x += Math.sign(meta - dr.x) * Math.min(Math.abs(meta - dr.x), dt * 14);
      posaDraga();
      return true;
    },
  });

  /* Quarta simulazione: carico di una portacontainer, misure dalla slide 11 della lezione 3.2 ------- */
  const CT = { L20: 6.058, L40: 12.191, W: 2.438, H: 2.591 };
  const BAIE = 7; const FILE = 5; const STRATI = 2; const BX = 20.5; const PB = 6.36; const BY = 7.8;
  const TINTE_CT = ['#B3362B', '#C9A227', '#2F7A55', '#13315C', '#5B6B7C'];
  const geoCT = {};
  const forma = (lungo, i) => { const k = `${lungo}${i % TINTE_CT.length}`; return geoCT[k] || (geoCT[k] = cuoci(new THREE.BoxGeometry(lungo, CT.H, CT.W), TINTE_CT[i % TINTE_CT.length])); };
  const ct = { posti: [], n20: 0, n40: 0, ultimo: null, copie: [] };
  const libero = (t, r, b) => !ct.posti.some((x) => x.t === t && x.r === r && (x.b === b || (x.l && x.b + 1 === b)));
  function imbarca(quaranta) {
    for (let t = 0; t < STRATI; t++) {
      for (let b = 0; b < BAIE - (quaranta ? 1 : 0); b += quaranta ? 2 : 1) {
        for (let r = 0; r < FILE; r++) {
          if (libero(t, r, b) && (!quaranta || libero(t, r, b + 1))) { ct.posti.push({ t, r, b, l: quaranta }); return true; }
        }
      }
    }
    return false;
  }
  const teu = () => ct.n20 + 2 * ct.n40;
  function posaContainer() {
    ct.copie.forEach((c) => {
      while (c.pila.children.length) c.pila.remove(c.pila.children[0]);
      ct.posti.forEach((x, i) => {
        const lungo = x.l ? CT.L40 : CT.L20;
        const m = new THREE.Mesh(forma(lungo, i), new THREE.MeshBasicMaterial({ vertexColors: true }));
        m.position.set(BX + x.b * PB + (x.l ? PB + CT.L20 : CT.L20) / 2, BY + x.t * CT.H + CT.H / 2, (x.r - (FILE - 1) / 2) * (CT.W + 0.1));
        c.pila.add(m);
      });
    });
  }
  const creaContainer = Lezione.simula({
    scala: 0.0115, centro: [45, 4], k: 3, pedana: [45, 40, 'a dritta'], dopo: posaContainer,
    vista: () => ({ target: new THREE.Vector3(46, 3, 0), theta: 0.5, phi: 1.12, r: 112 }),
    modello(k) {
      const g = new THREE.Group(); const nave = new THREE.Group(); nave.position.y = -6; g.add(nave);
      nave.add(Scafo.crea(k, true)); tuga(nave, 4, 15, 19);
      cassa(nave, BX - 0.3, BX + BAIE * PB, 6.9, BY, -6.5, 6.5, GRIGIO);
      const pila = new THREE.Group(); nave.add(pila);
      ct.copie.push({ pila });
      return g;
    },
  });
  function comandiContainer(id) {
    if (id === 'ct:svuota') { ct.posti = []; ct.n20 = 0; ct.n40 = 0; ct.ultimo = null; }
    if (id === 'ct:20' || id === 'ct:40') {
      const q = id === 'ct:40';
      if (imbarca(q)) { if (q) ct.n40++; else ct.n20++; ct.ultimo = q ? 40 : 20; if (q) lez.completa('quaranta'); } else ct.ultimo = 'pieno';
      if (teu() === 20 && ct.n20 + ct.n40 < 20) lez.completa('teu');
    }
    posaContainer(); Motore.sporco();
  }
  function schedaContainer() {
    if (ct.ultimo === 'pieno') return 'Non c\'è più posto per questo container: prova con l\'altro, oppure svuota.';
    if (ct.ultimo === 40) return 'Un 40 piedi è lungo come due 20 piedi: vale **2 TEU**.';
    if (ct.ultimo === 20) return 'Un 20 piedi vale **1 TEU**: è l\'unità di misura della capacità. {{lezione 3.2, slide 12}}';
    return 'La coperta è vuota. Imbarca i container.';
  }

  /* Quinta simulazione: sezione di una petroliera, con e senza doppio scafo (slide 8 della lezione 3.2) */
  const tk = { doppio: true, falla: false, provate: new Set(), copie: [] };
  const LUNGO = 14; const ACQ = 10;
  function posaPetroliera() {
    const d = tk.doppio;
    tk.copie.forEach((c) => {
      c.interno.forEach((m) => { m.visible = d; });
      // Le cisterne arrivano al fasciame se manca il doppio scafo
      const zi = d ? 12.2 : 14.4; const yi = d ? 3 : 0.6;
      c.carico.forEach((m, i) => { m.scale.set(LUNGO - 0.4, 15 - yi, zi - 0.2); m.position.set(0, (15 + yi) / 2, (i ? -1 : 1) * (zi + 0.2) / 2); });
      c.paratia.scale.y = 17.4 - yi; c.paratia.position.y = (17.4 + yi) / 2;
      c.foro.visible = tk.falla; c.acqua.visible = tk.falla && d; c.chiazza.visible = tk.falla && !d;
      c.nomi.forEach((e) => { e.visible = d; });
    });
  }
  const creaPetroliera = Lezione.simula({
    scala: 0.016, centro: [0, -1], k: 3, mare: false, pedana: [30, 30, 'davanti alla sezione'], dopo: posaPetroliera,
    vista: () => ({ target: new THREE.Vector3(0, -2, 2), theta: 1.12, phi: 1.36, r: 78 }),
    modello(k) {
      const g = new THREE.Group(); const s = new THREE.Group(); s.position.y = -ACQ; g.add(s);
      const blocco = (col, op) => { const m = new THREE.Mesh(op ? new THREE.BoxGeometry(1, 1, 1) : cuoci(new THREE.BoxGeometry(1, 1, 1), col), op ? new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false }) : new THREE.MeshBasicMaterial({ vertexColors: true })); s.add(m); return m; };
      const lastra = (col, x0, x1, y0, y1, z0, z1, op) => { const m = blocco(col, op); m.scale.set(x1 - x0, y1 - y0, z1 - z0); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return m; };
      const H = LUNGO / 2;
      // Fasciame esterno e coperta
      lastra('#9C3324', -H, H, 0, 0.6, -15, 15); [-1, 1].forEach((l) => lastra(l > 0 ? '#9C3324' : '#7A2E26', -H, H, 0, 18, l * 14.4, l * 15));
      lastra('#B3362B', -H, H, 17.4, 18, -15, 15);
      // Doppio fondo e doppio fianco: le lamiere interne
      const interno = [lastra('#9FA9B5', -H, H, 2.6, 3, -14.4, 14.4)];
      [-1, 1].forEach((l) => interno.push(lastra('#9FA9B5', -H, H, 3, 17.4, l * 12.2, l * 12.6)));
      for (let z = -12; z <= 12; z += 4) interno.push(lastra('#9FA9B5', -H, H, 0.6, 2.6, z - 0.1, z + 0.1));
      const paratia = lastra('#9FA9B5', -H, H, 0, 1, -0.2, 0.2);
      const carico = [blocco('#2A1A14'), blocco('#2A1A14')];
      const foro = lastra('#F4F0E6', -2, 2, 5, 7, 14.3, 15.1);
      const acqua = lastra(COL.acqua, -H + 0.2, H - 0.2, 3, ACQ, 12.6, 14.4, 0.75);
      const chiazza = lastra('#2A1A14', -9, 9, 3, ACQ - 0.05, 15.2, 26, 0.6);
      // Il mare intorno, trasparente per vedere la sezione
      lastra(COL.acqua, -30, 30, -4, ACQ, -45, 45, 0.18);
      const dim = 2.6 + k * 0.6;
      const e1 = etichetta('doppio fianco', dim, '#0B2545'); e1.position.set(H + 1, 21, 12); s.add(e1);
      const e2 = etichetta('doppio fondo', dim, '#0B2545'); e2.position.set(H + 1, -2.4, -6); s.add(e2);
      const e3 = etichetta('cisterna del carico', dim, '#FBFAF4'); e3.position.set(H + 1, 11, -6.5); e3.material.depthTest = false; e3.renderOrder = 10; s.add(e3);
      tk.copie.push({ interno, paratia, carico, foro, acqua, chiazza, nomi: [e1, e2] });
      return g;
    },
  });
  function comandiPetroliera(id) {
    if (id === 'tk:doppio') { tk.doppio = !tk.doppio; tk.falla = false; }
    if (id === 'tk:falla') { tk.falla = !tk.falla; if (tk.falla) tk.provate.add(tk.doppio); if (tk.provate.size === 2) lez.completa('doppio'); }
    posaPetroliera(); Motore.sporco();
  }
  function schedaPetroliera() {
    if (!tk.falla) return { colore: '#5B6B7C', testo: tk.doppio ? 'Fondo e fianchi delle cisterne sono separati dal fasciame: è il **doppio scafo**. {{lezione 3.2, slide 8}}' : 'Senza doppio scafo le cisterne del carico sono a contatto con il fasciame.' };
    return tk.doppio
      ? { colore: '#2F7A55', testo: 'La falla nel fasciame raggiunge solo l\'intercapedine del doppio fianco: entra acqua, il carico resta nella cisterna.' }
      : { colore: '#B3362B', testo: 'La falla apre direttamente la cisterna: il carico esce in mare.' };
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { b: 'La bulk carrier', o: 'La oil tanker', c: 'La portacontainer' };
    const t = TIPI[st.i];
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Le navi mercantili' },
          { t: 'p', testo: 'Sono impegnate nel normale trasporto di merci e passeggeri, o attrezzate per attività e lavori specifici. {{slide 2}}' },
          { t: 'p', testo: 'Si distinguono da navi militari e imbarcazioni da diporto perché sono una fonte di guadagno per una Compagnia normalmente privata. {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Quattro categorie' },
          { t: 'tabella', col: [30, 70], size: 34, righe: [
            ['Navi', 'A che cosa servono'],
            ['Commerciali', 'trasporto di merci e/o passeggeri'],
            ['Industriali', 'contribuiscono alla produzione di qualcosa'],
            ['Di servizio', 'attività utili alle altre navi'],
            ['Speciali', 'attività particolari, tecnologia avanzata'],
          ] },
          { t: 'nota', testo: 'slide 3, 9, 10, 13' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'Ogni nave è specializzata per il suo carico: la forma della coperta lo racconta.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Quale nave porta il petrolio greggio?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:b', testo: 'La bulk carrier', on: p === 'b' },
          { t: 'scelta', id: 'p:o', testo: 'La oil tanker', on: p === 'o' },
          { t: 'scelta', id: 'p:c', testo: 'La portacontainer', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaGalleria, azione: comandiGalleria, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'passo', id: 'g', nome: `Nave ${st.i + 1} di ${TIPI.length}`, valore: t.nome },
          { t: 'riquadro', size: 36, testo: `*${t.en}*. ${t.t}` },
          { t: 'sotto', testo: 'Di quale categoria è?' },
          { t: 'bottoni', h: 80, size: 32, lista: ['c', 'i'].map((k) => ({ id: `c:${k}`, testo: CATEGORIE[k] })) },
          { t: 'bottoni', h: 80, size: 32, lista: ['s', 'x'].map((k) => ({ id: `c:${k}`, testo: CATEGORIE[k] })) },
          ...(st.esito ? [{ t: 'esito', ...st.esito }] : []),
          ...lez.missioni().slice(0, 2),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Le frecce cambiano nave. Sagome schematiche sullo stesso scafo: scale e forme non sono misure.' },
        ],
      },
      {
        passo: 2, mondo: creaSemi, richiede: () => lez.fatte.has('petrolio'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Caricare una piattaforma' },
          { t: 'p', size: 38, testo: 'Le navi semisommergibili (*semi-submersible heavy-lift ship*) caricano elementi mastodontici, come piattaforme petrolifere intere. {{slide 14}}' },
          { t: 'riquadro', size: 38, testo: faseSemi() },
          ...lez.missioni().slice(2, 3),
          { t: 'nota', testo: 'Sfera a prua: giù e su affonda e solleva la nave. Sfera sulla piattaforma: di lato la porti sulla coperta.' },
        ],
        dx: Lezione.finestra(760),
      },
      {
        passo: 2, mondo: creaContainer, azione: comandiContainer, richiede: () => lez.fatte.has('semi'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Caricare i container' },
          { t: 'p', size: 34, testo: 'Le portacontainer (*containership*) trasportano merci varie dentro unità modulari, i **container**. {{lezione 3.2, slide 9}}' },
          { t: 'bottoni', h: 80, size: 32, lista: [{ id: 'ct:20', testo: '+ 20 piedi' }, { id: 'ct:40', testo: '+ 40 piedi' }, { id: 'ct:svuota', testo: 'Svuota' }] },
          { t: 'formula', testo: `${ct.n20} da 20'  ·  ${ct.n40} da 40'  ·  ${teu()} TEU` },
          { t: 'riquadro', size: 32, testo: schedaContainer() },
          ...lez.missioni().slice(3, 5),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Container in scala: 6,058 m e 12,191 m di lunghezza, 2,438 m di larghezza, 2,591 m di altezza (lezione 3.2, slide 11). La nave è lo scafo comune, schematico.' },
        ],
      },
      {
        passo: 2, mondo: creaPetroliera, azione: comandiPetroliera, richiede: () => lez.fatte.has('quaranta') && lez.fatte.has('teu'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Il doppio scafo' },
          { t: 'p', size: 34, testo: 'Sezione di una petroliera (*oil tanker*): due cisterne del carico, divise da una paratia al centro. {{lezione 3.2, slide 8}}' },
          { t: 'bottoni', h: 80, size: 32, lista: [{ id: 'tk:doppio', testo: tk.doppio ? 'Doppio scafo: sì' : 'Doppio scafo: no', on: tk.doppio }, { id: 'tk:falla', testo: tk.falla ? 'Ripara la falla' : 'Apri una falla', on: tk.falla }] },
          (() => { const s = schedaPetroliera(); return { t: 'riquadro', size: 32, colore: s.colore, testo: s.testo }; })(),
          ...lez.missioni().slice(5),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Sezione schematica: le slide non danno le larghezze del doppio fondo e del doppio fianco.' },
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'o' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Il petrolio è un carico liquido: viaggia in una nave cisterna, non in una porta rinfuse.' },
        ],
        dx: [
          { t: 'titolo', testo: 'Senza imballaggio' },
          { t: 'tabella', col: [46, 54], size: 32, righe: [
            ['Nave', 'Carico'],
            ['Bulk carrier', 'carbone, minerali di ferro, granaglie'],
            ['Oil tanker', 'petrolio'],
            ['Product carrier', 'prodotti raffinati'],
            ['Gas carrier', 'gas liquefatto'],
            ['Chemical tanker', 'prodotti chimici'],
          ] },
          { t: 'nota', testo: 'slide 7' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Navi commerciali' },
          { t: 'p', size: 38, testo: 'Le **navi da crociera** sono luogo di vacanza; le **navi traghetto** servono tratte brevi. {{slide 3}}' },
          { t: 'p', size: 38, testo: 'Le **portacontainer** trasportano unità di carico con misure standard: facili da trasferire su altri mezzi. {{slide 5}}' },
          { t: 'p', size: 38, testo: 'Le **general cargo** sono versatili, ma piuttosto superate dalla specializzazione merceologica. {{slide 5, 6}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Navi di servizio' },
          { t: 'p', size: 38, testo: 'Servizi portuali: **rimorchiatori** (*tug*), **bettoline** (*harbour tanker*), **pilotine** (*pilot vessel*), **chiatte** (*barge*). {{slide 10, 11}}' },
          { t: 'p', size: 38, testo: 'In ambito oceanico: i *supply vessel*, con sigle come PSV, OSV e AHTS. {{slide 12}}' },
          { t: 'nota', testo: 'Il rimorchiatore della lezione 2 è tra le navi speciali perché il suo scopo non è il trasporto; qui la categoria è più precisa.' },
        ],
      },
      {
        passo: 3, mondo: creaDraga,
        sx: [
          { t: 'titolo', testo: 'La draga' },
          { t: 'p', size: 38, testo: 'Le draghe (*dredge*), in porto o in bassi fondali, rendono le acque navigabili anche per le navi con immersione più grande. {{slide 13}}' },
          { t: 'riquadro', size: 38, testo: dr.fondo > T ? 'Fondale abbastanza profondo: la nave passa.' : 'La nave si ferma: il fondale è più basso della sua immersione.' },
          { t: 'nota', testo: 'Tira giù la sfera d\'oro: scavi il fondale. Profondità schematiche.' },
        ],
        dx: Lezione.finestra(760),
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Navi speciali' },
          { t: 'tabella', col: [40, 60], size: 32, righe: [
            ['Nave', 'A che cosa serve'],
            ['Posacavi, posatubi', 'linee elettriche o condotti sottomarini'],
            ['Rompighiaccio', '*icebreaker*'],
            ['Oceanografiche', 'ricerca in ambito marino'],
            ['Semisommergibili', 'elementi mastodontici'],
            ['Drillship', 'trivellano il fondale per i giacimenti'],
          ] },
          { t: 'nota', testo: 'slide 13, 14' },
        ],
        dx: [
          { t: 'titolo', testo: 'Navi industriali' },
          { t: 'p', testo: 'Navi da pesca (*fishing vessel*) e mezzi dell\'offshore, cioè l\'estrazione di combustibili fossili. {{slide 9}}' },
          { t: 'p', testo: 'Le piattaforme petrolifere sono classificate come navi anche se non hanno propulsione autonoma. {{slide 9}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Le portarinfuse solide' },
          { t: 'p', size: 34, testo: 'Le **bulk carrier** portano carichi solidi alla rinfusa nelle stive: granaglie, cemento, carbone, fosfato, minerali di ferro. Il layout è specializzato per il carico. {{lezione 3.2, slide 2}}' },
          { t: 'p', size: 34, testo: 'Sul ponte di coperta hanno ampie aperture per immettere il carico in fretta, chiuse in navigazione dalle **boccaporte**, stagne. {{lezione 3.2, slide 3}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il carico' },
          { t: 'p', size: 32, testo: 'Su un piano orizzontale un carico solido scorrevole si ferma a forma di cono: la sua pendenza è l\'**angolo di natural declivio** (*angle of repose*). {{lezione 3.2, slide 4}}' },
          { t: 'tabella', col: [22, 78], size: 32, righe: [
            ['Gruppo', 'International Maritime Solid Bulk Cargoes Code'],
            ['A', 'può liquefarsi oltre il *Transportable Moisture Limit*: rame, nichel, zinco, carbone'],
            ['B', 'chimici infiammabili, radioattivi o corrosivi; rari'],
            ['C', 'tutti gli altri; i più diffusi'],
          ] },
          { t: 'nota', testo: 'Lezione 3.2, slide 5' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Due grandi categorie' },
          { t: 'p', size: 34, testo: '**General purpose dry bulk carrier**, generaliste: le *bulk carrier* per ogni rinfusa solida e le *ore carrier* per i soli minerali. {{lezione 3.2, slide 6}}' },
          { t: 'p', size: 34, testo: '**Specialized dry bulk carrier**, per merci specifiche: le *timber carrier* per il legname sfuso, le *cement carrier* per il cemento. {{lezione 3.2, slide 6}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le portarinfuse liquide' },
          { t: 'p', size: 34, testo: 'Le *oil tanker* portano greggio, e sono **crude oil tanker**, o prodotti della raffinazione, e sono **product oil tanker**. {{lezione 3.2, slide 7}}' },
          { t: 'p', size: 34, testo: 'Fondo e fianchi delle cisterne sono separati dal fasciame dal **doppio fondo** e dal **doppio fianco**: insieme sono il **doppio scafo**. {{lezione 3.2, slide 8}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Perché il container' },
          { t: 'p', size: 34, testo: 'Con le portacontainer: {{lezione 3.2, slide 10}}' },
          { t: 'p', size: 34, testo: '• meno tempo per imbarco e sbarco del carico;' },
          { t: 'p', size: 34, testo: '• più capacità di carico della nave;' },
          { t: 'p', size: 34, testo: '• lo stesso modo di trasporto anche dopo lo sbarco in porto: movimentazione **intermodale**.' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le misure' },
          { t: 'tabella', col: [28, 36, 36], size: 32, righe: [
            ['Container', 'esterno (mm)', 'interno (mm)'],
            ['10 piedi', '3058', '2898'],
            ['20 piedi', '6058', '5898'],
            ['40 piedi', '12 191', '11 836'],
            ['larghezza', '2438', '2352'],
            ['altezza', '2591', '2391'],
          ] },
          { t: 'p', size: 32, testo: 'Il più comune è il 20\' *heavy tested container*: 2400 kg vuoto, fino a 28 080 kg di carico. La capacità della nave si misura in **TEU**. {{lezione 3.2, slide 11, 12}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Gasiere e chimichiere' },
          { t: 'p', size: 34, testo: 'Le *liquefied gas carrier* portano idrocarburi gassosi liquefatti: a bassa temperatura, ad alta pressione o con le due tecniche insieme, in serbatoi strutturali o indipendenti dallo scafo. {{lezione 3.2, slide 13}}' },
          { t: 'p', size: 32, testo: 'Le *chemical tanker* portano prodotti chimici alla rinfusa, spesso pericolosi: stive, materiali e impianti seguono l\'**IBC Code**. {{lezione 3.2, slide 14}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le categorie' },
          { t: 'tabella', col: [26, 74], size: 32, righe: [
            ['Categoria', 'Rischio per la salute o l\'ambiente marino'],
            ['X', 'elevato'],
            ['Y', 'moderato'],
            ['Z', 'basso'],
            ['OS', 'nessun requisito particolare per la nave'],
          ] },
          { t: 'p', size: 32, testo: 'Si valutano bioaccumulo e contaminazione, danni alle risorse viventi, pericolo per la salute, riduzione delle amenità. {{lezione 3.2, slide 15}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Le navi traghetto' },
          { t: 'p', size: 34, testo: 'Le *ro-ro/pax ship* portano insieme passeggeri e veicoli su gomma. La capacità: numero massimo di passeggeri e metri lineari di veicoli nei ponti garage. {{lezione 3.2, slide 16}}' },
          { t: 'p', size: 34, testo: 'Ro-ro significa *roll-on/roll-off*: i veicoli salgono e scendono da soli. {{lezione 3.2, slide 16}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'RORO o ferry?' },
          { t: 'tabella', col: [24, 38, 38], size: 32, righe: [
            ['', 'RORO', 'Ferry'],
            ['Porta', 'veicoli, anche passeggeri', 'passeggeri, anche veicoli'],
            ['Rotte', 'medie e lunghe, spesso internazionali', 'brevi e medie, tra isole e coste'],
            ['A bordo', 'rampe, ampi ponti garage', 'sedili, mensa, servizi'],
          ] },
          { t: 'nota', testo: 'Lezione 3.2, slide 17, 18' },
        ],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(1), ...lez.domanda(2), ...lez.domanda(3)],
        dx: [{ t: 'nota', testo: 'Domande sulle definizioni delle slide. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(4), ...lez.domanda(5), ...lez.domanda(6)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Le rinfuse' }, ...lez.domanda(7), ...lez.domanda(8), ...lez.domanda(9)],
        dx: [...lez.domanda(10), ...lez.domanda(11)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Le altre navi' }, ...lez.domanda(12), ...lez.domanda(13), ...lez.domanda(14)],
        dx: [...lez.domanda(15), ...lez.domanda(16)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizi: container' }, ...lez.calcoloSx()],
        dx: [...lez.calcoloDx()],
      },
      lez.premio(() => lez.fatto.quiz([...QUIZ, ...CALCOLI].map((q) => q.n))),
    ];
  });
})();
