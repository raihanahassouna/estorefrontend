import React, { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';

function ProfilePage() {

  // USER CONNECTÉ
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // LOAD PROFILE
  useEffect(() => {

    let mounted = true;

    setLoading(true);

    profileService.get()
      .then(data => {

        if (!mounted) return;

        console.log("PROFILE =", data);

        setProfile(data);

        setPhone(data?.phone || '');
        setAddress(data?.address || '');
        setCity(data?.city || '');
        setCountry(data?.country || '');
      })

      .catch(err => {

        console.error('Fetch profile error', err);

        setError(
          err?.message ||
          'Impossible de charger le profil.'
        );
      })

      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };

  }, []);

  // VALIDATION
  const validate = () => {

    if (!phone || !address || !city) {

      setError(
        'Veuillez remplir les champs obligatoires : téléphone, adresse et ville.'
      );

      return false;
    }

    setError('');

    return true;
  };

  // SAVE PROFILE
  const handleSave = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {

      const payload = {
        phone,
        address,
        city,
        country
      };

      console.log("PAYLOAD =", payload);

      const updated = await profileService.update(payload);

      console.log("UPDATED =", updated);

      setProfile(updated);

      setSuccess('Profil mis à jour avec succès.');

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {

      console.error('Update profile error', err);

      setError(
        err?.message ||
        'Impossible de sauvegarder les modifications.'
      );

    } finally {

      setSaving(false);
    }
  };

  // STYLES
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    :root {
      --accent: #3182CE;
      --muted: #4A5568;
      --bg: #F7FAFC;
    }

    .profile-root{
      min-height:100vh;
      padding:40px;
      background:var(--bg);
      font-family: Inter, system-ui;
    }

    .profile-wrap{
      max-width:1000px;
      margin:0 auto;
      display:grid;
      grid-template-columns:320px 1fr;
      gap:24px;
    }

    .card{
      background:white;
      border-radius:14px;
      padding:20px;
      box-shadow:0 12px 40px rgba(0,0,0,0.06);
    }

    .profile-header{
      display:flex;
      gap:14px;
      align-items:center;
    }

    .avatar{
      width:84px;
      height:84px;
      border-radius:14px;
      overflow:hidden;
      background:linear-gradient(135deg,#e6eef9,#f3fbff);
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      color:var(--accent);
      font-size:28px;
    }

    .meta h2{
      margin:0;
      font-size:20px;
      font-weight:800;
      color:#1A2B3C;
    }

    .meta p{
      margin:4px 0 0 0;
      color:var(--muted);
      font-size:13px;
    }

    form{
      display:flex;
      flex-direction:column;
      gap:18px;
    }

    .field{
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    label{
      font-size:12px;
      font-weight:700;
      color:var(--muted);
      text-transform:uppercase;
      letter-spacing:0.06em;
    }

    input{
      padding:12px 14px;
      border-radius:10px;
      border:1.5px solid #E6EDF6;
      font-size:14px;
      outline:none;
    }

    input:focus{
      border-color:var(--accent);
    }

    .readonly{
      background:#f7fafc;
      color:#1A2B3C;
    }

    .actions{
      display:flex;
      gap:12px;
      align-items:center;
    }

    .btn-primary{
      background:linear-gradient(135deg,var(--accent),#1A73E8);
      color:white;
      padding:12px 18px;
      border-radius:10px;
      border:none;
      font-weight:800;
      cursor:pointer;
    }

    .btn-primary:disabled{
      opacity:0.7;
      cursor:not-allowed;
    }

    .btn-ghost{
      background:transparent;
      border:2px solid #E6EDF6;
      padding:10px 14px;
      border-radius:10px;
      cursor:pointer;
    }

    .alert{
      padding:12px 14px;
      border-radius:8px;
      font-weight:600;
    }

    .alert-error{
      background:#fff1f2;
      color:#c0392b;
      border:1px solid #fbcaca;
    }

    .alert-success{
      background:#f0fdf4;
      color:#166534;
      border:1px solid #bbf7d0;
    }

    @media (max-width:900px){

      .profile-wrap{
        grid-template-columns:1fr;
      }

      .avatar{
        width:72px;
        height:72px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="profile-root">

        <div className="profile-wrap">

          {/* LEFT CARD */}
          <aside className="card">

            <div className="profile-header">

              <div className="avatar">

                {profile?.avatarUrl ? (

                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                ) : (

                  <span>
                    {(user?.firstName?.[0] || '')}
                    {(user?.lastName?.[0] || '')}
                  </span>

                )}

              </div>

              <div className="meta">

                <h2>
                  {(user?.firstName || '')}
                  {' '}
                  {(user?.lastName || '')}
                </h2>

                <p>
                  {user?.email || ''}
                </p>

              </div>
            </div>

            <div style={{ marginTop: 18 }}>

              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#1A2B3C'
                }}
              >
                Informations
              </h3>

              <p
                style={{
                  color: '#718096',
                  marginTop: 8,
                  fontSize: 13
                }}
              >
                Gérez vos informations personnelles.
              </p>

            </div>

          </aside>

          {/* RIGHT CARD */}
          <div className="card">

            <div
              style={{
                marginBottom: 20
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 900
                }}
              >
                Mon profil
              </h2>

              <p
                style={{
                  marginTop: 6,
                  color: '#718096'
                }}
              >
                Vos informations personnelles
              </p>
            </div>

            {loading ? (

              <div>Chargement...</div>

            ) : (

              <form onSubmit={handleSave}>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
                )}

                {/* NOM */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12
                  }}
                >

                  <div className="field">
                    <label>Prénom</label>

                    <input
                      className="readonly"
                      value={user?.firstName || ''}
                      readOnly
                    />
                  </div>

                  <div className="field">
                    <label>Nom</label>

                    <input
                      className="readonly"
                      value={user?.lastName || ''}
                      readOnly
                    />
                  </div>

                </div>

                {/* EMAIL */}
                <div className="field">

                  <label>Email</label>

                  <input
                    className="readonly"
                    value={user?.email || ''}
                    readOnly
                  />

                </div>

                {/* PHONE */}
                <div className="field">

                  <label>Téléphone *</label>

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                  />

                </div>

                {/* ADDRESS */}
                <div className="field">

                  <label>Adresse *</label>

                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse"
                  />

                </div>

                {/* CITY + COUNTRY */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12
                  }}
                >

                  <div className="field">

                    <label>Ville *</label>

                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ville"
                    />

                  </div>

                  <div className="field">

                    <label>Pays</label>

                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Pays"
                    />

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="actions">

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? 'Enregistrement...'
                      : 'Sauvegarder les modifications'}
                  </button>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {

                      setPhone(profile?.phone || '');
                      setAddress(profile?.address || '');
                      setCity(profile?.city || '');
                      setCountry(profile?.country || '');

                      setError('');
                    }}
                  >
                    Annuler
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default ProfilePage;