import { ULPIN } from '../types';

export const parseULPIN = (ulpinStr: string): ULPIN | null => {
  if (!ulpinStr) return null;
  
  // Format: OD-BBSR-W12-P001-B03-F04-U02
  const parts = ulpinStr.split('-');
  
  return {
    ulpin_code: ulpinStr,
    state_code: parts[0] || 'OD',
    city_code: parts[1] || 'BBSR',
    ward_code: parts[2] || 'W12',
    registration_status: 'registered',
    validation_status: 'verified'
  };
};

export const formatULPIN = (ulpinStr: string): string => {
  if (!ulpinStr) return '';
  return ulpinStr.trim();
};

export const getULPINLevel = (ulpinStr: string): string => {
  if (!ulpinStr) return 'UNKNOWN';
  if (ulpinStr.includes('-U')) return 'UNIT';
  if (ulpinStr.includes('-F')) return 'FLOOR';
  if (ulpinStr.includes('-B')) return 'BUILDING';
  if (ulpinStr.includes('-P')) return 'PARCEL';
  return '2D_PARCEL';
};

export const isValidULPIN = (ulpinStr: string): boolean => {
  if (!ulpinStr) return false;
  return ulpinStr.length >= 8;
};
