/*
 * Geometrie-Helfer für die Kurs-Prüfungen.
 *
 * Arbeitet auf den Formen, wie Layerling sie im Speicher hält: x/z ist die Mitte auf der
 * Arbeitsebene, elevation die Unterkante (y zeigt nach oben), width/depth/height die Maße in mm,
 * rotation die Drehung um die Hochachse in Grad. Gruppen tragen ihre Teile in groupedShapes.
 * Alles hier rechnet mit Hüllquadern – für großzügige Prüfungen reicht das.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};

    const num = (v, fallback) => (typeof v === 'number' && isFinite(v) ? v : fallback);

    function flatten (shapes) {
        const out = [];
        const walk = (list, groupIds) => {
            (list || []).forEach(shape => {
                if (!shape) return;
                out.push({shape, groupIds});
                if (Array.isArray(shape.groupedShapes)) walk(shape.groupedShapes, groupIds.concat(shape.id));
            });
        };
        walk(Array.isArray(shapes) ? shapes : [], []);
        return out;
    }

    function bounds (shape) {
        const w = num(shape.width, 0);
        const d = num(shape.depth, 0);
        const rad = num(shape.rotation, 0) * Math.PI / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        const halfX = (w * cos + d * sin) / 2;
        const halfZ = (w * sin + d * cos) / 2;
        const x = num(shape.x, 0);
        const z = num(shape.z, 0);
        const minY = num(shape.elevation, 0);
        return {
            minX: x - halfX, maxX: x + halfX,
            minY, maxY: minY + num(shape.height, 0),
            minZ: z - halfZ, maxZ: z + halfZ
        };
    }

    function sizeOf (shape) {
        const w = num(shape.width, 0);
        const d = num(shape.depth, 0);
        return {long: Math.max(w, d), short: Math.min(w, d), h: num(shape.height, 0)};
    }

    function overlapXZ (a, b) {
        const A = bounds(a);
        const B = bounds(b);
        return A.minX < B.maxX && B.minX < A.maxX && A.minZ < B.maxZ && B.minZ < A.maxZ;
    }

    // Kürzester Abstand der Hüllquader in mm (0, wenn sie sich berühren oder überlappen).
    function distance (a, b) {
        const A = bounds(a);
        const B = bounds(b);
        const gap = (minA, maxA, minB, maxB) => Math.max(0, minB - maxA, minA - maxB);
        const dx = gap(A.minX, A.maxX, B.minX, B.maxX);
        const dy = gap(A.minY, A.maxY, B.minY, B.maxY);
        const dz = gap(A.minZ, A.maxZ, B.minZ, B.maxZ);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Liegt upper auf der Oberseite von lower? Entweder setzt es dort auf (±tol) oder es
    // beginnt in lower und ragt oben heraus.
    function touchesTop (upper, lower, tol) {
        const U = bounds(upper);
        const L = bounds(lower);
        if (Math.abs(U.minY - L.maxY) <= tol) return true;
        return U.minY >= L.minY - tol && U.minY < L.maxY && U.maxY > L.maxY + tol / 2;
    }

    LK.geometry = {flatten, bounds, sizeOf, overlapXZ, distance, touchesTop};
})(typeof window !== 'undefined' ? window : globalThis);
