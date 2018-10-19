//////////////////// Lorentz Transform ///////////////////////
function lorentzTransform(unprimedEvent, beta) {
    const gamma = (1 - beta**2) ** (-0.5);
    const primedEvent = {};
    primedEvent.x = gamma * (unprimedEvent.x - beta * unprimedEvent.ct);
    primedEvent.ct = gamma * (unprimedEvent.ct - beta * unprimedEvent.x);
    return primedEvent;
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

/////////////////////// Set up velocity slider ////////////////////////

const slider = document.getElementById("velocity");
const velocityDisplay = document.getElementById("velocityDisplay");

velocityDisplay.innerHTML = "Relative Velocity of Primed Frame: " + slider.value + "c";
slider.oninput = function() {
    const velocity = slider.value;
    velocityDisplay.innerHTML = "Relative Velocity of Primed Frame: " + velocity + "c";
    const transformedPoint = lorentzTransform(testPoint, velocity);

    primedGraph.removeExpressions(primedGraph.getExpressions());
    primedGraph.setExpression({latex: pointString(transformedPoint), color: Desmos.Colors.BLUE});
}

////////////////////////

function pointString (point) {
    return '(' + point.x + ', ' + point.ct + ')';
}

testPoint = {x: 3, ct: 5};
unprimedGraph.setExpression({latex: pointString(testPoint)});

////////////////////////

const inputField = document.querySelector('input');
const todos = [];
let count = 0;

const defaultTemplate = `
  <li data-id="{{id}}" class="{{completed}}">
    <div class="todo-item">
      <input class="toggle" type="checkbox">
      <label>{{title}}</label>
      <button class="destroy">Remove</button>
    </div>
  </li>
`;

function toggleDone(evt) {
  console.log(evt);
}

function updateList() {
  let html = '';
  todos.forEach(t => {
    let template = defaultTemplate;
    const c = t.completed ? 'complete' : 'not-complete';
    template = template.replace('{{id}}', t.id);
    template = template.replace('{{completed}}', c);
    template = template.replace('{{title}}', t.title);
    html += template;
  });

  document.querySelector('.todo-list').innerHTML = html;
}

function handleNewSubmission(evt) {
  const { value } = inputField
  inputField.value = '';

  if (value === '') return;
  todos.push({
    id: count,
    completed: false,
    title: value,
  });

  count += 1;
  updateList();
}

inputField.addEventListener("keyup", evt => {
  if (evt.keyCode === 13) {
    handleNewSubmission(evt);
  }
});