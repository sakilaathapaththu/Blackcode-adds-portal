import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  Rating,
  Divider,
} from "@mui/material";
import { Timer, AccountBalanceWallet } from "@mui/icons-material";

// --- Helper functions ---
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
function stringAvatar(name) {
  const safe = name || "A";
  return {
    sx: {
      bgcolor: stringToColor(safe),
      width: 36,
      height: 36,
    },
    children: safe[0].toUpperCase(),
  };
}
function formatDeliveryTime(time) {
  const number = parseInt(time, 10);
  if (Number.isNaN(number)) return time || "—";
  return `${number} ${number === 1 ? "day" : "days"}`;
}
const getPhone = (item) => {
  const raw =
    (item?.contact && String(item.contact)) ||
    (item?.owner?.phone && String(item.owner.phone)) ||
    "";
  return raw.trim();
};
const normalizeTelHref = (raw) => {
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned;
};
const buildWhatsAppHref = (raw) => {
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d+0-9]/g, "");
  if (cleaned.startsWith("+")) {
    const digits = cleaned.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }
  const digitsOnly = cleaned.replace(/\D/g, "");
  const DEFAULT_CC = "94";
  const withCC = digitsOnly.length === 10 ? DEFAULT_CC + digitsOnly : digitsOnly;
  return withCC ? `https://wa.me/${withCC}` : "";
};

export default function ItemDetails({ item, onClose }) {
  // hooks first
  const [openImage, setOpenImage] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const phoneRaw = getPhone(item);
  const telHref = normalizeTelHref(phoneRaw);
  const hasPhone = Boolean(telHref);
  const waHref = buildWhatsAppHref(phoneRaw);
  const hasWhatsApp = Boolean(waHref);

  // robust image URL detection (supports many backend shapes)
  const resolveImageUrl = () => {
    if (!item) return null;
    // Common fields to check
    const candidates = [
      item.image,
      item.imageUrl,
      item.image_url,
      item.img,
      item.photo,
      item.picture,
      item.images && item.images[0],
      item.images?.length ? item.images[0].url || item.images[0] : null,
      item.media && item.media[0] && (item.media[0].url || item.media[0].path),
    ];

    for (let c of candidates) {
      if (!c) continue;
      // if object with url property
      if (typeof c === "object") {
        if (c.url) return String(c.url);
        if (c.path) return String(c.path);
        if (c.filename) return String(c.filename);
      } else if (typeof c === "string") {
        // If the string is already an absolute URL, return as-is.
        if (c.startsWith("http") || c.startsWith("//")) return c;
        // if relative path, prepend API base if available (don't guess country)
        const base = process.env.REACT_APP_API_URL || "";
        // Trim leading slashes to avoid double slashes
        const trimmed = c.replace(/^\/+/, "");
        return base ? `${base.replace(/\/+$/, "")}/${trimmed}` : `/${trimmed}`;
      }
    }
    return null;
  };

  const imageUrl = !imgError ? resolveImageUrl() : null;

  // layout notes:
  // - the outer modal prevents overflow, inner details box scrolls
  // - on mobile, buttons are sticky at bottom of details box so they are always reachable
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1400,
          px: { xs: 1, sm: 2 },
        }}
        onClick={onClose}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "100%",
            maxWidth: 920,
            height: { xs: "94vh", sm: "92vh", md: "90vh" },
            bgcolor: "#fff",
            borderRadius: { xs: 14, md: 16 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          {/* Left image column */}
          <Box
            onClick={() => imageUrl && setOpenImage(true)}
            sx={{
              width: { xs: "100%", md: "45%" },
              minHeight: { xs: 180, sm: 220, md: "100%" },
              height: { md: "100%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#eaf6ff",
              cursor: imageUrl ? "pointer" : "default",
              overflow: "hidden",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title || "image"}
                onError={() => setImgError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Box sx={{ px: 2 }}>
                <Typography align="center" color="text.secondary">
                  No image available
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right details column */}
          <Box
            sx={{
              width: { xs: "100%", md: "55%" },
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 },
              // this area scrolls - hide scrollbar but keep scrolling
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {/* Title and short header */}
            <Box sx={{ mb: 1 }}>
              <Chip label={item.category} color="primary" sx={{ mb: 1 }} />
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontSize: { xs: "1.05rem", sm: "1.2rem", md: "1.35rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {item.title || "Untitled"}
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: "text.primary",
                whiteSpace: "pre-line",
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              {item.description || "No description provided."}
            </Typography>

            {/* bullet list / features - keep if present */}
            {item.features && Array.isArray(item.features) && (
              <Box sx={{ mb: 1 }}>
                {item.features.map((f, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                    • {f}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Provider row */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Avatar {...stringAvatar(item.owner?.name || "A")} />
              <Typography variant="body2">{item.owner?.name || "anonymous"}</Typography>
            </Stack>

            {/* Delivery & Price */}
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Timer fontSize="small" />
                <Typography variant="body2">{formatDeliveryTime(item.deliveryTime)}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AccountBalanceWallet fontSize="small" />
                <Typography variant="body2">{Number(item.price || 0).toLocaleString()} LKR</Typography>
              </Stack>
            </Stack>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly size="small" />
              <Typography variant="body2">(12 reviews)</Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Specializations */}
            {Array.isArray(item.specializations) && item.specializations.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Specializations
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                  {item.specializations.map((spec, idx) => (
                    <Chip
                      key={idx}
                      label={spec}
                      size="small"
                      sx={{ bgcolor: "#7b1fa2", color: "#fff", fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* Contact heading */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Contact Provider
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-word" }}>
              📞 {phoneRaw || "Not Provided"}
            </Typography>

            {/* Push buttons to bottom on tall screens; make them sticky on mobile */}
            <Box
              sx={{
                mt: "auto",
                // sticky container so buttons remain visible on mobile while scrolling details
                position: { xs: "sticky", md: "static" },
                bottom: { xs: 0, md: "auto" },
                left: 0,
                right: 0,
                bgcolor: { xs: "rgba(255,255,255,0.95)", md: "transparent" },
                py: { xs: 1, md: 0 },
                pt: { xs: 1.5, md: 0 },
                boxShadow: { xs: "0 -6px 20px rgba(0,0,0,0.06)", md: "none" },
                borderTopLeftRadius: { xs: 8, md: 0 },
                borderTopRightRadius: { xs: 8, md: 0 },
              }}
            >
              <Stack spacing={1} sx={{ px: { xs: 0, md: 0 } }}>
                {hasPhone ? (
                  <Button
                    component="a"
                    href={`tel:${telHref}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#1a237e",
                      "&:hover": { bgcolor: "#0d47a1" },
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    📞 Call Now
                  </Button>
                ) : (
                  <Button variant="contained" fullWidth disabled>
                    📞 Call Now
                  </Button>
                )}

                {hasWhatsApp ? (
                  <Button
                    component="a"
                    href={waHref}
                    target="_blank"
                    rel="noopener"
                    variant="outlined"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    💬 Message on WhatsApp
                  </Button>
                ) : (
                  <Button variant="outlined" fullWidth disabled>
                    💬 Message on WhatsApp
                  </Button>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  color="error"
                  onClick={onClose}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Close
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Full-screen image viewer */}
      {openImage && imageUrl && (
        <Box
          onClick={() => setOpenImage(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.92)",
            p: 2,
          }}
        >
          <img
            src={imageUrl}
            alt="full view"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
            }}
            onError={() => setImgError(true)}
          />
        </Box>
      )}
    </>
  );
}
