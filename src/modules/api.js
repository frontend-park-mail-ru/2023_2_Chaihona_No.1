import { restEndpoints, backendUrl } from '@configs/rest_config.js';
import { Requests } from './requests.js';

/**
 * Класс запросов к REST API
 * @class
 */
export class Api extends Requests {
  /**
     * Возвращает страницу пользователя
     * @param id - id пользователя
     * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async getUserProfile(id) {
    const endpoint = restEndpoints.getProfile;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  /**
     * Возвращает посты пользователя
     * @param id - id пользователя
     * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async getUserPosts(id, is_owner, is_followed) {
    const endpoint = restEndpoints.getPosts;
    const url = backendUrl + endpoint.url.replace('{id}', id) + "?is_followed="+is_followed+"&&is_owner="+is_owner;
    return this.make_request(url, endpoint.method);
  }

  /**
     * Авторизация пользоватедя
     * @param login - логин пользователя
     * @param password - пароль пользователя
     * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async login(login, password) {
    const endpoint = restEndpoints.login;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, { login, password });
  }

  /**
     * Проверяет, авторизован ли пользователь.
     * Используется при первом заходе на страницу, чтобы проверить, жива ли кука с сессией.
     * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async isAuth() {
    const endpoint = restEndpoints.checkAuth;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Разлогинивает пользователя
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async logout() {
    const endpoint = restEndpoints.logout;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Возвращает доступные уровни подписки для автора
   * @param id - id автора
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getLevels(id) {
    const endpoint = restEndpoints.getLevels;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, { id });
  }

  /**
     * Регистрация пользователя
     * @param login - логин пользователя
     * @param password - пароль пользователя
     * @param isAuthor - является ли пользователь автором
     * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async register(login, password, isAuthor) {
    const endpoint = restEndpoints.register;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, { login, password, isAuthor });
  }

  /**
   * Запрос для редактирования профиля
   * @param formData - новые данные
   * @param id - id профиля
   * @returns {Promise<{data: any, status: number}|{data: null, status: number}|undefined>}
   */
  async updateProfileFD(formData, id) {
    const endpoint = restEndpoints.updateProfile;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.multipart_post(url, formData);
  }

  /**
   * Добавление нового поста
   * @param post - данные поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async newPost(post) {
    const endpoint = restEndpoints.addPost;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, post);
  }

  /**
   * Редактирование существующего поста
   * @param post - новые данные поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async editPost(post) {
    const endpoint = restEndpoints.editPost;
    const url = backendUrl + endpoint.url.replace('{id}', post.id);
    return this.make_request(url, endpoint.method, post);
  }

  /**
   * Удаление поста
   * @param id - id поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async deletePost(id) {
    const endpoint = restEndpoints.deletePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  /**
   * Лайк поста
   * @param id - id поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async likePost(id) {
    const endpoint = restEndpoints.likePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  /**
   * Дизлайк поста
   * @param id - id поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async unlikePost(id) {
    const endpoint = restEndpoints.unlikePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  /**
   * Получить аватар пользователя
   * @param id - id пользователя
   * @returns {Promise<*>}
   */
  async getAvatar(id) {
    const endpoint = restEndpoints.getAvatar;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.blob_request(url);
  }

  /**
   * Отправить донат
   * @param donater_id - кто отправляет
   * @param cid - кто получает
   * @param currency - валюта
   * @param value - сумма
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async donate(donater_id, cid, currency, value) {
    const endpoint = restEndpoints.donate;
    const url = backendUrl + endpoint.url;
    const creator_id = Number(cid);
    return this.make_request(url, endpoint.method, {
      donater_id, creator_id, currency, value,
    });
  }

  /**
   * Получить новостную ленту
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getFeed() {
    const endpoint = restEndpoints.feed;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Подписаться
   * @param id - кто подписывается
   * @param profId - на кого
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async follow(id, profId, subscription_id = 0) {
    const endpoint = restEndpoints.follow;
    const url = backendUrl + endpoint.url.replace('{id}', profId);
    return this.make_request(url, endpoint.method, { id: Number(id), subscription_id});
  }

  /**
   * Отписаться
   * @param id - кто отписывается
   * @param profId - от кого
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async unfollow(id, profId) {
    const endpoint = restEndpoints.unfollow;
    const url = backendUrl + endpoint.url.replace('{id}', profId);
    return this.make_request(url, endpoint.method, { id: Number(id) });
  }

  /**
   * Изменить описание профиля
   * @param id - id пользователя
   * @param description - новое описание
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async setDescription(id, description) {
    const endpoint = restEndpoints.setDescription;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method, { description });
  }

  /**
   * Изменить статус
   * @param id - id пользователя
   * @param status - новый статус
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async setStatus(id, status) {
    const endpoint = restEndpoints.setStatus;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method, { status });
  }

  /**
   * Получить топ пользователей
   * @param limit - количество пользователей
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getTop(limit) {
    const endpoint = restEndpoints.getTop;
    const url = backendUrl + endpoint.url.replace('{limit}', limit);
    return this.make_request(url, endpoint.method);
  }

  /**
   * Получить аттачи поста
   * @param id - id поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getPostAttaches(id) {
    const endpoint = restEndpoints.getPostAttaches;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  /**
   * Получить вопросы
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getQuestions() {
    const endpoint = restEndpoints.getQuestions;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Оценить
  * @param id - id поста
  * @param rating - rating поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async rate(id, rating) {
    const endpoint = restEndpoints.rate;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method, {rating});
  }

  /**
   * Получить статистику
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async getStatistic() {
    const endpoint = restEndpoints.getStatistic;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Поиск пользователей
   * @param nickname - nickname пользователя
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async search(nickname) {
    const endpoint = restEndpoints.search;
    const url = backendUrl + endpoint.url.replace('{nickname}', nickname);
    return this.make_request(url, endpoint.method);
  }


  /**
   * Добавление нового поста
   * @param text - текст коммента
   * @param post_id - id поста
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async createComment(text, post_id) {
    const endpoint = restEndpoints.createComment;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {text, post_id: Number(post_id)});
  }

  /**
   * Добавление нового поста
   * @param comment - коммент
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async editComment(comment) {
    const endpoint = restEndpoints.editComment;
    const url = backendUrl + endpoint.url.replace('{id}', comment.id);
    return this.make_request(url, endpoint.method, comment);
  }

  /**
   * Добавление нового поста
   * @param comment - коммент
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async deleteComment(commentId) {
    const endpoint = restEndpoints.deleteComment;
    const url = backendUrl + endpoint.url.replace('{id}', Number(commentId));
    return this.make_request(url, endpoint.method);
  }

  /**
   * Добавление нового поста
   * @param comment - коммент
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>}
   */
  async analytics() {
    const endpoint = restEndpoints.analytics;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  async addDevice(token) {
    const endpoint = restEndpoints.addDevice;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {device_id: token})
  }

  async gePostsByTag(tag) {
    const endpoint = restEndpoints.tag;
    const url = backendUrl + endpoint.url.replace('{tag}', tag);
    return this.make_request(url, endpoint.method);
  }
}
