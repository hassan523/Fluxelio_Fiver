// Bulk Operator invitation
export interface bulkInvitationResponse {
    message: string;
    invitations: InviteArray[];
}

export interface bulkInvitationRequest {
    AgencyID: string;
    OfficeID: string;
    Token: string;
    data: { emails: string[] };
}

// Get All Operator
export interface GetAllOperatorsResponse {
    operators: SingleOperator[];
    meta: {
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}

export interface GetAllOperatorsRequest {
    AgencyID: string;
    OfficeID: string;
    Token: string;
}

// Get All Invites
export interface GetAllInvitesResponse {
    invites: Invites[];
    meta: {
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}

// Sub interface
interface InviteArray {
    email: string;
    link: string;
}

interface SingleOperator {
    _id: string;
    username: string;
    email: string;
    phone: string;
    role: "Operator";
    agencyID: string;
    officeID: string;
    __v: number;
    agencyName: string;
    officeName: string;
}

export interface Invites {
    _id: string;
    agency: {
        _id: string;
        companyCode: string;
        agencyName: string;
    };
    office: {
        _id: string;
        officeName: string;
    };
    email: string;
    createdAt: string;
    expiresAt: string;
    updatedAt: string;
    used: boolean;
}
