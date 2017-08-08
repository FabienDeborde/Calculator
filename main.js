$(document).ready(function() {

  //Define the main variables
  var controlButton = $('.control-button');
  var resultContainer = $('#result-container');
  var resetButton = $('#reset-container');
  var operatorButtons = $('.operator');
  var numberButtons = $('.number');
  var equalButton = $('.equal');

  // CalcState will store the current state of the calculator (operation, numbers and result)
  // and also the main methods to update, reset and calculate
  var calcState = {
    init: true,
    currentResult: 0,
    previousNumber: 0,
    currentNumber: [0],
    currentOperation: '',
    // Simple function to update the result on screen
    updateResult: function(number) {
      resultContainer.text(number);
    },
    // Reset the whole Calculator
    reset: function() {
      calcState.currentResult = 0;
      calcState.currentNumber = [0];
      calcState.currentOperation = '';
      calcState.updateResult(calcState.currentNumber);
      resultContainer.removeClass('error');
    },
    // Transform the currentNumber array into a usable number
    arrayToNumber: function(array){
      return Number(array.join(''));
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
        return a / b;
      },
      '*': function(a, b) {
        return a * b;
      }
    },
    handleCalcul: function(currentNumber, currentResult, currentOperation, previousNumber) {
      // If it's an impossible division, display error message
      if (currentNumber === 0 && currentOperation === '/' && !calcState.init) {
        calcState.updateResult('You cannot divide by 0.');
        resultContainer.addClass('error');
      } else {
        //Else, do the calculation
        // If it's the first operation, just store the operator
        if (calcState.init) {
          calcState.currentOperation = currentOperation;
          calcState.currentResult = currentNumber;
        } else if (calcState.currentOperation === '') {
          calcState.previousNumber = currentNumber;
          calcState.currentOperation = currentOperation;
          var newNumber = calcState.calcul[calcState.currentOperation](currentResult, currentNumber);

          calcState.currentResult = newNumber;
        } else {
          calcState.previousNumber = currentNumber;
          var newNumber = calcState.calcul[calcState.currentOperation](currentResult, currentNumber);

          calcState.currentResult = newNumber;
          calcState.currentOperation = currentOperation;
        }
        calcState.currentNumber = [0];
        calcState.updateResult(calcState.currentResult);
      }
    }
  }

  // Reset button click event hanlder
  resetButton.on('click', function(){
    calcState.reset();
  })

  // Numbers button click event hanlder
  numberButtons.on('click', function(){
    resultContainer.removeClass('error');
    var clickedNumber = this.dataset.value;
    calcState.currentNumber.push(clickedNumber);
    var currentNumber = calcState.arrayToNumber(calcState.currentNumber);
    // Will display the . before the next number is entered
    // (as the Number function doesn't return the . until a decimal is found)
    if (this.dataset.value === '.') {
      calcState.updateResult(currentNumber + '.');
    } else {
      calcState.updateResult(currentNumber);
    }
    if (calcState.currentOperation !== '') {
      calcState.init = false;
    }
  })

  // Operators button click event hanlder
  operatorButtons.on('click', function(){
    var currentNumber = calcState.arrayToNumber(calcState.currentNumber);
    var currentResult = calcState.currentResult;
    var currentOperation = this.dataset.value;
    var previousNumber = calcState.previousNumber;

    calcState.handleCalcul(currentNumber, currentResult, currentOperation, previousNumber)

  })

  // Equal sign button click event hanlder
  equalButton.on('click', function(){
    resultContainer.removeClass('error');
    var currentNumber = calcState.arrayToNumber(calcState.currentNumber);
    var previousNumber = calcState.previousNumber;
    var currentResult = calcState.currentResult;
    if (currentNumber === 0 && currentResult !== 0) {
      calcState.previousNumber = currentResult;
      // do nothing
    } else if (calcState.currentOperation !== '') {
      // do the calculation
      var newNumber = calcState.calcul[calcState.currentOperation](currentResult, currentNumber);
      calcState.previousNumber = calcState.currentResult;
      calcState.currentResult = newNumber;
    } else {
      // else update the result with the current number
      calcState.previousNumber = calcState.currentResult;
      calcState.currentResult = currentNumber;
    }
    // then reset the current number and update the result on screen with the current result
    calcState.currentNumber = [0];
    calcState.updateResult(calcState.currentResult);
    calcState.currentOperation = '';
  })

  // Debug function
  $('.control-button').on('click', function(){
    console.log(calcState.currentResult, calcState.currentNumber, calcState.previousNumber, calcState.currentOperation);
  })
})
