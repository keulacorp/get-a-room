import * as React from 'react';
import { TextField, Box, styled } from '@mui/material';

interface Props {
    children?: React.ReactNode;
}

var GetARoomForm = ({ children }: Props) => {
    return (
        <Box component="form" noValidate>
            {children}
            after
        </Box>
    );
};

export default GetARoomForm;
