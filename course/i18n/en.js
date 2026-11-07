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
        'transition.task.newDesign': 'Created a new 3D design'
    });
})(typeof window !== 'undefined' ? window : globalThis);
