var Node = function() {
     this.children = [];
     this.localMatrix = m4.identity();
     this.worldMatrix = m4.identity();
   };

   Node.prototype.setParent = function(parent) {
     // remove us from our parent
     if (this.parent) {
       var ndx = this.parent.children.indexOf(this);
       if (ndx >= 0) {
         this.parent.children.splice(ndx, 1);
       }
     }

     // Add us to our new parent
     if (parent) {
       parent.children.push(this);
     }
     this.parent = parent;
   };

   Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {
     if (parentWorldMatrix) {
       // a matrix was passed in so do the math
       m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
     } else {
       // no matrix was passed in so just copy local to world
       m4.copy(this.localMatrix, this.worldMatrix);
     }

     // now process all the children
     var worldMatrix = this.worldMatrix
     this.children.forEach(function(child) {
       child.updateWorldMatrix(worldMatrix);
     });
   };


const vs = `
uniform mat4 u_worldViewProjection;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;

attribute vec4 position;
attribute vec3 normal;
attribute vec2 texcoord;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {
  v_texCoord = texcoord;
  v_position = (u_worldViewProjection * position);
  v_normal = (u_worldInverseTranspose * vec4(normal, 0)).xyz;
  v_surfaceToLight = u_lightWorldPos - (u_world * position).xyz;
  v_surfaceToView = (u_viewInverse[3] - (u_world * position)).xyz;
  gl_Position = v_position;
}
`;
const fs = `
precision mediump float;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform vec4 u_lightColor;
uniform vec4 u_diffuseMult;
uniform sampler2D u_diffuse;
uniform vec4 u_specular;
uniform float u_shininess;
uniform float u_specularFactor;

vec4 lit(float l ,float h, float m) {
  return vec4(1.0,
              abs(l),//max(l, 0.0),
              (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
              1.0);
}

void main() {
  vec4 diffuseColor = texture2D(u_diffuse, v_texCoord) * u_diffuseMult;
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLight = normalize(v_surfaceToLight);
  vec3 surfaceToView = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLight + surfaceToView);
  vec4 litR = lit(dot(normal, surfaceToLight),
                    dot(normal, halfVector), u_shininess);
  vec4 outColor = vec4((
  u_lightColor * (diffuseColor +
                u_specular * litR.z * u_specularFactor)).rgb,
      diffuseColor.a);
  gl_FragColor = outColor;
}
`;

const m4 = twgl.m4;
const v3 = twgl.v3;

let carColor = {r:2 / 3 , g:1,b:2/3};
gl = document.querySelector("canvas").getContext("webgl");


const attributes = [
      "position",
      "normal",
      "texcoord",
    ];
const progInfo = twgl.createProgramInfo(gl, [vs, fs],attributes);

const skyboxProgInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const plane = twgl.primitives.createXYQuadBufferInfo(gl);
const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 0.4,1);
const terrainBufferInfo = twgl.primitives.createDiscBufferInfo(gl, 50, 40)
console.log(bufferInfo);
 projection = m4.identity();
const camera = m4.identity();
const view = m4.identity();
const viewProjection = m4.identity();
const world = m4.identity();
const worldViewProjection = m4.identity();
const worldInverse = m4.identity();
const worldInverseTranspose = m4.identity();


const fov = degToRad(90);
const zNear = 0.1;
const zFar = 100;

const lightDir = v3.normalize([1, 2, 3]);

const keys = {};

let px = 0;
let py = 0;
let pz = 0;
let elev = 0;
let ang = 0;
let spin = 0;
let roll = 0;
const speed = 5;
const turnSpeed = 90;

var objectsToDraw = [];
var objects = [];
  
  const viewDirectionProjectionInverse = m4.identity();
      const viewDirection = m4.identity();
    const viewDirectionProjection = m4.identity();

  var skyboxNode = new Node();
  skyboxNode.localMatrix = m4.identity();
  skyboxNode.drawInfo = {
    programInfo: skyboxProgInfo,
    bufferInfo:plane,
    uniforms:{
      u_skybox: twgl.createTexture(gl, {
        target: gl.TEXTURE_CUBE_MAP,
        src: [
        'images/skyposx1.png',
        'images/skynegx1.png',
        'images/skyposy1.png',
        'images/skynegy1.png',
        'images/skyposz1.png',
        'images/skynegz1.png'
        ],
      }),
    }

  }
  var cameraNode = new Node();
  cameraNode.drawInfo = {

    programInfo: progInfo,
    bufferInfo: bufferInfo,
  };

  var terrainNode = new Node();
  terrainNode.localMatrix = m4.identity();
  m4.translate(terrainNode.localMatrix,[0,-0.4,0],terrainNode.localMatrix);
  terrainNode.name = "Terrain";
  terrainNode.drawInfo = {
    uniforms: {
      u_diffuseMult: [(0.5) / 3, (1) / 3, (1.6) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/grass.png",
    })
    },
    programInfo: progInfo,
    bufferInfo: terrainBufferInfo,
  };

  createCar();

  cameraNode.setParent(terrainNode);

  // connect the celetial objects

  var objects = [
    terrainNode,
    carNode,
    wheelNode,
    wheel1,
    subWheel1,
    wheel2,
    subWheel2,
    wheel3,
    subWheel3,
    wheel4,
    subWheel4,
    front,
    back,
    roofs[0],
    roofs[1],
    roofs[2],
    roofs[3],
    roofs[4],
    roofs[5],
    roofs[6],
    frontfront,
    obstacles[0],
    obstacles[1],
    obstacles[2],
    obstacles[3],
    obstacles[4],
    obstacles[5],
    obstacles[6],
    obstacles[7],
    obstacles[8],
  ];



let then = 0;

function render(now) {
  now *= 0.001;  // seconds;
  const deltaTime = now - then;
  then = now;
  
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE) 
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;


  m4.perspective(fov, aspect, zNear, zFar, projection);

  m4.identity(camera);

 //  const eye = [0, 3, 0];
 //  const target = [0, 2, -1.5];
 //   const up = [0, 2, 0.1];
 // m4.lookAt(eye, target, up, camera);


  m4.translate(camera, [px, py+0.5, pz+0.2], camera);
  m4.rotateX(camera, degToRad(elev), camera);   
  m4.rotateY(camera, degToRad(-ang), camera);   
  m4.rotateZ(camera, degToRad(roll), camera);
  

  m4.identity(cameraNode.localMatrix);   

  m4.translate(cameraNode.localMatrix, [px, py, pz], cameraNode.localMatrix);
  m4.rotateY(cameraNode.localMatrix, degToRad(-ang), cameraNode.localMatrix);   
  m4.rotateZ(cameraNode.localMatrix, degToRad(roll), cameraNode.localMatrix);


  m4.inverse(camera, view);

  m4.multiply(projection, view, viewProjection);



   //ws
  if (keys['87'] || keys['83']) {
    const direction = keys['87'] ? 1 : -1;
    m4.rotateY(wheel1.localMatrix, direction*speed*5*deltaTime, wheel1.localMatrix);
    m4.rotateY(wheel2.localMatrix, direction*speed*5*deltaTime, wheel2.localMatrix);
    m4.rotateY(wheel3.localMatrix, direction*speed*5*deltaTime, wheel3.localMatrix);
    m4.rotateY(wheel4.localMatrix, direction*speed*5*deltaTime, wheel4.localMatrix);

    px -= camera[ 8] * deltaTime * speed * direction;
    pz -= camera[10] * deltaTime * speed * direction;
    console.log(px,py,pz)
  }
  //ad
  if (keys['65'] || keys['68']) {
     const direction = keys['65'] ? -1 : 1;
    let dir = direction*deltaTime > 0.001 ? 0.001 : (direction*deltaTime < -0.001 ? -0.001 : direction*deltaTime);
    m4.rotateX(wheel1.localMatrix, dir, wheel1.localMatrix);
    m4.rotateZ(wheel2.localMatrix, dir, wheel2.localMatrix);
    m4.rotateZ(wheel3.localMatrix, dir, wheel3.localMatrix);
    m4.rotateZ(wheel4.localMatrix, dir, wheel4.localMatrix);
    ang += deltaTime * turnSpeed * direction;
  }
//qe
  if (keys['81'] || keys['69']) {
    const direction = keys['81'] ? 1 : -1;
    roll += deltaTime * turnSpeed * direction;
    console.log("ROLL: " + roll)
  }
  //updown
  if (keys['38'] || keys['40']) {
    const direction = keys['38'] ? 1 : -1;
    elev += deltaTime * 100 * direction;
  }
  

// ------ Draw the objects --------
  var lastUsedProgramInfo = null;
  var lastUsedBufferInfo = null;


  terrainNode.updateWorldMatrix();
  cameraNode.updateWorldMatrix();
  const lightWorldPosition = [1, 8, -10];
  const lightColor = [1, 1, 1, 1];
  objects.forEach(function(object) {
      var programInfo = object.drawInfo.programInfo; 
      var bufferInfoo = object.drawInfo.bufferInfo;

      object.drawInfo.uniforms.u_worldViewProjection = worldViewProjection;
      object.drawInfo.uniforms.u_worldInverseTranspose =  worldInverseTranspose;
      object.drawInfo.uniforms.u_lightWorldPos = lightWorldPosition;
      object.drawInfo.uniforms.u_lightColor = lightColor;
      object.drawInfo.uniforms.u_specular = [1, 1, 1, 1];
      object.drawInfo.uniforms.u_shininess = 50;
      object.drawInfo.uniforms.u_specularFactor = 1;
      object.drawInfo.uniforms.u_viewInverse = camera;
      object.drawInfo.uniforms.u_world = world;
      object.drawInfo.uniforms.u_diffuseMult = object.drawInfo.uniforms.u_diffuseMult;
      object.drawInfo.uniforms.u_diffuse = object.drawInfo.uniforms.u_diffuse;
      m4.multiply(viewProjection, object.worldMatrix, worldViewProjection);
      m4.inverse(object.worldMatrix, worldInverse);
      m4.transpose(worldInverse, worldInverseTranspose);


      var bindBuffers = false;

      if (programInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = programInfo;
        gl.useProgram(programInfo.program);

        // We have to rebind buffers when changing programs because we
        // only bind buffers the program uses. So if 2 programs use the same
        // bufferInfo but the 1st one uses only positions the when the
        // we switch to the 2nd one some of the attributes will not be on.
        bindBuffers = true;
      }


       // Setup all the needed attributes.
      if (bindBuffers || bufferInfoo !== lastUsedBufferInfo) {
        lastUsedBufferInfo = bufferInfoo;
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfoo);
      }

      // Set the uniforms.

      twgl.setUniforms(programInfo, object.drawInfo.uniforms);

      // Draw
      twgl.drawBufferInfo(gl, bufferInfoo);


    });




   
  requestAnimationFrame(render);
}
requestAnimationFrame(render);


window.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true;
  e.preventDefault();
});
window.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false;
  e.preventDefault();
});


 function degToRad(d) {
    return d * Math.PI / 180;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function emod(x, n) {
    return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
  };

function normalize(angle){

  angle = angle > 0.01 ? 0.01 : angle < -0.01 ? -0.01 : angle;
  console.log(angle)
  return angle;
}

function getCarColor() {
    var x = document.getElementById("myColor").value;
    carColor = hexToRgb(x);
    carNode.drawInfo.uniforms.u_diffuseMult = [carColor.r,carColor.g,carColor.b,1];
    front.drawInfo.uniforms.u_diffuseMult = [carColor.r,carColor.g,carColor.b,1];
    back.drawInfo.uniforms.u_diffuseMult = [carColor.r,carColor.g,carColor.b,1];
    frontfront.drawInfo.uniforms.u_diffuseMult = [carColor.r,carColor.g,carColor.b,1];
  }
function getBackgroundColor() {
    var x = document.getElementById("myBGColor").value;
    let color = hexToRgb(x);
    terrainNode.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
    wheelNode.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
  }

  function getWheelsColor() {
    var x = document.getElementById("myWheelsColor").value;
    let color = hexToRgb(x);
    wheel1.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
     wheel2.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
      wheel3.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
       wheel4.drawInfo.uniforms.u_diffuseMult = [color.r,color.g,color.b,1];
  }
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
}