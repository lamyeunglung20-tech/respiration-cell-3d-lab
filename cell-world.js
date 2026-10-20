import * as THREE from './vendor/three.module.js';

// A schematic animal-cell model. Molecule tokens and moving particles show ideas,
// rather than the actual shapes, scale, or count of molecules.
export class CellWorld {
  constructor(canvas) {
    this.canvas = canvas;
    this.available = false;
    this.disposed = false;
    this.paused = false;
    this.elapsed = 0;
    this.previousFrame = null;
    this.state = { glucose: false, oxygen: false, carbon: false, water: false, where: false, time: false, energy: false };
    this.pointers = new Map();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.setClearColor(0xe9eeeb, 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.13;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(38, 1, .1, 50);
      this.target = new THREE.Vector3(0, -.15, 0);
      this.azimuth = .20;
      this.elevation = .16;
      this.distance = 10;

      this.scene.add(new THREE.HemisphereLight(0xffffff, 0xa4a59a, 2.4));
      const key = new THREE.DirectionalLight(0xffffff, 3.5);
      key.position.set(-3, 6, 7);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, { left:-7, right:7, top:7, bottom:-7, near:1, far:25 });
      this.scene.add(key);
      const rim = new THREE.DirectionalLight(0xffe1d5, 1.5);
      rim.position.set(5, 2, -4);
      this.scene.add(rim);

      this.build();
      this.bind();
      this.resize();
      this.available = true;
      this.loop = this.loop.bind(this);
      this.frame = requestAnimationFrame(this.loop);
    } catch (error) {
      console.warn('3D cell model unavailable; showing diagram.', error);
      this.renderer?.dispose();
      this.available = false;
    }
  }

  mat(color, key = null, options = {}) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: .58, metalness: .04, ...options });
    material.userData.unlock = key;
    return material;
  }

  mesh(geometry, material, parent = this.scene) {
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  sphere(position, radius, material, parent = this.scene, scale = null) {
    const object = this.mesh(new THREE.SphereGeometry(radius, 28, 20), material, parent);
    object.position.set(...position);
    if (scale) object.scale.set(...scale);
    return object;
  }

  tube(points, radius, material, parent = this.scene) {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    return this.mesh(new THREE.TubeGeometry(curve, 30, radius, 7, false), material, parent);
  }

  build() {
    const teal = this.mat(0xf4cdd9, 'where', { roughness: .92 });
    const membrane = this.mat(0xd894aa, 'where', { metalness: 0, roughness: .75 });
    const lavender = this.mat(0xa98fc4, 'where', { roughness: .72 });
    const lavenderDark = this.mat(0x695b9c, 'where');
    const organelle = this.mat(0xd9abc0, 'where');
    const organelleLight = this.mat(0xf6dce3, 'where');
    const orange = this.mat(0xeaa66b, 'energy', { emissive: 0x7f3514, emissiveIntensity: .08, roughness: .35 });
    const orangeDark = this.mat(0xb5654c, 'energy');
    const orangeLight = this.mat(0xffd49b, 'energy', { emissive: 0x9c572e, emissiveIntensity: .1 });
    const glucoseMat = this.mat(0xe7ac57, 'glucose', { emissive: 0xaa682a, emissiveIntensity: .12 });
    const oxygenMat = this.mat(0x60b5ca, 'oxygen', { emissive: 0x277890, emissiveIntensity: .12 });
    const carbonMat = this.mat(0xc18c8e, 'carbon', { emissive: 0x874953, emissiveIntensity: .08 });
    const waterMat = this.mat(0x7aaed1, 'water', { emissive: 0x336c9d, emissiveIntensity: .08 });
    const energyMat = this.mat(0xffcf74, 'energy', { emissive: 0xffab44, emissiveIntensity: .65 });
    const dayMat = this.mat(0xf5c36e, 'time', { emissive: 0xe9a94f, emissiveIntensity: .35 });
    const nightMat = this.mat(0x9daed2, 'time', { emissive: 0x5a6b9f, emissiveIntensity: .15 });

    this.cell = new THREE.Group();
    this.scene.add(this.cell);
    // A softly bevelled irregular animal cell, built as a solid diorama.
    const shape = new THREE.Shape();
    shape.moveTo(-2.15, -.32);
    shape.bezierCurveTo(-2.42,-.61,-2.10,-1.27,-1.46,-1.38);
    shape.bezierCurveTo(-.92,-1.66,-.52,-1.40,-.12,-1.54);
    shape.bezierCurveTo(.48,-1.76,.88,-1.38,1.34,-1.28);
    shape.bezierCurveTo(1.94,-1.23,2.29,-.76,2.19,-.25);
    shape.bezierCurveTo(2.58,.31,2.06,.77,1.49,.75);
    shape.bezierCurveTo(.93,1.16,.62,1.55,.04,1.33);
    shape.bezierCurveTo(-.39,1.53-.88,1.31-1.25,1.03);
    shape.bezierCurveTo(-1.89,.88,-2.30,.41,-2.15,-.32);
    const body = this.mesh(new THREE.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:true,bevelThickness:.18,bevelSize:.16,bevelSegments:4,steps:1,curveSegments:8}),teal,this.cell);
    body.position.z=-.46;
    const outline = shape.getPoints(110).map(p=>[p.x,p.y,.01]);
    this.tube(outline,.033,membrane,this.cell);
    const base = this.mesh(new THREE.CircleGeometry(4.35,72),this.mat(0xe7e6d9));
    base.rotation.x=-Math.PI/2; base.position.y=-2.28;
    const plinth = this.mesh(new THREE.CylinderGeometry(3.25,3.4,.18,64),this.mat(0xeee7d8));
    plinth.scale.z=.62; plinth.position.y=-2.18;
    const support = this.mesh(new THREE.CylinderGeometry(.07,.11,.5,16),this.mat(0xd7c7ba));
    support.position.set(0,-1.91,-.24);

    // Nucleus and nucleolus.
    this.sphere([-.81, .36, .30], .60, lavender, this.cell, [1, .92, .69]);
    this.sphere([-.64, .40, .69], .18, lavenderDark, this.cell, [1, .9, .45]);
    const nucleusRing = this.mesh(new THREE.TorusGeometry(.56, .028, 8, 44), lavenderDark, this.cell);
    nucleusRing.position.set(-.81, .36, .71);
    nucleusRing.scale.y = .92;

    // Folded endoplasmic reticulum and small ribosomes.
    for (let i = 0; i < 4; i++) {
      const y = .78 - i * .17;
      this.tube([[-1.75, y, .26], [-1.55, y + .11, .38], [-1.3, y - .04, .45], [-1.12, y + .08, .48]], .038, organelle, this.cell);
    }
    for (let i = 0; i < 16; i++) {
      const angle = i * 2.399;
      const r = .98 + (i % 4) * .23;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * .71;
      if (x > -.1 && x < 1.48 && y > -.9 && y < .48) continue;
      this.sphere([x, y, .20 + (i % 3) * .04], .035, organelleLight, this.cell);
    }
    // A small stack of Golgi sacs gives the cell recognisable depth.
    for (let i = 0; i < 4; i++) {
      const y = -.72 - i * .11;
      this.tube([[.05, y, .21], [.24, y - .05, .34], [.47, y + .03, .38], [.65, y + .02, .31]], .036, organelle, this.cell);
    }

    this.mitoMain = this.makeMito([.82, -.12, .60], 1, orange, orangeDark, orangeLight);
    this.mitoSmall = this.makeMito([-.72, -.85, .19], .47, orange, orangeDark, orangeLight);

    // Schematic molecules around the cell, each with its own unlock colour.
    this.glucose = this.hexToken([-2.85, .88, .73], .27, glucoseMat);
    this.oxygen = this.diatomic([-2.84, -.94, .69], oxygenMat);
    this.carbon = this.triatomic([2.85, .86, .65], carbonMat);
    this.water = this.waterToken([2.84, -.98, .69], waterMat);

    // A day-night orbit is a reminder that respiration is continuous.
    this.timeRing = new THREE.Group();
    this.scene.add(this.timeRing);
    const orbit = this.mesh(new THREE.TorusGeometry(2.78, .016, 6, 96), this.mat(0xc3d2c8, 'time', { transparent: true, opacity: .58 }), this.timeRing);
    orbit.scale.y = .76;
    this.sphere([0, 2.12, 0], .15, dayMat, this.timeRing);
    this.sphere([0, -2.12, 0], .115, nightMat, this.timeRing);

    this.paths = {
      glucose: new THREE.CatmullRomCurve3([[-3.12, .9, .8], [-2.2, .78, .75], [-1.2, .40, .83], [.05, .02, 1.02], [.75, -.10, 1.08]].map(p => new THREE.Vector3(...p))),
      oxygen: new THREE.CatmullRomCurve3([[-3.05, -.94, .8], [-2.2, -.72, .78], [-1.17, -.51, .94], [.04, -.33, 1.05], [.75, -.11, 1.09]].map(p => new THREE.Vector3(...p))),
      carbon: new THREE.CatmullRomCurve3([[1.05, -.10, 1.08], [1.5, .18, .98], [2.15, .5, .83], [3.14, .86, .8]].map(p => new THREE.Vector3(...p))),
      water: new THREE.CatmullRomCurve3([[1.05, -.19, 1.08], [1.7, -.43, .96], [2.3, -.76, .85], [3.11, -1.0, .8]].map(p => new THREE.Vector3(...p)))
    };
    this.flows = {};
    for (const [name, material] of Object.entries({ glucose: glucoseMat, oxygen: oxygenMat, carbon: carbonMat, water: waterMat })) {
      const group = new THREE.Group();
      this.scene.add(group);
      for (let i = 0; i < 8; i++) this.sphere([0, 0, 0], .047, material, group);
      this.flows[name] = group;
    }
    this.sparks = new THREE.Group();
    this.scene.add(this.sparks);
    for (let i = 0; i < 14; i++) this.sphere([0, 0, 0], .052, energyMat, this.sparks);
    this.energyStar = new THREE.Group(); this.energyStar.position.set(.73,2.05,.38); this.scene.add(this.energyStar);
    const starShape = new THREE.Shape();
    for(let i=0;i<20;i++){const a=i*Math.PI/10,r=i%2?.40:.50;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)starShape.moveTo(x,y);else starShape.lineTo(x,y);}
    starShape.closePath();
    this.mesh(new THREE.ExtrudeGeometry(starShape,{depth:.12,bevelEnabled:true,bevelThickness:.035,bevelSize:.03,bevelSegments:2}),energyMat,this.energyStar);

    const materials = new Set();
    this.scene.traverse(object => {
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    this.palette = [...materials].map(material => ({
      material,
      key: material.userData.unlock,
      color: material.color.clone(),
      emissive: material.emissive.clone(),
      intensity: material.emissiveIntensity
    }));
    this.setState(this.state);
  }

  makeMito(position, scale, body, border, fold) {
    const group = new THREE.Group();
    group.position.set(...position);
    group.scale.setScalar(scale);
    group.rotation.z = -.26;
    this.cell.add(group);
    this.sphere([0, 0, 0], .75, body, group, [1.28, .58, .5]);
    const rim = this.mesh(new THREE.TorusGeometry(.73, .035, 8, 48), border, group);
    rim.scale.x = 1.27;
    rim.scale.y = .6;
    rim.position.z = .37;
    for (let i = 0; i < 5; i++) {
      const x = -.59 + i * .29;
      this.tube([[x, -.30, .39], [x + .10, -.12, .42], [x - .04, .11, .45], [x + .08, .29, .42]], .028, fold, group);
    }
    return group;
  }

  hexToken(position, radius, material) {
    const group = new THREE.Group();
    group.position.set(...position);
    this.scene.add(group);
    const points = [];
    for (let i = 0; i <= 6; i++) {
      const angle = i * Math.PI / 3;
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
    }
    this.tube(points, .047, material, group);
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      this.sphere([Math.cos(angle) * radius, Math.sin(angle) * radius, 0], .07, material, group);
    }
    return group;
  }

  diatomic(position, material) {
    const group = new THREE.Group();
    group.position.set(...position);
    this.scene.add(group);
    this.sphere([-.13, 0, 0], .15, material, group);
    this.sphere([.13, 0, 0], .15, material, group);
    return group;
  }

  triatomic(position, material) {
    const group = new THREE.Group();
    group.position.set(...position);
    this.scene.add(group);
    this.sphere([0, 0, 0], .15, material, group);
    this.sphere([-.24, 0, 0], .10, material, group);
    this.sphere([.24, 0, 0], .10, material, group);
    return group;
  }

  waterToken(position, material) {
    const group = new THREE.Group();
    group.position.set(...position);
    this.scene.add(group);
    this.sphere([0, .04, 0], .16, material, group);
    this.sphere([-.15, -.10, 0], .085, material, group);
    this.sphere([.15, -.10, 0], .085, material, group);
    return group;
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    if (!this.scene) return;
    this.palette.forEach(({ material, key, color, emissive, intensity }) => {
      if (key && this.state[key]) {
        material.color.copy(color);
        material.emissive.copy(emissive);
        material.emissiveIntensity = intensity;
      } else {
        const grey = .27 + (color.r * .21 + color.g * .72 + color.b * .07) * .44;
        material.color.setRGB(grey, grey, grey);
        material.emissive.setHex(0);
        material.emissiveIntensity = 0;
      }
    });
    this.timeRing.visible = this.state.time;
    this.sparks.visible = this.state.energy;
    this.energyStar.visible = this.state.energy;
    for (const [name, group] of Object.entries(this.flows)) {
      group.visible = this.state[name];
    }
  }

  setPaused(value) { this.paused = value; }

  loop(now) {
    if (this.disposed) return;
    const dt = this.previousFrame === null ? 0 : Math.min(.05, (now - this.previousFrame) / 1000);
    this.previousFrame = now;
    if (!this.paused && !this.reducedMotion) this.elapsed += dt;
    const t = this.elapsed;
    for (const [name, group] of Object.entries(this.flows)) {
      if (!group.visible) continue;
      group.children.forEach((particle, index) => {
        const phase = (t * .20 + index / group.children.length) % 1;
        particle.position.copy(this.paths[name].getPoint(phase));
        particle.scale.setScalar(.55 + Math.sin(phase * Math.PI) * .55);
      });
    }
    if (this.state.energy) {
      this.sparks.children.forEach((spark, index) => {
        const phase = (t * .36 + index / this.sparks.children.length) % 1;
        const spread = Math.sin(index * 2.399) * .28;
        spark.position.set(.82 + spread * phase, -.12 + phase * 2.14, 1.12 - phase * .2);
        spark.scale.setScalar((1 - phase) * .9 + .15);
      });
      this.mitoMain.scale.setScalar(1 + Math.sin(t * 2.1) * .025);
      this.energyStar.rotation.z = Math.sin(t * .8) * .06;
    } else this.mitoMain.scale.setScalar(1);
    if (this.state.time) this.timeRing.rotation.z = t * .18;
    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.loop);
  }

  updateCamera() {
    const d = this.distance;
    this.camera.position.set(Math.sin(this.azimuth) * d * Math.cos(this.elevation), Math.sin(this.elevation) * d, Math.cos(this.azimuth) * d * Math.cos(this.elevation));
    this.camera.lookAt(this.target);
  }

  resetCamera() {
    this.azimuth = .20;
    this.elevation = .16;
    this.distance = this.baseDistance || 10;
    this.updateCamera();
  }

  resize() {
    if (!this.renderer) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.baseDistance = Math.max(width / height > 1.9 ? 7.4 : 9.6, 6.85 / (2 * Math.tan(THREE.MathUtils.degToRad(19)) * this.camera.aspect));
    this.distance = this.baseDistance;
    this.camera.updateProjectionMatrix();
    this.updateCamera();
  }

  bind() {
    const onDown = event => {
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      this.canvas.setPointerCapture(event.pointerId);
      this.pinch = null;
    };
    const onMove = event => {
      const previous = this.pointers.get(event.pointerId);
      if (!previous) return;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.pointers.size === 1) {
        this.azimuth = THREE.MathUtils.clamp(this.azimuth + dx * .007, -1.05, 1.05);
        this.elevation = THREE.MathUtils.clamp(this.elevation + dy * .004, -.43, .43);
      } else {
        const points = [...this.pointers.values()];
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        if (this.pinch) this.distance = THREE.MathUtils.clamp(this.distance * this.pinch / distance, this.baseDistance * .82, this.baseDistance * 1.28);
        this.pinch = distance;
      }
      this.updateCamera();
    };
    const onUp = event => { this.pointers.delete(event.pointerId); this.pinch = null; };
    this.handlers = { onDown, onMove, onUp };
    this.canvas.addEventListener('pointerdown', onDown);
    this.canvas.addEventListener('pointermove', onMove);
    this.canvas.addEventListener('pointerup', onUp);
    this.canvas.addEventListener('pointercancel', onUp);
    this.canvas.style.touchAction = 'none';
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.canvas);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    if (this.handlers) {
      this.canvas.removeEventListener('pointerdown', this.handlers.onDown);
      this.canvas.removeEventListener('pointermove', this.handlers.onMove);
      this.canvas.removeEventListener('pointerup', this.handlers.onUp);
      this.canvas.removeEventListener('pointercancel', this.handlers.onUp);
    }
    const materials = new Set();
    this.scene?.traverse(object => {
      object.geometry?.dispose();
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    materials.forEach(material => material.dispose());
    this.renderer?.dispose();
    this.pointers.clear();
  }
}
