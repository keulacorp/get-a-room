import * as React from 'react';
import { Container, Divider, IconButton, styled } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { PropsWithChildren } from 'react';
import { children } from 'happy-dom/lib/PropertySymbol';
const ButtonContent = styled('span')(({ theme }) => ({}));

function BookmarkButton(
    props: PropsWithChildren<{
        onClick: (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => void;
        isSelected: boolean;
        changeColor: boolean | undefined;
    }>
) {
    return (
        <ButtonContent aria-label="favorite room" onClick={props.onClick}>
            {props.isSelected ? (
                <Bookmark sx={{ color: '#F04E30', padding: '1px' }} />
            ) : (
                <BookmarkBorder
                    color={props.changeColor ? 'disabled' : 'inherit'}
                />
            )}
            {props.children}
        </ButtonContent>
    );
}

export default BookmarkButton;
