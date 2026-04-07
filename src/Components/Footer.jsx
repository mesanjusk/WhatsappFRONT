import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { ROUTES } from '../constants/routes';

export default function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      { label: 'Home', path: ROUTES.HOME, icon: <HomeRoundedIcon fontSize="small" /> },
      { label: 'Chat', path: ROUTES.WHATSAPP_CLOUD, icon: <ChatRoundedIcon fontSize="small" /> },
      { label: 'Send', path: ROUTES.WHATSAPP_SEND, icon: <SendRoundedIcon fontSize="small" /> },
      { label: 'Bulk', path: ROUTES.WHATSAPP_BULK, icon: <CampaignRoundedIcon fontSize="small" /> },
      { label: 'Flows', path: ROUTES.FLOW_BUILDER, icon: <AccountTreeRoundedIcon fontSize="small" /> },
    ].filter((tab) => typeof tab.path === 'string' && tab.path.length > 0),
    [],
  );

  const active =
    tabs.find((tab) =>
      String(pathname || '').toLowerCase().startsWith(String(tab.path || '').toLowerCase()),
    )?.path ?? false;

  return (
    <Paper
      sx={{
        position: 'fixed',
        left: 8,
        right: 8,
        bottom: 8,
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
      elevation={1}
    >
      <BottomNavigation
        value={active}
        onChange={(_, next) => next && navigate(next)}
        showLabels
        sx={{ minHeight: 58 }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.path}
            value={tab.path}
            label={tab.label}
            icon={tab.icon}
            sx={{ minWidth: 0, px: 0.25 }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}