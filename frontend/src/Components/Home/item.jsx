import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box
} from '@mui/material';

const items = [
  { id: 1, title: 'Item 1', description: 'This is a description for item 1' },
  { id: 2, title: 'Item 2', description: 'This is a description for item 2' },
  { id: 3, title: 'Item 3', description: 'This is a description for item 3' },
  { id: 4, title: 'Item 4', description: 'This is a description for item 4' },
];

export default function ItemPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Items Page
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}