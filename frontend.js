$(document).ready(function() {

	var employees = []
	var classes = []

	$("#backToEmployeeEntry").on("click", function () {
		$("#hoursEntryNav").addClass('hidden');
		$("#employeeHoursEntryContainer").addClass('hidden');

		$("#employeeNameEntryContainer").removeClass('hidden');
		$("#employeeEntryNav").removeClass('hidden');
	})

	$("#backToHoursEntry").on("click", function () {
		$("#revenueEntryNav").addClass('hidden');
		$("#revenueEntryContainer").addClass('hidden');

		$("#employeeHoursEntryContainer").removeClass('hidden');
		$("#hoursEntryNav").removeClass('hidden');
	})

	$("#proceedToRevenueEntry").on("click", function () {
		$("#revenueEntryNav").removeClass('hidden');
		$("#revenueEntryContainer").removeClass('hidden');

		$("#employeeHoursEntryContainer").addClass('hidden');
		$("#hoursEntryNav").addClass('hidden');
	})

	$("#backToRevenueEntry").on("click", function () {
		$("#poolResultsNav").addClass('hidden');
		$("#poolResultsContainer").addClass('hidden');

		$("#revenueEntryNav").removeClass('hidden');
		$("#revenueEntryContainer").removeClass('hidden');
	})

	$( "#addEmployeeButton" ).on("click", function() {
		/*
		Add a new employee.
		*/
		var newEmployee = $("#employeeNameInput").val();
		if (employees.indexOf(newEmployee) != -1) {
			// prevent duplicate employees
			// why the double negative?
		} else {
			if (newEmployee != "") {
				var newItem = jQuery('<a/>', {
					class: "list-group-item",
				    text: newEmployee
				})
				newItem.appendTo('#employeeAndClassList')
				$("#employeeNameInput").val("")
				employees.push(newEmployee)
			}
		}
	});

	$( "#addClassButton" ).on("click", function() {
		/*
		Add a new Class
		*/
		var newClass = $("#employeeClassInput").val();
		if (classes.indexOf(newClass) != -1) {
			// prevent duplicate class names
		} else {
			if (typeof(newClass) == "string" && newClass != "") {
				$("#employeeClassDropdown").append("<li><a>"+newClass+"</a></li>")
				$("#classList").append("<a class=\"list-group-item\">"+newClass+"</a>")
				$("#employeeClassInput").val("")
				classes.push(newClass)
			}
		}
	});


	$( "#classList" ).on( "click", 'a', function() {
		/*
		Remove an existing class
		*/
	    var removedClass = $( this ).text()

	    // remove the class from both lists
	    $( this ).remove()
	    $( "#employeeClassDropdown li" ).each( function() {

	    	if (removedClass == $(this).text()) {
	    		$(this).remove()
	    	}
	    })

	    var index = classes.indexOf(removedClass)
	    console.log(index)
	    if (index > -1) {
		    classes.splice(index, 1);
		}
	});


	$( "#addEmployeeAndClassButton" ).on("click", function() {
		/*
		Add a new employee with a selected class.
		*/
		var newEmployee = $("#employeeNameInput").val();
		var classOfNewEmployee = $("#employeeClassDropdownLabel").text();
		if (employees.indexOf(newEmployee) != -1) {
			// prevent duplicate employees
			// why the double negative?
		} else {
			if (newEmployee != "") {
				var newSpan = jQuery('<span></span>', {
					class: "badge",
					text: classOfNewEmployee
				})
				var newItem = jQuery('<a/>', {
					class: "list-group-item",
				    text: newEmployee
				})
				newSpan.appendTo(newItem);
				newItem.appendTo('#employeeAndClassList')
				$("#employeeNameInput").val("")
				employees.push(newEmployee)
			}
		}
	});


	$( "#employeeAndClassList" ).on( "click", 'a', function() {
		/*
		Remove the clicked employee from the list of employees
		*/
	    var removedEmployee = $( this ).contents().get(0).nodeValue
	    console.log(removedEmployee)

	    // remove the class from both lists
	    $( this ).remove()

	    var index = employees.indexOf(removedEmployee)
	    console.log(index)
	    if (index > -1) {
		    employees.splice(index, 1);
		}
	});

	$( "#employeeClassDropdown" ).on("click", "li a", function() {
		/*
		Change Dropdown label to reflect the selected employee class
		*/
		$("#employeeClassDropdownLabel").text($(this).text())
	});

	var Employee = function(employeeName, employeeClass) {
		/*
		Employee object. employeeClass is optional.
		*/
		this.employeeName = employeeName;
		if (employeeClass != '') {
			this.employeeClass = employeeClass
		} else {
			//who cares?
		};
	};

	var employeeObjectArray = []
	$("#proceedToEmployeeHoursEntry").on("click", function() {

		$("#employeeNameEntryContainer").addClass('hidden');
		$("#employeeEntryNav").addClass('hidden');

		$("#employeeHoursEntryContainer").removeClass('hidden');
		$("#hoursEntryNav").removeClass('hidden');

		employeeObjectArray = [];

		// clear the array, then instantiate new employees in the array
		$("#employeeAndClassList a").each( function () {
			var employeeName = $( this ).contents().get(0).nodeValue
			var employeeClass = $( this ).find("span").text()

			if (employeeClass.length != 0) {
				employeeObjectArray.push(new Employee(employeeName, employeeClass))
			} else {
				employeeObjectArray.push(new Employee(employeeName, ''))
			}
		})
		
		$("#employeeHoursEntry").empty()

		for ( i = 0; i < employeeObjectArray.length; i++) {

			var newDiv = jQuery("<div></div>", {
				class: "input-group"
			})
			var newSpan = jQuery("<span></span>", {
				class: "input-group-addon",
				text: employeeObjectArray[i].employeeName
			})
			var newInput = jQuery("<input>", {
				type: "text",
				class: "form-control"
			})
			newSpan.appendTo(newDiv);
			newInput.appendTo(newDiv);
			newDiv.appendTo("#employeeHoursEntry")
		}
	})

	function float(string) {
	  return parseFloat(string.replace(',', '.'));
	}

	$("#submitForm").on("click", function () {

		$("#revenueEntryNav").addClass('hidden');
		$("#revenueEntryContainer").addClass('hidden');

		$("#poolResultsContainer").removeClass('hidden');
		$("#poolResultsNav").removeClass('hidden');

		var creditRevenue = float($("#tipRevenueCredit").val());
		var cashRevenue = float($("#tipRevenueCash").val());
		var totalRevenue = creditRevenue + cashRevenue;

		var employees = [];
		var hours = [];
		var totalHours = 0.0;

		$("#employeeHoursEntry div").each( function () {
			employees.push($(this).find("span").text())
			hours.push(float($(this).find("input").val()))

			totalHours = totalHours + float($(this).find("input").val())
		})

		$("#reportTable").empty();

		for ( i=0 ; i<employees.length ; i++ ) {
			var totalPayment = (totalRevenue / totalHours) * hours[i]
			var cashPayment = (cashRevenue / totalHours) * hours[i]
			var creditPayment = (creditRevenue / totalHours) * hours[i]

			var row = jQuery("<tr></tr>", {});
			var nameEntry = jQuery("<th></th>", {
				text: employees[i],
			})
			var creditEntry = jQuery("<th></th>", {
				text: "$"+parseFloat(creditPayment.toString()).toFixed(2)
			})
			var cashEntry = jQuery("<th></th>", {
				text: "$"+parseFloat(cashPayment.toString()).toFixed(2)
			})
			var totalEntry = jQuery("<th></th>", {
				text: "$"+parseFloat(totalPayment.toString()).toFixed(2)
			})

			nameEntry.appendTo(row);
			cashEntry.appendTo(row);
			creditEntry.appendTo(row);
			totalEntry.appendTo(row);
			row.appendTo($("#reportTable"))

		}
	});

});
