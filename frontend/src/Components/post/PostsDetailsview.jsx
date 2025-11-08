// src/Components/ItemDetails.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { 
  Timer, 
  AccountBalanceWallet, 
  WhatsApp, 
  Close,
  Phone 
} from "@mui/icons-material";
import http from "../../Utils/http";

// --- Helpers (unchanged) ---
function stringToColor(str) {
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

function stringAvatar(name) {
  const safe = name || "A";
  return {
    sx: { 
      bgcolor: stringToColor(safe), 
      width: 40, 
      height: 40,
      fontSize: "1.1rem",
      fontWeight: 600,
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
  const withCC =
    digitsOnly.length === 10 ? DEFAULT_CC + digitsOnly : digitsOnly;
  return withCC ? `https://wa.me/${withCC}` : "";
};

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
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: { xs: 2, md: 3 },
            width: "100%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Top Right */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "#fff",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s",
            }}
          >
            <Close />
          </IconButton>

          {/* Left: Image Section */}
          <Box
            sx={{
              width: { xs: "100%", md: "45%" },
              bgcolor: "#f5f5f5",
              position: "relative",
              cursor: imageUrl ? "pointer" : "default",
              flexShrink: 0,
              overflow: "hidden",
            }}
            onClick={() => imageUrl && setOpenImage(true)}
          >
            <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 250, md: 400 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f5f5f5",
                }}
            >
              {imageUrl ? (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={item.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#e0e0e0",
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    No image available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right: Details Section */}
          <Box
            sx={{
              flex: 1,
              width: { xs: "100%", md: "55%" },
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              maxHeight: { xs: "55vh", md: "90vh" },
              p: { xs: 3, sm: 4 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {/* Category Chip */}
            <Chip
              label={item.category}
              sx={{
                mb: 2,
                alignSelf: "flex-start",
                bgcolor: "#e3f2fd",
                color: "#0288d1",
                fontWeight: 600,
                fontSize: "0.85rem",
                height: 28,
              }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                fontWeight: 700,
                color: "#1a237e",
                mb: 2,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                color: "#424242",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {item.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Provider Info */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center" 
              sx={{ mb: 3 }}
            >
              <Avatar {...stringAvatar(item.owner?.name || "A")} />
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem", mb: 0.3 }}
                >
                  Service Provider
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ fontWeight: 600, color: "#424242" }}
                >
                  {item.owner?.name || "Anonymous"}
                </Typography>
              </Box>
            </Stack>

            {/* Delivery Time & Price */}
            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Timer sx={{ color: "#0288d1", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Delivery Time
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDeliveryTime(item.deliveryTime)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBalanceWallet sx={{ color: "#0288d1", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Price
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={700}
                    sx={{ color: "#1a237e" }}
                  >
                    {Number(item.price || 0).toLocaleString()} LKR
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Specializations */}
            {Array.isArray(item.specializations) &&
              item.specializations.length > 0 && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      mb: 1.5, 
                      fontWeight: 700,
                      color: "#1a237e",
                      fontSize: "0.9rem",
                    }}
                  >
                    Specializations
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    {item.specializations.map((spec, idx) => (
                      <Chip
                        key={idx}
                        label={spec}
                        size="small"
                        sx={{
                          bgcolor: "#e8eaf6",
                          color: "#3f51b5",
                          fontWeight: 500,
                          fontSize: "0.8rem",
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}

            <Divider sx={{ mb: 3 }} />

            {/* Contact Section */}
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#1a237e",
                mb: 1.5,
              }}
            >
              Contact Information
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: "#616161",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Phone sx={{ fontSize: 18 }} />
              {phoneRaw || "Not Provided"}
            </Typography>

            {/* Action Buttons */}
            <Stack spacing={1.5} sx={{ mt: "auto", pb: { xs: 1, sm: 0 } }}>
              <Button
                component="a"
                href={telHref ? `tel:${telHref}` : undefined}
                disabled={!telHref}
                variant="contained"
                fullWidth
                startIcon={<Phone />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  py: 1.3,
                  bgcolor: "#0288d1",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(2,136,209,0.25)",
                  "&:hover": {
                    bgcolor: "#0277bd",
                    boxShadow: "0 6px 16px rgba(2,136,209,0.35)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    bgcolor: "#e0e0e0",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Call Now
              </Button>

              <Button
                component="a"
                href={waHref || undefined}
                disabled={!waHref}
                target="_blank"
                rel="noopener"
                variant="contained"
                fullWidth
                startIcon={<WhatsApp />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  py: 1.3,
                  bgcolor: "#25D366",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                  "&:hover": {
                    bgcolor: "#1EBE5D",
                    boxShadow: "0 6px 16px rgba(37,211,102,0.35)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    bgcolor: "#e0e0e0",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Message on WhatsApp
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
            bgcolor: "rgba(0,0,0,0.92)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
            animation: "fadeInImage 0.25s ease-in",
            "@keyframes fadeInImage": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            p: { xs: 2, md: 4 },
          }}
          onClick={() => setOpenImage(false)}
        >
          <IconButton
            onClick={() => setOpenImage(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": {
                bgcolor: "#fff",
              },
            }}
          >
            <Close />
          </IconButton>
          <img
            src={imageUrl}
            alt="Full View"
            style={{
              maxWidth: "95vw",
              maxHeight: "95vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 0 40px rgba(255,255,255,0.2)",
            }}
          />
        </Box>
      )}
    </>
  );
}