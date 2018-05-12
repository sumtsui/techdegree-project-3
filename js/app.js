const name = document.querySelector('#name');
const titleSelect = document.querySelector('#title');
const otherRole = document.querySelector('#other-title');
const design = document.querySelector('#design');
const colorSelect = document.querySelector('#color');
const colorOptions = document.querySelectorAll('#color option');
const activityField = document.querySelector('.activities');
const activityLabels = document.querySelectorAll('.activities label');
let cost = 0;

// when page load:
// hide "Other Job Role"
// hide all t-shirt colors
// focus the name field
window.addEventListener('load', () => {
	otherRole.style.display = "none";
	colorOptions
		.forEach(option => option.style.display = 'none');
	name.focus();
});

// show "Other Job Role" if "Other" is selected
titleSelect.addEventListener('change', () => {
	if (titleSelect.value === 'other') 
		otherRole.style.display = "block";
	else otherRole.style.display = "none";
});

// show colors based on t-shirt theme
design.addEventListener('change', () => {
	let shirt;
	if (design.value === 'js puns') shirt = 'JS Puns';
	if (design.value === 'heart js') shirt = '♥ JS';
	if (design.value === 'blank') shirt = 'select';
	colorOptions.forEach(option => {
		if (option.innerText.includes(shirt)) 
			option.style.display = 'block';
		else option.style.display = 'none';
	});
	// refresh default color option
	colorSelect.value = document.querySelector('#color option[style="display: block;"]').value;
});

// activity checkbox
activityField.addEventListener('change', (event) => {
	let text = event.target.parentNode.innerText;
	if (event.target.checked) {
		cost += getCost(text);	// add cost
		activityLabels.forEach(label => {
			if (findConflict(label.innerText, text)) {
				// set conflicting activity
				label.firstChild.disabled = true;
				label.style.color = 'gray';
			}
		});
	} else if (event.target.checked === false) {
			cost -= getCost(text);	// deduct cost
			activityLabels.forEach(label => {
			if (findConflict(label.innerText, text)) {
				// release conflicting activity
				label.firstChild.disabled = false;
				label.style.color = '#000';
			}
		});
	}
	// show cost on page
	document.querySelector('#cost').innerText = '$' + cost;
});

// take 2 activities, return whether they have conflicting time.
function findConflict(string1, string2) {
	let substr1 = string1.substring(string1.indexOf('—'), string1.indexOf('$'));
	let substr2 = string2.substring(string2.indexOf('—'), string2.indexOf('$'));
	if ( substr1 === substr2 && string1 !== string2) return true;
	else return false;
}

// take activity, return its cost.
function getCost(string) {
	return parseInt(string.substr(string.indexOf('$') + 1));
}