import config from "./config";

const apiRoutes = {
  auth: {
    login: config.baseUrl + "api/auth/login",
    signup: config.baseUrl + "api/auth/signup",
    checkAuth: config.baseUrl + 'api/auth/check',
    resetPassword: config.baseUrl + 'api/auth/reset-password',
  },

  user: {
    updateProfile: config.baseUrl + 'auth/update-profile',
    onlineVisiblity: config.baseUrl + 'auth/online-visibility',
  }

};

export default apiRoutes;
