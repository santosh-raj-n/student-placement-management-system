import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile } from "../api/profileApi";
import AcademicProgramFields from "../components/AcademicProgramFields";
import useAuth from "../hooks/useAuth";
import "../styles/Profile.css";

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({ name: "", degree: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;
    getStudentProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const startEditing = () => {
    setDraft({
      name: profile.name || "",
      degree: profile.degree || "",
      department: profile.department || "",
    });
    setSaveError("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError("");
  };

  const saveChanges = async (event) => {
    event.preventDefault();
    setSaveError("");
    setSuccessMessage("");

    if (!draft.name.trim() || !draft.degree || !draft.department) {
      setSaveError("Please complete your name, degree, and department.");
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await updateStudentProfile({
        name: draft.name.trim(),
        degree: draft.degree,
        department: draft.department,
      });
      setProfile(updatedProfile);
      updateUser?.({
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
        id: updatedProfile.id,
        degree: updatedProfile.degree,
        department: updatedProfile.department,
      });
      setIsEditing(false);
      setSuccessMessage("Your profile has been updated.");
    } catch (requestError) {
      setSaveError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-heading">
        <p className="profile-eyebrow">STUDENT ACCOUNT</p>
        <h1>My Profile</h1>
        <p>View and manage the information associated with your placement account.</p>
      </section>

      {loading ? (
        <div className="profile-message" role="status">Loading your profile…</div>
      ) : error ? (
        <div className="profile-message profile-error" role="alert">
          <h2>Profile unavailable</h2>
          <p>{error}</p>
        </div>
      ) : (
        <section className="profile-card" aria-label="Student profile information">
          <div className="profile-summary">
            <div className="profile-avatar" aria-hidden="true">
              {profile.name?.trim()?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="profile-summary-copy">
              <p className="profile-eyebrow">YOUR PROFILE</p>
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </div>
            {!isEditing && (
              <button className="profile-edit-button" type="button" onClick={startEditing}>
                Edit Profile
              </button>
            )}
          </div>

          {successMessage && <p className="profile-success" role="status">{successMessage}</p>}

          {isEditing ? (
            <form className="profile-edit-form" onSubmit={saveChanges}>
              <div className="profile-edit-grid">
                <div className="profile-field profile-form-field">
                  <label htmlFor="profile-name">Full name *</label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    required
                  />
                </div>
                <div className="profile-field profile-readonly-field">
                  <span>Email address</span>
                  <strong>{profile.email || "Not provided"}</strong>
                  <small>Email cannot be changed here.</small>
                </div>
                <AcademicProgramFields
                  degree={draft.degree}
                  department={draft.department}
                  onChange={(updates) => setDraft((current) => ({ ...current, ...updates }))}
                />
                <div className="profile-field profile-readonly-field">
                  <span>Account role</span>
                  <strong>{profile.role || "Not provided"}</strong>
                  <small>Account role cannot be changed.</small>
                </div>
              </div>

              {saveError && <p className="profile-form-error" role="alert">{saveError}</p>}
              <div className="profile-form-actions">
                <button className="profile-save-button" type="submit" disabled={saving}>
                  {saving ? "Saving Changes…" : "Save Changes"}
                </button>
                <button className="profile-cancel-button" type="button" onClick={cancelEditing} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <ProfileField label="Email address" value={profile.email} />
              <ProfileField label="Degree" value={profile.degree} />
              <ProfileField label="Department" value={profile.department} />
              <ProfileField label="Account role" value={profile.role} />
            </div>
          )}
        </section>
      )}
    </main>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="profile-field">
    <span>{label}</span>
    <strong>{value || "Not provided"}</strong>
  </div>
);

export default Profile;
