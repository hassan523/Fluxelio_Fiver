// Login
export interface LoginRequest {
    identifier: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        username: string;
        email: string;
        role: string[];
        _id: string;
    };
}

// Get Profile
export interface GetProfileRequest {
    userID: string;
    Token: string;
}
export interface ForgotResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        username: string;
        email: string;
        role: string[];
        _id: string;
    };
}

// types/profile.ts
export type Role = "Admin" | "Agency" | "Operator";

// Base fields common to all
interface BaseProfile {
    profile: {
        _id: string;
        email: string;
        username: string;
        role: Role[];
    };
}

// Admin Profile
export interface AdminProfile extends BaseProfile {
    role: ["Admin"];
    refreshToken: string;
    password: string;
    __v: number;
    updatedAt: string;
    otp: null;
    otpExpire: null;
}
// Agency Profile
export interface AgencyProfile extends BaseProfile {
    role: ["Agency"];
    agencyName: string;
    companyCode: string;
    password: string;
    status: string[];
    officeCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    refreshToken: string | null;
}

// Operator Profile
export interface OperatorProfile extends BaseProfile {
    role: ["Operator"];
    phone: string;
    status: string[];
    agency: {
        agencyID: string;
        agencyName: string;
        companyCode: string;
    };
    office: {
        officeID: string;
        officeName: string;
        address: {
            street: string;
            postalCode: string;
            city: string;
            country: string;
        };
    };
}

// Union Type
export type Profile = AdminProfile | AgencyProfile | OperatorProfile;
