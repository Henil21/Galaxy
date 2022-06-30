import "./style.css"
// const { Color } = require("three")
import * as THREE from "three"
import { Mesh } from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import { HotUpdateChunk } from "webpack"
import * as dat from 'dat.gui'

const textureloader= new THREE.TextureLoader()

const text=textureloader.load('textures/door/2k_mars.jpg')
const gui = new dat.GUI();

const canvas=document.querySelector('canvas.webgl')
const coursor={
    x: 0,
    y: 0
}

window.addEventListener('mousemove',(event)=>{
    coursor.x=event.clientX/size.width-0.5
    coursor.y= -(event.clientY/size.height-0.5)    
    
})


const scene = new THREE.Scene()
// const group = new THREE.Group()
// scene.add(group)
const group1= new THREE.Group()


const parameters={}
parameters.count=15000
parameters.size=0.01
parameters.radius = 9
parameters.branche= 3
parameters.spin= 1
parameters.randomness= 0.2
parameters.randomnesspower=3
parameters.insideColor='#ff6030'
parameters.outsideColor='#1b3984'


let geo1 =null
let material =null
let points=null
// let branchangle=null
const genegalaxy=()=>
{
  if(points != null){
    geo1.dispose()
    material.dispose()
    scene.remove(points)

  }
  geo1= new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count*3)
  const colors = new Float32Array(parameters.count*3)
  
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)
  // const mixed = colorInside.clone()

  
  
  
  for(let i =0 ; i< parameters.count;i++)
  {
    const i3 = i*3
    const radius = Math.random()*parameters.radius
    const bangle = (i % parameters.branche) / parameters.branche*Math.PI*2
    const spinang= radius * parameters.spin
    
    const randomx= Math.pow(Math.random(), parameters.randomnesspower)*(Math.random()<0.5 ? 1 : -1)
    const randomy= Math.pow(Math.random(), parameters.randomnesspower)*(Math.random()<0.5 ? 1 : -1)
    const randomz= Math.pow(Math.random(), parameters.randomnesspower)*(Math.random()<0.5 ? 1 : -1)
    
    
    positions[i3 +0] = Math.cos(bangle+spinang)*radius+randomx
    positions[i3+1] = randomy
    positions[i3+2] = Math.sin(bangle+spinang)*radius+randomz
    // console.log(Math.cos(branchangle))
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside,radius/parameters.radius)

    colors[i3]=mixedColor.r
    colors[i3+1]=mixedColor.g
    colors[i3+2]=mixedColor.b


  }

// console.log(positions)
  geo1.setAttribute(
    'position',
    new THREE.BufferAttribute(positions,3)
  )
  geo1.setAttribute(
    'color',
    new THREE.BufferAttribute(colors,3)
  )
  //Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation:true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors:true,
    // color:'#ff5588'


  })

   points = new THREE.Points(geo1, material)
   group1.add(points)
   scene.add(group1)
   group1.position.set(0,0,0)

}
genegalaxy()
gui.add(parameters,'count').min(100).max(1000000).step(100).onFinishChange(genegalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(genegalaxy)
gui.add(parameters,'radius').min(0.01).max(20).step(0.001).onFinishChange(genegalaxy)
gui.add(parameters,'branche').min(2).max(20).step(1).onFinishChange(genegalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.001).onFinishChange(genegalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(genegalaxy)
gui.add(parameters,'randomnesspower').min(1).max(10).step(0.001).onFinishChange(genegalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(genegalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(genegalaxy)








const group = new THREE.Group();

  // wireframe:true, //details of object (material)




//mars///////////////////////////////////////mars ///////////////////mars////////////////////////////////////////////
const geo = new THREE.SphereBufferGeometry(5,32,32)  // creating  geometry of object

const mat= new THREE.MeshStandardMaterial({
   map :text,
  //  wireframe:true
  // wireframe:true,
}
   ) //details of object (material)
const mars =new THREE.Mesh(geo,mat) //combining geometry and material as one
// group.add(mars) 
// mars.position.x=
const particles = new THREE.BufferGeometry(1,100,100)
//material
const count=1000


const positions = new Float32Array(count*3)

for (let i=0;i<count*3;i++ ){
  positions[i]=(Math.random()-0.5)*100
}

particles.setAttribute(
  'position',
  new THREE.BufferAttribute(positions,3)
)

const particalmaterial= new THREE.PointsMaterial({
  size:0.02,
  sizeAttenuation:true
})


//Points
const point=new THREE.Points(particles,particalmaterial)
group.add(point)



scene.add(group)



const alight= new THREE.AmbientLight(0xffffff,0.5)
scene.add(alight)


const size={
    width:window.innerWidth,
    height : window.innerHeight
}
window.addEventListener('resize',()=>{
    size.width = window.innerWidth,
    size.height = window.innerHeight
    camera.aspect=size.width/size.height
    camera.updateProjectionMatrix()
   // updating renderer
    renderer.setSize(size.width,size.height)

})
//double click to go full screen
window.addEventListener('dblclick',()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }
  else{
    document.exitFullscreen()
  }
})


const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
// const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,100)

scene.add(camera)
camera.position.x=-12.5
camera.position.y=8.4
camera.position.z=5.6

//controls
const controls=new OrbitControls(camera,canvas)
controls.enableDamping=true


const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(size.width,size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//will render between devicepixel and 2
renderer.render(scene,camera)

// let time= Date.now()
//clock
const clock=new THREE.Clock()

const  tick= () =>
{
    const elap=clock.getElapsedTime()

   
    mars.rotation.y=elap/2
    // mars.position.x=Math.cos(elap*0.7)*5.8
    // mars.position.z=Math.sin(elap*0.7)*5.8

    group1.rotation.y=elap/5

    renderer.render(scene,camera)
    // console.log('x',camera.position.x)
    // console.log('y',camera.position.y)

    // console.log('z',camera.position.z)


    window.requestAnimationFrame(tick)//call function at each point
}
tick()
