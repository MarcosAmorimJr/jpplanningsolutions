document.addEventListener('DOMContentLoaded', function() {
    // ============== [1] MOBILE MENU TOGGLE ==============
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }

    // ============== [2] SMOOTH SCROLLING ==============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (nav) nav.classList.remove('active');
            }
        });
    });

    // ============== [3] CONTACT FORM SUPERCHARGED ==============
    const contactForm = document.querySelector('form[action*="formsubmit.co"]');
    
    if (contactForm) {
        // [3.1] VALIDAÇÃO ROBUSTA DE EMAIL
        const emailField = contactForm.querySelector('[type="email"]');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#e74c3c';
                    this.nextElementSibling?.remove();
                    const errorMsg = document.createElement('small');
                    errorMsg.textContent = 'Please enter a valid email address';
                    errorMsg.style.color = '#e74c3c';
                    errorMsg.style.display = 'block';
                    errorMsg.style.marginTop = '5px';
                    this.insertAdjacentElement('afterend', errorMsg);
                } else {
                    this.style.borderColor = '';
                    this.nextElementSibling?.remove();
                }
            });
        }

        // [3.2] ANIMAÇÃO DE ENVIO
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('[type="submit"]');
            const formData = new FormData(this);
            
            // Mostrar spinner
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }

            // [3.3] ENVIO PARA FORMSUBMIT
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // [3.4] POPUP PERSONALIZADO
                    showCustomPopup('success', 'Message sent successfully!<br>We will contact you soon.');
                    
                    // [3.5] ANIMAÇÃO DE CONFIRMAÇÃO
                    animateConfetti();
                    
                    // [3.6] GA4 EVENT TRACKING
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'Contact',
                            'event_label': 'Contact Form'
                        });
                    }
                    
                    // Reset form
                    this.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                showCustomPopup('error', 'Oops! Something went wrong.<br>Please try again later.');
                console.error('Error:', error);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            });
        });

        // Validação em tempo real
        contactForm.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '';
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.textContent.includes('required')) {
                    errorMsg.remove();
                }
            });
        });
    }

    // ============== [4] SCROLL HEADER EFFECT ==============
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            const scrollClass = window.scrollY > 50 ? 'scrolled' : '';
            header.classList.toggle('scrolled', scrollClass);
        }
    });

    // ============== [5] CUSTOM POPUP FUNCTION ==============
    function showCustomPopup(type, message) {
        const popup = document.createElement('div');
        popup.className = `custom-popup ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <p>${message}</p>
                <button class="popup-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 300);
        }, 5000);
        
        // Manual close
        popup.querySelector('.popup-close').addEventListener('click', () => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 300);
        });
    }

    // ============== [6] CONFETTI ANIMATION ==============
    function animateConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confettiContainer.appendChild(confetti);
        }
        
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    // ============== [7] HONEYPOT ANTI-SPAM ==============
    const honeyField = document.querySelector('input[name="_honey"]');
    if (honeyField) {
        honeyField.addEventListener('focus', function() {
            contactForm?.reset();
            console.log('Bot detected! Form cleared.');
        });
    }
});

// ============== [8] GOOGLE ANALYTICS ==============
// Adicione isto ANTES do </head> no seu HTML
/*
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU_ID_AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SEU_ID_AQUI');
</script>
*/