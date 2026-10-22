/*!
 * SoftTwinPlus 1.0 - theme.js
 *
 * Front-end behaviour for the Blogger theme:
 *   1.  Desktop menu dropdowns (built from "_" prefixed items)
 *   2.  Mobile drawer / submenu toggles
 *   3.  Search, label links, avatars, post navigation, per-post layout overrides
 *   4.  Sticky header, back-to-top, sticky sidebar
 *   5.  Feed widgets (featured posts, hot posts, menu feeds, related posts)
 *   6.  Comment system switch (Blogger / Disqus / Facebook / hidden)
 *
 * Globals provided by the Blogger layout (do not redeclare here):
 *   postPerPage, fixedSidebar, commentsSystem, disqusShortname,
 *   disqus_blogger_current_url, messages
 * Globals provided by globals.js:
 *   monthFormat, noThumbnail
 *
 * Feed widget config is plain text inside a widget: "count/source/layout",
 * for example "12/mcq/grid-list". `source` is a Blogger label, "random" or
 * "recent". `layout` is one of LAYOUT_TYPES below.
 */
$(function () {
    'use strict';

    /* ---------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------ */

    var DEFAULT_AVATAR = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEic6uPt8Ut3L3TnqJ-aZjSexsQK2JbEAN_C0pbNXqh7flGsYlUn6Z9_wYXAGvycShuvA2193HnSXpwxA83mb3OBu3tt1aV6GPMpnsxX6O_rmLot5ijr0hIxZXZe5zY8JiztdHF5oJ8Uj2bS/s55-r/avatar.png';

    // Logo used by Blogger when a post has no image. Kept here so it can be
    // swapped for the configured `noThumbnail` (see globals.js).
    var DEFAULT_POST_LOGO = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRM5LPszv7maX1xnr5QUWtSgCwsEjKPkoIdRZTEAJaHZ2uoeuNvtUh4UsMRt_oURLn8arm_87lY-p4T5sEUq7__gDMC625k5YYl7xYWc89Z08GLkBXFKos3oqsFXfIWeAc_v9nDjHsDmfiZ_TtdNN4_RvJd-N83VIrmQSsjqLU3ZSUpdUSdasAArhh54U/s320/logo.png';

    // Layout names, checked in this order. More specific names first so a
    // config such as "grid-left-small" never matches a shorter layout.
    var LAYOUT_TYPES = [
        'mega-menu',
        'hot-posts',
        'feat-big',
        'col-left',
        'col-right',
        'grid-left-small',
        'grid-small',
        'grid-text',
        'grid-big',
        'grid-list',
        'post-txt-list',
        'grid-overlay',
        'grid-tile',
        'feat-list',
        'post-list',
        'related'
    ];

    // <ul> class used by each layout.
    var LIST_CLASS = {
        'mega-menu': 'mega-menu-inner',
        'hot-posts': 'hot-posts',
        'feat-big': 'feat-big',
        'col-left': 'feat-col',
        'col-right': 'feat-col',
        'grid-left-small': 'grid-left-small',
        'grid-small': 'grid-small',
        'grid-text': 'grid-text',
        'grid-big': 'grid-big',
        'grid-list': 'grid-list',
        'post-txt-list': 'post-txt-list',
        'grid-overlay': 'grid-overlay',
        'grid-tile': 'grid-tile',
        'feat-list': 'feat-list',
        'post-list': 'custom-widget',
        'related': 'related-posts'
    };

    // Layouts that get a "View all" link in the widget title.
    var VIEW_ALL_TYPES = [
        'feat-big',
        'feat-list',
        'col-left',
        'col-right',
        'grid-left-small',
        'grid-small',
        'grid-text',
        'grid-big',
        'grid-list',
        'post-txt-list',
        'grid-overlay',
        'grid-tile'
    ];

    /* ---------------------------------------------------------------------
     * 1. Desktop menu - turn "_" prefixed links into dropdowns
     * ------------------------------------------------------------------ */

    /**
     * Collect every group of menu links that starts with "_" into a
     * submenu <ul> appended to the previous item.
     *
     * @param {jQuery} $links       anchors of the menu (in order)
     * @param {string} submenuClass "sub-menu" or "sub-menu2"
     */
    function buildSubmenu($links, submenuClass) {
        var $parentItem = null;

        $links.each(function (index) {
            var $link = $(this);
            var text = $link.text();

            // A normal item followed by a "_" item becomes the submenu parent.
            if (text.charAt(0) !== '_') {
                var nextText = $links.eq(index + 1).text();
                if (nextText.charAt(0) === '_') {
                    $parentItem = $link.parent();
                    $parentItem.append('<ul class="' + submenuClass + ' m-sub"/>');
                }
            }

            // The "_" item itself moves into the submenu and loses the marker.
            if (text.charAt(0) === '_') {
                $link.text(text.replace('_', ''));
                if ($parentItem) {
                    $link.parent().appendTo($parentItem.children('.' + submenuClass));
                }
            }
        });
    }

    $('#main-menu').each(function () {
        var $links = $(this).find('.LinkList ul > li').children('a');

        buildSubmenu($links, 'sub-menu');
        buildSubmenu($links, 'sub-menu2');

        $('#main-menu ul li ul').parent('li').addClass('has-sub');
        $('#main-menu .widget').addClass('show-menu');
    });

    /* ---------------------------------------------------------------------
     * 2. Mobile drawer
     * ------------------------------------------------------------------ */

    // Clone the desktop menu into the drawer, then add submenu toggles.
    $('#main-menu-nav').clone().appendTo('.mobile-menu');
    $('.mobile-menu .has-sub').append('<div class="submenu-toggle"/>');

    // Menu feeds (label/type links) cannot open in the drawer - send them to
    // the label search page instead.
    $('.mobile-menu ul > li a').each(function () {
        var $link = $(this);
        var href = ($link.attr('href') || '').trim();
        var label = href.split('/')[0];

        if (href.toLowerCase().indexOf('mega-menu') !== -1) {
            $link.attr('href', '/search/label/' + label + '?&max-results=' + postPerPage);
        }
    });

    $('.slide-menu-toggle').on('click', function () {
        var isOpen = !$('body').hasClass('nav-active');

        $('body').toggleClass('nav-active', isOpen);
        $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
        $('.overlay').fadeToggle(170);
    });

    $('.slide-menu-toggle')
        .attr({
            role: 'button',
            tabindex: '0',
            'aria-label': 'Menu',
            'aria-expanded': 'false'
        })
        .on('keydown', function (event) {
            // Enter or Space opens the drawer.
            if (event.keyCode === 13 || event.keyCode === 32) {
                event.preventDefault();
                $(this).trigger('click');
            }
        });

    // Tapping the overlay closes the drawer.
    $('.overlay').on('click', function () {
        if ($('body').hasClass('nav-active')) {
            $('.slide-menu-toggle').trigger('click');
        }
    });

    // Feed links inside the drawer go to the normal search page.
    $('.mobile-menu a').each(function () {
        var href = $(this).attr('href') || '';

        if (href.indexOf('mega-menu') !== -1 || href.indexOf('/search/label/recent') !== -1) {
            $(this).attr('href', '/search');
        }
    });

    // Navigating from the drawer closes it.
    $('.mobile-menu').on('click', 'a', function () {
        var href = $(this).attr('href') || '';

        if (href === '' || href.charAt(0) === '#') {
            return;
        }
        if ($('body').hasClass('nav-active')) {
            $('.slide-menu-toggle').trigger('click');
        }
    });

    // Placeholder links toggle their submenu instead of navigating.
    $('.mobile-menu li.has-sub > a').on('click', function (event) {
        var href = $(this).attr('href') || '';

        if (href === '' || href.charAt(0) === '#') {
            event.preventDefault();
            $(this).parent().children('.submenu-toggle').trigger('click');
        }
    });

    // Escape closes the drawer.
    $(document).on('keyup', function (event) {
        if (event.keyCode === 27 && $('body').hasClass('nav-active')) {
            $('.slide-menu-toggle').trigger('click');
        }
    });

    // Cloned widgets must not duplicate element ids.
    $('.mobile-menu').find('[id]').removeAttr('id');

    $('.mobile-menu ul li .submenu-toggle').on('click', function (event) {
        var $item = $(this).parent();

        if (!$item.hasClass('has-sub')) {
            return;
        }
        event.preventDefault();

        $item.toggleClass('show', !$item.hasClass('show'));
        $item.children('.m-sub').slideToggle(170);
    });

    /* ---------------------------------------------------------------------
     * 3. Search, links, avatars, post navigation, post layout overrides
     * ------------------------------------------------------------------ */

    $('.show-search, .show-mobile-search').on('click', function () {
        $('#nav-search, .mobile-search-form').fadeIn(250).find('input').focus();
    });

    $('.hide-search, .hide-mobile-search').on('click', function () {
        $('#nav-search, .mobile-search-form').fadeOut(250).find('input').blur();
    });

    // Label widgets show a full page of posts.
    $('.Label a, a.b-label').attr('href', function (index, href) {
        return href + '?&max-results=' + postPerPage;
    });

    // Blogger comment avatars: bigger size and a local fallback.
    $('.avatar-image-container img').attr('src', function (index, src) {
        src = src.replace('/s35-c/', '/s45-c/');
        return src.replace('//img1.blogblog.com/img/blank.gif', DEFAULT_AVATAR);
    });

    // Index cards fall back to the configured thumbnail when Blogger uses its
    // own placeholder logo.
    $('.index-post .post-image-link img').attr('src', function (index, src) {
        return src.replace(DEFAULT_POST_LOGO, noThumbnail);
    });

    $('.author-description a').each(function () {
        $(this).attr('target', '_blank');
    });

    // Fill "previous / next post" titles by loading the linked pages.
    $('.post-nav').each(function () {
        var prevUrl = $('a.prev-post-link').attr('href');
        var nextUrl = $('a.next-post-link').attr('href');

        if (prevUrl) {
            $.ajax({
                url: prevUrl,
                type: 'get',
                success: function (response) {
                    var title = $(response).find('.blog-post h1.post-title').text();
                    $('.post-prev a .post-nav-inner p').text(title);
                }
            });
        }

        if (nextUrl) {
            $.ajax({
                url: nextUrl,
                type: 'get',
                success: function (response) {
                    var title = $(response).find('.blog-post h1.post-title').text();
                    $('.post-next a .post-nav-inner p').text(title);
                }
            });
        }
    });

    // Per-post layout overrides: a <strike> containing a keyword swaps the
    // sidebar side (or hides it) for this post only.
    $('.post-body strike').each(function () {
        var $strike = $(this);
        var text = $strike.text();

        if (text.indexOf('left-sidebar') !== -1) {
            $strike.replaceWith('<style>.item #main-wrapper{float:right;padding:0 0 0 25px}.item #sidebar-wrapper{float:left}</style>');
        }
        if (text.indexOf('right-sidebar') !== -1) {
            $strike.replaceWith('<style>.item #main-wrapper{float:left;padding:0 25px 0 0}.item #sidebar-wrapper{float:right}</style>');
        }
        if (text.indexOf('full-width') !== -1) {
            $strike.replaceWith('<style>.item #main-wrapper{width:100%;padding:0}.item #sidebar-wrapper{display:none}</style>');
        }
    });

    /* ---------------------------------------------------------------------
     * 4. Sticky header, back-to-top, sticky sidebar
     * ------------------------------------------------------------------ */

    $('#main-wrapper, #sidebar-wrapper').each(function () {
        if (fixedSidebar === true || fixedSidebar === 'true') {
            $(this).theiaStickySidebar({
                additionalMarginTop: 72,
                additionalMarginBottom: 25
            });
        }
    });

    var $headerMenu = $('.header-menu');
    if ($headerMenu.length) {
        var updateHeaderShadow = function () {
            $headerMenu.toggleClass('is-stuck', $(window).scrollTop() > 6);
        };

        $(window).on('scroll', updateHeaderShadow);
        updateHeaderShadow();
    }

    // Desktop viewport: close the mobile drawer if it is still open.
    $(window).on('resize', function () {
        if ($(window).width() > 960 && $('body').hasClass('nav-active')) {
            $('.slide-menu-toggle').trigger('click');
        }
    });

    $('.back-top').each(function () {
        var $button = $(this);

        $(window).on('scroll', function () {
            if ($(window).scrollTop() >= 100) {
                $button.fadeIn(250);
            } else {
                $button.fadeOut(250);
            }
        });

        $button.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    });

    /* ---------------------------------------------------------------------
     * 5. Feed widgets
     * ------------------------------------------------------------------ */

    /**
     * Find the layout name inside a widget config string.
     *
     * @param {string} config lowercased widget text, e.g. "12/mcq/grid-list"
     * @returns {string|null}
     */
    function detectLayout(config) {
        for (var i = 0; i < LAYOUT_TYPES.length; i++) {
            if (config.indexOf(LAYOUT_TYPES[i]) !== -1) {
                return LAYOUT_TYPES[i];
            }
        }
        return null;
    }

    function getPostUrl(entry) {
        var links = entry.link || [];

        for (var i = 0; i < links.length; i++) {
            if (links[i].rel === 'alternate') {
                return links[i].href;
            }
        }
        return '#';
    }

    function getTitle(entry, url) {
        return '<a href="' + url + '">' + entry.title.$t + '</a>';
    }

    function getAuthor(entry) {
        var author = entry.author && entry.author[0] ? entry.author[0].name.$t : '';
        return '<span class="post-author">' + author + ' </span>';
    }

    function getDate(entry) {
        var published = entry.published.$t;
        var year = published.substring(0, 4);
        var month = published.substring(5, 7);
        var day = published.substring(8, 10);
        var label = monthFormat[parseInt(month, 10) - 1] + ' ' + day + ', ' + year;

        return '<span class="post-date">' + label + '</span>';
    }

    function getTag(entry) {
        if (entry.category !== undefined && entry.category.length) {
            return '<span class="post-tag">' + entry.category[0].term + '</span>';
        }
        return '';
    }

    function getSnippet(entry) {
        var content = entry.content ? entry.content.$t : '';
        var text = $('<div>').html(content).text().trim().substr(0, 86);

        return '<p class="post-snippet">' + text + '…</p>';
    }

    /**
     * Build the three <img> variants (large, medium, small) for an entry.
     * YouTube thumbs use the higher-quality frames instead of the default one.
     */
    function getImages(entry) {
        var title = entry.title.$t;
        var content = entry.content ? entry.content.$t : '';
        var large;
        var medium;
        var small;

        if ('media$thumbnail' in entry) {
            var thumb = entry.media$thumbnail.url;

            large = thumb.replace('/s72-c', '/w640');
            medium = thumb.replace('/s72-c', '/w280');
            small = thumb.replace('/s72-c', '/w100');

            if (content.indexOf('youtube.com/embed') !== -1) {
                large = thumb.replace('/default.', '/hqdefault.');
                medium = thumb.replace('/default.', '/mqdefault.');
                small = thumb;
            }
        } else {
            large = noThumbnail;
            medium = noThumbnail.replace('/s680', '/w280');
            small = noThumbnail.replace('/s680', '/w100');
        }

        return [
            '<img class="post-thumb" loading="lazy" decoding="async" alt="' + title + '" src="' + large + '"/>',
            '<img class="post-thumb" loading="lazy" decoding="async" alt="' + title + '" src="' + medium + '"/>',
            '<img class="post-thumb" loading="lazy" decoding="async" alt="' + title + '" src="' + small + '"/>'
        ];
    }

    /**
     * Large card: image on top, tag, title, author + date, description.
     * Used by feat-big, col-left/right, grid-big and feat-list.
     */
    function bigCard(className, index, url, image, tag, title, author, date, snippet) {
        return '<li class="' + className + ' item-' + index + '"><div class="feat-inner">' +
            '<a class="post-image-link" href="' + url + '">' + image + '</a>' + tag +
            '<div class="post-info"><h2 class="post-title">' + title + '</h2>' +
            '<div class="post-meta">' + author + date + '</div>' + snippet + '</div>' +
            '</div></li>';
    }

    /**
     * Small card: image, title, date. Used for the secondary items of
     * feat-big and col-left/right feeds.
     */
    function smallCard(index, url, image, title, date) {
        return '<li class="feat-item item-small item-' + index + '">' +
            '<a class="post-image-link" href="' + url + '">' + image + '</a>' +
            '<div class="post-info"><h2 class="post-title">' + title + '</h2>' +
            '<div class="post-meta">' + date + '</div></div></li>';
    }

    /**
     * Render one feed item for a layout.
     *
     * @param {string} layout  layout name from detectLayout()
     * @param {Array}  entries feed entries
     * @param {number} index   entry index
     * @returns {string} <li> or <div> markup
     */
    function renderFeedItem(layout, entries, index) {
        var entry = entries[index];
        var url = getPostUrl(entry);
        var title = getTitle(entry, url);
        var images = getImages(entry);
        var tag = getTag(entry);
        var author = getAuthor(entry);
        var date = getDate(entry);
        var snippet = getSnippet(entry);
        var number = ('0' + (index + 1)).slice(-2);

        switch (layout) {
            case 'mega-menu':
                return '<div class="mega-item item-' + index + '"><div class="mega-content">' +
                    '<div class="post-image-wrap"><a class="post-image-link" href="' + url + '">' + images[1] + '</a></div>' +
                    '<h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + date + '</div></div></div>';

            case 'hot-posts':
                return '<li class="hot-item item-' + index + '"><div class="hot-item-inner">' +
                    '<a class="post-image-link" href="' + url + '">' + images[0] + '</a>' +
                    '<div class="post-info">' + tag +
                    '<h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + (index === 0 ? author : '') + date + '</div>' +
                    '</div></div></li>';

            case 'feat-big':
                if (index === 0) {
                    return bigCard('feat-item item-big', index, url, images[0], tag, title, author, date, snippet);
                }
                return smallCard(index, url, images[1], title, date);

            case 'col-left':
            case 'col-right':
                if (index === 0) {
                    return bigCard('feat-item item-big', index, url, images[0], tag, title, author, date, snippet);
                }
                return smallCard(index, url, images[2], title, date);

            case 'grid-small':
                return '<li class="feat-item item-small item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' + snippet +
                    '<div class="post-meta">' + date + '</div></div></li>';

            case 'grid-left-small':
                return '<li class="feat-item item-left item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' + snippet + '</div></li>';

            case 'grid-text':
                return '<li class="feat-item item-text item-' + index + '">' +
                    '<h2 class="post-title">' + title + '</h2>' + snippet + '</li>';

            case 'grid-big':
                return bigCard('feat-item item-big', index, url, images[0], tag, title, author, date, snippet);

            case 'grid-list':
                return '<li class="feat-item item-row item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + date + '</div>' + snippet + '</div></li>';

            case 'post-txt-list':
                return '<li class="feat-item item-num item-' + index + '">' +
                    '<span class="post-index">' + number + '</span>' +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' + snippet + '</div></li>';

            case 'grid-overlay':
                return '<li class="feat-item item-overlay item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' + tag +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + date + '</div></div></li>';

            case 'grid-tile':
                return '<li class="feat-item item-tile item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' +
                    '<h2 class="post-title">' + title + '</h2></li>';

            case 'feat-list':
                return bigCard('feat-item', index, url, images[0], tag, title, author, date, snippet);

            case 'post-list':
                return '<li class="item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[2] + '</a>' +
                    '<div class="post-info"><h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + date + '</div></div></li>';

            case 'related':
                return '<li class="related-item item-' + index + '">' +
                    '<a class="post-image-link" href="' + url + '">' + images[1] + '</a>' +
                    '<h2 class="post-title">' + title + '</h2>' +
                    '<div class="post-meta">' + date + '</div></li>';
        }

        return '';
    }

    /**
     * Insert rendered markup and apply the wrapper classes Blogger's CSS
     * expects (show-widget, col-width, show-hot, has-sub...).
     */
    function applyFeed($target, layout, source, html) {
        if (layout === 'mega-menu') {
            $target.addClass('has-sub mega-menu').append(html);

            // The first menu link points at the label search page.
            $target.find('a:first').attr('href', function (index, href) {
                if (source === 'recent' || source === 'random') {
                    return '/search/?&max-results=' + postPerPage;
                }
                return '/search/label/' + source + '?&max-results=' + postPerPage;
            });
            return;
        }

        if (layout === 'hot-posts') {
            $target.html(html).parent().addClass('show-hot');
            return;
        }

        if (VIEW_ALL_TYPES.indexOf(layout) !== -1) {
            var viewAllText = (typeof messages !== 'undefined' && messages.viewAll) ? messages.viewAll : 'View all';

            $target.parent().find('.widget-title').append(
                '<a class="view-all" href="/search/label/' + source + '?&max-results=' + postPerPage + '">' +
                viewAllText + '</a>'
            );

            if (layout === 'col-left' || layout === 'col-right') {
                if (layout === 'col-right') {
                    $target.parent().addClass('col-right');
                }
                $target.parent().addClass('col-width');
            }

            $target.html(html).parent().addClass('show-widget');
            return;
        }

        $target.html(html);
    }

    /**
     * Load a Blogger JSON feed and render it into a widget.
     *
     * @param {jQuery} $target element to fill
     * @param {string} config  widget config (lowercased)
     * @param {number} count   number of posts
     * @param {string} source  label, "random" or "recent"
     */
    function renderFeed($target, config, count, source) {
        var layout = detectLayout(config);
        if (!layout) {
            return;
        }

        var url;
        if (source === 'recent') {
            url = '/feeds/posts/default?alt=json-in-script&max-results=' + count;
        } else if (source === 'random') {
            var start = Math.floor(Math.random() * count) + 1;
            url = '/feeds/posts/default?max-results=' + count + '&start-index=' + start + '&alt=json-in-script';
        } else {
            url = '/feeds/posts/default/-/' + source + '?alt=json-in-script&max-results=' + count;
        }

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'jsonp',
            beforeSend: function () {
                if (layout === 'hot-posts') {
                    $target.html('<div class="hot-loader"/>').parent().addClass('show-hot');
                }
            },
            success: function (response) {
                var html = '<ul class="' + (LIST_CLASS[layout] || 'grid-small') + '">';
                var entries = response.feed.entry;

                if (entries !== undefined) {
                    for (var i = 0; i < entries.length; i++) {
                        html += renderFeedItem(layout, entries, i);
                    }
                    html += '</ul>';
                } else {
                    html = '<ul class="no-posts">Error: No Posts Found <i class="fa-solid fa-frown"/></ul>';
                }

                applyFeed($target, layout, source, html);
            }
        });
    }

    // 5a. Menu feeds: each top-level menu item shows 4 posts from its label.
    $('#main-menu #main-menu-nav li').each(function () {
        var $item = $(this);
        var href = ($item.find('a').attr('href') || '').trim();
        var config = href.toLowerCase();
        var source = config.split('/')[0];

        renderFeed($item, config, 4, source);
    });

    // 5b. Hot posts section: always 4 posts.
    $('#hot-section .widget-content').each(function () {
        var $content = $(this);
        var config = $content.text().trim().toLowerCase();
        var source = config.split('/')[0];

        renderFeed($content, config, 4, source);
    });

    // 5c. Featured posts: lazy-loaded when they scroll near the viewport.
    $('.featured-posts .widget-content').each(function () {
        var $content = $(this);

        var load = function () {
            if ($content.data('feedLoaded')) {
                return;
            }
            $content.data('feedLoaded', true);

            var config = $content.text().trim().toLowerCase();
            var parts = config.split('/');
            var count;
            var source;

            if (config.indexOf('feat-big') !== -1) {
                count = 5;
                source = parts[0];
            } else {
                count = parts[0];
                source = parts[1];
            }

            renderFeed($content, config, count, source);
        };

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    load();
                }
            }, {
                rootMargin: '400px 0px'
            });

            observer.observe(this);
        } else {
            load();
        }
    });

    // 5d. Sidebar widgets (Random Posts, categories...).
    $('.common-widget .widget-content').each(function () {
        var $content = $(this);
        var config = $content.text().trim().toLowerCase();
        var parts = config.split('/');

        renderFeed($content, config, parts[0], parts[1]);
    });

    // 5e. Related posts in a single post: labelled by .related-tag.
    $('.related-ready').each(function () {
        var $content = $(this);
        var label = $content.find('.related-tag').data('label');

        renderFeed($content, 'related', 3, label);
    });

    /* ---------------------------------------------------------------------
     * 6. Comment system
     * ------------------------------------------------------------------ */

    $('.blog-post-comments').each(function () {
        var $comments = $(this);
        var system = commentsSystem;
        var systemClass = 'comments-system-' + system;
        var pageUrl = $(location).attr('href');
        var facebookMarkup = '<div class="fb-comments" data-width="100%" data-href="' + pageUrl + '" data-numposts="5"></div>';

        if (system === 'blogger') {
            $comments.addClass(systemClass).show();
            return;
        }

        if (system === 'disqus') {
            (function () {
                var script = document.createElement('script');

                script.type = 'text/javascript';
                script.async = true;
                script.src = '//' + disqusShortname + '.disqus.com/embed.js';

                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
            })();

            $('#comments, #gpluscomments').remove();
            $comments.append('<div id="disqus_thread"/>').addClass(systemClass).show();
            return;
        }

        if (system === 'facebook') {
            $('#comments, #gpluscomments').remove();
            $comments.append(facebookMarkup).addClass(systemClass).show();
            return;
        }

        if (system === 'hide') {
            $comments.hide();
            return;
        }

        $comments.addClass('comments-system-default').show();
    });
});
