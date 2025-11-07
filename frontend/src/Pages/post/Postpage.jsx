
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
  IconButton,
} from "@mui/material";
import {
  Timer,
  AccountBalanceWallet,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import Sortingpanel from "../../Components/Home/Sortingpanel";
import ItemForm from "../../Components/post/PostsForm";
import ItemDetails from "../../Components/post/PostsDetailsview";
import http from "../../Utils/http"; // shared axios instance

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
    sx: { bgcolor: stringToColor(name), width: 28, height: 28 },
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

// ✅ Build absolute file URL via API base (works in prod and dev)
const fileURL = (relPath) => {
  if (!relPath) return null;
  if (/^https?:\/\//i.test(relPath)) return relPath;
  let p = relPath.startsWith("/") ? relPath : `/${relPath}`;
  if (p.startsWith("/api/")) return p;
  const base = (http.defaults?.baseURL || "/api").replace(/\/+$/, "");
  return `${base}${p}`;
};

// Month title like "November 2025"
function monthTitle(d = new Date()) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

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

  // --- Sponsored carousel refs/auto-advance ---
  const sponsoredViewportRef = React.useRef(null);
  const sponsoredTrackRef = React.useRef(null);
  const stepRef = React.useRef(0);
  const timerRef = React.useRef(null);
  const AUTO_MS = 2000;

  // Compute one-card step (card width + gap)
  const computeStep = React.useCallback(() => {
    const track = sponsoredTrackRef.current;
    if (!track) return 0;
    const firstCard = track.querySelector("[data-sponsor-card]");
    if (!firstCard) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "24");
    return firstCard.offsetWidth + gap;
  }, []);

  const slideNext = React.useCallback(() => {
    const vp = sponsoredViewportRef.current;
    const track = sponsoredTrackRef.current;
    const step = stepRef.current || computeStep();
    if (!vp || !track || step <= 0) return;

    const half = track.scrollWidth / 2; // because we render items twice
    if (vp.scrollLeft + step >= half) {
      vp.scrollTo({ left: 0, behavior: "auto" });
    } else {
      vp.scrollBy({ left: step, behavior: "smooth" });
    }
  }, [computeStep]);

  const slidePrev = React.useCallback(() => {
    const vp = sponsoredViewportRef.current;
    const track = sponsoredTrackRef.current;
    const step = stepRef.current || computeStep();
    if (!vp || !track || step <= 0) return;

    if (vp.scrollLeft - step <= 0) {
      const half = track.scrollWidth / 2;
      vp.scrollTo({ left: half, behavior: "auto" });
    }
    vp.scrollBy({ left: -step, behavior: "smooth" });
  }, [computeStep]);

  const startAuto = React.useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(slideNext, AUTO_MS);
  }, [slideNext]);

  const stopAuto = React.useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const vp = sponsoredViewportRef.current;
    if (!vp) return;

    stepRef.current = computeStep();

    const onResize = () => {
      stepRef.current = computeStep();
    };

    const onEnter = () => stopAuto();
    const onLeave = () => startAuto();

    window.addEventListener("resize", onResize);
    vp.addEventListener("mouseenter", onEnter);
    vp.addEventListener("mouseleave", onLeave);

    startAuto();

    return () => {
      stopAuto();
      window.removeEventListener("resize", onResize);
      vp.removeEventListener("mouseenter", onEnter);
      vp.removeEventListener("mouseleave", onLeave);
    };
  }, [computeStep, startAuto, stopAuto]);

  // Fetch posts
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
      result = result.filter((item) =>
        String(item.title || "").toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== "All Categories") {
      result = result.filter((item) => item.category === filters.category);
    }
    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      const [min, max] = filters.priceRange;
      result = result.filter(
        (item) =>
          Number(item.price || 0) >= min && Number(item.price || 0) <= max
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
        break; // newest: keep API order
    }

    setFilteredItems(result);
  }, [filters, sortOption, items]);

  // Form handlers
  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      const res = await http.get("/posts");
      setItems(res.data || []);
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Sortingpanel handlers
  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleSortChange = (newSort) => setSortOption(newSort);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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

      {/* Right Posts Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {filteredItems.length > 0 ? (
          <>
            {/* ---- Page Title with Month ---- */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Posts — {monthTitle(new Date())}
            </Typography>

            {(() => {
              const sponsored = filteredItems.filter((i) => i.sponsored);
              const regular = filteredItems.filter((i) => !i.sponsored);

              return (
                <>
                  {/* ---------- SPONSORED: one-row carousel (3/2/1) ---------- */}
                  {sponsored.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 1.5, fontWeight: 600 }}
                      >
                        Sponsored
                      </Typography>

                      {/* ✅ Wrapper controls both arrows' positioning */}
                      <Box sx={{ position: "relative", mb: 4 }}>
                        {/* Left Arrow */}
                        <IconButton
                          aria-label="previous"
                          onClick={() => {
                            stopAuto();
                            slidePrev();
                            startAuto();
                          }}
                          sx={{
                            position: "absolute",
                            left: { xs: 6, sm: 8 },
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            bgcolor: "rgba(255,255,255,0.9)",
                            boxShadow: 2,
                            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                          }}
                          size="small"
                        >
                          <ChevronLeft />
                        </IconButton>

                        {/* Viewport */}
                        <Box
                          ref={sponsoredViewportRef}
                          sx={{
                            overflow: "hidden",
                            width: "100%",
                          }}
                        >
                          {/* Track: render two copies for seamless wrap */}
                          <Box
                            ref={sponsoredTrackRef}
                            sx={{
                              display: "flex",
                              gap: 3, // JS uses this to compute the step
                              whiteSpace: "nowrap",
                            }}
                          >
                            {[...sponsored, ...sponsored].map((item, idx) => {
                              const imgSrc = fileURL(item.image);
                              return (
                                <Card
                                  data-sponsor-card
                                  key={`${item._id}-${idx}`}
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    height: "100%",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                    border: "3px solid #ffe100ff",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      transform: "translateY(-4px)",
                                      boxShadow:
                                        "0 8px 25px rgba(0,123,255,0.15)",
                                    },
                                    // responsive width: 1 / 2 / 3
                                    flex: {
                                      xs: "0 0 100%",
                                      sm: "0 0 50%",
                                      md: "0 0 33.3333%",
                                    },
                                    minWidth: {
                                      xs: "100%",
                                      sm: "50%",
                                      md: "33.3333%",
                                    },
                                  }}
                                >
                                  {/* Sponsored badge */}
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 12,
                                      left: 12,
                                      px: 1.8,
                                      py: 0.6,
                                      borderRadius: "8px",
                                      fontWeight: 700,
                                      fontSize: "0.75rem",
                                      color: "#000",
                                      textTransform: "uppercase",
                                      background:
                                        "linear-gradient(90deg, #ffeb3b, #ffca28, #ffeb3b)",
                                      backgroundSize: "200% 100%",
                                      animation: "shine 2s linear infinite",
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                      "@keyframes shine": {
                                        "0%": { backgroundPosition: "200% 0" },
                                        "100%": {
                                          backgroundPosition: "-200% 0",
                                        },
                                      },
                                    }}
                                  >
                                    SPONSORED
                                  </Box>

                                  <Box sx={{ height: 200 }}>
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

                                  <CardContent
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                      height: "100%",
                                    }}
                                  >
                                    <Box>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        mb={1}
                                      >
                                        <Chip
                                          label={item.category || "Category"}
                                          color="primary"
                                          size="small"
                                        />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {item.createdAt
                                            ? new Date(
                                                item.createdAt
                                              ).toLocaleDateString()
                                            : ""}
                                        </Typography>
                                      </Stack>

                                      <Typography
                                        variant="h6"
                                        sx={{ mb: 1, fontWeight: 600 }}
                                      >
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
                                        {String(item.description || "").split(
                                          /\s+/
                                        ).length > 10 && (
                                          <Button
                                            size="small"
                                            sx={{
                                              textTransform: "none",
                                              p: 0,
                                              minWidth: "auto",
                                            }}
                                            onClick={() =>
                                              setSelectedItem(item)
                                            }
                                          >
                                            See more
                                          </Button>
                                        )}
                                      </Typography>

                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        mb={1.5}
                                      >
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={0.5}
                                        >
                                          <Timer
                                            fontSize="small"
                                            color="action"
                                          />
                                          <Typography variant="body2">
                                            {formatDeliveryTime(
                                              item.deliveryTime
                                            )}
                                          </Typography>
                                        </Stack>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={0.5}
                                        >
                                          <AccountBalanceWallet
                                            fontSize="small"
                                            color="action"
                                          />
                                          <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            color="primary"
                                          >
                                            {Number(
                                              item.price || 0
                                            ).toLocaleString()}{" "}
                                            LKR
                                          </Typography>
                                        </Stack>
                                      </Stack>

                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Avatar
                                          {...stringAvatar(
                                            item.owner?.name || "A"
                                          )}
                                        />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
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
                                          background:
                                            "linear-gradient(135deg,#007BFF,#0056b3)",
                                          fontWeight: 600,
                                          textTransform: "none",
                                          py: 1,
                                          "&:hover": {
                                            background:
                                              "linear-gradient(135deg,#0056b3,#003d82)",
                                          },
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
                          </Box>
                        </Box>

                        {/* Right Arrow */}
                        <IconButton
                          aria-label="next"
                          onClick={() => {
                            stopAuto();
                            slideNext();
                            startAuto();
                          }}
                          sx={{
                            position: "absolute",
                            right: { xs: 6, sm: 8 },
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            bgcolor: "rgba(255,255,255,0.9)",
                            boxShadow: 2,
                            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                          }}
                          size="small"
                        >
                          <ChevronRight />
                        </IconButton>
                      </Box>
                    </>
                  )}

                  {/* ---------- ALL POSTS ---------- */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1.5, fontWeight: 600 }}
                  >
                    All posts
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 3,
                    }}
                  >
                    {regular.map((item) => {
                      const imgSrc = fileURL(item.image);
                      return (
                        <Card
                          key={item._id}
                          sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden",
                            height: "100%",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 8px 25px rgba(0,123,255,0.15)",
                            },
                          }}
                        >
                          <Box sx={{ height: 200 }}>
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

                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                            }}
                          >
                            <Box>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                mb={1}
                              >
                                <Chip
                                  label={item.category || "Category"}
                                  color="primary"
                                  size="small"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.createdAt
                                    ? new Date(
                                        item.createdAt
                                      ).toLocaleDateString()
                                    : ""}
                                </Typography>
                              </Stack>

                              <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: 600 }}
                              >
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
                                {String(item.description || "").split(/\s+/)
                                  .length > 10 && (
                                  <Button
                                    size="small"
                                    sx={{
                                      textTransform: "none",
                                      p: 0,
                                      minWidth: "auto",
                                    }}
                                    onClick={() => setSelectedItem(item)}
                                  >
                                    See more
                                  </Button>
                                )}
                              </Typography>

                              <Stack direction="row" spacing={2} mb={1.5}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.5}
                                >
                                  <Timer fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {formatDeliveryTime(item.deliveryTime)}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.5}
                                >
                                  <AccountBalanceWallet
                                    fontSize="small"
                                    color="action"
                                  />
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary"
                                  >
                                    {Number(item.price || 0).toLocaleString()}{" "}
                                    LKR
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  {...stringAvatar(item.owner?.name || "A")}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
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
                                  background:
                                    "linear-gradient(135deg,#007BFF,#0056b3)",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  py: 1,
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg,#0056b3,#003d82)",
                                  },
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
                  </Box>
                </>
              );
            })()}
          </>
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
      {selectedItem && (
        <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </Box>
  );
}
