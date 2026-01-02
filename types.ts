
export interface EmployeeData {
  // Basic Info
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalId: string; // ID number
  address: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Professional
  department: string;
  position: string;
  startDate: string;
  totalExperienceYears: number;
  education: string;
  major: string;
  languages: string[];
  topSkills: string[];
  status: 'Active' | 'Resigned' | 'Hidden'; 
  notes?: string; // 新增：人員備註

  // Admin/Bank
  bankCode: string;
  bankAccount: string;

  // Psychology/Cultural
  mbti: string;
  workStyle: 'Remote' | 'Hybrid' | 'On-site';
  interests: string;
  expectations: string;
}

export type AppView = 'portal' | 'form' | 'admin-login' | 'dashboard' | 'success';

export interface AIInsight {
  talentSummary: string;
  strategicFit: string;
  onboardingAdvice: string;
}
