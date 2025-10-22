const webpush = require('web-push');
const db = require('../models');

// Configure web push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PushService = {
  /**
   * Saves or updates a push subscription for a user.
   * @param {number} userId - The ID of the user.
   * @param {object} subscriptionObject - The push subscription object from the browser.
   */
  saveSubscription: async (userId, subscriptionObject) => {
    // Use findOrCreate to handle both new and existing subscriptions gracefully
    await db.PushSubscription.findOrCreate({
      where: { user_id: userId },
      defaults: { subscription_object: subscriptionObject },
    });
  },

  /**
   * Sends a push notification to a specific user.
   * @param {number} userId - The ID of the user to notify.
   * @param {object} payload - The notification payload { title, body, ... }.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  sendNotification: async (userId, payload) => {
    const pushSubscription = await db.PushSubscription.findOne({
      where: { user_id: userId },
    });

    if (!pushSubscription) {
      return { success: false, message: `No subscription found for user ${userId}` };
    }

    try {
      await webpush.sendNotification(pushSubscription.subscription_object, JSON.stringify(payload));
      console.log(`Push notification sent to user ${userId}`);
      return { success: true, message: 'Notification sent.' };
    } catch (error) {
      console.error('Error sending push notification:', error);

      // If the subscription is expired or invalid (410 Gone), remove it.
      if (error.statusCode === 410) {
        await pushSubscription.destroy();
      }
      return { success: false, message: 'Failed to send notification.' };
    }
  },

  /**
   * Sends a push notification to multiple users.
   * @param {number[]} userIds - An array of user IDs.
   * @param {object} payload - The notification payload.
   */
  sendBulkNotification: async (userIds, payload) => {
    const notificationPromises = userIds.map(userId => 
      PushService.sendNotification(userId, payload)
    );

    const results = await Promise.allSettled(notificationPromises);

    const successfulCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`Successfully sent ${successfulCount} of ${userIds.length} push notifications.`);

    // You can also log failures if needed
    results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
           .forEach(failure => console.error('Failed to send notification:', failure));
  }
};

module.exports = PushService;