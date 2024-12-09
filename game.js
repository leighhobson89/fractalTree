import { localize } from './localization.js';
import { getLineThickness, setLineThickness, getLayersQuantity, getAngleDegrees, getLineColor, getLengthScalingFactor, getDrawSpeed, getDrawingNow, setBeginGameStatus, setGameStateVariable, getBeginGameStatus, getMenuState, getGameVisibleActive, getElements, getLanguage, gameState } from './constantsAndGlobalVars.js';

//--------------------------------------------------------------------------------------------------------

export function startGame() {
    const ctx = getElements().canvas.getContext('2d');
    const container = getElements().canvasContainer;

    function updateCanvasSize() {
        const canvasWidth = container.clientWidth * 0.8;
        const canvasHeight = container.clientHeight * 0.8;

        getElements().canvas.style.width = `${canvasWidth}px`;
        getElements().canvas.style.height = `${canvasHeight}px`;

        getElements().canvas.width = canvasWidth;
        getElements().canvas.height = canvasHeight;
        
        ctx.scale(1, 1);
    }

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    if (getBeginGameStatus()) {
        setBeginGameStatus(false);
    }
    setGameState(getGameVisibleActive());

    gameLoop();
}

export async function gameLoop() {
    const ctx = getElements().canvas.getContext('2d');
    if (gameState === getGameVisibleActive()) {

        if (gameState === getGameVisibleActive() && getDrawingNow()) {
            draw(ctx);
        }

        requestAnimationFrame(gameLoop);
    }
}

const draw = (ctx) => {
    const canvasWidth = getElements().canvas.width;
    const canvasHeight = getElements().canvas.height;

    const xMid = canvasWidth / 2;
    const yStart = canvasHeight - (canvasHeight * 0.05);
    const totalLineHeight = canvasHeight * 0.25;
    const lengthScalingFactor = getLengthScalingFactor();

    const initialThickness = getLineThickness(); // Starting thickness
    const layerQuantity = getLayersQuantity();
    
    // Calculate the line thickness decrement per layer
    const thicknessDecrement = (initialThickness - 1) / (layerQuantity - 1);

    if (typeof draw.currentHeight === 'undefined') {
        draw.currentHeight = 0;
    }
    if (typeof draw.isDrawingAngledLines === 'undefined') {
        draw.isDrawingAngledLines = false;
    }
    if (typeof draw.angledLineProgress === 'undefined') {
        draw.angledLineProgress = 0;
    }
    if (typeof draw.lines === 'undefined') {
        draw.lines = [];
    }
    if (typeof draw.activeEndpoints === 'undefined') {
        draw.activeEndpoints = [];
    }
    if (typeof draw.currentLayerLength === 'undefined') {
        draw.currentLayerLength = totalLineHeight * lengthScalingFactor;
    }
    if (typeof draw.layerCount === 'undefined') {
        draw.layerCount = 0;
    }

    const drawStoredLines = () => {
        for (const line of draw.lines) {
            ctx.beginPath();
            ctx.moveTo(line.xStart, line.yStart);
            ctx.lineTo(line.xEnd, line.yEnd);

            // Dynamically adjust line thickness based on layer count
            const currentThickness = initialThickness - draw.layerCount * thicknessDecrement;
            ctx.lineWidth = Math.max(1, currentThickness); // Ensure thickness doesn't go below 1

            ctx.strokeStyle = getLineColor();
            ctx.stroke();
        }
    };

    const addLine = (xStart, yStart, xEnd, yEnd, prevX, prevY) => {
        draw.lines.push({ xStart, yStart, xEnd, yEnd });
        draw.activeEndpoints.push({ x: xEnd, y: yEnd, prevX, prevY });
    };

    const drawVerticalLine = () => {
        const yEnd = yStart - draw.currentHeight;
        addLine(xMid, yStart, xMid, yEnd, xMid, yStart);
        draw.currentHeight = Math.min(draw.currentHeight + getDrawSpeed(), totalLineHeight);

        if (draw.currentHeight >= totalLineHeight) {
            draw.isDrawingAngledLines = true;
            draw.activeEndpoints = [{ x: xMid, y: yEnd, prevX: xMid, prevY: yStart }];
        }
    };

    const drawAngledLines = () => {
        const angleRadians = getAngleDegrees() * (Math.PI / 180);
        const newEndpoints = [];

        if (draw.layerCount >= layerQuantity - 1) {
            return;
        }

        for (const point of draw.activeEndpoints) {
            const progress = draw.angledLineProgress;
            const dx = point.x - point.prevX;
            const dy = point.y - point.prevY;
            const lineAngle = Math.atan2(dy, dx);
            const leftAngle = lineAngle - angleRadians;
            const rightAngle = lineAngle + angleRadians;

            const xLeftEnd = point.x + (progress * Math.cos(leftAngle));
            const yLeftEnd = point.y + (progress * Math.sin(leftAngle));
            const xRightEnd = point.x + (progress * Math.cos(rightAngle));
            const yRightEnd = point.y + (progress * Math.sin(rightAngle));

            draw.lines.push({ xStart: point.x, yStart: point.y, xEnd: xLeftEnd, yEnd: yLeftEnd });
            draw.lines.push({ xStart: point.x, yStart: point.y, xEnd: xRightEnd, yEnd: yRightEnd });

            newEndpoints.push({ x: xLeftEnd, y: yLeftEnd, prevX: point.x, prevY: point.y });
            newEndpoints.push({ x: xRightEnd, y: yRightEnd, prevX: point.x, prevY: point.y });
        }

        draw.angledLineProgress = Math.min(draw.angledLineProgress + getDrawSpeed(), draw.currentLayerLength);

        if (draw.angledLineProgress >= draw.currentLayerLength) {
            draw.activeEndpoints = newEndpoints;
            draw.angledLineProgress = 0;
            draw.layerCount += 1;
            draw.currentLayerLength *= lengthScalingFactor;
        }
    };

    drawStoredLines();

    if (!draw.isDrawingAngledLines) {
        drawVerticalLine();
    } else {
        drawAngledLines();
    }
};


//===============================================================================================================


export function setGameState(newState) {
    console.log("Setting game state to " + newState);
    setGameStateVariable(newState);

    switch (newState) {
        case getMenuState():
            getElements().menu.classList.remove('d-none');
            getElements().menu.classList.add('d-flex');
            getElements().buttonRow.classList.add('d-none');
            getElements().buttonRow.classList.remove('d-flex');
            getElements().canvasContainer.classList.remove('d-flex');
            getElements().canvasContainer.classList.add('d-none');
            // getElements().returnToMenuButton.classList.remove('d-flex');
            // getElements().returnToMenuButton.classList.add('d-none');
            getElements().button1.classList.add('d-none');
            // getElements().button2.classList.add('d-none');

            console.log("Language is " + getLanguage());
            break;
        case getGameVisibleActive():
            getElements().menu.classList.remove('d-flex');
            getElements().menu.classList.add('d-none');
            getElements().buttonRow.classList.remove('d-none');
            getElements().buttonRow.classList.add('d-flex');
            getElements().canvasContainer.classList.remove('d-none');
            getElements().canvasContainer.classList.add('d-flex');
            // getElements().returnToMenuButton.classList.remove('d-none');
            // getElements().returnToMenuButton.classList.add('d-flex');
            // getElements().returnToMenuButton.innerHTML = `${localize('menuTitle', getLanguage())}`;
            getElements().button1.classList.remove('d-none');
            // getElements().button2.classList.remove('d-none');
            break;
    }
}
