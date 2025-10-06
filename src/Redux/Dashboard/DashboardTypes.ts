import {off} from "process";

export interface GetDashboardRequest {
	id: string;
	parcelCountMonth: number;
	parcelCountYear: number;
	transactionStatsYear: number;
	revenueYear: number;
	Token: string;
}

export interface GetDashboardResponse {
	agencyCount: number;
	customerCount: number;
	officeCount: number;
	parcelsInMonth: number;
	pendingParcelCount: number;
	revenueStatistics: {
		balance: number;
		paymentValidated: number;
		pendingPayment: number;
		data: {
			balance: number;
			expenses: number;
			month: number;
			name: string;
			revenue: number;
			year: number;
		}[];
	};
	topCountries: {
		country: string;
		count: number;
	}[];
	totalParcelCount: number;
	transactionStatistics: {
		data: {
			balance: number;
			expenses: number;
			month: number;
			name: string;
			revenue: number;
			year: number;
		}[];
		paymentValidated: number;
		pendingPayment: number;
	};
}
