import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE}/`,
  // timeout: 15000,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {

    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
      }
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url) => instance.get(url).then(responseBody),

  post: (url, body) =>
    instance
      .post(url, body, { headers: { 'content-type': 'application/json' } })
      .then(responseBody),

  put: (url, body) => instance.put(url, body, {}).then(responseBody),
  patch: (url, body) => instance.patch(url, body, {}).then(responseBody),
  delete: (url, body) => instance.delete(url, body, {}).then(responseBody),
};

export const userApi = {
  signUp: (data) => requests.post('/api/users/signup', data),
  login: (data) => requests.post('/api/users/login', data),
  getUsersList: (data) => requests.post('/api/users/users-list', data),
  deleteUser: (userId) => requests.delete(`/api/users/delete-user/${userId}`),
  updateUser: (userId, data) =>
    requests.patch(`/api/users/update-user/${userId}`, data),
};

export const groupApi = {
  getGroupList: (groupId) => requests.get(`/api/group/list/${groupId}`),
  deleteGroup: (groupId) => requests.delete(`/api/group/delete-group/${groupId}`),
  createGroup: (data) => requests.post('/api/group/create-group', data),
  updateGroup: (groupId, data) =>
    requests.put(`/api/group/update-group/${groupId}`, data),
};

export const expenseApi = {
  getDashboardData: (userId) =>
    requests.get(`/api/expenses/dashboard/${userId}`),
  getExpenseGroup: (groupId) => requests.get(`/api/expenses/get/${groupId}`),
  getEmployeeName: (data) => requests.get('api/employee/get', data),
  addExpense: (data) => requests.post('/api/expenses/add', data),
  settleUpExpense: (data) => requests.post('/api/expenses/settle-up', data),
  deleteExpense: (expenseId) => requests.delete(`/api/expenses/delete/${expenseId}`),
  updateExpense: (expenseId, data) =>
    requests.put(`/api/expenses/update/${expenseId}`, data),
};
