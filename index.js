var extend = require('util')._extend;

/*
 * store original global keys
 */

var blacklist = Object.keys(global);
blacklist.push('constructor');

/*
 * default config
 */

var defaults = {
  globalize: true,
  console: true,
  html: "<!doctype html><html><head><meta charset='utf-8'></head>"+
    "<body></body></html>"
};

/*
 * simple jsdom integration.
 * You can pass jsdom options in, too:
 *
 *     require('./support/jsdom')({
 *       src: [ jquery ]
 *     });
 */

module.exports = function (_options) {
  var options = extend(extend({}, defaults), _options);

  var keys = [];

  /*
   * register jsdom before the entire test suite
   */

  global.before(function (next) {
    require('jsdom').env({
      html: options.html,
      url: options.url,
      file: options.file,
      scripts: options.scripts,
      jar: options.jar,
      parsingMode: options.parsingMode,
      document: options.document,
      features: options.features,
      src: options.src,
      done: done
    });

    function done (errors, window) {
      if (options.globalize)
        propagateToGlobal(window);
      else
        global.window = window;

      if (options.console)
        window.console = global.console;

      if (errors)
        return rethrow(errors);

      next(null);
    }
  });

  /*
   * undo keys from being propagated to global after the test suite
   */

  global.after(function () {
    if (options.globalize) {
      keys.forEach(function (key) {
        delete global[key];
      });
    } else {
      delete global.window;
    }
  });

  /*
   * propagate keys from `window` to `global`
   */

  function propagateToGlobal (window) {
    for (var key in window) {
      if (!window.hasOwnProperty(key)) continue;
      if (~blacklist.indexOf(key)) continue;
      if (key in global) {
        console.warn("[jsdom] Warning: skipping global['"+key+"']");
        continue;
      }

      keys.push(key);
      global[key] = window[key];
    }
  }

  /*
   * re-throws jsdom errors
   */

  function rethrow (errors) {
    var data = errors[0].data;
    var err = data.error;
    err.message = err.message + " [jsdom]";
    throw err;
  }

};
