import { GetById } from "../../../../lib/supabase/crud";
import { RuleResult } from "../../../../lib/model/Rule";
import { CreateClientSecret } from "../../../../lib/supabase/client";


const db = CreateClientSecret();
export async function QueryRule(ruleID, index){
    try{ 
        const response = await GetById(db,"TestRuleBasedFolkFolk", ruleID);
        if(response.error){
            console.error("Error fetching rule:", response.error);
            return {data: null, error: response.error.message};
        }
        RuleResult.id = response.data[0].id;
        RuleResult.location = response.data[0].location;
        RuleResult.result_location = response.data[0].result_location[index];
        RuleResult.predicted_genotype = response.data[0].predicted_genotype[index];
        RuleResult.predicted_phenotype = response.data[0].predicted_phenotype[index];
        RuleResult.recommendation = response.data[0].recommend[index];
        return {data: RuleResult, error: null};

    }catch(error){
        console.error("Error fetching rule:", error);
        return {data: null, error: error.message};
    }
}