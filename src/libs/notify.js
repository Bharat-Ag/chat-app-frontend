const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

export const messagePreview = (message) => {
  if (message?.text) return stripHtml(message.text).slice(0, 80) || "📷 Photo";
  if (message?.image) return "📷 Photo";
  return "New message";
};

export const showBrowserNotification = ({ title, body, icon, onClick }) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  // Use the service worker registration to show the notification.
  // SW-based notifications work reliably even when the tab is hidden/unfocused,
  // whereas new Notification() from the main thread is silently dropped by
  // Chrome in many background/multi-tab situations.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.showNotification(title || "New message", {
          body: body || "",
          icon: icon || "/vite.svg",
          data: { onClick: !!onClick },
        });
      })
      .catch(() => {
        // SW not ready — fall back to the basic Notification API
        _showNative(title, body, icon, onClick);
      });
  } else {
    _showNative(title, body, icon, onClick);
  }
};

const _showNative = (title, body, icon, onClick) => {
  try {
    const n = new Notification(title || "New message", {
      body: body || "",
      icon: icon || "/vite.svg",
    });
    n.onclick = () => {
      window.focus();
      onClick?.();
      n.close();
    };
  } catch (err) {
    console.error("Notification error:", err);
  }
};
