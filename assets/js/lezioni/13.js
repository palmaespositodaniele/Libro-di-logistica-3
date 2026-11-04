/* Lezione 13: catene ed ancore, attrezzature di tonneggio. Definizioni dalle slide 2-29.
   Composizione del penzolo dallo schema delle slide 7-9; parti dell'ancora Hall dalla figura della slide 17;
   potere ancorante dallo schema della slide 16. Le slide non danno misure di maglie o ancore:
   le forme 3D sono schematiche */
(function () {
  const N = 13;
  const { COL, etichetta, segmento } = Tavola;
  const num = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const LUNGA = 27.5; // lunghezza di catena standard massima, m (slide 4)

  const MISSIONI = [
    { id: 'kenter', testo: 'Tocca la maglia Kenter.' },
    { id: 'conta', testo: 'Leggi due lunghezze di catena dalle maglie dipinte.' },
    { id: 'penzolo', testo: 'Monta il penzolo di cima nell\'ordine giusto.' },
    { id: 'parti', testo: 'Tocca tutte le parti dell\'ancora Hall.' },
    { id: 'inclina', testo: 'Inclina le marre fino al massimo.' },
    { id: 'riposo', testo: 'Sospendi l\'ancora bilanciata e quella non bilanciata.' },
    { id: 'fondale', testo: 'Scegli il fondale buon tenitore.' },
    { id: 'tonneggio', testo: 'Dividi le attrezzature di tonneggio in passive e motorizzate.' },
  ];
  const QUIZ = [
    { n: 1, testo: 'Come si chiama l\'elemento di rinforzo al centro della maglia?', scelte: ['Cicala', 'Traversino', 'Marra'], giusta: 1, perche: 'Il traversino (stud).' },
    { n: 2, testo: 'Qual è la lunghezza standard massima di una lunghezza di catena?', scelte: ['15 m', '27,5 m', '90 m'], giusta: 1, perche: '27,5 m, cioè 15 fathoms o 90 piedi.' },
    { n: 3, testo: 'Una catena di grado 2 ha un carico di rottura UTS…', scelte: ['tra 300 e 490 N/mm²', 'tra 490 e 690 N/mm²', 'oltre 690 N/mm²'], giusta: 1, perche: 'Grado 2, special quality steel: tra 490 e 690 N/mm².' },
    { n: 4, testo: 'Un\'ancora HHP può pesare fino al … di quanto prevede la tabella del modulo di armamento.', scelte: ['75%', '50%', '125%'], giusta: 0, perche: '75% per le HHP, 50% per le SHHP.' },
    { n: 5, testo: 'Quale attrezzatura di tonneggio ha l\'asse verticale?', scelte: ['Il verricello (winch)', 'L\'argano (capstan)', 'La bitta (bollard)'], giusta: 1, perche: 'L\'argano ha asse verticale, il verricello orizzontale.' },
    { n: 6, testo: 'I cavi hanno carico di rottura 60 t. Quanto vale il carico di progetto dell\'attrezzatura secondo lo IACS?', scelte: ['48 t', '60 t', '75 t'], giusta: 2, perche: '1,25 × 60 t = 75 t; lo SWL non deve superarne l\'80%, cioè 60 t.' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ });

  /* Maglia con traversino: anello quasi ellittico sul piano xy, traversino lungo y. Calibro d = 1 */
  const curvaMaglia = (a, b) => new THREE.CatmullRomCurve3(Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * Math.PI * 2; return new THREE.Vector3(a * Math.cos(t), b * Math.sin(t), 0); }), true);
  const GEO = {
    anello: new THREE.TubeGeometry(curvaMaglia(2.5, 1.3), 72, 0.5, 10, true),
    traversino: new THREE.CylinderGeometry(0.32, 0.32, 1.8, 10),
  };
  function maglia(colore, { scala = 1, traversino = true, tocco } = {}) {
    const g = new THREE.Group(); const mat = new THREE.MeshBasicMaterial({ color: colore });
    const pezzi = [new THREE.Mesh(GEO.anello, mat)];
    if (traversino) pezzi.push(new THREE.Mesh(GEO.traversino, mat));
    pezzi.forEach((m) => { if (tocco) m.userData.tocco = tocco; g.add(m); });
    g.scale.setScalar(scala);
    return { g, mat, pezzi };
  }
  const GRIGIO = '#3A4654'; const BIANCO = '#FBFAF4'; const ROSSO = '#B3362B';

  /* Simulazione 1: lunghezze di catena e maglie dipinte (slide 4, 5) --------------------------------- */
  const NM = 31; const K = 15; const PASSO = 4; const MM = 0.1; // 1 unità = 10 cm
  const SEQ = [3, 1, 4, 2, 5];
  const cn = { i: 0, giuste: 0, esito: null, copie: [] };
  const lunghezza = () => SEQ[cn.i % SEQ.length];
  function posaCatena() {
    cn.copie.forEach((c) => c.maglie.forEach((m, i) => {
      const d = Math.abs(i - K);
      m.mat.color.set(i === K ? ROSSO : d <= lunghezza() ? BIANCO : GRIGIO);
    }));
  }
  const creaCatena = Lezione.simula({
    k: 3, mare: false, scala: 0.1, centro: [0, 0], pedana: [0, 4, 'accanto alla catena'], dopo: posaCatena,
    vista: () => ({ target: new THREE.Vector3(0, 0, 0), theta: 0.3, phi: 1.15, r: 4.4 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.scale.setScalar(MM);
      const maglie = [];
      for (let i = 0; i < NM; i++) {
        const m = maglia(GRIGIO, { tocco: i === K ? 'kenter' : 'maglia' });
        m.g.position.x = (i - K) * PASSO; m.g.rotation.x = i % 2 ? Math.PI / 4 : -Math.PI / 4;
        m.pezzi.forEach(tocca); g.add(m.g); maglie.push(m);
      }
      const e = etichetta('verso la cubia', 3.2, '#0B2545'); e.position.set(-K * PASSO + 6, 5, 0); g.add(e);
      cn.copie.push({ maglie });
      return g;
    },
  });
  function comandiCatena(id) {
    if (id.startsWith('t:')) {
      const t = id.slice(2).split(',')[0];
      if (t === 'kenter') { lez.completa('kenter'); cn.esito = { tipo: 'giusto', testo: 'Maglia Kenter (kenter shackle): si apre, ma chiusa sembra uguale alle altre. È la «falsa maglia» che unisce due lunghezze. {{slide 4}}' }; }
      if (t === 'maglia') cn.esito = { tipo: 'errato', testo: 'Questa è una maglia con traversino. La Kenter è dipinta di un colore ancora diverso. {{slide 5}}' };
    }
    if (id.startsWith('n:')) {
      const n = Number(id.slice(2)); const v = lunghezza();
      if (n === v) {
        cn.giuste += 1;
        cn.esito = { tipo: 'giusto', testo: `${v} ${v === 1 ? 'maglia dipinta' : 'maglie dipinte'} per lato: lunghezza numero ${v}, fino a ${v} × 27,5 = ${num(v * LUNGA)} m di catena. {{slide 4, 5}}` };
        if (cn.giuste >= 2) lez.completa('conta');
        cn.i += 1;
      } else cn.esito = { tipo: 'errato', testo: 'Conta le maglie bianche da un solo lato della Kenter.' };
    }
    posaCatena(); Motore.sporco();
  }

  /* Simulazione 2: il penzolo di cima (slide 6-9). Ordine dallo schema delle slide ------------------- */
  const PEZZI = {
    kenter: { nome: 'Maglia Kenter', inglese: 'kenter shackle' },
    comune: { nome: 'Maglia comune con traversino', inglese: 'common stud link' },
    rinforzata: { nome: 'Maglia rinforzata' },
    tornichetto: { nome: 'Maglia tornichetto (a mulinello)' },
    capotesta: { nome: 'Maglia capotesta senza traversino' },
    maniglione: { nome: 'Maniglione d\'ancora', inglese: 'anchor shackle, «D» shackle' },
  };
  const ORDINE = ['kenter', 'comune', 'rinforzata', 'tornichetto', 'rinforzata', 'capotesta', 'maniglione'];
  const pz = { messi: [], comuni: 1, esito: null, copie: [] };
  function pezzo(tipo) {
    if (tipo === 'kenter') return { ...maglia(ROSSO), s: 1 };
    if (tipo === 'comune') return { ...maglia(GRIGIO), s: 1 };
    if (tipo === 'rinforzata') return { ...maglia('#5B6B7C', { scala: 1.15 }), s: 1.15 };
    if (tipo === 'capotesta') return { ...maglia(GRIGIO, { scala: 1.3, traversino: false }), s: 1.3 };
    const g = new THREE.Group(); const mat = new THREE.MeshBasicMaterial({ color: tipo === 'tornichetto' ? '#5B6B7C' : '#20201F' });
    if (tipo === 'tornichetto') {
      g.add(new THREE.Mesh(GEO.anello, mat));
      const perno = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.2, 10), mat); perno.rotation.z = Math.PI / 2; g.add(perno);
      g.scale.setScalar(1.2); return { g, mat, s: 1.2 };
    }
    // Maniglione: arco a «D» chiuso da un perno
    const arco = new THREE.CatmullRomCurve3(Array.from({ length: 19 }, (_, i) => { const t = -Math.PI / 2 + (i / 18) * Math.PI; return new THREE.Vector3(2.6 * Math.cos(t), 1.5 * Math.sin(t), 0); }));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(arco, 40, 0.5, 10, false), mat));
    g.add(segmento(new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 2, 0), 0.45, '#20201F'));
    return { g, mat, s: 1.1 };
  }
  function posaPenzolo() {
    pz.copie.forEach((c) => {
      if (c.montati) { c.montati.removeFromParent(); }
      c.montati = new THREE.Group(); c.g.add(c.montati);
      let x = -PASSO; let s0 = 1; // si parte dall'ultima maglia della prima lunghezza
      pz.messi.forEach((t, i) => {
        const p = pezzo(t);
        x += (PASSO / 2) * (s0 + p.s) * 1.05; s0 = p.s;
        p.g.position.x = x; p.g.rotation.x = i % 2 === 0 ? -Math.PI / 4 : Math.PI / 4;
        c.montati.add(p.g);
      });
      if (pz.messi.length) {
        const e = etichetta(PEZZI[pz.messi[pz.messi.length - 1]].nome, c.dim, '#0B2545'); e.position.set(x, 5.5, 0); c.montati.add(e);
      }
      c.freccia.visible = pz.messi.length === ORDINE.length + pz.comuni - 1;
      c.freccia.position.x = x + 7;
    });
  }
  const creaPenzolo = Lezione.simula({
    k: 3, mare: false, scala: 0.1, centro: [1, 0], pedana: [1, 4, 'accanto alla catena'], dopo: posaPenzolo,
    vista: () => ({ target: new THREE.Vector3(1.9, 0, 0), theta: 0.2, phi: 1.25, r: 6.6 }),
    modello(k) {
      const g = new THREE.Group(); g.scale.setScalar(MM); const dim = 2.6 + k * 0.3;
      // Fine della prima lunghezza di catena
      for (let i = 1; i <= 3; i++) { const m = maglia(GRIGIO); m.g.position.x = -i * PASSO; m.g.rotation.x = i % 2 ? Math.PI / 4 : -Math.PI / 4; g.add(m.g); }
      const e = etichetta('prima lunghezza', dim, '#5B6B7C'); e.position.set(-2 * PASSO, -5, 0); g.add(e);
      const freccia = etichetta('… alla cicala dell\'ancora', dim, '#8C7020'); freccia.position.y = 0; g.add(freccia);
      pz.copie.push({ g, dim, freccia, montati: null });
      return g;
    },
  });
  function comandiPenzolo(id) {
    if (id === 'daccapo') { pz.messi = []; pz.comuni = 1; pz.esito = null; }
    if (id.startsWith('m:')) {
      const t = id.slice(2); const k = pz.messi.length - (pz.comuni - 1);
      const atteso = ORDINE[k];
      const ultima = pz.messi[pz.messi.length - 1];
      if (k >= ORDINE.length) { /* già finito */ } else if (t === atteso) {
        pz.messi.push(t);
        pz.esito = { tipo: 'giusto', testo: `${PEZZI[t].nome}${PEZZI[t].inglese ? ` (*${PEZZI[t].inglese}*)` : ''}.` };
        if (k === ORDINE.length - 1) { lez.completa('penzolo'); pz.esito = { tipo: 'giusto', testo: 'Penzolo completo: il maniglione si collega alla cicala dell\'ancora. {{slide 9}}' }; }
      } else if (t === 'comune' && ultima === 'comune' && pz.comuni < 3) {
        pz.messi.push(t); pz.comuni += 1;
        pz.esito = { tipo: 'giusto', testo: 'Le maglie comuni possono essere una o più. {{slide 7}}' };
      } else pz.esito = { tipo: 'errato', testo: `${PEZZI[t].nome}: non va qui. Riguarda l'ordine delle slide 7-9.` };
    }
    posaPenzolo(); Motore.sporco();
  }

  /* Simulazione 3: l'ancora Hall (slide 17-19). Forme schematiche, nomi dalla figura della slide 17 -- */
  const PARTI = {
    cicala: '**Cicala**: maniglia tondeggiante in cima al fuso; qui si collega la catena. {{slide 17}}',
    fuso: '**Fuso**: collegato alla testa con una connessione mobile. {{slide 17}}',
    testa: '**Testa**: il blocco che comprende le marre; si inclina rispetto al fuso. {{slide 17, 18}}',
    marre: '**Marre**: gli elementi che fanno presa sul fondo. {{slide 17}}',
    contromarre: '**Contromarre**: alla base della testa. {{slide 17}}',
    unghie: '**Unghie**: le punte delle marre, nella figura della slide 17.',
  };
  const an = { ang: 0, scelta: null, toccate: new Set(), tipi: new Set(), sospesa: null, esito: null, copie: [] };
  function posaAncora() {
    an.copie.forEach((c) => {
      c.testa.rotation.x = -(an.ang * Math.PI) / 180;
      Object.entries(c.parti).forEach(([id, ms]) => ms.forEach((m) => m.material.color.set(an.scelta === id ? '#C9A227' : '#5B6B7C')));
      c.nome.visible = !!an.scelta;
      if (an.scelta) { c.nome.material.map.dispose(); const e = etichetta(an.scelta[0].toUpperCase() + an.scelta.slice(1), c.dim, '#0B2545'); c.nome.material.map = e.material.map; c.nome.scale.copy(e.scale); }
    });
  }
  const creaAncora = Lezione.simula({
    k: 3, mare: false, scala: 0.22, centro: [0, 1.4], pedana: [0, 4, 'davanti all\'ancora'], dopo: posaAncora,
    vista: () => ({ target: new THREE.Vector3(0, 1.55, 0), theta: 0.6, phi: 1.4, r: 6.6 }),
    modello(k, tocca) {
      const g = new THREE.Group(); const dim = 0.4 + k * 0.04;
      const parti = { cicala: [], fuso: [], testa: [], marre: [], contromarre: [], unghie: [] };
      const pezzo = (id, geo, x, y, z, padre) => {
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x5B6B7C }));
        m.position.set(x, y, z); m.userData.tocco = id; (padre || g).add(m); tocca(m); parti[id].push(m); return m;
      };
      pezzo('fuso', new THREE.BoxGeometry(0.2, 2.3, 0.16), 0, 1.5, 0);
      const cic = pezzo('cicala', new THREE.TorusGeometry(0.2, 0.055, 10, 24, Math.PI), 0, 2.62, 0); cic.rotation.y = Math.PI / 2;
      pezzo('cicala', new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8), 0, 2.62, 0).rotation.x = Math.PI / 2;
      // Testa articolata: ruota attorno al perno, sull'asse x
      const testa = new THREE.Group(); testa.position.set(0, 0.3, 0); g.add(testa);
      pezzo('testa', new THREE.BoxGeometry(0.62, 0.36, 0.42), 0, -0.08, 0, testa);
      pezzo('contromarre', new THREE.BoxGeometry(1.7, 0.07, 0.5), 0, 0.12, 0, testa);
      [-1, 1].forEach((s) => {
        const marra = pezzo('marre', new THREE.BoxGeometry(0.24, 1.2, 0.14), s * 0.55, 0.72, 0, testa); marra.rotation.z = s * -0.32;
        const unghia = pezzo('unghie', new THREE.ConeGeometry(0.17, 0.32, 10), s * 0.76, 1.42, 0, testa); unghia.rotation.z = s * -0.32;
      });
      const nome = etichetta('Fuso', dim, '#0B2545'); nome.position.set(0, 3.15, 0); nome.visible = false; g.add(nome);
      an.copie.push({ testa, parti, nome, dim });
      return g;
    },
  });
  function comandiAncora(id) {
    if (id.startsWith('t:')) {
      const t = id.slice(2).split(',')[0];
      if (PARTI[t]) { an.scelta = t; an.toccate.add(t); if (an.toccate.size === Object.keys(PARTI).length) lez.completa('parti'); }
    }
    if (id === 'ang+') { if (an.ang >= 40) { lez.completa('inclina'); an.esito = { tipo: 'giusto', testo: 'Il blocco testa/marre si inclina fino a circa 40° rispetto al fuso. {{slide 18}}' }; } else an.ang += 10; an.sospesa = null; }
    if (id === 'ang-') { an.ang = Math.max(0, an.ang - 10); an.sospesa = null; }
    if (id === 'bil' || id === 'nobil') {
      an.sospesa = id; an.tipi.add(id); an.ang = id === 'bil' ? 0 : 40;
      an.esito = { tipo: 'giusto', testo: id === 'bil' ? 'Bilanciata (*balanced*): sospesa, le marre restano parallele al fuso. {{slide 19}}' : 'Non bilanciata (*unbalanced*): sospesa, le marre restano inclinate. {{slide 19}}' };
      if (an.tipi.size === 2) lez.completa('riposo');
    }
    posaAncora(); Motore.sporco();
  }

  /* Pagina: il fondale (slide 12) ------------------------------------------------------------------- */
  const FONDALI = [
    ['sa', 'Sabbie e argille, effetto «cemento fresco»', true, 'Fondale buon tenitore: sabbie (*sand*) e argille (*clay*) più dei limi (*silt*). {{slide 12}}'],
    ['s', 'Solo sabbie', false, 'Da evitare: le zone di sole sabbie non tengono bene. {{slide 12}}'],
    ['al', 'Spessi strati di alghe', false, 'Da evitare: le alghe spesse coprono il fondale. {{slide 12}}'],
    ['r', 'Roccia', false, 'Da evitare: l\'ancora può incastrarsi, cioè incattivarsi (*fouling*). {{slide 12}}'],
  ];
  const fo = { scelta: null };
  function comandiFondale(id) {
    if (!id.startsWith('fo:')) return;
    fo.scelta = id.slice(3);
    if (FONDALI.find((f) => f[0] === fo.scelta)[2]) lez.completa('fondale');
  }

  /* Pagina: attrezzature di tonneggio passive e motorizzate (slide 25, 26, 28) ---------------------- */
  const ATTREZZI = [
    ['Bitta (*bollard*)', 'p', 'due colonne cilindriche su cui avvolgere il cavo «a 8». {{slide 25}}'],
    ['Verricello (*winch*)', 'm', 'motore e tamburi; asse orizzontale. {{slide 26}}'],
    ['Passacavo (*chock*)', 'p', 'fa passare il cavo attraverso il parapetto (*bulwark*). {{slide 25}}'],
    ['Argano (*capstan*)', 'm', 'motore e tamburi; asse verticale. {{slide 26}}'],
    ['Passacavo a rulli multipli (*fairlead*)', 'p', 'elementi rotanti: consumano meno i cavi. {{slide 25}}'],
    ['Mulinello salpaancore (*windlass*)', 'm', 'uno o due potenti motori muovono la ruota ad impronte. {{slide 28}}'],
  ];
  const tn = { i: 0, esito: null };
  function comandiTonneggio(id) {
    if (id === 'tn:daccapo') { tn.i = 0; tn.esito = null; return; }
    if (!id.startsWith('tn:') || tn.i >= ATTREZZI.length) return;
    const [nome, tipo, perche] = ATTREZZI[tn.i];
    if (id.slice(3) === tipo) {
      tn.esito = { tipo: 'giusto', testo: `${nome}: ${tipo === 'p' ? 'passiva' : 'motorizzata'}, ${perche}` };
      tn.i += 1; if (tn.i === ATTREZZI.length) lez.completa('tonneggio');
    } else tn.esito = { tipo: 'errato', testo: `${nome}: riprova.` };
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { a: 'solo pochi metri, 3 maglie', b: 'la terza lunghezza, fino a 82,5 m', c: 'non si può sapere senza misurare' };
    const k = pz.messi.length - (pz.comuni - 1);
    const fondale = FONDALI.find((f) => f[0] === fo.scelta);
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Maglia dopo maglia' },
          { t: 'p', testo: 'Le catene delle ancore sono fatte di **maglie** (*link*): anelli quasi ellittici con al centro un rinforzo metallico, il **traversino** (*stud*). {{slide 2}}' },
          { t: 'p', testo: 'Lunghezza e larghezza della maglia e diametro del traversino dipendono dal **calibro**, il diametro (*diameter*) del corpo della maglia. {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Tre gradi di acciaio' },
          { t: 'p', size: 36, testo: 'Le linee guida IACS distinguono tre gradi per carico di rottura (*ultimate tensile strength*, UTS): {{slide 3}}' },
          { t: 'tabella', col: [22, 44, 34], size: 32, righe: [
            ['Grado', 'Acciaio', 'UTS'],
            ['1', 'dolce (*mild steel*)', '300-490 N/mm²'],
            ['2', 'alta qualità (*special quality steel*)', '490-690 N/mm²'],
            ['3', 'alta qualità extra (*extra special quality steel*)', 'oltre 690 N/mm²'],
          ] },
          { t: 'nota', testo: 'Alcuni registri dividono il grado 1 in 1a e 1b, a 400 N/mm². Slide 3.' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'L\'ancora viene filata in mare. A prua vedi passare una maglia di colore diverso con, da entrambi i lati, tre maglie dipinte.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Quanta catena è passata?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:a', testo: 'Solo pochi metri: le 3 maglie', on: p === 'a' },
          { t: 'scelta', id: 'p:b', testo: 'La terza lunghezza: fino a 82,5 m', on: p === 'b' },
          { t: 'scelta', id: 'p:c', testo: 'Non si può sapere senza misurare', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaCatena, azione: comandiCatena, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'Lunghezze di catena' },
          { t: 'p', size: 34, testo: 'Quale lunghezza sta passando?' },
          { t: 'bottoni', h: 80, size: 36, lista: [1, 2, 3, 4, 5].map((n) => ({ id: `n:${n}`, testo: String(n) })) },
          ...(cn.esito ? [{ t: 'esito', ...cn.esito }] : []),
          ...lez.missioni().slice(0, 2),
        ],
        dx: [
          ...Lezione.finestra(760, 'Punta una maglia e premi il grilletto.'),
          { t: 'nota', testo: 'Catena schematica: in rosso la Kenter, in bianco le maglie dipinte. Colori dalla figura della slide 5.' },
        ],
      },
      {
        passo: 2, mondo: creaPenzolo, azione: comandiPenzolo, richiede: () => lez.fatte.has('kenter') && lez.fatte.has('conta'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Il penzolo di cima' },
          { t: 'p', size: 34, testo: `Dalla prima lunghezza all'ancora: scegli il pezzo numero ${Math.min(k + 1, ORDINE.length)} di ${ORDINE.length}.` },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'm:kenter', testo: 'Kenter' }, { id: 'm:comune', testo: 'Comune' }, { id: 'm:rinforzata', testo: 'Rinforzata' }] },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'm:tornichetto', testo: 'Tornichetto' }, { id: 'm:capotesta', testo: 'Capotesta' }, { id: 'm:maniglione', testo: 'Maniglione' }] },
          ...(pz.esito ? [{ t: 'esito', ...pz.esito }] : []),
          { t: 'bottoni', h: 72, size: 32, lista: [{ id: 'daccapo', testo: 'Da capo' }] },
          ...lez.missioni().slice(2, 3),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Pezzi schematici, nell\'ordine dello schema delle slide 7-9.' },
        ],
      },
      {
        passo: 2, mondo: creaAncora, azione: comandiAncora, richiede: () => lez.fatte.has('penzolo'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'L\'ancora Hall' },
          { t: 'riquadro', size: 34, testo: an.scelta ? PARTI[an.scelta] : 'Tocca una parte dell\'ancora.' },
          { t: 'passo', id: 'ang', nome: 'Inclinazione delle marre', valore: `${an.ang}°` },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'bil', testo: 'Bilanciata', on: an.sospesa === 'bil' }, { id: 'nobil', testo: 'Non bilanciata', on: an.sospesa === 'nobil' }] },
          ...(an.esito ? [{ t: 'esito', ...an.esito }] : []),
          ...lez.missioni().slice(3, 6),
        ],
        dx: [
          ...Lezione.finestra(760, 'Punta una parte dell\'ancora e premi il grilletto.'),
          { t: 'nota', testo: `Parti toccate: ${an.toccate.size} su ${Object.keys(PARTI).length}. Ancora schematica, appesa alla cicala.` },
        ],
      },
      {
        passo: 2, azione: comandiFondale, richiede: () => ['parti', 'inclina', 'riposo'].every((x) => lez.fatte.has(x)), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Dove dare fondo?' },
          { t: 'p', size: 36, testo: 'La tenuta dipende molto dal fondale in cui l\'ancora va a posizionarsi. Quale scegli?' },
          ...FONDALI.map(([id, testo]) => ({ t: 'scelta', id: `fo:${id}`, testo, on: fo.scelta === id })),
          ...lez.missioni().slice(6, 7),
        ],
        dx: [
          { t: 'spazio', h: 60 },
          ...(fondale ? [{ t: 'esito', tipo: fondale[2] ? 'giusto' : 'errato', testo: fondale[3] }] : [{ t: 'nota', testo: 'Scegli un fondale.' }]),
        ],
      },
      {
        passo: 2, azione: comandiTonneggio, richiede: () => lez.fatte.has('fondale'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Passiva o motorizzata?' },
          { t: 'riquadro', size: 38, testo: tn.i < ATTREZZI.length ? `${tn.i + 1} di ${ATTREZZI.length}: **${ATTREZZI[tn.i][0]}**` : 'Tutte le attrezzature sono classificate.' },
          { t: 'bottoni', h: 84, size: 34, lista: [{ id: 'tn:p', testo: 'Passiva' }, { id: 'tn:m', testo: 'Motorizzata' }] },
          { t: 'bottoni', h: 72, size: 32, lista: [{ id: 'tn:daccapo', testo: 'Da capo' }] },
          ...lez.missioni().slice(7),
        ],
        dx: [
          { t: 'spazio', h: 60 },
          ...(tn.esito ? [{ t: 'esito', ...tn.esito }] : [{ t: 'nota', testo: 'Le attrezzature di tonneggio (shipboard fitting) sono passive o motorizzate. Slide 23.' }]),
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'b' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'La maglia diversa è una **Kenter**. Il numero di maglie dipinte per lato è il numero della lunghezza di catena: **tre maglie, terza lunghezza**. {{slide 5}}' },
          { t: 'formula', testo: '3 × 27,5 m = 82,5 m' },
        ],
        dx: [
          { t: 'titolo', testo: 'Lunghezze di catena' },
          { t: 'p', size: 36, testo: 'Le maglie, in numero dispari, formano tratti non più lunghi di **27,5 m** (15 *fathoms*, 90 piedi): le **lunghezze di catena** (*shackles lengths*). Per ogni ancora possono essere più di una decina. {{slide 4}}' },
          { t: 'p', size: 36, testo: 'Le unisce la **maglia Kenter** (*kenter shackle*), apribile: chiusa sembra uguale alle altre, perciò si dice **falsa maglia**. {{slide 4}}' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Contare la catena' },
          { t: 'p', size: 36, testo: 'Le maglie ai lati della Kenter sono dipinte di un altro colore: un numero crescente per lato, una per la prima lunghezza, due per la seconda e così via. {{slide 5}}' },
          { t: 'p', size: 36, testo: 'Così l\'equipaggio a prua conta le lunghezze mentre la catena scorre dal pozzo verso la cubia. {{slide 5}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il penzolo di cima' },
          { t: 'p', size: 34, testo: 'Un capo della catena è fissato alle strutture della nave nel pozzo delle catene; l\'altro arriva all\'ancora con il **penzolo di cima** (*outboard shot*, *fore runner*). {{slide 6}}' },
          { t: 'tabella', col: [8, 92], size: 32, righe: [
            ['', 'Dalla catena all\'ancora'],
            ['1', 'falsa maglia Kenter'], ['2', 'una o più maglie comuni con traversino (*common stud link*)'],
            ['3', 'maglia rinforzata, tornichetto (a mulinello), maglia rinforzata'], ['4', 'maglia capotesta senza traversino'],
            ['5', 'maniglione d\'ancora (*anchor shackle*), collegato alla cicala'],
          ] },
          { t: 'nota', testo: 'slide 7-9' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Le qualità di un\'ancora' },
          { t: 'tabella', col: [30, 70], size: 32, righe: [
            ['Qualità', 'Che cosa vuol dire'],
            ['Presa (*grip*)', 'penetrare nel fondale'],
            ['Tenuta (*holding power*)', 'restare in posizione dopo aver fatto presa'],
            ['Spedare (*trip*, *break ground*)', 'svellersi facilmente alla ripartenza'],
          ] },
          { t: 'p', size: 34, testo: 'Le ancore portano spesso il nome di chi le ha progettate. {{slide 11}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il fondale' },
          { t: 'p', size: 36, testo: '**Buon tenitore**: più sabbie (*sand*) e argille (*clay*) che limi (*silt*), con effetto «cemento fresco». {{slide 12}}' },
          { t: 'p', size: 36, testo: 'Da evitare: sole sabbie, spessi strati di alghe e i rari fondali rocciosi, dove l\'ancora può **incattivarsi** (*fouling*). {{slide 12}}' },
          { t: 'p', size: 34, testo: 'La resistenza alla trazione si prova con un rimorchiatore (*bollard pull*) o a terra con dinamometri. {{slide 13}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Quante ancore' },
          { t: 'p', size: 36, testo: 'Due **ancore di posta** (*bower anchor*), nell\'occhio di cubia e pronte all\'uso, e un\'**ancora di rispetto** (*spare anchor*), di solito sul castello di prua. {{slide 14}}' },
          { t: 'p', size: 36, testo: 'Il **ceppo** (*stock*) era un elemento orizzontale delle ancore a marre fisse: le teneva inclinate sul fondo. Oggi resta sui velieri storici. {{slide 15}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Potere ancorante' },
          { t: 'tabella', col: [56, 44], size: 32, righe: [
            ['Ancora', 'Peso rispetto alla tabella'],
            ['Ordinary stockless bower', '100%'],
            ['Ordinary stocked bower', '100%'],
            ['HHP (*High Holding Power*)', 'fino al 75%'],
            ['SHHP (*Super High Holding Power*)', 'fino al 50%'],
          ] },
          { t: 'nota', testo: 'slide 16: peso della tabella del modulo di armamento, lezione 12' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'L\'ancora Hall' },
          { t: 'p', size: 34, testo: 'È tra le più diffuse ancore senza ceppo: fuso, testa con le marre, contromarre e cicala. {{slide 17}}' },
          { t: 'p', size: 34, testo: 'È a **marre articolate**: la testa si inclina fino a circa 40°. Tirata quasi in orizzontale, entrambe le marre penetrano nel fondale; il fuso entra in cubia e l\'ancora resta sospesa, pronta all\'uso. {{slide 18}}' },
          { t: 'p', size: 34, testo: 'Bilanciata (*balanced*) se da sospesa le marre restano parallele al fuso, non bilanciata (*unbalanced*) se restano inclinate. {{slide 19}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Fusa o saldata' },
          { t: 'p', size: 34, testo: 'Si costruisce per fusione o, oggi meglio, saldando più elementi (*fabricated*): i registri fissano materiali, procedure e qualifiche del saldatore. {{slide 20}}' },
          { t: 'p', size: 34, testo: 'Le grosse ancore fuse hanno mostrato criticità nella resistenza dei fusi. La forma si studia sul progetto dell\'occhio di cubia. {{slide 20, 21}}' },
          { t: 'p', size: 34, testo: 'Ancore speciali: per l\'offshore, o con una sola marra come la bruce e la CQR, nel diporto. {{slide 21}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il tonneggio' },
          { t: 'p', size: 34, testo: 'Le **attrezzature di tonneggio** (*shipboard fitting*) governano catene e cavi. Contano saldature, bulloni e basamenti: lì arriva il carico di lavoro. {{slide 23}}' },
          { t: 'formula', testo: 'carico di progetto = 1,25 × rottura dei cavi' },
          { t: 'formula', testo: 'SWL ≤ 80% del carico di progetto' },
          { t: 'nota', testo: 'IACS, slide 24' },
        ],
        dx: [
          { t: 'titolo', testo: 'I piani a bordo' },
          { t: 'tabella', col: [8, 92], size: 32, righe: [
            ['', 'Che cosa riportano'],
            ['1', 'posizione a bordo'], ['2', 'tipo: argano, verricello…'], ['3', 'SWL'],
            ['4', 'uso: ormeggio o rimorchio'],
            ['5', 'collegamento con i cavi, con la direzione di arrivo (*fleet angle*) e i limiti'],
          ] },
          { t: 'nota', testo: 'slide 24' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Bitte, passacavi, monachelle' },
          { t: 'p', size: 34, testo: '**Bitte** (*bollard*): due colonne su cui avvolgere il cavo «a 8». **Passacavi** (*chock*): il cavo attraversa il parapetto (*bulwark*); con elementi rotanti sono **a rulli multipli** (*fairlead*). {{slide 25}}' },
          { t: 'p', size: 34, testo: '**Monachelle** (*pedestal roller*): colonnine a testa girevole che fanno da rinvio, per dare al cavo in tensione una traiettoria precisa. {{slide 27}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Argani e verricelli' },
          { t: 'p', size: 34, testo: 'Motore, **tamburi** (*drum*, *barrel*) per avvolgere i cavi e **campane** (*warping end*) per tenderli. **Argani** (*capstan*) ad asse verticale, **verricelli** (*winch*) ad asse orizzontale. {{slide 26}}' },
          { t: 'p', size: 34, testo: 'I verricelli autormeggianti regolano da soli la tensione, lascando o virando il cavo, per esempio al variare dell\'immersione. {{slide 26}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il mulinello salpaancore' },
          { t: 'p', size: 36, testo: 'Sul castello, il **mulinello salpaancore** (*windlass*): uno o due motori muovono una **ruota ad impronte** (*gipsy*) per ancora, più tamburi o campane per i cavi. {{slide 28}}' },
          { t: 'p', size: 36, testo: 'Il **freno** (*brake*) regola la discesa della catena filata in mare. {{slide 29}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'L\'arrestatoio' },
          { t: 'p', size: 36, testo: 'Tra il mulinello e lo **sbocco di cubia** (*deck hawsehole*) c\'è l\'**arrestatoio** (*chain stopper*) con gancio: in navigazione tiene ferma la catena, e quindi l\'ancora. {{slide 29}}' },
        ],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci e calcola' }, ...lez.domanda(1), ...lez.domanda(2), ...lez.domanda(3)],
        dx: [{ t: 'nota', testo: 'Domande sulle definizioni e sul carico di progetto della slide 24. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(4), ...lez.domanda(5), ...lez.domanda(6)],
      },
      lez.premio(() => lez.fatto.quiz(QUIZ.map((q) => q.n))),
    ];
  });
})();
