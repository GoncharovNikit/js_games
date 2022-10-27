const config = {
    blockCellClass: 'block',

    fieldWidth: 50,
    fieldHeight: 25,

    startPoint: { x: 0, y: 0 },
    startPointLabel: 'S',
    endPointLabel: 'E',
    endPoint: { x: 49, y: 24 },
    extremePointsBackColor: 'darkgreen',
    extremePointsFontColor: 'whitesmoke',
    foundPathCellBackColor: 'lightseagreen',

    pathBlocks: [],

    fieldSelector: '#game-field',
    btnCleanBlocksSelector: '#btn-clean-blocks',
    btnAllOptimalPaths: '#btn-all-optimal-paths',
    btnDistanceToCells: '#btn-distance-to-cells',

    localStoragePathBlocksKey: 'path_blocks',

    allOptimalPathsMode: false,
    displayDistanceToCells: false,
}

document.addEventListener('DOMContentLoaded', (e) => {
    initPathBlocks()
    redrawField()
    initControllers()    
})

const initControllers = () => {
    document.querySelector(config.btnCleanBlocksSelector).addEventListener('click', (e) => {
        localStorage.removeItem(config.localStoragePathBlocksKey)
        config.pathBlocks = []
        redrawField()
    })

    document.querySelector(config.btnAllOptimalPaths).addEventListener('click', () => {
        config.allOptimalPathsMode = !config.allOptimalPathsMode
        redrawField()
    })

    document.querySelector(config.btnDistanceToCells).addEventListener('click', () => {
        config.displayDistanceToCells = !config.displayDistanceToCells
        redrawField()
    })
}

const initPathBlocks = () => {
    const path_blocks = JSON.parse(
        localStorage.getItem(config.localStoragePathBlocksKey)
    )

    if (path_blocks?.length) {
        config.pathBlocks = path_blocks
    }
}

const redrawField = () => {
    getFieldHtmlObject().innerHTML = mapTableHtml()
    initExtremePoints()
    initCellsEvents()
    displayPath(getPath())
}

const initCellsEvents = () => {
    getCells().forEach((e) => {
        e.addEventListener('click', (e) => {
            const targetX = +e.target.dataset.x
            const targetY = +e.target.dataset.y

            if (
                isAvailableCell(targetX, targetY) &&
                (targetX !== config.startPoint.x ||
                    targetY !== config.startPoint.y) &&
                (targetX !== config.endPoint.x || targetY !== config.endPoint.y)
            ) {
                config.pathBlocks.push({ x: targetX, y: targetY })
                localStorage.setItem(
                    config.localStoragePathBlocksKey,
                    JSON.stringify(config.pathBlocks)
                )
                redrawField()
            } else if (cellIsBlock(targetX, targetY)) {
                const index = config.pathBlocks.findIndex(
                    (point) => point.x === targetX && point.y === targetY
                )
                if (index !== -1) {
                    config.pathBlocks.splice(index, 1)
                    localStorage.setItem(
                        config.localStoragePathBlocksKey,
                        JSON.stringify(config.pathBlocks)
                    )
                    redrawField()
                }
            }
        })
    })
}

const cellIsBlock = (x, y) =>
    config.pathBlocks.some((point) => point.x === x && point.y === y)

const mapTableHtml = () => {
    let html = '<table>'

    for (let i = 0; i < config.fieldHeight; i++) {
        html += '<tr>'
        for (let j = 0; j < config.fieldWidth; j++) {
            html += `<td data-x="${j}" data-y="${i}" 
                class="${
                    cellIsBlock(j, i) ? config.blockCellClass : ''
                } cell"></td>`
        }
        html += '</tr>'
    }

    html += '</table>'

    return html
}

const initExtremePoints = () => {
    const start = getCellHtmlObject(config.startPoint.x, config.startPoint.y)
    const end = getCellHtmlObject(config.endPoint.x, config.endPoint.y)
    start.style.backgroundColor = config.extremePointsBackColor
    end.style.backgroundColor = config.extremePointsBackColor
    start.style.color = config.extremePointsFontColor
    end.style.color = config.extremePointsFontColor
    start.innerHTML = config.startPointLabel
    end.innerHTML = config.endPointLabel
}

const getCellHtmlObject = (x, y) => {
    return getCells()[y * config.fieldWidth + x] ?? null
}

const getCells = () => document.querySelectorAll('.cell')

function getFieldHtmlObject() {
    if (!this.field) {
        this.field = document.querySelector(config.fieldSelector)
    }

    return this.field
}

const isAvailableCell = (x, y) =>
    !cellIsBlock(x, y) &&
    x >= 0 &&
    y >= 0 &&
    x < config.fieldWidth &&
    y < config.fieldHeight

const getPath = () => {
    const steps = [[config.startPoint]] // array of steps with avail. points on each

    for (let step = 1; true; step++) {
        const lastPoints = steps[step - 1]
        steps[step] = [];

        for (let i = 0; i < lastPoints.length; i++) {
            const pointAvSteps = getAvailableSteps(lastPoints[i].x, lastPoints[i].y)
            
            if (step === 1) {
                steps[step] = pointAvSteps
                continue
            }

            for (let j = 0; j < pointAvSteps.length; j++) {
                if (!steps[step - 2].some((prevP) => prevP.x === pointAvSteps[j].x && prevP.y === pointAvSteps[j].y)
                    && !steps[step].some((currP) => pointAvSteps[j].x === currP.x && pointAvSteps[j].y === currP.y)) {
                        
                    if (pointAvSteps[j].x === config.endPoint.x && pointAvSteps[j].y === config.endPoint.y) {
                        steps.pop()
                        
                        return formatPath(steps)
                    }

                    steps[step].push(pointAvSteps[j])
                }
            }
        }

        if (steps[step].length === 0) {
            return []
        }

        if (config.displayDistanceToCells) {
            steps[step].forEach((cell) => {
                getCellHtmlObject(cell.x, cell.y).innerHTML = step
            })
        }
    }
}

const getAvailableSteps = (x, y) => {
    const res = []

    if (isAvailableCell(x - 1, y)) res.push({ x: x - 1, y })
    if (isAvailableCell(x + 1, y)) res.push({ x: x + 1, y })
    if (isAvailableCell(x, y - 1)) res.push({ x, y: y - 1 })
    if (isAvailableCell(x, y + 1)) res.push({ x, y: y + 1 })

    return res
}

const formatPath = (path) => {
    if (path.length < 2) {
        return path
    }

    const result = config.allOptimalPathsMode ? [[config.endPoint]] : [config.endPoint]
    path.shift()

    if (config.allOptimalPathsMode) {
        for (let i = path.length - 1; i >= 0; i--) {
            const stepPoints = path[i]
            const lastPoints = result[result.length - 1]

            const prevStepPoint = []
            for (let i = 0; i < lastPoints.length; i++) {
                for (let j = 0; j < stepPoints.length; j++) {
                    if (Math.abs(stepPoints[j].x - lastPoints[i].x) + Math.abs(stepPoints[j].y - lastPoints[i].y) === 1) {
                        prevStepPoint.push(stepPoints[j])
                    }
                }
            }

            if (prevStepPoint.length) {
                result.push(prevStepPoint)
            }
        }
        
        result.shift()
    } else {
        for (let i = path.length - 1; i >= 0; i--) {
            const stepPoints = path[i]
            const lastPoint = result[result.length - 1]
            const prevStepPoint = stepPoints.find(
                (p) =>
                    Math.abs(p.x - lastPoint.x) + Math.abs(p.y - lastPoint.y) === 1
            )
            if (prevStepPoint) {
                result.push(prevStepPoint)
            }
        }

        result.shift()
    }

    return result
}

const displayPath = (path) => {
    if (path) {
        if (config.allOptimalPathsMode) {
            for (points of path) {
                for (point of points) {
                    getCellHtmlObject(point.x, point.y).style.backgroundColor = config.foundPathCellBackColor    
                }
            }
        } else {            
            for (point of path) {
                getCellHtmlObject(point.x, point.y).style.backgroundColor = config.foundPathCellBackColor
            }
        }
    }
}
