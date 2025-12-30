/**
 * Astrorganism Visualization
 * 
 * This script creates an interactive visualization of the Astrorganism concept,
 * showing how individual users are connected as cells in a planetary organism.
 * The visualization responds to user interaction and creates a sense of
 * collective consciousness emerging through connection.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create the visualization container if it doesn't exist
    if (!document.querySelector('.astrorganism-visualization')) {
        createVisualizationContainer();
    }
    
    initializeVisualization();
    initializeInteractions();
});

function createVisualizationContainer() {
    const container = document.createElement('div');
    container.className = 'astrorganism-visualization';
    
    // Position it fixed in the background
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    
    document.body.appendChild(container);
    
    // Add canvas for the visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'astrorganism-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.3';
    container.appendChild(canvas);
}

function initializeVisualization() {
    const canvas = document.getElementById('astrorganism-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create nodes representing cells in the organism
    const nodes = [];
    const nodeCount = 50; // Number of nodes/cells
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: `rgba(${126 + Math.random() * 100}, ${230 + Math.random() * 25}, ${210 + Math.random() * 45}, ${0.3 + Math.random() * 0.5})`,
            connections: []
        });
    }
    
    // Add a special node representing the user
    const userNode = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 5,
        vx: 0,
        vy: 0,
        color: 'rgba(212, 175, 55, 0.8)', // Gold color for user
        isUser: true,
        connections: []
    };
    nodes.push(userNode);
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Each node connects to 2-5 other nodes
        const connectionCount = 2 + Math.floor(Math.random() * 4);
        
        for (let j = 0; j < connectionCount; j++) {
            // Find a random node to connect to
            const targetIndex = Math.floor(Math.random() * nodes.length);
            if (targetIndex !== i && !node.connections.includes(targetIndex)) {
                node.connections.push(targetIndex);
                nodes[targetIndex].connections.push(i);
            }
        }
        
        // Ensure the user node is well-connected
        if (node.isUser) {
            // Connect to at least 8 other nodes
            while (node.connections.length < 8) {
                const targetIndex = Math.floor(Math.random() * (nodes.length - 1));
                if (!node.connections.includes(targetIndex)) {
                    node.connections.push(targetIndex);
                    nodes[targetIndex].connections.push(nodes.length - 1); // User node index
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update node positions
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            if (!node.isUser) { // Don't move the user node automatically
                node.x += node.vx;
                node.y += node.vy;
                
                // Boundary checking - wrap around edges
                if (node.x < 0) node.x = canvas.width;
                if (node.x > canvas.width) node.x = 0;
                if (node.y < 0) node.y = canvas.height;
                if (node.y > canvas.height) node.y = 0;
                
                // Slightly change direction occasionally
                if (Math.random() < 0.02) {
                    node.vx += (Math.random() - 0.5) * 0.1;
                    node.vy += (Math.random() - 0.5) * 0.1;
                    
                    // Limit speed
                    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                    if (speed > 0.8) {
                        node.vx = (node.vx / speed) * 0.8;
                        node.vy = (node.vy / speed) * 0.8;
                    }
                }
            }
        }
        
        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            for (let j = 0; j < node.connections.length; j++) {
                const targetNode = nodes[node.connections[j]];
                
                // Calculate distance
                const dx = targetNode.x - node.x;
                const dy = targetNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw connections within a certain range
                if (distance < 200) {
                    // Opacity based on distance
                    const opacity = 1 - distance / 200;
                    
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(targetNode.x, targetNode.y);
                    
                    // Special color for user connections
                    if (node.isUser || targetNode.isUser) {
                        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.5})`;
                    } else {
                        ctx.strokeStyle = `rgba(126, 230, 210, ${opacity * 0.3})`;
                    }
                    
                    ctx.lineWidth = opacity * 1.5;
                    ctx.stroke();
                    
                    // Draw pulse along the connection occasionally
                    if (Math.random() < 0.01 || (node.isUser && Math.random() < 0.05)) {
                        drawPulse(node, targetNode);
                    }
                }
            }
        }
        
        // Draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Glow effect for user node
            if (node.isUser) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Draw a pulse traveling along a connection
    let pulses = [];
    
    function drawPulse(fromNode, toNode) {
        pulses.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.03,
            isUserPulse: fromNode.isUser || toNode.isUser
        });
    }
    
    // Update and draw pulses
    function updatePulses() {
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            pulse.progress += pulse.speed;
            
            if (pulse.progress >= 1) {
                pulses.splice(i, 1);
                continue;
            }
            
            const x = pulse.fromX + (pulse.toX - pulse.fromX) * pulse.progress;
            const y = pulse.fromY + (pulse.toY - pulse.fromY) * pulse.progress;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            
            if (pulse.isUserPulse) {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
            } else {
                ctx.fillStyle = 'rgba(126, 230, 210, 0.8)';
            }
            
            ctx.fill();
        }
        
        requestAnimationFrame(updatePulses);
    }
    
    // Start animations
    animate();
    updatePulses();
    
    // Make the user node follow the mouse with a smooth delay
    window.addEventListener('mousemove', (e) => {
        // Calculate target position
        const targetX = e.clientX;
        const targetY = e.clientY;
        
        // Smooth movement animation
        function moveTowardsMouse() {
            // Calculate direction vector
            const dx = targetX - userNode.x;
            const dy = targetY - userNode.y;
            
            // Move a percentage of the distance each frame
            userNode.x += dx * 0.05;
            userNode.y += dy * 0.05;
            
            // Continue animation if not close enough
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                requestAnimationFrame(moveTowardsMouse);
            }
        }
        
        moveTowardsMouse();
    });
    
    // Create occasional new connections when the user moves
    let lastConnectionTime = 0;
    window.addEventListener('mousemove', () => {
        const now = Date.now();
        if (now - lastConnectionTime > 2000) { // Every 2 seconds max
            lastConnectionTime = now;
            
            // Find the closest node to the user node
            let closestDistance = Infinity;
            let closestIndex = -1;
            
            for (let i = 0; i < nodes.length - 1; i++) { // Exclude user node
                const dx = nodes[i].x - userNode.x;
                const dy = nodes[i].y - userNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < closestDistance && !userNode.connections.includes(i)) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            }
            
            // If we found a node and it's reasonably close
            if (closestIndex !== -1 && closestDistance < 150) {
                userNode.connections.push(closestIndex);
                nodes[closestIndex].connections.push(nodes.length - 1); // User node index
                
                // Create a pulse effect
                drawPulse(userNode, nodes[closestIndex]);
            }
        }
    });
}

function initializeInteractions() {
    // Make the visualization more visible when interacting with the form
    const form = document.querySelector('.sacred-form');
    const canvas = document.getElementById('astrorganism-canvas');
    
    if (form && canvas) {
        form.addEventListener('click', () => {
            canvas.style.opacity = '0.6';
            setTimeout(() => {
                canvas.style.opacity = '0.3';
            }, 3000);
        });
        
        // Pulse effect when clicking submit
        const submitButton = document.querySelector('.submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                canvas.style.opacity = '0.8';
                
                // Add a radial pulse effect
                const pulse = document.createElement('div');
                pulse.className = 'astrorganism-pulse';
                pulse.style.position = 'fixed';
                pulse.style.top = '50%';
                pulse.style.left = '50%';
                pulse.style.transform = 'translate(-50%, -50%)';
                pulse.style.width = '10px';
                pulse.style.height = '10px';
                pulse.style.borderRadius = '50%';
                pulse.style.backgroundColor = 'rgba(212, 175, 55, 0.6)';
                pulse.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
                pulse.style.animation = 'astrorganism-pulse 3s forwards';
                document.body.appendChild(pulse);
                
                setTimeout(() => {
                    document.body.removeChild(pulse);
                    canvas.style.opacity = '0.3';
                }, 3000);
            });
        }
    }
    
    // Add the pulse animation to the stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes astrorganism-pulse {
            0% {
                width: 10px;
                height: 10px;
                opacity: 0.8;
            }
            100% {
                width: 300vw;
                height: 300vw;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create floating particles
    createFloatingParticles();
}

/**
 * Creates floating particles that represent the connection with the Astrorganism
 * These particles float upward, symbolizing the rising consciousness and integration
 */
function createFloatingParticles() {
    const container = document.querySelector('.astrorganism-visualization');
    if (!container) return;
    
    // Create particles at regular intervals
    setInterval(() => {
        // Create a new particle
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 3px and 8px
        const size = 3 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position at the bottom of the screen
        const posX = Math.random() * window.innerWidth;
        particle.style.left = `${posX}px`;
        particle.style.bottom = '0';
        
        // Random duration between 8 and 15 seconds
        const duration = 8 + Math.random() * 7;
        particle.style.animation = `float-up ${duration}s infinite ease-out`;
        
        // Random delay so they don't all start at once
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        // Random color variations
        const hue = 170 + Math.random() * 20; // Teal variations
        const saturation = 70 + Math.random() * 30;
        const lightness = 60 + Math.random() * 20;
        const alpha = 0.3 + Math.random() * 0.4;
        
        particle.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        
        // Add to the container
        container.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }, 300); // Create a new particle every 300ms
}
