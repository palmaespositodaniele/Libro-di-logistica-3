/* Note per il docente: uso in classe, fonti citate nelle slide, crediti e licenze */
(function () {
  Motore.sezione('docente', {
    spreads: () => [
      {
        sx: [
          { t: 'titolo', testo: 'Note per il docente' },
          { t: 'p', size: 38, testo: 'Il libro accompagna le slide, non le sostituisce: lo studente prevede, prova e verifica. Ogni pagina cita la slide da cui vengono dati ed esercizi.' },
          { t: 'sotto', testo: 'Sulla LIM' },
          { t: 'p', size: 38, testo: 'Quando manca un passaggio, Avanti diventa **Salta**: si può presentare la lezione senza svolgerla. Senza tutti i passaggi la bandiera non arriva.' },
        ],
        dx: [
          { t: 'sotto', testo: 'In realtà virtuale' },
          { t: 'p', size: 38, testo: 'Serve un visore con un browser WebXR. Meglio sessioni brevi, di 5–10 minuti, a turno, mentre la classe segue sulla LIM.' },
          { t: 'p', size: 38, testo: 'Si punta e si preme il grilletto; ci si sposta con il teletrasporto.' },
          { t: 'sotto', testo: 'I progressi' },
          { t: 'p', size: 38, testo: 'Restano nel browser di ogni dispositivo: non arrivano al docente. Si azzerano dalla pagina delle bandiere.' },
        ],
      },
      {
        sx: [
          { t: 'titolo', testo: 'Fonti citate nelle slide' },
          { t: 'tabella', col: [16, 84], size: 36, righe: [
            ['Lez.', 'Fonte'],
            ['10', 'SOLAS, Chapter II-1, Regulations 12, 13, 15 e 15-1'],
            ['14', 'Fondamenti di costruzione e gestione della nave, volume 1, capitolo 6'],
            ['15', 'Fondamenti di costruzione e gestione della nave, volume 1, capitolo 7'],
          ] },
        ],
        dx: [
          { t: 'tabella', col: [16, 84], size: 36, righe: [
            ['Lez.', 'Fonte'],
            ['16', 'Fondamenti di Costruzione e Gestione della nave 1, cap. 9 (figure 9.4, 9.5, 9.8) e cap. 10'],
            ['16', 'Convenzione internazionale sul bordo libero (Londra 1966) e Protocollo 1988'],
            ['16', 'Convenzione LL, Annesso II: zone e aree stagionali'],
          ] },
        ],
      },
      {
        sx: [
          { t: 'titolo', testo: 'Scelte del libro' },
          { t: 'p', size: 38, testo: 'Le scene 3D sono schematiche, non disegni tecnici di navi reali. Dove la scala è alterata, la pagina lo dice. I significati delle bandiere vengono dal Codice internazionale dei segnali, non dalle slide.' },
        ],
        dx: [
          { t: 'titolo', testo: 'Crediti e licenze' },
          { t: 'tabella', col: [46, 54], size: 36, righe: [
            ['Componente', 'Licenza'],
            ['Three.js r158', 'MIT, © 2010-2023 Three.js Authors'],
            ['Bitter', 'OFL 1.1, © 2011 The Bitter Project Authors'],
            ['Atkinson Hyperlegible', 'OFL 1.1, © 2020 Braille Institute of America, Inc.'],
            ['Architects Daughter', 'OFL 1.1, © 2010 Kimberly Geswein'],
          ] },
          { t: 'nota', testo: 'Testi completi nel file assets/LICENZE.txt' },
        ],
      },
    ],
  });
})();
