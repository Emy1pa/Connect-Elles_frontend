import { CommentStatistics, FavoriteStatistics, ReservationStatistic } from "@/app/utils/statistics";
import { AxiosInstance } from "axios";
import axios from "axios";
import { API_URL } from "@/app/utils/constants";
export interface UserStatisticsData {
  favorites: FavoriteStatistics | null;
  comments: CommentStatistics | null;
  reservations: ReservationStatistic | null;
}
const createApiClient = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fetchUserStatistics = async (token: string, userId: string) => {
  if (!userId || !token) {
    throw new Error("Authentication token and user ID are required");
  }
  const api = createApiClient(token);

  try {
    const [favoritesResponse, commentsResponse, reservationsResponse] = await Promise.all([
      api.get<FavoriteStatistics>(`${API_URL}/favorites/statistics/${userId}`),
      api.get<CommentStatistics>(`${API_URL}/comments/statistics/${userId}`),
      api.get<ReservationStatistic>(`${API_URL}/reservations/statistics/${userId}`),
    ]);
    return {
      favorites: favoritesResponse.data,
      comments: commentsResponse.data,
      reservations: reservationsResponse.data,
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw Error("Failed to load statistics");
  }
};
