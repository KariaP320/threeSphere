import * as THREE from 'three';
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// Scene (the screen/what is happening on screen)
const scene = new THREE.Scene()

// create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
// 3 is the size, 64 and 64 are the segments. We got width segments and weight segments, altering those will change the shape of the geometric item. 64 64 makes it a sphere. Geometry is a colorless shape, a material is required for it to look how we desire. Final step, merging shape and appearance using mesh.

// this is the appearance of the shape,it's called material.
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff83,
})

// this merges geometric shape and appearance we created (material), it's called mesh.
const mesh = new THREE.Mesh(geometry, material)

// the next step is to add the shape which now has an appearance to the scene, it won't be visible on the page yet because we must do something else.
scene.add(mesh)

// Now we'll make it full screen
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// light set for the camera 
const light = new THREE.PointLight(0xffffff, 100, 100) // the first 100 is brightness
light.position.set(0, 10, 10) // the shadow or light XYZ position
scene.add(light)

// now we need to add a camera, the camera mirrors the eyes of the client. What someone see in the page is based on what the camera that we set sees.
const camera = new THREE.PerspectiveCamera(
  45, sizes.width / sizes.height, 0.1, 100
)
// The first value is the field of view, how much the camera can see, the perspective is like an angle and 45 is always suggested. More than that creates distortion, the fish eye effect
// The second and third value are the aspect ratio of the camera (800 / 600, but now it's set to sizes.width because we're making the geometryic shape fullscreen)
// 0.1 is how near the camera can be and 100 is how far instead.

// camera position determines how near we are to the shape
camera.position.z = 20

// Now we have to add the camera or field of vision, to the scene
scene.add(camera)

// There's one last step before we can see it, rendering the scene on the screen. Let's go create a <canvas> in index.html with a class, we called it 'webgl'.

// Renderer, we selected the class of the canvas inside the index.html et cetera
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas })

// we need to define how big our canvas is and where to render it in the page
renderer.setSize(sizes.width, sizes.height) // same size as the camera aspect ratio

// let's render the renderer which is just a const now
renderer.render(scene, camera)
renderer.setPixelRatio(2); // higher quality shape

// Controls (this step comes later, after the loops)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // the control is also based on the speed of moving it around
controls.enablePan = false
controls.enableZoom = false 
// now it's impossible to drag the shape or zoom 
controls.autoRotate = true //self-explanatory
controls.autoRotateSpeed = 5 //self-explanatory

// Now it works, next we'll do the resizing. ReminderL light was added after camera because i forgot but i wrote it before camera, the comments might be a bit messy

// Resize (runs when the window gets resized)

window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update() // after we let go, it moves a bit (check //controls)
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

// the loop and camera.updateProjectionMatrix() stopped the shape from being squished everu time the window is resized

// now, let's make it so we can move it around, we imported OrbitControls for that, gsap was necessary for this reason. I'm adding the controls before the renderer

// Timeline
const tl = gsap.timeline({default: {duration: 1}}) //syncs animations together
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1}) // animate position from one to another. First xyz is the from
tl.fromTo('nav', {y:'-100%'}, {y:'0%'}) // nav movement
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

// Mouse Animation Color
// color changes when mouse is down and i'm moving the sphere

let mouseDown = false
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true)) // it becomes true when i click the screen and keep holding
window.addEventListener('mouseup', () => (mouseDown = false)) // opposite
window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255), //horiziontal click goes from 0 to 255, the rgb colors maximum
      Math.round((e.pageY / sizes.height) * 255), //vertical click goes from 0 to 255, the rgb colors maximum
      150, // blue
    ]

    // Animate it (random colors)
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
})