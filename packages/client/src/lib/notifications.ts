// Simple Notification API helper with safe guards for SSR and unsupported browsers

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported';
  }

  if (Notification.permission === 'default') {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }

  return Notification.permission;
}

export function notify(title: string, body?: string, options?: NotificationOptions): void {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      const defaultOptions: NotificationOptions = {
        body,
        requireInteraction: true,
        tag: 'app-event',
        silent: false,
        icon: '/vite.svg',
      } as NotificationOptions;

      const notification = new Notification(title, { ...defaultOptions, ...(options || {}) });

      // Focus browser window when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch {
      console.error('Failed to notify', title, body);
    }
  }
}
