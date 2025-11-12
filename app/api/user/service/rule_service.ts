import { Create, GetById } from "@/lib/supabase/crud";
import { RuleResult, RuleBased } from "@/lib/model/Rule";
import { CreateClientSecret } from "@/lib/supabase/client";

const db = CreateClientSecret();

export async function QueryAllRules() {
    try {
        console.log('QueryAllRules called - fetching all rules')
        const response = await db.from("rule").select("*").order('created_at', { ascending: true })
        if (response.error) {
            console.error("Error fetching all rules:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data || response.data.length === 0) {
            console.log("No rules found in database")
            return { data: [], error: null }
        }
        const dataWithIndex = response.data.map((rule, index) => ({
            row_index: index,
            ...rule
        }));
        console.log(`Successfully fetched ${dataWithIndex.length} rules`)
        return { data: dataWithIndex, error: null }
    } catch (error: any) {
        console.error("Error fetching all rules:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryRuleByRowIndex(rowIndex: number) {
    try {
        console.log(`QueryRuleByRowIndex called with rowIndex: ${rowIndex}`)
        const response = await db.from("rule").select("*").order('created_at', { ascending: true }).range(rowIndex, rowIndex).single()
        
        console.log("Supabase response:", { error: response.error, hasData: !!response.data })
        
        if (response.error) {
            console.error("Error fetching rule by row index:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data) {
            return { data: null, error: "No rule found at the specified row index." }
        }
        console.log(`Successfully fetched rule at row ${rowIndex}:`, response.data.id)
        return { data: response.data, error: null }
    } catch (error: any) {
        console.error("Error fetching rule by row index:", error)
        return { data: null, error: error.message }
    }
}
export async function QueryRulesById(id: string) {
    try {
        const response = await db.from("rule").select("*").eq("id", id).single()
        if (response.error) {
            console.error("Error fetching rule by ID:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data) {
            return { data: null, error: "No rule found with the given ID." }
        }
        console.log(`Successfully fetched rule by ID ${id}:`, response.data)
        return { data: response.data, error: null }
    } catch (error: any) {
        console.error("Error fetching rule by ID:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryAllRulesByIndex(index: number) {
    try {
        const response = await db.from("rule").select("*")
        if (response.error) {
            console.error("Error fetching rules:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data || response.data.length === 0) {
            return { data: null, error: "No rules found in the database." }
        }
        const results = []
        for (const rule of response.data) {
            if (!rule.predicted_genotype || index < 0 || index >= rule.predicted_genotype.length) {
                console.log(`Skipping rule ${rule.id}: index ${index} out of bounds (length: ${rule.predicted_genotype?.length})`)
                continue;
            }
            let resultLocationAtIndex;
            if (Array.isArray(rule.result_location[index])) {
                resultLocationAtIndex = rule.result_location[index];
            } else if (typeof rule.result_location[index] === 'string') {
                resultLocationAtIndex = rule.result_location[index].split(',').map((s: string) => s.trim());
            } else {
                resultLocationAtIndex = [rule.result_location[index]];
            }
            const ruleResult = {
                id: rule.id,
                location: rule.location,
                result_location: resultLocationAtIndex,
                predicted_genotype: rule.predicted_genotype[index],
                predicted_phenotype: rule.predicted_phenotype[index],
                recommendation: rule.recommend[index],
                phenotype: (rule.phenotype == null || rule.phenotype == undefined || rule.phenotype.length === 0) 
                    ? [] 
                    : rule.phenotype[index],
                created_at: rule.created_at
            };
            results.push(ruleResult)
        }
        if (results.length === 0) {
            return { data: null, error: `No rules found at index ${index}. All rules may have fewer elements than index ${index}.` }
        }
        console.log(`Found ${results.length} rules at index ${index}`)
        return { data: results, error: null }
    } catch (error: any) {
        console.error("Error fetching rules:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryRule(ruleID: string, index: number) {
    try {
        const response = await GetById(db, "rule", ruleID);
        if (!response.data || response.data.length === 0) {
            return { data: null, error: "No rule found with the given ID." };
        }
        if (index < 0 || index >= response.data[0].predicted_genotype.length) {
            return { data: null, error: "Index out of bounds." };
        }
        if (response.error) {
            console.error("Error fetching rule:", response.error);
            return { data: null, error: response.error.message };
        }
        (RuleResult as any).id = response.data[0].id;
        (RuleResult as any).location = response.data[0].location;
        (RuleResult as any).result_location = response.data[0].result_location[index].split(',');
        (RuleResult as any).predicted_genotype = response.data[0].predicted_genotype[index];
        (RuleResult as any).predicted_phenotype = response.data[0].predicted_phenotype[index];
        (RuleResult as any).recommendation = response.data[0].recommend[index];
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            (RuleResult as any).phenotype = [];
        } else {
            (RuleResult as any).phenotype = response.data[0].phenotype[index];
        }
        return { data: RuleResult, error: null };
    } catch (error: any) {
        console.error("Error fetching rule:", error);
        return { data: null, error: error.message };
    }
}

export async function InsertRule(InsertRuleModel: any) {
    try {
        const response = await Create(db, "rule", InsertRuleModel);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message };
        }
        (RuleBased as any).id = response.data[0].id;
        (RuleBased as any).location = response.data[0].location;
        (RuleBased as any).result_location = response.data[0].result_location;
        (RuleBased as any).predicted_genotype = response.data[0].predicted_genotype;
        (RuleBased as any).predicted_phenotype = response.data[0].predicted_phenotype;
        (RuleBased as any).recommendation = response.data[0].recommend;
        (RuleBased as any).created_at = response.data[0].created_at;
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            (RuleBased as any).phenotype = [];
        } else {
            (RuleBased as any).phenotype = response.data[0].phenotype;
        }
        return { data: RuleBased, error: null };
    } catch (error: any) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message };
    }
}

export async function UpdateRule(ruleID: string, UpdateRuleModel: any) {
    try {
        const response = await db.from("rule").update(UpdateRuleModel).eq("id", ruleID).select();
        if (response.error) {
            console.error("Error updating rule:", response.error);
            return { data: null, error: response.error.message };
        }
        (RuleBased as any).id = response.data[0].id;
        (RuleBased as any).location = response.data[0].location;
        (RuleBased as any).result_location = response.data[0].result_location;
        (RuleBased as any).predicted_genotype = response.data[0].predicted_genotype;
        (RuleBased as any).predicted_phenotype = response.data[0].predicted_phenotype;
        (RuleBased as any).recommendation = response.data[0].recommend;
        (RuleBased as any).created_at = response.data[0].created_at;
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            (RuleBased as any).phenotype = [];
        } else {
            (RuleBased as any).phenotype = response.data[0].phenotype;
        }
        return { data: RuleBased, error: null };
    } catch (error: any) {
        console.error("Error updating rule:", error);
        return { data: null, error: error.message };
    }
}

export async function DeleteRule(ruleID: string) {
    try {
        const response = await db.from("rule").delete().eq("id", ruleID);
        if (response.error) {
            console.error("Error deleting rule:", response.error);
            return { data: null, error: response.error.message };
        }
        return { data: "Rule deleted successfully", error: null };
    } catch (error: any) {
        console.error("Error deleting rule:", error);
        return { data: null, error: error.message };
    }
}
