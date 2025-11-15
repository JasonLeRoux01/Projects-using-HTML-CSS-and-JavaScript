const gallery = document.querySelector('.gallery');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const themeToggle = document.getElementById('themeToggle');

const images = document.querySelectorAll('.gallery img');
const totalImages = images.length / 2; // Since we duplicated
const imageWidth = 270; // 250px width + 20px margin
const galleryWidth = totalImages * imageWidth;

backBtn.addEventListener('click', () => {
    gallery.scrollBy({
        left: -300,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    gallery.scrollBy({
        left: 300,
        behavior: 'smooth'
    });
});

// Infinite scroll logic
gallery.addEventListener('scroll', () => {
    const scrollLeft = gallery.scrollLeft;

    if (scrollLeft >= galleryWidth) {
        // Jump back to the start of the duplicate
        gallery.scrollLeft = scrollLeft - galleryWidth;
    } else if (scrollLeft <= 0) {
        // Jump to the end of the duplicate
        gallery.scrollLeft = scrollLeft + galleryWidth;
    }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Lazy loading with Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src; // In case data-src is not set, but since we have loading="lazy", browser handles it
            observer.unobserve(img);
        }
    });
});

images.forEach(img => {
    observer.observe(img);
});
