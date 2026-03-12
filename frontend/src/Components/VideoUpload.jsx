import React, { useState, useEffect } from 'react';
import axios from 'axios';

// video model fields: id, title, description, file (URL), uploaded_by, uploaded_at
const API_BASE = 'http://localhost:8000';
const LIST_URL = `${API_BASE}/list_videos/`;
// backend endpoint is defined as create_video/ (singular)
const CREATE_URL = `${API_BASE}/create_video/`;

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [editing, setEditing] = useState(null); // the video object we're editing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const resp = await axios.get(LIST_URL);
      setVideos(resp.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load videos');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', file: null });
    setEditing(null);
    setError(null);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    setFormData((f) => ({ ...f, file: e.target.files[0] }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      setError('Title is required');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    if (formData.file) payload.append('file', formData.file);

    try {
      setLoading(true);
      setError(null);
      if (editing) {
        // update
        await axios.patch(`${API_BASE}/videos/${editing.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Video updated');
      } else {
        // create
        await axios.post(CREATE_URL, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Video created');
      }
      resetForm();
      fetchVideos();
    } catch (err) {
      console.error(err);
      setError('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (video) => {
    setEditing(video);
    setFormData({
      title: video.title || '',
      description: video.description || '',
      file: null, // user must reselect if they want to replace
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`${API_BASE}/videos/${id}/`);
      setVideos((v) => v.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    }
  };

  return (
    <div className="video-upload-page">
      <h2>{editing ? 'Edit Video' : 'Upload a Video'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInput}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInput}
          />
        </div>
        <div>
          <label>File</label>
          <input type="file" accept="video/*" onChange={handleFile} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editing ? 'Update' : 'Upload'}
        </button>
        {editing && <button onClick={resetForm}>Cancel</button>}
      </form>
      {error && <p className="error">{error}</p>}

      <hr />
      <h3>Videos</h3>
      {videos.length === 0 && <p>No videos found</p>}
      <ul className="video-list">
        {videos.map((v) => (
          <li key={v.id} className="video-item">
            <video
              width="320"
              height="240"
              controls
              src={v.file}
              preload="metadata"
            />
            <strong>{v.title}</strong>
            <p>{v.description}</p>
            <button onClick={() => startEdit(v)}>Edit</button>
            <button onClick={() => handleDelete(v.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoUpload;
