import PropTypes from 'prop-types';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

export default function FloatingButtons({ buttonsList = [] }) {
  return (
    <SpeedDial
      ariaLabel="quick actions"
      icon={<SpeedDialIcon openIcon={<AddCircleOutlineRoundedIcon />} />}
      direction="up"
      FabProps={{
        color: 'primary',
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          '&:hover': {
            boxShadow: (theme) => theme.shadows[10],
          },
        },
      }}
      sx={{
        position: 'fixed',
        bottom: { xs: 78, md: 28 },
        right: { xs: 16, md: 24 },
        zIndex: 1250,
      }}
    >
      {buttonsList.map((button) => (
        <SpeedDialAction
          key={button.label}
          icon={<AddCircleOutlineRoundedIcon fontSize="small" />}
          tooltipTitle={button.label}
          tooltipOpen
          onClick={button.onClick}
          FabProps={{
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

FloatingButtons.propTypes = {
  buttonsList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
};