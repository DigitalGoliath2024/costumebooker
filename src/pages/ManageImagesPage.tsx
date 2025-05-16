import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, X, MoveUp, MoveDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

type ProfileImage = {
  id: string;
  url: string;
  position: number;
};

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const ManageImagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profile_images')
          .select('*')
          .eq('profile_id', user.id)
          .order('position');

        if (error) throw error;

        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user, navigate]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!user) return;

    if (images.length + acceptedFiles.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    try {
      setUploading(true);

      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        // Save image record
        const { error: dbError } = await supabase
          .from('profile_images')
          .insert({
            profile_id: user.id,
            image_url: publicUrl,
            position: images.length,
          });

        if (dbError) throw dbError;

        // Update local state
        setImages(prev => [...prev, {
          id: Math.random().toString(),
          url: publicUrl,
          position: prev.length,
        }]);
      }

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading || images.length >= MAX_IMAGES,
  });

  const handleDelete = async (imageId: string, url: string) => {
    if (!user) return;

    try {
      // Delete from storage
      const fileName = url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('profile-images')
          .remove([`${user.id}/${fileName}`]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !user) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    try {
      // Update database
      for (const item of updatedItems) {
        const { error } = await supabase
          .from('profile_images')
          .update({ position: item.position })
          .eq('id', item.id);

        if (error) throw error;
      }

      // Update local state
      setImages(updatedItems);
    } catch (error) {
      console.error('Error reordering images:', error);
      toast.error('Failed to reorder images');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading images...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/dashboard" className="text-purple-700 hover:text-purple-800">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Manage Images
            </h1>
            
            <div className="space-y-8">
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center
                  ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}
                  ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-purple-500'}
                `}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {uploading ? 'Uploading...' : (
                    images.length >= MAX_IMAGES
                      ? 'Maximum number of images reached'
                      : 'Drag & drop images here, or click to select files'
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>

              {/* Image Gallery */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {images.map((image, index) => (
                        <Draggable
                          key={image.id}
                          draggableId={image.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <img
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Image {index + 1}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {index === 0 ? 'Main profile image' : 'Gallery image'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(image.id, image.url)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                {index > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDragEnd({
                                      source: { index },
                                      destination: { index: index - 1 },
                                    })}
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                )}
                                {index < images.length - 1 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDragEnd({
                                      source: { index },
                                      destination: { index: index + 1 },
                                    })}
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <Link to="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {images.length} of {MAX_IMAGES} images used
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageImagesPage;