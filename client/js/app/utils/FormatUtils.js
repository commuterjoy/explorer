var _ = require('lodash');
var S = require('string');
var moment = require('moment');

function _isWrappedInSingleQuotes(value) {
  return value.substring(0, 1) === "'" && value.substring(value.length - 1) === "'";
}

module.exports = {

  toTitleCase: function(text) {
    return text.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  singularize: function(text) {
    return text.replace(/s+$/, '');
  },

  prettyPrintJSON: function(json) {
    return JSON.stringify(json, undefined, 2);
  },

  coercionTypeForPropertyType: function(type) {
    var coercionTypeMap = {
      'string':   'String',
      'num':      'Number',
      'datetime': 'Datetime',
      'list':     'List',
      'null':     'Null',
      'bool':     'Boolean'
    };
    return coercionTypeMap[type];
  },

  booleanMap: function(value) {
    if (value === null || value === '' ) {
      return '';
    } else if (value === 'false') {
      return 'false';
    } else if (value === 'true') {
      return 'true';
    } else {
      return value ? 'true' : 'false';
    }
  },

  sortItems: function(items, keyFunc) {
    // using a key + mapped indices avoids repeated calls to
    // possibly-slow key functions.
    // keyFunc is assumed to return a unicode string.
    keyFunc = keyFunc || function formatString(str) {
        return str.replace(/[-_ .]/, '').toLowerCase();
    };

    var mapped = items.map(function(el, i) {
      return { index: i, value: keyFunc(el) };
    })

    mapped.sort(function(a, b) {
      return a.value.localeCompare(b.value);
    });

    return mapped.map(function(el){
      return items[el.index];
    });
  },

  formatISOTimeNoTimezone: function(time) {
    return moment(time).format('YYYY-MM-DDTHH:mm:ss.SSS');
  },

  generateRandomId: function(prefix) {
    return (prefix || '') + (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  },

  isValidQueryValue: function(value) {
    if (_.isArray(value)) {
      return value.length > 0;
    } else {
      if (value === false) return true;
      if (value === 0) return true;
      return !_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value);
    }
  },

  parseList: function(value) {
    if (value) {
      var parsedList = S(value).parseCSV();

      parsedList = _.map(parsedList, function(val) {
        if (_isWrappedInSingleQuotes(val)) {
          quotelessVal = val.replace("'", "");
          if (parseFloat(quotelessVal)) {
            val = parseFloat(quotelessVal);
          }
        }
        return val;
      });

      return parsedList;
    } else {
      return '';
    }
  }

};