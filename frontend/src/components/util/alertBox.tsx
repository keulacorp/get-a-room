import { Box, SxProps, Typography } from '@mui/material';
import React from 'react';

const AlertBox = (props: { alertText: string; sx?: SxProps }) => {
    return (
        <Box
            sx={{
                minWidth: '327px',
                minHeight: '73px',
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
                    minHeight: '73px',
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
                sx={{
                    flexGrow: 1,
                    px: 1, // Shorthand for paddingX
                    py: 1, // Shorthand for paddingY
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    lineHeight: 'normal'
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                    }}
                >
                    {props.alertText}
                </Typography>
            </Box>
        </Box>
    );
};

export default AlertBox;
