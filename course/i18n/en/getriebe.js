/* Kurstexte Englisch für Kapitel „getriebe“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'getriebe.s1.title': 'What are we building?',
        'getriebe.s1.text': '<p>A small printable <b>crank gearbox</b>: a base plate with two axles, one gear with 12 and one with 24 teeth, and a crank on the big gear.</p>' +
            '<p>One turn of the crank turns the small gear <b>twice</b> – a 2:1 ratio.</p>' +
            '<p>The key idea: the <b>centre distance</b>. Get it right and the teeth mesh cleanly. At the end you spread the parts over several <b>build plates</b>.</p>',
        'getriebe.s1.l1': 'Gears, boxes, cylinders',
        'getriebe.s1.l2': 'Build plates',
        'getriebe.s1.l3': 'Turn the view',

        'getriebe.s2.title': 'The small gear',
        'getriebe.s2.text': '<p>Use <b>“Add shape”</b> to get a <b>“Gear”</b> and place it.</p>' +
            '<p>The <b>“Teeth”</b> card shows <b>“Teeth”</b> and <b>“Module (mm)”</b>. The <b>module</b> is the tooth size: outside diameter = module × (teeth + 2). ' +
            'New gears have 12 teeth and module 2 – that makes 28 mm. Keep <b>“Tooth Shape”</b> on <b>“Involute”</b>; only then do gears mesh cleanly.</p>',
        'getriebe.s2.t1': 'Placed a gear',
        'getriebe.s2.t2': 'Involute, about 12 teeth (8–20)',
        'getriebe.s2.h1': 'Click “Add shape”',
        'getriebe.s2.h2': 'Pick “Gear”',
        'getriebe.s2.h3': 'Click on the workplane',
        'getriebe.s2.h4': 'Tooth Shape: “Involute”',
        'getriebe.s2.h5': 'Set the teeth',

        'getriebe.s3.title': 'The big gear',
        'getriebe.s3.text': '<p>Place a second <b>“Gear”</b> next to it and give it twice the <b>“Teeth”</b>: <b>24</b>.</p>' +
            '<p>Important: two gears only mesh if they have <b>the same module</b>. So change the teeth, not the size – Layerling works out the diameter itself (2 × 26 = 52 mm).</p>',
        'getriebe.s3.t1': 'Gear with twice the teeth',
        'getriebe.s3.t2': 'Both gears: same module',
        'getriebe.s3.h1': 'Click “Add shape”',
        'getriebe.s3.h2': 'Another “Gear”',
        'getriebe.s3.h3': 'Place it next to the first',
        'getriebe.s3.h4': 'Double the teeth',
        'getriebe.s3.h5': 'Same module as gear 1',

        'getriebe.s4.title': 'The centre distance',
        'getriebe.s4.text': '<p>The distance between the two gear centres is the <b>centre distance</b>:</p>' +
            '<p><b>centre distance = module × (teeth 1 + teeth 2) / 2</b> → 2 × (12 + 24) / 2 = <b>36 mm</b>.</p>' +
            '<p>Select both gears (Shift + click). Layerling then shows the distance they need and the one they have. ' +
            'Clicking <b>“Keep Gear, fit the other”</b> moves the other gear exactly into place. Or type the numbers under <b>“Position”</b> yourself (X: 0 and 36).</p>',
        'getriebe.s4.t1': 'Gears at the centre distance',
        'getriebe.s4.h1': 'Select both gears',
        'getriebe.s4.h2': 'Keep one, fit the other',

        'getriebe.s5.title': 'Base plate and axles',
        'getriebe.s5.text': '<p>Now the frame: a <b>“Box”</b> as the base plate, about 90 × 40 × 4 mm.</p>' +
            '<p>On it, two <b>“Cylinder”</b> shapes as axles – exactly at the <b>centre distance</b> (36 mm), e.g. via <b>“Position”</b>.</p>' +
            '<p><b>Clearance</b> means the axle is a little thinner than the hole, so the gear can turn. The gears’ <b>“Center Hole”</b> is 6 mm, ' +
            'so use a <b>5.5 mm</b> diameter (0.2–1 mm less). The axles must be taller than the gear is thick, e.g. 10 mm.</p>',
        'getriebe.s5.t1': 'Base plate, about 90 × 40 × 4 mm',
        'getriebe.s5.t2': 'Two axles at the centre distance',
        'getriebe.s5.t3': 'Axles with clearance to the hole',
        'getriebe.s5.t4': 'Axles taller than the gears',
        'getriebe.s5.h1': 'Click “Add shape”',
        'getriebe.s5.h8': 'Pick “Box”, place it',
        'getriebe.s5.h2': 'Type the plate size',
        'getriebe.s5.h3': 'Get a “Cylinder” as an axle',
        'getriebe.s5.h4': 'Put it onto the plate',
        'getriebe.s5.h5': 'Diameter about 5.5 mm',
        'getriebe.s5.h6': 'Axles 36 mm apart',
        'getriebe.s5.h7': 'Axles taller than the gears',

        'getriebe.s6.title': 'Crank and groups',
        'getriebe.s6.text': '<p>Click a <b>“Cylinder”</b> onto the <b>big gear</b>, near its edge – that’s the crank handle (about 6 mm thick, 15 mm tall).</p>' +
            '<p>So that each print comes out as one part, group twice (<b>“Group”</b> or <b>Ctrl+G</b>):</p>' +
            '<ul><li>big gear + crank</li><li>base plate + both axles</li></ul>',
        'getriebe.s6.t1': 'Crank off-centre on the big gear',
        'getriebe.s6.t2': 'Crank and gear grouped',
        'getriebe.s6.t3': 'Plate and axles grouped',
        'getriebe.s6.h1': 'Get a “Cylinder”',
        'getriebe.s6.h2': 'Onto the big gear, near the edge',
        'getriebe.s6.h3': 'Select gear and crank',
        'getriebe.s6.h4': 'Click “Group”',
        'getriebe.s6.h5': 'Select plate and axles',
        'getriebe.s6.h6': '“Group” again',

        'getriebe.s7.title': 'Several build plates',
        'getriebe.s7.text': '<p>Assembled, the gearbox can’t be printed. So the parts go onto their own <b>build plates</b> – each as large as the workplane.</p>' +
            '<ul><li>Click <b>“Build plates”</b> at the top (section <b>“Arrange”</b>): the plate bar appears at the bottom.</li>' +
            '<li>Right-click a gear → <b>“Onto plate…”</b> → <b>“Onto a new plate”</b>. The other gear goes onto the same new plate or another one.</li></ul>' +
            '<p>Each plate button shows how many bodies stand on it. Check that no part sticks out over the edge of its plate.</p>',
        'getriebe.s7.t1': 'Opened the plate bar',
        'getriebe.s7.t2': 'Parts on at least two plates',
        'getriebe.s7.t3': 'Nothing sticks out (check yourself)',
        'getriebe.s7.h1': 'Click “Build plates”',
        'getriebe.s7.h2': 'Right-click: “Onto plate…”',
        'getriebe.s7.h3': 'Keep parts on the plate',

        'getriebe.s8.title': 'Test spin',
        'getriebe.s8.text': '<p>Click <b>“Show all plates”</b> in the plate bar and look at everything from above and from the side.</p>' +
            '<p>Check in your head: does each gear’s hole fit an axle? Is the crank on the big gear? Once printed: put the gears on, turn the crank – the small gear spins twice as fast.</p>',
        'getriebe.s8.t1': 'Looked at all plates',
        'getriebe.s8.t2': 'Holes and axles fit together',
        'getriebe.s8.h1': 'Show all plates',

        'getriebe.s9.title': 'Save for the printer',
        'getriebe.s9.text': '<p>Press <b>Esc</b> first – if something is selected, Layerling only exports the selection.</p>' +
            '<p>Click <b>“Export”</b> (or <b>Ctrl+E</b>). With several plates you can choose <b>“One file per plate (ZIP)”</b> under <b>“Plates”</b> – your slicer opens each file as its own plate.</p>' +
            '<p>Then click <b>“Export STL”</b>.</p>',
        'getriebe.s9.t1': 'Exported the gearbox',
        'getriebe.s9.h1': 'Click “Export”',
        'getriebe.s9.h2': 'Export STL',

        'getriebe.s10.title': 'Challenge',
        'getriebe.s10.text': '<p>Now without help! Pick an idea:</p>' +
            '<ul><li><b>Idler gear:</b> a third gear between the two – then the small gear turns the same way as the crank. Work out the centre distances again!</li>' +
            '<li><b>More reduction:</b> 12 to 36 teeth (3:1) – how far apart must the axles be now?</li>' +
            '<li><b>Axle holes:</b> instead of fixed pins, holes in the plate (as a <b>“Hole”</b>) and loose pins – with clearance.</li></ul>',
        'getriebe.s10.t1': 'Built one idea',

        'getriebe.s11.title': 'Done!',
        'getriebe.s11.text': '<p>Your gearbox is finished. ⚙️</p>' +
            '<p>What next: helical gears (<b>“Gear Type”</b> → <b>“Helical gear”</b>) run more quietly, a <b>“Rack”</b> turns rotation into sliding, a <b>“Ring gear”</b> is the start of a planetary gearbox.</p>',
        'getriebe.s11.t1': 'Tried another gear type',
        'getriebe.s11.t2': 'Built my own idea'
    });
})(typeof window !== 'undefined' ? window : globalThis);
