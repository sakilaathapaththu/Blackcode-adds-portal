// src/Components/Home/Sortingpanel.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  Button,
  Stack,
  Paper,
  InputAdornment,
  Drawer,
  Fab,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Sort as SortIcon,
  RestartAlt,
  Search as SearchIcon,
  FilterAltOutlined,
  FilterAlt,
  Close as CloseIcon,
} from "@mui/icons-material";

export default function Sortingpanel({
  onFiltersChange = () => {},
  onSortChange = () => {},
}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    priceRange: [0, 100000],
  });

  const [sortOption, setSortOption] = useState("newest");
  const [isFiltering, setIsFiltering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
    const hasActiveFilters =
      filters.search ||
      filters.category !== "All Categories" ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 100000;
    setIsFiltering(hasActiveFilters);
  }, [filters]);

  useEffect(() => {
    onSortChange(sortOption);
  }, [sortOption]);

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "All Categories",
      priceRange: [0, 100000],
    };
    setFilters(resetFilters);
    setSortOption("newest");
    onFiltersChange(resetFilters);
    onSortChange("newest");
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(value);

  const categories = [
    "All Categories",
    "Web Development",
    "Design",
    "Marketing",
    "AI & ML",
    "Consulting",
    "Content Writing",
    "Education",
    "Others",
  ];

  return (
    <>
      {/* ✅ Floating Filter Button (mobile & desktop independent positioning) */}
      <Fab
        color="primary"
        size="medium"
        onClick={() => setMobileOpen(true)}
        sx={{
          position: "fixed",
          bottom: isMobile ? (showBackToTop ? 90 : 20) : (showBackToTop ? 100 : 40),
          right: isMobile ? 20 : 30,
          zIndex: 1200,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#007BFF,#00C853)",
          boxShadow: "0 4px 20px rgba(0,123,255,0.4)",
          color: "white",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          "&:hover": {
            background: "linear-gradient(135deg,#0056b3,#009e4f)",
            transform: "translateY(-4px) scale(1.1)",
            boxShadow: "0 8px 24px rgba(0,123,255,0.5)",
          },
        }}
      >
        {isFiltering ? <FilterAlt /> : <FilterAltOutlined />}
      </Fab>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "85%" : "420px",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            height: "100%",
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: isFiltering
                    ? "linear-gradient(135deg,#00C853,#007BFF)"
                    : "linear-gradient(135deg,#007BFF,#0056b3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFiltering ? (
                  <FilterAlt sx={{ color: "white" }} />
                ) : (
                  <FilterAltOutlined sx={{ color: "white" }} />
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#007BFF,#00C853)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Filters & Sorting
              </Typography>
            </Box>
            <IconButton onClick={() => setMobileOpen(false)} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search by title or keyword..."
            fullWidth
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Category */}
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price Range */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Price Range (LKR)
            </Typography>
            <Typography variant="body2" color="#007BFF" fontWeight={600} mb={1}>
              {formatPrice(filters.priceRange[0])} -{" "}
              {formatPrice(filters.priceRange[1])}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) =>
                setFilters({ ...filters, priceRange: newValue })
              }
              step={500}
              min={0}
              max={100000}
              sx={{
                color: "#007BFF",
                "& .MuiSlider-thumb": {
                  bgcolor: "white",
                  border: "3px solid #007BFF",
                },
              }}
            />
          </Box>

          {/* Sort */}
          <FormControl size="small" fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price-low">Price: Low → High</MenuItem>
              <MenuItem value="price-high">Price: High → Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          {/* Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" fullWidth startIcon={<RestartAlt />} onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SortIcon />}
              onClick={() => {
                onFiltersChange(filters);
                onSortChange(sortOption);
                setMobileOpen(false);
              }}
              sx={{
                background: "linear-gradient(135deg,#007BFF,#00C853)",
                "&:hover": {
                  background: "linear-gradient(135deg,#0056b3,#009e4f)",
                },
              }}
            >
              Apply
            </Button>
          </Stack>
        </Paper>
      </Drawer>
    </>
  );
}