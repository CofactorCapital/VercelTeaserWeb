export type Section = {
  /** Two-digit index shown in the mono counter. */
  index: string;
  /** Large display heading. */
  title: string;
  /** Optional short framing line(s) above the questions. */
  intro?: string[];
  /** The probing questions — three per chapter, strongest first. */
  questions: string[];
  /** The accusation this chapter stamps into the evidence ledger. */
  keyPhrase: string;
};

export const SECTIONS: Section[] = [
  {
    index: "01",
    title: "Black Boxes",
    questions: [
      "Why are investors expected to understand the results, but not the process?",
      "Why do investors receive marketing decks instead of evidence?",
      "Why is “trust us” still considered acceptable?",
    ],
    keyPhrase: "Holdings, hidden",
  },
  {
    index: "02",
    title: "Closet Indexing",
    intro: ["If a portfolio owns the same companies as the benchmark…"],
    questions: [
      "What exactly are investors paying for?",
      "Why do so many active portfolios look remarkably similar to the index?",
      "If performance follows the market… why not simply own the market?",
    ],
    keyPhrase: "The index, in disguise",
  },
  {
    index: "03",
    title: "Fees",
    intro: ["The industry talks endlessly about returns.", "Far less about what investors keep."],
    questions: [
      "Why are fees guaranteed while performance is not?",
      "How much wealth disappears into fees over decades?",
      "How much value must be created before value is delivered?",
    ],
    keyPhrase: "Fees, guaranteed",
  },
  {
    index: "04",
    title: "Taxes",
    intro: ["Compounding is powerful.", "Taxes compound too."],
    questions: [
      "Why are after-tax returns rarely the headline number?",
      "How much performance disappears every year without investors noticing?",
      "How much wealth is lost to unnecessary turnover?",
    ],
    keyPhrase: "Taxes, ignored",
  },
  {
    index: "05",
    title: "Risk",
    intro: ["Investors talk about returns.", "Markets talk about risk."],
    questions: [
      "Why are risks often easier to see after losses than before them?",
      "What happens when assumptions fail?",
      "Can investors independently verify the risks they own?",
    ],
    keyPhrase: "Risk, unseen",
  },
  {
    index: "06",
    title: "Alpha",
    intro: ["Everyone talks about alpha.", "Few agree on what it is."],
    questions: [
      "How much performance is skill — and how much is luck?",
      "How much comes from leverage or hidden factor exposure?",
      "How much survives fees and taxes?",
    ],
    keyPhrase: "Alpha, unproven",
  },
  {
    index: "07",
    title: "Transparency",
    intro: ["Most industries are becoming more transparent.", "Why isn’t investing?"],
    questions: [
      "Why is visibility treated as a trade secret?",
      "Why are investors asked to believe instead of verify?",
      "Why are disclosures written for lawyers instead of investors?",
    ],
    keyPhrase: "Opacity, by design",
  },
  {
    index: "08",
    title: "Control",
    intro: ["Investors supply the capital.", "Why do they receive so little visibility?"],
    questions: [
      "Shouldn’t investors know what they own?",
      "Shouldn’t investors have access to the evidence?",
      "Shouldn’t investors be able to verify the claims?",
    ],
    keyPhrase: "Control, withheld",
  },
];

export const FAITH_LINES = [
  "Faith that the strategy works.",
  "Faith that the fees are justified.",
  "Faith that the risks are understood.",
  "Faith that the manager is different.",
  "Faith that the outcomes will be worth it.",
];
