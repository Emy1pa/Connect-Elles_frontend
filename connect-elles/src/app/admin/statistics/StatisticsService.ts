import {
  BlogsStatistics,
  CategoriesStatistics,
  CommentStatistics,
  FavoriteStatistics,
  ReservationStatistics,
  ServicesStatistics,
  SkillsStatistics,
  StatisticsData,
  UserStatistics,
} from "@/app/utils/statistics";
import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/app/utils/constants";

const createApiClient = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchStatistics = async (token: string): Promise<StatisticsData> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  const api = createApiClient(token);
  try {
    const [
      favoritesResponse,
      blogsResponse,
      servicesResponse,
      skillsResponse,
      reservationsResponse,
      commentsResponse,
      categoriesResponse,
      usersResponse,
    ] = await Promise.all([
      api.get<FavoriteStatistics>("/favorites/admin/statistics"),
      api.get<BlogsStatistics>("/api/blogs/admin/statistics/"),
      api.get<ServicesStatistics>("/api/services/admin/statistics/"),
      api.get<SkillsStatistics>("/api/skills/admin/statistics/"),
      api.get<ReservationStatistics>("/reservations/admin/statistics/"),
      api.get<CommentStatistics>("/comments/admin/statistics"),
      api.get<CategoriesStatistics>("/api/categories/admin/statistics"),
      api.get<UserStatistics>("/api/users/admin/statistics/"),
    ]);

    return {
      favorites: favoritesResponse.data,
      blogs: blogsResponse.data,
      services: servicesResponse.data,
      skills: skillsResponse.data,
      reservations: reservationsResponse.data,
      comments: commentsResponse.data,
      categories: categoriesResponse.data,
      users: usersResponse.data,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};
