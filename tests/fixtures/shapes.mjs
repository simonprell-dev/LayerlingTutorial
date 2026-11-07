// Testszenen im Layerling-Format (x/z Mitte, elevation Unterkante, Maße in mm).
export const plate = {id: 'p', name: 'Box', kind: 'box', color: '#ff9f43', x: 0, z: 0, elevation: 0, size: 70, width: 70, depth: 25, height: 3, rotation: 0};
export const text = {id: 't', name: 'Text', kind: 'text', color: '#333333', text: 'Mia', x: -5, z: 0, elevation: 3, size: 40, width: 40, depth: 12, height: 2, rotation: 0};
export const hole = {id: 'h', name: 'Cylinder', kind: 'cylinder', color: '#888888', hole: true, x: 28, z: 0, elevation: -1, size: 5, width: 5, depth: 5, height: 6, rotation: 0};
export const oldBoxShape = {id: 'old', name: 'Box', kind: 'box', color: '#cccccc', x: 200, z: 200, elevation: 0, size: 20, width: 20, depth: 20, height: 20, rotation: 0};

// Gruppen wie in Layerling 1.150: kind 'mesh', Teile relativ zur Gruppe (hier liegt die Gruppe im Ursprung).
const group = (id, parts) => ({id, name: 'Group', kind: 'mesh', color: '#ff9f43', groupOperation: 'group', groupedShapes: parts,
    x: 0, z: 0, elevation: 0, size: 70, width: 70, depth: 25, height: 6, rotation: 0});

export const S = {
    empty: [],
    oldBox: [oldBoxShape],
    plate: [plate],
    plateText: [plate, text],
    plateTextHole: [plate, text, hole],
    finishedGroup: [group('g', [plate, text, hole])],
    rotatedPlate: [{...plate, width: 25, depth: 70}],
    turnedPlate: [{...plate, rotation: 90}],
    hugePlate: [{...plate, width: 200}],
    floatingText: [plate, {...text, elevation: 8}],
    solidCylinder: [plate, text, {...hole, hole: false}],
    bigHole: [plate, text, {...hole, width: 12, depth: 12}],
    emptyText: [plate, {...text, text: '   '}],
    groupWithoutText: [group('g', [plate, hole]), text]
};
