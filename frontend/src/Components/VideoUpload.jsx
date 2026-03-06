import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './videoUpload.css';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Generate preview when file is selected
  useEffect(() => {
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);
      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [file]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/videos/');
      setVideos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files;
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      setError('Please select a file and enter a title');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      const response = await axios.post('/api/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setVideos([response.data, ...videos]);
      setFile(null);
      setTitle('');
      setDescription('');
      setPreview(null);
      setError(null);
      alert('Video uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  {/*const handleClearForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setPreview(null);
    setError(null);
  };
  */}

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await axios.delete(`/api/videos/${videoId}/`);
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
    }
  };

  return (
    <div className="video-upload-container">
      <h1>Video Manager</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Upload Form */}
      <div className="upload-section">
        <h2>Upload New Video</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              maxLength="255"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Video File *</label>
            <input
              id="file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
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
                    onClick={() => handleEdit(videos)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(videos.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
            
          </form>
          </div>
          </div>
  )
}
export default VideoUpload
