# Echo Orb Collector — Simple Three.js Game

## Using your own Blender character

1. **Export from Blender**
   - Select your character (and any armature/meshes).
   - **File → Export → glTF 2.0 (.glb/.gltf)**.
   - Choose **GLB** (single file) or **GLTF** (folder + .bin).
   - Under **Include**, leave “Selected Objects” if only the character is selected.
   - Under **Transform**, use **+Y Up** (default; matches Three.js).
   - Export.

2. **Put the file in the project**
   - Create a `models` folder here and put your file in it, e.g.  
     `threejs-game/models/character.glb`

3. **Set the path in the game**
   - In `index.html`, find:
     ```js
     const PLAYER_MODEL_PATH = 'models/character.glb';
     ```
   - Change `'models/character.glb'` to your file path (e.g. `'models/myhero.glb'`).

4. **Adjust scale and position**
   - In the same file, in the `gltfLoader.load(..., (gltf) => { ... })` callback:
     - **Scale:** if the model is too big or small, change:
       ```js
       model.scale.setScalar(1);   // try 0.5, 2, etc.
       ```
     - **Feet on ground:** if the character floats or sinks, set a Y offset:
       ```js
       model.position.y = -0.9;   // move down so feet touch ground
       ```
   - Blender’s origin (pivot) should be at the feet or center of the character for best results.

## How to play

- **WASD** — move  
- **Mouse** — look around (click the game to lock the pointer)  
- **Goal** — collect all 8 echo orbs  

## Run locally

**⚠️ IMPORTANT:** You **must** use a local server. Opening `index.html` directly won't work due to browser security (CORS).

### Option 1: Python (simplest)
```bash
python3 server.py
# Open http://localhost:8000
```

### Option 2: Python built-in
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

### Option 3: Node.js (npx)
```bash
npx serve . -p 3000
# Open http://localhost:3000
```

Then click the game and move with WASD.
