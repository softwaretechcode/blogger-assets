/*!
 * SoftTwinPlus 1.0.0 - post-tools.js
 *
 * Post content enhancements, loaded on post/page views only:
 *   - Table of contents built from the post headings (collapsible, numbered)
 *   - Code blocks with a language label, copy button and optional Prism highlighting
 *   - Reading time appended to the byline
 *   - Image lightbox for post images
 *   - Heading anchor links
 *   - Responsive table wrapper
 *   - External links open in a new tab
 *   - Reading progress bar
 *
 * Per-post opt-out: add an element with class "no-post-tools" anywhere in the
 * post body (e.g. <span class="no-post-tools"></span>).
 * Individual elements can opt out with "no-toc", "no-code-tools", "no-lightbox".
 *
 * Override defaults before this file loads:
 *   window.softtwinPostTools = { tocTitle: 'On this page', syntaxHighlight: false };
 */
(function () {
    'use strict';

    var config = window.softtwinPostTools || {};

    var TOC_TITLE = config.tocTitle || 'Table of Contents';
    var TOC_MIN_HEADINGS = config.tocMinHeadings || 3;
    var WORDS_PER_MINUTE = config.wordsPerMinute || 200;
    var ENABLE_HIGHLIGHT = config.syntaxHighlight !== false;
    var PRISM_CDN = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0';
    var HEADER_OFFSET = 84;

    // Pretty names for the code block toolbar.
    var LANGUAGE_NAMES = {
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        jsx: 'JSX',
        tsx: 'TSX',
        python: 'Python',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        csharp: 'C#',
        php: 'PHP',
        ruby: 'Ruby',
        go: 'Go',
        rust: 'Rust',
        kotlin: 'Kotlin',
        swift: 'Swift',
        sql: 'SQL',
        bash: 'Bash',
        powershell: 'PowerShell',
        markup: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        json: 'JSON',
        yaml: 'YAML',
        markdown: 'Markdown',
        diff: 'Diff'
    };

    // Common aliases used by Blogger posts and highlighters.
    var LANGUAGE_ALIASES = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        rb: 'ruby',
        sh: 'bash',
        shell: 'bash',
        zsh: 'bash',
        ps1: 'powershell',
        'c++': 'cpp',
        'c#': 'csharp',
        cs: 'csharp',
        html: 'markup',
        htm: 'markup',
        xml: 'markup',
        svg: 'markup',
        yml: 'yaml',
        md: 'markdown',
        golang: 'go',
        'objective-c': 'objectivec'
    };

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function loadScript(src, done) {
        var script = document.createElement('script');

        script.src = src;
        script.async = true;
        script.onload = done || function () {};
        script.onerror = function () {};
        document.head.appendChild(script);
    }

    function textOf(node) {
        return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }

    /* ---------------------------------------------------------------------
     * Reading time
     * ------------------------------------------------------------------ */

    function addReadingTime(body) {
        var clone = body.cloneNode(true);
        var removable = clone.querySelectorAll('pre, code, .post-toc, .related-ready, .related-posts, script, style, .no-post-tools');
        var i;

        for (i = 0; i < removable.length; i++) {
            if (removable[i].parentNode) {
                removable[i].parentNode.removeChild(removable[i]);
            }
        }

        var words = textOf(clone).split(' ').length;
        if (!words) {
            return;
        }

        var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
        var meta = document.querySelector('.item-post .post-header-line-1') ||
            document.querySelector('.item-post .post-meta');

        if (!meta) {
            return;
        }

        var span = document.createElement('span');

        span.className = 'post-reading-time';
        span.textContent = minutes + ' min read';
        if (textOf(meta)) {
            span.className += ' has-separator';
        }
        meta.appendChild(span);
    }

    /* ---------------------------------------------------------------------
     * Code blocks
     * ------------------------------------------------------------------ */

    function normalizeLanguage(name) {
        var key = (name || '').toLowerCase().trim().replace(/^language-/, '');

        return LANGUAGE_ALIASES[key] || key;
    }

    function detectLanguage(pre) {
        var nodes = [pre];
        var code = pre.querySelector('code');

        if (code) {
            nodes.push(code);
        }

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var data = node.getAttribute('data-lang') || node.getAttribute('data-language');

            if (data) {
                return normalizeLanguage(data);
            }

            var className = node.className || '';
            var match = className.match(/language-([\w+#.-]+)/i) ||
                className.match(/\blang-([\w+#.-]+)/i) ||
                className.match(/brush:\s*([\w+#.-]+)/i);

            if (match) {
                return normalizeLanguage(match[1]);
            }
        }

        return '';
    }

    function ensureCodeElement(pre, language) {
        var code = pre.querySelector('code');

        if (!code) {
            code = document.createElement('code');
            while (pre.firstChild) {
                code.appendChild(pre.firstChild);
            }
            pre.appendChild(code);
        }

        if (language && !/\blanguage-/.test(code.className)) {
            code.className += ' language-' + language;
        }

        return code;
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () {
                return true;
            }, function () {
                return false;
            });
        }

        var area = document.createElement('textarea');

        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();

        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (error) {
            ok = false;
        }
        document.body.removeChild(area);

        return Promise.resolve(ok);
    }

    function applyPrism() {
        if (window.__softtwinPrismLoaded) {
            return;
        }
        window.__softtwinPrismLoaded = true;

        // Prism may already be on the page.
        if (window.Prism && window.Prism.highlightAll) {
            Prism.highlightAll();
            return;
        }

        window.Prism = window.Prism || {};
        window.Prism.manual = true;

        loadScript(PRISM_CDN + '/components/prism-core.min.js', function () {
            loadScript(PRISM_CDN + '/plugins/autoloader/prism-autoloader.min.js', function () {
                if (window.Prism && Prism.plugins && Prism.plugins.autoloader) {
                    Prism.plugins.autoloader.languages_path = PRISM_CDN + '/components/';
                }
                if (window.Prism && Prism.highlightAll) {
                    Prism.highlightAll();
                }
            });
        });
    }

    function enhanceCodeBlocks(body) {
        var blocks = body.querySelectorAll('pre');
        var hasLanguage = false;

        for (var i = 0; i < blocks.length; i++) {
            var pre = blocks[i];
            var parent = pre.parentNode;

            if (parent && parent.classList && parent.classList.contains('code-block')) {
                continue;
            }
            if (pre.closest('.no-post-tools, .no-code-tools')) {
                continue;
            }

            var language = detectLanguage(pre);
            var label = language ? (LANGUAGE_NAMES[language] || language) : 'Code';

            ensureCodeElement(pre, language);
            if (language) {
                hasLanguage = true;
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'code-block';

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            var toolbar = document.createElement('div');
            toolbar.className = 'code-toolbar';

            var langLabel = document.createElement('span');
            langLabel.className = 'code-lang';
            langLabel.textContent = label;
            toolbar.appendChild(langLabel);

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'code-copy';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            toolbar.appendChild(button);

            wrapper.insertBefore(toolbar, pre);

            (function (preNode, buttonNode) {
                var resetTimer = null;

                buttonNode.addEventListener('click', function () {
                    var text = preNode.innerText || preNode.textContent || '';

                    copyText(text).then(function (ok) {
                        buttonNode.textContent = ok ? 'Copied' : 'Ctrl+C';
                        buttonNode.classList.toggle('is-done', ok);

                        clearTimeout(resetTimer);
                        resetTimer = setTimeout(function () {
                            buttonNode.textContent = 'Copy';
                            buttonNode.classList.remove('is-done');
                        }, 1600);
                    });
                });
            })(pre, button);
        }

        if (hasLanguage && ENABLE_HIGHLIGHT) {
            // Give the page a moment to paint before adding Prism.
            setTimeout(applyPrism, 250);
        }
    }

    /* ---------------------------------------------------------------------
     * Tables
     * ------------------------------------------------------------------ */

    function enhanceTables(body) {
        var tables = body.querySelectorAll('table');

        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var parent = table.parentNode;

            if (parent && parent.classList && parent.classList.contains('table-wrap')) {
                continue;
            }

            var wrap = document.createElement('div');

            wrap.className = 'table-wrap';
            wrap.setAttribute('tabindex', '0');
            wrap.setAttribute('role', 'region');
            wrap.setAttribute('aria-label', 'Scrollable table');

            parent.insertBefore(wrap, table);
            wrap.appendChild(table);
        }
    }

    /* ---------------------------------------------------------------------
     * External links
     * ------------------------------------------------------------------ */

    function enhanceLinks(body) {
        var host = window.location.hostname.replace(/^www\./, '');
        var links = body.querySelectorAll('a[href]');

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.getAttribute('href') || '';

            if (!/^https?:\/\//i.test(href)) {
                continue;
            }
            if (link.closest('.no-post-tools')) {
                continue;
            }

            var linkHost;
            try {
                linkHost = new URL(href, window.location.href).hostname.replace(/^www\./, '');
            } catch (error) {
                continue;
            }

            if (linkHost && linkHost !== host) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                if (textOf(link)) {
                    link.className += (link.className ? ' ' : '') + 'ext-link';
                }
            }
        }
    }

    /* ---------------------------------------------------------------------
     * Image lightbox
     * ------------------------------------------------------------------ */

    var lightbox = null;

    function closeLightbox() {
        if (!lightbox) {
            return;
        }
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        lightbox.querySelector('img').removeAttribute('src');
    }

    function createLightbox() {
        lightbox = document.createElement('div');
        lightbox.className = 'img-lightbox';
        lightbox.hidden = true;
        lightbox.innerHTML = '<button type="button" class="img-lightbox-close" aria-label="Close image">&times;</button>' +
            '<img alt="">';

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        lightbox.querySelector('.img-lightbox-close').addEventListener('click', closeLightbox);
        document.body.appendChild(lightbox);

        document.addEventListener('keyup', function (event) {
            if (event.key === 'Escape') {
                closeLightbox();
            }
        });
    }

    function openLightbox(src, alt) {
        if (!lightbox) {
            createLightbox();
        }

        var image = lightbox.querySelector('img');

        image.src = src;
        image.alt = alt || '';
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
    }

    function isImageUrl(url) {
        return /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|#|$)/i.test(url) || /^data:image\//i.test(url);
    }

    function enhanceImages(body) {
        var images = body.querySelectorAll('img');

        for (var i = 0; i < images.length; i++) {
            var image = images[i];

            if (image.closest('.no-post-tools, .no-lightbox, .post-toc')) {
                continue;
            }

            var link = image.closest('a');
            if (link) {
                var href = link.getAttribute('href') || '';
                if (!isImageUrl(href)) {
                    continue;
                }

                (function (linkNode) {
                    linkNode.addEventListener('click', function (event) {
                        event.preventDefault();
                        openLightbox(image.currentSrc || image.src, image.alt);
                    });
                })(link);

                image.classList.add('is-zoomable');
                continue;
            }

            (function (imageNode) {
                imageNode.classList.add('is-zoomable');
                imageNode.addEventListener('click', function () {
                    if (imageNode.width && imageNode.width < 120) {
                        return;
                    }
                    openLightbox(imageNode.currentSrc || imageNode.src, imageNode.alt);
                });
            })(image);
        }
    }

    /* ---------------------------------------------------------------------
     * Table of contents
     * ------------------------------------------------------------------ */

    function slugify(text) {
        return text.toLowerCase().trim()
            .replace(/['"\u2018\u2019\u201C\u201D]/g, '')
            .replace(/[^\w\u00C0-\uFFFF\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function buildToc(body) {
        if (body.querySelector('.post-toc')) {
            return;
        }

        var headings = body.querySelectorAll('h1, h2, h3, h4');
        var items = [];
        var usedIds = {};
        var minLevel = 6;
        var i;

        for (i = 0; i < headings.length; i++) {
            var heading = headings[i];
            var text = textOf(heading);

            if (!text) {
                continue;
            }
            if (heading.closest('.no-post-tools, .no-toc, .post-toc, .related-ready, .related-posts, .related-item')) {
                continue;
            }

            var level = parseInt(heading.tagName.charAt(1), 10);
            var id = heading.id || slugify(text) || 'section-' + (i + 1);

            if (usedIds[id]) {
                usedIds[id] += 1;
                id = id + '-' + usedIds[id];
            } else {
                usedIds[id] = 1;
            }
            heading.id = id;

            items.push({ id: id, text: text, level: level, element: heading });
            if (level < minLevel) {
                minLevel = level;
            }
        }

        if (items.length < TOC_MIN_HEADINGS) {
            return;
        }

        // Numbering: 1, 1.1, 1.2, 2, ...
        var counters = [0, 0, 0, 0, 0, 0];
        for (i = 0; i < items.length; i++) {
            var item = items[i];
            var level2;

            counters[item.level] += 1;
            for (level2 = item.level + 1; level2 <= 6; level2++) {
                counters[level2] = 0;
            }

            var parts = [];
            for (level2 = minLevel; level2 <= item.level; level2++) {
                parts.push(counters[level2] || 1);
            }
            item.number = parts.join('.');
            item.depth = item.level - minLevel + 1;
        }

        var nav = document.createElement('nav');
        nav.className = 'post-toc';
        nav.setAttribute('aria-label', TOC_TITLE);

        var head = document.createElement('div');
        head.className = 'toc-head';

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'toc-toggle';
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-controls', 'post-toc-body');
        toggle.innerHTML =
            '<span class="toc-title"></span>' +
            '<span class="toc-count"></span>' +
            '<svg class="toc-chevron" viewBox="0 0 16 16" aria-hidden="true">' +
            '<path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg>';
        toggle.querySelector('.toc-title').textContent = TOC_TITLE;
        toggle.querySelector('.toc-count').textContent = items.length + ' sections';
        head.appendChild(toggle);
        nav.appendChild(head);

        var tocBody = document.createElement('div');
        tocBody.className = 'toc-body';
        tocBody.id = 'post-toc-body';

        var list = document.createElement('ol');
        list.className = 'toc-list';
        var links = [];

        for (i = 0; i < items.length; i++) {
            var entry = items[i];
            var li = document.createElement('li');
            var link = document.createElement('a');
            var number = document.createElement('span');
            var label = document.createElement('span');

            li.className = 'toc-l' + entry.depth;
            link.href = '#' + entry.id;
            link.setAttribute('data-target', entry.id);

            number.className = 'toc-num';
            number.textContent = entry.number;
            label.className = 'toc-text';
            label.textContent = entry.text;

            link.appendChild(number);
            link.appendChild(label);
            li.appendChild(link);
            list.appendChild(li);
            links.push(link);

            // Permalink beside the heading itself.
            var anchor = document.createElement('a');
            anchor.className = 'heading-anchor';
            anchor.href = '#' + entry.id;
            anchor.setAttribute('aria-label', 'Link to this section');
            anchor.textContent = '#';
            entry.element.appendChild(anchor);
        }

        tocBody.appendChild(list);
        nav.appendChild(tocBody);

        // Place the TOC after the intro paragraph, or at the top of the post.
        var insertPoint = body.firstChild;
        var children = body.children;
        for (i = 0; i < children.length; i++) {
            var child = children[i];
            if (child === items[0].element || child.contains(items[0].element)) {
                break;
            }
            if (child.tagName === 'P' && textOf(child).length > 100) {
                insertPoint = child.nextSibling;
            }
        }
        body.insertBefore(nav, insertPoint);

        // Collapsed by default on small screens.
        if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) {
            nav.classList.add('is-collapsed');
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function () {
            var collapsed = nav.classList.toggle('is-collapsed');

            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        });

        function setActive(activeLink) {
            for (var j = 0; j < links.length; j++) {
                links[j].classList.toggle('is-active', links[j] === activeLink);
            }
        }

        for (i = 0; i < links.length; i++) {
            (function (linkNode, id) {
                linkNode.addEventListener('click', function (event) {
                    var target = document.getElementById(id);

                    if (!target) {
                        return;
                    }
                    event.preventDefault();

                    var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                    if (window.history && history.replaceState) {
                        history.replaceState(null, '', '#' + id);
                    }
                    setActive(linkNode);
                });
            })(links[i], items[i].id);
        }

        // Highlight the section currently being read.
        var ticking = false;
        function updateActiveSection() {
            ticking = false;

            var active = null;
            for (var j = 0; j < items.length; j++) {
                if (items[j].element.getBoundingClientRect().top <= HEADER_OFFSET + 20) {
                    active = links[j];
                }
            }
            if (active) {
                setActive(active);
            }
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateActiveSection);
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
     * Reading progress bar
     * ------------------------------------------------------------------ */

    function addProgressBar(body) {
        var bar = document.createElement('div');
        var fill = document.createElement('span');

        bar.className = 'post-progress';
        bar.setAttribute('aria-hidden', 'true');
        bar.appendChild(fill);
        document.body.appendChild(bar);

        var bodyTop = 0;
        var bodyHeight = 1;

        function measure() {
            var rect = body.getBoundingClientRect();

            bodyTop = rect.top + window.pageYOffset;
            bodyHeight = body.offsetHeight;
        }

        function update() {
            var start = bodyTop - HEADER_OFFSET;
            var end = bodyTop + bodyHeight - window.innerHeight + HEADER_OFFSET;
            var progress = 0;

            if (end > start) {
                progress = (window.pageYOffset - start) / (end - start);
            }
            progress = Math.max(0, Math.min(1, progress));
            fill.style.width = (progress * 100).toFixed(2) + '%';
        }

        measure();
        update();

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', function () {
            measure();
            update();
        });
    }

    /* ---------------------------------------------------------------------
     * Boot
     * ------------------------------------------------------------------ */

    onReady(function () {
        var body = document.querySelector('.item-post .post-body');

        if (!body || body.querySelector('.no-post-tools')) {
            return;
        }

        // Reading time first: the TOC would otherwise be counted as content.
        addReadingTime(body);
        enhanceCodeBlocks(body);
        enhanceTables(body);
        enhanceLinks(body);
        enhanceImages(body);
        buildToc(body);
        addProgressBar(body);
    });
})();
