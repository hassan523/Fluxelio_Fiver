export interface GetSupport {
    tickets: Tickets[];
    meta: meta;
}

export interface GetSingleSupport {
    message: string;
    ticket: Tickets;
}

// Sub interfaces
interface Tickets {
    _id: string;
    createdByRole: string;
    title: string;
    description: string;
    images: string[];
    status: "Resolved" | "Pending" | "In-Progress";
    createdAt: string;
    updatedAt: string;
    createdByID: string;
    createdByName: string;
}

interface meta {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
}
