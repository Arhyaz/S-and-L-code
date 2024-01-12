const lerp = (p0, p1, t) => {
    return p0 + (p1 - p0) * t
}

export default (t, p0, p1, p2) => {
    const l1 = lerp(p0, p1, t)
    const l2 = lerp(p1, p2, t)
    const bezier = lerp(l1, l2, t)

    return bezier
}