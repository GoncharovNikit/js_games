/**
 * optimization:
 * 1. Calc edge weight once (as a third arr num or make it an object)
 *
 */

// coords mult by 100
const verticesJSON = '[{"x":1,"y":3.4},{"x":3,"y":2},{"x":2.3,"y":5},{"x":4,"y":3},{"x":7,"y":5},{"x":7,"y":3},{"x":6,"y":1},{"x":10,"y":4},{"x":9.5,"y":2.4},{"x":11.5,"y":3},{"x":11.79,"y":3.9640625},{"x":10.35,"y":5.2940625},{"x":10.84,"y":1.6540625},{"x":8.87,"y":1.0040625},{"x":6.3,"y":2.1440625},{"x":7.06,"y":3.9840625},{"x":3.82,"y":4.1840625},{"x":4.4,"y":5.73},{"x":7.84,"y":6.4240625},{"x":12.03,"y":6.4140625},{"x":11.9,"y":5.0040625},{"x":10.9,"y":4.5},{"x":13.4,"y":3.4340625},{"x":12.22,"y":2.4040625},{"x":13.42,"y":1.0740625},{"x":15.43,"y":3.5540625},{"x":14.54,"y":2.1840625},{"x":15.19,"y":5.7140625},{"x":13.55,"y":5.0240625},{"x":13.96,"y":6.4540625},{"x":8.86,"y":5.3340625},{"x":5.87,"y":5.6840625},{"x":2.68,"y":6.1540625},{"x":1.02,"y":5.5740625}]'

const edgesJSON = '[[0,1],[0,33],[0,2],[0,3],[1,6],[2,32],[3,5],[0,16],[4,16],[31,17],[31,4],[3,14],[8,14],[33,32],[18,32],[18,4],[3,5],[3,4],[5,8],[6,8],[5,7],[4,7],[8,9],[7,9],[3,6],[31,18],[9,22],[23,22],[23,9],[23,24],[4,15],[5,15],[3,16],[13,6],[13,8],[13,12],[9,12],[23,12],[5,9],[15,7],[15,7],[4,30],[18,30],[11,30],[11,7],[10,7],[21,7],[21,11],[11,18],[9,10],[21,10],[20,10],[21,20],[11,20],[18,19],[11,19],[20,19],[2,33],[15,3],[5,14],[6,14],[1,3],[10,22],[28,22],[28,10],[28,29],[19,29],[20,29]]'

const config = {
    vertices: [], //JSON.parse(verticesJSON),
    edges: [], //JSON.parse(edgesJSON),
    disabledVertices: [],// [18, 4, 15, 11, 7, 6],
    disabledColor: 'grey',
    verticeNumberDisplace: {
        x: -4,
        y: -8,
    },
    verticeIndexDisplace: {
        x: 0,
        y: 16,
    },
    edgeWeightDisplace: {
        x: 0,
        y: 0,
    },
    verticeIndexToFind: 32,
    verticeIndexFindFrom: 1,
    vertice: {
        radius: 5,
        color: 'black',
    },
    verticeIndexFont: {
        fontSize: 10,
        fontFamily: 'Arial',
        color: 'violet',
    },
    verticeNumberFont: {
        fontSize: 11,
        fontFamily: 'Arial',
    },
    edgeWeightFont: {
        fontSize: 11,
        fontFamily: 'Arial',
    },
    edgeWidth: 4,
    foundPathEdgeWidth: 6,
    foundPathColor: 'green',
    multCoef: 1,
    extremeVerticeColor: 'darkred',
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

document.addEventListener('DOMContentLoaded', (e) => {
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 200

    initEvents()
    uploadDataFromLocalStorage()
    redraw(findPath())
})

const redraw = (path) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.textAlign = 'center'
    drawEdges()
    if (path?.length) {
        drawFoundPath(path)
    }
    drawEdgeWeights()
    drawVertices()
    if (path?.length) {
        drawVerticeIndexes()
    }
}

const drawVertices = () => {
    context.font = config.verticeNumberFont.fontSize + 'px ' + config.verticeNumberFont.fontFamily
    config.vertices.forEach((vertice, id) => {
        context.beginPath()
        const vertX = getVertCoord(vertice.x)
        const vertY = getVertCoord(vertice.y)

        if (config.disabledVertices.includes(id)) {
            context.fillStyle = config.disabledColor
        } else if (id === config.verticeIndexToFind || id === config.verticeIndexFindFrom) {
            context.fillStyle = config.extremeVerticeColor
        } else {
            context.fillStyle = config.vertice.color ?? 'black'
        }

        context.arc(vertX, vertY, config.vertice.radius, 0, Math.PI * 2)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = 'white'
        const numberLabelSize = context.measureText(id)
        context.fillRect(
            vertX + config.verticeNumberDisplace.x - numberLabelSize.width / 2,
            vertY + config.verticeNumberDisplace.y - config.verticeNumberFont.fontSize + 1,
            numberLabelSize.width,
            config.verticeNumberFont.fontSize
        )
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = config.verticeNumberFont.color ?? 'black'
        context.fillText(
            id,
            vertX + config.verticeNumberDisplace.x,
            vertY + config.verticeNumberDisplace.y
        )
        context.closePath()
    })
}

const drawVerticeIndexes = () => {
    context.font = config.verticeIndexFont.fontSize + 'px ' + config.verticeIndexFont.fontFamily
    config.vertices.forEach((vertice, id) => {
        if (config.disabledVertices.includes(id)) return

        context.beginPath()
        const vertX = getVertCoord(vertice.x)
        const vertY = getVertCoord(vertice.y)
        const indLabel = vertice.ind !== undefined ? vertice.ind.toFixed(2) : '-1'
        const indLabelSize = context.measureText(indLabel)

        context.fillStyle = 'white'
        context.fillRect(
            vertX + config.verticeIndexDisplace.x - indLabelSize.width / 2,
            vertY + config.verticeIndexDisplace.y - config.verticeIndexFont.fontSize + 1,
            indLabelSize.width,
            config.verticeIndexFont.fontSize
        )

        context.fillStyle = config.verticeIndexFont.color ?? 'black'
        context.fillText(
            indLabel,
            vertX + config.verticeIndexDisplace.x,
            vertY + config.verticeIndexDisplace.y,
        )
        context.fill()

        context.closePath()
    })
}

const drawEdges = () => {
    context.lineWidth = config.edgeWidth
    
    config.edges.forEach((edge) => {
        const begin = config.vertices[edge[0]]
        const end = config.vertices[edge[1]]
        const beginX = getVertCoord(begin.x)
        const beginY = getVertCoord(begin.y)
        const endX = getVertCoord(end.x)
        const endY = getVertCoord(end.y)

        context.beginPath()

        context.strokeStyle = config.disabledVertices.includes(edge[0]) || config.disabledVertices.includes(edge[1]) ? config.disabledColor : 'black'

        context.moveTo(beginX, beginY)
        context.lineTo(endX, endY)
        context.stroke()

        context.closePath()
    })
}

const drawEdgeWeights = () => {
    context.font = config.edgeWeightFont.fontSize + 'px ' + config.edgeWeightFont.fontFamily

    config.edges.forEach((edge) => {
        const begin = config.vertices[edge[0]]
        const end = config.vertices[edge[1]]
        const beginX = getVertCoord(begin.x)
        const beginY = getVertCoord(begin.y)
        const endX = getVertCoord(end.x)
        const endY = getVertCoord(end.y)
        const vectorLength = calcVectorLength(begin, end).toFixed(2)
        const vectorLengthSize = context.measureText(vectorLength)
        const weightX = (beginX + endX) / 2 + config.edgeWeightDisplace.x
        const weightY = (beginY + endY) / 2 + config.edgeWeightFont.fontSize / 2 + config.edgeWeightDisplace.y

        context.beginPath()

        context.fillStyle = 'white'
        context.fillRect(
            weightX - vectorLengthSize.width / 2,
            weightY - config.edgeWeightFont.fontSize + 2,
            vectorLengthSize.width,
            config.edgeWeightFont.fontSize
        )
        context.fillStyle = 'black'
        context.fillText(vectorLength, weightX, weightY)

        context.closePath()
    })
}

const drawFoundPath = (path) => {
    context.lineWidth = config.foundPathEdgeWidth
    context.strokeStyle = config.foundPathColor ?? 'green'

    for (let i = 0; i < path.length - 1; i++) {
        context.beginPath()
        context.moveTo(getVertCoord(path[i].x), getVertCoord(path[i].y))
        context.lineTo(getVertCoord(path[i + 1].x), getVertCoord(path[i + 1].y))
        context.stroke()
        context.closePath()
    }
}

const getVertCoord = (coord) => coord * 100 - config.vertice.radius / 2

const calcVectorLength = (vertA, vertB) => Math.sqrt((vertB.x - vertA.x) ** 2 + (vertB.y - vertA.y) ** 2)

const saveDataToLocalStorage = () => {
    localStorage.setItem('vertices', JSON.stringify(config.vertices))
    localStorage.setItem('edges', JSON.stringify(config.edges))
    localStorage.setItem('disabledVertices', JSON.stringify(config.disabledVertices))
}

const uploadDataFromLocalStorage = () => {
    const vertices = JSON.parse(localStorage.getItem('vertices'))
    if (vertices?.length) {
        config.vertices = vertices
    }

    const edges = JSON.parse(localStorage.getItem('edges'))
    if (edges?.length) {
        config.edges = edges
    }

    const disabledVertices = JSON.parse(localStorage.getItem('disabledVertices'))
    if (disabledVertices?.length) {
        config.disabledVertices = disabledVertices
    }
}

const initControllerEvents = () => {
    document.querySelector('#btn-data-clear').addEventListener('click', (e) => {
        localStorage.removeItem('vertices')
        localStorage.removeItem('edges')
        localStorage.removeItem('disabledVertices')
        
        config.vertices = []
        config.edges = []
        config.disabledVertices = []

        redraw()
    })
}

const initEvents = () => {
    initControllerEvents()

    const canvasClientRect = getCanvasBoundingClientRect()
    const mousedownHandler = (eDown) => {
        const mouseX = (eDown.clientX - canvasClientRect.left) / 100
        const mouseY = (eDown.clientY - canvasClientRect.top) / 100
        let vertToMove = null

        for (vert of config.vertices) {
            if (calcVectorLength({ x: mouseX, y: mouseY }, vert) * 100 <= config.vertice.radius + 2) {
                vertToMove = vert
                break
            }
        }

        if (vertToMove !== null) {
            const mousemoveHandler = (e) => {
                const mouseX = (e.clientX - canvasClientRect.left) / 100
                const mouseY = (e.clientY - canvasClientRect.top) / 100
                vertToMove.x = mouseX
                vertToMove.y = mouseY
                redraw(findPath())
            }

            const mouseupHandler = (e) => {
                saveDataToLocalStorage()
                canvas.removeEventListener('mousemove', mousemoveHandler)
                canvas.removeEventListener('mouseup', mouseupHandler)
            }

            canvas.addEventListener('mousemove', mousemoveHandler)
            canvas.addEventListener('mouseup', mouseupHandler)
        }
    }

    const clickHandler = function (e) {
        const mouseX = (e.clientX - canvasClientRect.left) / 100
        const mouseY = (e.clientY - canvasClientRect.top) / 100
        let clickedVert = null

        for (vert of config.vertices) {
            if (calcVectorLength({ x: mouseX, y: mouseY }, vert) * 100 <= config.vertice.radius + 2) {
                clickedVert = vert
                break
            }
        }

        if (clickedVert === null) {
            if (!e.shiftKey && !e.altKey) {
                config.vertices.push({
                    x: mouseX,
                    y: mouseY,
                })
                redraw(findPath())
            }
        } else if (e.altKey && e.shiftKey) {
            removeVertice(clickedVert)
            redraw(findPath())
        } else if (e.altKey) {
            const vertId = findVerticeIndex(clickedVert)
            if (vertId !== null) {
                const vertIdInDisabled = config.disabledVertices.indexOf(vertId)
                if (vertIdInDisabled === -1) {
                    config.disabledVertices.push(vertId)
                } else {
                    config.disabledVertices.splice(vertIdInDisabled, 1)
                }
                redraw(findPath())
            }
        } else if (e.shiftKey) {
            if (this.verticeBufer === undefined) {
                this.verticeBufer = clickedVert
            } else {
                const vertId1 = findVerticeIndex(this.verticeBufer)
                const vertId2 = findVerticeIndex(clickedVert)
                if (vertId1 !== -1 && vertId2 !== -1) {
                    config.edges.push([vertId1, vertId2])
                }
                redraw(findPath())
                delete this.verticeBufer
            }
        }

        saveDataToLocalStorage()
    }

    canvas.addEventListener('click', clickHandler)
    canvas.addEventListener('mousedown', mousedownHandler)
}

const removeVertice = (vertice) => {
    const vertId = findVerticeIndex(vertice)
    if (vertId !== -1) {
        config.vertices.splice(vertId, 1)
        config.edges = config.edges.filter((edge) => edge[0] !== vertId && edge[1] !== vertId)

        const vertIdInDisabled = config.disabledVertices.indexOf(vertId)
        if (vertIdInDisabled !== -1) {
            config.disabledVertices.splice(vertIdInDisabled, 1)
        }

        // vertice indexes moved
        config.edges.forEach((edge) => {
            if (edge[0] > vertId) {
                edge[0]--;
            }
            if (edge[1] > vertId) {
                edge[1]--;
            }
        })

        if (config.verticeIndexFindFrom && config.verticeIndexFindFrom > vertId) {
            config.verticeIndexFindFrom--
        }

        if (config.verticeIndexToFind && config.verticeIndexToFind > vertId) {
            config.verticeIndexToFind--
        }
    }
}

function getCanvasBoundingClientRect() {
    if (!this.boundingClientRect) {
        this.boundingClientRect = canvas.getBoundingClientRect()
    }

    return this.boundingClientRect
}

const findPath = () => {
    if (
        !config.vertices.length
        || config.verticeIndexFindFrom && config.vertices.length <= config.verticeIndexFindFrom
        || config.verticeIndexToFind && config.vertices.length <= config.verticeIndexToFind
    ) {
        return []
    }

    removeVerticeIndexes()
    indexVertices()
    reindexVertices()

    return findPathByIndexes()
}

const removeVerticeIndexes = () => {
    config.vertices.forEach((vert) => {
        delete vert.ind
    })
}

const findPathByIndexes = () => {
    const startVertice = config.vertices[config.verticeIndexFindFrom ?? 0]
    const resPath = [startVertice]
    if (startVertice.ind === undefined) {
        return resPath
    }

    const endVertice = config.vertices[config.verticeIndexToFind ?? config.vertices.length - 1]

    for (let i = 0; resPath[i].x !== endVertice.x || resPath[i].y !== endVertice.y; i++) {
        const relatedVertices = getVerticeRelatedVertices(resPath[i])
        if (relatedVertices.length === 0) {
            break
        }

        let minDiffVert = relatedVertices[0]

        for (let j = 1; j < relatedVertices.length; j++) {
            if (resPath[i].ind - calcVectorLength(resPath[i], relatedVertices[j]) === relatedVertices[j].ind) {
                minDiffVert = relatedVertices[j]
                break
            }

            if (
                Math.abs(resPath[i].ind - calcVectorLength(resPath[i], relatedVertices[j]) - relatedVertices[j].ind) <
                Math.abs(resPath[i].ind - calcVectorLength(resPath[i], minDiffVert) - minDiffVert.ind)
            ) {
                minDiffVert = relatedVertices[j]
            }
        }

        resPath.push(minDiffVert)
    }

    console.log('path', resPath)
    return resPath
}

const reindexVertices = () => {
    config.vertices.forEach((vert, id) => {
        if (!config.disabledVertices.includes(id)) {
            reindexVerticesRecursively(vert)
        }
    })
}

const reindexVerticesRecursively = (vertice) => {
    const relatedVertices = getVerticeRelatedVertices(vertice)
    relatedVertices.forEach((rVert) => {
        if (rVert.ind > vertice.ind + calcVectorLength(rVert, vertice)) {
            rVert.ind = vertice.ind + calcVectorLength(rVert, vertice)
            reindexVerticesRecursively(rVert)
        }
    })
}

const indexVertices = () => {
    const verticeToFind = config.vertices[config.verticeIndexToFind ?? config.vertices.length - 1]
    verticeToFind.ind = 0

    // initial indexing
    indexRelatedVerticesRecursively(verticeToFind)
}

const indexRelatedVerticesRecursively = (vertice) => {
    const relatedVertices = getVerticeRelatedVertices(vertice)

    relatedVertices.forEach((vert) => {
        if (vert.ind === undefined) {
            vert.ind = vertice.ind + calcVectorLength(vert, vertice)
            indexRelatedVerticesRecursively(vert)
        }
    })
}

const getVerticeRelatedVertices = (vertice) => {
    const verticeId = findVerticeIndex(vertice)

    const res = []

    config.edges.forEach((edge) => {
        if (edge[0] === verticeId && !config.disabledVertices.includes(edge[1])) {
            res.push(config.vertices[edge[1]])
        } else if (edge[1] === verticeId && !config.disabledVertices.includes(edge[0])) {
            res.push(config.vertices[edge[0]])
        }
    })

    return res
}

const findVerticeIndex = (vertice) => config.vertices.findIndex((vert) => vert.x === vertice.x && vert.y === vertice.y)

const testEdges = () => {
    config.edges.forEach((edge) => {
        const vertA = config.vertices[edge[0]]
        const vertB = config.vertices[edge[1]]
        if (Math.abs(vertA.ind - vertB.ind) > calcVectorLength(vertA, vertB)) {
            return false
        }
    })

    return true
}
