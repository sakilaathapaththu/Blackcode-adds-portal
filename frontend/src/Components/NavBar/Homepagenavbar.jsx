import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Drawer,
  List, ListItemText, useTheme, useMediaQuery, Box, Fade, Avatar, Divider,
  ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
  Alert, ListItemButton
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
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { AuthContext } from "../../Context/AuthContext";

// Theme
const theme = createTheme({
  palette: {
    primary: { main: "#007BFF", light: "#42A5F5", dark: "#0056b3" },
    secondary: { main: "#00C853", light: "#34D399", dark: "#059669" },
    background: { default: "#F6F9FC", paper: "#FFFFFF" },
    text: { primary: "#212121", secondary: "#555555" },
  },
  typography: {
    fontFamily: '"Inter","SF Pro Display","Segoe UI","Roboto",sans-serif',
    h6: { fontWeight: 700, letterSpacing: "-0.02em" },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "-0.01em" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backdropFilter: "blur(20px)" },
      },
    },
  },
});

// Styleds
const AnimatedNavButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 0,
    height: "3px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    transform: "translateX(-50%)",
    borderRadius: "2px 2px 0 0",
  },
  "&:hover": {
    backgroundColor: "rgba(0,123,255,0.04)",
    transform: "translateY(-1px)",
    "&::before": { width: "80%" },
    "& .nav-icon": { transform: "rotate(5deg) scale(1.1)", color: theme.palette.primary.main },
  },
  "& .nav-icon": { transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", marginRight: 8, fontSize: 20 },
}));

const AnimatedLogo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    "& .logo-icon": {
      transform: "rotate(360deg)",
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  "& .logo-icon": {
    transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 12,
  padding: "10px 20px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  color: "white",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.6s",
  },
  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 8px 25px rgba(0,123,255,0.3)",
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    "&::before": { left: "100%" },
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  position: "relative",
  borderRadius: 8,
  padding: "8px 16px",
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  backgroundColor: "transparent",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
  fontWeight: 600,
  marginRight: 8,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: "100%",
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 0,
  },
  "& .login-content": { position: "relative", zIndex: 1, display: "flex", alignItems: "center" },
  "& .login-icon": { marginRight: 8, transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", fontSize: 18 },
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 15px rgba(0,123,255,0.2)",
    border: `2px solid ${theme.palette.primary.main}`,
    "&::before": { width: "100%" },
    "& .login-content": { color: "white" },
    "& .login-icon": { transform: "rotate(360deg) scale(1.1)", color: "white" },
  },
}));

const HomepageNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("all-ads");
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("lg"));

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLanguageClick = (e) => setLanguageAnchor(e.currentTarget);
  const handleLanguageClose = () => setLanguageAnchor(null);
  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  // 👉 NOW sends users to LOGIN page
  const handleLoginClick = () => {
    navigate("/auth?mode=login");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const goProfile = () => {
    setMobileOpen(false);
    navigate("/profile");
  };

  const navigationItems = [
    { id: "all-ads", label: "All Ads", icon: <HomeIcon className="nav-icon" /> },
  ];

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "si", label: "සිංහල", flag: "🇱🇰" },
    { code: "ta", label: "தமிழ்", flag: "🇱🇰" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    handleLanguageClose();
  };

  // ✅ All Ads now navigates to home
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "all-ads") {
      navigate("/");
      setMobileOpen(false);
    }
  };

  // 🔐 Gate posting; if not logged in → dialog + snack → Login
  const handlePostAd = () => {
    if (!user) {
      setLoginDialogOpen(true);
      setSnackOpen(true);
      setMobileOpen(false);
      return;
    }
    navigate("/posts/new");
    setMobileOpen(false);
  };

  // Drawer
  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "background.paper" }}>
      <Box
        sx={{
          p: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: 1, borderColor: "divider",
          background: "linear-gradient(135deg, #007BFF 0%, #00C853 100%)", color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 1.5, width: 36, height: 36, backdropFilter: "blur(10px)" }}>
            <ShoppingBagIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            SpotMyAd.COM
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ pt: 2, px: 2 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            sx={{
              mb: 1,
              borderRadius: 2,
              background:
                activeTab === item.id
                  ? "linear-gradient(135deg, #007BFF 0%, #00C853 100%)"
                  : "transparent",
              color: activeTab === item.id ? "white" : "text.primary",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                background:
                  activeTab === item.id
                    ? "linear-gradient(135deg, #0056b3 0%, #059669 100%)"
                    : "rgba(0,123,255,0.06)",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: activeTab === item.id ? "white" : "primary.main",
                minWidth: 40,
                transition: "all 0.3s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 2 }} />

        {!user ? (
          <ListItemButton
            onClick={handleLoginClick}
            sx={{
              mb: 1,
              borderRadius: 2,
              border: "2px solid",
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
                transform: "translateX(4px)",
                "& .MuiListItemIcon-root": { color: "white" },
              },
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <ListItemIcon sx={{ color: "primary.main", minWidth: 40, transition: "all 0.4s ease" }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
          </ListItemButton>
        ) : (
          <>
            <ListItemButton
              onClick={goProfile}
              sx={{
                mb: 1,
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover", transform: "translateX(4px)" },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
            </ListItemButton>

            <ListItemButton
              onClick={handleLogout}
              sx={{
                mb: 1,
                borderRadius: 2,
                border: "2px solid",
                borderColor: "error.main",
                "&:hover": {
                  bgcolor: "error.main",
                  color: "white",
                  transform: "translateX(4px)",
                  "& .MuiListItemIcon-root": { color: "white" },
                },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
            </ListItemButton>
          </>
        )}

        <ListItemButton
          onClick={handleLanguageClick}
          sx={{
            borderRadius: 2,
            "&:hover": { bgcolor: "action.hover", transform: "translateX(4px)" },
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${selectedLanguage.flag} ${selectedLanguage.label}`}
            primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
          />
          <ExpandMoreIcon />
        </ListItemButton>

        <Box sx={{ p: 1, mt: 2 }}>
          <CTAButton
            fullWidth
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            sx={{ py: 1.5, fontSize: "0.9rem", fontWeight: 700 }}
            onClick={handlePostAd}
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
          bgcolor: scrolled ? "rgba(255,255,255,0.95)" : "background.paper",
          color: "text.primary",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderBottom: scrolled ? "none" : "1px solid rgba(0,0,0,0.08)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, lg: 4 }, py: 0.5, minHeight: "64px" }}>
          {/* Logo */}
          <AnimatedLogo sx={{ mr: 4 }} onClick={() => navigate("/")}>
            <Avatar className="logo-icon" sx={{ width: 40, height: 40, mr: 1.5, boxShadow: "0 2px 8px rgba(0,123,255,0.3)" }}>
              <ShoppingBagIcon sx={{ fontSize: 22, color: "white" }} />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: "1.5rem",
                background: "linear-gradient(135deg, #007BFF 0%, #00C853 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              SpotMyAd
            </Typography>
          </AnimatedLogo>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {navigationItems.map((item) => (
                  <AnimatedNavButton
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    startIcon={React.cloneElement(item.icon, { className: "nav-icon" })}
                    sx={{
                      color: activeTab === item.id ? "primary.main" : "text.primary",
                      fontWeight: activeTab === item.id ? 700 : 500,
                      "&::before": { width: activeTab === item.id ? "80%" : 0 },
                    }}
                  >
                    {item.label}
                  </AnimatedNavButton>
                ))}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Right actions */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={handleLanguageClick}
                  endIcon={<ExpandMoreIcon />}
                  startIcon={<LanguageIcon />}
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": { bgcolor: "action.hover", transform: "translateY(-1px)" },
                  }}
                >
                  {selectedLanguage.flag} {selectedLanguage.label}
                </Button>

                {!user ? (
                  <LoginButton onClick={handleLoginClick}>
                    <Box className="login-content">
                      <LoginIcon className="login-icon" />
                      Login
                    </Box>
                  </LoginButton>
                ) : (
                  <>
                    <Button onClick={goProfile} startIcon={<AccountCircleIcon />} sx={{ fontWeight: 600, mr: 1 }}>
                      {user?.name || "Profile"}
                    </Button>
                    <Button onClick={handleLogout} color="error" variant="outlined" sx={{ fontWeight: 700, borderWidth: 2 }}>
                      Logout
                    </Button>
                  </>
                )}

                <CTAButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ fontSize: "0.9rem", fontWeight: 700, px: 3, py: 1 }}
                  onClick={handlePostAd}
                >
                  POST YOUR AD
                </CTAButton>
              </Box>
            </Box>
          )}

          {/* Mobile menu */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: "text.primary",
                  borderRadius: 2,
                  p: 1.5,
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": { bgcolor: "primary.main", color: "white", transform: "rotate(90deg)" },
                }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      {/* <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            minWidth: 180,
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
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
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: "primary.main", color: "white", transform: "translateX(4px)" },
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.main" },
              },
            }}
          >
            <Typography sx={{ mr: 1.5, fontSize: "1rem" }}>{language.flag}</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>{language.label}</Typography>
          </MenuItem>
        ))}
      </Menu> */}

      {/* Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" } }}
      >
        {drawer}
      </Drawer>

      {/* Login required dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Login required</DialogTitle>
        <DialogContent>
          Please log in to post an ad.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setLoginDialogOpen(false);
              navigate("/auth?mode=login");
            }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)}>
        <Alert severity="info" onClose={() => setSnackOpen(false)}>
          Please log in to continue.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default HomepageNavbar;
