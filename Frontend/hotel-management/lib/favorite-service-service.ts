import { api, del, get, post } from './api';

export interface FavoriteServicePayload {
  customerId: number;
  serviceId: number;
}

// Lấy danh sách dịch vụ yêu thích của khách hàng
export const getFavoriteServices = (customerId: number) => {
  return get(`FavoriteServices/customer/${customerId}`);
};

// Thêm dịch vụ vào danh sách yêu thích
export const addFavoriteService = (payload: FavoriteServicePayload) => {
  return post('FavoriteServices', payload);
};

// Xóa dịch vụ khỏi danh sách yêu thích
export const removeFavoriteService = (favoriteServiceId: number) => {
  return del(`FavoriteServices/${favoriteServiceId}`);
}; 