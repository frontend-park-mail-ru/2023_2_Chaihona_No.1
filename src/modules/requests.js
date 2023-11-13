const noBodyRequests = ['GET', 'HEAD'];
const UNAUTHORISED_CODE = 401;

/**
 * Класс для создания запросов в Интернет
 * @class
 */
export class Requests {
  /**
     * Функция для создания запроса
     * @param url - url для отправки запроса
     * @param method - метод запроса
     * @param data - тело запроса (null если не требуется)
     * @returns {Promise<{data: any, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async make_request(url, method, data = null) {
    const params = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (!noBodyRequests.includes(method)) {
      params.body = JSON.stringify({ body: data });
    }

    const response = await fetch(url, params);

    try {
      const responseJson = await response.json();
      if (response.status === UNAUTHORISED_CODE) {
        window.router.redirect('/login');
      }
      return {
        status: response.status,
        data: responseJson,
      };
    } catch (e) {
      return {
        status: response.status,
        data: null,
      };
    }
  }

  /**
   * Запрос на получение BLOBa, нужен для получения картинок
   * @param url - url запроса
   * @returns {Promise<string>}
   */
  async blob_request(url) {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    const resBlob = await response.blob();
    return URL.createObjectURL(resBlob);
  }

  /**
   * Запрос типа multipart для отправа формы с текстом и картинкой
   * @param url - адрес запроса
   * @param data - данные запроса
   * @returns {Promise<{data: any, status: number}|{data: null, status: number}>}
   */
  async multipart_post(url, data) {
    const params = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: data,
    };

    const response = await fetch(url, params);

    try {
      const responseJson = await response.json();
      return {
        status: response.status,
        data: responseJson,
      };
    } catch (e) {
      return {
        status: 500,
        data: null,
      };
    }
  }
}
