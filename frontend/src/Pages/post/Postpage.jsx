import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Timer,
  AccountBalanceWallet,
  Image as ImageIcon,
  Star,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import Sortingpanel from "../../Components/Home/Sortingpanel";
import PostsDetailsview from "../../Components/post/PostsDetailsview";
import http from "../../Utils/http";

// ---- helpers ----
function stringToColor(str = "A") {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
function stringAvatar(name = "A") {
  return {
    sx: { bgcolor: stringToColor(name), width: 32, height: 32 },
    children: name[0].toUpperCase(),
  };
}
function formatDeliveryTime(time) {
  const n = parseInt(time, 10);
  if (Number.isNaN(n)) return time || "—";
  return `${n} ${n === 1 ? "day" : "days"}`;
}
function truncateWords(text, wordLimit) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}
function ImagePlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ImageIcon sx={{ fontSize: 48, color: "#cbd5e1" }} />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        No image
      </Typography>
    </Box>
  );
}

// ✅ Build absolute file URL
const fileURL = (relPath) => {
  if (!relPath) return null;
  if (/^https?:\/\//i.test(relPath)) return relPath;
  let p = relPath.startsWith("/") ? relPath : `/${relPath}`;
  if (p.startsWith("/api/")) return p;
  const base = (http.defaults?.baseURL || "/api").replace(/\/+$/, "");
  return `${base}${p}`;
};

export default function PostsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await http.get("/posts");
        setItems(res.data || []);
        setFilteredItems(res.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...items];
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      result = result.filter((i) =>
        String(i.title || "").toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== "All Categories") {
      result = result.filter((i) => i.category === filters.category);
    }
    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      const [min, max] = filters.priceRange;
      result = result.filter(
        (i) => Number(i.price || 0) >= min && Number(i.price || 0) <= max
      );
    }
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default:
        break;
    }
    setFilteredItems(result);
    setCarouselIndex(0);
  }, [filters, sortOption, items]);

  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleSortChange = (newSort) => setSortOption(newSort);

  // Carousel navigation
  const sponsoredItems = filteredItems.filter((i) => i.sponsored);
  const regularItems = filteredItems.filter((i) => !i.sponsored);
  
  const cardsPerView = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, sponsoredItems.length - cardsPerView);

  const handlePrevious = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Fixed carousel scroll effect
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || sponsoredItems.length === 0) return;

    const firstCard = container.querySelector(".sponsored-card");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.columnGap || computedStyle.gap || 16);

    container.scrollTo({
      left: carouselIndex * (cardWidth + gap),
      behavior: "smooth",
    });
  }, [carouselIndex, sponsoredItems.length]);
  
  // Auto-slide effect for sponsored carousel
  useEffect(() => {
    if (sponsoredItems.length <= cardsPerView) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [sponsoredItems.length, maxIndex, cardsPerView]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#F6F9FC",
        }}
      >
        <CircularProgress size={48} thickness={4} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#F6F9FC", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          maxWidth: "1600px",
          mx: "auto",
          gap: 3,
          px: { xs: 2, md: 3 },
          py: 3,
        }}
      >
        {/* Sorting Panel - Desktop */}
        {!isMobile && (
          <Box
            sx={{
              width: "320px",
              flexShrink: 0,
            }}
          >
            <Sortingpanel
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
            />
          </Box>
        )}

        {/* Mobile Sorting Panel */}
        {isMobile && (
          <Sortingpanel
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* 🟡 Refined Sponsored Posts Carousel Section */}
          {sponsoredItems.length > 0 && (
            <Box 
              sx={{ 
                mb: 4, 
                overflow: "visible", 
                pt: 3,
                pb: 3,
                px: 3,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #FFFEF7 0%, #FFFDF5 50%, #FFFCF3 100%)",
                border: "1px solid #FFE8B8",
                boxShadow: "0 2px 12px rgba(255, 193, 7, 0.08)",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Star sx={{ color: "#FF8F00", fontSize: 26 }} />
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: "#E65100" }}
                  >
                    Sponsored Advertisements
                  </Typography>
                </Stack>

                {/* Carousel Navigation */}
                {sponsoredItems.length > cardsPerView && (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={handlePrevious}
                      disabled={carouselIndex === 0}
                      sx={{
                        bgcolor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        "&:disabled": { bgcolor: "#f5f5f5", opacity: 0.5 },
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={handleNext}
                      disabled={carouselIndex >= maxIndex}
                      sx={{
                        bgcolor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        "&:disabled": { bgcolor: "#f5f5f5", opacity: 0.5 },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Stack>
                )}
              </Stack>

              {/* Carousel Container */}
              <Box
                ref={carouselRef}
                sx={{
                  display: "flex",
                  gap: 2.5,
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  pb: 2,
                  pt: 1,
                }}
              >
                {sponsoredItems.map((item) => {
                  const imgSrc = fileURL(item.image);
                  return (
                    <Card
                      key={item._id}
                      className="sponsored-card"
                      sx={{
                        minWidth: {
                          xs: "100%",
                          md: `calc((100% - ${(cardsPerView - 1) * 10}px) / ${cardsPerView})`,
                        },
                        maxWidth: {
                          xs: "100%",
                          md: `calc((100% - ${(cardsPerView - 1) * 10}px) / ${cardsPerView})`,
                        },
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid #FFD54F",
                        bgcolor: "white",
                        boxShadow: "0 3px 14px rgba(255,193,7,0.12)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 20px rgba(255,193,7,0.18)",
                        },
                      }}
                    >
                      {/* Sponsored Badge - Inside card top-right */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          px: 2,
                          py: 0.6,
                          borderRadius: "16px",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          color: "#000",
                          background: "linear-gradient(135deg, #FFD54F, #FFB300)",
                          boxShadow: "0 2px 8px rgba(255,193,7,0.25)",
                          zIndex: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          border: "1px solid rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        <Star sx={{ fontSize: 13 }} />
                        Sponsored
                      </Box>

                      {/* Image */}
                      <Box sx={{ height: 200, position: "relative", overflow: "hidden" }}>
                        {imgSrc ? (
                          <CardMedia
                            component="img"
                            image={imgSrc}
                            alt={item.title}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Chip
                          label={item.category || "Category"}
                          size="small"
                          sx={{
                            mb: 1.5,
                            width: "fit-content",
                            bgcolor: "#FFF8E1",
                            color: "#F57F17",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            border: "1px solid #FFE082",
                          }}
                        />

                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            minHeight: "2.6em",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1.5,
                            flexGrow: 1,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                            fontSize: "0.8rem",
                          }}
                        >
                          {truncateWords(item.description, 12)}
                        </Typography>

                        <Divider sx={{ mb: 1.5 }} />

                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Timer sx={{ fontSize: 16, color: "action" }} />
                              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                                {formatDeliveryTime(item.deliveryTime)}
                              </Typography>
                            </Stack>
                            <Avatar
                              {...stringAvatar(item.owner?.name || "A")}
                              sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                            />
                          </Stack>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#F57F17"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {Number(item.price || 0).toLocaleString()} LKR
                          </Typography>

                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              textTransform: "none",
                              borderRadius: 1,
                              background: "linear-gradient(135deg,#FFB300,#FF8F00)",
                              color: "#000",
                              fontWeight: 700,
                              py: 1,
                              fontSize: "0.85rem",
                              boxShadow: "0 4px 12px rgba(255,179,0,0.3)",
                              "&:hover": {
                                background: "linear-gradient(135deg,#FFA000,#FF6F00)",
                                boxShadow: "0 6px 16px rgba(255,179,0,0.4)",
                              },
                            }}
                            onClick={() => setSelectedItem(item)}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* 🧩 Regular Posts Section */}
          {regularItems.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3, color: "#1976d2" }}
              >
                All Advertisements
              </Typography>

              {/* Regular Posts Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2.5,
                  pb: 1,
                }}
              >
                {regularItems.map((item) => {
                  const imgSrc = fileURL(item.image);
                  return (
                    <Card
                      key={item._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        position: "relative",
                        bgcolor: "white",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      {/* Image */}
                      <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
                        {imgSrc ? (
                          <CardMedia
                            component="img"
                            image={imgSrc}
                            alt={item.title}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Chip
                          label={item.category || "Category"}
                          size="small"
                          sx={{
                            mb: 1,
                            width: "fit-content",
                            bgcolor: "#E3F2FD",
                            color: "#1565C0",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />

                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            minHeight: "2.6em",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1.5,
                            flexGrow: 1,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                            fontSize: "0.8rem",
                          }}
                        >
                          {truncateWords(item.description, 12)}
                        </Typography>

                        <Divider sx={{ mb: 1.5 }} />

                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Timer sx={{ fontSize: 16, color: "action" }} />
                              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                                {formatDeliveryTime(item.deliveryTime)}
                              </Typography>
                            </Stack>
                            <Avatar
                              {...stringAvatar(item.owner?.name || "A")}
                              sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                            />
                          </Stack>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {Number(item.price || 0).toLocaleString()} LKR
                          </Typography>

                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              textTransform: "none",
                              borderRadius: 1,
                              bgcolor: "#1976d2",
                              fontWeight: 700,
                              py: 0.9,
                              fontSize: "0.85rem",
                              boxShadow: "0 4px 12px rgba(25,118,210,0.25)",
                              "&:hover": {
                                bgcolor: "#1565c0",
                                boxShadow: "0 6px 16px rgba(25,118,210,0.35)",
                              },
                            }}
                            onClick={() => setSelectedItem(item)}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No posts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {selectedItem && (
        <PostsDetailsview
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </Box>
  );
}