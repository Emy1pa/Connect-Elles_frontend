export interface FavoriteStatistics {
  count: number;
}

export interface CommentStatistics {
  count: number;
}

export interface CategoriesStatistics {
  count: number;
}

export interface BlogsStatistics {
  count: number;
}

export interface SkillsStatistics {
  count: number;
}

export interface ServicesStatistics {
  count: number;
}

export interface ReservationStatistics {
  count: number;
}

export interface UserStatistics {
  total: number;
  admin: number;
  user: number;
  mentor: number;
}

export interface StatisticsData {
  favorites: FavoriteStatistics;
  blogs: BlogsStatistics;
  services: ServicesStatistics;
  skills: SkillsStatistics;
  reservations: ReservationStatistics;
  comments: CommentStatistics;
  categories: CategoriesStatistics;
  users: UserStatistics;
}

export interface Statistics {
  favorites: FavoriteStatistics | null;
  blogs: BlogsStatistics | null;
  skills: SkillsStatistics | null;
  services: ServicesStatistics | null;
  reservations: ReservationStatistics | null;
  comments: CommentStatistics | null;
  categories: CategoriesStatistics | null;
  users: UserStatistics | null;
}

export interface ReservationStatistic {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
}
