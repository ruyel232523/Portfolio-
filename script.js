/* ══════════════════════════════════════════════════════════
   MIAH MD. RUYEL — PORTFOLIO JAVASCRIPT
   Animations, Interactions & UX Enhancements
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── PRELOADER ───
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 2000);
  });

  // Fallback: hide preloader after 4s even if load event is slow
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
  }, 4000);


  // ─── CUSTOM CURSOR ───
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .project-card, .software-item, .doc-card, .filter-btn');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
    });
  }


  // ─── SCROLL PROGRESS BAR ───
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }


  // ─── NAVBAR SCROLL BEHAVIOR ───
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  // ─── MOBILE MENU ───
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
    }
  });


  // ─── HERO TYPING EFFECT ───
  const heroTitle = document.getElementById('heroTitle');
  const titles = [
    'Geotechnical Engineer',
    'M.Sc. Student — Politecnico di Milano',
    'Foundation Design Specialist',
    'Soil Mechanics Enthusiast'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeTitle() {
    const current = titles[titleIndex];

    if (isDeleting) {
      heroTitle.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      heroTitle.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    // Add blinking cursor
    heroTitle.style.borderRight = '2px solid var(--color-accent)';

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2500; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(typeTitle, typeSpeed);
  }

  // Start typing after hero animation
  setTimeout(typeTitle, 2600);


  // ─── SCROLL-TRIGGERED ANIMATIONS ───
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));


  // ─── COUNTER ANIMATION ───
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  // ─── SKILL BARS ANIMATION ───
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width');
        el.style.width = width + '%';
        skillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(el => skillObserver.observe(el));


  // ─── PROJECT FILTER ───
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ─── PROJECT CARD TILT EFFECT ───
  if (window.matchMedia('(pointer: fine)').matches) {
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }


  // ─── MAGNETIC BUTTON EFFECT ───
  if (window.matchMedia('(pointer: fine)').matches) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }


  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm.querySelector('.btn-submit');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('success');

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
      }, 3000);
    }, 1500);
  });

  // Floating label fix — add placeholder for CSS :not(:placeholder-shown)
  const formInputs = contactForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.setAttribute('placeholder', ' ');
  });


  // ─── BACK TO TOP ───
  const backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed navbar
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ─── PARALLAX EFFECT ON HERO SHAPES ───
  const geoShapes = document.querySelectorAll('.geo-shape');

  function parallaxShapes() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      geoShapes.forEach((shape, index) => {
        const speed = 0.03 + (index * 0.015);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }


  // ─── EXPERIENCE TIMELINE LINE ANIMATION ───
  const expLine = document.querySelector('.exp-line');

  function animateExpLine() {
    if (!expLine) return;

    const timeline = document.querySelector('.experience-timeline');
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visible = Math.min(windowHeight - rect.top, rect.height);
      const percentage = Math.max(0, Math.min(100, (visible / rect.height) * 100));
      expLine.style.height = percentage + '%';
      expLine.style.transition = 'height 0.3s ease';
    }
  }


  // ─── CONSOLIDATED SCROLL HANDLER ───
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateActiveNav();
        updateBackToTop();
        parallaxShapes();
        animateExpLine();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateNavbar();
  updateScrollProgress();
  updateBackToTop();


  // ─── STAGGERED ANIMATION FOR GRID ITEMS ───
  // Add CSS animation keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);


  // ─── NAVBAR LINK ACTIVE UNDERLINE ───
  const navLinkStyle = document.createElement('style');
  navLinkStyle.textContent = `
    .nav-link.active { color: var(--color-white); }
    .nav-link.active::after { width: 100%; }
  `;
  document.head.appendChild(navLinkStyle);


  // ─── TEXT REVEAL ON HERO ── INTERSECTION BASED ───
  // For elements that are in the hero section, the CSS handles it via delays.
  // For elements outside the hero, the Intersection Observer handles it.


  // ─── SMOOTH RESIZE HANDLER ───
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate any values that depend on viewport
      updateScrollProgress();
      animateExpLine();
    }, 250);
  });

});

/* ─── PAYMENT GATEWAY MODAL ─── */
document.addEventListener("DOMContentLoaded", () => {
  const paymentModal = document.getElementById("payment-modal");
  const closeModal = document.querySelector(".close-modal");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const confirmBtn = document.getElementById("confirm-payment-btn");
  const modalFilename = document.getElementById("modal-filename");
  const modalPrice = document.getElementById("modal-price");

  let currentDownloadLink = "";

  // Open Modal on File Click
  document.querySelectorAll(".repo-files a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const fileName = link.innerText.trim();
      const fileUrl = link.getAttribute("href");
      const priceBdt = link.getAttribute("data-price-bdt") || "500";
      const priceEur = link.getAttribute("data-price-eur") || "5";

      // Update Modal Data
      modalFilename.innerText = fileName;
      modalPrice.innerText = `${priceBdt} BDT / ${priceEur} EUR`;
      currentDownloadLink = fileUrl;

      // Show Modal
      paymentModal.classList.add("active");
    });
  });

  // Close Modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      paymentModal.classList.remove("active");
    });
  }

  // Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Add active class
      btn.classList.add("active");
      document.getElementById(btn.getAttribute("data-tab")).classList.add("active");
    });
  });

  // Handle Payment Confirmation
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const transactionIdInput = document.getElementById("transaction-id");
      const transactionId = transactionIdInput ? transactionIdInput.value.trim() : "";

      if (!transactionId) {
        alert("Please enter the Transaction ID or Reference Number to verify your payment.");
        if (transactionIdInput) transactionIdInput.focus();
        return;
      }

      // "Verify" payment (fake verification)
      confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

      setTimeout(() => {
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Verified! Downloading...';
        confirmBtn.style.background = "var(--color-green)";

        // Trigger Download
        const a = document.createElement("a");
        a.href = currentDownloadLink;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Reset and Close
        setTimeout(() => {
          paymentModal.classList.remove("active");
          confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify & Download';
          confirmBtn.style.background = "";
          if (transactionIdInput) transactionIdInput.value = ""; // Clear input
        }, 2000);
      }, 1500);
    });
  }

  // Close on outside click
  window.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
      paymentModal.classList.remove("active");
    }
  });
});

// Copy to Clipboard Helper
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard: " + text);
  });
}
