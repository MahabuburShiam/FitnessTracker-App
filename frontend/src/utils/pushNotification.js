export const subscribeUserToPush = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    });
  }

  // Send subscription to backend
  await fetch('/api/notifications/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify({ subscription })
  });
};

export const askForNotificationPermission = () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        subscribeUserToPush();
      }
    });
  }
};