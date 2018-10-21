//////////////////// Lorentz Transform ///////////////////////

function lorentzTransformPoint(unprimedEvent, beta) {
    const primedEvent = {};
    primedEvent.x = "\\gamma (" + unprimedEvent.x + "- \\beta \\cdot" + unprimedEvent.ct + ")";
    primedEvent.ct = "\\gamma (" + unprimedEvent.ct + "- \\beta \\cdot" + unprimedEvent.x + ")";
    return primedEvent;
}

function lorentzTransformLine(unprimedLine, beta) {
  return unprimedLine.map(point => lorentzTransformPoint(point, beta));
}

//////////////////// Initialize Graphs ////////////////////////

const unprimedGraph = Desmos.GraphingCalculator(document.getElementById('unprimed'), {   
  keypad: false,
  expressions: false,
  settingsMenu: false,
  zoomButtons: false,
});

unprimedGraph.updateSettings({ xAxisLabel: 'x', yAxisLabel: 'ct '});

const primedGraph = Desmos.GraphingCalculator(document.getElementById('primed'), {   
    keypad: false,
    expressions: false,
    settingsMenu: false,
    zoomButtons: false,
});

primedGraph.updateSettings({ xAxisLabel: 'x\'', yAxisLabel: 'ct\''});
primedGraph.setExpression({id: "velocity", latex: "\\beta = 0"});
primedGraph.setExpression({latex: "\\gamma = \\frac{1}{\\sqrt{1-\\beta^2}}"});

/////////////////////// Set up velocity slider functionality ////////////////////////

const slider = document.getElementById("velocity");
const velocityNum = document.getElementById("velocityNum");

velocityNum.innerHTML = slider.value;
slider.oninput = function() {
    const velocity = slider.value;
    velocityNum.innerHTML = velocity;
    primedGraph.setExpression({id: "velocity", latex: "\\beta = " + velocity});
}

///////////////////  DRAWING //////////////////////////

function pointString (point) {
    return '(' + point.x + ', ' + point.ct + ')';
}

function drawLine(graph, line, setColor) {
  let point1 = line[0];
  let point2 = line[1];
  graph.setExpression({
    type: 'table',
    columns: [
      {
        latex: 'x',
        values: [point1.x, point2.x]
      },
      {
        latex: 'y',
        values: [point1.ct, point2.ct],
        color: setColor,
        lines: true
      },
    ]
  });
}

////////////////// Event Inputting //////////////////////////////////

const inputFields = {
  ct1: document.getElementById('ct1'),
  x1: document.getElementById('x1'),
  ct2: document.getElementById('ct2'),
  x2: document.getElementById('x2'),
  setColor: document.getElementById('colorChoice'),
}

document.getElementById('submitButton').addEventListener('click', function(){
  const inputValues = {}
  Object.keys(inputFields).forEach(e => inputValues[e] = inputFields[e].value);
  Object.keys(inputFields).forEach(e => inputFields[e].value = "");

  worldline = [
    {x: inputValues.x1, ct: inputValues.ct1},
    {x: inputValues.x2, ct: inputValues.ct2}
  ]

  drawLine(unprimedGraph, worldline, inputValues.setColor);
  drawLine(primedGraph, lorentzTransformLine(worldline), inputValues.setColor);
});
