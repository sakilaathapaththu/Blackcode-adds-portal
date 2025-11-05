import React from "react";
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

// --- Helper functions for letter avatar ---
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

// --- Format delivery time: "1 day" or "5 days" ---
function formatDeliveryTime(time) {
  const number = parseInt(time, 10);
  if (Number.isNaN(number)) return time || "—";
  return `${number} ${number === 1 ? "day" : "days"}`;
}

// --- Phone helpers ---
const getPhone = (item) => {
  const raw =
    (item?.contact && String(item.contact)) ||
    (item?.owner?.phone && String(item.owner.phone)) ||
    "";
  return raw.trim();
};

// keep digits and + only for tel: href
const normalizeTelHref = (raw) => {
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned; // don't guess country code
};

export default function ItemDetails({ item, onClose }) {
  if (!item) return null;

  const phoneRaw = getPhone(item);
  const telHref = normalizeTelHref(phoneRaw);
  const hasPhone = Boolean(telHref);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
        animation: "fadeIn 0.3s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          width: "90%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          p: 3,
          boxShadow: 6,
          transform: "scale(0.9)",
          animation: "scaleUp 0.3s forwards",
          "@keyframes scaleUp": {
            from: { transform: "scale(0.9)", opacity: 0 },
            to: { transform: "scale(1)", opacity: 1 },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category */}
        <Chip label={item.category} color="primary" sx={{ mb: 1 }} />

        {/* Title */}
        <Typography variant="h5" gutterBottom>
          {item.title}
        </Typography>

        {/* Description */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.description}
        </Typography>

        {/* Provider */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar {...stringAvatar(item.owner?.name || "A")} />
          <Typography variant="body2">{item.owner?.name || "anonymous"}</Typography>
        </Stack>

        {/* Delivery & Price */}
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

        {/* Ratings (placeholder) */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2">(12 reviews)</Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Specializations */}
        {Array.isArray(item.specializations) && item.specializations.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Specializations
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
              {item.specializations.map((spec, idx) => (
                <Chip key={idx} label={spec} color="secondary" size="small" />
              ))}
            </Box>
          </>
        )}

        {/* Contact */}
        <Typography variant="h6" gutterBottom>
          Contact Provider
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-word" }}>
          📞 {phoneRaw || "Not Provided"}
        </Typography>

        {/* Actions */}
        <Stack spacing={1}>
          {hasPhone ? (
            <Button
              component="a"
              href={`tel:${telHref}`}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                bgcolor: "#1a237e",
                "&:hover": { bgcolor: "#0d47a1" },
                transition: "all 0.3s ease",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              📞 Call Now
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              disabled
              sx={{
                bgcolor: "#9e9e9e",
                "&:hover": { bgcolor: "#9e9e9e" },
                transition: "all 0.3s ease",
                textTransform: "none",
                fontWeight: 700,
              }}
              title="No contact number provided"
            >
              📞 Call Now
            </Button>
          )}

          <Button
            variant="outlined"
            fullWidth
            color="error"
            onClick={onClose}
            sx={{ transition: "all 0.3s ease", textTransform: "none", fontWeight: 600 }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
