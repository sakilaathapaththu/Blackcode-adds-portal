import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Stack,
  Avatar,
  Rating,
} from '@mui/material';
import { Person, Timer, AttachMoney, Star } from '@mui/icons-material';

// Sample data for posts
const items = [
  {
    id: 1,
    title: 'Python Programming Assignment',
    description: 'Complete your data analysis project using.',
    category: 'Programming',
    price: 1500,
    deliveryTime: '2 Days',
    rating: 4.5,
    reviews: 12,
    provider: 'John Doe',
    providerImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['Python', 'Data Structures', 'Machine Learning'],
Posterimage: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg', // Demo image
  },
  {
    id: 2,
    title: 'Business Management Essay',
    description: 'Complete your data analysis project using.',
    category: 'Academic Writing',
    price: 2000,
    deliveryTime: '3 Days',
    rating: 4.0,
    reviews: 8,
    provider: 'Jane Smith',
    providerImg: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['Business', 'Report Writing', 'Analysis'],
    Posterimage: 'https://source.unsplash.com/400x200/?essay',
  },
  {
    id: 3,
    title: 'Data Analysis Project',
    description: 'Complete your data analysis project using.',
    category: 'Data Science',
    price: 2500,
    deliveryTime: '5 Days',
    rating: 5.0,
    reviews: 20,
    provider: 'Alex Johnson',
    providerImg: 'https://randomuser.me/api/portraits/men/54.jpg',
    skills: ['Excel', 'Python', 'Data Visualization'],
    Posterimage: 'https://source.unsplash.com/400x200/?data',
  },
  {
    id: 4,
    title: 'Final Year Project Guidance',
    description: 'Complete your data analysis project using.',
    category: 'Engineering',
    price: 5000,
    deliveryTime: '7 Days',
    rating: 4.8,
    reviews: 15,
    provider: 'Emily Davis',
    providerImg: 'https://randomuser.me/api/portraits/women/68.jpg',
    skills: ['Engineering', 'Project Management', 'Research'],
    Posterimage: 'https://source.unsplash.com/400x200/?engineering',
  },
];

export default function ItemsPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assignment Helpers Marketplace
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item xs={5} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Post Image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt={item.title}
                />

                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Category Tag */}
                  <Chip
                    label={item.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  {/* Title */}
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  {/* Short Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>

                  {/* Provider Info */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar src={item.providerImg} alt={item.provider} sx={{ width: 28, height: 28 }} />
                    <Typography variant="body2">{item.provider}</Typography>
                  </Stack>

                  {/* Delivery & Price */}
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Timer fontSize="small" />
                      <Typography variant="body2">{item.deliveryTime}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AttachMoney fontSize="small" />
                      <Typography variant="body2">{item.price.toLocaleString()} LKR</Typography>
                    </Stack>
                  </Stack>

                  {/* Rating */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Rating value={item.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2">({item.reviews} reviews)</Typography>
                  </Stack>

                  {/* Skills/Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {item.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" color="secondary" />
                    ))}
                  </Box>
                </CardContent>

                {/* View Details Button */}
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" fullWidth color="primary">
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
