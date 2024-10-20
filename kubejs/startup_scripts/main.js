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
    .tagBlock("mineable/pickaxe")
    .tagBlock("minecraft:needs_iron_tool")
    .lightLevel(4)
    .box(0, 0, 0, 16, 16, 16, true)

    event.create("monitor")
    .renderType("solid")
    .displayName("Monitor")
    .mapColor("metal")
    .soundType("metal")
    .hardness(5.0)
    .resistance(100.0)
    .requiresTool(true)
    .tagBlock("mineable/pickaxe")
    .tagBlock("minecraft:needs_iron_tool")
    .lightLevel(4)
    .texture('north', 'kubejs:block/monitor_f')
    .texture('south', 'kubejs:block/computer_sides')
    .texture('east', 'kubejs:block/computer_sides')
    .texture('west', 'kubejs:block/computer_sides')
    .texture('up', 'kubejs:block/computer_sides')
    .texture('down', 'kubejs:block/computer_sides')
    .property("BlockProperties.FACING")
    .box(0, 0, 0, 16, 16, 16, true)
})
