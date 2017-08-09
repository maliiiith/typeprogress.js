(function ($) {
  // Methods
  var methods = {
    /**
     * Plugin initialize method
     * 
     * @param {Object} el jQeury element object
     * @param {Object} options Plugin options
     */
    init: function (el, options) {
      var self = this;

      if (options.progressText) {
        var progressText = $('<div />')
          .text('0/' + options.limit)
          .css({
            'color': options.backgroundColor,
            'text-align': 'right'
          })
          .insertAfter(el);
      }

      if (options.progressBar) {
        // Progress bar
        var progressBar = $('<div />')
          .css({
            'background-color': options.primaryColor,
            'width': '0%',
            'height': options.thickness,
            'transition': 'width 300ms ease-in-out'
          });

        // Progress bar wrapper
        var progressWrapper = $('<div />')
          .css({
            'background-color': options.backgroundColor,
            'width': '100%',
            'height': options.thickness
          })
          .append(progressBar)
          .insertAfter(el);
      }

      // Bind 'keyup paste change' events into input field
      el.bind('keydown paste change', function (e) {
        var characterCount = self.calculateProgress(e, el, options.limit);
        var countPercentage = ((characterCount / options.limit) * 100) + '%';
        if (progressText) {
          progressText.text(characterCount + '/' + options.limit);
        }
        if (progressBar) {
          progressBar.css('width', countPercentage);
        }
      });
    },

    /**
     * Calculate character progress and prevent user from entering text beyond provided text limit
     * 
     * @param {Object} e Event
     * @param {Object} el Input field jQuery object
     * @param {Integer} limit Text limit
     * @returns Remaining characters
     */
    calculateProgress: function (e, el, limit, onChangeCallback) {
      var _currentLength = $(el).val().length;
      var _remaining = limit - _currentLength;

      if (e.type === 'paste') {
        var pastedData = e.originalEvent.clipboardData.getData('text');
        var _pastedRemaining = (limit - (_currentLength + pastedData.length));
        if (_pastedRemaining <= 0) {
          e.preventDefault();
        } else {
          _remaining = _pastedRemaining;
        }
      } else {
        if (_remaining <= 0 && 
          e.originalEvent.keyCode !== 8 && 
          e.originalEvent.keyCode !== 46 && 
          e.originalEvent.keyCode !== 13 && 
          e.originalEvent.keyCode !== 35 && 
          e.originalEvent.keyCode !== 36 && 
          e.originalEvent.keyCode !== 37 && 
          e.originalEvent.keyCode !== 38 && 
          e.originalEvent.keyCode !== 39 && 
          e.originalEvent.keyCode !== 40 && 
          !(e.originalEvent.metaKey || e.originalEvent.ctrlKey)) {
          e.preventDefault();
        }
      }

      if (onChangeCallback) {
        onChangeCallback(e, limit, limit - _remaining);
      }

      return limit - _remaining;
    }
  };
  $.fn.typeProgress = function (options) {
    var self = this;

    // Defaults
    var SETTINGS = $.extend({
      backgroundColor: '#cccccc',
      primaryColor: '#000000',
      thickness: 5,
      limit: 500,
      progressBar: true,
      progressText: true
    }, options);

    methods.init(self, SETTINGS);
  };
}(jQuery));
