# playerzoom 📺

An intelligent, modular, and high-performance solution for stepped video zooming in fullscreen mode. Designed to bypass modern browser security barriers (including **Firefox on Linux KDE Plasma + Wayland**) and override internal website hotkey interceptions.

[Описание на русском языке](#russian-description)

---

## 📦 Fast Installation / Быстрая установка

Click the buttons below to install or update the scripts directly in Tampermonkey:  
*Нажмите кнопки ниже для установки или обновления скриптов напрямую в Tampermonkey:*

[![Install Core Module](https://shields.io🔥_Tampermonkey-green?style=for-the-badge)](https://github.com/artetk/playerzoom/raw/refs/heads/main/core-module-zoom.user.js)

[![Install Zona Interface](https://shields.io📦_Tampermonkey-blue?style=for-the-badge)](https://github.com/artetk/playerzoom/raw/refs/heads/main/zona-interface.user.js)


---

## ✨ Features

- **🔄 One-Key Cyclic Zoom (`F` key):** Seamless state switching:  
  `Normal Window` ➡️ `Fullscreen (1.0x)` ➡️ `Zoom (1.25x)` ➡️ `Max Zoom (1.55x)` ➡️ `Exit Fullscreen & Reset (1.0x)`.
- **🎯 Perfect Geometric Centering:** Uses advanced dynamic Flexbox CSS injection to lock the transformation origin strictly to the center of your screen, avoiding top/left corner shifts.
- **🪐 Modular Architecture (Event Bus):** Works natively on YouTube, while broadcasting isolated `CustomEvent` signals to custom video interfaces (like Zona Plus) to prevent DOM-cloning conflicts.
- **🛡️ Aggressive Hotkey Interception:** Captures key events during the early **Capturing phase**, rendering built-in website listeners unable to block or highjack your commands.
- **⌨️ Input Field Awareness:** Automatically disengages when typing in comments, search bars, or any editable element (`INPUT`, `TEXTAREA`, `contenteditable`).
- **📱 Touchpad & Gesture Support:** Fully synchronized two-finger pinch-to-zoom gestures inside fullscreen mode.

## ⌨️ Controls

| Action | Context | Result |
| :--- | :--- | :--- |
| **`F` or `А` key** | Anywhere on video page | Toggles zoom steps sequentially |
| **Pinch Out (2 fingers)** | Touchscreen / Touchpad | Increases zoom step inside Fullscreen |
| **Pinch In (2 fingers)** | Touchscreen / Touchpad | Decreases zoom / Exits Fullscreen |
| **`ESC` key** | Keyboard | Instant exit from Fullscreen with auto-reset to 1.0x |

---

## 📊 Comparison with Alternatives / Сравнение с аналогами

| Feature / Функция | playerzoom 📺 | BetterVideoControls | YouTube Zoom Enabler | Zoom & Crop (GreasyFork) |
| :--- | :---: | :---: | :---: | :---: |
| **Linux KDE Wayland Support** <br> *(Поддержка KDE Wayland)* | **🟢 Full (Firefox-ready)** | 🟡 Partial (Chromium only) | 🟡 Partial | 🔴 Broken alignment |
| **Architecture** <br> *(Архитектура)* | **🪐 Modular (CustomEvents)** | 🔴 Monolithic | 🔴 Extension-only | 🔴 Monolithic |
| **All-in-One Cyclic Hotkey** <br> *(Циклический зум одной кнопкой)* | **🟢 Yes (`F` key)** | 🔴 No | 🔴 No (Multiple keys) | 🔴 No |
| **Multi-site Support** <br> *(Работа на любых сайтах)* | **🟢 Yes (YouTube, Zona, etc.)** | 🟢 Yes | 🔴 YouTube Only | 🔴 YouTube Only |
| **Strict Center Alignment** <br> *(Жесткое центрирование)* | **🟢 Yes (Flexbox Injection)** | 🔴 No | 🟡 Dynamic | 🔴 Left-Top bias |
| **Touchpad Gestures Sync** <br> *(Синхронизация с тачпадом)* | **🟢 Yes** | 🔴 No | 🔴 No | 🔴 No |

---

<a id="russian-description"></a>
# Описание на русском языке 🇷🇺

Универсальное и производительное решение для циклического шагового зума (масштабирования) видео в полноэкранном режиме. Разработано специально для обхода жестких ограничений безопасности современных браузеров (включая **Firefox в связке с Linux KDE Plasma + Wayland**) и предотвращения перехвата клавиш со стороны сайтов.

## ✨ Основные возможности

- **🔄 Циклический зум по одной кнопке (`F`):** Переключение состояний в один клик:  
  `Обычный режим` ➡️ `Полный экран (1.0x)` ➡️ `Зум (1.25x)` ➡️ `Макс. Зум (1.55x)` ➡️ `Выход из полного экрана (Сброс в 1.0x)`.
- **🎯 Идеальное центрирование:** Картинка увеличивается строго из геометрического центра экрана (используется Flexbox-инъекция стилей), предотвращая сдвиги к углам.
- **🪐 Модульная архитектура (Шина событий):** Работает на YouTube «из коробки», а для кастомных интерфейсов (например, Zona Plus) отправляет изолированные сигналы через `CustomEvent`, что исключает конфликты DOM из-за перерендеринга страниц.
- **🛡️ Анти-перехват клавиш (Capturing):** Перехватывает нажатие на самом раннем этапе погружения события, не позволяя встроенным скриптам плееров заблокировать команду.
- **⌨️ Умный игнор ввода:** Скрипт автоматически отключается, если фокус находится в поле ввода комментария или поиска (`INPUT`, `TEXTAREA`).
- **⏳ Автоскрытие UI (Zona Модуль):** Скрипт интерфейса Zona Plus автоматически скрывает управляющие кнопки через 5 секунд бездействия и плавно возвращает их при движении мыши, таче или нажатии любой клавиши.

## 🛠️ Управление

| Действие | Где нажимать | Результат |
| :--- | :--- | :--- |
| **Клавиша `F` (или `А`)** | На странице видео | Переключает режим по циклу |
| **Жест «Разведение пальцев»** | Экран / Тачпад (2 пальца) | Увеличить шаг зума в Fullscreen |
| **Жест «Сведение пальцев»** | Экран / Тачпад (2 пальца) | Уменьшить шаг зума / Выйти |
| **Клавиша `ESC`** | Клавиатура | Мгновенный выход с автосбросом зума в 1.0x |

## 🌍 Совместимость
- **Браузеры:** Firefox (Gecko), Chrome/Chromium, Opera, Microsoft Edge.
- **Окружение:** Оптимизировано специально для **KDE Plasma (Wayland / X11) Linux**.

## 📄 License / Лицензия
This project is licensed under the MIT License - see the LICENSE file for details.  
*Этот проект распространяется под лицензией MIT.*
