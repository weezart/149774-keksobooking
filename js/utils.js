'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  window.utils = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    random: function () {
      return Math.random() - 0.5;
    },
    getRandomElement: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    leftHandZero: function (number) {
      number = number < 10 ? '0' + number : number;
      return number;
    }
  };

  window.utils.getRandomLength = function (arr) {
    return window.utils.getRandomNumber(0, arr.length);
  };

  window.utils.getRandomSort = function (arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      newArr[i] = arr[i];
    }
    newArr.sort(window.utils.random);
    return newArr;
  };

  window.utils.getRandomValues = function (arr) {
    var newArr = window.utils.getRandomSort(arr);
    newArr.splice(0, window.utils.getRandomLength(arr));
    return newArr;
  };
})();
