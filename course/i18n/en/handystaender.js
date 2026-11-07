/* Kurstexte Englisch für Kapitel „handystaender“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'handystaender.s1.title': 'What are we building?',
        'handystaender.s1.text': '<p>You’ll build a <b>phone stand</b>. Instead of stacking boxes, you draw its <b>side profile</b> in the <b>sketch</b> – with exact lengths and angles – and pull it into a solid (<b>extrude</b>).</p>' +
            '<p>Then you chamfer the edges (<b>chamfer</b> = an edge cut off at an angle), look for overhangs with <b>“Print check”</b> and export the STL.</p>' +
            '<p>An <b>overhang</b> is a surface that faces down and is tilted flatter than about 45°. The printer would have to print into thin air there and needs supports.</p>',
        'handystaender.s1.l1': 'The sketch is here',
        'handystaender.s1.l2': 'Chamfer edges',
        'handystaender.s1.l3': 'Print check',

        'handystaender.s2.title': 'Sketch the profile',
        'handystaender.s2.text': '<p>Switch to the <b>“Sketch”</b> tab at the top and click <b>“Extrude sketch”</b>. The <b>“Line”</b> tool is already active.</p>' +
            '<p>Click a start point on the sheet. Type every further line as <b>length&lt;angle</b> and press <b>Enter</b> – 0° points right, 90° points up. The profile (mm):</p>' +
            '<ul><li><b>80&lt;0</b> base, <b>6&lt;90</b>, <b>45&lt;180</b></li>' +
            '<li><b>90&lt;65</b> backrest, 65° steep · <b>7&lt;180</b> · <b>90&lt;245</b> back down</li>' +
            '<li><b>22&lt;180</b> groove for the phone · <b>10&lt;90</b> lip · <b>6&lt;180</b> · <b>16&lt;270</b> to the start</li></ul>' +
            '<p>The last line closes the outline. Then click <b>“Finish sketch”</b>.</p>' +
            '<p>Typo? <b>“Sketch undo”</b> in the <b>“History”</b> section. To change it later: click the solid → <b>“Edit sketch”</b>. Clicking a corner shows its angle – click it and type a new one.</p>',
        'handystaender.s2.t1': 'Sketch finished as a solid',
        'handystaender.s2.t2': 'Backrest leans at 60–75°',
        'handystaender.s2.t3': 'A front lip holds the phone',
        'handystaender.s2.h1': 'Open the “Sketch” tab',
        'handystaender.s2.h2': 'Click “Extrude sketch”',
        'handystaender.s2.h3': 'Click a start point, type 80<0',
        'handystaender.s2.h4': 'Outline closed: “Finish sketch”',
        'handystaender.s2.h5': 'Change angle or lip',

        'handystaender.s3.title': 'Set the width',
        'handystaender.s3.text': '<p>The solid is only 10 mm thick: that’s how far Layerling pulled the profile up.</p>' +
            '<p>Click it. In <b>“Properties”</b>, <b>“Height”</b> is the extrusion – here, the <b>width</b> of the stand. Type <b>70</b>; 60–90 mm suits most phones.</p>' +
            '<p>The stand is lying on its side. That’s on purpose – you’ll see why in a moment.</p>',
        'handystaender.s3.t1': 'Stand is 60–90 mm wide',
        'handystaender.s3.h1': 'Click the stand',
        'handystaender.s3.h2': 'Height = width: 70',

        'handystaender.s4.title': 'Chamfer the edges',
        'handystaender.s4.text': '<p>Sharp edges dig into your hand and chip easily. A <b>chamfer</b> cuts them off at an angle.</p>' +
            '<ul><li>Click the stand, then <b>“Chamfer”</b> in the <b>“Edges &amp; walls”</b> section.</li>' +
            '<li>Pick <b>“Top edges”</b>, <b>“Distance”</b> 1–2 mm.</li>' +
            '<li><b>“Apply”</b>, then <b>“Done”</b>.</li></ul>' +
            '<p>Only the top, because the underside lies flat on the print bed. Rule of thumb: <b>never round</b> bottom edges – a rounded bottom edge sags. And with <b>“All sharp edges”</b>, several chamfers meet in the bottom corners and form small overhangs there.</p>' +
            '<p>Careful: <b>“Edit sketch”</b> removes the chamfers again, because the edges are rebuilt.</p>',
        'handystaender.s4.t1': 'Edges chamfered by 1–3 mm',
        'handystaender.s4.h1': 'Click the stand',
        'handystaender.s4.h2': '“Chamfer” tool',
        'handystaender.s4.h3': 'Pick “Top edges”',
        'handystaender.s4.h4': 'Distance 1–2 mm, “Apply”',
        'handystaender.s4.h5': 'Close with “Done”',

        'handystaender.s5.title': 'Stand it up and look',
        'handystaender.s5.text': '<p>What does the stand look like on a desk? Click it and set <b>“About X”</b> in the <b>“Rotation”</b> card to <b>90</b>. Look at it from all sides.</p>' +
            '<p>Think: where would it have overhangs in the printer like this? And which way would the layers run?</p>' +
            '<p>Then lay it back on its profile: the <b>“Lay flat on face”</b> tool (<b>“Arrange”</b> section) and click the large side face – or set <b>“About X”</b> back to 0.</p>',
        'handystaender.s5.t1': 'Stood it up, looked all round',
        'handystaender.s5.t2': 'Laid it back on its profile',
        'handystaender.s5.h1': '“About X” to 90',
        'handystaender.s5.h2': '“Lay flat on face”, click side',

        'handystaender.s6.title': 'Print check',
        'handystaender.s6.text': '<p>Lying on its profile, every wall goes straight up: nothing hangs in the air. And the layers run across backrest and base – so the backrest won’t snap off.</p>' +
            '<p>Open <b>“Print check”</b> (<b>“Combine”</b> section) and click <b>“Check”</b>. Layerling looks for thin walls, floating parts, little bed contact, <b>overhangs</b> and open meshes.</p>' +
            '<p>If the <b>“Overhangs”</b> line reports something, you probably chamfered <b>“All sharp edges”</b>. Take it back in the <b>“Chamfer”</b> tool with <b>“Undo an edge feature”</b> and chamfer only the top. After each change: <b>“Check again”</b>.</p>',
        'handystaender.s6.t1': 'Stand lies on its profile',
        'handystaender.s6.t2': 'Print check: no overhangs',
        'handystaender.s6.h1': 'Lay on profile: “About X” 0',
        'handystaender.s6.h2': 'Open “Print check”',
        'handystaender.s6.h3': 'Click “Check”',
        'handystaender.s6.h4': 'Overhang? Undo chamfer, top only',

        'handystaender.s7.title': 'Save for the printer',
        'handystaender.s7.text': '<p>Click <b>“Export”</b> (or <b>Ctrl+E</b>), then <b>“Export STL”</b>.</p>' +
            '<p>In the slicer the stand already lies the right way: profile down, no supports needed.</p>',
        'handystaender.s7.t1': 'Exported an STL file',
        'handystaender.s7.h1': 'Click “Export”',
        'handystaender.s7.h2': 'Export STL',

        'handystaender.s8.title': 'Challenge',
        'handystaender.s8.text': '<p>Now without help: a <b>cable hole</b>, so the charging cable fits through the lip.</p>' +
            '<ul><li>Put a shape set to <b>“Hole”</b> through the lip and group it with the stand.</li>' +
            '<li><b>“Print check”</b>: a round tunnel lying across the print direction has an overhang at the top.</li>' +
            '<li>Make it printable – e.g. with a box stood on its corner: its 45° roof prints without supports.</li></ul>',
        'handystaender.s8.t1': 'Cable hole built, no overhang',

        'handystaender.s9.title': 'Done!',
        'handystaender.s9.text': '<p>You sketched a profile with exact angles, extruded it, chamfered it and checked it’s ready to print. 🎉</p>' +
            '<p>Ideas: a <b>tablet stand</b> with a longer backrest at 70°, a stand for two phones, softer corners in the sketch with <b>“Fillet corner”</b>, or your name engraved in the side.</p>',
        'handystaender.s9.t1': 'Built my own variant',
        'handystaender.s9.t2': 'Printed it or viewed it in the slicer'
    });
})(typeof window !== 'undefined' ? window : globalThis);
