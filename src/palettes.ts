// ============================================================
// COLOR PALETTE DEFINITIONS — 24 palettes
// Each palette maps the same 21 semantic color tokens to
// different values. The "id" is stored in localStorage and
// applied by ColorSwitcher at runtime.
// ============================================================

export interface Palette {
  id: string;
  label: { en: string; fr: string };
  colors: Record<string, string>;
}

const palettes: Palette[] = [
  // ═══════════════════════════════════════════════════════
  // 0–3: Original four
  // ═══════════════════════════════════════════════════════

  // ── 0: Gold & Burgundy (default, Canadian) ──
  {
    id: 'gold-burgundy',
    label: { en: 'Gold & Burgundy', fr: 'Or & Bourgogne' },
    colors: {
      '--color-red': '#cc1f2d', '--color-red-dark': '#a01824',
      '--color-cream': '#f4efea', '--color-ink': '#0f1115',
      '--color-ink-card': '#161920', '--color-olive': '#463f31',
      '--color-gold': '#c2a15c', '--color-gold-light': '#e8d5b5',
      '--color-gold-hover': '#b08f4c', '--color-body': '#241f16',
      '--color-body-alt': '#3a382f', '--color-muted': '#7a7461',
      '--color-muted-dark': '#5a5445', '--color-muted-gold': '#a17c33',
      '--color-text-light': '#e2ddcf', '--color-text-light-alt': '#d9d4c6',
      '--color-text-muted': '#9c9787', '--color-text-muted-alt': '#c8c3b4',
      '--color-border-light': '#d0c9b6', '--color-border-dark': '#3a3325',
      '--color-border-dark-alt': '#5a5241',
    },
  },

  // ── 1: Plum & Copper ──
  {
    id: 'plum-copper',
    label: { en: 'Plum & Copper', fr: 'Prune & Cuivre' },
    colors: {
      '--color-red': '#9b2c4c', '--color-red-dark': '#7a1e3c',
      '--color-cream': '#f6f0ed', '--color-ink': '#110f10',
      '--color-ink-card': '#1a1618', '--color-olive': '#423031',
      '--color-gold': '#c4855c', '--color-gold-light': '#e8c9b0',
      '--color-gold-hover': '#a87048', '--color-body': '#241a1b',
      '--color-body-alt': '#3a2e2f', '--color-muted': '#8a7470',
      '--color-muted-dark': '#635450', '--color-muted-gold': '#a06644',
      '--color-text-light': '#ede0d9', '--color-text-light-alt': '#e0d3cb',
      '--color-text-muted': '#a0948e', '--color-text-muted-alt': '#cfc2ba',
      '--color-border-light': '#d8c9bf', '--color-border-dark': '#3a2b28',
      '--color-border-dark-alt': '#5c4a43',
    },
  },

  // ── 2: Sage & Honey ──
  {
    id: 'sage-honey',
    label: { en: 'Sage & Honey', fr: 'Sauge & Miel' },
    colors: {
      '--color-red': '#8b7a3c', '--color-red-dark': '#6b5c2a',
      '--color-cream': '#f5f3ea', '--color-ink': '#11130f',
      '--color-ink-card': '#181a14', '--color-olive': '#4a4635',
      '--color-gold': '#c29b4a', '--color-gold-light': '#e5d098',
      '--color-gold-hover': '#a88138', '--color-body': '#222016',
      '--color-body-alt': '#38362f', '--color-muted': '#7d7861',
      '--color-muted-dark': '#5d5845', '--color-muted-gold': '#9b7a30',
      '--color-text-light': '#e2dfcb', '--color-text-light-alt': '#d6d3be',
      '--color-text-muted': '#9c9887', '--color-text-muted-alt': '#c8c3b0',
      '--color-border-light': '#d0cdb4', '--color-border-dark': '#383a25',
      '--color-border-dark-alt': '#585a41',
    },
  },

  // ── 3: Steel & Silver ──
  {
    id: 'steel-silver',
    label: { en: 'Steel & Silver', fr: 'Acier & Argent' },
    colors: {
      '--color-red': '#4a6fa5', '--color-red-dark': '#3a5580',
      '--color-cream': '#f2f4f6', '--color-ink': '#0f1114',
      '--color-ink-card': '#16181d', '--color-olive': '#3d424a',
      '--color-gold': '#a8b4c2', '--color-gold-light': '#d4dbe3',
      '--color-gold-hover': '#8a96a4', '--color-body': '#1c2028',
      '--color-body-alt': '#323840', '--color-muted': '#78828e',
      '--color-muted-dark': '#58626e', '--color-muted-gold': '#808a96',
      '--color-text-light': '#dde1e6', '--color-text-light-alt': '#d0d5db',
      '--color-text-muted': '#949ba4', '--color-text-muted-alt': '#c4c9cf',
      '--color-border-light': '#c8ced5', '--color-border-dark': '#2d333a',
      '--color-border-dark-alt': '#4a525a',
    },
  },

  // ═══════════════════════════════════════════════════════
  // 4–8: Warm / Orange / Terra-cotta family
  // ═══════════════════════════════════════════════════════

  // ── 4: Terracotta & Sand ──
  {
    id: 'terracotta-sand',
    label: { en: 'Terracotta & Sand', fr: 'Terre cuite & Sable' },
    colors: {
      '--color-red': '#d47a4a', '--color-red-dark': '#b05e38',
      '--color-cream': '#f6f0e8', '--color-ink': '#14100e',
      '--color-ink-card': '#1c1714', '--color-olive': '#4a3a2e',
      '--color-gold': '#c4946a', '--color-gold-light': '#e8cfb0',
      '--color-gold-hover': '#a87a52', '--color-body': '#241c16',
      '--color-body-alt': '#3a3028', '--color-muted': '#8a7a68',
      '--color-muted-dark': '#635848', '--color-muted-gold': '#a07048',
      '--color-text-light': '#ede0d0', '--color-text-light-alt': '#e0d3c2',
      '--color-text-muted': '#a09484', '--color-text-muted-alt': '#cfc2b0',
      '--color-border-light': '#d8cab8', '--color-border-dark': '#3a2c20',
      '--color-border-dark-alt': '#5c4a38',
    },
  },

  // ── 5: Cinnamon & Cream ──
  {
    id: 'cinnamon-cream',
    label: { en: 'Cinnamon & Cream', fr: 'Cannelle & Crème' },
    colors: {
      '--color-red': '#c07040', '--color-red-dark': '#9c5830',
      '--color-cream': '#f7f2ec', '--color-ink': '#13100e',
      '--color-ink-card': '#1b1714', '--color-olive': '#46382e',
      '--color-gold': '#be9868', '--color-gold-light': '#e4cfaa',
      '--color-gold-hover': '#a47e50', '--color-body': '#221c16',
      '--color-body-alt': '#383028', '--color-muted': '#867868',
      '--color-muted-dark': '#605848', '--color-muted-gold': '#9e7048',
      '--color-text-light': '#ebe0d0', '--color-text-light-alt': '#ded3c2',
      '--color-text-muted': '#9e9484', '--color-text-muted-alt': '#ccc2b0',
      '--color-border-light': '#d6cab8', '--color-border-dark': '#382c20',
      '--color-border-dark-alt': '#5a4a38',
    },
  },

  // ── 6: Amber & Charcoal ──
  {
    id: 'amber-charcoal',
    label: { en: 'Amber & Charcoal', fr: 'Ambre & Charbon' },
    colors: {
      '--color-red': '#d09830', '--color-red-dark': '#a87a22',
      '--color-cream': '#f6f0e2', '--color-ink': '#12100e',
      '--color-ink-card': '#1a1714', '--color-olive': '#484030',
      '--color-gold': '#c8a04a', '--color-gold-light': '#e8d498',
      '--color-gold-hover': '#ac8438', '--color-body': '#221e14',
      '--color-body-alt': '#383428', '--color-muted': '#867c60',
      '--color-muted-dark': '#605840', '--color-muted-gold': '#a08038',
      '--color-text-light': '#ebe2cc', '--color-text-light-alt': '#ded4be',
      '--color-text-muted': '#9e9680', '--color-text-muted-alt': '#ccc4ac',
      '--color-border-light': '#d6ccb0', '--color-border-dark': '#383420',
      '--color-border-dark-alt': '#5a5438',
    },
  },

  // ── 7: Rust & Ivory ──
  {
    id: 'rust-ivory',
    label: { en: 'Rust & Ivory', fr: 'Rouille & Ivoire' },
    colors: {
      '--color-red': '#b85830', '--color-red-dark': '#904420',
      '--color-cream': '#f5efe6', '--color-ink': '#13100e',
      '--color-ink-card': '#1b1714', '--color-olive': '#44382e',
      '--color-gold': '#bc8c60', '--color-gold-light': '#e2c8a8',
      '--color-gold-hover': '#a07048', '--color-body': '#221c16',
      '--color-body-alt': '#383028', '--color-muted': '#847868',
      '--color-muted-dark': '#5e5848', '--color-muted-gold': '#9c6840',
      '--color-text-light': '#eae0d0', '--color-text-light-alt': '#dcd3c2',
      '--color-text-muted': '#9c9484', '--color-text-muted-alt': '#cac2b0',
      '--color-border-light': '#d4cab8', '--color-border-dark': '#382c20',
      '--color-border-dark-alt': '#584a38',
    },
  },

  // ── 8: Mahogany & Brass ──
  {
    id: 'mahogany-brass',
    label: { en: 'Mahogany & Brass', fr: 'Acajou & Laiton' },
    colors: {
      '--color-red': '#8c3420', '--color-red-dark': '#6c2414',
      '--color-cream': '#f4eee6', '--color-ink': '#110e0c',
      '--color-ink-card': '#191512', '--color-olive': '#423428',
      '--color-gold': '#c49c60', '--color-gold-light': '#e6d0a8',
      '--color-gold-hover': '#a88048', '--color-body': '#221a12',
      '--color-body-alt': '#382e24', '--color-muted': '#847464',
      '--color-muted-dark': '#5e5444', '--color-muted-gold': '#a07040',
      '--color-text-light': '#eae0cc', '--color-text-light-alt': '#dcd2be',
      '--color-text-muted': '#9c9480', '--color-text-muted-alt': '#cac2ac',
      '--color-border-light': '#d4c8b0', '--color-border-dark': '#382a1c',
      '--color-border-dark-alt': '#584834',
    },
  },

  // ═══════════════════════════════════════════════════════
  // 9–13: Cool / Blue / Teal family
  // ═══════════════════════════════════════════════════════

  // ── 9: Teal & Copper ──
  {
    id: 'teal-copper',
    label: { en: 'Teal & Copper', fr: 'Sarcelle & Cuivre' },
    colors: {
      '--color-red': '#3a8c84', '--color-red-dark': '#2a6c64',
      '--color-cream': '#eef4f2', '--color-ink': '#0e1212',
      '--color-ink-card': '#141a18', '--color-olive': '#384440',
      '--color-gold': '#c4885c', '--color-gold-light': '#e8cbb0',
      '--color-gold-hover': '#a86e46', '--color-body': '#18201e',
      '--color-body-alt': '#2c3632', '--color-muted': '#6c8278',
      '--color-muted-dark': '#4c6058', '--color-muted-gold': '#a06a40',
      '--color-text-light': '#dce8e2', '--color-text-light-alt': '#cedcd6',
      '--color-text-muted': '#8c9e94', '--color-text-muted-alt': '#bcccc4',
      '--color-border-light': '#c0d4ca', '--color-border-dark': '#2c3830',
      '--color-border-dark-alt': '#485a50',
    },
  },

  // ── 10: Ocean & Sand ──
  {
    id: 'ocean-sand',
    label: { en: 'Ocean & Sand', fr: 'Océan & Sable' },
    colors: {
      '--color-red': '#4a78b0', '--color-red-dark': '#385c8c',
      '--color-cream': '#f0f2f5', '--color-ink': '#0f1215',
      '--color-ink-card': '#161a1e', '--color-olive': '#3c444a',
      '--color-gold': '#bca470', '--color-gold-light': '#e0d4b0',
      '--color-gold-hover': '#9e8858', '--color-body': '#1a2026',
      '--color-body-alt': '#30363c', '--color-muted': '#727c84',
      '--color-muted-dark': '#525c64', '--color-muted-gold': '#988050',
      '--color-text-light': '#dce2e8', '--color-text-light-alt': '#ced6dc',
      '--color-text-muted': '#8c949c', '--color-text-muted-alt': '#bcc4ca',
      '--color-border-light': '#c2cad2', '--color-border-dark': '#2a3238',
      '--color-border-dark-alt': '#485058',
    },
  },

  // ── 11: Mint & Charcoal ──
  {
    id: 'mint-charcoal',
    label: { en: 'Mint & Charcoal', fr: 'Menthe & Charbon' },
    colors: {
      '--color-red': '#64a070', '--color-red-dark': '#4a8056',
      '--color-cream': '#eff4ee', '--color-ink': '#101310',
      '--color-ink-card': '#171a16', '--color-olive': '#3c4438',
      '--color-gold': '#90b46c', '--color-gold-light': '#c8dcb0',
      '--color-gold-hover': '#749854', '--color-body': '#182018',
      '--color-body-alt': '#2c362c', '--color-muted': '#6c7c68',
      '--color-muted-dark': '#4c5c48', '--color-muted-gold': '#6c9048',
      '--color-text-light': '#dce8d8', '--color-text-light-alt': '#cedccc',
      '--color-text-muted': '#8c9c88', '--color-text-muted-alt': '#bcccc0',
      '--color-border-light': '#c0d4bc', '--color-border-dark': '#2c3828',
      '--color-border-dark-alt': '#485a44',
    },
  },

  // ── 12: Ice & Navy ──
  {
    id: 'ice-navy',
    label: { en: 'Ice & Navy', fr: 'Glace & Marine' },
    colors: {
      '--color-red': '#5080b4', '--color-red-dark': '#3c6490',
      '--color-cream': '#f0f3f7', '--color-ink': '#0e1218',
      '--color-ink-card': '#141a20', '--color-olive': '#3a444c',
      '--color-gold': '#a0b4cc', '--color-gold-light': '#d0dae6',
      '--color-gold-hover': '#8296ae', '--color-body': '#181e26',
      '--color-body-alt': '#2e343c', '--color-muted': '#70808c',
      '--color-muted-dark': '#50606c', '--color-muted-gold': '#7a8a98',
      '--color-text-light': '#dae2e8', '--color-text-light-alt': '#ccd6dc',
      '--color-text-muted': '#8a949e', '--color-text-muted-alt': '#bac4cc',
      '--color-border-light': '#c0cad4', '--color-border-dark': '#283038',
      '--color-border-dark-alt': '#464e56',
    },
  },

  // ── 13: Lavender & Slate ──
  {
    id: 'lavender-slate',
    label: { en: 'Lavender & Slate', fr: 'Lavande & Ardoise' },
    colors: {
      '--color-red': '#7c5c9c', '--color-red-dark': '#60447c',
      '--color-cream': '#f4f0f7', '--color-ink': '#111012',
      '--color-ink-card': '#18161a', '--color-olive': '#403848',
      '--color-gold': '#a890c0', '--color-gold-light': '#d4c8e2',
      '--color-gold-hover': '#8c74a4', '--color-body': '#1e1a22',
      '--color-body-alt': '#342e38', '--color-muted': '#746e7c',
      '--color-muted-dark': '#544e5c', '--color-muted-gold': '#7c6894',
      '--color-text-light': '#e0dae8', '--color-text-light-alt': '#d2ccdc',
      '--color-text-muted': '#8e889c', '--color-text-muted-alt': '#beb8ca',
      '--color-border-light': '#c8c0d4', '--color-border-dark': '#2e2838',
      '--color-border-dark-alt': '#4c4456',
    },
  },

  // ═══════════════════════════════════════════════════════
  // 14–18: Earthy / Green family
  // ═══════════════════════════════════════════════════════

  // ── 14: Moss & Bark ──
  {
    id: 'moss-bark',
    label: { en: 'Moss & Bark', fr: 'Mousse & Écorce' },
    colors: {
      '--color-red': '#7a8c44', '--color-red-dark': '#5e6c32',
      '--color-cream': '#f2f3ea', '--color-ink': '#101310',
      '--color-ink-card': '#171a14', '--color-olive': '#424834',
      '--color-gold': '#a4a85c', '--color-gold-light': '#d4d8a0',
      '--color-gold-hover': '#888c44', '--color-body': '#1c2016',
      '--color-body-alt': '#30362a', '--color-muted': '#747c64',
      '--color-muted-dark': '#545c44', '--color-muted-gold': '#808840',
      '--color-text-light': '#e0e4d0', '--color-text-light-alt': '#d2d8c2',
      '--color-text-muted': '#8c9480', '--color-text-muted-alt': '#bcc4b0',
      '--color-border-light': '#c4ccb4', '--color-border-dark': '#2c3420',
      '--color-border-dark-alt': '#485438',
    },
  },

  // ── 15: Olive & Wheat ──
  {
    id: 'olive-wheat',
    label: { en: 'Olive & Wheat', fr: 'Olive & Blé' },
    colors: {
      '--color-red': '#8c9040', '--color-red-dark': '#6c7030',
      '--color-cream': '#f2f1e6', '--color-ink': '#121210',
      '--color-ink-card': '#1a1a14', '--color-olive': '#464838',
      '--color-gold': '#b0ac54', '--color-gold-light': '#dcd898',
      '--color-gold-hover': '#908c40', '--color-body': '#1e2018',
      '--color-body-alt': '#34362c', '--color-muted': '#787c64',
      '--color-muted-dark': '#585c44', '--color-muted-gold': '#888838',
      '--color-text-light': '#e2e4ce', '--color-text-light-alt': '#d4d8c0',
      '--color-text-muted': '#909480', '--color-text-muted-alt': '#c0c4b0',
      '--color-border-light': '#c6ccb4', '--color-border-dark': '#2e3420',
      '--color-border-dark-alt': '#4c5438',
    },
  },

  // ── 16: Fern & Earth ──
  {
    id: 'fern-earth',
    label: { en: 'Fern & Earth', fr: 'Fougère & Terre' },
    colors: {
      '--color-red': '#5c9448', '--color-red-dark': '#447434',
      '--color-cream': '#f0f4ea', '--color-ink': '#0f1210',
      '--color-ink-card': '#151a14', '--color-olive': '#3c4634',
      '--color-gold': '#88b060', '--color-gold-light': '#c0dca4',
      '--color-gold-hover': '#6c9048', '--color-body': '#161e16',
      '--color-body-alt': '#2a3428', '--color-muted': '#687c60',
      '--color-muted-dark': '#485c40', '--color-muted-gold': '#648840',
      '--color-text-light': '#d8e8d0', '--color-text-light-alt': '#cadcc2',
      '--color-text-muted': '#889c80', '--color-text-muted-alt': '#b8ccb0',
      '--color-border-light': '#bcd4b0', '--color-border-dark': '#263420',
      '--color-border-dark-alt': '#405438',
    },
  },

  // ── 17: Pine & Stone ──
  {
    id: 'pine-stone',
    label: { en: 'Pine & Stone', fr: 'Pin & Pierre' },
    colors: {
      '--color-red': '#5c7c44', '--color-red-dark': '#446032',
      '--color-cream': '#f0f2ea', '--color-ink': '#0f1110',
      '--color-ink-card': '#151814', '--color-olive': '#3c4434',
      '--color-gold': '#8ca860', '--color-gold-light': '#c0d4a0',
      '--color-gold-hover': '#708c48', '--color-body': '#161e16',
      '--color-body-alt': '#2a3226', '--color-muted': '#687860',
      '--color-muted-dark': '#485840', '--color-muted-gold': '#648040',
      '--color-text-light': '#d8e4d0', '--color-text-light-alt': '#cad8c2',
      '--color-text-muted': '#889480', '--color-text-muted-alt': '#b8c4b0',
      '--color-border-light': '#bcd0b4', '--color-border-dark': '#263020',
      '--color-border-dark-alt': '#405038',
    },
  },

  // ── 18: Matcha & Bamboo ──
  {
    id: 'matcha-bamboo',
    label: { en: 'Matcha & Bamboo', fr: 'Matcha & Bambou' },
    colors: {
      '--color-red': '#7ca04c', '--color-red-dark': '#5e7c38',
      '--color-cream': '#f2f4ee', '--color-ink': '#101210',
      '--color-ink-card': '#171a14', '--color-olive': '#404838',
      '--color-gold': '#a0b868', '--color-gold-light': '#d0dca4',
      '--color-gold-hover': '#829a4e', '--color-body': '#182018',
      '--color-body-alt': '#2c3428', '--color-muted': '#6c7c64',
      '--color-muted-dark': '#4c5c44', '--color-muted-gold': '#789048',
      '--color-text-light': '#dce4d2', '--color-text-light-alt': '#ced8c4',
      '--color-text-muted': '#8c9884', '--color-text-muted-alt': '#bcc4b4',
      '--color-border-light': '#c0d0b8', '--color-border-dark': '#283420',
      '--color-border-dark-alt': '#445438',
    },
  },

  // ═══════════════════════════════════════════════════════
  // 19–23: Rich / Dark / Moody family
  // ═══════════════════════════════════════════════════════

  // ── 19: Noir & Gold ──
  {
    id: 'noir-gold',
    label: { en: 'Noir & Gold', fr: 'Noir & Or' },
    colors: {
      '--color-red': '#c82828', '--color-red-dark': '#9c1c1c',
      '--color-cream': '#f6f2ea', '--color-ink': '#080808',
      '--color-ink-card': '#101010', '--color-olive': '#3c3428',
      '--color-gold': '#d4b068', '--color-gold-light': '#ecd8a8',
      '--color-gold-hover': '#b8944e', '--color-body': '#1e1810',
      '--color-body-alt': '#322c22', '--color-muted': '#78705c',
      '--color-muted-dark': '#585040', '--color-muted-gold': '#a88840',
      '--color-text-light': '#e8e0cc', '--color-text-light-alt': '#dad2be',
      '--color-text-muted': '#989080', '--color-text-muted-alt': '#c8c0ac',
      '--color-border-light': '#d0c8b0', '--color-border-dark': '#342a1c',
      '--color-border-dark-alt': '#544838',
    },
  },

  // ── 20: Espresso & Caramel ──
  {
    id: 'espresso-caramel',
    label: { en: 'Espresso & Caramel', fr: 'Espresso & Caramel' },
    colors: {
      '--color-red': '#a05028', '--color-red-dark': '#7c3c1c',
      '--color-cream': '#f4eee4', '--color-ink': '#0e0c08',
      '--color-ink-card': '#16120e', '--color-olive': '#403028',
      '--color-gold': '#c49a60', '--color-gold-light': '#e6cea4',
      '--color-gold-hover': '#a87e48', '--color-body': '#201810',
      '--color-body-alt': '#342a1e', '--color-muted': '#80705c',
      '--color-muted-dark': '#5c4c3c', '--color-muted-gold': '#9c7840',
      '--color-text-light': '#e8dcc8', '--color-text-light-alt': '#daceba',
      '--color-text-muted': '#989080', '--color-text-muted-alt': '#c8bca8',
      '--color-border-light': '#d0c4ac', '--color-border-dark': '#342818',
      '--color-border-dark-alt': '#544632',
    },
  },

  // ── 21: Midnight & Amber ──
  {
    id: 'midnight-amber',
    label: { en: 'Midnight & Amber', fr: 'Minuit & Ambre' },
    colors: {
      '--color-red': '#5c7cb0', '--color-red-dark': '#44608c',
      '--color-cream': '#f0f0f0', '--color-ink': '#080a10',
      '--color-ink-card': '#0e1018', '--color-olive': '#383c48',
      '--color-gold': '#d0a850', '--color-gold-light': '#e8d498',
      '--color-gold-hover': '#b08c3c', '--color-body': '#141820',
      '--color-body-alt': '#262a34', '--color-muted': '#6c707c',
      '--color-muted-dark': '#4c505c', '--color-muted-gold': '#a08038',
      '--color-text-light': '#dce0e8', '--color-text-light-alt': '#ced2dc',
      '--color-text-muted': '#8c909c', '--color-text-muted-alt': '#bcc0ca',
      '--color-border-light': '#c2c6d2', '--color-border-dark': '#242830',
      '--color-border-dark-alt': '#42464e',
    },
  },

  // ── 22: Obsidian & Rose ──
  {
    id: 'obsidian-rose',
    label: { en: 'Obsidian & Rose', fr: 'Obsidienne & Rose' },
    colors: {
      '--color-red': '#b04460', '--color-red-dark': '#8c3048',
      '--color-cream': '#f4f0f0', '--color-ink': '#0a0a0c',
      '--color-ink-card': '#121214', '--color-olive': '#403038',
      '--color-gold': '#c49080', '--color-gold-light': '#e4c8bc',
      '--color-gold-hover': '#a47060', '--color-body': '#1e181a',
      '--color-body-alt': '#322a2e', '--color-muted': '#7c6c70',
      '--color-muted-dark': '#5c4c50', '--color-muted-gold': '#9c6858',
      '--color-text-light': '#e4dcdc', '--color-text-light-alt': '#d6cece',
      '--color-text-muted': '#94888c', '--color-text-muted-alt': '#c4b8ba',
      '--color-border-light': '#cec0c2', '--color-border-dark': '#34262a',
      '--color-border-dark-alt': '#544448',
    },
  },

  // ── 23: Charcoal & Blush ──
  {
    id: 'charcoal-blush',
    label: { en: 'Charcoal & Blush', fr: 'Anthracite & Rosé' },
    colors: {
      '--color-red': '#b05864', '--color-red-dark': '#8c404c',
      '--color-cream': '#f2eeec', '--color-ink': '#101012',
      '--color-ink-card': '#18181a', '--color-olive': '#40383c',
      '--color-gold': '#b89890', '--color-gold-light': '#dcc8c0',
      '--color-gold-hover': '#9a7870', '--color-body': '#201c1e',
      '--color-body-alt': '#363032', '--color-muted': '#7c7274',
      '--color-muted-dark': '#5c5254', '--color-muted-gold': '#907068',
      '--color-text-light': '#e2dcdc', '--color-text-light-alt': '#d4cece',
      '--color-text-muted': '#948c8e', '--color-text-muted-alt': '#c4bcbe',
      '--color-border-light': '#ccc4c4', '--color-border-dark': '#322c2e',
      '--color-border-dark-alt': '#52484a',
    },
  },
];

export default palettes;

/**
 * Returns the default palette (Gold & Burgundy).
 */
export function getDefaultPalette(): Palette {
  return palettes[0];
}

/**
 * Looks up a palette by id. Returns undefined if not found.
 */
export function getPaletteById(id: string): Palette | undefined {
  return palettes.find((p) => p.id === id);
}
