import { Requests } from './requests.js';
import { restEndpoints, backendUrl } from '@configs/rest_config.js';

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
  async getUserPosts(id) {
    const endpoint = restEndpoints.getPosts;
    const url = backendUrl + endpoint.url.replace('{id}', id);
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

  async logout() {
    const endpoint = restEndpoints.logout;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  async getLevels(id) {
    const endpoint = restEndpoints.getLevels;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {id});
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
    return this.make_request(url, endpoint.method, { login, password, isAuthor});
  }

  async updateProfile(profile) {
    const endpoint = restEndpoints.updateProfile;
    if (profile.posts !== undefined) {
      delete profile.posts;
    }
    const url = backendUrl + endpoint.url.replace('{id}', profile.user.id);
    return this.make_request(url, endpoint.method, profile);
  }

  async newPost(post) {
    const endpoint = restEndpoints.addPost;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, post);
  }

  async editPost(post) {
    const endpoint = restEndpoints.editPost;
    const url = backendUrl + endpoint.url.replace('{id}', post.id);
    return this.make_request(url, endpoint.method, post);
  }

  async deletePost(id) {
    const endpoint = restEndpoints.deletePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  async likePost(id) {
    const endpoint = restEndpoints.likePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }

  async unlikePost(id) {
    const endpoint = restEndpoints.unlikePost;
    const url = backendUrl + endpoint.url.replace('{id}', id);
    return this.make_request(url, endpoint.method);
  }
}
