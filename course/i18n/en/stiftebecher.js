/* Kurstexte Englisch für Kapitel „stiftebecher“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'stiftebecher.s1.title': 'What are we building?',
        'stiftebecher.s1.text': '<p>You’ll build a <b>pen cup</b>: a round cup with a thin wall, a pattern of holes all around and a soft, rounded rim.</p>' +
            '<p>On the way you’ll meet three powerful tools. They change a body instead of adding new shapes:</p>' +
            '<ul><li><b>“Hollow”</b> turns a solid body into a shell.</li>' +
            '<li><b>“Fillet”</b> rounds off edges.</li>' +
            '<li><b>“Hole pattern”</b> adds lots of holes at once.</li></ul>' +
            '<p>You’ll find them at the top in the <b>“Edges &amp; walls”</b> and <b>“Mirror &amp; pattern”</b> sections. Then click <b>Next</b>.</p>',
        'stiftebecher.s1.l1': 'Hollow',
        'stiftebecher.s1.l2': 'Round off edges',
        'stiftebecher.s1.l3': 'Hole pattern',

        'stiftebecher.s2.title': 'The cup body',
        'stiftebecher.s2.text': '<p>Create a <b>new 3D design</b>. Then use <b>“Add shape”</b> to get a <b>“Cylinder”</b> and click it onto the workplane.</p>' +
            '<p>Click the cylinder and type into the <b>Properties</b> on the right (press <b>Enter</b> after each):</p>' +
            '<ul><li><b>Diameter</b> 70 mm</li><li><b>Height</b> 100 mm</li></ul>' +
            '<p>Your cup may be a bit wider, narrower or smaller (diameter 60–90 mm, height 80–120 mm).</p>',
        'stiftebecher.s2.t1': 'Opened a new 3D design',
        'stiftebecher.s2.t2': 'Cylinder about 70 mm wide, 100 mm tall',
        'stiftebecher.s2.h1': 'Create a new design',
        'stiftebecher.s2.h2': 'Click “Add shape”',
        'stiftebecher.s2.h3': 'Pick Cylinder, then place it',
        'stiftebecher.s2.h4': 'Now click the workplane',
        'stiftebecher.s2.h5': 'Diameter 70, height 100',

        'stiftebecher.s3.title': 'Hollow it out',
        'stiftebecher.s3.text': '<p>Right now your cup is a solid block. <b>Hollow</b> turns it into a shell: the <b>wall</b> (the thin side) grows inwards, the outside stays the same.</p>' +
            '<ul><li>Click the cylinder.</li>' +
            '<li>Click <b>“Hollow”</b> at the top (<b>“Edges &amp; walls”</b> section).</li>' +
            '<li><b>“Wall thickness”</b>: 2 mm. Under <b>“Open sides”</b> only <b>“Top”</b> is marked – the bottom stays closed.</li>' +
            '<li>Click <b>“Hollow”</b> at the bottom of the panel. Layerling needs a moment.</li></ul>' +
            '<p>The shape is still called “Cylinder”, but now it is an edited body.</p>',
        'stiftebecher.s3.t1': 'Cup is hollowed out',
        'stiftebecher.s3.t2': 'Wall about 2 mm thick',
        'stiftebecher.s3.t3': 'Open at the top, closed bottom',
        'stiftebecher.s3.h1': 'Click the cylinder',
        'stiftebecher.s3.h2': 'Click “Hollow”',
        'stiftebecher.s3.h3': 'Wall thickness 2 mm',
        'stiftebecher.s3.h4': 'Mark only “Top”',
        'stiftebecher.s3.h5': 'Click “Hollow”',
        'stiftebecher.s3.h6': 'Undo (Ctrl+Z), hollow again',

        'stiftebecher.s4.title': 'A soft rim',
        'stiftebecher.s4.text': '<p>Sharp edges poke. A <b>fillet</b> makes the top rim round and comfortable.</p>' +
            '<ul><li>Click the cup.</li>' +
            '<li>Click <b>“Fillet”</b> at the top (<b>“Edges &amp; walls”</b> section) – or press <b>B</b>. Layerling prepares the edges for a moment.</li>' +
            '<li>Click <b>“Top edges”</b>. Those are the edges of the rim.</li>' +
            '<li><b>“Radius”</b>: 0.8 mm. The wall is only 2 mm thick, more won’t fit. An error message? Then the radius is too big.</li>' +
            '<li>Click <b>“Apply”</b>, then <b>“Done”</b>.</li></ul>' +
            '<p>Why before the hole pattern? Right now the cup has only four edges. With lots of holes Layerling would have to check hundreds of edges – that takes a very long time.</p>',
        'stiftebecher.s4.t1': 'Rim is rounded',
        'stiftebecher.s4.h1': 'Click the cup',
        'stiftebecher.s4.h2': 'Click “Fillet”',
        'stiftebecher.s4.h3': 'Pick “Top edges”',
        'stiftebecher.s4.h4': 'Radius 0.8 mm',
        'stiftebecher.s4.h5': 'Click “Apply”',

        'stiftebecher.s5.title': 'Holes all around',
        'stiftebecher.s5.text': '<p>Now the wall gets a pattern of holes. It looks great and saves material.</p>' +
            '<ul><li>Click the cup.</li>' +
            '<li>Click <b>“Hole pattern”</b> at the top (<b>“Mirror &amp; pattern”</b> section).</li>' +
            '<li>Click the <b>round wall</b> of the cup – not the bottom. Layerling previews the holes all around.</li>' +
            '<li>Try a <b>“Hole shape”</b> and size. Bigger holes and more spacing give fewer holes. Keep <b>“Depth”</b> on <b>“Through the wall”</b>.</li>' +
            '<li>Click <b>“Create”</b>.</li></ul>' +
            '<p>The holes are <b>Hole</b> shapes and get grouped with the cup.</p>',
        'stiftebecher.s5.t1': 'Holes sit in the wall',
        'stiftebecher.s5.t2': 'Holes go all around',
        'stiftebecher.s5.h1': 'Click the cup',
        'stiftebecher.s5.h2': 'Click “Hole pattern”',
        'stiftebecher.s5.h3': 'Click the round wall',
        'stiftebecher.s5.h4': 'Click “Create”',

        'stiftebecher.s6.title': 'Look all around',
        'stiftebecher.s6.text': '<p>Look at your cup from every side. Click the faces of the <b>view cube</b> or turn the view with the right mouse button.</p>' +
            '<p>Look inside from the top: is the bottom closed? Do the holes go through the wall?</p>',
        'stiftebecher.s6.t1': 'Looked inside from the top',
        'stiftebecher.s6.t2': 'Bottom closed, holes go through',
        'stiftebecher.s6.h1': 'Turn the view here',

        'stiftebecher.s7.title': 'Save for the printer',
        'stiftebecher.s7.text': '<p>Save your cup as an <b>STL file</b> for the 3D printer.</p>' +
            '<p>Click <b>“Export”</b> (or <b>Ctrl+E</b>), then <b>“Export STL”</b>. Tip: the cup stands on its bottom – so it prints without supports.</p>',
        'stiftebecher.s7.t1': 'Exported an STL file',
        'stiftebecher.s7.h1': 'Click “Export”',
        'stiftebecher.s7.h2': 'Export STL',

        'stiftebecher.s8.title': 'Challenge',
        'stiftebecher.s8.text': '<p>Now without help! Build a <b>mini cup</b> for erasers and paper clips:</p>' +
            '<ul><li>about <b>40 mm</b> in diameter and <b>50 mm</b> tall,</li>' +
            '<li>hollowed out, open at the top, closed bottom.</li></ul>' +
            '<p>Put it next to the big cup. Want more? Give it a hole pattern too.</p>',
        'stiftebecher.s8.t1': 'Mini cup hollowed out',
        'stiftebecher.s8.h1': 'Get a new cylinder',
        'stiftebecher.s8.h2': 'Hollow the mini cup',
        'stiftebecher.s8.h3': 'Click the workplane',

        'stiftebecher.s9.title': 'Well done!',
        'stiftebecher.s9.text': '<p>Your pen cup is finished. 🎉 Now you can hollow bodies, add hole patterns and round off edges.</p>' +
            '<p>Ideas to keep building:</p>' +
            '<ul><li>Put your <b>name</b> on a small base in front of the cup.</li>' +
            '<li>Try another <b>“Hole shape”</b>, for example <b>“Slot”</b>.</li>' +
            '<li>Build a <b>desk organiser</b> from several cups in different sizes.</li>' +
            '<li>Hollow out a <b>box</b> – and you get a tray.</li></ul>',
        'stiftebecher.s9.t1': 'Tried one idea',
        'stiftebecher.s9.t2': 'Printed the cup or sent it to print',
        'stiftebecher.s9.h1': 'Click “Add shape”',
        'stiftebecher.s9.h2': 'Pick Text, then place it',
        'stiftebecher.s9.h3': 'Click the workplane'
    });
})(typeof window !== 'undefined' ? window : globalThis);
