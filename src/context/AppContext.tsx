import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MatrimonialProfile,
  Member,
  MembershipPlan,
  PaymentRequest,
  SuccessStory,
  WebsiteContent,
  CommunityOption,
  Gender,
} from '../types';
import {
  INITIAL_COMMUNITIES,
  INITIAL_MEMBERS,
  INITIAL_PAYMENT_REQUESTS,
  INITIAL_PLANS,
  INITIAL_PROFILES,
  INITIAL_SUCCESS_STORIES,
  INITIAL_WEBSITE_CONTENT,
} from '../data/initialData';
import {
  calculateExpiryDate,
  generateMemberId,
  isMembershipActive,
  validateAgeEligibility,
} from '../utils/rules';

export type CurrentUser =
  | { type: 'admin'; email: string; name: string }
  | { type: 'member'; member: Member }
  | null;

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  websiteContent: WebsiteContent;
  updateWebsiteContent: (content: Partial<WebsiteContent>) => void;
  profiles: MatrimonialProfile[];
  addProfile: (profile: Omit<MatrimonialProfile, 'id' | 'profileId'>) => void;
  updateProfile: (id: string, profile: Partial<MatrimonialProfile>) => void;
  deleteProfile: (id: string) => void;
  plans: MembershipPlan[];
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;
  communities: CommunityOption[];
  successStories: SuccessStory[];
  addSuccessStory: (story: Omit<SuccessStory, 'id'>) => void;
  updateSuccessStory: (id: string, story: Partial<SuccessStory>) => void;
  deleteSuccessStory: (id: string) => void;
  members: Member[];
  updateMember: (id: string, updates: Partial<Member>) => void;
  paymentRequests: PaymentRequest[];
  currentUser: CurrentUser;
  registerMember: (data: {
    fullName: string;
    mobile: string;
    email: string;
    dob: string;
    gender: Gender;
    community: string;
    city: string;
    password?: string;
  }) => { success: boolean; error?: string; member?: Member };
  loginMember: (email: string, password?: string) => boolean;
  loginAdmin: (email: string, password?: string) => boolean;
  logout: () => void;
  submitPaymentRequest: (data: {
    memberId: string;
    planId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => boolean;
  approvePayment: (requestId: string) => void;
  rejectPayment: (requestId: string, reason: string) => void;
  simulateExpiry: (memberId: string) => void;
  simulateActivate: (memberId: string, planId?: string) => void;
  resetDemoData: () => void;
  quickSwitchUser: (persona: 'admin' | 'pooja_active' | 'rahul_pending' | 'amit_expired' | 'priya_none' | 'visitor') => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isUnlockedForCurrentMember: () => boolean;
}

const STORAGE_KEY = 'shubhbandhan_matrimony_state_v2';
const LEGACY_STORAGE_KEY = 'shubhbandhan_matrimony_state_v1';

// Helper to auto-migrate legacy dev paths (/src/assets/images/...) to production /images/...
const migrateLegacyPaths = (raw: string | null): any => {
  if (!raw) return null;
  const cleaned = raw
    .replaceAll('/src/assets/images/hero_matrimonial_wedding_1793631902405.jpg', '/images/hero_wedding.jpg')
    .replaceAll('/src/assets/images/about_heritage_ceremony_1793631903833.jpg', '/images/about_ceremony.jpg')
    .replaceAll('/src/assets/images/sample_upi_qr_1793631903888.jpg', '/images/sample_qr.jpg')
    .replaceAll('/src/assets/images/success_story_couple_1_1793631902422.jpg', '/images/couple_1.jpg')
    .replaceAll('/src/assets/images/success_story_couple_2_1793631903134.jpg', '/images/couple_2.jpg')
    .replaceAll('/src/assets/images/', '/images/');
  return JSON.parse(cleaned);
};

const getStoredItem = (subKey: string): any => {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY + subKey);
    if (v2) return migrateLegacyPaths(v2);
    const v1 = localStorage.getItem(LEGACY_STORAGE_KEY + subKey);
    if (v1) return migrateLegacyPaths(v1);
    return null;
  } catch {
    return null;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state or use initial seed
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(() => {
    const stored = getStoredItem('_content');
    return stored ? stored : INITIAL_WEBSITE_CONTENT;
  });

  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(() => {
    const stored = getStoredItem('_profiles');
    return stored ? stored : INITIAL_PROFILES;
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const stored = getStoredItem('_plans');
    return stored ? stored : INITIAL_PLANS;
  });

  const [communities] = useState<CommunityOption[]>(INITIAL_COMMUNITIES);

  const [successStories, setSuccessStories] = useState<SuccessStory[]>(() => {
    const stored = getStoredItem('_stories');
    return stored ? stored : INITIAL_SUCCESS_STORIES;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const stored = getStoredItem('_members');
    return stored ? stored : INITIAL_MEMBERS;
  });

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    const stored = getStoredItem('_payments');
    return stored ? stored : INITIAL_PAYMENT_REQUESTS;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const stored = getStoredItem('_user');
    return stored ? stored : null;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_content', JSON.stringify(websiteContent));
  }, [websiteContent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_stories', JSON.stringify(successStories));
  }, [successStories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_payments', JSON.stringify(paymentRequests));
  }, [paymentRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Keep currentUser synced if their member record in members array changes
  useEffect(() => {
    if (currentUser?.type === 'member') {
      const latest = members.find((m) => m.id === currentUser.member.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(currentUser.member)) {
        setCurrentUser({ type: 'member', member: latest });
      }
    }
  }, [members, currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateWebsiteContent = (content: Partial<WebsiteContent>) => {
    setWebsiteContent((prev) => ({
      ...prev,
      ...content,
      branding: { ...prev.branding, ...content.branding },
      hero: { ...prev.hero, ...content.hero },
      about: { ...prev.about, ...content.about },
      contact: { ...prev.contact, ...content.contact },
      paymentQR: { ...prev.paymentQR, ...content.paymentQR },
      sectionVisibility: { ...prev.sectionVisibility, ...content.sectionVisibility },
    }));
    showToast('Website content updated successfully');
  };

  const addProfile = (profileData: Omit<MatrimonialProfile, 'id' | 'profileId'>) => {
    const newProfile: MatrimonialProfile = {
      ...profileData,
      id: `prof_${Date.now()}`,
      profileId: `SB-${profileData.gender === 'female' ? 'F' : 'M'}${Math.floor(100 + Math.random() * 900)}`,
    };
    setProfiles((prev) => [newProfile, ...prev]);
    showToast(`Profile ${newProfile.profileId} added successfully`);
  };

  const updateProfile = (id: string, updates: Partial<MatrimonialProfile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Matrimonial profile updated');
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    showToast('Profile deleted');
  };

  const addPlan = (planData: Omit<MembershipPlan, 'id'>) => {
    const newPlan: MembershipPlan = {
      ...planData,
      id: `plan_${Date.now()}`,
    };
    setPlans((prev) => [...prev, newPlan]);
    showToast(`Plan ${newPlan.name} created`);
  };

  const updatePlan = (id: string, updates: Partial<MembershipPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Membership plan saved');
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('Plan removed');
  };

  const addSuccessStory = (storyData: Omit<SuccessStory, 'id'>) => {
    const newStory: SuccessStory = {
      ...storyData,
      id: `story_${Date.now()}`,
    };
    setSuccessStories((prev) => [newStory, ...prev]);
    showToast('Success story published');
  };

  const updateSuccessStory = (id: string, updates: Partial<SuccessStory>) => {
    setSuccessStories((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Success story updated');
  };

  const deleteSuccessStory = (id: string) => {
    setSuccessStories((prev) => prev.filter((s) => s.id !== id));
    showToast('Story removed');
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Member records updated');
  };

  const registerMember = (data: {
    fullName: string;
    mobile: string;
    email: string;
    dob: string;
    gender: Gender;
    community: string;
    city: string;
    password?: string;
  }) => {
    // 1. Validation
    const ageCheck = validateAgeEligibility(data.dob, data.gender);
    if (!ageCheck.isValid) {
      return { success: false, error: ageCheck.error };
    }

    // Check if email already registered
    const existing = members.find((m) => m.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'A member with this email address already exists. Please login instead.' };
    }

    const memberId = generateMemberId('SB-M');
    const newMember: Member = {
      id: `mem_${Date.now()}`,
      memberId,
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      email: data.email.trim().toLowerCase(),
      dob: data.dob,
      gender: data.gender,
      community: data.community,
      city: data.city.trim(),
      password: data.password || 'Password123',
      membershipStatus: 'NONE',
      registeredAt: new Date().toISOString(),
    };

    setMembers((prev) => [newMember, ...prev]);
    setCurrentUser({ type: 'member', member: newMember });
    showToast(`Registration successful! Your Member ID is ${memberId}`);
    return { success: true, member: newMember };
  };

  const loginMember = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = members.find((m) => m.email.toLowerCase() === cleanEmail);
    if (found) {
      if (password && found.password && found.password !== password) {
        showToast('Invalid member password', 'error');
        return false;
      }
      setCurrentUser({ type: 'member', member: found });
      showToast(`Welcome back, ${found.fullName}!`);
      return true;
    }
    showToast('Member not found with this email. Please register.', 'error');
    return false;
  };

  const loginAdmin = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    // Demo admin credentials check
    if ((cleanEmail === 'admin@vivahsetu.demo' || cleanEmail === 'admin@shubhbandhan.in' || cleanEmail === 'admin@demo.com') &&
        (!password || password === 'Admin123')) {
      setCurrentUser({ type: 'admin', email: cleanEmail, name: 'Chief Matchmaker (Admin)' });
      showToast('Admin logged in successfully');
      return true;
    }
    showToast('Invalid Admin credentials. Use admin@vivahsetu.demo / Admin123', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const submitPaymentRequest = (data: {
    memberId: string;
    planId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => {
    const member = members.find((m) => m.id === data.memberId);
    const plan = plans.find((p) => p.id === data.planId);
    if (!member || !plan) {
      showToast('Member or plan not found', 'error');
      return false;
    }

    const newRequest: PaymentRequest = {
      id: `pay_req_${Date.now()}`,
      memberId: member.id,
      memberCode: member.memberId,
      memberName: member.fullName,
      memberEmail: member.email,
      memberMobile: member.mobile,
      planId: plan.id,
      planName: `${plan.name} (${plan.durationDays} Days)`,
      amount: plan.price,
      transactionId: data.transactionId.trim(),
      screenshotUrl: data.screenshotUrl,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    setPaymentRequests((prev) => [newRequest, ...prev]);

    // Update member status
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              membershipStatus: 'PENDING',
              selectedPlanId: plan.id,
              selectedPlanName: `${plan.name} (₹${plan.price})`,
              lastPaymentSubmittedAt: newRequest.submittedAt,
              lastTransactionId: data.transactionId.trim(),
              paymentProofUrl: data.screenshotUrl,
              rejectionReason: undefined,
            }
          : m
      )
    );

    showToast('Payment request submitted! Awaiting rapid admin approval.');
    return true;
  };

  const approvePayment = (requestId: string) => {
    const req = paymentRequests.find((r) => r.id === requestId);
    if (!req) return;

    const plan = plans.find((p) => p.id === req.planId) || plans[0];
    const activatedAt = new Date().toISOString();
    const expiresAt = calculateExpiryDate(activatedAt, plan.durationDays);

    // Update payment request
    setPaymentRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              reviewedAt: activatedAt,
            }
          : r
      )
    );

    // Update member
    setMembers((prev) =>
      prev.map((m) =>
        m.id === req.memberId
          ? {
              ...m,
              membershipStatus: 'ACTIVE',
              selectedPlanId: plan.id,
              selectedPlanName: `${plan.name} (₹${plan.price})`,
              membershipActivatedAt: activatedAt,
              membershipExpiresAt: expiresAt,
              rejectionReason: undefined,
            }
          : m
      )
    );

    showToast(`Payment of ₹${req.amount} approved! Membership is now Active with unlocked profiles.`);
  };

  const rejectPayment = (requestId: string, reason: string) => {
    const req = paymentRequests.find((r) => r.id === requestId);
    if (!req) return;

    setPaymentRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              rejectionReason: reason || 'Invalid UTR reference number or unclear screenshot',
              reviewedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setMembers((prev) =>
      prev.map((m) =>
        m.id === req.memberId
          ? {
              ...m,
              membershipStatus: 'NONE',
              rejectionReason: reason || 'Transaction could not be verified by admin.',
            }
          : m
      )
    );

    showToast('Payment request rejected. Rejection reason recorded.');
  };

  const simulateExpiry = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              membershipStatus: 'EXPIRED',
              membershipExpiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            }
          : m
      )
    );
    showToast('Member membership simulated as EXPIRED.');
  };

  const simulateActivate = (memberId: string, planId?: string) => {
    const selectedPlan = plans.find((p) => p.id === planId) || plans[1] || plans[0];
    const activatedAt = new Date().toISOString();
    const expiresAt = calculateExpiryDate(activatedAt, selectedPlan.durationDays);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              membershipStatus: 'ACTIVE',
              selectedPlanId: selectedPlan.id,
              selectedPlanName: `${selectedPlan.name} (₹${selectedPlan.price})`,
              membershipActivatedAt: activatedAt,
              membershipExpiresAt: expiresAt,
              rejectionReason: undefined,
            }
          : m
      )
    );
    showToast(`Member instantly activated with ${selectedPlan.name} plan!`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY + '_content');
    localStorage.removeItem(STORAGE_KEY + '_profiles');
    localStorage.removeItem(STORAGE_KEY + '_plans');
    localStorage.removeItem(STORAGE_KEY + '_stories');
    localStorage.removeItem(STORAGE_KEY + '_members');
    localStorage.removeItem(STORAGE_KEY + '_payments');
    localStorage.removeItem(STORAGE_KEY + '_user');

    setWebsiteContent(INITIAL_WEBSITE_CONTENT);
    setProfiles(INITIAL_PROFILES);
    setPlans(INITIAL_PLANS);
    setSuccessStories(INITIAL_SUCCESS_STORIES);
    setMembers(INITIAL_MEMBERS);
    setPaymentRequests(INITIAL_PAYMENT_REQUESTS);
    setCurrentUser(null);

    showToast('Demo data restored to original state!');
  };

  const quickSwitchUser = (persona: 'admin' | 'pooja_active' | 'rahul_pending' | 'amit_expired' | 'priya_none' | 'visitor') => {
    if (persona === 'admin') {
      setCurrentUser({ type: 'admin', email: 'admin@vivahsetu.demo', name: 'Chief Matchmaker (Admin)' });
      showToast('Switched persona to Admin');
    } else if (persona === 'visitor') {
      setCurrentUser(null);
      showToast('Switched to Public Visitor');
    } else {
      const emailMap = {
        pooja_active: 'pooja@demo.com',
        rahul_pending: 'rahul@demo.com',
        amit_expired: 'amit@demo.com',
        priya_none: 'priya@demo.com',
      };
      const email = emailMap[persona];
      const member = members.find((m) => m.email.toLowerCase() === email);
      if (member) {
        setCurrentUser({ type: 'member', member });
        showToast(`Switched persona to ${member.fullName} (${member.membershipStatus})`);
      }
    }
  };

  const isUnlockedForCurrentMember = (): boolean => {
    if (!currentUser) return false;
    if (currentUser.type === 'admin') return true;
    return isMembershipActive(currentUser.member);
  };

  return (
    <AppContext.Provider
      value={{
        websiteContent,
        updateWebsiteContent,
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        communities,
        successStories,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        members,
        updateMember,
        paymentRequests,
        currentUser,
        registerMember,
        loginMember,
        loginAdmin,
        logout,
        submitPaymentRequest,
        approvePayment,
        rejectPayment,
        simulateExpiry,
        simulateActivate,
        resetDemoData,
        quickSwitchUser,
        toasts,
        showToast,
        removeToast,
        isUnlockedForCurrentMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
