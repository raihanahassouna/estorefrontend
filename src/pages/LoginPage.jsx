import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects.");
      }

      localStorage.setItem("token", data.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6fb;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Decorative background blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 520px; height: 520px;
          background: #1a73e8;
          top: -120px; left: -160px;
          animation: floatBlob 9s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 380px; height: 380px;
          background: #0d47a1;
          bottom: -80px; right: -100px;
          animation: floatBlob 11s ease-in-out infinite alternate-reverse;
        }
        .blob-3 {
          width: 240px; height: 240px;
          background: #64b5f6;
          top: 55%; left: 60%;
          animation: floatBlob 7s ease-in-out infinite alternate;
        }
        @keyframes floatBlob {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* Card */
        .card-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 920px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(26,115,232,0.13), 0 4px 16px rgba(0,0,0,0.08);
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(24px)"};
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        /* Left panel */
        .panel-left {
          flex: 1;
          background: linear-gradient(145deg, #1565c0 0%, #1a73e8 55%, #42a5f5 100%);
          padding: 56px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #fff;
          min-height: 560px;
          position: relative;
          overflow: hidden;
        }
        .panel-left::before {
          content: '';
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          bottom: -100px; right: -100px;
        }
        .panel-left::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.1);
          top: -60px; left: -60px;
        }

        .brand-logo {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.3px;
          color: #fff;
        }
        .brand-logo span { font-weight: 300; opacity: 0.85; }

        .panel-tagline {
          position: relative; z-index: 1;
        }
        .panel-tagline h2 {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 16px;
          color: #fff;
        }
        .panel-tagline p {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.7;
          opacity: 0.82;
          max-width: 280px;
        }

        .panel-perks {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative; z-index: 1;
        }
        .perk {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          opacity: 0.9;
        }
        .perk-icon {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        /* Right panel */
        .panel-right {
          flex: 1.1;
          background: #fff;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header { margin-bottom: 36px; }
        .form-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 600;
          color: #0d1f3c;
          margin-bottom: 8px;
        }
        .form-header p {
          font-size: 14px;
          color: #7a869a;
          font-weight: 400;
        }

        /* Input group */
        .field { margin-bottom: 22px; position: relative; }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #445069;
          margin-bottom: 8px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ab0cc;
          font-size: 16px;
          pointer-events: none;
          line-height: 1;
        }
        .field input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 1.5px solid #dde3ee;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #0d1f3c;
          background: #f8fafd;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        .field input:focus {
          border-color: #1a73e8;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(26,115,232,0.1);
        }
        .field input::placeholder { color: #b0bec5; }

        .toggle-pass {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ab0cc;
          font-size: 16px;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }
        .toggle-pass:hover { color: #1a73e8; }

        .field-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }
        .check-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #6b7c93; cursor: pointer;
          user-select: none;
        }
        .check-label input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #1a73e8;
          cursor: pointer;
        }
        .forgot-link {
          font-size: 13px;
          color: #1a73e8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #1557b0; text-decoration: underline; }

        /* Error / success */
        .alert {
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13.5px;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideIn 0.3s ease;
        }
        .alert-error { background: #fef2f2; color: #c0392b; border: 1px solid #fecaca; }
        .alert-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Submit btn */
        .btn-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 18px rgba(26,115,232,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(26,115,232,0.45);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.72; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
          color: #c5d0de; font-size: 12px; text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e8ecf2;
        }

        .signup-row {
          text-align: center;
          font-size: 13.5px;
          color: #7a869a;
        }
        .signup-row a {
          color: #1a73e8;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .signup-row a:hover { color: #1557b0; text-decoration: underline; }

        /* Responsive */
        @media (max-width: 680px) {
          .panel-left { display: none; }
          .panel-right { padding: 40px 28px; }
          .card-wrap { max-width: 440px; }
        }
      `}</style>

      <div className="login-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="card-wrap">
          {/* ── Left panel ── */}
          <div className="panel-left">
            <div className="brand-logo">
              VOTRE<span>Boutique</span>™
            </div>

            <div className="panel-tagline">
              <h2>Bienvenue sur votre espace personnel</h2>
              <p>
                Accédez à vos commandes, favoris et offres exclusives en toute sécurité.
              </p>
            </div>

            <div className="panel-perks">
              <div className="perk">
                <div className="perk-icon">🚚</div>
                <span>Livraison rapide & gratuite</span>
              </div>
              <div className="perk">
                <div className="perk-icon">🔒</div>
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="perk">
                <div className="perk-icon">💎</div>
                <span>Offres exclusives membres</span>
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="panel-right">
            <div className="form-header">
              <h1>Connexion</h1>
              <p>Entrez vos identifiants pour accéder à votre compte.</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <span>✅</span> Connexion réussie ! Redirection en cours…
              </div>
            )}

            <div className="field">
              <label>Adresse e-mail</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label>Mot de passe</label>
              <div className="input-wrap">
                <span className="input-icon">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Afficher/masquer le mot de passe"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="field-row">
              <label className="check-label">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-link">Mot de passe oublié ?</a>
            </div>

            <button
              className="btn-submit"
              onClick={login}
              disabled={loading || success}
            >
              {loading ? (
                <><div className="spinner" /> Connexion en cours…</>
              ) : (
                <> Se connecter →</>
              )}
            </button>

            <div className="divider">ou</div>

            <div className="signup-row">
              Pas encore de compte ?
              <a href="/register">Créer un compte</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}