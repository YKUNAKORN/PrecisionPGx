import { getdetailUserModel } from './model/User';

export async function fetchUser(): Promise<getdetailUserModel | null> {
    try {
        const response = await fetch(`/api/user/user/detail`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched user data:", data);
        
        if (!data || !data.data) {
            console.error("No user data found in response");
            return null;
        }
        
        return data.data[0] as getdetailUserModel;
            
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}