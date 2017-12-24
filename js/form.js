'use strict';

(function () {

  var DEFAULT_COORD = '600, 423';
  var TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var MIN_PRICES = ['0', '1000', '5000', '10000'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var ROOMS = ['1', '2', '3', '100'];
  var CAPACITIES = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];
  var CAPACITIES_INFO = {
    '0': 'не для гостей',
    '1': 'для 1 гостя',
    '2': 'для 2 гостей',
    '3': 'для 3 гостей'
  };

  var inputAnnounceAdress = document.querySelector('#address');

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var syncChoise = function (element, choise) {
    element.textContent = '';
    var elementFragment = document.createDocumentFragment();

    choise.forEach(function (option) {
      var choiseItem = document.createElement('option');
      choiseItem.value = option;
      choiseItem.textContent = CAPACITIES_INFO[option];
      elementFragment.appendChild(choiseItem);
    });

    element.appendChild(elementFragment);
  };

  var formHandlersInit = function () {
    window.form.setAddress(DEFAULT_COORD);
    validateTitle();
    validatePrice();
    syncTime();
    syncGuests();
    sendForm();
  };

  var sendForm = function () {
    var form = document.querySelector('.notice__form');

    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      window.backend.save(new FormData(form), function () {
        form.reset();
      }, window.backend.onError);
    });
  };

  var validateTitle = function () {
    var inputAnnounceTitle = document.querySelector('#title');
    inputAnnounceTitle.addEventListener('input', function (evt) {
      var target = evt.target;
      if (target.value.length < target.minLength) {
        target.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
      } else if (target.value.length > target.maxLength) {
        target.setCustomValidity('Заголовок не должен превышать 100 символов');
      } else if (target.value.length === 0) {
        target.setCustomValidity('Обязательное поле');
      } else {
        target.setCustomValidity('');
      }
    });
  };

  window.form = {
    setAddress: function (adress) {
      inputAnnounceAdress.value = adress;
    }
  };

  var validatePrice = function () {
    var inputAnnouncePrice = document.querySelector('#price');
    var inputAnnounceType = document.querySelector('#type');

    inputAnnouncePrice.addEventListener('invalid', function () {
      if (inputAnnouncePrice.validity.rangeUnderflow) {
        inputAnnouncePrice.setCustomValidity('Минимальная цена ' + inputAnnouncePrice.min);
      } else if (inputAnnouncePrice.validity.rangeOverflow) {
        inputAnnouncePrice.setCustomValidity('Цена не должна превышать 1000000 руб.');
      } else if (inputAnnouncePrice.validity.valueMissing) {
        inputAnnouncePrice.setCustomValidity('Обязательное поле');
      } else {
        inputAnnouncePrice.setCustomValidity('');
      }
    });

    inputAnnouncePrice.addEventListener('input', function (evt) {
      var target = evt.target;
      var targetValue = Number(target.value);
      var minValue = Number(target.min);
      var maxValue = Number(target.max);

      if (targetValue < minValue) {
        target.setCustomValidity('Минимальная цена ' + target.min);
      } else if (targetValue > maxValue) {
        target.setCustomValidity('Цена не должна превышать 1000000 руб.');
      } else if (target.value === '') {
        target.setCustomValidity('Обязательное поле');
      } else {
        target.setCustomValidity('');
      }
    });

    inputAnnounceType.value = TYPES[0];
    window.synchronizeFields(inputAnnounceType, inputAnnouncePrice,
        TYPES, MIN_PRICES, syncValueWithMin);
  };

  var syncTime = function () {
    var inputAnnounceTimeIn = document.querySelector('#timein');
    var inputAnnounceTimeOut = document.querySelector('#timeout');

    window.synchronizeFields(inputAnnounceTimeIn, inputAnnounceTimeOut,
        TIMES, TIMES, syncValues);
    window.synchronizeFields(inputAnnounceTimeOut, inputAnnounceTimeIn,
        TIMES, TIMES, syncValues);
  };

  var syncGuests = function () {
    var inputAnnounceRoomNumber = document.querySelector('#room_number');
    var inputAnnounceCapacity = document.querySelector('#capacity');
    syncChoise(inputAnnounceCapacity, ['1']);
    window.synchronizeFields(inputAnnounceRoomNumber, inputAnnounceCapacity,
        ROOMS, CAPACITIES, syncChoise);
  };

  formHandlersInit();
})();
