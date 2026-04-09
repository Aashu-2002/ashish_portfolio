/* ============================================
   LOADER
============================================ */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1200);
});

/* ============================================
   THEME TOGGLE
============================================ */
(function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('i');
    const saved = localStorage.getItem('theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    if (saved) {
        setTheme(saved);
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    });
})();

/* ============================================
   PARTICLE CANVAS
============================================ */
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); createParticles(); });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.8 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.a = Math.random() * 0.45 + 0.05;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108,99,255,${this.a})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.floor((W * H) / 18000);
        particles = Array.from({ length: count }, () => new Particle());
    }
    createParticles();

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(loop);
    }
    loop();
})();

/* ============================================
   NAVBAR SCROLL
============================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? '#6c63ff' : '';
    });
});

/* ============================================
   HAMBURGER / MOBILE MENU
============================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ============================================
   TYPING ANIMATION
============================================ */
(function typeWriter() {
    const phrases = [
        'Digital Specialist Engineer',
        'Full-Stack Developer',
        'React & Node.js Enthusiast',
        'Problem Solver @ Infosys'
    ];
    const el = document.querySelector('.typed-text');
    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi % phrases.length];
        if (!deleting) {
            el.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { deleting = true; return setTimeout(tick, 1800); }
        } else {
            el.textContent = phrase.slice(0, --ci);
            if (ci === 0) { deleting = false; pi++; return setTimeout(tick, 400); }
        }
        setTimeout(tick, deleting ? 45 : 75);
    }
    tick();
})();

/* ============================================
   SCROLL REVEAL (simple)
============================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-header, .about-stats, .footer, .contact-info');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add('in-view');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ============================================
   SKILL BAR ANIMATION
============================================ */
const skillBars = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const target = e.target;
            target.style.width = target.getAttribute('data-width') + '%';
            skillObs.unobserve(target);
        }
    });
}, { threshold: 0.3 });
skillBars.forEach(b => skillObs.observe(b));

/* ============================================
   CONTACT FORM  (mailto – no backend needed)
============================================ */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    const msgSuccess = document.getElementById('formMsg');
    const msgError = document.getElementById('formErr');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('message').value.trim();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    try {
        const mailto = `mailto:Ashishranjansingh6@gmail.com`
            + `?subject=${encodeURIComponent(subject)}`
            + `&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;

        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        msgSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => { msgSuccess.style.display = 'none'; }, 5000);
    } catch {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        msgError.style.display = 'block';
        setTimeout(() => { msgError.style.display = 'none'; }, 5000);
    }
});

/* ============================================
   SMOOTH ACTIVE SECTION NAV HIGHLIGHT
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   CLICK BUBBLE EFFECT
============================================ */
document.addEventListener('click', function (e) {
    const tag = e.target.tagName.toLowerCase();
    if (e.target.closest('a, button, input, textarea, select, label, .hamburger, .nav-links')) return;
    if (tag === 'a' || tag === 'button') return;

    const colors = [
        'radial-gradient(circle, rgba(108,99,255,0.35), rgba(108,99,255,0) 70%)',
        'radial-gradient(circle, rgba(0,216,255,0.3), rgba(0,216,255,0) 70%)',
        'radial-gradient(circle, rgba(255,101,132,0.3), rgba(255,101,132,0) 70%)',
        'radial-gradient(circle, rgba(67,215,135,0.25), rgba(67,215,135,0) 70%)'
    ];

    const bubble = document.createElement('div');
    bubble.classList.add('click-bubble');
    const size = Math.random() * 80 + 100;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = (e.clientX - size / 2) + 'px';
    bubble.style.top = (e.clientY - size / 2) + 'px';
    bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(bubble);

    bubble.addEventListener('animationend', () => bubble.remove());
});
