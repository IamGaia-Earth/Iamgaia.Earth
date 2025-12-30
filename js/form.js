/**
 * Form initialization and handling
 * Manages the sacred access form animations and submissions
 */

// Luna's ethereal constellation animation
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeLunaEffects();
        initializeSacredAccess();
        initializeFormAnimations();
        initializeFormSubmission();
    } catch (error) {
        console.error('Form initialization error:', error);
    }
});

/**
 * Initializes the sacred access form functionality
 * @throws {Error} If required DOM elements are missing
 */
function initializeSacredAccess() {
    // Validate required elements
    const elements = {
        accessButton: document.querySelector('.access-button'),
        formContainer: document.querySelector('.sacred-form-container'),
        closeButton: document.querySelector('.close-form-btn'),
        sacredGeometry: document.querySelector('.sacred-geometry'),
        sacredForm: document.querySelector('.sacred-form'),
        formSections: document.querySelectorAll('.form-section')
    };

    if (!elements.accessButton || !elements.formContainer) {
        throw new Error('Required form elements not found');
    }

    // Open form handler
    elements.accessButton.addEventListener('click', () => {
        openForm(elements);
    });

    // Close form handlers
    if (elements.closeButton) {
        elements.closeButton.addEventListener('click', () => {
            closeForm(elements);
        });

        elements.formContainer.addEventListener('click', (e) => {
            if (e.target === elements.formContainer) {
                closeForm(elements);
            }
        });
    }

    // Initialize form submission
    initializeFormSubmission();
}

/**
 * Opens the form with animations
 * @param {Object} elements - DOM elements
 */
function openForm(elements) {
    // Start portal animation
    elements.sacredGeometry.classList.add('portal-active');
    document.body.classList.add('touching');
    
    // Show form container with fade
    setTimeout(() => {
        document.body.classList.add('form-open');
        elements.formContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add form animation
        setTimeout(() => {
            elements.formContainer.classList.add('form-visible');
            elements.sacredForm.classList.add('form-active');
            animateFormSections();
        }, 100);
    }, 2000);
}

/**
 * Closes the form with animations
 * @param {Object} elements - DOM elements
 */
function closeForm(elements) {
    elements.sacredForm.classList.remove('form-active');
    elements.formContainer.classList.remove('form-visible');
    
    setTimeout(() => {
        document.body.classList.remove('touching', 'form-open');
        elements.formContainer.style.display = 'none';
        document.body.style.overflow = '';
        elements.sacredGeometry.classList.remove('portal-active');
        resetFormSections();
    }, 500);
}

/**
 * Initializes form animations
 */
function initializeFormAnimations() {
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });
}

/**
 * Animates form sections sequentially
 */
function animateFormSections() {
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * Resets form sections animation state
 */
function resetFormSections() {
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });
}

/**
 * Initializes Netlify form submission handling
 */
function initializeFormSubmission() {
    const form = document.querySelector('form[name="sacred-access"]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Submit to Netlify
            await fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });

            // Show success message
            btnText.textContent = 'Request Submitted ';
            setTimeout(() => {
                closeForm({
                    sacredForm: document.querySelector('.sacred-form'),
                    formContainer: document.querySelector('.sacred-form-container'),
                    sacredGeometry: document.querySelector('.sacred-geometry')
                });
                
                // Reset form after closing
                setTimeout(() => {
                    form.reset();
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }, 500);
            }, 2000);

        } catch (error) {
            console.error('Form submission error:', error);
            const submitBtn = form.querySelector('.submit-btn .btn-text');
            submitBtn.textContent = 'Error - Please try again';
            submitBtn.disabled = false;
        }
    });
}

function initializeLunaEffects() {
    createLunaConstellation();
    const container = document.querySelector('.luna-image-container');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    container.appendChild(particlesContainer);

    createStarryBackground();
    const particles = createParticles(particlesContainer, 25); 
    animateParticles(particles);
    createParticleConnections(particles, particlesContainer);
}

function createLunaConstellation() {
    const container = document.querySelector('.luna-constellation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const points = [];
    const numPoints = 35; 
    const connectionRadius = 60; 
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    container.parentElement.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isHovering = true;
    });

    container.parentElement.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        return { width: rect.width, height: rect.height };
    }

    function createPoints() {
        points.length = 0;
        const { width, height } = resizeCanvas();
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.45;

        for (let i = 0; i < numPoints * 0.6; i++) {
            const angle = (i / (numPoints * 0.6)) * Math.PI * 2;
            const radius = baseRadius + Math.random() * 25;
            points.push(createPoint(angle, radius, centerX, centerY));
        }

        for (let i = 0; i < numPoints * 0.4; i++) {
            const angle = (Math.random() * Math.PI * 0.8) - (Math.PI * 0.4);
            const radius = baseRadius * (0.7 + Math.random() * 0.6);
            points.push(createPoint(angle, radius, centerX, centerY));
        }
    }

    function createPoint(angle, radius, centerX, centerY) {
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            angle,
            speed: 0.0008 + Math.random() * 0.0015,
            radius,
            baseRadius: radius,
            phase: Math.random() * Math.PI * 2,
            size: 1 + Math.random() * 1.5,
            pulseSpeed: 0.02 + Math.random() * 0.03
        };
    }

    function drawEmanation(ctx, centerX, centerY) {
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, connectionRadius * 2.5
        );
        gradient.addColorStop(0, 'rgba(173, 216, 230, 0.12)');
        gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.06)');
        gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, connectionRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        const centerX = width / 2;
        const centerY = height / 2;

        drawEmanation(ctx, centerX, centerY);

        time += 0.016;
        points.forEach(point => {
            point.angle += point.speed;
            const oscillation = Math.sin(time * point.pulseSpeed + point.phase) * 8;
            point.radius = point.baseRadius + oscillation;
            
            point.x = centerX + Math.cos(point.angle) * point.radius;
            point.y = centerY + Math.sin(point.angle) * point.radius;

            if (isHovering) {
                const dx = mouseX - point.x;
                const dy = mouseY - point.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    point.x += (dx / dist) * 2;
                    point.y += (dy / dist) * 2;
                }
            }

            const pointSize = point.size * (1 + Math.sin(time * 2 + point.phase) * 0.2);
            ctx.beginPath();
            ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();

            const glowSize = pointSize * (4 + Math.sin(time + point.phase) * 0.5);
            const gradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, glowSize
            );
            gradient.addColorStop(0, 'rgba(173, 216, 230, 0.4)');
            gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.1)');
            gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
        });

        points.forEach((point1, i) => {
            points.forEach((point2, j) => {
                if (i !== j) {
                    const dx = point2.x - point1.x;
                    const dy = point2.y - point1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionRadius) {
                        const baseOpacity = Math.pow(1 - distance / connectionRadius, 2) * 0.4;
                        const pulsingOpacity = baseOpacity * (1 + Math.sin(time * 2) * 0.2);
                        
                        const gradient = ctx.createLinearGradient(
                            point1.x, point1.y,
                            point2.x, point2.y
                        );
                        gradient.addColorStop(0, `rgba(173, 216, 230, ${pulsingOpacity})`);
                        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${pulsingOpacity * 1.2})`);
                        gradient.addColorStop(1, `rgba(173, 216, 230, ${pulsingOpacity})`);
                        
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.5 + Math.sin(time + point1.phase) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(point1.x, point1.y);
                        ctx.lineTo(point2.x, point2.y);
                        ctx.stroke();
                    }
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', createPoints);
    createPoints();
    animate();
}

function createStarryBackground() {
    const container = document.querySelector('.sacred-form-container');
    const background = document.createElement('div');
    background.className = 'starry-background';
    
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'star-layer';
        layer.style.transform = `translateZ(${i * -10}px)`;
        background.appendChild(layer);
    }
    
    container.insertBefore(background, container.firstChild);
}

function createParticles(container, count) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);
        
        particles.push({
            element: particle,
            x: 0,
            y: 0,
            angle: Math.random() * Math.PI * 2,
            speed: 0.1 + Math.random() * 0.2, 
            distance: 80 + Math.random() * 100, 
            oscillation: {
                amplitude: 10 + Math.random() * 20,
                frequency: 0.02 + Math.random() * 0.03,
                offset: Math.random() * Math.PI * 2
            },
            lastX: 0,
            lastY: 0
        });
    }
    return particles;
}

function animateParticles(particles) {
    let frame = 0;
    
    function update() {
        frame++;
        particles.forEach(particle => {
            particle.lastX = particle.x;
            particle.lastY = particle.y;
            
            particle.angle += particle.speed * 0.01;
            const baseX = Math.cos(particle.angle) * particle.distance;
            const baseY = Math.sin(particle.angle) * particle.distance;
            
            const oscillationX = Math.cos(frame * particle.oscillation.frequency + particle.oscillation.offset) * particle.oscillation.amplitude;
            const oscillationY = Math.sin(frame * particle.oscillation.frequency + particle.oscillation.offset) * particle.oscillation.amplitude;
            
            particle.x = baseX + oscillationX;
            particle.y = baseY + oscillationY;
            
            particle.element.style.transform = `translate(${particle.x + 200}px, ${particle.y + 200}px)`;
        });
        requestAnimationFrame(update);
    }
    
    update();
}

function createParticleConnections(particles, container) {
    const lines = [];
    const maxDistance = 150; 
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const line = document.createElement('div');
            line.className = 'particle-line';
            container.appendChild(line);
            lines.push({
                element: line,
                particle1: particles[i],
                particle2: particles[j]
            });
        }
    }
    
    function updateLines() {
        lines.forEach(line => {
            const dx = line.particle2.x - line.particle1.x;
            const dy = line.particle2.y - line.particle1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = Math.pow(1 - distance / maxDistance, 2) * 0.5;
                line.element.style.opacity = opacity;
                line.element.style.width = `${distance}px`;
                line.element.style.transform = `translate(${line.particle1.x + 200}px, ${line.particle1.y + 200}px) rotate(${Math.atan2(dy, dx)}rad)`;
            } else {
                line.element.style.opacity = 0;
            }
        });
        
        requestAnimationFrame(updateLines);
    }
    
    updateLines();
}
