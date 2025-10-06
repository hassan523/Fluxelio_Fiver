export interface CreateTagsResponse {
    message: string;
    tags: tags[];
}

export interface CreateTagsRequest {
    agencyID: string;
    officeID: string;
    Token: string;
    data: {
        tagName: string;
    };
}

export interface GetTagsResponse {
    tags: tags[];
    meta: meta;
}

export interface GetTagsRequest {
    agencyID: string;
    officeID: string;
    Token: string;
}

// Sub interfaces
interface tags {
    _id: string;
    agency: {
        _id: string;
        agencyName: string;
    };
    office: {
        _id: string;
        officeName: string;
    };
    tagName: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface meta {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
}
