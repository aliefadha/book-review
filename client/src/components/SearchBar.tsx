import React, { useState, useEffect } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
    CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '../services/bookService';
import type { Books } from '../types/book';

interface SearchBarProps {
    onResults: (results: Books[] | null, isLoading: boolean, error: Error | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onResults,
    placeholder = "Search books by title or author...",
    disabled = false,
}) => {
    const [query, setQuery] = useState('');

    // Use useQuery for search
    const {
        data: searchResults,
        isPending,
        error,
    } = useQuery<Books[]>({
        queryKey: ['searchBooks', query.trim()],
        queryFn: () => searchBooks(query.trim()),
        enabled: !!query.trim(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Notify parent component of search results
    useEffect(() => {
        if (query.trim()) {
            onResults(searchResults || null, isPending, error);
        } else {
            onResults(null, false, null);
        }
    }, [searchResults, isPending, error, query, onResults]);

    const handleSearch = () => {
        // Search is now handled automatically by useQuery when query changes
    };

    const handleClear = () => {
        setQuery('');
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mb: 3 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton
                                onClick={handleSearch}
                                disabled={disabled || !query.trim()}
                                size="small"
                                sx={{ color: 'primary.main' }}
                            >
                                {isPending && query.trim() ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <SearchIcon />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                    endAdornment: query && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClear}
                                disabled={disabled}
                                size="small"
                                sx={{ color: 'text.secondary' }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;