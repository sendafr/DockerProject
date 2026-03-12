import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from './api2';
import { useAuthentication } from '../Auth';
import styles from './Home.module.css';
import VideoUpload from './VideoUpload';

export default function Home() {
  const { logout }              = useAuthentication();
  const navigate                = useNavigate();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // ─── Edit Profile State ───────────────────────────────────────────────────
  const [editMode, setEditMode]   = useState(false);
  const [editData, setEditData]   = useState({ username: '', bio: '' });
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');

  // ─── Change Password State ────────────────────────────────────────────────
  const [pwMode, setPwMode]       = useState(false);
  const [pwData, setPwData]       = useState({
    old_password: '',
    new_password: '',
  });
  const [pwError, setPwError]     = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSaving, setPwSaving]   = useState(false);

  // ─── Delete Confirm State ─────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ─── Fetch Profile on Mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileAPI.get();
        setUser(data);
        setEditData({ username: data.username, bio: data.bio || '' });
      } catch (err) {
        setError('Failed to load profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // debug logging for auth/profile state
  useEffect(() => {
    console.log('Home auth/network state:', { loading, error, user });
  }, [loading, error, user]);

  // ─── Update Profile ───────────────────────────────────────────────────────
   const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const { data } = await profileAPI.update(editData);
      setUser(data); // ← Update user state with server response
      setEditData({ username: data.username, bio: data.bio || '' }); // ← Sync form
      setSaveMsg('✅ Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setSaveMsg('❌ Failed to update profile.');
      console.error(err);
    } finally {
      setSaving(false);
    }
};

  // ─── Change Password ──────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    setPwSaving(true);
    try {
      await profileAPI.changePassword(pwData);
      setPwSuccess('Password changed successfully!');
      setPwData({ old_password: '', new_password: '' });
      setPwMode(false);
    } catch (err) {
      const data = err.response?.data;
      const msg  = data
        ? Object.values(data).flat().join(' ')
        : 'Failed to change password.';
      setPwError(msg);
    } finally {
      setPwSaving(false);
    }
  };

  // ─── Delete Account ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await profileAPI.delete();
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account.');
      console.error(err);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <VideoUpload />
        <div className={styles.centered}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <VideoUpload />
        <div className={styles.centered}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <VideoUpload />
      <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Welcome Banner ── */}
        <div className={styles.banner}>
          <div className={styles.avatarCircle}>
            {user.usernames}
          </div>
          <div>
            <h1 className={styles.welcomeTitle}>
              Welcome, {user?.username}! 👋
            </h1>
            <p className={styles.welcomeSub}>{user?.email}</p>
          </div>
        </div>

        {/* ── Success / Error Messages ── */}
        {saveMsg && (
          <div className={saveMsg.includes('success')
            ? styles.alertSuccess
            : styles.alertError}>
            {saveMsg}
          </div>
        )}

        {/* ── Profile Card ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>👤 Profile Details</h2>
            <button
              className={styles.editBtn}
              onClick={() => { setEditMode(!editMode); setSaveMsg(''); }}
            >
              {editMode ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          {editMode ? (
            // ── Edit Form ──
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Username</label>
                <input
                  className={styles.input}
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Bio</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          ) : (
            // ── Profile View ──
            <div className={styles.profileInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Username</span>
                <span className={styles.infoValue}>{user?.username}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user?.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Bio</span>
                <span className={styles.infoValue}>
                  {user?.bio || <em className={styles.empty}>No bio yet</em>}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Member Since</span>
                <span className={styles.infoValue}>
                  {new Date(user?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Change Password Card ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>🔑 Change Password</h2>
            <button
              className={styles.editBtn}
              onClick={() => { setPwMode(!pwMode); setPwError(''); setPwSuccess(''); }}
            >
              {pwMode ? 'Cancel' : '🔒 Change'}
            </button>
          </div>

          {pwSuccess && (
            <div className={styles.alertSuccess}>{pwSuccess}</div>
          )}
          {pwError && (
            <div className={styles.alertError}>{pwError}</div>
          )}

          {pwMode && (
            <form onSubmit={handleChangePassword} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Current Password</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={pwData.old_password}
                  onChange={(e) =>
                    setPwData({ ...pwData, old_password: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>New Password</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={pwData.new_password}
                  onChange={(e) =>
                    setPwData({ ...pwData, new_password: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={pwSaving}
              >
                {pwSaving ? 'Updating...' : '🔑 Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* ── Danger Zone Card ── */}
        <div className={`${styles.card} ${styles.dangerCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={`${styles.cardTitle} ${styles.dangerTitle}`}>
              ⚠️ Danger Zone
            </h2>
          </div>
          <p className={styles.dangerText}>
            Permanently delete your account and all associated data.
            This action <strong>cannot be undone</strong>.
          </p>

          {!confirmDelete ? (
            <button
              className={styles.deleteBtn}
              onClick={() => setConfirmDelete(true)}
            >
              🗑️ Delete Account
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>
                Are you absolutely sure?
              </p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.confirmYes}
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className={styles.confirmNo}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}