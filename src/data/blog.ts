export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  updated: string;
  readingMinutes: number;
  sourceTitle: string;
  sourceAuthor: string;
  sourceUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'esp32-project-ideas',
    title: '8 ESP32 Project Ideas With Parts Lists and Build Plans',
    description: 'Eight ESP32 project ideas for beginners through advanced makers, with real component BOMs, proposed build steps and practical engineering checks.',
    category: 'ESP32 projects',
    published: '2026-10-28',
    updated: '2026-10-28',
    readingMinutes: 8,
    sourceTitle: 'MAKHEX project catalog',
    sourceAuthor: 'MAKHEX Editorial',
    sourceUrl: 'https://makhex.com/projects/',
  },
  {
    slug: 'robotics-engineer-six-month-roadmap',
    title: 'Learn Robotics in 6 Months: A Hands-On Maker Roadmap',
    description: 'A realistic six-month robotics learning plan, from circuits and ESP32 builds to CAD, ROS 2, control systems and robot learning—with projects, resources and measured milestones.',
    category: 'Learning paths',
    published: '2026-10-23',
    updated: '2026-10-23',
    readingMinutes: 11,
    sourceTitle: 'How to become a Robotics Engineer in 6 months (RESOURCES)',
    sourceAuthor: 'Ronin (@DeRonin_)',
    sourceUrl: 'https://x.com/DeRonin_/status/2095180126359105955',
  },
];
