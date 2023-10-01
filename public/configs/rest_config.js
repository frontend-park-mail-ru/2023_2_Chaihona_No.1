const GET_METHOD = 'GET';
const POST_METHOD = 'POST';

/**
 * URL для всех REST-запросов
 * @type {string}
 */
export const backendUrl = 'https://127.0.0.1:8001/api/v1';

/**
 * Все возможные endpoint'ы и их методы
 */
export const restEndpoints = {
  getPosts: {
    url: '/profile/{id}/post',
    method: GET_METHOD,
  },
  getProfile: {
    url: '/profile/{id}',
    method: GET_METHOD,
  },
  login: {
    url: '/login',
    method: POST_METHOD,
  },
  register: {
    url: '/registration',
    method: POST_METHOD,
  },
  checkAuth: {
    url: '/is_authorized',
    method: GET_METHOD,
  },
};
