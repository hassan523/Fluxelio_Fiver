export interface GetParcelResponse {
  parcels: AllParcel[];
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface GetParcelRequest {
  agencyID: string;
  Token: string;
  limit: number;
  page: number;
}

export interface GetOfficeParcelRequest {
  agencyID: string;
  Token: string;
  officeID: string;
  limit: number;
  page: number;
}

// Get Single Parcel
export interface GetSingleParcelResponse {
  parcel: SingleParcel;
}

// Sub Interfaces
export interface AllParcel {
  _id: string;
  trackingID: string;
  agencyID: string;
  officeID: string;
  customerID: string;
  weight: number;
  transportMethod: string;
  status: string;
  departureID: string;
  destinationID: string;
  estimateArrival: string;
  description: string;
  mixedPackage: boolean;
  whatsappNotif: boolean;
  notificationCost: number;
  tagID: string;
  packagePicture: string[];
  createdBy: string;
  createdByType: string;
  createdAt: Date;
}

export interface CreateParcelType {
  weight: string | any;
  officeID: string;
  officeName: string;
  customerID: string;
  customerName: string;
  transportMethod: string;
  destinationID: string;
  destinationName: string;
  tagID: any;
  tagName: string;
  estimateArrival: string;
  description: string;
  mixedPackage: any;
  whatsappNotif: any;
  notificationCost: any;
  pricePerKilo: string;
  actualCarrierCost: string;
  paymentStatus: string;
  status: string;
  partialAmount: any;
  packagePictures: File[];
}

export interface GetParcelFiltersResponse {
  agencies: Agency[];
}

interface Agency {
  _id: string;
  agencyName: string;
  offices: Offices[];
}

interface Offices {
  officeName: string;
  _id: string;
  Customer: Customers[];
}

interface Customers {
  username: string;
  _id: string;
}

// Single Parcel Sub interfaces Start
interface CreatedByInfo {
  _id: string;
  username: string;
  type: string;
}

interface agency {
  _id: string;
  username: string;
  agencyName: string;
  companyCode: string;
}

interface departure {
  _id: string;
  agencyID: string;
  officeName: string;
  phone: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

interface customer {
  _id: string;
  username: string;
  phone: string;
  country: string;
  email: string;
}

interface transaction {
  _id: string;
  pricePerKilo: number;
  totalPrice: number;
  actualCarrierCost: number;
  grossProfit: number;
  paymentStatus: string;
}

interface parcel_trackings {
  _id: string;
  status: string;
  message: string;
  manualDate: null | string;
  createdAt: string;
  trackingUpdatedBy: {
    _id: string;
    username: string;
    type: string;
  };
}

interface transaction_tracking {
  _id: string;
  status: string;
  message: string;
  manualDate: null | string;
  createdAt: string;
  updatedByInfo: {
    _id: string;
    username: string;
    type: string;
  };
}

interface SingleParcel {
  _id: string;
  trackingID: string;
  weight: number;
  transportMethod: string;
  status: string;
  estimateArrival: string;
  description: string;
  mixedPackage: boolean;
  whatsappNotif: boolean;
  notificationCost: number;
  tagID: string;
  packagePicture: string[];
  createdByInfo: CreatedByInfo;
  createdAt: string | Date;
  agency: agency;
  departure: departure;
  destination: departure;
  customer: customer;
  transaction: transaction;
  parcel_trackings: parcel_trackings[];
  transaction_tracking: transaction_tracking[];
  tag: null | string;
}
// Single Parcel Sub interfaces End
