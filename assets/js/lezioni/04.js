/* Lezione 4: identità amministrativa e classificazione delle navi. Definizioni dalle slide 2-26.
   Le slide non hanno esercizi né misure: nome, porto e numero IMO della nave sono d'esempio, gli spazi
   della stazza sono schematici e senza volumi */
(function () {
  const N = 4;
  const { COL, etichetta, maniglia, cuoci } = Tavola;
  const Y_ACQUA = 6;

  const MISSIONI = [
    { id: 'nome', testo: 'Dai un nuovo nome alla nave.' },
    { id: 'bandiera', testo: 'Iscrivi la nave nel registro di un altro Stato.' },
    { id: 'imo', testo: 'Dopo i cambi, tocca il numero IMO sulla poppa.' },
    { id: 'documenti', testo: 'Metti ogni documento al suo posto.' },
    { id: 'lorda', testo: 'Mostra gli spazi della stazza lorda.' },
    { id: 'netta', testo: 'Mostra gli spazi della stazza netta.' },
    { id: 'fuori', testo: 'Tocca i quattro spazi che la stazza netta non conta.' },
  ];
  const QUIZ = [
    { n: 1, testo: 'Da quante cifre è formato il numero IMO?', scelte: ['5', '7', '9'], giusta: 1, perche: 'Sette cifre e, contrariamente al nome, non cambia mai per tutta la vita della nave.' },
    { n: 2, testo: 'Il documento di base per l\'identificazione amministrativa della nave è…', scelte: ['Il ruolo equipaggio', 'L\'atto di nazionalità', 'Il giornale nautico'], giusta: 1, perche: 'È l\'atto di nazionalità (ship registry certificate).' },
    { n: 3, testo: 'Una tonnellata di stazza equivale a…', scelte: ['1000 kg', '100 piedi cubi', '1 m³'], giusta: 1, perche: 'La stazza è un volume: una tonnellata di stazza vale 100 piedi cubi.' },
    { n: 4, testo: 'A quale stazza ci si riferisce per le tasse marittime e il contratto di trasporto?', scelte: ['Stazza lorda', 'Stazza netta', 'A nessuna delle due'], giusta: 1, perche: 'Alla stazza netta (NT).' },
    { n: 5, testo: 'Come chiama l\'IMO le Società di classificazione autorizzate da uno Stato?', scelte: ['Recognized Organizations', 'Central Administration', 'Port State Control'], giusta: 0, perche: 'Recognized Organizations (ROs).' },
    { n: 6, testo: 'Ogni quanti anni si fa la visita di rinnovo del certificato di classe?', scelte: ['Ogni anno', 'Ogni 3 anni', 'Ogni 5 anni'], giusta: 2, perche: 'Class renewal survey: ogni 5 anni.' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ });

  /* Simulazione 1: nome, bandiera e numero IMO sulla poppa (slide 2). Nomi e numero d'esempio ---- */
  const NOMI = ['STELLA MARIS', 'AURORA', 'CAPO MISENO'];
  const REGISTRI = [
    { stato: 'Italia', porto: 'NAPOLI', disegna(c, w, h) { ['#1E8A4C', '#FFFFFF', '#C8202A'].forEach((col, i) => { c.fillStyle = col; c.fillRect((i * w) / 3, 0, w / 3 + 1, h); }); } },
    { stato: 'Malta', porto: 'VALLETTA', disegna(c, w, h) { c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, w / 2, h); c.fillStyle = '#C8202A'; c.fillRect(w / 2, 0, w / 2, h); } },
    {
      stato: 'Grecia', porto: 'PIREO',
      disegna(c, w, h) {
        for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? '#FFFFFF' : '#1B5FAA'; c.fillRect(0, (i * h) / 9, w, h / 9 + 1); }
        const q = (5 * h) / 9; c.fillStyle = '#1B5FAA'; c.fillRect(0, 0, q, q);
        c.fillStyle = '#FFFFFF'; c.fillRect(q * 0.4, 0, q * 0.2, q); c.fillRect(0, q * 0.4, q, q * 0.2);
      },
    },
  ];
  const IMO = '9123456';
  const po = { nome: 0, reg: 0, cambi: 0, copie: [] };
  function tela(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
  function dipingiPoppa() {
    po.copie.forEach(({ targa, bandiera }) => {
      let c = targa.image.getContext('2d');
      c.fillStyle = Scafo.TINTE.murata; c.fillRect(0, 0, 1024, 256);
      c.fillStyle = '#FBFAF4'; c.textAlign = 'center';
      c.font = '700 112px Bitter, Georgia, serif'; c.fillText(NOMI[po.nome], 512, 120);
      c.font = '700 80px Atkinson, sans-serif'; c.fillText(REGISTRI[po.reg].porto, 512, 222);
      targa.needsUpdate = true;
      c = bandiera.image.getContext('2d');
      REGISTRI[po.reg].disegna(c, 300, 200);
      bandiera.needsUpdate = true;
    });
  }
  const creaPoppa = Lezione.simula({
    k: 5, pedana: [-24, 8, 'a poppa'], dopo: dipingiPoppa,
    vista: () => ({ target: new THREE.Vector3(2, 4, 0), theta: -1.25, phi: 1.36, r: 34 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -Y_ACQUA;
      g.add(Scafo.crea(k));
      const targa = tela(1024, 256); const bandiera = tela(300, 200);
      // Nome e porto di iscrizione sullo specchio di poppa
      const p1 = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.9), new THREE.MeshBasicMaterial({ map: targa }));
      p1.rotation.y = -Math.PI / 2; p1.position.set(-0.2, 7.15, 0); g.add(p1);
      // Numero IMO: si tocca
      const imoTex = Tavola.tela(512, 96, (c) => {
        c.fillStyle = Scafo.TINTE.murata; c.fillRect(0, 0, 512, 96);
        c.fillStyle = '#FBFAF4'; c.font = '700 64px Atkinson, sans-serif'; c.textAlign = 'center'; c.fillText(`IMO ${IMO}`, 256, 72);
      });
      const p2 = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.85), new THREE.MeshBasicMaterial({ map: imoTex }));
      p2.rotation.y = -Math.PI / 2; p2.position.set(-0.22, 6.1, 0); p2.userData.tocco = 'imo'; g.add(p2); tocca(p2);
      // Asta e bandiera dello Stato di iscrizione
      g.add(Tavola.segmento(new THREE.Vector3(0.6, 8.2, 0), new THREE.Vector3(0.6, 16.4, 0), 0.07 * Math.sqrt(k), COL.inchiostro));
      const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.4), new THREE.MeshBasicMaterial({ map: bandiera, side: THREE.DoubleSide }));
      b.position.set(-1.2, 15, 0); g.add(b);
      po.copie.push({ targa, bandiera });
      return g;
    },
  });
  function comandiPoppa(id) {
    if (id === 'nuovo-nome') { po.nome = (po.nome + 1) % NOMI.length; po.cambi += 1; lez.completa('nome'); }
    if (id === 'nuova-bandiera') { po.reg = (po.reg + 1) % REGISTRI.length; po.cambi += 1; lez.completa('bandiera'); }
    if (id.startsWith('t:') && id.slice(2).split(',').includes('imo')) {
      po.toccato = true;
      if (lez.fatte.has('nome') && lez.fatte.has('bandiera')) lez.completa('imo');
    }
    dipingiPoppa(); Motore.sporco();
  }

  /* Simulazione 2: carte, libri e certificati (slide 4, 5, 13, 17) ----------------------------- */
  const SCAFFALI = [['c', 'Carte di bordo'], ['l', 'Libri di bordo'], ['k', 'Certificati']];
  const DOCUMENTI = [
    ['Atto di nazionalità', 'c', 'Con il ruolo equipaggio forma le carte di bordo.'],
    ['Giornale nautico', 'l', 'È un libro di bordo: fonte ufficiale delle operazioni svolte a bordo.'],
    ['Certificato di classe', 'k', 'Rilasciato da una Società di classificazione.'],
    ['Ruolo equipaggio', 'c', 'Con l\'atto di nazionalità forma le carte di bordo.'],
    ['Giornale di macchina', 'l', 'È un libro di bordo.'],
    ['Certificato Internazionale di Stazza', 'k', 'Riporta la stazza lorda e la netta; va tenuto sempre a bordo.'],
    ['Giornale Radiotelegrafico', 'l', 'È un libro di bordo.'],
    ['Cargo Ship Safety Certificate', 'k', 'Certificato di sicurezza di base.'],
  ];
  const dc = { i: 0, x: 0, z: 0, esito: null, copie: [] };
  const XS = (i) => -30 + i * 30;
  function posaDocumento() {
    dc.copie.forEach((c) => {
      c.nomi.forEach((e, i) => { e.visible = i === dc.i; });
      const resta = dc.i < DOCUMENTI.length;
      c.foglio.visible = resta; c.presa.visible = resta;
      c.foglio.position.set(dc.x, 1, 14 + dc.z); c.presa.position.set(dc.x, 4, 14 + dc.z);
      c.fatti.forEach((m, i) => { m.visible = i < dc.i; });
    });
  }
  function archivia(id) {
    if (dc.i >= DOCUMENTI.length) return;
    const [nome, giusto, perche] = DOCUMENTI[dc.i];
    if (id === giusto) {
      dc.esito = { tipo: 'giusto', testo: `${nome}: ${perche}` };
      dc.i += 1;
      if (dc.i === DOCUMENTI.length) lez.completa('documenti');
    } else dc.esito = { tipo: 'errato', testo: `${nome} non va lì: riprova.` };
    dc.x = 0; dc.z = 0; posaDocumento();
  }
  const creaDocumenti = Lezione.simula({
    scala: 0.0125, centro: [0, 3], k: 3, mare: false, pedana: [0, 40, 'davanti agli scaffali'], dopo: posaDocumento,
    vista: () => ({ target: new THREE.Vector3(0, 7, 0), theta: 0, phi: 1.12, r: 80 }),
    modello(k, tocca) {
      const g = new THREE.Group(); const dim = 3 + k * 0.5;
      const pavimento = new THREE.Mesh(cuoci(new THREE.BoxGeometry(110, 1, 70), '#D8E0EC'), new THREE.MeshBasicMaterial({ vertexColors: true }));
      pavimento.position.set(0, -0.5, 0); g.add(pavimento);
      SCAFFALI.forEach(([id, nome], i) => {
        const m = new THREE.Mesh(cuoci(new THREE.BoxGeometry(24, 14, 8), i % 2 ? '#C9A227' : '#13315C'), new THREE.MeshBasicMaterial({ vertexColors: true }));
        m.position.set(XS(i), 7, -16); m.userData.tocco = id; g.add(m); tocca(m);
        const e = etichetta(nome, dim + 2, '#0B2545'); e.position.set(XS(i), 18.5, -16); g.add(e);
      });
      const foglio = new THREE.Mesh(cuoci(new THREE.BoxGeometry(6, 0.8, 8), '#FBFAF4'), new THREE.MeshBasicMaterial({ vertexColors: true }));
      foglio.position.set(0, 1, 14); g.add(foglio);
      const nomi = DOCUMENTI.map(([t]) => { const e = etichetta(t, dim + 0.6, '#0B2545'); e.position.set(0, 8, 14); g.add(e); return e; });
      const presa = maniglia(1.6 + k * 0.4, 'doc'); presa.position.set(0, 4, 14); g.add(presa); tocca(presa);
      presa.userData.vincolo = { piano: [0, 1, 0] }; // il documento si porta sul pavimento fino allo scaffale
      // Documenti già archiviati: un dorso per ciascuno sullo scaffale giusto
      const conta = {};
      const fatti = DOCUMENTI.map((d) => {
        const q = SCAFFALI.findIndex(([id]) => id === d[1]); conta[q] = (conta[q] || 0) + 1;
        const m = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 2), new THREE.MeshBasicMaterial({ color: 0xFBFAF4 }));
        m.position.set(XS(q) - 9 + conta[q] * 3.2, 7, -11.5); g.add(m); return m;
      });
      dc.copie.push({ foglio, presa, nomi, fatti });
      return g;
    },
    trascina(id, dx, dy, info) {
      if (info) { dc.x += info.v.x; dc.z += info.v.z; } else dc.x += dx * 0.1;
      dc.x = Math.max(-40, Math.min(40, dc.x)); dc.z = Math.max(-24, Math.min(8, dc.z));
      posaDocumento();
    },
  });
  function comandiDocumenti(id) {
    if (id.startsWith('t:')) { const t = id.slice(2).split(',')[0]; if (t !== 'doc') archivia(t); }
    if (id === 'lascia:doc' && (Math.abs(dc.x) > 3 || dc.z < -8)) {
      let vic = 0; SCAFFALI.forEach((s, i) => { if (Math.abs(XS(i) - dc.x) < Math.abs(XS(vic) - dc.x)) vic = i; });
      archivia(SCAFFALI[vic][0]);
    }
    if (id === 'lascia:doc' && dc.i < DOCUMENTI.length && (dc.x || dc.z)) { dc.x = 0; dc.z = 0; posaDocumento(); }
    if (id === 'daccapo') { dc.i = 0; dc.esito = null; dc.x = 0; dc.z = 0; posaDocumento(); }
    Motore.sporco();
  }

  /* Simulazione 3: stazza lorda e netta (slide 11, 12). Spazi schematici, senza volumi ----------- */
  const SPAZI = [
    { id: 'stiva1', nome: 'Stiva 1', carico: true, box: [24, 37, 1.5, 7, -5.4, 5.4] },
    { id: 'stiva2', nome: 'Stiva 2', carico: true, box: [39, 51, 1.5, 7, -5.4, 5.4] },
    { id: 'stiva3', nome: 'Stiva 3', carico: true, box: [53, 65, 1.5, 7, -5.4, 5.4] },
    { id: 'macchine', nome: 'Sala macchine', carico: false, box: [5.5, 20, 1.5, 7, -4.8, 4.8] },
    { id: 'cabine', nome: 'Cabine equipaggio', carico: false, box: [3, 16.5, 8, 12.8, -4.6, 4.6] },
    { id: 'zavorra', nome: 'Casse di zavorra', carico: false, box: [22, 67, 0.2, 1.3, -5.8, 5.8] },
    { id: 'gavoni', nome: 'Gavoni', carico: false, box: [1.5, 5, 4.8, 7, -3, 3], box2: [76, 84, 2.5, 7, -1.4, 1.4] },
  ];
  const FUORI = SPAZI.filter((s) => !s.carico).map((s) => s.id);
  const sz = { modo: '', scelto: null, toccati: new Set(), copie: [] };
  function velata(k) {
    const n = Scafo.crea(k);
    n.traverse((o) => {
      if (o.isMesh && (o.material.map || o.material.vertexColors)) {
        o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.24; o.material.depthWrite = false;
      }
    });
    return n;
  }
  const conta = (s) => sz.modo === 'gt' || (sz.modo === 'nt' && s.carico);
  function posaStazza() {
    sz.copie.forEach((c) => {
      SPAZI.forEach((s) => {
        c.pieni[s.id].forEach((m) => m.material.color.set(conta(s) ? '#C9A227' : '#FBF9F1'));
        c.nomi[s.id].visible = sz.scelto === s.id;
      });
    });
  }
  const creaStazza = Lezione.simula({
    k: 5, mare: false, pedana: [45, 30, 'a dritta'], dopo: posaStazza,
    vista: () => ({ target: new THREE.Vector3(45, -1, 0), theta: 0.45, phi: 1.2, r: 98 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -Y_ACQUA; const dim = 4 + k * 0.5;
      g.add(velata(k));
      const pieni = {}; const nomi = {};
      SPAZI.forEach((s) => {
        pieni[s.id] = [];
        [s.box, s.box2].filter(Boolean).forEach((b) => {
          const sc = Tavola.scatola(...b, 0.06 * Math.sqrt(k), COL.inchiostro);
          const pieno = sc.children[0]; pieno.userData.tocco = s.id; tocca(pieno); pieni[s.id].push(pieno);
          g.add(sc);
        });
        const e = etichetta(s.nome, dim, '#0B2545');
        e.position.set((s.box[0] + s.box[1]) / 2, 18, 0); e.visible = false; g.add(e); nomi[s.id] = e;
      });
      sz.copie.push({ pieni, nomi });
      return Tavola.compatta(g);
    },
  });
  function comandiStazza(id) {
    if (id === 'gt') { sz.modo = 'gt'; lez.completa('lorda'); }
    if (id === 'nt') { sz.modo = 'nt'; lez.completa('netta'); }
    if (id.startsWith('t:')) {
      const s = SPAZI.find((x) => id.slice(2).split(',').includes(x.id));
      if (s) {
        sz.scelto = s.id;
        if (!s.carico) sz.toccati.add(s.id);
        if (FUORI.every((f) => sz.toccati.has(f))) lez.completa('fuori');
      }
    }
    posaStazza(); Motore.sporco();
  }
  function schedaSpazio() {
    const s = SPAZI.find((x) => x.id === sz.scelto);
    if (!s) return 'Tocca uno spazio della nave.';
    return s.carico
      ? `**${s.nome}**: spazio destinato a contenere il carico. Conta nella stazza lorda e nella netta.`
      : `**${s.nome}**: spazio chiuso, ma non per il carico. Conta nella stazza lorda, non nella netta.`;
  }

  /* Calendario delle visite di classe (slide 25): disegno su tela, senza dati in più -------------- */
  function calendario(c, x, y, w, h) {
    const { C, font } = Pagina;
    const ox = x + 30; const gw = w - 60; const ay = y + h - 70;
    const X = (a) => ox + (a / 5) * gw;
    c.strokeStyle = C.ink; c.lineWidth = 4; c.beginPath(); c.moveTo(ox, ay); c.lineTo(ox + gw, ay); c.stroke();
    c.font = font('n', 32); c.fillStyle = C.ink2; c.textAlign = 'center';
    for (let a = 0; a <= 5; a++) { c.beginPath(); c.moveTo(X(a), ay - 12); c.lineTo(X(a), ay + 12); c.stroke(); c.fillText(`${a}`, X(a), ay + 50); }
    // Finestra della visita intermedia: tra il secondo e il terzo anno
    c.fillStyle = 'rgba(201,162,39,0.28)'; c.fillRect(X(2), y + 70, X(3) - X(2), ay - y - 70);
    c.fillStyle = C.ocraT; c.font = font('b', 32); c.fillText('Intermediate', (X(2) + X(3)) / 2, y + 110);
    // Visite annuali
    c.fillStyle = C.ink;
    [1, 2, 3, 4].forEach((a) => { c.beginPath(); c.arc(X(a), ay - 60, 16, 0, Math.PI * 2); c.fill(); });
    c.font = font('n', 32); c.fillText('Annual', X(1), ay - 92);
    // Assegnazione e rinnovo
    c.fillStyle = C.verde; c.beginPath(); c.arc(X(0), ay - 60, 22, 0, Math.PI * 2); c.fill();
    c.fillStyle = C.rosso; c.beginPath(); c.arc(X(5), ay - 60, 22, 0, Math.PI * 2); c.fill();
    c.font = font('b', 32); c.textAlign = 'left'; c.fillStyle = C.verde; c.fillText('Classe', X(0) - 10, y + 40);
    c.textAlign = 'right'; c.fillStyle = C.rosso; c.fillText('Class renewal', X(5) + 10, y + 40);
    c.textAlign = 'center'; c.fillStyle = C.ink2; c.font = font('n', 32); c.fillText('anni dall\'assegnazione della classe', ox + gw / 2, ay + 92);
    c.textAlign = 'left';
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { n: 'il nome', b: 'la nazionalità', i: 'il numero IMO' };
    const reg = REGISTRI[po.reg];
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Chi è questa nave?' },
          { t: 'p', testo: 'Una nave è individuata a livello amministrativo e legale da tre dati principali. {{slide 2}}' },
          { t: 'tabella', col: [34, 66], size: 34, righe: [
            ['Dato', 'Che cos\'è'],
            ['Nome (*name*)', 'va riportato in modo leggibile sullo specchio di poppa'],
            ['Nazionalità (*nationality*)', 'lo Stato nei cui registri è immatricolata: ne espone la bandiera'],
            ['Stazza (*tonnage*)', 'la misura del suo volume interno'],
          ] },
        ],
        dx: [
          { t: 'titolo', testo: 'La «targa»' },
          { t: 'p', testo: 'A questi dati si aggiunge il **numero IMO** (*IMO number*): sette cifre che non cambiano mai per tutta la vita della nave, contrariamente al nome. {{slide 2}}' },
          { t: 'formula', testo: `IMO ${IMO}` },
          { t: 'nota', testo: 'Numero d\'esempio: sette cifre.' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'Una nave viene venduta: il nuovo armatore le cambia nome e la iscrive nel registro di un altro Stato.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Che cosa resta uguale per tutta la vita della nave?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:n', testo: 'Il nome', on: p === 'n' },
          { t: 'scelta', id: 'p:b', testo: 'La nazionalità', on: p === 'b' },
          { t: 'scelta', id: 'p:i', testo: 'Il numero IMO', on: p === 'i' },
        ],
      },
      {
        passo: 2, mondo: creaPoppa, azione: comandiPoppa, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'La poppa della nave' },
          { t: 'riquadro', size: 36, testo: `Nome **${NOMI[po.nome]}**, iscritta a **${reg.porto}** (${reg.stato}). Numero **IMO ${IMO}**.` },
          { t: 'bottoni', h: 88, size: 32, lista: [{ id: 'nuovo-nome', testo: 'Cambia nome' }, { id: 'nuova-bandiera', testo: 'Cambia registro' }] },
          ...(po.toccato ? [{ t: 'esito', tipo: 'giusto', testo: po.cambi ? `Dopo ${po.cambi} ${po.cambi === 1 ? 'cambio' : 'cambi'} il numero IMO è sempre ${IMO}.` : `Numero IMO ${IMO}.` }] : []),
          ...lez.missioni().slice(0, 3),
        ],
        dx: [
          ...Lezione.finestra(760, 'Punta i comandi sulla pagina; il numero IMO si tocca col grilletto.'),
          { t: 'nota', testo: 'Nomi, porti e numero IMO d\'esempio. Disegno schematico.' },
        ],
      },
      {
        passo: 2, mondo: creaDocumenti, azione: comandiDocumenti, richiede: () => lez.fatte.has('imo'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'I documenti di bordo' },
          { t: 'riquadro', size: 38, testo: dc.i < DOCUMENTI.length ? `Documento ${dc.i + 1} di ${DOCUMENTI.length}: **${DOCUMENTI[dc.i][0]}**` : 'Tutti i documenti sono al loro posto.' },
          ...(dc.esito ? [{ t: 'esito', ...dc.esito }] : []),
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'daccapo', testo: 'Da capo' }] },
          ...lez.missioni().slice(3, 4),
          { t: 'nota', testo: 'Trascina il documento sullo scaffale giusto, oppure tocca lo scaffale.' },
        ],
        dx: Lezione.finestra(760, 'Porta la sfera d\'oro con il documento fino allo scaffale, oppure punta lo scaffale e premi il grilletto.'),
      },
      {
        passo: 2, mondo: creaStazza, azione: comandiStazza, richiede: () => lez.fatte.has('documenti'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Stazza lorda e netta' },
          { t: 'bottoni', h: 88, size: 32, lista: [{ id: 'gt', testo: 'Stazza lorda GT', on: sz.modo === 'gt' }, { id: 'nt', testo: 'Stazza netta NT', on: sz.modo === 'nt' }] },
          { t: 'riquadro', size: 36, testo: schedaSpazio() },
          ...lez.missioni().slice(4),
          { t: 'nota', testo: `In ocra gli spazi contati. Spazi schematici, senza volumi. Toccati fuori dalla netta: ${sz.toccati.size} su ${FUORI.length}.` },
        ],
        dx: Lezione.finestra(760, 'Punta uno spazio della nave e premi il grilletto.'),
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'i' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Il nome si può cambiare, e con un cambio di registro cambia anche la bandiera. Il **numero IMO** invece non cambia mai per tutta la vita della nave. {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'L\'atto di nazionalità' },
          { t: 'p', size: 36, testo: 'È il documento di base per l\'identificazione: **atto di nazionalità** (*ship registry certificate*). Secondo l\'art. 150 del Codice della Navigazione contiene: {{slide 3}}' },
          { t: 'tabella', col: [8, 92], size: 32, righe: [
            ['', 'Contenuto'], ['1', 'nome della nave'], ['2', 'tipo e caratteristiche principali'], ['3', 'stazza lorda e netta'], ['4', 'nome del proprietario'], ['5', 'ufficio di immatricolazione'],
          ] },
          { t: 'p', size: 34, testo: 'Navi minori e galleggianti hanno invece la **licenza di navigazione**.' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Carte e libri di bordo' },
          { t: 'p', size: 38, testo: 'Le **carte di bordo** sono l\'atto di nazionalità e il **ruolo equipaggio** (*crew role logbook*). {{slide 4}}' },
          { t: 'p', size: 38, testo: 'I **libri di bordo** sono la fonte ufficiale per la tracciabilità delle operazioni svolte a bordo: Giornale nautico, Giornale di macchina, Giornale Radiotelegrafico. {{slide 4}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'I certificati' },
          { t: 'p', size: 36, testo: 'Attestano l\'idoneità della nave: caratteristiche tecniche, sicurezza, igiene, tutela dell\'ambiente marino. Li rilascia lo Stato. {{slide 5}}' },
          { t: 'p', size: 36, testo: 'Il più importante, il **certificato di classe**, lo rilascia invece una Società di classificazione. {{slide 5}}' },
          { t: 'p', size: 34, testo: 'Le Società rilasciano anche quasi tutti gli altri, per conto dello Stato di bandiera: è la certificazione statutaria. {{slide 6}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'La stazza' },
          { t: 'p', size: 38, testo: 'È il volume degli spazi chiusi della nave: più che un dato tecnico, è il riferimento amministrativo e identificativo. {{slide 7}}' },
          { t: 'formula', testo: '1 t di stazza = 100 piedi cubi' },
          { t: 'p', size: 34, testo: 'Oggi i volumi si calcolano in metri cubi con gli algoritmi della *International Convention on Tonnage Measurement of Ships*, in vigore dal 1982. {{slide 9}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Perché «tonnellate»' },
          { t: 'p', size: 36, testo: 'Nel Trecento, in Inghilterra, le navi erano tassate secondo i barili di vino che potevano caricare. Il barile si chiamava **tun** (almeno 252 galloni); il numero di tun era il **tunnage**, il tonnellaggio. {{slide 10}}' },
          { t: 'p', size: 36, testo: 'Nei porti si vide poi che una tonnellata di merce alla rinfusa occupava circa 100 piedi cubi. {{slide 10}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Lorda e netta' },
          { t: 'tabella', col: [24, 76], size: 32, righe: [
            ['Stazza', 'Che cosa misura'],
            ['Lorda GT (*gross tonnage*)', 'tutti gli spazi chiusi, fuori ossatura, tranne recessi e aperture con scarsi o assenti sistemi di chiusura'],
            ['Netta NT (*net tonnage*)', 'gli spazi destinati al carico: la lorda meno sala macchine, casse di zavorra, gavoni, cabine equipaggio…'],
          ] },
          { t: 'nota', testo: 'slide 11, 12' },
        ],
        dx: [
          { t: 'titolo', testo: 'A che cosa servono' },
          { t: 'tabella', col: [24, 76], size: 32, righe: [
            ['Stazza', 'Riferimento per'],
            ['Lorda', 'identificare la nave, con nome e nazionalità; titoli professionali marittimi; tasse di registrazione; requisiti delle Convenzioni'],
            ['Netta', 'tasse marittime e costi del contratto di trasporto'],
            ['Entrambe', 'tariffe dei servizi: pilotaggio, rimorchio, ormeggio'],
          ] },
          { t: 'p', size: 32, testo: 'Le riporta il Certificato Internazionale di Stazza, sempre a bordo. {{slide 11–13}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Chi certifica' },
          { t: 'p', size: 36, testo: 'Rilasciare i certificati di sicurezza spetta allo Stato di bandiera: la SOLAS indica l\'**Amministrazione Centrale** (*Central Administration*) come unico garante (Regulation 6, Chapter I). {{slide 14}}' },
          { t: 'p', size: 36, testo: 'Lo Stato può però delegare un ente tecnico: le **Società di classificazione** (*classification societies*), per l\'IMO *Recognized Organizations* (ROs). Questa è la **certificazione statutaria** (*statutory certification*). {{slide 14, 15}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'L\'RO Code' },
          { t: 'p', size: 36, testo: 'Fissa i criteri con cui gli Stati riconoscono le RO. Part 1 e Part 2 sono obbligatorie per SOLAS (Chapter XI-1, Regulation 1) e Load Lines; la Part 3 è «recommended». {{slide 16}}' },
          { t: 'p', size: 36, testo: 'Di solito uno Stato autorizza diverse Società come RO. {{slide 16}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Certificati di sicurezza' },
          { t: 'p', size: 34, testo: 'La certificazione statutaria riguarda soprattutto SOLAS e MARPOL, e codici come ISM e ISPS. I certificati di base (*safety certificates*): {{slide 17}}' },
          { t: 'tabella', col: [8, 92], size: 32, righe: [['', 'Certificato'], ['1', 'Passenger Ship Safety Certificate'], ['2', 'Cargo Ship Safety Construction Certificate'], ['3', 'Cargo Ship Safety Equipment Certificate'], ['4', 'Cargo Ship Safety Radio Certificate']] },
          { t: 'p', size: 32, testo: 'Per le navi da carico può bastare un unico Cargo Ship Safety Certificate.' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le ispezioni' },
          { t: 'p', size: 38, testo: 'Di base: una visita iniziale, una visita di rinnovo e visite occasionali. {{slide 18}}' },
          { t: 'tabella', col: [44, 56], size: 34, righe: [['Navi', 'Visita di rinnovo'], ['Passeggeri', 'ogni anno'], ['Da carico', 'ogni cinque anni']] },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Classificare una nave' },
          { t: 'p', size: 36, testo: 'La **classificazione delle navi** (*ships\' classification*) dà un giudizio sulla qualità di scafo e macchine e colloca la nave in categorie legate all\'attività e alle dotazioni. {{slide 19}}' },
          { t: 'p', size: 36, testo: 'La Società approva il progetto, segue la costruzione e le **prove in mare** (*sea trials*), poi ispeziona la nave a bordo. Rilascia il **certificato di classe** (*certificate of classification*). {{slide 20}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'IACS' },
          { t: 'p', size: 36, testo: 'Le Società più importanti formano la **IACS** (*International Association of Classification Societies*): supporto, consulenza, ricerca e procedure uniformi. {{slide 21}}' },
          { t: 'p', size: 34, testo: 'Tutti i membri seguono il sistema di qualità QSCS (*Quality Management System Certification Scheme*). Ogni Società ha comunque le sue regole e i suoi codici di classe. {{slide 22, 23}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Tenere la classe' },
          { t: 'p', size: 36, testo: 'La classe si assegna a fine costruzione, oppure con una visita apposita se la nave cambia registro. Si mantiene con il giudizio positivo nelle visite periodiche; altrimenti può essere sospesa o ritirata. {{slide 24}}' },
          { t: 'disegno', h: 420, fn: calendario },
          { t: 'nota', testo: 'slide 25. Bottom survey: almeno 2 volte in 5 anni, preferibilmente in bacino.' },
        ],
        dx: [
          { t: 'titolo', testo: 'Le altre visite' },
          { t: 'tabella', col: [34, 66], size: 32, righe: [
            ['Visita', 'Quando'],
            ['Bottom survey', 'parti esterne dello scafo, almeno 2 volte in 5 anni'],
            ['Tailshaft survey', 'asse dell\'elica e tunnel: da 2 anni e mezzo a 10 anni, secondo il sistema'],
            ['Boiler survey', 'caldaie: come le bottom surveys'],
            ['Occasional survey', 'quando serve: danni, cambio di dati amministrativi, prima di PSC o audit'],
          ] },
          { t: 'nota', testo: 'slide 25, 26' },
        ],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(1), ...lez.domanda(2), ...lez.domanda(3)],
        dx: [{ t: 'nota', testo: 'Le slide non hanno esercizi: domande sulle definizioni. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(4), ...lez.domanda(5), ...lez.domanda(6)],
      },
      lez.premio(() => lez.fatto.quiz(QUIZ.map((q) => q.n))),
    ];
  });
})();
