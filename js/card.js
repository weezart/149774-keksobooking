'use strict';

(function () {
  var map = document.querySelector('.map');

  var TYPE_MAP = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
  };
  var DEFAULT_NAME = 'Дворец';
  var AFTER_PRICE = '&#x20bd;/ночь';

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

  var renderCard = function (pin) {
    var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('h3').textContent = pin.offer.title;
    cardElement.querySelector('p small').innerHTML = pin.offer.address;
    cardElement.querySelector('h4').textContent = TYPE_MAP[pin.offer.type] ||
      DEFAULT_NAME;
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

  window.cards = {
    add: function (mapPopap) {
      var pins = window.data.getPinsInfo();
      var cardFragment = document.createDocumentFragment();
      for (var i = 0; i < pins.length; i++) {
        mapPopap[i] = renderCard(pins[i]);
        cardFragment.appendChild(mapPopap[i]);
      }

      map.appendChild(cardFragment);
    }
  };

})();
