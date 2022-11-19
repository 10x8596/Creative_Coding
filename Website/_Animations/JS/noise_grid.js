const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");

const mapRange = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

// canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// parameters
const params = {
    cols: 50,
    rows: 50,
    scaleMin: 1,
    scaleMax: 3,
    freq: 0.001,
    amp: 0.2,
    frame: 0,
    animate: true,
    lineCap: 'butt',
};

// initialise canvas and grid
function init(frame) {

    // describe the grid
    const cols = params.cols;
    const rows = params.rows;

    // number of cells
    const numCells = cols * rows;

    // make the grid
    // grid width and height is 80% canvas'
    const gridWidth = canvas.width * 0.8;
    const gridHeight = canvas.height * 0.8;

    // width of each cell is width of grid divided by number of cols
    const cellWidth  = gridWidth  / cols;
    // height of each cell is height of grid divided by number of rows
    const cellHeight = gridHeight / rows;

    // margin: difference between the size of the canvas and grid
    // because there are two margins, one on the right and one on the left
    // we want half of the difference so times by 0.5
    const marginX = (canvas.width - gridWidth) * 0.5;
    const marginY = (canvas.height - gridHeight) * 0.5;

    for (let i = 0; i < numCells; i++) {
        // get each column
        const col = i % cols;
        // get each row
        const row = Math.floor(i / cols);
        
        // find x and y values of each cell
        const x = col * cellWidth;
        const y = row * cellHeight;

        // width and height of rectangles
        const w = cellWidth * 0.8;
        const h = cellHeight * 0.8;

        const f = params.animate ? frame : params.frame;

        // noise / //////////////////////////////////////////
        const noise = Math.random() * 5;
        // angle of frequency movement
        const angle = 5 * Math.PI * params.amp;
        // change scale of rects based on noise ///////////////////////
        const scale = mapRange(noise, -1, 1, params.scaleMin, params.scaleMax);

        // draw
        context.save();
        context.translate(x, y);
        context.translate(marginX, marginY);
        context.translate(cellWidth * 0.5, cellHeight * 0.5);
        context.rotate(angle);

        context.lineWidth = scale;
        context.lineCap = params.lineCap;

        // gradient
        var grd = context.createLinearGradient(0, 0, 0.5, 0.5);
        grd.addColorStop(0.5, 'rgb(228, 55, 55)');
        grd.addColorStop(1, 'white');

        context.beginPath();
        context.strokeStyle = grd;
        context.moveTo(w * -0.5, 0);
        context.lineTo(w * 0.5, 0);
        context.stroke();
        context.restore();
    }
}

// create tweakpane
const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;
    folder = pane.addFolder({ title: 'Grid'});
    folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square'}})
    folder.addInput(params, 'cols', { min: 2, max: 50, step: 1});
    folder.addInput(params, 'rows', { min: 2, max: 50, step: 1});
    folder.addInput(params, 'scaleMin', { min: 1, max: 100});
    folder.addInput(params, 'scaleMax', { min: 1, max: 100});

    folder = pane.addFolder({title: 'Noise'});
    folder.addInput(params, 'freq', {min: -0.01, max: 0.01});
    folder.addInput(params, 'amp', {min: 0, max: 1});
    folder.addInput(params, 'animate');
    folder.addInput(params, 'frame', {min: 0, max: 999})
};

// animation loop
function animate() {
    requestAnimationFrame(animate);
}

createPane();
init();
animate();

