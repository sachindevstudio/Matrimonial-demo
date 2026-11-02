export type Gender = 'male' | 'female';

export type MembershipStatus = 'NONE' | 'PENDING' | 'ACTIVE' | 'EXPIRED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Member {
  id: string;
  memberId: string; // e.g., 'SB-M10492'
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  gender: Gender;
  community: string;
  city: string;
  password?: string;
  membershipStatus: MembershipStatus;
  selectedPlanId?: string;
  selectedPlanName?: string;
  membershipActivatedAt?: string;
  membershipExpiresAt?: string;
  registeredAt: string;
  lastPaymentSubmittedAt?: string;
  lastTransactionId?: string;
  paymentProofUrl?: string;
  rejectionReason?: string;
}

export interface MatrimonialProfile {
  id: string;
  profileId: string; // e.g. 'SB-F204'
  fullName: string;
  gender: Gender;
  age: number;
  dob: string;
  height: string;
  community: string;
  subcaste: string;
  motherTongue: string;
  religion: string;
  education: string;
  occupation: string;
  company: string;
  annualIncome: string;
  city: string;
  state: string;
  diet: string;
  maritalStatus: string;
  about: string;
  photoUrl: string;
  galleryUrls: string[];
  isFeatured: boolean;
  isVisible: boolean;
  familyDetails: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: string;
    familyValues: string;
    familyType: string;
  };
  horoscope: {
    rashi: string;
    nakshatra: string;
    manglik: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
    guardianContact: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  durationLabel: string;
  badge?: string;
  description: string;
  benefits: string[];
  isRecommended: boolean;
  isEnabled: boolean;
  displayOrder: number;
}

export interface PaymentRequest {
  id: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberMobile: string;
  planId: string;
  planName: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  submittedAt: string;
  status: PaymentStatus;
  rejectionReason?: string;
  reviewedAt?: string;
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  weddingDate: string;
  location: string;
  photoUrl: string;
  quote: string;
  story: string;
  isPublished: boolean;
}

export interface CommunityOption {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export interface WebsiteContent {
  branding: {
    siteName: string;
    tagline: string;
    logoUrl?: string;
    primaryColor: string;
  };
  hero: {
    heading: string;
    subheading: string;
    badgeText: string;
    ctaRegisterText: string;
    ctaPlansText: string;
    bannerImageUrl: string;
  };
  about: {
    heading: string;
    description: string;
    imageUrl: string;
    points: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    whatsapp: string;
  };
  paymentQR: {
    qrImageUrl: string;
    upiId: string;
    merchantName: string;
    instructions: string[];
  };
  sectionVisibility: {
    howItWorks: boolean;
    featuredProfiles: boolean;
    whyChooseUs: boolean;
    successStories: boolean;
    membershipPlans: boolean;
  };
}
