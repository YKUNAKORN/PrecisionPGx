export interface RuleResult {
    id: string
    hla_gene: string
    drug: string
    typeof_scar: string
    ethnic_group: string
    odds_score: string
    ref: string
}
export interface RuleBased {
    id: string
    hla_gene: any[]
    drug: any[]
    typeof_scar: any[]
    ethnic_group: any[]
    odds_score: any[]
    ref: any[]
    created_at: string
}

export interface RuleModel {
    hla_gene: any[]
    drug: any[]
    typeof_scar: any[]
    ethnic_group: any[]
    odds_score: any[]
    ref: any[]
}
