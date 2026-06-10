// ==UserScript==
// @name         Productivity Automation Engine (Safari Core)
// @namespace    https://github.com/yashkotalwar5-creator
// @version      1.0
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==
(function() {
    'use strict';
    if (window.location.search.includes('utm_')) {
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
})();
