function skipYouTubeAd() {
  const skipButtonSelectors = [
    '.ytp-ad-skip-button-modern',
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    'button[aria-label^="Skip ad"]',
    '.ytp-ad-skip-button-text'
  ];
  for (const selector of skipButtonSelectors) {
    const button = document.querySelector(selector);
    if (button && button.offsetParent !== null) {
      button.click();
      console.log("[YT Auto Skip] Clicked skip button!");
      break; 
    }
  }
  const video = document.querySelector('video');
  const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
  if (video && adShowing) {
    video.currentTime = video.duration - 0.1;
  }
}
setInterval(skipYouTubeAd, 500);
