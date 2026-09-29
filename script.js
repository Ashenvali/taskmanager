// ======================================
// NAVIGATION
// ======================================

function showPage(pageName, button) {

    // Get all pages

    const pages =
        document.querySelectorAll(".page");


    // Hide every page

    pages.forEach(function(page) {

        page.classList.remove("active-page");

    });


    // Show selected page

    const selectedPage =
        document.getElementById(pageName);

    selectedPage.classList.add("active-page");


    // Get all navigation buttons

    const buttons =
        document.querySelectorAll(".nav-button");


    // Remove active from all buttons

    buttons.forEach(function(navButton) {

        navButton.classList.remove("active");

    });


    // Add active to clicked button

    button.classList.add("active");


    // Update statistics if Statistics page is opened

    if (pageName === "statistics") {

        updateStatistics();

    }


    // Load all tasks if My Tasks is opened

    if (pageName === "tasks") {

        loadAllTasks();

    }

}


// ======================================
// LOAD TASKS
// ======================================

window.onload = function() {

    loadTasks();

};


// ======================================
// GET TASKS FROM PYTHON
// ======================================

function loadTasks() {

    fetch("/tasks")

    .then(function(response) {

        return response.json();

    })

    .then(function(tasks) {

        displayDashboardTasks(tasks);

        updateNumbers(tasks);

    });

}


// ======================================
// DISPLAY DASHBOARD TASKS
// ======================================

function displayDashboardTasks(tasks) {

    const list =
        document.getElementById(
            "dashboardTaskList"
        );


    list.innerHTML = "";


    tasks.forEach(function(task) {

        createTaskElement(task, list);

    });

}


// ======================================
// DISPLAY ALL TASKS
// ======================================

function loadAllTasks() {

    fetch("/tasks")

    .then(function(response) {

        return response.json();

    })

    .then(function(tasks) {

        const list =
            document.getElementById(
                "allTaskList"
            );


        list.innerHTML = "";


        tasks.forEach(function(task) {

            createTaskElement(task, list);

        });

    });

}


// ======================================
// CREATE TASK ELEMENT
// ======================================

function createTaskElement(task, list) {

    const taskDiv =
        document.createElement("div");


    taskDiv.className = "task";


    if (task.completed) {

        taskDiv.classList.add(
            "completed-task"
        );

    }


    taskDiv.innerHTML = `

        <div class="task-left">

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="completeTask(${task.id})"
            >

            <h3>
                ${task.title}
            </h3>

        </div>


        <button
            class="delete-btn"
            onclick="deleteTask(${task.id})"
        >
            🗑️
        </button>

    `;


    list.appendChild(taskDiv);

}


// ======================================
// ADD TASK
// ======================================

function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    const title =
        input.value.trim();


    if (title === "") {

        alert("Please enter a task.");

        return;

    }


    fetch("/tasks", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            title: title

        })

    })

    .then(function(response) {

        return response.json();

    })

    .then(function() {

        input.value = "";

        loadTasks();

    });

}


// ======================================
// COMPLETE TASK
// ======================================

function completeTask(id) {

    fetch("/tasks/" + id, {

        method: "PUT"

    })

    .then(function(response) {

        return response.json();

    })

    .then(function() {

        loadTasks();

        loadAllTasks();

    });

}


// ======================================
// DELETE TASK
// ======================================

function deleteTask(id) {

    fetch("/tasks/" + id, {

        method: "DELETE"

    })

    .then(function(response) {

        return response.json();

    })

    .then(function() {

        loadTasks();

        loadAllTasks();

    });

}


// ======================================
// UPDATE NUMBERS
// ======================================

function updateNumbers(tasks) {

    let completed = 0;


    tasks.forEach(function(task) {

        if (task.completed) {

            completed++;

        }

    });


    let total = tasks.length;

    let pending = total - completed;


    document.getElementById(
        "totalTasks"
    ).innerText = total;


    document.getElementById(
        "completedTasks"
    ).innerText = completed;


    document.getElementById(
        "pendingTasks"
    ).innerText = pending;

}


// ======================================
// STATISTICS PAGE
// ======================================

function updateStatistics() {

    fetch("/tasks")

    .then(function(response) {

        return response.json();

    })

    .then(function(tasks) {

        let completed = 0;


        tasks.forEach(function(task) {

            if (task.completed) {

                completed++;

            }

        });


        let total = tasks.length;

        let pending = total - completed;


        document.getElementById(
            "statTotal"
        ).innerText = total;


        document.getElementById(
            "statCompleted"
        ).innerText = completed;


        document.getElementById(
            "statPending"
        ).innerText = pending;

    });

}