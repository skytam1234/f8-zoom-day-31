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
    taskDescription: $(`#taskDescription`),
    taskCategory: $(`#taskCategory`),
    taskPriority: $(`#taskPriority`),
    startTime: $(`#startTime`),
    endTime: $(`#endTime`),
    taskDate: $(`#taskDate`),
    taskColor: $(`#taskColor`),
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
    async start() {
        await this.renderTask();
        await this.renderTitleFormTask.call(this);
        await this.hangDleEvent();
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
    addCurrentTask() {
        console.log(this.task);
        this.taskTitle.value = this.task.title;
        this.taskDescription.value = this.task.description;
        this.taskCategory.value = this.task.category;
        this.taskPriority.value = this.task.priority;
        this.startTime.value = this.task.startTime;
        this.endTime.value = this.task.endTime;
        this.taskDate.value = this.task.dueDate;
        this.taskColor.value = this.task.color;
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
        this.task = await this.send(`http://localhost:3000/tasks/` + id);
    },
    async createTask(newTask) {
        const methods = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        };
        this.task = await this.send("http://localhost:3000/tasks", methods);
        console.log(this.task);
    },
    async editTask(id, newTask) {
        const methods = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        };
        this.task = await this.send(
            `http://localhost:3000/tasks/` + id,
            methods
        );
    },
    deleteTask(id) {
        const methods = { method: "DELETE" };
        Promise.all([
            this.send(`http://localhost:3000/tasks/` + id, methods),
        ]).then(() => {
            this.renderTask();
        });
    },
    async renderTask(todoTasks) {
        if (todoTasks) {
            let html =
                "" +
                todoTasks
                    .map(function (task) {
                        return `
        <div class="task-card ${this.escape(
            task.color
        )} ${task.isCompleted ? "completed" : ""}" data-id=${this.escape(task.id)}>
        <div class="task-header">
          <h3 class="task-title">${this.escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${this.escape(
                  task.id
              )}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-id="${this.escape(
                  task.id
              )}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-id="${this.escape(
                  task.id
              )}">
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
            if (html.length === 0)
                html = `<div class="error-ms">Không tìm thấy nhiệm vụ vào</div>`;
            this.listTask.innerHTML = html;
            return;
        }
        await this.getTasks.call(this);

        let html =
            "" +
            (await this.tasks
                .map((task) => {
                    return `
        <div class="task-card ${this.escape(task.color)} ${
                        task.isCompleted ? "completed" : ""
                    }" data-id=${this.escape(task.id)}>
        <div class="task-header">
          <h3 class="task-title">${this.escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${this.escape(
                  task.id
              )}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-id="${this.escape(
                  task.id
              )}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-id="${this.escape(
                  task.id
              )}">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(task.description)}</p>
        <div class="task-time">${this.customTime(
            this.escape(task.startTime)
        )} - ${this.customTime(this.escape(task.endTime))}</div>
      </div>
        `;
                })
                .join(""));
        if (html.length === 0)
            html = `<div class="error-ms">Không tìm thấy nhiệm vụ vào</div>`;
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
        const tempDiv = document.createElement("div");
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
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
        this.addOrEditForm.onsubmit = async (e) => {
            e.preventDefault();
            if (this.isInsert) {
                const newTask = Object.fromEntries(
                    new FormData(this.addOrEditForm)
                );
                if (!this.tasks.find((task) => task.title === newTask.title)) {
                    await this.createTask.call(this, newTask);
                    this.createToast(
                        this.toasts[0],
                        "Thành công rồi bạn nhé! Yên tâm đi"
                    );
                    const oldTask = this.listTask.querySelector(`.error-ms`);
                    if (oldTask) this.listTask.removeChild(oldTask);
                    const div = document.createElement("div");
                    div.classList.add(`task-card`);
                    div.classList.add(this.escape(newTask.color));
                    const html = `
                      <div class="task-header">
          <h3 class="task-title">${this.escape(newTask.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${this.escape(
                  this.task.id
              )}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-id="${this.escape(
                  this.task.id
              )}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${newTask.isCompleted ? "Mark as Active" : "Mark as Complete"} 
              </div>
              <div class="dropdown-item delete delete-btn" data-id="${this.escape(
                  this.task.id
              )}">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(newTask.description)}</p>
        <div class="task-time">${this.customTime(
            this.escape(newTask.startTime)
        )} - ${this.customTime(this.escape(newTask.endTime))}</div>`;
                    div.innerHTML = html;
                    this.listTask.appendChild(div);
                    this.toggleTask();
                } else {
                    this.createToast(
                        this.toasts[3],
                        "Không thể thêm được đâu, trùng title mất rồi bạn ơi."
                    );
                }
            } else {
                const newTask = Object.fromEntries(
                    new FormData(this.addOrEditForm)
                );
                await this.editTask.call(this, this.task.id, newTask);
                this.renderTask.call(this);
                this.toggleTask();
            }
        };
        this.listTask.onclick = async (e) => {
            const editBtn = e.target.closest(`.edit-btn`);
            const completeOrActiveBtn = e.target.closest(`.complete-btn`);
            const deleteBtn = e.target.closest(`.delete-btn`);
            if (editBtn) {
                this.isInsert = false;
                console.log(editBtn.dataset.id);
                await this.getTask.call(this, editBtn.dataset.id);
                await this.renderTitleFormTask.call(this);
                await this.toggleTask.call(this);
                await this.addCurrentTask.call(this);
            }
            if (completeOrActiveBtn) {
                const newTask = { isCompleted: true };
                await this.editTask.call(
                    this,
                    completeOrActiveBtn.dataset.id,
                    newTask
                );
                await this.renderTask.call(this);
            }
            if (deleteBtn) {
                if (confirm("Bạn chắc chắn muốn xóa?")) {
                    await this.deleteTask.call(this, deleteBtn.dataset.id);
                    await this.createToast(
                        this.toasts[0],
                        "Thành công rồi bạn nhé! Yên tâm đi"
                    );
                }
            }
        };
        this.searchBtn.oninput = async (e) => {
            this.sortCompleteTaskBtn.classList.remove("active");
            this.sortAllTaskBtn.classList.add("active");
            this.sortActiveTaskBtn.classList.remove("active");
            let str = this.searchBtn.value;
            let newList = this.tasks.filter(
                (task) =>
                    task.title.toString().toLowerCase().includes(str) ||
                    task.description.toString().toLowerCase().includes(str)
            );

            await this.renderTask.call(this, newList);
        };
        this.sortAllTaskBtn.onclick = async (e) => {
            this.sortCompleteTaskBtn.classList.remove("active");
            this.sortAllTaskBtn.classList.add("active");
            this.sortActiveTaskBtn.classList.remove("active");
            await this.renderTask.call(this);
        };
        this.sortActiveTaskBtn.onclick = async (e) => {
            this.sortCompleteTaskBtn.classList.remove("active");
            this.sortAllTaskBtn.classList.remove("active");
            this.sortActiveTaskBtn.classList.add("active");
            let newList = this.tasks.filter((task) => {
                if (task.isCompleted) {
                    return true;
                } else {
                    return false;
                }
            });
            await this.renderTask.call(this, newList);
        };
        this.sortCompleteTaskBtn.onclick = async (e) => {
            this.sortCompleteTaskBtn.classList.add("active");
            this.sortAllTaskBtn.classList.remove("active");
            this.sortActiveTaskBtn.classList.remove("active");
            let newList = this.tasks.filter((task) => {
                if (!task.isCompleted) {
                    return true;
                } else {
                    return false;
                }
            });
            await this.renderTask.call(this, newList);
        };
    },
};
todoTask.start();
