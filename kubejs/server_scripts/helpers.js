priority: 0

function selectE(e, tag) {
    return e.server.entities.filter(i => i.tags.contains(tag));
}