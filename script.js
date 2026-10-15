/* ==========================================================================
   PRAWEZ ALAM | INTERACTIVE PORTFOLIO ENGINE & APPLICATION SCRIPT
   Full-Stack Architect & eCommerce Specialist (7+ Years Exp)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. STATE & AUDIO SYNTHESIS ENGINE
  // ==========================================
  const State = {
    audioEnabled: localStorage.getItem('prawez_alam_sound') !== 'false',
    currentRoute: 'home',
    theme: localStorage.getItem('prawez_alam_theme') || 'violet',
    audioCtx: null
  };

  // Initialize Web Audio API on first user interaction
  function getAudioContext() {
    if (!State.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        State.audioCtx = new AudioContextClass();
      }
    }
    if (State.audioCtx && State.audioCtx.state === 'suspended') {
      State.audioCtx.resume();
    }
    return State.audioCtx;
  }

  // Synthesize custom micro-sounds using native Web Audio API oscillators
  const SoundFX = {
    play(type) {
      if (!State.audioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'tab') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'success') {
          // Play harmonious chime
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const chordOsc = ctx.createOscillator();
            const chordGain = ctx.createGain();
            chordOsc.type = 'triangle';
            chordOsc.frequency.setValueAtTime(freq, now + i * 0.05);
            chordGain.gain.setValueAtTime(0.05, now + i * 0.05);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
            chordOsc.connect(chordGain);
            chordGain.connect(ctx.destination);
            chordOsc.start(now + i * 0.05);
            chordOsc.stop(now + i * 0.05 + 0.35);
          });
        } else if (type === 'hover') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
        }
      } catch (e) {
        console.warn('Audio not allowed yet or not supported', e);
      }
    }
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundStatusText = document.getElementById('sound-status');
  function updateSoundUI() {
    if (soundStatusText) {
      soundStatusText.textContent = State.audioEnabled ? 'ON' : 'OFF';
    }
    if (soundToggleBtn) {
      const icon = soundToggleBtn.querySelector('i');
      if (icon) {
        icon.className = State.audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
    }
  }
  if (soundToggleBtn) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', () => {
      State.audioEnabled = !State.audioEnabled;
      localStorage.setItem('prawez_alam_sound', State.audioEnabled ? 'true' : 'false');
      updateSoundUI();
      if (State.audioEnabled) SoundFX.play('click');
    });
  }

  // ==========================================
  // 2. THEME ACCENT PALETTE SWITCHER
  // ==========================================
  function applyTheme(themeName) {
    State.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('prawez_alam_theme', themeName);

    document.querySelectorAll('.palette-dot').forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-color') === themeName);
    });
  }

  // Set initial theme
  applyTheme(State.theme);

  document.querySelectorAll('.palette-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const selectedColor = e.target.getAttribute('data-color');
      if (selectedColor) {
        SoundFX.play('click');
        applyTheme(selectedColor);
        showToast(`Theme accent switched to ${selectedColor.toUpperCase()}`);
      }
    });
  });

  // ==========================================
  // 3. SPA ROUTER & SEAMLESS PAGE TRANSITIONS
  // ==========================================
  const pageViews = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  const pageTitles = {
    home: 'Prawez Alam | Senior Full-Stack Architect & eCommerce Specialist (7+ Years)',
    about: 'About Prawez Alam | 7-Year Chronological Evolution & Principles',
    projects: 'Featured Projects & Case Studies | Prawez Alam',
    services: 'All 7 Flagship Services & Cost Estimator | Prawez Alam',
    contact: 'Contact & Project Inquiry | Prawez Alam'
  };

  function navigateTo(pageId, updateHash = true) {
    if (!pageId) pageId = 'home';
    const targetView = document.getElementById(`view-${pageId}`);
    if (!targetView) return;

    SoundFX.play('tab');

    // Hide all views & show target
    pageViews.forEach(view => {
      view.classList.remove('active');
    });

    targetView.classList.add('active');
    State.currentRoute = pageId;

    // Update Browser Title
    document.title = pageTitles[pageId] || pageTitles.home;

    // Update active nav links
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('data-page');
      link.classList.toggle('active', linkPage === pageId);
    });

    // Close Mobile Drawer if open
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
    }

    // Update URL hash
    if (updateHash && window.location.hash !== `#${pageId}`) {
      window.history.pushState(null, '', `#${pageId}`);
    }

    // Scroll to top of window smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Hash Changes (Back / Forward buttons & direct links)
  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validPages = ['home', 'about', 'projects', 'services', 'contact'];
    if (validPages.includes(hash)) {
      navigateTo(hash, false);
    } else {
      navigateTo('home', false);
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  window.addEventListener('popstate', handleHashRoute);

  // Bind clicks on any `.nav-trigger` or `.nav-link`
  document.querySelectorAll('.nav-trigger, .nav-link, .drawer-link').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const page = trigger.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        navigateTo(page, true);
      }
    });
  });

  // Check initial URL hash on load
  handleHashRoute();

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      SoundFX.play('click');
      mobileDrawer.classList.toggle('open');
    });
  }
  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      SoundFX.play('click');
      mobileDrawer.classList.remove('open');
    });
  }

  // ==========================================
  // 4. INTERACTIVE CANVAS PARTICLE ENGINE
  // ==========================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const mouse = { x: -1000, y: -1000, radius: 140 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (gentle repel)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // 5. CUSTOM CURSOR & MAGNETIC EFFECT
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorTrailer = document.getElementById('cursor-trailer');

  if (cursorDot && cursorTrailer && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let trailerX = -100, trailerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
      trailerX += (mouseX - trailerX) * 0.18;
      trailerY += (mouseY - trailerY) * 0.18;
      cursorTrailer.style.transform = `translate(${trailerX}px, ${trailerY}px)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = document.querySelectorAll('button, a, .glass-card, input, select, textarea, .palette-dot');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // ==========================================
  // 6. DYNAMIC TYPEWRITER EFFECT
  // ==========================================
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = [
      'Custom Web Apps',
      'Amazon & Flipkart Scaled Stores',
      'Meesho Social Reseller Platforms',
      'High-Yield Meta Ads (4.8x ROAS)',
      'Shopify Plus & Headless Stores',
      'Sub-Second WooCommerce Platforms'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();
  }

  // ==========================================
  // 7. 3D CARD TILT EFFECT
  // ==========================================
  const tiltElements = document.querySelectorAll('.tilt-element');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ==========================================
  // 8. PROJECTS FILTERING & MODAL SYSTEM
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      SoundFX.play('click');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Project Case Study Details Data
  const projectsData = {
    'project-1': {
      title: 'Enterprise Multi-Vendor eCommerce Platform (Amazon/Flipkart Model)',
      client: 'OmniMart Global',
      metric: '$48.1M GMV Handled',
      image: 'assets/images/marketplace.jpg',
      overview: 'OmniMart needed an enterprise marketplace capable of hosting 1,200+ active third-party merchants, serving millions of monthly shoppers with automated fulfillment and commission settlements.',
      challenges: 'Handling concurrent flash-sales without inventory race conditions, automating split payouts to vendors via Stripe Connect, and generating real-time analytics for seller dashboards.',
      solution: 'Architected a distributed Node.js/PostgreSQL backend with Redis locking for inventory consistency. Created custom merchant portals with CSV catalog upload, real-time logistics tracking via Shiprocket/Delhivery APIs, and customer review verification algorithms.',
      results: ['Scaled to $48.1M in Gross Merchandise Value in 12 months', 'Sub-400ms average API response time under 15,000 concurrent users', '99.98% uptime with zero payment settlement discrepancies'],
      tech: ['React.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe Connect', 'AWS ECS', 'Docker']
    },
    'project-2': {
      title: 'Bespoke Shopify Plus Apparel & Tech Storefront',
      client: 'Aetherium Luxury',
      metric: '+240% Checkout Conversion Rate',
      image: 'assets/images/shopify.jpg',
      overview: 'High-end apparel brand Aetherium was losing mobile shoppers due to a slow, generic Shopify template with clumsy product variants and slow page loads.',
      challenges: 'Sub-2-second mobile load time requirement on cellular connections, bespoke interactive cart drawer with bundle recommendations, and seamless international multi-currency support.',
      solution: 'Re-engineered the storefront from scratch using custom Shopify 2.0 Liquid sections, asynchronous dynamic cart drawers, instant image optimization, and Klaviyo predictive abandoned checkout integration.',
      results: ['Mobile conversion rate jumped from 1.6% to 4.2%', 'Average Order Value (AOV) increased by 28% through cart bundle drawer', 'Google Mobile PageSpeed score improved from 38 to 94'],
      tech: ['Shopify Plus', 'Custom Liquid 2.0', 'JavaScript ES6+', 'Klaviyo API', 'GraphQL Storefront']
    },
    'project-3': {
      title: 'High-ROAS Meta Ads & Server-Side Tracking Pipeline',
      client: 'Apex Direct Brands',
      metric: '5.8x Average Return on Ad Spend (ROAS)',
      image: 'assets/images/meta-ads.jpg',
      overview: 'A fast-scaling direct-to-consumer fitness tech brand was experiencing high ad attribution loss due to iOS 14.5+ tracking restrictions and high acquisition costs.',
      challenges: 'Data loss from browser-level pixel blocking, rising CPMs, and creative fatigue across cold prospecting audiences.',
      solution: 'Implemented Meta Conversions API (CAPI) with AWS Gateway server-side event deduplication. Deployed a systematic Dynamic Creative Testing (DCT) structure testing 40+ video hooks per week, alongside custom high-speed landing pages with 98+ PageSpeed scores.',
      results: ['Scaled ad spend from $20,000 to $145,000/month profitably', 'Maintained 5.8x blended ROAS across Instagram and Facebook', 'Attribution accuracy increased by 34% through server-side CAPI'],
      tech: ['Meta Ads Manager', 'Conversions API (CAPI)', 'AWS Lambda Gateway', 'GTM Server-Side', 'Landing Page CRO']
    },
    'project-4': {
      title: 'Next-Gen Cloud Orchestration & AI Dashboard',
      client: 'Nexus AI Cloud',
      metric: '99.99% Server Uptime & Real-Time Sync',
      image: 'assets/images/saas-dashboard.jpg',
      overview: 'A tech enterprise required a mission-critical cloud telemetry dashboard where developers can monitor microservices, run AI queries, and edit cloud functions in-browser.',
      challenges: 'Real-time WebSocket event broadcasting with minimal browser CPU overhead, dark glassmorphism UI/UX design, and role-based access management.',
      solution: 'Engineered a Next.js full-stack platform with Monaco Editor integration, WebSocket telemetry streams, and PostgreSQL timeseries caching.',
      results: ['Adopted by 8,900+ cloud engineers within 3 months', 'Zero lag during real-time server telemetry streams', 'Featured on leading developer portals as a benchmark for dark UX'],
      tech: ['Next.js', 'TypeScript', 'WebSockets', 'Tailored APIs', 'Tailwind/Vanilla CSS', 'PostgreSQL']
    },
    'project-5': {
      title: 'High-Volume WooCommerce Architecture & Subscriptions',
      client: 'Verdant Organics',
      metric: '0.7s Total Page Load & 99 PageSpeed',
      image: 'assets/images/marketplace.jpg',
      overview: 'An organic food brand processing 40,000 monthly orders struggled with a sluggish WooCommerce site that crashed during weekend email campaigns.',
      challenges: 'Slow database queries on wp_postmeta, bloated checkout steps, and recurring subscription recurring billing failures.',
      solution: 'Streamlined WooCommerce with custom checkout fields, headless database table indexing, Redis object caching, and Stripe Elements integration with Apple Pay / Google Pay 1-click buy.',
      results: ['Reduced server load by 78%', 'Checkout abandonment rate dropped by 31%', 'Flawlessly handled 6x traffic spikes during Black Friday'],
      tech: ['WordPress Core', 'WooCommerce', 'PHP 8.2', 'Redis Object Cache', 'Custom Gateway']
    },
    'project-6': {
      title: 'Zero-Investment Social Reseller Commerce Network (Meesho Model)',
      client: 'BazaarGo Social',
      metric: '85,000+ Active Social Resellers',
      image: 'assets/images/saas-dashboard.jpg',
      overview: 'A social commerce startup needed a platform allowing individuals in tier-2 and tier-3 cities to resell lifestyle products on WhatsApp without keeping inventory.',
      challenges: 'Enabling resellers to set custom profit margins per product, automated WhatsApp catalog generation, and automated COD verification to reduce return-to-origin (RTO) rates.',
      solution: 'Constructed a custom web app with WhatsApp Business Cloud API integration, OTP-based order verification, automated margin payout ledger, and courier tracking.',
      results: ['Generated over $6.2M in annual reseller sales', 'RTO (Return to Origin) reduced by 42% through OTP COD confirmation', 'Processed 15,000 daily catalog shares effortlessly'],
      tech: ['Node.js', 'React.js', 'WhatsApp Cloud API', 'Delhivery API', 'Razorpay Payouts']
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.project-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = trigger.getAttribute('data-project');
      const data = projectsData[projId];
      if (!data) return;

      SoundFX.play('click');

      projectModalContent.innerHTML = `
        <div class="case-study-view">
          <div class="modal-badge-row">
            <span class="badge-tag">${data.client}</span>
            <span class="project-metric"><i class="fa-solid fa-trophy"></i> ${data.metric}</span>
          </div>
          <h2 class="modal-case-title" style="margin-bottom: 18px; font-size: 1.8rem;">${data.title}</h2>
          
          <div class="modal-case-img-wrap" style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border-glow);">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 320px; object-fit: cover;">
          </div>

          <div class="case-study-details" style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <h4 style="color: var(--primary-color); margin-bottom: 6px;"><i class="fa-solid fa-compass"></i> Overview</h4>
              <p style="font-size: 0.95rem; line-height: 1.65;">${data.overview}</p>
            </div>
            <div>
              <h4 style="color: #f43f5e; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Key Challenges</h4>
              <p style="font-size: 0.95rem; line-height: 1.65;">${data.challenges}</p>
            </div>
            <div>
              <h4 style="color: var(--status-green); margin-bottom: 6px;"><i class="fa-solid fa-lightbulb"></i> Architectural Solution</h4>
              <p style="font-size: 0.95rem; line-height: 1.65;">${data.solution}</p>
            </div>
            <div>
              <h4 style="color: #fbbf24; margin-bottom: 8px;"><i class="fa-solid fa-chart-line"></i> Proven Results</h4>
              <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-main);">
                ${data.results.map(r => `<li style="margin-bottom: 6px; list-style-type: disc;">${r}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: 8px;"><i class="fa-solid fa-microchip"></i> Technologies Utilized</h4>
              <div class="project-tags">
                ${data.tech.map(t => `<span style="background: rgba(139, 92, 246, 0.15); color: var(--primary-color);">${t}</span>`).join('')}
              </div>
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 14px; flex-wrap: wrap;">
            <a href="#contact" class="btn btn-primary nav-trigger" data-page="contact" onclick="document.getElementById('project-modal').classList.remove('open');">
              <span>Build Something Similar</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;

      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      SoundFX.play('click');
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    });
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        SoundFX.play('click');
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // 9. RESUME MODAL
  // ==========================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const downloadResumeBtn = document.getElementById('download-resume-btn');

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      SoundFX.play('click');
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (resumeCloseBtn && resumeModal) {
    resumeCloseBtn.addEventListener('click', () => {
      SoundFX.play('click');
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        SoundFX.play('click');
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      SoundFX.play('click');
      window.print();
    });
  }

  // ==========================================
  // 10. INTERACTIVE PROJECT COST ESTIMATOR
  // ==========================================
  const chipButtons = document.querySelectorAll('#est-service-chips .chip-btn');
  const tierInputs = document.querySelectorAll('input[name="project-tier"]');
  const addonCheckboxes = document.querySelectorAll('#est-addons input[type="checkbox"]');

  const estTotalCost = document.getElementById('est-total-cost');
  const estTotalDays = document.getElementById('est-total-days');
  const summaryService = document.getElementById('summary-service');
  const summaryTier = document.getElementById('summary-tier');
  const summaryAddons = document.getElementById('summary-addons');
  const applyToContactBtn = document.getElementById('apply-to-contact-btn');

  let estimatorState = {
    baseCost: 1200,
    baseDays: 14,
    serviceName: 'Custom Website',
    tierMultiplier: 1.0,
    tierName: 'Standard / MVP',
    addonsCost: 0,
    addonsDays: 0,
    selectedAddons: []
  };

  function updateEstimator() {
    // Calculate total cost & days
    const totalCost = Math.round(estimatorState.baseCost * estimatorState.tierMultiplier + estimatorState.addonsCost);
    const totalDays = Math.round(estimatorState.baseDays * (estimatorState.tierMultiplier > 1 ? estimatorState.tierMultiplier * 0.8 : 1) + estimatorState.addonsDays);

    // Smooth counter update
    if (estTotalCost) {
      estTotalCost.textContent = totalCost.toLocaleString('en-US');
    }
    if (estTotalDays) {
      estTotalDays.textContent = `${totalDays} Business Days`;
    }
    if (summaryService) {
      summaryService.textContent = estimatorState.serviceName;
    }
    if (summaryTier) {
      summaryTier.textContent = estimatorState.tierName;
    }
    if (summaryAddons) {
      summaryAddons.textContent = `${estimatorState.selectedAddons.length} Selected`;
    }
  }

  // Service Chips
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      SoundFX.play('click');
      chipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      estimatorState.baseCost = parseInt(btn.getAttribute('data-cost'), 10) || 1000;
      estimatorState.baseDays = parseInt(btn.getAttribute('data-days'), 10) || 14;
      estimatorState.serviceName = btn.getAttribute('data-name') || 'Custom Website';

      updateEstimator();
    });
  });

  // Tier Selection
  tierInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      SoundFX.play('click');
      document.querySelectorAll('.tier-card').forEach(card => card.classList.remove('active'));
      e.target.closest('.tier-card').classList.add('active');

      estimatorState.tierMultiplier = parseFloat(e.target.getAttribute('data-multiplier')) || 1.0;
      const titleSpan = e.target.closest('.tier-card').querySelector('.tier-title');
      estimatorState.tierName = titleSpan ? titleSpan.textContent : 'Standard / MVP';

      updateEstimator();
    });
  });

  // Addons Selection
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      SoundFX.play('click');
      let totalAddonsCost = 0;
      let totalAddonsDays = 0;
      const list = [];

      addonCheckboxes.forEach(item => {
        if (item.checked) {
          totalAddonsCost += parseInt(item.getAttribute('data-cost'), 10) || 0;
          totalAddonsDays += parseInt(item.getAttribute('data-days'), 10) || 0;
          list.push(item.value);
        }
      });

      estimatorState.addonsCost = totalAddonsCost;
      estimatorState.addonsDays = totalAddonsDays;
      estimatorState.selectedAddons = list;

      updateEstimator();
    });
  });

  // Apply to Contact Form
  if (applyToContactBtn) {
    applyToContactBtn.addEventListener('click', () => {
      SoundFX.play('success');

      // Navigate to Contact Page
      navigateTo('contact', true);

      // Pre-fill fields
      const contactServiceSelect = document.getElementById('contact-service');
      const contactBudgetSelect = document.getElementById('contact-budget');
      const contactMessageArea = document.getElementById('contact-message');

      // Map service name to select option
      if (contactServiceSelect) {
        for (let i = 0; i < contactServiceSelect.options.length; i++) {
          if (contactServiceSelect.options[i].text.toLowerCase().includes(estimatorState.serviceName.toLowerCase().split(' ')[0])) {
            contactServiceSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Pre-fill message
      if (contactMessageArea) {
        const total = Math.round(estimatorState.baseCost * estimatorState.tierMultiplier + estimatorState.addonsCost);
        contactMessageArea.value = `Hi Prawez, I generated a project configuration via your online estimator:
- Service: ${estimatorState.serviceName}
- Scope Tier: ${estimatorState.tierName}
- Selected Add-ons: ${estimatorState.selectedAddons.length > 0 ? estimatorState.selectedAddons.join(', ') : 'None'}
- Estimated Ballpark: ~$${total.toLocaleString('en-US')}

Let's discuss requirements and delivery schedule!`;
      }

      showToast('Project estimate applied to Contact Form!');
    });
  }

  // ==========================================
  // 11. CONTACT FORM & BOOKING
  // ==========================================
  const inquiryForm = document.getElementById('project-inquiry-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const dropzone = document.getElementById('attachment-dropzone');
  const fileInput = document.getElementById('contact-file');
  const fileNameDisplay = document.getElementById('file-name-display');

  // File Upload Dropzone Simulation
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        SoundFX.play('click');
        fileNameDisplay.textContent = `Attached: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024).toFixed(1)} KB)`;
      }
    });
  }

  // Form Submit Simulation
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !service || !message) {
        SoundFX.play('click');
        showToast('Please fill in all mandatory fields (*)', 'error');
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        SoundFX.play('click');
        showToast('Please enter a valid email address', 'error');
        return;
      }

      // Simulated sending state
      if (submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner-loader');
        const icon = submitBtn.querySelector('.fa-paper-plane');

        btnText.textContent = 'Encrypting & Sending...';
        if (icon) icon.style.display = 'none';
        if (spinner) spinner.style.display = 'inline-block';
        submitBtn.disabled = true;

        setTimeout(() => {
          SoundFX.play('success');
          btnText.textContent = 'Inquiry Transmitted Successfully!';
          if (spinner) spinner.style.display = 'none';

          showToast('Inquiry received! Prawez Alam will reply within 4 hours.');
          inquiryForm.reset();
          if (fileNameDisplay) fileNameDisplay.textContent = '';

          setTimeout(() => {
            btnText.textContent = 'Transmit Project Inquiry';
            if (icon) icon.style.display = 'inline-block';
            submitBtn.disabled = false;
          }, 3500);
        }, 1200);
      }
    });
  }

  // Strategy Call Slot Picker
  const slotPills = document.querySelectorAll('.slot-pill');
  slotPills.forEach(pill => {
    pill.addEventListener('click', () => {
      SoundFX.play('click');
      slotPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  const bookingActionBtn = document.getElementById('booking-btn-action');
  if (bookingActionBtn) {
    bookingActionBtn.addEventListener('click', () => {
      SoundFX.play('success');
      const activeSlot = document.querySelector('.slot-pill.active');
      const time = activeSlot ? activeSlot.textContent : 'selected time';
      showToast(`Meeting link reserved for ${time}! Calendar invite sent.`);
    });
  }

  // ==========================================
  // 12. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      SoundFX.play('click');
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // 13. COMMAND PALETTE (Ctrl + K / ⌘K)
  // ==========================================
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdTrigger = document.getElementById('cmd-k-trigger');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');

  const commandItems = [
    { title: 'Go to Home', desc: 'Overview, hero & stats', icon: 'fa-house', action: () => navigateTo('home') },
    { title: 'Go to About (7 Years Exp)', desc: 'Timeline, bio & principles', icon: 'fa-user-astronaut', action: () => navigateTo('about') },
    { title: 'Go to Projects', desc: 'Case studies & live systems', icon: 'fa-cubes', action: () => navigateTo('projects') },
    { title: 'Go to All 7 Services', desc: 'Full-stack & marketplace scopes', icon: 'fa-layer-group', action: () => navigateTo('services') },
    { title: 'Estimate Project Cost', desc: 'Launch interactive calculator', icon: 'fa-calculator', action: () => { navigateTo('services'); document.getElementById('project-estimator').scrollIntoView({ behavior: 'smooth' }); } },
    { title: 'Go to Contact', desc: 'Direct inquiry & WhatsApp', icon: 'fa-paper-plane', action: () => navigateTo('contact') },
    { title: 'View Full Resume / CV', desc: 'Experience credentials modal', icon: 'fa-file-invoice', action: () => { resumeModal.classList.add('open'); } },
    { title: 'Toggle Audio Synthesizer', desc: 'Turn sound FX on/off', icon: 'fa-volume-high', action: () => { soundToggleBtn.click(); } },
    { title: 'Direct WhatsApp Chat', desc: 'Chat instantly with Prawez', icon: 'fa-brands fa-whatsapp', action: () => window.open('https://wa.me/919876543210', '_blank') }
  ];

  function renderCommands(query = '') {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';

    const filtered = commandItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      cmdResults.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 0.9rem;">No matching commands found.</div>';
      return;
    }

    filtered.forEach((cmd, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
      itemEl.innerHTML = `
        <i class="fa-solid ${cmd.icon}"></i>
        <span class="cmd-item-title">${cmd.title}</span>
        <span class="cmd-item-desc">${cmd.desc}</span>
      `;
      itemEl.addEventListener('click', () => {
        SoundFX.play('click');
        cmdPalette.classList.remove('open');
        cmd.action();
      });
      cmdResults.appendChild(itemEl);
    });
  }

  function openCmdPalette() {
    SoundFX.play('click');
    cmdPalette.classList.add('open');
    renderCommands('');
    if (cmdInput) {
      cmdInput.value = '';
      setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closeCmdPalette() {
    cmdPalette.classList.remove('open');
  }

  if (cmdTrigger && cmdPalette) {
    cmdTrigger.addEventListener('click', openCmdPalette);
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      renderCommands(e.target.value);
    });
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      if (cmdPalette && cmdPalette.classList.contains('open')) closeCmdPalette();
      if (projectModal && projectModal.classList.contains('open')) projectModal.classList.remove('open');
      if (resumeModal && resumeModal.classList.contains('open')) resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ==========================================
  // 14. TOAST NOTIFICATIONS HELPER
  // ==========================================
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    const color = type === 'error' ? '#f43f5e' : 'var(--status-green)';

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color: ${color}"></i>
      <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 15. BACK TO TOP BUTTON WITH SCROLL PROGRESS
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring__circle');
  const circumference = 2 * Math.PI * 20; // radius = 20

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progressCircle) {
      const offset = circumference - scrollPercent * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      SoundFX.play('click');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('Prawez Alam Portfolio v7.0 loaded successfully. 7+ Years Experience Active.');
});
