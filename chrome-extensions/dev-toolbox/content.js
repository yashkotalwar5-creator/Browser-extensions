(function() {
    'use strict';
    const rawText = document.body.innerText.trim();
    if (rawText.startsWith('{') || rawText.startsWith('[')) {
        try {
            const parsed = JSON.parse(rawText);
            const container = document.createElement('pre');
            container.style.cssText = "padding:20px; background:#1e1e1e; color:#9cdcfe; font-family:monospace; line-height:1.5;";
            container.textContent = JSON.stringify(parsed, null, 4);
            document.body.innerHTML = '';
            document.body.appendChild(container);
        } catch(e) {}
    }
    const savedCSS = localStorage.getItem('custom_dev_css');
    if (savedCSS) {
        const style = document.createElement('style');
        style.textContent = savedCSS;
        document.head.appendChild(style);
    }
    window.addEventListener('keydown', async (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p' && window.EyeDropper) {
            const dropper = new EyeDropper();
            try {
                const result = await dropper.open();
                navigator.clipboard.writeText(result.sRGBHex);
            } catch (err) {}
        }
    });
})();
