//DEBUG
export let debugFlag = false;
export let debugOptionFlag = false;
export let stateLoading = false;

//ELEMENTS
let elements;
let localization = {};
let language = 'en';
let languageSelected = 'en';
let oldLanguage = 'en';

//CONSTANTS
export let gameState;
export const MENU_STATE = 'menuState';
export const GAME_VISIBLE_ACTIVE = 'gameVisibleActive';

//GLOBAL VARIABLES

//FLAGS
let audioMuted;
let languageChangedFlag;
let beginGameState = true;
let gameInProgress = false;
let drawingNow = false;
let lineThickness = 5;
let lineColor = '#00FF00';

let layerQuantity = 8;
let angleOfLines = 66;
let lengthScalingFactor = 0.66;
let treeDrawSpeed = 2;
let lengthOfInitialLine = 0.25;

let autoSaveOn = false;
export let pauseAutoSaveCountdown = true;

//GETTER SETTER METHODS
export function setElements() {
    elements = {
        menu: document.getElementById('menu'),
        menuTitle: document.getElementById('menuTitle'),
        newGameMenuButton: document.getElementById('newGame'),
        returnToMenuButton: document.getElementById('returnToMenu'),
        canvas: document.getElementById('canvas'),
        canvasContainer: document.getElementById('canvasContainer'),
        buttonRow: document.getElementById('buttonRow'),
        overlay: document.getElementById('overlay'),
        button1: document.getElementById('button1'),
        button2: document.getElementById('button2'),
        layerQuantity: document.getElementById('layerQuantity'),
        angleOfLines: document.getElementById('angleOfLines'),
        lengthScalingFactor: document.getElementById('lengthScalingFactor'),
        treeDrawSpeed: document.getElementById('treeDrawSpeed'),
        layerQuantityLabel: document.querySelector('label[for="layerQuantity"]'),
        angleOfLinesLabel: document.querySelector('label[for="angleOfLines"]'),
        lengthScalingFactorLabel: document.querySelector('label[for="lengthScalingFactor"]'),
        treeDrawSpeedLabel: document.querySelector('label[for="treeDrawSpeed"]'),
        lengthOfLine: document.getElementById('lengthOfLine'),
        lengthOfLineLabel: document.querySelector('label[for="lengthOfLine"]'),
        lineColor: document.getElementById('lineColor'),
        lineColorLabel: document.querySelector('label[for="lineColor"]')
    };
}

export function setGameStateVariable(value) {
    gameState = value;
}

export function getGameStateVariable() {
    return gameState;
}

export function getElements() {
    return elements;
}

export function getLanguageChangedFlag() {
    return languageChangedFlag;
}

export function setLanguageChangedFlag(value) {
    languageChangedFlag = value;
}

export function resetAllVariables() {
    // GLOBAL VARIABLES

    // FLAGS
}

export function captureGameStatusForSaving() {
    let gameState = {};

    // Game variables

    // Flags

    // UI elements

    gameState.language = getLanguage();

    return gameState;
}
export function restoreGameStatus(gameState) {
    return new Promise((resolve, reject) => {
        try {
            // Game variables

            // Flags

            // UI elements

            setLanguage(gameState.language);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function setLocalization(value) {
    localization = value;
}

export function getLocalization() {
    return localization;
}

export function setLanguage(value) {
    language = value;
}

export function getLanguage() {
    return language;
}

export function setOldLanguage(value) {
    oldLanguage = value;
}

export function getOldLanguage() {
    return oldLanguage;
}

export function setAudioMuted(value) {
    audioMuted = value;
}

export function getAudioMuted() {
    return audioMuted;
}

export function getMenuState() {
    return MENU_STATE;
}

export function getGameVisibleActive() {
    return GAME_VISIBLE_ACTIVE;
}

export function getLanguageSelected() {
    return languageSelected;
}

export function setLanguageSelected(value) {
    languageSelected = value;
}

export function getBeginGameStatus() {
    return beginGameState;
}

export function setBeginGameStatus(value) {
    beginGameState = value;
}

export function getGameInProgress() {
    return gameInProgress;
}

export function setGameInProgress(value) {
    gameInProgress = value;
}

export function getDrawingNow() {
    return drawingNow;
}

export function setDrawingNow(value) {
    drawingNow = value;
}

export function getTreeDrawSpeed() {
    return treeDrawSpeed;
}

export function getLengthScalingFactor() {
    return lengthScalingFactor;
}

export function getAngleOfLines() {
    return angleOfLines;
}

export function getLayerQuantity() {
    return layerQuantity;
}

export function setLineThickness(value) {
    lineThickness = value;
}

export function getLineThickness() {
    return lineThickness;
}

export function getLineColor() {
    return lineColor;
}

export function setLineColor(value) {
    lineColor = value;
}

export function setLayerQuantity(value) {
    layerQuantity = value;
}

export function setAngleOfLines(value) {
    angleOfLines = value;
}

export function setLengthScalingFactor(value) {
    lengthScalingFactor = value;
}

export function setTreeDrawSpeed(value) {
    treeDrawSpeed = value;
}

export function getLengthOfLine() {
    return lengthOfInitialLine;
}

export function setLengthOfLine(value) {
    lengthOfInitialLine = value;
}
