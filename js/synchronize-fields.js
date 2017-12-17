'use strict';

(function () {

  window.synchronizeFields = function (field1, field2, data1, data2, cb) {
    field1.addEventListener('change', function () {
      var indexValue = data1.indexOf(field1.value);
      var syncValue = data2[indexValue];
      if (typeof syncValue === 'object') {
        cb(field2, window.utils.getRandomElement(syncValue));
      } else {
        cb(field2, syncValue);
      }
    });
  };
})();
