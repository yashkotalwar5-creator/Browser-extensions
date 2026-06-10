// ==UserScript==
// @name         YouTube Ultimate PowerPack - Phase 1
// @namespace    https://github.com/yashkotalwar5-creator
// @version      1.0
// @description  10-in-1 core interface modification and playback suite
// @match        https://*.youtube.com/*
// @connect      sponsor.ajay.app
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Global Configs / Blacklists (Customizable)
    const CHANNEL_BLACKLIST = ["5-Minute Crafts", "Bright Side"]; 
    const SPOILER_KEYWORDS = ["spoiler", "ending", "dies", "leak", "secret scene"];

    // Inject Master UI Structural CSS Styles
    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
        /* Chapter Sidebar Styles */
        #custom-chapters-panel { position: fixed; right: 20px; top: 100px; width: 260px; max-height: 60vh; background: #0f0f0f; border: 1px solid #272727; border-radius: 12px; z-index: 9999; padding: 12px; overflow-y: auto; color: #fff; font-family: Roboto, Arial, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .chapter-row { display: flex; justify-content: space-between; padding: 6px 8px; border-bottom: 1px solid #272727; cursor: pointer; border-radius: 4px; font-size: 13px; }
        .chapter-row:hover { background: #272727; color: #00b0ff; }
        /* Progress Indicator Style */
        .yt-progress-badge { position: absolute; bottom: 8px; left: 8px; background: rgba(0, 176, 255, 0.9); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; z-index: 10; }
        /* Picture-in-Picture Button Overlay */
        .custom-pip-btn { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); border: 1px solid #fff; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2000; color: #fff; font-size: 16px; opacity: 0; transition: opacity 0.2s; }
        ytd-player:hover .custom-pip-btn { opacity: 1; }
        /* Ambient Cinema Mode Darkener */
        body.cinema-active ytd-masthead, body.cinema-active #related, body.cinema-active #comments { opacity: 0.03 !important; transition: opacity 0.5s; pointer-events: none; }
    `;
    document.head.appendChild(styleNode);

    // =========================================================
    // IMPLEMENTATION SUITE (10 DISTINCT INTEGRATED EXTENSIONS)
    // =========================================================

    // 1. CLICKBAIT DE-BUSTER & 7. CHANNEL BLACKLIST
    function processVideoMetadata() {
        const videoCards = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
        
        videoCards.forEach(card => {
            // Channel Blacklist Parsing
            const channelElement = card.querySelector('#channel-name a, .ytd-channel-name a, #byline-container a');
            if (channelElement && CHANNEL_BLACKLIST.includes(channelElement.innerText.trim())) {
                card.remove();
                return;
            }

            // Title Parsing & Fetching
            const titleEl = card.querySelector('a#video-title, yt-formatted-string#video-title, #video-title-link');
            if (!titleEl || titleEl.hasAttribute('data-debust-processed')) return;

            const href = titleEl.getAttribute('href') || titleEl.closest('a')?.getAttribute('href');
            if (!href) return;
            const match = href.match(/[?&]v=([^&#]+)/);
            if (!match) return;

            const videoId = match[1];
            titleEl.setAttribute('data-debust-processed', 'true');

            const apiUrl = `https://sponsor.ajay.app/api/v1/getTitles?videoID=${videoId}`;
            const swapTitle = (data) => {
                if (data?.titles?.length > 0) {
                    const cleanTitle = data.titles.sort((a, b) => b.votes - a.votes)[0].title;
                    titleEl.innerText = cleanTitle;
                    titleEl.style.color = "#00b0ff"; 
                }
            };

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({ method: "GET", url: apiUrl, onload: (r) => r.status === 200 && swapTitle(JSON.parse(r.responseText)) });
            } else {
                fetch(apiUrl).then(res => res.ok && res.json()).then(swapTitle).catch(()=>{});
            }
        });
    }

    // 2. THUMBNAIL NEUTRALIZER
    function sanitizeThumbnails() {
        document.querySelectorAll('ytd-thumbnail img, yt-image img').forEach(img => {
            if (img.hasAttribute('data-thumb-neutralized')) return;
            const anchor = img.closest('a#thumbnail, a');
            const href = anchor?.getAttribute('href');
            if (!href) return;
            const match = href.match(/[?&]v=([^&#]+)/);
            if (!match) return;

            img.setAttribute('data-thumb-neutralized', 'true');
            const neutralUrl = `https://img.youtube.com/vi/${match[1]}/mq2.jpg`; 
            img.src = neutralUrl;
            if (img.srcset) img.srcset = neutralUrl;
        });
    }

    // 3. INFINITE SHORTS BLOCKER
    function purgeShorts() {
        document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-mini-guide-entry-renderer[title="Shorts"], ytd-guide-entry-renderer:has(a[href="/shorts/"])').forEach(el => el.remove());
        document.querySelectorAll('ytd-rich-item-renderer:has(a[href*="/shorts/"]), ytd-video-renderer:has(a[href*="/shorts/"])').forEach(short => short.remove());
    }

    // 4. DIRECT CHAPTER JUMPER SIDEBAR
    function buildChapterSidebar() {
        if (document.getElementById('custom-chapters-panel')) return;
        const descText = document.querySelector('#description-inner')?.innerText || "";
        const timestampMatches = [...descText.matchAll(/(?:(\d{1,2}):)?(\d{2}):(\d{2})/g)];
        if (timestampMatches.length === 0) return;

        const panel = document.createElement('div');
        panel.id = 'custom-chapters-panel';
        panel.innerHTML = '<h3>📍 Quick Chapters</h3>';

        timestampMatches.forEach(match => {
            const timeStr = match[0];
            const parts = timeStr.split(':').map(Number);
            const seconds = parts.reduce((acc, time) => (acc * 60) + time, 0);

            const row = document.createElement('div');
            row.className = 'chapter-row';
            row.innerHTML = `<span>Chapter Segment</span> <b>${timeStr}</b>`;
            row.onclick = () => {
                const vid = document.querySelector('video');
                if (vid) vid.currentTime = seconds;
            };
            panel.appendChild(row);
        });
        document.body.appendChild(panel);
    }

    // 5. COMMENT SENTIMENT & SPOILER FILTER
    function filterComments() {
        document.querySelectorAll('#content-text').forEach(comment => {
            const text = comment.innerText.toLowerCase();
            const containsSpoiler = SPOILER_KEYWORDS.some(kw => text.includes(kw));
            if (containsSpoiler) {
                const container = comment.closest('ytd-comment-thread-renderer');
                if (container) container.style.display = 'none';
            }
        });
    }

    // 6. VIDEO PROGRESS PERCENTAGE GAUGE
    function injectProgressBadges() {
        document.querySelectorAll('ytd-thumbnail:not(:has(.yt-progress-badge))').forEach(thumb => {
            const progressBar = thumb.querySelector('#progress');
            if (!progressBar) return;
            const percentage = progressBar.style.width;
            if (percentage) {
                const badge = document.createElement('div');
                badge.className = 'yt-progress-badge';
                badge.innerText = percentage;
                thumb.appendChild(badge);
            }
        });
    }

    // 8. AMBIENT CINEMA MODE OVERHAUL
    function runAmbientCinema() {
        const video = document.querySelector('video');
        if (!video) return;
        video.onplay = () => document.body.classList.add('cinema-active');
        video.onpause = () => document.body.classList.remove('cinema-active');
    }

    // 9. VIDEO SPEED FINE-TUNER
    window.addEventListener('keydown', (e) => {
        const video = document.querySelector('video');
        if (!video || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === ']') {
            video.playbackRate = Math.min(video.playbackRate + 0.1, 4.0);
        } else if (e.key === '[') {
            video.playbackRate = Math.max(video.playbackRate - 0.1, 0.1);
        }
    });

    // 10. PICTURE-IN-PICTURE FORCE TRIGGER
    function forcePipOverlay() {
        const player = document.querySelector('ytd-player');
        if (!player || player.querySelector('.custom-pip-btn')) return;
        const pipBtn = document.createElement('div');
        pipBtn.className = 'custom-pip-btn';
        pipBtn.innerHTML = '🔲';
        pipBtn.title = 'Force Picture-in-Picture';
        pipBtn.onclick = () => {
            const vid = document.querySelector('video');
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (vid) {
                vid.requestPictureInPicture();
            }
        };
        player.appendChild(pipBtn);
    }

    // =========================================================
    // BUNDLE EXECUTION PIPELINE
    // =========================================================
    function executePhaseOne() {
        purgeShorts();
        sanitizeThumbnails();
        processVideoMetadata();
        filterComments();
        injectProgressBadges();
        buildChapterSidebar();
        runAmbientCinema();
        forcePipOverlay();
    }

    executePhaseOne();
    const observer = new MutationObserver(() => {
        clearTimeout(window.batchTimeout);
        window.batchTimeout = setTimeout(executePhaseOne, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
