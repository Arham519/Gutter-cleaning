/**
 * AquaShield Gutters - Premium Custom JS Implementation
 * Vanilla ES6 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initCounterAnimation();
  initDraggableSlider();
  initFaqAccordion();
  initContactForm();
  initScrollReveal();
  initActiveMenuScroll();
  initButtonRipple();
  initCard3DParallax();
  initInteractiveUSPs();
});

/* ==========================================================================
   Throttled Central Scroll Manager for Mobile Performance
   ========================================================================== */
let scrollTicking = false;
const scrollCallbacks = [];

function registerScrollCallback(cb) {
  scrollCallbacks.push(cb);
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      scrollCallbacks.forEach(cb => cb());
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const update = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  registerScrollCallback(update);
  update();
}

/* ==========================================================================
   2. Mobile Menu (Drawer Slide)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const subLinks = document.querySelectorAll('.nav-dropdown-menu a');
  
  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isActive = navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    
    // Toggle body scrolling
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const parentWrapper = link.closest('.nav-dropdown-wrapper');
      if (parentWrapper && window.innerWidth <= 991) {
        // Toggle mobile dropdown
        e.preventDefault();
        parentWrapper.classList.toggle('active');
        const arrow = parentWrapper.querySelector('.nav-dropdown-arrow');
        if (arrow) {
          arrow.style.transform = parentWrapper.classList.contains('active') ? 'rotate(180deg)' : '';
        }
      } else {
        // Close menu for regular link clicks on mobile
        if (navMenu.classList.contains('active')) {
          toggleMenu();
        }
      }
    });
  });

  // Ensure sublinks close the menu when clicked
  subLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   3. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  const update = () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    
    if (scrollHeight > 0) {
      const scrolledPercent = (scrollPosition / scrollHeight) * 100;
      progressBar.style.width = scrolledPercent + '%';
    } else {
      progressBar.style.width = '0%';
    }
  };

  registerScrollCallback(update);
  update();
}

/* ==========================================================================
   4. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const update = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  registerScrollCallback(update);
  update();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. Counter Animation (Trust Metrics)
   ========================================================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1600; // 1.6 seconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      // Cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(easeProgress * target);

      counter.textContent = currentValue;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = target; // Lock final number
      }
    };

    requestAnimationFrame(animate);
  };

  const observerOptions = {
    root: null,
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   6. Draggable Before/After Comparison Slider (Responsive sync)
   ========================================================================== */
function initDraggableSlider() {
  const slider = document.getElementById('comparisonSlider');
  const afterLayer = slider ? slider.querySelector('.slider-after') : null;
  const handle = slider ? slider.querySelector('.slider-handle') : null;
  const innerWrap = slider ? slider.querySelector('.slider-after-inner') : null;

  if (!slider || !afterLayer || !handle) return;

  let isSliding = false;

  const getSliderX = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    return Math.max(0, Math.min(percentage, 100));
  };

  const updateSlider = (percentage) => {
    afterLayer.style.width = percentage + '%';
    handle.style.left = percentage + '%';
  };

  const syncInnerWidth = () => {
    if (innerWrap) {
      innerWrap.style.width = slider.offsetWidth + 'px';
    }
  };

  // Start sliding drag
  const startDrag = (e) => {
    isSliding = true;
    e.preventDefault();
  };

  // Stop sliding drag
  const stopDrag = () => {
    isSliding = false;
  };

  // Drag movement
  const moveDrag = (e) => {
    if (!isSliding) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const percentage = getSliderX(clientX);
    requestAnimationFrame(() => updateSlider(percentage));
  };

  // Attach mouse events
  handle.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', moveDrag);

  // Attach touch events (responsive)
  handle.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', moveDrag, { passive: false });

  // Sync width on click jump and resize
  slider.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    const percentage = getSliderX(e.clientX);
    updateSlider(percentage);
  });

  window.addEventListener('resize', syncInnerWidth);
  syncInnerWidth(); // Initialize
}



/* ==========================================================================
   8. FAQ Accordion (Calculated dynamic max-height)
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-accordion-item');
  if (items.length === 0) return;

  items.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    const content = item.querySelector('.faq-accordion-content');
    
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion blocks
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-accordion-content').style.maxHeight = '0px';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form JavaScript Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const responseMsg = document.getElementById('formResponse');

  if (!form || !responseMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    responseMsg.style.display = 'none';
    responseMsg.className = 'form-response-msg';

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone || !email || !service || !message) {
      showResponse('Please complete all fields before sending.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showResponse('Please enter a valid email address.', 'error');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      showResponse('Please enter a valid contact phone number.', 'error');
      return;
    }

    // Success response trigger
    showResponse('Thank you for contacting us! We will follow up shortly to schedule your inspection.', 'success');
    form.reset();
  });

  const showResponse = (text, type) => {
    responseMsg.textContent = text;
    responseMsg.classList.add(type);
    responseMsg.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        responseMsg.style.display = 'none';
      }, 6000);
    }
  };
}

/* ==========================================================================
   10. Scroll Reveal (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-el');
  if (revealElements.length === 0) return;

  const revealOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   11. Active Menu Scroll Tracker (Observer API)
   ========================================================================== */
function initActiveMenuScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.35,
    rootMargin: '-100px 0px -30% 0px'
  };

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `index.html#${activeId}` || href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => activeLinkObserver.observe(section));
}

/* ==========================================================================
   12. Ripple Button Effect
   ========================================================================== */
function initButtonRipple() {
  const rippleButtons = document.querySelectorAll('.btn');
  if (rippleButtons.length === 0) return;

  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-span');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   14. 3D Mouse Tilt & Glow (Awwwards Microinteractions)
   ========================================================================== */
function initCard3DParallax() {
  // Select premium elements to apply tilting glow effect
  const elements = document.querySelectorAll('.hero-premium-card, .services-card, .why-choose-card');
  if (elements.length === 0) return;

  // Disable on mobile/tablet viewports for performance & natural touch behavior
  if (window.innerWidth < 992) return;

  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      // Normalize tilt coordinates (-5% to 5%)
      const tiltX = ((y / h) - 0.5) * -8;
      const tiltY = ((x / w) - 0.5) * 8;

      // Apply transforms
      requestAnimationFrame(() => {
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        el.style.boxShadow = `0 25px 50px rgba(9, 26, 16, 0.08), 0 0 30px rgba(16, 185, 129, 0.15)`;
        
        // Add subtle overlay glow dynamic position
        el.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(16, 185, 129, 0.05) 0%, transparent 65%)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        el.style.transform = '';
        el.style.boxShadow = '';
        el.style.backgroundImage = '';
      });
    });
  });
}

/* ==========================================================================
   15. Interactive USP Cards (Click-to-Expand Florida Gutter Tips)
   ========================================================================== */
function initInteractiveUSPs() {
  const cards = document.querySelectorAll('.usp-highlight-item');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // Collapse all other active cards
      cards.forEach(c => {
        if (c !== card && c.classList.contains('active')) {
          c.classList.remove('active');
          c.setAttribute('aria-expanded', 'false');
          const indicator = c.querySelector('.usp-action-indicator span');
          if (indicator) indicator.textContent = 'See Florida Gutter Tip';
        }
      });

      // Toggle current card
      if (isActive) {
        card.classList.remove('active');
        card.setAttribute('aria-expanded', 'false');
        const indicator = card.querySelector('.usp-action-indicator span');
        if (indicator) indicator.textContent = 'See Florida Gutter Tip';
      } else {
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
        const indicator = card.querySelector('.usp-action-indicator span');
        if (indicator) indicator.textContent = 'Hide Gutter Tip';
      }
    });
  });
}

