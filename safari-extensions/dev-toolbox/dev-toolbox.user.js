// ==UserScript==
// @name         DevToolbox Suite (Safari Core)
// @namespace    https://github.com/yashkotalwar5-creator
// @version      1.0
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==
(function() {
    'use strict';
    const rawText = document.body.innerText.trim();
    if (rawText.startsWith('{') || rawText.startsWith('[')) {
        try { document.body.innerHTML = `<pre style="padding:20px; background:#1e1e1e; color:#9cdcfe; font-family:monospace;">${JSON.stringify(JSON.parse(rawText), null, 4)}</pre>`; } catch(e) {}
    }
})();
