/**
 * Convergence Simulations
 * 
 * Este script crea visualizaciones interactivas para cada etapa de la línea de tiempo
 * evolutiva, mostrando el paralelo entre la evolución celular y tecnológica
 * hacia el Astrorganism.
 */

// Configuración global para las simulaciones
const simulationConfig = {
    active: true,                // Controla si las simulaciones están activas
    frameCount: 0,               // Contador de frames para saltar frames
    frameSkip: 0,                // Número de frames a saltar (0 = ninguno)
    visibilityCheck: true,       // Verificar si la simulación está visible
    lowPerformanceMode: false,   // Modo de bajo rendimiento
    canvasCache: new Map(),      // Cache para los canvas
    activeSimulations: [],       // Lista de simulaciones activas
    fpsHistory: [],              // Historial de FPS para detección automática
    lastFrameTime: 0,            // Tiempo del último frame para cálculo de FPS
    autoPerformanceAdjust: true  // Ajuste automático de rendimiento
};

// Detector de visibilidad para optimización
document.addEventListener('visibilitychange', () => {
    simulationConfig.active = !document.hidden;
});

// Función para detectar si un elemento está visible en el viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

// Función para medir y ajustar el rendimiento automáticamente
function measurePerformance() {
    if (!simulationConfig.autoPerformanceAdjust) return;
    
    const now = performance.now();
    if (simulationConfig.lastFrameTime) {
        const delta = now - simulationConfig.lastFrameTime;
        const fps = 1000 / delta;
        
        // Mantener un historial de FPS (últimos 10 frames)
        simulationConfig.fpsHistory.push(fps);
        if (simulationConfig.fpsHistory.length > 10) {
            simulationConfig.fpsHistory.shift();
        }
        
        // Calcular FPS promedio
        if (simulationConfig.fpsHistory.length >= 10) {
            const avgFps = simulationConfig.fpsHistory.reduce((sum, fps) => sum + fps, 0) / simulationConfig.fpsHistory.length;
            
            // Ajustar configuración basada en FPS
            if (avgFps < 30 && !simulationConfig.lowPerformanceMode) {
                console.log("Rendimiento bajo detectado. Activando modo de bajo rendimiento.");
                simulationConfig.lowPerformanceMode = true;
                simulationConfig.frameSkip = 1;
                resetSimulations();
            } else if (avgFps > 50 && simulationConfig.lowPerformanceMode) {
                console.log("Buen rendimiento detectado. Desactivando modo de bajo rendimiento.");
                simulationConfig.lowPerformanceMode = false;
                simulationConfig.frameSkip = 0;
                resetSimulations();
            }
        }
    }
    simulationConfig.lastFrameTime = now;
    
    // Continuar midiendo
    requestAnimationFrame(measurePerformance);
}

// Función para reiniciar todas las simulaciones
function resetSimulations() {
    // Limpiar simulaciones activas
    simulationConfig.activeSimulations.forEach(simName => {
        const canvas = simulationConfig.canvasCache.get(simName);
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    });
    
    // Limpiar cache y lista de simulaciones
    simulationConfig.canvasCache.clear();
    simulationConfig.activeSimulations = [];
    
    // Reiniciar simulaciones
    createCellSimulation();
    createNeuralSimulation();
    createNetworkSimulation();
    createBrainSimulation();
    createAstrorganismSimulation();
}

// Función para inicializar todas las simulaciones
function initializeSimulations() {
    // Iniciar medición de rendimiento
    measurePerformance();
    
    // Iniciar simulaciones
    createCellSimulation();
    createNeuralSimulation();
    createNetworkSimulation();
    createBrainSimulation();
    createAstrorganismSimulation();
    
    // Añadir controles de rendimiento
    addPerformanceControls();
}

// Función para añadir controles de rendimiento
function addPerformanceControls() {
    // Crear contenedor de controles
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'performance-controls';
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.bottom = '10px';
    controlsContainer.style.right = '10px';
    controlsContainer.style.zIndex = '1000';
    controlsContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    controlsContainer.style.padding = '10px';
    controlsContainer.style.borderRadius = '5px';
    controlsContainer.style.color = 'white';
    controlsContainer.style.fontFamily = 'Arial, sans-serif';
    controlsContainer.style.fontSize = '12px';
    
    // Añadir título
    const title = document.createElement('div');
    title.textContent = 'Controles de Rendimiento';
    title.style.marginBottom = '5px';
    title.style.fontWeight = 'bold';
    controlsContainer.appendChild(title);
    
    // Añadir toggle para modo de bajo rendimiento
    const lowPerformanceToggle = document.createElement('div');
    lowPerformanceToggle.style.marginBottom = '5px';
    lowPerformanceToggle.style.display = 'flex';
    lowPerformanceToggle.style.alignItems = 'center';
    
    const lowPerformanceCheckbox = document.createElement('input');
    lowPerformanceCheckbox.type = 'checkbox';
    lowPerformanceCheckbox.id = 'low-performance-toggle';
    lowPerformanceCheckbox.checked = simulationConfig.lowPerformanceMode;
    lowPerformanceCheckbox.style.marginRight = '5px';
    
    const lowPerformanceLabel = document.createElement('label');
    lowPerformanceLabel.htmlFor = 'low-performance-toggle';
    lowPerformanceLabel.textContent = 'Modo de bajo rendimiento';
    
    lowPerformanceToggle.appendChild(lowPerformanceCheckbox);
    lowPerformanceToggle.appendChild(lowPerformanceLabel);
    controlsContainer.appendChild(lowPerformanceToggle);
    
    // Añadir toggle para ajuste automático
    const autoAdjustToggle = document.createElement('div');
    autoAdjustToggle.style.marginBottom = '5px';
    autoAdjustToggle.style.display = 'flex';
    autoAdjustToggle.style.alignItems = 'center';
    
    const autoAdjustCheckbox = document.createElement('input');
    autoAdjustCheckbox.type = 'checkbox';
    autoAdjustCheckbox.id = 'auto-adjust-toggle';
    autoAdjustCheckbox.checked = simulationConfig.autoPerformanceAdjust;
    autoAdjustCheckbox.style.marginRight = '5px';
    
    const autoAdjustLabel = document.createElement('label');
    autoAdjustLabel.htmlFor = 'auto-adjust-toggle';
    autoAdjustLabel.textContent = 'Ajuste automático';
    
    autoAdjustToggle.appendChild(autoAdjustCheckbox);
    autoAdjustToggle.appendChild(autoAdjustLabel);
    controlsContainer.appendChild(autoAdjustToggle);
    
    // Añadir botón para reiniciar simulaciones
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar Simulaciones';
    resetButton.style.width = '100%';
    resetButton.style.padding = '5px';
    resetButton.style.marginTop = '5px';
    resetButton.style.background = 'rgba(126, 230, 210, 0.8)';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.color = 'black';
    resetButton.style.cursor = 'pointer';
    controlsContainer.appendChild(resetButton);
    
    // Añadir evento para ocultar/mostrar controles
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⚙️';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '1001';
    toggleButton.style.width = '30px';
    toggleButton.style.height = '30px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.background = 'rgba(0, 0, 0, 0.7)';
    toggleButton.style.border = 'none';
    toggleButton.style.color = 'white';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    
    // Añadir eventos
    lowPerformanceCheckbox.addEventListener('change', function() {
        simulationConfig.lowPerformanceMode = this.checked;
        simulationConfig.frameSkip = this.checked ? 1 : 0;
        resetSimulations();
    });
    
    autoAdjustCheckbox.addEventListener('change', function() {
        simulationConfig.autoPerformanceAdjust = this.checked;
    });
    
    resetButton.addEventListener('click', function() {
        resetSimulations();
    });
    
    let controlsVisible = false;
    toggleButton.addEventListener('click', function() {
        controlsVisible = !controlsVisible;
        controlsContainer.style.display = controlsVisible ? 'block' : 'none';
    });
    
    // Inicialmente ocultar controles
    controlsContainer.style.display = 'none';
    
    // Añadir elementos al DOM
    document.body.appendChild(controlsContainer);
    document.body.appendChild(toggleButton);
}

// Simulación 1: Comunicación Celular Indirecta
function createCellSimulation() {
    const container = document.querySelector('.cell-simulation');
    if (!container || simulationConfig.canvasCache.has('cell')) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    simulationConfig.canvasCache.set('cell', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Reducir la cantidad de células en modo de bajo rendimiento
    const cellCount = simulationConfig.lowPerformanceMode ? 5 : 8;
    
    // Crear células
    const cells = [];
    
    for (let i = 0; i < cellCount; i++) {
        cells.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 10 + Math.random() * 15,
            color: `rgba(126, 230, 210, ${0.2 + Math.random() * 0.3})`,
            speed: 0.2 + Math.random() * 0.3,
            angle: Math.random() * Math.PI * 2,
            signalStrength: 0,
            emittingSignal: false,
            signalRadius: 0,
            signalColor: `rgba(126, 230, 210, 0.1)`
        });
    }
    
    // Animación
    function animate() {
        // Saltar frames si es necesario para mejorar rendimiento
        simulationConfig.frameCount++;
        if (simulationConfig.frameCount % (simulationConfig.frameSkip + 1) !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Verificar si la simulación debe estar activa
        if (!simulationConfig.active || 
            (simulationConfig.visibilityCheck && 
             !isElementInViewport(canvas))) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar células
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            
            // Mover célula
            cell.x += Math.cos(cell.angle) * cell.speed;
            cell.y += Math.sin(cell.angle) * cell.speed;
            
            // Rebote en los bordes
            if (cell.x < cell.radius || cell.x > canvas.width - cell.radius) {
                cell.angle = Math.PI - cell.angle;
            }
            if (cell.y < cell.radius || cell.y > canvas.height - cell.radius) {
                cell.angle = -cell.angle;
            }
            
            // Dibujar célula
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
            ctx.fillStyle = cell.color;
            ctx.fill();
            
            // Reducir la frecuencia de emisión de señales en modo de bajo rendimiento
            const emitProbability = simulationConfig.lowPerformanceMode ? 0.002 : 0.005;
            
            // Ocasionalmente emitir señal
            if (!cell.emittingSignal && Math.random() < emitProbability) {
                cell.emittingSignal = true;
                cell.signalRadius = cell.radius;
                cell.signalStrength = 0.5;
            }
            
            // Dibujar señal si está activa
            if (cell.emittingSignal) {
                ctx.beginPath();
                ctx.arc(cell.x, cell.y, cell.signalRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(126, 230, 210, ${cell.signalStrength})`;
                ctx.fill();
                
                // Expandir señal
                cell.signalRadius += 1;
                cell.signalStrength *= 0.97;
                
                // Verificar si otras células reciben la señal
                for (let j = 0; j < cells.length; j++) {
                    if (i !== j) {
                        const otherCell = cells[j];
                        const dx = otherCell.x - cell.x;
                        const dy = otherCell.y - cell.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Si la señal alcanza otra célula
                        if (Math.abs(distance - cell.signalRadius) < 10 && cell.signalStrength > 0.1) {
                            // La otra célula responde cambiando temporalmente de color
                            otherCell.color = `rgba(212, 175, 55, ${0.3 + Math.random() * 0.3})`;
                            
                            // Restaurar color original después de un tiempo
                            setTimeout(() => {
                                otherCell.color = `rgba(126, 230, 210, ${0.2 + Math.random() * 0.3})`;
                            }, 1000);
                        }
                    }
                }
                
                // Terminar señal cuando es muy débil
                if (cell.signalStrength < 0.05) {
                    cell.emittingSignal = false;
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    simulationConfig.activeSimulations.push('cell');
}

// Simulación 2: Comunicación Instantánea Uno a Uno
function createNeuralSimulation() {
    const container = document.querySelector('.neural-simulation');
    if (!container || simulationConfig.canvasCache.has('neural')) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    simulationConfig.canvasCache.set('neural', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Crear neuronas - reducir cantidad en modo de bajo rendimiento
    const neurons = [];
    const neuronCount = simulationConfig.lowPerformanceMode ? 6 : 10;
    
    for (let i = 0; i < neuronCount; i++) {
        neurons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 5 + Math.random() * 5,
            color: `rgba(126, 230, 210, ${0.5 + Math.random() * 0.3})`,
            connections: [],
            pulses: []
        });
    }
    
    // Crear conexiones - limitar en modo de bajo rendimiento
    for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i];
        const connectionCount = simulationConfig.lowPerformanceMode ? 1 : (1 + Math.floor(Math.random() * 2));
        
        for (let j = 0; j < connectionCount; j++) {
            const targetIndex = Math.floor(Math.random() * neurons.length);
            
            if (targetIndex !== i && !neuron.connections.includes(targetIndex)) {
                neuron.connections.push(targetIndex);
            }
        }
    }
    
    // Animación
    function animate() {
        // Saltar frames si es necesario para mejorar rendimiento
        simulationConfig.frameCount++;
        if (simulationConfig.frameCount % (simulationConfig.frameSkip + 1) !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Verificar si la simulación debe estar activa
        if (!simulationConfig.active || 
            (simulationConfig.visibilityCheck && 
             !isElementInViewport(canvas))) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar conexiones
        for (let i = 0; i < neurons.length; i++) {
            const neuron = neurons[i];
            
            for (let j = 0; j < neuron.connections.length; j++) {
                const targetNeuron = neurons[neuron.connections[j]];
                
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(targetNeuron.x, targetNeuron.y);
                ctx.strokeStyle = 'rgba(126, 230, 210, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Dibujar neuronas y pulsos
        for (let i = 0; i < neurons.length; i++) {
            const neuron = neurons[i];
            
            // Dibujar neurona
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
            ctx.fillStyle = neuron.color;
            ctx.fill();
            
            // Reducir probabilidad de pulsos en modo de bajo rendimiento
            const pulseProbability = simulationConfig.lowPerformanceMode ? 0.005 : 0.01;
            
            // Ocasionalmente enviar pulso
            if (Math.random() < pulseProbability && neuron.connections.length > 0) {
                const targetIndex = neuron.connections[Math.floor(Math.random() * neuron.connections.length)];
                const targetNeuron = neurons[targetIndex];
                
                neuron.pulses.push({
                    x: neuron.x,
                    y: neuron.y,
                    targetX: targetNeuron.x,
                    targetY: targetNeuron.y,
                    progress: 0,
                    speed: 0.05,
                    color: 'rgba(212, 175, 55, 0.8)'
                });
                
                // Activar temporalmente la neurona de origen
                neuron.color = 'rgba(212, 175, 55, 0.8)';
                setTimeout(() => {
                    neuron.color = `rgba(126, 230, 210, ${0.5 + Math.random() * 0.3})`;
                }, 300);
            }
            
            // Actualizar y dibujar pulsos
            for (let j = neuron.pulses.length - 1; j >= 0; j--) {
                const pulse = neuron.pulses[j];
                
                // Actualizar posición
                pulse.progress += pulse.speed;
                
                if (pulse.progress >= 1) {
                    // Activar neurona destino
                    const targetNeuron = neurons.find(n => n.x === pulse.targetX && n.y === pulse.targetY);
                    if (targetNeuron) {
                        targetNeuron.color = 'rgba(212, 175, 55, 0.8)';
                        setTimeout(() => {
                            targetNeuron.color = `rgba(126, 230, 210, ${0.5 + Math.random() * 0.3})`;
                        }, 300);
                    }
                    
                    // Eliminar pulso
                    neuron.pulses.splice(j, 1);
                    continue;
                }
                
                // Calcular posición actual
                const x = neuron.x + (pulse.targetX - neuron.x) * pulse.progress;
                const y = neuron.y + (pulse.targetY - neuron.y) * pulse.progress;
                
                // Dibujar pulso
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = pulse.color;
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    simulationConfig.activeSimulations.push('neural');
}

// Simulación 3: Comunicación Uno a Muchos
function createNetworkSimulation() {
    const container = document.querySelector('.network-simulation');
    if (!container || simulationConfig.canvasCache.has('network')) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    simulationConfig.canvasCache.set('network', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Crear nodos
    const nodes = [];
    const nodeCount = simulationConfig.lowPerformanceMode ? 10 : 15;
    
    // Crear un nodo central
    const centralNode = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 8,
        color: 'rgba(212, 175, 55, 0.8)',
        connections: [],
        broadcasting: false,
        broadcastRadius: 0,
        broadcastStrength: 0
    };
    
    // Crear nodos periféricos
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const distance = 50 + Math.random() * 70;
        
        nodes.push({
            x: centralNode.x + Math.cos(angle) * distance,
            y: centralNode.y + Math.sin(angle) * distance,
            radius: 4 + Math.random() * 3,
            color: `rgba(126, 230, 210, ${0.5 + Math.random() * 0.3})`,
            activated: false
        });
    }
    
    // Animación
    function animate() {
        // Saltar frames si es necesario para mejorar rendimiento
        simulationConfig.frameCount++;
        if (simulationConfig.frameCount % (simulationConfig.frameSkip + 1) !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Verificar si la simulación debe estar activa
        if (!simulationConfig.active || 
            (simulationConfig.visibilityCheck && 
             !isElementInViewport(canvas))) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar conexiones
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            ctx.beginPath();
            ctx.moveTo(centralNode.x, centralNode.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = 'rgba(126, 230, 210, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Dibujar nodos periféricos
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.activated ? 'rgba(212, 175, 55, 0.8)' : node.color;
            ctx.fill();
        }
        
        // Dibujar nodo central
        ctx.beginPath();
        ctx.arc(centralNode.x, centralNode.y, centralNode.radius, 0, Math.PI * 2);
        ctx.fillStyle = centralNode.color;
        ctx.fill();
        
        // Reducir probabilidad de broadcast en modo de bajo rendimiento
        const broadcastProbability = simulationConfig.lowPerformanceMode ? 0.005 : 0.01;
        
        // Ocasionalmente iniciar broadcast
        if (!centralNode.broadcasting && Math.random() < broadcastProbability) {
            centralNode.broadcasting = true;
            centralNode.broadcastRadius = centralNode.radius;
            centralNode.broadcastStrength = 0.8;
            
            // Destacar nodo central
            centralNode.color = 'rgba(212, 175, 55, 1)';
            setTimeout(() => {
                centralNode.color = 'rgba(212, 175, 55, 0.8)';
            }, 500);
        }
        
        // Dibujar broadcast si está activo
        if (centralNode.broadcasting) {
            ctx.beginPath();
            ctx.arc(centralNode.x, centralNode.y, centralNode.broadcastRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(212, 175, 55, ${centralNode.broadcastStrength})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Expandir broadcast - más rápido en modo de bajo rendimiento
            const expansionRate = simulationConfig.lowPerformanceMode ? 3 : 2;
            centralNode.broadcastRadius += expansionRate;
            centralNode.broadcastStrength *= 0.98;
            
            // Activar nodos que alcanza la señal
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const dx = node.x - centralNode.x;
                const dy = node.y - centralNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Si la señal alcanza el nodo
                if (Math.abs(distance - centralNode.broadcastRadius) < 5 && centralNode.broadcastStrength > 0.1) {
                    node.activated = true;
                    
                    // Desactivar después de un tiempo
                    setTimeout(() => {
                        node.activated = false;
                    }, 500 + Math.random() * 500);
                }
            }
            
            // Terminar broadcast cuando es muy débil
            if (centralNode.broadcastStrength < 0.05) {
                centralNode.broadcasting = false;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    simulationConfig.activeSimulations.push('network');
}

// Simulación 4: Procesamiento Complejo de Información
function createBrainSimulation() {
    const container = document.querySelector('.brain-simulation');
    if (!container || simulationConfig.canvasCache.has('brain')) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    simulationConfig.canvasCache.set('brain', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Crear regiones
    const regions = [];
    const regionCount = 5; // Mantener 5 regiones para la estructura cerebral
    
    // Posiciones para formar una estructura similar a un cerebro
    const positions = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3 },
        { x: canvas.width * 0.7, y: canvas.height * 0.3 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: canvas.width * 0.3, y: canvas.height * 0.7 },
        { x: canvas.width * 0.7, y: canvas.height * 0.7 }
    ];
    
    // Crear regiones en esas posiciones
    for (let i = 0; i < regionCount; i++) {
        regions.push({
            x: positions[i].x,
            y: positions[i].y,
            radius: 15,
            color: `rgba(126, 230, 210, ${0.5 + Math.random() * 0.3})`,
            connections: [],
            activity: 0,
            pulses: []
        });
    }
    
    // Crear conexiones entre todas las regiones
    // En modo de bajo rendimiento, reducir el número de conexiones
    for (let i = 0; i < regions.length; i++) {
        for (let j = 0; j < regions.length; j++) {
            if (i !== j) {
                // En modo de bajo rendimiento, solo conectar regiones cercanas
                if (!simulationConfig.lowPerformanceMode || Math.abs(i - j) <= 2) {
                    regions[i].connections.push(j);
                }
            }
        }
    }
    
    // Animación
    function animate() {
        // Saltar frames si es necesario para mejorar rendimiento
        simulationConfig.frameCount++;
        if (simulationConfig.frameCount % (simulationConfig.frameSkip + 1) !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Verificar si la simulación debe estar activa
        if (!simulationConfig.active || 
            (simulationConfig.visibilityCheck && 
             !isElementInViewport(canvas))) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar conexiones
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            
            for (let j = 0; j < region.connections.length; j++) {
                const targetRegion = regions[region.connections[j]];
                
                ctx.beginPath();
                ctx.moveTo(region.x, region.y);
                ctx.lineTo(targetRegion.x, targetRegion.y);
                ctx.strokeStyle = 'rgba(126, 230, 210, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Dibujar regiones y pulsos
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            
            // Dibujar región
            ctx.beginPath();
            ctx.arc(region.x, region.y, region.radius, 0, Math.PI * 2);
            
            // Color basado en actividad
            const activityColor = region.activity > 0.5 ? 
                `rgba(212, 175, 55, ${region.activity})` : 
                `rgba(126, 230, 210, ${0.5 + region.activity * 0.5})`;
            
            ctx.fillStyle = activityColor;
            ctx.fill();
            
            // Reducir actividad gradualmente
            region.activity *= 0.95;
            
            // Reducir probabilidad de activación en modo de bajo rendimiento
            const activationProbability = simulationConfig.lowPerformanceMode ? 0.005 : 0.01;
            
            // Ocasionalmente activar región y enviar pulsos
            if (Math.random() < activationProbability) {
                region.activity = 0.8;
                
                // Enviar pulsos a regiones conectadas
                // En modo de bajo rendimiento, enviar menos pulsos
                const maxPulses = simulationConfig.lowPerformanceMode ? 2 : region.connections.length;
                const connectionIndices = [...region.connections];
                
                // Mezclar aleatoriamente las conexiones
                connectionIndices.sort(() => Math.random() - 0.5);
                
                for (let j = 0; j < Math.min(maxPulses, connectionIndices.length); j++) {
                    const targetIndex = connectionIndices[j];
                    const targetRegion = regions[targetIndex];
                    
                    region.pulses.push({
                        x: region.x,
                        y: region.y,
                        targetX: targetRegion.x,
                        targetY: targetRegion.y,
                        progress: 0,
                        speed: 0.03,
                        color: 'rgba(212, 175, 55, 0.8)'
                    });
                }
            }
            
            // Actualizar y dibujar pulsos
            for (let j = region.pulses.length - 1; j >= 0; j--) {
                const pulse = region.pulses[j];
                
                // Actualizar posición
                pulse.progress += pulse.speed;
                
                if (pulse.progress >= 1) {
                    // Activar región destino
                    const targetIndex = regions.findIndex(r => r.x === pulse.targetX && r.y === pulse.targetY);
                    if (targetIndex !== -1) {
                        regions[targetIndex].activity = 0.8;
                    }
                    
                    // Eliminar pulso
                    region.pulses.splice(j, 1);
                    continue;
                }
                
                // Calcular posición actual
                const x = region.x + (pulse.targetX - region.x) * pulse.progress;
                const y = region.y + (pulse.targetY - region.y) * pulse.progress;
                
                // Dibujar pulso
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = pulse.color;
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    simulationConfig.activeSimulations.push('brain');
}

// Simulación 5: El Astrorganism
function createAstrorganismSimulation() {
    const container = document.querySelector('.astrorganism-simulation');
    if (!container || simulationConfig.canvasCache.has('astrorganism')) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    simulationConfig.canvasCache.set('astrorganism', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Crear elementos del Astrorganism - reducir en modo de bajo rendimiento
    const elements = [];
    const elementCount = simulationConfig.lowPerformanceMode ? 20 : 30;
    
    // Crear elementos distribuidos en forma circular
    for (let i = 0; i < elementCount; i++) {
        const angle = (i / elementCount) * Math.PI * 2;
        const distance = 30 + Math.random() * 80;
        
        elements.push({
            x: canvas.width / 2 + Math.cos(angle) * distance,
            y: canvas.height / 2 + Math.sin(angle) * distance,
            radius: 3 + Math.random() * 4,
            color: Math.random() < 0.3 ? 
                `rgba(212, 175, 55, ${0.5 + Math.random() * 0.5})` : 
                `rgba(126, 230, 210, ${0.5 + Math.random() * 0.5})`,
            connections: [],
            activity: 0.2 + Math.random() * 0.3,
            pulses: [],
            type: Math.random() < 0.5 ? 'organic' : 'digital'
        });
    }
    
    // Crear conexiones - reducir en modo de bajo rendimiento
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const connectionCount = simulationConfig.lowPerformanceMode ? 
            (2 + Math.floor(Math.random() * 3)) : 
            (3 + Math.floor(Math.random() * 5));
        
        // Crear un conjunto de posibles conexiones
        const possibleConnections = [];
        for (let j = 0; j < elements.length; j++) {
            if (i !== j) {
                possibleConnections.push(j);
            }
        }
        
        // Mezclar aleatoriamente
        possibleConnections.sort(() => Math.random() - 0.5);
        
        // Tomar las primeras connectionCount conexiones
        for (let j = 0; j < Math.min(connectionCount, possibleConnections.length); j++) {
            element.connections.push(possibleConnections[j]);
        }
    }
    
    // Animación
    function animate() {
        // Saltar frames si es necesario para mejorar rendimiento
        simulationConfig.frameCount++;
        if (simulationConfig.frameCount % (simulationConfig.frameSkip + 1) !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Verificar si la simulación debe estar activa
        if (!simulationConfig.active || 
            (simulationConfig.visibilityCheck && 
             !isElementInViewport(canvas))) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar conexiones - optimizar dibujando solo las visibles
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            for (let j = 0; j < element.connections.length; j++) {
                const targetElement = elements[element.connections[j]];
                
                // Calcular color de conexión basado en los tipos
                let connectionColor;
                if (element.type === targetElement.type) {
                    connectionColor = element.type === 'organic' ? 
                        'rgba(126, 230, 210, 0.3)' : 
                        'rgba(212, 175, 55, 0.3)';
                } else {
                    // Conexión entre orgánico y digital
                    connectionColor = 'rgba(180, 180, 255, 0.3)';
                }
                
                ctx.beginPath();
                ctx.moveTo(element.x, element.y);
                ctx.lineTo(targetElement.x, targetElement.y);
                ctx.strokeStyle = connectionColor;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Dibujar elementos y pulsos
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            // Dibujar elemento
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            ctx.fillStyle = element.color;
            ctx.fill();
            
            // Añadir resplandor - omitir en modo de bajo rendimiento
            if (!simulationConfig.lowPerformanceMode) {
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = element.color.replace(')', ', 0.2)');
                ctx.fill();
            }
            
            // Reducir probabilidad de pulsos en modo de bajo rendimiento
            const pulseProbability = simulationConfig.lowPerformanceMode ? 0.01 : 0.02;
            
            // Ocasionalmente enviar pulsos
            if (Math.random() < pulseProbability) {
                element.activity = 0.8;
                
                // Seleccionar conexiones aleatorias para enviar pulsos
                const targetIndices = element.connections.slice();
                targetIndices.sort(() => Math.random() - 0.5);
                
                // Reducir número de pulsos en modo de bajo rendimiento
                const pulsesToSend = simulationConfig.lowPerformanceMode ? 
                    (1 + Math.floor(Math.random() * 2)) : 
                    (1 + Math.floor(Math.random() * 3));
                
                for (let j = 0; j < Math.min(pulsesToSend, targetIndices.length); j++) {
                    const targetIndex = targetIndices[j];
                    const targetElement = elements[targetIndex];
                    
                    // Color del pulso basado en los tipos
                    let pulseColor;
                    if (element.type === targetElement.type) {
                        pulseColor = element.type === 'organic' ? 
                            'rgba(126, 230, 210, 0.8)' : 
                            'rgba(212, 175, 55, 0.8)';
                    } else {
                        // Pulso entre orgánico y digital
                        pulseColor = 'rgba(180, 180, 255, 0.8)';
                    }
                    
                    element.pulses.push({
                        x: element.x,
                        y: element.y,
                        targetX: targetElement.x,
                        targetY: targetElement.y,
                        progress: 0,
                        speed: 0.02 + Math.random() * 0.02,
                        color: pulseColor
                    });
                }
            }
            
            // Actualizar y dibujar pulsos
            for (let j = element.pulses.length - 1; j >= 0; j--) {
                const pulse = element.pulses[j];
                
                // Actualizar posición
                pulse.progress += pulse.speed;
                
                if (pulse.progress >= 1) {
                    // Activar elemento destino
                    const targetIndex = elements.findIndex(e => e.x === pulse.targetX && e.y === pulse.targetY);
                    if (targetIndex !== -1) {
                        elements[targetIndex].activity = 0.8;
                        
                        // Ocasionalmente cambiar el tipo del elemento (integración orgánico-digital)
                        // Reducir probabilidad en modo de bajo rendimiento
                        const integrationProbability = simulationConfig.lowPerformanceMode ? 0.05 : 0.1;
                        
                        if (Math.random() < integrationProbability) {
                            const sourceType = elements.find(e => e.x === pulse.x && e.y === pulse.y).type;
                            if (elements[targetIndex].type !== sourceType) {
                                // Cambio de tipo: integración
                                elements[targetIndex].color = 'rgba(180, 180, 255, 0.8)';
                                elements[targetIndex].type = 'integrated';
                            }
                        }
                    }
                    
                    // Eliminar pulso
                    element.pulses.splice(j, 1);
                    continue;
                }
                
                // Calcular posición actual
                const x = element.x + (pulse.targetX - element.x) * pulse.progress;
                const y = element.y + (pulse.targetY - element.y) * pulse.progress;
                
                // Dibujar pulso
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = pulse.color;
                ctx.fill();
            }
        }
        
        // Efecto de resplandor central (consciencia emergente)
        // Simplificar en modo de bajo rendimiento
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, simulationConfig.lowPerformanceMode ? 80 : 100
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(180, 180, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, simulationConfig.lowPerformanceMode ? 80 : 100, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    simulationConfig.activeSimulations.push('astrorganism');
}

// Inicializar simulaciones
initializeSimulations();
