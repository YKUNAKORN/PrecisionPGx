export interface RuleResultType {
    id: string
    hla_gene: string
    drug: string
    typeof_scar: string
    ethnic_group: string
    odds_score: string
    ref: string
}

export interface RuleBasedType {
    id: string
    hla_gene: any[]
    drug: any[]
    typeof_scar: any[]
    ethnic_group: any[]
    odds_score: any[]
    ref: any[]
    created_at: string
}

export interface RuleModelType {
    hla_gene: any[]
    drug: any[]
    typeof_scar: any[]
    ethnic_group: any[]
    odds_score: any[]
    ref: any[]
}

export const RuleResult: RuleResultType = {
    id: "",
    hla_gene: "",
    drug: "",
    typeof_scar: "", 
    ethnic_group: "",
    odds_score: "",
    ref: "",
}
export const RuleBased: RuleBasedType = {
    id: "",
    hla_gene: [],
    drug: [],
    typeof_scar: [], 
    ethnic_group: [],
    odds_score: [],
    ref: [],
    created_at: ""
}

export const RuleModel: RuleModelType = {
    hla_gene: [],
    drug: [],
    typeof_scar: [], 
    ethnic_group: [],
    odds_score: [],
    ref: [],
}