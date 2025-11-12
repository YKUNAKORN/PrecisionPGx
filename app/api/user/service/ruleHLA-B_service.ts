import { Create, GetById, GetAll } from "@/lib/supabase/crud"
import { RuleResult, RuleBased } from "@/lib/model/RuleHLA-B"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function QueryAllRules() {
    try {
        const response = await GetAll(db, "ruleHLA-B")
        if (response.error) {
            console.error("Error fetching rules:", response.error)
            return { data: null, error: response.error.message }
        }
        const rulesWithIndex = response.data.map((rule: any, index: number) => ({
            row_index: index,
            ...rule
        }))
        return { data: rulesWithIndex, error: null }
    } catch (error: any) {
        console.error("Error fetching all rules:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryRuleByRowIndex(rowIndex: number) {
    try {
        const response = await GetAll(db, "ruleHLA-B")
        if (response.error) {
            console.error("Error fetching rules:", response.error)
            return { data: null, error: response.error.message }
        }
        if (rowIndex < 0 || rowIndex >= response.data.length) {
            return { data: null, error: "Row index out of bounds." }
        }
        return { data: response.data[rowIndex], error: null }
    } catch (error: any) {
        console.error("Error fetching rule by row index:", error)
        return { data: null, error: error.message }
    }
}

export async function QueryRule(ruleID: string, index: number) {
    try {
        const response = await GetById(db, "ruleHLA-B", ruleID)
        if (!response.data || response.data.length === 0) {
            return { data: null, error: "No rule found with the given ID." }
        }
        if (index < 0 || index >= response.data[0].odds_score.length) {
            return { data: null, error: "Index out of bounds." }
        }
        if (response.error) {
            console.error("Error fetching rule:", response.error)
            return { data: null, error: response.error.message }
        }
        (RuleResult as any).id = response.data[0].id;
        (RuleResult as any).hla_gene = response.data[0].hla_gene;
        (RuleResult as any).drug = response.data[0].drug[index];
        (RuleResult as any).typeof_scar = response.data[0].typeof_scar[index];
        (RuleResult as any).ethnic_group = response.data[0].ethnic_group[index];
        (RuleResult as any).odds_score = response.data[0].odds_score[index];
        (RuleResult as any).ref = response.data[0].ref[index];
        (RuleResult as any).Name = response.data[0].Name[index];

        return { data: RuleResult, error: null }
    } catch (error: any) {
        console.error("Error fetching rule:", error)
        return { data: null, error: error.message }
    }
}

export async function InsertRule(InsertRuleModel: any) {
    try {
        const response = await Create(db, "ruleHLA-B", InsertRuleModel)
        if (response.error) {
            console.error("Error inserting rule:", response.error)
            return { data: null, error: response.error.message }
        }
        (RuleBased as any).id = response.data[0].id;
        (RuleBased as any).hla_gene = response.data[0].hla_gene;
        (RuleBased as any).drug = response.data[0].drug;
        (RuleBased as any).typeof_scar = response.data[0].typeof_scar;
        (RuleBased as any).ethnic_group = response.data[0].ethnic_group;
        (RuleBased as any).odds_score = response.data[0].odds_score;
        (RuleBased as any).ref = response.data[0].ref;
        (RuleBased as any).Name = response.data[0].Name;
        (RuleBased as any).created_at = response.data[0].created_at;
        return { data: RuleBased, error: null }
    } catch (error: any) {
        console.error("Error inserting rule:", error)
        return { data: null, error: error.message }
    }
}

export async function UpdateRule(ruleID: string, UpdateRuleModel: any) {
    try {
        const response = await db.from("ruleHLA-B").update(UpdateRuleModel).eq("id", ruleID).select()
        if (response.error) {
            console.error("Error updating rule:", response.error)
            return { data: null, error: response.error.message }
        }
        (RuleBased as any).id = response.data[0].id;
        (RuleBased as any).hla_gene = response.data[0].hla_gene;
        (RuleBased as any).drug = response.data[0].drug;
        (RuleBased as any).typeof_scar = response.data[0].typeof_scar;
        (RuleBased as any).ethnic_group = response.data[0].ethnic_group;
        (RuleBased as any).odds_score = response.data[0].odds_score;
        (RuleBased as any).ref = response.data[0].ref;
        (RuleBased as any).Name = response.data[0].Name;
        (RuleBased as any).created_at = response.data[0].created_at;
        return { data: RuleBased, error: null }
    } catch (error: any) {
        console.error("Error updating rule:", error)
        return { data: null, error: error.message }
    }
}

export async function DeleteRule(ruleID: string) {
    try {
        const response = await db.from("ruleHLA-B").delete().eq("id", ruleID).select()
        if (response.error) {
            console.error("Error deleting rule:", response.error)
            return { data: null, error: response.error.message }
        }
        return { data: "Rule deleted successfully", error: null }
    } catch (error: any) {
        console.error("Error deleting rule:", error)
        return { data: null, error: error.message }
    }
}
