// ==UserScript==
// @name         Core Module - Video Fullscreen Zoom
// @namespace    http://tampermonkey.net
// @version      0.3
// @description  Универсальный модуль шагового зума (F) с жестким центрированием видео на YouTube.
// @author       artetk
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
// @supportURL   https://github.com/artetk/playerzoom/
// @updateURL    https://github.com/artetk/playerzoom/raw/refs/heads/main/core-module-zoom.user.js
// @downloadURL  https://github.com/artetk/playerzoom/raw/refs/heads/main/core-module-zoom.user.js


(function () {
    'use strict';

    let zoomIdx = 0;
    const zoomSteps = [1, 1.25, 1.55];
    let startDist = 0;
    let canChange = false;

    // Автоматическая инъекция стилей центрирования плеера для YouTube
    function injectYouTubeStyles() {
        if (!location.hostname.includes('youtube.com')) return;
        if (document.getElementById('yt-zoom-centering-styles')) return;

        const style = document.createElement('style');
        style.id = 'yt-zoom-centering-styles';
        style.textContent = `
        .html5-video-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
        }
        .html5-video-container video {
            transform-origin: center center !important;
        }
        `;
        document.documentElement.appendChild(style);
    }

    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    }

    // ИСПРАВЛЕНО: Из функции полностью удален случайный дубликат кода
    function getTarget() {
        if (location.hostname.includes('youtube.com')) {
            return document.querySelector('.html5-video-container') || document.querySelector('video');
        }
        return document.getElementById('zoom-layer') || document.querySelector('video');
    }

    function applyZoom() {
        // Если мы на Zona, просто уведомляем модуль интерфейса
        if (location.hostname.includes('zona.plus')) {
            window.dispatchEvent(new CustomEvent('zona-apply-zoom', { detail: { scale: zoomSteps[zoomIdx] } }));
            return;
        }
        // На остальных сайтах (включая YouTube) управляем напрямую
        const target = getTarget();
        if (target) {
            target.style.setProperty('transition', 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
            target.style.setProperty('transform', `scale(${zoomSteps[zoomIdx]})`, 'important');
            target.style.setProperty('transform-origin', 'center center', 'important');
        }
    }

    function triggerFullscreen() {
        if (location.hostname.includes('zona.plus')) {
            window.dispatchEvent(new CustomEvent(!isFullscreen() ? 'zona-enter-fs' : 'zona-exit-fs'));
            return;
        }
        // Логика для YouTube и других сайтов
        const ytButton = document.querySelector('.ytp-fullscreen-button');
        if (ytButton) { ytButton.click(); return; }

        const player = getTarget();
        if (!player) return;
        if (player.requestFullscreen) player.requestFullscreen();
        else if (player.mozRequestFullScreen) player.mozRequestFullScreen();
    }

    // Перехват клавиши F
    window.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        const key = e.key.toLowerCase();
        if (key === 'f' || key === 'а') {

            if (!isFullscreen()) {
                zoomIdx = 0;
                triggerFullscreen();
                setTimeout(applyZoom, 150);
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (zoomIdx < zoomSteps.length - 1) {
                zoomIdx++;
                applyZoom();
            } else {
                triggerFullscreen(); // Выходим из FS
                zoomIdx = 0;
                applyZoom();
            }
        }
    }, true);

    // Сброс при выходе из FS (например, по ESC)
    const fsEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'];
    fsEvents.forEach(event => {
        document.addEventListener(event, () => {
            if (!isFullscreen()) {
                zoomIdx = 0;
                applyZoom();
            }
        }, { passive: true });
    });

    // ТАЧ-ЛОГИКА (Проверенные рабочие индексы touches[0] и touches[1])
    window.addEventListener('touchstart', e => {
        if (e.touches.length === 2 && isFullscreen()) {
            if (e.cancelable) e.preventDefault();
            startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            canChange = true;
        }
    }, { passive: false });

    window.addEventListener('touchmove', e => {
        if (e.touches.length === 2 && startDist > 0 && canChange && isFullscreen()) {
            if (e.cancelable) e.preventDefault();
            const curDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            const diff = curDist - startDist;

            if (Math.abs(diff) > 80) {
                if (diff > 0) zoomIdx = Math.min(zoomIdx + 1, zoomSteps.length - 1);
                else {
                    if (zoomIdx === 0) triggerFullscreen();
                    else zoomIdx = Math.max(zoomIdx - 1, 0);
                }
                applyZoom();
                canChange = false;
            }
        }
    }, { passive: false });

    window.addEventListener('touchend', () => { startDist = 0; canChange = false; });

    // Запускаем инъекцию стилей при старте страницы
    injectYouTubeStyles();
    document.addEventListener('DOMContentLoaded', injectYouTubeStyles);
})();
