const form = document.querySelector('form');
const name = document.querySelector('#name');
const mail = document.querySelector('#mail');
const title = document.querySelector('#title');
const otherRole = document.querySelector('#other-title');
const design = document.querySelector('#design');
const color = document.querySelector('#color');
const colorOptions = color.querySelectorAll('option');
const activityField = document.querySelector('.activities');
const activityLabels = activityField.querySelectorAll('label');
let cost = 0;	// total activity cost
const payment = document.querySelector('#payment');
const paymentOptions = payment.querySelectorAll('option');
const paymentDetails = document.querySelectorAll('#payment ~ div');
const errorColor = '#DC143C';
const ccNum = document.querySelector('#cc-num');
const zipCode = document.querySelector('#zip');
const cvv = document.querySelector('#cvv');

// when page load:
// hide "Other Job Role".
// hide all t-shirt colors.
// focus Name field.
// set Credit card payment to default.
// hide Paypal and Bitcoin payment.
// disable option "Select Payment Method".
window.addEventListener('load', () => {
	hide(otherRole);
	colorOptions.forEach(option => hide(option));
	name.focus();
	payment.value = paymentOptions[1].value;
	hide(paymentDetails[1]);
	hide(paymentDetails[2]);
	paymentOptions[0].disabled = true;
});

// ~~~~~~~~~~~~~~ Interaction ~~~~~~~~~~~~~~~

// show "Other Job Role" if "Other" is selected
title.addEventListener('change', () => {
	otherRole.style.display = (title.value === 'other') ? "block" : "none";
});

// show colors based on t-shirt theme
design.addEventListener('change', () => {
	let theme;
	// asign value that match the color descriptions to theme
	if (design.value === 'js puns') theme = 'JS Puns';
	if (design.value === 'heart js') theme = '♥ JS';
	if (design.value === 'blank') theme = 'select';
	// check and show the colors belong to the theme
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

// ~~~~~~~~~~~~~~ Validation ~~~~~~~~~~~~~~~

// check error when user finish typing and move on.
name.addEventListener('blur', () => hasNameError());
mail.addEventListener('blur', () => hasMailError());
activityField.addEventListener('change', () => hasActivityError());
ccNum.addEventListener('blur', (event) => hasCreditCardError(event.target.id));
zipCode.addEventListener('blur', (event) => hasCreditCardError(event.target.id));
cvv.addEventListener('blur', (event) => hasCreditCardError(event.target.id));

// check error when form submit
form.addEventListener('submit', (event) => {
	if (!formValidate()) event.preventDefault();
});

function formValidate(event) {
	let valid = true;
	if (hasNameError()) valid = false;
	if (hasMailError()) valid = false;
	if (hasActivityError()) valid = false;
	if (paymentOptions[1].selected) {
		if (hasCreditCardError('cc-num')) valid = false;
		if (hasCreditCardError('zip')) valid = false;
		if (hasCreditCardError('cvv')) valid = false;
	}
	return valid;
}

// check and handle Name error, return true (has error) or false (no error)
function hasNameError() {
	let label = name.previousElementSibling;
	if (name.value === '') { 
		let error = document.createElement('span');
		error.className = 'error'; 
		error.innerText = ' (please provide your name)';
		if (label.children.length < 1) {
			label.appendChild(error);
		}
		label.style.color = errorColor;
		return true;
	} else {
		if (label.contains(document.querySelector('.error'))) {
			label.removeChild(document.querySelector('.error'));
			label.style.color = '#000';
		}
		return false;
	}
}

// check and handle Email error, return true (has error) or false (no error)
function hasMailError() {
	let label = mail.previousElementSibling;
	if (!validMail()) {
		let error = document.createElement('span');
		error.className = 'mail error'; 
		error.innerText = ' (please provide a valid email address)';
		if (label.children.length < 1) {
			label.appendChild(error);
		}
		label.style.color = errorColor;
		return true;
	} else {
		if (label.contains(document.querySelector('.mail.error'))) {
			label.removeChild(document.querySelector('.mail.error'));
			label.style.color = '#000';
		}
		return false;
	}
}

// validate email string, return true (valid) or false (invalid)
function validMail() {
	let string = mail.value;
	let result = false;
	// check there is a '@' and it is not at the start or end
	if (string.indexOf('@') <= 0 || string.lastIndexOf('@') === string.length - 1)
		return result; 
	// check there is a '.' and it is not at the start or end
	if (string.indexOf('.') <= 0 || string.lastIndexOf('.') === string.length - 1) 
		return result;
	// check the part after the first "@" 
	let substring = string.substr(string.indexOf('@') + 1);
	console.log('after the @', substring);
	for (let i = 0; i < substring.length; i++) {
		console.log(substring[i], substring[i].charCodeAt());
		// if there is any string's unicode value over 122:
		if (substring[i].charCodeAt() > 122) return result;
		// if there is any string's unicode value btw 57 and 97:
		else if (substring[i].charCodeAt() < 97 && substring[i].charCodeAt() > 57) return result;
		// if there is any string's unicode value below 48 and not a ".":
		else if (substring[i].charCodeAt() < 48 && substring[i].charCodeAt() !== 46) return result;
		// if there is no ".":
		else if (!substring.includes('.')) return result;
	}
	// validate the part before the first "@"
	substring = string.substr(0, string.indexOf('@'));
	console.log('before the @', substring);
	for (let i = 0; i < substring.length; i++) {
		console.log(substring[i], substring[i].charCodeAt());
		// if there is any string's unicode value over 122:
		if (substring[i].charCodeAt() > 122) return result;
		// if there is any string's unicode value btw 57 and 97 and not a "_":
		else if (substring[i].charCodeAt() < 97 && substring[i].charCodeAt() > 57 && substring[i].charCodeAt() !== 95) return result;
		// if there is any string's unicode value below 48 and not a "." or "-":
		else if (substring[i].charCodeAt() < 48 && substring[i].charCodeAt() !== 46 && substring[i].charCodeAt() !== 45) return result;
	}
	return true;
}

// check and handle Activity error, return true (has error) or false (no error)
function hasActivityError() {
	if (!itemSelected()) {
		let error = document.createElement('span');
		error.className = 'error';
		error.style.color = errorColor;
		error.innerText = '(Please select at least one Activity)';
		if (!activityField.contains(activityField.querySelector('.error'))) {
			activityField.insertBefore(error, activityLabels[0]);
		} 
		return true;
	} else {
		if (activityField.querySelector('.error')) {
			activityField.removeChild(activityField.querySelector('.error'));
		}
		return false;
	}
}

// check if at least one activity is selected. 
function itemSelected() {
	let result = false;
	let activityOptions = document.querySelectorAll('input');
	activityOptions.forEach(option => {
		if (option.checked) result = true;
	});
	return result;
}

// check and handle Credit Card error, return true (has error) or false (no error)
function hasCreditCardError(info) {
	if (validCreditCard(info) !== true) {
		document.querySelector(`#${info}`).previousElementSibling.style.color = errorColor;
		return true;
	} else {
		document.querySelector(`#${info}`).previousElementSibling.style.color = '#000';
		return false;
	}
}

// validate Credit Card info, return true (valid) or the invalid field's id.
function validCreditCard(info) {
	let num = document.querySelector(`#${info}`).value;
	if (num === '') return info;
	for (let i = 0; i < num.length; i++) {
		if (num[i].charCodeAt() > 57 || num[i].charCodeAt() < 48) return info;
		switch (info) {
			case 'cc-num':
				if (num.length > 16 || num.length < 13) return info;
				break;
			case 'zip':
				if (num.length !== 5) return info;
				break;
			case 'cvv':
				if (num.length !== 3) return info;
				break;
		}
	}
	return true;
}

function show(node) {
	node.style.display = 'block';
}

function hide(node) {
	node.style.display = 'none';
}