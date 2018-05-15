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
let cost = 0;
const payment = document.querySelector('#payment');
const paymentOptions = payment.querySelectorAll('option');
const paymentDetails = document.querySelectorAll('#payment ~ div');
const errorColor = '#DC143C';
// const creditCard = document.querySelector('#cc-num');

// when page load:
// hide "Other Job Role"
// hide all t-shirt colors
// focus Name field
// set Credit card payment to default
// hide Paypal and Bitcoin payment
// disable "Select Payment Method"
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
	// asign value that exist in color description to theme
	if (design.value === 'js puns') theme = 'JS Puns';
	if (design.value === 'heart js') theme = '♥ JS';
	if (design.value === 'blank') theme = 'select';
	// check and show the colors belong to the theme
	colorOptions.forEach(option => option.style.display = 
		(option.innerText.includes(theme)) ? 'block' : 'none');
	// refresh default color option
	color.value = document.querySelector('#color option[style="display: block;"]').value;
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
	document.querySelector('#cost').innerText = 'Total: $' + cost;
});

payment.addEventListener('change', () => {
	paymentDetails.forEach(detail => hide(detail));
	if (payment.value === 'credit card') show(paymentDetails[0]);
	if (payment.value === 'paypal') show(paymentDetails[1]);
	if (payment.value === 'bitcoin') show(paymentDetails[2]);
});

name.addEventListener('blur', () => handleNameError());
mail.addEventListener('blur', () => handleMailError());
// creditCard.addEventListener('blur', () => handleCreditCardError());

form.addEventListener('submit', (event) => {
	if (!formValidate()) event.preventDefault();
});

function formValidate() {
	let isValid = true;
	if (!handleNameError()) isValid = false;
	if (!handleMailError()) isValid = false;
	if (!handleActivityError()) isValid = false;
	if (!handleCreditCardError()) isValid = false;

	return isValid;
}

function handleNameError() {
	let result = true;
	if (name.value === '') { 
		result = false;
		let error = document.createElement('span');
		error.className = 'error'; 
		error.innerText = ' (please provide your name)';
		if (name.previousElementSibling.children.length < 1) {
			name.previousElementSibling.appendChild(error);
		}
		name.previousElementSibling.style.color = errorColor;
	} else {
		if (name.previousElementSibling.contains(document.querySelector('.error'))) {
			name.previousElementSibling.removeChild(document.querySelector('.error'));
			name.previousElementSibling.style.color = '#000';
		}
	}
	return result;
}

function handleMailError() {
	let result = true;
	if (!validEmail(mail.value)) {
		result = false;
		let error = document.createElement('span');
		error.className = 'mail error'; 
		error.innerText = ' (please provide a valid email address)';
		if (mail.previousElementSibling.children.length < 1) {
			mail.previousElementSibling.appendChild(error);
		}
		mail.previousElementSibling.style.color = errorColor;
	} else {
		if (mail.previousElementSibling.contains(document.querySelector('.mail.error'))) {
			mail.previousElementSibling.removeChild(document.querySelector('.mail.error'));
			mail.previousElementSibling.style.color = '#000';
		}
	}
	return result;
}

function handleActivityError() {
	let result = true;
	if (!noneSelected()) {
		result = false;
		let error = document.createElement('span');
		error.className = 'error';
		error.style.color = errorColor;
		error.innerText = '(Please select an Activity)';
		if (!activityField.contains(activityField.querySelector('.error'))) {
			activityField.insertBefore(error, activityLabels[0]);
		} 
	} else {
		if (activityField.querySelector('.error')) {
			activityField.removeChild(activityField.querySelector('.error'));
		}
	}
	return result;
}

function handleCreditCardError() {
	let result = true;
	if (paymentOptions[1].selected) {
		if (inValidCreditCard('cc-num') === 'cc-num') {
			result = false;
			document.querySelector(`#cc-num`).previousElementSibling.style.color = errorColor;
		} else {
			document.querySelector(`#cc-num`).previousElementSibling.style.color = '#000';
		}

		if (inValidCreditCard('zip') === 'zip') {
			result = false;
			document.querySelector(`#zip`).previousElementSibling.style.color = errorColor;
		} else {
			document.querySelector(`#zip`).previousElementSibling.style.color = '#000';
		}

		if (inValidCreditCard('cvv') === 'cvv') {
			result = false;
			document.querySelector(`#cvv`).previousElementSibling.style.color = errorColor;
		} else {
			document.querySelector(`#cvv`).previousElementSibling.style.color = '#000';
		}
	}
	return result;
}

function creditError(info) {
	let result = true;
	if (inValidCreditCard(info) === info) {
		result = false;
		document.querySelector(`#${info}`).previousElementSibling.style.color = errorColor;
	} else {
		document.querySelector(`#${info}`).previousElementSibling.style.color = '#000';
	}
	return result;
}

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

function validEmail(string) {
	let isValid = false;
	// check there is a '@' and it is not at the start or end
	if (string.indexOf('@') <= 0 || string.lastIndexOf('@') === string.length - 1)
		return isValid; 
	// check there is a '.' and it is not at the start or end
	if (string.indexOf('.') <= 0 || string.lastIndexOf('.') === string.length - 1) 
		return isValid;
	// check the part after the first "@" 
	let substring = string.substr(string.indexOf('@') + 1);
	console.log('after the @', substring);
	for (let i = 0; i < substring.length; i++) {
		console.log(substring[i], substring[i].charCodeAt());
		// if there is any string's unicode value over 122:
		if (substring[i].charCodeAt() > 122) return isValid;
		// if there is any string's unicode value btw 57 and 97:
		else if (substring[i].charCodeAt() < 97 && substring[i].charCodeAt() > 57) return isValid;
		// if there is any string's unicode value below 48 and not a ".":
		else if (substring[i].charCodeAt() < 48 && substring[i].charCodeAt() !== 46) return isValid;
		// if there is no ".":
		else if (!substring.includes('.')) return isValid;
	}
	// validate the part before the first "@"
	substring = string.substr(0, string.indexOf('@'));
	console.log('before the @', substring);
	for (let i = 0; i < substring.length; i++) {
		console.log(substring[i], substring[i].charCodeAt());
		// if there is any string's unicode value over 122:
		if (substring[i].charCodeAt() > 122) return isValid;
		// if there is any string's unicode value btw 57 and 97 and not a "_":
		else if (substring[i].charCodeAt() < 97 && substring[i].charCodeAt() > 57 && substring[i].charCodeAt() !== 95) return isValid;
		// if there is any string's unicode value below 48 and not a "." or "-":
		else if (substring[i].charCodeAt() < 48 && substring[i].charCodeAt() !== 46 && substring[i].charCodeAt() !== 45) return isValid;
	}
	return true;
}

function noneSelected() {
	let selected = false;
	let activityOptions = document.querySelectorAll('input');
	activityOptions.forEach(option => {
		if (option.checked) selected = true;
	});
	return selected;
}

function inValidCreditCard(info) {
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