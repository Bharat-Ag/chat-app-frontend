import { RadiusBottomrightOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { create } from "zustand";

export const handleCloseNotification = () => {
  // notification
};

const useToastStore = create((set) => ({
  type: "success",
  message: "",
  description: "",
  change: false,

  toastOpen: (payload) => {
    notification.destroy();
    const type = payload.type ? payload.type : "success";

    set({
      type,
      message: payload.message,
      description: payload.description,
    });

    notification[type]({
      message: payload.message,
      description: payload.description,
      placement: "bottomLeft",
      placement: RadiusBottomrightOutlined,
      duration: 4,
      className: "custom-toast-notification-box",
      getContainer: (trigger) => trigger.parentElement,
      onClose: handleCloseNotification,
    });
  },

  toastDestroy: () => {
    notification.destroy();
  },

  changeTab: (payload) => set({ change: payload }),
}));

export default useToastStore;
