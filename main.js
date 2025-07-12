$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

const searchInput = $(".search-input");

const activeBtn = $("#active-btn");
const completedBtn = $("#completed-btn");
const allTaskBtn = $("#allTask-btn");
const addBtn = $(".add-btn");

const closeBtn = $(".modal-close");
const cancelBtn = $(".btn-cancel");
const submitBtn = $(".btn-submit");
const todoForm = $("#addTaskModal");
const modal = $(".modal");

const taskTitle = $("#taskTitle");

const todoTask = $(".todo-app-form");
const todoList = $("#todoList");
let todoTasks = [];
let indexEdit = null;

const todoTaskManager = {
  searchInput: $(".search-input"),
  activeBtn: $("#active-btn"),
  completedBtn: $("#completed-btn"),
  allTaskBtn: $("#allTask-btn"),
  addBtn: $(".add-btn"),
  closeBtn: $(".modal-close"),
  cancelBtn: $(".btn-cancel"),
  submitBtn: $(".btn-submit"),
  todoForm: $("#addTaskModal"),
  modal: $(".modal"),
  taskTitle: $("#taskTitle"),
  todoTask: $(".todo-app-form"),
  todoList: $("#todoList"),
  //Hàm  định dạng thời gian
  customTime(time) {
    let result = "";
    let arr = time.toString().split(":");
    if (arr[0] >= 12)
      return (result = `${(arr[0] - 12).toString().padStart(2, "0")}:${
        arr[1]
      } PM`);
    if (arr[0] < 12) return (result = `${arr[0]}:${arr[1]} AM`);
  },
  //escape
  escape(html) {
    const divElement = document.createElement("div");
    divElement.textContent = html;
    return divElement.innerHTML;
  },
  openOrCloseForm(element, classNameRemove, isInsert) {
    if (isInsert) {
      indexEdit = null;
      const modalTitle = todoForm.querySelector(".modal-title");
      modalTitle.textContent = " Add New Task";
      submitBtn.textContent = "Create Task";
    }
    if (indexEdit !== null) {
      const modalTitle = todoForm.querySelector(".modal-title");
      modalTitle.textContent = " Edit todo Tasks";
      submitBtn.textContent = "Save Edit";
    }
    if (typeof classNameRemove !== "string" || element === null)
      return "Check element and classNameRemove";
    element.classList.toggle(classNameRemove);
    setTimeout(() => {
      taskTitle.focus();
      todoForm.querySelector(".modal").scrollTop = 0;
    }, 100);
    todoTask.reset();
  },
  start() {},
};

//Hàm tạo toast
const toasts = [
  {
    title: " Thành công",
    message: "Thành công",
    type: "susses",
    toastIcon: "fa-solid fa-check",
  },
  {
    title: " Thông báo",
    message: "Đây là thông báo",
    type: "info",
    toastIcon: "fa-solid fa-circle-exclamation",
  },
  {
    title: " Cảnh báo",
    message: "Đây là cảnh báo",
    type: "warning",
    toastIcon: "fa-solid fa-circle-exclamation",
  },
  {
    title: " Thất bại",
    message: "Thất bại",
    type: "error",
    toastIcon: "fa-solid fa-exclamation",
  },
];
function createToast(toast, message) {
  if (!toast) return;
  const toastElementOld = $(".toast");
  if (toastElementOld) document.body.removeChild(toastElementOld);

  const toastElement = document.createElement("div");
  message ? (toast.message = message) : toast;
  toastElement.classList.add("toast", `toast--${toast.type}`);
  toastElement.innerHTML = `
  <div class="toast__icon">
        <i class="${toast.toastIcon}"></i>
      </div>
      <div class="toast__body">
        <h3 class="toast__title">${toast.title}</h3>
        <p class="toast__msg">
         ${toast.message}
        </p>
      </div>
      <div class="toast__close">
        <i class="fa-solid fa-xmark"></i>
      </div>
  `;
  document.body.appendChild(toastElement);
}
//escape
function escape(html) {
  const divElement = document.createElement("div");
  divElement.textContent = html;
  return divElement.innerHTML;
}

function getTaskInLocalstorage() {
  let tasks = JSON.parse(localStorage.getItem("todoTasks")) ?? [];
  return tasks;
}
function saveTaskInLocalstorage(todoTasks) {
  localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
}
function renderTasks(arrTask) {
  let tasks = getTaskInLocalstorage();
  if (arrTask !== undefined) tasks = arrTask;

  let html =
    "" +
    tasks
      .map(function (task, index) {
        return `
        <div class="task-card ${escape(
          task.color
        )} ${task.isCompleted ? "completed" : ""}">
        <div class="task-header">
          <h3 class="task-title">${escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-index="${index}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-index="${index}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-index="${index}">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${escape(task.description)}</p>
        <div class="task-time">${customTime(
          escape(task.startTime)
        )} - ${customTime(escape(task.endTime))}</div>
      </div>
        `;
      })
      .join("");

  if (html.length === 0) html = `<div>Không tìm thấy nhiệm vụ vào</div>`;
  todoList.innerHTML = html;
}

//Tạo hàm thêm hoặc xóa class trong classList của element
function openOrCloseForm(element, classNameRemove, isInsert) {
  if (isInsert) {
    indexEdit = null;
    const modalTitle = todoForm.querySelector(".modal-title");
    modalTitle.textContent = " Add New Task";
    submitBtn.textContent = "Create Task";
  }
  if (indexEdit !== null) {
    const modalTitle = todoForm.querySelector(".modal-title");
    modalTitle.textContent = " Edit todo Tasks";
    submitBtn.textContent = "Save Edit";
  }
  if (typeof classNameRemove !== "string" || element === null)
    return "Check element and classNameRemove";
  element.classList.toggle(classNameRemove);
  setTimeout(() => {
    taskTitle.focus();
    todoForm.querySelector(".modal").scrollTop = 0;
  }, 100);
  todoTask.reset();
}
// Đóng mở form todoForm
addBtn.addEventListener("click", () => {
  openOrCloseForm(todoForm, "show", true);
});
closeBtn.addEventListener("click", () => {
  if (confirm(" Bạn có chắc chắn muốn đóng form ")) {
    openOrCloseForm(todoForm, "show");
  }
});

cancelBtn.addEventListener("click", () => {
  if (confirm(" Bạn có chắc chắn muốn đóng form ")) {
    openOrCloseForm(todoForm, "show");
  }
});

todoForm.addEventListener("click", (event) => {
  console.dir(event.target);
  console.log(modal);
  if (!modal.contains(event.target)) {
    if (confirm(" Bạn có chắc chắn muốn đóng form ")) {
      openOrCloseForm(todoForm, "show");
    }
  }
});
//Submit form
todoTask.addEventListener("submit", function (event) {
  event.preventDefault();
  let task = Object.fromEntries(new FormData(todoTask));
  task.isCompleted = false;
  todoTasks = getTaskInLocalstorage();
  if (indexEdit === null) {
    if (!todoTasks.find((data) => data.title === task.title)) {
      todoTasks.unshift(task);
      saveTaskInLocalstorage(todoTasks);
      renderTasks();
      openOrCloseForm(todoForm, "show");
      createToast(toasts[0], "Thành công rồi bạn nhé! Yên tâm đi");
    } else {
      createToast(
        toasts[3],
        "Không thể thêm được đâu, trùng title mất rồi bạn ơi."
      );
    }
  } else {
    let newTasks = todoTasks.slice();
    newTasks.splice(indexEdit, 1);
    if (!newTasks.find((data) => data.title === task.title)) {
      todoTasks[indexEdit] = task;
      saveTaskInLocalstorage(todoTasks);
      renderTasks();
      openOrCloseForm(todoForm, "show");
      createToast(toasts[0], "Thành công rồi bạn nhé! Yên tâm đi");
    } else {
      createToast(
        toasts[3],
        "Không thể sửa được đâu, trùng title mất rồi bạn ơi."
      );
    }
  }
});

//render lần đầu
renderTasks();
// Sửa xóa
todoList.addEventListener("click", function (event) {
  const editBtn = event.target.closest(".edit-btn");
  const completedBtn = event.target.closest(".complete-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (deleteBtn) {
    let tasks = getTaskInLocalstorage();
    let index = deleteBtn.dataset.index;
    if (confirm("Bạn chắc chắn muốn xóa  công việc này?")) {
      let newTasks = tasks.splice(index, 1);
      saveTaskInLocalstorage(tasks);
      renderTasks();
    }
  }
  if (completedBtn) {
    let tasks = getTaskInLocalstorage();
    let index = completedBtn.dataset.index;
    tasks[index].isCompleted = true;
    saveTaskInLocalstorage(tasks);
    renderTasks();
  }
  if (editBtn) {
    let index = editBtn.dataset.index;
    indexEdit = index;
    openOrCloseForm(todoForm, "show");
    let task = getTaskInLocalstorage()[index];

    for (let key in task) {
      if (key != "isCompleted") {
        const input = $(`[name=${key}]`);
        input.value = task[key];
      }
    }
  }
});

// chức năng tìm kiếm
searchInput.addEventListener("input", function () {
  if (searchInput.value != null) {
    allTaskBtn.className = "tab-button active";
    completedBtn.className = "tab-button completed-btn";
    activeBtn.className = "tab-button ";
    let str = searchInput.value.toString().toLowerCase();
    let todoTasks = getTaskInLocalstorage();
    let newList = todoTasks.filter(
      (task) =>
        task.title.toString().toLowerCase().includes(str) ||
        task.description.toString().toLowerCase().includes(str)
    );
    renderTasks(newList);
  }
});
//loc complete. active
allTaskBtn.addEventListener("click", function () {
  allTaskBtn.className = "tab-button active";
  completedBtn.className = "tab-button completed-btn";
  activeBtn.className = "tab-button ";
  renderTasks();
});
activeBtn.addEventListener("click", function () {
  allTaskBtn.className = "tab-button";
  completedBtn.className = "tab-button completed-btn";
  activeBtn.className = "tab-button active";
  let todoTasks = getTaskInLocalstorage();
  let newList = todoTasks.filter((task) => task.isCompleted === false);
  renderTasks(newList);
});
completedBtn.addEventListener("click", function () {
  allTaskBtn.className = "tab-button";
  activeBtn.className = "tab-button ";
  completedBtn.className = "tab-button completed-btn active";
  let todoTasks = getTaskInLocalstorage();
  let newList = todoTasks.filter((task) => task.isCompleted === true);
  renderTasks(newList);
});
