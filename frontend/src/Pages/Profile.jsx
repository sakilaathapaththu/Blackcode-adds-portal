
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Divider,
} from "@mui/material";
import {
  Timer,
  AccountBalanceWallet,
  Image as ImageIcon,
  Event as EventIcon,
  Stars as StarsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import http from "../Utils/http"; // ✅ use shared axios instance

// ---------- Helpers ----------
const formatDeliveryTime = (time) => {
  if (!time) return "—";
  const n = parseInt(time, 10);
  if (Number.isNaN(n)) return time;
  return `${n} ${n === 1 ? "day" : "days"}`;
};

const fmtDateTime = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
};

const StatusChip = ({ status }) => {
  const map = {
    approved: { color: "success", label: "Approved" },
    pending: { color: "warning", label: "Pending" },
    canceled: { color: "error", label: "Canceled" },
  };
  const s = map[status] || { color: "default", label: status || "Unknown" };
  return (
    <Chip
      size="small"
      color={s.color}
      variant={s.color === "default" ? "outlined" : "filled"}
      label={s.label}
    />
  );
};

function ImagePlaceholder() {
  return (
    <Box
      sx={{
        height: { xs: 180, sm: 220, md: 260 },
        bgcolor: "#e3f2fd",
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ImageIcon sx={{ fontSize: 56, color: "#90caf9" }} />
      <Typography variant="body2" color="text.secondary" mt={1}>
        No image uploaded
      </Typography>
    </Box>
  );
}

// ✅ Build absolute file URL via API base (works in prod and dev)
const fileURL = (relPath) => {
  if (!relPath) return null;

  // Already absolute?
  if (/^https?:\/\//i.test(relPath)) return relPath;

  // Normalise incoming relative path
  let p = relPath.startsWith("/") ? relPath : `/${relPath}`;

  // If backend already included '/api/...', use as-is
  if (p.startsWith("/api/")) return p;

  // Otherwise prefix with axios baseURL (ends with /api)
  const base = (http.defaults?.baseURL || "/api").replace(/\/+$/, "");
  return `${base}${p}`; // '/api/uploads/filename.jpg'
};

function PostImage({ src, alt }) {
  if (!src) return <ImagePlaceholder />;
  const full = fileURL(src);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 180, sm: 220, md: 260 },
        borderRadius: 1.5,
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${full})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
          transform: "scale(1.05)",
          opacity: 0.4,
        }}
      />
      <Box
        component="img"
        src={full}
        alt={alt}
        loading="lazy"
        decoding="async"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "100%",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}

function LoadingGrid() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={220} />
            <CardContent>
              <Skeleton width="60%" />
              <Skeleton width="40%" />
              <Skeleton width="90%" />
              <Skeleton width="70%" />
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Skeleton variant="rectangular" height={36} width={96} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={36} width={96} sx={{ borderRadius: 1, ml: 1 }} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  // -------- API calls now use shared `http` ----------
  const fetchUserPosts = async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: "" }));
      const res = await http.get("/posts/user/me"); // baseURL already includes /api
      setPosts(res.data || []);
    } catch (err) {
      setState((s) => ({ ...s, error: err?.message || "Failed to load your posts." }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    if (token) fetchUserPosts();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await http.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.message || "Failed to delete post");
    }
  };

  const handleEdit = (post) => navigate(`/posts/edit/${post._id}`);
  const handleAddPost = () => navigate("/posts/new");

  // --------- UI ---------
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 9, md: 10 }, mb: 4, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} lineHeight={1.2}>
            {user?.name ? `${user.name}'s Profile` : "Your Profile"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: "break-word" }}>
            @{user?.username} · {user?.email}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPost}
          sx={{
            alignSelf: { xs: "stretch", sm: "center" },
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            py: 1,
          }}
        >
          Post Your Ad
        </Button>
      </Stack>

      {state.loading ? (
        <LoadingGrid />
      ) : state.error ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="error" sx={{ mb: 1.5 }}>
            {state.error}
          </Typography>
          <Button variant="outlined" onClick={fetchUserPosts}>
            Retry
          </Button>
        </Box>
      ) : posts.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ImageIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                You haven’t created any posts yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click “Post Your Ad” to create your first listing.
              </Typography>
            </Box>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddPost} sx={{ textTransform: "none" }}>
            Create Post
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => {
            const sponsored = !!post.sponsored;
            return (
              <Grid item xs={12} sm={6} lg={4} key={post._id}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Image */}
                  <Box sx={{ p: 1.5, pb: 0 }}>
                    <PostImage src={post.image} alt={post.title} />
                  </Box>

                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip label={post.category || "Category"} size="small" color="primary" />
                      <StatusChip status={post.status} />
                      {sponsored && (
                        <Chip
                          icon={<StarsIcon />}
                          label="Sponsored"
                          size="small"
                          sx={{
                            bgcolor: "warning.light",
                            color: "warning.contrastText",
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mt: 0.5, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.description}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mt: 0.5 }}>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <AccountBalanceWallet fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                          {Number(post.price || 0).toLocaleString()} LKR
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Timer fontSize="small" />
                        <Typography variant="body2">{formatDeliveryTime(post.deliveryTime)}</Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Stack direction="row" spacing={1.5} flexWrap="wrap">
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <EventIcon fontSize="small" />
                          <Typography variant="caption">
                            Start: <b>{fmtDateTime(post.startDate)}</b>
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <EventIcon fontSize="small" />
                          <Typography variant="caption">
                            End: <b>{fmtDateTime(post.endDate)}</b>
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Created: {fmtDateTime(post.createdAt)}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      mt: "auto",
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      onClick={() => handleEdit(post)}
                      startIcon={<EditIcon />}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        flex: { xs: "1 1 100%", sm: "0 0 auto" },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post._id)}
                      startIcon={<DeleteIcon />}
                      variant="outlined"
                      color="error"
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        flex: { xs: "1 1 100%", sm: "0 0 auto" },
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
