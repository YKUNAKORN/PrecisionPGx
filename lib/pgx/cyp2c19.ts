export type StarCounts = { "*2": number; "*3": number; "*17": number };

export type InterpretInput =
  | {
      mode: "genotype";
      genotype: {
        "CYP2C19*2_681G>A"?: string;
        "CYP2C19*3_636G>A"?: string;
        "CYP2C19*17_-806C>T"?: string;
      };
    }
  | { mode: "star"; star: StarCounts };

type Phenotype = "NM" | "IM" | "RM" | "UM" | "PM";

const DIPLOTYPE_TO_PHENOTYPE: Record<
  string,
  { code: Phenotype; en: string }
> = {
  "*1/*1": { code: "NM", en: "Normal metabolizer" },
  "*1/*2": { code: "IM", en: "Intermediate metabolizer" },
  "*1/*3": { code: "IM", en: "Intermediate metabolizer" },
  "*1/*17": { code: "RM", en: "Rapid metabolizer" },
  "*2/*2": { code: "PM", en: "Poor metabolizer" },
  "*2/*3": { code: "PM", en: "Poor metabolizer" },
  "*2/*17": { code: "IM", en: "Intermediate metabolizer" },
  "*3/*3": { code: "PM", en: "Poor metabolizer" },
  "*3/*17": { code: "IM", en: "Intermediate metabolizer" },
  "*17/*17": { code: "UM", en: "Ultrarapid metabolizer" }
};

const RECO_EN: Record<string, string> = {
  "*1/*1": "Use standard dosing for CYP2C19 substrates.",
  "*1/*2": "IM: Consider alternatives or dose adjustments for CYP2C19-dependent drugs (e.g., clopidogrel).",
  "*1/*3": "IM: Same considerations as *1/*2.",
  "*1/*17": "RM: Some substrates (e.g., PPIs) may have reduced exposure; consider adjustments.",
  "*2/*2": "PM: Avoid CYP2C19-dependent therapy when possible; consider alternatives to clopidogrel.",
  "*2/*3": "PM: Same considerations as *2/*2.",
  "*2/*17": "IM: Same considerations as *1/*2.",
  "*3/*3": "PM: Same considerations as *2/*2.",
  "*3/*17": "IM: Same considerations as *1/*2.",
  "*17/*17":
    "UM: Some substrates may have lower exposure; consider monitoring and adjustments."
};

const sortPair = (x: string, y: string) => (x > y ? `${y}/${x}` : `${x}/${y}`);

export function normalizeGT(s?: string): string | null {
  if (!s) return null;
  let t = s.toUpperCase().replace(/\s+/g, "").replace(/[\\|]/g, "/");
  if (!t.includes("/") && t.length === 2) t = `${t[0]}/${t[1]}`;
  const [a, b] = t.split("/");
  if (!a || !b) return null;
  return sortPair(a, b);
}

function variantCount(gt: string | null, variantBase: "A" | "T"): number {
  if (!gt) return 0;
  const [x, y] = gt.split("/");
  return [x, y].filter((c) => c === variantBase).length;
}

export function resolveStarsFromGenotype(
  g2: string | null,
  g3: string | null,
  g17: string | null
): StarCounts {
  return {
    "*2": variantCount(g2, "A"),
    "*3": variantCount(g3, "A"),
    "*17": variantCount(g17, "T")
  };
}

export function composeDiplotype(
  stars: StarCounts
): string | "indeterminate" {
  const entries = Object.entries(stars) as [keyof StarCounts, number][];
  const total = entries.reduce((s, [, v]) => s + v, 0);

  if (total === 0) return "*1/*1";
  if (total === 1) return `*1/${entries.find(([, v]) => v === 1)![0]}`;

  if (total === 2) {
    const twice = entries.find(([, v]) => v === 2)?.[0];
    if (twice) return `${twice}/${twice}`;
    const ones = entries
      .filter(([, v]) => v === 1)
      .map(([k]) => k.replace("*", ""))
      .sort((a, b) => +a - +b)
      .map((n) => `*${n}`);
    return `${ones[0]}/${ones[1]}`;
  }

  return "indeterminate";
}

export function interpretCYP2C19(
  input: InterpretInput,
  options?: { trace?: boolean }
) {
  const trace: any[] = [];
  let starCounts: StarCounts = { "*2": 0, "*3": 0, "*17": 0 };
  const normalized: any = {};

  if (input.mode === "genotype") {
    const g2 = normalizeGT(input.genotype["CYP2C19*2_681G>A"]);
    const g3 = normalizeGT(input.genotype["CYP2C19*3_636G>A"]);
    const g17 = normalizeGT(input.genotype["CYP2C19*17_-806C>T"]);

    if (!(g2 || g3 || g17)) return { hasData: false, reason: "empty_genotype" };

    normalized.genotype = {
      "CYP2C19*2_681G>A": g2,
      "CYP2C19*3_636G>A": g3,
      "CYP2C19*17_-806C>T": g17
    };

    starCounts = resolveStarsFromGenotype(g2, g3, g17);
    normalized.starCounts = starCounts;
    if (options?.trace) trace.push({ step: "resolve_star", details: starCounts });
  } else {
    starCounts = input.star;
    if (starCounts["*2"] + starCounts["*3"] + starCounts["*17"] === 0)
      return { hasData: false, reason: "empty_star" };
    normalized.starCounts = starCounts;
  }

  const diplotype = composeDiplotype(starCounts);
  if (diplotype === "indeterminate") {
    return {
      hasData: true,
      normalized,
      resolved: { diplotype },
      message:
        "Genotype suggests >2 total variant alleles across three loci (phasing unknown).",
      trace
    };
  }

  const phen = DIPLOTYPE_TO_PHENOTYPE[diplotype];
  return {
    hasData: true,
    normalized,
    resolved: {
      diplotype,
      phenotype: { code: phen.code, label: { en: phen.en } }
    },
    recommendations: { en: RECO_EN[diplotype] || "" },
    evidence: [{ source: "Excel sheet 2C19", note: `${diplotype} → ${phen.code}` }],
    trace
  };
}
