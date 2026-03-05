// Tip Calculator logic

// Elements
const billInput = document.getElementById('bill');
const peopleInput = document.getElementById('people');
const tipButtons = Array.from(document.querySelectorAll('.tipBtn'));
const customTipInput = document.getElementById('customTip');
const tipPerPersonEl = document.getElementById('tipPerPerson');
const totalPerPersonEl = document.getElementById('totalPerPerson');
const errorEl = document.getElementById('error');
const resetBtn = document.getElementById('resetBtn');

let selectedTip = null; // percentage as number (e.g., 15 for 15%)

// Helpers
function formatCurrency(value) {
  // Use South African Rand symbol and 2 decimals
  return 'ZAR ' + Number(value).toFixed(2);
}

function clearTipSelection() {
  selectedTip = null;
  tipButtons.forEach(b => b.classList.remove('inactive'));
  customTipInput.value = '';
}

// Update calculations
function calculate() {
  errorEl.textContent = '';
  const bill = parseFloat(billInput.value);
  const people = parseInt(peopleInput.value, 10);

  // Determine tip percentage
  let tipPct = selectedTip;
  const customVal = parseFloat(customTipInput.value);
  if (!isNaN(customVal) && customVal >= 0) tipPct = customVal;

  // Validate inputs
  if (isNaN(bill) || bill < 0) {
    tipPerPersonEl.textContent = formatCurrency(0);
    totalPerPersonEl.textContent = formatCurrency(0);
    errorEl.textContent = 'Enter a valid bill amount.';
    return;
  }
  if (isNaN(people) || people <= 0) {
    tipPerPersonEl.textContent = formatCurrency(0);
    totalPerPersonEl.textContent = formatCurrency(0);
    errorEl.textContent = 'Number of people must be at least 1.';
    return;
  }
  if (tipPct === null || isNaN(tipPct) || tipPct < 0) {
    // treat no tip as 0%
    tipPct = 0;
  }

  // Math:
  // total tip = bill * (tipPct/100)
  // tip per person = total tip / people
  // total per person = (bill / people) + tip per person
  const totalTip = bill * (tipPct / 100);
  const tipPerPerson = totalTip / people;
  const totalPerPerson = (bill / people) + tipPerPerson;

  tipPerPersonEl.textContent = formatCurrency(tipPerPerson);
  totalPerPersonEl.textContent = formatCurrency(totalPerPerson);
  errorEl.textContent = '';
}

// Tip button clicks
tipButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // toggle button as selected/inactive
    const pct = Number(btn.dataset.tip);
    if (selectedTip === pct) {
      // deselect
      selectedTip = null;
      btn.classList.remove('inactive');
    } else {
      selectedTip = pct;
      tipButtons.forEach(b => b.classList.remove('inactive'));
      btn.classList.add('inactive'); // visually mark selected (uses same class for styling)
      // clear custom input
      customTipInput.value = '';
    }
    calculate();
  });
});

// custom tip input
customTipInput.addEventListener('input', () => {
  // clear selected quick buttons when user types custom
  selectedTip = null;
  tipButtons.forEach(b => b.classList.remove('inactive'));
  calculate();
});

// inputs update
[billInput, peopleInput].forEach(inp => inp.addEventListener('input', calculate));

// Reset
resetBtn.addEventListener('click', () => {
  billInput.value = '';
  peopleInput.value = '';
  customTipInput.value = '';
  clearTipSelection();
  tipPerPersonEl.textContent = formatCurrency(0);
  totalPerPersonEl.textContent = formatCurrency(0);
  errorEl.textContent = '';
});

// initialize defaults
(function init(){
  billInput.value = '';
  peopleInput.value = '1';
  clearTipSelection();
  tipPerPersonEl.textContent = formatCurrency(0);
  totalPerPersonEl.textContent = formatCurrency(0);
})();