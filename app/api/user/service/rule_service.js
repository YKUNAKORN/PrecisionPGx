import { Create, GetById } from "../../../../lib/supabase/crud"
import { RuleResult, RuleBased } from "../../../../lib/model/Rule"
import { CreateClientSecret } from "../../../../lib/supabase/client"

const db = CreateClientSecret()

export async function QueryRule(ruleID, index) {
    try {
        const response = await GetById(db, "TestRuleBasedFolkFolk", ruleID);
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
        return { data: RuleResult, error: null };
    } catch (error) {
        console.error("Error fetching rule:", error);
        return { data: null, error: error.message };
    }
}

export async function InsertRule(InsertRuleModel) {
    try {
        const response = await Create(db, "TestRuleBasedFolkFolk", InsertRuleModel);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        RuleBased.id = response.data[0].id;
        RuleBased.location = response.data[0].location;
        RuleBased.result_location = response.data[0].result_location;
        RuleBased.predicted_genotype = response.data[0].predicted_genotype;
        RuleBased.predicted_phenotype = response.data[0].predicted_phenotype;
        RuleBased.recommendation = response.data[0].recommend;
        RuleBased.created_at = response.data[0].created_at;
        return { data: RuleBased, error: null }; //for User
    } catch (error) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message }; //for User
    }
}