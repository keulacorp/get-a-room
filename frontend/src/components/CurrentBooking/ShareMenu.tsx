import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Props {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: (open: boolean) => void;
    url: string;
}

const ShareMenu = (props: Props) => {
    const { anchorEl, open, onClose, url } = props;

    const copy = () => {
        navigator.clipboard.writeText(url).then((value) => {
            onClose(!open);
        });
    };

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            MenuListProps={{
                'aria-labelledby': 'basic-button'
            }}
        >
            <MenuItem onClick={copy}>Copy Link</MenuItem>
        </Menu>
    );
};

export default ShareMenu;
