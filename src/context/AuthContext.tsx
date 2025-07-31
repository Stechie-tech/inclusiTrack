import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Beneficiary, DataEntryOfficer, Admin, Business } from '../types';
import { KENYAN_COUNTIES, VULNERABLE_GROUPS } from '../utils/constants';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  businesses: Business[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addBusiness: (business: Omit<Business, 'id'>) => void;
  updateBusiness: (business: Business) => void;
  getBeneficiariesByOfficer: (officerId: string) => Beneficiary[];
  getBusinessesByCounty: (county: string) => Business[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    email: 'admin@heva.org',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    phoneNumber: '+254700000001',
    county: 'Nairobi'
  } as Admin,
  {
    id: '2',
    email: 'officer1@heva.org',
    firstName: 'Sarah',
    lastName: 'Kimani',
    role: 'data_entry_officer',
    status: 'approved',
    createdAt: '2024-01-02T00:00:00Z',
    phoneNumber: '+254700000002',
    county: 'Nairobi',
    assignedCounties: ['Nairobi', 'Kiambu', 'Machakos'],
    registeredBeneficiaries: 15,
    employeeId: 'EMP001'
  } as DataEntryOfficer,
  {
    id: '3',
    email: 'officer2@heva.org',
    firstName: 'Peter',
    lastName: 'Ochieng',
    role: 'data_entry_officer',
    status: 'approved',
    createdAt: '2024-01-03T00:00:00Z',
    phoneNumber: '+254700000003',
    county: 'Kisumu',
    assignedCounties: ['Kisumu', 'Siaya', 'Migori'],
    registeredBeneficiaries: 12,
    employeeId: 'EMP002'
  } as DataEntryOfficer,
  {
    id: '4',
    email: 'grace.wanjiku@email.com',
    firstName: 'Grace',
    lastName: 'Wanjiku',
    role: 'beneficiary',
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
    phoneNumber: '+254712345678',
    county: 'Nairobi',
    idNumber: '12345678',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    vulnerableGroup: 'Creative Artists',
    monthlyIncome: 15000,
    numberOfChildren: 2,
    employmentStatus: 'self-employed',
    educationLevel: 'secondary',
    hasDisability: false,
    hasInternetAccess: true,
    hasSmartphone: true,
    primaryLanguage: 'Swahili',
    emergencyContact: 'Peter Wanjiku',
    emergencyPhone: '+254798765432',
    additionalNotes: 'Artist specializing in traditional crafts',
    documents: ['National ID', 'Birth Certificate'],
    registeredBy: '2'
  } as Beneficiary,
  {
    id: '5',
    email: 'ahmed.hassan@email.com',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    role: 'beneficiary',
    status: 'pending',
    createdAt: '2024-01-20T14:30:00Z',
    phoneNumber: '+254723456789',
    county: 'Mombasa',
    idNumber: '23456789',
    dateOfBirth: '1990-07-22',
    gender: 'male',
    vulnerableGroup: 'Refugees & Displaced Persons',
    monthlyIncome: 8000,
    numberOfChildren: 3,
    employmentStatus: 'unemployed',
    educationLevel: 'primary',
    hasDisability: false,
    hasInternetAccess: false,
    hasSmartphone: false,
    primaryLanguage: 'Somali',
    emergencyContact: 'Fatima Hassan',
    emergencyPhone: '+254787654321',
    additionalNotes: 'Refugee from Somalia, seeking employment opportunities',
    documents: ['Refugee ID', 'UNHCR Certificate']
  } as Beneficiary
];

const sampleBusinesses: Business[] = [
  {
    id: '1',
    name: 'Wanjiku Crafts',
    type: 'Handicrafts',
    description: 'Traditional Kenyan crafts and artwork',
    startDate: '2024-02-01',
    fundingAmount: 50000,
    status: 'active',
    beneficiaryId: '4',
    county: 'Nairobi',
    employees: 3,
    monthlyRevenue: 25000
  },
  {
    id: '2',
    name: 'Hassan Food Truck',
    type: 'Food Service',
    description: 'Mobile food service specializing in Somali cuisine',
    startDate: '2024-03-15',
    fundingAmount: 75000,
    status: 'planning',
    beneficiaryId: '5',
    county: 'Mombasa',
    employees: 2
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [businesses, setBusinesses] = useState<Business[]>(sampleBusinesses);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email && u.status === 'approved');
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'beneficiary',
      status: 'pending',
      createdAt: new Date().toISOString(),
      phoneNumber: userData.phoneNumber,
      county: userData.county,
      ...userData
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'approved' as const } : user
    ));
  };

  const rejectUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'rejected' as const } : user
    ));
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const addBusiness = (businessData: Omit<Business, 'id'>) => {
    const newBusiness: Business = {
      ...businessData,
      id: Date.now().toString()
    };
    setBusinesses(prev => [...prev, newBusiness]);
  };

  const updateBusiness = (updatedBusiness: Business) => {
    setBusinesses(prev => prev.map(business => 
      business.id === updatedBusiness.id ? updatedBusiness : business
    ));
  };

  const getBeneficiariesByOfficer = (officerId: string): Beneficiary[] => {
    return users.filter(user => 
      user.role === 'beneficiary' && 
      (user as Beneficiary).registeredBy === officerId
    ) as Beneficiary[];
  };

  const getBusinessesByCounty = (county: string): Business[] => {
    return businesses.filter(business => business.county === county);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      businesses,
      login,
      logout,
      register,
      approveUser,
      rejectUser,
      updateUser,
      deleteUser,
      addBusiness,
      updateBusiness,
      getBeneficiariesByOfficer,
      getBusinessesByCounty
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};