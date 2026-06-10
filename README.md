## Development

### Reloading the presets in JOSM

For development, you will obviously want to test changes you made to the presets in JOSM. However, JOSM [doesn't support](https://josm.openstreetmap.de/ticket/8933) force-reloading presets. You are [supposed to](https://josm.openstreetmap.de/wiki/Presets#UpdatingAvailablepresetsinJOSM) manually delete the cache and then restart JOSM.

Instead, I start a local web server and append a cache-buster parameter to the URL (e.g. `https://localhost:5500/out/id-presets.xml?cachebuster=1`). This way, I only need to increment the parameter in the preset settings whenever I want to reload (though note that this will pollute your cache folder quite a bit).
