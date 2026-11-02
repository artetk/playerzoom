// ==UserScript==
// @name         Zona Plus - 1. Плеер и Интерфейс (Modular + AutoHide)
// @namespace    http://tampermonkey.net
// @version      0.1
// @match        https://*.zona.plus/*
// @grant        GM.openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// ==/UserScript==
// @supportURL   https://github.com/artetk/playerzoom/
// @updateURL    https://github.com/artetk/playerzoom/raw/refs/heads/main/zona-interface.user.js
// @downloadURL  https://github.com/artetk/playerzoom/raw/refs/heads/main/zona-interface.user.js

(function () {
    'use strict';
    const SITE_DOMAIN = 'w140.zona.plus';
    const PLAYER_URL = `https://${SITE_DOMAIN}/player`;

    let uiTimer = null;

    if (!sessionStorage.getItem('zona_init')) {
        Object.keys(localStorage).forEach(k => k.startsWith('z_pos_') && localStorage.removeItem(k));
        sessionStorage.setItem('zona_init', '1');
    }

    // Слушатели событий от Главного Модуля Зума
    window.addEventListener('zona-apply-zoom', e => {
        const target = document.getElementById('zoom-layer') || document.querySelector('video');
        if (target) {
            target.style.setProperty('transition', 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
            target.style.setProperty('transform', `scale(${e.detail.scale})`, 'important');
            target.style.setProperty('transform-origin', 'center center', 'important');
        }
    });

    window.addEventListener('zona-enter-fs', () => {
        const fBtn = document.getElementById('f-btn');
        if (fBtn) fBtn.click();
    });

        window.addEventListener('zona-exit-fs', () => {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        });

            // Функция управления автоскрытием интерфейса
            function initAutoHideUI() {
                const uiLayer = document.getElementById('ui-layer');
                if (!uiLayer) return;

                function showUI() {
                    // Возвращаем видимость и сбрасываем старый таймер
                    uiLayer.style.setProperty('opacity', '1', 'important');
                    uiLayer.style.setProperty('pointer-events', 'auto', 'important');

                    clearTimeout(uiTimer);

                    // Запускаем новый отсчет на 5 секунд (5000 миллисекунд)
                    uiTimer = setTimeout(hideUI, 5000);
                }

                function hideUI() {
                    // Плавно скрываем интерфейс и отключаем кликабельность в скрытом состоянии
                    uiLayer.style.setProperty('opacity', '0', 'important');
                    uiLayer.style.setProperty('pointer-events', 'none', 'important');
                }

                // Вешаем глобальные триггеры активности на документ плеера
                document.addEventListener('mousemove', showUI, { passive: true });
                document.addEventListener('touchstart', showUI, { passive: true });
                document.addEventListener('keydown', showUI, { passive: true });

                // Инициализируем первое скрытие при старте плеера
                showUI();
            }

            async function render() {
                if (!window.location.href.includes('/player')) return;
                const videoSrc = await GM.getValue('last-video-src', '');
                if (!videoSrc || !document.body) { window.requestAnimationFrame(render); return; }
                if (document.getElementById('app-root')) return;

                document.body.innerHTML = '';

                const style = document.createElement('style');
                style.textContent = `
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; font-family: sans-serif; touch-action: none; }
                #app-root { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative; }
                #zoom-layer { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; transition: transform 0.25s ease; will-change: transform; }
                video { width: 100%; height: 100%; object-fit: contain; pointer-events: auto; }
                video:focus { outline: none; }
                /* Добавлено плавное свойство transition для исчезновения UI */
                .ui { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); z-index: 10000; display: flex; flex-direction: column; gap: 15px; transition: opacity 0.4s ease-in-out !important; will-change: opacity; }
                .btn { width: 85px; height: 100px; background: rgba(0,0,0,0.6); border: 2px solid #fff; border-radius: 12px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; font-size: 13px; text-align: center; user-select: none; }
                `;
                document.head.appendChild(style);

                const appRoot = document.createElement('div');
                appRoot.id = 'app-root';
                appRoot.innerHTML = `
                <div class="ui" id="ui-layer">
                <div class="btn" id="p-btn">PLAY</div>
                <div class="btn" id="f-btn">FULL</div>
                </div>
                <div id="zoom-layer">
                <video id="v" src="${videoSrc}" playsinline controls tabindex="0"></video>
                </div>
                `;
                document.body.appendChild(appRoot);

                const v = document.getElementById('v'), p = document.getElementById('p-btn'), f = document.getElementById('f-btn');
                const saveKey = 'z_pos_' + btoa(videoSrc).substring(0, 20);

                setTimeout(() => { if (v) v.focus(); }, 200);

                v.onloadedmetadata = () => { const saved = localStorage.getItem(saveKey); if (saved) v.currentTime = parseFloat(saved); };
                v.ontimeupdate = () => { if (v.currentTime > 1) localStorage.setItem(saveKey, v.currentTime); };
                p.onclick = () => v.paused ? v.play() : v.pause();
                v.onplay = () => p.innerText = 'STOP';
                v.onpause = () => p.innerText = 'PLAY';

                f.onclick = () => {
                    const el = document.documentElement;
                    if (!document.fullscreenElement && !document.mozFullScreenElement) {
                        if (el.requestFullscreen) el.requestFullscreen();
                        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
                    } else {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                    }
                    setTimeout(() => v.focus(), 80);
                };

                // Запускаем таймер автоскрытия для созданного слоя
                initAutoHideUI();
            }

            function banner() {
                if (window.location.href.includes('/player')) return;
                const path = window.location.pathname.split('/').filter(Boolean);
                if (path.length !== 2 || /filter|search/.test(window.location.href)) { document.getElementById('zona-plus-banner')?.remove(); return; }
                if (document.getElementById('zona-plus-banner')) return;
                const b = document.createElement('button');
                b.id = 'zona-plus-banner';
                Object.assign(b.style, { position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', width: '100px', height: '150px', backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff', borderRadius: '12px', color: '#fff', zIndex: '10000', cursor: 'pointer', fontWeight: 'bold' });
                b.innerText = 'OPEN VIDEO';
                b.onclick = async () => { const vid = document.querySelector('video'); if (vid?.src) { await GM.setValue('last-video-src', vid.src); GM.openInTab(PLAYER_URL, { active: true }); } };
                document.body.appendChild(b);
            }

            if (window.location.href.includes('/player')) {
                if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
                else render();
            } else {
                setInterval(banner, 2000);
            }
})();
