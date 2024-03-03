const taskCardFolder = './tasksCard/';
const taskCardPage = 'index.html';

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

    addTaskItem(tasksBody, inputValue).
    then()
    .catch(error => {
        return;
    })

    input.value = "";

    updateTaskInfo(tasksBody, tasksInfo);
}

function addTaskItem(tasksBody, inputValue) {
    return new Promise((resolve, reject) => {
        // carrega o elemento 
        fetch(taskCardFolder + taskCardPage)
        .then(response => response.text())
        .then(html => {
        
            var taskItem = document.createElement('li');
            taskItem.innerHTML = html;
        
            taskItem.classList.add('taskItem');
            var taskText = taskItem.querySelector('.taskDescription');
            taskText.textContent = inputValue;
        
            var taskCheckbox = taskItem.querySelector('.taskCheckbox');
            taskCheckbox.addEventListener("change", taskCheckboxChanged);

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

    if (taskCheckbox.checked)
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
}

function updateTaskInfo(tasksBody, tasksInfo, realoded = true)
{
    var tasksItens = tasksBody.querySelectorAll('.taskItem');
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
}