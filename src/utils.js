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

function mean(array) {
    let sum = 0;
    for (let val of array) {
        sum += val;
    }
    return sum / array.length
}

function geoMean(array) {
    let mul = 0;
    let div = 1 / array.length;
    for (let val of array) {
        mul *= val * div;
    }
    return mul;
}

function easeInOutCubic(x) {
    if (x < 0.5)
        return 4 * Math.pow(x, 3)
    else
        return 1 - Math.pow(-2 * x + 2, 3) / 2
}

function easeInOutQuintic(x) {
    if (x < 0.5)
        return 16 * Math.pow(x, 5)
    else
        return 1 - Math.pow(-2 * x + 2, 5) / 2
}
