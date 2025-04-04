import axios from 'axios';
import { getToken } from '@/lib/token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url); // URL 로깅
    console.log('Request Method:', config.method); // 메서드 로깅
    console.log('Request Headers:', config.headers); // 헤더 로깅
    const token = getToken();
    console.log('현재 저장된 토큰:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('요청 헤더:', config.headers);
    } else {
      console.log('토큰이 없습니다!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response Status:', response.status); // 응답 상태 로깅
    console.log('Response Data:', response.data); // 응답 데이터 로깅
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error); // 에러 로깅
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;