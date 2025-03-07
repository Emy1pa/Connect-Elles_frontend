import axios, { AxiosInstance } from "axios";
import {
  BlogsStatistics,
  CommentStatistics,
  FavoriteStatistics,
  ServicesStatistics,
  SkillsStatistics,
} from "@/app/utils/statistics";
import { API_URL } from "@/app/utils/constants";

interface ReservationStatistics {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
}

export interface MentorStatisticsData {
  favorites: FavoriteStatistics | null;
  blogs: BlogsStatistics | null;
  skills: SkillsStatistics | null;
  services: ServicesStatistics | null;
  reservations: ReservationStatistics | null;
  comments: CommentStatistics | null;
}

const createApiClient = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchMentorStatistics = async (token: string, userId: string): Promise<MentorStatisticsData> => {
  if (!token || !userId) {
    throw new Error("Authentication token and user ID are required");
  }

  const api = createApiClient(token);

  try {
    const [favoritesResponse, blogsResponse, servicesResponse, skillsResponse, reservationsResponse, commentsResponse] =
      await Promise.all([
        api.get<FavoriteStatistics>(`/favorites/statistics/mentor/${userId}`),
        api.get<BlogsStatistics>(`/api/blogs/statistics/${userId}`),
        api.get<ServicesStatistics>(`/api/services/statistics/${userId}`),
        api.get<SkillsStatistics>(`/api/skills/statistics/${userId}`),
        api.get<ReservationStatistics>(`/reservations/statistics/mentor/${userId}`),
        api.get<CommentStatistics>(`/comments/statistics/mentor/${userId}`),
      ]);

    return {
      favorites: favoritesResponse.data,
      blogs: blogsResponse.data,
      services: servicesResponse.data,
      skills: skillsResponse.data,
      reservations: reservationsResponse.data,
      comments: commentsResponse.data,
    };
  } catch (error) {
    console.error("Error fetching mentor statistics:", error);
    throw error;
  }
};
