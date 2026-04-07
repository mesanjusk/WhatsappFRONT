import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const titleFromPath = (pathname = '/home') => {
  const segment = pathname.split('/').filter(Boolean).at(-1) || 'home';
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function TopNavbar({ onToggleSidebar, onToggleDesktopCollapse, desktopCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userName, userGroup, clearAuth } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const tabs = useMemo(
    () => [
      { label: 'Home', path: ROUTES.HOME, icon: <HomeRoundedIcon sx={{ fontSize: 15 }} /> },
      { label: 'Inbox', path: ROUTES.WHATSAPP, icon: <ChatRoundedIcon sx={{ fontSize: 15 }} /> },
      { label: 'Send', path: ROUTES.WHATSAPP_SEND, icon: <SendRoundedIcon sx={{ fontSize: 15 }} /> },
      { label: 'Broadcast', path: ROUTES.WHATSAPP_BULK, icon: <GroupsRoundedIcon sx={{ fontSize: 15 }} /> },
    ],
    [],
  );

  useEffect(() => {
    if (!userName) navigate(ROUTES.LOGIN);
  }, [navigate, userName]);

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.ROOT);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ minHeight: { xs: 54, md: 56 }, px: { xs: 1, md: 1.5 }, gap: 0.75 }}>
        <IconButton onClick={onToggleSidebar} sx={{ display: { md: 'none' } }}>
          <MenuRoundedIcon fontSize="small" />
        </IconButton>

        <IconButton onClick={onToggleDesktopCollapse} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
          {desktopCollapsed ? <MenuRoundedIcon fontSize="small" /> : <MenuOpenRoundedIcon fontSize="small" />}
        </IconButton>

        <Stack sx={{ minWidth: 0, pr: 1, maxWidth: { xs: 190, sm: 260, md: 340 } }}>
          <Typography variant="subtitle1" noWrap fontWeight={800}>
            WhatsApp CRM
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {titleFromPath(pathname)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.75} sx={{ display: { xs: 'none', lg: 'flex' }, ml: 'auto' }}>
          {tabs.map((tab) => (
            <Chip
              key={tab.path}
              clickable
              size="small"
              icon={tab.icon}
              label={<NavLink style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }} to={tab.path}>{tab.label}</NavLink>}
              variant={pathname === tab.path ? 'filled' : 'outlined'}
              color={pathname === tab.path ? 'primary' : 'default'}
            />
          ))}
        </Stack>

        <IconButton onClick={(event) => setMenuAnchor(event.currentTarget)} sx={{ ml: { xs: 'auto', lg: 1 } }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 30, height: 30, fontSize: 12 }}>
            {userName ? userName.slice(0, 2).toUpperCase() : 'NA'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{userName || 'Guest'}</Typography>
            <Typography variant="caption" color="text.secondary">{userGroup || 'Unknown role'}</Typography>
          </Box>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              handleLogout();
            }}
          >
            <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

TopNavbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  onToggleDesktopCollapse: PropTypes.func.isRequired,
  desktopCollapsed: PropTypes.bool.isRequired,
};
