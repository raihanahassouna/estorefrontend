import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [agreed, setAgreed]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* ── password strength ── */
  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0-4
  })();
  const strengthLabel = ["", "Faible", "Moyen", "Bon", "Excellent"][strength];
  const strengthColor = ["#e0e0e0", "#ef5350", "#ffa726", "#66bb6a", "#1a73e8"][strength];

  /* ── validation ── */
  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Veuillez renseigner votre prénom et nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Adresse e-mail invalide.";
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (password !== confirm) return "Les mots de passe ne correspondent pas.";
    if (!agreed) return "Vous devez accepter les conditions d'utilisation.";
    return null;
  };

  /* ── submit ── */
  const register = async () => {
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6fb;
          font-family: 'DM Sans', sans-serif;
          padding: 32px 16px;
          position: relative;
          overflow: hidden;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.16;
          pointer-events: none;
          z-index: 0;
        }
        .b1 { width:560px; height:560px; background:#1a73e8; top:-160px; left:-180px; animation: fb 10s ease-in-out infinite alternate; }
        .b2 { width:400px; height:400px; background:#0d47a1; bottom:-100px; right:-120px; animation: fb 13s ease-in-out infinite alternate-reverse; }
        .b3 { width:260px; height:260px; background:#64b5f6; top:60%; left:55%; animation: fb 8s ease-in-out infinite alternate; }
        @keyframes fb { from{transform:translate(0,0) scale(1)} to{transform:translate(28px,18px) scale(1.07)} }

        /* ── Card ── */
        .card-wrap {
          position: relative; z-index: 1;
          display: flex;
          width: 100%; max-width: 980px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(26,115,232,.13), 0 4px 16px rgba(0,0,0,.07);
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(26px)"};
          transition: opacity .7s ease, transform .7s ease;
        }

        /* ── Left panel ── */
        .panel-left {
          width: 320px; flex-shrink: 0;
          background: linear-gradient(150deg, #1557b0 0%, #1a73e8 55%, #42a5f5 100%);
          padding: 52px 40px;
          display: flex; flex-direction: column; justify-content: space-between;
          color: #fff; position: relative; overflow: hidden;
        }
        .panel-left::before {
          content:''; position:absolute;
          width:360px; height:360px; border-radius:50%;
          border:1.5px solid rgba(255,255,255,.13);
          bottom:-120px; right:-120px;
        }
        .panel-left::after {
          content:''; position:absolute;
          width:220px; height:220px; border-radius:50%;
          border:1.5px solid rgba(255,255,255,.09);
          top:-70px; left:-70px;
        }

        .brand { font-weight:700; font-size:21px; letter-spacing:-.2px; }
        .brand span { font-weight:300; opacity:.82; }

        .left-tag { position:relative; z-index:1; }
        .left-tag h2 {
          font-family:'Playfair Display',serif;
          font-size:31px; font-weight:600; line-height:1.3; margin-bottom:14px;
        }
        .left-tag p { font-size:14px; font-weight:300; line-height:1.75; opacity:.82; }

        .steps { display:flex; flex-direction:column; gap:16px; position:relative; z-index:1; }
        .step { display:flex; align-items:flex-start; gap:14px; }
        .step-num {
          width:28px; height:28px; border-radius:50%;
          background:rgba(255,255,255,.2);
          display:flex; align-items:center; justify-content:center;
          font-size:12px; font-weight:700; flex-shrink:0; margin-top:1px;
        }
        .step-info strong { display:block; font-size:14px; font-weight:600; margin-bottom:2px; }
        .step-info span { font-size:13px; opacity:.75; font-weight:300; }

        /* ── Right panel ── */
        .panel-right {
          flex:1; background:#fff;
          padding: 48px 52px;
          display:flex; flex-direction:column; justify-content:center;
        }

        .form-head { margin-bottom:32px; }
        .form-head h1 {
          font-family:'Playfair Display',serif;
          font-size:28px; font-weight:600; color:#0d1f3c; margin-bottom:6px;
        }
        .form-head p { font-size:14px; color:#7a869a; }

        /* ── Alerts ── */
        .alert {
          border-radius:10px; padding:12px 16px;
          font-size:13.5px; font-weight:500;
          margin-bottom:20px;
          display:flex; align-items:center; gap:10px;
          animation: slideIn .3s ease;
        }
        .alert-err  { background:#fef2f2; color:#c0392b; border:1px solid #fecaca; }
        .alert-ok   { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        /* ── Grid ── */
        .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

        /* ── Fields ── */
        .field { margin-bottom:18px; }
        .field label {
          display:block;
          font-size:11.5px; font-weight:600; letter-spacing:.06em;
          text-transform:uppercase; color:#445069; margin-bottom:7px;
        }
        .input-wrap { position:relative; }
        .ico {
          position:absolute; left:15px; top:50%; transform:translateY(-50%);
          color:#9ab0cc; font-size:15px; pointer-events:none; line-height:1;
        }
        .field input[type="text"],
        .field input[type="email"],
        .field input[type="password"] {
          width:100%;
          padding:13px 14px 13px 42px;
          border:1.5px solid #dde3ee; border-radius:12px;
          font-family:'DM Sans',sans-serif; font-size:14.5px;
          color:#0d1f3c; background:#f8fafd;
          outline:none;
          transition:border-color .2s, box-shadow .2s, background .2s;
          -webkit-appearance:none;
        }
        .field input:focus {
          border-color:#1a73e8; background:#fff;
          box-shadow:0 0 0 4px rgba(26,115,232,.1);
        }
        .field input::placeholder { color:#b0bec5; }
        .field input.err-input { border-color:#ef5350; }

        .eye-btn {
          position:absolute; right:13px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#9ab0cc; font-size:15px; padding:4px;
          transition:color .2s; line-height:1;
        }
        .eye-btn:hover { color:#1a73e8; }

        /* ── Strength bar ── */
        .strength-wrap { margin-top:8px; }
        .strength-bar {
          height:4px; border-radius:99px;
          background:#e8ecf2; overflow:hidden; margin-bottom:5px;
        }
        .strength-fill {
          height:100%; border-radius:99px;
          transition:width .4s ease, background .4s ease;
        }
        .strength-label { font-size:12px; font-weight:500; }

        /* ── Checkbox ── */
        .check-row {
          display:flex; align-items:flex-start; gap:10px;
          margin-bottom:24px;
        }
        .check-row input[type="checkbox"] {
          width:16px; height:16px; flex-shrink:0; margin-top:2px;
          accent-color:#1a73e8; cursor:pointer;
        }
        .check-row label {
          font-size:13px; color:#6b7c93; line-height:1.6; cursor:pointer;
        }
        .check-row label a { color:#1a73e8; text-decoration:none; font-weight:500; }
        .check-row label a:hover { text-decoration:underline; }

        /* ── Button ── */
        .btn-submit {
          width:100%; padding:15px;
          background:linear-gradient(135deg,#1a73e8 0%,#1557b0 100%);
          color:#fff; border:none; border-radius:12px;
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600;
          letter-spacing:.02em; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 4px 18px rgba(26,115,232,.35);
          transition:transform .15s, box-shadow .2s, opacity .2s;
        }
        .btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(26,115,232,.45); }
        .btn-submit:active:not(:disabled) { transform:translateY(0); }
        .btn-submit:disabled { opacity:.7; cursor:not-allowed; }

        .spinner {
          width:17px; height:17px;
          border:2.5px solid rgba(255,255,255,.35);
          border-top-color:#fff; border-radius:50%;
          animation:spin .7s linear infinite;
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        .divider {
          display:flex; align-items:center; gap:12px;
          margin:22px 0; color:#c5d0de;
          font-size:12px; text-transform:uppercase; letter-spacing:.08em;
        }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:#e8ecf2; }

        .login-row { text-align:center; font-size:13.5px; color:#7a869a; }
        .login-row a { color:#1a73e8; font-weight:600; text-decoration:none; margin-left:4px; }
        .login-row a:hover { color:#1557b0; text-decoration:underline; }

        /* ── Success card ── */
        .success-card {
          text-align:center; padding:40px 20px;
          animation: slideIn .5s ease;
        }
        .success-icon {
          font-size:52px; margin-bottom:18px;
          animation: pop .4s ease;
        }
        @keyframes pop { from{transform:scale(0)} to{transform:scale(1)} }
        .success-card h2 {
          font-family:'Playfair Display',serif;
          font-size:26px; color:#0d1f3c; margin-bottom:10px;
        }
        .success-card p { font-size:14.5px; color:#6b7c93; line-height:1.7; }
        .success-card a {
          display:inline-block; margin-top:26px;
          padding:13px 32px;
          background:linear-gradient(135deg,#1a73e8,#1557b0);
          color:#fff; border-radius:12px; text-decoration:none;
          font-weight:600; font-size:15px;
          box-shadow:0 4px 16px rgba(26,115,232,.35);
          transition:transform .15s, box-shadow .2s;
        }
        .success-card a:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(26,115,232,.45); }

        @media (max-width:700px) {
          .panel-left { display:none; }
          .panel-right { padding:36px 24px; }
          .grid-2 { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="reg-root">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />

        <div className="card-wrap">

          {/* ── Left Panel ── */}
          <div className="panel-left">
            <div className="brand">VOTRE<span>Boutique</span>™</div>

            <div className="left-tag">
              <h2>Rejoignez notre communauté</h2>
              <p>Créez votre compte en quelques secondes et profitez d'une expérience shopping unique.</p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-info">
                  <strong>Créez votre compte</strong>
                  <span>Rapide et sécurisé</span>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div className="step-info">
                  <strong>Explorez le catalogue</strong>
                  <span>Des milliers de produits</span>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div className="step-info">
                  <strong>Commandez & profitez</strong>
                  <span>Livraison rapide & suivi</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="panel-right">

            {success ? (
              <div className="success-card">
                <div className="success-icon">🎉</div>
                <h2>Compte créé avec succès !</h2>
                <p>Bienvenue sur VotreBoutique™.<br />Vous pouvez maintenant vous connecter et commencer à explorer.</p>
                <a href="/login">Se connecter →</a>
              </div>
            ) : (
              <>
                <div className="form-head">
                  <h1>Créer un compte</h1>
                  <p>Remplissez les informations ci-dessous pour commencer.</p>
                </div>

                {error && (
                  <div className="alert alert-err">⚠️ {error}</div>
                )}

                {/* Name row */}
                <div className="grid-2">
                  <div className="field">
                    <label>Prénom</label>
                    <div className="input-wrap">
                      <span className="ico">👤</span>
                      <input
                        type="text"
                        placeholder="Jean"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Nom</label>
                    <div className="input-wrap">
                      <span className="ico">👤</span>
                      <input
                        type="text"
                        placeholder="Dupont"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="field">
                  <label>Adresse e-mail</label>
                  <div className="input-wrap">
                    <span className="ico">✉</span>
                    <input
                      type="email"
                      placeholder="jean.dupont@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field">
                  <label>Mot de passe</label>
                  <div className="input-wrap">
                    <span className="ico">🔑</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label="Afficher/masquer"
                    >
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>

                  {password && (
                    <div className="strength-wrap">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${(strength / 4) * 100}%`,
                            background: strengthColor,
                          }}
                        />
                      </div>
                      <span className="strength-label" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div className="field">
                  <label>Confirmer le mot de passe</label>
                  <div className="input-wrap">
                    <span className="ico">🔒</span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Répétez le mot de passe"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      className={confirm && confirm !== password ? "err-input" : ""}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label="Afficher/masquer"
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p style={{ fontSize: "12px", color: "#ef5350", marginTop: "6px" }}>
                      Les mots de passe ne correspondent pas.
                    </p>
                  )}
                </div>

                {/* CGU */}
                <div className="check-row">
                  <input
                    type="checkbox"
                    id="cgu"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="cgu">
                    J'accepte les{" "}
                    <a href="/cgu">conditions générales d'utilisation</a> et la{" "}
                    <a href="/confidentialite">politique de confidentialité</a>.
                  </label>
                </div>

                {/* Submit */}
                <button
                  className="btn-submit"
                  onClick={register}
                  disabled={loading}
                >
                  {loading ? (
                    <><div className="spinner" /> Création en cours…</>
                  ) : (
                    <>Créer mon compte →</>
                  )}
                </button>

                <div className="divider">ou</div>
                <div className="login-row">
                  Déjà un compte ?<a href="/login">Se connecter</a>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}