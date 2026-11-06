import type { SocialLink } from './types';

/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONAL INFORMATION — edit this file to personalise the site
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  fullName: 'Md. Abdur Rahman Bappy',
  displayName: 'BAPPY',
  firstName: 'Bappy',
  identities: [
    'CSE Undergraduate Student',
    'Aspiring Software Engineer',
    'Programming Enthusiast',
    'Technology Explorer',
  ],
  university: 'University of Liberal Arts Bangladesh',
  universityShort: 'ULAB',
  department: 'Computer Science and Engineering',
  location: 'Dhaka, Bangladesh',
  email: 'abdurrahmambappy7@gmail.com',
  /** Phone shown on the site; `phoneHref` is the international format used for tap-to-call. */
  phone: '01962-354451',
  phoneHref: 'tel:+8801962354451',
  availability: 'Open to Internship Opportunities',

  /**
   * Profile photo: put your picture in /public/images/ (e.g. profile.jpg)
   * and set the path below. While empty, a styled monogram is shown.
   */
  photo: '/images/profile.jpg',

  /**
   * Resume: replace /public/resume.pdf with your own PDF (keep the same
   * file name, or change the path here).
   */
  resume: '/resume.pdf',
  resumeFileName: 'Bappy-Resume.pdf',
};

/** Leave href empty ('') until the profile exists. */
export const socials: SocialLink[] = [
  { key: 'github', label: 'GitHub', href: '' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/md-abdur-rahman-bappy-b46997392' },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/19mvSQanp1/' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/bappy404.exe/' },
  { key: 'snapchat', label: 'Snapchat', href: 'https://snapchat.com/t/rFg6xQZK' },
  { key: 'email', label: 'Email', href: `mailto:${profile.email}` },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'travel', label: 'Travel Map' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;
