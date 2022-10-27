/**
 * optimization:
 * 1. Calc edge weight once (as a third arr num or make it an object)
 * 2. Don't redraw during removing or disabling vert with ind == -1
 */

// coords mult by 100
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const config = {
    useTrainingGraph: true,
    vertices: [],
    edges: [],
    disabledVertices: [],
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
    verticeIndexToFind: 29,
    verticeIndexFindFrom: 1,
    vertice: {
        radius: 9,
        color: 'black',
    },
    font: {
        verticeIndex: {
            fontSize: 10,
            fontFamily: 'Arial',
            color: 'violet',
        },
        verticeNumber: {
            fontSize: 11,
            fontFamily: 'Arial',
        },
        edgeWeight: {
            fontSize: 11,
            fontFamily: 'Arial',
        },
    },
    edgeWidth: 6,
    foundPathEdgeWidth: 8,
    foundPathColor: 'green',
    extremeVerticeColor: 'darkred',
    coordCoef: 80,
    edgeAddMode: true,
}

document.addEventListener('DOMContentLoaded', (e) => {
    initCanvasSize()
    initEvents()
    if (config.useTrainingGraph === false) {
        uploadDataFromLocalStorage()
    } else {
        uploadTestData()
    }
    redraw(findPath())
})

const initCanvasSize = () => {
    canvas.width = window.innerWidth - 14
    canvas.height = window.innerHeight - 200    // 200px - controllers area
}

const redraw = (path) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'

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
    ctx.font = config.font.verticeNumber.fontSize + 'px ' + config.font.verticeNumber.fontFamily
    config.vertices.forEach((vertice, id) => {
        ctx.beginPath()
        const vertX = getVertCoord(vertice.x)
        const vertY = getVertCoord(vertice.y)

        if (config.disabledVertices.includes(id)) {
            ctx.fillStyle = config.disabledColor
        } else if (id === config.verticeIndexToFind || id === config.verticeIndexFindFrom) {
            ctx.fillStyle = config.extremeVerticeColor
        } else {
            ctx.fillStyle = config.vertice.color ?? 'black'
        }

        ctx.arc(vertX, vertY, config.vertice.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = 'white'
        const numberLabelSize = ctx.measureText(id)
        ctx.fillRect(
            vertX + config.verticeNumberDisplace.x - numberLabelSize.width / 2,
            vertY + config.verticeNumberDisplace.y - config.font.verticeNumber.fontSize + 1,
            numberLabelSize.width,
            config.font.verticeNumber.fontSize
        )
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = config.font.verticeNumber.color ?? 'black'
        ctx.fillText(
            id,
            vertX + config.verticeNumberDisplace.x,
            vertY + config.verticeNumberDisplace.y
        )
        ctx.closePath()
    })
}

const drawVerticeIndexes = () => {
    ctx.font = config.font.verticeIndex.fontSize + 'px ' + config.font.verticeIndex.fontFamily
    config.vertices.forEach((vertice, id) => {
        if (config.disabledVertices.includes(id)) return

        ctx.beginPath()
        const vertX = getVertCoord(vertice.x)
        const vertY = getVertCoord(vertice.y)
        const indLabel = vertice.ind !== undefined ? vertice.ind.toFixed(2) : '-1'
        const indLabelSize = ctx.measureText(indLabel)

        ctx.fillStyle = 'white'
        ctx.fillRect(
            vertX + config.verticeIndexDisplace.x - indLabelSize.width / 2,
            vertY + config.verticeIndexDisplace.y - config.font.verticeIndex.fontSize + 1,
            indLabelSize.width,
            config.font.verticeIndex.fontSize
        )

        ctx.fillStyle = config.font.verticeIndex.color ?? 'black'
        ctx.fillText(
            indLabel,
            vertX + config.verticeIndexDisplace.x,
            vertY + config.verticeIndexDisplace.y,
        )
        ctx.fill()

        ctx.closePath()
    })
}

const drawEdges = () => {
    ctx.lineWidth = config.edgeWidth

    config.edges.forEach((edge) => {
        const begin = config.vertices[edge[0]]
        const end = config.vertices[edge[1]]
        const beginX = getVertCoord(begin.x)
        const beginY = getVertCoord(begin.y)
        const endX = getVertCoord(end.x)
        const endY = getVertCoord(end.y)

        ctx.beginPath()

        ctx.strokeStyle = config.disabledVertices.includes(edge[0]) || config.disabledVertices.includes(edge[1]) ? config.disabledColor : 'black'

        ctx.moveTo(beginX, beginY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        ctx.closePath()
    })
}

const drawEdgeWeights = () => {
    ctx.font = config.font.edgeWeight.fontSize + 'px ' + config.font.edgeWeight.fontFamily

    config.edges.forEach((edge) => {
        const begin = config.vertices[edge[0]]
        const end = config.vertices[edge[1]]
        const beginX = getVertCoord(begin.x)
        const beginY = getVertCoord(begin.y)
        const endX = getVertCoord(end.x)
        const endY = getVertCoord(end.y)
        const vectorLength = calcVectorLength(begin, end).toFixed(2)
        const vectorLengthSize = ctx.measureText(vectorLength)
        const weightX = (beginX + endX) / 2 + config.edgeWeightDisplace.x
        const weightY = (beginY + endY) / 2 + config.font.edgeWeight.fontSize / 2 + config.edgeWeightDisplace.y

        ctx.beginPath()

        ctx.fillStyle = 'white'
        ctx.fillRect(
            weightX - vectorLengthSize.width / 2,
            weightY - config.font.edgeWeight.fontSize + 2,
            vectorLengthSize.width,
            config.font.edgeWeight.fontSize
        )
        ctx.fillStyle = 'black'
        ctx.fillText(vectorLength, weightX, weightY)

        ctx.closePath()
    })
}

const drawFoundPath = (path) => {
    ctx.lineWidth = config.foundPathEdgeWidth
    ctx.strokeStyle = config.foundPathColor ?? 'green'

    for (let i = 0; i < path.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(getVertCoord(path[i].x), getVertCoord(path[i].y))
        ctx.lineTo(getVertCoord(path[i + 1].x), getVertCoord(path[i + 1].y))
        ctx.stroke()
        ctx.closePath()
    }
}

const getVertCoord = (coord) => coord * config.coordCoef - config.vertice.radius / 2

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

const uploadTestData = () => {
    const verticesJSON = '[{"x":1,"y":3.4},{"x":3,"y":2},{"x":2.3,"y":5},{"x":4,"y":3},{"x":7,"y":5},{"x":7,"y":3},{"x":6,"y":1},{"x":10,"y":4},{"x":9.5,"y":2.4},{"x":11.5,"y":3},{"x":11.79,"y":3.9640625},{"x":10.35,"y":5.2940625},{"x":10.84,"y":1.6540625},{"x":8.87,"y":1.0040625},{"x":6.3,"y":2.1440625},{"x":7.06,"y":3.9840625},{"x":3.82,"y":4.1840625},{"x":4.4,"y":5.73},{"x":7.84,"y":6.4240625},{"x":12.03,"y":6.4140625},{"x":11.9,"y":5.0040625},{"x":10.9,"y":4.5},{"x":13.4,"y":3.4340625},{"x":12.22,"y":2.4040625},{"x":13.42,"y":1.0740625},{"x":15.43,"y":3.5540625},{"x":14.54,"y":2.1840625},{"x":15.19,"y":5.7140625},{"x":13.55,"y":5.0240625},{"x":13.96,"y":6.4540625},{"x":8.86,"y":5.3340625},{"x":5.87,"y":5.6840625},{"x":2.68,"y":6.1540625},{"x":1.02,"y":5.5740625}]'
    const edgesJSON = '[[0,1],[0,33],[0,2],[0,3],[1,6],[2,32],[3,5],[0,16],[4,16],[31,17],[31,4],[3,14],[8,14],[33,32],[18,32],[18,4],[3,5],[3,4],[5,8],[6,8],[5,7],[4,7],[8,9],[7,9],[3,6],[31,18],[9,22],[23,22],[23,9],[23,24],[4,15],[5,15],[3,16],[13,6],[13,8],[13,12],[9,12],[23,12],[5,9],[15,7],[15,7],[4,30],[18,30],[11,30],[11,7],[10,7],[21,7],[21,11],[11,18],[9,10],[21,10],[20,10],[21,20],[11,20],[18,19],[11,19],[20,19],[2,33],[15,3],[5,14],[6,14],[1,3],[10,22],[28,22],[28,10],[28,29],[19,29],[20,29]]'
    const disabledVerticesJSON = '[18, 3, 6]'

    config.vertices = JSON.parse(verticesJSON)
    config.edges = JSON.parse(edgesJSON)
    config.disabledVertices = JSON.parse(disabledVerticesJSON)
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

    // document.querySelector('#coord-coef').addEventListener('change', (e) => {
    //     config.coordCoef = e.target.value
    //     redraw(findPath())
    // })

    const startVertInp = document.querySelector('#start-vert')
    const endVertInp = document.querySelector('#end-vert')
    startVertInp.value = config.verticeIndexFindFrom
    endVertInp.value = config.verticeIndexToFind
    startVertInp.addEventListener('change', (e) => {
        const value = +e.target.value
        if (value < config.vertices.length && value >= 0) {
            config.verticeIndexFindFrom = value
            redraw(findPath())
        }
    })
    endVertInp.addEventListener('change', (e) => {
        const value = +e.target.value
        if (value < config.vertices.length && value >= 0) {
            config.verticeIndexToFind = value
            redraw(findPath())
        }
    })

    document.querySelector('#edge-add-mode').addEventListener('change', (e) => {
        config.edgeAddMode = e.target.checked
        delete config.verticeBufer
    })
}

const initEvents = () => {
    initControllerEvents()

    const canvasClientRect = getCanvasBoundingClientRect()
    const mousedownHandler = (eDown) => {
        const mouseX = (eDown.clientX - canvasClientRect.left) / config.coordCoef
        const mouseY = (eDown.clientY - canvasClientRect.top) / config.coordCoef
        let vertToMove = null

        for (vert of config.vertices) {
            if (calcVectorLength({ x: mouseX, y: mouseY }, vert) * config.coordCoef <= config.vertice.radius + 2) {
                vertToMove = vert
                break
            }
        }

        if (vertToMove !== null) {
            const mousemoveHandler = (e) => {
                const mouseX = (e.clientX - canvasClientRect.left) / config.coordCoef
                const mouseY = (e.clientY - canvasClientRect.top) / config.coordCoef
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

    const clickHandler = (e) => {
        const mouseX = (e.clientX - canvasClientRect.left) / config.coordCoef
        const mouseY = (e.clientY - canvasClientRect.top) / config.coordCoef
        let clickedVert = null

        for (vert of config.vertices) {
            if (calcVectorLength({ x: mouseX, y: mouseY }, vert) * config.coordCoef <= config.vertice.radius + 2) {
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

                if (config.edgeAddMode && config.verticeBufer !== undefined) {
                    const vertId = findVerticeIndex(config.verticeBufer)

                    if (vertId !== -1) {
                        config.edges.push([vertId, config.vertices.length - 1])
                        config.verticeBufer = config.vertices[config.vertices.length - 1]
                    }
                }

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
            if (config.edgeAddMode) {
                config.verticeBufer = clickedVert

                return
            }

            if (config.verticeBufer === undefined) {
                config.verticeBufer = clickedVert
            } else {
                const vertId1 = findVerticeIndex(config.verticeBufer)
                const vertId2 = findVerticeIndex(clickedVert)
                if (vertId1 !== -1 && vertId2 !== -1) {
                    config.edges.push([vertId1, vertId2])
                }
                redraw(findPath())

                config.verticeBufer = config.edgeAddMode ? clickedVert : undefined;
            }
        } else if (config.edgeAddMode && config.verticeBufer !== undefined) {
            const buferIndex = findVerticeIndex(config.verticeBufer)
            const clickedIndex = findVerticeIndex(clickedVert)

            if (buferIndex !== -1 && clickedIndex !== -1) {
                config.edges.push([buferIndex, clickedIndex])
                redraw(findPath())
            }
        }

        saveDataToLocalStorage()
        console.log(config.edges.length);
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
        || config.disabledVertices.includes(config.verticeIndexFindFrom)
        || config.disabledVertices.includes(config.verticeIndexToFind)
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
