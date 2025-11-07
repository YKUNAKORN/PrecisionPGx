export interface RuleResult {
    id: string;
    location: string;
    result_location: string;
    phenotype: string;
    predicted_genotype: string;
    predicted_phenotype: string;
    recommendation: string;
    Name: any[];
}

export interface RuleBased {
    id: string;
    location: any[];
    result_location: any[];
    phenotype: any[];
    predicted_genotype: any[];
    predicted_phenotype: any[];
    recommendation: any[];
    Name: any[];
    created_at: string;
}

export interface RuleModel {
    location: any[];
    result_location: any[];
    phenotype: any[];
    predicted_genotype: any[];
    predicted_phenotype: any[];
    recommend: any[];
    Name: any[];
}

export const RuleResultExample: RuleResult = {
    id: "",
    location: "",
    result_location: "",
    phenotype: "",
    predicted_genotype: "",
    predicted_phenotype: "",
    recommendation: "",
    Name: []
};

export const RuleBasedExample: RuleBased = {
    id: "",
    location: [],
    result_location: [],
    phenotype: [],
    predicted_genotype: [],
    predicted_phenotype: [],
    recommendation: [],
    Name: [],
    created_at: ""
};

export const RuleModelExample: RuleModel = {
    location: [],
    result_location: [],
    phenotype: [],
    predicted_genotype: [],
    predicted_phenotype: [],
    recommend: [],
    Name: [],
};
