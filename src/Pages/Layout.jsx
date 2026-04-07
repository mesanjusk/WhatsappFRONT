import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Box, Fab, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import Sidebar from '../Components/Sidebar';
import TopNavbar from '../Components/TopNavbar';
import Footer from '../Components/Footer';
import FloatingButtons from '../Components/FloatingButtons';
import RightUtilityRail from '../Components/layout/RightUtilityRail';
import { ROUTES } from '../constants/routes';

const DRAWER_WIDTH = 258;
const DRAWER_COLLAPSED = 72;
const NAVBAR_HEIGHT = 56;

export default function Layout() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [desktopCollapsed, setDesktopCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const buttonsList = useMemo(
    () => [
      { onClick: () => navigate(ROUTES.WHATSAPP), label: 'Inbox' },
      { onClick: () => navigate(ROUTES.WHATSAPP_SEND), label: 'Send' },
      { onClick: () => navigate(ROUTES.WHATSAPP_BULK), label: 'Broadcast' },
      { onClick: () => navigate(ROUTES.FLOW_BUILDER), label: 'Flows' },
    ],
    [navigate],
  );

  const utilityActions = useMemo(
    () => [
      { label: 'Refresh', onClick: () => window.location.reload(), icon: <RefreshRoundedIcon fontSize="small" /> },
      { label: 'Inbox', onClick: () => navigate(ROUTES.WHATSAPP), icon: <ChatRoundedIcon fontSize="small" /> },
      { label: 'Send', onClick: () => navigate(ROUTES.WHATSAPP_SEND), icon: <SendRoundedIcon fontSize="small" /> },
      { label: 'Broadcast', onClick: () => navigate(ROUTES.WHATSAPP_BULK), icon: <GroupsRoundedIcon fontSize="small" /> },
      { label: 'Flows', onClick: () => navigate(ROUTES.FLOW_BUILDER), icon: <AccountTreeRoundedIcon fontSize="small" /> },
    ],
    [navigate],
  );

  const sidebarWidth = isDesktop ? (desktopCollapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH) : 0;

  return (
    <Box
      sx={{
        height: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <Sidebar
        desktopCollapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { md: `${sidebarWidth}px` },
          transition: (theme) => theme.transitions.create('margin-left'),
          pr: { lg: 6 },
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: { xs: 0, md: `${sidebarWidth}px` },
            right: 0,
            zIndex: 1200,
            transition: (theme) => theme.transitions.create(['left']),
          }}
        >
          <TopNavbar
            onToggleSidebar={() => setMobileOpen((prev) => !prev)}
            onToggleDesktopCollapse={() => setDesktopCollapsed((prev) => !prev)}
            desktopCollapsed={desktopCollapsed}
          />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: { xs: 0.5, md: 1 },
            pt: `${NAVBAR_HEIGHT + 8}px`,
            pb: { xs: 8.5, md: 1.5 },
            scrollBehavior: 'smooth',
          }}
        >
          <Box
            sx={{
              maxWidth: 1640,
              mx: 'auto',
              minHeight: `calc(100dvh - ${NAVBAR_HEIGHT + 24}px)`,
            }}
          >
            <Outlet />
          </Box>
          <Footer />
        </Box>

        <FloatingButtons buttonsList={buttonsList} />
      </Box>

      <RightUtilityRail actions={utilityActions} />

      <Fab
        color="primary"
        aria-label="open menu"
        onClick={() => setMobileOpen(true)}
        size="small"
        sx={{
          position: 'fixed',
          left: 10,
          bottom: 70,
          display: { xs: 'flex', md: 'none' },
          zIndex: 1199,
        }}
      >
        <AddIcon fontSize="small" />
      </Fab>
    </Box>
  );
}
