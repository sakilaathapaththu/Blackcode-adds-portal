// src/Components/Items/ItemList.jsx
import React from 'react';
import { Grid } from '@mui/material';
import ItemCard from './ItemCard';

// Example student/freelancer data
const items = [
  {
    id: 1,
    title: 'Thamindu Sulakshana',
    description: 'BSc IT (Hons) Student | AI & ML Enthusiast',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['React', 'Python', 'Deep Learning'],
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Ilesingha I.T.S.',
    description: 'Full Stack Developer | Data Analyst',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    skills: ['Node.js', 'SQL', 'PyTorch'],
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Alwis W.K.H.',
    description: 'Mobile App Developer | UI/UX Designer',
    image: 'https://randomuser.me/api/portraits/men/50.jpg',
    skills: ['Flutter', 'UI Design', 'AR'],
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Jayawickrama Y.R.C.S.',
    description: 'AI Researcher | Robotics Enthusiast',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    skills: ['Machine Learning', 'Robotics', 'Unity'],
    rating: 4.6,
  },
];

export default function ItemList() {
  return (
    <Grid container spacing={4}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <ItemCard
            title={item.title}
            description={item.description}
            image={item.image}
            skills={item.skills}
            rating={item.rating}
          />
        </Grid>
      ))}
    </Grid>
  );
}
