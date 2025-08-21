import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Rating,
    Typography,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { submitReview, type CreateReviewRequest } from '../services/reviewService';

const reviewSchema = z.object({
    reviewerName: z
        .string()
        .min(1, 'Reviewer name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    rating: z
        .number()
        .min(1, 'Rating is required')
        .max(5, 'Rating must be between 1 and 5'),
    text: z
        .string()
        .min(1, 'Review text is required')
        .min(10, 'Review text must be at least 10 characters')
        .max(2000, 'Review text must not exceed 2000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    bookId: string;
    bookTitle: string;
    onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    open,
    onClose,
    bookId,
    bookTitle,
    onReviewSubmitted,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState<ReviewFormData>({
        reviewerName: '',
        rating: 0,
        text: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (field: keyof ReviewFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }

    };


    const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
        const rating = newValue || 0;
        setFormData(prev => ({ ...prev, rating }));

        // Clear rating error
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: undefined }));
        }
    };

    const validateForm = (): boolean => {
        try {
            reviewSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof ReviewFormData, string>> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        newErrors[issue.path[0] as keyof ReviewFormData] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const reviewData: CreateReviewRequest = {
                reviewerName: formData.reviewerName,
                rating: formData.rating,
                text: formData.text,
            };

            const result = await submitReview(bookId, reviewData);

            if (result.success) {
                setSubmitSuccess(true);
                enqueueSnackbar('Review submitted successfully!', { variant: 'success' });
                resetForm();
                onReviewSubmitted?.();
            } else {
                const errorMessage = result.message || 'Failed to submit review';
                setSubmitError(errorMessage);
                enqueueSnackbar(errorMessage, { variant: 'error' });
            }
        } catch {
            const errorMessage = 'An unexpected error occurred. Please try again.';
            setSubmitError(errorMessage);
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            reviewerName: '',
            rating: 0,
            text: '',
        });
        setErrors({});
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            setSubmitSuccess(false);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 2,
                    m: { xs: 2, md: 4 },
                    maxHeight: { xs: '90vh', md: 'none' }
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        Write a Review
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{ color: 'grey.500' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="subtitle1" component="div" color="text.secondary" sx={{ mt: 1 }}>
                    Share your thoughts about "{bookTitle}"
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 2, px: { xs: 2, md: 3 } }}>
                    {submitSuccess && (
                        <Alert severity="success" sx={{ mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
                            Review submitted successfully! Thank you for sharing your thoughts.
                        </Alert>
                    )}

                    {submitError && (
                        <Alert severity="error" sx={{ mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
                            {submitError}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 } }}>
                        <TextField
                            label="Your Name"
                            value={formData.reviewerName}
                            onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                            error={!!errors.reviewerName}
                            helperText={errors.reviewerName || 'How should we credit your review?'}
                            fullWidth
                            disabled={isSubmitting}
                            placeholder="Enter your name"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />

                        <Box>
                            <Typography component="legend" sx={{ mb: { xs: 1, md: 1.5 }, fontWeight: 'medium', fontSize: { xs: '0.95rem', md: '1rem' } }}>
                                Rating *
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Rating
                                    value={formData.rating}
                                    onChange={handleRatingChange}
                                    size="large"
                                    disabled={isSubmitting}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    data-testid="review-rating"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#ffc107',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#ffb300',
                                        },
                                    }}
                                />
                                {formData.rating > 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
                                    </Typography>
                                )}
                            </Box>
                            {errors.rating && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                    {errors.rating}
                                </Typography>
                            )}
                            {!errors.rating && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    How would you rate this book overall?
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                label="Your Review"
                                value={formData.text}
                                onChange={(e) => handleInputChange('text', e.target.value)}
                                error={!!errors.text}
                                helperText={errors.text || `Share your detailed thoughts (${formData.text.length}/2000 characters)`}
                                fullWidth
                                multiline
                                rows={6}
                                disabled={isSubmitting}
                                placeholder="What did you think about this book? Share your experience, favorite parts, or any insights..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '& textarea': {
                                            fontSize: { xs: '0.95rem', md: '1rem' },
                                            lineHeight: 1.6,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.95rem', md: '1rem' },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 2, gap: { xs: 1, md: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{
                            order: { xs: 2, sm: 1 },
                            width: { xs: '100%', sm: 'auto' },
                            minWidth: { sm: 100 },
                            height: { xs: 44, md: 48 },
                            color: 'text.secondary',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: 'grey.100',
                                color: 'text.primary'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Tooltip 
                        title={isSubmitting 
                            ? 'AI is processing your review...' 
                            : submitSuccess 
                            ? 'Review successfully submitted!' 
                            : 'Your review will be enhanced with AI-powered sentiment analysis and smart suggestions'
                        }
                        placement="top"
                        arrow
                    >
                        <span>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || submitSuccess}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                                sx={{ 
                                    order: { xs: 1, sm: 2 },
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { xs: 'auto', sm: 160 },
                                    height: { xs: 44, md: 48 },
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: isSubmitting 
                                        ? 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)'
                                        : submitSuccess
                                        ? 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)'
                                        : 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: isSubmitting 
                                        ? '0 2px 4px rgba(158, 158, 158, 0.3)'
                                        : submitSuccess
                                        ? '0 4px 12px rgba(76, 175, 80, 0.4)'
                                        : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        transition: 'left 0.5s ease'
                                    },
                                    '&:hover': {
                                        background: isSubmitting 
                                            ? 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)'
                                            : submitSuccess
                                            ? 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)'
                                            : 'linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%)',
                                        boxShadow: isSubmitting 
                                            ? '0 2px 4px rgba(158, 158, 158, 0.3)'
                                            : submitSuccess
                                            ? '0 6px 16px rgba(76, 175, 80, 0.5)'
                                            : '0 6px 20px rgba(102, 126, 234, 0.6)',
                                        transform: isSubmitting ? 'none' : 'translateY(-2px) scale(1.02)',
                                        '&::before': {
                                            left: '100%'
                                        }
                                    },
                                    '&:active': {
                                        transform: isSubmitting ? 'none' : 'translateY(0px) scale(0.98)'
                                    },
                                    '&:disabled': {
                                        background: submitSuccess 
                                            ? 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)'
                                            : 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)',
                                        color: 'white',
                                        opacity: submitSuccess ? 1 : 0.7
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {isSubmitting 
                                    ? 'Processing...' 
                                    : submitSuccess 
                                    ? 'Review Submitted! ✓' 
                                    : 'Submit Review ✨'
                                }
                            </Button>
                        </span>
                    </Tooltip>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReviewModal;