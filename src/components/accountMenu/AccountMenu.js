'use clent';

import styles from "./accountMenu.module.css";
import { useState } from 'react';
import { useLogout } from '../GlobalContext';
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Person from '@mui/icons-material/Person';
import Luggage from '@mui/icons-material/Luggage';
import Logout from '@mui/icons-material/Logout';

const slotProps = {
    paper: {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            fontFamily: "var(--font-montserrat)",
            '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
            },
            '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 19,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            }
        }
    }
};

const linkListItemStyle = {
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    p: 0
};

const AccountMenu = ({ user, isAdmin }) => {
    const logout = useLogout();
    const pathanme = usePathname();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = !!anchorEl;

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        document.scrollingElement.style.overflow = "hidden";
    }

    const handleClose = () => {
        setAnchorEl(null);
        document.scrollingElement.style.overflow = "auto";
    }

    const handleLogout = () => {
        if ((user && pathanme.includes("users")) || (isAdmin && pathanme.includes("admin"))) {
            router.back();
        }

        localStorage.removeItem("token");
        handleClose();
        logout();
    }

    if (isAdmin) return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Аккаунт">
            <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{p: 0}}
            >
                <Avatar sx={{ width: 48, height: 48 }}>А</Avatar>
            </IconButton>
            </Tooltip>
            <Typography sx={{ ml: 1, fontFamily: "var(--font-montserrat)" }}>Администратор</Typography>
        </Box>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={slotProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem sx={{ cursor: "default", fontFamily: "inherit" }}>
                <Avatar /> Администратор
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} sx={linkListItemStyle}>
                <Link href="/admin/add-hotel" className={styles.link}>
                    <ListItemIcon>
                        <ApartmentIcon fontSize="small" />
                    </ListItemIcon>
                    Добавить отель
                </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={linkListItemStyle}>
                <Link href="/admin/add-tour" className={styles.link}>
                    <ListItemIcon>
                        <Luggage fontSize="small" />
                    </ListItemIcon>
                    Добавить тур
                </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{fontFamily: "inherit"}}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Выйти
            </MenuItem>
        </Menu>
        </>
    );

    const { id, name, surname } = user;

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Аккаунт">
            <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{p: 0}}
            >
                <Avatar sx={{ width: 48, height: 48 }}>{name[0]}{surname[0]}</Avatar>
            </IconButton>
            </Tooltip>
            <Typography sx={{ ml: 1, fontFamily: "var(--font-montserrat)" }}>{name} {surname[0]}.</Typography>
        </Box>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={slotProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem sx={{ cursor: "default", fontFamily: "inherit" }}>
                <Avatar /> {name} {surname}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} sx={linkListItemStyle}>
                <Link href={`/users/${id}`} className={styles.link}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    Мой кабинет
                </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{fontFamily: "inherit"}}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Выйти
            </MenuItem>
        </Menu>
        </>
    );
}

export default AccountMenu;