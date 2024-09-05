import { CenterAlignedStack } from '../../theme_2024';
import { Typography } from '@mui/material';
import React from 'react';
import { UserIconButton } from '../BookingView/BookingView';

const PageHeaderWithUserIcon = (props: {
    onClick: () => void;
    isOpen: boolean;
    title: string;
}) => {
    return (
        <CenterAlignedStack
            direction={'row'}
            sx={{
                width: '100%'
            }}
            onClick={props.onClick}
        >
            <Typography variant={'h1'}>{props.title}</Typography>
            <UserIconButton open={props.isOpen} onClick={props.onClick} />
        </CenterAlignedStack>
    );
};

export default PageHeaderWithUserIcon;
