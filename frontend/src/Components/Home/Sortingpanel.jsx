import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  ButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  IconButton,
  Collapse,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  MenuBook as MenuBookIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

// Professional theme with your brand colors
const bodimaTheme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
      light: '#42A5F5',
      dark: '#0056b3',
    },
    secondary: {
      main: '#00C853',
      light: '#4CAF50',
      dark: '#00A047',
    },
    background: {
      default: '#F6F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#555555',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

// Styled components for enhanced UI
const SearchPanelContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: 'fit-content',
  maxHeight: 'calc(100vh - 100px)',
  overflowY: 'auto',
  position: 'sticky',
  top: 80,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
  border: '1px solid rgba(0, 123, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 123, 255, 0.15)',
  },
  
  // Custom scrollbar
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, #007BFF, #00C853)',
    borderRadius: '3px',
  },
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  padding: '12px 16px',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `2px solid ${theme.palette.grey[200]}`,
  background: theme.palette.background.paper,
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 123, 255, 0.15)',
    border: `2px solid ${theme.palette.primary.main}`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
  },
}));

const FilterChip = styled(Chip)(({ theme, selected }) => ({
  margin: '4px',
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected 
    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    : theme.palette.grey[100],
  color: selected ? '#ffffff' : theme.palette.text.primary,
  border: selected ? 'none' : `1px solid ${theme.palette.grey[300]}`,
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: selected 
      ? '0 8px 25px rgba(0, 123, 255, 0.3)'
      : '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
}));

const SortButton = styled(Button)(({ theme, selected }) => ({
  width: '100%',
  padding: '10px 16px',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  justifyContent: 'flex-start',
  marginBottom: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected 
    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    : 'transparent',
  color: selected ? '#ffffff' : theme.palette.text.primary,
  border: `1px solid ${selected ? 'transparent' : theme.palette.grey[200]}`,
  
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: selected
      ? '0 8px 25px rgba(0, 123, 255, 0.3)'
      : '0 4px 15px rgba(0, 123, 255, 0.1)',
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const MobileFilterButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 80,
  left: 16,
  zIndex: 1300,
  background: theme.palette.primary.main,
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 123, 255, 0.3)',
  
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
}));

const SearchSortingPanel = ({ onFiltersChange, onSortChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for all filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([5000, 50000]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Data arrays - easily configurable for backend integration
  const searchSuggestions = [
    'Room near University of Moratuwa',
    'Shared apartment in Malabe',
    'Single room with AC in Colombo',
    'Student housing near SLIIT',
    'Furnished room for rent',
    'Boarding house in Kandy',
  ];
  
  const locations = [
    'All Locations',
    'Malabe',
    'Colombo',
    'Kandy',
    'Jaffna',
    'Galle',
    'Matara',
    'Negombo',
    'Kurunegala',
    'Anuradhapura',
    'Ratnapura',
  ];
  
  const roomTypes = [
    'All Types',
    'Single Room',
    'Double Room',
    'Shared Room',
    'Annex',
    'Studio Apartment',
    'Boarding House',
  ];
  
  const facilities = [
    'Air Conditioning',
    'Kitchen Access',
    'Attached Bathroom',
    'Laundry',
    'WiFi',
    'Parking',
    'Security',
    'Furnished',
    'Study Table',
    'Wardrobe',
  ];
  
  const availabilityOptions = [
    'All',
    'Immediate',
    'Within 1 Week',
    'Within 1 Month',
    'Flexible',
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest Listings' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'nearest', label: 'Closest to University' },
  ];
  
  const quickCategories = [
    { label: 'Rooms for Rent', icon: <HomeIcon />, value: 'rooms' },
    { label: 'Student Housing', icon: <SchoolIcon />, value: 'student' },
    { label: 'Food & Cafeteria', icon: <RestaurantIcon />, value: 'food' },
    { label: 'Tuition & Courses', icon: <MenuBookIcon />, value: 'tuition' },
  ];

  // Event handlers for backend integration
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (onFiltersChange) {
      onFiltersChange({
        search: value,
        location: selectedLocation,
        priceRange,
        roomType: selectedRoomType,
        facilities: selectedFacilities,
        availability: selectedAvailability,
      });
    }
  }, [selectedLocation, priceRange, selectedRoomType, selectedFacilities, selectedAvailability, onFiltersChange]);

  const handleLocationChange = useCallback((value) => {
    setSelectedLocation(value);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        location: value,
        priceRange,
        roomType: selectedRoomType,
        facilities: selectedFacilities,
        availability: selectedAvailability,
      });
    }
  }, [searchQuery, priceRange, selectedRoomType, selectedFacilities, selectedAvailability, onFiltersChange]);

  const handlePriceRangeChange = useCallback((value) => {
    setPriceRange(value);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        location: selectedLocation,
        priceRange: value,
        roomType: selectedRoomType,
        facilities: selectedFacilities,
        availability: selectedAvailability,
      });
    }
  }, [searchQuery, selectedLocation, selectedRoomType, selectedFacilities, selectedAvailability, onFiltersChange]);

  const handleFacilityToggle = useCallback((facility) => {
    const updatedFacilities = selectedFacilities.includes(facility)
      ? selectedFacilities.filter(f => f !== facility)
      : [...selectedFacilities, facility];
    
    setSelectedFacilities(updatedFacilities);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        location: selectedLocation,
        priceRange,
        roomType: selectedRoomType,
        facilities: updatedFacilities,
        availability: selectedAvailability,
      });
    }
  }, [searchQuery, selectedLocation, priceRange, selectedRoomType, selectedFacilities, selectedAvailability, onFiltersChange]);

  const handleSortChange = useCallback((value) => {
    setSortOption(value);
    if (onSortChange) {
      onSortChange(value);
    }
  }, [onSortChange]);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedLocation('');
    setPriceRange([5000, 50000]);
    setSelectedRoomType('');
    setSelectedFacilities([]);
    setSelectedAvailability('');
    
    if (onFiltersChange) {
      onFiltersChange({
        search: '',
        location: '',
        priceRange: [5000, 50000],
        roomType: '',
        facilities: [],
        availability: '',
      });
    }
  }, [onFiltersChange]);

  // Panel content component
  const PanelContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <Fade in={true} timeout={500}>
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            freeSolo
            options={searchSuggestions}
            value={searchQuery}
            onInputChange={(event, newValue) => handleSearchChange(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search rooms, apartments..."
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      </Fade>

      {/* Quick Categories */}
      <Fade in={true} timeout={700}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Quick Categories
          </Typography>
          <Stack spacing={1}>
            {quickCategories.map((category, index) => (
              <Slide key={category.value} direction="right" in={true} timeout={800 + index * 100}>
                <CategoryButton
                  fullWidth
                  startIcon={category.icon}
                  onClick={() => handleSearchChange(category.label)}
                >
                  {category.label}
                </CategoryButton>
              </Slide>
            ))}
          </Stack>
        </Box>
      </Fade>

      <Divider sx={{ my: 2 }} />

      {/* Filters Section */}
      <Fade in={true} timeout={900}>
        <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              px: 0,
              '& .MuiAccordionSummary-content': { alignItems: 'center' }
            }}
          >
            <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            {(selectedLocation || selectedRoomType || selectedFacilities.length > 0 || selectedAvailability) && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllFilters();
                }}
                sx={{ ml: 'auto', mr: 2 }}
              >
                Clear All
              </Button>
            )}
          </AccordionSummary>
          
          <AccordionDetails sx={{ px: 0 }}>
            <Stack spacing={3}>
              {/* Location Filter */}
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  label="Location"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Room Type Filter */}
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  label="Room Type"
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price Range */}
              <Box>
                <Typography gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon color="primary" sx={{ mr: 1 }} />
                  Price Range (LKR)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => handlePriceRangeChange(newValue)}
                    valueLabelDisplay="auto"
                    min={5000}
                    max={100000}
                    step={5000}
                    marks={[
                      { value: 5000, label: '5K' },
                      { value: 25000, label: '25K' },
                      { value: 50000, label: '50K' },
                      { value: 100000, label: '100K' },
                    ]}
                    sx={{
                      color: 'primary.main',
                      '& .MuiSlider-thumb': {
                        background: 'linear-gradient(135deg, #007BFF, #00C853)',
                        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                      },
                    }}
                  />
                  <Paper sx={{ 
                    p: 1.5, 
                    mt: 1, 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText',
                    textAlign: 'center',
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} LKR
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Availability Filter */}
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  label="Availability"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Facilities */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Facilities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {facilities.map((facility) => (
                    <FilterChip
                      key={facility}
                      label={facility}
                      selected={selectedFacilities.includes(facility)}
                      onClick={() => handleFacilityToggle(facility)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Fade>

      <Divider sx={{ my: 2 }} />

      {/* Sort Options */}
      <Fade in={true} timeout={1100}>
        <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 0 }}
          >
            <SortIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sort By
            </Typography>
          </AccordionSummary>
          
          <AccordionDetails sx={{ px: 0 }}>
            <Stack spacing={1}>
              {sortOptions.map((option) => (
                <SortButton
                  key={option.value}
                  selected={sortOption === option.value}
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </SortButton>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Fade>
    </Box>
  );

  return (
    <ThemeProvider theme={bodimaTheme}>
      {/* Mobile Filter Button */}
      {isMobile && (
        <MobileFilterButton
          onClick={() => setMobileDrawerOpen(true)}
        >
          <TuneIcon />
        </MobileFilterButton>
      )}

      {/* Desktop Panel */}
      {!isMobile ? (
        <SearchPanelContainer>
          <PanelContent />
        </SearchPanelContainer>
      ) : (
        /* Mobile Drawer */
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 320,
              backgroundColor: 'background.paper',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Search & Filter
            </Typography>
            <IconButton 
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <PanelContent />
        </Drawer>
      )}
    </ThemeProvider>
  );
};

export default SearchSortingPanel;