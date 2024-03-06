const taskCardFolder = './tasksCard/';
const taskCardPage = 'index.html';

loadSavedTaskItens();

const taskItemChanges = {
    checkbox : 'isCompleted',
    description: 'taskDescription'
};

function loadSavedTaskItens()
{
    var tasksBody = document.querySelector('#tasksBody');
    var totalTasks = localStorage.length;
    var completedTasks = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        const parsedValue = JSON.parse(value);
        const taskDescription = parsedValue.taskDescription;
        const dataid = parsedValue.dataid;
        const isCompleted = parsedValue.isCompleted;

        if (isCompleted)
            ++completedTasks;

        addTaskItem(tasksBody, taskDescription, dataid, isCompleted);
      }

    var createdTasksCounter = document.querySelector('#createdTasks').querySelector('.counter');
    createdTasksCounter.textContent = totalTasks;

    var allTasksCounter = document.querySelector('#allTasks').querySelector('.counter');
    var completedTasksText = completedTasks + " de " + totalTasks;

    allTasksCounter.textContent = completedTasksText;
}

function addTask(element)
{
    var addTaskDiv = element.parentNode;
    var input = addTaskDiv.querySelector('input');
    var inputValue = input.value;

    if (inputValue == "")
    {
        window.alert("Você precisa digitar uma descrição válida para tarefa!");
        return;
    }

    var pageBody = addTaskDiv.parentNode.parentNode;
    var tasksInfo = pageBody.querySelector('#infoTasks');
    var tasksBody = pageBody.querySelector('#tasksBody');
    var dataid = getUniqueId();

    addTaskItem(tasksBody, inputValue, dataid).
    then()
    .catch(error => {
        return;
    })

    input.value = "";

    updateTaskInfo(tasksBody, tasksInfo);
}

function addTaskItem(tasksBody, inputValue, dataid, isChecked = false) {
    return new Promise((resolve, reject) => {
        // carrega o elemento 
        fetch(taskCardFolder + taskCardPage)
        .then(response => response.text())
        .then(html => {
            var taskItem = document.createElement('li');
            taskItem.innerHTML = html;
        
            taskItem.classList.add('taskItem');
            var taskText = taskItem.querySelector('.taskDescription');

            taskText.addEventListener('input', function() {
                // callBack added
                updateTaskItemChanges(dataid, taskItemChanges.description, taskText.textContent);
            });

            taskText.textContent = inputValue;

            if(isChecked)
                taskText.classList.add('taskCheckboxChecked');
        
            var taskCheckbox = taskItem.querySelector('.taskCheckbox');
            taskCheckbox.addEventListener("change", taskCheckboxChanged);
            taskCheckbox.checked = isChecked;

            taskItem.setAttribute('dataid', dataid);
            saveTaskItemChanges(taskItem);

            tasksBody.appendChild(taskItem);
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function taskCheckboxChanged(event)
{
    var taskCheckbox = event.target;
    var taskItem = taskCheckbox.parentNode;
    var taskDescription = taskItem.querySelector('.taskDescription');

    console.log(taskItem);

    var isChecked = taskCheckbox.checked;

    if (isChecked)
    {
        taskDescription.classList.add("taskCheckboxChecked");
    }
    else
    {
        taskDescription.classList.remove("taskCheckboxChecked");
    }

    var tasksBody = taskItem.parentNode;
    var tasksInfo = tasksBody.parentNode.querySelector('#infoTasks');
    
    updateTaskInfo(tasksBody, tasksInfo, false);

    var taskDataId = taskItem.getAttribute('dataid');
    updateTaskItemChanges(taskDataId, taskItemChanges.checkbox, isChecked);
}

function updateTaskInfo(tasksBody, tasksInfo, realoded = true)
{
    var tasksItens = tasksBody.querySelectorAll('.taskItem');
    console.log(tasksItens);
    var taskItensCount = realoded ? tasksItens.length + 1 : tasksItens.length;

    var createdTasksCounter = tasksInfo.querySelector('#createdTasks').querySelector('.counter');
    createdTasksCounter.textContent = taskItensCount;

    var allTasksCounter = tasksInfo.querySelector('#allTasks').querySelector('.counter');

    var completedTasks = getCheckedTaskCheckboxes(tasksItens);
    var completedTasksText = completedTasks + " de " + taskItensCount;

    allTasksCounter.textContent = completedTasksText;
}

function getCheckedTaskCheckboxes(tasksItens) {
    var checkedCheckboxes = Array.from(tasksItens).filter(function(taskItem) {
        var checkbox = taskItem.querySelector('.taskCheckbox');
        return checkbox.checked;
    });
    return checkedCheckboxes.length;
}

function deleteTaskIem(element)
{
    var taskItem = element.parentNode;
    var tasksBody = taskItem.parentNode;

    tasksBody.removeChild(taskItem);
    
    var tasksInfo = document.querySelector('#infoTasks');
    updateTaskInfo(tasksBody, tasksInfo, false);
    deleteTaskItemChanges(taskItem);
}

function getUniqueId()
{
    return Math.random().toString(16).slice(2);
}

function saveTaskItemChanges(taskItem)
{
    var taskDataid = taskItem.getAttribute('dataid');
    var taskDescription = taskItem.querySelector('.taskDescription').textContent;
    var isTaskItemCompleted = taskItem.querySelector('.taskCheckbox').checked;

    var json = JSON.stringify({
        dataid : taskDataid,
        taskDescription : taskDescription,
        isCompleted : isTaskItemCompleted
    });

    localStorage.setItem(taskDataid, json);
}

function updateTaskItemChanges(dataid, change, value)
{
    var taskItem = localStorage.getItem(dataid);
    var parsedTaskItem = JSON.parse(taskItem);

    parsedTaskItem[change] = value;

    var jsonParsedTaskItem = JSON.stringify(parsedTaskItem);
    localStorage.setItem(dataid, jsonParsedTaskItem);
}

function deleteTaskItemChanges(taskItem)
{
    var dataid = taskItem.getAttribute('dataid');
    localStorage.removeItem(dataid);
}