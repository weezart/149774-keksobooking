'use strict';

var DEFAULT = {
  'titles': [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  'types': ['flat', 'house', 'bungalo'],
  'times': ['12:00', '13:00', '14:00'],
  'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};

var AVATAR_FILE_URL = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var AVATAR_WIDTH = 46;
var AVATAR_HEIGHT = 46;
var AVATAR_HEIGHT_PLUS = 18;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var AFTER_PRICE = '&#x20bd;/ночь';
var NO_GUESTS = 0;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var MIN_COORD_X = 300;
var MAX_COORD_X = 900;
var MIN_COORD_Y = 100;
var MAX_COORD_Y = 500;
var AFTER_COORD = 'px';
var DEFAULT_COORD = '595, 375';

var TYPE_MAP = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
};

var DEFAULT_NAME = 'Эксклюзивный тип жилья';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var random = function () {
  return Math.random() - 0.5;
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomSort = function (arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr[i] = arr[i];
  }
  newArr.sort(random);
  return newArr;
};

var getRandomValues = function (arr) {
  var newArr = getRandomSort(arr);
  newArr.length = getRandomNumber(0, arr.length);
  return newArr;
};

var leftHandZero = function (number) {
  number = number < 10 ? '0' + number : number;
  return number;
};

var dataPin = function (i) {
  var pin = {
    'author': {
      'avatar': AVATAR_FILE_URL + leftHandZero(i + 1) + AVATAR_FILE_TYPE
    },
    'location': {
      'x': getRandomNumber(MIN_COORD_X, MAX_COORD_X) - AVATAR_WIDTH / 2,
      'y': getRandomNumber(MIN_COORD_Y, MAX_COORD_Y) + AVATAR_HEIGHT + AVATAR_HEIGHT_PLUS
    }
  };
  pin.offer = {
    'title': DEFAULT.titles[i],
    'address': pin.location.x + ', ' + pin.location.y,
    'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
    'type': getRandomElement(DEFAULT.types),
    'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
    'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
    'checkin': getRandomElement(DEFAULT.times),
    'checkout': getRandomElement(DEFAULT.times),
    'features': getRandomValues(DEFAULT.features),
    'description': '',
    'photos': []
  };

  return pin;
};

var getPinsInfo = function () {
  pins = [];
  for (var i = 0; i < DEFAULT.titles.length; i++) {
    pins[i] = dataPin(i);
  }
  return pins;
};

var getTimeText = function (checkin, checkout) {
  return 'Заезд после ' + checkin + ', выезд до ' + checkout;
};

var getCountText = function (rooms, guests) {
  return rooms + ' комнаты для ' + guests + ' гостей';
};

var renderFeaturesList = function (features) {
  var featuresFragment = document.createDocumentFragment();

  features.forEach(function (feature) {
    var listItem = document.createElement('li');
    listItem.className = 'feature feature--' + feature;
    featuresFragment.appendChild(listItem);
  });

  return featuresFragment;
};

var renderPin = function (pin) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = pin.location.x + AFTER_COORD;
  pinElement.style.top = pin.location.y + AFTER_COORD;
  pinElement.querySelector('img').src = pin.author.avatar;

  return pinElement;
};

var renderCard = function (pin) {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = pin.offer.title;
  cardElement.querySelector('p small').innerHTML = pin.offer.address;
  cardElement.querySelector('h4').textContent = TYPE_MAP[pin.offer.type] || DEFAULT_NAME;
  cardElement.querySelector('.popup__price').innerHTML =
    pin.offer.price + AFTER_PRICE;
  cardElement.querySelector('p:nth-of-type(3)').textContent =
    getCountText(pin.offer.rooms, pin.offer.guests);
  cardElement.querySelector('p:nth-of-type(4)').textContent =
    getTimeText(pin.offer.checkin, pin.offer.checkout);
  cardElement.querySelector('p:nth-of-type(5)').textContent = pin.offer.description;
  cardElement.querySelector('.popup__features').textContent = '';
  cardElement.querySelector('.popup__features')
      .appendChild(renderFeaturesList(pin.offer.features));
  cardElement.querySelector('img').src = pin.author.avatar;

  return cardElement;
};

var pageActivation = function () {
  var noticeForm = document.querySelector('.notice__form');
  var fieldNoticeForm = noticeForm.querySelectorAll('.notice__form fieldset');
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');

  for (var i = 0; i < fieldNoticeForm.length; i++) {
    fieldNoticeForm[i].disabled = false;
  }

  addPinsAndCards();
};

var addPinsAndCards = function () {
  var pinsFragment = document.createDocumentFragment();
  var cardFragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    mapPin[i] = renderPin(pins[i]);
    mapPopap[i] = renderCard(pins[i]);
    pinsFragment.appendChild(mapPin[i]);
    cardFragment.appendChild(mapPopap[i]);
  }

  mapPins.insertBefore(pinsFragment, mainMapPin);
  map.appendChild(cardFragment);
};


var findPinOrder = function (element) {
  for (var k = 0; k < mapPin.length; k++) {
    if (mapPin[k].classList.contains('map__pin--active')) {
      mapPin[k].classList.remove('map__pin--active');
    }

    if (!mapPopap[k].classList.contains('hidden')) {
      mapPopap[k].classList.add('hidden');
    }

    if ((mapPin[k] === element.parentNode) || (mapPin[k] === element)) {
      currentPinNumber = k;
    }
  }
};

var initHandlers = function () {
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var onPopupCloseEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function () {
    if (currentPinNumber >= 0) {
      mapPin[currentPinNumber].classList.add('map__pin--active');
      mapPopap[currentPinNumber].classList.remove('hidden');
      onPopupClickClose();
    }
  };

  var closePopup = function () {
    if (currentPinNumber >= 0) {
      mapPin[currentPinNumber].classList.remove('map__pin--active');
      mapPopap[currentPinNumber].classList.add('hidden');
      currentPinNumber = -1;
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var onPopupClickClose = function () {
    document.addEventListener('keydown', onPopupEscPress);

    var popupClose = mapPopap[currentPinNumber].querySelector('.popup__close');
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
    popupClose.addEventListener('click', function () {
      closePopup();
    });
  };

  mainMapPin.addEventListener('mouseup', function () {
    pageActivation();

    mapPins.addEventListener('click', function (evt) {
      findPinOrder(evt.target);
      openPopup();
    });

    mapPins.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        findPinOrder(evt.target);
        openPopup();
      }
    });
  });
};

var formHandlers = function () {
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
  var inputAnnounceAdress = document.querySelector('#address');
  inputAnnounceAdress.value = DEFAULT_COORD;
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
          getRandomNumber(MIN_GUESTS, Number(inputAnnounceRoomNumber.value) + 1);
    } else {
      inputAnnounceCapacity.value = NO_GUESTS;
    }
  });
};

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mainMapPin = document.querySelector('.map__pin--main');

var currentPinNumber = 0;
var mapPin = [];
var mapPopap = [];
var pins = getPinsInfo();
initHandlers();
formHandlers();
