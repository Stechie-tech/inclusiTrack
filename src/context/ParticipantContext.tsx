import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  county: string;
  subCounty: string;
  vulnerableGroup: string;
  monthlyIncome: number;
  numberOfChildren: number;
  employmentStatus: string;
  educationLevel: string;
  hasDisability: boolean;
  disabilityType: string;
  hasInternetAccess: boolean;
  hasSmartphone: boolean;
  primaryLanguage: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalNotes: string;
  documents: string[];
  registrationDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface ParticipantContextType {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  updateParticipant: (participant: Participant) => void;
  deleteParticipant: (id: string) => void;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

// Sample data for demonstration
const sampleParticipants: Participant[] = [
  {
    id: '1',
    firstName: 'Grace',
    lastName: 'Wanjiku',
    email: 'grace.wanjiku@email.com',
    phoneNumber: '+254712345678',
    idNumber: '12345678',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    county: 'Nairobi',
    subCounty: 'Westlands',
    vulnerableGroup: 'Creative Artists',
    monthlyIncome: 15000,
    numberOfChildren: 2,
    employmentStatus: 'self-employed',
    educationLevel: 'secondary',
    hasDisability: false,
    disabilityType: '',
    hasInternetAccess: true,
    hasSmartphone: true,
    primaryLanguage: 'Swahili',
    emergencyContact: 'Peter Wanjiku',
    emergencyPhone: '+254798765432',
    additionalNotes: 'Artist specializing in traditional crafts',
    documents: ['National ID', 'Birth Certificate'],
    registrationDate: '2024-01-15T10:00:00Z',
    verificationStatus: 'verified'
  },
  {
    id: '2',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@email.com',
    phoneNumber: '+254723456789',
    idNumber: '23456789',
    dateOfBirth: '1990-07-22',
    gender: 'male',
    county: 'Mombasa',
    subCounty: 'Mvita',
    vulnerableGroup: 'Refugees & Displaced Persons',
    monthlyIncome: 8000,
    numberOfChildren: 3,
    employmentStatus: 'unemployed',
    educationLevel: 'primary',
    hasDisability: false,
    disabilityType: '',
    hasInternetAccess: false,
    hasSmartphone: false,
    primaryLanguage: 'Somali',
    emergencyContact: 'Fatima Hassan',
    emergencyPhone: '+254787654321',
    additionalNotes: 'Refugee from Somalia, seeking employment opportunities',
    documents: ['Refugee ID', 'UNHCR Certificate'],
    registrationDate: '2024-01-20T14:30:00Z',
    verificationStatus: 'pending'
  },
  {
    id: '3',
    firstName: 'Mary',
    lastName: 'Njeri',
    email: 'mary.njeri@email.com',
    phoneNumber: '+254734567890',
    idNumber: '34567890',
    dateOfBirth: '1978-11-08',
    gender: 'female',
    county: 'Kiambu',
    subCounty: 'Thika',
    vulnerableGroup: 'Persons with Disabilities',
    monthlyIncome: 12000,
    numberOfChildren: 1,
    employmentStatus: 'employed',
    educationLevel: 'tertiary',
    hasDisability: true,
    disabilityType: 'Visual impairment',
    hasInternetAccess: true,
    hasSmartphone: true,
    primaryLanguage: 'English',
    emergencyContact: 'John Njeri',
    emergencyPhone: '+254776543210',
    additionalNotes: 'Works in customer service, needs accessibility tools',
    documents: ['National ID', 'Disability Certificate'],
    registrationDate: '2024-01-25T09:15:00Z',
    verificationStatus: 'verified'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Otieno',
    email: 'david.otieno@email.com',
    phoneNumber: '+254745678901',
    idNumber: '45678901',
    dateOfBirth: '1995-05-12',
    gender: 'male',
    county: 'Kisumu',
    subCounty: 'Kisumu Central',
    vulnerableGroup: 'Poverty & Low Financial Literacy',
    monthlyIncome: 5000,
    numberOfChildren: 0,
    employmentStatus: 'self-employed',
    educationLevel: 'secondary',
    hasDisability: false,
    disabilityType: '',
    hasInternetAccess: false,
    hasSmartphone: true,
    primaryLanguage: 'Luo',
    emergencyContact: 'Susan Otieno',
    emergencyPhone: '+254765432109',
    additionalNotes: 'Small business owner, needs financial literacy training',
    documents: ['National ID'],
    registrationDate: '2024-02-01T16:45:00Z',
    verificationStatus: 'pending'
  }
];

export const ParticipantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>(sampleParticipants);

  const addParticipant = (participant: Participant) => {
    setParticipants(prev => [...prev, participant]);
  };

  const updateParticipant = (updatedParticipant: Participant) => {
    setParticipants(prev => 
      prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
    );
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ParticipantContext.Provider value={{
      participants,
      addParticipant,
      updateParticipant,
      deleteParticipant
    }}>
      {children}
    </ParticipantContext.Provider>
  );
};

export const useParticipants = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error('useParticipants must be used within a ParticipantProvider');
  }
  return context;
};