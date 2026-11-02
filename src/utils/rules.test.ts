import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAgeEligibility,
  generateMemberId,
  calculateExpiryDate,
  isMembershipActive,
  formatCurrencyINR,
} from './rules';

test('validateAgeEligibility enforces 21+ for males', () => {
  const refDate = new Date('2026-11-02T00:00:00Z');
  // 20 years old male -> should fail
  const underAgeMale = validateAgeEligibility('2006-11-05', 'male', refDate);
  assert.equal(underAgeMale.isValid, false);
  assert.match(underAgeMale.error || '', /at least 21 years/);

  // 21 years old male -> should pass
  const eligibleMale = validateAgeEligibility('2005-11-01', 'male', refDate);
  assert.equal(eligibleMale.isValid, true);
  assert.equal(eligibleMale.age >= 21, true);
});

test('validateAgeEligibility enforces 18+ for females', () => {
  const refDate = new Date('2026-11-02T00:00:00Z');
  // 17 years old female -> should fail
  const underAgeFemale = validateAgeEligibility('2009-11-05', 'female', refDate);
  assert.equal(underAgeFemale.isValid, false);
  assert.match(underAgeFemale.error || '', /at least 18 years/);

  // 19 years old female -> should pass
  const eligibleFemale = validateAgeEligibility('2007-05-15', 'female', refDate);
  assert.equal(eligibleFemale.isValid, true);
  assert.equal(eligibleFemale.age, 19);
});

test('generateMemberId produces valid format', () => {
  const id = generateMemberId('SB-M');
  assert.match(id, /^SB-M\d{5}$/);
});

test('calculateExpiryDate increments by correct days', () => {
  const start = '2026-01-01T00:00:00.000Z';
  const expiry = calculateExpiryDate(start, 30);
  const expiryDate = new Date(expiry);
  const startDate = new Date(start);
  const diffDays = Math.round((expiryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  assert.equal(diffDays, 30);
});

test('isMembershipActive validates membership status and expiry date', () => {
  const refDate = new Date('2026-11-02T00:00:00Z');

  // NONE status
  assert.equal(isMembershipActive({ membershipStatus: 'NONE' }, refDate), false);

  // PENDING status
  assert.equal(isMembershipActive({ membershipStatus: 'PENDING' }, refDate), false);

  // EXPIRED status
  assert.equal(isMembershipActive({ membershipStatus: 'EXPIRED' }, refDate), false);

  // ACTIVE but past expiry
  assert.equal(
    isMembershipActive(
      { membershipStatus: 'ACTIVE', membershipExpiresAt: '2026-10-01T00:00:00Z' },
      refDate
    ),
    false
  );

  // ACTIVE with future expiry
  assert.equal(
    isMembershipActive(
      { membershipStatus: 'ACTIVE', membershipExpiresAt: '2026-12-01T00:00:00Z' },
      refDate
    ),
    true
  );
});

test('formatCurrencyINR formats Indian currency correctly', () => {
  const formatted = formatCurrencyINR(4499);
  assert.ok(formatted.includes('4,499'));
});
