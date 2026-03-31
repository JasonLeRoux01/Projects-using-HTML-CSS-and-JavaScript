const nav = document.getElementById("navlist");
const hamburgerBtn = nav.querySelector('.hamburger-btn');
const navLinks = nav.querySelector('.nav-links');
let ticking = false;

// Throttled scroll handler for better performance
function updateNav() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 20) {
        nav.classList.add("show");
    } else {
        nav.classList.remove("show");
    }
    ticking = false;
}

window.addEventListener("scroll", function() {
    if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
    }
});

// Hamburger toggle
hamburgerBtn.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    const expanded = nav.classList.contains('mobile-open');
    hamburgerBtn.setAttribute('aria-expanded', expanded);
    hamburgerBtn.textContent = expanded ? '✕' : '☰';
});

// Smooth scroll for nav links
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after click
            if (nav.classList.contains('mobile-open')) {
                nav.classList.remove('mobile-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerBtn.textContent = '☰';
            }
        }
    }
});

// On initial load when page is already scrolled down
window.addEventListener("DOMContentLoaded", () => {
    updateNav();
});
