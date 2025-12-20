export type userProfiles = {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string;
    membership_tier: string;
    role: string;
    referral_code: string;
    referred_by_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    birth_date: string;   
};

export type userProfile = {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string;
    membership_tier: string;
    role: string;
    referral_code: string;
    referred_by_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    birth_date: string;   
};

export type updateUserProfile = {
    full_name: string;
    phone: string;
    role: string;
    is_active: boolean;  
};