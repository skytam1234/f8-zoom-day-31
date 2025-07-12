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
  submitModalBtn: $(`.btn-submit`),
  cancelModalBtn: $(`.btn-cancel`),
  listTask: $(`#todoList`),
  formInsertOrEditTask: $(`#addTaskModal`),
  modalTitle: $(`.modal-title`),
  isInsert: true,
  isShow: false,
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
    if (!this.isShow) {
      if (confirm("Bạn chắc chắn muốn thoát")) {
        this.formInsertOrEditTask.classList.toggle("show");
      }
    } else {
      this.formInsertOrEditTask.classList.toggle("show");
    }
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
  start() {
    this.renderTitleFormTask.call(this);
    this.hangDleEvent();
  },
  hangDleEvent() {
    this.btnOpenOrCloseForm.onclick = () => {
      //   this.isInsert = true;
      //   this.isShow = true;
      this.toggleTask.bind(this);
    };
    this.btnCloseFormTask.onclick = () => {
      this.isShow = false;
      this.toggleTask.bind(this);
    };
    // this.cancelModalBtn.onclick = this.btnCloseFormTask.onclick();
    // this.formInsertOrEditTask.onclick = (e) => {
    //   if (!this.modal.contains(e.target) && this.isShow) {
    //     console.log("áddsad");
    //   }
    // };
  },
};
todoTask.start();
