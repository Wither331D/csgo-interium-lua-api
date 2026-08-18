/* Interium CS:GO Lua API — reference data
   Reverse-engineered from ~135 real community Lua scripts (see /examples).
   This is an unofficial, community-compiled reference — not affiliated with Interium. */

const API_DATA = {
  meta: {
    title: "Interium Lua API",
    subtitle: "Unofficial CS:GO Lua scripting reference for the Interium client",
    sourceNote: "Compiled from ~135 readable real-world scripts found in the community examples folder, cross-checked against the public w3rn3rrr/Interium-luas repository. Some behavior is inferred from usage context rather than confirmed against source — treat signatures marked “inferred” as best-effort. UPDATE: a real world trace, Utils.TraceLine, has since been recovered from INTERIUM.dll and is documented here — it collides with world/brush geometry, unlike the entities-only Utils.TraceLineOnlyEntities. It does NOT expose trace.fraction, trace.endpos or plane.normal, so results are read only via the trace object’s DidHit()/DidHitWorld()/IsVisible() methods. No prediction API (RunCommand/SetupMove/MoveHelper) has been confirmed; treat that as unavailable unless proven otherwise on your build."
  },

  // Top-level groups shown in the sidebar, in display order.
  groups: [
    {
      id: "guide",
      label: "Guide",
      pages: ["intro", "getting-started", "callbacks", "conventions"]
    },
    {
      id: "core",
      label: "Core",
      namespaces: ["Hack", "Utils", "Globals", "Bare"]
    },
    {
      id: "ui",
      label: "Menu & UI",
      namespaces: ["Menu"]
    },
    {
      id: "rendering",
      label: "Rendering",
      namespaces: ["Render", "ISurface", "IEffects", "IDebugOverlay", "IMaterialSystem", "IRenderBeams"]
    },
    {
      id: "entities",
      label: "Entities & World",
      namespaces: ["IEntityList", "IEngine", "IGlobalVars", "EntityMethods"]
    },
    {
      id: "math",
      label: "Math & Vectors",
      namespaces: ["Math", "Structs"]
    },
    {
      id: "input",
      label: "Input",
      namespaces: ["InputSys"]
    },
    {
      id: "events",
      label: "Events & Networking",
      namespaces: ["IGameEventListener", "IChatElement", "ICvar", "EventMethods", "BufferMethods"]
    },
    {
      id: "io",
      label: "Files & System",
      namespaces: ["FileSys"]
    },
    {
      id: "panorama",
      label: "Panorama (Menu UI JS)",
      namespaces: ["IPanorama"]
    },
    {
      id: "reference",
      label: "Reference Tables",
      pages: ["offsets", "classids", "constants", "vars"]
    },
    {
      id: "about",
      label: "About",
      pages: ["credits"]
    }
  ],

  // Namespace metadata: description shown at top of each namespace page.
  namespaceInfo: {
    Hack: { title: "Hack", tagline: "Core loader namespace — callbacks, offsets, config/script loading.", group: "core" },
    Utils: { title: "Utils", tagline: "Local-player/game-state helpers and movement/trace utilities.", group: "core" },
    Globals: { title: "Globals", tagline: "Viewport size and menu-open state.", group: "core" },
    Bare: { title: "Global Functions", tagline: "Ungrouped built-ins available everywhere — printing, bit flags, downloads, sound, time.", group: "core" },
    Menu: { title: "Menu", tagline: "Register UI widgets in the hack's menu and read back their values.", group: "ui" },
    Render: { title: "Render", tagline: "The main 2D/3D drawing API — text, shapes, images, fonts.", group: "rendering" },
    ISurface: { title: "ISurface", tagline: "Lower-level engine surface access — raw fonts, text, sound.", group: "rendering" },
    IEffects: { title: "IEffects", tagline: "Dynamic light and particle-adjacent effects.", group: "rendering" },
    IDebugOverlay: { title: "IDebugOverlay", tagline: "Temporary 3D debug-draw primitives in world space.", group: "rendering" },
    IMaterialSystem: { title: "IMaterialSystem", tagline: "Override the hack's chams materials with custom VMT definitions.", group: "rendering" },
    IRenderBeams: { title: "IRenderBeams", tagline: "Laser-beam effects between two 3D points.", group: "rendering" },
    IEntityList: { title: "IEntityList", tagline: "Look up entities and players by index or handle.", group: "entities" },
    IEngine: { title: "IEngine", tagline: "Engine/client state — local player, view angles, console commands, map info.", group: "entities" },
    IGlobalVars: { title: "IGlobalVars", tagline: "Time fields read directly as properties (no parens).", group: "entities" },
    EntityMethods: { title: "Entity / Player Methods", tagline: "Methods available on objects returned by IEntityList (`:`-called).", group: "entities" },
    Math: { title: "Math", tagline: "Vector/angle math and world-to-screen projection.", group: "math" },
    Structs: { title: "Constructors & Structs", tagline: "Color, Vector, QAngle and other value types, plus engine structs.", group: "math" },
    InputSys: { title: "InputSys", tagline: "Keyboard state, key synthesis, cursor position.", group: "input" },
    IGameEventListener: { title: "IGameEventListener", tagline: "Opt in to game events that aren't dispatched by default.", group: "events" },
    IChatElement: { title: "IChatElement", tagline: "Read/write the in-game chat UI.", group: "events" },
    ICvar: { title: "ICvar", tagline: "Look up and modify engine console variables.", group: "events" },
    EventMethods: { title: "Event Object Methods", tagline: "Methods on the `Event` object passed to game-event callbacks.", group: "events" },
    BufferMethods: { title: "Network Buffer Methods", tagline: "User-space binary buffer pattern seen for serialization (not a confirmed native class).", group: "events" },
    FileSys: { title: "FileSys", tagline: "Read/write files and INI-style key/value data on disk.", group: "io" },
    IPanorama: { title: "IPanorama", tagline: "Bridge to the Panorama (CEF/JS) menu UI, unlocking party/friends/lobby JS APIs.", group: "panorama" }
  },

  // Flat list of every documented entry. `ns` groups them onto namespace pages.
  entries: [
    // ---------------- Hack ----------------
    {
      ns: "Hack", name: "Hack.RegisterCallback", sig: "Hack.RegisterCallback(name, fn)",
      category: "hack/core", desc: "Registers a handler for a named engine callback. See the Callbacks guide for every callback name, its trigger, and handler signature.",
      example: { file: "AntiAFK-NiceL.lua", code: `Hack.RegisterCallback("CreateMove", CreateMove)` }
    },
    {
      ns: "Hack", name: "Hack.GetOffset", sig: "Hack.GetOffset(className, propName)",
      category: "hack/core, entities", desc: "Resolves a network-table (datamap) property offset by class/table name and prop name. Feed the result into `:GetProp*`/`:SetProp*` on an entity. See the Offset Catalog for every pair seen in the wild.",
      example: { file: "1_Velocity_v3.lua", code: `local vVelocity_Offset = Hack.GetOffset("DT_BasePlayer", "m_vecVelocity[0]")` }
    },
    {
      ns: "Hack", name: "Hack.GetUserName", sig: "Hack.GetUserName()",
      category: "hack/core", desc: "Returns the logged-in Interium account username as a string. Commonly used to gate developer-only features.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `local isDev = Hack.GetUserName() == "KibbeWater"` }
    },
    {
      ns: "Hack", name: "Hack.GetSubDays", sig: "Hack.GetSubDays()",
      category: "hack/core", desc: "Returns the number of days remaining on the user's subscription. Commonly shown in watermark scripts.",
      example: { file: "preditle-wotermork.lua", code: `local daysLeft = Hack.GetSubDays()` }
    },
    {
      ns: "Hack", name: "Hack.LoadLua", sig: "Hack.LoadLua(filename)",
      category: "hack/core", desc: "Loads/injects another .lua script by filename from the Lua scripts folder.",
      example: { file: "AutoRun.lua", code: `Hack.LoadLua("SkyChanger.lua")\nMenu.SetInt("iSkyBox", 6)` }
    },
    {
      ns: "Hack", name: "Hack.UnloadLua", sig: "Hack.UnloadLua(filename)",
      category: "hack/core", desc: "Unloads a previously loaded script. Used before self-replacing/auto-updating a script.",
      example: { file: "RPUpdater.lua", code: `Hack.UnloadLua("KibbeWater-RichPresence.lua")\nlocal luadir = GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\Lua\\\\"\nURLDownloadToFile("https://raw.githubusercontent.com/.../KibbeWater-RichPresence.lua", luadir.."KibbeWater-RichPresence.lua")\nHack.LoadLua("KibbeWater-RichPresence.lua")` }
    },
    {
      ns: "Hack", name: "Hack.LoadCfg", sig: "Hack.LoadCfg(filename)",
      category: "hack/core", desc: "Loads a saved cheat config (.ini) file.",
      example: { file: "AutoRun.lua", code: `Hack.LoadCfg("my2.ini") -- Load Cfg` }
    },

    // ---------------- Menu ----------------
    {
      ns: "Menu", name: "Menu.Checkbox", sig: "Menu.Checkbox(label, id, default)",
      category: "menu/UI", desc: "Boolean toggle widget. Read back with Menu.GetBool(id).",
      example: { file: "AntiAFK-NiceL.lua", code: `Menu.Checkbox("Enable AntiAFK", "bAntiAFK", true)` }
    },
    {
      ns: "Menu", name: "Menu.SliderInt", sig: "Menu.SliderInt(label, id, min, max, format, default)",
      category: "menu/UI", desc: "Integer slider. `format` is a printf-style string (or empty).",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `Menu.SliderInt("Render Distance", "cHelperRenderDistance", 50, 4000, 1, 1000)` }
    },
    {
      ns: "Menu", name: "Menu.SliderFloat", sig: "Menu.SliderFloat(label, id, min, max, format, default)",
      category: "menu/UI", desc: "Float slider. `format` e.g. \"%.2f\".",
      example: { file: "1_Velocity_v3.lua", code: `Menu.SliderFloat("Pos Y", "fVelPosY", 0, 10, "%.2f", 1.08)` }
    },
    {
      ns: "Menu", name: "Menu.Combo", sig: "Menu.Combo(label, id, { options... }, default)",
      category: "menu/UI", desc: "Dropdown. `default` is the 0-based index. Value read back with Menu.GetInt(id).",
      example: { file: "Custom Clantag.lua", code: `Menu.Combo("Show Velocity Old", "iShowVelocityOld", { "None", "Add To Velocity", "New Object" }, 1)` }
    },
    {
      ns: "Menu", name: "Menu.ColorPicker", sig: "Menu.ColorPicker(label, id, r, g, b, a)  |  Menu.ColorPicker(label, id, Color.new(...))",
      category: "menu/UI, rendering", desc: "Color swatch widget. Accepts either four separate 0-255 numbers or a Color object. Read back with Menu.GetColor(id).",
      example: { file: "1_Velocity_v3.lua", code: `Menu.ColorPicker("Color of main velocity line", "VGcolor", 255, 255, 255, 255)\n\n-- alternate form (Killeffect-Vinyl.lua)\nMenu.ColorPicker('Color', 'pf_killeffect_color', Color.new(255, 255, 255, 150))` }
    },
    {
      ns: "Menu", name: "Menu.KeyBind", sig: "Menu.KeyBind(label, id, default)",
      category: "menu/UI, input", desc: "Key-bind picker. `default` is a virtual-key code (0 = unbound). Read with Menu.GetInt(id) and pass to InputSys.IsKeyDown/IsKeyPress.",
      example: { file: "Checkpoint.lua", code: `Menu.KeyBind("Checkpoint Key", "k_GetPos", 0)` }
    },
    {
      ns: "Menu", name: "Menu.Button", sig: "Menu.Button(label, id)",
      category: "menu/UI", desc: "Momentary button. Sets its bool id true for one frame when clicked; read/reset manually via Menu.GetBool/SetBool.",
      example: { file: "Checkpoint.lua", code: `Menu.Button("sv_cheats 1", "svcheat1")` }
    },
    {
      ns: "Menu", name: "Menu.InputText", sig: "Menu.InputText(label, id, [default])",
      category: "menu/UI", desc: "Free text field; default value is optional.",
      example: { file: "clantag.lua", code: `Menu.InputText("Clan Tag", "sClanTag", "Interium")` }
    },
    {
      ns: "Menu", name: "Menu.Text", sig: "Menu.Text(str)",
      category: "menu/UI", desc: "Static decorative label/header text in the menu (no id).",
      example: { file: "Custom Clantag.lua", code: `Menu.Text("Clantag Manager")` }
    },
    {
      ns: "Menu", name: "Menu.Separator", sig: "Menu.Separator()",
      category: "menu/UI", desc: "Horizontal divider line.",
      example: { file: "123.lua", code: `Menu.Separator()` }
    },
    {
      ns: "Menu", name: "Menu.Spacing", sig: "Menu.Spacing()",
      category: "menu/UI", desc: "Vertical spacer.",
      example: { file: "123.lua", code: `Menu.Spacing()` }
    },
    {
      ns: "Menu", name: "Menu.GetBool / SetBool", sig: "Menu.GetBool(id)  |  Menu.SetBool(id, value)",
      category: "menu/UI", desc: "Read/write a checkbox or button boolean value.",
      example: { file: "Grenadeable-Dashie.lua", code: `if Menu.GetBool("bWorldToScreen") then\n    -- ...\nend` }
    },
    {
      ns: "Menu", name: "Menu.GetInt / SetInt", sig: "Menu.GetInt(id)  |  Menu.SetInt(id, value)",
      category: "menu/UI", desc: "Read/write a combo/slider-int/keybind integer value. Also commonly abused as ad-hoc cross-script “shared memory” (e.g. writing a timestamp so other scripts can detect this module is loaded).",
      example: { file: "EBDetection.lua", code: `Menu.SetInt("EBModuleExists", IGlobalVars.curtime + 1)` }
    },
    {
      ns: "Menu", name: "Menu.GetFloat", sig: "Menu.GetFloat(id)",
      category: "menu/UI", desc: "Read a slider-float value. (No Menu.SetFloat observed in the corpus — only Get.)",
      example: { file: "Custom Clantag.lua", code: `local delay = Menu.GetFloat("CustomAnimatedDelay") * 100` }
    },
    {
      ns: "Menu", name: "Menu.GetString / SetString", sig: "Menu.GetString(id)  |  Menu.SetString(id, value)",
      category: "menu/UI", desc: "Read/write an input-text value. Also used as a cross-script string mailbox (notification payloads, saved song names, etc).",
      example: { file: "KibbeWater-AdvancedGriefing.lua", code: `Menu.SetString("NM_API_Payload", ID .. "*" .. type .. "*" .. title .. "*" .. msg)\nMenu.SetBool("NM_API_Send", true)` }
    },
    {
      ns: "Menu", name: "Menu.GetColor", sig: "Menu.GetColor(id)",
      category: "menu/UI, rendering", desc: "Returns a Color object (.r/.g/.b/.a, mutable in place) from a ColorPicker id.",
      example: { file: "ClockWatermark.lua", code: `local col = Color.new(181, 148, 205, 255)\nRender.RectFilledMultiColor(offset + 5, 10, Size_text - 5, 12, col,\n    Color.new(col.r, col.g, col.b, 100), Color.new(col.r, col.g, col.b, 100), col)` }
    },

    // ---------------- Render ----------------
    {
      ns: "Render", name: "Render.Text", sig: "Render.Text(text, x, y, size, color, centeredX, dropShadow, [fontName])",
      category: "rendering", desc: "Draws text using the “classic Hack render” text path. Optional custom font name, loaded via Render.LoadFont.",
      example: { file: "Grenadeable-Dashie.lua", code: `Render.Text(text, XOffset, YOffset - FoundPlayerOffset, 20, col, false, true, "Verdana")` }
    },
    {
      ns: "Render", name: "Render.Text_1", sig: "Render.Text_1(text, x, y, size, color, centeredX, dropShadow, [fontName])",
      category: "rendering", desc: "Alternate/faster text-draw variant with the same signature shape as Text. The most commonly used text function across scripts; uses the default hack font unless a name is given.",
      example: { file: "ClockWatermark.lua", code: `Render.Text_1(Text, Size_text / 2 + 5, 14, 13, Color.new(255, 255, 255, 255), true, false)` }
    },
    {
      ns: "Render", name: "Render.CalcTextSize", sig: "Render.CalcTextSize(text, size, [fontName])",
      category: "rendering", desc: "Returns a Vector2D-like object (.x/.y = measured width/height) for the font used by Render.Text.",
      example: { file: "KibbeWater-SpectatorList.lua", code: `local textYSize = Render.CalcTextSize("Spectator List", sizeY * 0.666, "sunflowerrr").y / 2` }
    },
    {
      ns: "Render", name: "Render.CalcTextSize_1", sig: "Render.CalcTextSize_1(text, size, [fontName])",
      category: "rendering", desc: "Same as CalcTextSize but paired with Render.Text_1.",
      example: { file: "1_Velocity_v3.lua", code: `local w = Render.CalcTextSize_1("(" .. VelocityOnGround .. ")", 24).x` }
    },
    {
      ns: "Render", name: "Render.Line", sig: "Render.Line(x1, y1, x2, y2, color, thickness)",
      category: "rendering", desc: "Draws a 2D line.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `Render.Line(Globals.ScreenWidth()/2, Globals.ScreenHeight()/2, screenThrow.x, screenThrow.y, color, 1)` }
    },
    {
      ns: "Render", name: "Render.Rect", sig: "Render.Rect(x1, y1, x2, y2, color, [rounding], [thickness])",
      category: "rendering", desc: "Outlined rectangle, given two corner points.",
      example: { file: "ClockWatermark.lua", code: `Render.Rect(offset, 5, Size_text, 35, Color.new(0, 0, 0, 150), 0, 1)` }
    },
    {
      ns: "Render", name: "Render.Rect2", sig: "Render.Rect2(...)",
      category: "rendering", desc: "Alternate rect-draw variant. Only seen referenced by name in the corpus; assumed to share the Rect signature family.",
      inferred: true
    },
    {
      ns: "Render", name: "Render.RectFilled", sig: "Render.RectFilled(x1, y1, x2, y2, color, [rounding])",
      category: "rendering", desc: "Filled rectangle with optional corner rounding.",
      example: { file: "ClockWatermark.lua", code: `Render.RectFilled(offset, 5, Size_text, 35, Color.new(27, 27, 27, 100), 0)` }
    },
    {
      ns: "Render", name: "Render.RectFilled2", sig: "Render.RectFilled2(x, y, w, h, color, [rounding])",
      category: "rendering", desc: "Filled rectangle using position + size instead of two corners.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `Render.RectFilled2(KeyPos.x, KeyPos.y, KeySize.x, KeySize.y, boxClr, KeyRounding)` }
    },
    {
      ns: "Render", name: "Render.RectFilledMultiColor", sig: "Render.RectFilledMultiColor(x1, y1, x2, y2, colorTL, colorTR, colorBR, colorBL)",
      category: "rendering", desc: "Gradient-filled rectangle, one color per corner.",
      example: { file: "KibbeWater-SpectatorList.lua", code: `Render.RectFilledMultiColor(posX - 2, posY - 2, posX + sizeX + 2, posY + sizeY + 2,\n    Color.new(R[4],G[4],B[4],255), Color.new(R[1],G[1],B[1],255),\n    Color.new(R[1],G[1],B[1],255), Color.new(R[4],G[4],B[4],255))` }
    },
    {
      ns: "Render", name: "Render.Circle", sig: "Render.Circle(x, y, radius, color, segments, thickness)",
      category: "rendering", desc: "2D screen-space circle outline.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `Render.Circle(screenThrow.x, screenThrow.y, 8, color, 25, 2)` }
    },
    {
      ns: "Render", name: "Render.Circle3D", sig: "Render.Circle3D(worldPos, radius, thickness_or_segments, color)",
      category: "rendering, 3D/world", desc: "World-space circle outline, drawn flat on the ground. Used for grenade spot markers.",
      example: { file: "NadeHelper-Peter.lua", code: `Render.Circle3D(standPositionArray[c], 50, 10, spotColor)` }
    },
    {
      ns: "Render", name: "Render.CircleFilled3D", sig: "Render.CircleFilled3D(worldPos, ?, radius, color)",
      category: "rendering, 3D/world", desc: "Filled world-space circle. Used for molotov fire radius indicators.",
      example: { file: "MolotovCircle-NiceL.lua", code: `Render.CircleFilled3D(VectorEnd, 100, 150, InCircleColor)` }
    },
    {
      ns: "Render", name: "Render.AddPoly", sig: "Render.AddPoly(index, x, y)",
      category: "rendering", desc: "Adds a vertex at `index` to the poly-line vertex buffer, flushed by Render.Poly / Render.PolyFilled.",
      example: { file: "1_Velocity_v3.lua", code: `Render.AddPoly(i - 2, Globals.ScreenWidth()/2 - VelocityrraySize + i, PosY - VelOld * SizeY)` }
    },
    {
      ns: "Render", name: "Render.Poly", sig: "Render.Poly(count, color, closed, thickness)",
      category: "rendering", desc: "Draws the accumulated AddPoly vertices as a connected line/polyline graph.",
      example: { file: "1_Velocity_v3.lua", code: `Render.Poly(VelocityrraySize * 2, Menu.GetColor("VGcolor"), false, 2)` }
    },
    {
      ns: "Render", name: "Render.PolyFilled", sig: "Render.PolyFilled(count, color)  |  Render.PolyFilled(count, color, closed, thickness)",
      category: "rendering", desc: "Draws the accumulated AddPoly vertices as a filled polygon. Used for animated menu-handle shapes. A four-argument form matching Render.Poly (count, color, closed, thickness) also appears in the wild — both call shapes are attested.",
      example: { file: "WaterUI.lua", code: `Render.PolyFilled(4, Color.new(20, 20, 20, Menu.GetInt("cOpacityMenuHandle")))` }
    },
    {
      ns: "Render", name: "Render.LoadFont", sig: "Render.LoadFont(name, path, size)",
      category: "rendering", desc: "Loads a TTF file (usually downloaded via URLDownloadToFile) and registers it under `name` for Render.Text/CalcTextSize.",
      example: { file: "Grenadeable-Dashie.lua", code: `Render.LoadFont("Verdana", GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\FilesForLua\\\\DashieGrenade\\\\VerdanaBold.ttf", 23)` }
    },
    {
      ns: "Render", name: "Render.IsFont", sig: "Render.IsFont(name)",
      category: "rendering", desc: "Returns true if a font of that name is already loaded. Used to guard against re-loading every frame.",
      example: { file: "example_ChangeCreateFonts.lua", code: `if (not Render.IsFont("FontNameLol")) then\n    Render.LoadFont("FontNameLol", PathToFont, 32)\nend` }
    },
    {
      ns: "Render", name: "Render.DelFont", sig: "Render.DelFont(name)",
      category: "rendering", desc: "Removes/frees a previously loaded font. Typically called once at script (re)load to avoid duplicates.",
      example: { file: "example_ChangeCreateFonts.lua", code: `Render.DelFont("FontNameLol")` }
    },
    {
      ns: "Render", name: "Render.ChangeHackFont", sig: "Render.ChangeHackFont(slot, path, size)",
      category: "rendering", desc: "Overrides one of the hack's built-in font slots. Slots: 0=Default, 1=Second, 2=Icon, 3=Roboto, 4=MenuMain, 5=MenuTabMain, 6=MenuTabIcon.",
      example: { file: "example_ChangeCreateFonts.lua", code: `Render.ChangeHackFont(0, PathToFont, 14) -- Change HackFont (Default)` }
    },
    {
      ns: "Render", name: "Render.LoadImage", sig: "Render.LoadImage(name, path)",
      category: "rendering", desc: "Loads an image file from disk (usually downloaded first) and registers it under `name`.",
      example: { file: "1_KillImage.lua", code: `Render.LoadImage("Kill_1", GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\FilesForLUA\\\\KillImage-w3rn3r\\\\temp")` }
    },
    {
      ns: "Render", name: "Render.IsImage", sig: "Render.IsImage(name)",
      category: "rendering", desc: "Returns true if an image of that name is already loaded.",
      example: { file: "1_KillImage.lua", code: `if (not Render.IsImage("Kill_1")) then\n    -- load it\nend` }
    },
    {
      ns: "Render", name: "Render.DelImage", sig: "Render.DelImage(name)",
      category: "rendering", desc: "Frees a previously loaded image. Typically called once at script start to reset state.",
      example: { file: "1_KillImage.lua", code: `Render.DelImage("Kill_1")` }
    },
    {
      ns: "Render", name: "Render.Image", sig: "Render.Image(name, x1, y1, x2, y2, color, u1, v1, u2, v2)",
      category: "rendering", desc: "Draws a loaded image stretched into the given rectangle, with UV coordinates and a tint color.",
      example: { file: "1_KillImage.lua", code: `Render.Image("Kill_1", cx - s/2, cy - s/2 - PosY, cx + s/2, cy + s/2 - PosY,\n    Color.new(255, 255, 255, iImageAlpha), 0, 0, 1, 1)` }
    },
    {
      ns: "Render", name: "Render.RenderImage", sig: "Render.RenderImage(name, x1, y1, x2, y2, color, u1, v1, u2, v2)",
      category: "rendering", desc: "Same shape as Render.Image; seen used in one example specifically. Possibly an older or alternate name for the same draw call.",
      example: { file: "example_DlByURLRenderImage.lua", code: `Render.RenderImage("ImageNameXd", 300, 500, 1000, 1000, Color.new(255,255,255,255), 0, 0, 1, 1)` }
    },

    // ---------------- ISurface ----------------
    {
      ns: "ISurface", name: "ISurface.CreateFont_", sig: "ISurface.CreateFont_()",
      category: "rendering", desc: "Creates a raw engine (Source ISurface) font handle, distinct from the Render.LoadFont path.",
      example: { file: "example_ChangeCreateFonts.lua", code: `ISurfaceFont = ISurface.CreateFont_()` }
    },
    {
      ns: "ISurface", name: "ISurface.SetFontGlyphSet", sig: "ISurface.SetFontGlyphSet(fontHandle, fontName, tall, weight, blur, scanlines, flags, ?, ?)",
      category: "rendering", desc: "Initializes the glyph set for a font handle created by CreateFont_ (mirrors the Source engine SetFontGlyphSet signature).",
      example: { file: "example_ChangeCreateFonts.lua", code: `ISurface.SetFontGlyphSet(ISurfaceFont, FontName, 32, 600, 0, 0, 0x080, 0, 0)` }
    },
    {
      ns: "ISurface", name: "ISurface.DrawText", sig: "ISurface.DrawText(fontHandle, x, y, color, ?, text)",
      category: "rendering", desc: "Draws text via the raw ISurface font handle.",
      example: { file: "example_ChangeCreateFonts.lua", code: `ISurface.DrawText(ISurfaceFont, 150, 150, Color.new(255,255,255,255), 0, "Text2")` }
    },
    {
      ns: "ISurface", name: "ISurface.PlaySound_", sig: "ISurface.PlaySound_(soundPath)",
      category: "sound", desc: "Plays a sound via the engine sound system using a game-relative path (compare to the global PlaySound, which takes a full filesystem path).",
      example: { file: "KillSound-NiceL.lua", code: `ISurface.PlaySound_("buttons\\\\light_power_on_switch_01.wav")` }
    },

    // ---------------- IEntityList ----------------
    {
      ns: "IEntityList", name: "IEntityList.GetPlayer", sig: "IEntityList.GetPlayer(index)",
      category: "entities/players", desc: "Returns a player entity object for the given entity index (1-64), or nil.",
      example: { file: "1_Velocity_v3.lua", code: `local pLocal = IEntityList.GetPlayer(IEngine.GetLocalPlayer())` }
    },
    {
      ns: "IEntityList", name: "IEntityList.GetEntity", sig: "IEntityList.GetEntity(index)",
      category: "entities/players", desc: "Returns any entity (not just players) by index.",
      example: { file: "KibbeWater-BombTimer.lua", code: `local ent = IEntityList.GetEntity(i)` }
    },
    {
      ns: "IEntityList", name: "IEntityList.GetHighestEntityIndex", sig: "IEntityList.GetHighestEntityIndex()",
      category: "entities/players", desc: "Returns the highest currently-valid entity index. Used as a loop bound when scanning all entities.",
      example: { file: "KibbeWater-BombTimer.lua", code: `for i = 1, IEntityList.GetHighestEntityIndex() do\n    -- ...\nend` }
    },
    {
      ns: "IEntityList", name: "IEntityList.GetPlantedC4", sig: "IEntityList.GetPlantedC4(index)",
      category: "entities/game state", desc: "Returns the planted-C4 entity object given an entity index (typically checked after filtering by class id 129).",
      example: { file: "KibbeWater-BombTimer.lua", code: `local bomb = IEntityList.GetPlantedC4(i)` }
    },
    {
      ns: "IEntityList", name: "IEntityList.ToPlayer", sig: "IEntityList.ToPlayer(entity)",
      category: "entities/players", desc: "Casts a generic entity (e.g. from a trace hit or handle) to a player object.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `local Player = IEntityList.ToPlayer(tr.hit_entity)` }
    },
    {
      ns: "IEntityList", name: "IEntityList.GetClientEntityFromHandleA", sig: "IEntityList.GetClientEntityFromHandleA(handle)",
      category: "entities/players", desc: "Resolves an entity handle (e.g. m_hObserverTarget) into an entity.",
      example: { file: "Korobasik-SpectatorList.lua", code: `local TargetHandle = IEntityList.GetClientEntityFromHandleA(TargetObserver)\nlocal Target = IEntityList.ToPlayer(TargetHandle)` }
    },

    // ---------------- IEngine ----------------
    {
      ns: "IEngine", name: "IEngine.GetLocalPlayer", sig: "IEngine.GetLocalPlayer()",
      category: "entities/players", desc: "Returns the local player's entity index.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `local pLocal = IEntityList.GetPlayer(IEngine.GetLocalPlayer())` }
    },
    {
      ns: "IEngine", name: "IEngine.GetPlayerForUserID", sig: "IEngine.GetPlayerForUserID(userid)",
      category: "entities/players, game events", desc: "Converts a game-event `userid` field into an entity index.",
      example: { file: "HitSound-NiceL.lua", code: `local IsLocalShot = IEngine.GetPlayerForUserID(Event:GetInt("attacker", 0)) == IEngine.GetLocalPlayer()` }
    },
    {
      ns: "IEngine", name: "IEngine.ExecuteClientCmd", sig: "IEngine.ExecuteClientCmd(command)",
      category: "hack/core, input", desc: "Executes a console command string.",
      example: { file: "Checkpoint.lua", code: `IEngine.ExecuteClientCmd("setpos_exact " .. posx .. " " .. posy .. " " .. posz)` }
    },
    {
      ns: "IEngine", name: "IEngine.GetViewAngles", sig: "IEngine.GetViewAngles(outQAngle)",
      category: "math/vector, input", desc: "Fills the passed QAngle object (by reference) with the current view angles.",
      example: { file: "Checkpoint.lua", code: `IEngine.GetViewAngles(undoang)` }
    },
    {
      ns: "IEngine", name: "IEngine.SetViewAngles", sig: "IEngine.SetViewAngles(qangle)",
      category: "input", desc: "Sets the player's view angles directly.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `IEngine.SetViewAngles(newViewang)` }
    },
    {
      ns: "IEngine", name: "IEngine.GetScreenSize", sig: "IEngine.GetScreenSize()",
      category: "misc/rendering", desc: "Returns the screen resolution. Most scripts prefer Globals.ScreenWidth/Height instead.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `local Screen = IEngine.GetScreenSize()` }
    },
    {
      ns: "IEngine", name: "IEngine.GetLevelNameShort", sig: "IEngine.GetLevelNameShort()",
      category: "hack/core, misc", desc: "Returns the current map's short name (e.g. \"de_dust2\").",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `local map = IEngine.GetLevelNameShort()` }
    },
    {
      ns: "IEngine", name: "IEngine.GetNetChannelInfo", sig: "IEngine.GetNetChannelInfo()",
      category: "networking", desc: "Returns a network-channel info object (has :GetAddress()), or nil when not connected.",
      example: { file: "KibbeWater-RichPresence.lua", code: `local netChannel = IEngine.GetNetChannelInfo()\nif netChannel then local ip = GetIPType(netChannel:GetAddress()) end` }
    },
    {
      ns: "IEngine", name: "IEngine.IsPaused", sig: "IEngine.IsPaused()",
      category: "hack/core", desc: "Returns true if the game is paused (e.g. demo playback).",
      example: { file: "WaterUI.lua", code: `if (not IChatElement.IsChatOpened() and not IEngine.IsPaused() and Utils.IsLocalAlive()) then` }
    },

    // ---------------- IGlobalVars ----------------
    {
      ns: "IGlobalVars", name: "IGlobalVars.curtime", sig: "IGlobalVars.curtime", isField: true,
      category: "hack/core, misc", desc: "Server/game current time in seconds (float). Used for timers and cross-script mailbox expirations. Read as a plain field, no parens.",
      example: { file: "Killeffect-Vinyl.lua", code: `pLocal:SetPropFloat(offset, IGlobalVars.curtime + Menu.GetFloat("pf_killeffect_length"))` }
    },
    {
      ns: "IGlobalVars", name: "IGlobalVars.realtime", sig: "IGlobalVars.realtime", isField: true,
      category: "hack/core, misc", desc: "Wall-clock render time in seconds (float). Continues advancing even when the game is paused or scrubbing a demo. Used for UI animation timers.",
      example: { file: "KibbeWater-BombTimer.lua", code: `if animStage == 1 and IGlobalVars.realtime > nextAnim then` }
    },
    {
      ns: "IGlobalVars", name: "IGlobalVars.frametime", sig: "IGlobalVars.frametime", isField: true,
      category: "hack/core, misc", desc: "Time delta since the last frame in seconds (float). Used for framerate-independent animation.",
      example: { file: "AnimCrosshair-NiceL.lua", code: `local frametime = IGlobalVars.frametime\nrainbow = rainbow + (frametime * 0.5)` }
    },

    // ---------------- IMaterialSystem ----------------
    {
      ns: "IMaterialSystem", name: "IMaterialSystem.ChangeHackChams", sig: "IMaterialSystem.ChangeHackChams(index, materialName, vmtKeyValuesString)",
      category: "rendering, hack/core", desc: "Overwrites one of the hack's chams material slots with a custom VMT-format material definition string.",
      example: { file: "example_ChangeHackChams.lua", code: `local MatSettings = [[\n    "VertexlitGeneric"\n    {\n        "$additive" "1"\n        "$envmap" "models/effects/cube_white"\n        "$alpha" "1"\n    }\n]]\nIMaterialSystem.ChangeHackChams(1, "Mat1", MatSettings)` }
    },

    // ---------------- IDebugOverlay ----------------
    {
      ns: "IDebugOverlay", name: "IDebugOverlay.AddBoxOverlay2", sig: "IDebugOverlay.AddBoxOverlay2(origin, mins, maxs, angles, edgeColor, faceColor, duration)",
      category: "rendering, effects", desc: "Draws a temporary 3D debug box in the world. Used for jump-trail effects.",
      example: { file: "ClarityJumptrail.lua", code: `IDebugOverlay.AddBoxOverlay2(pLocal:GetAbsOrigin(), Vector.new(-2,-2,-0.5), Vector.new(2,2,0.5), newAng, rgba, rgb, Menu.GetFloat("snowClarityDuration"))` }
    },
    {
      ns: "IDebugOverlay", name: "IDebugOverlay.ClearAllOverlays", sig: "IDebugOverlay.ClearAllOverlays()",
      category: "rendering", desc: "Clears all active debug overlays, e.g. on round start.",
      example: { file: "ClarityJumptrail.lua", code: `Hack.RegisterCallback("FireEventClientSideThink", function(event)\n    if event:GetName() == "round_start" then IDebugOverlay.ClearAllOverlays() end\nend)` }
    },

    // ---------------- IChatElement ----------------
    {
      ns: "IChatElement", name: "IChatElement.ChatPrintf", sig: "IChatElement.ChatPrintf(0, 0, message)",
      category: "hack/core, misc", desc: "Prints a formatted, color-code-capable message to the in-game chat/console. The first two args appear to always be 0, 0 in every sample — likely reserved/unused index params.",
      example: { file: "1_Velocity_v3.lua", code: `IChatElement.ChatPrintf(0, 0, "[Checkpoint] Saved Checkpoint!")` }
    },
    {
      ns: "IChatElement", name: "IChatElement.IsChatOpened", sig: "IChatElement.IsChatOpened()",
      category: "hack/core, input", desc: "Returns true if the chat input box is currently open. Used to hide HUD elements while typing.",
      example: { file: "WaterUI.lua", code: `if (not IChatElement.IsChatOpened() and not IEngine.IsPaused() and Utils.IsLocalAlive()) then` }
    },

    // ---------------- ICvar ----------------
    {
      ns: "ICvar", name: "ICvar.FindVar", sig: "ICvar.FindVar(name)",
      category: "hack/core, misc", desc: "Looks up an engine console variable (cvar) by name and returns a handle object with :GetInt/:SetInt/:GetFloat/:SetFloat/:SetBool methods.",
      example: { file: "AgentSkin-NiceL.lua", code: `local r_skin = ICvar.FindVar("r_skin")\nr_skin:SetInt(Menu.GetInt("iAgentSkin"))` }
    },
    {
      ns: "ICvar", name: "cvar:GetInt / :SetInt", sig: "cvar:GetInt()  |  cvar:SetInt(value)",
      category: "hack/core", desc: "Read/write an integer cvar on a handle from ICvar.FindVar.",
      example: { file: "RainbowCrosshair-NiceL.lua", code: `local main = cl_crosshaircolor:GetInt()\ncl_crosshaircolor:SetInt(5)` }
    },
    {
      ns: "ICvar", name: "cvar:SetFloat", sig: "cvar:SetFloat(value)",
      category: "hack/core", desc: "Write a float cvar.",
      example: { file: "AspectRatio-NiceL.lua", code: `r_aspectratio:SetFloat(fAspect2)` }
    },
    {
      ns: "ICvar", name: "cvar:SetBool", sig: "cvar:SetBool(value)",
      category: "hack/core", desc: "Write a boolean cvar.",
      example: { file: "AnimCrosshair-NiceL.lua", code: `ICvar.FindVar("crosshair"):SetBool(not bAnimCrosshair)` }
    },

    // ---------------- IGameEventListener ----------------
    {
      ns: "IGameEventListener", name: "IGameEventListener.AddEvent", sig: "IGameEventListener.AddEvent(eventName, unknownBool)",
      category: "game events", desc: "Subscribes to a game event that isn't fired by default, so it starts reaching FireEventClientSideThink handlers (e.g. \"bullet_impact\", which is opt-in).",
      example: { file: "BulletTrace-NiceL.lua", code: `IGameEventListener.AddEvent("bullet_impact", false)` }
    },

    // ---------------- IPanorama ----------------
    {
      ns: "IPanorama", name: "IPanorama.RunScript_Menu", sig: "IPanorama.RunScript_Menu(jsCode)",
      category: "menu/UI, misc", desc: "Executes a block of Panorama JavaScript in the menu/main-menu UI context, giving access to a family of JS-side globals: UiToolkitAPI, PartyListAPI, MyPersonaAPI, LobbyAPI, LobbyChat, PartyBrowserAPI, FriendsListAPI.",
      example: { file: "PanoramaFeatures-NiceL.lua", code: `IPanorama.RunScript_Menu([[\n    UiToolkitAPI.CloseAllVisiblePopups();\n]])` }
    },
    {
      ns: "IPanorama", name: "UiToolkitAPI.CloseAllVisiblePopups()", sig: "UiToolkitAPI.CloseAllVisiblePopups()", isJs: true,
      category: "panorama JS", desc: "Closes all open popup dialogs."
    },
    {
      ns: "IPanorama", name: "PartyListAPI.SessionCommand(cmd, args)", sig: "PartyListAPI.SessionCommand(cmd, args)", isJs: true,
      category: "panorama JS", desc: "Issues an internal session/party command.",
      example: { file: "PanoramaFeatures-NiceL.lua", code: `PartyListAPI.SessionCommand("Game::HostEndGamePlayAgain", \`run all xuid \${MyPersonaAPI.GetXuid()}\`);`, lang: "js" }
    },
    {
      ns: "IPanorama", name: "MyPersonaAPI.GetXuid()", sig: "MyPersonaAPI.GetXuid()", isJs: true,
      category: "panorama JS", desc: "Returns the local user's Steam xuid."
    },
    {
      ns: "IPanorama", name: "LobbyAPI.StartMatchmaking / StopMatchmaking", sig: "LobbyAPI.StartMatchmaking('', '', '', '')  |  LobbyAPI.StopMatchmaking()", isJs: true,
      category: "panorama JS", desc: "Start/stop the matchmaking queue (used for a spam-queue technique)."
    },
    {
      ns: "IPanorama", name: "LobbyChat.ScrollToBottom()", sig: "LobbyChat.ScrollToBottom()", isJs: true,
      category: "panorama JS", desc: "Scrolls the party/lobby chat panel to the bottom."
    },
    {
      ns: "IPanorama", name: "LobbyChat.FindChildInLayoutFile(panelId)", sig: "$('#MainMenu').FindChildInLayoutFile(panelId)", isJs: true,
      category: "panorama JS", desc: "Finds a named child panel in the current layout. Used to locate the chat input panel.",
      example: { file: "PanoramaFeatures-NiceL.lua", code: `var LobbyChat = $('#MainMenu').FindChildInLayoutFile('PartyChat');\nvar LobbyChatInput = LobbyChat.FindChildInLayoutFile('ChatInput');`, lang: "js" }
    },
    {
      ns: "IPanorama", name: "LobbyChat.SubmitChatText()", sig: "LobbyChatInput.SubmitChatText()", isJs: true,
      category: "panorama JS", desc: "Submits the current .text value of a chat input panel as a sent message."
    },
    {
      ns: "IPanorama", name: "PartyBrowserAPI.Refresh() / GetResultsCount() / GetXuidByIndex(i)", sig: "PartyBrowserAPI.Refresh()  |  PartyBrowserAPI.GetResultsCount()  |  PartyBrowserAPI.GetXuidByIndex(i)", isJs: true,
      category: "panorama JS", desc: "Refresh the party/lobby browser and read back the result count / xuid at index i."
    },
    {
      ns: "IPanorama", name: "FriendsListAPI.GetCount() / GetXuidByIndex(i) / ActionInviteFriend(xuid, msg)", sig: "FriendsListAPI.GetCount()  |  FriendsListAPI.GetXuidByIndex(i)  |  FriendsListAPI.ActionInviteFriend(xuid, message)", isJs: true,
      category: "panorama JS", desc: "Enumerate the friends list and invite a friend/party-browser user by xuid.",
      example: { file: "PanoramaFeatures-NiceL.lua", code: `function InviteFriends()\n    if (not Menu.GetBool("bPAutoInviteFriends")) then return end\n    IPanorama.RunScript_Menu([[\n        var Friends = FriendsListAPI.GetCount();\n        for (var i = 0; i < Friends; i++) {\n            FriendsListAPI.ActionInviteFriend(FriendsListAPI.GetXuidByIndex(i), "");\n        }\n    ]])\n    Menu.SetBool("bPAutoInviteFriends", false)\nend` }
    },

    // ---------------- IRenderBeams ----------------
    {
      ns: "IRenderBeams", name: "IRenderBeams.CreateBeamPoints", sig: "IRenderBeams.CreateBeamPoints(beamInfo)",
      category: "rendering, effects", desc: "Creates a laser-beam effect between two points from a populated BeamInfo_t struct. Returns a beam handle.",
      example: { file: "BulletTrace-NiceL.lua", code: `local Beam = IRenderBeams.CreateBeamPoints(BeamInfo)` }
    },
    {
      ns: "IRenderBeams", name: "IRenderBeams.DrawBeam", sig: "IRenderBeams.DrawBeam(beam)",
      category: "rendering, effects", desc: "Explicitly draws a beam handle. In the one sample referencing it, this call is commented out as “crashy” — use with caution.",
      example: { file: "BulletTrace-NiceL.lua", code: `--if (Beam) then\n--    IRenderBeams.DrawBeam(Beam)\n--end` }
    },

    // ---------------- InputSys ----------------
    {
      ns: "InputSys", name: "InputSys.IsKeyDown", sig: "InputSys.IsKeyDown(vkCode)",
      category: "input", desc: "Returns true while a virtual-key is held down.",
      example: { file: "FakeLagOnKey-NiceL.lua", code: `if InputSys.IsKeyDown(Menu.GetInt("iFakeLagKey")) then` }
    },
    {
      ns: "InputSys", name: "InputSys.IsKeyPress", sig: "InputSys.IsKeyPress(vkCode)",
      category: "input", desc: "Returns true on the single frame a key transitions to pressed (edge-triggered, unlike IsKeyDown).",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `if InputSys.IsKeyPress(Menu.GetInt("cHelperAlignKey")) then` }
    },
    {
      ns: "InputSys", name: "InputSys.SendKey", sig: "InputSys.SendKey(vkCode)",
      category: "input", desc: "Synthesizes a key press, e.g. auto-pressing the defuse-kit “use” key.",
      example: { file: "KibbeWater-BombTimer.lua", code: `InputSys.SendKey(18)` }
    },
    {
      ns: "InputSys", name: "InputSys.GetCursorPos", sig: "InputSys.GetCursorPos()",
      category: "input", desc: "Returns a Vector2D-like object (.x/.y) with the current mouse cursor position. Used for menu-drag UI logic.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `local cursor = InputSys.GetCursorPos()` }
    },

    // ---------------- Utils ----------------
    {
      ns: "Utils", name: "Utils.IsLocal", sig: "Utils.IsLocal()",
      category: "hack/core, entities", desc: "Returns true if there is a valid local player entity, regardless of alive state.",
      example: { file: "Custom Clantag.lua", code: `if (Utils.IsLocal()) then` }
    },
    {
      ns: "Utils", name: "Utils.IsLocalAlive", sig: "Utils.IsLocalAlive()",
      category: "entities", desc: "Returns true if the local player exists and is alive.",
      example: { file: "1_KillImage.lua", code: `if (not Utils.IsLocalAlive()) then return end` }
    },
    {
      ns: "Utils", name: "Utils.IsInGame", sig: "Utils.IsInGame()",
      category: "hack/core", desc: "Returns true if currently connected to a game/server.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `if not Utils.IsInGame() then return end` }
    },
    {
      ns: "Utils", name: "Utils.SetClantag", sig: "Utils.SetClantag(text)",
      category: "hack/core, misc", desc: "Overrides the player's displayed clan tag string.",
      example: { file: "Custom Clantag.lua", code: `Utils.SetClantag(Menu.GetString("sClanTag"))` }
    },
    {
      ns: "Utils", name: "Utils.GetFps", sig: "Utils.GetFps()  |  Utils:GetFps()",
      category: "misc, rendering", desc: "Returns current FPS. Seen called both as a namespace function and with colon syntax — the API appears tolerant of both.",
      example: { file: "EBDetection.lua", code: `local NewStrong = Strong * (120.0 / Utils:GetFps())` }
    },
    {
      ns: "Utils", name: "Utils.TraceLineOnlyEntities", sig: "Utils.TraceLineOnlyEntities(start, end, mask, ignoreEntity, outTrace)",
      category: "math/vector, entities", desc: "Performs a ray-trace against entities only (skips world geometry), filling outTrace (a trace_t-like object with .hit_entity).",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `Utils.TraceLineOnlyEntities(traceStart, traceEnd, 0x46004003, Local, tr)\nlocal Player = IEntityList.ToPlayer(tr.hit_entity)` }
    },
    {
      ns: "Utils", name: "Utils.TraceLine", sig: "Utils.TraceLine(start, end, mask, skipEntity, outTrace)",
      category: "math/vector, world, entities", desc: "WORLD ray-trace — unlike Utils.TraceLineOnlyEntities, this one collides with world/brush geometry, which makes wall and surface detection possible from Lua. Recovered from INTERIUM.dll; it does not appear in older community scripts. Fills outTrace (a trace_t / CGameTrace object). IMPORTANT: the binding does NOT expose trace.fraction, trace.endpos, or plane.normal — you can only ask whether the ray hit something, via the trace object's DidHit()/DidHitWorld()/IsVisible() methods. Distance must therefore be recovered indirectly (e.g. binary search on the ray length, or fixed-length probes). Calling it in large bursts has been observed to crash some builds — budget your traces per tick.",
      example: { file: "AutoAlign (community)", code: `local tr = trace_t.new()\nlocal from = Vector.new(o.x, o.y, o.z + 32)\nlocal to   = Vector.new(o.x + dirX * 17.25, o.y + dirY * 17.25, o.z + 32)\n\n-- MASK_PLAYERSOLID_BRUSHONLY = 0x0001400B\nUtils.TraceLine(from, to, 0x0001400B, pLocal, tr)\nif (tr:DidHit()) then\n    -- something solid is within 17.25 units in this direction\nend` }
    },
    {
      ns: "Utils", name: "Utils.CorrectMovement", sig: "Utils.CorrectMovement(wishAngle, cmd, forwardSpeed, sideSpeed, ?)",
      category: "input, movement", desc: "Adjusts a CreateMove usercmd's move values so the player moves toward wishAngle at the given speeds. Used for auto-align/auto-walk features.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `cmd.forwardmove = dist + 10\nUtils.CorrectMovement(wAng, cmd, cmd.forwardmove, 0, false)` }
    },

    // ---------------- Math ----------------
    {
      ns: "Math", name: "Math.WorldToScreen", sig: "Math.WorldToScreen(worldPos, outScreenPos)",
      category: "math/vector, rendering", desc: "Projects a 3D world position to 2D screen coordinates. Returns true/false for on/off-screen and fills outScreenPos.x/.y.",
      example: { file: "MolotovCircle-NiceL.lua", code: `if (Math.WorldToScreen(VectorEnd, ToScreen)) then\n    -- draw at ToScreen.x, ToScreen.y\nend` }
    },
    {
      ns: "Math", name: "Math.VectorDistance", sig: "Math.VectorDistance(a, b)",
      category: "math/vector", desc: "Returns the 3D distance between two Vectors.",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `local dist = Math.VectorDistance(pos, localPos)` }
    },
    {
      ns: "Math", name: "Math.AngleVectors", sig: "Math.AngleVectors(qangle, outVector)",
      category: "math/vector", desc: "Converts a QAngle into a forward-direction unit Vector, written into outVector.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `Math.AngleVectors(viewAngles_rcs, traceEnd)` }
    },
    {
      ns: "Math", name: "Math.VectorAngles", sig: "Math.VectorAngles(vector, outQAngle)",
      category: "math/vector", desc: "Converts a direction Vector into a QAngle, written into outQAngle (inverse of AngleVectors).",
      example: { file: "ClarityJumptrail.lua", code: `Math.VectorAngles(vel, newAng)` }
    },

    // ---------------- FileSys ----------------
    {
      ns: "FileSys", name: "FileSys.CreateDirectory", sig: "FileSys.CreateDirectory(path)",
      category: "file I/O", desc: "Creates a directory (and presumably intermediate directories) if missing.",
      example: { file: "1_KillImage.lua", code: `FileSys.CreateDirectory(GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\FilesForLUA\\\\")` }
    },
    {
      ns: "FileSys", name: "FileSys.FileIsExist", sig: "FileSys.FileIsExist(path)",
      category: "file I/O", desc: "Returns true if a file exists at the given path.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `if FileSys.FileIsExist(appData .. "keystrokes.dat") then` }
    },
    {
      ns: "FileSys", name: "FileSys.GetTextFromFile", sig: "FileSys.GetTextFromFile(path)",
      category: "file I/O", desc: "Reads and returns the full text contents of a file (empty string if missing).",
      example: { file: "KibbeWater-RichPresence.lua", code: `local verData = FileSys.GetTextFromFile(verdir.."rp.txt")` }
    },
    {
      ns: "FileSys", name: "FileSys.SaveTextToFile", sig: "FileSys.SaveTextToFile(path, text)",
      category: "file I/O", desc: "Overwrites a file with the given text content.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `FileSys.SaveTextToFile(appData .. "keystrokes.dat", PosX .. "," .. PosY)` }
    },
    {
      ns: "FileSys", name: "FileSys.GetVarStringFromFile", sig: "FileSys.GetVarStringFromFile(path, key, section)",
      category: "file I/O", desc: "Reads a single named value from an INI-style file (`key` under a `section`, e.g. map name). Returns \"\" if missing.",
      example: { file: "NadeHelper-Peter.lua", code: `local existCheck = FileSys.GetVarStringFromFile(iniPath, "dontchange", "DoNotChange")` }
    },
    {
      ns: "FileSys", name: "FileSys.SaveVarStringToFile", sig: "FileSys.SaveVarStringToFile(path, key, value, section)",
      category: "file I/O", desc: "Writes a single named value into an INI-style file under a section.",
      example: { file: "NadeHelper-Peter.lua", code: `FileSys.SaveVarStringToFile(iniPath, "standPositionX" .. n+1, standingMarkPosition.x, mapName)` }
    },

    // ---------------- Globals ----------------
    {
      ns: "Globals", name: "Globals.ScreenWidth / ScreenHeight", sig: "Globals.ScreenWidth()  |  Globals.ScreenHeight()",
      category: "misc, rendering", desc: "Current viewport size in pixels. Used pervasively for HUD layout.",
      example: { file: "Grenadeable-Dashie.lua", code: `Menu.SliderFloat("YPos", "fSliderY", "1", Globals.ScreenHeight(), "%.0f", Globals.ScreenHeight() / 2)` }
    },
    {
      ns: "Globals", name: "Globals.MenuOpened", sig: "Globals.MenuOpened()",
      category: "menu/UI", desc: "Returns true while the hack's menu UI is open. Used to gate dragging logic or hide spectator names while the menu is open.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `if Globals.MenuOpened() then\n    Render.Rect(corners[1], corners[2], corners[3], corners[4], Color.new(255,255,255,255))\nend` }
    },

    // ---------------- Bare globals ----------------
    {
      ns: "Bare", name: "Print", sig: "Print(...)",
      category: "misc/hack-core", desc: "Prints to the hack's debug console. Accepts string-concatenated messages.",
      example: { file: "EBDetection.lua", code: `Print("Detection S4 (Edgebug)\\necho Info: " .. vVelocity.x .. " " .. vVelocity.y .. " " .. vVelocity.z)` }
    },
    {
      ns: "Bare", name: "SetBit / DelBit / IsBit", sig: "SetBit(value, bitIndex)  |  DelBit(value, bitIndex)  |  IsBit(value, bitIndex)",
      category: "misc/bit-flags", desc: "Set/clear/test a bit in an integer flags value, e.g. cmd.buttons or m_fFlags. IMPORTANT: these take a bit INDEX, not the flag value. FL_ONGROUND is value 1 = index 0, so the check is IsBit(flags, 0). Likewise IN_JUMP (1<<1) is index 1 and IN_DUCK (1<<2) is index 2. Passing the flag value instead of the index is a common bug that silently makes the check never fire.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `if (not IsBit(pCmd.buttons, IN_ATTACK)) then return end\npCmd.buttons = DelBit(pCmd.buttons, IN_ATTACK)\n\n-- OpenDoorSpam-NiceL.lua\npCmd.buttons = SetBit(pCmd.buttons, IN_USE)` }
    },
    {
      ns: "Bare", name: "GetBool / SetBool / GetInt / GetColor / SetColor", sig: "GetBool(x)  |  SetBool(x, value)  |  GetInt(x)  |  GetColor(x)  |  SetColor(x, value)",
      category: "hack/core, menu/UI", desc: "Overloaded pass-by-reference-style accessors used on both raw usercmd out-params (e.g. p_bSendPacket) and built-in Vars.* menu-variable handles — the hack's own legacy convars, distinct from user-registered Menu.* widgets.",
      example: { file: "FakeLagOnKey-NiceL.lua", code: `local bSendPacket = GetBool(p_bSendPacket)\nSetBool(p_bSendPacket, false)\n\n-- MovementIndicators-NiceL.lua\nif (Menu.GetBool("bShowIndAS") and GetBool(Vars.misc_autostrafe) and GetInt(Vars.misc_autostrafe_enabletype) == 1) then\n\n-- RainbowColors-NiceL.lua\nSetColor(Vars.color_chams_enemy_visible, Color.new(R, G, B, GetColor(Vars.color_chams_enemy_visible).a))` }
    },
    {
      ns: "Bare", name: "GetTickCount", sig: "GetTickCount()",
      category: "misc", desc: "Returns the OS tick count in milliseconds (Windows GetTickCount). Used for simple cooldown timers.",
      example: { file: "123.lua", code: `if (a1 < GetTickCount()) then\n    a2 = a2 + 1\n    a1 = GetTickCount() + delay\nend` }
    },
    {
      ns: "Bare", name: "URLDownloadToFile", sig: "URLDownloadToFile(url, destPath)",
      category: "networking, file I/O", desc: "Downloads a URL to a local file path. Used for images, fonts, sounds, and remote data/config files.",
      example: { file: "1_KillImage.lua", code: `URLDownloadToFile("https://i.imgur.com/2uhe8RF.png", GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\FilesForLUA\\\\KillImage-w3rn3r\\\\temp")` }
    },
    {
      ns: "Bare", name: "PlaySound", sig: "PlaySound(path)",
      category: "sound", desc: "Plays a .wav file from an absolute filesystem path (compare to ISurface.PlaySound_, which uses a game-relative path).",
      example: { file: "Custom_Killsound.lua", code: `PlaySound(GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\KillSound.wav")` }
    },
    {
      ns: "Bare", name: "GetAppData", sig: "GetAppData()",
      category: "file I/O, misc", desc: "Returns the Windows %AppData% path. Used as the base for all script data/download paths.",
      example: { file: "1_KillImage.lua", code: `GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\FilesForLUA\\\\"` }
    },
    {
      ns: "Bare", name: "UpdateGetTime / GetTimeHour / GetTimeMin / GetTimeSec", sig: "UpdateGetTime()  |  GetTimeHour()  |  GetTimeMin()  |  GetTimeSec()",
      category: "misc", desc: "A small clock API: UpdateGetTime() refreshes an internal time snapshot, then GetTimeHour/Min/Sec() read the local system hour/minute/second from it. Used for clock-based clantags/watermarks.",
      example: { file: "ClockWatermark.lua", code: `function GetTime()\n    UpdateGetTime()\n    return GetIntTime(GetTimeHour()) .. ":" .. GetIntTime(GetTimeMin()) .. ":" .. GetIntTime(GetTimeSec())\nend` }
    },

    // ---------------- IEffects ----------------
    {
      ns: "IEffects", name: "IEffects.CL_AllocDlight", sig: "IEffects.CL_AllocDlight(key)",
      category: "effects/rendering", desc: "Allocates a dynamic light and returns an object whose fields (.r, .g, .b, .exponent, .m_Direction, .origin, .radius, .die, .decay, .key) can be set to configure it.",
      example: { file: "example_Effects.lua", code: `local pElight = IEffects.CL_AllocDlight(IEngine.GetLocalPlayer())\npElight.r = 255\npElight.g = 255\npElight.b = 255\npElight.exponent = 8\npElight.origin = LocalPlayerOrigin\npElight.radius = 200.0\npElight.die = IGlobalVars.curtime + 0.1\npElight.decay = 1.0` }
    },

    // ---------------- Entity/Player methods ----------------
    {
      ns: "EntityMethods", name: ":GetAbsOrigin", sig: "entity:GetAbsOrigin()",
      category: "entities", desc: "Returns the entity's world-space origin as a Vector.",
      example: { file: "Checkpoint.lua", code: `undopos = pLocal:GetAbsOrigin()` }
    },
    {
      ns: "EntityMethods", name: ":GetEyePos", sig: "player:GetEyePos()",
      category: "entities", desc: "Returns the player's eye position Vector, for view/trace origin.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `traceStart = Local:GetEyePos()` }
    },
    {
      ns: "EntityMethods", name: ":GetActiveWeapon", sig: "player:GetActiveWeapon()",
      category: "entities/weapons", desc: "Returns the currently-equipped weapon entity, or nil.",
      example: { file: "InverseKnifeHand-NiceL.lua", code: `local Weapon = Self:GetActiveWeapon()` }
    },
    {
      ns: "EntityMethods", name: ":GetWeaponData", sig: "weapon:GetWeaponData()",
      category: "entities/weapons", desc: "Returns a CWeaponInfo-like table/struct of static weapon stats.",
      example: { file: "InverseKnifeHand-NiceL.lua", code: `local WeaponData = Weapon:GetWeaponData()\nlocal WeaponType = WeaponData.iWeaponType` }
    },
    {
      ns: "EntityMethods", name: ":GetClassId", sig: "entity:GetClassId()",
      category: "entities", desc: "Returns the entity's networked class id. Players are consistently 40 across all scripts; planted C4 is 129. See the Class ID reference table.",
      example: { file: "Grenadeable-Dashie.lua", code: `if (Player and Player:GetClassId() == 40 and Player:IsAlive() and not Player:IsDormant()) then` }
    },
    {
      ns: "EntityMethods", name: ":GetIndex", sig: "entity:GetIndex()",
      category: "entities", desc: "Returns this entity's own entity index.",
      example: { file: "Korobasik-SpectatorList.lua", code: `if (TargetIndex ~= Target:GetIndex()) then goto continue end` }
    },
    {
      ns: "EntityMethods", name: ":GetMoveType", sig: "player:GetMoveType()",
      category: "entities/movement", desc: "Returns the player's current movetype int. 8 = noclip and 9 = ladder are checked as special-case constants across multiple scripts.",
      example: { file: "1_Velocity_v3.lua", code: `local iMoveType = pLocal:GetMoveType()` }
    },
    {
      ns: "EntityMethods", name: ":IsAlive", sig: "player:IsAlive()",
      category: "entities", desc: "Returns whether the player entity is alive.",
      example: { file: "Grenadeable-Dashie.lua", code: `Player:IsAlive()` }
    },
    {
      ns: "EntityMethods", name: ":IsDormant", sig: "entity:IsDormant()",
      category: "entities", desc: "Returns true if the entity is dormant (not currently updated/visible, e.g. out of PVS).",
      example: { file: "Grenadeable-Dashie.lua", code: `not Player:IsDormant()` }
    },
    {
      ns: "EntityMethods", name: ":IsTeammate", sig: "player:IsTeammate()",
      category: "entities", desc: "Returns true if the entity is on the local player's team.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `if (Player and Player:GetClassId() == 40 and Player:IsTeammate()) then` }
    },
    {
      ns: "EntityMethods", name: ":GetPlayerInfo", sig: "player:GetPlayerInfo(outCPlayerInfo)",
      category: "entities", desc: "Fills a CPlayerInfo struct with name/steamid/userid info. Returns true on success.",
      example: { file: "Grenadeable-Dashie.lua", code: `local PlayerInfo = CPlayerInfo.new()\nPlayer:GetPlayerInfo(PlayerInfo)` }
    },
    {
      ns: "EntityMethods", name: ":GetBox", sig: "entity:GetBox()",
      category: "entities/rendering", desc: "Returns the entity's current 2D screen bounding box, with .left/.top/.right/.bottom fields.",
      example: { file: "KibbeWater-AdvancedGriefing.lua", code: `local box = eDecoy:GetBox()\nRender.Rect(box.left, box.top, box.right, box.bottom, TimeToColor(15, x), 0, 2)` }
    },
    {
      ns: "EntityMethods", name: ":GetPropInt / :SetPropInt", sig: "entity:GetPropInt(offset)  |  entity:SetPropInt(offset, value)",
      category: "entities", desc: "Read (Get form is the one seen used in the corpus) an integer netprop by resolved offset. Combine with Hack.GetOffset.",
      example: { file: "1_Velocity_v3.lua", code: `local Flags = pLocal:GetPropInt(fFlags_Offset)` }
    },
    {
      ns: "EntityMethods", name: ":GetPropFloat / :SetPropFloat", sig: "entity:GetPropFloat(offset)  |  entity:SetPropFloat(offset, value)",
      category: "entities", desc: "Read/write a float netprop.",
      example: { file: "Killeffect-Vinyl.lua", code: `pLocal:SetPropFloat(offset, IGlobalVars.curtime + Menu.GetFloat("pf_killeffect_length"))` }
    },
    {
      ns: "EntityMethods", name: ":GetPropVector", sig: "entity:GetPropVector(offset)",
      category: "entities, math/vector", desc: "Reads a Vector netprop, e.g. origin or velocity.",
      example: { file: "1_Velocity_v3.lua", code: `local vVelocity = pLocal:GetPropVector(vVelocity_Offset)` }
    },
    {
      ns: "EntityMethods", name: ":GetPropAngle", sig: "entity:GetPropAngle(offset)",
      category: "entities, math/vector", desc: "Reads a QAngle netprop, e.g. aim punch angle.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `LocalAngPunch = Local:GetPropAngle(m_aimPunchAngle_Offset)` }
    },
    {
      ns: "EntityMethods", name: ":GetPropString", sig: "entity:GetPropString(offset)",
      category: "entities", desc: "Reads a string netprop, e.g. last-place name.",
      example: { file: "Grenadeable-Dashie.lua", code: `local PlayerPlace = Player:GetPropString(lastPlace_Offset)` }
    },
    {
      ns: "EntityMethods", name: ":GetPropBool / :SetPropBool", sig: "entity:GetPropBool(offset)  |  entity:SetPropBool(offset, value)",
      category: "entities", desc: "Read/write a boolean netprop.",
      example: { file: "NightModeDLC-NiceL.lua", code: `ent:SetPropBool(m_bUseCustomAutoExposureMin, true)` }
    },

    // ---------------- Event object methods ----------------
    {
      ns: "EventMethods", name: "Event:GetName", sig: "Event:GetName()",
      category: "game events", desc: "Returns the string event name, e.g. \"player_death\", \"round_start\". Passed into FireEventClientSideThink handlers.",
      example: { file: "HitSound-NiceL.lua", code: `if (Event:GetName() == "player_hurt") then` }
    },
    {
      ns: "EventMethods", name: "Event:GetInt", sig: "Event:GetInt(key, default)",
      category: "game events", desc: "Reads an integer field from the event's key/value payload.",
      example: { file: "1_KillImage.lua", code: `Event:GetInt("attacker", 0)` }
    },
    {
      ns: "EventMethods", name: "Event:GetBool", sig: "Event:GetBool(key, default)",
      category: "game events", desc: "Reads a boolean field from the event payload.",
      example: { file: "1_KillImage.lua", code: `Event:GetBool("headshot", false)` }
    },
    {
      ns: "EventMethods", name: "Event:GetString", sig: "Event:GetString(key)",
      category: "game events", desc: "Reads a string field from the event payload.",
      example: { file: "WaterUI.lua", code: `local text = Event:GetString("text")` }
    },
    {
      ns: "EventMethods", name: "msg_data:find", sig: "msg_data:find(pattern, init)",
      category: "networking, string-lib", desc: "Standard Lua string method used on a raw DispatchUserMessage byte-string payload to locate a chat-type marker. DispatchUserMessage handler signature: function(type, a3, length, msg_data).",
      example: { file: "example_Chat.lua", code: `function ChatHook(type, a3, length, msg_data)\n    if (msg_data:find("Cstrike_Chat_All", 0)) then\n        -- ...\n    end\nend\nHack.RegisterCallback("DispatchUserMessage", ChatHook)` }
    },

    // ---------------- Buffer (user-space pattern) ----------------
    {
      ns: "BufferMethods", name: "Buffer:New / :Update / :Flush / :String", sig: "Buffer:New()  |  Buffer:Update()  |  Buffer:Flush()  |  Buffer:String()",
      category: "networking/serialization (user-space)", desc: "A hand-rolled byte-buffer pattern (not a confirmed native engine class — defined in Lua by the script itself) that deep-copies/reinitializes/flushes a byte buffer, or concatenates it back to a string.",
      inferred: true,
      example: { file: "KibbeWater-RichPresence.lua", code: `function Buffer:Flush()\n    self.data = {}\n    self.length = 0\n    self.pos = 0\nend` }
    },
    {
      ns: "BufferMethods", name: "Buffer:LoadData / :LoadFile", sig: "Buffer:LoadData(str)  |  Buffer:LoadFile(path)",
      category: "file I/O, networking", desc: "Loads raw bytes into the buffer from a string, or from a file via FileSys.GetTextFromFile.",
      inferred: true,
      example: { file: "KibbeWater-RichPresence.lua", code: `buffer:LoadFile(filename)` }
    },
    {
      ns: "BufferMethods", name: "Buffer:ReadByte / ReadInt / ReadDouble / ReadShort / ReadLong / ReadFloat / ReadString", sig: "Buffer:ReadByte()  |  Buffer:ReadInt()  |  Buffer:ReadDouble()  |  Buffer:ReadShort()  |  Buffer:ReadLong()  |  Buffer:ReadFloat()  |  Buffer:ReadString(len)",
      category: "networking/serialization", desc: "Sequential binary readers, each advancing an internal cursor.",
      inferred: true,
      example: { file: "KibbeWater-RichPresence.lua", code: `function Buffer:ReadInt()\n    self:Update()\n    local b1 = self:ReadByte()\n    -- ...\nend` }
    },
    {
      ns: "BufferMethods", name: "Buffer:WriteByte / WriteInt / WriteDouble / WriteShort / WriteLong / WriteFloat / WriteString", sig: "Buffer:WriteByte(n)  |  Buffer:WriteInt(n)  |  Buffer:WriteDouble(n)  |  Buffer:WriteShort(n)  |  Buffer:WriteLong(n)  |  Buffer:WriteFloat(n)  |  Buffer:WriteString(str, len)",
      category: "networking/serialization", desc: "Sequential binary writers appending to the buffer. Used to build a fixed-layout struct written to disk, e.g. for a Discord Rich Presence bridge process.",
      inferred: true,
      example: { file: "KibbeWater-RichPresence.lua", code: `writeBuffer:WriteString("Playing " .. IEngine.GetLevelNameShort(), 128)\nwriteBuffer:WriteString("Official Servers", 128)\nwriteBuffer:WriteString(GetUsername(), 128)\nwriteBuffer:WriteFloat(IGlobalVars.realtime)\nwriteBuffer:WriteShort(0)\nwriteBuffer:WriteByte(0)\nFileSys.SaveTextToFile(appdir.."presence.dat", writeBuffer:String())` }
    },

    // ---------------- Structs / constructors ----------------
    {
      ns: "Structs", name: "Color.new", sig: "Color.new(r, g, b, a)  |  Color.new()",
      category: "rendering", desc: "Fields: .r, .g, .b, .a (all 0-255, mutable after construction). The no-arg form creates a zeroed/default color to be filled in later.",
      example: { file: "KibbeWater-BombTimer.lua", code: `local textClr = Menu.GetColor("cBombClrText")\ntextClr.a = textAlpha` }
    },
    {
      ns: "Structs", name: "Vector.new", sig: "Vector.new(x, y, z)  |  Vector.new()",
      category: "math/vector", desc: "Fields: .x, .y, .z (floats, mutable). The no-arg form is also used.",
      example: { file: "1_Velocity_v3.lua", code: `local vBuf = Vector.new()\nvBuf.x = Vec1.x - Vec2.x\nvBuf.y = Vec1.y - Vec2.y\nvBuf.z = Vec1.z - Vec2.z` }
    },
    {
      ns: "Structs", name: "Vector2D.new", sig: "Vector2D.new(x, y)",
      category: "math/vector", desc: "Fields: .x, .y. Used for 2D velocity/screen-space math.",
      example: { file: "Checkpoint.lua", code: `local velRotated = Vector2D.new(vecx, vecy)` }
    },
    {
      ns: "Structs", name: "QAngle.new", sig: "QAngle.new(pitch, yaw, roll)  |  QAngle.new()",
      category: "math/vector", desc: "Fields: .pitch, .yaw, .roll (every real sample in this corpus consistently uses these, not .x/.y/.z). The no-arg form is also used.",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `local viewAngles_rcs = QAngle.new()\nviewAngles_rcs.pitch = viewAngles.pitch + LocalAngPunch.pitch * 2.0\nviewAngles_rcs.yaw = viewAngles.yaw + LocalAngPunch.yaw * 2.0\nviewAngles_rcs.roll = viewAngles.roll + LocalAngPunch.roll * 2.0` }
    },
    {
      ns: "Structs", name: "BeamInfo_t.new", sig: "BeamInfo_t.new()",
      category: "effects/rendering", desc: "Struct passed to IRenderBeams.CreateBeamPoints. Fields observed set: m_nType, m_pszModelName, m_nModelIndex, m_flHaloScale, m_flLife, m_flWidth, m_flEndWidth, m_flFadeLength, m_flAmplitude, m_flBrightness, m_flSpeed, m_nStartFrame, m_flFrameRate, m_flRed, m_flGreen, m_flBlue, m_nSegments, m_bRenderable, m_nFlags, m_vecStart (Vector), m_vecEnd (Vector).",
      example: { file: "JumpTrail-NiceL.lua", code: `local BeamInfo = BeamInfo_t.new()\nBeamInfo.m_nType = 0\nBeamInfo.m_pszModelName = "sprites/purplelaser1.vmt"\nBeamInfo.m_nModelIndex = -1\nBeamInfo.m_flLife = Menu.GetFloat("fJumpTrailLife")\nBeamInfo.m_flWidth = 5\nBeamInfo.m_flEndWidth = 5\nBeamInfo.m_flRed = col.r\nBeamInfo.m_flGreen = col.g\nBeamInfo.m_flBlue = col.b\nBeamInfo.m_nSegments = 2\nBeamInfo.m_bRenderable = true\nBeamInfo.m_vecStart = Origin_old\nBeamInfo.m_vecEnd = LocalOrigin\nlocal Beam = IRenderBeams.CreateBeamPoints(BeamInfo)` }
    },
    {
      ns: "Structs", name: "CPlayerInfo.new", sig: "CPlayerInfo.new()",
      category: "entities/players", desc: "Populated by :GetPlayerInfo(info). Fields observed read: .szName (display name string), .userId (game-event userid), .steamID64 (string/number Steam64 id).",
      example: { file: "KibbeWater-AdvancedGriefing.lua", code: `local Info = CPlayerInfo.new()\nif (not pCurrent:GetPlayerInfo(Info)) then goto continue end\nif Info.userId == uid then return i end` }
    },
    {
      ns: "Structs", name: "CWeaponInfo.new", sig: "CWeaponInfo.new()",
      category: "entities/weapons", desc: "Returned by weapon:GetWeaponData() (the .new() call itself is mostly a placeholder local before being overwritten by the return value). Fields observed read: .iWeaponType (int weapon category — knife=0, 1-6 used as a “is a gun” range check), .consoleName (e.g. \"weapon_molotov\", \"weapon_incgrenade\", \"weapon_smokegrenade\", \"weapon_hegrenade\"), .iMaxClip1 (max primary ammo).",
      example: { file: "KibbeWater-GrenadeHelper.lua", code: `local wInfo = weapon:GetWeaponData()\nif wInfo.consoleName == "weapon_molotov" or wInfo.consoleName == "weapon_incgrenade" then wName = "molotov"\nelseif wInfo.consoleName == "weapon_smokegrenade" then wName = "smoke" end` }
    },
    {
      ns: "Structs", name: "trace_t.new", sig: "trace_t.new()",
      category: "math/vector, entities", desc: "Trace-result struct passed to Utils.TraceLineOnlyEntities. Field observed read: .hit_entity (the entity handle the trace collided with).",
      example: { file: "AntiBan_TeamKill-NiceL.lua", code: `local tr = trace_t.new()\nUtils.TraceLineOnlyEntities(traceStart, traceEnd, 0x46004003, Local, tr)\nlocal Player = IEntityList.ToPlayer(tr.hit_entity)` }
    },
    {
      ns: "Structs", name: "CGameTrace.new", sig: "CGameTrace.new()",
      category: "math/vector, world", desc: "Alternate constructor for a trace-result object, used where trace_t is unavailable. Community scripts probe both: try trace_t.new() first, fall back to CGameTrace.new(). The returned object is what you pass as the outTrace argument to Utils.TraceLine / Utils.TraceLineOnlyEntities.",
      example: { file: "AutoAlign (community)", code: `local function createTraceResult()\n    if (trace_t ~= nil and trace_t.new ~= nil) then\n        local ok, r = pcall(trace_t.new)\n        if (ok) then return r end\n    end\n    if (CGameTrace ~= nil and CGameTrace.new ~= nil) then\n        local ok, r = pcall(CGameTrace.new)\n        if (ok) then return r end\n    end\n    return nil\nend` }
    },
    {
      ns: "Structs", name: "trace:DidHit / :DidHitWorld / :IsVisible", sig: "trace:DidHit()  |  trace:DidHitWorld()  |  trace:IsVisible()",
      category: "math/vector, world", desc: "Result methods on a trace object after Utils.TraceLine fills it. Since the binding exposes no .fraction / .endpos / .plane, these booleans are the ONLY way to read a world trace result. WARNING: DidHitWorld() dereferences the hit entity internally and has been observed to crash on brush/world traces in some builds — DidHit() only reads trace flags and is the safer choice. IsVisible() is the inverse (true when nothing was hit). Probe for whichever exists and prefer DidHit.",
      example: { file: "AutoAlign (community)", code: `if (traceResult.DidHit ~= nil) then\n    traceHit = function(tr) return tr:DidHit() end\nelseif (traceResult.DidHitWorld ~= nil) then\n    traceHit = function(tr) return tr:DidHitWorld() end\nelseif (traceResult.IsVisible ~= nil) then\n    traceHit = function(tr) return not tr:IsVisible() end\nend` }
    },
    {
      ns: "Structs", name: "CreateMove usercmd (cmd / pCmd)", sig: "cmd.buttons  |  cmd.viewangles  |  cmd.forwardmove  |  cmd.sidemove  |  cmd.mousedx  |  cmd.mousedy",
      category: "input, movement", desc: "Not a .new() constructor — this is the struct passed as the first parameter of every CreateMove callback. Fields: .buttons (bitflags, use with SetBit/DelBit/IsBit), .viewangles (QAngle), .forwardmove, .sidemove, .mousedx, .mousedy.",
      example: { file: "KibbeWater-AdvancedGriefing.lua", code: `cmd.viewangles = wAng\ncmd.forwardmove = dist + 1\ncmd.buttons = SetBit(cmd.buttons, 2)` }
    }
  ],

  // Callback reference (separate page, not part of `entries`)
  callbacks: [
    {
      name: "CreateMove",
      handlerSig: "function(cmd, sendPacket)",
      trigger: "Fires once per game tick, before the move command is sent to the server — the primary hook for movement scripts, keybinds, aim, and per-tick data collection. Parameter names vary in the wild: cmd/pCmd, send/sendp/p_bSendPacket.",
      example: { file: "AntiAFK-NiceL.lua", code: `function CreateMove(cmd, sendp)\n    if (not Menu.GetBool("bAntiAFK")) then return end\n    if (cmd.mousedx == 0 and cmd.mousedy == 0) then\n        AFKTicks = AFKTicks + 1\n    else\n        AFKTicks = 0\n    end\n    -- ...\nend\nHack.RegisterCallback("CreateMove", CreateMove)` }
    },
    {
      name: "PaintTraverse",
      handlerSig: "function()",
      trigger: "Fires once per rendered frame during the HUD/overlay paint pass — the primary hook for all 2D/3D drawing (Render.*, ISurface.*). No parameters.",
      example: { file: "AspectRatio-NiceL.lua", code: `function PaintTraverse()\n    if (not Utils.IsLocal()) then bAspect2 = 0; fAspect2 = 0; return end\n    -- ...\nend\nHack.RegisterCallback("PaintTraverse", PaintTraverse)` }
    },
    {
      name: "FireEventClientSideThink",
      handlerSig: "function(Event)",
      trigger: "Fires for every dispatched game event: player_death, player_hurt, round_start, round_end, bullet_impact, decoy_started, decoy_detonate, inferno_startburn, inferno_expire, player_spawn, player_team, player_say, cs_pre_restart, game_newmap, buytime_ended, and more — filter internally via Event:GetName(). Despite the name, this is not tied to a specific “think” entity; it's the general game-event sink. Some events (like bullet_impact) must be opted into first with IGameEventListener.AddEvent.",
      example: { file: "HitSound-NiceL.lua", code: `local function Func(Event)\n    if (not Menu.GetBool("bHitSound")) then return end\n    if (not Utils.IsLocal()) then return end\n    if (Event:GetName() == "player_hurt") then\n        local IsLocalShot = IEngine.GetPlayerForUserID(Event:GetInt("attacker", 0)) == IEngine.GetLocalPlayer()\n        if IsLocalShot then PlaySound(GetAppData() .. "\\\\INTERIUM\\\\CSGO\\\\HitSound.wav") end\n    end\nend\nHack.RegisterCallback("FireEventClientSideThink", Func)` }
    },
    {
      name: "FrameStageNotify",
      handlerSig: "function(stage)",
      trigger: "Fires on each client frame-stage transition (Source engine ClientFrameStage_t enum). stage == 5 is checked repeatedly in the corpus, corresponding to the render/frame-end stage — used for menu-drag position updates and the Panorama auto-invite/spam loop.",
      example: { file: "KibbeWater-Keystrokes.lua", code: `Hack.RegisterCallback("FrameStageNotify", function(stage)\n    if stage == 5 then return end\n    if Dragging then\n        local cursor = InputSys.GetCursorPos()\n        -- ...\n    end\n    OldDragging = Dragging\nend)` }
    },
    {
      name: "DispatchUserMessage",
      handlerSig: "function(type, a3, length, msg_data)",
      trigger: "Fires for every raw engine “user message” network packet. Used to sniff chat messages before they're rendered, by pattern-matching on msg_data.",
      example: { file: "example_Chat.lua", code: `function ChatHook(type, a3, length, msg_data)\n    if (msg_data:find("Cstrike_Chat_All", 0)) then\n        ChatType = "Cstrike_Chat_All"\n        -- ...\n    end\nend\nHack.RegisterCallback("DispatchUserMessage", ChatHook)` }
    }
  ],

  // Offset catalog (separate page)
  offsets: [
    { cls: "DT_BaseEntity", prop: "m_vecOrigin", desc: "Entity world position" },
    { cls: "DT_BasePlayer", prop: "m_vecVelocity[0]", desc: "Player velocity vector" },
    { cls: "DT_BasePlayer", prop: "m_fFlags", desc: "Player flag bits (on-ground, etc.)" },
    { cls: "DT_BasePlayer", prop: "m_iHealth", desc: "Player health" },
    { cls: "DT_BasePlayer", prop: "m_aimPunchAngle", desc: "Recoil/aim-punch angle" },
    { cls: "DT_BasePlayer", prop: "m_vecViewOffset[0]", desc: "Eye-height offset above origin" },
    { cls: "DT_BasePlayer", prop: "m_iTeamNum", desc: "Team number" },
    { cls: "DT_BasePlayer", prop: "m_szLastPlaceName", desc: "Last named location string" },
    { cls: "DT_BasePlayer", prop: "m_iObserverMode", desc: "Spectator observer mode" },
    { cls: "DT_BasePlayer", prop: "m_hObserverTarget", desc: "Spectator's current observed target handle" },
    { cls: "DT_CSPlayer", prop: "m_flStamina", desc: "Player stamina" },
    { cls: "DT_BasePlayer", prop: "m_flMaxspeed", desc: "Current max movement speed. May not resolve on every build — guard the lookup and fall back to a constant if it returns nil/0." },
    { cls: "DT_CSPlayer", prop: "m_iAccount", desc: "Player money" },
    { cls: "DT_CSPlayer", prop: "m_ArmorValue", desc: "Player armor" },
    { cls: "DT_CSPlayer", prop: "m_bIsScoped", desc: "Whether player is scoped in" },
    { cls: "DT_CSPlayer", prop: "m_bHasDefuser", desc: "Has defuse kit" },
    { cls: "DT_CSPlayer", prop: "m_flHealthShotBoostExpirationTime", desc: "Used as generic float scratch prop for a screen-flash timer hack" },
    { cls: "DT_BaseCombatWeapon", prop: "m_iClip1", desc: "Current weapon ammo in clip" },
    { cls: "DT_PlantedC4", prop: "m_flC4Blow", desc: "Time the bomb detonates" },
    { cls: "DT_PlantedC4", prop: "m_nBombSite", desc: "Bomb site index (A/B/etc)" },
    { cls: "DT_PlantedC4", prop: "m_bBombTicking", desc: "Whether the bomb is armed/ticking" },
    { cls: "DT_PlantedC4", prop: "m_flDefuseLength", desc: "Total time required to defuse" },
    { cls: "DT_PlantedC4", prop: "m_flDefuseCountDown", desc: "Time defuse completes" },
    { cls: "DT_PlantedC4", prop: "m_bBombDefused", desc: "Whether bomb has been defused" },
    { cls: "DT_PlantedC4", prop: "m_hBombDefuser", desc: "Entity handle of the defusing player (-1 if none)" },
    { cls: "DT_EnvTonemapController", prop: "m_bUseCustomAutoExposureMin", desc: "Night-mode tonemap override toggle" },
    { cls: "DT_EnvTonemapController", prop: "m_bUseCustomAutoExposureMax", desc: "Night-mode tonemap override toggle" },
    { cls: "DT_EnvTonemapController", prop: "m_flCustomAutoExposureMin", desc: "Night-mode brightness" },
    { cls: "DT_EnvTonemapController", prop: "m_flCustomAutoExposureMax", desc: "Night-mode brightness" },
    { cls: "DT_EnvTonemapController", prop: "m_flCustomBloomScale", desc: "Night-mode bloom scale" }
  ],

  offsetExample: { file: "KibbeWater-BombTimer.lua", code: `local Blow_Offset = Hack.GetOffset("DT_PlantedC4", "m_flC4Blow")\nlocal Site_Offset = Hack.GetOffset("DT_PlantedC4", "m_nBombSite")\nlocal Ticking_Offset = Hack.GetOffset("DT_PlantedC4", "m_bBombTicking")\n-- ...\ntimeLeft = bomb:GetPropFloat(Blow_Offset) - IGlobalVars.curtime\nsite = bomb:GetPropInt(Site_Offset)\nticking = bomb:GetPropBool(Ticking_Offset)` },

  constants: {
    masks: [
      { name: "MASK_PLAYERSOLID_BRUSHONLY", value: "0x0001400B", desc: "World/brush geometry only. contents_solid | contents_moveable | contents_window | contents_playerclip | contents_grate. The mask to use for wall detection." },
      { name: "MASK_PLAYERSOLID", value: "0x0201400B", desc: "Player-solid including entities. Used for ceiling checks and general collision." },
      { name: "(entities-only example mask)", value: "0x46004003", desc: "Seen passed to Utils.TraceLineOnlyEntities in older community scripts." }
    ],
    buttonBits: [
      { name: "IN_ATTACK", value: "0", desc: "Bit index for primary fire" },
      { name: "IN_JUMP", value: "1", desc: "Bit index for jump" },
      { name: "IN_DUCK", value: "2", desc: "Bit index for duck" },
      { name: "IN_FORWARD", value: "3", desc: "Bit index for forward" },
      { name: "IN_BACK", value: "4", desc: "Bit index for back" },
      { name: "IN_USE", value: "5", desc: "Bit index for use" },
      { name: "IN_MOVELEFT", value: "9", desc: "Bit index for strafe left" },
      { name: "IN_MOVERIGHT", value: "10", desc: "Bit index for strafe right" }
    ],
    moveTypes: [
      { name: "MOVETYPE_WALK", value: "2", desc: "Normal walking movement" },
      { name: "MOVETYPE_FLY", value: "4", desc: "Flying" },
      { name: "MOVETYPE_NOCLIP", value: "8", desc: "Noclip — movement scripts should bail out" },
      { name: "MOVETYPE_LADDER", value: "9", desc: "On a ladder — movement scripts should bail out" },
      { name: "MOVETYPE_OBSERVER", value: "10", desc: "Spectating" }
    ],
    flagBits: [
      { name: "FL_ONGROUND", value: "0", desc: "Bit index in m_fFlags. IsBit(flags, 0) is the on-ground check." }
    ],
    physics: [
      { name: "surf / texture-bug vel.z signature", value: "-6.25", desc: "-(sv_gravity * interval_per_tick * 0.5) = -(800 * 0.015625 * 0.5) at 64 tick. A held surf reads exactly this because the surface cancels vertical velocity between Source's two half-gravity applications. Community scripts test math.abs(vel.z + 6.25) < 0.015." }
    ]
  },

  varsHandles: [
    { name: "Vars.misc_autostrafe", type: "bool", desc: "Built-in autostrafe enabled" },
    { name: "Vars.misc_autostrafe_enabletype", type: "int", desc: "Autostrafe mode; 1 = key-bound" },
    { name: "Vars.misc_autostrafe_key", type: "int", desc: "Autostrafe key (virtual-key code)" },
    { name: "Vars.misc_edge", type: "bool", desc: "Edge jump enabled" },
    { name: "Vars.misc_edge_enabletype", type: "int", desc: "Edge jump mode; 1 = key-bound" },
    { name: "Vars.misc_edgeKey", type: "int", desc: "Edge jump key (note the capital K — inconsistent with the others)" },
    { name: "Vars.misc_longjump", type: "bool", desc: "Long jump enabled" },
    { name: "Vars.misc_longjump_key", type: "int", desc: "Long jump key" },
    { name: "Vars.misc_jumpbug", type: "bool", desc: "Jump bug enabled" },
    { name: "Vars.misc_jumpbug_key", type: "int", desc: "Jump bug key" },
    { name: "Vars.misc_edgebug", type: "bool", desc: "Edge bug enabled" },
    { name: "Vars.misc_edgebug_key", type: "int", desc: "Edge bug key" },
    { name: "Vars.color_chams_enemy_visible", type: "color", desc: "Enemy visible chams color (read/write via GetColor/SetColor)" }
  ],

  classIds: [
    { id: 40, desc: "Player (CCSPlayer)" },
    { id: 129, desc: "Planted C4" },
    { id: 69, desc: "Checked in one script alongside dynamic-light/tonemap-controller-like entities — unconfirmed, treat as approximate." }
  ]
};
