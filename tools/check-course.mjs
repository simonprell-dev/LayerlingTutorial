// Prüft die Kursinhalte: Übersetzungen vollständig, Hinweis-Ziele bekannt, Kapitel-IDs
// eindeutig, jede learn-Aufgabe prüfbar, jeder Hinweis mit done.
// Aufruf: node tools/check-course.mjs   (npm run check)
import {pathToFileURL} from 'node:url';
import {load, courseFiles} from '../tests/load.mjs';

export function loadCourse () {
    const w = load(courseFiles());
    return {course: w.LK.course, messages: w.LK.i18n.messages, targets: w.LK.access.TARGETS, tools: w.LK.access.TOOLS};
}

function keysOf (course) {
    const keys = [];
    course.chapters.forEach((ch, ci) => {
        const at = `Kapitel ${ci + 1} (${ch.id})`;
        keys.push([at, ch.title], [at, ch.desc]);
        (ch.steps || []).forEach((s, si) => {
            const where = `${at}, Schritt ${si + 1}`;
            keys.push([where, s.title], [where, s.text]);
            (s.tasks || []).forEach(t => keys.push([where, t.text]));
            (s.hints || []).forEach(h => keys.push([where, h.text]));
            (s.labels || []).forEach(l => keys.push([where, l.text]));
        });
    });
    return keys;
}

// Bekanntes Ziel: Eintrag in TARGETS, libItem:<art> oder toolbar:<Werkzeug aus TOOLS>.
const knownTarget = (id, targets, tools) => Boolean(targets[id]) || /^libItem:[A-Za-z]+$/.test(id) ||
    (id.startsWith('toolbar:') && (tools || []).includes(id.slice(8)));

export function findProblems (course, messages, targets, tools) {
    const problems = [];
    const langs = Object.keys(messages).sort();
    const seen = new Set();

    course.chapters.forEach((ch, ci) => {
        if (seen.has(ch.id)) problems.push(`Kapitel ${ci + 1}: doppelte id „${ch.id}“`);
        seen.add(ch.id);
        (ch.steps || []).forEach((s, si) => {
            const where = `Kapitel ${ci + 1} (${ch.id}), Schritt ${si + 1}`;
            (s.tasks || []).forEach((t, ti) => {
                if (s.kind === 'learn' && !t.manual && typeof t.check !== 'function') {
                    problems.push(`${where}: Aufgabe ${ti + 1} braucht check oder manual`);
                }
            });
            [...(s.hints || []), ...(s.labels || [])].forEach(h => {
                if (!knownTarget(h.target, targets, tools)) problems.push(`${where}: unbekanntes Ziel „${h.target}“`);
            });
            (s.hints || []).forEach((h, hi) => {
                if (typeof h.done !== 'function') problems.push(`${where}: Hinweis ${hi + 1} ohne done`);
            });
        });
    });

    keysOf(course).forEach(([where, key]) => {
        langs.forEach(lang => {
            const text = messages[lang][key];
            if (typeof text !== 'string' || !text.length) problems.push(`${where}: Text „${key}“ fehlt in ${lang}`);
        });
    });

    // Alle Sprachdateien haben dieselben Schlüssel wie Englisch.
    const en = Object.keys(messages.en || {});
    langs.filter(l => l !== 'en').forEach(lang => {
        en.filter(k => !(k in messages[lang])).forEach(k => {
            if (!problems.some(p => p.includes(`„${k}“ fehlt in ${lang}`))) problems.push(`${lang}: Schlüssel „${k}“ fehlt`);
        });
        Object.keys(messages[lang]).filter(k => !en.includes(k)).forEach(k => {
            if (!problems.some(p => p.includes(`„${k}“ fehlt in en`))) problems.push(`${lang}: Schlüssel „${k}“ gibt es in en nicht`);
        });
    });
    return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const {course, messages, targets, tools} = loadCourse();
    const problems = findProblems(course, messages, targets, tools);
    problems.forEach(p => console.log(p));
    const steps = course.chapters.reduce((n, c) => n + (c.steps || []).length, 0);
    console.log(problems.length ?
        `${problems.length} Probleme` :
        `Alles ok. ${course.chapters.length} Kapitel, ${steps} Schritte, Sprachen: ${Object.keys(messages).sort().join(', ')}`);
    process.exit(problems.length ? 1 : 0);
}
