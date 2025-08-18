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
                sx: { borderRadius: 2 }
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
                <DialogContent sx={{ pt: 2 }}>
                    {submitSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Review submitted successfully! Thank you for sharing your thoughts.
                        </Alert>
                    )}

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {submitError}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Your Name"
                            value={formData.reviewerName}
                            onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                            error={!!errors.reviewerName}
                            helperText={errors.reviewerName}
                            fullWidth
                            disabled={isSubmitting}
                            placeholder="Enter your name"
                        />

                        <Box>
                            <Typography component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Rating *
                            </Typography>
                            <Rating
                                value={formData.rating}
                                onChange={handleRatingChange}
                                size="large"
                                disabled={isSubmitting}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {errors.rating && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                    {errors.rating}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                value={formData.text}
                                onChange={(e) => handleInputChange('text', e.target.value)}
                                error={!!errors.text}
                                helperText={errors.text || 'Share your detailed thoughts (10-2000 characters)'}
                                fullWidth
                                multiline
                                rows={6}
                                disabled={isSubmitting}
                                placeholder="What did you think about this book? Share your experience, favorite parts, or any insights..."
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{
                            mr: 1,
                            color: 'text.secondary',
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
                                    minWidth: 160,
                                    height: 48,
                                    fontSize: '1rem',
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