/*
 * Hintergrund der Erweiterung: Symbol in der Browserleiste.
 *
 *   Klick         öffnet layerling.com (oder holt einen offenen Layerling-Tab nach vorn).
 *   Rechtsklick   Erweiterung an/aus, Lernfortschritt zurücksetzen, Hilfe.
 *
 * Die Skripte für layerling.com werden hier registriert statt im Manifest, damit sie sich
 * abschalten lassen. Der Kursfortschritt liegt im localStorage von layerling.com und wird
 * deshalb über ein Skript in der Seite gelöscht. Texte kommen aus _locales/.
 */
'use strict';

const EDITOR_URL = 'https://layerling.com/';
const HELP_URL = 'https://github.com/simonprell-dev/layerlingExtention#benutzung';
const LAYERLING_TABS = 'https://layerling.com/*';
const msg = key => chrome.i18n.getMessage(key) || key;

// Kapitel 2–6 liegen in eigenen Dateien (Ziele, Texte je Sprache, Kapitel).
const CHAPTERS = ['lesezeichen', 'stiftebecher', 'handystaender', 'schraubdose', 'getriebe'];

const PAGE_SCRIPTS = {
    id: 'layerling-kurs',
    matches: [LAYERLING_TABS],
    js: [
        'lib/geometry.js',
        'lib/layerling-access.js',
        ...CHAPTERS.map(id => `lib/targets/${id}.js`),
        'course/i18n.js',
        'course/i18n/de.js',
        'course/i18n/en.js',
        ...CHAPTERS.map(id => `course/i18n/de/${id}.js`),
        ...CHAPTERS.map(id => `course/i18n/en/${id}.js`),
        'course/progress.js',
        'course/context.js',
        'course/flow.js',
        'course/reader.js',
        ...CHAPTERS.map(id => `course/chapters/${id}.js`),
        'course/course-data.js',
        'course/overlay.js',
        'course/panel.js',
        'course/course.js'
    ],
    css: ['course/course.css'],
    runAt: 'document_idle',
    world: 'MAIN'
};

// Läuft immer, auch bei abgeschalteter Erweiterung: holt ein Zurücksetzen nach, das
// angefordert wurde, während kein Layerling-Tab offen war.
const RESET_SCRIPT = {
    id: 'reset-pending',
    matches: [LAYERLING_TABS],
    js: ['reset-pending.js'],
    runAt: 'document_start'
};

// ---------- Ein/Aus ----------

async function isEnabled () {
    const {enabled = true} = await chrome.storage.local.get('enabled');
    return enabled;
}

async function applyEnabled (enabled) {
    const registered = (await chrome.scripting.getRegisteredContentScripts()).map(s => s.id);
    if (registered.length) await chrome.scripting.unregisterContentScripts({ids: registered});
    await chrome.scripting.registerContentScripts(enabled ? [PAGE_SCRIPTS, RESET_SCRIPT] : [RESET_SCRIPT]);
    await chrome.action.setBadgeText({text: enabled ? '' : msg('badgeOff')});
    await chrome.action.setBadgeBackgroundColor({color: '#7D8299'});
    await chrome.action.setTitle({title: enabled ? msg('titleOn') : msg('titleOff')});
}

// ---------- Kontextmenü ----------

function createMenu (enabled) {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({id: 'enabled', type: 'checkbox', checked: enabled, title: msg('menuEnabled'), contexts: ['action']});
        chrome.contextMenus.create({id: 'reset', title: msg('menuReset'), contexts: ['action']});
        chrome.contextMenus.create({id: 'help', title: msg('menuHelp'), contexts: ['action']});
    });
}

async function setup () {
    const enabled = await isEnabled();
    createMenu(enabled);
    await applyEnabled(enabled);
    return enabled;
}

// Registrierte Skripte greifen erst beim nächsten Laden einer Seite. Layerling-Tabs, die
// schon offen sind (z. B. direkt nach der Installation), bekommen den Kurs hier nachgereicht.
// course.js bricht ab, wenn der Kurs im Tab schon läuft.
async function injectIntoOpenTabs () {
    if (!await isEnabled()) return;
    const tabs = await chrome.tabs.query({url: LAYERLING_TABS});
    await Promise.all(tabs.map(async tab => {
        const target = {tabId: tab.id};
        try {
            const [probe] = await chrome.scripting.executeScript({
                target, world: 'MAIN', func: () => Boolean(window.LK && window.LK.started)
            });
            if (probe && probe.result) return;
            await chrome.scripting.insertCSS({target, files: PAGE_SCRIPTS.css});
            await chrome.scripting.executeScript({target, world: 'MAIN', files: PAGE_SCRIPTS.js});
        } catch (e) { /* Tab lädt gerade oder ist nicht erreichbar – beim Laden kommt der Kurs ohnehin */ }
    }));
}

chrome.runtime.onInstalled.addListener(async () => {
    await setup();
    await injectIntoOpenTabs();
});
chrome.runtime.onStartup.addListener(setup);

chrome.contextMenus.onClicked.addListener(async info => {
    if (info.menuItemId === 'enabled') {
        await chrome.storage.local.set({enabled: info.checked});
        await applyEnabled(info.checked);
        if (info.checked) await injectIntoOpenTabs();
        notifyTabs(msg(info.checked ? 'toastOn' : 'toastOff'));
    } else if (info.menuItemId === 'reset') {
        await resetProgress();
    } else if (info.menuItemId === 'help') {
        chrome.tabs.create({url: HELP_URL});
    }
});

// ---------- Klick aufs Symbol ----------

chrome.action.onClicked.addListener(async () => {
    const [tab] = await chrome.tabs.query({url: LAYERLING_TABS});
    if (tab) {
        await chrome.tabs.update(tab.id, {active: true});
        await chrome.windows.update(tab.windowId, {focused: true});
        await injectIntoOpenTabs();
    } else {
        await chrome.tabs.create({url: EDITOR_URL});
    }
});

// ---------- Lernfortschritt zurücksetzen ----------

async function resetProgress () {
    const tabs = await chrome.tabs.query({url: LAYERLING_TABS});
    if (!tabs.length) {
        // Kein Layerling offen: beim nächsten Besuch erledigt reset-pending.js das.
        await chrome.storage.local.set({resetPending: true});
        return;
    }
    // Im ersten Tab nachfragen, damit nicht aus Versehen alles weg ist.
    const [answer] = await chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        world: 'MAIN',
        args: [msg('confirmReset')],
        func: question => window.confirm(question)
    }).catch(() => [{result: true}]);
    if (!answer || !answer.result) return;

    await Promise.all(tabs.map(tab => chrome.scripting.executeScript({
        target: {tabId: tab.id},
        world: 'MAIN',
        func: () => {
            try {
                localStorage.removeItem('layerling-kurs:v1');
            } catch (e) { /* egal */ }
            // Ein laufender Kurs (course.js) hält den Stand im Speicher und setzt sich selbst zurück.
            window.dispatchEvent(new CustomEvent('layerling-kurs-reset'));
        }
    }).catch(() => null)));
    notifyTabs(msg('toastReset'));
}

// ---------- Kurze Meldung in offenen Layerling-Tabs ----------

async function notifyTabs (text) {
    const tabs = await chrome.tabs.query({url: LAYERLING_TABS});
    tabs.forEach(tab => chrome.scripting.executeScript({
        target: {tabId: tab.id},
        args: [text],
        func: message => {
            const old = document.getElementById('lk-toast');
            if (old) old.remove();
            const toast = document.createElement('div');
            toast.id = 'lk-toast';
            toast.textContent = message;
            Object.assign(toast.style, {
                position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
                zIndex: 10005, maxWidth: '90vw', padding: '12px 18px', borderRadius: '10px',
                background: '#18766E', color: '#fff', font: 'bold 14px "Segoe UI", system-ui, sans-serif',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 6000);
        }
    }).catch(() => null));
}
