const gameContainer = document.querySelector('.game--container');                       // общее окно игры
const fullButton = document.querySelector('.full--button')                              // кнопка увеличения размера экрана
const gamePlace = document.querySelector('.game--place');                               // игровое окно
const wave = document.querySelector('.wave');                                           // волна
const displayValue = document.querySelector('.display--input');                         // дисплей
const buttonPad = document.querySelector('.button-container');                          // контейнер со всеми клавишами 
const buttons = document.querySelectorAll('.grid');                                     // все клавиши вместе
const scoreBoard = document.querySelector('.score--num');                               // окно Score
const mainAudio = document.querySelector('.main--theme');                               // фоновая музыка
const dropSound = document.querySelector('.drop--sound');                               // звук падения капли в воду
const correctSound = document.querySelector('.right--sound');                           // звук при правильном ответе
const failSound = document.querySelector('.fail--sound');                               // звук при неправильном ответе
const failBoarder = document.querySelector('.fail--text');                              // всплывающее уведомление об минусе очков при неправильном ответе
const statsBoard = document.querySelector('.game--stats');                              // окно статистики
const scorePoins = document.querySelector('.score--point');                             // значение Score в окне статистики
const accuracyPoint = document.querySelector('.accuracy');                              // значение процента правильных ответов в окне статистики
const solvePoint = document.querySelector('.solve');                                    // значение количества правильных ответом в окне статистики
const perMinutePoint = document.querySelector('.per--minute');                          // значение количества правильных ответов в минуту в окне статистики
const soundButton = document.querySelector('.sound--button');                           // кнопка музыки
const opArr = ['+','-','*','/'];                                                        // массив операторов
let gameOver = false;                                                                   // флаг показывающий окончена игра или нет
let gameItaration = 0;                                                                  // начальное количество капель, попавших в воду (будет увеличиваться и влиять на флаг gameOver)
let score = 0;                                                                          // начальное количество очков Score                                          
let scorePrice = 10;                                                                    // количество начисляемых очков за первый правильный ответ (за каждый последующий правильный будет увеличиваться, а за не правильный уменьшаться)
let animationTime = 9000;                                                               // начальная длительность анимации падения (будет уменьшаться, усложняя игру)
let createTime = 5000;                                                                  // начальное время создания капель (будет уменьшаться, усложняя игру)
let gameOverCount = 3;                                                                  // количество попаданий капель в воду для окончания игры
let lvOperand = 10;                                                                     // начальный диапазон операнд (будет увеличиваться, усложняя игру)
let lvOperation = 0;                                                                    // начальный индекс массива операторов (будет увеличиваться до 3, добавляя новые операторы и усложняя игру)
let correctAnswers = 0;                                                                 // начальное количество правильных ответов
let countDrops = 0;                                                                     // начальное количество cозданных капель



function useEnter(){                                                                    // функция нажатия на клавишу Enter
    const drop = document.querySelectorAll('.circle');
    if(!displayValue.value) return;                                                     // если дисплей пуст, ничего не происходит
            for(let one of drop){                                                       
                 if(eval(one.textContent) === +displayValue.value){                     // перебираем все капли, находящиеся в момент нажатия enter на игровом поле и сравниваем значение на дисплее с результатом выражения внутри капли
                correctAnswers++;                                                       
                correctSound.currentTime = 0;                                           // сбрасываем на начало звук правильного ответа и включаем его
                correctSound.play();
                score += scorePrice = scorePrice < 10 ? 10 : scorePrice;                // добавляем к Score текущее значение ScorePrice
                scorePrice++;                                                           // увеличиваем ScorePrice
                gamePlace.removeChild(one);                                             // удаляем с игрового поля решенную каплю
                break;  
            } else { 
                if(one !== drop[drop.length-1]) continue;                               // если ответ неправильный, то проверяем чтобы среди всех капель на игровом поле небыло правильного выражения внутри
                    failSound.currentTime = 0;
                    failSound.play();                                                   // сбрасываем на начало звук неправильного ответа и включаем его
                    failBoarder.innerHTML = -(scorePrice < 10 ? 10 : scorePrice);       // отображаем в всплывающем окне количество отнятых очков от Score
                    failBoarder.classList.add('open');                                  // добавляем этому окну класс показывающий его
                    setTimeout(() => {                                                  // через указанное время удаляем и возвращаем этому окну opacity 0
                            failBoarder.classList.remove('open');
                    }, 500);
                    score = score - scorePrice <= 0 ? 0 : score - scorePrice;           // отнимаем от Score текущее значение ScorePrice
            } 
    }
        displayValue.value = '';                                                        // обнуляем дисплей
        scoreBoard.textContent = score;                                                 // отображаем текущее количество очков в Score
}


function activateButtons(e){                                                            // подсвечивание кнопок при вводе с клавиатуры
    buttons.forEach(but => {
        if(but.dataset.num === e.key || but.dataset.but === e.key){
            but.classList.toggle('activate');
        }
    });
}


function updateDisplay(e){
    if(displayValue.value.length < 3 && e.target.dataset.num) {                         // передача значения кнопок на дисплей при вводе мышкой
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


function updateDisplayWithKeyboard(e){                                                // передача значения кнопок на дисплей при вводе с клавиатуры  
    if(e.location !== 3 ) return;                                                     // проверяем действительно ли нажата кнопка поля numpad
    switch(e.key){
        case '/': 
        case '*':            
        case '-': return;
        case '+': displayValue.value = '';
        break;
        case '.': displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
        break;
        case 'Enter': 
        useEnter(); 
        break;
        default: 
        if(displayValue.value.length < 3) displayValue.value += e.key;     
    }
    activateButtons(e);
}


function createDrop(){                                                                          // функция создания капель
    const circle = document.createElement('div');                                               // создаем элементы div
    const firstOperand = document.createElement('span');                                        
    const secondOperand = document.createElement('span');                                       // создаем элементы span
    const operation = document.createElement('span');
    circle.className = 'circle';                                                                // добавляем классы к созданным элементам
    operation.className = 'operation';
    circle.style.left = randomPosition();                                                       // добавляем случайную позицию появления капель
    circle.append(firstOperand, operation, secondOperand);                                      
    innerCircle(firstOperand, operation, secondOperand);                                        // заполняем каплю случайным содержимым и добавляем на игровое поле
    gamePlace.append(circle);                                                                   
    animate(circle, animationTime);                                                             // добавляем каждой капле анимацию падения
    setTimeout(() => {                                                                          // определяем повторение создания капель через определенное время
        if(gameOver) return;                                                                    // если флаг gameOver true прекращаем создание капель
        createDrop();                                                                           // если флаг false вызываем ту же функцию
        countDrops++                                                                            // увеличиваем количество созданных капель
        createTime = createTime<1020?1000:createTime-20;                                                                       // уменьшаем время создания капель
        lvOperand++;                                                                            // увеличиваем диапазон используемых операнд
        animationTime -= 30;                                                                    // уменьшаем время падения капли
        lvOperation = score>400?3:score>200?2:score>50?1:0;                                     // увеличиваем индекс массива операторов. добавляя новые, основываясь на количестве очков в Score
    }, createTime);
}


function randomPosition(min = 0, max = 85){                                                                     // определение случайной позиции капли
    return Math.floor(Math.random() * (max - min) + min) + '%';
}


function findHeightWave(){                                                                                      // определения высоты воды
    return gamePlace.offsetHeight - wave.offsetHeight;
}


function animate(circle, time){                                                                                 // функция, добавляющая капле анимацию keyframes
    circle.animate([ { top: 0 },                                                                    
        { top: `${findHeightWave() - circle.offsetHeight}px`} ],
      time).finished
        .then(()=> {
          try{                                                                                                  // .finished возвращает промис и используем .then и try-catch, т.к. если элемент удаляется, а анимация не закончилась, то в консоле било ошибку
            gamePlace.removeChild(circle);                                                                      // после окончания анимации, а именно падения капли в воду, удаляем её
            gameItaration++;                                                                                    // увеличиваем количество капель, упавших в воду
            wave.style.height = `${wave.offsetHeight + 20}px`                                                   // повышаем уровень воды
            dropSound.play();                                                                                   // включаем звук падения капли
            if(gameItaration >= gameOverCount) {                                                                // сравниваем количество попаданий капель в воду необходимых для окончания игры и количество капель, попавших в воду
                showGameOver();                                                                                 // если игра закончена появляется окно статистики        
                gameOver = !gameOver;                                                                           // переключаем флаг gemeOver
                document.querySelectorAll('.circle').forEach(drop => gamePlace.removeChild(drop))               // находим все капли на игровом поле в момент окончания игры и очищаем игровое поле
            }; 
          } catch {                                                                                             // если ошибка, выходим
              return;
          }      
    });         
}

function showGameOver(){                                                                                        // функция показа окна статистики при конце игры
    statsBoard.classList.add('game--stats--visible');
    scorePoins.innerHTML = score;
    accuracyPoint.innerHTML = `${Math.ceil(correctAnswers*100/countDrops)}%`;
    solvePoint.innerHTML = correctAnswers;
    perMinutePoint.innerHTML = Math.round(correctAnswers/(performance.now()/1000/60))
}


function operandRandom(min = 0, max = 100){                                                                     // определение случайных операнд
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function operationRandom(min = 0, max = 3){                                                                     // определение случайного оператора
    return opArr[Math.floor(min + Math.random() * (max + 1 - min))];
}


function innerCircle(fO, op, sO){                                                                               // функция заполнения капли случайным содержимым
    const oper = operationRandom(0,lvOperation);
    const first = operandRandom(0,lvOperand);
    const second = operandRandom(0,lvOperand);
    if((first < second && oper === '*') || (first < second && oper === '-') || (first%second !== 0 && oper === '/') || (first/second === 0 && oper === '/') || first === second || (oper === '*' && second > 10)) return innerCircle(fO, op, sO); // проводим проверку на деление на ноль и ограничиваем сложность математических выражений
    fO.innerHTML = first;
    sO.innerHTML = second;
    op.innerHTML = oper; 
}

 
function fullScreen(){                                                                                          // функция разворачивающая приложение во весь экран
    gameContainer.classList.toggle('full-screen');
    gamePlace.classList.toggle('full--game--place');
}


 buttonPad.addEventListener('click', updateDisplay);                                                            // обработчик события на поле с клавишами (делегирование)
 window.addEventListener('keydown', updateDisplayWithKeyboard);                                                 // обработчик события нажатия на клавиши клавиатуры
 window.addEventListener('keyup', activateButtons);                                                             // обработчик события поднятия клавиши клавиатуры
 fullButton.addEventListener('click', fullScreen);                                                              
 window.addEventListener('load', ()=> {                                                                         // искусственный клик на кнопку фоновой музыки при загрузке страницы 
    soundButton.click();
    if(localStorage.getItem('full') === 'true') {                                                               // проверяем была ли нажата кнопка "во весь экран" в главном меню
    gameContainer.classList.add('full-screen');
    gamePlace.classList.add('full--game--place');
} else {
    gameContainer.classList.remove('full-screen');
    gamePlace.classList.remove('full--game--place');
}
})
 soundButton.addEventListener('click', () => {                                                                  //обработчик события нажатия на клавишу фоновой музыки
    if(mainAudio.paused) {
        mainAudio.play();
    } else mainAudio.pause();
 })
createDrop();                                                                                                   // запуск
 

 


