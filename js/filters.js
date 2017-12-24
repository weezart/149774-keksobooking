'use strict';

(function () {
  var DEFAULT_VALUE = 'any';
  var PRICE_MIDDLE = 10000;
  var PRICE_HIGH = 50000;

  var mapFilters = document.querySelector('.map__filters');
  var mapType = mapFilters.querySelector('#housing-type');
  var mapPrice = mapFilters.querySelector('#housing-price');
  var mapRooms = mapFilters.querySelector('#housing-rooms');
  var mapGuests = mapFilters.querySelector('#housing-guests');

  var filterByType = function (type) {
    window.filters.data = window.filters.data
        .filter(function (it) {
          return it.offer.type === type;
        });
  };

  var filterByPrice = function (price) {
    window.filters.data = window.filters.data
        .filter(function (it) {
          if (price === 'middle') {
            return it.offer.price <= PRICE_HIGH &&
              it.offer.price >= PRICE_MIDDLE;
          } else if (price === 'low') {
            return it.offer.price < PRICE_MIDDLE;
          } else {
            return it.offer.price > PRICE_HIGH;
          }
        });
  };

  var filterByRooms = function (rooms) {
    window.filters.data = window.filters.data
        .filter(function (it) {
          return it.offer.rooms === rooms;
        });
  };

  var filterByGuests = function (guests) {
    window.filters.data = window.filters.data
        .filter(function (it) {
          return it.offer.guests === guests;
        });
  };

  var filterByFeatures = function () {
    var mapFeatures = mapFilters.querySelectorAll('[name=features]:checked');
    mapFeatures.forEach(function (feature) {
      window.filters.data = window.filters.data
          .filter(function (it) {
            return it.offer.features.indexOf(feature.value) !== -1;
          });
    });
  };

  window.filters = {
    data: [],
    use: function () {
      window.filters.data = window.map.data.slice();
      if (mapType.value !== DEFAULT_VALUE) {
        filterByType(mapType.value);
      }
      if (mapPrice.value !== DEFAULT_VALUE) {
        filterByPrice(mapPrice.value);
      }
      if (mapRooms.value !== DEFAULT_VALUE) {
        filterByRooms(+mapRooms.value);
      }
      if (mapGuests.value !== DEFAULT_VALUE) {
        filterByGuests(+mapGuests.value);
      }
      filterByFeatures();
    },
    update: function () {
      window.filters.use();
      window.map.clean();
      window.map.fill(window.filters.data);
    },
    init: function () {
      mapFilters.addEventListener('change', function () {
        window.filters.update();
      });
    }
  };

})();
