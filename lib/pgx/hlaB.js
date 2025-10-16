function stripPrefix(a) {
  return a.trim().toUpperCase()
    .replace(/^HLA-/, "")
    .replace(/^HLAB/, "B")
    .replace(/^HLA/, "");
}

function normalizeAllele(a) {
  const s = stripPrefix(a);
  if (/^B\*\d{2}:\d{2}$/.test(s)) return s;
  const m = s.match(/^B\*(\d{2}):?(\d{1,2})$/);
  if (m) return `B*${m[1]}:${m[2].padStart(2, "0")}`;
  return s;
}

function hasAnyAllele(patientAlleles, targets) {
  const pset = new Set(patientAlleles.map(normalizeAllele));
  return targets.some(t => pset.has(normalizeAllele(t)));
}

const HLA_B_RULES = [
  {
    id: "HLA-B*13:01_Dapsone",
    locus: "HLA-B",
    alleles: ["B*13:01"],
    drugs: ["Dapsone"],
    scars: ["DRESS", "SJS/TEN"],
    evidence: [{ groups: ["Han Chinese", "Thai"] }],
    recommendation:
      "HLA-B*13:01 markedly increases risk of dapsone hypersensitivity (DRESS/SJS-TEN). Avoid dapsone; choose an alternative.",
    strength: "Avoid",
  },
  {
    id: "HLA-B*13:01_Co-trimoxazole",
    locus: "HLA-B",
    alleles: ["B*13:01"],
    drugs: ["Co-trimoxazole"],
    scars: ["DRESS"],
    evidence: [{ groups: ["Thai"] }],
    recommendation:
      "HLA-B*13:01 associated with DRESS from co-trimoxazole. Prefer alternatives or use only with close monitoring.",
    strength: "Consider alternative",
  },
  {
    id: "HLA-B*15:02_B75family_CBZ_OXC",
    locus: "HLA-B",
    alleles: ["B*15:02", "B*15:08", "B*15:11", "B*15:21"],
    drugs: ["Carbamazepine", "Oxcarbazepine"],
    scars: ["SJS", "TEN"],
    evidence: [
      { groups: ["Han Chinese", "Central China", "Thai", "Indians", "Malaysian", "Vietnamese"] },
    ],
    recommendation:
      "HLA-B*15:02/B75 family: high risk of SJS/TEN from CBZ/OXC. Avoid these drugs.",
    strength: "Avoid",
  },
  {
    id: "HLA-B*15:11_Carbamazepine",
    locus: "HLA-B",
    alleles: ["B*15:11"],
    drugs: ["Carbamazepine"],
    scars: ["SJS", "TEN"],
    evidence: [{ groups: ["Japanese", "Korean"] }],
    recommendation:
      "HLA-B*15:11 associated with SJS/TEN from CBZ in East Asian cohorts. Prefer alternatives.",
    strength: "Consider alternative",
  },
  {
    id: "HLA-B*35:05_Nevirapine",
    locus: "HLA-B",
    alleles: ["B*35:05"],
    drugs: ["Nevirapine"],
    scars: ["Skin rash"],
    evidence: [{ groups: ["Thai"] }],
    recommendation:
      "HLA-B*35:05 increases nevirapine rash risk. If used, counsel and monitor closely.",
    strength: "Use with caution",
  },
  {
    id: "HLA-B*57:01_Abacavir",
    locus: "HLA-B",
    alleles: ["B*57:01"],
    drugs: ["Abacavir"],
    scars: ["HSS"],
    evidence: [{ groups: ["Australian", "African American", "Spaniards"] }],
    recommendation:
      "Do NOT use abacavir in HLA-B*57:01 carriers (risk of abacavir HSS).",
    strength: "Avoid",
  },
  {
    id: "HLA-B*58:01_Allopurinol",
    locus: "HLA-B",
    alleles: ["B*58:01"],
    drugs: ["Allopurinol"],
    scars: ["SJS", "TEN", "DRESS", "MPE"],
    evidence: [
      { groups: ["Thai"] },
      { groups: ["Han Chinese", "Japanese"] },
      { groups: ["Korean", "Portuguese"] },
    ],
    recommendation:
      "Avoid allopurinol in HLA-B*58:01 carriers due to high SCAR risk (SJS/TEN/DRESS). Consider febuxostat/others.",
    strength: "Avoid",
  },
];

function assessHLAB({ patientBAlleles = [], candidateDrugs = null }) {
  const pNorm = patientBAlleles.map(normalizeAllele);
  const filter = candidateDrugs ? candidateDrugs.map(d => d.trim().toLowerCase()) : null;

  const matched = [];
  for (const rule of HLA_B_RULES) {
    if (filter && !rule.drugs.some(d => filter.includes(d.toLowerCase()))) continue;
    if (!hasAnyAllele(pNorm, rule.alleles)) continue;

    const allelesMatched = rule.alleles
      .map(a => normalizeAllele(a))
      .filter(a => pNorm.includes(a));

    matched.push({
      ruleId: rule.id,
      locus: rule.locus,
      allelesMatched,
      drugs: rule.drugs.slice(),
      scars: Array.from(new Set(rule.scars)),
      recommendation: rule.recommendation,
      strength: rule.strength,
      evidence: rule.evidence || [],
    });
  }

  const summary = { avoid: [], considerAlternative: [], caution: [] };
  for (const m of matched) {
    if (m.strength === "Avoid") summary.avoid.push(...m.drugs);
    else if (m.strength === "Consider alternative") summary.considerAlternative.push(...m.drugs);
    else summary.caution.push(...m.drugs);
  }
  summary.avoid = Array.from(new Set(summary.avoid));
  summary.considerAlternative = Array.from(new Set(summary.considerAlternative));
  summary.caution = Array.from(new Set(summary.caution));

  return { matched, summary };
}

module.exports = { assessHLAB, HLA_B_RULES, normalizeAllele };
