import { CricketCVFull } from '../../CVTypes';
import React from 'react';

export interface TemplateConfig {
  width: number;       // in pixels (A4 standard: 794px at 96 DPI)
  height: number;      // in pixels (A4 standard: 1123px at 96 DPI)
  marginTop: number;   // in pixels
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  sectionGap: number;
}

export interface TemplateModule {
  id: string;
  name: string;
  config: TemplateConfig;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateModule> = {
  executive: {
    id: 'executive',
    name: 'Executive',
    config: {
      width: 794,
      height: 1123,
      marginTop: 50,
      marginBottom: 50,
      marginLeft: 50,
      marginRight: 50,
      sectionGap: 24
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    config: {
      width: 794,
      height: 1123,
      marginTop: 45,
      marginBottom: 45,
      marginLeft: 45,
      marginRight: 45,
      sectionGap: 20
    }
  },
  international: {
    id: 'international',
    name: 'International',
    config: {
      width: 794,
      height: 1123,
      marginTop: 40,
      marginBottom: 40,
      marginLeft: 40,
      marginRight: 40,
      sectionGap: 16
    }
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    config: {
      width: 794,
      height: 1123,
      marginTop: 48,
      marginBottom: 48,
      marginLeft: 48,
      marginRight: 48,
      sectionGap: 22
    }
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    config: {
      width: 794,
      height: 1123,
      marginTop: 55,
      marginBottom: 55,
      marginLeft: 55,
      marginRight: 55,
      sectionGap: 28
    }
  },
  prestige: {
    id: 'prestige',
    name: 'Prestige',
    config: {
      width: 794,
      height: 1123,
      marginTop: 34,
      marginBottom: 34,
      marginLeft: 0,
      marginRight: 0,
      sectionGap: 22
    }
  }
};
