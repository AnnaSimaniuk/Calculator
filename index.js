'use strict';

const display = document.querySelector('.display-input');
const keys = document.querySelector('.keys');
const displayInput = document.querySelector('.display-input');
let optionsButtonPress = false;
let operator;
let firstNumber;
let secondNumber;
let result;
let saveNumber;
let countSaveNumber = 0;
let negativeNumber = false;

const radDegWrapper = document.querySelector('.rad_deg_container');
let previousDisplayValue;
let previousOperationPreset;

displayInput.insertAdjacentHTML('beforebegin', '<span class="save_number">m</span>');

function matchOperations(firstNumber, secondNumber, operator) {
    const operation = {
        '+': firstNumber + secondNumber,
        '-': firstNumber - secondNumber,
        '*': firstNumber * secondNumber,
        '/': firstNumber / secondNumber,
        'x': Math.pow(firstNumber, secondNumber),
    }
    return String(operation[operator]);
}

function otherOperations(display, operator) {
    let negativeConditions = (operation) => {
        console.log(display.value)
        if (display.value < 0 || isNaN(display.value)) {
            return 'Error'
        } else {
            return operation
        }
    }

    const operation = {
        '%': display.value / 100,
        'x': display.value * display.value,
        '√': negativeConditions(Math.sqrt(display.value)),
        'e': Math.E,
        'π': Math.PI,
        'sin': Math.sin(display.value),
        'cos': Math.cos(display.value),
        'tan': Math.tan(display.value),
        'log': negativeConditions(Math.log(display.value)),
    }
    return String(operation[operator])
}

keys.addEventListener('click', e => {
    if (e.target.classList.contains('button')) {
        if (e.target.classList.contains('black') && e.target.value !== 'C') numberPressed(e.target.value);

        if (e.target.value === 'C') nullValue();

        if (e.target.classList.contains('pink')) symbolPressed(e.target.value);

        if (e.target.classList.contains('orange') && firstNumber && display.value && operator) equalPressed();

        if (e.target.value === 'm+' || e.target.value === 'm-') {
            saveNumber = display.value;
            document.querySelector('.save_number').style.display = 'inline-block';
        }

        if (e.target.value === 'mrc') {
            if (countSaveNumber === 0) {
                display.value = saveNumber;
                countSaveNumber++
            } else {
                saveNumber = '';
                countSaveNumber = 0;
                document.querySelector('.save_number').style.display = 'none';
            }
        }

        if (display.value && e.target.classList.contains('green') || e.target.classList.contains('brown')) {
            previousDisplayValue = display.value
            previousOperationPreset = e.target.value

            display.value = otherOperations(display, e.target.value)

            if (!secondNumber) {
                firstNumber = display.value
            } else {
                secondNumber = display.value
            }
        }

        if (display.value && e.target.classList.contains('brown')) {
            radDegWrapper.style.display = 'inline-block';
            radDegWrapper.children[0].classList.add('bold');
            radDegWrapper.children[1].classList.remove('bold');
        } else {
            radDegWrapper.style.display = 'none';
        }

        if (!display.value && e.target.value === '-') {
            negativeNumber = true;
            optionsButtonPress = false;
            display.value = '-';
        }
    }
})

radDegWrapper.addEventListener('click', e => {
    Array.from(radDegWrapper.children).forEach(el => el.classList.remove('bold'));

    if (e.target.classList.contains('deg') && !e.target.classList.contains('bold')) {
        display.value = getDeg(previousDisplayValue)
        e.target.classList.add('bold');
    }

    if (e.target.classList.contains('rad') && !e.target.classList.contains('bold')) {
        display.value = Math[previousOperationPreset](previousDisplayValue);
        e.target.classList.add('bold');
    }
})

function getDeg(deg) {
    const rad = deg * Math.PI / 180;
    return Math[previousOperationPreset](rad);
}

function numberPressed(e) {
    if (!!optionsButtonPress) {
        display.value = '';
        secondNumber += e;
        display.value += secondNumber;
    } else {
        firstNumber += e;
        display.value += e;
        if (negativeNumber && display.value.length===2) {
            firstNumber = firstNumber * -1;
        }
    }
}

function nullValue() {
    display.value = '';
    firstNumber = '';
    secondNumber = '';
    operator = '';
    result = '';
    optionsButtonPress = false;
}

function symbolPressed(e) {
    if (firstNumber && display.value && operator) {
        result = matchOperations(Number(firstNumber), Number(secondNumber), operator);
        firstNumber = result;
        secondNumber = '';
        display.value = firstNumber;
        operator = e;
        optionsButtonPress = true;
    } else {
        firstNumber = display.value;
        operator = e;
        secondNumber = '';
        optionsButtonPress = true;
    }
}

function equalPressed() {
    result = matchOperations(Number(firstNumber), Number(secondNumber), operator);
    firstNumber = result;
    display.value = result;
    secondNumber = '';
    operator = '';
    optionsButtonPress = true;
}

//keydown
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const symbols = ['+', '-', '/', '*'];

window.addEventListener('keydown', (e) => {
    if (numbers.includes(e.key)) numberPressed(e.key);

    if (symbols.includes(e.key)) symbolPressed(e.key);

    if (e.key === 'Enter' && firstNumber && display.value && operator) equalPressed();

    if (e.key.toLowerCase() === 'c' || e.key === 'Delete') nullValue();
})