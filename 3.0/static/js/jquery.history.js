(function($, window, document, undefined) {
  $.fn.history = function(options) {
    var opts = $.extend({}, $.fn.history.defaults, options)
      , historyAvailable = 'history' in window && 'pushState' in window.history;

    if (historyAvailable) {
      window.onpopstate = function(event) {
        var state = event.state
          , href, node;

        if (state && 'history' in state) {
          href = state.history.href;
          node = state.history.node;
        }

        if ($.isFunction(opts.callback)) opts.callback.apply(document, [ href ]);
      };

      $(this.selector).live('click', function(event) {
        var $link = $(this)
          , state = {};

        state.history = { href: $link.attr('href'), text: $link.text() };

        window.history.pushState(state, state.history.text, state.history.href);

        if ($.isFunction(opts.callback)) opts.callback.apply(document, [ state.history.href ]);

        event.preventDefault();
      });
    }

    return this;
  };

  $.fn.history.defaults = {};
})(jQuery, window, document, undefined);
