export interface GetAllUsersResponse {
    users: SingleUser[];
    meta: {
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}

export interface GetAllUsersRequest {
    agencyID: string;
    officeID: string;
    Token: string;
}

export interface CreateUserRequest {
    agencyID: string;
    officeID: string;
    Token: string;
    username: string;
    phone: string;
    password: string;
    createdBy: string;
    email: string;
    countryCode: string;
    country: string;
}

export interface CreateUserResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
        username: string;
        email: string;
        country: string;
        countryCode: string;
        phone: string;
        role: string;
        agencyID: string;
        officeID: string;
        createdBy: string;
        _id: string;
    };
}

interface SingleUser {
    _id: string;
    username: string;
    email: string;
    phone: string;
    role: "User";
    agencyID: string;
    officeID: string;
    __v: number;
    agencyName: string;
    officeName: string;
    country: string;
    createdBy: string;
}
