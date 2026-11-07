/* Kurstexte Englisch für Kapitel „lesezeichen“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'lesezeichen.s1.title': 'What are we building?',
        'lesezeichen.s1.text': '<p>You build a <b>bookmark</b> with your own outline and your name engraved into it.</p>' +
            '<p>This time you do not start with a ready-made shape but with a <b>sketch</b>: a flat drawing made of points and lines that Layerling then pulls up into a solid.</p>' +
            '<p>You learn to start a sketch, type in sizes, change the outline, round corners, pull the sketch up and engrave text.</p>' +
            '<p>Best start a <b>new, empty design</b>, then click <b>Next</b>.</p>',
        'lesezeichen.s1.l1': 'Your way to the sketch',
        'lesezeichen.s1.l2': 'Your workplane',

        'lesezeichen.s2.title': 'Start a sketch',
        'lesezeichen.s2.text': '<ul><li>Click the <b>“Sketch”</b> tab at the top.</li>' +
            '<li>Click <b>“Extrude sketch”</b>. <i>Extrude</i> means the outline will later be pulled straight up – like dough pressed through a mould.</li>' +
            '<li>Click <b>“Add sketch shape”</b> and pick <b>“Rectangle”</b>.</li></ul>' +
            '<p>The rectangle is just the start. In the next step it gets the right size.</p>',
        'lesezeichen.s2.t1': 'Sketch is open',
        'lesezeichen.s2.t2': 'Rectangle in the sketch',
        'lesezeichen.s2.h1': 'Click “Sketch”',
        'lesezeichen.s2.h2': 'Click “Extrude sketch”',
        'lesezeichen.s2.h3': 'Open the sketch shapes',
        'lesezeichen.s2.h4': 'Pick “Rectangle”',

        'lesezeichen.s3.title': 'The right size',
        'lesezeichen.s3.text': '<p>The rectangle is still small (20 × 20 mm). A bookmark is about <b>50 mm wide</b> and <b>150 mm long</b>.</p>' +
            '<ul><li>Click <b>inside the rectangle</b>. A frame with two sizes appears.</li>' +
            '<li>Click the size at the <b>top</b>, type <b>50</b> and press <b>Enter</b>.</li>' +
            '<li>Click the size on the <b>right</b>, type <b>150</b> and press <b>Enter</b>.</li></ul>' +
            '<p>A bit bigger or smaller is fine too.</p>',
        'lesezeichen.s3.t1': 'Outline is about 50 × 150 mm',
        'lesezeichen.s3.h1': 'Click inside the rectangle',
        'lesezeichen.s3.h2': 'Type 50 here',
        'lesezeichen.s3.h3': 'Type 150 here',

        'lesezeichen.s4.title': 'Your own shape',
        'lesezeichen.s4.text': '<p>Now turn the rectangle into your own shape – for example with a notch at the bottom, like a swallowtail.</p>' +
            '<ul><li>Can’t see the bottom edge? Zoom out with the mouse wheel or <b>“−”</b>.</li>' +
            '<li>Pick <b>“Add or Remove Points”</b> and click the middle of the <b>bottom edge</b>. A new point appears there.</li>' +
            '<li>Pick <b>“Select”</b> and drag the new point about 20 mm inwards.</li></ul>' +
            '<p>You can also pull a tip outwards or add more points – as long as it is your shape.</p>',
        'lesezeichen.s4.t1': 'Outline has a shape of its own',
        'lesezeichen.s4.h1': 'Zoom out first',
        'lesezeichen.s4.h2': 'Pick “Add or Remove Points”',
        'lesezeichen.s4.h3': 'Click the bottom edge',
        'lesezeichen.s4.h4': 'Pick “Select”',
        'lesezeichen.s4.h5': 'Drag the new point inwards',

        'lesezeichen.s5.title': 'Round corners',
        'lesezeichen.s5.text': '<p>Sharp corners catch on the pages. A <b>fillet</b> turns a corner into a small curve.</p>' +
            '<ul><li>With <b>“Select”</b>, click inside your shape – now all corners are selected. For a single corner, click just its point.</li>' +
            '<li>Click <b>“Fillet corner”</b>.</li>' +
            '<li>Type about <b>5</b> for the <b>“Radius”</b> and press <b>Enter</b>.</li></ul>',
        'lesezeichen.s5.t1': 'At least two corners rounded',
        'lesezeichen.s5.h1': 'Pick “Select”',
        'lesezeichen.s5.h2': 'Click inside your shape',
        'lesezeichen.s5.h3': 'Click “Fillet corner”',
        'lesezeichen.s5.h4': 'Radius 5, then Enter',

        'lesezeichen.s6.title': 'Pull it up',
        'lesezeichen.s6.text': '<p>Done drawing? Click <b>“Finish sketch”</b>. Layerling pulls your outline up – 10 mm at first.</p>' +
            '<p>A bookmark has to be thin: click it and set the <b>Height</b> in its properties to <b>2 mm</b> (press Enter). ' +
            'If <b>“Keep proportions”</b> is ticked, untick it first.</p>' +
            '<p>Want to change the outline later? The properties panel has <b>“Edit sketch”</b>.</p>',
        'lesezeichen.s6.t1': 'The sketch became a solid',
        'lesezeichen.s6.t2': 'Bookmark is 1.5 to 3 mm thin',
        'lesezeichen.s6.h1': 'Click “Finish sketch”',
        'lesezeichen.s6.h2': 'Click the bookmark',
        'lesezeichen.s6.h3': 'Untick this first',
        'lesezeichen.s6.h4': 'Height to 2 mm',

        'lesezeichen.s7.title': 'Engrave your name',
        'lesezeichen.s7.text': '<p>An <b>engraving</b> is lettering cut into the surface. To make one, the text becomes a <b>Hole</b> and is lowered a little into the bookmark.</p>' +
            '<ul><li>Get a <b>“Text”</b> from <b>“Add shape”</b>, click on the bookmark with it and type your name.</li>' +
            '<li>Does the name run across and stick out over the edge? Turn it (click the text, press <b>R</b> twice) or make the letters smaller.</li>' +
            '<li>Click <b>“Hole”</b>.</li>' +
            '<li>Open the <b>“Position”</b> card and type <b>1</b> for <b>“Z (height)”</b>. Now the letters sit 1 mm deep in the 2 mm bookmark – a floor stays underneath.</li>' +
            '<li>Select both (<b>Ctrl+A</b>) and click <b>“Group”</b> (<b>Ctrl+G</b>). Only now are the letters cut out.</li></ul>',
        'lesezeichen.s7.t1': 'Name lies fully on the bookmark',
        'lesezeichen.s7.t2': 'Text is a hole',
        'lesezeichen.s7.t3': 'Letters sunk in, not all the way through',
        'lesezeichen.s7.t4': 'Bookmark and text are grouped',
        'lesezeichen.s7.h1': 'Click “Add shape”',
        'lesezeichen.s7.h2': 'Pick Text',
        'lesezeichen.s7.h3': 'Click on the bookmark',
        'lesezeichen.s7.h4': 'Type your name here',
        'lesezeichen.s7.h5': 'Drag the text onto the bookmark',
        'lesezeichen.s7.h6': 'Turn it: R twice, or 90 here',
        'lesezeichen.s7.h7': 'Make the letters smaller',
        'lesezeichen.s7.h8': 'Click “Hole”',
        'lesezeichen.s7.h9': '“Z (height)” to 1 mm',
        'lesezeichen.s7.h10': 'Select all (Ctrl+A)',
        'lesezeichen.s7.h11': 'Click “Group”',

        'lesezeichen.s8.title': 'Look all around',
        'lesezeichen.s8.text': '<p>Turn the view and take a close look at the engraving. Click the faces of the <b>view cube</b> or drag with the right mouse button.</p>' +
            '<p>Check: are the letters cut in, with a floor left underneath? Are the corners round?</p>',
        'lesezeichen.s8.t1': 'Looked from the top and the side',
        'lesezeichen.s8.t2': 'The engraving does not go all the way through',
        'lesezeichen.s8.h1': 'Turn the view here',

        'lesezeichen.s9.title': 'Save it for the printer',
        'lesezeichen.s9.text': '<p>Click <b>“Export”</b> (or <b>Ctrl+E</b>) and then <b>“Export STL”</b>.</p>' +
            '<p>Printing tip: the bookmark lies flat on the print bed. Change the filament colour after 1 mm and the engraving shines in the first colour.</p>',
        'lesezeichen.s9.t1': 'Exported an STL file',
        'lesezeichen.s9.h1': 'Click “Export”',
        'lesezeichen.s9.h2': 'Export STL',

        'lesezeichen.s10.title': 'Challenge',
        'lesezeichen.s10.text': '<p>Now without help! Pick an idea:</p>' +
            '<ul><li><b>Ribbon hole:</b> Cut a round hole at the top for a ribbon – a <b>“Cylinder”</b> as a hole, this time all the way through.</li>' +
            '<li><b>New outline:</b> Reopen your outline with <b>“Edit sketch”</b> and give it a tip, a wave or zigzags.</li>' +
            '<li><b>Picture:</b> Draw a second sketch with a <b>“Star”</b> or <b>“Circle”</b> and engrave it like your name.</li></ul>' +
            '<p>Tip: double-click a group to edit its parts again.</p>',
        'lesezeichen.s10.t1': 'Built one idea',

        'lesezeichen.s11.title': 'Well done!',
        'lesezeichen.s11.text': '<p>Your bookmark is finished. 🎉 You can now sketch your own outlines, round corners, pull sketches up and engrave text.</p>' +
            '<p>Sketches can do much more: a leaf-shaped coaster, a cloud-shaped door sign, a puzzle piece, a cookie cutter.</p>' +
            '<p><b>Bonus:</b> With <b>“Line”</b> you draw completely free outlines – point by point, until you click the first point again.</p>',
        'lesezeichen.s11.t1': 'Drew a shape with “Line”',
        'lesezeichen.s11.t2': 'Built an idea of my own'
    });
})(typeof window !== 'undefined' ? window : globalThis);
