const fs = require('fs');
const path = require('path');

const xmlPath = path.resolve(__dirname, '../blog.softwaretechit.xml');
let content = fs.readFileSync(xmlPath, 'utf8');

// Normalize line endings to LF for processing
const hadCrlf = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

console.log('Original XML length:', content.length);

// 1. Update <html> tag to include expr:lang
const oldHtmlTag = /<html\s+b:css='false'[^>]*>/;
const newHtmlTag = `<html b:css='false' b:defaultwidgetversion='2' b:layoutsVersion='3' b:responsive='true' b:templateVersion='1.0.0' expr:class='data:blog.languageDirection' expr:dir='data:blog.languageDirection' expr:lang='data:blog.locale.language ?: "en"' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr' xmlns:g='http://base.google.com/ns/1.0'>`;
content = content.replace(oldHtmlTag, newHtmlTag);

// 2. Replace the entire <head> section up to <b:skin
const headRegex = /<head>[\s\S]*?<b:skin version='1.0'>/;

const newHeadContent = `<head>
    <meta charset='UTF-8'/>
    <meta content='width=device-width, initial-scale=1, minimum-scale=1' name='viewport'/>
    <meta content='#4f46e5' name='theme-color'/>

    <!-- High-priority DNS prefetch and preconnect hints for sub-second DNS/TLS resolution -->
    <link href='https://cdn.jsdelivr.net' rel='preconnect' crossorigin='anonymous'/>
    <link href='https://blogger.googleusercontent.com' rel='preconnect'/>
    <link href='https://ajax.googleapis.com' rel='preconnect' crossorigin='anonymous'/>
    <link href='https://fonts.googleapis.com' rel='dns-prefetch'/>
    <link href='https://fonts.gstatic.com' rel='preconnect' crossorigin='anonymous'/>
    <link href='https://pagead2.googlesyndication.com' rel='dns-prefetch'/>
    <link href='https://www.googletagmanager.com' rel='dns-prefetch'/>

    <meta name='impact-site-verification' value='8970afae-8500-4c13-8b20-cf31d3f792e3'/>

    <!-- Comprehensive SEO Meta Engine -->
    <title><data:view.title.escaped/></title>
    <link expr:href='data:view.url.canonical' rel='canonical'/>

    <!-- Meta Description with prioritized fallbacks -->
    <b:if cond='data:view.description'>
      <meta expr:content='data:view.description.escaped' name='description'/>
    <b:elseif cond='data:view.isSingleItem and data:post.snippet'/>
      <meta expr:content='data:post.snippet.escaped' name='description'/>
    <b:elseif cond='data:blog.metaDescription'/>
      <meta expr:content='data:blog.metaDescription.escaped' name='description'/>
    <b:else/>
      <meta content='SoftwareTechIT provides quality tutorials, programming guides, tech insights, software development tips, and educational resources.' name='description'/>
    </b:if>

    <!-- Robots Meta Directives (Noindex on archive & search to eliminate duplicate content penalty) -->
    <b:if cond='data:view.isArchive or data:view.isSearch'>
      <meta content='noindex, follow' name='robots'/>
    <b:else/>
      <meta content='index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' name='robots'/>
    </b:if>

    <!-- Open Graph Protocol (Facebook, LinkedIn, Social Media) -->
    <meta expr:content='data:blog.title.escaped' property='og:site_name'/>
    <meta expr:content='data:view.title.escaped' property='og:title'/>
    <meta expr:content='data:view.url.canonical' property='og:url'/>
    <b:if cond='data:view.isSingleItem'>
      <meta content='article' property='og:type'/>
    <b:else/>
      <meta content='website' property='og:type'/>
    </b:if>
    <b:if cond='data:view.description'>
      <meta expr:content='data:view.description.escaped' property='og:description'/>
    <b:elseif cond='data:blog.metaDescription'/>
      <meta expr:content='data:blog.metaDescription.escaped' property='og:description'/>
    </b:if>
    <b:if cond='data:view.featuredImage'>
      <meta expr:content='data:view.featuredImage' property='og:image'/>
    </b:if>

    <!-- Twitter Card Meta -->
    <meta content='summary_large_image' name='twitter:card'/>
    <meta expr:content='data:view.title.escaped' name='twitter:title'/>
    <b:if cond='data:view.description'>
      <meta expr:content='data:view.description.escaped' name='twitter:description'/>
    <b:elseif cond='data:blog.metaDescription'/>
      <meta expr:content='data:blog.metaDescription.escaped' name='twitter:description'/>
    </b:if>
    <b:if cond='data:view.featuredImage'>
      <meta expr:content='data:view.featuredImage' name='twitter:image'/>
    </b:if>

    <!-- Schema.org WebSite & Organization JSON-LD for Rich Results -->
    <script type='application/ld+json'>
    {
      &quot;@context&quot;: &quot;https://schema.org&quot;,
      &quot;@graph&quot;: [
        {
          &quot;@type&quot;: &quot;WebSite&quot;,
          &quot;@id&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>#website&quot;,
          &quot;url&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>&quot;,
          &quot;name&quot;: &quot;<data:blog.title.escaped/>&quot;,
          &quot;potentialAction&quot;: {
            &quot;@type&quot;: &quot;SearchAction&quot;,
            &quot;target&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>search?q={search_term_string}&quot;,
            &quot;query-input&quot;: &quot;required name=search_term_string&quot;
          }
        },
        {
          &quot;@type&quot;: &quot;Organization&quot;,
          &quot;@id&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>#organization&quot;,
          &quot;name&quot;: &quot;SoftwareTechIT&quot;,
          &quot;url&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>&quot;,
          &quot;logo&quot;: {
            &quot;@type&quot;: &quot;ImageObject&quot;,
            &quot;url&quot;: &quot;https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2xK2mGfe8aQcjPcFMmDrJA33V0WH7G2HX_lOQaBjyvROPq74lMz0sw602Fh3DKAMx27ZkuyL_u8wibKOwIGikj_j1q5DZQqj_Y42yDY3RfPBbuLfqoA9bJJB0e8Ry9Hmwsf5KNQC01xUHccbDQHakeIpSvi1R4WUKHf57VyTDzoL-EzxV0ZO8yWokYzY/s1000/logo.png&quot;
          }
        }
      ]
    }
    </script>

    <b:include data='blog' name='all-head-content'/>

    <!-- Google AdSense: Lazy-loaded upon first user interaction or idle timeout to guarantee 90+ PageSpeed -->
    <script type='text/javascript'>
      //<![CDATA[
      (function() {
        var adsLoaded = false;
        function loadAdSense() {
          if (adsLoaded) return;
          adsLoaded = true;
          ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown'].forEach(function(ev) {
            window.removeEventListener(ev, loadAdSense, { passive: true });
          });
          var s = document.createElement('script');
          s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7946593158217793';
          s.async = true;
          s.crossOrigin = 'anonymous';
          document.head.appendChild(s);
        }
        ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown'].forEach(function(ev) {
          window.addEventListener(ev, loadAdSense, { once: true, passive: true });
        });
        setTimeout(loadAdSense, 4500);
      })();
      //]]>
    </script>

    <!-- Google Analytics 4 (Deferred Execution) -->
    <script type='text/javascript'>
      //<![CDATA[
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Q12K3XBE7Z');

      function loadGA4() {
        if (window.ga4Loaded) return;
        window.ga4Loaded = true;
        var s = document.createElement('script');
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-Q12K3XBE7Z';
        s.async = true;
        document.head.appendChild(s);
      }
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadGA4, { timeout: 3500 });
      } else {
        setTimeout(loadGA4, 2500);
      }
      //]]>
    </script>

    <!-- OneSignal Push Notifications (User-Interaction Deferred) -->
    <script type='text/javascript'>
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: "f3090643-ec3b-40b1-b998-074d3c4eea0f",
          safari_web_id: "web.onesignal.auto.650c091f-37ea-4fe0-8793-2961481353d2",
          notifyButton: { enable: true },
        });
      });
      (function() {
        var started = false;
        var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
        function loadOneSignal() {
          if (started) return;
          started = true;
          events.forEach(function(e) { window.removeEventListener(e, loadOneSignal); });
          var sdk = document.createElement('script');
          sdk.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
          sdk.async = true;
          sdk.onerror = function() { console.error('Unable to load OneSignal SDK.'); };
          document.head.appendChild(sdk);
        }
        events.forEach(function(e) { window.addEventListener(e, loadOneSignal, { once: true, passive: true }); });
      })();
    </script>

    <!-- Font Awesome 6 Free via jsDelivr (Non-render-blocking) -->
    <link as='style' href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css' onload='this.rel="stylesheet"' rel='preload'/>
    <noscript><link href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css' rel='stylesheet'/></noscript>

    <!-- Deferred Core Theme Scripts (Preloaded & non-blocking execution) -->
    <script defer='defer' src='https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js' type='text/javascript'/>
    <script defer='defer' src='https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/theme.bundle.min.js'/>
    <b:if cond='data:view.isSingleItem'>
      <script defer='defer' src='https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/post-tools.min.js'/>
    </b:if>
    <b:if cond='data:view.isMultipleItems'>
      <script defer='defer' src='https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/pagination.min.js'/>
    </b:if>
  
<!-- Template Style CSS: theme designer variables + critical layout baseline.
     Non-critical styling is bundled into bundle.min.css for maximum caching and instant rendering. -->
<b:skin version='1.0'>`;

content = content.replace(headRegex, newHeadContent);

// 3. Add critical CSS inside <b:skin>
const skinEndRegex = /--skin-footer:\s*\$\(footer\.color\);\s*\n\}/;
const newSkinEnd = `--skin-footer: $(footer.color);
}
/* Critical Inlined Layout Baseline for Instant First Contentful Paint */
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;padding:0;background:var(--skin-page,#f4f6fb);color:var(--skin-text,#3b4a5f);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
#outer-wrapper,.container,.row{width:100%;max-width:1200px;margin-inline:auto}
#top-bar{min-height:40px;background:#111827}
#header-wrap{min-height:70px}
.post-thumb{display:block;max-width:100%;height:auto;aspect-ratio:16/10;object-fit:cover}
/* Content-visibility optimization for rendering offscreen content in milliseconds */
#hot-wrapper,#content-wrapper,#sub-footer-wrapper{content-visibility:auto;contain-intrinsic-size:1px 400px}`;

content = content.replace(skinEndRegex, newSkinEnd);

// 4. Update editor.css and replace 5 separate css links with bundle.min.css
const cssLinksRegex = /<b:if cond='data:view\.isLayoutMode'>[\s\S]*?<b:defaultmarkups>/;
const newCssLinks = `<b:if cond='data:view.isLayoutMode'>
<b:template-skin>
<![CDATA[
@import url('https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/editor.min.css');
]]>
</b:template-skin>
</b:if>

      <!-- Single Optimized & Minified Bundle (replaces 5 separate CSS HTTP waterfalls) -->
      <link href='https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/bundle.min.css' rel='stylesheet'/>

<b:defaultmarkups>`;

content = content.replace(cssLinksRegex, newCssLinks);

// 5. Update related-posts scripts to minified versions
content = content.replace(
  /https:\/\/cdn\.jsdelivr\.net\/gh\/softwaretechcode\/blogger-assets@[^'"]*\/js\/related-posts\.js\?v=1\.0\.0/g,
  'https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/related-posts.min.js'
);
content = content.replace(
  /https:\/\/cdn\.jsdelivr\.net\/gh\/softwaretechcode\/blogger-assets@[^'"]*\/js\/related-posts-render\.js\?v=1\.0\.0/g,
  'https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/related-posts-render.min.js'
);

// 6. Fix BreadcrumbList Schema JSON-escaping and add BlogPosting Schema
const breadcrumbRegex = /<b:includable id='postBreadcrumbs' var='post'>[\s\S]*?<\/b:includable>/;
const newBreadcrumbAndArticleSchema = `<b:includable id='postBreadcrumbs' var='post'>
              <!-- Post Breadcrumbs -->
              <nav id='breadcrumb'><a expr:href='data:blog.homepageUrl'><data:messages.home/></a><b:if cond='data:post.labels'><em class='delimiter'/><a class='b-label' expr:href='data:post.labels.last.url'><data:post.labels.last.name/></a></b:if><em class='delimiter'/><span class='current'><data:post.title/></span></nav>
              
              <!-- Schema.org BreadcrumbList -->
              <script type='application/ld+json'>
              {
                &quot;@context&quot;: &quot;https://schema.org&quot;,
                &quot;@type&quot;: &quot;BreadcrumbList&quot;,
                &quot;@id&quot;: &quot;#Breadcrumb&quot;,
                &quot;itemListElement&quot;: [{
                  &quot;@type&quot;: &quot;ListItem&quot;,
                  &quot;position&quot;: 1,
                  &quot;item&quot;: {
                    &quot;name&quot;: &quot;<data:messages.home/>&quot;,
                    &quot;@id&quot;: &quot;<data:blog.homepageUrl.jsonEscaped/>&quot;
                  }
                },{
                  &quot;@type&quot;: &quot;ListItem&quot;,
                  &quot;position&quot;: 2,
                  &quot;item&quot;: {
                    &quot;name&quot;: &quot;<b:if cond='data:post.labels'><data:post.labels.last.name.jsonEscaped/></b:if>&quot;,
                    &quot;@id&quot;: &quot;<data:post.labels.last.url.jsonEscaped/>&quot;
                  }
                },{
                  &quot;@type&quot;: &quot;ListItem&quot;,
                  &quot;position&quot;: 3,
                  &quot;item&quot;: {
                    &quot;name&quot;: &quot;<data:post.title.jsonEscaped/>&quot;,
                    &quot;@id&quot;: &quot;<data:post.url.jsonEscaped/>&quot;
                  }
                }]
              }
              </script>

              <!-- Schema.org BlogPosting for Rich Search Snippets -->
              <script type='application/ld+json'>
              {
                &quot;@context&quot;: &quot;https://schema.org&quot;,
                &quot;@type&quot;: &quot;BlogPosting&quot;,
                &quot;mainEntityOfPage&quot;: {
                  &quot;@type&quot;: &quot;WebPage&quot;,
                  &quot;@id&quot;: &quot;<data:post.url.jsonEscaped/>&quot;
                },
                &quot;headline&quot;: &quot;<data:post.title.jsonEscaped/>&quot;,
                <b:if cond='data:post.featuredImage'>
                &quot;image&quot;: [&quot;<data:post.featuredImage.jsonEscaped/>&quot;],
                </b:if>
                &quot;datePublished&quot;: &quot;<data:post.date.iso8601/>&quot;,
                &quot;dateModified&quot;: &quot;<data:post.lastUpdated.iso8601 ?: data:post.date.iso8601/>&quot;,
                &quot;author&quot;: {
                  &quot;@type&quot;: &quot;Person&quot;,
                  &quot;name&quot;: &quot;<data:post.author.name.jsonEscaped/>&quot;
                },
                &quot;publisher&quot;: {
                  &quot;@type&quot;: &quot;Organization&quot;,
                  &quot;name&quot;: &quot;<data:blog.title.escaped/>&quot;,
                  &quot;logo&quot;: {
                    &quot;@type&quot;: &quot;ImageObject&quot;,
                    &quot;url&quot;: &quot;https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2xK2mGfe8aQcjPcFMmDrJA33V0WH7G2HX_lOQaBjyvROPq74lMz0sw602Fh3DKAMx27ZkuyL_u8wibKOwIGikj_j1q5DZQqj_Y42yDY3RfPBbuLfqoA9bJJB0e8Ry9Hmwsf5KNQC01xUHccbDQHakeIpSvi1R4WUKHf57VyTDzoL-EzxV0ZO8yWokYzY/s1000/logo.png&quot;
                  }
                },
                &quot;description&quot;: &quot;<b:eval expr='(data:post.snippet ?: data:post.title) snippet { length: 150 } escapes'/>&quot;
              }
              </script>
            </b:includable>`;

content = content.replace(breadcrumbRegex, newBreadcrumbAndArticleSchema);

// 7. Remove dead Google+ share buttons
content = content.replace(
  /<b:includable id='googlePlusShare'>[\s\S]*?<\/b:includable>/g,
  "<b:includable id='googlePlusShare'><b:comment>Google+ retired</b:comment></b:includable>"
);

// Restore line endings
if (hadCrlf) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(xmlPath, content, 'utf8');
console.log('Successfully updated blog.softwaretechit.xml!');
console.log('New XML length:', content.length);
