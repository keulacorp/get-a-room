import { Box, SxProps, Typography } from '@mui/material';
import React from 'react';

const AlertBox = (props: { alertText: string; sx?: SxProps }) => {
    return (
        <Box
            sx={{
                width: 327,
                height: 73,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                border: '2px solid #F2BB32',
                ...props.sx
            }}
        >
            {/* Icon Container */}
            <Box
                sx={{
                    width: 40,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#F2BB32'
                }}
            >
                <Typography
                    variant="body1"
                    color="#FBFBF6"
                    fontSize={20}
                    fontFamily="Material Icons"
                    aria-label={'Warning indicator'}
                >
                    not_interested
                </Typography>
            </Box>

            {/* Text Container */}
            <Box
                flexGrow={1}
                paddingX={1}
                paddingY={1}
                display="flex"
                alignItems="center"
            >
                <Typography variant="h6">{props.alertText}</Typography>
            </Box>
        </Box>
    );
};

export default AlertBox;
