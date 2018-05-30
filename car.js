let carNode;
let wheelNode;
let wheel1;
let subWheel1;
let wheel2;
let subWheel2;
let wheel3;
let subWheel3;
let wheel4;
let subWheel4;
let front;
let back;
let roofs;
let frontfront;
let obstacles;


function createCar(){
	// Let's make all the parts of the car
  carNode = new Node();
  carNode.localMatrix = m4.identity();
  m4.translate(carNode.localMatrix,[0,0 ,-1.5],carNode.localMatrix);
  carNode.name = "Car";
  carNode.drawInfo = {
    uniforms: {
      u_diffuseMult: [carColor.r,carColor.g,carColor.b,1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/paint.png", mag: gl.NEAREST,
    })
    },
    programInfo: progInfo,
    bufferInfo: bufferInfo,
  };
	let cylinder = twgl.primitives.createTorusBufferInfo(gl, 80,80,3,3);

  wheelNode = new Node();
  wheelNode.localMatrix = m4.identity();
  m4.translate(wheelNode.localMatrix,[0,0,0],wheelNode.localMatrix);
  wheelNode.name = "Wheel";
  wheelNode.drawInfo = {
    uniforms: {
      u_diffuseMult: [(0) / 3, (0) / 3, (2) / 3, 1],
       u_diffuse: twgl.createTexture(gl, {
      src: "images/sky.png", mag: gl.NEAREST,
    })
    },
    programInfo: progInfo,
    bufferInfo: cylinder
  };
  wheelNode.setParent(carNode);

  wheel1 = new Node();
  wheel1.localMatrix = m4.identity();
  m4.translate(wheel1.localMatrix,[-0.27,-0.2,+0.3],wheel1.localMatrix);
  m4.rotateZ(wheel1.localMatrix,degToRad(90),wheel1.localMatrix)
  wheel1.name = "Wheel1";
  wheel1.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
       u_diffuse: twgl.createTexture(gl, {
      src: "images/wheel.jpg", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.1  , 0.1, 40, 2),
  };
  subWheel1 = new Node();
  subWheel1.localMatrix = m4.identity();
  m4.translate(subWheel1.localMatrix,[0,0.009,0],subWheel1.localMatrix);
  subWheel1.name = "subWheel1";
  subWheel1.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/tire.png", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.06  , 0.09, 40, 2),
  };
  wheel2 = new Node();
  wheel2.localMatrix = m4.identity();
  m4.translate(wheel2.localMatrix,[+0.27,-0.2,+0.3],wheel2.localMatrix);
  m4.rotateZ(wheel2.localMatrix,degToRad(90),wheel2.localMatrix)
  wheel2.name = "Wheel2";
  wheel2.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
       u_diffuse: twgl.createTexture(gl, {
      src: "images/wheel.jpg", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.1  , 0.1, 40, 2),
  };
  subWheel2 = new Node();
  subWheel2.localMatrix = m4.identity();
  m4.translate(subWheel2.localMatrix,[0,-0.01,0],subWheel2.localMatrix);
  subWheel2.name = "subWheel2";
  subWheel2.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/tire.png", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.06  , 0.09, 40, 2),
  };
  wheel3 = new Node();
  wheel3.localMatrix = m4.identity();
  m4.translate(wheel3.localMatrix,[-0.27,-0.2,-0.3],wheel3.localMatrix);
  m4.rotateZ(wheel3.localMatrix,degToRad(90),wheel3.localMatrix)
  wheel3.name = "Wheel3";
  wheel3.drawInfo = {
     uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
       u_diffuse: twgl.createTexture(gl, {
      src: "images/wheel.jpg", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.1  , 0.1, 40, 2),
  };
  subWheel3 = new Node();
  subWheel3.localMatrix = m4.identity();
  m4.translate(subWheel3.localMatrix,[0,0.01,0],subWheel3.localMatrix);
  subWheel3.name = "subWheel3";
  subWheel3.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/tire.png", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.06  , 0.09, 40, 2),
  };
  wheel4 = new Node();
  wheel4.localMatrix = m4.identity();
  m4.translate(wheel4.localMatrix,[0.27,-0.2,-0.3],wheel4.localMatrix);
  m4.rotateZ(wheel4.localMatrix,degToRad(90),wheel4.localMatrix)
  wheel4.name = "Wheel4";
  wheel4.drawInfo = {
     uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
       u_diffuse: twgl.createTexture(gl, {
      src: "images/wheel.jpg", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.1  , 0.1, 40, 2),
  };
  subWheel4 = new Node();
  subWheel4.localMatrix = m4.identity();
  m4.translate(subWheel4.localMatrix,[0,-0.01,0],subWheel4.localMatrix);
  subWheel4.name = "subWheel1";
  subWheel4.drawInfo = {
    uniforms: {
      u_diffuseMult: [(1.57) / 3, (1.55) / 3, (1.55) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/tire.png", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCylinderBufferInfo(gl, 0.06  , 0.09, 40, 2),
  };
  front = new Node();
  front.localMatrix = m4.identity();
  m4.translate(front.localMatrix,[0,0,0.4],front.localMatrix);
  m4.rotateZ(front.localMatrix,degToRad(90),front.localMatrix)
  front.name = "front";
  front.drawInfo = {
    uniforms: {
      u_diffuseMult: [carColor.r,carColor.g,carColor.b,1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/paint.png", mag: gl.NEAREST,
    })
    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCubeBufferInfo(gl, 0.4),
  };
  frontfront = new Node();
  frontfront.localMatrix = m4.identity();
  m4.translate(frontfront.localMatrix,[0,0,-0.7],frontfront.localMatrix);
  m4.rotateZ(frontfront.localMatrix,degToRad(90),frontfront.localMatrix)
  frontfront.name = "frontfront";
  frontfront.drawInfo = {
    uniforms: {
      u_diffuseMult: [carColor.r,carColor.g,carColor.b,1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/glass.jpg", mag: gl.NEAREST,
    })
    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCubeBufferInfo(gl, 0.35),
  };
  back = new Node();
  back.localMatrix = m4.identity();
  m4.translate(back.localMatrix,[0,0,-0.4],back.localMatrix);
  m4.rotateZ(back.localMatrix,degToRad(90),back.localMatrix)
  back.name = "back";
  back.drawInfo = {
    uniforms: {
      u_diffuseMult: [carColor.r,carColor.g,carColor.b,1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/paint.png", mag: gl.NEAREST,
    })
    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createCubeBufferInfo(gl, 0.4),
  };
  roofs = [];
  for(var i = 0; i < 10; i++){
    let roof = new Node();
    roof.localMatrix = m4.identity();
    var sign = i % 2 == 0 ? -1 : 1;
    m4.translate(roof.localMatrix,[0,0.15,0 + (0.06*i)*sign],roof.localMatrix);
    m4.rotateZ(roof.localMatrix,degToRad(90),roof.localMatrix)
    roof.name = "roof";
    roof.drawInfo = {
    uniforms: {
      u_diffuseMult: [(2) / 3, (2) / 3, (2) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/glass.jpg", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createSphereBufferInfo(gl, 0.2,30,50),
    };
    roof.setParent(carNode);
        roofs.push(roof);
  }

  obstacles = []
  for (var i = 0; i < 10; i++){
    obstacle = new Node();
    obstacle.localMatrix = m4.identity();
    let random = Math.floor(Math.random() *8) + 5
    m4.rotateY(obstacle.localMatrix,random,obstacle.localMatrix);  
    m4.rotateZ(obstacle.localMatrix,degToRad(90),obstacle.localMatrix);
    m4.translate(obstacle.localMatrix,[1,random,random],obstacle.localMatrix);
    obstacle.name = "obstacle";
    obstacle.drawInfo = {
    uniforms: {
      u_diffuseMult: [(0) / 3, (2.5) / 3, (2) / 3, 1],
      u_diffuse: twgl.createTexture(gl, {
      src: "images/paint.png", mag: gl.NEAREST,
    })

    },
    programInfo: progInfo,
    bufferInfo: twgl.primitives.createTorusBufferInfo(gl, 2, 0.4, 24, 12),
    };
    obstacle.setParent(terrainNode)
    obstacles.push(obstacle)
  }
  
  
  
    carNode.setParent(cameraNode)
    wheelNode.setParent(terrainNode);
    subWheel1.setParent(wheel1);

    wheel1.setParent(carNode);

    subWheel2.setParent(wheel2);
    wheel2.setParent(carNode);

    subWheel3.setParent(wheel3);
    wheel3.setParent(carNode);

    subWheel4.setParent(wheel4);
    wheel4.setParent(carNode);
    front.setParent(carNode);
    frontfront.setParent(carNode);
    back.setParent(carNode);
}

