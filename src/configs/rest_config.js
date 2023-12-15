const GET_METHOD = 'GET';
const POST_METHOD = 'POST';
const DELETE_METHOD = 'DELETE';

/**
 * URL для всех REST-запросов
 * @type {string}
 */

export const url = '212.233.89.163'
export const backendUrl = 'http://' + url + ':8001/api/v1';

/**
 * Все возможные endpoint'ы и их методы
 */
export const restEndpoints = {
  createComment: {
    url: '/comment',
    method: POST_METHOD,
  },
  EditComment: {
    url: '/comment/{id}',
    method: POST_METHOD,
  },
  DeleteComment: {
    url: '/comment/{id}',
    method: DELETE_METHOD,
  },
  search: {
    url: '/search/{nickname}',
    method: GET_METHOD,
  },
  getStatistic: {
    url: '/statistic',
    method: GET_METHOD,
  },
  rate: {
    url: '/rate/{id}',
    method: POST_METHOD,
  },
  getQuestions: {
    url: '/questions',
    method: GET_METHOD,
  },
  getTop: {
    url: '/profiles/{limit}',
    method: GET_METHOD,
  },
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
  logout: {
    url: '/logout',
    method: POST_METHOD,
  },
  getLevels: {
    url: '/getlevels',
    method: GET_METHOD,
  },
  updateProfile: {
    url: '/profile/{id}',
    method: POST_METHOD,
  },
  addPost: {
    url: '/post',
    method: POST_METHOD,
  },
  deletePost: {
    url: '/post/{id}',
    method: DELETE_METHOD,
  },
  editPost: {
    url: '/post/{id}',
    method: POST_METHOD,
  },
  likePost: {
    url: '/post/{id}/like',
    method: POST_METHOD,
  },
  unlikePost: {
    url: '/post/{id}/unlike',
    method: DELETE_METHOD,
  },
  getAvatar: {
    url: '/profile/{id}/avatar',
    method: GET_METHOD,
  },
  donate: {
    url: '/donate',
    method: POST_METHOD,
  },
  feed: {
    url: '/feed',
    method: GET_METHOD,
  },
  follow: {
    url: '/profile/{id}/follow',
    method: POST_METHOD,
  },
  unfollow: {
    url: '/profile/{id}/unfollow',
    method: POST_METHOD,
  },
  setStatus: {
    url: '/profile/{id}/status',
    method: POST_METHOD,
  },
  setDescription: {
    url: '/profile/{id}/description',
    method: POST_METHOD,
  },
  getPostAttaches: {
    url: '/post/{id}/attaches',
    method: GET_METHOD,
  },
};
