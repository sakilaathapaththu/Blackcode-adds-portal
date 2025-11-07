
// src/Components/ItemDetails.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  Rating,
} from "@mui/material";
import { Timer, AccountBalanceWallet } from "@mui/icons-material";
import http from "../../Utils/http";

// --- Helpers (unchanged) ---
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
function stringAvatar(name) {
  const safe = name || "A";
  return { sx: { bgcolor: stringToColor(safe), width: 36, height: 36 }, children: safe[0].toUpperCase() };
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
// Build image URL (unchanged)
function resolveImageUrl(img) {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  const base = (http?.defaults?.baseURL || "/api").replace(/\/+$/, "");
  const s = String(img);
  if (s.startsWith("/uploads")) return `${base}${s}`;
  if (s.startsWith("uploads/")) return `${base}/${s}`;
  if (s.startsWith("/api/")) return `${window.location.origin}${s}`;
  return `${base}/${s.replace(/^\/+/, "")}`;
}

export default function ItemDetails({ item, onClose }) {
  const [openImage, setOpenImage] = useState(false);
  if (!item) return null;

  const phoneRaw = getPhone(item);
  const telHref = normalizeTelHref(phoneRaw);
  const waHref = buildWhatsAppHref(phoneRaw);
  const imageUrl = item?.image ? resolveImageUrl(item.image) : null;

  return (
    <>
      {/* Modal Overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1200,
          // small safe padding on phones so the card isn't flush with edges
          px: { xs: 1.5, md: 0 },
          py: { xs: 2, md: 0 },
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            width: "100%",
            maxWidth: 900,
            maxHeight: { xs: "92dvh", md: "90vh" }, // small vertical margin on phones
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            boxShadow: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Image */}
          <Box
            sx={{
              flex: { xs: "none", md: "1 1 45%" },
              width: { xs: "100%", md: "45%" },
              overflow: "hidden",
              bgcolor: "#e3f2fd",
              cursor: imageUrl ? "pointer" : "default",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // 🟢 key mobile tweak: use sensible height on phones, desktop keeps tall image
              height: { xs: "45vh", sm: "50vh", md: "90vh" },
              minHeight: { xs: 220, md: "auto" },
            }}
            onClick={() => imageUrl && setOpenImage(true)}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Typography color="text.secondary">No image available</Typography>
            )}
          </Box>

          {/* Right: Scrollable content */}
          <Box
            sx={{
              flex: { xs: "none", md: "1 1 55%" },
              width: { xs: "100%", md: "55%" },
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              // 🟢 key mobile tweak: independent scroll area sized to complement image
              maxHeight: { xs: "45vh", sm: "42vh", md: "90vh" },
              overflowY: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "3px" },
            }}
          >
            <Chip label={item.category} color="primary" sx={{ mb: 1, alignSelf: "flex-start" }} />

            <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              {item.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 2, fontSize: { xs: "0.9rem", sm: "1rem" }, whiteSpace: "pre-line" }}
            >
              {item.description}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Avatar {...stringAvatar(item.owner?.name || "A")} />
              <Typography variant="body2">{item.owner?.name || "anonymous"}</Typography>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ mb: 2, flexWrap: "wrap" }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Timer fontSize="small" />
                <Typography>{formatDeliveryTime(item.deliveryTime)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccountBalanceWallet fontSize="small" />
                <Typography>{Number(item.price || 0).toLocaleString()} LKR</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly size="small" />
              <Typography variant="body2">(12 reviews)</Typography>
            </Stack>

            {Array.isArray(item.specializations) && item.specializations.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Specializations
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                  {item.specializations.map((spec, idx) => (
                    <Chip
                      key={idx}
                      label={spec}
                      color="secondary"
                      size="small"
                      sx={{ bgcolor: "#6a1b9a", color: "#fff" }}
                    />
                  ))}
                </Box>
              </>
            )}

            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
              Contact Provider
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-word" }}>
              📞 {phoneRaw || "Not Provided"}
            </Typography>

            {/* Buttons pinned to the bottom of the scroll column */}
            <Stack spacing={1} sx={{ mt: "auto" }}>
              <Button
                component="a"
                href={telHref ? `tel:${telHref}` : undefined}
                disabled={!telHref}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                📞 Call Now
              </Button>

              <Button
                component="a"
                href={waHref || undefined}
                disabled={!waHref}
                target="_blank"
                rel="noopener"
                variant="outlined"
                fullWidth
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                💬 Message on WhatsApp
              </Button>

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

      {/* Full Image Popup */}
      {openImage && imageUrl && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.9)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
            animation: "fadeInImage 0.2s ease-in",
            "@keyframes fadeInImage": { from: { opacity: 0 }, to: { opacity: 1 } },
            p: { xs: 1.5, md: 0 }, // a bit of breathing room on phones
          }}
          onClick={() => setOpenImage(false)}
        >
          <img
            src={imageUrl}
            alt="Full View"
            style={{
              maxWidth: "95vw",
              maxHeight: "95vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          />
        </Box>
      )}
    </>
  );
}
