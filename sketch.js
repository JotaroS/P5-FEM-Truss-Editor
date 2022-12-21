// node editor
// a stupid FEM editor that jotaro made in 30 mins.

// var node = new FEMNode(10,10,1);
var nodes = [];
var edges = [];
const EditMode = {
    AddNode: 'addNode',
    AddEdge: 'addEdge',
    Delete: 'delete',
    Toggle: 'toggle',
    Export: 'export'
};
var editMode = EditMode.AddNode;
var edging = false;
var fromNode = undefined;
var toNode = undefined;
var fixedNumber = 0;

var isGridActive = true;

const addNodeButton = new ClickableBox(0, 0, 50, 50, "Add \nNode", EditMode.AddNode);
const deleteEdgeButton = new ClickableBox(0, 50, 50, 50, "Delete \nNode", EditMode.Delete)
const addEdgeButton = new ClickableBox(0, 100, 50, 50, "Add \nEdge", EditMode.AddEdge);
const toggleFixButton = new ClickableBox(0, 150, 50, 50, "Fix \nNode", EditMode.Toggle);
const exportButton = new ClickableBox(0, 200, 50, 50, "Export \nTruss", EditMode.Export);

const grid = new Grid(30);

const UIButtons = [addNodeButton, deleteEdgeButton, addEdgeButton, toggleFixButton, exportButton];
addNodeButton.active = true;

function setup() {
    createCanvas(960, 540);
};

function draw() {
    var logs = [];
    background(240);

    grid.draw();

    switch (editMode) {
        case EditMode.AddNode:
            break;
        case EditMode.AddEdge:
            break;
        case EditMode.Delete:
            break;
        case EditMode.Toggle:
            break;
    }


    if (edging && fromNode) {
        strokeWeight(1);
        stroke(0, 0, 255);
        line(fromNode.x, fromNode.y, mouseX, mouseY);
    }
    strokeWeight(3)
    edges.forEach(function (e, index, object) {
        stroke(0, 0, 255);
        line(e[0].x, e[0].y, e[1].x, e[1].y);
    })
    nodes.forEach(n => {
        strokeWeight(1);
        stroke(0);
        n.draw();
    });

    UIButtons.forEach((u) => u.draw());
    logs.push("press 'g' to toggle grid");
    logs.push("mode = " + editMode);
    logs.push("total nodes = " + nodes.length);
    logs.push("total edges = " + edges.length);
    logs.push("fixed nodes = " + fixedNumber);
    debugLog(logs);
};

function mousePressed() {
    let uiClicked = false;
    UIButtons.forEach((u) => {
        if (u.onMouseClicked(mouseX, mouseY)) {
            uiClicked = true;
            editMode = u.mode;
        }
    });
    UIButtons.forEach((u) => {
        if (u.mode == editMode) u.active = true;
        else u.active = false;
    })

    if (exportButton.active) {
        exportButton.active = false;
        addNodeButton.active = true;
        editMode = EditMode.AddNode;
        exportTruss();
    }

    if (uiClicked) return;

    if (editMode == EditMode.AddNode) {
        nodes.push(new FEMNode(mouseX, mouseY, nodes.length));
        return;
    }
    nodes.forEach(function (n, index, object) {
        if (n.onMouseClicked(mouseX, mouseY)) {
            switch (editMode) {
                case EditMode.AddNode:
                    break;
                case EditMode.AddEdge:
                    if (!edging) {
                        fromNode = n;
                        edging = true;
                    } else {
                        edging = false;
                        if (fromNode.id != n.id) edges.push([fromNode, n]);
                    }
                    break;
                case EditMode.Delete:
                    let newEdges = []
                    edges.forEach(function (e, index, object) {
                        if (e[0].id == n.id || e[1].id == n.id) {
                            // object.splice(index, 1);
                        } else newEdges.push(e);
                    });
                    edges = newEdges;
                    if (n.fixed) fixedNumber--;
                    object.splice(index, 1);
                    break;
                case EditMode.Toggle:
                    if (n.fixed == false) fixedNumber++;
                    else fixedNumber--;
                    n.fixed = !n.fixed;
                    break;
                default:
                    break;
            }
        }
    });


    // reindex nodes.
    nodes.forEach(function (n, index, object) {
        n.id = index;
    })
}

function keyPressed() {
    // if g key is pressed then toggle grid.
    if (keyCode == 71) {
        grid.isActive = !grid.isActive;
    }
}

function exportTruss() {
    if (fixedNumber == 0) {
        alert("you are not fixing any truss node! the whole body is just going to fly away.");
        return;
    }
    let dumpstring = "";
    nodes.forEach((n) => {
        console.log("nodes.append([" + n.x + "," + n.y + "])\n");
        dumpstring = dumpstring + "nodes.append([" + n.x + "," + -1 * n.y + "])\n";
    });
    console.log(dumpstring);

    edges.forEach((e) => {
        // console.log("bars.append(["+e[0].id+","+e[1].y+"])\n");
        dumpstring = dumpstring + "bars.append([" + e[0].id + "," + e[1].id + "])\n";
    });

    let ur = "";
    for (let i = 0; i < fixedNumber; i++) ur += "0,0,";
    dumpstring = dumpstring + "Ur = [" + ur + "]\n";

    dumpstring = dumpstring +
        "nodes = np.array(nodes).astype(float)\nbars = np.array(bars)\nP = np.zeros_like(nodes)\nDOFCON = np.ones_like(nodes).astype(int)\n";

    nodes.forEach((n) => {
        if (n.fixed) {
            dumpstring = dumpstring + "DOFCON[" + n.id + ", :] = 0\n";
        }
    })

    navigator.clipboard.writeText(dumpstring).then(() => {
        alert("Copied to clipboard! ： \n" + dumpstring);
    });
}

function debugLog(logs) {
    fill(0);
    var i = 0;
    logs.forEach(element => {
        text(element, 10, height - 15 * (logs.length - i));
        i++;
    });

}