const form = document.querySelector('form');
const name = document.querySelector('#name');
const mail = document.querySelector('#mail');
const title = document.querySelector('#title');
const otherRole = document.querySelector('#other-title');
const design = document.querySelector('#design');
const color = document.querySelector('#color');
const colorOptions = color.querySelectorAll('option');
const colorSelect = document.querySelector('#colors-js-puns');
const activityField = document.querySelector('.activities');
const activityLabels = activityField.querySelectorAll('label');
const payment = document.querySelector('#payment');
const paymentOptions = payment.querySelectorAll('option');
const paymentDetails = document.querySelectorAll('#payment ~ div');
const ccNum = document.querySelector('#cc-num');
const zipCode = document.querySelector('#zip');
const cvv = document.querySelector('#cvv');
const errorColor = '#DC143C'; // error message color
let cost = 0;	// total activity cost

// when page load:
// hide "Other Job Role".
// hide all t-shirt colors.
// focus Name field.
// set Credit card payment to default.
// hide Paypal and Bitcoin payment.
// disable option "Select Payment Method".
// hide Color Selection
window.addEventListener('load', () => {
	hide(otherRole);
	colorOptions.forEach(option => hide(option));
	name.focus();
	payment.value = paymentOptions[1].value;
	hide(paymentDetails[1]);
	hide(paymentDetails[2]);
	paymentOptions[0].disabled = true;
	hide(colorSelect);
});

// ============================== 
// Interaction 
// ==============================

// show "Other Job Role" if "Other" is selected
title.addEventListener('change', () => {
	otherRole.style.display = (title.value === 'other') ? "block" : "none";
});

// show colors based on t-shirt theme
design.addEventListener('change', () => {
	let theme;

	if (design.value === 'js puns') {
		theme = 'JS Puns';
		show(colorSelect);
	}
	if (design.value === 'heart js') {
		theme = '♥ JS';
		show(colorSelect);
	}
	if (design.value === 'blank') {
		theme = 'select';
		hide(colorSelect);
	}
	colorOptions.forEach(option => option.style.display = 
		(option.innerText.includes(theme)) ? 'block' : 'none');
	// refresh default color option 
	color.value = document.querySelector('#color option[style="display: block;"]').value;
});

// show or hide conflicting activities 
activityField.addEventListener('change', (event) => {
	let text = event.target.parentNode.innerText;
	if (event.target.checked) {
		cost += getCost(text);	// add cost
		activityLabels.forEach(label => {
			if (isConflict(label.innerText, text)) {
				label.firstChild.disabled = true;	// disable the checkbox
				label.style.color = 'gray';	
			}
		});
	} else if (event.target.checked === false) {
			cost -= getCost(text);	// deduct cost
			activityLabels.forEach(label => {
			if (isConflict(label.innerText, text)) {
				label.firstChild.disabled = false; // re-enable the checkbox
				label.style.color = '#000';
			}
		});
	}
	document.querySelector('#cost').innerText = 'Total: $' + cost;
});

// show or hide payment method 
payment.addEventListener('change', () => {
	paymentDetails.forEach(detail => hide(detail));
	if (payment.value === 'credit card') show(paymentDetails[0]);
	if (payment.value === 'paypal') show(paymentDetails[1]);
	if (payment.value === 'bitcoin') show(paymentDetails[2]);
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

// ==============================
// Validation
// ==============================

// check error when input field is blur.
name.addEventListener('blur', () => handleInputError(validName(), name, 'Please provide your name'));
mail.addEventListener('blur', () => handleInputError(validMail(), mail, 'Please provide a valid email address'));
ccNum.addEventListener('blur', () => handleInputError(validCCNum()[0], ccNum, validCCNum()[1]));
zipCode.addEventListener('blur', () => handleInputError(validZipCode(), zipCode));
cvv.addEventListener('blur', () => handleInputError(validCVV(), cvv));

activityField.addEventListener('change', () => handleActivityError());

// check error when form submit
form.addEventListener('submit', (event) => { if (!validateForm()) event.preventDefault(); });

// call all the errorHandlers
// return true (no error), false (has error)
function validateForm() {
	let valid = true;
	if (handleInputError(validName(), name, 'Please provide your name')) 
		valid = false;
	if (handleInputError(validMail(), mail, 'Please provide a valid email address')) 
		valid = false;
	if (paymentOptions[1].selected) {
		if (handleInputError(validCCNum()[0], ccNum, validCCNum()[1])) valid = false;
		if (handleInputError(validZipCode(), zipCode)) valid = false;
		if (handleInputError(validCVV(), cvv)) valid = false;
	}
	if (handleActivityError()) valid = false;
	return valid;
}

// take a Validation condition, a DOM element, an optional Error message
// check and handle input error
// return true (has error) or false (no error)
function handleInputError(condition, node, message = null) {
	if (node.previousElementSibling.className.includes('error')) {
		node.previousElementSibling.remove();
	}
	if (!condition) {
		if (message !== null) {
			let error = document.createElement('span');
			error.className = 'error'; 
			error.innerText = `${message}:`;
			node.parentElement.insertBefore(error, node);
			hide(error.previousElementSibling);
		}
		node.previousElementSibling.style.color = errorColor;
		return true;
	} else {
		show(node.previousElementSibling);
		node.previousElementSibling.style.color = '#000';
		return false;
	}
}

function validName() { return (name.value === '') ? false : true; }

// validate email string, return true (valid) or false (invalid)
function validMail() {
	let regex = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
	return regex.test(mail.value);
}

// check and handle Activity error, return true (has error) or false (no error)
function handleActivityError() {
	if (!itemSelected()) {
		let error = document.createElement('span');
		error.className = 'error';
		error.style.color = errorColor;
		error.innerText = '(Please select at least one Activity)';
		if (!activityField.querySelector('.error'))
			activityField.insertBefore(error, activityLabels[0]);
		return true;
	} else {
		if (activityField.querySelector('.error'))
			activityField.querySelector('.error').remove();
		return false;
	}
}

// check if at least one activity is selected, return true (yes) or false (no)
function itemSelected() {
	let result = false;
	let activityOptions = document.querySelectorAll('input');
	activityOptions.forEach(option => {
		if (option.checked) result = true;
	});
	return result;
}

// return value is an array of Boolean and String.
// return true (vaild) or false (invalid)
// return error message 
function validCCNum() {
	let valid = true;
	let errorMessage;
	let num = ccNum.value;
	if (num === '') {
		errorMessage = 'Please enter credit card number';
		valid = false;
	} else {
		for (let i = 0; i < num.length; i++) {
			if (num[i].charCodeAt() > 57 || num[i].charCodeAt() < 48) {
				errorMessage = 'Please enter number only';
				valid = false;
			} else if (num.length > 16 || num.length < 13) {
				errorMessage = 'Please enter a 13-16 digit long number';
				valid = false;
			}
		}	
	}
	return [valid, errorMessage];
}

// return true (vaild) or false (invalid)
function validZipCode() {
	let result = true;
	let num = zipCode.value;
	if (num === '') result = false;
	for (let i = 0; i < num.length; i++) {
		if (num[i].charCodeAt() > 57 || num[i].charCodeAt() < 48 || num.length !== 5) result = false;
	}	
	return result;
}

// return true (vaild) or false (invalid)
function validCVV() {
	let result = true;
	let num = cvv.value;
	if (num === '') result = false;
	for (let i = 0; i < num.length; i++) {
		if (num[i].charCodeAt() > 57 || num[i].charCodeAt() < 48 || num.length !== 3) result = false;
	}	
	return result;
}

function show(node) { node.style.display = 'block'; }
function hide(node) { node.style.display = 'none'; }