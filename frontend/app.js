
var graph = {
    "adjList": [],
    "nodeCount": 0,
}

function must(err) {
    if (err != null) {
        throw new Error(err)
    }
}

function parsePosIntFromInputField(inputField) {
    const nc = parseInt(inputField.value, 10)
    if (!Number.isInteger(nc)) {
        return [null, `"${nc}" is not an integer`]
    }
    if (nc <= 0) {
        return [null, `"${nc}" is null of negative`]
    }
    return [nc, null]
}

function createGraph() {
    let [nc, err] = parsePosIntFromInputField(
        document.getElementById("graph-nodes-count") 
    ) 
    must(err)
    graph.nodeCount = nc // setting node count of the graph
    graph.adjList = [] // empty adjesency list after possible previous use
    document.getElementById("result").innerHTML = ""
        
    let table = document.querySelector("table")
    table.innerHTML = ""
    let tHead = table.createTHead()

    for (let i = 0; i < nc; i++) {
        let row = tHead.insertRow()
        id = document.createTextNode(`${i} | `)
        graph.adjList.push({})
        row.appendChild(id)
        for (let j = i; j < nc; j++) { // skip some nodes since p(a,b) = p(b,a)
            if (j == i) { continue } // skip since traversion from node to itself is impossible
            
            let input = document.createElement("input")
            input.setAttribute("type", "text") 
            
            cell = row.insertCell()
            id = document.createTextNode(`${j}: `)
            cell.appendChild(id)
            cell.appendChild(input)

            let [val, err] = parsePosIntFromInputField(input)
            input.addEventListener('keyup', () => {
                [val, err] = parsePosIntFromInputField(input)
                if (err != null) {
                    input.value = ""
                    return
                } 
                graph.adjList[i][`${j}`] = val
                graph.adjList[j][`${i}`] = val
            })
        }
    }
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

    document.getElementById("result").innerHTML = `
        Path:     ${res.route}<br>
        Distance: ${res.dist}<br>
        ExecTime: ${res.et}<br>
    `
}