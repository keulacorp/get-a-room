import * as React from 'react';
import { IconButton } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { PropsWithChildren } from 'react';
import { children } from 'happy-dom/lib/PropertySymbol';

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
        <IconButton aria-label="favorite room" onClick={props.onClick}>
            {props.isSelected ? (
                <Bookmark sx={{ color: '#F04E30' }} />
            ) : (
                <BookmarkBorder
                    color={props.changeColor ? 'disabled' : 'inherit'}
                />
            )}
            {props.children}
        </IconButton>
    );
}

export default BookmarkButton;
