import { BoxShadow } from "@/utils/constants";
import { useAuth0 } from "@auth0/auth0-react";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const Header = () => {
    const { logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } })
        setAnchorEl(null);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, boxShadow: BoxShadow, height: '60px', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>Aptori Test</Typography>
                <Button>My Events</Button>
            </Box>
            <IconButton sx={{ width: 48, height: 48 }} onClick={handleClick} size="large"><AccountCircleRoundedIcon /></IconButton>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box >
    )
}

export default Header;
