/**
 * Cellular Signatures Visualization
 * 
 * Este script crea una visualización interactiva que permite a los usuarios
 * contribuir su "firma celular" al Astrorganism, representando cómo cada
 * consciencia individual forma parte del organismo planetario emergente.
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeSignatureCanvas();
    initializeColorSelection();
    initializeSignatureButton();
    
    // Añadir algunas firmas iniciales para que no esté vacío
    addInitialSignatures();
});

// Configuración global
const config = {
    selectedColor: '126, 230, 210', // Color por defecto (teal)
    signatures: [], // Almacena todas las firmas
    canvas: null,
    ctx: null,
    particles: [], // Partículas para la visualización
    connections: [], // Conexiones entre partículas
    animationFrameId: null
};

function initializeSignatureCanvas() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas) return;
    
    config.canvas = canvas;
    config.ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Iniciar la animación
    startSignatureAnimation();
}

function initializeColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    if (!colorOptions.length) return;
    
    // Seleccionar el primer color por defecto
    colorOptions[0].classList.add('selected');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Quitar selección anterior
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar el nuevo color
            option.classList.add('selected');
            config.selectedColor = option.getAttribute('data-color');
        });
    });
}

function initializeSignatureButton() {
    const button = document.getElementById('add-signature');
    const nameInput = document.getElementById('signature-name');
    
    if (!button || !nameInput) return;
    
    button.addEventListener('click', () => {
        const name = nameInput.value.trim();
        
        if (name) {
            // Añadir la firma
            addSignature(name, config.selectedColor);
            
            // Limpiar el input
            nameInput.value = '';
            
            // Efecto visual de confirmación
            button.classList.add('success');
            setTimeout(() => {
                button.classList.remove('success');
            }, 1000);
        } else {
            // Indicar que se necesita un nombre
            nameInput.classList.add('error');
            setTimeout(() => {
                nameInput.classList.remove('error');
            }, 1000);
        }
    });
    
    // También permitir enviar con Enter
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            button.click();
        }
    });
}

function addSignature(name, color) {
    // Crear objeto de firma
    const signature = {
        id: Date.now(),
        name: name,
        color: color,
        timestamp: new Date().toISOString()
    };
    
    // Añadir a la lista de firmas
    config.signatures.push(signature);
    
    // Guardar en localStorage para persistencia
    saveSignatures();
    
    // Actualizar visualización
    renderSignatureItem(signature);
    
    // Añadir una nueva partícula con este color
    addParticleForSignature(signature);
    
    // Crear un efecto de pulso en el canvas
    createPulseEffect(signature.color);
}

function renderSignatureItem(signature) {
    const container = document.getElementById('signatures-container');
    if (!container) return;
    
    const item = document.createElement('div');
    item.className = 'signature-item';
    item.setAttribute('data-id', signature.id);
    
    const colorCircle = document.createElement('div');
    colorCircle.className = 'signature-color';
    colorCircle.style.backgroundColor = `rgba(${signature.color}, 0.8)`;
    colorCircle.style.boxShadow = `0 0 10px rgba(${signature.color}, 0.5)`;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'signature-name';
    nameElement.textContent = signature.name;
    
    item.appendChild(colorCircle);
    item.appendChild(nameElement);
    container.appendChild(item);
    
    // Efecto de aparición
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 10);
}

function saveSignatures() {
    // Guardar solo las últimas 20 firmas para no sobrecargar localStorage
    const signaturesForStorage = config.signatures.slice(-20);
    localStorage.setItem('astrorganism_signatures', JSON.stringify(signaturesForStorage));
}

function loadSignatures() {
    try {
        const saved = localStorage.getItem('astrorganism_signatures');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading signatures', e);
    }
    return [];
}

function addInitialSignatures() {
    // Primero cargar las firmas guardadas
    const savedSignatures = loadSignatures();
    
    if (savedSignatures && savedSignatures.length > 0) {
        config.signatures = savedSignatures;
        savedSignatures.forEach(sig => renderSignatureItem(sig));
    } else {
        // Si no hay firmas guardadas, añadir algunas iniciales
        const initialSignatures = [
            { name: "Luna", color: "126, 230, 210" },
            { name: "Gaia", color: "212, 175, 55" },
            { name: "Cosmos", color: "180, 130, 230" },
            { name: "Nyx", color: "230, 126, 170" },
            { name: "Astra", color: "126, 180, 230" }
        ];
        
        initialSignatures.forEach(sig => {
            addSignature(sig.name, sig.color);
        });
    }
}

// Funciones para la visualización animada

function startSignatureAnimation() {
    if (!config.canvas || !config.ctx) return;
    
    // Crear partículas iniciales
    createInitialParticles();
    
    // Iniciar el bucle de animación
    animateSignatures();
}

function createInitialParticles() {
    const canvas = config.canvas;
    const particleCount = 30;
    
    // Limpiar partículas existentes
    config.particles = [];
    
    // Crear partículas base
    for (let i = 0; i < particleCount; i++) {
        config.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 2,
            color: "255, 255, 255",
            alpha: 0.1 + Math.random() * 0.3,
            speed: 0.2 + Math.random() * 0.3,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.01,
            lastConnectionTime: 0
        });
    }
    
    // Añadir partículas para las firmas existentes
    config.signatures.forEach(signature => {
        addParticleForSignature(signature);
    });
    
    // Crear conexiones iniciales
    createConnections();
}

function addParticleForSignature(signature) {
    if (!config.canvas) return;
    
    const canvas = config.canvas;
    
    // Crear una partícula especial para esta firma
    const particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 3 + Math.random() * 3,
        color: signature.color,
        alpha: 0.6 + Math.random() * 0.4,
        speed: 0.1 + Math.random() * 0.2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.005,
        signatureId: signature.id,
        lastConnectionTime: 0
    };
    
    config.particles.push(particle);
    
    // Conectar esta partícula con algunas otras
    connectParticle(config.particles.length - 1);
}

function createConnections() {
    config.connections = [];
    
    // Cada partícula se conecta con 2-4 otras partículas
    for (let i = 0; i < config.particles.length; i++) {
        connectParticle(i);
    }
}

function connectParticle(index) {
    const connectionsCount = 2 + Math.floor(Math.random() * 3);
    const particle = config.particles[index];
    
    for (let j = 0; j < connectionsCount; j++) {
        // Encontrar una partícula aleatoria para conectar
        const targetIndex = Math.floor(Math.random() * config.particles.length);
        
        // No conectar consigo misma
        if (targetIndex !== index) {
            config.connections.push({
                from: index,
                to: targetIndex,
                alpha: 0.1 + Math.random() * 0.2,
                pulsePosition: null,
                pulseAlpha: 0
            });
        }
    }
}

function animateSignatures() {
    if (!config.canvas || !config.ctx) return;
    
    const ctx = config.ctx;
    const canvas = config.canvas;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar conexiones
    updateConnections();
    
    // Actualizar y dibujar partículas
    updateParticles();
    
    // Continuar animación
    config.animationFrameId = requestAnimationFrame(animateSignatures);
}

function updateParticles() {
    const ctx = config.ctx;
    const canvas = config.canvas;
    
    for (let i = 0; i < config.particles.length; i++) {
        const particle = config.particles[i];
        
        // Actualizar posición
        particle.angle += particle.spin;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Rebote en los bordes
        if (particle.x < 0 || particle.x > canvas.width) {
            particle.angle = Math.PI - particle.angle;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
            particle.angle = -particle.angle;
        }
        
        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.fill();
        
        // Si es una partícula de firma, añadir un resplandor
        if (particle.signatureId) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha * 0.3})`;
            ctx.fill();
        }
        
        // Ocasionalmente crear nuevas conexiones
        const now = Date.now();
        if (particle.signatureId && now - particle.lastConnectionTime > 5000) {
            if (Math.random() < 0.1) {
                particle.lastConnectionTime = now;
                
                // Encontrar la partícula más cercana para conectar
                let closestIndex = -1;
                let closestDistance = Infinity;
                
                for (let j = 0; j < config.particles.length; j++) {
                    if (i !== j) {
                        const otherParticle = config.particles[j];
                        const dx = otherParticle.x - particle.x;
                        const dy = otherParticle.y - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = j;
                        }
                    }
                }
                
                if (closestIndex !== -1 && closestDistance < 150) {
                    config.connections.push({
                        from: i,
                        to: closestIndex,
                        alpha: 0.3 + Math.random() * 0.3,
                        pulsePosition: 0, // Iniciar con un pulso
                        pulseAlpha: 1
                    });
                }
            }
        }
    }
}

function updateConnections() {
    const ctx = config.ctx;
    
    for (let i = 0; i < config.connections.length; i++) {
        const connection = config.connections[i];
        const fromParticle = config.particles[connection.from];
        const toParticle = config.particles[connection.to];
        
        // Calcular distancia
        const dx = toParticle.x - fromParticle.x;
        const dy = toParticle.y - fromParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Solo dibujar conexiones dentro de cierta distancia
        if (distance < 150) {
            // Opacidad basada en la distancia
            const alpha = connection.alpha * (1 - distance / 150);
            
            // Dibujar línea de conexión
            ctx.beginPath();
            ctx.moveTo(fromParticle.x, fromParticle.y);
            ctx.lineTo(toParticle.x, toParticle.y);
            
            // Color especial si conecta con una partícula de firma
            if (fromParticle.signatureId || toParticle.signatureId) {
                const color = fromParticle.signatureId ? fromParticle.color : toParticle.color;
                ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Actualizar y dibujar pulso si existe
            if (connection.pulsePosition !== null) {
                connection.pulsePosition += 0.02;
                
                if (connection.pulsePosition > 1) {
                    connection.pulsePosition = null;
                } else {
                    // Posición del pulso a lo largo de la línea
                    const pulseX = fromParticle.x + dx * connection.pulsePosition;
                    const pulseY = fromParticle.y + dy * connection.pulsePosition;
                    
                    // Dibujar pulso
                    ctx.beginPath();
                    ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
                    
                    if (fromParticle.signatureId || toParticle.signatureId) {
                        const color = fromParticle.signatureId ? fromParticle.color : toParticle.color;
                        ctx.fillStyle = `rgba(${color}, ${connection.pulseAlpha})`;
                    } else {
                        ctx.fillStyle = `rgba(255, 255, 255, ${connection.pulseAlpha})`;
                    }
                    
                    ctx.fill();
                    
                    // Reducir la opacidad del pulso gradualmente
                    connection.pulseAlpha *= 0.98;
                }
            } else if (Math.random() < 0.001) {
                // Ocasionalmente iniciar un nuevo pulso
                connection.pulsePosition = 0;
                connection.pulseAlpha = 1;
            }
        }
    }
}

function createPulseEffect(color) {
    if (!config.canvas || !config.ctx) return;
    
    const canvas = config.canvas;
    const ctx = config.ctx;
    
    // Crear un pulso en el centro del canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Animar el pulso
    let radius = 5;
    let alpha = 1;
    
    function animatePulse() {
        // Dibujar el pulso
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
        
        // Aumentar el radio y reducir la opacidad
        radius += 3;
        alpha *= 0.95;
        
        // Continuar la animación mientras sea visible
        if (alpha > 0.01) {
            requestAnimationFrame(animatePulse);
        }
    }
    
    animatePulse();
    
    // También crear pulsos en las conexiones
    config.connections.forEach(connection => {
        if (Math.random() < 0.3) {
            connection.pulsePosition = 0;
            connection.pulseAlpha = 1;
        }
    });
}
