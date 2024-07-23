import { useState } from 'react';

export const useBookingDurationState = () => {
    const [bookingDuration, modifyBookingDuration] = useState(15);

    const getBookingDuration = () => {
        return bookingDuration;
    };

    const setBookingDuration = (min: number) => {
        return modifyBookingDuration(min);
    };

    return { getBookingDuration, setBookingDuration };
};
