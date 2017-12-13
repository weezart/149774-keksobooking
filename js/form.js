'use strict';

(function () {

  var NO_GUESTS = 0;
  var MIN_GUESTS = 1;
  var DEFAULT_COORD = '595, 375';
  var inputAnnounceAdress = document.querySelector('#address');

  var formHandlersInit = function () {
    inputTitleValidation();
    inputAddressAction();
    inputPriceType();
    inputTimeHandlers();
    inputGuestRooms();
  };

  var inputTitleValidation = function () {
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

  var inputAddressAction = function () {
    inputAnnounceAdress.value = DEFAULT_COORD;
  };

  window.form = {
    setAddress: function (adress) {
      inputAnnounceAdress.value = adress;
    }
  };

  var inputPriceType = function () {
    var inputAnnouncePrice = document.querySelector('#price');
    var inputAnnounceType = document.querySelector('#type');
    var PRICE_MAP = {
      'bungalo': 0,
      'flat': 1000,
      'house': 5000,
      'palace': 10000
    };

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

    inputAnnounceType.value = 'bungalo';
    inputAnnounceType.addEventListener('change', function () {
      inputAnnouncePrice.min = PRICE_MAP[inputAnnounceType.value];
    });
  };

  var inputTimeHandlers = function () {
    var inputAnnounceTimeIn = document.querySelector('#timein');
    var inputAnnounceTimeOut = document.querySelector('#timeout');
    inputAnnounceTimeIn.addEventListener('change', function () {
      inputAnnounceTimeOut.value = inputAnnounceTimeIn.value;
    });

    inputAnnounceTimeOut.addEventListener('change', function () {
      inputAnnounceTimeIn.value = inputAnnounceTimeOut.value;
    });
  };

  var inputGuestRooms = function () {
    var inputAnnounceRoomNumber = document.querySelector('#room_number');
    var inputAnnounceCapacity = document.querySelector('#capacity');


    inputAnnounceCapacity.value = MIN_GUESTS;

    inputAnnounceRoomNumber.addEventListener('change', function () {
      if (inputAnnounceRoomNumber.value !== '100') {
        inputAnnounceCapacity.value =
            window.utils.getRandomNumber(MIN_GUESTS, Number(inputAnnounceRoomNumber.value) + 1);
      } else {
        inputAnnounceCapacity.value = NO_GUESTS;
      }
    });
  };

  formHandlersInit();
})();
