import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/videoupload.css';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_file: null,
    thumbnail: null,
    duration: '',
    status: 'draft'
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const API_URL = 'http://localhost:8000/list_videos/'; // Update with your API URL

  // Fetch all videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // READ - Fetch all videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setVideos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
 // Handle file input changes - FIXED
const handleFileChange = (e) => {
  const { name, files } = e.target;
  if (files && files.length > 0) {
    setFormData(prev => ({
      ...prev,
      [name]: files  // Changed: Store files, not files (FileList object)
    }));
  }
};

 // CREATE - Upload new video
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title || !formData.video_file) {
    setError('Title and video file are required');
    return;
  }

  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('video_file', formData.video_file);
  if (formData.thumbnail) {
    data.append('thumbnail', formData.thumbnail);
  }
  if (formData.duration) {
    data.append('duration', formData.duration);
  }
  data.append('status', formData.status);

  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(
      'http://localhost:8000/create_video/',
      data,
      {
        method:"POST",
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      }
    );

    setVideos(prev => [response.data, ...prev]);
    resetForm();
    setUploadProgress(0);
    alert('Video uploaded successfully!');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to upload video');
    console.error('Error details:', err);
  } finally {
    setLoading(false);
  }
};
  // UPDATE - Update existing video
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editingVideo) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    // Only append files if they were changed
    if (formData.video_file && formData.video_file instanceof File) {
      data.append('video_file', formData.video_file);
    }
    if (formData.thumbnail && formData.thumbnail instanceof File) {
      data.append('thumbnail', formData.thumbnail);
    }
    if (formData.duration) {
      data.append('duration', formData.duration);
    }
    data.append('status', formData.status);

    try {
      setLoading(true);
      setError(null);
      
      // Fixed: Use correct endpoint
      const response = await axios.patch(
        `http://localhost:8000/update_video/${editingVideo.id}/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setVideos(prev => 
        prev.map(video => video.id === editingVideo.id ? response.data : video)
      );
      
      resetForm();
      alert('Video updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update video');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Delete video
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/delete_video/${id}/`);
      setVideos(prev => prev.filter(video => video.id !== id));
      alert('Video deleted successfully!');
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Set video for editing
  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      video_file: null,
      thumbnail: null,
      duration: video.duration || '',
      status: video.status
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_file: null,
      thumbnail: null,
      duration: '',
      status: 'draft'
    });
    setEditingVideo(null);
    setError(null);
  };

  return (
    <div className="form">
      <h1>Video Management System</h1>

      {/* Upload/Edit Form */}
      <div className="form">
        <h2>{editingVideo ? 'Edit Video' : 'Upload New Video'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={editingVideo ? handleUpdate : handleSubmit}>
          <div className="form">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter video description"
            />
          </div>

          <div className="form">
            <label htmlFor="video_file">
              Video File * {editingVideo && '(Leave empty to keep current)'}
            </label>
            <input
              type="file"
              id="video_file"
              name="video_file"
              onChange={handleFileChange}
              accept="video/mp4,video/avi,video/mov,video/mkv,video/flv,video/wmv"
              required={!editingVideo}
            />
            {formData.video_file && (
              <span className="file-name">{formData.video_file.name}</span>
            )}
          </div>

          <div className="form">
            <label htmlFor="thumbnail">
              Thumbnail {editingVideo && '(Leave empty to keep current)'}
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
            />
            {formData.thumbnail && (
              <span className="file-name">{formData.thumbnail.name}</span>
            )}
          </div>

          <div className="form">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Enter duration in seconds"
            />
          </div>

          <div className="form">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <div className="form">
            <button 
              type="submit" 
              disabled={loading}
              className=" btn-primary"
            >
              {loading ? 'Processing...' : editingVideo ? 'Update Video' : 'Upload Video'}
            </button>
            
            {editingVideo && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className=" btn-primary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Videos List */}
      <div className="videos-list-section">
        <h2>Uploaded Videos</h2>
        
        {loading && !videos.length && <p>Loading videos...</p>}
        
        {videos.length === 0 && !loading && (
          <p>No videos uploaded yet.</p>
        )}

        <div className="form">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              {video.thumbnail_url && (
                <img width={'130'} margin-top={"5"}

                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="video-thumbnail"
                />
              )}
              
              <div className="video-info">
                <h3>{video.title}</h3>
                <p className="video-description">{video.description}</p>
                
                <div className="video-meta">
                  <span className={`status-badge status-${video.status}`}>
                    {video.status}
                  </span>
                  {video.duration && (
                    <span className="duration">{video.duration}s</span>
                  )}
                  <span className="views">{video.views_count} views</span>
                </div>
                
                <div className="video-dates">
                  <small>Created: {new Date(video.created_at).toLocaleDateString()}</small>
                </div>
                
                <div className="video-actions">
                  <a 
                    href={video.video_file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-link"
                  >
                    Watch
                  </a>
                  <button 
                    onClick={() => handleEdit(video)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;