/* Lezione 11: compartimentazione stagna. Definizioni e formule dalle slide 2-24.
   Le slide non danno lunghezze di nave né valori degli indici: L, immersioni e indici A e R li sceglie
   lo studente per provare le formule delle slide 5, 19 e 20. Lo scafo disegnato non cambia con L */
(function () {
  const N = 11;
  const { COL, etichetta, maniglia, segmento } = Tavola;
  const num = (v, d = 1) => v.toFixed(d).replace('.', ',');

  const MISSIONI = [
    { id: 'collisione', testo: 'Porta la paratia di collisione nella zona consentita.' },
    { id: 'lunga', testo: 'Con L = 200 m o più, rimettila nella zona consentita.' },
    { id: 'essenziali', testo: 'Tocca le paratie che la SOLAS considera essenziali.' },
    { id: 'fondo', testo: 'Tocca il doppio fondo stagno.' },
    { id: 'dp', testo: 'Cambia un\'immersione e guarda dove va il galleggiamento intermedio.' },
    { id: 'indice', testo: 'Trova indici per cui A ≥ R.' },
  ];
  const QUIZ = [
    { n: 1, testo: 'Fino a quale ponte arrivano le paratie stagne essenziali?', scelte: ['Il ponte delle sovrastrutture', 'Il ponte delle paratie', 'Il ponte di coperta del castello'], giusta: 1, perche: 'Il ponte delle paratie (bulkhead deck).' },
    { n: 2, testo: 'Quale paratia è attraversata dall\'asse dell\'elica?', scelte: ['Paratia di collisione', 'Paratia del pressatrecce', 'Paratia prodiera della sala macchine'], giusta: 1, perche: 'La paratia del pressatrecce o del gavone poppiero (afterpeak bulkhead).' },
    { n: 3, testo: 'Nave con L = 200 m: distanza massima della paratia di collisione dalla perpendicolare avanti?', scelte: ['10 m', '13 m', '16 m'], giusta: 2, perche: 'Il maggiore tra 0,08L = 16 m e 0,05L + 3 m = 13 m.' },
    { n: 4, testo: 'Il doppio fondo stagno deve coprire la lunghezza…', scelte: ['Dalla paratia di collisione a quella del gavone poppiero', 'Della sola sala macchine', 'Delle sole stive'], giusta: 0, perche: 'Tutta la lunghezza tra le due paratie, fino alle estremità laterali (SOLAS II-1, Reg. 9).' },
    { n: 5, testo: 'Nel metodo probabilistico la compartimentazione è adeguata se…', scelte: ['A ≥ R', 'A ≤ R', 'A = 0'], giusta: 0, perche: 'L\'indice calcolato A non deve essere inferiore all\'indice richiesto R.' },
    { n: 6, testo: 'Che peso ha nel calcolo di A il galleggiamento a dislocamento leggero?', scelte: ['20%', '40%', '60%'], giusta: 0, perche: '20%; 40% ciascuno il pieno carico estivo e l\'intermedio.' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ });

  // Paratia trasversale: segue la sezione dello scafo alla stessa ascissa
  function sezione(x) {
    const u = Math.max(0.001, Math.min(0.999, x / Scafo.L));
    return Scafo.griglia(2, 14, (a, b) => {
      const k = Scafo.fondo(u); const h = Scafo.insellatura(u); const y = k + b * (h - k);
      return [x, y, (2 * a - 1) * Scafo.mezza(u, y)];
    });
  }
  const lastra = (colore, op) => new THREE.MeshBasicMaterial({ color: colore, side: THREE.DoubleSide, transparent: op < 1, opacity: op, depthWrite: op >= 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  function velata(k) {
    const n = Scafo.crea(k);
    n.traverse((o) => {
      if (o.isMesh && (o.material.map || o.material.vertexColors)) {
        o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.24; o.material.depthWrite = false;
      }
    });
    return n;
  }
  const FP = Scafo.ascissa(1, 6); // perpendicolare avanti, alla linea d'acqua dipinta

  /* Simulazione 1: dove va la paratia di collisione (slide 5) ------------------------------------- */
  const co = { L: 100, d: 12, copie: [] };
  const dMin = () => Math.min(0.05 * co.L, 10);
  const dMax = () => Math.max(0.08 * co.L, 0.05 * co.L + 3);
  const scala = () => FP / co.L; // metri del disegno per metro di nave
  const dentro = () => co.d >= dMin() - 0.05 && co.d <= dMax() + 0.05;
  function posaCollisione() {
    const f = scala(); const x = FP - co.d * f;
    co.copie.forEach((c) => {
      c.paratia.geometry.dispose(); c.paratia.geometry = sezione(x);
      c.paratia.material.color.set(dentro() ? '#2F7A55' : '#B3362B');
      c.presa.position.x = x;
      const a = FP - dMax() * f; const b = FP - dMin() * f;
      c.zona.scale.x = Math.max(0.05, b - a); c.zona.position.x = (a + b) / 2;
    });
  }
  const creaCollisione = Lezione.simula({
    k: 5, mare: false, pedana: [80, 24, 'a prua'], dopo: posaCollisione,
    vista: () => ({ target: new THREE.Vector3(76, 2, 0), theta: 0.62, phi: 1.25, r: 64 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -5; const dim = 1.6 + k * 0.4;
      g.add(velata(k));
      const zona = new THREE.Mesh(new THREE.BoxGeometry(1, 11, 17), lastra(COL.ocra, 0.22)); zona.position.set(FP, 5.5, 0); g.add(zona);
      g.add(segmento(new THREE.Vector3(FP, -1, 0), new THREE.Vector3(FP, 13, 0), 0.06 * Math.sqrt(k), COL.inchiostro));
      const e = etichetta('perpendicolare avanti', dim, '#0B2545'); e.position.set(FP - 6, 15, 0); g.add(e);
      const paratia = new THREE.Mesh(sezione(80), lastra(0x2F7A55, 0.9)); g.add(paratia);
      const presa = maniglia(0.5 + k * 0.25, 'd'); presa.position.set(80, 10.6, 0); g.add(presa); tocca(presa);
      co.copie.push({ paratia, presa, zona });
      return g;
    },
    trascina(id, dx) {
      const prima = `${num(co.d)}|${dentro()}`;
      co.d = Math.max(0, Math.min(0.2 * co.L, co.d - (dx * 0.06) / scala()));
      posaCollisione(); verifica();
      if (`${num(co.d)}|${dentro()}` !== prima) Motore.ridisegna();
    },
  });
  function verifica() {
    if (!dentro()) return;
    lez.completa('collisione');
    if (co.L >= 200) lez.completa('lunga');
  }
  function comandiCollisione(id) {
    if (id === 'L+') co.L = Math.min(300, co.L + 10);
    if (id === 'L-') co.L = Math.max(50, co.L - 10);
    if (id === 'd+') co.d = Math.min(0.2 * co.L, Math.round(co.d * 2 + 1) / 2);
    if (id === 'd-') co.d = Math.max(0, Math.round(co.d * 2 - 1) / 2);
    co.d = Math.min(co.d, 0.2 * co.L);
    posaCollisione(); verifica(); Motore.sporco();
  }

  /* Simulazione 2: paratie essenziali e doppio fondo (slide 4-8). Posizioni schematiche ----------- */
  const PARATIE = [
    { id: 'pressatrecce', x: 6, nome: 'Paratia del pressatrecce', essenziale: true, testo: 'Paratia del pressatrecce (*afterpeak bulkhead*): la attraversa l\'asse dell\'elica. Qui la sala macchine è all\'estrema poppa: è anche la sua paratia poppiera. {{slide 6, 7}}' },
    { id: 'macchine', x: 22, nome: 'Paratia prodiera della sala macchine', essenziale: true, testo: 'Paratia prodiera della sala macchine (*forward machinery space bulkhead*): la separa dalle altre zone della nave. {{slide 7}}' },
    { id: 'stiva1', x: 37.5, nome: 'Paratia tra due stive', essenziale: false },
    { id: 'stiva2', x: 52, nome: 'Paratia tra due stive', essenziale: false },
    { id: 'stiva3', x: 66, nome: 'Paratia tra due stive', essenziale: false },
    { id: 'collisione', x: FP - 0.065 * FP, nome: 'Paratia di collisione', essenziale: true, testo: 'Paratia di collisione (*collision bulkhead*): la più vicina alla prua. {{slide 5}}' },
  ];
  const ESSENZIALI = PARATIE.filter((p) => p.essenziale).map((p) => p.id);
  const es = { scelta: null, trovate: new Set(), fondo: false, copie: [] };
  function doppioFondo() {
    const x0 = PARATIE[0].x; const x1 = PARATIE[PARATIE.length - 1].x;
    return Scafo.griglia(40, 6, (a, b) => {
      const x = x0 + a * (x1 - x0); const u = x / Scafo.L; const y = Scafo.fondo(u) + 1.2;
      return [x, y, (2 * b - 1) * Scafo.mezza(u, y)];
    });
  }
  function posaParatie() {
    es.copie.forEach((c) => {
      PARATIE.forEach((p) => {
        const trovata = es.trovate.has(p.id);
        c.lastre[p.id].material.color.set(es.scelta === p.id || trovata ? '#C9A227' : '#FBF9F1');
        c.nomi[p.id].visible = es.scelta === p.id;
      });
      c.fondo.material.color.set(es.scelta === 'fondo' || es.fondo ? '#C9A227' : '#D8E0EC');
      c.nomeFondo.visible = es.scelta === 'fondo';
    });
  }
  const creaParatie = Lezione.simula({
    k: 5, mare: false, pedana: [45, 30, 'a dritta'], dopo: posaParatie,
    vista: () => ({ target: new THREE.Vector3(48, 0, 0), theta: 0.4, phi: 1.2, r: 118 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -5; const dim = 3.4 + k * 0.5;
      g.add(velata(k));
      const lastre = {}; const nomi = {};
      PARATIE.forEach((p) => {
        const m = new THREE.Mesh(sezione(p.x), lastra(0xFBF9F1, 0.92)); m.userData.tocco = p.id; g.add(m); tocca(m); lastre[p.id] = m;
        const e = etichetta(p.nome, dim, '#0B2545'); e.position.set(p.x, 16, 0); e.visible = false; g.add(e); nomi[p.id] = e;
      });
      const fondo = new THREE.Mesh(doppioFondo(), lastra(0xD8E0EC, 0.95)); fondo.userData.tocco = 'fondo'; g.add(fondo); tocca(fondo);
      const nomeFondo = etichetta('Doppio fondo stagno', dim, '#0B2545'); nomeFondo.position.set(45, -3, 10); nomeFondo.visible = false; g.add(nomeFondo);
      es.copie.push({ lastre, nomi, fondo, nomeFondo });
      return g;
    },
  });
  function comandiParatie(id) {
    if (id.startsWith('t:')) {
      const ids = id.slice(2).split(',');
      const p = PARATIE.find((x) => ids.includes(x.id));
      if (p) {
        es.scelta = p.id;
        if (p.essenziale) es.trovate.add(p.id);
        if (ESSENZIALI.every((x) => es.trovate.has(x))) lez.completa('essenziali');
      } else if (ids.includes('fondo')) { es.scelta = 'fondo'; es.fondo = true; lez.completa('fondo'); }
    }
    posaParatie(); Motore.sporco();
  }
  function schedaParatia() {
    if (es.scelta === 'fondo') return '**Doppio fondo stagno**: dalla paratia di collisione a quella del gavone poppiero, fino alle estremità laterali, per proteggere il ginocchio. {{slide 8}}';
    const p = PARATIE.find((x) => x.id === es.scelta);
    if (!p) return 'Tocca una paratia o il fondo della nave.';
    if (p.essenziale) return p.testo;
    return '**Paratia tra due stive**: non è tra quelle essenziali. Il numero delle altre paratie viene dalle tabelle delle Società di classificazione, in funzione della lunghezza. {{slide 8}}';
  }

  /* Simulazione 3: i tre galleggiamenti del calcolo di A (slide 20). Immersioni scelte dallo studente */
  const ga = { ds: 6, dl: 2.5, copie: [] };
  const dp = () => ga.dl + 0.6 * (ga.ds - ga.dl);
  // Linea di galleggiamento: anello attorno allo scafo all'immersione y
  function anello(y, colore, k) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push(new THREE.Vector3(Scafo.ascissa(u, y), y, Scafo.mezza(u, y) + 0.1)); }
    for (let i = 40; i >= 0; i--) { const u = i / 40; pts.push(new THREE.Vector3(Scafo.ascissa(u, y), y, -Scafo.mezza(u, y) - 0.1)); }
    return Tavola.tratto(pts, 0.3 * Math.sqrt(k), colore, true);
  }
  function posaGalleggiamenti() {
    ga.copie.forEach((c) => {
      // Etichette sfalsate lungo la murata, appoggiate sopra la propria linea
      [[c.s, ga.ds, 22], [c.p, dp(), 48], [c.l, ga.dl, 74]].forEach(([o, y, x]) => {
        if (o.linea) { o.linea.removeFromParent(); o.linea.geometry.dispose(); }
        o.linea = anello(y, o.colore, c.k); c.g.add(o.linea);
        o.nome.position.set(x, y + o.nome.scale.y * 0.45, Scafo.mezza(x / Scafo.L, y) + 1);
      });
    });
  }
  const creaGalleggiamenti = Lezione.simula({
    k: 5, mare: false, pedana: [45, 30, 'a dritta'], dopo: posaGalleggiamenti,
    vista: () => ({ target: new THREE.Vector3(50, 0, 0), theta: 0.28, phi: 1.34, r: 112 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -4; const dim = 2.6 + k * 0.6;
      g.add(velata(k));
      const riga = (colore, testo, testoCol) => {
        // Più grandi delle altre etichette e sempre davanti allo scafo velato
        const nome = etichetta(testo, dim * 2, testoCol); nome.material.depthTest = false; nome.renderOrder = 10; g.add(nome);
        return { colore, nome, linea: null };
      };
      const s = riga(COL.acqua, 'ds 40%', '#2E7DB5');
      const p = riga(COL.ocra, 'dp 40%', '#8C7020');
      const l = riga(COL.medio, 'dl 20%', '#5B6B7C');
      ga.copie.push({ g, k, s, p, l });
      return g;
    },
  });
  function comandiGalleggiamenti(id) {
    const prima = `${ga.ds}|${ga.dl}`;
    if (id === 'ds+') ga.ds = Math.min(7, Math.round(ga.ds * 10 + 1) / 10);
    if (id === 'ds-') ga.ds = Math.max(4, Math.round(ga.ds * 10 - 1) / 10);
    if (id === 'dl+') ga.dl = Math.min(3.9, Math.round(ga.dl * 10 + 1) / 10);
    if (id === 'dl-') ga.dl = Math.max(1.5, Math.round(ga.dl * 10 - 1) / 10);
    if (`${ga.ds}|${ga.dl}` !== prima) lez.completa('dp');
    posaGalleggiamenti(); Motore.sporco();
  }

  /* Pagina di calcolo: A = 0,4·As + 0,4·Ap + 0,2·Al e confronto con R (slide 15, 20) ---------------- */
  const ix = { as: 0.5, ap: 0.5, al: 0.5, r: 0.6 };
  const indiceA = () => 0.4 * ix.as + 0.4 * ix.ap + 0.2 * ix.al;
  function comandiIndici(id) {
    const k = id.slice(0, -1); const v = id.slice(-1);
    if (ix[k] !== undefined && (v === '+' || v === '-')) {
      ix[k] = Math.max(0, Math.min(1, Math.round(ix[k] * 20 + (v === '+' ? 1 : -1)) / 20));
      if (indiceA() >= ix.r - 1e-9) lez.completa('indice');
    }
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { a: 'tra 5 e 8 m', b: 'tra 10 e 20 m', c: 'dove decide il progettista' };
    const A = indiceA();
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Spazi più piccoli' },
          { t: 'p', testo: 'Lo scafo viene **compartimentato**: suddiviso in spazi più piccoli con ponti e paratie. {{slide 2}}' },
          { t: 'p', testo: 'Nella parte stagna, fino al ponte delle paratie, la compartimentazione è **stagna** o **di galleggiabilità**: serve a circoscrivere un eventuale allagamento. {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il ponte delle paratie' },
          { t: 'p', size: 38, testo: 'Il **ponte delle paratie** (*bulkhead deck*) è il ponte più alto sotto il quale paratie e fasciame garantiscono l\'impermeabilità. {{slide 3}}' },
          { t: 'p', size: 36, testo: 'Le aperture su questo ponte, quelle esterne sotto di esso e i passaggi tra compartimenti hanno chiusure a tenuta stagna. {{slide 2}}' },
          { t: 'nota', testo: 'Regole: SOLAS, Capitolo II-1, parte B' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'La paratia di collisione è la paratia stagna più vicina alla prua. La sua distanza dalla perpendicolare avanti è fissata dalla SOLAS.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Nave lunga 100 m: dove va la paratia di collisione?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:a', testo: 'Tra 5 e 8 m dalla perpendicolare avanti', on: p === 'a' },
          { t: 'scelta', id: 'p:b', testo: 'Tra 10 e 20 m dalla perpendicolare avanti', on: p === 'b' },
          { t: 'scelta', id: 'p:c', testo: 'Dove decide il progettista', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaCollisione, azione: comandiCollisione, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'La paratia di collisione' },
          { t: 'passo', id: 'L', nome: 'Lunghezza della nave L', valore: `${co.L} m` },
          { t: 'passo', id: 'd', nome: 'Distanza dalla perpendicolare avanti', valore: `${num(co.d)} m` },
          { t: 'riquadro', size: 34, colore: dentro() ? '#2F7A55' : '#B3362B', testo: `Zona consentita: da **${num(dMin())} m** (minore tra 0,05L e 10 m) a **${num(dMax())} m** (maggiore tra 0,08L e 0,05L + 3 m). ${dentro() ? 'La paratia è a posto.' : 'Fuori zona.'} {{slide 5}}` },
          ...lez.missioni().slice(0, 2),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'In ocra la zona consentita. Trascina la sfera d\'oro o usa i regolatori. Lo scafo disegnato non cambia con L.' },
        ],
      },
      {
        passo: 2, mondo: creaParatie, azione: comandiParatie, richiede: () => lez.fatte.has('lunga'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Le paratie essenziali' },
          { t: 'riquadro', size: 34, testo: schedaParatia() },
          { t: 'nota', testo: `Paratie essenziali trovate: ${es.trovate.size} su ${ESSENZIALI.length}.` },
          ...lez.missioni().slice(2, 4),
          { t: 'nota', testo: 'Posizioni schematiche.' },
        ],
        dx: Lezione.finestra(760, 'Punta una paratia o il fondo e premi il grilletto.'),
      },
      {
        passo: 2, mondo: creaGalleggiamenti, azione: comandiGalleggiamenti, richiede: () => lez.fatte.has('essenziali') && lez.fatte.has('fondo'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Tre galleggiamenti' },
          { t: 'passo', id: 'ds', nome: 'Pieno carico estivo ds', valore: `${num(ga.ds)} m` },
          { t: 'passo', id: 'dl', nome: 'Dislocamento leggero dl', valore: `${num(ga.dl)} m` },
          { t: 'formula', testo: `dp = dl + 0,60 (ds − dl) = ${num(dp(), 2)} m` },
          { t: 'p', size: 34, testo: 'L\'indice A si calcola per tutti e tre e poi si fa la media pesata. {{slide 20}}' },
          ...lez.missioni().slice(4, 5),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Immersioni scelte da te: le slide non danno valori.' },
        ],
      },
      {
        passo: 2, azione: comandiIndici, richiede: () => lez.fatte.has('dp'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'L\'indice A' },
          { t: 'passo', id: 'as', nome: 'As, pieno carico estivo', valore: num(ix.as, 2) },
          { t: 'passo', id: 'ap', nome: 'Ap, intermedio', valore: num(ix.ap, 2) },
          { t: 'passo', id: 'al', nome: 'Al, dislocamento leggero', valore: num(ix.al, 2) },
          { t: 'passo', id: 'r', nome: 'Indice richiesto R', valore: num(ix.r, 2) },
          ...lez.missioni().slice(5),
        ],
        dx: [
          { t: 'spazio', h: 60 },
          { t: 'formula', testo: 'A = 0,4·As + 0,4·Ap + 0,2·Al' },
          { t: 'formula', testo: `A = ${num(A, 2)}` },
          { t: 'riquadro', colore: A >= ix.r - 1e-9 ? '#2F7A55' : '#B3362B', testo: A >= ix.r - 1e-9 ? `A = ${num(A, 2)} ≥ R = ${num(ix.r, 2)}: compartimentazione adeguata.` : `A = ${num(A, 2)} < R = ${num(ix.r, 2)}: non basta.` },
          { t: 'nota', testo: 'Valori scelti da te: le slide non danno numeri per gli indici. Formula e pesi dalla slide 20.' },
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'a' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Con L = 100 m: almeno il minore tra 0,05L = 5 m e 10 m, al massimo il maggiore tra 0,08L = 8 m e 0,05L + 3 m = 8 m. Quindi **tra 5 e 8 m**. {{slide 5}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La regola' },
          { t: 'formula', testo: 'min(0,05L; 10 m) ≤ d' },
          { t: 'formula', testo: 'd ≤ max(0,08L; 0,05L + 3 m)' },
          { t: 'p', size: 36, testo: 'd è la distanza dalla perpendicolare avanti. Con lunghe sovrastrutture prodiere può essere richiesto che la paratia arrivi a un ponte più alto di quello delle paratie. {{slide 5}}' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Le paratie essenziali' },
          { t: 'p', size: 36, testo: 'Arrivano fino al ponte delle paratie (SOLAS, Chapter II-1, Regulation 12): {{slide 4}}' },
          { t: 'tabella', col: [46, 54], size: 32, righe: [
            ['Paratia', 'In inglese'],
            ['di collisione', 'collision bulkhead'],
            ['del pressatrecce', 'afterpeak bulkhead'],
            ['delimitanti la sala macchine', 'forward/after machinery space bulkhead'],
          ] },
          { t: 'p', size: 32, testo: 'Se la sala macchine è all\'estrema poppa, la sua paratia poppiera può coincidere con quella del pressatrecce. {{slide 7}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Perché «premistoppa»' },
          { t: 'p', size: 36, testo: 'La paratia del gavone poppiero si chiama anche paratia di poppa, di pressatrecce o di premistoppa: la attraversa l\'asse dell\'elica. {{slide 6}}' },
          { t: 'p', size: 36, testo: 'I marinai chiamavano premistoppa la camera tra il mare, dove girava l\'elica, e il motore. Per la tenuta si premeva sulle pareti la stoppa, una poltiglia di grassi animali e altri materiali. {{slide 6}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Doppio fondo e altre paratie' },
          { t: 'p', size: 38, testo: 'La SOLAS impone un **doppio fondo stagno** dalla paratia di collisione a quella del gavone poppiero, esteso fino ai lati per proteggere il ginocchio (Chapter II-1, Regulation 9). {{slide 8}}' },
          { t: 'p', size: 38, testo: 'La posizione delle altre paratie stagne la danno le tabelle delle Società di classificazione: il numero di paratie in funzione della lunghezza della nave. {{slide 8}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le passeggeri' },
          { t: 'p', size: 38, testo: 'Per le navi da carico il ponte delle paratie corrisponde al ponte di bordo libero. {{slide 3}}' },
          { t: 'p', size: 38, testo: 'Per le navi passeggeri deve essere anche il ponte più basso da cui l\'acqua di un allagamento non può impedire l\'evacuazione di passeggeri ed equipaggio (Regulation 2). {{slide 3}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Dal Titanic alla SOLAS' },
          { t: 'tabella', col: [22, 78], size: 32, righe: [
            ['Anno', 'Che cosa'],
            ['1912', 'affonda il Titanic: la comunità internazionale affronta la compartimentazione'],
            ['1914', 'prima SOLAS, ritardata dalle due guerre mondiali'],
            ['1960', 'nasce l\'IMO (allora IMCO), adottata la SOLAS'],
            ['anni \'70', 'risoluzione A265 (VIII): metodo probabilistico consigliato per le passeggeri'],
            ['anni \'90', 'obbligatorio per certe navi da carico'],
            ['2009', 'SOLAS 2009: obbligatorio per passeggeri e certe navi da carico'],
          ] },
          { t: 'nota', testo: 'slide 12, 14' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il metodo deterministico' },
          { t: 'p', size: 38, testo: 'La SOLAS del 1960 seguiva un approccio **deterministico**, di causa ed effetto. {{slide 13}}' },
          { t: 'p', size: 38, testo: 'Il progettista studiava alcuni casi pericolosi, per esempio l\'allagamento di due o più compartimenti adiacenti, e metteva le paratie in modo che la nave non affondasse in quei casi. {{slide 13}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il metodo probabilistico' },
          { t: 'p', size: 36, testo: 'Regole 6 e 7 del Capitolo II-1: si confrontano l\'indice di compartimentazione richiesto R (*required subdivision index*) e quello calcolato A (*attained subdivision index*). {{slide 15}}' },
          { t: 'formula', testo: 'A ≥ R' },
          { t: 'p', size: 34, testo: 'R si calcola in modo diverso per navi passeggeri e da carico. {{slide 15}}' },
        ],
        dx: [
          { t: 'formula', testo: 'A = Σ pi · si' },
          { t: 'p', size: 36, testo: '**pi**: probabilità che un allagamento interessi solo l\'i-esimo compartimento; dipende dalla sua lunghezza, rapportata a LS, e dalla posizione. {{slide 19}}' },
          { t: 'p', size: 36, testo: '**si**: probabilità che la nave resista a quell\'allagamento; dipende dal diagramma di stabilità. È nulla se l\'acqua può estendersi ad altre zone (*progressive flooding*). {{slide 19, 21}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Dove proteggere' },
          { t: 'p', size: 38, testo: 'Per avere A non inferiore a R si può agire liberamente sul progetto. {{slide 22}}' },
          { t: 'p', size: 38, testo: 'Dove un allagamento interessa facilmente più compartimenti, p è piccolo: lo si compensa con s elevato, cioè suddividendo di più. {{slide 22}}' },
          { t: 'p', size: 34, testo: 'Le probabilità vengono da un database di circa 600 falle realmente accadute. {{slide 23}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Pro e contro' },
          { t: 'tabella', col: [50, 50], size: 32, righe: [
            ['Vantaggi', 'Svantaggi'],
            ['grande libertà ai progettisti', 'calcoli complessi: servono software specifici'],
            ['danno casuale per entità e posizione, su base statistica', 'troppa enfasi su alcune zone: la poppa, meno colpita, rischia di essere trascurata'],
            ['più condizioni di carico, non solo la peggiore', ''],
          ] },
          { t: 'nota', testo: 'slide 23, 24' },
        ],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(1), ...lez.domanda(2), ...lez.domanda(3)],
        dx: [{ t: 'nota', testo: 'Domande sulle definizioni e sulla regola della slide 5. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(4), ...lez.domanda(5), ...lez.domanda(6)],
      },
      lez.premio(() => lez.fatto.quiz(QUIZ.map((q) => q.n))),
    ];
  });
})();
