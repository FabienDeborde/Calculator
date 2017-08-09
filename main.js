$(document).ready(function() {

  //Define the main variables
  var controlButton = $('.control-button');
  var resultContainer = $('#result-container');
  var resetButton = $('#reset-container');
  var operatorButtons = $('.operator');
  var numberButtons = $('.number');
  var equalButton = $('.equal');
  var minusButton = $('.minus');

  // CalcState will store the current state of the calculator (operation, numbers and result)
  // and also the main methods to update, reset and calculate
  var calcState = {
    init: true,
    decimal: false,
    currentResult: 0,
    previousNumber: null,
    currentNumber: '0',
    currentOperation: '',
    // Simple function to update the result on screen
    updateResult: function(number) {
      resultContainer.text(number);
    },
    // Reset the whole Calculator
    reset: function() {
      calcState.init = true;
      calcState.decimal = false;
      calcState.currentResult = 0;
      calcState.previousNumber = null;
      calcState.currentNumber = '0';
      calcState.currentOperation = '';
      calcState.updateResult(calcState.currentNumber);
      resultContainer.removeClass('error');
    },
    resetCurrent: function() {
      calcState.decimal = false;
      calcState.currentNumber = '0';
    },
    // Basic calcul function
    calcul: {
      '+': function(a, b) {
        return a + b;
      },
      '-': function(a, b) {
        return a - b;
      },
      '/': function(a, b) {
        if (b !== 0) {
          return a / b;
        } else {
          resultContainer.addClass('error');
          return 'You cannot divide by 0.'
        }
      },
      '*': function(a, b) {
        return a * b;
      }
    },
    handleCalcul: function(result, number, operator) {
      return calcState.calcul[operator](result, number);
    }
  }

  // Reset button click event hanlder
  resetButton.on('click', function(){
    calcState.reset();
  })

  // Numbers button click event hanlder
  numberButtons.on('click', function(){
    calcState.previousNumber = Number(calcState.currentNumber);
    var clickedNumber = this.dataset.value;

    if (calcState.currentResult !== 0 && calcState.currentOperation === '') {
      calcState.reset();
    }

    if (calcState.decimal && clickedNumber === '.') {  // If not the first time the decimal button is clicked,
      return null                                      // do nothing
    } else if (!calcState.decimal && clickedNumber === '.') { // If first time clicking the decimal button
      calcState.decimal = true;                               // Set decimal to true
      calcState.currentNumber += clickedNumber;               // Update the number
    } else {
      if (calcState.currentNumber === '0') {                  // If not an decimal number and current number
        calcState.currentNumber = '';                         // start with 0, ignore it
      }
      calcState.currentNumber += clickedNumber;               // Update the number
    }
    calcState.updateResult(calcState.currentNumber);           // Update the result on the screen
  })

  // Operators button click event hanlder
  operatorButtons.on('click', function(){
    var operator = this.dataset.value;
    var currentNumber = Number(calcState.currentNumber);

    if (calcState.currentResult !== 0 && calcState.previousNumber !== null) {
      calcState.init = false;
    }

    if (currentNumber !== 0) {
      if (calcState.init) {
        calcState.currentResult = currentNumber;
      } else {
        if (calcState.currentOperation === '') {
          calcState.currentOperation = operator;
        }
        calcState.currentResult = calcState.handleCalcul(
          calcState.currentResult,
          currentNumber,
          calcState.currentOperation
        );
      }
    }
    calcState.currentOperation = operator;
    calcState.updateResult(calcState.currentResult);
    calcState.resetCurrent();

  })

  // Equal sign button click event hanlder
  equalButton.on('click', function(){
    var currentNumber = Number(calcState.currentNumber);
    var operator = calcState.currentOperation;

    if (currentNumber !== 0 && !operator) {
      calcState.currentResult = currentNumber;
    } else {
      if (operator) {
        var newNumber = calcState.handleCalcul(calcState.currentResult, currentNumber, calcState.currentOperation);
        calcState.currentResult = newNumber;
      }
    }
    calcState.resetCurrent();
    calcState.currentOperation = '';
    calcState.updateResult(calcState.currentResult);
  })

  // Minus sign button click event hanlder
  minusButton.on('click', function(){
    if (calcState.currentNumber === '0' && calcState.currentResult !== 0) {
      calcState.currentResult *= -1;
      calcState.updateResult(calcState.currentResult);
    } else {
      calcState.currentNumber *= -1;
      calcState.updateResult(calcState.currentNumber);
    }
  })

  // Debug function
  $('.control-button').on('click', function(){
    console.log(calcState.currentResult, calcState.currentNumber, calcState.previousNumber, calcState.currentOperation, calcState.init);
  })
})
