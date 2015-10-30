var extend = require('util')._extend
var Path = require('path')

/*
 * store original global keys
 */

var blacklist = Object.keys(global)
blacklist.push('constructor')

/*
 * default config
 */

var defaults = {
  globalize: true,
  console: true,
  useEach: false,
  skipWindowCheck: false,
  html: "<!doctype html><html><head><meta charset='utf-8'></head>" +
    '<body></body></html>'
}

/*
 * simple jsdom integration.
 * You can pass jsdom options in, too:
 *
 *     require('./support/jsdom')({
 *       src: [ jquery ]
 *     })
 */

module.exports = function (_options) {
  var options = extend(extend({}, defaults), _options)

  var keys = []

  var before = options.useEach ? global.beforeEach : global.before
  var after = options.useEach ? global.afterEach : global.after

  /*
   * register jsdom before the entire test suite
   */

  before(function (next) {
    if (global.window && !options.skipWindowCheck) {
      throw new Error(
        'mocha-jsdom: already a browser environment, or mocha-jsdom invoked ' +
        "twice. use 'skipWindowCheck' to disable this check.")
    }

    require('jsdom').env(
      extend(extend({}, options), { done: done }))

    function done (errors, window) {
      if (options.globalize) {
        propagateToGlobal(window)
      } else {
        global.window = window
      }

      if (options.console) {
        window.console = global.console
      }

      var _attrToDataKey = function( val ) {
        var out = val.substr( 5 );
        return out.split( "-" ).map(function( part, inx ){
          if ( !inx ) {
            return part;
          }
          return part.charAt( 0 ).toUpperCase() + part.substr( 1 );
        }).join( "" );
      },
      _datasetProxy = null,
      _getNodeDataAttrs = function( el ){
        var i = 0,
            atts = el.attributes,
            len = atts.length,
            attr,
            _datasetMap = [],
            // represents el.dataset
            proxy = {},
            datakey;
          for ( ; i < len; i++ ){
            attr = atts[ i ].nodeName;
            if ( attr.indexOf( "data-" ) === 0 ) {
              datakey = _attrToDataKey( attr );
              if ( typeof _datasetMap[ datakey ] !== "undefined" ) {
                break;
              }
              _datasetMap[ datakey ] = atts[ i ].nodeValue;
              (function( datakey ){
                // every data-attr found on the element makes a getter and setter
                Object.defineProperty( proxy, datakey, {
                  enumerable: true,
                  configurable: true,
                  get: function() {
                    return  _datasetMap[ datakey ];
                  },
                  set: function ( val ) {
                    _datasetMap[ datakey ] = val;
                    el.setAttribute( attr, val );
                  }
                });
              }( datakey ));
            }
          }
          return proxy;
      };

      Object.defineProperty( global.window.Element.prototype, "dataset", {
        get: function() {
          _datasetProxy = _datasetProxy || _getNodeDataAttrs( this );
          return _datasetProxy;
        }
      });

      if (errors) {
        return next(getError(errors))
      }

      next(null)
    }
  })

  /*
   * undo keys from being propagated to global after the test suite
   */

  after(function () {
    if (options.globalize) {
      keys.forEach(function (key) {
        delete global[key]
      })
    } else {
      delete global.window
    }
  })

  /*
   * propagate keys from `window` to `global`
   */

  function propagateToGlobal (window) {
    for (var key in window) {
      if (!window.hasOwnProperty(key)) continue
      if (~blacklist.indexOf(key)) continue
      if (key in global) {
        if (process.env.JSDOM_VERBOSE) {
          console.warn("[jsdom] Warning: skipping cleanup of global['" + key + "']")
        }
        continue
      }

      keys.push(key)
      global[key] = window[key]
    }
  }

  /*
   * re-throws jsdom errors
   */

  function getError (errors) {
    var data = errors[0].data
    var err = data.error
    err.message = err.message + ' [jsdom]'

    // clean up stack trace
    if (err.stack) {
      err.stack = err.stack.split('\n')
      .reduce(function (list, line) {
        if (line.match(/node_modules.+(jsdom|mocha)/)) {
          return list
        }

        line = line
          .replace(/file:\/\/.*<script>/g, '<script>')
          .replace(/:undefined:undefined/g, '')
        list.push(line)
        return list
      }, []).join('\n')
    }

    return err
  }
}

module.exports.rerequire = rerequire

/**
 * Requires a module via `require()`, but invalidates the cache so it may be
 * called again in the future. Useful for `mocha --watch`.
 *
 *     var rerequire = require('mocha-jsdom').rerequire
 *     var $ = rerequire('jquery')
 */

function rerequire (module) {
  if (module[0] === '.') {
    module = Path.join(Path.dirname(getCaller()), module)
  }

  var oldkeys = Object.keys(require.cache)
  var result = require(module)
  var newkeys = Object.keys(require.cache)
  newkeys.forEach(function (newkey) {
    if (!~oldkeys.indexOf(newkey)) {
      delete require.cache[newkey]
    }
  })
  return result
}

/**
 * Internal: gets the filename of the caller function. The `offset` defines how
 * many hops away it's expected to be from in the stack trace.
 *
 * See: http://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
 */

function getCaller (offset) {
  /* eslint-disable handle-callback-err */
  if (typeof offset !== 'number') offset = 1
  var old = Error.prepareStackTrace
  var err = new Error()
  Error.prepareStackTrace = function (err, stack) { return stack }
  var fname = err.stack[1 + offset].getFileName()
  Error.prepareStackTrace = old
  return fname
}
