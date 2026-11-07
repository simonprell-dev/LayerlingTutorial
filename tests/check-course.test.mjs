import test from 'node:test';
import assert from 'node:assert/strict';
import {findProblems, loadCourse} from '../tools/check-course.mjs';

const fake = () => ({
    course: {chapters: [{id: 'a', title: 'a.title', desc: 'a.desc', steps: [
        {kind: 'learn', title: 'a.s1.title', text: 'a.s1.text',
            tasks: [{text: 'a.s1.t1', check: () => true}],
            hints: [{target: 'gibtsNicht', text: 'a.s1.h1', done: () => true}]}
    ]}]},
    messages: {
        de: {'a.title': 'A', 'a.desc': 'A', 'a.s1.title': 'T', 'a.s1.text': 'T', 'a.s1.t1': 'x', 'a.s1.h1': 'h'},
        en: {'a.title': 'A', 'a.desc': 'A', 'a.s1.title': 'T', 'a.s1.text': 'T', 'a.s1.t1': 'x'}
    },
    targets: {addShape: () => null}
});

test('findProblems: fehlender EN-Schlüssel und unbekanntes Ziel', () => {
    const {course, messages, targets} = fake();
    const problems = findProblems(course, messages, targets);
    assert.equal(problems.length, 2, problems.join('\n'));
    assert.ok(problems.some(p => p.includes('en') && p.includes('a.s1.h1')));
    assert.ok(problems.some(p => p.includes('gibtsNicht')));
});

test('findProblems: learn ohne check, Hinweis ohne done, doppelte id', () => {
    const {course, messages, targets} = fake();
    messages.en['a.s1.h1'] = 'h';
    course.chapters[0].steps[0].hints[0] = {target: 'addShape', text: 'a.s1.h1'};
    course.chapters[0].steps[0].tasks[0] = {text: 'a.s1.t1'};
    course.chapters.push({...course.chapters[0], steps: []});
    const problems = findProblems(course, messages, targets);
    assert.equal(problems.length, 3, problems.join('\n'));
});

test('echter Kurs: keine Probleme', () => {
    const {course, messages, targets, tools} = loadCourse();
    assert.deepEqual(findProblems(course, messages, targets, tools), []);
});
