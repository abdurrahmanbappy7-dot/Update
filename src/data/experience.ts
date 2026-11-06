import type { ExperienceItem } from './types';

/**
 * Volunteer & organisational roles. Add dates in `period` and refine
 * the summaries with your own specific contributions.
 */
export const experience: ExperienceItem[] = [
  {
    role: 'Public Relations Secretary',
    organization: 'Renew Earth Rajshahi Metropolitan',
    period: '',
    location: 'Rajshahi',
    summary:
      "Served in the organisation's public relations role, helping communicate its activities and connecting with members, volunteers, and the wider community.",
    focus: ['Public Relations', 'Communication', 'Youth Engagement'],
  },
  {
    role: 'International Service Director',
    organization: 'Rotaract Club of Approach Rajshahi',
    period: '',
    location: 'Rajshahi',
    summary:
      "Held the club's international service portfolio, supporting service initiatives and collaboration as part of the club's leadership team.",
    focus: ['Leadership', 'Service Projects', 'Collaboration'],
  },
  {
    role: 'Community Volunteer',
    organization: 'Community & Organisational Activities',
    period: '',
    summary:
      'Took part in community volunteering and organisational activities alongside other young volunteers.',
    focus: ['Volunteering', 'Community Development'],
  },
  {
    role: 'Event Coordination',
    organization: 'Team Collaboration',
    period: '',
    summary:
      'Helped coordinate events and worked with teams to plan, organise, and carry out activities.',
    focus: ['Event Management', 'Teamwork'],
  },
];

export const leadership = [
  { title: 'Leadership', text: 'Holding responsibility within organisational teams and helping others move in the same direction.' },
  { title: 'Youth Engagement', text: 'Encouraging young people to get involved in their communities and in shared causes.' },
  { title: 'Public Relations', text: 'Representing organisations and communicating their work clearly to the public.' },
  { title: 'Event Management', text: 'Planning and organising activities from the first idea to the day itself.' },
  { title: 'Volunteer Coordination', text: 'Working with volunteers so that everyone knows their role and feels part of the team.' },
  { title: 'Community Development', text: 'Contributing time and effort to initiatives that serve the local community.' },
];
