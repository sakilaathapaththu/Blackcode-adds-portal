// src/Components/HomepageNavbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { clearToken, isAuthenticated } from "../../Utils/auth"; // ✅ from your original navbar

// ---------------- THEME ----------------
const theme = createTheme({
  palette: {
    primary: {
      main: "#007BFF",
      light: "#42A5F5",
      dark: "#0056b3",
    },
    secondary: {
      main: "#00C853",
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#F6F9FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(20px)",
        },
      },
    },
  },
});

// ---------------- STYLED COMPONENTS ----------------
const AnimatedNavButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 0,
    height: "3px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "translateX(-50%)",
    borderRadius: "2px 2px 0 0",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 123, 255, 0.04)",
    transform: "translateY(-1px)",
    "&::before": { width: "80%" },
    "& .nav-icon": {
      transform: "rotate(5deg) scale(1.1)",
      color: theme.palette.primary.main,
    },
  },
  "& .nav-icon": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginRight: "8px",
    fontSize: "20px",
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: "12px",
  padding: "10px 20px",
  position: "relative",
  overflow: "hidden",
  color: "white",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.6s",
  },
  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 8px 25px rgba(0, 123, 255, 0.3)",
    "&::before": { left: "100%" },
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  padding: "8px 16px",
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  backgroundColor: "transparent",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: 600,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: "100%",
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 0,
  },
  "& .login-content": {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    transition: "color 0.3s ease",
  },
  "& .login-icon": {
    marginRight: "8px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "18px",
  },
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 4px 15px rgba(0, 123, 255, 0.2)`,
    "&::before": { width: "100%" },
    "& .login-content": { color: "white" },
    "& .login-icon": { transform: "rotate(360deg) scale(1.1)", color: "white" },
  },
}));

// ---------------- NAVBAR COMPONENT ----------------
export default function HomepageNavbar() {
  const navigate = useNavigate();
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("all-ads");
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("lg"));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AUTH LOGIC
  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
    navigate("/login");
  };
  const handleLogin = () => navigate("/login");

  const handleLanguageClick = (event) => setLanguageAnchor(event.currentTarget);
  const handleLanguageClose = () => setLanguageAnchor(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleTabClick = (id) => setActiveTab(id);

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "si", label: "සිංහල", flag: "🇱🇰" },
    { code: "ta", label: "தமிழ்", flag: "🇱🇰" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const navigationItems = [
    { id: "all-ads", label: "All Ads", icon: <HomeIcon className="nav-icon" /> },
  ];

  // MOBILE DRAWER CONTENT
  const drawer = (
    <Box sx={{ width: 280, bgcolor: "background.paper", height: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #007BFF 0%, #00C853 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              mr: 1.5,
              width: 36,
              height: 36,
            }}
          >
            <ShoppingBagIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            OUTSOURCE
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ p: 2 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => handleTabClick(item.id)}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor:
                activeTab === item.id
                  ? "linear-gradient(135deg, #007BFF 0%, #00C853 100%)"
                  : "transparent",
              color: activeTab === item.id ? "white" : "text.primary",
            }}
          >
            <ListItemIcon
              sx={{
                color: activeTab === item.id ? "white" : "primary.main",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        {loggedIn ? (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem button onClick={handleLogin}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={scrolled ? 3 : 1}
        sx={{
          bgcolor: scrolled ? "rgba(255,255,255,0.95)" : "background.paper",
          color: "text.primary",
          transition: "all 0.3s ease",
          borderBottom: scrolled ? "none" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, lg: 4 }, py: 0.5, minHeight: "64px" }}>
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 1.5,
                bgcolor: "primary.main",
              }}
            >
              <ShoppingBagIcon />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #007BFF 0%, #00C853 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              OUTSOURCE
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Box sx={{ ml: 4, display: "flex", gap: 1 }}>
                {navigationItems.map((item) => (
                  <AnimatedNavButton
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    startIcon={item.icon}
                    sx={{
                      color:
                        activeTab === item.id
                          ? "primary.main"
                          : "text.primary",
                      fontWeight: activeTab === item.id ? 700 : 500,
                      "&::before": {
                        width: activeTab === item.id ? "80%" : 0,
                      },
                    }}
                  >
                    {item.label}
                  </AnimatedNavButton>
                ))}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Right side buttons */}
              <Button
                color="inherit"
                onClick={handleLanguageClick}
                endIcon={<ExpandMoreIcon />}
                startIcon={<LanguageIcon />}
                sx={{ mr: 1 }}
              >
                {selectedLanguage.flag} {selectedLanguage.label}
              </Button>

              {loggedIn ? (
                <LoginButton onClick={handleLogout}>
                  <Box className="login-content">
                    <LogoutIcon className="login-icon" />
                    Logout
                  </Box>
                </LoginButton>
              ) : (
                <LoginButton onClick={handleLogin}>
                  <Box className="login-content">
                    <LoginIcon className="login-icon" />
                    Login
                  </Box>
                </LoginButton>
              )}

              <CTAButton startIcon={<AddIcon />}>POST YOUR AD</CTAButton>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        TransitionComponent={Fade}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => {
              setSelectedLanguage(lang);
              handleLanguageClose();
            }}
          >
            {lang.flag} {lang.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </ThemeProvider>
  );
}
