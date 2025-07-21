document.addEventListener('DOMContentLoaded', function() {
    const storyText = "Born in Rosario, Argentina, a young Lionel Messi showed prodigious talent. His family moved to Spain to join FC Barcelona's famed youth academy, La Masia, where the club famously paid for his growth hormone treatments. This pact would alter football history. He went on to win a record 8 Ballon d'Or awards, defining an era with his unparalleled skill. But one quest remained. The final chapter was his ultimate triumph: leading Argentina to glory in the 2022 FIFA World Cup, cementing his legacy as the undisputed greatest of all time.";
    
    
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-content h1');
    const scrollSpacer = document.querySelector('.scroll-spacer'); 
    const typewriterElement = document.getElementById('typewriter');
    const stickerCanvas = document.querySelector('.sticker-canvas');
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const horizontalContent = document.querySelector('.horizontal-content');
    const milestones = document.querySelectorAll('.milestone');
    const finalSection = document.querySelector('.final-section');
    const finalImageReveal = document.querySelector('.final-image-reveal');
    const finalContent = document.querySelector('.final-content');


    const imageSources = Array.from(document.querySelectorAll('#image-data div')).map(div => div.dataset.src);
    const stickerImages = [];
    imageSources.forEach(src => {
        const sticker = document.createElement('div');
        sticker.classList.add('sticker-image');
        sticker.style.backgroundImage = `url(${src})`;
        
        const size = Math.random() * 20 + 25;
        sticker.style.width = `${size}%`;
        sticker.style.height = `${size * 1.2}%`;
        sticker.style.top = `${Math.random() * (100 - size * 1.2)}%`;
        sticker.style.left = `${Math.random() * (100 - size)}%`;
        sticker.style.transform = `scale(0) rotate(${Math.random() * 40 - 20}deg)`;
        sticker.dataset.parallax = Math.random() * 30 + 20;
        stickerCanvas.appendChild(sticker);
        stickerImages.push(sticker);
    });

   
    let targetTypedIndex = 0;
    let currentTypedIndex = 0;
    function smoothType() {
        let diff = targetTypedIndex - currentTypedIndex;
        if (Math.abs(diff) > 0.01) {
            currentTypedIndex += diff * 0.1;
            typewriterElement.textContent = storyText.substring(0, Math.round(currentTypedIndex));
        }
        requestAnimationFrame(smoothType);
    }

    function animateCounter(el, countingUp) {
        if (el.animationId) cancelAnimationFrame(el.animationId);

        const target = +el.dataset.target;
        let start = +el.innerText.replace(/,/g, '');
        let end = countingUp ? target : 0;
        
        let duration = 1000;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            el.innerText = Math.floor(progress * (end - start) + start);

            if (progress < 1) {
                el.animationId = requestAnimationFrame(step);
            }
        }
        el.animationId = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const statNumberEl = entry.target.querySelector('.stat-number');
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if(statNumberEl) {
                    animateCounter(statNumberEl, true);
                }
            } else {
                if (entry.target.classList.contains('in-view')) {
                    entry.target.classList.remove('in-view');
                    if (statNumberEl) {
                        animateCounter(statNumberEl, false);
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    milestones.forEach(m => observer.observe(m));


    heroSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; 
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = heroSection;
        const xPos = (clientX / offsetWidth - 0.5);
        const yPos = (clientY / offsetHeight - 0.5);
        
        const moveFactor = 20;
        heroTitle.style.transform = `translate(${xPos * -moveFactor}px, ${yPos * -moveFactor}px)`;
    });


    function handleScroll() {

        const scrollSpacerRect = scrollSpacer.getBoundingClientRect();
        if (scrollSpacerRect.top < window.innerHeight && scrollSpacerRect.bottom > 0) {
            const scrollableHeight = scrollSpacer.scrollHeight - window.innerHeight;
            let progress = (-scrollSpacerRect.top) / scrollableHeight;
            progress = Math.max(0, Math.min(1, progress));

            targetTypedIndex = Math.floor(progress * storyText.length);

            const imagesToShow = Math.floor(progress * stickerImages.length);
            stickerImages.forEach((sticker, i) => {
                const show = i < imagesToShow;
                const rotation = sticker.style.transform.match(/rotate\(([^)]+)\)/)[1];
                const currentTransform = `scale(${show ? 1 : 0}) rotate(${rotation})`;
                const parallaxAmount = (progress - 0.5) * -sticker.dataset.parallax;
                sticker.style.transform = `${currentTransform} translateY(${parallaxAmount}px)`;
                sticker.style.opacity = show ? '1' : '0';
            });
        }

        
        const horizontalRect = horizontalSection.getBoundingClientRect();
        if (horizontalRect.top <= 0 && horizontalRect.bottom > window.innerHeight) {
            const horizontalScrollable = horizontalSection.scrollHeight - window.innerHeight;
            const horizontalProgress = -horizontalRect.top / horizontalScrollable;
            const maxScrollLeft = horizontalContent.scrollWidth - window.innerWidth;
            horizontalContent.style.transform = `translateX(-${horizontalProgress * maxScrollLeft}px)`;
        }

        
        const finalRect = finalSection.getBoundingClientRect();
        if (finalRect.top < window.innerHeight && finalRect.bottom > 0) {
            const scrollableHeight = finalSection.scrollHeight - window.innerHeight;
            let progress = (-finalRect.top) / scrollableHeight;
            progress = Math.max(0, Math.min(1, progress));
            
    
            const circleSize = progress * 75; 
            finalImageReveal.style.clipPath = `circle(${circleSize}% at center)`;

        
            if (progress > 0.5) {
                finalContent.style.opacity = (progress - 0.5) * 2;
            } else {
                finalContent.style.opacity = 0;
            }
        }
    }

    smoothType();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
});
