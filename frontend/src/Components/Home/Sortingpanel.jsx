import React, { useState, useCallback, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  IconButton,
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
  Code as CodeIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  MenuBook as MenuBookIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Language as LanguageIcon,
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

const MobileFilterButton = styled(IconButton)(({ theme, isDrawerOpen }) => ({
  position: 'fixed',
  top: 80,
  left: 16,
  zIndex: 1300,
  background: theme.palette.primary.main,
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 123, 255, 0.3)',
  opacity: isDrawerOpen ? 0 : 1,
  visibility: isDrawerOpen ? 'hidden' : 'visible',
  transform: isDrawerOpen ? 'scale(0.8)' : 'scale(1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: isDrawerOpen ? 'scale(0.8)' : 'scale(1.1)',
  },
}));

const SearchSortingPanel = ({ onFiltersChange, onSortChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // State for all filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAssignmentType, setSelectedAssignmentType] = useState('');
  const [priceRange, setPriceRange] = useState([1000, 20000]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [selectedProviderType, setSelectedProviderType] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Set initial load to false after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Separate state for slider to prevent re-renders
  const [isDragging, setIsDragging] = useState(false);
  const [priceChangeTimeout, setPriceChangeTimeout] = useState(null);
  
  // Data arrays - configured for assignment services
  const searchSuggestions = [
    'Programming assignment in Python',
    'Essay on environmental science',
    'Data structure implementation',
    'Business plan presentation',
    'Research paper on machine learning',
    'Final year project proposal',
    'Mathematics problem solving',
    'Web development project',
  ];
  
  const categories = [
    'All Categories',
    'Computer Science',
    'Engineering',
    'Business & Management',
    'Arts & Humanities',
    'Mathematics & Statistics',
    'Science & Technology',
    'Social Sciences',
    'Law & Legal Studies',
    'Medicine & Health',
    'Economics & Finance',
    'Design & Creative Arts',
  ];
  
  const assignmentTypes = [
    'All Types',
    'Essay / Report',
    'Coding Project',
    'Research Paper',
    'Presentation / Slides',
    'Final Year Project',
    'Thesis / Dissertation',
    'Case Study',
    'Lab Report',
    'Problem Solving',
    'Review & Analysis',
    'Technical Documentation',
  ];
  
  const deliveryTimes = [
    'Any Time',
    'Within 24h',
    '2-3 Days',
    '4-7 Days',
    '1-2 Weeks',
    '1 Month+',
    'Flexible',
  ];
  
  const providerTypes = [
    'All Providers',
    'Individual Freelancer',
    'Academic Company',
    'Verified Provider',
    'Top Rated Expert',
    'Student Helper',
  ];
  
  const ratingOptions = [
    'Any Rating',
    '4+ Stars',
    '3+ Stars',
    '2+ Stars',
    '1+ Stars',
  ];
  
  const languages = [
    'Any Language',
    'English',
    'Sinhala',
    'Tamil',
    'Hindi',
    'French',
    'German',
    'Spanish',
    'Chinese',
  ];
  
  const specializations = [
    'Machine Learning',
    'Web Development',
    'Mobile Apps',
    'Data Analysis',
    'Database Design',
    'UI/UX Design',
    'Digital Marketing',
    'Financial Modeling',
    'Academic Writing',
    'Technical Writing',
    'Research Methods',
    'Statistics',
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest Listings' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'delivery', label: 'Fastest Delivery' },
    { value: 'popular', label: 'Most Popular' },
  ];
  
  const quickCategories = [
    { label: 'Programming & Coding', icon: <CodeIcon />, value: 'programming' },
    { label: 'Academic Writing', icon: <MenuBookIcon />, value: 'writing' },
    { label: 'Engineering Projects', icon: <EngineeringIcon />, value: 'engineering' },
    { label: 'Business Analysis', icon: <BusinessIcon />, value: 'business' },
  ];

  // Event handlers for backend integration
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (onFiltersChange) {
      onFiltersChange({
        search: value,
        category: selectedCategory,
        assignmentType: selectedAssignmentType,
        priceRange,
        deliveryTime: selectedDeliveryTime,
        providerType: selectedProviderType,
        rating: selectedRating,
        language: selectedLanguage,
        specializations: selectedSpecializations,
      });
    }
  }, [selectedCategory, selectedAssignmentType, priceRange, selectedDeliveryTime, selectedProviderType, selectedRating, selectedLanguage, selectedSpecializations, onFiltersChange]);

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: value,
        assignmentType: selectedAssignmentType,
        priceRange,
        deliveryTime: selectedDeliveryTime,
        providerType: selectedProviderType,
        rating: selectedRating,
        language: selectedLanguage,
        specializations: selectedSpecializations,
      });
    }
  }, [searchQuery, selectedAssignmentType, priceRange, selectedDeliveryTime, selectedProviderType, selectedRating, selectedLanguage, selectedSpecializations, onFiltersChange]);

  const handlePriceRangeChange = useCallback((event, value, activeThumb) => {
    // Immediately update price range without triggering callbacks during drag
    setPriceRange(value);
  }, []);

  const handlePriceRangeChangeCommitted = useCallback((event, value) => {
    // Only call parent callback when user finishes dragging
    setIsDragging(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        assignmentType: selectedAssignmentType,
        priceRange: value,
        deliveryTime: selectedDeliveryTime,
        providerType: selectedProviderType,
        rating: selectedRating,
        language: selectedLanguage,
        specializations: selectedSpecializations,
      });
    }
  }, [searchQuery, selectedCategory, selectedAssignmentType, selectedDeliveryTime, selectedProviderType, selectedRating, selectedLanguage, selectedSpecializations, onFiltersChange]);

  const handleSliderMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleSpecializationToggle = useCallback((specialization) => {
    const updatedSpecializations = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter(s => s !== specialization)
      : [...selectedSpecializations, specialization];
    
    setSelectedSpecializations(updatedSpecializations);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        assignmentType: selectedAssignmentType,
        priceRange,
        deliveryTime: selectedDeliveryTime,
        providerType: selectedProviderType,
        rating: selectedRating,
        language: selectedLanguage,
        specializations: updatedSpecializations,
      });
    }
  }, [searchQuery, selectedCategory, selectedAssignmentType, priceRange, selectedDeliveryTime, selectedProviderType, selectedRating, selectedLanguage, onFiltersChange]);

  const handleSortChange = useCallback((value) => {
    setSortOption(value);
    if (onSortChange) {
      onSortChange(value);
    }
  }, [onSortChange]);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAssignmentType('');
    setPriceRange([1000, 20000]);
    setSelectedDeliveryTime('');
    setSelectedProviderType('');
    setSelectedRating('');
    setSelectedLanguage('');
    setSelectedSpecializations([]);
    setIsDragging(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        search: '',
        category: '',
        assignmentType: '',
        priceRange: [1000, 20000],
        deliveryTime: '',
        providerType: '',
        rating: '',
        language: '',
        specializations: [],
      });
    }
  }, [onFiltersChange]);

  // Panel content component - with conditional animations only on initial load
  const PanelContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <Fade in={true} timeout={isInitialLoad ? 500 : 0}>
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            freeSolo
            options={searchSuggestions}
            value={searchQuery}
            onInputChange={(event, newValue) => handleSearchChange(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search assignments, projects..."
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
      <Fade in={true} timeout={isInitialLoad ? 700 : 0}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Quick Categories
          </Typography>
          <Stack spacing={1}>
            {quickCategories.map((category, index) => (
              <Slide key={category.value} direction="right" in={true} timeout={isInitialLoad ? 800 + index * 100 : 0}>
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

      {/* Filters Section - No animation wrapper to prevent re-rendering issues */}
      <Box>
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
            {(selectedCategory || selectedAssignmentType || selectedDeliveryTime || selectedProviderType || selectedRating || selectedLanguage || selectedSpecializations.length > 0) && (
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
              {/* Category Filter */}
              <FormControl fullWidth>
                <InputLabel>Subject Area</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Subject Area"
                  startAdornment={
                    <InputAdornment position="start">
                      <SchoolIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assignment Type Filter */}
              <FormControl fullWidth>
                <InputLabel>Assignment Type</InputLabel>
                <Select
                  value={selectedAssignmentType}
                  onChange={(e) => setSelectedAssignmentType(e.target.value)}
                  label="Assignment Type"
                  startAdornment={
                    <InputAdornment position="start">
                      <AssignmentIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {assignmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price Range - Ultra smooth with zero re-renders during drag */}
              <Box sx={{ position: 'relative' }}>
                <Typography gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon color="primary" sx={{ mr: 1 }} />
                  Price Range (LKR)
                </Typography>
                <Box sx={{ px: 2, py: 1 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    onChangeCommitted={handlePriceRangeChangeCommitted}
                    onMouseDown={handleSliderMouseDown}
                    valueLabelDisplay="auto"
                    min={1000}
                    max={50000}
                    step={100} // Even smaller step for ultra-precise control
                    marks={[
                      { value: 1000, label: '1K' },
                      { value: 10000, label: '10K' },
                      { value: 25000, label: '25K' },
                      { value: 50000, label: '50K' },
                    ]}
                    sx={{
                      color: 'primary.main',
                      height: 8,
                      '& .MuiSlider-thumb': {
                        background: 'linear-gradient(135deg, #007BFF, #00C853)',
                        boxShadow: isDragging 
                          ? '0 8px 25px rgba(0, 123, 255, 0.5)'
                          : '0 4px 15px rgba(0, 123, 255, 0.3)',
                        width: 20,
                        height: 20,
                        transition: isDragging ? 'none' : 'box-shadow 0.15s ease-in-out',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
                        },
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(135deg, #007BFF, #00C853)',
                        border: 'none',
                        height: 8,
                        transition: 'none', // No transitions during drag
                      },
                      '& .MuiSlider-rail': {
                        height: 8,
                        opacity: 0.3,
                        backgroundColor: '#d0d7de',
                        transition: 'none',
                      },
                      '& .MuiSlider-valueLabel': {
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #007BFF, #00C853)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        transition: 'none',
                      },
                      '& .MuiSlider-mark': {
                        backgroundColor: 'currentColor',
                        height: 12,
                        width: 2,
                        borderRadius: 1,
                        transition: 'none',
                        '&.MuiSlider-markActive': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiSlider-markLabel': {
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        fontWeight: 500,
                      },
                    }}
                  />
                  <Box sx={{ 
                    p: 1.5, 
                    mt: 2, 
                    textAlign: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #007BFF, #00C853)',
                    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.2)',
                    // Prevent any transitions that could cause re-renders
                    transition: 'none',
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                      color: 'white',
                      // Use key to force re-render only when value actually changes
                      key: `${priceRange[0]}-${priceRange[1]}`,
                    }}>
                      LKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Delivery Time Filter */}
              <FormControl fullWidth>
                <InputLabel>Delivery Time</InputLabel>
                <Select
                  value={selectedDeliveryTime}
                  onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                  label="Delivery Time"
                  startAdornment={
                    <InputAdornment position="start">
                      <TimerIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {deliveryTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Provider Type Filter */}
              <FormControl fullWidth>
                <InputLabel>Provider Type</InputLabel>
                <Select
                  value={selectedProviderType}
                  onChange={(e) => setSelectedProviderType(e.target.value)}
                  label="Provider Type"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {providerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Rating Filter */}
              <FormControl fullWidth>
                <InputLabel>Minimum Rating</InputLabel>
                <Select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  label="Minimum Rating"
                  startAdornment={
                    <InputAdornment position="start">
                      <StarIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {ratingOptions.map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Language Filter */}
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  label="Language"
                  startAdornment={
                    <InputAdornment position="start">
                      <LanguageIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {languages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Specializations */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Specializations
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {specializations.map((specialization) => (
                    <FilterChip
                      key={specialization}
                      label={specialization}
                      selected={selectedSpecializations.includes(specialization)}
                      onClick={() => handleSpecializationToggle(specialization)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sort Options */}
      <Fade in={true} timeout={isInitialLoad ? 1100 : 0}>
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
      {/* Mobile Filter Button - Now hides when drawer is open */}
      {isMobile && (
        <MobileFilterButton
          onClick={() => setMobileDrawerOpen(true)}
          isDrawerOpen={mobileDrawerOpen}
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