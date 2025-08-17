import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Badge,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { searchAll, type SearchResult } from '../services/searchService';
import BookCard from '../components/BookCard';
import SearchReviewCard from '../components/SearchReviewCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue.trim());
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery<SearchResult>({
    queryKey: ['searchAll', searchQuery],
    queryFn: () => searchAll(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Search Books & Reviews
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search books, authors, reviews, or reviewers..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
            </InputAdornment>
          ),
          endAdornment: inputValue && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          An error occurred while searching. Please try again.
        </Alert>
      )}

      {searchResults && searchResults.totalResults > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Search Results for "{searchResults.query}"
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Found {searchResults.totalResults} results
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="search results tabs">
              <Tab
                label={
                  <Badge badgeContent={searchResults.books.length} color="primary">
                    Books
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge badgeContent={searchResults.reviews.length} color="secondary">
                    Reviews
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            {searchResults.books.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {searchResults.books.map((book) => (
                  <BookCard key={book.id} book={book} onBookClick={handleBookClick} />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                No books found for this search.
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {searchResults.reviews.length > 0 ? (
              <Box>
                {searchResults.reviews.map((review) => (
                  <SearchReviewCard key={review.id} review={review} />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                No reviews found for this search.
              </Typography>
            )}
          </TabPanel>
        </Box>
      )}

      {searchResults && searchResults.totalResults === 0 && searchQuery && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No results found for "{searchQuery}". Try different keywords or check your spelling.
        </Alert>
      )}

      {!searchQuery && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Start searching to find books and reviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter keywords to search through book titles, authors, descriptions, and review content.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Search;