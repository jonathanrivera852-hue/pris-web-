import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';


// =====================================================
// ESCENA THREE.JS
// =====================================================

const container = document.querySelector('#scene');

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
  0x090011,
  0.018
);


// =====================================================
// CÁMARA
// =====================================================

const camera = new THREE.PerspectiveCamera(
  58,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

camera.position.set(0, 0, 23);


// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

container.appendChild(renderer.domElement);


// =====================================================
// CONTROLES
// =====================================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 6;
controls.maxDistance = 42;

controls.enablePan = false;


// =====================================================
// GRUPOS
// =====================================================

const galaxy = new THREE.Group();
const photosG = new THREE.Group();

scene.add(galaxy);
scene.add(photosG);


// =====================================================
// ESTRELLAS
// =====================================================

const starGeo = new THREE.BufferGeometry();

const starCount = 1800;

const starPositions = new Float32Array(
  starCount * 3
);

const starColors = new Float32Array(
  starCount * 3
);

for (let i = 0; i < starCount; i++) {

  const r = 4 + Math.random() * 35;

  const a = Math.random() * Math.PI * 2;

  const z = (Math.random() - 0.5) * 12;

  starPositions[i * 3] =
    Math.cos(a) * r;

  starPositions[i * 3 + 1] =
    Math.sin(a) * r * 0.55;

  starPositions[i * 3 + 2] = z;

  const c = new THREE.Color().setHSL(
    0.72 + Math.random() * 0.14,
    0.8,
    0.55 + Math.random() * 0.3
  );

  starColors[i * 3] = c.r;
  starColors[i * 3 + 1] = c.g;
  starColors[i * 3 + 2] = c.b;
}

starGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(
    starPositions,
    3
  )
);

starGeo.setAttribute(
  'color',
  new THREE.BufferAttribute(
    starColors,
    3
  )
);

const starMaterial = new THREE.PointsMaterial({
  size: 0.09,
  vertexColors: true,
  transparent: true,
  opacity: 0.9
});

galaxy.add(
  new THREE.Points(
    starGeo,
    starMaterial
  )
);


// =====================================================
// ESPIRAL DE LA GALAXIA
// =====================================================

const spiralGeo = new THREE.BufferGeometry();

const spiralCount = 2400;

const spiralPositions = new Float32Array(
  spiralCount * 3
);

const spiralColors = new Float32Array(
  spiralCount * 3
);

for (let i = 0; i < spiralCount; i++) {

  const arm = i % 3;

  const r =
    Math.pow(Math.random(), 0.65) * 20;

  const a =
    arm * 2.094 +
    r * 0.8 +
    (Math.random() - 0.5) * 0.8;

  spiralPositions[i * 3] =
    Math.cos(a) * r;

  spiralPositions[i * 3 + 1] =
    Math.sin(a) * r * 0.45;

  spiralPositions[i * 3 + 2] =
    (Math.random() - 0.5) *
    (1.4 + r * 0.08);

  const c = new THREE.Color().setHSL(
    0.74 + (Math.random() - 0.5) * 0.08,
    0.85,
    0.45 + Math.random() * 0.3
  );

  spiralColors[i * 3] = c.r;
  spiralColors[i * 3 + 1] = c.g;
  spiralColors[i * 3 + 2] = c.b;
}

spiralGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(
    spiralPositions,
    3
  )
);

spiralGeo.setAttribute(
  'color',
  new THREE.BufferAttribute(
    spiralColors,
    3
  )
);

const spiralMaterial =
  new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

galaxy.add(
  new THREE.Points(
    spiralGeo,
    spiralMaterial
  )
);


// =====================================================
// FRASES DE AMOR
// =====================================================

const love = [
  'Te amo',
  'Mi cielo',
  'Mi princesa',
  'Eres mi universo',
  'Siempre tú',
  'Mi persona favorita',
  'Te adoro',
  'Mi vida',
  'Contigo todo',
  'Qué suerte tenerte',
  'Cielo bello',
  'Para siempre'
];

const sprites = [];

function textSprite(text) {

  const canvas =
    document.createElement('canvas');

  canvas.width = 512;
  canvas.height = 128;

  const ctx =
    canvas.getContext('2d');

  ctx.font =
    '700 34px Arial';

  ctx.textAlign = 'center';

  ctx.textBaseline = 'middle';

  ctx.shadowColor = '#a64dff';

  ctx.shadowBlur = 18;

  ctx.fillStyle = '#f3dcff';

  ctx.fillText(
    text,
    256,
    64
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  const sprite =
    new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      })
    );

  sprite.scale.set(
    4.2,
    1.05,
    1
  );

  return sprite;
}

for (let i = 0; i < love.length; i++) {

  const sprite =
    textSprite(love[i]);

  const angle =
    i / love.length *
    Math.PI * 2;

  sprite.position.set(
    Math.cos(angle) * 10,
    Math.sin(angle) * 5,
    (Math.random() - 0.5) * 8
  );

  scene.add(sprite);

  sprites.push(sprite);
}


// =====================================================
// FOTOS
// =====================================================

let photos = [];

try {

  const response =
    await fetch('./photos.json');

  if (!response.ok) {
    throw new Error(
      'No se pudo cargar photos.json'
    );
  }

  photos = await response.json();

} catch (error) {

  console.error(
    'Error cargando photos.json:',
    error
  );

  photos = [];
}


const loader =
  new THREE.TextureLoader();

const items = [];


// =====================================================
// CREAR FOTOS
// =====================================================

photos.forEach((url, i) => {

  loader.load(
    url,

    texture => {

      texture.colorSpace =
        THREE.SRGBColorSpace;

      const ratio =
        texture.image.width /
        texture.image.height;

      const height = 2.15;

      const width =
        height * ratio;

      const geometry =
        new THREE.PlaneGeometry(
          width,
          height
        );

      const material =
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      const total =
        Math.max(photos.length, 1);

      const angle =
        i / total *
        Math.PI * 2 * 3;

      const radius =
        5 + (i % 7) * 1.45;

      const target =
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.52,
          (i % 9 - 4) * 1.2
        );

      mesh.position.copy(
        target
      );

      mesh.lookAt(0, 0, 0);

      photosG.add(mesh);

      items.push({
        mesh: mesh
      });

    },

    undefined,

    error => {

      console.error(
        'No se pudo cargar la foto:',
        url,
        error
      );

    }
  );

});


// =====================================================
// FRASES CAMBIANTES
// =====================================================

const loveEl =
  document.querySelector('#love');

let loveIndex = 0;

setInterval(() => {

  if (!loveEl) return;

  loveEl.textContent =
    love[
      loveIndex++ %
      love.length
    ] + ' ✨';

}, 2600);


// =====================================================
// ANIMACIÓN
// =====================================================

function animate() {

  requestAnimationFrame(
    animate
  );

  controls.update();

  items.forEach(item => {

    item.mesh.lookAt(
      camera.position
    );

  });

  galaxy.rotation.z += 0.0009;

  renderer.render(
    scene,
    camera
  );

}

animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


