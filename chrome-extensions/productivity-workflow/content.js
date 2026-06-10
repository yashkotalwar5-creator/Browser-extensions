(function() {
    'use strict';
    window.addEventListener('input', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || e.target.tagName === 'INPUT') {
            let val = e.target.value || e.target.innerText;
            if (val && val.includes(';git')) {
                const updated = val.replace(';git', 'https://github.com/yashkotalwar5-creator');
                if (e.target.value !== undefined) e.target.value = updated;
                else e.target.innerText = updated;
            }
        }
    });
    if (window.location.search.includes('utm_') || window.location.search.includes('fbclid')) {
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
    document.querySelectorAll('table').forEach(table => {
        const exportBtn = document.createElement('button');
        exportBtn.innerText = "📊 Export Sheet Data";
        exportBtn.style.cssText = "position:absolute; background:#2e7d32; color:white; padding:4px 8px; font-size:11px; cursor:pointer; border:none; border-radius:4px; z-index:9999;";
        exportBtn.onclick = () => {
            let csv = [];
            table.querySelectorAll('tr').forEach(row => {
                let cols = [...row.querySelectorAll('td, th')].map(c => `"${c.innerText.trim()}"`);
                csv.push(cols.join(','));
            });
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'extracted_grid_data.csv';
            link.click();
        };
        table.insertBefore(exportBtn, table.firstChild);
    });
})();
