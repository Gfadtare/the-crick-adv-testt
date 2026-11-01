import { Country, PlayingRole } from './types';

export const COUNTRIES: Country[] = [
  'India',
  'United Kingdom',
  'Australia',
  'New Zealand',
  'South Africa',
  'Zimbabwe',
  'Oman',
  'United States of America',
  'United Arab Emirates',
];

export const COUNTRY_CODES: Record<Country, string> = {
  India: '+91',
  'United Kingdom': '+44',
  Australia: '+61',
  'New Zealand': '+64',
  'South Africa': '+27',
  Zimbabwe: '+263',
  Oman: '+968',
  'United States of America': '+1',
  'United Arab Emirates': '+971',
};

export const APPLICANT_RELATIONS = ['Father', 'Mother', 'Sister', 'Guardian'] as const;

export const PLAYING_ROLES: PlayingRole[] = [
  'Batter',
  'Batter & Wicket Keeper',
  'Bowler',
  'All Rounder (Seam)',
  'All Rounder (Spin)',
];

export const SUB_ROLES_MAP: Record<PlayingRole, string[]> = {
  Batter: [
    'Right Hand Opening Batter',
    'Left Hand Opening Batter',
    'Right Hand Middle Order Batter',
    'Left Hand Middle Order Batter',
  ],
  'Batter & Wicket Keeper': [
    'Right Hand Opening Batter & Wicket Keeper',
    'Left Hand Opening Batter & Wicket Keeper',
    'Right Hand Middle Order Batter & Wicket Keeper',
    'Left Hand Middle Order Batter & Wicket Keeper',
  ],
  Bowler: [
    'Left Arm Fast Bowler',
    'Right Arm Fast Bower',
    'Left Arm Orthodox',
    'Left Arm Chinaman/Wrist Spin',
    'Right Arm Off Spin',
    'Right Arm Leg Spin',
    'Ambidextrous (Spin)',
    'Ambidextrous (Pace)',
    'Ambidextrous (Spin & Pace)',
  ],
  'All Rounder (Seam)': [
    'Batting All Rounder- Left Hand Opening Batter & Right Arm Fast Bowler',
    'Batting All Rounder- Left Hand Opening Batter & Left Arm Fast Bowler',
    'Batting All Rounder- Right Hand Opening Batter & Right Arm Fast Bowler',
    'Batting All Rounder- Right Hand Opening Batter & Left Arm Fast Bowler',
    'Batting All Rounder- Left Hand Middle Order Batter & Right Arm Fast Bowler',
    'Batting All Rounder- Left Hand Middle Order Batter & Left Arm Fast Bowler',
    'Batting All Rounder- Right Hand Middle Order Batter & Right Arm Fast Bowler',
    'Batting All Rounder- Right Hand Middle Order & Left Arm Fast Bowler',
    'Bowling All Rounder- Left Hand Opening Batter & Right Arm Fast Bowler',
    'Bowling All Rounder- Left Hand Opening Batter & Left Arm Fast Bowler',
    'Bowling All Rounder- Right Hand Opening Batter & Right Arm Fast Bowler',
    'Bowling All Rounder- Right Hand Opening Batter & Left Arm Fast Bowler',
    'Bowling All Rounder- Left Hand Middle Order Batter & Right Arm Fast Bowler',
    'Bowling All Rounder- Left Hand Middle Order Batter & Left Arm Fast Bowler',
    'Bowling All Rounder- Right Hand Middle Order Batter & Right Arm Fast Bowler',
    'Bowling All Rounder- Right Hand Middle Order & Left Arm Fast Bowler',
  ],
  'All Rounder (Spin)': [
    'Left Hand Opening Batter & Right Arm Off Spin',
    'Left Hand Opening Batter & Right Arm Leg Spin',
    'Left Hand Opening Batter & Left Arm Orthodox',
    'Left Hand Opening Batter & Left Arm Chinaman/Wrist Spinner',
    'Left Hand Opening Batter & Ambidextrous',
    'Right Hand Opening Batter & Right Arm Off Spin',
    'Right Hand Opening Batter & Right Arm Leg Spin',
    'Right Hand Opening Batter & Left Arm Orthodox',
    'Right Hand Opening Batter & Left Arm Chinaman/Wrist Spinner',
    'Right Hand Opening Batter & Ambidextrous',
    'Left Hand Middle Order Batter & Right Arm Off Spin',
    'Left Hand Middle Order Batter & Right Arm Leg Spin',
    'Left Hand Middle Order Batter & Left Arm Orthodox',
    'Left Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner',
    'Left Hand Middle Order Batter & Ambidextrous',
    'Right Hand Middle Order Batter & Right Arm Off Spin',
    'Right Hand Middle Order Batter & Right Arm Leg Spin',
    'Right Hand Middle Order Batter & Left Arm Orthodox',
    'Right Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner',
    'Right Hand Middle Order Batter & Ambidextrous',
  ],
};

export const getAgeOptions = (isAbove18: 'Yes' | 'No' | ''): number[] => {
  if (isAbove18 === 'Yes') {
    const ages: number[] = [];
    for (let i = 18; i <= 50; i++) {
      ages.push(i);
    }
    return ages;
  }
  if (isAbove18 === 'No') {
    const ages: number[] = [];
    for (let i = 5; i <= 17; i++) {
      ages.push(i);
    }
    return ages;
  }
  return [];
};
