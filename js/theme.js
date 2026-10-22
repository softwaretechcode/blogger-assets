$(function () {
    $('#main-menu')['each'](function () {
        var _0xf943x2 = $(this)['find']('.LinkList ul > li')['children']('a'),
            _0xf943x3 = _0xf943x2['length'];
        for (var _0xf943x4 = 0; _0xf943x4 < _0xf943x3; _0xf943x4++) {
            var _0xf943x5 = _0xf943x2['eq'](_0xf943x4),
                _0xf943x6 = _0xf943x5['text']();
            if (_0xf943x6['charAt'](0) !== '_') {
                var _0xf943x7 = _0xf943x2['eq'](_0xf943x4 + 1),
                    _0xf943x8 = _0xf943x7['text']();
                if (_0xf943x8['charAt'](0) === '_') {
                    var _0xf943x9 = _0xf943x5['parent']();
                    _0xf943x9['append']('<ul class="sub-menu m-sub"/>')
                }
            };
            if (_0xf943x6['charAt'](0) === '_') {
                _0xf943x5['text'](_0xf943x6['replace']('_', ''));
                _0xf943x5['parent']()['appendTo'](_0xf943x9['children']('.sub-menu'))
            }
        };
        for (var _0xf943x4 = 0; _0xf943x4 < _0xf943x3; _0xf943x4++) {
            var _0xf943xa = _0xf943x2['eq'](_0xf943x4),
                _0xf943xb = _0xf943xa['text']();
            if (_0xf943xb['charAt'](0) !== '_') {
                var _0xf943xc = _0xf943x2['eq'](_0xf943x4 + 1),
                    _0xf943xd = _0xf943xc['text']();
                if (_0xf943xd['charAt'](0) === '_') {
                    var _0xf943xe = _0xf943xa['parent']();
                    _0xf943xe['append']('<ul class="sub-menu2 m-sub"/>')
                }
            };
            if (_0xf943xb['charAt'](0) === '_') {
                _0xf943xa['text'](_0xf943xb['replace']('_', ''));
                _0xf943xa['parent']()['appendTo'](_0xf943xe['children']('.sub-menu2'))
            }
        };
        $('#main-menu ul li ul')['parent']('li')['addClass']('has-sub');
        $('#main-menu .widget')['addClass']('show-menu')
    });
    $('#main-menu-nav')['clone']()['appendTo']('.mobile-menu');
    $('.mobile-menu .has-sub')['append']('<div class="submenu-toggle"/>');
    $('.mobile-menu ul > li a')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943x10 = _0xf943xf['attr']('href')['trim'](),
            _0xf943x11 = _0xf943x10['toLowerCase'](),
            _0xf943x12 = _0xf943x10['split']('/'),
            _0xf943x13 = _0xf943x12[0];
        if (_0xf943x11['match']('mega-menu')) {
            _0xf943xf['attr']('href', '/search/label/' + _0xf943x13 + '?&max-results=' + postPerPage)
        }
    });
    $('.slide-menu-toggle')['on']('click', function () {
        var _0xf943xopen = !$('body')['hasClass']('nav-active');
        $('body')['toggleClass']('nav-active', _0xf943xopen);
        $(this)['attr']('aria-expanded', _0xf943xopen ? 'true' : 'false');
        $('.overlay')['fadeToggle'](170)
    });
    $('.slide-menu-toggle')['attr']({'role': 'button', 'tabindex': '0', 'aria-label': 'Menu', 'aria-expanded': 'false'})['on']('keydown', function (_0xf943xkey) {
        if (_0xf943xkey['keyCode'] === 13 || _0xf943xkey['keyCode'] === 32) {
            _0xf943xkey['preventDefault']();
            $(this)['trigger']('click')
        }
    });
    $('.overlay')['on']('click', function () {
        if ($('body')['hasClass']('nav-active')) {
            $('.slide-menu-toggle')['trigger']('click')
        }
    });
    $('.mobile-menu a')['each'](function () {
        var _0xf943xmenuHref = $(this)['attr']('href') || '';
        if (_0xf943xmenuHref['indexOf']('mega-menu') > -1 || _0xf943xmenuHref['indexOf']('/search/label/recent') > -1) {
            $(this)['attr']('href', '/search')
        }
    });
    $('.mobile-menu')['on']('click', 'a', function () {
        var _0xf943xmenuHref = $(this)['attr']('href') || '';
        if (_0xf943xmenuHref === '' || _0xf943xmenuHref['charAt'](0) === '#') {
            return
        }
        if ($('body')['hasClass']('nav-active')) {
            $('.slide-menu-toggle')['trigger']('click')
        }
    });
    $('.mobile-menu li.has-sub > a')['on']('click', function (_0xf943xmenuEvent) {
        var _0xf943xmenuHref = $(this)['attr']('href') || '';
        if (_0xf943xmenuHref === '' || _0xf943xmenuHref['charAt'](0) === '#') {
            _0xf943xmenuEvent['preventDefault']();
            $(this)['parent']()['children']('.submenu-toggle')['trigger']('click')
        }
    });
    $(document)['on']('keyup', function (_0xf943xkey) {
        if (_0xf943xkey['keyCode'] === 27 && $('body')['hasClass']('nav-active')) {
            $('.slide-menu-toggle')['trigger']('click')
        }
    });
    $('.mobile-menu')['find']('[id]')['removeAttr']('id');
    $('.mobile-menu ul li .submenu-toggle')['on']('click', function (_0xf943xf) {
        if ($(this)['parent']()['hasClass']('has-sub')) {
            _0xf943xf['preventDefault']();
            if (!$(this)['parent']()['hasClass']('show')) {
                $(this)['parent']()['addClass']('show')['children']('.m-sub')['slideToggle'](170)
            } else {
                $(this)['parent']()['removeClass']('show')['children']('.m-sub')['slideToggle'](170)
            }
        }
    });
    $('.show-search, .show-mobile-search')['on']('click', function () {
        $('#nav-search, .mobile-search-form')['fadeIn'](250)['find']('input')['focus']()
    });
    $('.hide-search, .hide-mobile-search')['on']('click', function () {
        $('#nav-search, .mobile-search-form')['fadeOut'](250)['find']('input')['blur']()
    });
    $('.Label a, a.b-label')['attr']('href', function (_0xf943xf, _0xf943x14) {
        return _0xf943x14['replace'](_0xf943x14, _0xf943x14 + '?&max-results=' + postPerPage)
    });
    $('.avatar-image-container img')['attr']('src', function (_0xf943xf, _0xf943x4) {
        _0xf943x4 = _0xf943x4['replace']('/s35-c/', '/s45-c/');
        _0xf943x4 = _0xf943x4['replace']('//img1.blogblog.com/img/blank.gif', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEic6uPt8Ut3L3TnqJ-aZjSexsQK2JbEAN_C0pbNXqh7flGsYlUn6Z9_wYXAGvycShuvA2193HnSXpwxA83mb3OBu3tt1aV6GPMpnsxX6O_rmLot5ijr0hIxZXZe5zY8JiztdHF5oJ8Uj2bS/s55-r/avatar.png');
        return _0xf943x4
    });
    $('.index-post .post-image-link img')['attr']('src', function (_0xf943xf, _0xf943x4) {
        _0xf943x4 = _0xf943x4['replace']('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRM5LPszv7maX1xnr5QUWtSgCwsEjKPkoIdRZTEAJaHZ2uoeuNvtUh4UsMRt_oURLn8arm_87lY-p4T5sEUq7__gDMC625k5YYl7xYWc89Z08GLkBXFKos3oqsFXfIWeAc_v9nDjHsDmfiZ_TtdNN4_RvJd-N83VIrmQSsjqLU3ZSUpdUSdasAArhh54U/s320/logo.png', noThumbnail);
        return _0xf943x4
    });
    $('.author-description a')['each'](function () {
        $(this)['attr']('target', '_blank')
    });
    $('.post-nav')['each'](function () {
        var _0xf943x15 = $('a.prev-post-link')['attr']('href'),
            _0xf943x16 = $('a.next-post-link')['attr']('href');
        $['ajax']({
            url: _0xf943x15,
            type: 'get',
            success: function (_0xf943x17) {
                var _0xf943x18 = $(_0xf943x17)['find']('.blog-post h1.post-title')['text']();
                $('.post-prev a .post-nav-inner p')['text'](_0xf943x18)
            }
        });
        $['ajax']({
            url: _0xf943x16,
            type: 'get',
            success: function (_0xf943x19) {
                var _0xf943x18 = $(_0xf943x19)['find']('.blog-post h1.post-title')['text']();
                $('.post-next a .post-nav-inner p')['text'](_0xf943x18)
            }
        })
    });
    $('.post-body strike')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943x11 = _0xf943xf['text']();
        if (_0xf943x11['match']('left-sidebar')) {
            _0xf943xf['replaceWith']('<style>.item #main-wrapper{float:right;padding:0 0 0 25px}.item #sidebar-wrapper{float:left}</style>')
        };
        if (_0xf943x11['match']('right-sidebar')) {
            _0xf943xf['replaceWith']('<style>.item #main-wrapper{float:left;padding:0 25px 0 0}.item #sidebar-wrapper{float:right}</style>')
        };
        if (_0xf943x11['match']('full-width')) {
            _0xf943xf['replaceWith']('<style>.item #main-wrapper{width:100%;padding:0}.item #sidebar-wrapper{display:none}</style>')
        }
    });
    $('#main-wrapper, #sidebar-wrapper')['each'](function () {
        if (fixedSidebar == true) {
            $(this)['theiaStickySidebar']({
                additionalMarginTop: 72,
                additionalMarginBottom: 25
            })
        }
    });
    var _0xf943xmenuBar = $('.header-menu');
    if (_0xf943xmenuBar['length']) {
        var _0xf943xmenuShadow = function () {
            _0xf943xmenuBar['toggleClass']('is-stuck', $(window)['scrollTop']() > 6)
        };
        $(window)['on']('scroll', _0xf943xmenuShadow);
        _0xf943xmenuShadow()
    }
    $(window)['on']('resize', function () {
        if ($(window)['width']() > 960 && $('body')['hasClass']('nav-active')) {
            $('.slide-menu-toggle')['trigger']('click')
        }
    });
    $('.back-top')['each'](function () {
        var _0xf943xf = $(this);
        $(window)['on']('scroll', function () {
            $(this)['scrollTop']() >= 100 ? _0xf943xf['fadeIn'](250) : _0xf943xf['fadeOut'](250)
        }), _0xf943xf['click'](function () {
            $('html, body')['animate']({
                scrollTop: 0
            }, 500)
        })
    });
    $('#main-menu #main-menu-nav li')['each'](function () {
        var _0xf943x1a = $(this),
            _0xf943x10 = _0xf943x1a['find']('a')['attr']('href')['trim'](),
            _0xf943xf = _0xf943x1a,
            _0xf943x11 = _0xf943x10['toLowerCase'](),
            _0xf943x12 = _0xf943x10['split']('/'),
            _0xf943x13 = _0xf943x12[0];
        _0xf943x35(_0xf943xf, _0xf943x11, 4, _0xf943x13)
    });
    $('#hot-section .widget-content')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943x10 = _0xf943xf['text']()['trim'](),
            _0xf943x11 = _0xf943x10['toLowerCase'](),
            _0xf943x12 = _0xf943x10['split']('/'),
            _0xf943x13 = _0xf943x12[0];
        _0xf943x35(_0xf943xf, _0xf943x11, 4, _0xf943x13)
    });
    $('.featured-posts .widget-content')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943xload = function () {
                if (_0xf943xf['data']('feedLoaded')) {
                    return
                };
                _0xf943xf['data']('feedLoaded', true);
                var _0xf943x10 = _0xf943xf['text']()['trim'](),
                    _0xf943x11 = _0xf943x10['toLowerCase'](),
                    _0xf943x12 = _0xf943x10['split']('/');
                if (_0xf943x11['match']('feat-big')) {
                    var _0xf943x1b = 5,
                        _0xf943x13 = _0xf943x12[0]
                } else {
                    _0xf943x1b = _0xf943x12[0], _0xf943x13 = _0xf943x12[1]
                };
                _0xf943x35(_0xf943xf, _0xf943x11, _0xf943x1b, _0xf943x13)
            };
        if ('IntersectionObserver' in window) {
            var _0xf943xio = new IntersectionObserver(function (_0xf943xentries) {
                if (_0xf943xentries[0]['isIntersecting']) {
                    _0xf943xio['disconnect']();
                    _0xf943xload()
                }
            }, {
                rootMargin: '400px 0px'
            });
            _0xf943xio['observe'](this)
        } else {
            _0xf943xload()
        }
    });
    $('.common-widget .widget-content')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943x10 = _0xf943xf['text']()['trim'](),
            _0xf943x11 = _0xf943x10['toLowerCase'](),
            _0xf943x12 = _0xf943x10['split']('/'),
            _0xf943x1b = _0xf943x12[0],
            _0xf943x13 = _0xf943x12[1];
        _0xf943x35(_0xf943xf, _0xf943x11, _0xf943x1b, _0xf943x13)
    });
    $('.related-ready')['each'](function () {
        var _0xf943xf = $(this),
            _0xf943x13 = _0xf943xf['find']('.related-tag')['data']('label');
        _0xf943x35(_0xf943xf, 'related', 3, _0xf943x13)
    });

    function _0xf943x1c(_0xf943x1d, _0xf943x4) {
        for (var _0xf943x1e = 0; _0xf943x1e < _0xf943x1d[_0xf943x4]['link']['length']; _0xf943x1e++) {
            if (_0xf943x1d[_0xf943x4]['link'][_0xf943x1e]['rel'] == 'alternate') {
                var _0xf943x1f = _0xf943x1d[_0xf943x4]['link'][_0xf943x1e]['href'];
                break
            }
        };
        return _0xf943x1f
    }

    function _0xf943x20(_0xf943x1d, _0xf943x4, _0xf943x1f) {
        var _0xf943x21 = _0xf943x1d[_0xf943x4]['title']['$t'],
            _0xf943x22 = '<a href="' + _0xf943x1f + '">' + _0xf943x21 + '</a>';
        return _0xf943x22
    }

    function _0xf943x23(_0xf943x1d, _0xf943x4) {
        var _0xf943x21 = _0xf943x1d[_0xf943x4]['author'][0]['name']['$t'],
            _0xf943x22 = '<span class="post-author">' + _0xf943x21 + ' </span>';
        return _0xf943x22
    }

    function _0xf943x24(_0xf943x1d, _0xf943x4) {
        var _0xf943x25 = _0xf943x1d[_0xf943x4]['published']['$t'],
            _0xf943x26 = _0xf943x25['substring'](0, 4),
            _0xf943x27 = _0xf943x25['substring'](5, 7),
            _0xf943x28 = _0xf943x25['substring'](8, 10),
            _0xf943x29 = monthFormat[parseInt(_0xf943x27, 10) - 1] + ' ' + _0xf943x28 + ', ' + _0xf943x26,
            _0xf943x22 = '<span class="post-date">' + _0xf943x29 + '</span>';
        return _0xf943x22
    }

    function _0xf943x2a(_0xf943x1d, _0xf943x4) {
        var _0xf943x21 = _0xf943x1d[_0xf943x4]['title']['$t'],
            _0xf943x2b = _0xf943x1d[_0xf943x4]['content']['$t'];
        if ('media$thumbnail' in _0xf943x1d[_0xf943x4]) {
            var _0xf943x2c = _0xf943x1d[_0xf943x4]['media$thumbnail']['url'],
                _0xf943x2d = _0xf943x2c['replace']('/s72-c', '/w640'),
                _0xf943x2e = _0xf943x2c['replace']('/s72-c', '/w280'),
                _0xf943x2f = _0xf943x2c['replace']('/s72-c', '/w100');
            if (_0xf943x2b['indexOf']('youtube.com/embed') > -1) {
                _0xf943x2d = _0xf943x2c['replace']('/default.', '/hqdefault.');
                _0xf943x2e = _0xf943x2c['replace']('/default.', '/mqdefault.');
                _0xf943x2f = _0xf943x2c
            }
        } else {
            _0xf943x2d = noThumbnail;
            _0xf943x2e = noThumbnail['replace']('/s680', '/w280');
            _0xf943x2f = noThumbnail['replace']('/s680', '/w100')
        };
        var _0xf943x5 = '<img class="post-thumb" loading="lazy" decoding="async" alt="' + _0xf943x21 + '" src="' + _0xf943x2d + '"/>',
            _0xf943x7 = '<img class="post-thumb" loading="lazy" decoding="async" alt="' + _0xf943x21 + '" src="' + _0xf943x2e + '"/>',
            _0xf943xa = '<img class="post-thumb" loading="lazy" decoding="async" alt="' + _0xf943x21 + '" src="' + _0xf943x2f + '"/>',
            _0xf943x22 = [_0xf943x5, _0xf943x7, _0xf943xa];
        return _0xf943x22
    }

    function _0xf943x30(_0xf943x1d, _0xf943x4) {
        if (_0xf943x1d[_0xf943x4]['category'] != undefined) {
            var _0xf943x31 = _0xf943x1d[_0xf943x4]['category'][0]['term'],
                _0xf943x22 = '<span class="post-tag">' + _0xf943x31 + '</span>'
        } else {
            _0xf943x22 = ''
        };
        return _0xf943x22
    }

    function _0xf943x32(_0xf943x1d, _0xf943x4) {
        var _0xf943x2b = _0xf943x1d[_0xf943x4]['content']['$t'],
            _0xf943x33 = $('<div>')['html'](_0xf943x2b),
            _0xf943x34 = _0xf943x33['text']()['trim']()['substr'](0, 86),
            _0xf943x22 = '<p class="post-snippet">' + _0xf943x34 + '…</p>';
        return _0xf943x22
    }

    function _0xf943x35(_0xf943xf, _0xf943x11, _0xf943x1b, _0xf943x13) {
        if (_0xf943x11['match']('mega-menu') || _0xf943x11['match']('hot-posts') || _0xf943x11['match']('feat-big') || _0xf943x11['match']('col-left') || _0xf943x11['match']('col-right') || _0xf943x11['match']('grid-small') || _0xf943x11['match']('grid-big') || _0xf943x11['match']('feat-list') || _0xf943x11['match']('post-list') || _0xf943x11['match']('related')) {
            var _0xf943x36 = '';
            if (_0xf943x13 == 'recent') {
                _0xf943x36 = '/feeds/posts/default?alt=json-in-script&max-results=' + _0xf943x1b
            } else {
                if (_0xf943x13 == 'random') {
                    var _0xf943x37 = Math['floor'](Math['random']() * _0xf943x1b) + 1;
                    _0xf943x36 = '/feeds/posts/default?max-results=' + _0xf943x1b + '&start-index=' + _0xf943x37 + '&alt=json-in-script'
                } else {
                    _0xf943x36 = '/feeds/posts/default/-/' + _0xf943x13 + '?alt=json-in-script&max-results=' + _0xf943x1b
                }
            };
            $['ajax']({
                url: _0xf943x36,
                type: 'get',
                dataType: 'jsonp',
                beforeSend: function () {
                    if (_0xf943x11['match']('hot-posts')) {
                        _0xf943xf['html']('<div class="hot-loader"/>')['parent']()['addClass']('show-hot')
                    }
                },
                success: function (_0xf943x38) {
                    if (_0xf943x11['match']('mega-menu')) {
                        var _0xf943x39 = '<ul class="mega-menu-inner">'
                    } else {
                        if (_0xf943x11['match']('hot-posts')) {
                            var _0xf943x39 = '<ul class="hot-posts">'
                        } else {
                            if (_0xf943x11['match']('feat-big')) {
                                var _0xf943x39 = '<ul class="feat-big">'
                            } else {
                                if (_0xf943x11['match']('col-right') || _0xf943x11['match']('col-left')) {
                                    var _0xf943x39 = '<ul class="feat-col">'
                                } else {
                                    if (_0xf943x11['match']('grid-small')) {
                                        var _0xf943x39 = '<ul class="grid-small">'
                                    } else {
                                        if (_0xf943x11['match']('grid-big')) {
                                            var _0xf943x39 = '<ul class="grid-big">'
                                        } else {
                                            if (_0xf943x11['match']('feat-list')) {
                                                var _0xf943x39 = '<ul class="feat-list">'
                                            } else {
                                                if (_0xf943x11['match']('post-list')) {
                                                    var _0xf943x39 = '<ul class="custom-widget">'
                                                } else {
                                                    if (_0xf943x11['match']('related')) {
                                                        var _0xf943x39 = '<ul class="related-posts">'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    var _0xf943x3a = _0xf943x38['feed']['entry'];
                    if (_0xf943x3a != undefined) {
                        for (var _0xf943x4 = 0, _0xf943x1d = _0xf943x3a; _0xf943x4 < _0xf943x1d['length']; _0xf943x4++) {
                            var _0xf943x1f = _0xf943x1c(_0xf943x1d, _0xf943x4),
                                _0xf943x18 = _0xf943x20(_0xf943x1d, _0xf943x4, _0xf943x1f),
                                _0xf943x3b = _0xf943x2a(_0xf943x1d, _0xf943x4),
                                _0xf943x31 = _0xf943x30(_0xf943x1d, _0xf943x4),
                                _0xf943x3c = _0xf943x23(_0xf943x1d, _0xf943x4),
                                _0xf943x3d = _0xf943x24(_0xf943x1d, _0xf943x4),
                                _0xf943x3e = _0xf943x32(_0xf943x1d, _0xf943x4);
                            var _0xf943x3f = '';
                            if (_0xf943x11['match']('mega-menu')) {
                                _0xf943x3f += '<div class="mega-item item-' + _0xf943x4 + '"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[1] + '</a></div><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></div></div>'
                            } else {
                                if (_0xf943x11['match']('hot-posts')) {
                                    if (_0xf943x4 == 0) {
                                        _0xf943x3f += '<li class="hot-item item-' + _0xf943x4 + '"><div class="hot-item-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a><div class="post-info">' + _0xf943x31 + '<h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3c + _0xf943x3d + '</div></div></div></li>'
                                    } else {
                                        _0xf943x3f += '<li class="hot-item item-' + _0xf943x4 + '"><div class="hot-item-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a><div class="post-info">' + _0xf943x31 + '<h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></div></div></li>'
                                    }
                                } else {
                                    if (_0xf943x11['match']('feat-big')) {
                                        if (_0xf943x4 == 0) {
                                            _0xf943x3f += '<li class="feat-item item-big item-' + _0xf943x4 + '"><div class="feat-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a>' + _0xf943x31 + '<div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3c + _0xf943x3d + '</div>' + _0xf943x3e + '</div></div></li>'
                                        } else {
                                            _0xf943x3f += '<li class="feat-item item-small item-' + _0xf943x4 + '"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[1] + '</a><div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></div></li>'
                                        }
                                    } else {
                                        if (_0xf943x11['match']('col-left') || _0xf943x11['match']('col-right')) {
                                            if (_0xf943x4 == 0) {
                                                _0xf943x3f += '<li class="feat-item item-big item-' + _0xf943x4 + '"><div class="feat-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a>' + _0xf943x31 + '<div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3c + _0xf943x3d + '</div>' + _0xf943x3e + '</div></div></li>'
                                            } else {
                                                _0xf943x3f += '<li class="feat-item item-small item-' + _0xf943x4 + '"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[2] + '</a><div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></div></li>'
                                            }
                                        } else {
                                            if (_0xf943x11['match']('grid-small')) {
                                                _0xf943x3f += '<li class="feat-item item-small item-' + _0xf943x4 + '"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[1] + '</a><div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2>' + _0xf943x3e + '<div class="post-meta">' + _0xf943x3d + '</div></div></li>'
                                            } else {
                                                if (_0xf943x11['match']('grid-big')) {
                                                    _0xf943x3f += '<li class="feat-item item-big item-' + _0xf943x4 + '"><div class="feat-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a>' + _0xf943x31 + '<div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3c + _0xf943x3d + '</div>' + _0xf943x3e + '</div></div></li>'
                                                } else {
                                                    if (_0xf943x11['match']('feat-list')) {
                                                        _0xf943x3f += '<li class="feat-item item-' + _0xf943x4 + '"><div class="feat-inner"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[0] + '</a>' + _0xf943x31 + '<div class="post-info"><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3c + _0xf943x3d + '</div>' + _0xf943x3e + '</div></div></li>'
                                                    } else {
                                                        if (_0xf943x11['match']('post-list')) {
                                                            _0xf943x3f += '<li class="item-' + _0xf943x4 + '"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[2] + '</a><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></div></li>'
                                                        } else {
                                                            if (_0xf943x11['match']('related')) {
                                                                _0xf943x3f += '<li class="related-item item-' + _0xf943x4 + '"><a class="post-image-link" href="' + _0xf943x1f + '">' + _0xf943x3b[1] + '</a><h2 class="post-title">' + _0xf943x18 + '</h2><div class="post-meta">' + _0xf943x3d + '</div></li>'
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                            _0xf943x39 += _0xf943x3f
                        };
                        _0xf943x39 += '</ul>'
                    } else {
                        _0xf943x39 = '<ul class="no-posts">Error: No Posts Found <i class="fa-solid fa-frown"/></ul>'
                    };
                    if (_0xf943x11['match']('mega-menu')) {
                        _0xf943xf['addClass']('has-sub mega-menu')['append'](_0xf943x39);
                        _0xf943xf['find']('a:first')['attr']('href', function (_0xf943xf, _0xf943x14) {
                            if (_0xf943x13 == 'recent' || _0xf943x13 == 'random') {
                                _0xf943x14 = _0xf943x14['replace'](_0xf943x14, '/search/?&max-results=' + postPerPage)
                            } else {
                                _0xf943x14 = _0xf943x14['replace'](_0xf943x14, '/search/label/' + _0xf943x13 + '?&max-results=' + postPerPage)
                            };
                            return _0xf943x14
                        })
                    } else {
                        if (_0xf943x11['match']('hot-posts')) {
                            _0xf943xf['html'](_0xf943x39)['parent']()['addClass']('show-hot')
                        } else {
                            if (_0xf943x11['match']('feat-big') || _0xf943x11['match']('feat-list') || _0xf943x11['match']('col-left') || _0xf943x11['match']('col-right') || _0xf943x11['match']('grid-small') || _0xf943x11['match']('grid-big')) {
                                _0xf943xf['parent']()['find']('.widget-title')['append']('<a class="view-all" href="/search/label/' + _0xf943x13 + '?&max-results=' + postPerPage + '">' + messages['viewAll'] + '</a>');
                                if (_0xf943x11['match']('col-left') || _0xf943x11['match']('col-right')) {
                                    if (_0xf943x11['match']('col-right')) {
                                        _0xf943xf['parent']()['addClass']('col-right')
                                    };
                                    _0xf943xf['parent']()['addClass']('col-width')
                                };
                                _0xf943xf['html'](_0xf943x39)['parent']()['addClass']('show-widget')
                            } else {
                                _0xf943xf['html'](_0xf943x39)
                            }
                        }
                    }
                }
            })
        }
    }
    $('.blog-post-comments')['each'](function () {
        var _0xf943x40 = commentsSystem,
            _0xf943x41 = disqus_blogger_current_url,
            _0xf943x42 = '<div id="disqus_thread"/>',
            _0xf943x43 = $(location)['attr']('href'),
            _0xf943x44 = '<div class="fb-comments" data-width="100%" data-href="' + _0xf943x43 + '" data-numposts="5"></div>',
            _0xf943x45 = 'comments-system-' + _0xf943x40;
        if (_0xf943x40 == 'blogger') {
            $(this)['addClass'](_0xf943x45)['show']()
        } else {
            if (_0xf943x40 == 'disqus') {
                (function () {
                    var _0xf943x46 = document['createElement']('script');
                    _0xf943x46['type'] = 'text/javascript';
                    _0xf943x46['async'] = true;
                    _0xf943x46['src'] = '//' + disqusShortname + '.disqus.com/embed.js';
                    (document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0])['appendChild'](_0xf943x46)
                })();
                $('#comments, #gpluscomments')['remove']();
                $(this)['append'](_0xf943x42)['addClass'](_0xf943x45)['show']()
            } else {
                if (_0xf943x40 == 'facebook') {
                    $('#comments, #gpluscomments')['remove']();
                    $(this)['append'](_0xf943x44)['addClass'](_0xf943x45)['show']()
                } else {
                    if (_0xf943x40 == 'hide') {
                        $(this)['hide']()
                    } else {
                        $(this)['addClass']('comments-system-default')['show']()
                    }
                }
            }
        }
    })
})
