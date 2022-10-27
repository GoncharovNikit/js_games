const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const sideLength = 100
const cfg = {
    xAngle: 0,
    yAngle: 0,
    zAngle: 0,
    frontVerticesInitValues() {
        return [
            { x: sideLength, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: sideLength },
            { x: sideLength, y: sideLength },
        ]
    },
    backVerticesInitValues() {
        return [
            { x: sideLength, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: sideLength },
            { x: sideLength, y: sideLength },
        ]
    },
    globalDisplacement: {
        x: 300,
        y: 100,
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    initCanvasSize()
    initEvents()
    redraw()
})

const initCanvasSize = () => {
    canvas.width = window.innerWidth - 14
    canvas.height = window.innerHeight - 200    // 200px - controllers area
}

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawCube(rotateCube())
}

const initEvents = () => {
    document.querySelector('#x-rotation').addEventListener('change', (e) => {
        cfg.xAngle = +e.target.value
        console.log(e.target.value);
        redraw()
    })
    document.querySelector('#y-rotation').addEventListener('change', (e) => {
        cfg.yAngle = +e.target.value
        console.log(e.target.value);
        redraw()
    })
}

const drawCube = ({ frontVertices, backVertices }) => {
    ctx.beginPath()
    for (let i = 0; i < frontVertices.length; i++) {
        const nextId = i + 1 < frontVertices.length ? i + 1 : 0
        ctx.moveTo(frontVertices[i].x + cfg.globalDisplacement.x, frontVertices[i].y + cfg.globalDisplacement.y)
        ctx.fillText(i, frontVertices[i].x + cfg.globalDisplacement.x, frontVertices[i].y + cfg.globalDisplacement.y)
        ctx.lineTo(frontVertices[nextId].x + cfg.globalDisplacement.x, frontVertices[nextId].y + cfg.globalDisplacement.y)
        ctx.moveTo(frontVertices[i].x + cfg.globalDisplacement.x, frontVertices[i].y + cfg.globalDisplacement.y)
        ctx.fillText(i + 'b', backVertices[i].x + cfg.globalDisplacement.x, backVertices[i].y + cfg.globalDisplacement.y)
        ctx.lineTo(backVertices[i].x + cfg.globalDisplacement.x, backVertices[i].y + cfg.globalDisplacement.y)
        ctx.lineTo(backVertices[nextId].x + cfg.globalDisplacement.x, backVertices[nextId].y + cfg.globalDisplacement.y)
        
    }
    ctx.stroke()
    ctx.closePath()
}

const rotateCube = () => {
    const xDisplace = sideLength * Math.sin(cfg.yAngle / 180)
    const yDisplace = sideLength * Math.sin(cfg.xAngle / 180)
    const frontVertices = cfg.frontVerticesInitValues()
    const backVertices = cfg.backVerticesInitValues()

    frontVertices[0].y -= yDisplace
    frontVertices[1].y -= yDisplace
    frontVertices[2].y -= yDisplace
    frontVertices[3].y -= yDisplace
    backVertices[0].y += yDisplace
    backVertices[1].y += yDisplace
    backVertices[2].y += yDisplace
    backVertices[3].y += yDisplace

    return { frontVertices, backVertices }
}