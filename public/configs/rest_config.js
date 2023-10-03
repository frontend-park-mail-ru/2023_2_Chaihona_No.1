const GET_METHOD = 'GET';
const POST_METHOD = 'POST';

export const backendUrl = "http://212.233.89.163:8001/api/v1"
// export const backendUrl = "http://localhost:8001/api/v1"

export const restEndpoints = {
    getPosts:  {
        url: "/profile/{id}/post",
        method: GET_METHOD
    },
    getProfile: {
        url: "/profile/{id}",
        method: GET_METHOD
    },
    login: {
        url: "/login",
        method: POST_METHOD
    },
    register: {
        url: "/registration",
        method: POST_METHOD
    },
    
    checkAuth: {
        url: '/is_authorized',
        method: GET_METHOD
    },
    logout: {
        url: '/logout',
        method: POST_METHOD
    }
}
