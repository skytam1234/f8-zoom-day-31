$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const todoTask = {
  btnOpenOrCloseForm: $(`.add-btn`),
  btnCloseFormTask: $(`.modal-close`),
  searchBtn: $(`.search-input`),
  sortAllTaskBtn: $(`#allTask-btn`),
  sortActiveTaskBtn: $(`#active-btn`),
  sortCompleteTaskBtn: $(`#completed-btn`),
  modal: $(`.modal`),
  taskTitle: $(`#taskTitle`),
  addOrEditForm: $(`.todo-app-form`),
  submitModalBtn: $(`.btn-submit`),
  cancelModalBtn: $(`.btn-cancel`),
  listTask: $(`#todoList`),
  formInsertOrEditTask: $(`#addTaskModal`),
  modalTitle: $(`.modal-title`),
  toasts: [
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
  ],
  tasks: [],
  task: {},
  isInsert: true,
  start() {
    this.renderTask();
    this.renderTitleFormTask.call(this);
    this.hangDleEvent();
  },
  createToast(toast, message) {
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
  },
  async send(url, method) {
    const res = await fetch(url, method);
    if (!res.ok) throw new Error(`HTTP code:${(await res).status}`);
    const type = (await res).headers.get(`content-type`);
    const isJSON = type && type.includes(`application/json`);
    try {
      const result = isJSON ? await res.json() : await res.text();
      return result;
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  },
  async getTasks() {
    this.tasks = await this.send("http://localhost:3000/tasks", {
      method: "GET",
    });
  },
  async getTask(id) {
    console.log(id);
    console.log(this.task);
    await this.send(`http://localhost:3000/tasks/${id}`, "GET");
  },
  createTask(newTask) {
    const methods = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    };
    const respond = this.send("http://localhost:3000/tasks", methods);
  },
  editTask(id) {
    this.getTask(id);
  },
  deleteTask(id) {},
  async renderTask() {
    await this.getTasks.call(this);
    let html =
      "" +
      this.tasks
        .map(function (task) {
          return `
        <div class="task-card ${this.escape(
          task.color
        )} ${task.isCompleted ? "completed" : ""}">
        <div class="task-header">
          <h3 class="task-title">${this.escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${task.id}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-index="${task.id}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-index="${
                task.id
              }">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(task.description)}</p>
        <div class="task-time">${this.escape(
          task.startTime
        )} - ${this.escape(task.endTime)}</div>
      </div>
        `;
        })
        .join("");

    if (html.length === 0) html = `<div>Không tìm thấy nhiệm vụ vào</div>`;
    this.listTask.innerHTML = html;
  },
  renderTitleFormTask() {
    if (this.isInsert) {
      this.submitModalBtn.textContent = `Create Task`;
      this.modalTitle.textContent = `Add New Task`;
    } else {
      this.submitModalBtn.textContent = `Save Change`;
      this.modalTitle.textContent = `Edit Task`;
    }
  },
  toggleTask() {
    this.addOrEditForm.reset();
    this.modal.scrollTop = 0;
    this.formInsertOrEditTask.classList.toggle("show");
    setTimeout(() => {
      this.taskTitle.focus();
    }, 100);
  },
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

  hangDleEvent() {
    this.btnOpenOrCloseForm.onclick = () => {
      this.isInsert = true;
      this.toggleTask.call(this);
    };
    this.btnCloseFormTask.onclick = () => {
      if (confirm(`Bạn chắc chắn muốn thoát?`)) {
        this.toggleTask.call(this);
      }
    };
    this.cancelModalBtn.onclick = () => {
      if (confirm(`Bạn chắc chắn muốn thoát?`)) {
        this.toggleTask.call(this);
      }
    };
    this.formInsertOrEditTask.onclick = (e) => {
      if (!this.modal.contains(e.target)) {
        this.cancelModalBtn.onclick();
      }
    };
    this.addOrEditForm.onsubmit = (e) => {
      e.preventDefault();
      const newTask = Object.fromEntries(new FormData(this.addOrEditForm));
      if (!this.tasks.find((task) => task.title === newTask.title)) {
        this.createTask.call(this, newTask);
        this.createToast(this.toasts[0], "Thành công rồi bạn nhé! Yên tâm đi");
        const div = document.createElement("div");
        div.classList.add(`task-card`);
        div.classList.add(escape(newTask.color));
        const html = `
        <div class="task-header">
          <h3 class="task-title">${escape(newTask.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${newTask.id}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-index="${
                newTask.id
              }">
                <i class="fa-solid fa-check fa-icon"></i>
                ${newTask.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-index="${
                newTask.id
              }">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(newTask.description)}</p>
        <div class="task-time">${this.escape(
          newTask.startTime
        )} - ${this.escape(newTask.endTime)}</div>
      `;
        div.innerHTML = html;
        this.listTask.appendChild(div);
        this.toggleTask();
      } else {
        this.createToast(
          this.toasts[3],
          "Không thể thêm được đâu, trùng title mất rồi bạn ơi."
        );
      }
    };
    this.listTask.onclick = (e) => {
      const editBtn = e.target.closest(`.edit-btn`);
      const completeOrActiveBtn = e.target.closest(`.complete-btn`);
      const deleteBtn = e.target.closest(`.delete-btn`);
      if (editBtn) {
        this.isInsert = false;
        this.renderTitleFormTask.call(this);
        this.editTask.call(this, editBtn.dataset.id);

        //this.toggleTask.call(this);
      }
      if (completeOrActiveBtn) {
        this.start.call(this);
      }
      if (deleteBtn) {
      }
    };
  },
};
todoTask.start();
