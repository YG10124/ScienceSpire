export type AppPage =
  | 'home'
  | 'about'
  | 'auth'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'schedule'
  | 'resources'
  | 'lessons'
  | 'community'
  | 'portfolio'
  | 'creator'
  | 'onboarding'
  | 'profile';

export interface BreadcrumbItem {
  label: string;
  page?: AppPage;
}

interface PageMeta {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export const SITE_NAME = 'ScienceSpire';

export const PAGE_META: Record<AppPage, PageMeta> = {
  home: {
    title: 'ScienceSpire | Student Science Hub',
    description: 'Live science sessions, resources, community, and portfolio tools for students.',
    breadcrumbs: [{ label: 'Home' }],
  },
  about: {
    title: 'About | ScienceSpire',
    description: 'Learn the mission and approach behind the ScienceSpire student science hub.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'About' }],
  },
  auth: {
    title: 'Sign In | ScienceSpire',
    description: 'Sign in to ScienceSpire to access your dashboard, schedule, resources, and community.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Sign In' }],
  },
  signin: {
    title: 'Sign In | ScienceSpire',
    description: 'Sign in to ScienceSpire to access your dashboard, schedule, resources, and community.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Sign In' }],
  },
  signup: {
    title: 'Sign Up | ScienceSpire',
    description: 'Create a ScienceSpire account and start learning across Physics, Chemistry, Biology, and Earth Science.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Sign Up' }],
  },
  dashboard: {
    title: 'Dashboard | ScienceSpire',
    description: 'Track your daily science tasks, progress, streaks, and recommendations.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Dashboard' }],
  },
  schedule: {
    title: 'Schedule | ScienceSpire',
    description: 'Join live science sessions by day and manage your weekly learning schedule.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Schedule' }],
  },
  resources: {
    title: 'Resources | ScienceSpire',
    description: 'Browse science lessons, quizzes, videos, and downloads with filtering by track and level.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Resources' }],
  },
  lessons: {
    title: 'Lessons | ScienceSpire',
    description: 'Work through structured science courses with guided lessons and quizzes in Physics, Chemistry, Biology, and Earth Science.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Lessons' }],
  },
  community: {
    title: 'Community | ScienceSpire',
    description: 'Participate in science channels, ask questions, and collaborate with peers.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Community' }],
  },
  portfolio: {
    title: 'Portfolio | ScienceSpire',
    description: 'Organize science projects, lab reports, and reflections in your student portfolio.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Portfolio' }],
  },
  creator: {
    title: 'Creator Studio | ScienceSpire',
    description: 'Build and publish science quizzes, notes, and learning templates.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Creator Studio' }],
  },
  onboarding: {
    title: 'Get Started | ScienceSpire',
    description: 'Complete onboarding to personalize your science learning workspace.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Get Started' }],
  },
  profile: {
    title: 'Profile & Settings | ScienceSpire',
    description: 'Manage your profile, preferences, and study settings.',
    breadcrumbs: [{ label: 'Home', page: 'home' }, { label: 'Profile' }],
  },
};
