import type { SkillGroup } from './types';

/**
 * Only list skills you can confidently talk about in an interview.
 * To add one, push an object into the right group's `skills` array:
 *   { name: 'Git', glyph: 'Git', note: 'Version control' }
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    description: 'Languages I use for coursework, practice, and personal exploration.',
    skills: [
      { name: 'C', glyph: 'C', note: 'Procedural programming & fundamentals' },
      { name: 'C++', glyph: 'C++', note: 'Object-oriented programming & problem solving' },
      { name: 'Python', glyph: 'Py', note: 'Scripting & general-purpose programming' },
    ],
    emptyHint: 'Add a language',
  },
  {
    id: 'tools',
    title: 'Development Tools',
    description: 'Editors, version control, and tooling.',
    skills: [],
    emptyHint: 'e.g. Git, VS Code — add when ready',
  },
  {
    id: 'technologies',
    title: 'Technologies',
    description: 'Frameworks, platforms, and libraries.',
    skills: [],
    emptyHint: 'Add frameworks or platforms you have used',
  },
  {
    id: 'learning',
    title: 'Currently Learning',
    description: 'What I am exploring right now.',
    skills: [],
    emptyHint: 'Add topics you are studying',
  },
];
