// Змейка представлена в виде массива объектов, каждый из которых это отдельный блок, имеющий
// текущие и предыдущие координаты по иксу и игреку. В качестве поля действия используем двумерный массив,
// в ячейки которого заносим разные значения для змейки, яблок, границ. В конце концов перебираем массив и 
// по-разному отрисовываем эти значения с помощью канваса

let canvas = document.querySelector('.canvas'),
    ctx = canvas.getContext('2d'),
    mas = [],
    selectSize = document.querySelector('.size-select'),
    fieldSize = selectSize.value,
    directions = [0,0,1,0],
    snake = [],
    previousKeyKode = 39,
    apple = {},
    speed = document.querySelector('.speed'),
    speedValue = 150,
    speedInfo = document.querySelector('.speed-info'),
    lengthValue = 1,
    points = 0;

// код для отображения сложности по наведению

speed.onmouseenter = () => speedInfo.style.display = 'block'
speed.onmouseleave = () => speedInfo.style.display = 'none'

// определяем скорость движения змейки и показываем сложность

function setSpeed() {
    function applySpeed(value, info, style){
        speedValue = value;
        speedInfo.innerHTML = info;
        speedInfo.style.left = style;
    }
    speed.oninput = function() {
        switch(+speed.value) {
            case 1: applySpeed(20, 'UltraMegaHard', (-15.5 + '%')); break;
            case 2: applySpeed(50, 'Hard', (7 + '%')); break;
            case 3: applySpeed(150, 'Normal', (29.5 + '%')); break;
            case 4: applySpeed(250, 'Easy', (52 + '%')); break;
            case 5: applySpeed(500, 'SuperDuperEasy', (74 + '%')); break;
        }
    }
}

setSpeed();

// устанавливаем размер канваса

function setPlayground(someSize){
    canvas.style.width = someSize + 'px';
    canvas.style.height = someSize + 'px';
    canvas.width = someSize;
    canvas.height = someSize;
}

setPlayground(fieldSize);

// создаем двухмерный массив, куда будем записывать значения ячеек и по разному их отрисовывать

function field(someSize){
    for(let i = 0; i < someSize/10; i++) {
        mas[i] = [];
        for (let j = 0; j < someSize/10; j++) {
            if(i === 0 || i === someSize/10-1) {
                mas[i][j] = 9;
            } else if(j === 0 || j === someSize/10-1) {
                mas[i][j] = 9;
            } else {
                mas[i][j] =0;
            }
        }
    }
}

field(fieldSize);

// конструктор для змейки, каждый объект имеет четыре значения - координаты, а также два метода-
// один рисует блок, второй стирает его с прошлого места

class SnakeBlock {
    constructor(yCoord, xCoord) {
        this.yCoord = yCoord;
        this.xCoord = xCoord;
        this.yPrevCoord = this.yCoord;
        this.xPrevCoord = this.xCoord;
    }
    moveRight() {
        this.xPrevCoord = this.xCoord;
        this.yPrevCoord = this.yCoord;
        this.xCoord += 1;
    }
    moveLeft() {
        this.xPrevCoord = this.xCoord;
        this.yPrevCoord = this.yCoord;
        this.xCoord -= 1;
    }
    moveUp() {
        this.xPrevCoord = this.xCoord;
        this.yPrevCoord = this.yCoord;
        this.yCoord -= 1;
    }
    moveDown() {
        this.xPrevCoord = this.xCoord;
        this.yPrevCoord = this.yCoord;
        this.yCoord += 1;
    }
    draw() {
        mas[this.yCoord][this.xCoord] = 1;
    }
    wipeOut() {
        mas[this.yPrevCoord][this.xPrevCoord] = 0;
    }
}

// создаем змейку, расположенную в центре поля и состоящую из одного, головного блока.

function createSnake (someValue) {
    let center = (someValue/10/2)-1;
    snake = [];
    snake[0] = new SnakeBlock(center, center);
    mas[snake[0].yCoord][snake[0].xCoord] = 1;
}

createSnake(fieldSize);

// добавляем блоки в змейку и насчитываем очки
let initialTime;

function countPoints () {
    if(snake.length === 1) {
        initialTime = new Date;
        initialTime = initialTime.getTime();
        return;
    }
    let newTime = new Date;
    newTime = newTime.getTime();
    let difference = newTime - initialTime;
    
    lengthValue++;
    let newPoints = 10;
    
    if (difference < 1000) {
        newPoints *= 2;
    } else if(difference < 2500) {
        newPoints *= 1.5;
    } else if(difference < 5000) {
        newPoints *= 1.25;
    } else if(difference > 10000) {
        newPoints *= 0.75;
    }
    points += newPoints;
    
    initialTime = new Date;
    initialTime = initialTime.getTime();
}

function addSnakeBlock(y,x) {
    snake[snake.length] = new SnakeBlock(y,x);
    countPoints();
}

// Определяем направление движения и перерисовываем головной блок. Потом перебираем все остальные
// блоки, если они есть и последовательно перерисовываем их на старое место предыдущего блока

function moveSnake (someValue) {
    if (directions[0] === 1) {
        snake[0].moveLeft();
    } else if (directions[1] === 1) {
        snake[0].moveUp();
    } else if (directions[2] === 1) {
        snake[0].moveRight();
    } else if (directions[3] === 1) {
        snake[0].moveDown();
    }
    
    if(snake.length > 1) {
        for(let i = 1; i < snake.length; i++){
            snake[i].xPrevCoord = snake[i].xCoord;
            snake[i].yPrevCoord = snake[i].yCoord;
            snake[i].xCoord = snake[i-1].xPrevCoord;
            snake[i].yCoord = snake[i-1].yPrevCoord;
        }
    }
    snake.forEach(block => block.wipeOut())
    snake.forEach(block => block.draw())
}

moveSnake();

// На случайном месте создаем яблоко.

function randomizeApple(someValue) {
    let isGood = false;
    do {
        apple.yAppleCoord = Math.floor(Math.random() * ((someValue/10-1) - 1)) + 1;
        apple.xAppleCoord = Math.floor(Math.random() * ((someValue/10-1) - 1)) + 1;
        isGood = true;
        for (let i = 1; i < snake.length; i++) {
            if(apple.xAppleCoord === snake[i].xCoord && apple.yAppleCoord === snake[i].yCoord) {
                isGood = false;
                break;
            }
        }
    } while(!isGood)
    mas[apple.yAppleCoord][apple.xAppleCoord] = 3;
}

randomizeApple(fieldSize);

// Главная функция-обработчик. По нажатию на кнопку старт запускает змейку, следит за направлением,
// при этом не разрешая двигаться в противоположную сторону. Плюс задает условия.

let checker = true;

document.querySelector('.start-button').onclick = function startSnake() {
    // вызвать CountPoints разрешаем только один раз, в дальнейшем она будет вызываться при поедании яблока
    
    if(checker) {
        countPoints();
        checker = false;
    }
    
    if (directions[0] === undefined) {
        directions = [0, 0, 1, 0];
        return;
    }
    
    let checkerDirection = true; // дает определить направление движения только один раз за такт
    document.onkeydown = function catchDirecton (event) {
        if(!checkerDirection){
            return;
        }
        checkerDirection = false;
        if(event.keyCode === 37 && previousKeyKode != 39) {
            directions = [1,0,0,0]; previousKeyKode = 37;
        } else if(event.keyCode == 37 && previousKeyKode == 39) {
            directions = [0,0,1,0];
        }
        if(event.keyCode === 38 && previousKeyKode != 40) {
            directions = [0,1,0,0]; previousKeyKode = 38;
        } else if(event.keyCode == 38 && previousKeyKode == 40) {
            directions = [0,0,0,1];
        }
        if(event.keyCode === 39 && previousKeyKode != 37) {
            directions = [0,0,1,0]; previousKeyKode = 39;
        } else if(event.keyCode == 39 && previousKeyKode == 37) {
            directions = [1,0,0,0];
        }
        if(event.keyCode === 40 && previousKeyKode != 38) {
            directions = [0,0,0,1]; previousKeyKode = 40;
        } else if(event.keyCode == 40 && previousKeyKode == 38) {
            directions = [0,1,0,0];
        }
    };
    moveSnake(fieldSize);
//ГРАНИЧНЫЕ УСЛОВИЯ
    if(snake[0].yCoord === fieldSize/10-1 || snake[0].yCoord === 0 || snake[0].xCoord == fieldSize/10-1 || snake[0].xCoord == 0) {
        field(fieldSize);
        createSnake(fieldSize);
        randomizeApple(fieldSize);
        checkAndDraw(fieldSize);
        directions = [0, 0, 1, 0];
        showGameover();
        statsCollector();
        return;
    }
//ЕДИМ ЯБЛОКИ И РАНДОМАЙЗИМ НОВЫЕ
    if(snake[0].yCoord === apple.yAppleCoord && snake[0].xCoord === apple.xAppleCoord){
        addSnakeBlock(snake[0].yPrevCoord, snake[0].xPrevCoord);
        randomizeApple(fieldSize);
    }
//УСЛОВИЯ НЕПРОНИЦАЕМОСТИ ХВОСТА
    for(let i = 4; i < snake.length; i++) {
        if(snake[0].xCoord === snake[i].xCoord && snake[0].yCoord === snake[i].yCoord) {
            field(fieldSize);
            createSnake(fieldSize);
            randomizeApple(fieldSize);
            checkAndDraw(fieldSize);
            directions = [0, 0, 1, 0];
            showGameover();
            statsCollector();
            return;
        }
    }
    checkAndDraw(fieldSize);
    setTimeout(startSnake, speedValue);
};

// перебираем массив и превращаем значения в разноцветные кубики

function checkAndDraw (someValue) {
    ctx.clearRect(0, 0, someValue, someValue);
    for(let i = 0; i < someValue/10; i++) {
        for (let j = 0; j < someValue/10; j++) {
            if(mas[i][j] === 0) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgb(214, 214, 214)';
                ctx.fillStyle = "#dddddd";
                ctx.rect(j * 10, i * 10, 10, 10);
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.closePath();
                ctx.stroke();
            } else if(mas[i][j] === 1) {
                ctx.clearRect(j * 10, i * 10, 10, 10);
                ctx.beginPath();
                ctx.fillStyle = '#e20909';
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.closePath();
                ctx.stroke();
            } else if(mas[i][j] === 3) {
                ctx.clearRect(j * 10, i * 10, 10, 10);
                ctx.beginPath();
                ctx.fillStyle = 'green';
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.closePath();
                ctx.stroke();
            } else if(mas[i][j] === 9) {
                ctx.clearRect(j * 10, i * 10, 10, 10);
                ctx.beginPath();
                ctx.fillStyle = 'rgb(155, 155, 155)';
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

checkAndDraw(fieldSize);

// функция-обработчик, по изменению размеров игрового поля, пересоздает все для игры

selectSize.onchange = function() {
    fieldSize = selectSize.value;
    setPlayground(fieldSize);
    field(fieldSize);
    createSnake(fieldSize);
    randomizeApple(fieldSize);
    checkAndDraw(fieldSize);
    directions = [];
};

// ПОДСЧЕТ ОЧКОВ И ЭКРАН 'GAME OVER'

let spanForLength = document.querySelector('.snakelength');
let spanForPoints = document.querySelector('.points');
let gameoverScreen = document.querySelector('.gameover-screen');

function showGameover () {
    gameoverScreen.style.display = 'flex';
}

function statsCollector () {
    spanForLength.innerHTML = lengthValue;
    lengthValue = 1;
    spanForPoints.innerHTML = points;
    points = 0;
}

document.querySelector('.close-gameover').onclick = ()=> gameoverScreen.style.display = 'none'


// ПЛАН
// 1 добавить продвинутую статистику для начала локалСторадж потом бэкенд
// 2 прорезинить верстку
// 3 сделать возможной игру с телефона
// 4 (добавить паузу)
// 5 переделать рандомайзер: добавить массив всех квадратов с координатами и флагом 
//   наличия змейки в квадрате.
// 6 пересмотреть дизайн
// счётчик посещений
// скрытая форма