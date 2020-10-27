const gamePlace = document.querySelector('.game--place');
const wave = document.querySelector('.wave');
const displayValue = document.querySelector('.display--input');
const buttonPad = document.querySelector('.button-container');
const buttons = document.querySelectorAll('.grid');
const scoreBoard = document.querySelector('.score--num');
const mainAudio = document.querySelector('.main--theme');
const dropSound = document.querySelector('.drop--sound');
const rightSound = document.querySelector('.right--sound');
const failSound = document.querySelector('.fail--sound');
const failBoarder =document.querySelector('.fail--text');
const opArr = ['+','-','*','/'];
let gameOver = false;
let gameItaration = 0; // Количество проигрышей
let score = 0; //количество очков
let scorePrice = 10;
let animationTime = 8000;//длительность анимации падения
let createTime = 4000; //время создания капель



//функция нажатия на клавишу Enter
function useEnter(){
    const drop = document.querySelectorAll('.circle');
    if(!displayValue.value) return;
            for(let one of drop){ 
            if(eval(one.textContent) === +displayValue.value){
                rightSound.currentTime = 0;
                rightSound.play();
                score += scorePrice = scorePrice<10?10:scorePrice; 
                scorePrice++;
                gamePlace.removeChild(one); 
                break;  
            } else { 
                if(one !== drop[drop.length-1]) continue; //Если ответ не совпадает ни с одной каплей => ошибка
                    failSound.currentTime = 0;
                    failSound.play();
                    failBoarder.innerHTML = -(--scorePrice<10?10:scorePrice);
                    failBoarder.classList.add('open');
                    setTimeout(() => {
                            failBoarder.classList.remove('open');
                    }, 500);
                    score = score <= 0 ? 0 : score - scorePrice;                  
        }
    }
        displayValue.value = '';
        scoreBoard.textContent = score;
}

//Подсвечивание кнопок
function activateButtons(e){
    buttons.forEach(but => {
        if(but.dataset.num === e.key || but.dataset.but === e.key){
            but.classList.toggle('activate');
        }
    });
}
//Передача значение на дисплей и сравнение с каплями
function updateDisplay(e){
    if(displayValue.value.length < 3 && e.target.dataset.num) {
        displayValue.value += e.target.dataset.num
    }
    switch(e.target.dataset.but){
        case '+': displayValue.value = '';
        break;
        case '.': displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
        break;
        case 'Enter': 
        useEnter();
    }  
}

//Передача значения на дисплей с клавиатуры и сравнение с другими каплями
function updateDisplayWithKeyboard(e){
    if(e.location !== 3 ) return; // Проверяем действительно ли нажата кнопка поля numpad
    switch(e.key){
        case '/': return;
        case '*': return;
        case '-': return;
        case '+': displayValue.value = '';
        break;
        case '.': displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
        break;
        case 'Enter': 
        useEnter(); 
        break;
        default: 
        if(displayValue.value.length < 3) {
            displayValue.value += e.key
        } 
    }
    activateButtons(e);
}

//Создание капель
function createCircle(){
    const circle = document.createElement('div');
    const firstOperand = document.createElement('span');
    const secondOperand = document.createElement('span');
    const operation = document.createElement('span');
    circle.className = 'circle';
    operation.className = 'operation';
    circle.style.left = randomPosition();
    circle.append(firstOperand, operation, secondOperand);
    innerCircle(secondOperand, operation, firstOperand);
    gamePlace.append(circle);
    animate(circle, 10000); // Добавление анимации
    setTimeout(() => {
        if(!gameOver){
            createCircle();
        } 
            
        
    }, createTime);
}

//Определение позиции left
function randomPosition(min = 0, max = 85){
    return Math.floor(Math.random() * (max - min) + min) + '%';
}
//Определение высоты воды
function findHeightWave(){
    return gamePlace.offsetHeight - wave.offsetHeight;
}
//Добавление анимации капле с динамической высотой и удаление после окончания анимации
function animate(circle, time){
    circle.animate([ { top: 0 },
        { top: `${findHeightWave() - circle.offsetHeight}px`} ],
      time).finished
        .then(()=> {
          try{
            gamePlace.removeChild(circle);
            gameItaration++;
            wave.style.height = `${wave.offsetHeight + 20}px`//!!!! вопрос
            score -= 10;
            scoreBoard.innerHTML = score <= 0 ? 0 : score - 10;
            dropSound.play(); //звук падения капли
            if(gameItaration >= 3) { // Если количество проигрышей больше 3 конец игры
                gameOver = !gameOver;
                document.querySelectorAll('.circle').forEach(drop => gamePlace.removeChild(drop))
            }; 
          } catch {
              return;
          }      
    });         
}

//Определение операнд
function operandRandom(min = 0, max = 100){
    return Math.round(Math.random() * (max - min) + min);
}
function operationRandom(min = 0, max = 3){
    return opArr[Math.round(Math.random() * (max - min) + min)];
}

//Наполнение капли значениями
function innerCircle(fO, op, sO){
    const first = operandRandom(0,10);
    const second = operandRandom(0,10);
    const oper = operationRandom(0,1);
    if(first > second) return innerCircle(fO, op, sO);
    fO.innerHTML = first;
    sO.innerHTML = second;
    op.innerHTML = oper; 
}
 




  createCircle();





 buttonPad.addEventListener('click', updateDisplay);
 window.addEventListener('keydown', updateDisplayWithKeyboard);
 window.addEventListener('keyup', activateButtons)
//  mainAudio.play();
 


