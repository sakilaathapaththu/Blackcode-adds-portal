import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

export default function SidebarAds({ ads = [] }) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 2,
        position: "sticky",
        top: 90,
        width: 260,
      }}
    >
      {/* <Typography
        variant="h6"
        fontWeight={700}
        color="text.primary"
        sx={{ mb: 1 }}
      >
        Advertisement
      </Typography> */}

      {ads.map((ad, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            bgcolor: "white",
            cursor: "pointer",
            "&:hover": { transform: "scale(1.02)", transition: "0.3s" },
          }}
        >
          {ad.image ? (
            <CardMedia
              component="img"
              image={ad.image}
              alt={ad.title}
              sx={{ height: 180, objectFit: "cover" }}
            />
          ) : (
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>
                {ad.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ad.text}
              </Typography>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Placeholder for future Google Ads */}
      <Box
        sx={{
          bgcolor: "#f9f9f9",
          border: "1px dashed #ccc",
          borderRadius: 1,
          textAlign: "center",
          py: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Google Ads
        </Typography>
      </Box>
    </Box>
  );
}
