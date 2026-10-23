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
