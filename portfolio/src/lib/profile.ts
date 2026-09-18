import profileData from "@data/profile.json";

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Experience = {
  company: string;
  title: string;
  start: string;
  end: string | null;
  current: boolean;
  summary: string;
  highlights: string[];
};

export type Education = {
  institution: string;
  location?: string;
  degree?: string;
  start: string;
  end: string | null;
  current?: boolean;
};

export type Project = {
  name: string;
  description: string;
  tech: string[];
  repo: string;
  featured: boolean;
};

export type Profile = {
  name: string;
  username: string;
  role: string;
  headline: string;
  tagline: string;
  location: string;
  company: string;
  email: string;
  avatar: string;
  hireable: boolean;
  github: { username: string; url: string };
  linkedin: { url: string };
  about: string[];
  focus: string[];
  currentlyLearning: string[];
  mindset: string;
  philosophy: string;
  quote: string;
  stats: {
    publicRepos: number;
    followers: number;
    following: number;
    contributionsLastYear: number;
    achievements: string[];
  };
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  /** Absolute base URL of the deployed site (used for SEO metadata). */
  siteUrl: string;
};

export const profile: Profile = {
  ...profileData,
  siteUrl: "https://monarchsharma20502.github.io",
};
