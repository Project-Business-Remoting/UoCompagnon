/**
 * Utility to process notifications (both system and smart)
 * Handles localStorage persistence for smart notifications (read/deleted status)
 */

export const READ_SMART_KEY = 'uo_read_smart_notifs';
export const DELETED_SMART_KEY = 'uo_deleted_smart_notifs';

export const getReadSmartIds = () => JSON.parse(localStorage.getItem(READ_SMART_KEY) || '[]');
export const getDeletedSmartIds = () => JSON.parse(localStorage.getItem(DELETED_SMART_KEY) || '[]');

/**
 * Filter and map read status for smart notifications
 */
export const processNotifications = (notifications = []) => {
  const readSmartIds = getReadSmartIds();
  const deletedSmartIds = getDeletedSmartIds();

  const processed = notifications
    .filter(n => !n.isSmartNotification || !deletedSmartIds.includes(n._id))
    .map(n => {
      if (n.isSmartNotification && readSmartIds.includes(n._id)) {
        return { ...n, isRead: true };
      }
      return n;
    });

  const unreadCount = processed.filter(n => !n.isRead).length;

  return { processed, unreadCount };
};

/**
 * Marks a smart notification as read in localStorage
 */
export const markSmartAsRead = (id) => {
  const readSmartIds = getReadSmartIds();
  if (!readSmartIds.includes(id)) {
    readSmartIds.push(id);
    localStorage.setItem(READ_SMART_KEY, JSON.stringify(readSmartIds));
  }
};

/**
 * Marks all current smart notifications as read in localStorage
 */
export const markAllSmartAsRead = (notifications) => {
  const smartIds = notifications
    .filter(n => n.isSmartNotification && !n.isRead)
    .map(n => n._id);
    
  if (smartIds.length > 0) {
    const readSmartIds = getReadSmartIds();
    const updatedIds = [...new Set([...readSmartIds, ...smartIds])];
    localStorage.setItem(READ_SMART_KEY, JSON.stringify(updatedIds));
  }
};

/**
 * Deletes a smart notification in localStorage
 */
export const deleteSmartNotif = (id) => {
  const deletedSmartIds = getDeletedSmartIds();
  if (!deletedSmartIds.includes(id)) {
    deletedSmartIds.push(id);
    localStorage.setItem(DELETED_SMART_KEY, JSON.stringify(deletedSmartIds));
  }
};
