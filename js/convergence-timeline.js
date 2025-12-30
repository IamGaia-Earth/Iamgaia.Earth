/**
 * Convergence Timeline
 * 
 * Este script maneja la navegación y visualización de la línea de tiempo
 * que muestra la convergencia entre tecnología y conciencia.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos de la línea de tiempo
    const timelineStages = document.querySelectorAll('.timeline-stage');
    const progressIndicator = document.querySelector('.progress-indicator');
    const markers = document.querySelectorAll('.marker');
    const stageTitle = document.getElementById('timeline-stage-title');
    const prevButton = document.querySelector('.timeline-nav[data-direction="prev"]');
    const nextButton = document.querySelector('.timeline-nav[data-direction="next"]');
    
    // Títulos de las etapas
    const stageTitles = [
        'Comunicación Celular Indirecta',
        'Comunicación Instantánea Uno a Uno',
        'Comunicación Uno a Muchos',
        'Procesamiento Complejo de Información',
        'Integración Planetaria: El Astrorganism'
    ];
    
    // Estado actual
    let currentStage = 1;
    
    // Función para actualizar la visualización de la etapa
    function updateStage(stageNumber) {
        // Limitar el número de etapa entre 1 y el número total de etapas
        stageNumber = Math.max(1, Math.min(stageNumber, timelineStages.length));
        
        // Actualizar estado actual
        currentStage = stageNumber;
        
        // Actualizar clases activas
        timelineStages.forEach((stage, index) => {
            if (index + 1 === stageNumber) {
                stage.classList.add('active');
            } else {
                stage.classList.remove('active');
            }
        });
        
        // Actualizar marcadores
        markers.forEach((marker, index) => {
            if (index + 1 <= stageNumber) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
        
        // Actualizar indicador de progreso
        const progressPercentage = ((stageNumber - 1) / (timelineStages.length - 1)) * 100;
        progressIndicator.style.width = `${progressPercentage}%`;
        
        // Actualizar título
        stageTitle.textContent = stageTitles[stageNumber - 1];
        
        // Actualizar estado de los botones
        prevButton.disabled = stageNumber === 1;
        nextButton.disabled = stageNumber === timelineStages.length;
        
        // Optimización: Pausar simulaciones no visibles
        if (window.simulationConfig) {
            // Asegurarse de que la simulación correspondiente esté activa
            const simulationTypes = ['cell', 'neural', 'network', 'brain', 'astrorganism'];
            const currentSimulation = simulationTypes[stageNumber - 1];
            
            // Verificar si la simulación está en el viewport
            const simulationElement = document.querySelector(`.timeline-stage[data-stage="${stageNumber}"] .stage-visual > div`);
            if (simulationElement) {
                // Forzar la visibilidad de la simulación actual
                simulationElement.style.visibility = 'visible';
                simulationElement.style.opacity = '1';
            }
        }
    }
    
    // Evento para botones de navegación
    document.querySelectorAll('.timeline-nav').forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.getAttribute('data-direction');
            
            if (direction === 'prev' && currentStage > 1) {
                updateStage(currentStage - 1);
            } else if (direction === 'next' && currentStage < timelineStages.length) {
                updateStage(currentStage + 1);
            }
        });
    });
    
    // Evento para marcadores de progreso
    markers.forEach((marker, index) => {
        marker.addEventListener('click', () => {
            updateStage(index + 1);
        });
    });
    
    // Inicializar primera etapa
    updateStage(1);
    
    // Optimización: Usar IntersectionObserver para detectar cuándo la sección es visible
    const timelineSection = document.querySelector('.convergence-section');
    if (timelineSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.simulationConfig) {
                    // Activar/desactivar simulaciones según visibilidad
                    window.simulationConfig.active = entry.isIntersecting;
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(timelineSection);
    }
});
