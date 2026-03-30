/**
 * script.js - Animation and Interactivity for InfinitiTech TechCon
 */

// Smooth scrolling for nav links
document.querySelectorAll('nav a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing effect for header h1
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections and table rows
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect
    const h1 = document.querySelector('header h1');
    typeWriter(h1, h1.textContent, 80);

    // Parallax header on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Animate elements on load
    document.querySelectorAll('section, #schedule tbody tr, .speaker-card').forEach(el => {
        observer.observe(el);
    });

    // Form handling
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        alert('Thank you for your message! (Demo - form submitted)');
        form.reset();
    });
});

