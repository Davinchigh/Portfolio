# Reconstruction references (not published)

Structure
- Footprint: Esri World Imagery, zoom 19, around 5.6353, -0.1881 (OSM relation 5288832, "Jean Nelson Aka Hall").
  Measured ring block ~157 x 79 m, long axis bearing ~151 degrees, wings ~14 m deep, 4 storeys, hipped clay-tile roof.
- The four diaspora halls (Limann, Kwapong, Sey, Jean Nelson) share one design, so their photos fill gaps.

Photos used as modelling reference only (UGEL project pages; not copied into the site)
- ugel.com.gh/project/jean-nelson-aka-hall/: entrance tower, porter's lodge counter, courtyard with basketball court and kiosk gazebo
- ugel.com.gh/project/elizabeth-frances-sey-hall/: entrance, lobby with glass doors and wooden counter, outer facade, night view
- ugel.com.gh/project/hilla-liman-hall/ and /kwapong/: staircase, courtyard fountain bed with radial paths, raised stone-faced court with steps, kiosks
- ug.edu.gh (2024): Rose Aka Conference Room door

Assets
- CC0 textures, sky HDRI and models from Poly Haven (painted_plaster_wall, clay_roof_tiles_02, brick_floor_02, concrete,
  leafy_grass, brown_planks_05, kloofendal_48d_partly_cloudy_puresky, island_tree_01). Fetched at build time, not committed.

Still needed from residents: room interior, reading room, the mart and shops, block names, a rough floor plan.

## Interiors (lab/interiors.js, ?v=room|reading|corridor|shop|mart|restaurant|stairs)
- Student room: resident photo (yellow/white metal bunks, blue curtains, louvre window, AC, wall shelves, cream tiles) and Elizabeth Sey "Living Spaces" photo.
- Reading room: resident photo (dark wood carrels, louvres, curtains, fans, fluorescent tubes, AC, beam).
- Corridor: resident video (cream walls, beige tiles, wooden doors in dark frames, round ceiling lights).
- Shops: resident photos (Ultimate Unisex Salon with collapsible grille; foodstuff shops as room units; laundry).
- Mart: Elizabeth Sey "Hermano's inn" photo (drinks fridges, stocked shelves, TV). Two marts per the resident: 2nd floor at the top of the entrance stairs, and at the opposite far end.
- Restaurant: resident photo; at the bottom far corner, left down the hallway from the entrance.
- Stairs: Hilla Limann stair photo and breeze-block stair towers.

## Exterior pass 5
- Balconies on both faces, built out with fins and slabs so they cast real shadows (resident courtyard and forecourt photos).
- Courtyard: grey 40 cm tile walkways with kerbs, teal volleyball court with net (north) and teal basketball court (south), central round bed, gazebo, laundry racks.
- Forecourt: planted islands with white kerbs, grey pavers, asphalt road, cars and taxis.
- Trees are now procedural (flamboyant and shade trees from instanced leaf cards); the 60 MB glTF tree is no longer loaded.

## Pass 6: context, dusk, and the photoreal plates
- Context: the neighbouring diaspora halls (Elizabeth Sey, Alexander Kwapong) are placed from the satellite image; the ground beyond the site is draped satellite imagery (Esri World Imagery, kept out of this repo: put the 1792 px crop at `lab/tex/sat.jpg` and a bush crop at `lab/tex/bush.jpg`).
- Lighting modes: `?t=day` (default), `?t=dusk` (Poly Haven belfast_sunset_puresky, lit windows), `?t=overcast` (kloofendal_overcast_puresky).
- Render: `OUT=. DSF=1.5 node lab/render.js "entrance&t=dusk",court,aerial` with the lab served on port 3040.
- Photoreal plates in `public/plates/`: each is a render from this model passed through Higgsfield `nano_banana_2_1` (1k, image reference = the render) with a prompt that lists the geometry to keep and asks for real materials, light and lived-in detail, no text, no logos, no people, no added or removed storeys. Upscaled 2x locally (Lanczos + light unsharp). `entrance-front.webp` is the entrance plate with the sky cut away (flood-fill sky mask) so the headline can sit behind the roofline.
- They are labelled on the site as AI-enhanced renders of a reconstruction, not photographs. The aerial's distant surroundings are invented by the model.
