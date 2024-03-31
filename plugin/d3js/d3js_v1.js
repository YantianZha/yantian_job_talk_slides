/**
 * reveal.js plugin to integrate d3.js visualizations into presentations.
 */
var Reveald3js = window.Reveald3js || (function(){

    function initialize(element, id, file) {
        console.log("opening figure '" + file + "'");

        // get slide, slide background and container
        var background = element.tagName == 'SECTION',
            slide = background ? element : element.closest('section'),
            idx = Reveal.getIndices(slide),
            slide_background = background ? Reveal.getSlideBackground(idx.h, idx.v) : undefined,
            container = background ? slide_background : element;

        // embed html files as iframe
        var iframe = document.createElement('iframe');
        iframe.id = id;
        iframe.setAttribute('sandbox', 'allow-popups allow-scripts allow-forms allow-same-origin');
        iframe.src = file;
        iframe.marginwidth = 0;
        iframe.marginheight = 0;
        iframe.scrolling = 'no';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.maxWidth = '100%';
        iframe.style.maxHeight = '100%';
        iframe.style.zIndex = 1;

        container.appendChild(iframe);

        // iframe load event
        iframe.onload = function() {
            var fig = (iframe.contentWindow || iframe.contentDocument);
            // add custom event listener to propagate key presses
            fig.document.addEventListener('keydown', function(e) {
                var event = new CustomEvent('iframe-keydown', { detail: e });
                window.parent.document.dispatchEvent(event);
            });
        };
    }

    Reveal.addEventListener('ready', function(event) {
        // Get all figure containers
        var elements = document.querySelector('.reveal').querySelectorAll('.fig-container');
        for (var j = 0; j < elements.length; j++) {
            // get id and file attributes
            var id = elements[j].getAttribute('data-fig-id'),
                file = elements[j].getAttribute('data-file');
            // load figure
            initialize(elements[j], id, file);
        }
    });

    // propagate keydown when focus is on iframe
    window.document.addEventListener('iframe-keydown', function(event) {
        Reveal.triggerKey(event.detail.keyCode);
    }, false);

    // figure transitions on fragment change
    Reveal.addEventListener('fragmentshown', function(event) {
        // only proceed if fragment has `fig-transition` class
        if (!event.fragment.classList.contains('fig-transition')) return;
        var slide = event.fragment.closest('section'),
            idx = Reveal.getIndices(slide),
            iframe = slide.querySelector('iframe') || Reveal.getSlideBackground(idx.h, idx.v).querySelector('iframe'),
            fig = iframe.contentWindow || iframe.contentDocument;
        fig._transitions[fig._transition_state]();
        fig._transition_state = fig._transition_state + 1;
    });

    // figure inverse transitions on fragment change
    Reveal.addEventListener('fragmenthidden', function(event) {
        // only proceed if fragment has `fig-transition` class
        if (!event.fragment.classList.contains('fig-transition')) return;
        var slide = event.fragment.closest('section'),
            idx = Reveal.getIndices(slide),
            iframe = slide.querySelector('iframe') || Reveal.getSlideBackground(idx.h, idx.v).querySelector('iframe'),
            fig = iframe.contentWindow || iframe.contentDocument;
        fig._transition_state = fig._transition_state - 1;
        (fig._inverse_transitions[fig._transition_state] || Function)();
    });

})();