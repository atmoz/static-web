;(function($) {
    var pathname = window.location.pathname;
    var baseUrl = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    var urlChanged = false;

    function loadPage(url, addToHistory) {
        var $content = $('#static-content');

        if (!url) {
            // Empty url - empty content
            $content.html('');
        }
        else {
            $.get(url.replace('#!', ''), function(data) {
                $content.html(marked(data));

                if (addToHistory) {
                    history.pushState('', '', url);
                    urlChanged = true;
                }

                prepareLinks($content);
            });
        }
    }

    function prepareLinks(container) {
        $(container).find('a[href$=".md"]').each(function(){
            $(this).attr('href', '#!' + $(this).attr('href'));
        }).click(function(event) {
            event.preventDefault();
            loadPage($(this).attr('href'), true);
        });
    }

    $(document).ready(function() {
        prepareLinks(document);

        // In case popstate gets triggered onLoad
        var onLoadPage = false;

        // Load pages when user browse the history
        $(window).bind('popstate', function(event) {
            loadPage(location.hash, false);
            onLoadPage = true;
        });

        // If user requests a page, load it
        if (location.hash.search('#!') != -1) {
            if (!onLoadPage) {
                loadPage(location.hash, false);
            }
        }
    });

})(jQuery);
