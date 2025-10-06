export interface GetTransactionRequest {
	Token: string;
	id: string;
	page: number;
	limit: number;
	search: string;
}

export interface GetTransactionResponse {
	meta: meta;
	transaction: GetTransactionArr[];
}

// Sub interface
interface GetTransactionArr {
	_id: string;
	parcelID: string;
	agencyID: string;
	officeID: string;
	pricePerKilo: number;
	totalPrice: number;
	actualCarrierCost: number;
	grossProfit: number;
	updatedBy: string;
	updatedByType: string;
	partialAmount: number;
	paymentStatus: string;
	updatedByUsername: string;
	trackingID: string;
	status: string;
	customer: string;
}

interface meta {
	totalItems: number;
	totalPages: number;
	page: number;
	limit: number;
}
