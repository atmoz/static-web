;(function($) {
    var pathname = window.location.pathname;
    var baseUrl = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    var urlChanged = false;

    function loadPage(url, addToHistory) {
        var $content = $('#static-content');

        $.get(url, function(data) {
            $content.html(marked(data));

            if (addToHistory) {
                history.pushState('', '', url);
                urlChanged = true;
            }

            prepareLinks($content);
        });
    }

    function prepareLinks(container) {
        $(container).find('a[href$=".md"]').each(function(){
            // Relative urls get converted to absolute urls
            var url = $(this).attr('href');
            if (url.substring(0,1) != '/' && url.search('://') == -1) {
                $(this).attr('href', baseUrl + url);
            }
        }).click(function(event) {
            event.preventDefault();
            loadPage($(this).attr('href'), true);
        });
    }

    $(document).ready(function() {
        prepareLinks(document);

        $(window).bind('popstate', function(event) {
            if (urlChanged) {
                loadPage(location.pathname, false);
            }
        });
    });

})(jQuery);
