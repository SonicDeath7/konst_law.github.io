export interface LegalService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  targetAudience: string;
  priceStart: string;
  deliverables: string[];
  documentsNeeded: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  clientType: string;
  claimAmount: string;
  result: string;
  summary: string;
  keySteps: string[];
}

export interface Review {
  id: string;
  clientName: string;
  clientRole: string;
  rating: number;
  text: string;
  date: string;
  caseType: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
}
