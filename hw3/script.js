const elements = {
    taskList: document.getElementById("taskList"),
    taskCard: document.getElementById("taskCard"),
    createTaskBtn: document.getElementById("createTaskBtn"),
    saveTaskBtn: document.getElementById("saveTaskBtn"),
    cancelTaskBtn: document.getElementById("cancelTaskBtn"),
    taskDescription: document.getElementById("taskDescription"),
    highPriorityCheckbox: document.getElementById("highPriority"),
};

let state = {
    isEditing: false,
    editTaskElement: null,
};

function updatePriorityIconPosition() {
    const iconPosition = elements.highPriorityCheckbox.checked ? "150px" : "-20px";
    elements.highPriorityCheckbox.style.setProperty("--priority-icon-left", iconPosition);
}

function toggleTaskCard(visible) {
    const { taskCard, taskDescription, highPriorityCheckbox } = elements;
    if (visible) {
        taskCard.classList.remove("hidden");
        updatePriorityIconPosition();
    } else {
        taskCard.classList.add("hidden");
        taskDescription.value = "";
        highPriorityCheckbox.checked = false;
        state.isEditing = false;
        state.editTaskElement = null;
    }
}

function createTask(description, isHighPriority) {
    const task = document.createElement("li");
    task.classList.toggle("high-priority", isHighPriority);

    const content = document.createElement("div");
    content.classList.add("task-content");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
        task.classList.toggle("completed", checkbox.checked);
        toggleActionButtons(task, checkbox.checked);
    });

    const priorityIcon = document.createElement("span");
    priorityIcon.className = "priority-icon";
    priorityIcon.style.display = isHighPriority ? "inline" : "none";

    const taskText = document.createElement("span");
    taskText.textContent = description;
    taskText.classList.add("task-text");

    content.append(checkbox, priorityIcon, taskText);

    const actions = createActionButtons(task, description, isHighPriority);
    task.append(content, actions);

    return task;
}

function createActionButtons(task, description, isHighPriority) {
    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("task-actions");

    const editButton = createButton("✏️", "edit-btn", () => {
        if (!task.classList.contains("completed")) {
            state.isEditing = true;
            state.editTaskElement = task;
            elements.taskDescription.value = description;
            elements.highPriorityCheckbox.checked = isHighPriority;
            toggleTaskCard(true);
        }
    });

    const deleteButton = createButton("🗑️", "delete-btn", () => {
        if (!task.classList.contains("completed")) {
            task.remove();
        }
    });

    actionsContainer.append(editButton, deleteButton);
    return actionsContainer;
}

function createButton(label, className, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.className = className;
    button.addEventListener("click", onClick);
    return button;
}

function toggleActionButtons(task, isCompleted) {
    const buttons = task.querySelectorAll(".edit-btn, .delete-btn");
    buttons.forEach((button) => {
        button.disabled = isCompleted;
        button.classList.toggle("disabled", isCompleted);
    });
}

function saveTask() {
    const { taskDescription, highPriorityCheckbox, taskList } = elements;
    const description = taskDescription.value.trim();

    if (!description) {
        alert("Описание задачи не может быть пустым.");
        return;
    }

    if (state.isEditing && state.editTaskElement) {
        const task = state.editTaskElement;
        task.querySelector(".task-text").textContent = description;
        task.classList.toggle("high-priority", highPriorityCheckbox.checked);
    } else {
        const newTask = createTask(description, highPriorityCheckbox.checked);
        taskList.appendChild(newTask);
    }

    toggleTaskCard(false);
}

elements.createTaskBtn.addEventListener("click", () => toggleTaskCard(true));
elements.saveTaskBtn.addEventListener("click", saveTask);
elements.cancelTaskBtn.addEventListener("click", () => toggleTaskCard(false));
elements.highPriorityCheckbox.addEventListener("change", updatePriorityIconPosition);