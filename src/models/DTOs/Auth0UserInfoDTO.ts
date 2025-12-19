export interface Auth0UserInfoDTO{
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    nickname?: string;
    updated_at?: string;
}