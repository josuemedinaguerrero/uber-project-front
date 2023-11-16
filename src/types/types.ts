export type Roles = {
  ROL: "CLIENT" | "ADMIN" | "DRIVER";
};

export type User = {
  ADDRESS: string;
  EMAIL: string;
  PROFESSION: string;
  USERNAME: string;
  ROL: string;
};

export type Driver = {
  ADDRESS: string;
  BIRTHDATE: Date;
  CEDULE: string;
  CITY: string;
  COMPLETED_RACES: number;
  STATE_DOCUMENTS: number;
  EMAIL: string;
  NAMES: string;
  PHONE: string;
  QUALIFICATION: number;
  ROL: string;
  STATUS: number;
  SURNAMES: string;
  VERIFIED_DOCUMENTS: number;
};

export interface FieldClient {
  name: "USERNAME" | "CEDULE" | "EMAIL";
  label: string;
  disabled?: boolean;
}

export interface FieldDefaultClient {
  USERNAME: string;
  CEDULE: string;
  EMAIL: string;
  PAYMENT_METHOD?: number;
}

export interface PaymentMethods {
  id: number;
  name: string;
}
