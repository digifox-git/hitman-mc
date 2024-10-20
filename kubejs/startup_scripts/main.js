StartupEvents.registry("block", (event) => {
    event.create("computer")
    .model("kubejs/assets/models/computer.json")
    .renderType("solid")
    .displayName("Computer")
    .mapColor("metal")
    .soundType("metal")
    .hardness(5.0)
    .resistance(100.0)
    .requiresTool(true)
    .tagBlock("computer")
    .tagBlock("mineable/pickaxe")
    .tagBlock("minecraft:needs_iron_tool")
    .lightLevel(6)
})
