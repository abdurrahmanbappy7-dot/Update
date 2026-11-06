/**
 * "My Favourite Sports" section content — edit anything here.
 *
 * Images live in /public/images/sports/. To replace one, drop the new file in
 * that folder and update `src` (plus `width` / `height` so the browser reserves
 * the right space). Images are always shown whole, at their original aspect
 * ratio — they are never cropped or stretched.
 */

export type CountryCode = 'BD' | 'PT' | 'ES' | 'GB';

export interface SportImage {
  src: string;
  alt: string;
  /** Original pixel size of the file — used only to keep the aspect ratio. */
  width: number;
  height: number;
}

export interface FavouriteTeam {
  /** Small label above the name, e.g. "Favourite Club" */
  role: string;
  name: string;
  country: CountryCode;
  logo: SportImage;
  description: string;
}

export interface FavouritePlayer {
  role: string;
  name: string;
  country: CountryCode;
  photo: SportImage;
  description: string;
  /** Optional short facts shown as chips, e.g. ["Forward", "#7"] */
  tags?: string[];
}

export const sportsIntro =
  'Away from the screen, these are the teams and athletes I follow — the ones whose discipline, passion and big moments keep me inspired.';

/* ───────── Football ───────── */

interface SportBase {
  title: string;
  emoji: string;
  tagline: string;
}

export const football: SportBase & { player: FavouritePlayer; club: FavouriteTeam; nationalTeams: FavouriteTeam[] } = {
  title: 'Football',
  emoji: '⚽',
  tagline: 'The beautiful game',
  player: {
    role: 'Favourite Player',
    name: 'Cristiano Ronaldo',
    country: 'PT',
    photo: {
      src: '/images/sports/cristiano-ronaldo.jpeg',
      alt: 'Cristiano Ronaldo in a Portugal training top',
      width: 1440,
      height: 1439,
    },
    description:
      'Hard work, self-belief and an obsession with getting better every single day — CR7 shows what relentless discipline can achieve.',
    tags: ['Forward', '#7', 'Portugal'],
  },
  club: {
    role: 'Favourite Club',
    name: 'Real Madrid CF',
    country: 'ES',
    logo: { src: '/images/sports/real-madrid.jpeg', alt: 'Real Madrid CF crest', width: 720, height: 720 },
    description:
      'Hala Madrid! A club built on history, ambition and unforgettable European nights — the standard for winning mentality.',
  },
  nationalTeams: [
    {
      role: 'National Team',
      name: 'Bangladesh',
      country: 'BD',
      logo: {
        src: '/images/sports/bangladesh-football.jpeg',
        alt: 'Bangladesh Football Federation crest',
        width: 1600,
        height: 1600,
      },
      description: 'My home team. Always supporting the Bengal Tigers on their journey — win or lose.',
    },
    {
      role: 'National Team',
      name: 'Portugal',
      country: 'PT',
      logo: {
        src: '/images/sports/portugal-football.jpeg',
        alt: 'Portuguese Football Federation crest',
        width: 2048,
        height: 2048,
      },
      description: 'A Seleção — skill, flair and the team where Ronaldo became a legend.',
    },
  ],
};

/* ───────── Cricket ───────── */

export const cricket: SportBase & { player: FavouritePlayer; team: FavouriteTeam } = {
  title: 'Cricket',
  emoji: '🏏',
  tagline: 'A nation’s heartbeat',
  player: {
    role: 'Favourite Player',
    name: 'Shakib Al Hasan',
    country: 'BD',
    photo: {
      src: '/images/sports/shakib-al-hasan.jpeg',
      alt: 'Shakib Al Hasan in the Bangladesh cricket jersey',
      width: 960,
      height: 960,
    },
    description:
      'One of the greatest all-rounders the game has seen — a match-winner with both bat and ball, and a source of pride for Bangladesh.',
    tags: ['All-rounder', '#75', 'Bangladesh'],
  },
  team: {
    role: 'Favourite National Team',
    name: 'Bangladesh',
    country: 'BD',
    logo: {
      src: '/images/sports/bangladesh-cricket.jpeg',
      alt: 'Bangladesh Cricket Board crest',
      width: 721,
      height: 721,
    },
    description:
      'The Tigers. Every match brings the whole country together — the roar of the crowd is something special.',
  },
};

/* ───────── Formula 1 ───────── */

export const formula1: SportBase & { driver: FavouritePlayer; number: string; constructorTeam: string } = {
  title: 'Formula 1',
  emoji: '🏎️',
  tagline: 'Speed, precision, strategy',
  driver: {
    role: 'Favourite Driver',
    name: 'Lewis Hamilton',
    country: 'GB',
    photo: {
      src: '/images/sports/lewis-hamilton.jpeg',
      alt: 'Lewis Hamilton celebrating with a trophy on the podium',
      width: 1170,
      height: 748,
    },
    description:
      'A seven-time World Champion who pairs incredible racecraft with a voice for change both on and off the track.',
    tags: ['Driver', '#44', 'Great Britain'],
  },
  /** Racing number shown in the background of the F1 card. */
  number: '44',
  /**
   * Favourite constructor / team — left empty on purpose.
   * Add a name here (e.g. 'Team name') and it will appear on the card.
   */
  constructorTeam: '',
};
