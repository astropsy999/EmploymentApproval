import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Subdivision from '../../filters/Subdivision';
import { tokens } from '../../theme';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState('Dashboard');

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ФИЛЬТРЫ
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center"></Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : '10%'}>
            {isCollapsed && (
              <Item
                title=""
                to=""
                icon={<AccountBalanceIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {/* {!isCollapsed && <ObjectFilter />} */}
            {isCollapsed && (
              <Item
                title=""
                to=""
                icon={<EngineeringIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {isCollapsed && (
              <Item
                title=""
                to=""
                icon={<GroupsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {!isCollapsed && <Subdivision />}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
