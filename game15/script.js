const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const diamondVertices = '[[-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1],[-1,0.1,-1],[1,0.1,-1],[1,0.1,1],[-1,0.1,1],[0,-1.4,0],[0,1.4,0],[-1.2,-0.4,-1.2],[-1.2,-0.4,1.2],[1.2,-0.4,1.2],[1.2,-0.4,-1.2]]'
const diamondEdges = '[[0,1],[0,3],[0,10],[1,11],[1,2],[2,3],[2,12],[3,13],[4,5],[4,7],[6,5],[6,7],[0,8],[1,8],[2,8],[3,8],[4,9],[5,9],[6,9],[7,9],[10,4],[11,7],[12,6],[13,5],[10,11],[12,11],[13,12],[13,10]]'

const config = {
    // vertices: [
    //     [-3, -3, -3],
    //     [3, -3, -3],
    //     [3, -3, 3],
    //     [-3, -3, 3],
    //     [-3, 3, -3],
    //     [3, 3, -3],
    //     [3, 3, 3],
    //     [-3, 3, 3],
    // ],
    // edges: [
    //     [0, 1],
    //     [3, 2],
    //     [0, 3],
    //     [2, 1],
    //     [0, 4],
    //     [3, 7],
    //     [2, 6],
    //     [1, 5],
    //     [4, 7],
    //     [6, 7],
    //     [6, 5],
    //     [4, 5]
    // ],
    vertices: JSON.parse(diamondVertices),
    edges: JSON.parse(diamondEdges),
    faces: [

    ],
    axes: {
        color: 'gray',
        width: .3,
        xOffset: 50,
        yOffset: 20,
        origin: {
            color: 'darkred',
            radius: 3,
            xDispl: 0,
            yDispl: 0,
        },
        tick: {
            color: 'darkgray',
            radius: 2
        }
    },
    edgeStyle: {
        color: 'black',
        width: 2,
    },
    verticeStyle: {
        minRadius: 3,
        maxRadius: 7,
        color: 'black',
    },
    transform: {
        rotateStep: 8,
        unitWidth: 40,
        rotations: {
            x: 0, y: 0, z: 0
        },
        preserveRotation: false,
    },
    showPreservedFigure: true,
}

document.addEventListener('DOMContentLoaded', (e) => {
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 200

    initEvents()
    redraw()
})

const initEvents = () => {
    initControlsEvents()
    
    document.onkeydown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                config.transform.rotations.x += config.transform.rotateStep
                redraw()
                break;
            case 'ArrowUp':
                config.transform.rotations.x -= config.transform.rotateStep
                redraw()
                break;
            case 'ArrowLeft':
                config.transform.rotations.y -= config.transform.rotateStep
                redraw()
                break;
            case 'ArrowRight':
                config.transform.rotations.y += config.transform.rotateStep
                redraw()
                break;
            case 'a':
                config.transform.rotations.z -= config.transform.rotateStep
                redraw()
                break;
            case 'd':
                config.transform.rotations.z += config.transform.rotateStep
                redraw()
                break;
        }
    }
}

const initControlsEvents = () => {
    document.getElementById('preserve-rotation').checked = config.transform.preserveRotation
    document.getElementById('preserve-rotation').addEventListener('input', e => {
        config.transform.preserveRotation = e.target.checked

        if (config.transform.preserveRotation) {
            config.preservedVertices = rotateVertices(config.vertices)
            resetRotations()
        } else {
            config.vertices = config.preservedVertices
        }
    })
}

const resetRotations = () => { config.transform.rotations = { x: 0, y: 0, z: 0 } }

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawAxes(canvas.width, canvas.height)

    const rotatedVertices = rotateVertices(config.transform.preserveRotation ? config.preservedVertices : config.vertices)
    if (config.transform.preserveRotation) {
        config.preservedVertices = rotatedVertices
    }

    drawFaces(rotatedVertices)
    
    drawEdges(rotatedVertices)

    drawVertices(rotatedVertices)

    // if (config.showPreservedFigure && config.transform.preserveRotation) {
    //     drawFaces(rotatedVertices)
    
    //     drawEdges(rotatedVertices)

    //     drawVertices(rotatedVertices)
    // }
}

const drawAxes = (width, height) => {
    const origin = getOrigin()
    
    // Axes
    ctx.strokeStyle = config.axes.color
    ctx.lineWidth = config.axes.width

    ctx.beginPath()
    ctx.moveTo(config.axes.xOffset, origin[1])
    ctx.lineTo(width - config.axes.xOffset, origin[1])

    ctx.moveTo(origin[0], config.axes.yOffset)
    ctx.lineTo(origin[0], height - config.axes.yOffset)

    ctx.stroke()
    ctx.closePath()

    // Origin
    ctx.beginPath()
    ctx.arc(
        origin[0], origin[1],
        // (config.verticeStyle.maxRadius + config.verticeStyle.minRadius) / 2,
        config.axes.origin.radius,
        0,
        Math.PI * 2
    )
    ctx.fillStyle = config.axes.origin.color
    ctx.fill()
    ctx.closePath()

    // Ticks
    ctx.fillStyle = config.axes.tick.color
    
    const xOriginLength = canvas.width - 2 * config.axes.xOffset
    const xSideTicks = xOriginLength / config.transform.unitWidth / 2

    for (let i = 1; i <= xSideTicks; i++) {
        ctx.beginPath()
        ctx.arc(origin[0] + i * config.transform.unitWidth, origin[1], config.axes.tick.radius, 0, Math.PI * 2)
        ctx.arc(origin[0] - i * config.transform.unitWidth, origin[1], config.axes.tick.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }

    const yOriginLength = canvas.height - 2 * config.axes.yOffset
    const ySideTicks = yOriginLength / config.transform.unitWidth / 2

    for (let i = 1; i <= ySideTicks; i++) {
        ctx.beginPath()
        ctx.arc(origin[0], origin[1] + i * config.transform.unitWidth, config.axes.tick.radius, 0, Math.PI * 2)
        ctx.arc(origin[0], origin[1] - i * config.transform.unitWidth, config.axes.tick.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}

const getOrigin = () => [canvas.width / 2 + config.axes.origin.xDispl, canvas.height / 2 + config.axes.origin.yDispl]

const getCoord = (vertice) => {  // axis coords to real canvas coords
    const origin = getOrigin()
    
    return [
        vertice[0] * config.transform.unitWidth + origin[0],
        vertice[1] * config.transform.unitWidth + origin[1]
    ]
}

const rotateVertices = (vertices) => {
    const x_ang = config.transform.rotations.x * Math.PI / 180
    const y_ang = config.transform.rotations.y * Math.PI / 180
    const z_ang = config.transform.rotations.z * Math.PI / 180
    
    const resCoords = []

    for (let i = 0; i < vertices.length; i++) {
        let x = vertices[i][0]
        let y = vertices[i][1]
        let z = vertices[i][2]

        let yn = y * Math.cos(x_ang) + z * Math.sin(x_ang)
        let zn = -y * Math.sin(x_ang) + z * Math.cos(x_ang)
        y = yn
        z = zn

        let xn = x * Math.cos(y_ang) + z * Math.sin(y_ang)
        zn = -x * Math.sin(y_ang) + z * Math.cos(y_ang)
        x = xn
        z = zn

        xn = x * Math.cos(z_ang) - y * Math.sin(z_ang)
        yn = x * Math.sin(z_ang) + y * Math.cos(z_ang)
        x = xn
        y = yn

        resCoords[i] = [x, y, z]
    }

    if (config.transform.preserveRotation) {
        resetRotations()
    }

    return resCoords
}

const drawVertices = (vertices) => {
    const minZ = Math.min(...vertices.map(v => v[2]))
    const maxZ = Math.max(...vertices.map(v => v[2]))

    ctx.fillStyle = config.verticeStyle.color
    vertices.forEach((vertice, id) => {
        ctx.beginPath()
        const relativeRadius = (config.verticeStyle.maxRadius * (minZ - vertice[2]) - config.verticeStyle.minRadius * (maxZ - vertice[2])) / (minZ - maxZ)
        verticeCoords = getCoord(vertice)
        ctx.arc(...verticeCoords, relativeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.fillText(`${id}`, verticeCoords[0] - 4, verticeCoords[1] - 8)
        ctx.closePath()
    })
}

const drawEdges = (vertices) => {
    ctx.strokeStyle = config.edgeStyle.color
    ctx.lineWidth = config.edgeStyle.width

    for (edge of config.edges) {
        ctx.beginPath()
        beginV = vertices[edge[0]]
        endV = vertices[edge[1]]
        ctx.moveTo(...getCoord(beginV))
        ctx.lineTo(...getCoord(endV))
        ctx.stroke()
        ctx.closePath()
    }
}

const drawFaces = (vertices) => {
    // draw face
    ctx.fillStyle = 'lightgray';
    ctx.beginPath()
    ctx.moveTo(...getCoord(vertices[3]))
    ctx.lineTo(...getCoord(vertices[2]))
    ctx.lineTo(...getCoord(vertices[6]))
    ctx.lineTo(...getCoord(vertices[7]))
    ctx.closePath()
    ctx.fill()
}