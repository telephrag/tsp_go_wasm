
var graph = {
    "adjList": [],
    "nodeCount": 0,
}

var coords

function must(err) {
    if (err != null) {
        throw new Error(err)
    }
}

function parsePosIntFromInputField(inputField) {
    const i = parseInt(inputField.value, 10)
    if (!Number.isInteger(i)) {
        return [null, `"${i}" is not an integer`]
    }
    if (i < 0) {
        return [null, `"${i}" is negative`]
    }
    return [i, null]
}

// drawing graphical representation of graph
function getCanvasCtx() {

    let ctx = document.getElementById('hexagon').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear before redrawing

    ctx.canvas.width = 300 // make values dynamic in the future
    ctx.canvas.height = 300

    return ctx
}

function getHeightsCoords(nc) {
    const 
        size = 100,
        Xcenter = 150, // make values dynamic in the future
        Ycenter = 150;

    // integrate into main loop above
    let nodes = []
    for (let i = 0; i <= nc; i += 1) {
        nodes.push({
            "first": Xcenter + size * Math.cos(i * 2 * Math.PI / nc),
            "second": Ycenter + size * Math.sin(i * 2 * Math.PI / nc),
        })
    }

    return nodes
}

function redrawGraph(nc) {
    ctx = getCanvasCtx() 
    ctx.beginPath();

    for (let i = 0; i < coords.length; i++) {
        for (let j = i; j < coords.length; j++) {
            ctx.moveTo(coords[i].first, coords[i].second)
            ctx.lineTo(coords[j].first, coords[j].second)
        }
    }
    
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke()

    res = calcOverGraph()
    ctx.beginPath()
    ctx.moveTo(coords[res.route[0]].first, coords[res.route[0]].second)
    
    for (let i = 0; i < res.route.length; i++) {
        ctx.lineTo(coords[res.route[i]].first, coords[res.route[i]].second) 
    }
    ctx.lineTo(coords[res.route[0]].first, coords[res.route[0]].second)

    ctx.strokeStyle = "#B22222";
    ctx.lineWidth = 3;
    ctx.stroke()

    // draw node ids backgrounds
    ctx.beginPath()
    for (let i = 0; i < coords.length; i++) {
        ctx.moveTo(coords[i].first, coords[i].second)
        ctx.arc(coords[i].first, coords[i].second, 15, 0, Math.PI * 2);
        ctx.fill()
        // ctx.fillText(i.toString, coords[i].first, coords[i].second, 2)
    }
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke()

    // draw node id numbers
    ctx.beginPath()
    ctx.fillStyle = "#FFFFFF"
    ctx.textAllign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "15px Sans"
    for (let i = 0; i < coords.length-1; i++) { // why length-1 ?!
        ctx.moveTo(coords[i].first, coords[i].second)
        ctx.fillText(i.toString(), coords[i].first-5, coords[i].second)
    }

    document.getElementById("result").innerHTML = `
    <pre>
        Path:     ${res.route}<br>
        Distance: ${res.dist}<br>
        ExecTime: ${res.et}μs<br>
        Error:    ${res.err}<br>
    </pre>
    `
}

function redrawGraphWrapper() {
    redrawGraph(graph.nc)
}

function createGraph() {
    let [nc, err] = parsePosIntFromInputField(
        document.getElementById("graph-nodes-count") 
    ) 
    must(err)
    graph.nodeCount = nc // setting node count of the graph
    graph.adjList = [] // empty adjesency list after possible previous use
    document.getElementById("result").innerHTML = "" // resetting result
        
    let table = document.getElementById("graph")
    table.innerHTML = ""
    let tHead = table.createTHead()

    for (let i = 0; i < nc; i++) {
        let row = tHead.insertRow()
        graph.adjList.push({})
        
        for (let j = i; j < nc; j++) { // skip some nodes since p(a,b) = p(b,a)
            if (j == i) { 
                cell = row.insertCell()
                cell.setAttribute("colSpan", j+1)
                continue // skip since traversion from node to itself is impossible
            }
            
            let input = document.createElement("input")
            input.setAttribute("type", "text") 
            
            cell = row.insertCell()
            id = document.createTextNode(`${j}: `)
            cell.appendChild(id)
            cell.appendChild(input)

            // write node values into variable that holds graph
            input.addEventListener('keyup', () => {
                let [val, err] = parsePosIntFromInputField(input)
                if (err != null) {
                    input.value = ""
                    val = 0
                    return
                } 
                graph.adjList[i][`${j}`] = val
                graph.adjList[j][`${i}`] = val

                if (nc > 10) {
                    document.getElementById("result").innerHTML = `
                        The graph is too big to calculate interactively. 
                        Please, press "Calculate" once you've done inputing the values.
                    `
                    return
                }

                redrawGraph(nc)
            })
        }

        id = document.createTextNode(`\xa0 |\xa0 ${i}`)
        row.appendChild(id)
    }

    coords = getHeightsCoords(nc)
}

function calcOverGraph() {
    if (graph.adjList.length <= 1) {
        throw new Error("cannot calculate on empty or single node graph")
    }
    
    let c = calc(JSON.stringify(graph))
    let res = JSON.parse(c)
    if (typeof(res) != 'object') {
        document.getElementById("result").innerHTML = res
    }

    return res
}