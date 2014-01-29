/*!
 * jquery.tagcloud.js
 * A Simple Tag Cloud Plugin for JQuery
 *
 * https://github.com/addywaddy/jquery.tagcloud.js
 * created by Adam Groves
 */
(function() {

  /* global jQuery */
  "use strict";

  var $ = this.jQuery;

  var compareWeights = function(a, b)
  {
    return a - b;
  };

  // Converts hex to an RGB array
  var toRGB = function(code) {
    if (code.length === 4) {
      code = code.replace(/(\w)(\w)(\w)/gi, "\$1\$1\$2\$2\$3\$3");
    }
    var hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  };

  // Converts an RGB array to hex
  var toHex = function(ary) {
    return "#" + jQuery.map(ary, function(i) {
      var hex =  i.toString(16);
      hex = (hex.length === 1) ? "0" + hex : hex;
      return hex;
    }).join("");
  };

  var colorIncrement = function(color, range) {
    return jQuery.map(toRGB(color.end), function(n, i) {
      return (n - toRGB(color.start)[i])/range;
    });
  };

  var tagColor = function(color, increment, weighting) {
    var rgb = jQuery.map(toRGB(color.start), function(n, i) {
      var ref = Math.round(n + (increment[i] * weighting));
      if (ref > 255) {
        ref = 255;
      } else {
        if (ref < 0) {
          ref = 0;
        }
      }
      return ref;
    });
    return toHex(rgb);
  };
  $.fn.extend({
    tagcloud: function(options) {
        var opts = $.extend({}, $.fn.tagcloud.defaults, options);
        var tagWeights = this.map(function(){
          return ((opts.weightselector == "rel") && $( this ).attr('rel') ||
                  (opts.weightselector == "data") && $( this ).data('weight'));
        });
        tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
        var lowest = tagWeights[0];
        var highest = tagWeights.pop();
        var range = highest - lowest;
        if(range === 0) { range = 1; }
        // Sizes
        var fontIncr, colorIncr, sizes = {};
        if (opts.size) {
          fontIncr = (opts.size.end - opts.size.start) / range;
          for (var i = opts.size.start; i < opts.size.end; i++) {
            sizes[i] = range * i;
          }
          
        }
        // Colors
        if (opts.color) {
          colorIncr = colorIncrement (opts.color, range);
        }

        return this.each(function() {
          var calcWeight = function(weight) {
            for(var i in sizes) {
                if (sizes[i] < i * weight) return i;
            }
          };
          var weighting = ((opts.weightselector == "rel") && $( this ).attr('rel') ||
                          (opts.weightselector == "data") && $( this ).data('weight')) - lowest;

          if (opts.size) {
            var _size = opts.size.start + (weighting * fontIncr);
            // check the _size:
            _size = (_size > opts.size.end) ? opts.size.end : (_size < opts.size.start) ? opts.size.start : _size;
            $(this).css({"font-size": _size+opts.size.unit});
          }
          if (opts.color) {
            $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
          }
        });

    }
  });

  $.fn.tagcloud.defaults = {
    size: {start: 14, end: 18, unit: "pt"},
    weightselector: "data"
  };
}).call(this);
