priority: 0

function selectE(e, tag) {
    return e.server.entities.filter(p => p.tags.contains(tag));
}