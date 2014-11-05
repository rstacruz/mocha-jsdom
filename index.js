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
    if (global.window)
      throw new Error("mocha-jsdom: already a browser environment, or mocha-jsdom invoked twice");

    require('jsdom').env(
      extend(extend({}, options), { done: done }));

    function done (errors, window) {
      if (options.globalize)
        propagateToGlobal(window);
      else
        global.window = window;

      if (options.console)
        window.console = global.console;

      if (errors)
        return next(getError(errors));

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
        if (process.env.JSDOM_VERBOSE) {
          console.warn("[jsdom] Warning: skipping cleanup of global['"+key+"']");
        }
        continue;
      }

      keys.push(key);
      global[key] = window[key];
    }
  }

  /*
   * re-throws jsdom errors
   */

  function getError (errors) {
    var data = errors[0].data;
    var err = data.error;
    err.message = err.message + " [jsdom]";

    // clean up stack trace
    if (err.stack) {
      err.stack = err.stack.split("\n")
      .reduce(function (list, line) {
        if (line.match(/node_modules.+(jsdom|mocha)/))
          return list;
        line = line
          .replace(/file:\/\/.*<script>/g, '<script>')
          .replace(/:undefined:undefined/g, '');
        list.push(line);
        return list;
      }, []).join("\n");
    }

    return err;
  }

};
