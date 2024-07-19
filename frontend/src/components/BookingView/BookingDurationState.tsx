import { useState } from 'react';

const useBookingDurationState = () => {
    return useState(15);
};

export default useBookingDurationState;
