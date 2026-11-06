export type SocialKey = 'github' | 'linkedin' | 'facebook' | 'instagram' | 'snapchat' | 'email';

export interface SocialLink {
  key: SocialKey;
  label: string;
  /** Leave as an empty string until you have a real URL — the UI shows it as "coming soon". */
  href: string;
}

export interface Skill {
  name: string;
  /** Short monogram shown inside the icon tile, e.g. "C++" */
  glyph: string;
  note?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  /** Text shown when this group has no skills yet */
  emptyHint: string;
}

export interface Project {
  /** Set to true to render the entry as a placeholder card */
  placeholder?: boolean;
  title: string;
  description: string;
  tech: string[];
  /** Path inside /public (e.g. "/images/projects/my-app.webp"). Leave empty for a generated cover. */
  thumbnail?: string;
  github?: string;
  live?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  /** e.g. "2023 — 2024". Leave empty to show an "add dates" hint. */
  period: string;
  location?: string;
  summary: string;
  focus: string[];
}

export interface GalleryItem {
  /** Path inside /public, e.g. "/images/gallery/sunset.webp". Empty = placeholder frame. */
  src: string;
  alt: string;
  caption: string;
  /** Layout hint for the masonry grid */
  shape: 'tall' | 'wide' | 'square';
}

export interface AchievementCategory {
  id: string;
  title: string;
  description: string;
  items: { title: string; issuer: string; date: string; link?: string }[];
}
