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

    // Teile einer Gruppe liegen in Layerling relativ zur Gruppe (x/z/elevation, Drehung um die
    // Hochachse). Für die Prüfungen wird alles in absolute Koordinaten umgerechnet (Kopien).
    function toAbsolute (part, parent) {
        if (!parent) return part;
        const rad = num(parent.rotation, 0) * Math.PI / 180;
        const px = num(part.x, 0);
        const pz = num(part.z, 0);
        return Object.assign({}, part, {
            x: num(parent.x, 0) + px * Math.cos(rad) + pz * Math.sin(rad),
            z: num(parent.z, 0) - px * Math.sin(rad) + pz * Math.cos(rad),
            elevation: num(parent.elevation, 0) + num(part.elevation, 0),
            rotation: num(parent.rotation, 0) + num(part.rotation, 0)
        });
    }

    function flatten (shapes) {
        const out = [];
        const walk = (list, groupIds, parent) => {
            (list || []).forEach(raw => {
                if (!raw) return;
                const shape = toAbsolute(raw, parent);
                out.push({shape, groupIds});
                if (Array.isArray(raw.groupedShapes)) walk(raw.groupedShapes, groupIds.concat(raw.id), shape);
            });
        };
        walk(Array.isArray(shapes) ? shapes : [], [], null);
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

    // Richtung der langen Seite auf der Arbeitsebene in Grad (0–180).
    function longAxis (shape) {
        const turn = num(shape.width, 0) >= num(shape.depth, 0) ? 0 : 90;
        return (((num(shape.rotation, 0) + turn) % 180) + 180) % 180;
    }

    // Laufen die langen Seiten zweier Formen in dieselbe Richtung (bis tol Grad schräg)?
    function sameDirection (a, b, tol = 15) {
        const diff = Math.abs(longAxis(a) - longAxis(b));
        return Math.min(diff, 180 - diff) <= tol;
    }

    // Liegt inner auf der Arbeitsebene innerhalb von outer (Hüllquader, tol mm Spielraum)?
    function insideXZ (inner, outer, tol) {
        const I = bounds(inner);
        const O = bounds(outer);
        return I.minX >= O.minX - tol && I.maxX <= O.maxX + tol && I.minZ >= O.minZ - tol && I.maxZ <= O.maxZ + tol;
    }

    LK.geometry = {flatten, bounds, sizeOf, overlapXZ, distance, touchesTop, longAxis, sameDirection, insideXZ};
})(typeof window !== 'undefined' ? window : globalThis);
