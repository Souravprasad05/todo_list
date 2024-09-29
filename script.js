// Wait for the DOM content to fully load
document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector('button[name="Add"]'); // Select Add button
    const textInput = document.getElementById("textData"); // Select input field for tasks
    const taskList = document.getElementById("taskTodo"); // Select task list element

    // Variable to track the current task being edited
    let taskBeingEdited = null;

    // Load tasks from localStorage when the page loads
    loadTasks();

    // Event listener for Add button click
    addButton.addEventListener("click", function () {
        const taskValue = textInput.value; // Get value from input field

        // Check if the button is in 'Edit' mode
        if (addButton.innerHTML === "Edit" && taskBeingEdited) {
            taskBeingEdited.querySelector(".taskData").textContent = taskValue; // Update task text
            saveTasks(); // Save updated tasks to localStorage
            addButton.innerHTML = "Add"; // Reset button text to "Add"
            textInput.value = ""; // Clear input field
            taskBeingEdited = null; // Reset the task being edited
        } else if (taskValue.trim() !== "") {
            // Add new task if input is not empty
            const newLi = createTaskElement(taskValue, false); // Create a new task element
            taskList.appendChild(newLi); // Add new task to the list
            saveTasks(); // Save tasks to localStorage
            textInput.value = ""; // Clear input field
        }
    });

    // Event listener for pressing the Enter key in the input field
    textInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") { // Check if Enter key is pressed
            addButton.click(); // Trigger the click event of the Add button
        }
    });

    // Function to create a task element
    function createTaskElement(taskValue, isChecked) {
        const newLi = document.createElement("li"); // Create a new list item
        newLi.classList.add("lists"); // Add class for styling

        const firstDiv = document.createElement("div"); // Create a div for task content
        firstDiv.classList.add("first");

        const checkInputDiv = document.createElement("div"); // Create a div for checkbox
        checkInputDiv.classList.add("checkInput");

        const checkbox = document.createElement("input"); // Create checkbox input
        checkbox.type = "checkbox"; // Set type to checkbox
        checkbox.checked = isChecked; // Set checked state based on task status
        checkInputDiv.appendChild(checkbox); // Add checkbox to the container

        const taskDataDiv = document.createElement("div"); // Create a div for task text
        taskDataDiv.classList.add("taskData");
        taskDataDiv.textContent = taskValue; // Set task text

        firstDiv.appendChild(checkInputDiv); // Add checkbox to the first div
        firstDiv.appendChild(taskDataDiv); // Add task text to the first div

        const secondDiv = document.createElement("div"); // Create a div for action icons
        secondDiv.classList.add("second");

        // Create edit icon
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pen-to-square"); // Font Awesome edit icon
        editIcon.style.color = "rgb(0, 175, 12)"; // Set color for edit icon

        // Create delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash"); // Font Awesome delete icon
        deleteIcon.style.color = "rgba(229, 13, 13, 0.826)"; // Set color for delete icon

        secondDiv.appendChild(editIcon); // Add edit icon to the second div
        secondDiv.appendChild(deleteIcon); // Add delete icon to the second div

        newLi.appendChild(firstDiv); // Add first div to the list item
        newLi.appendChild(secondDiv); // Add second div to the list item

        // Strike through text if checkbox is checked
        if (isChecked) {
            taskDataDiv.style.textDecoration = "line-through"; // Apply line-through style
        }

        // Event listener for checkbox change
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                taskDataDiv.style.textDecoration = "line-through"; // Strike through text if checked
            } else {
                taskDataDiv.style.textDecoration = "none"; // Remove strike-through if unchecked
            }
            saveTasks(); // Save checkbox state to localStorage
        });

        // Delete task logic
        deleteIcon.addEventListener("click", function () {
            taskList.removeChild(newLi); // Remove task from list
            saveTasks(); // Save updated tasks to localStorage
        });

        // Edit task logic
        editIcon.addEventListener("click", function () {
            if (addButton.innerHTML == "Add") {
                textInput.value = taskDataDiv.textContent; // Set input value to current task
                addButton.innerHTML = "Edit"; // Change button text to "Edit"
                taskBeingEdited = newLi; // Store the task being edited
            }
        });

        return newLi; // Return the new task element
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = []; // Initialize array for tasks
        const taskElements = taskList.querySelectorAll("li"); // Get all task elements
        taskElements.forEach((taskElement) => {
            const taskValue = taskElement.querySelector(".taskData").textContent; // Get task text
            const isChecked = taskElement.querySelector("input[type='checkbox']").checked; // Get checkbox state
            tasks.push({ value: taskValue, checked: isChecked }); // Add task object to array
        });
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks array to localStorage
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasksJSON = localStorage.getItem("tasks"); // Retrieve tasks from localStorage
        if (tasksJSON) { // Check if tasksJSON is not null or empty
            const tasks = JSON.parse(tasksJSON); // Parse JSON string into an array
            tasks.forEach((task) => {
                const newLi = createTaskElement(task.value, task.checked); // Create task element
                taskList.appendChild(newLi); // Add task to the list
            });
        }
    }

});
