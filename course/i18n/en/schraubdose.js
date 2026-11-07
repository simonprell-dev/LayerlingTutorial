/* Kurstexte Englisch für Kapitel „schraubdose“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'schraubdose.s1.title': 'What are we building?',
        'schraubdose.s1.text': '<p>A small <b>jar with a screw lid</b> – two separate printed parts that fit together after printing.</p>' +
            '<p>The route: cylinder → <b>“Hollow”</b> → the <b>“Lid”</b> tool with thread and clearance → measure, align, <b>“Check clearance”</b> → export.</p>' +
            '<p>Two terms first: <b>clearance</b> (tolerance) is the air gap between two parts that mesh – without it they fuse or jam. The <b>pitch</b> is how far a thread climbs in one turn.</p>',
        'schraubdose.s1.l1': 'Walls grow inwards',
        'schraubdose.s1.l2': 'Lid with a thread',
        'schraubdose.s1.l3': 'Check the gaps',

        'schraubdose.s2.title': 'The jar body',
        'schraubdose.s2.text': '<p>Get a <b>“Cylinder”</b> (<b>“Add shape”</b>) and set in the properties panel:</p>' +
            '<ul><li><b>“Diameter”</b> 40–70 mm, e.g. 50 mm</li><li><b>“Height”</b> 30–80 mm, e.g. 40 mm</li></ul>' +
            '<p>The thread goes on the outside of the top later and needs about 6 mm of height.</p>',
        'schraubdose.s2.t1': 'New cylinder placed',
        'schraubdose.s2.t2': 'Ø 40–70 mm, 30–80 mm tall',
        'schraubdose.s2.h1': '“Add shape”',
        'schraubdose.s2.h2': 'Pick the cylinder',
        'schraubdose.s2.h3': 'Click the workplane',
        'schraubdose.s2.h4': 'Diameter and height',

        'schraubdose.s3.title': 'Hollow it out',
        'schraubdose.s3.text': '<p>Select the cylinder and open <b>“Hollow”</b> (section <b>“Edges &amp; walls”</b>). The walls grow inwards; the outside keeps its size.</p>' +
            '<ul><li><b>“Open sides”</b>: only <b>“Top”</b> – the bottom stays as the floor.</li>' +
            '<li><b>“Wall thickness”</b>: 1.6–3 mm, e.g. 2 mm. The thread sits on the outside and needs at least 0.8 mm of wall.</li></ul>' +
            '<p>Then click <b>“Hollow”</b>.</p>',
        'schraubdose.s3.t1': 'Hollowed, open only at the top',
        'schraubdose.s3.t2': 'Wall about 2 mm thick',
        'schraubdose.s3.h1': 'Click the cylinder',
        'schraubdose.s3.h2': 'Open “Hollow”',
        'schraubdose.s3.h3': 'Only “Top” open',
        'schraubdose.s3.h4': 'Wall about 2 mm',
        'schraubdose.s3.h5': 'Click “Hollow”',

        'schraubdose.s4.title': 'The lid tool',
        'schraubdose.s4.text': '<p>Layerling builds lids that follow the outline of a body open at the top. Select the jar and click <b>“Lid”</b> (section <b>“Edges &amp; walls”</b>).</p>' +
            '<p>Under <b>“Kind”</b> pick <b>“Screw on”</b>: the jar gets a thread on the outside of its top, the lid the same one inside its rim – like a jam jar. This works for round bodies only.</p>',
        'schraubdose.s4.t1': '“Lid” tool opened',
        'schraubdose.s4.t2': 'Kind “Screw on” picked',
        'schraubdose.s4.h1': 'Click the jar',
        'schraubdose.s4.h2': 'Click “Lid”',
        'schraubdose.s4.h3': 'Pick “Screw on”',

        'schraubdose.s5.title': 'Clearance and pitch',
        'schraubdose.s5.text': '<p>Printed parts never come out exactly to size. For the lid to turn, the thread needs <b>clearance</b>: <b>“Gap per side”</b>.</p>' +
            '<ul><li><b>“Fit”</b>: <b>“Normal 0.2”</b> suits most printers, <b>“Loose 0.3”</b> less precise ones; <b>“Tight 0.1”</b> often jams.</li>' +
            '<li><b>“Thread pitch”</b> 3 mm and 2 <b>“Turns”</b> are a good start: the thread reaches 6 mm down, its flanks are at 45° and print without support.</li></ul>' +
            '<p>Then <b>“Make lid”</b>. The lid then lies turned over beside the jar.</p>',
        'schraubdose.s5.t1': 'Clearance 0.2–0.4 mm per side',
        'schraubdose.s5.t2': 'Screw lid made',
        'schraubdose.s5.h1': 'Open the “Lid” tool',
        'schraubdose.s5.h2': 'Pick “Screw on”',
        'schraubdose.s5.h3': 'Fit “Normal 0.2”',
        'schraubdose.s5.h4': 'Click “Make lid”',

        'schraubdose.s6.title': 'Measure and align',
        'schraubdose.s6.text': '<p>Two parts on one build plate: they must not touch, but shouldn’t be needlessly far apart. Goal: <b>5 mm gap</b>.</p>' +
            '<ul><li><b>Measure:</b> <b>“Tape measure”</b> in the view bar on the left → <b>“Add measurement”</b> → a point on the jar’s edge, a point on the lid’s edge. Type <b>5</b> into the bubble – the lid moves to exactly that distance. (Or type the X position under <b>“Position”</b>.)</li>' +
            '<li><b>Slipped?</b> Layerling puts the lid centred next to the jar. If it got out of line while moving: select both, <b>“Align”</b> (section <b>“Arrange”</b>, key <b>L</b>) and click the middle point across the row.</li></ul>',
        'schraubdose.s6.t1': '5 mm gap, centred, on the plate',
        'schraubdose.s6.h1': '“Tape measure”: 5 mm gap',
        'schraubdose.s6.h2': 'Select jar and lid',
        'schraubdose.s6.h3': 'Click “Align”',
        'schraubdose.s6.h4': 'Click the middle point',
        'schraubdose.s6.h5': 'Drop onto the plate',

        'schraubdose.s7.title': 'Check clearance',
        'schraubdose.s7.text': '<p>Before printing, let Layerling measure: <b>“Check clearance”</b> (section <b>“Combine”</b>) finds parts that overlap or touch – they would print as one piece – and gaps narrower than the <b>“Minimum gap”</b>.</p>' +
            '<p>With nothing selected it checks all visible parts. Goal: <b>“No problems”</b>.</p>',
        'schraubdose.s7.t1': '“Check clearance” finds no problems',
        'schraubdose.s7.t2': 'Two separate printed parts',
        'schraubdose.s7.h1': 'Open “Check clearance”',
        'schraubdose.s7.h2': 'Click “Check again”',
        'schraubdose.s7.h3': 'Move the lid further away',
        'schraubdose.s7.h4': 'Click empty space',

        'schraubdose.s8.title': 'Look into the thread',
        'schraubdose.s8.text': '<p>Open the <b>“Section view”</b> in the view bar on the left. It cuts the view open – the design and the export stay whole.</p>' +
            '<p>Look at the thread on the jar and inside the lid’s rim: 45° flanks, no overhang. Notice the lid lies with its plate down? That way it prints without support.</p>',
        'schraubdose.s8.t1': 'Looked at the thread in section',
        'schraubdose.s8.t2': 'Lid lies with its plate down',
        'schraubdose.s8.h1': 'Open the section view',

        'schraubdose.s9.title': 'Export',
        'schraubdose.s9.text': '<p>Both parts go into one file: <b>“Export”</b> (<b>Ctrl+E</b>) → <b>“Export STL”</b>. In the slicer jar and lid then lie side by side, ready to print.</p>' +
            '<p>Tip: print just the lid and the top ring of the jar as a fit test before printing the whole jar.</p>',
        'schraubdose.s9.t1': 'STL file exported',
        'schraubdose.s9.h1': 'Click “Export”',
        'schraubdose.s9.h2': 'Export STL',

        'schraubdose.s10.title': 'Challenge',
        'schraubdose.s10.text': '<p>No help this time – pick a variant:</p>' +
            '<ul><li><b>Bayonet:</b> a second jar with the lid kind <b>“Bayonet”</b> – push on, turn, click.</li>' +
            '<li><b>Fine thread:</b> <b>“Thread pitch”</b> 2 mm and 3 <b>“Turns”</b> – holds tighter, needs more height.</li>' +
            '<li><b>Fit test:</b> three small jars with 0.1 / 0.2 / 0.3 mm clearance to get to know your printer.</li></ul>',
        'schraubdose.s10.t1': 'Built one variant',

        'schraubdose.s11.title': 'Done!',
        'schraubdose.s11.text': '<p>Your jar has a real thread with clearance – two parts that fit. 🎉</p>' +
            '<p>Ideas: spice jar, pill box, screw box, geocache container. Decorate the lid with a pattern (<b>“Surface texture”</b>) or an engraved name.</p>',
        'schraubdose.s11.t1': 'Lid decorated or labelled',
        'schraubdose.s11.t2': 'Built your own jar'
    });
})(typeof window !== 'undefined' ? window : globalThis);
