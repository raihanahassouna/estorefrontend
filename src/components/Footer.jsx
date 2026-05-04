import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../services/categoryService";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    .footer-link {
      position: relative;
      text-decoration: none;
      color: #4A5568;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      display: inline-block;
    }
    
    .footer-link:hover {
      color: #3182CE;
      transform: translateX(5px);
    }
    
    .footer-social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #F7FAFC;
      border-radius: 50%;
      color: #3182CE;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .footer-social-icon:hover {
      background: #3182CE;
      color: white;
      transform: translateY(-3px);
    }
    
    .newsletter-input {
      background: #F7FAFC;
      border: 2px solid #E2E8F0;
      padding: 12px 15px;
      border-radius: 12px;
      flex: 1;
      font-size: 13px;
      transition: all 0.3s ease;
    }
    
    .newsletter-input:focus {
      outline: none;
      border-color: #3182CE;
      box-shadow: 0 0 0 3px rgba(49,130,206,0.1);
    }
    
    .footer-btn {
      background: #3182CE;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .footer-btn:hover {
      background: #1A2B3C;
      transform: translateY(-2px);
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .footer-section-animate {
      animation: fadeInUp 0.6s ease-out;
    }
  `;

  const footerSections = [
   
    {
      title: "SERVICE CLIENT",
      links: [
       
        { name: "Livraison", path: "/delivery" },
        { name: "Retours", path: "/returns" },
        { name: "Paiement sécurisé", path: "/payment" }
      ]
    },
    
  ];

  return (
    <>
      <style>{styles}</style>
      
      <footer style={{
        backgroundColor: "#F7FAFC",
        padding: "60px 40px 20px",
        marginTop: "60px",
        fontFamily: '"Inter", sans-serif',
        borderTop: "1px solid #E2E8F0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "50px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>
          {/* Colonne Marque */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="footer-section-animate">
            <Link to="/" style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#1A2B3C",
              textDecoration: "none",
              letterSpacing: "-0.5px",
            }}>
              VOTRE<span style={{ color: "#3182CE" }}>Boutique</span>™
            </Link>
            <p style={{
              color: "#4A5568",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: 0,
            }}>
              Solution de shopping innovante alliant technologie de pointe 
              et expérience utilisateur premium. Qualité, sécurité et rapidité.
            </p>
            
            {/* Réseaux sociaux */}
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              {[
                { icon: "fab fa-facebook-f", link: "https://facebook.com" },
                { icon: "fab fa-twitter", link: "https://twitter.com" },
                { icon: "fab fa-instagram", link: "https://instagram.com" },
                { icon: "fab fa-linkedin-in", link: "https://linkedin.com" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Sections dynamiques */}
          {footerSections.map((section, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "15px" }} className="footer-section-animate">
              <h4 style={{
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#3182CE",
                marginBottom: "5px",
              }}>
                {section.title}
              </h4>
              {section.links.map((link, linkIdx) => (
                <Link
                  key={linkIdx}
                  to={link.path}
                  className="footer-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}

          {/* Catégories */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }} className="footer-section-animate">
            <h4 style={{
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#3182CE",
              marginBottom: "5px",
            }}>
              CATÉGORIES
            </h4>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/catalog?category=${c.name}`}
                className="footer-link"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }} className="footer-section-animate">
            <h4 style={{
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#3182CE",
              marginBottom: "5px",
            }}>
              NEWSLETTER
            </h4>
            <p style={{ color: "#4A5568", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
              Recevez nos offres exclusives et nouveautés directement dans votre boîte mail.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="footer-btn" type="submit">
                <i className="fas fa-paper-plane" style={{ marginRight: "8px" }}></i>
                S'ABONNER
              </button>
            </form>
            {isSubmitted && (
              <div style={{
                background: "#3182CE",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "12px",
                textAlign: "center",
                animation: "fadeInUp 0.3s ease",
              }}>
                ✅ Merci pour votre inscription !
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: "60px",
          paddingTop: "25px",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          fontSize: "11px",
          color: "#4A5568",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}>
          <div>
            <i className="far fa-copyright" style={{ marginRight: "4px" }}></i>
            2026 VOTRE Boutique — TOUS DROITS RÉSERVÉS
          </div>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                alt="Visa"
                style={{ height: "20px", opacity: 0.6 }}
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                alt="Mastercard"
                style={{ height: "20px", opacity: 0.6 }}
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
                alt="PayPal"
                style={{ height: "20px", opacity: 0.6 }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#27ae60", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
              <span>SERVEUR ACTIF</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;