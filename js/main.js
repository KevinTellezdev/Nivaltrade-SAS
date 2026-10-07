/* =============================================
   NIVALTRADE S.A.S. — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Menú hamburguesa ── */
    const toggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');

    if (toggle && navbar) {
        toggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // Cerrar al pulsar un enlace
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }

    /* ── 2. Header shrink al hacer scroll ── */
    const header = document.querySelector('.header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // estado inicial
    }

    /* ── 3. Smooth scroll para anclas ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── 4. Scroll-reveal con IntersectionObserver ── */
    const revealEls = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .timeline li'
    );

    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger suave: cada elemento aparece 80ms después del anterior
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => observer.observe(el));
    }

    /* ── 5. Efecto 3D tilt en tarjetas (mouse move) ── */
    const tiltCards = document.querySelectorAll(
        '.rse-card, .cert-item, .mision, .vision, .servicio, .contact-info'
    );

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 a 1
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const rotX   = (-dy * 7).toFixed(2);   // máx 7°
            const rotY   = ( dx * 7).toFixed(2);
            card.style.transform =
                `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
            card.style.boxShadow =
                `${-dx * 10}px ${dy * 10}px 28px rgba(0,0,0,0.18)`;
            card.style.transition = 'box-shadow 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform   = '';
            card.style.boxShadow   = '';
            card.style.transition  = 'transform 0.5s ease, box-shadow 0.5s ease';
        });
    });

    /* ── 6. Hero Slider ── */
    const slides   = document.querySelectorAll('.hero-slide');
    const dots     = document.querySelectorAll('.hero-dot');
    const prevBtn  = document.querySelector('.hero-arrow--prev');
    const nextBtn  = document.querySelector('.hero-arrow--next');

    if (slides.length) {
        let current   = 0;
        let autoTimer = null;
        const INTERVAL = 5000; // 5 segundos

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current]?.classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current]?.classList.add('active');
        }

        function startAuto() {
            autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
        }
        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        // Flechas
        prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

        // Dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        });

        // Swipe táctil
        let touchStartX = 0;
        const heroEl = document.querySelector('.hero');
        heroEl?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroEl?.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
        });

        // Pausa al hacer hover
        heroEl?.addEventListener('mouseenter', () => clearInterval(autoTimer));
        heroEl?.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    /* ── 7. Active link en navbar según la página actual ── */
    const path = window.location.pathname.split('/').pop().toLowerCase();
    document.querySelectorAll('.navbar a').forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        if (href === path || (path === '' && href === 'inicio.html')) {
            link.classList.add('active');
        }
    });

    /* ── 8. Efecto contador en números (si los hay) ── */
    function animateCount(el) {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        let current = 0;
        const step  = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString('es-CO');
        }, 24);
    }
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length) {
        const cObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    cObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cObs.observe(c));
    }

});
