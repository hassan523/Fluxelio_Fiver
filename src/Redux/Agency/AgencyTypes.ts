// Agency Signup
export interface AgencySignupRequest {
	username: string;
	email: string;
	agencyName: string;
	password: string;
}

export interface AgencySignupResponse {
	message: string;
	accessToken: string;
	refreshToken: string;
	user: {
		username: string;
		agencyName: string;
		email: string;
		role: string[];
		_id: string;
	};
}

// Get All Agency
export interface GetAllAgencyRequest {
	limit: number;
	page: number;
	Token: string;
	status: string;
	search: string;
}

export interface GetAllAgencyResponse {
	agencies: [
		{
			_id: string;
			agencyName: string;
			username: string;
			email: string;
			password: string;
			role: string[];
			status: ["Active", "Blocked"];
			officeCount: number;
			__v: number;
			refreshToken: string;
		}
	];
	meta: {
		totalItems: number;
		totalPages: number;
		page: number;
		limit: number;
	};
}

// Select Agency
export interface SelectAgencyRequest {
	Token: string;
	_id: string;
}

export interface SelectAgencyResponse {
	agencies: [
		{
			_id: string;
			agencyName: string;
			offices: {officeID: string; officeName: string}[];
		}
	];
	meta: {
		totalItems: number;
		totalPages: number;
		page: number;
		limit: number;
	};
}
