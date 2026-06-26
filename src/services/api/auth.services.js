import apiRoutes from "../../../config/apiRoutes";
import AxiosService from "../axios.services";

class AuthService {
    static PostLogin = async (loginState, param) => {
        let isToastSuccess = true;
        let isToastError = true;
        let apiName = `${loginState === 'login' ? apiRoutes.auth.login : apiRoutes.auth.signup}`;
        let rawResult = await AxiosService.callPostAPI(apiName, param, isToastSuccess, isToastError);
        return rawResult;
    };

    static PostRegister = async (param) => {
        let isToastSuccess = true;
        let isToastError = true;
        let apiName = apiRoutes.auth.signup;
        let rawResult = await AxiosService.callPostAPI(apiName, param, isToastSuccess, isToastError);
        return rawResult;
    };

    static CheckAuth = async (headers) => {
        const apiName = apiRoutes.auth.checkAuth;
        const isToastSuccess = true;
        const isToastError = true;

        const rawResult = await AxiosService.callGetAPI(
            apiName,
            isToastSuccess,
            isToastError,
            headers
        );
        return rawResult;
    };

    static PostResetPassword = async (param, headerToken) => {
        let isToastSuccess = true;
        let isToastError = true;
        let apiName = apiRoutes.auth.resetPassword;
        let rawResult = await AxiosService.callPutAPI(apiName, param, isToastSuccess, isToastError, headerToken);
        return rawResult;
    };

}

export default AuthService;
