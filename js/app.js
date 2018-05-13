const form = document.querySelector('form');
const name = document.querySelector('#name');
const title = document.querySelector('#title');
const otherRole = document.querySelector('#other-title');
const design = document.querySelector('#design');
const colorSelect = document.querySelector('#color');
const colorOptions = document.querySelectorAll('#color option');
const activityField = document.querySelector('.activities');
const activityLabels = document.querySelectorAll('.activities label');
let cost = 0;
const payment = document.querySelector('#payment');
const paymentOptions = payment.querySelectorAll('option');
const paymentDetails = document.querySelectorAll('#payment ~ div');

// when page load:
// hide "Other Job Role"
// hide all t-shirt colors
// focus the name field
window.addEventListener('load', () => {
	hide(otherRole);
	colorOptions.forEach(option => hide(option));
	name.focus();
	payment.value = paymentOptions[1].value;
	hide(paymentDetails[1]);
	hide(paymentDetails[2]);
	paymentOptions[0].disabled = true;
});

// show "Other Job Role" if "Other" is selected
title.addEventListener('change', () => {
	otherRole.style.display = (title.value === 'other') ? "block" : "none";
});

// show colors based on t-shirt theme
design.addEventListener('change', () => {
	let theme;
	// asign part of string exist in color to theme
	if (design.value === 'js puns') theme = 'JS Puns';
	if (design.value === 'heart js') theme = '♥ JS';
	if (design.value === 'blank') theme = 'select';
	// check and show the colors belong to the theme
	colorOptions.forEach(option => option.style.display = 
		(option.innerText.includes(theme)) ? 'block' : 'none');
	// refresh default color option
	colorSelect.value = document.querySelector('#color option[style="display: block;"]').value;
});

// activity checkbox
activityField.addEventListener('change', (event) => {
	let text = event.target.parentNode.innerText;
	if (event.target.checked) {
		cost += getCost(text);	// add cost
		activityLabels.forEach(label => {
			if (isConflict(label.innerText, text)) {
				// set conflicting activity
				label.firstChild.disabled = true;
				label.style.color = 'gray';
			}
		});
	} else if (event.target.checked === false) {
			cost -= getCost(text);	// deduct cost
			activityLabels.forEach(label => {
			if (isConflict(label.innerText, text)) {
				// release conflicting activity
				label.firstChild.disabled = false;
				label.style.color = '#000';
			}
		});
	}
	// show cost on page
	document.querySelector('#cost').innerText = '$' + cost;
});

payment.addEventListener('change', () => {
	let method = payment.value;
	paymentDetails.forEach(detail => detail.style.display = 'none');
	switch (method) {
		case 'credit card': 
			show(paymentDetails[0]);
			break;
		case 'paypal':
			show(paymentDetails[1]);
			break;
		case 'bitcoin':
			show(paymentDetails[2]);
			break;
		}
});

form.addEventListener('submit', () => {
	
});

// take 2 activities, return whether they have conflicting time.
function isConflict(string1, string2) {
	let substr1 = string1.substring(string1.indexOf('—'), string1.indexOf('$'));
	let substr2 = string2.substring(string2.indexOf('—'), string2.indexOf('$'));
	return ( substr1 === substr2 && string1 !== string2);
}

// take activity, return its cost.
function getCost(string) {
	return parseInt(string.substr(string.indexOf('$') + 1));
}

function show(node) {
	node.style.display = 'block';
}

function hide(node) {
	node.style.display = 'none';
}