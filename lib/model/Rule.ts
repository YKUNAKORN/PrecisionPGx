export interface RuleResult {
    id: string
    location: string
    result_location: string
    phenotype: string
    predicted_genotype: string
    predicted_phenotype: string
    recommendation: string
    Name: string
}
export interface RuleBased {
    id: string
    location: any[]
    result_location: any[]
    phenotype: any[]
    predicted_genotype: any[]
    predicted_phenotype: any[]
    recommendation: any[]
    Name: any[]
    created_at: string
}

export interface RuleModel {
    location: any[]
    result_location: any[]
    phenotype: any[]
    predicted_genotype: any[]
    predicted_phenotype: any[]
    recommend: any[]
    Name: any[]
}

export const RuleResult: any = {}
