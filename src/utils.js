function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function pointInPoly(pt, verts) {
    // I just copied this ugly code
    let c = false;
    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
        if (((verts[i].y > pt.y) != (verts[j].y > pt.y)) && (pt.x < (verts[j].x - verts[i].x) * (pt.y - verts[i].y) / (verts[j].y - verts[i].y) + verts[i].x)) c = !c;
    }
    return c;
}