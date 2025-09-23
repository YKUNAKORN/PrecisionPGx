import { getByArray } from "../../../../lib/supabase/crud";
import { CreateClientSecret } from "../../../../lib/supabase/client";
import { RuleBase as RuleBaseTemplate } from "../../../../lib/model/RuleBase";

const db = CreateClientSecret();

function mergeGeneArray(arr) {
  const merged = [];
  for (let i = 0; i < arr.length; i += 2) {
    merged.push(arr[i] + "/" + arr[i + 1]);
  }
  return merged;
}

export async function getRuleBaseByEnzymeAndGene(enzyme, geneArray = []) {
  // parse gene array เช่น ["C","T","A","A"] → ["C/T","A/A"]
  const parsedGene = mergeGeneArray(geneArray);

  const { data, error } = await getByArray(db, "TestRuleBaseBaitoey", enzyme, parsedGene);

  if (error) {
    return { data: null, error, status: 500 };
  }
  if (!data || data.length === 0) {
    return { data: [], error: new Error(`Data Not Found for enzyme=${enzyme}, gene=${parsedGene}`) };
  }

  try {
    // สร้าง object ใหม่จาก template
    const result = { ...RuleBaseTemplate[0] };
    result.id = data[0].id;
    result.Enzyme = data[0].Enzyme;
    result.GeneLocation = data[0].GeneLocation;
    result.Gene = data[0].Gene;
    result.Genotype = data[0].Genotype;
    result.Phetotype = data[0].Phetotype;
    result.Recommendation = data[0].Recommendation;
    result.created_at = data[0].created_at;

    return { data: result, error: null };
  } catch (err) {
    console.error("Failed to parse data " + err);
    return { data: null, error: new Error("Failed to parse data " + err) };
  }
}
