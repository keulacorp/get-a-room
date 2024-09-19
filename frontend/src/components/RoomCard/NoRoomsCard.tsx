import * as React from 'react';
import { Typography, styled } from '@mui/material';
import { CustomCard, GridContainer, Row } from './RoomCard';

const CardTitleText = styled(Typography)(({ theme }) => ({
    color: '#E83520',
    fontStyle: 'normal',
    fontSize: '24px',
    fontWeight: 2,
    lineHeight: '24px'
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
                        <Typography>
                            There were no rooms found that match your filters.
                            Please revise your filters.
                        </Typography>
                    </Row>
                </GridContainer>
            </CustomCard>
        </li>
    );
};

export default NoRoomsCard;
