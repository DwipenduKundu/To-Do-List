const input = document.getElementById("Todotext");
const show = document.getElementById("show");
const submit = document.getElementById("submit");
let todos = JSON.parse(localStorage.getItem("todos")) || [];


function Manipulating_tasks(Text_value, isChecked = false) {
    // creating elements
    const item_todo = document.createElement("div");
    const show_text = document.createElement("div");
    const delete_button = document.createElement("button");
    const check_button = document.createElement("input");

    
    item_todo.classList.add("items");
    
    check_button.type = "checkbox";
    check_button.checked = isChecked;
    show_text.innerHTML = Text_value;

    
    delete_button.innerHTML = "X";
    delete_button.classList.add("deletebutton");

    
    // style for checkbox
    if (isChecked) {
        show_text.style.textDecoration = "line-through";
        show_text.style.color = "gray";
        item_todo.style.backgroundColor = "hsl(54, 82%, 78%)";
    } else {
        show_text.style.textDecoration = "none";
        show_text.style.color = "black";
        item_todo.style.backgroundColor = "rgb(117, 236, 197)";
    }


    check_button.addEventListener("change", () => {
        if (check_button.checked) {
            show_text.style.textDecoration = "line-through";
            show_text.style.color = "gray";
            item_todo.style.backgroundColor = "hsl(54, 82%, 78%)";
        } else {
            show_text.style.textDecoration = "none";
            show_text.style.color = "black";
            item_todo.style.backgroundColor = "rgb(117, 236, 197)";
        }

        const index = todos.findIndex((todo) => todo.text === Text_value);
        if (index !== -1) {
            todos[index].completed = check_button.checked;
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    });


    // delete button
    delete_button.addEventListener("click", () => {
        item_todo.remove();
        todos = todos.filter((todo) => todo.text !== Text_value);
        localStorage.setItem("todos", JSON.stringify(todos));
    });


    // Drag-and-drop
    item_todo.setAttribute('draggable', true);
    item_todo.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", Text_value);
    });

    item_todo.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    item_todo.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedText = e.dataTransfer.getData("text/plain");
        if (draggedText === Text_value) return;

        const draggedEl = [...show.children].find(
            (child) => child.querySelector("div").innerHTML === draggedText
        );

        if (draggedEl) {
            show.insertBefore(draggedEl, item_todo);
        }

        // Update todos array after reordering
        const newOrder = [...show.children].map((child) => {
            const text = child.querySelector("div").innerHTML;
            const completed = child.querySelector("input").checked;
            return { text, completed };
        });

        todos = newOrder;
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    
    item_todo.append(check_button, show_text, delete_button);
    show.append(item_todo);
}


// submit button functionality:
submit.addEventListener("click", () => {
    if (input.value === "") {
        alert("Empty Text");
    } else {
        console.log(input.value);
        todos.push({ text: input.value, completed: false });
        localStorage.setItem("todos", JSON.stringify(todos));
        Manipulating_tasks(input.value, false);
        input.value = "";
    }
});

// load todos on localstorage:
window.addEventListener("load", () => {
    todos.forEach((todo) => {
        Manipulating_tasks(todo.text, todo.completed);
    });
});
