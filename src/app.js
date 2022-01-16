import './style.scss'
import * as THREE from 'three'

import { gsap } from 'gsap'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const textureLoader = new THREE.TextureLoader()

const canvas = document.querySelector('canvas.webgl')


import vertexShader from './shaders/vertex.glsl'

import fireFrag from './shaders/fireFrag.glsl'

import eyesFrag from './shaders/eyesFrag.glsl'

import screenFrag from './shaders/screenFrag.glsl'

import thoughtFrag from './shaders/thoughtFrag.glsl'

const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0xffffff )
const loadingBarElement = document.querySelector('.loading-bar')
const loadingBarText = document.querySelector('.loading-bar-text')
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () =>{
    window.setTimeout(() =>{
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''

      loadingBarText.classList.add('fade-out')

    }, 500)
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) =>{
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`

  }
)

const gtlfLoader = new GLTFLoader(loadingManager)

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  uniforms:
    {
      uAlpha: { value: 1 }
    },
  transparent: true,
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
  uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


const fireMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fireFrag,
  side: THREE.DoubleSide
})

const eyesMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: eyesFrag,
  side: THREE.DoubleSide
})


const screenMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: screenFrag,
  side: THREE.DoubleSide
})


const thoughtMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: thoughtFrag,
  side: THREE.DoubleSide
})



const bakedTexture = textureLoader.load('bake.jpg')


bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})



let sceneGroup, fire, eyes, screenM, thought,  church
gtlfLoader.load(
  'burnout.glb',
  (gltf) => {
    gltf.scene.scale.set(4.5,4.5,4.5)
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    sceneGroup.position.y -= 3
    scene.add(sceneGroup)


    church = gltf.scene.children.find((child) => {
      return child.name === 'Cube'
    })


    fire = gltf.scene.children.find((child) => {
      return child.name === 'fire'
    })

    eyes = gltf.scene.children.find((child) => {
      return child.name === 'eyes'
    })

    screenM = gltf.scene.children.find((child) => {
      return child.name === 'screen'
    })

   thought = gltf.scene.children.find((child) => {
      return child.name === 'thought'
    })



    fire.needsUpdate = true

    fire.material = fireMaterial
    eyes.material = eyesMaterial
    screenM.material = screenMaterial
    thought.material = thoughtMaterial


    church.material = bakedMaterial

  }
)


// gtlfLoader.load(
//   'birds.glb',
//   (gltf) => {
//
//     gltf.scene.scale.set(5.5,5.5,5.5)
//     sceneGroup = gltf.scene
//     sceneGroup.needsUpdate = true
//     sceneGroup.position.z -= 15
//     sceneGroup.position.y -= 3
//     sceneGroup.position.x += 6
//     scene.add(sceneGroup)
//
//     if(gltf.animations[0]){
//       mixer = new THREE.AnimationMixer(gltf.scene)
//
//       const action2 = mixer.clipAction(gltf.animations[1])
//
//       action2.play()
//
//     }
//
//
//   }
// )


// const light = new THREE.AmbientLight( 0x404040 )
// scene.add( light )
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
// scene.add( directionalLight )

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = -10
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
//controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 1)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()







const clock = new THREE.Clock()

const tick = () =>{

  const elapsedTime = clock.getElapsedTime()


  // Update controls
  controls.update()

  fireMaterial.uniforms.uTime.value = elapsedTime
  fireMaterial.needsUpdate=true
  // window1Material.fragmentShader = fragArray[selectedArray[0]]
  //
  eyesMaterial.uniforms.uTime.value = elapsedTime
  eyesMaterial.needsUpdate=true


  screenMaterial.uniforms.uTime.value = elapsedTime
  screenMaterial.needsUpdate=true


  thoughtMaterial.uniforms.uTime.value = elapsedTime
  thoughtMaterial.needsUpdate=true






  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
