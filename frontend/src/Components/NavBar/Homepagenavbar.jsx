import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Fade,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

// Updated theme with cohesive matching color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // Matching your sidebar blue
      light: '#42A5F5',
      dark: '#0056b3',
    },
    secondary: {
      main: '#00C853', // Matching your sidebar green
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F6F9FC', // Matching your layout background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

// Styled component for animated nav buttons with underline effect
const AnimatedNavButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateX(-50%)',
    borderRadius: '2px 2px 0 0',
  },
  
  '&:hover': {
    backgroundColor: 'rgba(0, 123, 255, 0.04)',
    transform: 'translateY(-1px)',
    
    '&::before': {
      width: '80%',
    },
    
    '& .nav-icon': {
      transform: 'rotate(5deg) scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
  
  '& .nav-icon': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginRight: '8px',
    fontSize: '20px',
  },
}));

// Styled component for the logo with gradient animation
const AnimatedLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'scale(1.05)',
    
    '& .logo-icon': {
      transform: 'rotate(360deg)',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  
  '& .logo-icon': {
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

// Styled component for the POST AD button with matching colors
const CTAButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: '12px',
  padding: '10px 20px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: 'white',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.6s',
  },
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    
    '&::before': {
      left: '100%',
    },
  },
}));

// Styled component for the animated login button
const LoginButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  padding: '8px 16px',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  backgroundColor: 'transparent',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  fontWeight: 600,
  marginRight: '8px',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: '100%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 0,
  },
  
  '& .login-content': {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s ease',
  },
  
  '& .login-icon': {
    marginRight: '8px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '18px',
  },
  
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 15px rgba(0, 123, 255, 0.2)`,
    border: `2px solid ${theme.palette.primary.main}`,
    
    '&::before': {
      width: '100%',
    },
    
    '& .login-content': {
      color: 'white',
    },
    
    '& .login-icon': {
      transform: 'rotate(360deg) scale(1.1)',
      color: 'white',
    },
  },
}));

const HomepageNavbar = () => {
  const navigate = useNavigate(); // Add this hook
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all-ads');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Updated login handler to navigate to Login page
  const handleLoginClick = () => {
    navigate('/auth'); // Navigate to the login page
    setMobileOpen(false); // Close mobile drawer if open
  };

  const navigationItems = [
    { id: 'all-ads', label: 'All Ads', icon: <HomeIcon className="nav-icon" />, href: '#all-ads' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    handleLanguageClose();
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Mobile drawer content with enhanced animations
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #007BFF 0%, #00C853 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            mr: 1.5,
            width: 36,
            height: 36,
            backdropFilter: 'blur(10px)'
          }}>
            <ShoppingBagIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            BODIMA.lk
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ pt: 2, px: 2 }}>
        {navigationItems.map((item, index) => (
          <ListItem 
            key={item.label}
            button 
            onClick={() => handleTabClick(item.id)}
            sx={{ 
              mb: 1, 
              borderRadius: 2,
              background: activeTab === item.id ? 'linear-gradient(135deg, #007BFF 0%, #00C853 100%)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'text.primary',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: activeTab === item.id 
                  ? 'linear-gradient(135deg, #0056b3 0%, #059669 100%)' 
                  : 'rgba(0, 123, 255, 0.06)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: activeTab === item.id ? 'white' : 'primary.main', 
              minWidth: 40,
              transition: 'all 0.3s ease'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem 
          button 
          onClick={handleLoginClick}
          sx={{ 
            mb: 1,
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              transform: 'translateX(4px)',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <ListItemIcon sx={{ 
            color: 'primary.main',
            minWidth: 40,
            transition: 'all 0.4s ease'
          }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Login"
            primaryTypographyProps={{ 
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          />
        </ListItem>
        
        <ListItem 
          button 
          onClick={handleLanguageClick}
          sx={{ 
            borderRadius: 2,
            '&:hover': { 
              bgcolor: 'action.hover',
              transform: 'translateX(4px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText 
            primary={`${selectedLanguage.flag} ${selectedLanguage.label}`}
            primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
          />
          <ExpandMoreIcon />
        </ListItem>
        
        <Box sx={{ p: 1, mt: 2 }}>
          <CTAButton
            fullWidth
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            POST YOUR AD
          </CTAButton>
        </Box>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 3 : 1}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'background.paper',
          color: 'text.primary',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: scrolled ? 'none' : '1px solid rgba(0,0,0,0.08)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          zIndex: 1200, // Ensure it's above sidebar
        }}
      >
        <Toolbar sx={{ px: { xs: 2, lg: 4 }, py: 0.5, minHeight: '64px' }}>
          {/* Logo */}
          <AnimatedLogo sx={{ mr: 4 }} onClick={() => navigate('/')}>
            <Avatar
              className="logo-icon"
              sx={{
                width: 40,
                height: 40,
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 22, color: 'white' }} />
            </Avatar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 800, 
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #007BFF 0%, #00C853 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              OUTSOURCE
            </Typography>
          </AnimatedLogo>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <AnimatedNavButton
                    key={item.label}
                    onClick={() => handleTabClick(item.id)}
                    startIcon={React.cloneElement(item.icon, { className: 'nav-icon' })}
                    sx={{
                      color: activeTab === item.id ? 'primary.main' : 'text.primary',
                      fontWeight: activeTab === item.id ? 700 : 500,
                      
                      '&::before': {
                        width: activeTab === item.id ? '80%' : 0,
                      }
                    }}
                  >
                    {item.label}
                  </AnimatedNavButton>
                ))}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Right side buttons container */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Language Selector */}
                <Button
                  color="inherit"
                  onClick={handleLanguageClick}
                  endIcon={<ExpandMoreIcon />}
                  startIcon={<LanguageIcon />}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {selectedLanguage.flag} {selectedLanguage.label}
                </Button>

                {/* Login Button */}
                <LoginButton onClick={handleLoginClick}>
                  <Box className="login-content">
                    <LoginIcon className="login-icon" />
                    Login
                  </Box>
                </LoginButton>

                {/* POST YOUR AD Button */}
                <CTAButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                  }}
                >
                  POST YOUR AD
                </CTAButton>
              </Box>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: 'text.primary',
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'rotate(90deg)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            minWidth: 180,
            overflow: 'visible',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            selected={selectedLanguage.code === language.code}
            sx={{
              py: 1.5,
              px: 2,
              mx: 0.5,
              my: 0.25,
              borderRadius: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          >
            <Typography sx={{ mr: 1.5, fontSize: '1rem' }}>{language.flag}</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{language.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </ThemeProvider>
  );
};

export default HomepageNavbar;