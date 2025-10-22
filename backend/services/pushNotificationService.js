// Push Notification Service
class PushNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
  }

  // Initialize push notifications
  async initialize() {
    if (!this.isSupported) {
      console.log('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      // Check current subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request permission and subscribe to push notifications
  async subscribe() {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      console.log('Push notification subscription successful');
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    if (!this.subscription) {
      return true;
    }

    try {
      const success = await this.subscription.unsubscribe();
      if (success) {
        this.subscription = null;
        
        // Notify server about unsubscribe
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        });

        console.log('Push notification unsubscription successful');
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  // Send subscription to backend
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ subscription })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      throw error;
    }
  }

  // Check if user is subscribed
  isSubscribed() {
    return this.subscription !== null;
  }

  // Utility function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send test notification
  async sendTestNotification() {
    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      console.log('Test notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();
export default pushNotificationService;