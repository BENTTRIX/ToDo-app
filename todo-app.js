(function() {
    let listName = '';

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        input.addEventListener('input', function() {
            button.disabled = !input.value.trim();
        });

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem({name, done}) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        if (done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            todoItem.done = !todoItem.done; 
            saveToLocalStorage(todos, listName);
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();
                todos = todos.filter(todo => todo.id !== todoItem.id);
                saveToLocalStorage(todos, listName);
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return item;
    }

    function saveToLocalStorage(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function loadFromLocalStorage(keyName) {
        let data = localStorage.getItem(keyName);
        return data ? JSON.parse(data) : [];
    }

    function createTodoApp(container, title = 'Список дел', keyName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        let todos = loadFromLocalStorage(listName);

        todos.forEach(todo => {
            let existingTodoItem = createTodoItem(todo);

            existingTodoItem.doneButton.addEventListener('click', function() {
                existingTodoItem.item.classList.toggle('list-group-item-success');
                todo.done = !todo.done;
                saveToLocalStorage(todos, listName);
            });

            existingTodoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    existingTodoItem.item.remove();
                    todos = todos.filter(t => t.id !== todo.id);
                    saveToLocalStorage(todos, listName);
                }
            });

            todoList.append(existingTodoItem.item);
        });

        todoItemForm.form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!todoItemForm.input.value.trim()) {
                return;
            }
        
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),
                    owner: 'Василий',
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const todoItem = await response.json();
        
            let todoItemElement = createTodoItem({
                name: todoItem.name,
                done: todoItem.done,
            });
            todos.push(todoItem); 
        
         
        
            todoList.append(todoItemElement);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        
            saveToLocalStorage(todos, listName);
        });
        
    }

    window.createTodoApp = createTodoApp;
})();