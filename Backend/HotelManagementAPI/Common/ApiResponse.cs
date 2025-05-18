using System;
using System.Collections.Generic;

namespace HotelManagementAPI.Common
{
    /// <summary>
    /// Class chuẩn hóa response API
    /// </summary>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Trạng thái thành công
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Mã trạng thái HTTP
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// Thông báo
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Dữ liệu trả về
        /// </summary>
        public T? Data { get; set; }

        /// <summary>
        /// Danh sách lỗi (nếu có)
        /// </summary>
        public List<string>? Errors { get; set; }

        /// <summary>
        /// Thời gian xử lý
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.Now;

        /// <summary>
        /// Tạo response thành công
        /// </summary>
        public static ApiResponse<T> Ok(T data, string message = "Thao tác thành công")
        {
            return new ApiResponse<T>
            {
                Success = true,
                StatusCode = 200,
                Message = message,
                Data = data
            };
        }

        /// <summary>
        /// Tạo response lỗi
        /// </summary>
        public static ApiResponse<T> Error(string message, int statusCode = 400, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                StatusCode = statusCode,
                Message = message,
                Errors = errors
            };
        }

        /// <summary>
        /// Tạo response không tìm thấy
        /// </summary>
        public static ApiResponse<T> NotFound(string message = "Không tìm thấy dữ liệu")
        {
            return new ApiResponse<T>
            {
                Success = false,
                StatusCode = 404,
                Message = message
            };
        }

        /// <summary>
        /// Tạo response không có quyền
        /// </summary>
        public static ApiResponse<T> Unauthorized(string message = "Không có quyền truy cập")
        {
            return new ApiResponse<T>
            {
                Success = false,
                StatusCode = 401,
                Message = message
            };
        }
    }
} 