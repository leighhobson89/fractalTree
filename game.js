import { setLineColor, setLengthOfLine, getLengthOfLine, setDrawingNow, setLayerQuantity, setAngleOfLines, setLengthScalingFactor, setTreeDrawSpeed, getLineThickness, getLayerQuantity, getAngleOfLines, getLineColor, getLengthScalingFactor, getTreeDrawSpeed, getDrawingNow, setBeginGameStatus, setGameStateVariable, getBeginGameStatus, getMenuState, getGameVisibleActive, getElements, getLanguage, gameState, getDitherActive } from './constantsAndGlobalVars.js';

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

    initialiseSideBarElements();

    gameLoop();
}

export async function gameLoop() {
    const ctx = getElements().canvas.getContext('2d');

    updateInputFieldValues();

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
    const totalLineHeight = canvasHeight * getLengthOfLine();
    const lengthScalingFactor = getLengthScalingFactor();

    const initialThickness = getLineThickness();
    const layerQuantity = getLayerQuantity();
    
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

            const currentThickness = initialThickness - draw.layerCount * thicknessDecrement;
            ctx.lineWidth = Math.max(1, currentThickness);

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
        draw.currentHeight = Math.min(draw.currentHeight + getTreeDrawSpeed(), totalLineHeight);

        if (draw.currentHeight >= totalLineHeight) {
            draw.isDrawingAngledLines = true;
            draw.activeEndpoints = [{ x: xMid, y: yEnd, prevX: xMid, prevY: yStart }];
        }
    };

    const drawAngledLines = () => {
        const angleRadians = getAngleOfLines() * (Math.PI / 180);
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

        draw.angledLineProgress = Math.min(draw.angledLineProgress + getTreeDrawSpeed(), draw.currentLayerLength);

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

    if (draw.layerCount + 1 >= layerQuantity) {
        setDrawingNow(false);
    }
};

export function clearCanvasAndReset() {
    const ctx = getElements().canvas.getContext('2d');
    const canvasWidth = getElements().canvas.width;
    const canvasHeight = getElements().canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Reset all draw-related variables
    draw.currentHeight = 0;
    draw.isDrawingAngledLines = false;
    draw.angledLineProgress = 0;
    draw.lines = [];
    draw.activeEndpoints = [];
    draw.currentLayerLength = canvasHeight * 0.25 * getLengthScalingFactor();
    draw.layerCount = 0;
}

function initialiseSideBarElements() {

    // Show the color picker and its label
    getElements().lineColor.classList.remove('d-none');
    getElements().lineColorLabel.classList.remove('d-none');

    // Initialize the other fields
    getElements().layerQuantity.value = getLayerQuantity();
    getElements().angleOfLines.value = getAngleOfLines();
    getElements().lengthOfLine.value = getLengthOfLine();
    getElements().lengthScalingFactor.value = getLengthScalingFactor();
    getElements().treeDrawSpeed.value = getTreeDrawSpeed();

    // Show the other fields and their labels
    getElements().layerQuantity.classList.remove('d-none');
    getElements().angleOfLines.classList.remove('d-none');
    getElements().lengthOfLine.classList.remove('d-none');
    getElements().lengthScalingFactor.classList.remove('d-none');
    getElements().treeDrawSpeed.classList.remove('d-none');

    getElements().layerQuantityLabel.classList.remove('d-none');
    getElements().angleOfLinesLabel.classList.remove('d-none');
    getElements().lengthOfLineLabel.classList.remove('d-none');
    getElements().lengthScalingFactorLabel.classList.remove('d-none');
    getElements().treeDrawSpeedLabel.classList.remove('d-none');
    
    // Show the dither checkbox and its container
    const ditherContainer = document.querySelector('.form-check');
    if (ditherContainer) {
        ditherContainer.classList.remove('d-none');
    }
}

export function updateInputFieldValues() {
    // Get the color picker value
    const lineColorField = getElements().lineColor;
    const lineColorValue = lineColorField.value;

    setLineColor(lineColorValue);

    // Get the values of other fields
    const layerQuantityField = getElements().layerQuantity;
    const angleOfLinesField = getElements().angleOfLines;
    const lengthOfLineField = getElements().lengthOfLine;
    const lengthScalingFactorField = getElements().lengthScalingFactor;
    const treeDrawSpeedField = getElements().treeDrawSpeed;

    // Get the values of the fields
    const layerQuantityValue = parseInt(layerQuantityField.value);
    const angleOfLinesValue = parseFloat(angleOfLinesField.value);
    const lengthOfLineValue = parseFloat(lengthOfLineField.value);
    const lengthScalingFactorValue = parseFloat(lengthScalingFactorField.value);
    const treeDrawSpeedValue = parseFloat(treeDrawSpeedField.value);

    // Validation flags
    let validLayerQuantity = true;
    let validAngleOfLines = true;
    let validLengthOfLine = true;
    let validLengthScalingFactor = true;
    let validTreeDrawSpeed = true;

    // Validate layerQuantity
    if (isNaN(layerQuantityValue) || layerQuantityValue > 15) {
        layerQuantityField.style.color = 'red';
        validLayerQuantity = false;
    } else {
        layerQuantityField.style.color = 'black';
    }

    // Validate angleOfLines
    if (isNaN(angleOfLinesValue) || angleOfLinesValue < 1 || angleOfLinesValue > 90) {
        angleOfLinesField.style.color = 'red';
        validAngleOfLines = false;
    } else {
        angleOfLinesField.style.color = 'black';
    }

    // Validate lengthOfLine
    if (isNaN(lengthOfLineValue) || lengthOfLineValue < 0.1 || lengthOfLineValue > 0.99) {
        lengthOfLineField.style.color = 'red';
        validLengthOfLine = false;
    } else {
        lengthOfLineField.style.color = 'black';
    }

    // Validate lengthScalingFactor
    if (isNaN(lengthScalingFactorValue) || lengthScalingFactorValue < 0.1 || lengthScalingFactorValue > 0.7) {
        lengthScalingFactorField.style.color = 'red';
        validLengthScalingFactor = false;
    } else {
        lengthScalingFactorField.style.color = 'black';
    }

    // Validate treeDrawSpeed
    if (isNaN(treeDrawSpeedValue)) {
        treeDrawSpeedField.style.color = 'red';
        validTreeDrawSpeed = false;
    } else {
        treeDrawSpeedField.style.color = 'black';
    }

    // Set the values only if valid
    if (validLayerQuantity) {
        setLayerQuantity(layerQuantityValue);
    }

    if (validAngleOfLines) {
        setAngleOfLines(angleOfLinesValue);
    }

    if (validLengthOfLine) {
        setLengthOfLine(lengthOfLineValue);  
    }

    if (validLengthScalingFactor) {
        setLengthScalingFactor(lengthScalingFactorValue);
    }

    if (validTreeDrawSpeed) {
        setTreeDrawSpeed(treeDrawSpeedValue);
    }
}

// Utility function to get a random number between min and max (inclusive)
const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

// Returns the angle with a random variation of ±5-10 degrees
const getRandomizedAngle = (angleInDegrees) => {
    const variation = getRandomInRange(5, 10);
    const direction = Math.random() > 0.5 ? 1 : -1; // Randomly add or subtract
    return angleInDegrees + (variation * direction);
};

// Returns the length with a random variation of ±10-25%
const getRandomizedLength = (length) => {
    const variation = getRandomInRange(10, 25) / 100; // Convert percentage to decimal
    const direction = Math.random() > 0.5 ? 1 : -1; // Randomly add or subtract
    return length * (1 + (variation * direction));
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
            getElements().button1.classList.add('d-none');
            break;
        case getGameVisibleActive():
            getElements().menu.classList.remove('d-flex');
            getElements().menu.classList.add('d-none');
            getElements().buttonRow.classList.remove('d-none');
            getElements().buttonRow.classList.add('d-flex');
            getElements().canvasContainer.classList.remove('d-none');
            getElements().canvasContainer.classList.add('d-flex');
            getElements().button1.classList.remove('d-none');
            break;
    }
}
