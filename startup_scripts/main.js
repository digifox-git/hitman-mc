StartupEvents.registry('block', event => {
    event.create('monitor', 'cardinal')
        .defaultCutout()
        .displayName("Monitor")
        .mapColor("metal")
        .soundType("metal")
        .hardness(5.0)
        .resistance(100.0)
        .requiresTool(true)
        .tagBlock("mineable/pickaxe")
        .tagBlock("minecraft:needs_iron_tool")
        .lightLevel(4)
        .box(0,0,4,16,16,16,true) //box
        .box(1, 3, 4, 15, 6, 3, true) //top keyboard
        .box(1, 2, 3, 15, 5, 2, true) //keyboard
        .box(1, 1, 2, 15, 4, 1, true) //keyboard
        .box(1, 1, 1, 15, 3, 0, true) //keyboard
})

StartupEvents.registry('block', event => {
    event.create('glow', 'cardinal')
        .defaultCutout()
        .displayName("Myserious Glow")
        .mapColor("metal")
        .soundType("wool")
        .hardness(0.0)
        .resistance(10000.0)
        .requiresTool(false)
        .tagBlock("mineable/pickaxe")
        .tagBlock("minecraft:needs_iron_tool")
        .lightLevel(15)
        .box(0,0,0,16,16,16,true) //box

})