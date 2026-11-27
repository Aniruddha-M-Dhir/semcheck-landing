// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import logo from './assets/SemCheck_logo.webp';
import './index.css';

// Sample Professor Profiles for Interactive Sandbox
const PROFESSORS = [
  {
    id: 'vance',
    name: 'Dr. Elena Vance',
    department: 'Computer Science & Software Engineering',
    avatar: 'EV',
    overallScore: 4.9,
    reviewCount: 42,
    scores: {
      clarity: 4.9,
      grading: 4.8,
      workload: 3.8,
      organization: 5.0,
      approachability: 4.9,
      retake: 4.9,
    },
    sampleReview: "Took CSC 413 this spring. Lectures are brilliantly structured with real production examples. Exams are challenging but 100% fair based on lecture slides.",
    geminiTags: ['#ClearLectures', '#FairGrader', '#ProjectDriven', '#RealWorldExamples'],
    geminiSummary: "Highly engaging lecturer with transparent grading standards; weekly lab projects demand steady effort but yield tremendous practical skills."
  },
  {
    id: 'sterling',
    name: 'Prof. Marcus Sterling',
    department: 'Economics & Behavioral Finance',
    avatar: 'MS',
    overallScore: 4.3,
    reviewCount: 38,
    scores: {
      clarity: 4.4,
      grading: 4.1,
      workload: 3.5,
      organization: 4.6,
      approachability: 4.2,
      retake: 4.3,
    },
    sampleReview: "Discussion heavy and ties every theory into current market headlines. Keep up with the weekly readings and you will do well on the case studies.",
    geminiTags: ['#CaseStudies', '#EngagingDiscussions', '#MarketAnalysis', '#ModerateWorkload'],
    geminiSummary: "Engaging discussions anchored in current financial events; expectations are well documented and problem sets directly prepare you for exams."
  },
  {
    id: 'patel',
    name: 'Dr. Priya Patel',
    department: 'Molecular Biology & Genetics',
    avatar: 'PP',
    overallScore: 4.7,
    reviewCount: 29,
    scores: {
      clarity: 4.8,
      grading: 4.5,
      workload: 4.2,
      organization: 4.9,
      approachability: 4.7,
      retake: 4.6,
    },
    sampleReview: "Dr. Patel's lab prep modules saved my grade. She holds extra review sessions before every midterm and explains difficult enzyme mechanisms with clarity.",
    geminiTags: ['#LabFocused', '#HelpfulOfficeHours', '#OrganizedSyllabus', '#Rigorous'],
    geminiSummary: "Academically rigorous coursework balanced by exceptional faculty support and meticulous lab preparation materials."
  }
];

// Pre-set review prompts for AI synthesizer sandbox
const AI_SAMPLE_PROMPTS = [
  {
    title: "Project-heavy with fair rubrics",
    text: "The three team milestones felt like working at an actual tech startup. Homework was graded within 48 hours with helpful line-by-line comments.",
    tags: ['#StartupStyle', '#FastGrading', '#ConstructiveFeedback', '#PracticalSkills'],
    summary: "Simulates industry conditions with rapid turnaround and actionable code reviews."
  },
  {
    title: "Challenging exams, great office hours",
    text: "Midterms require deep conceptual understanding, not rote memorization. Go to office hours early; she will whiteboard every question until you get it.",
    tags: ['#ConceptualExams', '#WhiteboardSessions', '#DedicatedMentor', '#HighLearningValue'],
    summary: "High exam difficulty offset by highly accessible, personalized tutoring during office hours."
  },
  {
    title: "Light reading, inspiring guest speakers",
    text: "Very reasonable reading load with weekly reflection journals. Invited industry executives every other Friday which made the course unforgettable.",
    tags: ['#GuestSpeakers', '#ManageableWorkload', '#InspiringLectures', '#ThoughtfulDiscussions'],
    summary: "Balanced academic workload enriched by real-world guest lecturers and reflective dialogue."
  }
];

// FAQs list
const FAQ_ITEMS = [
  {
    question: "Can professors or university administrators see who submitted a review?",
    answer: "No. Cryptographic anonymity is engineered directly into SemCheck's database layer. Your .edu email address is strictly used once via a 6-digit OTP to mint a one-way anonymous cryptographic verification token. Review rows in Supabase are decoupled from user identities via Row-Level Security (RLS) policies. Even our database administrators cannot trace an evaluation back to your email."
  },
  {
    question: "Why do I need to verify with a university .edu email if reviews are anonymous?",
    answer: "Requiring .edu verification is the only proven method to eradicate bots, trolls, commercial spammers, and non-student smear campaigns. It guarantees that 100% of the ratings on SemCheck come from genuine, verified students who attended courses at your campus, while protecting each student's identity completely."
  },
  {
    question: "How is SemCheck different from RateMyProfessors?",
    answer: "RateMyProfessors is unverified, cluttered with intrusive ads, infested with bots, and relies on crude 1-to-5 star averages. SemCheck is 100% .edu verified, completely ad-free, measures 9 granular pedagogical dimensions (such as grading fairness, clarity, and workload), and harnesses Google Gemini AI to distill hundreds of student reviews into actionable semantic tags and summaries."
  },
  {
    question: "What are the 9 scoring dimensions evaluated on SemCheck?",
    answer: "Every evaluation assesses Clarity, Organization, Grading Fairness, Approachability, Engagement, Learning Value, Workload, Inclusivity, and Would Retake. This multi-axis rubric prevents a professor who is an exacting grader but a phenomenal teacher from being unfairly dismissed with a single blanket score."
  },
  {
    question: "Is SemCheck free for students?",
    answer: "Yes, SemCheck is 100% free forever for verified college students. We do not sell student data, we do not show advertisements, and we do not employ paywalled locks or artificial subscription limits. Academic clarity should be accessible to all students."
  },
  {
    question: "Is there an Android or Web version planned?",
    answer: "Yes! While SemCheck is natively optimized for iOS today, our Android version and web dashboard are currently in active development. You can save this page or follow our updates to be notified immediately upon release."
  }
];

function App() {
  // Mobile Nav toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero phone screen interactive state (toggle between Overview & Review Detail)
  const [phoneScreenMode, setPhoneScreenMode] = useState('overview'); // 'overview' | 'review'
  const [phoneTransitioning, setPhoneTransitioning] = useState(false);

  const togglePhoneScreen = () => {
    setPhoneTransitioning(true);
    setTimeout(() => {
      setPhoneScreenMode(prev => prev === 'overview' ? 'review' : 'overview');
      setPhoneTransitioning(false);
    }, 150);
  };

  // Interactive Sandbox state
  const [selectedProfIndex, setSelectedProfIndex] = useState(0);
  const activeProf = PROFESSORS[selectedProfIndex];

  // Sliders state for sandbox
  const [sliderClarity, setSliderClarity] = useState(activeProf.scores.clarity);
  const [sliderGrading, setSliderGrading] = useState(activeProf.scores.grading);
  const [sliderWorkload, setSliderWorkload] = useState(activeProf.scores.workload);
  const [sliderOrganization, setSliderOrganization] = useState(activeProf.scores.organization);
  const [sliderApproachability, setSliderApproachability] = useState(activeProf.scores.approachability);
  const [sliderRetake, setSliderRetake] = useState(activeProf.scores.retake);

  // When professor tab switches, reset slider values
  const handleProfSwitch = (index: number) => {
    setSelectedProfIndex(index);
    const p = PROFESSORS[index];
    setSliderClarity(p.scores.clarity);
    setSliderGrading(p.scores.grading);
    setSliderWorkload(p.scores.workload);
    setSliderOrganization(p.scores.organization);
    setSliderApproachability(p.scores.approachability);
    setSliderRetake(p.scores.retake);
  };

  // Computed overall score based on current sliders
  const computedScore = useMemo(() => {
    const sum = Number(sliderClarity) + Number(sliderGrading) + Number(sliderOrganization) + Number(sliderApproachability) + Number(sliderRetake);
    return (sum / 5).toFixed(1);
  }, [sliderClarity, sliderGrading, sliderOrganization, sliderApproachability, sliderRetake]);

  // Sandbox AI state
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const activePrompt = AI_SAMPLE_PROMPTS[selectedPromptIndex];
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSelectPrompt = (index: number) => {
    setSelectedPromptIndex(index);
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 300);
  };

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  return (
    <>
      {/* Background Mesh Grid & Ambient Glows */}
      <div className="ambient-grid"></div>
      <div className="background-glow">
        <div className="ambient-radial-glow radial-emerald"></div>
        <div className="ambient-radial-glow radial-indigo"></div>
        <div className="ambient-radial-glow radial-terracotta"></div>
      </div>
      <BackgroundParticles />

      {/* ====================================================================
          Component 1: Sticky Frosted Glass Navigation
          ==================================================================== */}
      <header className="site-header">
        <nav className="site-nav" aria-label="Main Navigation">
          <a href="#" className="nav-brand">
            <div className="nav-logo-squircle">
              <img src={logo} alt="SemCheck App Icon" />
            </div>
            <span className="nav-brand-wordmark">SemCheck</span>
          </a>

          <ul className="nav-links">
            <li><a href="#benefits" className="nav-link">Why SemCheck</a></li>
            <li><a href="#experience" className="nav-link">Live Sandbox</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
            <li><a href="#bento" className="nav-link">Features</a></li>
            <li><a href="#pricing" className="nav-link">Access</a></li>
            <li><a href="#faq" className="nav-link">FAQ</a></li>
          </ul>

          <div className="nav-actions">
            <a href="#download" className="btn-shine btn-nav">
              <svg className="icon-constrained" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.64-1.24z"/>
              </svg>
              Get on iOS
            </a>

            <button 
              className={`nav-toggle ${mobileMenuOpen ? 'open' : ''}`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Animated Dropdown Drawer */}
        <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-menu-links">
            <li><a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Why SemCheck</a></li>
            <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>Live Sandbox</a></li>
            <li><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
            <li><a href="#bento" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
            <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Access</a></li>
            <li><a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a></li>
          </ul>
          <a href="#download" className="btn-shine btn-primary-cta" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
            <svg className="icon-constrained" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.64-1.24z"/>
            </svg>
            Download on iOS
          </a>
        </div>
      </header>

      <main>
        {/* ====================================================================
            Component 2: Editorial Split Hero Section (2-Column)
            ==================================================================== */}
        <section className="hero-section">
          <div className="hero-split-grid">
            
            {/* Left Column: 1.15fr Editorial Copy & Actions */}
            <div className="hero-copy-col">
              <div className="hero-badge-row">
                <img src={logo} alt="SemCheck icon" className="hero-badge-logo" />
                <span className="hero-badge-text">
                  The Campus Sanctuary <span className="hero-badge-highlight">• iOS Native</span>
                </span>
              </div>

              <h1 className="hero-editorial-title">
                Know Before You Enroll. <br className="desktop-only" />
                The <span className="highlight-accent">Honest</span> Campus Sanctuary.
              </h1>

              <p className="hero-editorial-sub">
                Unfiltered, verified professor and course evaluations from real university peers. 
                9-point multi-axis rubrics, Google Gemini AI sentiment synthesis, and zero spam.
              </p>

              <div className="hero-cta-wrapper">
                <div className="hero-cta-group">
                  <a href="#download" className="btn-shine btn-primary-cta">
                    <svg className="icon-constrained" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.64-1.24z"/>
                    </svg>
                    Download on iOS
                    <span className="btn-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </a>

                  <a href="#experience" className="btn-shine btn-secondary">
                    Explore Sandbox
                  </a>
                </div>

                <div className="hero-trust-line">
                  <span>100% Free</span>
                  <span className="dot">•</span>
                  <span>.edu Verified</span>
                  <span className="dot">•</span>
                  <span>Cryptographically Anonymous</span>
                  <span className="dot">•</span>
                  <span>Zero Ads</span>
                </div>
              </div>
            </div>

            {/* Right Column: 0.85fr Mockup Stage & Floating Clouds */}
            <div className="hero-mockup-stage">
              <div className="mockup-ambient-glow"></div>

              {/* Floating Cloud 1: Top-Left */}
              <div className="floating-cloud cloud-1">
                <div className="cloud-icon emerald">
                  <ion-icon name="shield-checkmark"></ion-icon>
                </div>
                <div>
                  <div className="cloud-text">100% .edu Verified</div>
                  <div className="cloud-sub">Official campus students only</div>
                </div>
              </div>

              {/* Floating Cloud 2: Mid-Right */}
              <div className="floating-cloud cloud-2">
                <div className="cloud-icon gold">
                  <ion-icon name="sparkles"></ion-icon>
                </div>
                <div>
                  <div className="cloud-text">
                    {phoneScreenMode === 'overview' ? '9-Point Scoring Rubric' : 'Gemini AI Synthesis'}
                  </div>
                  <div className="cloud-sub">
                    {phoneScreenMode === 'overview' ? 'Clarity, Workload, Fairness' : 'Real-time semantic tags'}
                  </div>
                </div>
              </div>

              {/* Floating Cloud 3: Bottom-Left (hidden on mobile <=900px) */}
              <div className="floating-cloud cloud-3">
                <div className="cloud-icon indigo">
                  <ion-icon name="lock-closed"></ion-icon>
                </div>
                <div>
                  <div className="cloud-text">Cryptographic Privacy</div>
                  <div className="cloud-sub">Identity decoupled from review</div>
                </div>
              </div>

              {/* Central Realistic iPhone Mockup Frame */}
              <div 
                className="iphone-frame" 
                onClick={togglePhoneScreen}
                title="Tap or click to toggle between Professor Profile and Student Review view"
              >
                {/* Dynamic Island */}
                <div className="iphone-island">
                  <div className="island-sensor"></div>
                  <div className="island-camera"></div>
                </div>

                <div className="iphone-screen">
                  {/* Status Bar */}
                  <div className="iphone-status-bar">
                    <span className="status-time">9:41</span>
                    <div className="status-icons">
                      <ion-icon name="cellular" style={{ fontSize: '11px' }}></ion-icon>
                      <ion-icon name="wifi" style={{ fontSize: '11px' }}></ion-icon>
                      <ion-icon name="battery-full" style={{ fontSize: '12px' }}></ion-icon>
                    </div>
                  </div>

                  {/* App Screen Content (Interactive Hotspot) */}
                  <div className={`app-screen-content ${phoneTransitioning ? 'fade-transition' : ''}`}>
                    <div className="app-phone-header">
                      <span className="app-phone-title">
                        {phoneScreenMode === 'overview' ? 'Professor Scout' : 'Verified Evaluation'}
                      </span>
                      <span className="app-phone-badge">SFSU Campus</span>
                    </div>

                    {phoneScreenMode === 'overview' ? (
                      /* Mode A: Professor Overview Card */
                      <>
                        <div className="prof-mock-card">
                          <div className="prof-mock-header">
                            <div className="prof-mock-avatar">EV</div>
                            <div className="prof-mock-info">
                              <div className="prof-mock-name">Dr. Elena Vance</div>
                              <div className="prof-mock-dept">Computer Science</div>
                            </div>
                            <div className="prof-mock-score-badge">
                              <div className="prof-mock-score-val">4.9</div>
                              <div className="prof-mock-score-sub">/ 5.0</div>
                            </div>
                          </div>

                          {/* Mini Rubric Bar List */}
                          <div className="rubric-mini-list">
                            <div className="rubric-mini-item">
                              <span className="rubric-mini-label">Clarity</span>
                              <div className="rubric-mini-bar-track">
                                <div className="rubric-mini-bar-fill" style={{ width: '98%' }}></div>
                              </div>
                              <span className="rubric-mini-val">4.9</span>
                            </div>

                            <div className="rubric-mini-item">
                              <span className="rubric-mini-label">Grading Fairness</span>
                              <div className="rubric-mini-bar-track">
                                <div className="rubric-mini-bar-fill" style={{ width: '96%' }}></div>
                              </div>
                              <span className="rubric-mini-val">4.8</span>
                            </div>

                            <div className="rubric-mini-item">
                              <span className="rubric-mini-label">Organization</span>
                              <div className="rubric-mini-bar-track">
                                <div className="rubric-mini-bar-fill" style={{ width: '100%' }}></div>
                              </div>
                              <span className="rubric-mini-val">5.0</span>
                            </div>

                            <div className="rubric-mini-item">
                              <span className="rubric-mini-label">Workload</span>
                              <div className="rubric-mini-bar-track">
                                <div className="rubric-mini-bar-fill" style={{ width: '76%', background: '#F59E0B' }}></div>
                              </div>
                              <span className="rubric-mini-val" style={{ color: '#F59E0B' }}>3.8</span>
                            </div>
                          </div>

                          <div className="mock-tags-row">
                            <span className="mock-tag">#ClearLectures</span>
                            <span className="mock-tag">#FairGrader</span>
                            <span className="mock-tag">#ProjectDriven</span>
                          </div>
                        </div>

                        <div className="mock-hotspot-hint">
                          <ion-icon name="swap-horizontal"></ion-icon>
                          <span>Tap phone screen to view review details</span>
                        </div>
                      </>
                    ) : (
                      /* Mode B: Student Review Detail with AI tags */
                      <>
                        <div className="review-mock-card">
                          <div className="review-mock-header">
                            <span className="review-verified-pill">
                              <ion-icon name="checkmark-circle"></ion-icon>
                              Verified Student
                            </span>
                            <span className="review-course-tag">CSC 413 • Spring</span>
                          </div>

                          <p className="review-mock-text">
                            "Took CSC 413 with Dr. Vance. Weekly project milestones required steady focus, but her rubric was completely transparent. Midterms directly reflect lectures."
                          </p>

                          <div className="review-gemini-summary">
                            <div className="review-gemini-title">Gemini AI Synthesis</div>
                            <div className="review-gemini-snippet">
                              Transparent grading standards with high-value technical assignments and rapid feedback.
                            </div>
                          </div>

                          <div className="mock-tags-row" style={{ marginTop: '4px' }}>
                            <span className="mock-tag">#HighClarity</span>
                            <span className="mock-tag">#TransparentRubrics</span>
                            <span className="mock-tag">#WouldRetake</span>
                          </div>
                        </div>

                        <div className="mock-hotspot-hint">
                          <ion-icon name="swap-horizontal"></ion-icon>
                          <span>Tap phone screen to view professor profile</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ====================================================================
            Component 3: Problem → Outcome (Benefit Cards)
            ==================================================================== */}
        <section id="benefits" className="benefits-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill">Why SemCheck</div>
              <h2 className="section-title">The Antidote to Broken Course Registration</h2>
              <p className="section-subtitle">
                Legacy rating platforms are flooded with unverified bots, angry rants, and intrusive ads. 
                SemCheck rebuilds campus trust from the ground up through cryptographic privacy.
              </p>
            </div>

            <div className="benefits-grid">
              {/* Card 1 */}
              <div className="benefit-card">
                <div className="benefit-icon-badge">
                  <ion-icon name="shield-checkmark"></ion-icon>
                </div>
                <h3 className="benefit-card-title">100% .edu Campus Verification</h3>
                <div className="benefit-contrast-block">
                  <div className="contrast-item">
                    <span className="contrast-label old">The Frustrating Status Quo</span>
                    <p className="contrast-text old">
                      Public forums where random internet trolls, competitors, and bots post fake ratings.
                    </p>
                  </div>
                  <div className="contrast-item">
                    <span className="contrast-label outcome">The SemCheck Solution</span>
                    <p className="contrast-text outcome">
                      Every contributor must verify once via their official university email. Pure signal from registered students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="benefit-card">
                <div className="benefit-icon-badge indigo">
                  <ion-icon name="eye-off"></ion-icon>
                </div>
                <h3 className="benefit-card-title">Cryptographic Anonymity</h3>
                <div className="benefit-contrast-block">
                  <div className="contrast-item">
                    <span className="contrast-label old">The Frustrating Status Quo</span>
                    <p className="contrast-text old">
                      Constant anxiety that candid critiques could lead to grade retaliation or professor hostility.
                    </p>
                  </div>
                  <div className="contrast-item">
                    <span className="contrast-label outcome">The SemCheck Solution</span>
                    <p className="contrast-text outcome">
                      One-way salted verification hash. Supabase Row-Level Security severs your identity from the review forever.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="benefit-card">
                <div className="benefit-icon-badge amber">
                  <ion-icon name="sparkles"></ion-icon>
                </div>
                <h3 className="benefit-card-title">9-Point Rubric & AI Insights</h3>
                <div className="benefit-contrast-block">
                  <div className="contrast-item">
                    <span className="contrast-label old">The Frustrating Status Quo</span>
                    <p className="contrast-text old">
                      Superficial 1-to-5 star averages that fail to explain grading style, workload, or teaching clarity.
                    </p>
                  </div>
                  <div className="contrast-item">
                    <span className="contrast-label outcome">The SemCheck Solution</span>
                    <p className="contrast-text outcome">
                      Granular 9-criterion rubrics synthesized by Google Gemini AI into instantaneous 3-word tags and summaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 4: Live Interactive Experience / Sandbox Demo
            ==================================================================== */}
        <section id="experience" className="interactive-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill terracotta">Interactive Sandbox</div>
              <h2 className="section-title">Test Drive the SemCheck Evaluation Engine</h2>
              <p className="section-subtitle">
                Experience how our 9-criterion rubric computes dynamic scores and how Google Gemini extracts 
                actionable semantic tags in real-time.
              </p>
            </div>

            <div className="sandbox-container">
              {/* Professor Selection Bar */}
              <div className="sandbox-prof-tabs">
                {PROFESSORS.map((prof, idx) => (
                  <button
                    key={prof.id}
                    className={`sandbox-tab-btn ${selectedProfIndex === idx ? 'active' : ''}`}
                    onClick={() => handleProfSwitch(idx)}
                  >
                    <span className="sandbox-tab-avatar">{prof.avatar}</span>
                    <span>{prof.name}</span>
                    <span style={{ opacity: 0.6 }}>• {prof.department.split('&')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="sandbox-main-grid">
                
                {/* Left Side: Interactive Rubric Sliders */}
                <div className="sandbox-rubric-card">
                  <div className="sandbox-card-header">
                    <div className="sandbox-prof-identity">
                      <h3>{activeProf.name}</h3>
                      <p>{activeProf.department} • {activeProf.reviewCount} Reviews</p>
                    </div>

                    <div className="sandbox-score-gauge">
                      <div className="sandbox-gauge-num" style={{ 
                        color: Number(computedScore) >= 4.0 ? '#10B981' : Number(computedScore) >= 3.0 ? '#F59E0B' : '#EF4444' 
                      }}>
                        {computedScore}
                      </div>
                      <div className="sandbox-gauge-label">
                        {Number(computedScore) >= 4.0 ? 'Exceptional' : Number(computedScore) >= 3.0 ? 'Moderate' : 'Challenging'}
                      </div>
                    </div>
                  </div>

                  <div className="sliders-stack">
                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Lecture Clarity</span>
                        <span className="slider-label-val">{sliderClarity} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderClarity} 
                        onChange={(e) => setSliderClarity(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Grading Fairness</span>
                        <span className="slider-label-val">{sliderGrading} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderGrading} 
                        onChange={(e) => setSliderGrading(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Syllabus Organization</span>
                        <span className="slider-label-val">{sliderOrganization} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderOrganization} 
                        onChange={(e) => setSliderOrganization(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Course Workload Intensity</span>
                        <span className="slider-label-val" style={{ color: Number(sliderWorkload) >= 4.0 ? '#EF4444' : Number(sliderWorkload) >= 3.0 ? '#F59E0B' : '#10B981' }}>
                          {sliderWorkload} / 5
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderWorkload} 
                        onChange={(e) => setSliderWorkload(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Faculty Approachability</span>
                        <span className="slider-label-val">{sliderApproachability} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderApproachability} 
                        onChange={(e) => setSliderApproachability(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label-row">
                        <span className="slider-label-title">Would Retake Rate</span>
                        <span className="slider-label-val">{sliderRetake} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={sliderRetake} 
                        onChange={(e) => setSliderRetake(Number(e.target.value))}
                        className="slider-input-range"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: AI Tag Extraction & Synthesis Preview */}
                <div className="sandbox-ai-card">
                  <div className="ai-card-title-row">
                    <span className="ai-card-title">
                      <ion-icon name="sparkles" style={{ color: '#818CF8' }}></ion-icon>
                      Gemini AI Sentiment Engine
                    </span>
                    <span className="ai-powered-badge">pgvector Embeddings</span>
                  </div>

                  <div className="ai-sample-prompts">
                    <span className="ai-sample-label">Select Sample Student Feedback:</span>
                    {AI_SAMPLE_PROMPTS.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        className={`ai-prompt-pill ${selectedPromptIndex === pIdx ? 'selected' : ''}`}
                        onClick={() => handleSelectPrompt(pIdx)}
                      >
                        <strong>{prompt.title}</strong> — "{prompt.text.slice(0, 75)}..."
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Output */}
                  <div className="ai-synthesis-output">
                    <div className="ai-output-header">
                      {isSynthesizing ? 'Synthesizing with Gemini...' : 'Synthesized AI Insights'}
                    </div>

                    <div className="ai-tags-generated">
                      {activePrompt.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="ai-tag-pill">{tag}</span>
                      ))}
                    </div>

                    <p className="ai-summary-text">
                      "{activePrompt.summary}"
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 5: Guided 3-Step Workflow ("How It Works")
            ==================================================================== */}
        <section id="how-it-works" className="workflow-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill">How It Works</div>
              <h2 className="section-title">Three Simple Steps to Smarter Semesters</h2>
              <p className="section-subtitle">
                A calm, privacy-first ritual designed to seamlessly empower your course registration decisions.
              </p>
            </div>

            <div className="workflow-steps-grid">
              {/* Step 1 */}
              <div className="workflow-step-card">
                <div className="step-num-display">01</div>
                <h3 className="step-title">Verify Once with Your .edu</h3>
                <p className="step-desc">
                  Input your university email. Receive an instantaneous 6-digit magic code. 
                  Zero passwords to manage, zero tracking cookies, and zero bot intrusions.
                </p>
                <div className="step-tag-pill">One-Time OTP</div>
              </div>

              {/* Step 2 */}
              <div className="workflow-step-card">
                <div className="step-num-display">02</div>
                <h3 className="step-title">Scout Professors & Syllabi</h3>
                <p className="step-desc">
                  Filter by department, course number, or faculty name. Inspect granular 9-axis score distributions 
                  and Gemini AI sentiment summaries before enrolling.
                </p>
                <div className="step-tag-pill">Sub-15ms Search</div>
              </div>

              {/* Step 3 */}
              <div className="workflow-step-card">
                <div className="step-num-display">03</div>
                <h3 className="step-title">Rate Anonymously in 60s</h3>
                <p className="step-desc">
                  Score previous professors across 9 intuitive pill selectors. Your user identity is stripped 
                  at the database level before publishing. Pay it forward safely.
                </p>
                <div className="step-tag-pill">100% Anonymous</div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 6: Bento Feature Deep-Dive Grid
            ==================================================================== */}
        <section id="bento" className="bento-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill indigo">Engineered for Students</div>
              <h2 className="section-title">Crafted with Obsessive Detail</h2>
              <p className="section-subtitle">
                Every screen and schema is architected to eliminate academic uncertainty without ever compromising privacy.
              </p>
            </div>

            <div className="bento-grid">
              
              {/* Bento 1: 9-Dimension Rubric System (Wide 2-col) */}
              <div className="bento-card bento-span-2">
                <div>
                  <div className="bento-badge-top">
                    <ion-icon name="analytics"></ion-icon>
                    Multi-Axis Analytics
                  </div>
                  <h3 className="bento-title">The 9-Dimension Pedagogical Rubric</h3>
                  <p className="bento-desc">
                    Unlike simplistic star ratings, SemCheck dissects teaching quality into 9 actionable dimensions. 
                    Understand whether a class is challenging because of rigorous reading or arbitrary grading.
                  </p>
                </div>

                <div className="bento-rubric-meters">
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Clarity</span>
                      <span>4.9</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '98%' }}></div></div>
                  </div>
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Grading Fairness</span>
                      <span>4.8</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '96%' }}></div></div>
                  </div>
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Organization</span>
                      <span>5.0</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '100%' }}></div></div>
                  </div>
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Approachability</span>
                      <span>4.7</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '94%' }}></div></div>
                  </div>
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Learning Value</span>
                      <span>4.9</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '98%' }}></div></div>
                  </div>
                  <div className="rubric-meter-item">
                    <div className="meter-header">
                      <span>Workload Gauge</span>
                      <span style={{ color: '#F59E0B' }}>3.7</span>
                    </div>
                    <div className="meter-track"><div className="meter-fill" style={{ width: '74%', background: '#F59E0B' }}></div></div>
                  </div>
                </div>
              </div>

              {/* Bento 2: Google Gemini AI Semantic Search */}
              <div className="bento-card">
                <div>
                  <div className="bento-badge-top indigo">
                    <ion-icon name="sparkles"></ion-icon>
                    AI Semantic Engine
                  </div>
                  <h3 className="bento-title">Gemini AI Synthesis</h3>
                  <p className="bento-desc">
                    Powered by Google Gemini and Supabase pgvector embeddings. Reviews are automatically distilled into concise 3-word tags and objective executive summaries.
                  </p>
                </div>

                <div className="bento-code-box">
                  <div><span className="keyword">const</span> tags = <span className="highlight">await gemini.extract()</span>;</div>
                  <div>// Extracted tags:</div>
                  <div className="highlight">['#FairGrader', '#ClearExams']</div>
                  <div style={{ marginTop: '4px', opacity: 0.6 }}>// 1536-dim vector embedded</div>
                </div>
              </div>

              {/* Bento 3: Zero-Knowledge Architecture */}
              <div className="bento-card">
                <div>
                  <div className="bento-badge-top amber">
                    <ion-icon name="lock-closed"></ion-icon>
                    Cryptographic Shield
                  </div>
                  <h3 className="bento-title">Anonymity by Architecture</h3>
                  <p className="bento-desc">
                    Your university email verifies active enrollment, then disconnects. PostgreSQL Row-Level Security ensures your user ID is never queried alongside public review rows.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.85rem', fontWeight: '600' }}>
                  <ion-icon name="checkmark-done-circle" style={{ fontSize: '18px' }}></ion-icon>
                  <span>RLS Enforced Anonymity</span>
                </div>
              </div>

              {/* Bento 4: Lightning-Fast Scout Typeahead */}
              <div className="bento-card">
                <div>
                  <div className="bento-badge-top">
                    <ion-icon name="flash"></ion-icon>
                    High Performance
                  </div>
                  <h3 className="bento-title">Sub-15ms Scout Search</h3>
                  <p className="bento-desc">
                    PostgreSQL GIN full-text indexes and Shopify FlashList on iOS deliver instantaneous search across thousands of faculty members and courses without dropped frames.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#818CF8', fontSize: '0.85rem', fontWeight: '600' }}>
                  <ion-icon name="speedometer" style={{ fontSize: '18px' }}></ion-icon>
                  <span>GIN Indexed Query Engine</span>
                </div>
              </div>

              {/* Bento 5: 100% Ad-Free Native Experience */}
              <div className="bento-card">
                <div>
                  <div className="bento-badge-top indigo">
                    <ion-icon name="phone-portrait"></ion-icon>
                    Sanctuary UX
                  </div>
                  <h3 className="bento-title">Native iOS & Zero Ads</h3>
                  <p className="bento-desc">
                    Crafted for iOS with Apple haptics and dark mode. Zero third-party ad tracking scripts, zero sponsored placements, and zero commercial distractions.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.85rem', fontWeight: '600' }}>
                  <ion-icon name="shield" style={{ fontSize: '18px' }}></ion-icon>
                  <span>Pure Student Sanctuary</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 7: Value Anchor & Transparent Pricing
            ==================================================================== */}
        <section id="pricing" className="pricing-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill">Transparent Access</div>
              <h2 className="section-title">Free for Every College Student. Forever.</h2>
              <p className="section-subtitle">
                Essential course intelligence should never be locked behind paywalls, surprise subscriptions, or sponsored ad networks.
              </p>
            </div>

            <div className="pricing-card-wrapper">
              <div className="pricing-card">
                <div className="pricing-card-glow"></div>

                <div className="pricing-tier-badge">
                  <ion-icon name="school"></ion-icon>
                  Campus Sanctuary • Student Edition
                </div>

                <div className="pricing-amount-row">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">0</span>
                  <span className="pricing-cadence">/ forever</span>
                </div>

                <p className="pricing-guarantee-line">
                  Free Forever • No Credit Card Required • No Advertisements
                </p>

                <ul className="pricing-checklist">
                  <li className="checklist-item">
                    <div className="checklist-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Unlimited professor and course scout lookups</span>
                  </li>
                  <li className="checklist-item">
                    <div className="checklist-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Full access to all 9 scoring dimension rubrics</span>
                  </li>
                  <li className="checklist-item">
                    <div className="checklist-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Google Gemini AI sentiment tags & executive summaries</span>
                  </li>
                  <li className="checklist-item">
                    <div className="checklist-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Cryptographic anonymity with zero-knowledge verification</span>
                  </li>
                  <li className="checklist-item">
                    <div className="checklist-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Ad-free native iOS mobile experience with offline caching</span>
                  </li>
                </ul>

                <a href="#download" className="btn-shine btn-primary-cta pricing-cta-full">
                  <svg className="icon-constrained" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.64-1.24z"/>
                  </svg>
                  Claim Your Student Access on iOS
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 8: Frequently Asked Questions (Accordion)
            ==================================================================== */}
        <section id="faq" className="faq-section">
          <div className="section-container">
            <div className="section-header">
              <div className="tag-pill terracotta">Clarifications</div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Everything you need to know about campus verification, cryptographic anonymity, and data governance.
              </p>
            </div>

            <div className="faq-accordion-stack">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                    <button
                      className="faq-trigger"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span>{item.question}</span>
                      <div className="faq-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </button>
                    <div id={`faq-answer-${index}`} className="faq-panel">
                      <p className="faq-answer-text">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================================
            Component 9: High-Impact Final Call-to-Action
            ==================================================================== */}
        <section id="download" className="final-cta-section">
          <div className="section-container">
            <div className="final-cta-card">
              <div className="final-cta-radial-glow"></div>

              <div className="tag-pill" style={{ marginBottom: '1.5rem' }}>
                Start This Semester Right
              </div>

              <h2 className="final-cta-title">
                Never Walk Into a Semester <br className="desktop-only" />
                Blind Again.
              </h2>

              <p className="final-cta-sub">
                Join thousands of verified students making confident, informed course decisions every term.
              </p>

              <div className="final-cta-btn-row">
                <a href="#" className="btn-shine btn-primary-cta" style={{ padding: '1.1rem 2.6rem', fontSize: '1.15rem' }}>
                  <svg className="icon-constrained" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.64-1.24z"/>
                  </svg>
                  Download SemCheck for iOS
                  <span className="btn-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </a>

                <div className="final-trust-microcopy">
                  100% Free for Students • .edu Verification Required • Installs in 10 Seconds
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          Component 10: Minimalist Legal & Community Footer
          ==================================================================== */}
      <footer className="site-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img src={logo} alt="SemCheck Logo" className="footer-logo-img" />
              <span className="footer-wordmark">SemCheck</span>
            </div>
            <p className="footer-tagline">
              Know before you enroll. The anonymous, verified professor review sanctuary built for college students.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#benefits">Why SemCheck</a></li>
              <li><a href="#experience">Live Sandbox</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#bento">Engineered Features</a></li>
              <li><a href="#pricing">Transparent Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Trust & Safety</h4>
            <ul className="footer-links-list">
              <li><a href="https://aniruddha-m-dhir.github.io/semcheck-privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://aniruddha-m-dhir.github.io/semcheck-privacy/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
              <li><a href="#faq">Verification Security</a></li>
              <li><a href="#faq">Anonymity Protocol</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links-list">
              <li><a href="mailto:verify@aniruddhamdhir.dev">Contact Support</a></li>
              <li><a href="https://github.com/aniruddha-m-dhir/semcheck" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              <li><a href="#download">iOS App Store</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; 2026 SemCheck. All rights reserved.</p>
          <p className="footer-attribution">
            Handcrafted with obsession by Aniruddha Dhir for college students everywhere.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
