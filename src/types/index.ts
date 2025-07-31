export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'data_entry_officer' | 'beneficiary';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  profilePhoto?: string;
  phoneNumber?: string;
  county?: string;
  assignedCounties?: string[]; // For data entry officers
}

export interface Beneficiary extends User {
  role: 'beneficiary';
  idNumber: string;
  idPhotoUrl?: string;
  dateOfBirth: string;
  gender: string;
  vulnerableGroup: string;
  monthlyIncome: number;
  numberOfChildren: number;
  employmentStatus: string;
  educationLevel: string;
  hasDisability: boolean;
  disabilityType?: string;
  hasInternetAccess: boolean;
  hasSmartphone: boolean;
  primaryLanguage: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalNotes?: string;
  documents: string[];
  registeredBy?: string; // ID of data entry officer who registered them
  businesses?: Business[];
}

export interface DataEntryOfficer extends User {
  role: 'data_entry_officer';
  assignedCounties: string[];
  registeredBeneficiaries: number;
  employeeId: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  description: string;
  startDate: string;
  fundingAmount: number;
  status: 'planning' | 'active' | 'completed' | 'failed';
  beneficiaryId: string;
  county: string;
  employees: number;
  monthlyRevenue?: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}