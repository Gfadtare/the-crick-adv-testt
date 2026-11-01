export type IsAbove18 = 'Yes' | 'No' | '';

export type ApplicantRelation = 'Father' | 'Mother' | 'Sister' | 'Guardian' | '';

export type Country =
  | 'India'
  | 'United Kingdom'
  | 'Australia'
  | 'New Zealand'
  | 'South Africa'
  | 'Zimbabwe'
  | 'Oman'
  | 'United States of America'
  | 'United Arab Emirates';

export type PlayingRole =
  | 'Batter'
  | 'Batter & Wicket Keeper'
  | 'Bowler'
  | 'All Rounder (Seam)'
  | 'All Rounder (Spin)';

export type TestMode = 'Online' | 'Offline';

export interface FormState {
  firstName: string;
  lastName: string;
  isAbove18: IsAbove18;
  age: string;
  applicantRelation: ApplicantRelation;
  nationality: Country | '';
  countryOfResidence: Country | '';
  mobileCountryCode: string;
  mobileNumber: string;
  email: string;
  playingRole: PlayingRole | '';
  subRole: string;
  testMode: TestMode;
}

export interface PaymentDetails {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paidAt: string;
}

export interface SubmissionData extends FormState {
  id: string;
  submittedAt: string;
  paymentDetails?: PaymentDetails;
}
