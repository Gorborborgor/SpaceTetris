let canvas = document.querySelector('.canvas'),
    ctx = canvas.getContext('2d'),
    fieldArray = [];
    


function createPlayground () {
    for (let y = 0; y < 20; y++) {
        fieldArray[y] = [];
        for (let x = 0; x < 10; x++) {
            fieldArray[y][x] = 0;
        }
    }
    console.log(fieldArray);
}

createPlayground();

function checkAndDraw () {
    ctx.clearRect(0, 0, 200, 400);
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            if(fieldArray[y][x] === 0) {
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
                ctx.rect(x * 30, y * 30, 30, 30);
                ctx.fillRect(x * 30, y * 30, 30, 30);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

checkAndDraw()

// ctx.clearRect(0, 0, someValue, someValue);
// for(let i = 0; i < someValue/10; i++) {
//     for (let j = 0; j < someValue/10; j++) {
//         if(mas[i][j] === 0) {
//             ctx.beginPath();
//             ctx.strokeStyle = 'rgb(214, 214, 214)';
//             ctx.fillStyle = "#dddddd";
//             ctx.rect(j * 10, i * 10, 10, 10);
//             ctx.fillRect(j * 10, i * 10, 10, 10);
//             ctx.closePath();
//             ctx.stroke();
//         } else if(mas[i][j] === 1) {
//             ctx.clearRect(j * 10, i * 10, 10, 10);
//             ctx.beginPath();
//             ctx.fillStyle = '#e20909';
//             ctx.fillRect(j * 10, i * 10, 10, 10);
//             ctx.closePath();
//             ctx.stroke();
//         } else if(mas[i][j] === 3) {
//             ctx.clearRect(j * 10, i * 10, 10, 10);
//             ctx.beginPath();
//             ctx.fillStyle = 'green';
//             ctx.fillRect(j * 10, i * 10, 10, 10);
//             ctx.closePath();
//             ctx.stroke();
//         } else if(mas[i][j] === 9) {
//             ctx.clearRect(j * 10, i * 10, 10, 10);
//             ctx.beginPath();
//             ctx.fillStyle = 'rgb(155, 155, 155)';
//             ctx.fillRect(j * 10, i * 10, 10, 10);
//             ctx.closePath();
//             ctx.stroke();
//         }
//     }
