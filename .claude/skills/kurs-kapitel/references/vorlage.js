// Vorlage für ein Kapitel in course/course-data.js – ersetzt soon('stiftebecher', …).
// Texte als Schlüssel; in JEDE Datei unter course/i18n/ eintragen.

const kb = (si, field) => `stiftebecher.s${si}.${field}`;

// Hilfen für dieses Kapitel (oben in course-data.js ablegen)
const cups = c => c.solids('cylinder').filter(s => c.size(s).long >= 50 && c.size(s).h >= 70);

const stiftebecher = {
    id: 'stiftebecher',
    level: 'etwas',
    type: 'body',
    icon: '✏️',
    title: 'stiftebecher.title',
    desc: 'stiftebecher.desc',
    steps: [
        {
            kind: 'info',
            title: kb(1, 'title'),
            text: kb(1, 'text')
        },
        {
            kind: 'learn',
            title: kb(2, 'title'),
            text: kb(2, 'text'),
            tasks: [{text: kb(2, 't1'), check: c => cups(c).length > 0}],
            hints: [
                {target: 'addShape', text: kb(2, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || c.newShapes('cylinder').length > 0},
                {target: 'libItem:cylinder', text: kb(2, 'h2'), done: c => c.placing('cylinder') || c.newShapes('cylinder').length > 0},
                {target: 'workplane', text: kb(2, 'h3'), done: c => c.newShapes('cylinder').length > 0},
                {target: 'inspector:size', text: kb(2, 'h4'), done: c => cups(c).length > 0}
            ]
        },
        // … weitere learn-Schritte: aushöhlen ('toolbar:hollow' in TARGETS eintragen), Lochmuster, Kanten
        {
            kind: 'game',
            title: kb(6, 'title'),
            text: kb(6, 'text'),
            tasks: [{text: kb(6, 't1'), manual: true}],
            hints: [{target: 'viewCube', text: kb(6, 'h1'), done: () => false}]
        },
        {
            kind: 'learn',
            title: kb(7, 'title'),
            text: kb(7, 'text'),
            tasks: [{text: kb(7, 't1'), check: c => c.exported()}],
            hints: [
                {target: 'export', text: kb(7, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                {target: 'export:download', text: kb(7, 'h2'), done: c => c.exported()}
            ]
        },
        {
            kind: 'challenge',
            title: kb(8, 'title'),
            text: kb(8, 'text'),
            autoHints: false,
            tasks: [{text: kb(8, 't1'), manual: true}]
        },
        {
            kind: 'creative',
            title: kb(9, 'title'),
            text: kb(9, 'text'),
            tasks: [{text: kb(9, 't1'), manual: true}]
        }
    ]
};
