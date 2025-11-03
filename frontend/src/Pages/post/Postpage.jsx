// src/Pages/post/Postpage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
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
} from "@mui/material";
import { Timer, AccountBalanceWallet, Image as ImageIcon } from "@mui/icons-material";
import Sortingpanel from "../../Components/Home/Sortingpanel";
import ItemForm from "../../Components/post/PostsForm";
import ItemDetails from "../../Components/post/PostsDetailsview";
import http from "../../Utils/http"; // ✅ use shared axios instance

// ---- helpers ----
function stringToColor(str = "A") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
function stringAvatar(name = "A") {
  return { sx: { bgcolor: stringToColor(name), width: 28, height: 28 }, children: name[0].toUpperCase() };
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
        bgcolor: "#e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ImageIcon sx={{ fontSize: 64, color: "#90caf9" }} />
      <Typography variant="body2" color="text.secondary" mt={2}>
        No image uploaded
      </Typography>
    </Box>
  );
}
// Build absolute file URL from http baseURL (which ends with /api)
const fileURL = (relPath) => {
  if (!relPath) return null;
  const apiRoot = (http.defaults?.baseURL || "").replace(/\/api\/?$/, "");
  return `${apiRoot}${relPath}`;
};

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    specializations: "",
    contact: "",
  });
  const [image, setImage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch posts via shared http
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

  // Filtering + Sorting
  useEffect(() => {
    let result = [...items];

    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      result = result.filter((item) => String(item.title || "").toLowerCase().includes(q));
    }

    if (filters.category && filters.category !== "All Categories") {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      const [min, max] = filters.priceRange;
      result = result.filter((item) => Number(item.price || 0) >= min && Number(item.price || 0) <= max);
    }

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (Number(b.rating || 0) - Number(a.rating || 0)));
        break;
      default:
        // "newest" or any other → leave as API order
        break;
    }

    setFilteredItems(result);
  }, [filters, sortOption, items]);

  // Form handlers
  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setImage(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      if (String(formData.specializations || "").trim() !== "") {
        const arr = String(formData.specializations)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        data.set("specializations", JSON.stringify(arr));
      }

      await http.post("/posts", data, {
        headers: { /* Authorization handled by interceptor */ "Content-Type": "multipart/form-data" },
      });

      const res = await http.get("/posts");
      setItems(res.data || []);
      setIsFormOpen(false);
    } catch (err) {
      // You can surface err.message to a toast/snackbar if needed
      console.error(err);
    }
  };

  // Sortingpanel handlers
  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleSortChange = (newSort) => setSortOption(newSort);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
      }}
    >
      {/* Left Sorting Panel - Desktop Only */}
      {!isMobile && (
        <Box sx={{ width: "320px", flexShrink: 0 }}>
          <Sortingpanel onFiltersChange={handleFiltersChange} onSortChange={handleSortChange} />
        </Box>
      )}

      {/* Mobile Sorting Panel */}
      {isMobile && <Sortingpanel onFiltersChange={handleFiltersChange} onSortChange={handleSortChange} />}

      {/* Right Posts Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {filteredItems.length > 0 ? (
          <Stack spacing={3}>
            {filteredItems.map((item) => {
              const imgSrc = fileURL(item.image);
              return (
                <Card
                  key={item._id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: 2,
                    overflow: "hidden",
                    height: { xs: "auto", sm: 280 },
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,123,255,0.15)",
                    },
                  }}
                >
                  {/* Image */}
                  <Box sx={{ flex: { xs: "0 0 200px", sm: "0 0 280px" }, height: { xs: 200, sm: "100%" } }}>
                    {imgSrc ? (
                      <CardMedia component="img" image={imgSrc} alt={item.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </Box>

                  {/* Details */}
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: { xs: 2, sm: 3 },
                    }}
                  >
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Chip label={item.category || "Category"} color="primary" size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                        </Typography>
                      </Stack>

                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          mb: 2,
                        }}
                      >
                      
                        {truncateWords(item.description, 10)}{" "}
                        {String(item.description || "").split(/\s+/).length > 10 && (
                          <Button
                            size="small"
                            sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                            onClick={() => setSelectedItem(item)}
                          >
                            See more
                          </Button>
                        )}
                      </Typography>

                      <Stack direction="row" spacing={2} mb={1.5}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Timer fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDeliveryTime(item.deliveryTime)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AccountBalanceWallet fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {Number(item.price || 0).toLocaleString()} LKR
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar {...stringAvatar(item.owner?.name || "A")} />
                        <Typography variant="body2" color="text.secondary">
                          {item.owner?.name || "anonymous"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 1.5 }} />
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          background: "linear-gradient(135deg,#007BFF,#0056b3)",
                          fontWeight: 600,
                          textTransform: "none",
                          py: 1,
                          "&:hover": { background: "linear-gradient(135deg,#0056b3,#003d82)" },
                        }}
                        onClick={() => setSelectedItem(item)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No posts found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Try adjusting your filters
            </Typography>
          </Box>
        )}
      </Box>

      {isFormOpen && (
        <ItemForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {selectedItem && <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </Box>
  );
}
