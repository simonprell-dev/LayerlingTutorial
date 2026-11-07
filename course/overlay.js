/*
 * Zeige-Hinweise über der Seite: Ring um das Ziel, Hand, Sprechblase, Tour-Beschriftungen,
 * Konfetti. Die Ebene fängt keine Klicks ab (pointer-events: none).
 * In Layerling legt man Formen per Klick ab (nicht per Ziehen), deshalb gibt es nur Zeigen.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const doc = root.document;
    let layer = null;
    let lastKey = '';
    let avoidEl = null; // das Kursfenster: Sprechblasen sollen es nicht verdecken
    let scrolledFor = '';

    function ensureLayer () {
        if (layer && doc.body.contains(layer)) return layer;
        layer = doc.createElement('div');
        layer.className = 'lk-overlay';
        doc.body.appendChild(layer);
        return layer;
    }

    function clear () {
        if (layer) layer.innerHTML = '';
        lastKey = '';
    }

    const rectKey = r => [r.left, r.top, r.width, r.height].map(Math.round).join(',');

    const overlaps = (a, b, gap = 4) => a.left < b.right + gap && a.right > b.left - gap &&
        a.top < b.bottom + gap && a.bottom > b.top - gap;

    const fits = r => r.left >= 4 && r.top >= 4 && r.right <= root.innerWidth - 4 && r.bottom <= root.innerHeight - 4;

    function avoidRects () {
        const list = [];
        if (avoidEl && doc.body.contains(avoidEl)) {
            const r = avoidEl.getBoundingClientRect();
            if (r.width) list.push(r);
        }
        return list;
    }

    function ring (rect, pad) {
        const el = doc.createElement('div');
        el.className = 'lk-ring';
        Object.assign(el.style, {
            left: `${rect.left - pad}px`, top: `${rect.top - pad}px`,
            width: `${rect.width + 2 * pad}px`, height: `${rect.height + 2 * pad}px`
        });
        return el;
    }

    // Sprechblase neben anchor: erste Position, die ins Fenster passt und nichts verdeckt.
    function bubble (text, anchor, order, cls) {
        const el = doc.createElement('div');
        el.className = `lk-bubble ${cls || ''}`;
        el.textContent = text;
        layer.appendChild(el);
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const cx = anchor.left + anchor.width / 2;
        const cy = anchor.top + anchor.height / 2;
        const centered = Math.max(8, Math.min(root.innerWidth - w - 8, cx - w / 2));
        const spots = {
            below: new DOMRect(centered, anchor.bottom + 8, w, h),
            above: new DOMRect(centered, anchor.top - h - 8, w, h),
            right: new DOMRect(anchor.right + 12, cy - h / 2, w, h),
            left: new DOMRect(anchor.left - w - 12, cy - h / 2, w, h)
        };
        const avoid = avoidRects();
        const candidates = (order || ['below', 'above', 'right', 'left']).map(k => spots[k]);
        const spot = candidates.find(r => fits(r) && !avoid.some(a => overlaps(r, a))) ||
            candidates.find(fits) || candidates[0];
        el.style.left = `${Math.max(8, Math.min(root.innerWidth - w - 8, spot.left))}px`;
        el.style.top = `${Math.max(8, Math.min(root.innerHeight - h - 8, spot.top))}px`;
        return el;
    }

    // Große Ziele (Arbeitsfläche) bekommen keinen Ring, nur Hand und Blase in der Mitte.
    function isLarge (rect) {
        return rect.width > root.innerWidth * 0.5 && rect.height > root.innerHeight * 0.4;
    }

    function point (el, text) {
        if (!el) {
            clear();
            return;
        }
        let rect = el.getBoundingClientRect();
        if (!rect.width && !rect.height) {
            clear();
            return;
        }
        // Liegt das Ziel außerhalb des Fensters (z. B. unten im Eigenschaften-Fenster),
        // einmal pro Hinweis ins Bild scrollen.
        const outside = rect.bottom > root.innerHeight - 8 || rect.top < 0;
        if (outside && scrolledFor !== text && el.scrollIntoView) {
            scrolledFor = text;
            el.scrollIntoView({block: 'center', behavior: 'smooth'});
            rect = el.getBoundingClientRect();
        }
        const key = `p|${text}|${rectKey(rect)}`;
        if (key === lastKey && layer && layer.childNodes.length) return;
        ensureLayer();
        layer.innerHTML = '';
        lastKey = key;

        let target = rect;
        if (isLarge(rect)) {
            target = new DOMRect(rect.left + rect.width / 2 - 30, rect.top + rect.height / 2 - 30, 60, 60);
        } else {
            layer.appendChild(ring(rect, 6));
        }
        const above = target.bottom + 110 > root.innerHeight;
        const hx = target.left + Math.min(target.width / 2, 60) - 18;
        const hy = above ? target.top - 44 : target.bottom + 2;
        const hand = doc.createElement('div');
        hand.className = `lk-hand ${above ? 'lk-hand-down' : ''}`;
        hand.textContent = above ? '👇' : '👆';
        hand.style.left = `${hx}px`;
        hand.style.top = `${hy}px`;
        layer.appendChild(hand);
        const handRect = new DOMRect(hx, hy, 36, 40);
        const anchor = new DOMRect(Math.min(target.left, handRect.left), Math.min(target.top, handRect.top),
            Math.max(target.right, handRect.right) - Math.min(target.left, handRect.left),
            Math.max(target.bottom, handRect.bottom) - Math.min(target.top, handRect.top));
        bubble(text, anchor, above ? ['above', 'right', 'left', 'below'] : null);
    }

    // Tour: mehrere Bereiche gleichzeitig beschriften. items = [{el, text}]
    function labels (items) {
        const shown = items.filter(i => i.el && i.el.getBoundingClientRect().width);
        const key = 'l|' + shown.map(i => i.text + rectKey(i.el.getBoundingClientRect())).join('|');
        if (key === lastKey && layer && layer.childNodes.length) return;
        ensureLayer();
        layer.innerHTML = '';
        lastKey = key;
        shown.forEach(i => {
            let rect = i.el.getBoundingClientRect();
            if (isLarge(rect)) {
                rect = new DOMRect(rect.left + rect.width / 2 - 40, rect.top + rect.height / 2 - 20, 80, 40);
            } else {
                layer.appendChild(ring(rect, 4));
            }
            bubble(i.text, rect, null, 'lk-label');
        });
    }

    function confetti (fromEl) {
        const rect = fromEl ? fromEl.getBoundingClientRect() : new DOMRect(root.innerWidth / 2, root.innerHeight / 2, 0, 0);
        const colors = ['#18766E', '#2BB3A3', '#FFD666', '#FF9F43', '#EB6E32', '#5B8DEF', '#B36BE0'];
        for (let i = 0; i < 40; i++) {
            const piece = doc.createElement('div');
            piece.className = 'lk-confetti';
            piece.style.left = `${rect.left + rect.width / 2}px`;
            piece.style.top = `${rect.top + 40}px`;
            piece.style.background = colors[i % colors.length];
            piece.style.setProperty('--x', `${(Math.random() - 0.5) * 420}px`);
            piece.style.setProperty('--y', `${-80 - Math.random() * 220}px`);
            piece.style.setProperty('--r', `${Math.random() * 720}deg`);
            doc.body.appendChild(piece);
            setTimeout(() => piece.remove(), 1600);
        }
    }

    function setAvoid (el) {
        avoidEl = el;
    }

    LK.overlay = {point, labels, clear, confetti, setAvoid};
})(typeof window !== 'undefined' ? window : globalThis);
