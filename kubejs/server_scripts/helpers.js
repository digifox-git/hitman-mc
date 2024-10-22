priority: 0

function selectE(e, tag) {
    return e.server.entities.filter(i => i.tags.contains(tag));
}
function loadKit(player, kit) {
    //JsonIO.readJson()
}
/**
 * Converts a thing to a string :>
 */
function str(ele) {
    return String.toString(ele);
}