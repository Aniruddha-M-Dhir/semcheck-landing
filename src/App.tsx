// @ts-nocheck
import { BackgroundParticles } from './BackgroundParticles';
import logo from './assets/SemCheck_logo.webp';
import './index.css';

function App() {
  return (
    <>
      <div className="background-glow"></div>
      <BackgroundParticles />
      
      <nav className="navbar">
      </nav>

      <main>
        <section className="hero">
          <div className="hero-logo-container">
            <img src={logo} alt="SemCheck Logo" className="hero-logo-img" />
          </div>
          
          <h1 className="hero-brand">SemCheck</h1>
          <h2 className="hero-tagline">Know before you enroll.</h2>
          
          <p className="hero-subtitle">
            SemCheck is the anonymous, verified platform for students to read and write real professor and course reviews. 
            No spam, no fake reviews. Just real students helping each other.
          </p>
          
          <div className="cta-container">
            <a href="#" className="cta-button">
              <ion-icon name="logo-apple" style={{ fontSize: '24px' }}></ion-icon>
              Download on iOS
            </a>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><ion-icon name="shield-checkmark" style={{ color: 'var(--accent-light)' }}></ion-icon></div>
              <h3 className="feature-title">100% Verified</h3>
              <p className="feature-desc">Every user is verified via their .edu email. No bots, no outsiders.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon"><ion-icon name="eye-off" style={{ color: 'var(--accent-light)' }}></ion-icon></div>
              <h3 className="feature-title">Anonymous</h3>
              <p className="feature-desc">Speak your mind without fear. Identity is never attached to reviews.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon"><ion-icon name="sparkles" style={{ color: 'var(--accent-light)' }}></ion-icon></div>
              <h3 className="feature-title">AI Insights</h3>
              <p className="feature-desc">Instantly search for professors and get quick summaries.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-links">
          <a href="https://aniruddha-m-dhir.github.io/semcheck-privacy/">Privacy Policy</a>
          <a href="https://aniruddha-m-dhir.github.io/semcheck-privacy/terms.html">Terms of Service</a>
          <a href="mailto:verify@aniruddhamdhir.dev">Contact Support</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Aniruddha Dhir. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
