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
        // Add row_index to each rule for reference
        const dataWithIndex = response.data.map((rule, index) => ({
            row_index: index,
            ...rule
        }));
        console.log(`Successfully fetched ${dataWithIndex.length} rules`) // for Debug
        return { data: dataWithIndex, error: null }
    } catch (error) {
        console.error("Error fetching all rules:", error) // for Debug
        return { data: null, error: error.message }
    }
}

export async function QueryRuleByRowIndex(rowIndex) {
    try {
        console.log(`QueryRuleByRowIndex called with rowIndex: ${rowIndex}`) // for Debug
        const response = await db.from("rule").select("*").order('created_at', { ascending: true }).range(rowIndex, rowIndex).single()
        
        console.log("Supabase response:", { error: response.error, hasData: !!response.data })
        
        if (response.error) {
            console.error("Error fetching rule by row index:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data) {
            return { data: null, error: "No rule found at the specified row index." }
        }
        console.log(`Successfully fetched rule at row ${rowIndex}:`, response.data.id) // for Debug
        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching rule by row index:", error)
        return { data: null, error: error.message }
    }
}
export async function QueryRulesById(id) {
    try {
        const response = await db.from("rule").select("*").eq("id", id).single()
        if (response.error) {
            console.error("Error fetching rule by ID:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data) {
            return { data: null, error: "No rule found with the given ID." }
        }
        console.log(`Successfully fetched rule by ID ${id}:`, response.data) // for Debug
        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching rule by ID:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryAllRulesByIndex(index) {
    try {
        const response = await db.from("rule").select("*")
        if (response.error) {
            console.error("Error fetching rules:", response.error)
            return { data: null, error: response.error.message }
        }
        if (!response.data || response.data.length === 0) {
            return { data: null, error: "No rules found in the database." }
        }
        // Map all rules to get data at the specifie index
        const results = []
        for (const rule of response.data) {
            if (!rule.predicted_genotype || index < 0 || index >= rule.predicted_genotype.length) {
                console.log(`Skipping rule ${rule.id}: index ${index} out of bounds (length: ${rule.predicted_genotype?.length})`) // for Debug
                continue;
            }
            let resultLocationAtIndex;
            if (Array.isArray(rule.result_location[index])) {
                resultLocationAtIndex = rule.result_location[index];
            } else if (typeof rule.result_location[index] === 'string') {
                resultLocationAtIndex = rule.result_location[index].split(',').map(s => s.trim());
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
        console.log(`Found ${results.length} rules at index ${index}`) // for Debug
        return { data: results, error: null }
    } catch (error) {
        console.error("Error fetching rules:", error) // for Debug
        return { data: null, error: error.message }
    }
}

export async function QueryRule(ruleID, index) {
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
        RuleResult.id = response.data[0].id;
        RuleResult.location = response.data[0].location;
        RuleResult.result_location = response.data[0].result_location[index].split(',');
        RuleResult.predicted_genotype = response.data[0].predicted_genotype[index];
        RuleResult.predicted_phenotype = response.data[0].predicted_phenotype[index];
        RuleResult.recommendation = response.data[0].recommend[index];
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            RuleResult.phenotype = [];
        } else {
            RuleResult.phenotype = response.data[0].phenotype[index];
        }
        return { data: RuleResult, error: null };
    } catch (error) {
        console.error("Error fetching rule:", error);
        return { data: null, error: error.message };
    }
}

export async function InsertRule(InsertRuleModel) {
    try {
        const response = await Create(db, "rule", InsertRuleModel);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message };
        }
        RuleBased.id = response.data[0].id;
        RuleBased.location = response.data[0].location;
        RuleBased.result_location = response.data[0].result_location;
        RuleBased.predicted_genotype = response.data[0].predicted_genotype;
        RuleBased.predicted_phenotype = response.data[0].predicted_phenotype;
        RuleBased.recommendation = response.data[0].recommend;
        RuleBased.created_at = response.data[0].created_at;
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            RuleBased.phenotype = [];
        } else {
            RuleBased.phenotype = response.data[0].phenotype;
        }
        return { data: RuleBased, error: null };
    } catch (error) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message };
    }
}

export async function UpdateRule(ruleID, UpdateRuleModel) {
    try {
        const response = await db.from("rule").update(UpdateRuleModel).eq("id", ruleID).select();
        if (response.error) {
            console.error("Error updating rule:", response.error);
            return { data: null, error: response.error.message };
        }
        RuleBased.id = response.data[0].id;
        RuleBased.location = response.data[0].location;
        RuleBased.result_location = response.data[0].result_location;
        RuleBased.predicted_genotype = response.data[0].predicted_genotype;
        RuleBased.predicted_phenotype = response.data[0].predicted_phenotype;
        RuleBased.recommendation = response.data[0].recommend;
        RuleBased.created_at = response.data[0].created_at;
        if (response.data[0].phenotype == null || response.data[0].phenotype == undefined) {
            RuleBased.phenotype = [];
        } else {
            RuleBased.phenotype = response.data[0].phenotype;
        }
        return { data: RuleBased, error: null };
    } catch (error) {
        console.error("Error updating rule:", error);
        return { data: null, error: error.message };
    }
}

export async function DeleteRule(ruleID) {
    try {
        const response = await db.from("rule").delete().eq("id", ruleID);
        if (response.error) {
            console.error("Error deleting rule:", response.error);
            return { data: null, error: response.error.message };
        }
        return { data: "Rule deleted successfully", error: null };
    } catch (error) {
        console.error("Error deleting rule:", error);
        return { data: null, error: error.message };
    }
}