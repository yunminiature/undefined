export const TITLE = {
  AVATAR: {
    LABEL: 'File',
    DESCRIPTION: 'Allowed formats: JPG, PNG, WebP. Max size: 2MB.',
  },
} as const;

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
