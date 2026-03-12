import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config'; // config lives one level up
import './videoUpload.css';

const VideoUpload = () => {
  // debug
  console.log('VideoUpload component rendered');
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Get JWT token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : null;
  };

  // Configure axios with JWT token and base URL
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = getAuthToken();
    // ensure every request hits the Django API proxy
    axios.defaults.baseURL = API_BASE_URL;
  }, []);

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
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.get('/videos/');

      // normalize a few shapes we know the backend has returned in the past
      const respData = response.data;
      let list;

      if (Array.isArray(respData)) {
        // some legacy endpoints returned a raw array
        list = respData;
      } else if (Array.isArray(respData.data)) {
        // current API wraps the array in `data`
        list = respData.data;
      } else if (Array.isArray(respData.videos)) {
        // older commented‑out view returned { videos: [...] }
        list = respData.videos;
      }

      if (Array.isArray(list)) {
        setVideos(list);
      } else {
        console.warn('fetchVideos: expected array, got', respData);
        setVideos([]);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];
      // Validate file type (some browsers leave type blank)
      if (!selectedFile.type || !selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    } else {
      // user cleared the input
      setFile(null);
      setPreview(null);
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
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      const response = await axios.post('/videos/upload/', formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      // API returns {status,message,data}
      const newVideo = response.data?.data || response.data;
      if (response.data?.message) {
        alert(response.data.message);
      }
      if (newVideo) {
        setVideos([newVideo, ...videos]);
        setFile(null);
        setTitle('');
        setDescription('');
        setPreview(null);
        setError(null);
        alert('Video uploaded successfully!');
      } else {
        setError('Upload failed: Invalid response format');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    console.log('edit video', video);
    alert('Edit feature coming soon');
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      await axios.delete(`/videos/${videoId}/`, {
        headers: {
          'Authorization': token
        }
      });
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

          {/* Preview selected video */}
          {preview && (
            <div className="form-group preview-container">
              <label>Preview</label>
              <video
                src={preview}
                controls
                className="video-preview"
                width="100%"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file || !title.trim()}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>

      {/* Video List */}
      {videos.length > 0 ? (
        <div className="video-list">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <div className="video-dates">
                <small>
                  Created: {new Date(video.uploaded_at).toLocaleDateString()}
                </small>
                {video.file_size != null && (
                  <small>Size: {video.file_size} MB</small>
                )}
                {video.uploaded_by && (
                  <small>By: {video.uploaded_by.username}</small>
                )}
              </div>
              <div className="video-actions">
                <a
                  href={video.file_url}
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
          ))}
        </div>
      ) : (
        <div className="no-videos">
          {loading ? 'Loading videos...' : 'No videos uploaded yet'}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
