// ==UserScript==
// @name         YouTube Add Skipper
// @version      1.0
// @description  YouTube add skipping script
// @author       Konrad Słotwiński
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="64" height="64" viewBox="0 0 72 72"%3E%3Cpath fill="%23ea5a47" d="M63.874 21.906a7.31 7.31 0 0 0-5.144-5.177C54.193 15.505 36 15.505 36 15.505s-18.193 0-22.73 1.224a7.31 7.31 0 0 0-5.144 5.177C6.91 26.472 6.91 36 6.91 36s0 9.528 1.216 14.095a7.31 7.31 0 0 0 5.144 5.177C17.807 56.495 36 56.495 36 56.495s18.193 0 22.73-1.223a7.31 7.31 0 0 0 5.144-5.177C65.09 45.528 65.09 36 65.09 36s0-9.528-1.216-14.094"%2F%3E%3Cpath fill="%23fff" d="M30.05 44.65L45.256 36L30.05 27.35Z"%2F%3E%3Cg fill="none" stroke="%23000" stroke-miterlimit="10" stroke-width="2"%3E%3Cpath d="M63.874 21.906a7.31 7.31 0 0 0-5.144-5.177C54.193 15.505 36 15.505 36 15.505s-18.193 0-22.73 1.224a7.31 7.31 0 0 0-5.144 5.177C6.91 26.472 6.91 36 6.91 36s0 9.528 1.216 14.095a7.31 7.31 0 0 0 5.144 5.177C17.807 56.495 36 56.495 36 56.495s18.193 0 22.73-1.223a7.31 7.31 0 0 0 5.144-5.177C65.09 45.528 65.09 36 65.09 36s0-9.528-1.216-14.094"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M30.05 44.65L45.256 36L30.05 27.35Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
// @downloadURL  https://raw.githubusercontent.com/kgslotwinski/browser-scripts/main/tampermonkey/youtube-add-skipper.js
// @updateURL    https://raw.githubusercontent.com/kgslotwinski/browser-scripts/main/tampermonkey/youtube-add-skipper.js
// ==/UserScript==

(function () {
    'use strict';
    const interval = 1000;
    let isMuted = false;

    const toggleMute = (value = true) => {
        isMuted = value

        const elMuteBtn = document.querySelector('button.ytp-mute-button');
        const isVideoMuted = !document.getElementById('ytp-id-15');

        if (elMuteBtn && (value !== isVideoMuted)) {
            elMuteBtn.click();
        }
    }

    setInterval(() => {
        const isAddVisible = !!document.querySelector('span.ytp-ad-preview-container');
        const elSkipBtn = document.querySelector('button.ytp-ad-skip-button');

        if (elSkipBtn) {
            elSkipBtn.click();
            toggleMute(false);
        } else if (isAddVisible && !isMuted) {
            toggleMute();
        } else if (!isAddVisible && isMuted) {
            toggleMute(false);
        }
    }, interval);
})();