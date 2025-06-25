
import React, { useRef, useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
}

export const ImageUpload = ({ imageUrl, onImageChange, className = "" }: ImageUploadProps) => {
  const { uploadImage, uploadingImage } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const url = await uploadImage(file);
          if (url) onImageChange(url);
        } catch (error) {
          alert('Error uploading image. Please try again.');
        }
      } else {
        alert('Please upload an image file');
      }
    }
  }, [uploadImage, onImageChange]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const url = await uploadImage(file);
          if (url) onImageChange(url);
        } catch (error) {
          alert('Error uploading image. Please try again.');
        }
      } else {
        alert('Please upload an image file');
      }
    }
  };

  const removeImage = () => {
    onImageChange('');
  };

  return (
    <div className={className}>
      <label className="block text-white font-medium mb-2">Event Image</label>
      {!imageUrl ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploadingImage ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
              <p className="text-white">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-white mb-2">Drag and drop an image here, or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Choose Image
              </button>
              <p className="text-gray-400 text-sm mt-2">Supports: JPG, PNG, GIF (Max 5MB)</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Event preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
