import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import { AddAPhoto, Delete } from '@mui/icons-material';

const ImageUploader = ({ images, onAdd, onRemove, onAltTextChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': ['.jpeg', '.png', '.webp']},
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    onDrop: files => onAdd(files)
  });

  return (
    <Box sx={{ gridColumn: '1 / -1', mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: 'text.secondary',
        fontWeight: 'bold',
        borderBottom: '2px solid',
        borderColor: 'primary.main',
        pb: 1
      }}>
        مدیریت تصاویر محصول
      </Typography>

      <Box {...getRootProps()} sx={dropzoneStyle}>
        <input {...getInputProps()} />
        <AddAPhoto sx={iconStyle} />
        <Typography variant="body1">تصاویر را اینجا رها کنید یا کلیک کنید</Typography>
        <Typography variant="caption">(حداکثر 5 تصویر - حجم هر تصویر تا 5MB)</Typography>
      </Box>

      <Box sx={imageGridStyle}>
        {images.map((img, index) => (
          <Box key={index} sx={imageItemStyle}>
            <Box sx={imageContainerStyle}>
              <img
                src={img.preview}
                alt={`پیش‌نمایش ${index}`}
                style={imageStyle}
              />
              <IconButton
                sx={deleteButtonStyle}
                onClick={() => onRemove(index)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <input
              type="text"
              value={img.altText}
              onChange={(e) => onAltTextChange(index, e.target.value)}
              placeholder="متن جایگزین تصویر"
              style={altTextInputStyle}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// استایل‌ها
const dropzoneStyle = {
  border: '2px dashed #ddd',
  borderRadius: '8px',
  p: 4,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
  mb: 3,
  '&:hover': {
    borderColor: '#2196F3',
    backgroundColor: '#f5f5f5'
  }
};

const iconStyle = {
  fontSize: 40,
  color: '#757575',
  mb: 1
};

const imageGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 3,
  mt: 2
};

const imageItemStyle = {
  position: 'relative',
  border: '1px solid #eee',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
};

const imageContainerStyle = {
  position: 'relative',
  height: '200px',
  backgroundColor: '#fafafa'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const deleteButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  '&:hover': {
    backgroundColor: '#fff'
  }
};

const altTextInputStyle = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderTop: '1px solid #eee',
  outline: 'none',
  fontSize: '14px',
  '&:focus': {
    backgroundColor: '#f5f5f5'
  }
};

export default ImageUploader;