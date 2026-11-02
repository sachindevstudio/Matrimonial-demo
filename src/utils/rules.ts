import { Gender, Member } from '../types';

/**
 * Validates matrimonial age eligibility under Indian Marriage Act standards:
 * Groom (male) must be at least 21 years old.
 * Bride (female) must be at least 18 years old.
 */
export function validateAgeEligibility(
  dobString: string,
  gender: Gender,
  referenceDate: Date = new Date()
): { isValid: boolean; age: number; error?: string } {
  if (!dobString) {
    return { isValid: false, age: 0, error: 'Date of birth is required.' };
  }

  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, age: 0, error: 'Invalid date format.' };
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) {
    return { isValid: false, age, error: 'Birth date cannot be in the future.' };
  }

  if (gender === 'male' && age < 21) {
    return {
      isValid: false,
      age,
      error: `Grooms must be at least 21 years of age. Current calculated age: ${age} years.`,
    };
  }

  if (gender === 'female' && age < 18) {
    return {
      isValid: false,
      age,
      error: `Brides must be at least 18 years of age. Current calculated age: ${age} years.`,
    };
  }

  return { isValid: true, age };
}

/**
 * Generates a memorable, unique Member ID in the format SB-MXXXXX
 */
export function generateMemberId(prefix = 'SB-M'): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
}

/**
 * Calculates membership expiration date given start ISO string and duration in days
 */
export function calculateExpiryDate(startDateIso: string, durationDays: number): string {
  const start = new Date(startDateIso);
  const expiry = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

/**
 * Checks if a member has active, unexpired access to matrimonial profiles
 */
export function isMembershipActive(
  member: Pick<Member, 'membershipStatus' | 'membershipExpiresAt'> | null | undefined,
  referenceDate: Date = new Date()
): boolean {
  if (!member) return false;
  if (member.membershipStatus !== 'ACTIVE') return false;
  if (!member.membershipExpiresAt) return true;

  const expiry = new Date(member.membershipExpiresAt);
  return expiry.getTime() > referenceDate.getTime();
}

/**
 * Formats amount in INR currency
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
