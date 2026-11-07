/* Course texts English. Keys must be the same in all language files (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.en = Object.assign(LK.i18n.messages.en || {}, {
        'common.courseName': 'Intro Course for Layerling',
        'common.next': 'Next',
        'common.back': 'Back',
        'common.close': 'Close',
        'common.start': 'Let’s go',
        'common.done': 'Done!',

        'level.title': 'How much 3D design have you done?',
        'level.intro': 'Pick a starting point. All chapters stay open – you can switch any time.',
        'level.neu': 'New to this',
        'level.neu.desc': 'The hand shows you every click.',
        'level.etwas': 'Done some 3D',
        'level.etwas.desc': 'The hand only shows you something when you click 👆.',
        'level.profi': 'I know Tinkercad or similar',
        'level.profi.desc': 'Less help, faster pace.',
        'level.comingSoon': 'coming soon',

        'panel.launcher': 'Start course',
        'panel.overview': 'Overview',
        'panel.chapter': 'Chapter {n}',
        'panel.step': 'Step {n} of {total}',
        'panel.tasks': 'Your tasks',
        'panel.manualHint': 'Click to tick off',
        'panel.showHint': '👆 Show me',
        'panel.hintsOn': 'Hints on',
        'panel.hintsOff': 'Hints off',
        'panel.chooseLevel': 'Choose level',
        'panel.stepDone': 'Great – step done!',
        'panel.chapterDone': 'Chapter done!',
        'panel.chapterDoneText': 'You finished “{title}”. The next chapter continues as soon as it is available.',
        'panel.courseDone': 'You finished all available chapters. New chapters arrive with the next updates.',
        'panel.openEditor': 'Open a 3D design first, then the course begins.',
        'panel.independent': 'Independent project – not affiliated with Layerling.',

        'access.unknownVersion': 'I don’t know this Layerling version yet – please tick off the tasks yourself.',

        'transition.title': 'Save your design',
        'transition.text': '<p>Your design is saved in your browser automatically. For the next chapter you start a <b>new design</b>.</p>',
        'transition.task.export': 'Exported the finished part (if you want to print it)',
        'transition.task.newDesign': 'Created a new 3D design',

        'kind.info': 'Info',
        'kind.learn': 'Learn',
        'kind.creative': 'Create',
        'kind.game': 'Try it',
        'kind.challenge': 'Challenge',
        'kind.save': 'Save',

        'type.basics': 'Basics',
        'type.sketch': 'Sketch',
        'type.body': 'Bodies',
        'type.mechanics': 'Mechanics',

        // ---------- Chapter 1: Name tag ----------
        'namensschild.title': 'Your name tag',
        'namensschild.desc': 'A plate, your name, a hole for a key ring – and your first printable part is done.',

        'namensschild.s1.title': 'What are we building?',
        'namensschild.s1.text': '<p>You’ll build a <b>name tag</b> for the 3D printer: a flat plate with your name on top and a hole for a key ring.</p>' +
            '<p>Along the way you learn the key moves in Layerling: adding shapes, typing exact sizes, combining shapes and saving the result for your printer.</p>' +
            '<p>Have a quick look at the marked areas, then click <b>Next</b>.</p>',
        'namensschild.s1.l1': 'Add shapes here',
        'namensschild.s1.l2': 'Your workplane',
        'namensschild.s1.l3': 'Turn the view',

        'namensschild.s2.title': 'New design',
        'namensschild.s2.text': '<p>Every project starts with an empty design. On the start page, click <b>“Create new 3D design”</b>.</p>' +
            '<p>Layerling saves your design in your browser automatically.</p>',
        'namensschild.s2.t1': 'Opened an empty 3D design',
        'namensschild.s2.h1': 'Create a new design',

        'namensschild.s3.title': 'The base plate',
        'namensschild.s3.text': '<p>Click <b>“Add shape”</b>, then <b>“Box”</b>. The box now follows your mouse – click on the workplane to put it down.</p>',
        'namensschild.s3.t1': 'Put a box on the workplane',
        'namensschild.s3.h1': 'Click “Add shape”',
        'namensschild.s3.h2': 'Pick Box, then place it',
        'namensschild.s3.h3': 'Now click the workplane',

        'namensschild.s4.title': 'Exact sizes',
        'namensschild.s4.text': '<p>A name tag is flat. Click the box. Its <b>Properties</b> appear on the right.</p>' +
            '<p>Type in these sizes and press <b>Enter</b> after each:</p>' +
            '<ul><li><b>Length</b> 70 mm</li><li><b>Width</b> 25 mm</li><li><b>Height</b> 3 mm</li></ul>' +
            '<p>Is <b>“Keep proportions”</b> ticked? Untick it – otherwise all sizes change together.</p>' +
            '<p>Your tag may be a bit bigger or smaller.</p>',
        'namensschild.s4.t1': 'Plate is about 70 × 25 × 3 mm',
        'namensschild.s4.h1': 'Click the box',
        'namensschild.s4.h2': 'Type the sizes here',
        'namensschild.s4.h3': 'Untick this first',

        'namensschild.s5.title': 'Your name',
        'namensschild.s5.text': '<p>Use <b>“Add shape”</b> to get the <b>“Text”</b> shape and click with it <b>onto your plate</b>.</p>' +
            '<p>The properties on the right say “TEXT”. Type your name there – or any other word.</p>',
        'namensschild.s5.t1': 'Placed a text with your name',
        'namensschild.s5.h1': 'Click “Add shape”',
        'namensschild.s5.h2': 'Pick Text, click the plate',
        'namensschild.s5.h3': 'Type your name here',
        'namensschild.s5.h4': 'Now click the plate',

        'namensschild.s6.title': 'Letters on the plate',
        'namensschild.s6.text': '<p>The letters should sit <b>on</b> the plate and stick out only a little.</p>' +
            '<ul><li>Is the text next to the plate? Drag it onto the plate.</li>' +
            '<li>Set the text’s <b>Height</b> to about <b>2 mm</b>.</li>' +
            '<li>Name doesn’t fit? Make the letters smaller.</li></ul>',
        'namensschild.s6.t1': 'Text sits on the plate',
        'namensschild.s6.t2': 'Letters are flat (about 2 mm high)',
        'namensschild.s6.h1': 'Drag the text onto the plate',
        'namensschild.s6.h2': 'Height to 2 mm',

        'namensschild.s7.title': 'A hole for the key ring',
        'namensschild.s7.text': '<p>In Layerling you make holes with a <b>Hole</b> shape: a shape that removes material.</p>' +
            '<ul><li>Get a <b>“Cylinder”</b>.</li>' +
            '<li>On the right, click <b>“Hole”</b> – the cylinder turns see-through.</li>' +
            '<li>Make it about <b>5 mm</b> wide and taller than the plate.</li>' +
            '<li>Move it to a corner of the plate.</li>' +
            '<li>Floating or sunk too deep? Click <b>“Drop to workplane”</b> (in the <b>“Arrange”</b> section).</li></ul>',
        'namensschild.s7.t1': 'Cylinder is a hole',
        'namensschild.s7.t2': 'About 5 mm wide (3–8 mm)',
        'namensschild.s7.t3': 'Sits on the plate and goes all the way through',
        'namensschild.s7.h1': 'Click “Add shape”',
        'namensschild.s7.h2': 'Pick Cylinder, place it',
        'namensschild.s7.h3': 'Click “Hole”',
        'namensschild.s7.h4': 'Diameter about 5 mm',
        'namensschild.s7.h5': 'Move it to a corner',
        'namensschild.s7.h6': 'Click next to the plate',
        'namensschild.s7.h7': 'Drop to workplane',

        'namensschild.s8.title': 'Put it all together',
        'namensschild.s8.text': '<p>Right now these are three separate shapes. <b>Grouping</b> merges them: the letters grow out of the plate and the hole cuts through.</p>' +
            '<ul><li>Select everything: <b>Ctrl+A</b> or drag a frame around it all.</li>' +
            '<li>Click <b>“Group”</b> at the top (in the <b>“Combine”</b> section) – or press <b>Ctrl+G</b>.</li></ul>',
        'namensschild.s8.t1': 'Plate, text and hole are grouped',
        'namensschild.s8.h1': 'Select all (Ctrl+A)',
        'namensschild.s8.h2': 'Click “Group”',

        'namensschild.s9.title': 'Look all around',
        'namensschild.s9.text': '<p>Look at your tag from every side. Click the faces of the <b>view cube</b> or turn the view with the right mouse button.</p>' +
            '<p>Check: does the hole go all the way through? Do the letters sit cleanly on top?</p>',
        'namensschild.s9.t1': 'Looked from the top and the side',
        'namensschild.s9.t2': 'The hole goes all the way through',
        'namensschild.s9.h1': 'Turn the view here',

        'namensschild.s10.title': 'Save for the printer',
        'namensschild.s10.text': '<p>Your 3D printer needs an <b>STL file</b> to print the tag.</p>' +
            '<p>Click <b>“Export”</b> (or <b>Ctrl+E</b>), then <b>“Export STL”</b>. The file lands in your downloads folder – open it in your printer’s slicer.</p>',
        'namensschild.s10.t1': 'Exported an STL file',
        'namensschild.s10.h1': 'Click “Export”',
        'namensschild.s10.h2': 'Export STL',

        'namensschild.s11.title': 'Challenge',
        'namensschild.s11.text': '<p>Now without help! Pick an idea:</p>' +
            '<ul><li><b>Round corners:</b> use a <b>“Rounded box”</b> instead of the box.</li>' +
            '<li><b>Engraving:</b> switch the text to <b>“Hole”</b> and let it reach a little into the plate – the name gets engraved instead of raised.</li>' +
            '<li><b>Frame:</b> build a thin raised border around the plate.</li></ul>' +
            '<p>Tip: double-click a group to edit its parts again.</p>',
        'namensschild.s11.t1': 'Built one idea',

        'namensschild.s12.title': 'Well done!',
        'namensschild.s12.text': '<p>You designed your first printable part. 🎉</p>' +
            '<p>More ideas: door sign, luggage tag, bookmark, gift tag.</p>' +
            '<p><b>Bonus:</b> Layerling also has a ready-made <b>“Name tag”</b> tool (in <b>“Add shape”</b>, section <b>“Lettering &amp; signs”</b>). It makes a tag like this in one click – even with several colour layers. Give it a try!</p>',
        'namensschild.s12.t1': 'Tried the “Name tag” tool',
        'namensschild.s12.t2': 'Built my own idea',
        'namensschild.s12.h1': 'Click “Add shape”',
        'namensschild.s12.h2': 'Ready-made name tag',
        'namensschild.s12.h3': 'Click the workplane',

        // ---------- Chapters 2–6: announced ----------
        'lesezeichen.title': 'Bookmark with your own shape',
        'lesezeichen.desc': 'Sketch your own outline, round the corners, extrude it and engrave text.',
        'stiftebecher.title': 'Pen holder',
        'stiftebecher.desc': 'Hollow out a body, add a hole pattern all around, round the edges.',
        'handystaender.title': 'Phone stand',
        'handystaender.desc': 'Sketch a profile with an angle, add chamfers and use the overhang warning.',
        'schraubdose.title': 'Jar with a screw lid',
        'schraubdose.desc': 'Threads, two parts with clearance, measuring and aligning.',
        'getriebe.title': 'Crank gearbox',
        'getriebe.desc': 'Gears, axles and several build plates.'
    });
})(typeof window !== 'undefined' ? window : globalThis);
