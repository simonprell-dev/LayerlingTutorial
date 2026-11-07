/*
 * Kursfenster, Stufenwahl und Start-Knopf. Zeichnet nur, was course.js im Ansichtsmodell
 * (vm) vorgibt, und meldet Klicks über onAction zurück. Neu gezeichnet wird nur, wenn sich
 * das Modell ändert. Texte mit html stammen ausschließlich aus den eigenen Sprachdateien.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const doc = root.document;

    let handler = () => {};
    let panelEl = null;
    let launcherEl = null;
    let modalEl = null;
    let lastKey = '';
    let pos = null;

    function el (tag, cls, text) {
        const e = doc.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function html (tag, cls, markup) {
        const e = el(tag, cls);
        e.innerHTML = markup; // nur eigene Kurstexte
        return e;
    }

    function button (cls, text, action, arg, title) {
        const b = el('button', cls, text);
        b.type = 'button';
        if (title) b.title = title;
        b.addEventListener('click', e => {
            e.stopPropagation();
            handler(action, arg);
        });
        return b;
    }

    // ---------- Start-Knopf ----------

    function renderLauncher (vm) {
        if (!vm.launcher || !vm.launcher.show) {
            if (launcherEl) launcherEl.remove();
            launcherEl = null;
            return;
        }
        if (!launcherEl || !doc.body.contains(launcherEl)) {
            launcherEl = button('lk-launcher', '', 'launcher');
            doc.body.appendChild(launcherEl);
        }
        launcherEl.textContent = `🎓 ${vm.launcher.text}`;
        launcherEl.classList.toggle('lk-dark', Boolean(vm.dark));
    }

    // ---------- Stufenwahl ----------

    function renderModal (vm) {
        if (modalEl) modalEl.remove();
        modalEl = null;
        if (!vm.modal) return;
        const m = vm.modal;
        modalEl = el('div', `lk-modal-backdrop ${vm.dark ? 'lk-dark' : ''}`);
        const box = el('div', 'lk-modal');
        box.appendChild(button('lk-modal-close', '×', 'closeModal', null, m.closeText));
        box.appendChild(el('div', 'lk-modal-brand', m.brand));
        box.appendChild(el('h2', 'lk-modal-title', m.title));
        box.appendChild(el('p', 'lk-modal-text', m.intro));
        const grid = el('div', 'lk-level-grid');
        m.levels.forEach(l => {
            const card = button('lk-level-card', '', 'chooseLevel', l.id);
            card.appendChild(el('span', 'lk-level-icon', l.icon));
            card.appendChild(el('span', 'lk-level-title', l.title));
            card.appendChild(el('span', 'lk-level-text', l.desc));
            grid.appendChild(card);
        });
        box.appendChild(grid);
        box.appendChild(el('p', 'lk-modal-note', m.note));
        modalEl.appendChild(box);
        modalEl.addEventListener('click', e => {
            if (e.target === modalEl) handler('closeModal');
        });
        doc.body.appendChild(modalEl);
    }

    // ---------- Kursfenster ----------

    function renderHeader (p) {
        const head = el('div', 'lk-header');
        head.appendChild(el('span', 'lk-header-icon', p.icon));
        const titles = el('div', 'lk-header-titles');
        titles.appendChild(el('div', 'lk-header-brand', p.header));
        titles.appendChild(el('div', 'lk-header-sub', p.sub));
        head.appendChild(titles);
        const actions = el('div', 'lk-header-actions');
        actions.appendChild(button('lk-icon-btn', '☰', 'overview', null, p.overviewText));
        actions.appendChild(button(`lk-icon-btn ${p.hintsOff ? 'lk-off' : ''}`, '👆', 'toggleHints', null, p.hintsToggleText));
        actions.appendChild(button('lk-icon-btn', '×', 'close', null, p.closeText));
        head.appendChild(actions);
        makeDraggable(head);
        return head;
    }

    function renderStep (body, s) {
        body.appendChild(el('span', `lk-kind lk-kind-${s.kind}`, s.kindLabel));
        body.appendChild(el('h3', 'lk-title', s.title));
        if (s.warning) body.appendChild(el('div', 'lk-warning', s.warning));
        body.appendChild(html('div', 'lk-text', s.html));
        if (s.tasks.length) {
            body.appendChild(el('div', 'lk-tasks-title', s.tasksTitle));
            const list = el('ul', 'lk-tasks');
            s.tasks.forEach((t, i) => {
                const li = el('li', `lk-task ${t.done ? 'lk-done' : ''} ${t.manual ? 'lk-manual' : ''}`);
                li.appendChild(el('span', 'lk-check', t.done ? '✔' : ''));
                li.appendChild(el('span', 'lk-task-text', t.text));
                if (t.manual) {
                    li.title = s.manualHint;
                    li.addEventListener('click', e => {
                        e.stopPropagation();
                        handler('toggleTask', i);
                    });
                }
                list.appendChild(li);
            });
            body.appendChild(list);
        }
        if (s.showHintBtn) body.appendChild(button('lk-hint-btn', s.hintBtnText, 'showHint'));
        if (s.complete && s.completeText) body.appendChild(el('div', 'lk-complete', s.completeText));
    }

    function renderOverview (body, o) {
        body.appendChild(el('h3', 'lk-title', o.title));
        const list = el('div', 'lk-chapters');
        o.chapters.forEach(c => {
            const row = c.soon ? el('div', 'lk-chapter lk-soon') : button(`lk-chapter ${c.current ? 'lk-current' : ''}`, '', 'openChapter', c.index);
            row.appendChild(el('span', 'lk-chapter-icon', c.icon));
            const t = el('span', 'lk-chapter-texts');
            t.appendChild(el('span', 'lk-chapter-title', `${c.done ? '✔ ' : ''}${c.title}`));
            t.appendChild(el('span', 'lk-chapter-desc', c.desc));
            row.appendChild(t);
            row.appendChild(el('span', 'lk-badge', c.soon ? c.soonText : c.levelText));
            list.appendChild(row);
        });
        body.appendChild(list);
        body.appendChild(button('lk-link-btn', o.levelBtnText, 'chooseLevelDialog'));
        body.appendChild(el('p', 'lk-small', o.note));
    }

    function renderPanel (vm) {
        const p = vm.panel;
        if (!p) {
            if (panelEl) panelEl.remove();
            panelEl = null;
            LK.overlay && LK.overlay.setAvoid(null);
            return;
        }
        if (!panelEl || !doc.body.contains(panelEl)) {
            panelEl = el('div', 'lk-panel');
            doc.body.appendChild(panelEl);
            pos = p.pos || null;
        }
        panelEl.className = `lk-panel ${vm.dark ? 'lk-dark' : ''}`;
        panelEl.innerHTML = '';
        panelEl.appendChild(renderHeader(p));
        if (p.pips && p.pips.length) {
            const pips = el('div', 'lk-progress');
            p.pips.forEach(x => pips.appendChild(el('span', `lk-pip ${x.done ? 'lk-pip-done' : ''} ${x.active ? 'lk-pip-active' : ''}`)));
            panelEl.appendChild(pips);
        }
        const body = el('div', 'lk-body');
        if (p.view === 'overview') renderOverview(body, p.overview);
        else if (p.view === 'done') {
            body.appendChild(el('h3', 'lk-title', p.done.title));
            body.appendChild(html('div', 'lk-text', p.done.html));
        } else renderStep(body, p.step);
        panelEl.appendChild(body);
        if (p.footer) {
            const foot = el('div', 'lk-footer');
            if (p.footer.back) foot.appendChild(button('lk-btn lk-btn-secondary', p.footer.backText, 'back'));
            foot.appendChild(el('span', 'lk-spacer'));
            if (p.footer.next) foot.appendChild(button(`lk-btn ${p.footer.nextHighlight ? 'lk-btn-go' : ''}`, p.footer.nextText, 'next'));
            panelEl.appendChild(foot);
        }
        panelEl.appendChild(el('div', 'lk-independent', p.independent));
        LK.overlay && LK.overlay.setAvoid(panelEl);
        clamp();
    }

    // ---------- Verschieben ----------

    function makeDraggable (handle) {
        handle.addEventListener('pointerdown', e => {
            if (e.target.closest('button')) return;
            const start = panelEl.getBoundingClientRect();
            const ox = e.clientX - start.left;
            const oy = e.clientY - start.top;
            handle.setPointerCapture(e.pointerId);
            const move = ev => {
                pos = {x: ev.clientX - ox, y: ev.clientY - oy};
                clamp();
            };
            const up = () => {
                handle.removeEventListener('pointermove', move);
                handle.removeEventListener('pointerup', up);
                handler('moved', pos);
            };
            handle.addEventListener('pointermove', move);
            handle.addEventListener('pointerup', up);
        });
    }

    function clamp () {
        if (!panelEl) return;
        const w = panelEl.offsetWidth;
        const h = panelEl.offsetHeight;
        // Standard: unten links, über dem Start-Knopf und neben der Ansichtsleiste.
        const p = pos || {x: 16, y: root.innerHeight - h - 16};
        panelEl.style.left = `${Math.max(4, Math.min(root.innerWidth - w - 4, p.x))}px`;
        panelEl.style.top = `${Math.max(4, Math.min(root.innerHeight - h - 4, p.y))}px`;
    }

    function render (vm) {
        const key = JSON.stringify(vm);
        if (key === lastKey) return;
        lastKey = key;
        renderLauncher(vm);
        renderModal(vm);
        renderPanel(vm);
    }

    function onAction (cb) {
        handler = cb;
    }

    function element () {
        return panelEl;
    }

    if (root.addEventListener) root.addEventListener('resize', clamp);

    LK.panel = {render, onAction, element};
})(typeof window !== 'undefined' ? window : globalThis);
