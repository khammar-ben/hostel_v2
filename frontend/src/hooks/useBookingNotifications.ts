import { useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import axiosClient from '../api/axios';

export const useBookingNotifications = () => {
  const { addNotification } = useNotifications();
  const lastBookingIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Initialize the last booking ID
    const initializeLastBookingId = async () => {
      try {
        const response = await axiosClient.get('/api/bookings');
        if (response.data.success && response.data.data.length > 0) {
          lastBookingIdRef.current = response.data.data[0].id;
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.error('Error initializing booking notifications:', error);
      }
    };

    initializeLastBookingId();

    // Poll for new bookings every 5 seconds
    const interval = setInterval(async () => {
      if (!isInitializedRef.current) return;

      try {
        const response = await axiosClient.get('/api/bookings');
        if (response.data.success) {
          const bookings = response.data.data;
          const latestBooking = bookings[0]; // Assuming bookings are sorted by created_at desc
          
          if (latestBooking && lastBookingIdRef.current && latestBooking.id > lastBookingIdRef.current) {
            // New booking detected
            addNotification({
              type: 'success',
              title: 'New Booking Request',
              message: `New booking from ${latestBooking.guest.first_name} ${latestBooking.guest.last_name} for ${latestBooking.room.name}`
            });
            
            // Update the last booking ID
            lastBookingIdRef.current = latestBooking.id;
          }
        }
      } catch (error) {
        console.error('Error checking for new bookings:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [addNotification]);
};
