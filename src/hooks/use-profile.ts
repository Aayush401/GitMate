import api from "@/lib/axios";

const fetchProfile = async () => {
    try {
        const resData = await api.get("/profile", {
        withCredentials: true,
    });
    return resData.data.user ?? null;
    
    } catch (err) {
        return null;
    }
}

const profile = await fetchProfile();

export const useProfile = () => {
    if(profile.success) return true
    else return false
}