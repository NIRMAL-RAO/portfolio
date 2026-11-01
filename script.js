/**
 * NIRMAL.DEV — Portfolio Client Engine
 * Author: Nirmal Rao T
 * Target: Full Stack Engineering / Professional Developer Portfolio
 * Vanilla JavaScript (ES6+, zero external framework dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initStickyNav();
  initMobileMenu();
  initScrollSpy();
  initScrollReveal();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initProjectModal();
});

/* ==========================================================================
   1. HERO TYPEWRITER ANIMATION
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriterText');
  if (!target) return;

  const phrases = [
    'Computer Science Student',
    'Aspiring Data Analyst',
    'AI Enthusiast',
    'Curious Software Developer'
  ];

  // Respect reduced motion accessibility
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    target.textContent = 'Computer Science Student | Aspiring Data Analyst | AI Enthusiast';
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseTime = 1800;
  const restartTime = 400;

  function typeStep() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      target.textContent = current.substring(0, charIndex);
    } else {
      charIndex++;
      target.textContent = current.substring(0, charIndex);
    }

    let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      nextDelay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      nextDelay = restartTime;
    }

    setTimeout(typeStep, nextDelay);
  }

  typeStep();
}

/* ==========================================================================
   2. STICKY NAVBAR WITH BACKDROP SCROLL STATE
   ========================================================================== */
function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. RESPONSIVE MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function setMenuState(open) {
    navMenu.classList.toggle('open', open);
    menuToggle.classList.toggle('is-active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    setMenuState(!isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenuState(false);
    }
  });
}

/* ==========================================================================
   4. ACTIVE SECTION SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.about-grid, .skill-category-card, .project-card, .timeline-item, .contact-grid'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = card.classList.contains('featured-card') ? 'grid' : 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT MODAL DETAILS
   ========================================================================== */
const PROJECT_DATA = {
  'roadwise-ai': {
    title: 'RoadWise AI — Smart Pothole Detection',
    subtitle: 'Computer Vision & Mobile Road Safety Prototype',
    desc: 'An AI-powered road monitoring prototype architected to identify roadway hazards from camera streams and high-resolution photo captures. The system focuses on practical object detection pipelines that can support safer commute planning and infrastructure reporting.',
    techStack: ['Python', 'FastAPI', 'YOLO', 'React Native', 'Expo'],
    reviewerNote: 'This prototype was built as an academic and practical exploration into computer vision integration with mobile clients. It explores lightweight model execution and API latency minimization rather than enterprise deployment.'
  },
  'sales-kpi': {
    title: 'Enterprise Sales KPI Dashboard',
    subtitle: 'Business Intelligence & Exploratory Analysis',
    desc: 'A comprehensive data analytics portfolio project focused on modeling business performance indicators. Investigates revenue trends, regional conversion rates, and sales pipeline velocities through automated aggregation scripts and clean visual reporting dashboards.',
    techStack: ['SQL', 'Python', 'Data Analytics', 'Business Intelligence', 'KPI Modeling'],
    reviewerNote: 'Developed to showcase exploratory data analysis (EDA), data wrangling, SQL grouping, and dashboard design principles.'
  },
  'churn-analysis': {
    title: 'Customer Churn Analysis',
    subtitle: 'Behavioral Clustering & Retention Modeling',
    desc: 'A data science exploration evaluating subscription behavior to detect indicators that precede churn. Features correlation analysis, tenure metrics, and exploratory data visualization to highlight key touchpoints for customer retention.',
    techStack: ['Python', 'SQL', 'Data Analytics', 'Pandas', 'Customer Insights'],
    reviewerNote: 'Focuses on structured feature exploration, statistical correlations, and interpreting data patterns into actionable business takeaways.'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTagsContainer = document.getElementById('modalTagsContainer');
  const modalReviewerNote = document.getElementById('modalReviewerNote');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');

  if (!modal || !modalTitle || !modalDesc) return;

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openModal(projectId) {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalReviewerNote.textContent = data.reviewerNote;

    // Render stack tags
    modalTagsContainer.innerHTML = '';
    data.techStack.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'modal-tag';
      tag.textContent = tech;
      modalTagsContainer.appendChild(tag);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Attach click to preview buttons
  const openButtons = document.querySelectorAll('[data-project-trigger]');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-trigger');
      openModal(projId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Export to window for fallback
  window.openProjectModal = openModal;
}

/* ==========================================================================
   8. CLIENT-SIDE VALIDATED CONTACT FORM & MAILTO DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusAlert = document.getElementById('formStatusAlert');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  if (!form) return;

  function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email.trim());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Clear previous error messages
    nameError.classList.remove('visible');
    emailError.classList.remove('visible');
    messageError.classList.remove('visible');
    statusAlert.className = 'form-status-alert hidden';

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!nameVal) {
      nameError.classList.add('visible');
      isValid = false;
    }

    if (!emailVal || !isValidEmail(emailVal)) {
      emailError.classList.add('visible');
      isValid = false;
    }

    if (!messageVal || messageVal.length < 10) {
      messageError.classList.add('visible');
      isValid = false;
    }

    if (!isValid) return;

    // Direct mailto fallback dispatch
    const targetEmail = 'nirmalraot35@gmail.com';
    const emailSubject = encodeURIComponent(`Portfolio Inquiry from ${nameVal}`);
    const emailBody = encodeURIComponent(
      `Hello Nirmal,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}\n\n— Sent from Nirmal.dev Portfolio Contact Form`
    );

    statusAlert.className = 'form-status-alert success';
    statusAlert.innerHTML = `
      <strong>Message validated successfully!</strong><br />
      Preparing email client dispatch to <strong>${targetEmail}</strong>...
    `;
    statusAlert.classList.remove('hidden');

    setTimeout(() => {
      window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
