import apiRoutes from "../../../config/apiRoutes";
import AxiosService from "../axios.services";

class Userservices {
    static UpdateProfile = async (param, authHeader) => {
        let isToastSuccess = true;
        let isToastError = true;
        let apiName = apiRoutes.user.updateProfile
        let rawResult = await AxiosService.callPutAPI(apiName, param, isToastSuccess, isToastError, authHeader);
        return rawResult;
    };

    static ChangeOnlineVisibility = async (param, authHeader) => {
        let isToastSuccess = true;
        let isToastError = true;
        let apiName = apiRoutes.user.onlineVisiblity
        let rawResult = await AxiosService.callPutAPI(apiName, param, isToastSuccess, isToastError, authHeader);
        return rawResult;
    }

}

export default Userservices;
