import axios from "axios";
import en from "../locales/en";
import useToastStore from "../store/toastStore";

const t = en;

const toastOpen = (payload) => useToastStore.getState().toastOpen(payload);

class AxiosService {
  static getApiHeader = () => {
    const accessToken =
      typeof window !== "undefined" && localStorage.getItem("token");
    var header = {
      Accept: "application/json",
      AppVersion: "1",
      AcceptLanguage: "en",
      deviceType: "web",
    };
    if (accessToken) {
      header["x-access-token"] = accessToken;
    }
    return header;
  };

  static callGetAPI = async (
    apiName,
    isToastSuccess,
    isToastError = true,
    authHeaders = null
  ) => {
    try {
      const response = await axios.get(apiName, {
        headers: authHeaders || this.getApiHeader(),
      });

      if (response?.status === 200 && isToastSuccess) {
          toastOpen({
            type: "success",
            message: t.success,
            description: "success message",
          });
      }

      if ((response.status === 222 || response.status === 203) && isToastError) {
          toastOpen({
            type: "error",
            message: t.error,
            description:
              response?.data?.message || response?.data?.error || "Unexpected response",
          });
      }

      return response;
    } catch (error) {
      if (isToastError) {
          toastOpen({
            type: "error",
            message: t.error,
            description:
              error?.response?.data?.message || error?.response?.data?.error || "Something went wrong",
          });
      }

      return error?.response || error;
    }
  };


  static callPostAPI = async (
    apiName,
    param,
    isToastSuccess,
    isToastError = true,
    authHeaders = null
  ) => {

    return await axios
      .post(apiName, param, {
        headers: authHeaders || this.getApiHeader(),
      })
      .then(async (response) => {
        if (response?.status === 200 && isToastSuccess) {
            toastOpen({
              type: "success",
              message: t.success,
              description: response?.data?.message?.otpStatus
                ? response?.data?.message?.message
                : response?.data?.message ||
                response?.data?.data?.message ||
                "success",
            });
        } else if (
          (response.status == 222 || response.status == 203) &&
          isToastError
        ) {
            toastOpen({
              type: "error",
              message: t.error,
              description:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "error",
            });
        }
        return response;
      })
      .catch((error) => {
        if ((error?.status === 403 || error?.status === 401)) {
          ForceSignOut();
        } else {
            toastOpen({
              type: "error",
              message: t.error,
              description:
                error?.response?.data?.error || error?.response?.data?.message,
            });
        }
        return error;
      });
  };

  static callPutAPI = async (
    apiName,
    param,
    isToastSuccess,
    isToastError = true,
    authHeaders = null
  ) => {
    return await axios
      .put(apiName, param, {
        headers: authHeaders || this.getApiHeader(),
      })
      .then(async (response) => {
        if (response?.status === 200 && isToastSuccess) {
            toastOpen({
              type: "success",
              message: t.success,
              description: response?.data?.message || response?.data?.data,
            });
        } else if (
          (response.status == 222 || response.status == 203) &&
          isToastError
        ) {
          // if (response.status == 222) {
          // }
          // if (response.status == 203 && isToastSuccess) {
          // }
            toastOpen({
              type: "error",
              message: t.error,
              description:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "error",
            });
        }
        return response;
      })
      .catch((error) => {
        if ((error.request.status === 403 || error.request.status === 401)) {
          ForceSignOut();
        } else {
            toastOpen({
              type: "error",
              message: t.error,
              description: error.response?.data?.error,
            });
        }
      });
  };

  static callDeleteAPI = async (
    apiName,
    isToastSuccess,
    isToastError = true,
    authHeaders = null
  ) => {
    return await axios
      .delete(apiName, {
        headers: authHeaders || this.getApiHeader(),
      })
      .then(async (response) => {
        if (response?.status === 200 && isToastSuccess) {
            toastOpen({
              type: "success",
              message: t.success,
              description: response?.data?.message || response?.data?.data,
            });
        } else if (response.status === 203 && isToastError) {
            toastOpen({
              type: "error",
              message: t.error,
              description:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "error",
            });
        }
        return response;
      })
      .catch((error) => {
        if (
          (error.request.status === 403 || error.request.status === 401) &&
          isToastError
        ) {
            toastOpen({
              type: "error",
              message: t.error,
              description: error.response?.data?.error,
            });
        } else {
            toastOpen({
              type: "error",
              message: t.error,
              description: error.response?.data?.error,
            });
        }
      });
  };
}

export default AxiosService;
