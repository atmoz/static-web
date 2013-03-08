;(function($) {

    // Helper function to check suffix in URLs
    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    // Load page with AJAX, converting markdown files to HTML
    function loadPage(url, addToHistory) {
        if (url.indexOf('#!') == -1) {
            return false; // Without hashbang, do nothing
        }

        var cleanUrl = url.replace('#!', '');
        var $content = $('#static-content');

        if (cleanUrl == '') {
            $content.html(''); // Empty url - empty content
        }
        else {
            $.get(cleanUrl, function(data) {
                if (endsWith(cleanUrl, '.md')) {
                    data = marked(data);
                }

                $content.html(data);
                prepareLinks($content);

                if (addToHistory) {
                    history.pushState('', '', url);
                }
            });
        }
    }

    // Add click handler on links
    function prepareLinks(container) {
        $(container).find('a[href$=".md"]').each(function() {
            $(this).attr('href', '#!' + $(this).attr('href'));
        }).click(function(event) {
            event.preventDefault();
            loadPage($(this).attr('href'), true);
        });
    }

    // Get ready baby
    $(document).ready(function() {
        // Get those links ready for action
        prepareLinks(document);

        // Load pages when user browse the history
        $(window).bind('popstate', function(event) {
            loadPage(location.hash, false);
        });

        // Try loading the page right now
        loadPage(location.hash, false);
    });

})(jQuery);
