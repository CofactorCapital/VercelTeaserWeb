export type Section = {
  /** Two-digit index shown in the mono counter. */
  index: string;
  /** Large display heading. */
  title: string;
  /** Optional short framing line(s) above the questions. */
  intro?: string[];
  /** The list of probing questions / statements. */
  questions: string[];
};

export const SECTIONS: Section[] = [
  {
    index: "01",
    title: "Black Boxes",
    questions: [
      "Why are investors expected to understand the results, but not the process?",
      "Why are the most expensive products often the least transparent?",
      "Why do investors receive marketing decks instead of evidence?",
      "Why are holdings hidden?",
      "Why are decisions hidden?",
      "Why are assumptions hidden?",
      "Why is “trust us” still considered acceptable?",
    ],
  },
  {
    index: "02",
    title: "Closet Indexing",
    intro: ["If a portfolio owns the same companies as the benchmark…"],
    questions: [
      "What exactly are investors paying for?",
      "Why do so many active portfolios look remarkably similar to the index?",
      "Why do investors discover benchmark hugging only after years of fees?",
      "If performance follows the market… why not simply own the market?",
    ],
  },
  {
    index: "03",
    title: "Fees",
    intro: [
      "The industry talks endlessly about returns.",
      "Far less about what investors keep.",
    ],
    questions: [
      "Why are fees guaranteed while performance is not?",
      "Why do incentives often reward asset gathering more than investor outcomes?",
      "How much wealth disappears into fees over decades?",
      "How much value must be created before value is delivered?",
    ],
  },
  {
    index: "04",
    title: "Taxes",
    intro: ["Compounding is powerful.", "Taxes compound too."],
    questions: [
      "Why are after-tax returns rarely the headline number?",
      "How much performance disappears every year without investors noticing?",
      "Why are investors forced into tax events they didn’t choose?",
      "How much wealth is lost to unnecessary turnover?",
    ],
  },
  {
    index: "05",
    title: "Risk",
    intro: ["Investors talk about returns.", "Markets talk about risk."],
    questions: [
      "Why are risks often easier to see after losses than before them?",
      "What risks are actually inside a portfolio?",
      "What happens when assumptions fail?",
      "What happens when history stops repeating?",
      "Can investors independently verify the risks they own?",
    ],
  },
  {
    index: "06",
    title: "Alpha",
    intro: ["Everyone talks about alpha.", "Few agree on what it is."],
    questions: [
      "How much performance comes from skill?",
      "How much comes from luck?",
      "How much comes from leverage?",
      "How much comes from hidden factor exposure?",
      "How much survives fees and taxes?",
    ],
  },
  {
    index: "07",
    title: "Transparency",
    intro: ["Most industries are becoming more transparent.", "Why isn’t investing?"],
    questions: [
      "Why is visibility treated as a trade secret?",
      "Why is verification so uncommon?",
      "Why are investors asked to believe instead of verify?",
      "Why are disclosures written for lawyers instead of investors?",
    ],
  },
  {
    index: "08",
    title: "Control",
    intro: ["Investors supply the capital.", "Why do they receive so little visibility?"],
    questions: [
      "Shouldn’t investors know what they own?",
      "Shouldn’t investors understand the risks?",
      "Shouldn’t investors have access to evidence?",
      "Shouldn’t investors be able to verify the claims?",
    ],
  },
];

export const FAITH_LINES = [
  "Faith that the strategy works.",
  "Faith that the fees are justified.",
  "Faith that the risks are understood.",
  "Faith that the manager is different.",
  "Faith that the outcomes will be worth it.",
];
