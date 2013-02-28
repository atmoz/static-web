;(function($) {

    $(document).ready(function() {
        var $content = $('#static-content');

        $('a[href$=".md"]').click(function(event) {
            event.preventDefault();

            $.get(this.href, function(data) {
                $content.html(marked(data));
            });
        });
    });

})(jQuery);
