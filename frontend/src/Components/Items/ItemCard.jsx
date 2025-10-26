// src/Components/Items/ItemCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function ItemCard({ title, description, image, skills, rating }) {
  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {skills.map((skill, index) => (
            <Chip key={index} label={skill} size="small" color="primary" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StarIcon sx={{ color: '#FFD700' }} />
          <Typography variant="body2">{rating}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
