// -------------------------------------------------------------
// Navigation Configuration
// -------------------------------------------------------------
const navItems = [
    { name: 'About',   link: 'about.html',   color: '#193314' },
    { name: 'Mixes',   link: 'mixes.html',   color: '#2b4b24' },
    { name: 'Events',  link: 'events.html',  color: '#193314' },
    { name: 'Contact', link: 'contact.html', color: '#2b4b24' }
  ];
  
  // -------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------
  const recordContainer   = document.querySelector('.record-container');
  const record            = document.querySelector('.spinning-record');        // green_record
  const beigeRecord       = document.querySelector('.spinning-record-beige');
  const silogoRecord      = document.querySelector('.spinning-record-silogo');
  const navOverlay        = document.getElementById('navOverlay');
  const miniRecord        = document.querySelector('.mini-spinning-record');
  
  // Animation State
  let recordRotation      = 0;
  let textRotation        = 0;
  let miniRecordRotation  = 0;
  let recordSpeed         = 0.15;
  let textSpeed           = 0.2;
  let miniRecordSpeed     = 0.25;
  let targetRecordSpeed   = recordSpeed;
  let targetTextSpeed     = textSpeed;
  let isSlowing           = false;
  let lastFrameTime       = 0;
  let isMobile            = window.innerWidth <= 768;
  let mobileWheelRotation = 0;
  
  // Additional records for rotation
  let beigeRecordRotation = 0;
  let silogoRecordRotation= 0;
  let beigeRecordSpeed    = 0.1;
  let silogoRecordSpeed   = 0.15;
  
  // -------------------------------------------------------------
  // Page-Specific: Typewriter
  // -------------------------------------------------------------
  function setupTypewriter() {
    // Only run on index page
    if (!document.querySelector('.typewriter')) return;
  
    const texts = [
      "Deep in the East Village.",
      "With a turntable and a dream.",
      "Where vinyl met soul met jazz.",
      "Underground grooves.",
      "Keeping it real, keeping it true.",
      "11th Street Sounds.",
      "We're just here for the music.",
      "Trains. Rooftops. Basements.",
      "-EIM."
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    const typingSpeed = 30;
    const typewriterElement = document.querySelector('.typewriter');
    
    function type() {
      if (!typewriterElement) return;
  
      if (currentCharIndex < texts[currentTextIndex].length) {
        typewriterElement.textContent += texts[currentTextIndex].charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // wait before deleting
        setTimeout(() => {
          deleteText();
        }, 2000);
      }
    }
    
    function deleteText() {
      if (typewriterElement.textContent.length > 0) {
        typewriterElement.textContent = typewriterElement.textContent.slice(0, -1);
        setTimeout(deleteText, typingSpeed / 2);
      } else {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        currentCharIndex = 0;
        setTimeout(type, typingSpeed);
      }
    }
    
    type();
  }
  
  // -------------------------------------------------------------
  // Mobile Navigation Wheel
  // -------------------------------------------------------------
  function setupMobileNavigation() {
    if (!navOverlay) return;
  
    navOverlay.innerHTML = '';
    const wheelSize = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.7);
    const radius    = wheelSize * 0.3;
  
    const mobileWheel = document.createElement('div');
    mobileWheel.className = 'mobile-nav-wheel';
    mobileWheel.style.width = `${wheelSize}px`;
    mobileWheel.style.height = `${wheelSize}px`;
  
    navItems.forEach((item, index) => {
      const angle = (index * 360 / navItems.length);
      const navItem = document.createElement('a');
      navItem.href = item.link;
      navItem.className = 'mobile-nav-item';
      navItem.innerHTML = `<span>${item.name}</span>`;
      
      const radian = (angle * Math.PI) / 180;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      navItem.style.setProperty('--x', `${x}px`);
      navItem.style.setProperty('--y', `${y}px`);
      navItem.style.transform = `translate(${x}px, ${y}px)`;
      
      navItem.addEventListener('click', handleNavigation);
      mobileWheel.appendChild(navItem);
    });
  
    navOverlay.appendChild(mobileWheel);
  }
  
  // -------------------------------------------------------------
  // Desktop Navigation
  // -------------------------------------------------------------
  function setupDesktopNavigation() {
    if (!navOverlay) return;
  
    navOverlay.innerHTML = '';
    const radius = 350;
  
    navItems.forEach((item, index) => {
      const angle = (index * 360 / navItems.length);
      const navItem = document.createElement('a');
      navItem.href = item.link;
      navItem.className = 'nav-item';
      navItem.textContent = item.name;
      navItem.style.transformOrigin = 'center';
  
      const radian = (angle * Math.PI) / 180;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
  
      navItem.style.left = `calc(50% + ${x}px - 50px)`;
      navItem.style.top  = `calc(50% + ${y}px - 25px)`;
  
      navItem.addEventListener('click', handleNavigation);
      navOverlay.appendChild(navItem);
    });
  }
  
  // -------------------------------------------------------------
  // Animation Loop
  // -------------------------------------------------------------
  function animate(currentTime) {
    if (!lastFrameTime) lastFrameTime = currentTime;
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
  
    // Smooth speed transitions
    recordSpeed += (targetRecordSpeed - recordSpeed) * 0.1;
    textSpeed   += (targetTextSpeed   - textSpeed)   * 0.1;
  
    // Update rotations
    recordRotation      += recordSpeed     * deltaTime * 0.06;
    textRotation        += textSpeed       * deltaTime * 0.06;
    miniRecordRotation  -= miniRecordSpeed * deltaTime * 0.1;
    mobileWheelRotation += (isMobile ? 0.1 : 0) * deltaTime * 0.06;
  
    // Additional record rotations (counterclockwise)
    beigeRecordRotation -= beigeRecordSpeed  * deltaTime * 0.06;
    silogoRecordRotation-= silogoRecordSpeed * deltaTime * 0.06;
  
    // Apply transforms
    if (record) {
      record.style.transform = `rotate(${recordRotation}deg)`;
    }
    if (beigeRecord) {
      beigeRecord.style.transform = `rotate(${beigeRecordRotation}deg)`;
    }
    if (silogoRecord) {
      silogoRecord.style.transform = `rotate(${silogoRecordRotation}deg)`;
    }
    if (miniRecord) {
      miniRecord.style.transform = `rotate(${miniRecordRotation}deg)`;
    }
  
    // Nav overlay rotation
    if (navOverlay) {
      if (isMobile) {
        const wheel = navOverlay.querySelector('.mobile-nav-wheel');
        if (wheel) {
          wheel.style.transform = `translate(-50%, -50%) rotate(${mobileWheelRotation}deg)`;
          document.querySelectorAll('.mobile-nav-item span').forEach(span => {
            span.style.transform = `rotate(${-mobileWheelRotation}deg)`;
          });
        }
      } else {
        navOverlay.style.transform = `rotate(${textRotation}deg)`;
        document.querySelectorAll('.nav-item').forEach(item => {
          item.style.transform = `rotate(${-textRotation}deg)`;
        });
      }
    }
  
    requestAnimationFrame(animate);
  }
  
  // -------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------
  function handleNavigation(e) {
    e.preventDefault();
    document.body.style.opacity = '0'; // fade out
    document.body.style.transition = 'opacity 0.5s ease';
  
    setTimeout(() => {
      window.location.href = e.target.closest('a').href;
    }, 500);
  }
  
  function setupTouchEvents() {
    if (!recordContainer) return;
  
    let touchStartY, touchStartX, touchStartTime;
  
    recordContainer.addEventListener('touchstart', (e) => {
      touchStartTime = new Date().getTime();
      touchStartY    = e.touches[0].clientY;
      touchStartX    = e.touches[0].clientX;
      
      isSlowing = true;
      targetRecordSpeed = recordSpeed * 0.2;
      targetTextSpeed   = textSpeed   * 0.2;
    });
  
    recordContainer.addEventListener('touchend', (e) => {
      const touchEndTime = new Date().getTime();
      const touchEndY    = e.changedTouches[0].clientY;
      const touchEndX    = e.changedTouches[0].clientX;
  
      const touchDuration = touchEndTime - touchStartTime;
      const touchDistance = Math.sqrt(
        Math.pow(touchEndX - touchStartX, 2) +
        Math.pow(touchEndY - touchStartY, 2)
      );
  
      isSlowing = false;
      targetRecordSpeed = 0.4;
      targetTextSpeed   = 0.2;
    });
  }
  
  function setupMouseEvents() {
    if (!recordContainer) return;
  
    recordContainer.addEventListener('mouseenter', () => {
      isSlowing = true;
      targetRecordSpeed = recordSpeed * 0.1;
      targetTextSpeed   = textSpeed   * 0.1;
    });
  
    recordContainer.addEventListener('mouseleave', () => {
      isSlowing = false;
      targetRecordSpeed = 0.2;
      targetTextSpeed   = 0.3;
    });
  }
  
  // -------------------------------------------------------------
  // Responsive Handling
  // -------------------------------------------------------------
  function handleResize() {
    const wasDesktop = !isMobile;
    isMobile = window.innerWidth <= 768;
    
    if (isMobile !== wasDesktop) {
      if (isMobile) {
        setupMobileNavigation();
      } else {
        setupDesktopNavigation();
      }
    }
    
    if (isMobile && recordContainer) {
      const screenSize  = Math.min(window.innerWidth, window.innerHeight);
      const recordSize  = screenSize * 0.7;
      recordContainer.style.width  = `${recordSize}px`;
      recordContainer.style.height = `${recordSize}px`;
    } else if (recordContainer) {
      recordContainer.style.width  = '1000px';
      recordContainer.style.height = '1000px';
    }
  }
  
  // -------------------------------------------------------------
  // Background Cycler
  // -------------------------------------------------------------
  function setupBackgroundCycler() {
    const images = document.querySelectorAll('.background-cycler img');
    let currentIndex = 0;
  
    function cycleBackground() {
      images.forEach((img, idx) => {
        img.classList.remove('active');
      });
      images[currentIndex].classList.add('active');
      currentIndex = (currentIndex + 1) % images.length;
    }
  
    // Cycle every 5 seconds
    setInterval(cycleBackground, 5000);
  }
  
  // -------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    setupBackgroundCycler();
    setupTouchEvents();
    setupMouseEvents();
    handleResize(); 
    
    // Navigation Setup
    if (isMobile) {
      setupMobileNavigation();
    } else {
      setupDesktopNavigation();
    }
  
    // Begin the animation
    requestAnimationFrame(animate);
  
    // Listen for window resize
    window.addEventListener('resize', handleResize);
  
    // Typewriter on home page only
    setupTypewriter();
  
    // Smooth transition on load
    document.body.style.opacity = '1';
  });
  