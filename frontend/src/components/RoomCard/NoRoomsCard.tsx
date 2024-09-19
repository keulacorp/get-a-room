import * as React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { CustomCard, GridContainer, Row } from './RoomCard';

const CardTitleText = styled(Typography)(({ theme }) => ({
    color: '#E83520',
    fontStyle: 'normal',
    fontSize: '24px',
    fontWeight: 2,
    lineHeight: '24px'
}));
const CardTextWrapper = styled(Box)(({ theme }) => ({
    textAlign: 'left',
    lineHeight: 'normal',
    wordWrap: 'break-word', // Wrap long words to the next line
    whiteSpace: 'normal', // Allow text to wrap normally
    wordBreak: 'break-word', // Break long words if necessary
    overflowY: 'auto'
}));

type NoRoomsCardProps = {};

const NoRoomsCard = (props: NoRoomsCardProps) => {
    return (
        <li>
            <CustomCard>
                <GridContainer>
                    <Row>
                        <CardTitleText>No rooms found :/</CardTitleText>
                    </Row>

                    <Row>
                        <CardTextWrapper>
                            <Typography variant={'h6'}>
                                There were no rooms found that match your
                                filters. Please revise your filters.
                            </Typography>
                        </CardTextWrapper>
                    </Row>
                </GridContainer>
            </CustomCard>
        </li>
    );
};

export default NoRoomsCard;
