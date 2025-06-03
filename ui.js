import { getLanguage, setElements, getElements, setBeginGameStatus, getGameInProgress, setGameInProgress, getGameVisibleActive, getMenuState, getLanguageSelected, setLanguageSelected, setLanguage, getDrawingNow, setDrawingNow, setDitherActive, getDitherActive } from './constantsAndGlobalVars.js';
import { clearCanvasAndReset, setGameState, startGame } from './game.js';
import { initLocalization, localize } from './localization.js';


document.addEventListener('DOMContentLoaded', async () => {
    setElements();
    
    // Initialize tooltips after a short delay to ensure DOM is ready
    setTimeout(() => {
        // Get all tooltip elements
        const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
        
        // Initialize Bootstrap tooltips
        tooltipElements.forEach(element => {
            // Create tooltip instance
            const tooltip = new bootstrap.Tooltip(element, {
                trigger: 'manual',
                placement: 'right',
                container: 'body',
                boundary: 'window',
                template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div>',
                html: true
            });
            
            // Show tooltip on mouseenter and start tracking mouse
            element.addEventListener('mouseenter', function(e) {
                // First, show the tooltip
                tooltip.show();
                
                // Get the tooltip element
                const tooltipElement = document.querySelector('.tooltip.show');
                if (!tooltipElement) return;
                
                // Set initial styles
                tooltipElement.style.position = 'fixed';
                tooltipElement.style.pointerEvents = 'none';
                tooltipElement.style.zIndex = '10000';
                tooltipElement.style.opacity = '1';
                tooltipElement.style.transform = 'none';
                tooltipElement.style.margin = '0';
                tooltipElement.style.padding = '0';
                tooltipElement.style.border = 'none';
                
                // Position the tooltip at the cursor
                const updatePosition = (e) => {
                    const x = e.clientX + 15;
                    const y = e.clientY + 15;
                    
                    tooltipElement.style.left = `${x}px`;
                    tooltipElement.style.top = `${y}px`;
                };
                
                // Initial position
                updatePosition(e);
                
                // Store the handler for cleanup
                element._tooltipMouseMoveHandler = (moveEvent) => updatePosition(moveEvent);
                document.addEventListener('mousemove', element._tooltipMouseMoveHandler);
            });
            
            // Hide tooltip and clean up on mouseleave
            element.addEventListener('mouseleave', function() {
                tooltip.hide();
                if (element._tooltipMouseMoveHandler) {
                    document.removeEventListener('mousemove', element._tooltipMouseMoveHandler);
                    delete element._tooltipMouseMoveHandler;
                }
            });
            
            // Clean up when the tooltip is hidden
            element.addEventListener('hidden.bs.tooltip', function() {
                if (element._tooltipMouseMoveHandler) {
                    document.removeEventListener('mousemove', element._tooltipMouseMoveHandler);
                    delete element._tooltipMouseMoveHandler;
                }
            });
        });
    }, 100);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Dither checkbox event listener
    const ditherCheckbox = document.getElementById('ditherCheckbox');
    if (ditherCheckbox) {
        ditherCheckbox.addEventListener('change', (e) => {
            console.log('Before setting dither state. Current state:', getDitherActive());
            setDitherActive(e.target.checked);
            console.log('After setting dither state. New state:', getDitherActive());
        });
        
        // Log initial state
        console.log('Initial dither state:', getDitherActive());
    }
    
    // Event listeners
    getElements().newGameMenuButton.addEventListener('click', async () => {
        setBeginGameStatus(true);
        if (!getGameInProgress()) {
            setGameInProgress(true);
        }
        setGameState(getGameVisibleActive());
        //PRE GAME START CODE HERE AFTER NEW GAME CLICKED
        startGame();
    });

    // getElements().returnToMenuButton.addEventListener('click', () => {
    //     setGameState(getMenuState());
    // });

    getElements().button1.addEventListener('click', () => {
        if (!getDrawingNow()) {
            clearCanvasAndReset();
        }
        setDrawingNow(!getDrawingNow());
    });    

    // getElements().button2.addEventListener('click', () => {
    //     //BUTTON 2 CODE
    // });

    setGameState(getMenuState());
    handleLanguageChange(getLanguageSelected());
});

async function setElementsLanguageText() {
    getElements().menuTitle.innerHTML = `<h2>${localize('menuTitle', getLanguage())}</h2>`;
    getElements().newGameMenuButton.innerHTML = `${localize('newGame', getLanguage())}`;
}

export async function handleLanguageChange(languageCode) {
    setLanguageSelected(languageCode);
    await setupLanguageAndLocalization();
    setElementsLanguageText();
}

async function setupLanguageAndLocalization() {
    setLanguage(getLanguageSelected());
    await initLocalization(getLanguage());
}

export function disableActivateButton(button, action, activeClass) {
    switch (action) {
        case 'active':
            button.classList.remove('disabled');
            button.classList.add(activeClass);
            break;
        case 'disable':
            button.classList.remove(activeClass);
            button.classList.add('disabled');
            break;
    }
}

