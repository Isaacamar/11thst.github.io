document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Animate hero elements if on index page with hero section
    const heroTitle = document.querySelector('#hero .hero-overlay h1');
    const heroText = document.querySelector('#hero .hero-overlay p');
    const ctaButton = document.querySelector('#hero .hero-overlay .cta-button');

    if (heroTitle && heroText && ctaButton) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(20px)';
        ctaButton.style.opacity = '0';
        ctaButton.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);

        setTimeout(() => {
            heroText.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 600);

        setTimeout(() => {
            ctaButton.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 1000);
    }
});
