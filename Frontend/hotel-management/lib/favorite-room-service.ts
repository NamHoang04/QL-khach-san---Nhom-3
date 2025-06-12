import { api, del, get, post } from './api';

export interface FavoriteRoomPayload {
  customerId: number;
  roomId: number;
}

// Lấy danh sách phòng yêu thích của khách hàng
export const getFavoriteRooms = () => {
  return get('FavoriteRooms');
};

// Thêm phòng vào danh sách yêu thích
export const addFavoriteRoom = (payload: FavoriteRoomPayload) => {
  return post('FavoriteRooms', payload);
};

// Xóa phòng khỏi danh sách yêu thích
export const removeFavoriteRoom = (roomId: number) => {
  return del(`FavoriteRooms/${roomId}`);
}; 