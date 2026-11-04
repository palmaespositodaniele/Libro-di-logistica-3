/* Lezione 18: dislocamento, dislocamento unitario, variazione di immersione con la densità, portata.
   Definizioni, formule ed esempi dalle slide 2-31 (le formule erano immagini nelle slide 3, 12, 14-22,
   27, 29, 31). Le prove usano lo scafo comune (disegno di 90 m, non una nave delle slide): dislocamento,
   TPC e riserva di spinta sono calcolati dalla sua forma. L'immersione a nave scarica (3 m) è scelta per
   il disegno; la marca estiva è la linea di galleggiamento dipinta a 6 m, il ponte di bordo libero a 7,2 m */
(function () {
  const N = 18;
  const { COL, etichetta, segmento, cuoci } = Tavola;
  const C = Pagina.C;
  const num = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const mila = (v, d = 0) => { const [i, f] = v.toFixed(d).split('.'); return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${f ? `,${f}` : ''}`; };
  const RHO = 1.025;
  const T_SCARICA = 3; const T_ESTIVA = 6; const PONTE = Scafo.PONTE;

  const MISSIONI = [
    { id: 'scarica', testo: 'A nave scarica, imbarca 100 t.' },
    { id: 'carica', testo: 'Vicino al pieno carico, imbarca altre 100 t.' },
    { id: 'pieno', testo: 'Porta la nave alla marca estiva, senza superarla.' },
    { id: 'riserva', testo: 'Supera la marca e guarda la riserva di spinta.' },
    { id: 'salmastra', testo: 'Porta la nave in un porto fluviale.' },
    { id: 'fwa', testo: 'Porta la nave in acqua dolce e trova la FWA.' },
    { id: 'netta', testo: 'Componi la portata netta dell\'esempio.' },
  ];
  const QUIZ = [
    { n: 11, testo: 'Che cosa rappresenta il dislocamento?', scelte: ['Il peso dell\'acqua spostata dalla carena', 'Il volume degli spazi chiusi', 'Il peso del solo carico'], giusta: 0, perche: 'È la misura della spinta idrostatica: Δ = ∇ · ρ.' },
    { n: 12, testo: 'Dove si applica la spinta idrostatica?', scelte: ['Nel baricentro G', 'Nel centro di carena B', 'Sul ponte di bordo libero'], giusta: 1, perche: 'Nel centro di carena B; il dislocamento, inteso come peso, nel baricentro G.' },
    { n: 13, testo: 'Che cos\'è la riserva di spinta?', scelte: ['Dislocamento pesante − dislocamento leggero', 'Dislocamento immersa fino al ponte di bordo libero − dislocamento attuale', 'Il bunker tenuto di riserva'], giusta: 1, perche: 'È la spinta che darebbe la parte stagna emersa, il bordo libero.' },
    { n: 14, testo: 'La portata lorda DW è…', scelte: ['dislocamento pesante − dislocamento leggero', 'il solo carico pagante', 'il volume delle stive'], giusta: 0, perche: 'Tutti i pesi imbarcabili: carico, bunker, acqua, zavorra, costante nave.' },
    { n: 15, testo: 'A peso costante, la nave passa da acqua salata ad acqua dolce. L\'immersione…', scelte: ['diminuisce', 'resta uguale', 'aumenta'], giusta: 2, perche: 'ρ diminuisce: per lo stesso Δ serve più volume di carena.' },
    { n: 16, testo: 'Perché i calcoli con il TPC sono approssimati oltre pochi centimetri?', scelte: ['Perché il TPC dipende dal carico', 'Perché i galleggiamenti si restringono verso la chiglia', 'Perché la densità cambia'], giusta: 1, perche: 'AW cambia con l\'immersione, e con essa il TPC.' },
    { n: 17, testo: 'Che cosa misura la stazza (GT), a differenza della portata?', scelte: ['Il volume degli spazi chiusi', 'Il peso trasportabile', 'Il dislocamento a pieno carico'], giusta: 0, perche: 'La stazza è un numero volumetrico, la portata un peso in tonnellate.' },
    { n: 18, testo: 'Che cosa fa parte della costante nave?', scelte: ['Il carico della spedizione', 'Fanghi impompabili, ruggine, vernice, ricambi aggiunti', 'Il bunker'], giusta: 1, perche: 'Pesi non compresi nei tabulati di nave nuova, aggiunti nel tempo.' },
  ];
  // Esempi delle slide 11, 12, 15, 22, 31
  const CALCOLI = [
    { n: 1, g: 1, testo: 'Nave in acqua salata: LWL = 123,40 m, BWL = 22,70 m, CWP = 0,85. Calcola il TPC.', campi: [['TPC', 24.4, 0.05, 't/cm']], soluzione: 'TPC = AW/100 · ρ = 123,4 · 22,7 · 0,85 / 100 · 1,025 = 24,4 t/cm' },
    { n: 2, g: 1, testo: 'La stessa nave è in acqua a ρ = 1,010 t/m³. Calcola il TPC.', campi: [['TPC', 24.05, 0.02, 't/cm']], soluzione: 'TPC = 123,4 · 22,7 · 0,85 / 100 · 1,010 = 24,05 t/cm; oppure TPC\' = 24,4 · 1,010 / 1,025 = 24,04 t/cm' },
    { n: 3, g: 1, testo: 'Nave con TPC = 50 t/cm: imbarca 300 t di merce. Di quanto aumenta l\'immersione media?', campi: [['Aumento', 6, 0, 'cm']], soluzione: '300 / 50 = 6 cm' },
    { n: 4, g: 1, testo: 'La stessa nave, con T = 6,20 m, deve passare a 6,10 m su un bassofondo. Quanto peso sbarcare?', campi: [['Peso', 500, 0, 't']], soluzione: 'Bisogna ridurre di 10 cm: 50 · 10 = 500 t' },
    { n: 5, g: 2, testo: 'Nave in ingresso in un porto fluviale con ρ\' = 1,014 t/m³: Δ = 12 400 t, TPC = 25 t/cm, T = 8,60 m. Calcola δT e la nuova immersione.', campi: [['δT', 5.38, 0.05, 'cm'], ['T\'', 8.65, 0.005, 'm']], soluzione: 'δT = 12 400 / 25 · (1,025 − 1,014) / 1,014 = 5,38 cm ≅ 0,05 m; T\' = 8,60 + 0,05 = 8,65 m' },
    { n: 6, g: 2, testo: 'Nave in uscita da un porto fluviale con ρ\' = 1,008 t/m³: Δ = 92 020 t, TPC = 66,4 t/cm, TA = 14,80 m, TF = 14,35 m. Calcola δT, la nuova immersione media e la FWA.', campi: [['δT', 23.37, 0.05, 'cm'], ['T\'m', 14.341, 0.002, 'm'], ['FWA', 34.65, 0.05, 'cm']], soluzione: 'δT = 92 020 / 66,4 · (1,025 − 1,008) / 1,008 = 23,37 cm; Tm = 14,575 m, T\'m = 14,575 − 0,2337 = 14,341 m; FWA = 92 020 / (40 · 66,4) = 34,65 cm' },
    { n: 7, g: 3, testo: 'Traversata di 3 giorni in acqua tropicale, 10 in estiva, 16 in invernale. Cbunker = 56 t/d, rimanenza a bordo 86 t, riserva del 20%. Calcola il bunker da imbarcare.', campi: [['Bunker', 1862.8, 0.1, 't']], soluzione: 'Bunker = 56 · 29 + 0,20 · (56 · 29) − 86 = 1624 + 324,8 − 86 = 1862,8 t' },
  ];
  const lez = Lezione.crea({ n: N, missioni: MISSIONI, quiz: QUIZ, calcoli: CALCOLI });

  /* Idrostatica dello scafo comune: area del galleggiamento e volume di carena ogni centimetro ---------- */
  let TAB = null;
  function idro() {
    if (TAB) return TAB;
    const aw = (y) => {
      let s = 0; let px = Scafo.ascissa(0, y); let py = Scafo.mezza(0, y);
      for (let i = 1; i <= 300; i++) { const u = i / 300; const x = Scafo.ascissa(u, y); const m = Scafo.mezza(u, y); s += ((x - px) * (m + py)) / 2; px = x; py = m; }
      return 2 * s;
    };
    TAB = { aw: [], v: [] }; let v = 0; let prima = aw(0);
    for (let i = 0; i <= 800; i++) {
      const a = i ? aw(i / 100) : prima;
      if (i) v += ((a + prima) / 2) * 0.01;
      TAB.aw.push(a); TAB.v.push(v); prima = a;
    }
    return TAB;
  }
  const leggi = (lista, T) => { const f = Math.max(0, Math.min(799.999, T * 100)); const i = Math.floor(f); return lista[i] + (f - i) * (lista[i + 1] - lista[i]); };
  const volume = (T) => leggi(idro().v, T);
  const area = (T) => leggi(idro().aw, T);
  const disl = (T, rho = RHO) => volume(T) * rho;
  const tpc = (T, rho = RHO) => (area(T) / 100) * rho;
  function immersione(D, rho = RHO) {
    const v = D / rho; const V = idro().v;
    let a = 0; let b = V.length - 1;
    while (b - a > 1) { const m = (a + b) >> 1; if (V[m] <= v) a = m; else b = m; }
    return (a + (V[b] === V[a] ? 0 : (v - V[a]) / (V[b] - V[a]))) / 100;
  }

  /* La nave che si immerge: un modello per ogni prova, con la sua immersione ---------------------------- */
  function modelloNave(st, conCarico) {
    return (k) => {
      const nave = new THREE.Group(); const dim = 4.6 + k * 0.5; const r = 0.3 * Math.sqrt(k);
      nave.add(Scafo.crea(k));
      const zf = Scafo.B / 2 + 0.2;
      // Marca estiva, a centro nave sul fianco di dritta
      nave.add(segmento(new THREE.Vector3(39, T_ESTIVA, zf), new THREE.Vector3(51, T_ESTIVA, zf), r, COL.ocra));
      nave.add(segmento(new THREE.Vector3(51, T_ESTIVA, zf), new THREE.Vector3(58, PONTE + 3.2, zf + 0.6), r * 0.6, COL.ocra));
      const em = etichetta('marca estiva', dim, '#0B2545'); em.position.set(66, PONTE + 4.4, zf + 1); em.material.depthTest = false; em.renderOrder = 10; nave.add(em);
      const ep = etichetta('ponte di bordo libero', dim, '#0B2545'); ep.position.set(30, PONTE + 4.4, zf); ep.material.depthTest = false; ep.renderOrder = 10; nave.add(ep);
      let carico = null; let riserva = null;
      if (conCarico) {
        const geo = new THREE.BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
        carico = new THREE.Mesh(cuoci(geo, '#5B6B7C'), new THREE.MeshBasicMaterial({ vertexColors: true }));
        carico.position.set(44, PONTE + 0.1, 0); carico.scale.set(38, 1, 10); nave.add(carico);
        const pg = new THREE.PlaneGeometry(1, 1); pg.translate(0.5, 0.5, 0);
        riserva = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: COL.ocra, transparent: true, opacity: 0.26, depthWrite: false, side: THREE.DoubleSide }));
        riserva.position.set(8, 0, zf + 0.4); nave.add(riserva);
      }
      st.copie.push({ nave, carico, riserva });
      const g = new THREE.Group(); g.add(nave);
      return g;
    };
  }
  const vistaNave = () => ({ target: new THREE.Vector3(45, 4, 0), theta: 0.12, phi: 1.32, r: 108 });

  /* Prova 1: carico, immersione e TPC (slide 5-13) ---------------------------------------------------- */
  const D_SCARICA = () => disl(T_SCARICA);
  const D_PONTE = () => disl(PONTE);
  const c1 = { carico: 0, ultimo: null, cm: {}, copie: [] };
  const T1 = () => immersione(D_SCARICA() + c1.carico);
  const RISERVA = (T) => Math.max(0, D_PONTE() - disl(T));
  function posaCarico() {
    const T = T1(); const DW = disl(T_ESTIVA) - D_SCARICA();
    c1.copie.forEach((c) => {
      c.nave.position.y = -T;
      c.carico.visible = c1.carico > 0; c.carico.scale.y = 0.3 + (c1.carico / DW) * 4;
      c.riserva.position.y = T; c.riserva.scale.set(74, Math.max(0.01, PONTE - T), 1);
    });
  }
  const creaCarico = Lezione.simula({ k: 5, pedana: [45, 30, 'a dritta'], dopo: posaCarico, vista: vistaNave, modello: modelloNave(c1, true) });
  function comandiCarico(id) {
    if (!id.startsWith('c:')) return;
    const dP = Number(id.slice(2)); const Ta = T1(); const tA = tpc(Ta);
    const max = D_PONTE() - D_SCARICA();
    const nuovo = Math.max(0, Math.min(max, c1.carico + dP));
    if (nuovo === c1.carico) { c1.ultimo = { tipo: 'fermo', dP }; return; }
    const vero = nuovo - c1.carico; c1.carico = nuovo; const Tb = T1();
    c1.ultimo = { dP: vero, Ta, Tb, tA, cm: (Tb - Ta) * 100, stima: vero / tA };
    if (vero === 100 && Ta < 3.5) { c1.cm.scarica = c1.ultimo; lez.completa('scarica'); }
    if (vero === 100 && Ta > 5.5 && lez.fatte.has('scarica')) { c1.cm.carica = c1.ultimo; lez.completa('carica'); }
    if (Tb >= 5.97 && Tb <= T_ESTIVA) lez.completa('pieno');
    if (Tb > T_ESTIVA) lez.completa('riserva');
    posaCarico(); Motore.sporco();
  }
  function schedaCarico() {
    const u = c1.ultimo; const T = T1();
    const riserva = RISERVA(T);
    if ((u && u.tipo === 'fermo') || riserva < 0.5) {
      return riserva < 0.5
        ? { colore: C.rosso, testo: 'La nave è immersa fino al ponte di bordo libero: la riserva di spinta è finita. Con altro peso affonderebbe. {{slide 7, 8}}' }
        : { colore: C.ink2, testo: 'La nave è già scarica: non c\'è altro da sbarcare.' };
    }
    if (T > T_ESTIVA) return { colore: C.rosso, testo: `Marca estiva sommersa: è contro la Load Lines Convention. Resta una riserva di spinta di **${mila(riserva)} t**. {{slide 7, 8}}` };
    if (!u) return { colore: C.ink2, testo: 'Nave scarica: dislocamento leggero. Imbarca un peso e guarda di quanto si immerge.' };
    const verbo = u.dP > 0 ? 'si immerge' : 'emerge';
    return { colore: '#8C7020', testo: `${u.dP > 0 ? '+' : '−'}${Math.abs(u.dP)} t: la nave ${verbo} di **${num(Math.abs(u.cm))} cm**. Con il TPC di partenza: ${Math.abs(u.dP)} / ${num(u.tA, 2)} = ${num(Math.abs(u.stima))} cm. {{slide 10}}` };
  }

  /* Prova 2: la stessa nave a pieno carico in acque di densità diversa (slide 16-22) ------------------ */
  const ACQUE = [[1.025, 'Mare'], [1.014, '1,014'], [1.008, '1,008'], [1.000, 'Dolce']];
  const c2 = { rho: RHO, copie: [] };
  const D_PIENO = () => disl(T_ESTIVA);
  const T2 = () => immersione(D_PIENO(), c2.rho);
  function posaAcqua() { const T = T2(); c2.copie.forEach((c) => { c.nave.position.y = -T; }); }
  const creaAcqua = Lezione.simula({ k: 5, pedana: [45, 30, 'a dritta'], dopo: posaAcqua, vista: vistaNave, modello: modelloNave(c2, false) });
  function comandiAcqua(id) {
    if (!id.startsWith('r:')) return;
    c2.rho = Number(id.slice(2));
    if (c2.rho === 1.014 || c2.rho === 1.008) lez.completa('salmastra');
    if (c2.rho === 1) lez.completa('fwa');
    posaAcqua(); Motore.sporco();
  }
  const dTformula = (rho) => (D_PIENO() / tpc(T_ESTIVA)) * ((RHO - rho) / rho); // cm, slide 20
  const FWA = () => D_PIENO() / (40 * tpc(T_ESTIVA)); // cm, slide 21

  /* Pagina: la portata netta dell'esempio della slide 31 -------------------------------------------- */
  const VOCI = [
    ['DW invernale', 23420, 1], ['Co = (56 + 8) · 13 d', 832, 1], ['Bunker', 1862.8, -1],
    ['R, rimanenze', 86, -1], ['A = 232 + 70', 302, -1], ['Σ, costante e pesi morti', 145, -1],
  ];
  const nt = { segni: VOCI.map(() => 0) };
  const giusta = () => nt.segni.every((s, i) => s === VOCI[i][2]);
  function comandiNetta(id) {
    if (!id.startsWith('nt:')) return;
    const i = Number(id.slice(3)); nt.segni[i] = nt.segni[i] === 0 ? 1 : nt.segni[i] === 1 ? -1 : 1;
    if (giusta()) lez.completa('netta');
  }

  /* Disegno: la scala di solidità dello scafo comune, con il punto della prova ---------------------- */
  function scala(c, x, y, w, h) {
    const X0 = x + 110; const Y0 = y + h - 60; const LW = w - 150; const LH = h - 130;
    const DMAX = 8000; const TMAX = 8;
    const px = (D) => X0 + (D / DMAX) * LW; const py = (T) => Y0 - (T / TMAX) * LH;
    c.strokeStyle = C.ink; c.lineWidth = 3;
    c.beginPath(); c.moveTo(X0, py(TMAX)); c.lineTo(X0, Y0); c.lineTo(X0 + LW, Y0); c.stroke();
    c.font = Pagina.font('n', 32); c.fillStyle = C.ink;
    c.textAlign = 'right'; [0, 2, 4, 6, 8].forEach((t) => c.fillText(String(t), X0 - 14, py(t) + 11));
    c.textAlign = 'center'; [0, 2000, 4000, 6000, 8000].forEach((d) => c.fillText(mila(d), px(d), Y0 + 42));
    c.font = Pagina.font('b', 32); c.textAlign = 'left'; c.fillText('T (m)', x, py(TMAX) - 30);
    c.textAlign = 'right'; c.fillText('Δ (t)', X0 + LW, Y0 - 14);
    [[T_SCARICA, 'scarica', C.ink2], [T_ESTIVA, 'marca estiva', C.ink2], [PONTE, 'ponte', C.ink2]].forEach(([t, nome, col]) => {
      c.strokeStyle = col; c.lineWidth = 2; c.setLineDash([10, 8]);
      c.beginPath(); c.moveTo(X0, py(t)); c.lineTo(px(disl(t)), py(t)); c.lineTo(px(disl(t)), Y0); c.stroke(); c.setLineDash([]);
      c.font = Pagina.font('n', 32); c.fillStyle = C.ink2; c.textAlign = 'left'; c.fillText(nome, X0 + 14, py(t) - 12);
    });
    c.strokeStyle = C.acqua; c.lineWidth = 6; c.beginPath();
    for (let i = 30; i <= 780; i += 10) { const t = i / 100; const X = px(disl(t)); const Y = py(t); if (i === 30) c.moveTo(X, Y); else c.lineTo(X, Y); }
    c.stroke();
    const T = T1(); c.fillStyle = C.ocra; c.beginPath(); c.arc(px(disl(T)), py(T), 14, 0, Math.PI * 2); c.fill();
    c.textAlign = 'left';
  }

  lez.registra(() => {
    const p = Libro.stato(N).prevedi;
    const RISPOSTE = { a: 'a nave scarica', b: 'a nave quasi a pieno carico', c: 'di quanto basta, sempre uguale' };
    const T = T1(); const sc = schedaCarico();
    const TA = T2(); const dTv = (TA - T_ESTIVA) * 100;
    const sNetta = VOCI.reduce((s, v, i) => s + v[1] * nt.segni[i], 0);
    const segno = (s) => (s === 1 ? '+' : s === -1 ? '−' : '?');
    const confronto = c1.cm.scarica && c1.cm.carica;
    return [
      {
        passo: 0,
        sx: [
          { t: 'titolo', testo: 'Il peso dell\'acqua spostata' },
          { t: 'p', testo: 'Si dice che il **dislocamento** Δ (*displacement*) sia il peso della nave. In realtà è la misura della spinta idrostatica che la nave riceve. {{slide 2}}' },
          { t: 'p', testo: 'Per il principio di Archimede è il peso dell\'acqua spostata dalla parte immersa: un volume d\'acqua uguale al volume di carena. {{slide 2}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La formula' },
          { t: 'formula', testo: 'Δ = ∇ · ρ' },
          { t: 'p', testo: '∇ volume di carena (m³), ρ densità dell\'acqua: in media **1,025 t/m³** in mare. Nelle zone salmastre diminuisce fino a 1, l\'acqua dolce. {{slide 3}}' },
          { t: 'p', size: 34, testo: 'Più pesi a bordo: la nave si immerge finché il volume di carena in più dà una spinta uguale al peso aggiunto. {{slide 5}}' },
        ],
      },
      {
        passo: 1,
        sx: [
          { t: 'titolo', testo: 'Prima di provare' },
          { t: 'p', testo: 'Imbarchi 100 t due volte sulla stessa nave: una volta a nave scarica, una volta quando è quasi a pieno carico.' },
        ],
        dx: [
          { t: 'sotto', testo: 'Quando si immerge di più?' },
          { t: 'spazio', h: 20 },
          { t: 'scelta', id: 'p:a', testo: 'A nave scarica', on: p === 'a' },
          { t: 'scelta', id: 'p:b', testo: 'A nave quasi a pieno carico', on: p === 'b' },
          { t: 'scelta', id: 'p:c', testo: 'Uguale: sono sempre 100 t', on: p === 'c' },
        ],
      },
      {
        passo: 2, mondo: creaCarico, azione: comandiCarico, richiede: lez.fatto.prevedi, avviso: 'Se salti, niente bandiera.',
        sx: [
          ...(p ? [{ t: 'nota', testo: `La tua previsione: ${RISPOSTE[p]}.` }] : []),
          { t: 'sotto', testo: 'Imbarca e sbarca' },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'c:10', testo: '+10 t' }, { id: 'c:100', testo: '+100 t' }, { id: 'c:1000', testo: '+1000 t' }] },
          { t: 'bottoni', h: 76, size: 32, lista: [{ id: 'c:-10', testo: '−10 t' }, { id: 'c:-100', testo: '−100 t' }, { id: 'c:-1000', testo: '−1000 t' }] },
          { t: 'formula', testo: `Δ = ${mila(disl(T))} t   ·   T = ${num(T, 2)} m` },
          { t: 'p', size: 32, testo: `TPC = ${num(tpc(T), 2)} t/cm   ·   riserva di spinta ${mila(RISERVA(T))} t` },
          { t: 'riquadro', size: 32, colore: sc.colore, testo: sc.testo },
          ...lez.missioni().slice(0, 4),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: `In grigio il carico, in ocra la riserva di spinta: la parte stagna emersa fino al ponte. Scafo disegnato, lungo 90 m: nave scarica a ${num(T_SCARICA)} m, marca estiva a ${num(T_ESTIVA)} m.` },
          ...(confronto ? [{ t: 'esito', tipo: 'giusto', testo: `100 t a nave scarica: ${num(c1.cm.scarica.cm)} cm; quasi a pieno carico: ${num(c1.cm.carica.cm)} cm.` }] : []),
        ],
      },
      {
        passo: 2, mondo: creaAcqua, azione: comandiAcqua, richiede: () => ['scarica', 'carica', 'pieno', 'riserva'].every((x) => lez.fatte.has(x)), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'Dal mare al fiume' },
          { t: 'p', size: 32, testo: `La stessa nave alla marca estiva in mare: Δ = ${mila(D_PIENO())} t, TPC = ${num(tpc(T_ESTIVA), 2)} t/cm. Il peso non cambia: scegli l'acqua.` },
          { t: 'bottoni', h: 80, size: 32, lista: ACQUE.map(([r, nome]) => ({ id: `r:${r}`, testo: nome, on: c2.rho === r })) },
          { t: 'formula', testo: `ρ = ${num(c2.rho, 3)} t/m³   ·   T = ${num(TA, 3)} m` },
          { t: 'riquadro', size: 32, colore: c2.rho === RHO ? C.ink2 : '#8C7020', testo: c2.rho === RHO
            ? 'In mare la nave galleggia alla marca estiva.'
            : `La nave si immerge di **${num(dTv, 2)} cm**. Con la formula: δT = Δ / TPC · (1,025 − ρ) / ρ = ${num(dTformula(c2.rho), 2)} cm.${c2.rho === 1 ? ` In acqua dolce δT è la **FWA**: Δ / (40 · TPC) = ${num(FWA(), 2)} cm.` : ''} {{slide 20, 21}}` },
          ...lez.missioni().slice(4, 6),
        ],
        dx: [
          ...Lezione.finestra(760),
          { t: 'nota', testo: 'Densità 1,014 e 1,008 dagli esempi della slide 22. Il dislocamento resta uguale: cambia il volume di carena.' },
        ],
      },
      {
        passo: 2, azione: comandiNetta, richiede: () => lez.fatte.has('salmastra') && lez.fatte.has('fwa'), avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'sotto', testo: 'La portata netta' },
          { t: 'p', size: 32, testo: 'Traversata di 3 giorni in acqua tropicale, 10 in estiva, 16 in invernale: si parte dalla portata lorda della zona invernale, la marca più bassa. Tocca ogni voce: si somma o si sottrae? {{slide 31}}' },
          ...VOCI.map(([nome, v], i) => ({ t: 'bottoni', h: 66, size: 32, lista: [{ id: `nt:${i}`, testo: `${segno(nt.segni[i])}   ${nome}: ${mila(v, v % 1 ? 1 : 0)} t`, on: nt.segni[i] === VOCI[i][2] }] })),
          ...lez.missioni().slice(6),
        ],
        dx: [
          { t: 'spazio', h: 30 },
          { t: 'formula', testo: `Portata netta = ${mila(sNetta, 1)} t` },
          ...(giusta() ? [
            { t: 'formula', testo: 'DW + Co − (Bunker + R + A + Σ)' },
            { t: 'p', size: 32, testo: '23 420 + 832 − (1862,8 + 86 + 302 + 145) = **21 856,2 t**. Co: acqua e combustibile consumati nei 13 giorni prima della zona invernale. {{slide 28, 31}}' },
          ] : [{ t: 'nota', testo: 'Bunker = 56 · 29 + 20% − 86 = 1862,8 t; A: acqua potabile 232 t e zavorra 70 t. Slide 31.' }]),
        ],
      },
      {
        passo: 3, aletta: lez.fatto.aletta, richiede: lez.fatto.missioni, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Che cosa succede' },
          ...(p ? [{ t: 'nota', testo: p === 'a' ? 'Avevi previsto giusto.' : `Avevi previsto: ${RISPOSTE[p]}.` }] : []),
          { t: 'p', testo: 'Si immerge di più **a nave scarica**. Le figure di galleggiamento si restringono verso la chiglia: AW è più piccola, e il TPC con lei. {{slide 13}}' },
          { t: 'p', size: 34, testo: 'Per questo i calcoli con il TPC sono approssimati oltre pochi centimetri. {{slide 13}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Nello scafo disegnato' },
          { t: 'tabella', col: [30, 35, 35], size: 32, righe: [
            ['T', 'TPC', '100 t'],
            ...[3, 4, 5, 6].map((t) => [`${num(t)} m`, `${num(tpc(t), 2)} t/cm`, `${num(100 / tpc(t))} cm`]),
          ] },
          { t: 'p', size: 32, testo: 'Valori calcolati dalla forma dello scafo comune, non da una nave delle slide.' },
        ],
      },
      {
        passo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [
          { t: 'titolo', testo: 'Dove agiscono le forze' },
          { t: 'p', size: 36, testo: 'Il dislocamento, inteso come peso, si applica nel **baricentro G** (*centre of gravity*); la spinta nel **centro di carena B** (*centre of buoyancy*). {{slide 4}}' },
          { t: 'p', size: 34, testo: 'Più esattamente la spinta si applica nel centro di spinta: più in basso di B, ma sulla stessa verticale. È la risultante delle pressioni sulle varie parti dello scafo. {{slide 4}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La scala di solidità' },
          { t: 'disegno', h: 560, fn: scala },
          { t: 'p', size: 32, testo: 'Dislocamento e immersione: la *displacement curve* dello scafo comune. In ocra il punto della prova. {{slide 5}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Leggero e pesante' },
          { t: 'p', size: 34, testo: '**Dislocamento leggero** (*lightweight displacement*): nave completamente allestita, senza carico, equipaggio e consumabili. Immersione minima. {{slide 6}}' },
          { t: 'p', size: 34, testo: '**Dislocamento pesante** (*full loaded displacement*, *design displacement*): immersione massima, data dal minimo bordo libero estivo. {{slide 6}}' },
          { t: 'p', size: 34, testo: 'Tra le due immersioni c\'è il bagnasciuga: opera viva o opera morta secondo il carico. {{slide 7}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La riserva di spinta' },
          { t: 'p', size: 34, testo: 'Contro la Load Lines Convention, la nave potrebbe immergersi oltre la marca estiva, fino al ponte di bordo libero. {{slide 7}}' },
          { t: 'p', size: 34, testo: 'Il bordo libero è stagno ma va tenuto asciutto: la spinta che darebbe in emergenza, per esempio con acqua imbarcata da una falla, è la **riserva di spinta** (*reserve buoyancy*). {{slide 8}}' },
          { t: 'riquadro', size: 32, testo: 'Riserva di spinta = Δ immersa fino al ponte di bordo libero − Δ al galleggiamento attuale. {{slide 8}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Il dislocamento unitario' },
          { t: 'p', size: 34, testo: 'Il **TPC** (*tons per centimeter*) è il dislocamento di una fetta di carena alta 1 cm: il peso che, imbarcato o sbarcato, cambia l\'immersione media di 1 cm. {{slide 10}}' },
          { t: 'formula', testo: 'TPC = (AW · 0,01) · ρ = AW / 100 · ρ' },
          { t: 'p', size: 32, testo: 'Esempio: LWL = 123,40 m, BWL = 22,70 m, CWP = 0,85 → TPC = 123,4 · 22,7 · 0,85 / 100 · 1,025 = 24,4 t/cm. {{slide 12}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'A che cosa serve' },
          { t: 'p', size: 34, testo: 'Quanto peso sbarcare per passare su un bassofondo con un certo tirante d\'acqua sotto la chiglia, **UKC** (*under keel clearance*), o quanto imbarcare per passare sotto un ponte con un certo tirante d\'aria, **OC** (*overhead clearance*). {{slide 11}}' },
          { t: 'riquadro', size: 32, testo: 'TPC = 50 t/cm: 300 t imbarcate → 300 / 50 = 6 cm in più. Da 6,20 a 6,10 m → 50 · 10 = 500 t da sbarcare. {{slide 11}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Densità diversa' },
          { t: 'p', size: 34, testo: 'Il TPC di solito è quello in acqua salata. A galleggiamento immutato, AW costante, alla densità ρ: {{slide 14}}' },
          { t: 'formula', testo: 'TPC\' = TPC · ρ / 1,025' },
          { t: 'formula', testo: 'Δ\' = Δ · ρ / 1,025' },
          { t: 'p', size: 32, testo: 'Con ρ = 1,010: TPC\' = 24,4 · 1,010 / 1,025 = 24,04 t/cm. {{slide 15}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Dal mare al fiume' },
          { t: 'p', size: 32, testo: 'Il peso resta uguale: con ρ minore serve più volume di carena, e l\'immersione aumenta. All\'inverso, dal fiume al mare, ∇ e T diminuiscono. {{slide 16}}' },
          { t: 'formula', testo: 'δT = Δ / (100 · TPC) · (1,025 − ρB) / ρB   [m]' },
          { t: 'p', size: 32, testo: 'Senza il /100 il risultato è in cm. In acqua dolce (1,025 − 1) / 1 = 1/40: {{slide 20, 21}}' },
          { t: 'formula', testo: 'FWA = Δ / (40 · TPC)   [cm]' },
          { t: 'p', size: 32, testo: '*Fresh water allowance*: da acqua del tutto dolce a del tutto salata, o viceversa. {{slide 21}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'La portata lorda' },
          { t: 'p', size: 34, testo: 'La **portata** è il peso che si può imbarcare senza superare il galleggiamento massimo. {{slide 23}}' },
          { t: 'formula', testo: 'DW = Δ pesante − Δ leggero' },
          { t: 'p', size: 32, testo: 'Portata lorda (*deadweight*): carico, bunker (il combustibile), zavorra, acqua potabile e costante nave. La correlazione con l\'immersione è nella scala delle portate (*deadweight scale*) del cantiere. {{slide 23, 24}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'La portata netta' },
          { t: 'p', size: 34, testo: 'Solo il carico pagante: la portata lorda meno i pesi operativi. È la **portata netta** (*net capacity*, *payload*): serve per i contratti e per il piano di carico, e dipende dalla traversata. {{slide 24}}' },
          { t: 'p', size: 32, testo: 'Da non confondere con la **stazza** (GT): misura il volume degli spazi chiusi, non un peso. {{slide 25}}' },
        ],
      },
      {
        passo: 3,
        sx: [
          { t: 'titolo', testo: 'Traversata e stivaggio' },
          { t: 'p', size: 32, testo: 'L\'articolo 12 della LL Convention vieta di sommergere le marche della zona di navigazione. Da un porto fluviale si può caricare in più il peso del combustibile e dell\'acqua necessari per arrivare al mare. {{slide 26}}' },
          { t: 'formula', testo: 'Bunker = cd · Δt + r − R' },
          { t: 'p', size: 32, testo: 'cd consumo giornaliero, Δt giorni di traversata, r riserva (circa il 20% del minimo necessario), R rimanenze a bordo. {{slide 27}}' },
        ],
        dx: [
          { t: 'titolo', testo: 'Il calcolo' },
          { t: 'formula', testo: 'Net capacity = DWFBmax + Co − (Bunker + R + A + Σ)' },
          { t: 'p', size: 32, testo: 'DWFBmax portata lorda della zona di massimo bordo libero; Co liquidi consumati fino a quella zona; A acqua per gli usi di bordo; Σ pesi morti. {{slide 28, 29}}' },
          { t: 'p', size: 32, testo: '**Costante nave** (*ship constant*): fanghi impompabili, ruggine, vernice, ricambi aggiunti nel tempo. Da qualche decina a qualche centinaio di tonnellate. {{slide 30}}' },
        ],
      },
      {
        passo: 4, gruppo: 1, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizi: TPC' }, ...lez.calcoloSx(1)],
        dx: [...lez.calcoloDx(1)],
      },
      {
        passo: 4, gruppo: 2, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizi: densità' }, ...lez.calcoloSx(2)],
        dx: [...lez.calcoloDx(2)],
      },
      {
        passo: 4, gruppo: 3, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Esercizio: bunker' }, ...lez.calcoloSx(3)],
        dx: [...lez.calcoloDx(3)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(11), ...lez.domanda(12)],
        dx: [...lez.domanda(13), ...lez.domanda(14)],
      },
      {
        passo: 4, richiede: lez.fatto.aletta, avviso: 'Se salti, niente bandiera.',
        sx: [{ t: 'titolo', testo: 'Riconosci' }, ...lez.domanda(15), ...lez.domanda(16)],
        dx: [...lez.domanda(17), ...lez.domanda(18)],
      },
      lez.premio(() => lez.fatto.quiz([...QUIZ, ...CALCOLI].map((q) => q.n))),
    ];
  });
})();
