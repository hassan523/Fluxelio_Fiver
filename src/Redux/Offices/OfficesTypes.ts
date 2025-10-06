// Get Offices
export interface GetOfficeRequest {
	AgencyID: string;
	Token: string;
	limit: number;
	page: number;
	search: string;
}
export interface GetOfficeResponse {
	offices: Office[];
	meta: Meta;
}

// Create Office
export interface CreateOfficeRequest {
	Token: string;
	data: {
		agencyID: string;
		officeName: string;
		email: string;
		phone: string;
		address: Address;
		openingHours: DaySchedule[];
	};
}

export interface CreateOfficeResponse {
	message: string;
	office: {
		agencyID: string;
		officeName: Office;
	};
}

// Update Office
export interface UpdateOfficeRequest {
	Token: string;
	AgencyID: string;
	officeID: string;
	data: {
		officeName: string;
		email: string;
		phone: string;
		address: Address;
		openingHours: DaySchedule[];
	};
}

export interface CreateOfficeResponse {
	message: string;
	office: {
		agencyID: string;
		officeName: Office;
	};
}

// State Types
export interface CreateOfficeState {
	agencyID: string;
	officeName: string;
	email: string;
	phone: string;
	address: Address;
	openingHours: DaySchedule[];
}

export interface UpdateOfficeState {
	officeName: string;
	email: string;
	status: string[];
	phone: string;
	address: Address;
	openingHours: DaySchedule[];
}

// Sub Types
export interface Office {
	_id: string;
	agencyID: string;
	agencyName: string;
	officeName: string;
	email: string;
	phone: string;
	address: Address;
	openingHours: DaySchedule[];
	role: string[];
	status: string[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface Address {
	street: string;
	postalCode: string;
	city: string;
	country: string;
}

export interface DaySchedule {
	day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Holiday" | "";
	slots: TimeSlot[];
	closed: boolean;
}

export interface TimeSlot {
	open: string;
	close: string;
}

export interface Meta {
	totalItems: number;
	totalPages: number;
	page: number;
	limit: number;
}

export interface GetSingleOfficeRequest {
	AgencyID: string;
	OfficeID: string;
	parcelCountMonth: number;
	parcelCountYear: number;
	transactionStatsYear: number;
	revenueYear: number;
	Token: string;
}

export interface GetSingleOfficeResponse {
	office: Office;
	operatorCount: number;
	parcelCount: number;
	customerCount: number;
	parcelsInMonth: number;
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
	topCountries: {
		country: string;
		count: number;
	}[];
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
}
