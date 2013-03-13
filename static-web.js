;(function($) {

    window.staticWeb = function(options) {
        var defaults = {
            container: document,
            contentSelector: '#content',
            linkSelector: '#menu a',
            pageLoadFail: function($content, url) {
                $content.html('Can\'t load ' + encodeURI(url));
            },
            contentHandler: function(data, url) {
                return data;
            },
            beforePageLoad: function($content, url) {},
            afterPageLoad: function($content, url) {}
        };

        options = $.extend( {}, defaults, options );

        // Get those links ready for action
        prepareLinks(options.container);

        // Make sure page only gets loaded once
        var pageLoaded = false;

        // Load pages when user browse the history
        $(window).bind('popstate', function(event) {
            loadPage(location.hash, false);
            pageLoaded = true;
        });

        // Try loading the page (if not already loaded by popstate)
        setTimeout(function() {
            if (!pageLoaded) {
                loadPage(location.hash, false);
            }
        }, 100);

        // Load page with AJAX, converting markdown files to HTML
        function loadPage(url, addToHistory) {
            if (url.indexOf('#!') == -1) {
                return false; // Without hashbang, do nothing
            }

            var cleanUrl = url.replace('#!', '');
            var $content = $(options.contentSelector);

            options.beforePageLoad($content, cleanUrl);

            if (cleanUrl == '') {
                $content.html(''); // Empty url - empty content
            }
            else {
                $.get(cleanUrl, function(data) {
                    data = options.contentHandler(data, cleanUrl);
                    $content.html(data);
                    prepareLinks($content);

                    if (addToHistory) {
                        history.pushState('', '', url);
                    }
                }).fail(options.pageLoadFail($content, cleanUrl))
                  .always(options.afterPageLoad($content, cleanUrl));
            }
        }

        // Add click handler on links
        function prepareLinks(container) {
            $(container).find(options.linkSelector).each(function() {
                $(this).attr('href', '#!' + $(this).attr('href'));
            }).click(function(event) {
                event.preventDefault();
                loadPage($(this).attr('href'), true);
            });
        }
    }

})(jQuery);
