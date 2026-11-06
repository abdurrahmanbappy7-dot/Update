import type { AchievementCategory } from './types';

/**
 * Add real certificates, workshops, competitions, and recognitions here.
 * Example item: { title: 'Intro to Python', issuer: 'Coursera', date: '2025', link: 'https://…' }
 */
export const achievements: AchievementCategory[] = [
  { id: 'certificates', title: 'Certificates', description: 'Courses and certifications', items: [] },
  { id: 'workshops', title: 'Workshops', description: 'Workshops and bootcamps attended', items: [] },
  { id: 'competitions', title: 'Competitions', description: 'Hackathons and programming contests', items: [] },
  { id: 'academic', title: 'Academic', description: 'Academic achievements', items: [] },
  { id: 'volunteer', title: 'Volunteer Recognition', description: 'Recognition for service', items: [] },
];
