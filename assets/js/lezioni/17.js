/* Lezione 17: calcolo di aree e volumi dello scafo, momento d'inerzia. Formule ed esempi dalle slide 4-30.
   Le formule erano immagini nelle slide 4, 8, 9, 11, 14, 21, 24. La prova delle quadrature usa la figura
   di galleggiamento dello scafo comune (disegno di 92 m, non una nave delle slide); l'esempio svolto,
   le cisterne e gli esercizi sono quelli delle slide. Le slide non danno termini inglesi: niente glossario */
(function () {
  const N = 17;
  const { COL, etichetta, segmento } = Tavola;
  const num = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const mila = (v, d = 1) => { const [i, f] = v.toFixed(d).split('.'); return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${f ? `,${f}` : ''}`; };
  const ACQUA = 6;

  const MISSIONI = [
    { id: 'trapezi', testo: 'Con i trapezi, porta l\'errore sotto il 2%.' },
    { id: 'dispari', testo: 'Prova Simpson con un numero dispari di intervalli.' },
    { id: 'confronto', testo: 'Con gli stessi intervalli, confronta trapezi e Simpson.' },
    { id: 'moltiplicatori', testo: 'Completa i moltiplicatori di Simpson dell\'esempio.' },
    { id: 'ruota', testo: 'Ruota la cisterna e confronta i due Ix.' },
    { id: 'cubo', testo: 'Raddoppia la larghezza l (fino a 40 m) e guarda Ix.' },
  ];
  const QUIZ = [
    { n: 11, testo: 'Quali sono i moltiplicatori di Simpson?', scelte: ['0,5 – 1 – 1 – … – 1 – 0,5', '1 – 4 – 2 – 4 – … – 4 – 1', '1 – 2 – 1'], giusta: 1, perche: '1 – 4 – 2 – 4 – … – 4 – 1; quelli dei trapezi sono 0,5 – 1 – … – 1 – 0,5.' },
    { n: 12, testo: 'Che condizione chiede il metodo di Simpson?', scelte: ['Un numero pari di intervalli', 'Un numero dispari di intervalli', 'Nessuna'], giusta: 0, perche: 'Un numero pari di intervalli, cioè un numero dispari di ordinate.' },
    { n: 13, testo: 'Dove la curva è convessa, come le fiancate, il metodo dei trapezi…', scelte: ['sovrastima l\'area', 'sottostima l\'area', 'dà l\'area esatta'], giusta: 1, perche: 'I lati dritti «tagliano» la curva: nell\'esempio circa il 3% in meno.' },
    { n: 14, testo: 'Che cosa si ottiene con la quadratura della curva delle aree delle sezioni immerse?', scelte: ['L\'area del galleggiamento', 'Il volume di carena', 'Il momento d\'inerzia'], giusta: 1, perche: 'm² × m = m³: il volume di carena.' },
    { n: 15, testo: 'In che unità si misura il momento d\'inerzia di una superficie?', scelte: ['m²', 'm³', 'm⁴'], giusta: 2, perche: 'Un\'area (m²) per una distanza al quadrato (m²).' },
    { n: 16, testo: 'Navi A e B con stessa lunghezza e stessa area di galleggiamento: A più larga, B più stretta e piena. Chi ha il momento d\'inerzia maggiore?', scelte: ['A', 'B', 'Uguale'], giusta: 0, perche: 'A: la larghezza conta al cubo.' },
  ];
  // Esercizi delle slide 27-30, con i risultati delle slide 29-30
  const NAVI = [
    [1, 'una portacontainer', 322, 52, 15.25, 0.72, 0.70], [2, 'una nave bulk', 225, 32.2, 11.6, 0.91, 0.84],
    [3, 'una tanker', 243, 42, 14.8, 0.92, 0.85], [4, 'una nave da crociera', 220.6, 26.4, 7.6, 0.82, 0.75],
    [5, 'una nave ro-ro', 146.5, 20.5, 5.25, 0.86, 0.70],
  ];
  const CISTERNE = [[6, 'Cisterna rettangolare', 45, 10], [7, 'Cisterna rettangolare', 35.6, 16.1], [8, 'Piscina di una nave da crociera', 10, 5], [9, 'Cisterna quadrata', 30, 30], [10, 'Piscina di una nave da crociera', 8.4, 4.2]];
  const d = (v) => String(v).replace('.', ',');
  const CALCOLI = [
    ...NAVI.map(([n, nome, L, B, T, cwp, cb]) => {
      const aw = cwp * L * B; const v = cb * L * B * T;
      return { n, g: 1, testo: `AW e volume di carena di ${nome}: LWL = ${d(L)} m, BWL = ${d(B)} m, T = ${d(T)} m, CWP = ${d(cwp)}, CB = ${d(cb)}.`, campi: [['AW', aw, 0.6, 'm²'], ['V', v, 1, 'm³']], soluzione: `AW = ${d(cwp)} · ${d(L)} · ${d(B)} = ${mila(aw)} m²; V = ${d(cb)} · ${d(L)} · ${d(B)} · ${d(T)} = ${mila(v)} m³` };
    }),
    ...CISTERNE.map(([n, nome, L, l]) => {
      const ix = (L * l ** 3) / 12;
      return { n, g: 2, testo: `${nome}: L = ${d(L)} m, l = ${d(l)} m. Calcola Ix rispetto all'asse baricentrico longitudinale.`, campi: [['Ix', ix, 0.6, 'm⁴']], soluzione: `Ix = ${d(L)} · ${d(l)}³ / 12 = ${mila(ix)} m⁴` };
    }),
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ, calcoli: CALCOLI });

  /* Simulazione 1: trapezi e Simpson sulla figura di galleggiamento dello scafo comune (slide 7-12) -- */
  const FP = Scafo.ascissa(1, ACQUA);
  const LARGO = 3; // larghezze ingrandite nel disegno
  const CAMPIONI = Array.from({ length: 4001 }, (_, i) => { const u = i / 4000; return [Scafo.ascissa(u, ACQUA), Scafo.mezza(u, ACQUA)]; });
  function semi(x) {
    let a = 0; let b = CAMPIONI.length - 1;
    while (b - a > 1) { const m = (a + b) >> 1; if (CAMPIONI[m][0] <= x) a = m; else b = m; }
    const [x0, y0] = CAMPIONI[a]; const [x1, y1] = CAMPIONI[b];
    return x1 === x0 ? y0 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  const AREA_VERA = 2 * CAMPIONI.slice(1).reduce((s, [x, y], i) => s + ((x - CAMPIONI[i][0]) * (y + CAMPIONI[i][1])) / 2, 0);
  const qd = { n: 4, metodo: 't', visti: new Set(), copie: [] };
  const pari = () => qd.n % 2 === 0;
  const ordinate = () => Array.from({ length: qd.n + 1 }, (_, i) => semi((FP * i) / qd.n));
  const moltT = (i, n) => (i === 0 || i === n ? 0.5 : 1);
  const moltS = (i, n) => (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
  function areaCon(metodo) {
    const y = ordinate(); const dx = FP / qd.n;
    if (metodo === 't') return 2 * dx * y.reduce((s, v, i) => s + v * moltT(i, qd.n), 0);
    if (qd.n % 2) return null;
    return ((2 * dx) / 3) * y.reduce((s, v, i) => s + v * moltS(i, qd.n), 0);
  }
  function posaQuadratura() {
    const y = ordinate(); const dx = FP / qd.n; const ok = qd.metodo === 't' || pari();
    qd.copie.forEach((c) => {
      if (c.disegno) { c.disegno.removeFromParent(); c.disegno.traverse((o) => o.geometry && o.geometry.dispose()); }
      const g = new THREE.Group(); const r = 0.28; const h = ACQUA + 0.08;
      y.forEach((v, i) => { if (v > 0.05) g.add(segmento(new THREE.Vector3(i * dx, h, 0), new THREE.Vector3(i * dx, h, v), r, COL.ocra)); });
      if (ok) {
        const pts = [];
        if (qd.metodo === 't') y.forEach((v, i) => pts.push(new THREE.Vector3(i * dx, h + 0.05, v)));
        else {
          for (let i = 0; i < qd.n; i += 2) {
            const [a, b, e] = [y[i], y[i + 1], y[i + 2]];
            for (let k = 0; k <= 12; k++) {
              if (i > 0 && k === 0) continue;
              const t = k / 6; // da 0 a 2 intervalli: parabola per tre ordinate
              const v = a * ((t - 1) * (t - 2)) / 2 - b * t * (t - 2) + e * (t * (t - 1)) / 2;
              pts.push(new THREE.Vector3((i + t) * dx, h + 0.05, Math.max(0, v)));
            }
          }
        }
        for (let i = 1; i < pts.length; i++) g.add(segmento(pts[i - 1], pts[i], r * 0.8, COL.rosso));
      }
      c.g.add(g); c.disegno = g;
    });
  }
  const creaQuadratura = Lezione.simula({
    k: 5, mare: false, pedana: [45, 26, 'a dritta'], dopo: posaQuadratura,
    vista: () => ({ target: new THREE.Vector3(46, 0, 6), theta: 0, phi: 0.25, r: 128 }),
    modello(k) {
      // Solo la figura di galleggiamento, con le larghezze ingrandite: vista dall'alto sarebbe una striscia
      const g = new THREE.Group(); g.position.y = -ACQUA; g.scale.z = LARGO;
      const bordo = []; for (let i = 0; i <= 120; i++) { const x = (FP * i) / 120; bordo.push(new THREE.Vector3(x, ACQUA + 0.04, semi(x))); }
      for (let i = 120; i >= 0; i--) { const x = (FP * i) / 120; bordo.push(new THREE.Vector3(x, ACQUA + 0.04, -semi(x))); }
      for (let i = 1; i < bordo.length; i++) g.add(segmento(bordo[i - 1], bordo[i], 0.16, COL.inchiostro));
      g.add(segmento(bordo[bordo.length - 1], bordo[0], 0.16, COL.inchiostro));
      // Mezza figura di galleggiamento vera, dal lato di dritta
      const s = new THREE.Shape(); s.moveTo(0, 0);
      for (let i = 0; i <= 200; i++) { const x = (FP * i) / 200; s.lineTo(x, semi(x)); }
      s.lineTo(FP, 0); s.lineTo(0, 0);
      const fig = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: COL.acqua, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      fig.rotation.x = Math.PI / 2; fig.position.y = ACQUA + 0.02; g.add(fig);
      g.add(segmento(new THREE.Vector3(-3, ACQUA + 0.1, 0), new THREE.Vector3(FP + 3, ACQUA + 0.1, 0), 0.18, COL.inchiostro));
      const e = etichetta('asse longitudinale', 3.4 + k * 0.4, '#0B2545'); e.position.set(46, ACQUA + 1, -2.4); g.add(e);
      e.scale.z = 1 / LARGO;
      qd.copie.push({ g, disegno: null });
      return g;
    },
  });
  function comandiQuadratura(id) {
    if (id === 'n+') qd.n = Math.min(12, qd.n + 1);
    if (id === 'n-') qd.n = Math.max(2, qd.n - 1);
    if (id === 'met:t') qd.metodo = 't';
    if (id === 'met:s') qd.metodo = 's';
    if (qd.metodo === 's' && !pari()) lez.completa('dispari');
    const a = areaCon(qd.metodo);
    if (a !== null) {
      qd.visti.add(`${qd.metodo}${qd.n}`);
      if (pari() && qd.visti.has(`t${qd.n}`) && qd.visti.has(`s${qd.n}`)) lez.completa('confronto');
      if (qd.metodo === 't' && Math.abs(a - AREA_VERA) / AREA_VERA < 0.02) lez.completa('trapezi');
    }
    posaQuadratura(); Motore.sporco();
  }
  function schedaQuadratura() {
    const a = areaCon(qd.metodo);
    if (a === null) return { colore: '#B3362B', testo: `Simpson con ${qd.n} intervalli non si può: serve un numero **pari** di intervalli, cioè un numero dispari di ordinate. {{slide 11}}` };
    const e = ((a - AREA_VERA) / AREA_VERA) * 100;
    return { colore: Math.abs(e) < 2 ? '#2F7A55' : '#8C7020', testo: `${qd.metodo === 't' ? 'Trapezi' : 'Simpson'}, ${qd.n} intervalli di ${num(FP / qd.n)} m: AW = **${mila(a, 0)} m²**. Area vera del disegno ${mila(AREA_VERA, 0)} m²: errore ${e > 0 ? '+' : ''}${num(e)}%.` };
  }

  /* Pagina: i moltiplicatori di Simpson nell'esempio svolto (slide 13, 14, 24) ---------------------- */
  const ES = { y: [1.2, 3.8, 4.8, 5.0, 4.9, 3.9, 0.6], y3: [1.7, 54.9, 110.6, 125.0, 117.6, 59.3, 0.2], S: [1, 4, 2, 4, 2, 4, 1] };
  const GIRO = [1, 4, 2];
  const ml = { m: ES.y.map(() => 0) };
  const giusti = () => ml.m.every((m, i) => m === ES.S[i]);
  function comandiMoltiplicatori(id) {
    if (!id.startsWith('ml:')) return;
    const i = Number(id.slice(3)); const at = GIRO.indexOf(ml.m[i]);
    ml.m[i] = GIRO[(at + 1) % GIRO.length];
    if (giusti()) lez.completa('moltiplicatori');
  }

  /* Simulazione 2: momento d'inerzia di una cisterna rettangolare (slide 20-22) ---------------------- */
  const cs = { L: 35, l: 14, rif: { L: 35, l: 14 }, ruotate: [], copie: [] };
  const IX = () => (cs.L * cs.l ** 3) / 12;
  function posaCisterna() {
    cs.copie.forEach((c) => {
      c.cassa.scale.set(cs.L, 1, cs.l);
      c.asse.scale.x = (cs.L + 6) / 10;
      c.eL.position.set(0, 2.2, cs.l / 2 + 2.5); c.el.position.set(cs.L / 2 + 4, 2.2, 0);
      [[c.eL, `L = ${d(cs.L)} m`], [c.el, `l = ${d(cs.l)} m`]].forEach(([e, t]) => { const n = etichetta(t, c.dim, '#0B2545'); e.material.map.dispose(); e.material.map = n.material.map; e.scale.copy(n.scale); });
    });
  }
  const creaCisterna = Lezione.simula({
    k: 3, mare: false, scala: 0.02, centro: [0, 0], pedana: [0, 34, 'accanto alla cisterna'], dopo: posaCisterna,
    vista: () => ({ target: new THREE.Vector3(0, 0, 3), theta: 0.35, phi: 0.75, r: 78 }),
    modello(k) {
      const g = new THREE.Group(); const dim = 2.6 + k * 0.5;
      const cassa = new THREE.Group();
      const pieno = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ color: COL.acqua, transparent: true, opacity: 0.45 }));
      pieno.position.y = 1; cassa.add(pieno);
      const bordo = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 2, 1)), new THREE.LineBasicMaterial({ color: COL.inchiostro }));
      bordo.position.y = 1; cassa.add(bordo);
      g.add(cassa);
      // Asse baricentrico parallelo al lato L
      const asse = new THREE.Group(); asse.add(segmento(new THREE.Vector3(-5, 2.1, 0), new THREE.Vector3(5, 2.1, 0), 0.25, COL.ocra)); g.add(asse);
      const eL = etichetta('L', dim, '#0B2545'); const el = etichetta('l', dim, '#0B2545'); g.add(eL, el);
      const ea = etichetta('asse x', dim * 0.9, '#8C7020'); ea.position.set(-8, 4, -2); g.add(ea);
      cs.copie.push({ cassa, asse, eL, el, dim });
      return g;
    },
  });
  function comandiCisterna(id) {
    const prima = { L: cs.L, l: cs.l };
    if (id === 'L+') cs.L = Math.min(40, cs.L + 1);
    if (id === 'L-') cs.L = Math.max(2, cs.L - 1);
    if (id === 'l+') cs.l = Math.min(40, cs.l + 1);
    if (id === 'l-') cs.l = Math.max(2, cs.l - 1);
    if (id === 'ruota') {
      [cs.L, cs.l] = [cs.l, cs.L];
      if (cs.L !== cs.l) { cs.ruotate = [prima, { L: cs.L, l: cs.l }]; lez.completa('ruota'); }
    }
    if (id === 'L+' || id === 'L-' || id === 'ruota') cs.rif = { L: cs.L, l: cs.l };
    cs.otto = (id === 'l+' || id === 'l-') && cs.L === cs.rif.L && cs.l === 2 * cs.rif.l;
    if (cs.otto) lez.completa('cubo');
    posaCisterna(); Motore.sporco();
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { a: 'la nave A, più larga', b: 'la nave B, più piena', c: 'sono uguali' };
    const sq = schedaQuadratura(); const fatto = giusti();
    const sYM = ES.y.reduce((s, v, i) => s + v * (ml.m[i] || 0), 0);
    const rot = cs.ruotate.length ? cs.ruotate.map(({ L, l }) => (L * l ** 3) / 12) : null;
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Una superficie curva' },
          { t: 'p', testo: 'La figura di galleggiamento non è un rettangolo: le fiancate sono curve e a prua si stringe fino a chiudersi. Non c\'è una formula geometrica che la descriva. {{slide 3}}' },
          { t: 'p', testo: 'Si usano i **metodi di quadratura** del calcolo numerico: la figura curva diventa tante figure semplici. {{slide 3, 6}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Richiamo' },
          { t: 'formula', testo: 'AW = CWP · LWL · BWL' },
          { t: 'formula', testo: 'V = CB · LWL · BWL · T' },
          { t: 'p', size: 36, testo: 'AW area della figura di galleggiamento (m²), V volume di carena (m³), CWP coefficiente del galleggiamento, CB coefficiente di blocco, T immersione. {{slide 4}}' },
          { t: 'nota', testo: 'Servono negli esercizi 1-5. Slide 4.' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'Le navi A e B hanno la stessa lunghezza e la stessa area di galleggiamento. A è più larga; B è più stretta e con forme più piene. {{slide 25}}' },
        ],
        dx: [
          { t: 'sotto', testo: 'Quale ha il momento d\'inerzia della figura di galleggiamento maggiore?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:a', testo: 'La nave A, più larga', on: p === 'a' },
          { t: 'scelta', id: 'p:b', testo: 'La nave B, più piena', on: p === 'b' },
          { t: 'scelta', id: 'p:c', testo: 'Sono uguali: hanno la stessa area', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaQuadratura, azione: comandiQuadratura, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'Trapezi o Simpson' },
          { t: 'bottoni', h: 80, size: 32, lista: [{ id: 'met:t', testo: 'Trapezi', on: qd.metodo === 't' }, { id: 'met:s', testo: 'Simpson', on: qd.metodo === 's' }] },
          { t: 'passo', id: 'n', nome: 'Numero di intervalli', valore: `${qd.n} (${qd.n + 1} ordinate)` },
          { t: 'riquadro', size: 32, colore: sq.colore, testo: sq.testo },
          ...lez.missioni().slice(0, 3),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Metà figura, vista dall\'alto: in ocra le semilarghezze, in rosso i lati dei trapezi o gli archi di parabola. Figura dello scafo disegnato, lungo 92 m; larghezze ingrandite 3 volte.' },
        ],
      },
      {
        passo: 2, azione: comandiMoltiplicatori, richiede: () => ['trapezi', 'dispari', 'confronto'].every((x) => lez.fatte.has(x)), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'La tabella di calcolo' },
          { t: 'p', size: 32, testo: 'LWL = 60 m, 6 intervalli, Δx = 10 m. Tocca ogni ordinata per scegliere il moltiplicatore di Simpson. {{slide 13}}' },
          ...ES.y.map((v, i) => ({ t: 'bottoni', h: 66, size: 32, lista: [{ id: `ml:${i}`, testo: `y${i} = ${num(v)} m   ·   M = ${ml.m[i] || '?'}`, on: ml.m[i] === ES.S[i] }] })),
          ...lez.missioni().slice(3, 4),
        ],
        dx: [
          { t: 'spazio', h: 30 },
          { t: 'formula', testo: `Σ y · M = ${num(sYM)}` },
          ...(fatto ? [
            { t: 'formula', testo: 'AW = 2/3 · 10 · 72,0 = 480 m²' },
            { t: 'formula', testo: 'CWP = 480 / (60 · 10) = 0,80' },
            { t: 'formula', testo: 'Ix = 2/3 · 10/3 · 1415,2 ≈ 3145 m⁴' },
            { t: 'p', size: 32, testo: 'Per Ix si usano le y³ con gli stessi moltiplicatori: Σ y³ · M = 1415,2. Un rettangolo 60 × 10 m darebbe 5000 m⁴. {{slide 13, 24}}' },
          ] : [{ t: 'nota', testo: 'Moltiplicatori di Simpson: 1 – 4 – 2 – 4 – … – 4 – 1. Slide 11.' }]),
        ],
      },
      {
        passo: 2, mondo: creaCisterna, azione: comandiCisterna, richiede: () => lez.fatte.has('moltiplicatori'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Il momento d\'inerzia di una cisterna' },
          { t: 'passo', id: 'L', nome: 'Lato L, parallelo all\'asse', valore: `${cs.L} m` },
          { t: 'passo', id: 'l', nome: 'Lato l, perpendicolare all\'asse', valore: `${cs.l} m` },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'ruota', testo: 'Ruota la cisterna' }] },
          { t: 'formula', testo: `Ix = L · l³ / 12 = ${mila(IX())} m⁴` },
          ...(cs.otto ? [{ t: 'esito', tipo: 'giusto', testo: `l raddoppiata da ${cs.rif.l} a ${cs.l} m: Ix è 2³ = 8 volte, da ${mila((cs.L * cs.rif.l ** 3) / 12)} a ${mila(IX())} m⁴. {{slide 21}}` }]
            : rot ? [{ t: 'nota', testo: `Prima ${mila(rot[0])} m⁴, dopo ${mila(rot[1])} m⁴: stessa area, ${num(Math.max(...rot) / Math.min(...rot))} volte.` }] : []),
          ...lez.missioni().slice(4),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'In ocra l\'asse baricentrico parallelo a L. Cisterna di partenza: 35 × 14 m, slide 22.' },
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'a' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Ha il momento d\'inerzia maggiore la **nave A**, più larga: nella formula la dimensione perpendicolare all\'asse compare **al cubo**. {{slide 21, 24}}' },
          { t: 'p', testo: 'Per questo alcune Ro-Ro pax hanno lo scafo allargato vicino al galleggiamento. {{slide 19}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La larghezza al cubo' },
          { t: 'formula', testo: 'Ix = L · l³ / 12' },
          { t: 'tabella', col: [40, 60], size: 32, righe: [
            ['Cisterna', 'Ix'],
            ['L = 35 m, l = 14 m', '35 · 14³ / 12 ≈ 8003 m⁴'],
            ['L = 14 m, l = 35 m', '14 · 35³ / 12 ≈ 50 021 m⁴'],
          ] },
          { t: 'p', size: 34, testo: 'Stessa area, ma un momento d\'inerzia oltre 6 volte maggiore. {{slide 22}}' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'L\'area sotto una curva' },
          { t: 'p', size: 36, testo: 'In matematica è l\'integrale definito. Per lo scafo la funzione non ha formula: si conoscono solo alcuni valori, come le semilarghezze del piano di costruzione. {{slide 6}}' },
          { t: 'p', size: 36, testo: 'La figura di galleggiamento è simmetrica: si calcola metà figura e si moltiplica per 2. {{slide 9}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il metodo dei trapezi' },
          { t: 'p', size: 34, testo: 'Si divide l\'asse in intervalli uguali di passo Δx e si tracciano le ordinate y0 … yn; unendole con rette si ottengono trapezi. {{slide 7}}' },
          { t: 'formula', testo: 'A = Δx · (y0/2 + y1 + … + yn−1 + yn/2)' },
          { t: 'formula', testo: 'AW = 2 Δx · (y0/2 + y1 + … + yn/2)' },
          { t: 'p', size: 32, testo: 'Moltiplicatori 0,5 – 1 – 1 – … – 1 – 0,5. Lo spicchio tra curva e lato obliquo è l\'errore del metodo. {{slide 7-9}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il metodo di Simpson' },
          { t: 'p', size: 34, testo: 'Le ordinate si prendono a gruppi di tre, unite da un arco di parabola. Ai due trapezi si somma il segmento parabolico: due terzi del parallelogramma circoscritto. {{slide 10}}' },
          { t: 'formula', testo: 'A = Δx/3 · (y0 + 4y1 + 2y2 + … + 4yn−1 + yn)' },
          { t: 'formula', testo: 'AW = 2/3 Δx · (y0 + 4y1 + 2y2 + … + yn)' },
          { t: 'p', size: 32, testo: 'Serve un numero pari di intervalli. È il metodo usato nella teoria della nave. {{slide 10, 11}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Nell\'esempio svolto' },
          { t: 'tabella', col: [30, 40, 30], size: 32, righe: [
            ['Metodo', 'AW', 'CWP'],
            ['Trapezi', '2 · 10 · 23,3 = 466 m²', '0,78'],
            ['Simpson', '2/3 · 10 · 72,0 = 480 m²', '0,80'],
          ] },
          { t: 'p', size: 34, testo: 'Con i trapezi circa il 3% in meno: i lati dritti «tagliano» le fiancate convesse. {{slide 14}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Dall\'area al volume' },
          { t: 'p', size: 36, testo: 'Con lo stesso procedimento si calcola l\'area di ogni sezione trasversale immersa. Riportate lungo la nave formano la **curva delle aree delle sezioni immerse**. {{slide 16}}' },
          { t: 'p', size: 36, testo: 'La quadratura di questa curva dà m² × m = m³: il **volume di carena**. {{slide 16}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il momento d\'inerzia' },
          { t: 'p', size: 34, testo: 'Descrive come una superficie è distribuita rispetto a un asse: somma delle aree infinitesime per il quadrato della distanza. Si misura in m⁴. {{slide 18}}' },
          { t: 'p', size: 34, testo: 'Per la stabilità serve quello della figura di galleggiamento rispetto all\'asse longitudinale: da esso dipende il raggio metacentrico. Qui è solo geometria, non masse. {{slide 18}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il rettangolo' },
          { t: 'p', size: 36, testo: 'Si divide il rettangolo L × l in strisce lunghe L e spesse dy. Una striscia a distanza y dall\'asse dà (L · dy) · y²; si integra su metà larghezza e si raddoppia. {{slide 20}}' },
          { t: 'formula', testo: 'Ix = L · l³ / 12' },
          { t: 'p', size: 32, testo: 'Rispetto all\'asse baricentrico parallelo a L. A bordo: superfici piccole ma influenti, come una cisterna piena di liquido. {{slide 21}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La nave' },
          { t: 'p', size: 34, testo: 'Mezza figura è una serie di strisce larghe dx e alte y; l\'asse passa per un lato delle strisce, non per il loro baricentro. Si integra e si moltiplica per 2. {{slide 23}}' },
          { t: 'formula', testo: 'Ix = 2/3 · Δx/3 · (y0³ + 4y1³ + 2y2³ + … + yn³)' },
          { t: 'p', size: 32, testo: 'Simpson su una superficie «matematica» con ordinate y³: la larghezza decide la stabilità di forma, con proporzionalità cubica. {{slide 24}}' },
        ],
      },
      {
        passo: 4, gruppo: 1, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizi: AW e volume' }, ...lez.calcoloSx(1)],
        dx: [...lez.calcoloDx(1)],
      },
      {
        passo: 4, gruppo: 2, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizi: Ix' }, ...lez.calcoloSx(2)],
        dx: [...lez.calcoloDx(2)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(11), ...lez.domanda(12), ...lez.domanda(13)],
        dx: [{ t: 'nota', testo: 'Domande sui metodi; l\'ultima è la domanda teorica della slide 25. Dopo due tentativi vedi la soluzione.' }, ...lez.domanda(14), ...lez.domanda(15), ...lez.domanda(16)],
      },
      lez.premio(() => lez.fatto.quiz([...QUIZ, ...CALCOLI].map((q) => q.n))),
    ];
  });
})();
