export const musicDatabase = [
  // ─── MELANCHOLIC + SLOW ───────────────────────────────────
  {
    id: "barber_adagio",
    title: "Adagio for Strings",
    composer: "Samuel Barber",
    moods: ["melancholic", "grief", "longing"],
    pacing: "slow",
    instrumentation: "string_orchestra",
    key: "B minor",
    bpm: "44-58",
    spotifySearch: "Adagio for Strings Barber",
    youtubeSearch: "Barber Adagio for Strings",
    notes: "The slow chromatic climb followed by collapse mirrors a character's hope giving way to despair."
  },
  {
    id: "part_spiegel",
    title: "Spiegel im Spiegel",
    composer: "Arvo Pärt",
    moods: ["melancholic", "longing", "serene"],
    pacing: "slow",
    instrumentation: "piano_and_strings",
    key: "F major",
    bpm: "50-60",
    spotifySearch: "Spiegel im Spiegel Pärt",
    youtubeSearch: "Arvo Part Spiegel im Spiegel",
    notes: "Tintinnabuli technique creates timeless, suspended grief. Perfect for quiet loss."
  },
  {
    id: "gorecki_symphony3",
    title: "Symphony No.3 — 2nd Movement",
    composer: "Henryk Górecki",
    moods: ["melancholic", "grief", "desperate"],
    pacing: "slow",
    instrumentation: "full_orchestra",
    key: "A minor",
    bpm: "40-52",
    spotifySearch: "Gorecki Symphony No 3 Sorrowful Songs",
    youtubeSearch: "Gorecki Symphony 3 second movement",
    notes: "A mother's lament. Overwhelming grief that builds to devastation then recedes."
  },
  {
    id: "satie_gymnopedie1",
    title: "Gymnopédie No.1",
    composer: "Erik Satie",
    moods: ["melancholic", "serene", "bittersweet"],
    pacing: "slow",
    instrumentation: "solo_piano",
    key: "D major",
    bpm: "56-66",
    spotifySearch: "Gymnopedie No 1 Satie",
    youtubeSearch: "Satie Gymnopedie No 1",
    notes: "Wistful and suspended. Melancholy without despair — a quiet acceptance."
  },
  {
    id: "bach_cello_suite1",
    title: "Cello Suite No.1 — Prelude",
    composer: "Johann Sebastian Bach",
    moods: ["melancholic", "searching", "introspective"],
    pacing: "flowing",
    instrumentation: "solo_cello",
    key: "G major",
    bpm: "60-72",
    spotifySearch: "Bach Cello Suite No 1 Prelude",
    youtubeSearch: "Bach Cello Suite 1 Prelude",
    notes: "Solitary and searching. The sound of a mind working through something alone."
  },

  // ─── TENSE + URGENT ──────────────────────────────────────
  {
    id: "herrmann_psycho",
    title: "Psycho — Prelude",
    composer: "Bernard Herrmann",
    moods: ["tense", "dread", "unsettled"],
    pacing: "urgent",
    instrumentation: "string_orchestra",
    key: "C major",
    bpm: "120-132",
    spotifySearch: "Psycho Prelude Bernard Herrmann",
    youtubeSearch: "Herrmann Psycho Prelude strings",
    notes: "Stabbing repetition creates unbearable anticipation. Dread made audible."
  },
  {
    id: "shostakovich_quartet8",
    title: "String Quartet No.8 — 1st Movement",
    composer: "Dmitri Shostakovich",
    moods: ["tense", "ominous", "desperate"],
    pacing: "slow",
    instrumentation: "string_quartet",
    key: "C minor",
    bpm: "48-58",
    spotifySearch: "Shostakovich String Quartet No 8",
    youtubeSearch: "Shostakovich String Quartet 8 first movement",
    notes: "Suppressed violence beneath a still surface. Something terrible held in check."
  },
  {
    id: "stravinsky_rite",
    title: "The Rite of Spring — Augurs of Spring",
    composer: "Igor Stravinsky",
    moods: ["tense", "urgent", "primal"],
    pacing: "urgent",
    instrumentation: "full_orchestra",
    key: "E major",
    bpm: "132-152",
    spotifySearch: "Stravinsky Rite of Spring Augurs",
    youtubeSearch: "Stravinsky Rite of Spring Augurs of Spring",
    notes: "Relentless pounding rhythm. Unstoppable force. Ritual violence."
  },
  {
    id: "beethoven_sym5_mvt1",
    title: "Symphony No.5 — 1st Movement",
    composer: "Ludwig van Beethoven",
    moods: ["tense", "driven", "inevitable"],
    pacing: "urgent",
    instrumentation: "full_orchestra",
    key: "C minor",
    bpm: "108-120",
    spotifySearch: "Beethoven Symphony 5 first movement",
    youtubeSearch: "Beethoven Symphony No 5 first movement",
    notes: "Fate knocking at the door. Forward momentum that cannot be stopped."
  },

  // ─── MYSTERIOUS + FLOWING ─────────────────────────────────
  {
    id: "debussy_clair_de_lune",
    title: "Clair de Lune",
    composer: "Claude Debussy",
    moods: ["mysterious", "serene", "introspective"],
    pacing: "flowing",
    instrumentation: "solo_piano",
    key: "D flat major",
    bpm: "52-66",
    spotifySearch: "Clair de Lune Debussy",
    youtubeSearch: "Debussy Clair de Lune",
    notes: "Impressionist ambiguity. The world seen through water — beautiful and unclear."
  },
  {
    id: "vaughan_williams_lark",
    title: "The Lark Ascending",
    composer: "Ralph Vaughan Williams",
    moods: ["mysterious", "hopeful", "vast"],
    pacing: "flowing",
    instrumentation: "string_orchestra",
    key: "G major",
    bpm: "60-76",
    spotifySearch: "The Lark Ascending Vaughan Williams",
    youtubeSearch: "Vaughan Williams The Lark Ascending",
    notes: "A solo violin soaring above the landscape. Freedom and discovery."
  },
  {
    id: "rimsky_scheherazade",
    title: "Scheherazade — 1st Movement",
    composer: "Nikolai Rimsky-Korsakov",
    moods: ["mysterious", "exotic", "searching"],
    pacing: "flowing",
    instrumentation: "full_orchestra",
    key: "E major",
    bpm: "60-80",
    spotifySearch: "Scheherazade Rimsky-Korsakov",
    youtubeSearch: "Rimsky-Korsakov Scheherazade first movement",
    notes: "A storyteller spinning a world from nothing. Mystery with momentum."
  },

  // ─── EPIC + BUILDING ──────────────────────────────────────
  {
    id: "holst_mars",
    title: "Mars, Bringer of War",
    composer: "Gustav Holst",
    moods: ["epic", "ominous", "relentless"],
    pacing: "building",
    instrumentation: "full_orchestra",
    key: "C minor",
    bpm: "80-96",
    spotifySearch: "Holst Mars Bringer of War Planets",
    youtubeSearch: "Holst Mars Bringer of War",
    notes: "Unstoppable mechanical dread. The sound of something vast and indifferent approaching."
  },
  {
    id: "orff_o_fortuna",
    title: "O Fortuna",
    composer: "Carl Orff",
    moods: ["epic", "wrathful", "vast"],
    pacing: "urgent",
    instrumentation: "full_orchestra",
    key: "C minor",
    bpm: "132-152",
    spotifySearch: "O Fortuna Carmina Burana Orff",
    youtubeSearch: "Orff O Fortuna Carmina Burana",
    notes: "The wheel of fortune turning. Fate as overwhelming force. Maximum impact."
  },
  {
    id: "beethoven_ode_to_joy",
    title: "Symphony No.9 — Ode to Joy",
    composer: "Ludwig van Beethoven",
    moods: ["epic", "triumphant", "transcendent"],
    pacing: "building",
    instrumentation: "full_orchestra",
    key: "D major",
    bpm: "88-108",
    spotifySearch: "Beethoven Symphony 9 Ode to Joy",
    youtubeSearch: "Beethoven Symphony 9 fourth movement Ode to Joy",
    notes: "Hard-won triumph. Joy that has been earned through suffering. The arrival."
  },

  // ─── EERIE + STILLNESS ────────────────────────────────────
  {
    id: "ligeti_lux_aeterna",
    title: "Lux Aeterna",
    composer: "György Ligeti",
    moods: ["eerie", "vast", "unsettled"],
    pacing: "stillness",
    instrumentation: "choir",
    key: "atonal",
    bpm: "30-40",
    spotifySearch: "Ligeti Lux Aeterna",
    youtubeSearch: "Ligeti Lux Aeterna",
    notes: "Micropolyphony creates a shimmering, sourceless sound. The uncanny made beautiful."
  },
  {
    id: "penderecki_threnody",
    title: "Threnody for the Victims of Hiroshima",
    composer: "Krzysztof Penderecki",
    moods: ["eerie", "grief", "desperate"],
    pacing: "stillness",
    instrumentation: "string_orchestra",
    key: "atonal",
    bpm: "variable",
    spotifySearch: "Penderecki Threnody Victims Hiroshima",
    youtubeSearch: "Penderecki Threnody for the Victims of Hiroshima",
    notes: "Tone clusters and extended techniques create genuine terror. Grief as noise."
  },
  {
    id: "saint_saens_danse_macabre",
    title: "Danse Macabre",
    composer: "Camille Saint-Saëns",
    moods: ["eerie", "playful", "ominous"],
    pacing: "urgent",
    instrumentation: "full_orchestra",
    key: "G minor",
    bpm: "108-120",
    spotifySearch: "Saint-Saens Danse Macabre",
    youtubeSearch: "Saint-Saens Danse Macabre",
    notes: "Death playing the violin at midnight. Macabre but with dark humour."
  },

  // ─── ROMANTIC + FLOWING ───────────────────────────────────
  {
    id: "rachmaninoff_pc2",
    title: "Piano Concerto No.2 — 2nd Movement",
    composer: "Sergei Rachmaninoff",
    moods: ["romantic", "longing", "bittersweet"],
    pacing: "flowing",
    instrumentation: "piano_and_strings",
    key: "E major",
    bpm: "52-66",
    spotifySearch: "Rachmaninoff Piano Concerto No 2 second movement",
    youtubeSearch: "Rachmaninoff Piano Concerto 2 second movement",
    notes: "Impossible longing. Love that knows it cannot last. The most beautiful sadness."
  },
  {
    id: "brahms_violin_sonata1",
    title: "Violin Sonata No.1 — 2nd Movement",
    composer: "Johannes Brahms",
    moods: ["romantic", "serene", "introspective"],
    pacing: "slow",
    instrumentation: "piano_and_strings",
    key: "A major",
    bpm: "48-58",
    spotifySearch: "Brahms Violin Sonata No 1 second movement",
    youtubeSearch: "Brahms Violin Sonata 1 second movement",
    notes: "Warm, autumnal intimacy. Two voices in quiet conversation."
  }
];