/* Lezione 12: allestimento navale, modulo di armamento e cavi. Definizioni e dati dalle slide 2-20.
   Formula di EN e tabella di ancore e catene dalle immagini delle slide 2 e 4; carichi di rottura dei cavi
   da 80 mm dalle slide 13-15; galleggiabilità di polipropilene e dyneema dalla slide 19.
   Le slide non danno Δ, B, H e A di una nave: li sceglie lo studente. La nave disegnata è quella comune */
(function () {
  const N = 12;
  const { COL, etichetta, segmento } = Tavola;
  const num = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const dato = (v) => (Number.isInteger(v) ? `${v}` : num(v)); // valori della tabella come nella slide
  const ACQUA = 6; // linea di massimo carico estiva dipinta sullo scafo comune

  const MISSIONI = [
    { id: 'h', testo: 'Trova il ponte fino a cui si misura H.' },
    { id: 'a', testo: 'Mostra l\'area A sulla nave.' },
    { id: 'en', testo: 'Trova grandezze con EN dentro la tabella.' },
    { id: 'riga', testo: 'Porta EN nell\'ultima fascia, da 450 a 500.' },
    { id: 'legnolo', testo: 'Tocca un legnolo e poi l\'anima del cavo.' },
    { id: 'commettitura', testo: 'Passa alla commettitura S e poi torna alla Z.' },
    { id: 'swl', testo: 'Trova un cavo da 80 mm con SWL di almeno 30 t.' },
    { id: 'galleggia', testo: 'Trova un cavo che galleggia con SWL oltre 20 t.' },
  ];
  const QUIZ = [
    { n: 1, testo: 'A che cosa serve il modulo di armamento EN?', scelte: ['A calcolare la stazza', 'A scegliere nelle tabelle ancore, catene e cavi', 'A fissare il bordo libero'], giusta: 1, perche: 'È il valore di ingresso delle tabelle dei registri di classificazione per l\'armamento marinaresco.' },
    { n: 2, testo: 'H si misura dalla linea di massimo carico estiva fino al ponte superiore…', scelte: ['del fumaiolo', 'dell\'ultima sovrastruttura larga più di B/4', 'del castello di prua'], giusta: 1, perche: 'Dell\'ultima sovrastruttura con larghezza superiore a 1/4 di B.' },
    { n: 3, testo: 'Con EN = 300, che cosa prescrive la tabella per le ancore?', scelte: ['3 ancore da 900 kg', '3 ancore da 780 kg', '2 ancore da 900 kg'], giusta: 0, perche: 'Fascia 280-320: 3 ancore da 900 kg e 357,5 m di catena.' },
    { n: 4, testo: 'La commettitura antioraria o destrorsa si indica con la lettera…', scelte: ['S', 'Z', 'L'], giusta: 1, perche: 'Z-twisted; quella oraria o sinistrorsa è S-twisted.' },
    { n: 5, testo: 'Carico di rottura 100 t, coefficiente di sicurezza 5: quanto vale il carico di lavoro SWL?', scelte: ['50 t', '20 t', '5 t'], giusta: 1, perche: '100 t / 5 = 20 t, cioè il 20% del carico di rottura.' },
    { n: 6, testo: 'Quale fibra è la più resistente all\'usura, poco elastica, ma non galleggia?', scelte: ['Polietilene', 'Poliestere', 'Polipropilene'], giusta: 1, perche: 'Il poliestere: oltre 150 t di carico di rottura per un cavo da 80 mm.' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ });
  const lastra = (colore, op) => new THREE.MeshBasicMaterial({ color: colore, side: THREE.DoubleSide, transparent: op < 1, opacity: op, depthWrite: op >= 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });

  /* Simulazione 1: le grandezze di EN sulla nave (slide 3). Ponti delle sovrastrutture dello scafo comune */
  const FP = Scafo.ascissa(1, ACQUA);
  const TOP = 15.2; // ponte di plancia: l'ultima sovrastruttura larga più di B/4
  const PONTI = [
    { id: 'fumaiolo', box: [5.4, 10.4, 12.9, 17.3, -1.7, 1.7], nome: 'Fumaiolo', testo: `**Fumaiolo**: largo 2,5 m, meno di B/4 = ${num(Scafo.B / 4, 2)} m. Non conta per H. {{slide 3}}` },
    { id: 'tuga', box: [3.6, 11.6, 12.7, 13.3, -5.4, 5.4], nome: 'Tetto della tuga', testo: '**Tetto della tuga**: sopra c\'è ancora la plancia, larga più di B/4. Non è l\'ultima sovrastruttura. {{slide 3}}' },
    { id: 'plancia', box: [11.6, 15.8, 14.9, 15.7, -6.8, 6.8], nome: 'Ponte di plancia', testo: `**Ponte di plancia**: è l'ultima sovrastruttura larga più di B/4. H va dalla linea di massimo carico estiva fin qui: nel disegno ${num(TOP - ACQUA)} m. {{slide 3}}` },
  ];
  const gr = { scelto: null, area: false, copie: [] };
  // Proiezione laterale fra le perpendicolari, nella fascia alta H sopra il galleggiamento
  function areaA() {
    const s = new THREE.Shape(); s.moveTo(0, ACQUA);
    for (let i = 0; i <= 40; i++) { const u = i / 40; const y = Scafo.insellatura(u); s.lineTo(Math.min(FP, Scafo.ascissa(u, y)), y); }
    s.lineTo(FP, ACQUA); s.lineTo(0, ACQUA);
    const pezzi = [new THREE.ShapeGeometry(s)];
    [[1.5, 18, 7.8, 10.4], [4, 15, 10.4, 13], [12, 15.4, 13, TOP], [5.8, 10, 13, TOP], [26, 36, 7.2, 8], [40, 50, 7.2, 8], [54, 64, 7.2, 8]].forEach(([x0, x1, y0, y1]) => {
      const r = new THREE.PlaneGeometry(x1 - x0, y1 - y0); r.translate((x0 + x1) / 2, (y0 + y1) / 2, 0); pezzi.push(r);
    });
    return pezzi;
  }
  function posaGrandezze() {
    gr.copie.forEach((c) => {
      PONTI.forEach((p) => {
        const m = c.ponti[p.id].material; const su = gr.scelto === p.id;
        m.opacity = su ? 0.55 : 0; m.color.set(p.id === 'plancia' ? COL.ocra : COL.rosso);
        c.nomi[p.id].visible = su;
      });
      c.h.visible = lez.fatte.has('h');
      c.area.forEach((m) => { m.visible = gr.area; });
    });
  }
  const creaGrandezze = Lezione.simula({
    k: 5, pedana: [40, 30, 'a dritta'], dopo: posaGrandezze,
    vista: () => ({ target: new THREE.Vector3(26, 6, 0), theta: 0.1, phi: 1.48, r: 90 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -ACQUA; const dim = 3.4 + k * 0.5;
      g.add(Scafo.crea(k));
      // Ponti candidati: lastre trasparenti da toccare
      const ponti = {}; const nomi = {};
      PONTI.forEach((p) => {
        const [x0, x1, y0, y1, z0, z1] = p.box;
        const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), new THREE.MeshBasicMaterial({ color: COL.ocra, transparent: true, opacity: 0, depthWrite: false }));
        m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.userData.tocco = p.id; g.add(m); tocca(m); ponti[p.id] = m;
        const e = etichetta(p.nome, dim, '#0B2545'); e.position.set((x0 + x1) / 2, 21, 0); e.visible = false; g.add(e); nomi[p.id] = e;
      });
      // H: dalla linea di massimo carico al ponte di plancia, dietro la poppa contro il mare
      const h = new THREE.Group(); const zh = 2; const xh = -5;
      const r = 0.32 * Math.sqrt(k);
      h.add(segmento(new THREE.Vector3(xh, ACQUA, zh), new THREE.Vector3(xh, TOP, zh), r, COL.ocra));
      h.add(segmento(new THREE.Vector3(xh - 2, ACQUA, zh), new THREE.Vector3(1, ACQUA, zh), r, COL.ocra));
      h.add(segmento(new THREE.Vector3(xh - 2, TOP, zh), new THREE.Vector3(12, TOP, zh), r, COL.ocra));
      const eh = etichetta('H', dim * 1.4, '#8C7020'); eh.position.set(xh - 3.5, (ACQUA + TOP) / 2, zh); h.add(eh);
      g.add(h);
      // B: larghezza fuori ossatura, a centro nave
      g.add(segmento(new THREE.Vector3(45, Scafo.PONTE + 0.4, -Scafo.B / 2), new THREE.Vector3(45, Scafo.PONTE + 0.4, Scafo.B / 2), r, COL.inchiostro));
      const eb = etichetta('B', dim * 1.2, '#0B2545'); eb.position.set(45, Scafo.PONTE + 3, Scafo.B / 2 - 1); g.add(eb);
      // A: proiezione laterale, appena fuori dal fianco di dritta
      const area = areaA().map((geo) => { const m = new THREE.Mesh(geo, lastra(COL.ocra, 0.72)); m.position.z = Scafo.B / 2 + 0.6; g.add(m); return m; });
      const ea = etichetta('A', dim * 1.4, '#8C7020'); ea.position.set(60, 11.5, Scafo.B / 2 + 1); g.add(ea); area.push(ea);
      gr.copie.push({ ponti, nomi, h, area });
      return g;
    },
  });
  function comandiGrandezze(id) {
    if (id.startsWith('t:')) {
      const p = PONTI.find((x) => x.id === id.slice(2).split(',')[0]);
      if (p) { gr.scelto = p.id; if (p.id === 'plancia') lez.completa('h'); }
    }
    if (id === 'area') { gr.area = !gr.area; if (gr.area) lez.completa('a'); }
    posaGrandezze(); Motore.sporco();
  }
  function schedaPonte() {
    const p = PONTI.find((x) => x.id === gr.scelto);
    return p ? p.testo : 'Tocca il fumaiolo, il tetto della tuga o il ponte di plancia.';
  }

  /* Calcolo di EN e tabella di ancore e catene (slide 2, 4). Grandezze scelte dallo studente -------- */
  // [EN da, EN a, massa di un'ancora kg, lunghezza totale catena m, diametro Gr. 1, Gr. 2, Gr. 3 mm]; 3 ancore in ogni fascia
  const TABELLA = [
    [205, 240, 660, 302.5, 26, 22, 20.5], [240, 280, 780, 330, 28, 24, 22], [280, 320, 900, 357.5, 30, 26, 24],
    [320, 360, 1020, 357.5, 32, 28, 24], [360, 400, 1140, 385, 34, 30, 26], [400, 450, 1290, 385, 36, 32, 28], [450, 500, 1440, 412.5, 38, 34, 30],
  ];
  const en = { D: 1500, B: 10, H: 5, A: 400 };
  const LIMITI = { D: [500, 4000, 100], B: [8, 16, 0.5], H: [4, 10, 0.5], A: [200, 1200, 50] };
  const EN = () => en.D ** (2 / 3) + 2 * en.B * en.H + 0.1 * en.A;
  const fascia = (v) => TABELLA.findIndex(([a, b], i) => v >= a && (v < b || (i === TABELLA.length - 1 && v <= b)));
  function comandiEN(id) {
    const k = id.slice(0, -1); const v = id.slice(-1);
    if (!LIMITI[k] || (v !== '+' && v !== '-')) return;
    const [lo, hi, passo] = LIMITI[k];
    en[k] = Math.max(lo, Math.min(hi, Math.round((en[k] + (v === '+' ? passo : -passo)) * 10) / 10));
    const f = fascia(EN());
    if (f >= 0) lez.completa('en');
    if (f === TABELLA.length - 1) lez.completa('riga');
  }
  function rigaEN() {
    const v = EN(); const f = fascia(v);
    if (f < 0) return { colore: '#B3362B', testo: v < 205 ? 'EN sotto 205: fuori dalla parte di tabella della slide 4.' : 'EN sopra 500: fuori dalla parte di tabella della slide 4.' };
    const [a, b, m, l, d1, d2, d3] = TABELLA[f];
    return { colore: '#2F7A55', testo: `Fascia **${a}-${b}**: 3 ancore da **${m} kg**; catena lunga in tutto **${dato(l)} m**, diametro minimo ${d1} mm (Gr. 1), ${d2} mm (Gr. 2), ${dato(d3)} mm (Gr. 3). {{slide 4}}` };
  }

  /* Simulazione 2: legnoli, anima e commettitura (slide 6, 7). Cavo ingrandito e schematico -------- */
  const ALTO = 36; const PASSO = 18; const RAGGIO = 2.1;
  const cv = { lay: 'Z', scelto: null, legnolo: false, cambi: 0, copie: [] };
  // Elica attorno all'asse verticale: Z destrorsa, S sinistrorsa (vista col cavo in verticale)
  function elica(fase, verso) {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const y = (ALTO * i) / 120; const t = (2 * Math.PI * y) / PASSO + fase;
      pts.push(new THREE.Vector3(verso * RAGGIO * Math.sin(t), y, RAGGIO * Math.cos(t)));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 1.45, 10, false);
  }
  const TINTE_LEGNOLI = ['#2E7DB5', '#13315C', '#5B8FB9'];
  function posaCavo() {
    const verso = cv.lay === 'Z' ? 1 : -1;
    cv.copie.forEach((c) => {
      c.legnoli.forEach((m, i) => {
        m.geometry.dispose(); m.geometry = elica((i * 2 * Math.PI) / 3, verso);
        m.material.color.set(cv.scelto === 'legnolo' ? '#C9A227' : TINTE_LEGNOLI[i]);
      });
      c.anima.material.color.set(cv.scelto === 'anima' ? '#C9A227' : '#F4F0E6');
      c.lettere.Z.visible = cv.lay === 'Z'; c.lettere.S.visible = cv.lay === 'S';
      c.guida.rotation.z = verso * -0.62;
    });
  }
  const creaCavo = Lezione.simula({
    k: 3, mare: false, scala: 0.025, centro: [0, 18], pedana: [0, 30, 'davanti al cavo'], dopo: posaCavo,
    vista: () => ({ target: new THREE.Vector3(5, 19, 0), theta: 0, phi: 1.5, r: 80 }),
    modello(k, tocca) {
      const g = new THREE.Group();
      const anima = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, ALTO + 3, 16), new THREE.MeshBasicMaterial({ color: 0xF4F0E6 }));
      anima.position.y = (ALTO + 3) / 2; anima.userData.tocco = 'anima'; g.add(anima); tocca(anima);
      const legnoli = TINTE_LEGNOLI.map((t, i) => {
        const m = new THREE.Mesh(elica((i * 2 * Math.PI) / 3, 1), new THREE.MeshBasicMaterial({ color: t }));
        m.userData.tocco = 'legnolo'; g.add(m); tocca(m); return m;
      });
      // Lettera della commettitura e tratto obliquo come il suo segno centrale
      const lettere = { Z: etichetta('Z', 9, '#8C7020'), S: etichetta('S', 9, '#8C7020') };
      Object.values(lettere).forEach((e) => { e.position.set(13, 22, 0); g.add(e); });
      const guida = segmento(new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, 5, 0), 0.25, COL.ocra); guida.position.set(13, 11, 0);
      g.add(guida);
      cv.copie.push({ anima, legnoli, lettere, guida });
      return g;
    },
  });
  function comandiCavo(id) {
    if (id.startsWith('t:')) {
      const t = id.slice(2).split(',')[0];
      if (t === 'legnolo') { cv.scelto = 'legnolo'; cv.legnolo = true; }
      if (t === 'anima') { cv.scelto = 'anima'; if (cv.legnolo) lez.completa('legnolo'); }
    }
    if (id === 'lay:S' && cv.lay !== 'S') { cv.lay = 'S'; cv.cambi += 1; }
    if (id === 'lay:Z' && cv.lay !== 'Z') { cv.lay = 'Z'; cv.cambi += 1; if (cv.cambi >= 2) lez.completa('commettitura'); }
    posaCavo(); Motore.sporco();
  }
  function schedaCavo() {
    if (cv.scelto === 'legnolo') return '**Legnolo** (*strand*): un insieme di fili o fibre elementari avvolti. I legnoli si avviluppano attorno all\'anima. {{slide 6}}';
    if (cv.scelto === 'anima') return '**Anima**: il cuore del cavo, attorno a cui si avvolgono i legnoli. {{slide 6}}';
    return 'Tocca un legnolo o l\'anima del cavo.';
  }

  /* Simulazione 3: il cavo d'ormeggio in acqua (slide 9, 11, 13-15, 19). Cavi da 80 mm ------------- */
  const FIBRE = [
    { id: 'pe', nome: 'Polietilene', rottura: 56, galleggia: true, tinta: '#5B8FB9', nota: 'economico, ma scivoloso: non tiene al nodo e si deforma facilmente. {{slide 13}}' },
    { id: 'pp', nome: 'Polipropilene', rottura: 62, galleggia: true, tinta: '#2F7A55', nota: 'come il polietilene, ma più resistente e meno incline ad allungarsi. {{slide 14, 19}}' },
    { id: 'pa', nome: 'Poliammide (nylon)', rottura: 100, galleggia: false, tinta: '#D9682B', nota: 'tiene al nodo e resiste all\'usura, ma è a volte troppo elastico e assorbe acqua. {{slide 14}}' },
    { id: 'pes', nome: 'Poliestere', rottura: 150, oltre: true, galleggia: false, tinta: '#C9A227', nota: 'la fibra migliore per resistenza e usura, poco elastica. {{slide 15}}' },
    { id: 'dy', nome: 'Dyneema', rottura: 350, galleggia: true, tinta: '#B3362B', nota: 'fibra a base di polietilene, prodotta con tecnologie avanzate. {{slide 15, 19}}' },
  ];
  const COEFF = 5;
  const om = { f: 0, copie: [] };
  const fibra = () => FIBRE[om.f];
  const swl = () => fibra().rottura / COEFF;
  const QUAY = 22; // banchina parallela alla nave, sul lato di dritta
  function percorso(galleggia) {
    const yAcqua = ACQUA + 0.35; const ySotto = ACQUA - 3.2;
    const y = galleggia ? yAcqua : ySotto;
    return [
      new THREE.Vector3(80, Scafo.insellatura(80 / Scafo.L) + 0.3, Scafo.mezza(80 / Scafo.L, 8) - 0.2),
      new THREE.Vector3(81, ACQUA + 1.2, 9.5),
      new THREE.Vector3(82, y, 12),
      new THREE.Vector3(85, y, 15.5),
      new THREE.Vector3(88, y, 19),
      new THREE.Vector3(90, ACQUA + 1.2, QUAY - 0.6),
      new THREE.Vector3(91, ACQUA + 3, QUAY + 0.4),
      new THREE.Vector3(92, ACQUA + 3.3, QUAY + 3),
    ];
  }
  function posaOrmeggio() {
    om.copie.forEach((c) => {
      if (c.cavo) { c.cavo.removeFromParent(); c.cavo.geometry.dispose(); }
      c.cavo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(percorso(fibra().galleggia)), 80, 0.28 * Math.sqrt(c.k), 6, false), new THREE.MeshBasicMaterial({ color: fibra().tinta }));
      c.g.add(c.cavo);
    });
  }
  const creaOrmeggio = Lezione.simula({
    k: 5, pedana: [86, 34, 'in banchina'], dopo: posaOrmeggio,
    vista: () => ({ target: new THREE.Vector3(85, 0, 15), theta: 0.5, phi: 0.72, r: 52 }),
    modello(k, tocca) {
      const g = new THREE.Group(); g.position.y = -ACQUA;
      g.add(Scafo.crea(k));
      // Banchina e bitta
      const banchina = new THREE.Mesh(Tavola.cuoci(new THREE.BoxGeometry(70, 9.5, 14), '#D8E0EC'), new THREE.MeshBasicMaterial({ vertexColors: true }));
      banchina.position.set(70, ACQUA + 3.3 - 4.75, QUAY + 7); g.add(banchina);
      const bitta = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.6, 12), new THREE.MeshBasicMaterial({ color: COL.inchiostro }));
      bitta.position.set(92, ACQUA + 3.3 + 0.8, QUAY + 3); g.add(bitta);
      const e = etichetta('bitta', 2.2 + k * 0.3, '#0B2545'); e.position.set(92, ACQUA + 3.3 + 4, QUAY + 3); g.add(e);
      om.copie.push({ g, k, cavo: null });
      return g;
    },
  });
  function comandiOrmeggio(id) {
    if (id.startsWith('f:')) {
      om.f = FIBRE.findIndex((x) => x.id === id.slice(2));
      if (swl() >= 30) lez.completa('swl');
      if (fibra().galleggia && swl() > 20) lez.completa('galleggia');
    }
    posaOrmeggio(); Motore.sporco();
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { a: 'ancore più pesanti', b: 'le stesse ancore', c: 'ancore più leggere' };
    const r = rigaEN(); const f = fibra();
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'L\'armamento' },
          { t: 'p', testo: 'Nell\'allestimento navale rientra la scelta dell\'**armamento marinaresco**: ancore con le loro catene, cavi d\'ormeggio e di rimorchio. {{slide 2}}' },
          { t: 'p', testo: 'Le caratteristiche le fissano i registri di classificazione, con tabelle in cui si entra con un numero: il **modulo di armamento** (*equipment number*). {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il modulo EN' },
          { t: 'formula', testo: 'EN = Δ^(2/3) + 2·B·H + 0,1·A' },
          { t: 'tabella', col: [14, 86], size: 32, righe: [
            ['', 'Che cos\'è'],
            ['Δ', 'dislocamento fuori ossatura a pieno carico estivo'],
            ['B', 'larghezza fuori ossatura'],
            ['H', 'altezza della parte emersa: dalla linea di massimo carico estiva al ponte superiore dell\'ultima sovrastruttura larga più di B/4'],
            ['A', 'area della proiezione laterale, alta H, fra le perpendicolari estreme'],
          ] },
          { t: 'nota', testo: 'slide 2, 3' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'Due navi hanno lo stesso dislocamento e la stessa larghezza. La seconda ha sovrastrutture più alte: H e A sono più grandi.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Secondo le tabelle, la seconda nave avrà…' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:a', testo: 'Ancore più pesanti', on: p === 'a' },
          { t: 'scelta', id: 'p:b', testo: 'Le stesse ancore', on: p === 'b' },
          { t: 'scelta', id: 'p:c', testo: 'Ancore più leggere', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaGrandezze, azione: comandiGrandezze, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'Le grandezze sulla nave' },
          { t: 'riquadro', size: 34, testo: schedaPonte() },
          { t: 'bottoni', h: 80, size: 32, lista: [{ id: 'area', testo: gr.area ? 'Nascondi l\'area A' : 'Mostra l\'area A', on: gr.area }] },
          ...lez.missioni().slice(0, 2),
        ],
        dx: [
          ...Lezione.finestra(760, 'Punta un ponte della nave e premi il grilletto.'),
          { t: 'nota', testo: 'In ocra H e A. Nave schematica: B è solo grafico.' },
        ],
      },
      {
        passo: 2, azione: comandiEN, richiede: () => lez.fatte.has('h') && lez.fatte.has('a'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Calcola EN' },
          { t: 'passo', id: 'D', nome: 'Dislocamento Δ', valore: `${en.D} t` },
          { t: 'passo', id: 'B', nome: 'Larghezza B', valore: `${num(en.B)} m` },
          { t: 'passo', id: 'H', nome: 'Altezza emersa H', valore: `${num(en.H)} m` },
          { t: 'passo', id: 'A', nome: 'Area laterale A', valore: `${en.A} m²` },
          ...lez.missioni().slice(2, 4),
        ],
        dx: [
          { t: 'spazio', h: 40 },
          { t: 'formula', testo: 'EN = Δ^(2/3) + 2·B·H + 0,1·A' },
          { t: 'formula', testo: `EN = ${num(en.D ** (2 / 3), 0)} + ${num(2 * en.B * en.H, 0)} + ${num(0.1 * en.A, 0)} = ${num(EN(), 0)}` },
          { t: 'riquadro', size: 34, colore: r.colore, testo: r.testo },
          { t: 'nota', testo: 'Valori scelti da te: le slide non danno le grandezze di una nave. Tabella dalla slide 4.' },
        ],
      },
      {
        passo: 2, mondo: creaCavo, azione: comandiCavo, richiede: () => lez.fatte.has('riga'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Dentro un cavo' },
          { t: 'riquadro', size: 34, testo: schedaCavo() },
          { t: 'bottoni', h: 80, size: 32, lista: [{ id: 'lay:Z', testo: 'Commettitura Z', on: cv.lay === 'Z' }, { id: 'lay:S', testo: 'Commettitura S', on: cv.lay === 'S' }] },
          { t: 'p', size: 32, testo: cv.lay === 'Z' ? 'Z: antioraria o destrorsa (*Z-twisted*). {{slide 7}}' : 'S: oraria o sinistrorsa (*S-twisted*). {{slide 7}}' },
          ...lez.missioni().slice(4, 6),
        ],
        dx: [
          ...Lezione.finestra(760, 'Punta un legnolo o l\'anima e premi il grilletto.'),
          { t: 'nota', testo: 'Cavo ingrandito e schematico. Col cavo in verticale i legnoli seguono il tratto centrale della lettera.' },
        ],
      },
      {
        passo: 2, mondo: creaOrmeggio, azione: comandiOrmeggio, richiede: () => lez.fatte.has('legnolo') && lez.fatte.has('commettitura'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Il cavo d\'ormeggio' },
          { t: 'bottoni', h: 72, size: 32, lista: FIBRE.slice(0, 3).map((x, i) => ({ id: `f:${x.id}`, testo: x.nome.replace(' (nylon)', ''), on: om.f === i })) },
          { t: 'bottoni', h: 72, size: 32, lista: FIBRE.slice(3).map((x, i) => ({ id: `f:${x.id}`, testo: x.nome, on: om.f === i + 3 })) },
          { t: 'formula', testo: `SWL = ${f.oltre ? 'oltre ' : ''}${f.rottura} t / ${COEFF} = ${f.oltre ? 'oltre ' : ''}${num(swl())} t` },
          { t: 'riquadro', size: 32, colore: f.galleggia ? '#2F7A55' : '#B3362B', testo: `**${f.nome}**, 80 mm: ${f.galleggia ? 'galleggia' : 'non galleggia'}; ${f.nota}` },
          ...lez.missioni().slice(6),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Carichi di rottura medi di un cavo da 80 mm. Il cavo è calato in acqua prima di arrivare alla bitta: se galleggia si recupera più facilmente. Slide 9, 13-15, 19.' },
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'a' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Con H e A più grandi crescono i termini 2·B·H e 0,1·A: **EN aumenta**. {{slide 2}}' },
          { t: 'p', testo: 'Nella tabella una fascia di EN più alta prescrive **ancore più pesanti** e catene più lunghe e più grosse. {{slide 4}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Ancore e catene' },
          { t: 'tabella', col: [22, 22, 22, 34], size: 32, righe: [
            ['EN', 'Ancore (kg)', 'Catena (m)', 'Ø Gr. 1/2/3 (mm)'],
            ...TABELLA.map(([a, b, m, l, d1, d2, d3]) => [`${a}-${b}`, `3 × ${m}`, dato(l), `${d1}/${d2}/${dato(d3)}`]),
          ] },
          { t: 'nota', testo: 'slide 4: stockless bower anchors, stud link chain cable. Gr. 1 mild steel, Gr. 2 special quality, Gr. 3 extra special quality.' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'I cavi' },
          { t: 'p', size: 36, testo: 'A bordo ci sono **cavi per rimorchio** (*towlines*) e **cavi di ormeggio** (*mooring lines*), più gli eventuali cavi dei mezzi per il carico. {{slide 5}}' },
          { t: 'p', size: 36, testo: 'Si distinguono soprattutto per il materiale: **acciaio** (*steel*), **fibre vegetali** (*natural fibre*) o **fibre sintetiche** (*synthetic fibre*). {{slide 5}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Come è fatto' },
          { t: 'p', size: 36, testo: 'Dai fili o dalle fibre elementari una serie di avvolgimenti porta ai **legnoli** (*strand*), che si avviluppano attorno a un\'anima. {{slide 6}}' },
          { t: 'p', size: 36, testo: 'La torsione è la **commettitura** (*lay*). Nei cavi d\'ormeggio sintetici i legnoli sono spesso intrecciati a coppie: sono i **cavi trecciati**, tipici quelli a 8 legnoli. {{slide 7}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Le qualità' },
          { t: 'p', size: 36, testo: 'Dipendono dal materiale e dal diametro: **flessibilità** per la maneggevolezza, **elasticità** se non eccessiva, **galleggiabilità** nell\'ormeggio. {{slide 8}}' },
          { t: 'p', size: 36, testo: 'Il cavo va a terra con un cavo più piccolo, la **sagola** (*heaving line*): quando è calato in acqua, se galleggia si recupera meglio. {{slide 9}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La resistenza' },
          { t: 'p', size: 36, testo: 'È la qualità più importante (*tensile strength*), uguale su tutta la lunghezza. La misura il **carico di rottura** (*breaking strength*). {{slide 10}}' },
          { t: 'p', size: 36, testo: 'Serve a confrontare cavi diversi, non a usarli: in esercizio si resta sempre ben sotto quel valore. {{slide 10}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il carico di lavoro' },
          { t: 'p', size: 36, testo: 'Il **carico di lavoro** SWL (*safe working load*) resta sotto il 15-20% del carico di rottura: il **coefficiente di sicurezza** vale di solito 5. {{slide 11}}' },
          { t: 'formula', testo: 'SWL = carico di rottura / 5' },
        ],
        dx: [
          { t: 'titolo', testo: 'Perché tanta prudenza' },
          { t: 'tabella', col: [8, 92], size: 32, righe: [
            ['', 'Il carico di rottura non tiene conto di…'],
            ['1', 'usura del cavo'],
            ['2', 'rinvii su passacavi e altri attrezzi di tonneggio'],
            ['3', 'cavo bagnato: la resistenza può diminuire'],
            ['4', 'cavi traversi, perpendicolari alla banchina: la spinta della nave li tende quasi in verticale'],
          ] },
          { t: 'nota', testo: 'slide 12' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Le fibre sintetiche' },
          { t: 'p', size: 32, testo: 'Quasi tutti i cavi d\'ormeggio di oggi; sulle grandi navi da 68 a 80 mm di diametro. Carico di rottura medio a 80 mm: {{slide 13}}' },
          { t: 'tabella', col: [36, 22, 42], size: 32, righe: [
            ['Fibra', 'Rottura', 'Note'],
            ['Polietilene (*polyethylene*)', '56 t', 'economico, scivoloso; galleggia'],
            ['Polipropilene (*polypropylene*)', '62 t', 'si allunga meno; basso costo'],
            ['Poliammide (*polyamide*)', '100 t', 'nylon: troppo elastico, non galleggia'],
            ['Poliestere (*polyester*)', 'oltre 150 t', 'il migliore per usura; non galleggia'],
            ['Dyneema', '350 t', 'fibra avanzata'],
          ] },
          { t: 'nota', testo: 'slide 13-15' },
        ],
        dx: [
          { t: 'titolo', testo: 'Altri cavi' },
          { t: 'p', size: 34, testo: 'I **vegetali** sono quasi scomparsi: reggono circa metà del polietilene. I **metallici** servono per il rimorchio e per i mezzi del carico. Ci sono anche cavi **misti**. {{slide 16}}' },
          { t: 'p', size: 34, testo: 'Manutenzione: i vegetali andavano asciugati, i metallici ingrassati e zincati. I sintetici durano di più, ma su crociere e traghetti dopo qualche mese vanno sostituiti. {{slide 17}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Quanti cavi a bordo' },
          { t: 'p', size: 36, testo: 'Non ci sono norme obbligatorie: tipo, numero e dimensioni dei cavi li stabilisce la Società di classificazione. {{slide 18}}' },
          { t: 'p', size: 36, testo: 'Esistono però tabelle condivise, sempre in funzione di EN. {{slide 18}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Dalla tabella più diffusa' },
          { t: 'tabella', col: [20, 22, 26, 32], size: 32, righe: [
            ['EN', 'Cavi', 'Lunghezza', 'Rottura'],
            ['205', '4', '120 m', '6,5 t'],
            ['16000', '21', '200 m', '75 t'],
          ] },
          { t: 'nota', testo: 'slide 18: i due estremi della tabella' },
        ],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci e calcola' }, ...lez.domanda(1), ...lez.domanda(2), ...lez.domanda(3)],
        dx: [{ t: 'nota', testo: 'Domande sulle definizioni, sulla tabella della slide 4 e sul carico di lavoro. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(4), ...lez.domanda(5), ...lez.domanda(6)],
      },
      lez.premio(() => lez.fatto.quiz(QUIZ.map((q) => q.n))),
    ];
  });
})();
