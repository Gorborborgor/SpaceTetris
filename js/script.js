// SpaceTetris v1.0

// GLOBAL VARIABLES

let canvasMain = document.querySelector('.canvas-main'),
    ctxMain = canvasMain.getContext('2d'),
    fieldArray = [];
    canvasPreview = document.querySelector('.canvas-preview'),
    ctxPreview = canvasPreview.getContext('2d'),
    fieldPreview = [];
let figuresQueue = [],
    currentFigure,
    nextFigure,
    figureType,
    nextType;
let values = [
    { type: 'empty', color: 'rgba(0, 0, 0, .5)' }, 
    { type: 'figureO', color: 'rgba(242, 7, 7, .8)' }, // red
    { type: 'figureI', color: 'rgba(7, 242, 242, .8)' }, //blue light
    { type: 'figureT', color: 'rgba(28, 31, 230, .8)' }, // blue dark
    { type: 'figureS', color: 'rgba(64, 239, 9, .8)' }, // green
    { type: 'figureZ', color: 'rgba(247, 131, 4, .8)' }, // orange
    { type: 'figureL', color: 'rgba(237, 7, 146, .8)' }, // purple
    { type: 'figureJ', color: 'rgba(230, 227, 28, .8)' }, // yellow
    { type: 'black', color: 'rgba(0, 0, 0, 0)' }, 
    { type: 'white', color: 'rgba(250, 250, 250, .8)' } 
]    
let figureContext = {};
let completeRows = 0;
let speed = 1050,
    points = 0,
    rowsAmount = 0,
    level = 1,
    scoreBoard = document.querySelector('.score'),
    gameoverScreen = document.querySelector('.gameover-screen'),
    statsRow = document.querySelector('.stats-rows'),
    statsPoints = document.querySelector('.stats-points');

scoreBoard.innerHTML = points;

let btnStart = document.querySelector('.btn-start'),
    btnClose = document.querySelector('.btn-close');

//  ENTITIES: FIGURES AND BLOCKS

class basicBlock {
    constructor(yCoord, xCoord, blockType, blockPosition) {
        this.yCoord = yCoord;
        this.xCoord = xCoord;
        Object.defineProperty(this, 'blockType', {
            value: blockType, 
            enumerable: false
        });
        Object.defineProperty(this, 'blockPosition', {
            value: blockPosition, 
            enumerable: false, 
            writable: true
        });
    }
}

class basicFigure {
    constructor(yCoord, xCoord) {
        this.block1 = new basicBlock(yCoord, xCoord, 'inner', 3);
        this.block2 = new basicBlock(yCoord, xCoord + 1, 'inner', 2);
    }
    moveDown() {
        for(let key in this) {
            if(fieldArray[this[key].yCoord+1][this[key].xCoord] !== 0 && fieldArray[this[key].yCoord+1][this[key].xCoord] !== this.fieldValue) {
                throw new Error('heheh'); 
            }
        }
        basicMoves(fieldArray, this, 'yCoord', true);
    }
    moveRight() {
        for(let key in this) {
            if(this[key].xCoord === 9 || fieldArray[this[key].yCoord][this[key].xCoord+1] !== 0 && fieldArray[this[key].yCoord][this[key].xCoord+1] !== this.fieldValue) {
                return;
            }
        }
        basicMoves(fieldArray, this, 'xCoord', true);
    }
    moveLeft() {
        for(let key in this) {
            if(this[key].xCoord === 0 || fieldArray[this[key].yCoord][this[key].xCoord-1] !== 0 && fieldArray[this[key].yCoord][this[key].xCoord-1] !== this.fieldValue) {
                return;
            }
        }
        basicMoves(fieldArray, this, 'xCoord', false);
    }
    drop() {
        try {
            setTimeout(function() {
                currentFigure.moveDown();
                currentFigure.drop();   
            }, 1);
        }
        catch(error) {
            fillField(fieldArray, currentFigure, '0' + currentFigure.fieldValue);
            collapseRows(maxY);
            startGame();
        }
    }
    rotateClockwise() {
        emptyField(fieldArray, this);
        for(let key in this) {
            rotateBlock(this[key], true);
        }
        for(let key in this) {
            if(fieldArray[this[key].yCoord][this[key].xCoord] !== 0) {
                for(let key in this) {
                    rotateBlock(this[key], false);
                }
                return;
            }
        }        
        fillField(fieldArray, this, this.fieldValue);
        drawMain();
    }
    rotateAgainstClockwise() {
        emptyField(fieldArray, this);
        for(let key in this) {
            rotateBlock(this[key], false);
        }
        for(let key in this) {
            if(fieldArray[this[key].yCoord][this[key].xCoord] !== 0) {
                for(let key in this) {
                    rotateBlock(this[key], true);
                }
                return;
            }
        }      
        fillField(fieldArray, this, this.fieldValue);
        drawMain();
    }
}

figureContext.figureO = class figureO extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord - 1, xCoord + 1, 'inner', 1);
        this.block4 = new basicBlock(yCoord - 1, xCoord, 'inner', 4);
        Object.defineProperty(this, 'fieldValue', {value: 1, enumerable: false});
    }
}

figureContext.figureI = class figureI extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord, xCoord + 2, 'outerA', 1);
        this.block4 = new basicBlock(yCoord, xCoord - 1, 'outerB', 1);
        Object.defineProperty(this, 'fieldValue', {value: 2, enumerable: false});
    }
}

figureContext.figureS = class figureS extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord - 1, xCoord + 1, 'inner', 1);
        this.block4 = new basicBlock(yCoord - 1, xCoord + 2, 'outerB', 3);
        Object.defineProperty(this, 'fieldValue', {value: 3, enumerable: false});
    }
}

figureContext.figureZ = class figureZ extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord - 1, xCoord, 'inner', 4);
        this.block4 = new basicBlock(yCoord - 1, xCoord - 1, 'outerA', 3);
        Object.defineProperty(this, 'fieldValue', {value: 4, enumerable: false});
    }
}

figureContext.figureT = class figureT extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord - 1, xCoord, 'inner', 4);
        this.block4 = new basicBlock(yCoord, xCoord - 1, 'outerB', 1);
        Object.defineProperty(this, 'fieldValue', {value: 5, enumerable: false});
    }
}

figureContext.figureL = class figureL extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord, xCoord + 2 , 'outerA', 1);
        this.block4 = new basicBlock(yCoord - 1, xCoord + 2, 'outerB', 3);
        Object.defineProperty(this, 'fieldValue', {value: 6, enumerable: false});
    }
}

figureContext.figureJ = class figureJ extends basicFigure {
    constructor(yCoord, xCoord) {
        super(yCoord, xCoord);
        this.block3 = new basicBlock(yCoord, xCoord - 1, 'outerB', 1);
        this.block4 = new basicBlock(yCoord - 1, xCoord - 1, 'outerA', 3);
        Object.defineProperty(this, 'fieldValue', {value: 7, enumerable: false});
    }
}

// FUNCTIONS

function createPlayground () {
    for (let y = 0; y < 23; y++) {
        fieldArray[y] = [];
        for (let x = 0; x < 10; x++) {
            fieldArray[y][x] = 0;
            
        }
    }
}
createPlayground();

function createPreview() {
    for(let y = 0; y < 4; y++) {
        fieldPreview[y] = [];
        for (let x = 0; x < 4; x++) {
            fieldPreview[y][x] = 0;
        }
    }
}
createPreview();

function emptyField(field, figure) {
    Object.keys(figure).forEach((key) => {
        field[figure[key].yCoord][figure[key].xCoord] = 0;
    })
}

function fillField(field, figure, value) {
    Object.keys(figure).forEach((key) => {
        field[figure[key].yCoord][figure[key].xCoord] = value;
    })
}

function basicMoves(fieldArray, figure, coord, operator) {
    emptyField(fieldArray, figure);
    for(let key in figure) {
        if(operator) {
            figure[key][coord]++;
        } else {
            figure[key][coord]--;
        }
    }
    fillField(fieldArray, figure, figure.fieldValue);
    drawMain();
}

function step(x, repeat, operator) {
    let num = x;
    for(let i = 0; i < repeat; i++) {
        if(operator) {
            num++;
        } else {
            num--;
        }
    }
    return num;
}

function rotateBlock(block, operator) {
    if(!operator) {
        if(block.blockPosition === 1) {
            block.blockPosition = 4;
        } else {
            block.blockPosition--;
        }
    }
    if(block.blockType === 'inner') { 
        switch(block.blockPosition) {
            case 1 :
                block.yCoord = step(block.yCoord, 1, operator);
                break;
            case 2 :
                block.xCoord = step(block.xCoord, 1, !operator);
                break;
            case 3 :
                block.yCoord = step(block.yCoord, 1, !operator);
                break;
            case 4 :
                block.xCoord = step(block.xCoord, 1, operator);
                break;
        }
    } else if (block.blockType === 'outerA') {
        switch(block.blockPosition) {
            case 1 :
                block.xCoord = step(block.xCoord, 2, !operator);
                block.yCoord = step(block.yCoord, 1, operator);
                break;
            case 2 :
                block.xCoord = step(block.xCoord, 1, !operator);
                block.yCoord = step(block.yCoord, 2, !operator);
                break;
            case 3 :
                block.xCoord = step(block.xCoord, 2, operator);
                block.yCoord = step(block.yCoord, 1, !operator);
                break;
            case 4 :
                block.xCoord = step(block.xCoord, 1, operator);
                block.yCoord = step(block.yCoord, 2, operator);
                break;
        }
    } else {
        switch(block.blockPosition) {
            case 1 :
                block.xCoord = step(block.xCoord, 1, operator);
                block.yCoord = step(block.yCoord, 2, !operator);
                break;
            case 2 :
                block.xCoord = step(block.xCoord, 2, operator);
                block.yCoord = step(block.yCoord, 1, operator);
                break;
            case 3 :
                block.xCoord = step(block.xCoord, 1, !operator);
                block.yCoord = step(block.yCoord, 2, operator);
                break;
            case 4 :
                block.xCoord = step(block.xCoord, 2, !operator);
                block.yCoord = step(block.yCoord, 1, !operator);
                break;
        }
    };  
    if(operator){
        if(block.blockPosition === 4) {
            block.blockPosition = 1;
        } else {
            block.blockPosition++;
        }
    }
};

function randomizeFigure () {
    let i = Math.floor(Math.random() * (8 - 1)) + 1;
    return values[i].type;
}

function createFigure () {
    if(!currentFigure) {
        console.log('first')
        figureType = randomizeFigure();
    } else {
        emptyField(fieldPreview, nextFigure);
        figureType = figuresQueue.shift();
    }
    for(let i = figuresQueue.length; i < 3; i++) {
        nextType = randomizeFigure();
        while(nextType === figureType || figuresQueue.indexOf(nextType) !== -1) {
            nextType = randomizeFigure();
        }
        figuresQueue.push(nextType);
    }
    currentFigure = new figureContext[figureType](2, 4);
    nextFigure = new figureContext[figuresQueue[0]](2, 1);  
    fillField(fieldArray, currentFigure, currentFigure.fieldValue);   
    fillField(fieldPreview, nextFigure, nextFigure.fieldValue);
}

function collapseRows() {
    let Ys = [];
    for(let key in currentFigure) {
        Ys.push(currentFigure[key].yCoord);
    }
    let maxY = Math.max(...Ys);
  
    for(let y = maxY; y > 2; y--) {
        if(fieldArray[y].indexOf(0) === -1) {
            for(let x = 0; x < 10; x++) {
                fieldArray[y][x] = 0;
            } 
            drawMain();
            completeRows++;
            fillEmptyPlace(y);
            y++;
        }
    }
    if(completeRows) {
        rowsAmount += completeRows;
        calculatePoints(completeRows)
        completeRows = 0; 
    }
}

function fillEmptyPlace(Y) {
    console.log(Y);
    for(let y = Y-1; y > 2; y--) {
        for(let x = 0; x < 10; x++) {
            fieldArray[y+1][x] = fieldArray[y][x];
            fieldArray[y][x] = 0;
        } 
    }
    drawMain();
}

function calculatePoints(rows) {
    points += Math.pow(2, rows) * 100;
    scoreBoard.innerHTML = points;
    if(points > level * 1000 || speed >= 50) {
        speed -= 50;
        level += 2000;
    }
}

function startGame() {
    for(let i = 0; i < fieldArray[1].length; i++) {
        if(typeof fieldArray[1][i] === "string") {
            showGameover();
            return;
        }
    }
    createFigure();
    drawMain();
    drawPreview();
    btnStart.removeEventListener('click', startGame);
    moveFigure();
}

function moveFigure () {
    try {
        currentFigure.moveDown();
        setTimeout(moveFigure, speed);
    }
    catch(error) {
        fillField(fieldArray, currentFigure, '0' + currentFigure.fieldValue);
        collapseRows();
        startGame();
    }
}

function drawMain () {
    ctxMain.clearRect(0, 0, 250, 575);
    for (let y = 0; y < 23; y++) {
        for (let x = 0; x < 10; x++) {
            ctxMain.beginPath();
            ctxMain.strokeStyle = '#000';
            ctxMain.fillStyle = values[+fieldArray[y][x]].color;
            ctxMain.rect(x * 25, y * 25, 25, 25);
            ctxMain.fillRect(x * 25, y * 25, 25, 25);
            ctxMain.closePath();
            ctxMain.stroke();
        }
    }
}
drawMain()

function drawPreview() {
    ctxPreview.clearRect(0, 0, 60, 60);
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            ctxPreview.beginPath();
            ctxPreview.strokeStyle = '#000';
            ctxPreview.fillStyle = values[+fieldPreview[y][x]].color;
            ctxPreview.rect(x * 15, y * 15, 15, 15);
            ctxPreview.fillRect(x * 15, y * 15, 15, 15);
            ctxPreview.closePath();
            ctxPreview.stroke();
        }
    }
}

function showGameover () {
    gameoverScreen.style.display = 'flex';
    statsRow.innerHTML = rowsAmount;
    statsPoints.innerHTML = points;
}

// CONTROLS

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 90) {
        currentFigure.rotateClockwise();
        return;
    }
    if(e.keyCode === 88) {
        currentFigure.rotateAgainstClockwise();
        return;
    }
    if(e.keyCode === 40) {
        currentFigure.moveDown();
        return;
    }
    if(e.keyCode === 39) {
        currentFigure.moveRight();
        return;
    }
    if(e.keyCode === 37) {
        currentFigure.moveLeft();
        return;
    }
    if(e.keyCode === 32) {
        currentFigure.drop();
        return;
    }
});

btnStart.addEventListener('click', startGame);

btnClose.addEventListener('click', function() {
    rowsAmount = 0;
    points = 0;
    scoreBoard.innerHTML = points;
    speed = 1050;
    level = 1;
    figuresQueue = [];
    currentFigure = undefined;
    createPlayground();
    createPreview();
    drawMain();
    drawPreview();
    btnStart.addEventListener('click', startGame);
    gameoverScreen.style.display = 'none';
});

// BUG LIST

// DONE: when rotating L on first step get a bug - it stuck in the top of playground.
// DONE: rorating near other figures when error is thrown figure can overwrite alredy existing figure
// DONE: when rotating near sides figures can stuck in walls
// DONE: disappearing row when colapsing two completed with incomplete between
// DONE: points are not deleting on new game start
// DONE: when pressing arrowdown when new figure appears, it sometimes instantly changes to another figure
// DONE: figures of one type is transparent to each other DONE
// DONE: two same figure type in row
// DONE: after row deleting the very left colunm is behaving strangly

// TODO LIST 

// TODO:BIG: rewrite rotate functionality: concept - quandrants + figure searching 
//       for posible space for rotation in that quandrant
// TODO: adjust speed
// TODO:IMPORTANT: wait a second between creating another figure
// TODO:IMPORTANT: organize code
// TODO: points for speed
// TODO: actually need to add visual flare - rows
//       colapsing one by one, left rows filling their space not instantly but in observable way 
// DONE: implemented rotation agains clockwise
// DONE: drop button and func
// DONE: close gameover screen
// DONE: gather stats
// DONE: multiple points for several rows in one time 
// DONE: levels - increasing speed
// DONE: rewrite S figure
// DONE: rename additional array to previewArray
// DONE: points
// DONE: forbid figure to appear for several turns
// DONE: rewrite check n draw DONE
// DONE: implement subtype for figures to make moving and placed figures of one type distinguishable