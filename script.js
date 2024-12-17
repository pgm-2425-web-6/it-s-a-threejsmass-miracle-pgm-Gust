const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let snowParticles;
const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
});

function createSnow() {
    snowParticles = new THREE.BufferGeometry();

    const snowCount = 10000;
    const positions = [];

    for (let i = 0; i < snowCount; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 100 + 1;
        const z = Math.random() * 1000 - 500;
        positions.push(x, y, z);
    }

    snowParticles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const snow = new THREE.Points(snowParticles, snowMaterial);
    scene.add(snow);
}

const loader = new THREE.GLTFLoader();
loader.load('./festive_world_-_minecraft.glb', function (gltf) {
    scene.add(gltf.scene);

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    camera.position.set(center.x, center.y + size.y, center.z + size.z * 2);
    camera.lookAt(center);

    createSnow();
    animate();
}, undefined, function (error) {
    console.error(error);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const backgroundTexture = new THREE.TextureLoader().load('./background.png');
scene.background = backgroundTexture;

function animate() {
    requestAnimationFrame(animate);

    if (snowParticles) {
        const positions = snowParticles.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.1;
            if (positions[i + 1] < 0) positions[i + 1] = Math.random() * 200 + 100;
        }

        snowParticles.attributes.position.needsUpdate = true;
    }

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
