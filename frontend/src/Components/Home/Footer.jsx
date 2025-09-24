import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Fade,
  Zoom,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  KeyboardArrowUp,
  ShoppingBag,
} from '@mui/icons-material';
import { ThemeProvider, createTheme, styled, keyframes } from '@mui/material/styles';

// Updated theme with recommended color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
      light: '#42A5F5',
      dark: '#0056b3',
    },
    secondary: {
      main: '#00C853',
      light: '#4CAF50',
      dark: '#00A047',
    },
    background: {
      default: '#F6F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#555555',
    },
    warning: {
      main: '#FF9800',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
});

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #0A192F 0%, #1a365d 50%, #2c5282 100%)`,
  backgroundSize: '400% 400%',
  animation: `${gradient} 12s ease infinite`,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M20 20c0-8.837-7.163-16-16-16S-12 11.163-12 20s7.163 16 16 16 16-7.163 16-16zM0 0h40v40H0V0z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
    opacity: 0.1,
    zIndex: 1,
  },
}));

const AnimatedSocialIcon = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  margin: '0 6px',
  width: '48px',
  height: '48px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-3px) scale(1.1)',
    background: 'linear-gradient(135deg, #007BFF, #00C853)',
    boxShadow: '0 10px 25px rgba(0, 123, 255, 0.4)',
    animation: `${pulse} 0.6s ease-in-out`,
  },
}));

const FloatingLogo = styled(Box)(({ theme }) => ({
  animation: `${float} 4s ease-in-out infinite`,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const BackToTopButton = styled(IconButton)(({ theme, isMobile }) => ({
  position: 'fixed',
  bottom: isMobile ? '20px' : '30px',
  right: isMobile ? '20px' : '30px',
  background: 'linear-gradient(135deg, #007BFF, #00C853)',
  color: 'white',
  width: isMobile ? '48px' : '56px',
  height: isMobile ? '48px' : '56px',
  boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
  zIndex: 1000,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-5px) scale(1.1)',
    boxShadow: '0 15px 35px rgba(0, 123, 255, 0.4)',
    animation: `${pulse} 0.6s ease-in-out`,
  },
}));

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Handle scroll effect for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300); // Show button after scrolling 300px
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Support', href: '#support' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook />, href: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter />, href: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram />, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <LinkedIn />, href: 'https://linkedin.com' },
    { name: 'YouTube', icon: <YouTube />, href: 'https://youtube.com' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <FooterContainer>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ py: 6 }}>
            <Grid container spacing={4} alignItems="center">
              {/* Brand Section */}
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1000}>
                  <Box>
                    <FloatingLogo sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            mr: 2,
                            background: 'linear-gradient(135deg, #007BFF, #00C853)',
                            boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
                          }}
                        >
                          <ShoppingBag sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #007BFF, #00C853)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'brightness(2)',
                          }}
                        >
                          OUTSOURCE.COM
                        </Typography>
                      </Box>
                    </FloatingLogo>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 3, 
                        lineHeight: 1.6,
                      }}
                    >
                      Your comprehensive solution for all your needs.
                    </Typography>

                    {/* Contact Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ color: '#00C853', mr: 2, fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          helloblackcodedev@gmail.com
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1200}>
                  <Box sx={{ textAlign: isMobile ? 'left' : 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        mb: 2,
                        fontWeight: 700,
                      }}
                    >
                      Quick Links
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 3,
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}>
                      {quickLinks.map((link, index) => (
                        <Zoom in={true} timeout={1400 + index * 150} key={link.name}>
                          <Link
                            href={link.href}
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              
                              '&:hover': {
                                color: '#00C853',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            {link.name}
                          </Link>
                        </Zoom>
                      ))}
                    </Box>
                  </Box>
                </Fade>
              </Grid>

              {/* Social Links */}
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1400}>
                  <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        mb: 2,
                        fontWeight: 700,
                      }}
                    >
                      Follow Us
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      justifyContent: isMobile ? 'flex-start' : 'flex-end',
                      flexWrap: 'wrap'
                    }}>
                      {socialLinks.map((social, index) => (
                        <Zoom in={true} timeout={1600 + index * 100} key={social.name}>
                          <AnimatedSocialIcon
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                          >
                            {social.icon}
                          </AnimatedSocialIcon>
                        </Zoom>
                      ))}
                    </Box>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Box>

          {/* Divider */}
          <Divider sx={{ 
            borderColor: 'rgba(255,255,255,0.1)', 
            my: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
          }} />

          {/* Bottom Section */}
          <Box sx={{ 
            py: 3, 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Fade in={true} timeout={1800}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textAlign: isMobile ? 'center' : 'left' 
                }}
              >
                © 2025 BlackCode Devs. All rights reserved.
              </Typography>
            </Fade>

            <Fade in={true} timeout={2000}>
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexWrap: 'wrap', 
                alignItems: 'center',
                justifyContent: isMobile ? 'center' : 'flex-end'
              }}>
                <Link 
                  href="#privacy" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    textDecoration: 'none', 
                    fontSize: '0.875rem',
                    '&:hover': { color: '#00C853' } 
                  }}
                >
                  Privacy
                </Link>
                <Link 
                  href="#terms" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    textDecoration: 'none',
                    fontSize: '0.875rem', 
                    '&:hover': { color: '#00C853' } 
                  }}
                >
                  Terms
                </Link>
                
                {/* Simple Developer Credit */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '0.8rem',
                    fontWeight: 400
                  }}
                >
                  Developed by{' '}
                  <Link
                    href="https://www.blackcodedev.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#00C853',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        color: '#fff2cbff',
                      }
                    }}
                  >
                    BlackCode Devs
                  </Link>
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Container>

        {/* Back to Top Button - Only shows when scrolled */}
        {showBackToTop && (
          <Zoom in={true} timeout={300}>
            <BackToTopButton 
              onClick={scrollToTop} 
              aria-label="Back to top"
              isMobile={isMobile}
            >
              <KeyboardArrowUp sx={{ fontSize: isMobile ? 20 : 24 }} />
            </BackToTopButton>
          </Zoom>
        )}
      </FooterContainer>
    </ThemeProvider>
  );
};

export default Footer;