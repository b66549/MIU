// Name: Rolando Velasco
// Term: VFW 1303
// Project Part 4

// Line to wait until the DOM is ready
window.addEventListener("DOMContentLoaded", function() {
	
	// function to create the select field element
	function makeExpenseTypes() {
		var selectList = document.getElementById("selecttype"), createSelect = document.createElement("select");
		createSelect.setAttribute("id", "types");
	
		for(var i = 0, j = expenseTypes.length; i < j; i++) {
			var createOption = document.createElement("option");
			var optionText = expenseTypes[i];
			createOption.setAttribute("value", optionText);
			createOption.innerHTML = optionText;
			createSelect.appendChild(createOption);
		}
		selectList.appendChild(createSelect);
	
	}
	
	function getCreditCheckBoxValue() {
		if(document.getElementById("credit").checked) {
			creditValue = document.getElementById("credit").value;
		} else {
			creditValue = "This Is An Expense";
		}
	}
	
	function addNewExpense(key) {
	
	// Check if a key was passed.  A key will come from editExpense.
	// Saving a new expense will send no key, but create a randomly generated key
	if(!key) {
			// random number generator
			var uniqueID = Math.floor(Math.random() * 1000001);
	} else {
		uniqueID = key;
	}
		
		// Find out if Credit checkbox is checked or not
		getCreditCheckBoxValue();
		
		// Initialize the local variables with the html elements
		// Create an Object with each property an array that contains the form label and the input value
		var expenseObj 					= {};
		expenseObj.expenseSubject 		= ["Expense:", document.getElementById("expensesubject").value];
		expenseObj.expenseAmount		= ["Expense Amount:", document.getElementById("expenseamount").value];
		expenseObj.expenseType 			= ["Expense Type:", document.getElementById("types").value];
		expenseObj.expenseDate 			= ["Expense Date:", document.getElementById("expensedate").value];
		expenseObj.expenseImportance 	= ["Expense Importance:", document.getElementById("expenseimportance").value];
		expenseObj.details 				= ["Details:", document.getElementById("details").value];
		expenseObj.credit 				= ["Is This A Credit?:", creditValue];
			
		// Save the data into local Storage
		// Use Stringify to convert the object into a string
		localStorage.setItem(uniqueID, JSON.stringify(expenseObj));
		alert("Expense Saved!");
	}
	
	function toggleDisplay() {
		if (flagDisplayData) {
			flagDisplayData = false;
			document.getElementById("expenseform").style.display = "block";
			document.getElementById("clear").style.display = "inline";
			document.getElementById("display").style.display = "inline";
			document.getElementById("add").style.display = "none";
			document.getElementById("expenses").style.display = "none";
		} else {
			flagDisplayData = true;
			document.getElementById("expenseform").style.display = "none";
			document.getElementById("clear").style.display = "inline";
			document.getElementById("display").style.display = "none";
			document.getElementById("add").style.display = "inline";
		}
	}
	
	// Grab the data from Local Storage and display it on screen
	function displayExpensesList() {
		
		if (localStorage.length === 0) {
			alert("There are no expenses in Local Storage so default expense data was added.");
			displayDefaultExpensesList();
		}
		
		// toggle function to display the data
		toggleDisplay();
		
		// Create a div tag IF one has not been created.
		// If the list has been created, skip this block of code and only display the current list
		if(document.getElementById("expenses") === null) {
			var createDisplayExpensesDiv = document.createElement("div");
			createDisplayExpensesDiv.setAttribute("id", "expenses");
			var createUList = document.createElement("ul");
			createDisplayExpensesDiv.appendChild(createUList);
			document.body.appendChild(createDisplayExpensesDiv);
			document.getElementById("expenses").style.display = "block";
			for (var i = 0, j = localStorage.length; i < j; i++) {
				var createListItem = document.createElement("li");
				var createLinksList = document.createElement("li");
				createUList.appendChild(createListItem);
				var key = localStorage.key(i);
				var value = localStorage.getItem(key);
				
				// "parse" converts string value from Local Storage back into an object
				var expenseObj = JSON.parse(value);
			
				var createSubUList = document.createElement("ul");
				createSubUList.setAttribute("class", "expenseinfo");
				createListItem.appendChild(createSubUList);
				
				// Add image thumbnail to expense based on the type
				getExpenseTypeImage(expenseObj.expenseType[1], createSubUList);
				
				
				for(var n in expenseObj) {
					var createSubListItem = document.createElement("li");
					createSubUList.appendChild(createSubListItem);
					var expenseObjText = expenseObj[n][0] + " " + expenseObj[n][1];
					createSubListItem.innerHTML = expenseObjText;
					createSubUList.appendChild(createLinksList);
				}
				
				// calling the function that will create links for each expense
				createExpenseLinks(localStorage.key(i), createLinksList);
			}
		} else {
			document.getElementById("expenses").style.display = "block";
		}
	}
	
	// function to get the image corresponding to the expense type
	function getExpenseTypeImage(imageName, createSubUList) {
		var imageListItem = document.createElement("li");
		createSubUList.appendChild(imageListItem);
		var newExpenseTypeImage = document.createElement("img");
		var setSource = newExpenseTypeImage.setAttribute("src", "img/" + imageName + ".png");
		imageListItem.appendChild(newExpenseTypeImage);
	}
	
	// function to pull JSON data from json.js file and save into Local Storage as default data
	function displayDefaultExpensesList() {
		for (var n in json) {
			// random number generator
			var uniqueID = Math.floor(Math.random() * 1000001);
			
			localStorage.setItem(uniqueID, JSON.stringify(json[n]));
		}
	}
	
	// Function to create buttons for editing and deleting an expense in the list
	function createExpenseLinks(key, createLinksList) {
		
		// adds edit expense link
		var editExpenseLink = document.createElement("a");
		editExpenseLink.href = "#";
		editExpenseLink.key = key;
		editExpenseLink.setAttribute("class", "expenselinks");
		editExpenseText = "Edit Expense";
		editExpenseLink.addEventListener("click", editExpense);
		editExpenseLink.innerHTML = editExpenseText;
		createLinksList.appendChild(editExpenseLink);
	
		// adds delete expense link
		var deleteExpenseLink = document.createElement("a");
		deleteExpenseLink.href = "#";
		deleteExpenseLink.key = key;
		deleteExpenseLink.setAttribute("class", "expenselinks");
		deleteExpenseText = "Delete Expense";
		deleteExpenseLink.addEventListener("click", deleteExpense);
		deleteExpenseLink.innerHTML = deleteExpenseText;
		createLinksList.appendChild(deleteExpenseLink);
	
	}
	
	// function to edit the expense
	function editExpense() {

	
		// grab the data from this specific expense from Local Storage
		var value = localStorage.getItem(this.key);
		var expenseObj = JSON.parse(value);
		
		// bring back the form to the display
		toggleDisplay();
	
		// fill in the form with this specific expense data pulled from Local Storage
		document.getElementById("expensesubject").value = expenseObj.expenseSubject[1];
		document.getElementById("expenseamount").value = expenseObj.expenseAmount[1];
		document.getElementById("types").value = expenseObj.expenseType[1];
		document.getElementById("expensedate").value = expenseObj.expenseDate[1];
		document.getElementById("expenseimportance").value = expenseObj.expenseImportance[1];
		document.getElementById("details").value = expenseObj.details[1];
		if (expenseObj.credit[1] === "This Is A Credit") {
			document.getElementById("credit").checked = true;
		} else {
			document.getElementById("credit").checked = false;
		}
		
		// Remove the event listener from the "save expense" button
		saveExpenseButton.removeEventListener("click", addNewExpense);
		
		// Change the "save expense" value to "edit expense"
		document.getElementById("saveexpense").value = "Edit Expense";
		var editSaveExpense = document.getElementById("saveexpense");
		
		editSaveExpense.addEventListener("click", validate);
		editSaveExpense.key = this.key;
	}
	
	function deleteExpense() {
		var ask = confirm("Are you sure you want to delete this expense?");
		if (ask) {
			localStorage.removeItem(this.key);
			alert("Expense was deleted.");
			window.location.reload();
		} else {
			alert("Expense was not deleted.");
		}
	
	
	
	}
	
	function clearExpensesList() {
		if(localStorage.length === 0) {
			alert("There are no expenses to remove.");
		} else {
			localStorage.clear();
			alert("All expenses are deleted.");
			window.location.reload();
			return false;
		}
	}
	
	function validate(eventData) {
		// elements to check
		var getExpenseSubject = document.getElementById("expensesubject");
		var getExpenseAmount = document.getElementById("expenseamount");
		var getExpenseType = document.getElementById("types");
		
		// Clear any current error messages
		errorMessages.innerHTML = "";
		
		// Reset borders
		getExpenseSubject.style.border = "1px solid black";
		getExpenseAmount.style.border = "1px solid black";
		getExpenseType.style.border = "1px solid black";

		// error messages
		var errorMessageArray = [];
		
		// expense subject validation
		if(getExpenseSubject.value === "") {
			var expenseSubjectError = "Please enter an expense.";
			getExpenseSubject.style.border = "1px solid red";
			errorMessageArray.push(expenseSubjectError);
		}

		// expense amount validation
		if(getExpenseAmount.value === "") {
			var expenseAmountError = "Please enter an amount.";
			getExpenseAmount.style.border = "1px solid red";
			errorMessageArray.push(expenseAmountError);
		}
		
		// expense type validation
		if(getExpenseType.value === "--Choose a Type--") {
			var typeError = "Please select an expense type.";
			getExpenseType.style.border = "1px solid red";
			errorMessageArray.push(typeError);
		}
		
		// display errors on the screen if required form fields are not valid
		if(errorMessageArray.length > 0) {
			for(var i = 0, j = errorMessageArray.length; i < j; i++) {
				var text = document.createElement("li");
				text.innerHTML = errorMessageArray[i];
				errorMessages.appendChild(text);
			}
			eventData.preventDefault();
			return false;
		} else {
			addNewExpense(this.key);
		}
	}
	
	// array for the expense types
	var expenseTypes = ["--Choose a Type--", "Food", "Clothing", "Housing", "Entertainment", "Other"];
	var creditValue = "This Is An Expense";
	errorMessages = document.getElementById("errors");
	makeExpenseTypes();
	
	// toggle variable for checking when to hide the form to display the data or vice versa
	var flagDisplayData = false;
	
	var saveExpenseButton = document.getElementById("saveexpense");
	saveExpenseButton.addEventListener("click", validate);
	
	var displayDataLink = document.getElementById("display");
	displayDataLink.addEventListener("click", displayExpensesList);
	
	var clearDataLink = document.getElementById("clear");
	clearDataLink.addEventListener("click", clearExpensesList);

});