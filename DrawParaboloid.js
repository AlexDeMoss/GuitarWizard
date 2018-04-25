/**
 *  @author Marietta E. Cameron  <mcameron@unca.edu>
 *  Three js version of paraboloid
 *  Sample program to demostrate transform matrices
 **/

function main() {



    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1.0, 0.1, 1000);

    //set render to canvas Element
    var renderer = new THREE.WebGLRenderer({canvas: drawCanvas});
    renderer.setSize(drawCanvas.width, drawCanvas.height);
    renderer.shadowMap.enabled = true;


    var skySphereGeometry = new THREE.SphereGeometry(1000,20,20);  //radius, width segments, height segments
    var skyMaterial = new THREE.MeshBasicMaterial ({color: 0x8888FF, side:THREE.DoubleSide});
    var skySphere = new THREE.Mesh(skySphereGeometry, skyMaterial);
    skySphere.position.x = 0;
    skySphere.position.y = 0;
    skySphere.position.z = 0;
    scene.add(skySphere);

    var paraboloid = generateParaboloid(100, 100);

    var pGeometry = new THREE.Geometry();
    pGeometry.vertices = paraboloid.vertices;
    pGeometry.faces = paraboloid.faces;
    pGeometry.computeFaceNormals();

    var diffuseColor = new THREE.Color(1.0, 0.0, 0.0);
    var specularColor = new THREE.Color(1.0, 1.0, 1.0);
    var material = new THREE.MeshPhongMaterial({
        color: diffuseColor,
        specular: specularColor,
        reflectivity: 0.1,
        shininess: 1.0,

        shadowSide: THREE.BackSide
    });

    var mesh = new THREE.Mesh(pGeometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);


    camera.position.z = 3;


    scene.add(new THREE.AmbientLight(0x222222));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-5, 100, 100).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);


// GROUND
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshPhongMaterial({color: 0x00ff00});

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -33;
    scene.add(ground);
    ground.receiveShadow = true;



    var render = function () {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
}//end main


function computeColor(height) {
    if (height > 0.75)
        return [1, 1 - height, 0];
    if (height > 0.5)
        return [1 - height, 1, 0];
    if (height > 0.25)
        return [0, 1, 0.5 - height];
    return [0, height, 1];
}


/**
 *
 * @param {type} rows
 * @param {type} cols
 * @returns {generateGrid.DrawGridAnonym$0}
 */
function generateParaboloid(rows, cols) {

    var gridVertices = [];
    var i = 0;
    var vInc = 2.0 * Math.PI / cols;
    var uInc = 2.0 / rows;

    var x = 0.0, y = 0.0, z = 0.0;

    var map = function (r, c) {
        return (r * (cols + 1)) + c;
    };

    var u = 2, v = 0, factor = 0;
    for (var r = 0; r <= rows; r++) {
        v = 0.0;
        factor = Math.sqrt(u / 2);
        for (var c = 0; c <= cols; c++) {
            x = factor * Math.cos(v);
            y = u - 1;
            z = factor * Math.sin(v);
            gridVertices.push(new THREE.Vector3(x, y, z));
            v += vInc;
        }//for each col
        u -= uInc;
    }//for each row

    i = 0;
    var gridTriangles = [];
    for (var r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            gridTriangles.push(new THREE.Face3(map(r, c), map(r + 1, c), map(r + 1, c + 1)));
            gridTriangles.push(new THREE.Face3(map(r, c), map(r + 1, c + 1), map(r, c + 1)));
        }//for each col
    }//for each row

    return {vertices: gridVertices, faces: gridTriangles};

}//generateColorCube

function cross(u, v) {
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
}

function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}

function mag(u) {
    return Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
}

function normalize(u) {
    var m = mag(u);
    if (m > 0.0001)
        return [u[0] / m, u[1] / m, u[2] / m];
    else
        return [0, 0, 0];
}

function scalarMultiply(s, u) {
    return [s * u[0], s * u[1], s * u[2]];
}
