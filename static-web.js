;(function($) {

    window.staticWeb = function(options) {
        var defaults = {
            container: document,
            contentSelector: '#content',
            linkSelector: '#menu a',
            loadPageFail: function($content, url) {
                $content.html('Can\'t load ' + encodeURI(url));
            },
            contentHandler: function(data, url) {
                return data;
            }
        };

        options = $.extend( {}, defaults, options );

        // Get those links ready for action
        prepareLinks(options.container);

        // Load pages when user browse the history
        $(window).bind('popstate', function(event) {
            loadPage(location.hash, false);
        });

        // Try loading the page right now
        loadPage(location.hash, false);

        // Load page with AJAX, converting markdown files to HTML
        function loadPage(url, addToHistory) {
            if (url.indexOf('#!') == -1) {
                return false; // Without hashbang, do nothing
            }

            var cleanUrl = url.replace('#!', '');
            var $content = $(options.contentSelector);

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
                }).fail(options.loadPageFail($content, cleanUrl));
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
