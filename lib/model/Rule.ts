export interface RuleResultType {
    id: string
    location: string
    result_location: string
    phenotype: string
    predicted_genotype: string
    predicted_phenotype: string
    recommendation: string
    Name: string
}

export interface RuleBasedType {
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

export interface RuleModelType {
    location: any[]
    result_location: any[]
    phenotype: any[]
    predicted_genotype: any[]
    predicted_phenotype: any[]
    recommend: any[]
    Name: any[]
}

export const RuleResult: RuleResultType = {
    id: "",
    location: "",
    result_location: "",
    phenotype: "",
    predicted_genotype: "",
    predicted_phenotype: "",
    recommendation: "",
    Name: ""
}
export const RuleBased: RuleBasedType = {
    id: "",
    location: [],
    result_location: [],
    phenotype: [],
    predicted_genotype: [],
    predicted_phenotype: [],
    recommendation: [],
    Name: [],
    created_at: ""
}

export const RuleModel: RuleModelType = {
    location: [],
    result_location: [],
    phenotype: [],
    predicted_genotype: [],
    predicted_phenotype: [],
    recommend: [],
    Name: [],
}