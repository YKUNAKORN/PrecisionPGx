import { Create, GetById } from "@/lib/supabase/crud";
import { RuleResult, RuleBased } from "@/lib/model/RuleHLA-B";
import { CreateClientSecret } from "@/lib/supabase/client";

const db = CreateClientSecret();

export async function QueryRule(ruleID, index) {
    try {
        const response = await GetById(db, "ruleHLA-B", ruleID);
        if (!response.data || response.data.length === 0) {
            return { data: null, error: "No rule found with the given ID." };
        }
        if (index < 0 || index >= response.data[0].odds_score.length) {
            return { data: null, error: "Index out of bounds." };
        }
        if (response.error) {
            console.error("Error fetching rule:", response.error);
            return { data: null, error: response.error.message };
        }
        RuleResult.id = response.data[0].id;
        RuleResult.hla_gene = response.data[0].hla_gene;
        RuleResult.drug = response.data[0].drug[index];
        RuleResult.typeof_scar = response.data[0].typeof_scar[index];
        RuleResult.ethnic_group = response.data[0].ethnic_group[index];
        RuleResult.odds_score = response.data[0].odds_score[index];
        RuleResult.ref = response.data[0].ref[index];

        return { data: RuleResult, error: null };
    } catch (error) {
        console.error("Error fetching rule:", error);
        return { data: null, error: error.message };
    }
}

export async function InsertRule(InsertRuleModel) {
    try {
        const response = await Create(db, "ruleHLA-B", InsertRuleModel);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        RuleResult.id = response.data[0].id;
        RuleResult.hla_gene = response.data[0].hla_gene;
        RuleResult.drug = response.data[0].drug[index];
        RuleResult.typeof_scar = response.data[0].typeof_scar[index];
        RuleResult.ethnic_group = response.data[0].ethnic_group[index];
        RuleResult.odds_score = response.data[0].odds_score[index];
        RuleResult.ref = response.data[0].ref[index];
        RuleBased.created_at = response.data[0].created_at;
        
        return { data: RuleBased, error: null }; //for User
    } catch (error) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message }; //for User
    }
}

export async function UpdateRule(ruleID, UpdateRuleModel) {
    try {
        const response = await db.from("ruleHLA-B").update(UpdateRuleModel).eq("id", ruleID).select();
        if (response.error) {
            console.error("Error updating rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        RuleResult.id = response.data[0].id;
        RuleResult.hla_gene = response.data[0].hla_gene;
        RuleResult.drug = response.data[0].drug[index];
        RuleResult.typeof_scar = response.data[0].typeof_scar[index];
        RuleResult.ethnic_group = response.data[0].ethnic_group[index];
        RuleResult.odds_score = response.data[0].odds_score[index];
        RuleResult.ref = response.data[0].ref[index];
        RuleBased.created_at = response.data[0].created_at;
        
        return { data: RuleBased, error: null };
    } catch (error) {
        console.error("Error updating rule:", error);
        return { data: null, error: error.message }; //for User
    }
}

export async function DeleteRule(ruleID) {
    try {
        const response = await db.from("ruleHLA-B").delete().eq("id", ruleID);
        if (response.error) {
            console.error("Error deleting rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        return { data: "Rule deleted successfully", error: null }; //for User
    } catch (error) {
        console.error("Error deleting rule:", error);
        return { data: null, error: error.message }; //for User
    }
}