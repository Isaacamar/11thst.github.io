document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Setup
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        // Toggle navigation
        burger.addEventListener('click', () => {
            // Toggle navigation
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            // Toggle body scroll
            document.body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                document.body.style.overflow = '';
            });
        });
    }

    // Hero Section Animations
    const heroTitle = document.querySelector('#hero .hero-overlay h1');
    const heroText = document.querySelector('#hero .hero-overlay p');
    const ctaButton = document.querySelector('#hero .hero-overlay .cta-button');

    if (heroTitle && heroText && ctaButton) {
        // Set initial states
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(20px)';
        ctaButton.style.opacity = '0';
        ctaButton.style.transform = 'translateY(20px)';

        // Animate title
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);

        // Animate text
        setTimeout(() => {
            heroText.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 600);

        // Animate button
        setTimeout(() => {
            ctaButton.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 1000);
    }
});