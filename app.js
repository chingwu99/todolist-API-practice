// 註冊登入換頁
const listPage = document.querySelector(".listPage");
const lognInPage = document.querySelector(".lognIn");
const signInPage = document.querySelector(".signIn");

const signInText = document.querySelector(".loginPage-signIn-text");
signInText.addEventListener("click", () => {
  lognInPage.classList.add("none");
  signInPage.classList.remove("none");
});

const lognInText = document.querySelector(".signPage-signIn-text");
lognInText.addEventListener("click", () => {
  signInPage.classList.add("none");
  lognInPage.classList.remove("none");
});

// 註冊頁面
const apiUrl = "https://todoo.5xcamp.us";
const signInEmail = document.querySelector(".signIn-page-email");
const signNickName = document.querySelector(".signIn-page-nickName");
const signInPassword = document.querySelector(".signIn-page-password");
const checkSignInPassword = document.querySelector(
  ".signIn-page-check-password"
);
const signInButton = document.querySelector(".signIn-button");

signInButton.addEventListener("click", () => {
  let email = signInEmail.value.trim();
  let nickName = signNickName.value.trim();
  let password = signInPassword.value.trim();
  let checkPassword = checkSignInPassword.value.trim();

  // console.log(password);
  if (email === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入信箱！",
    });
    return;
  } else if (nickName === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入暱稱！",
    });
    return;
  } else if (password === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入密碼！",
    });
    return;
  } else if (checkPassword === "") {
    Swal.fire({
      icon: "warning",
      title: "請再次輸入密碼！",
    });
    return;
  } else if (password !== checkPassword) {
    Swal.fire({
      icon: "warning",
      title: "再次輸入密碼與密碼不相符！",
    });
    return;
  } else if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "密碼請輸入至少六碼！",
    });
    return;
  }

  signIn(email, nickName, password);
});

function signIn(email, nickName, password) {
  axios
    .post(`${apiUrl}/users`, {
      user: {
        email: email,
        nickname: nickName,
        password: password,
      },
    })
    .then((res) => {
      // console.log(res);

      Swal.fire({
        icon: "success",
        title: res.data.message,
      }).then((result) => {
        signInPage.classList.add("none");
        lognInPage.classList.remove("none");
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: err.response.data.message,
        text: err.response.data.error[0],
      });
    });

  signInEmail.value = "";
  signNickName.value = "";
  signInPassword.value = "";
  checkSignInPassword.value = "";
}

//登入頁面
const lognInEmail = document.querySelector(".lognInEmail");
const lognInPassword = document.querySelector(".lognInPassword");
const lognInButton = document.querySelector(".lognIn-button");
const inputAleart = document.querySelectorAll(".input-aleart");

lognInButton.addEventListener("click", () => {
  let email = lognInEmail.value.trim();
  let password = lognInPassword.value.trim();

  if (email === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入信箱！",
    }).then((result) => {
      inputAleart.forEach((i) => i.classList.remove("none"));
    });
    return;
  } else if (password === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入密碼！",
    }).then((result) => {
      inputAleart.forEach((i) => i.classList.remove("none"));
    });
    return;
  } else if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "密碼請輸入至少六碼！",
    });
    return;
  }

  lognIn(email, password);
});

const listPageNav = document.querySelector(".listPage-nav");
const username = document.querySelector(".listPage-nav-username");
let lognInName = "";

function lognIn(email, password) {
  axios
    .post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: res.data.message,
      }).then((result) => {
        lognInEmail.value = "";
        lognInPassword.value = "";
        // console.log(res);
        axios.defaults.headers.common["Authorization"] =
          res.headers.authorization;

        lognInName = res.data.nickname;
        username.innerText = lognInName;

        lognInPage.classList.add("none");
        listPage.classList.remove("none");
        listPageNav.classList.remove("none");

        getTodo();
      });
    })
    .catch((err) => {
      // console.log(err.response);
      Swal.fire({
        icon: "error",
        title: err.response.data.message,
        text: "帳號或密碼有誤",
      });
    });
}

//取得後端todo資料
let resData = [];
function getTodo() {
  axios
    .get(`${apiUrl}/todos`)
    .then((res) => {
      // console.log(res);
      resData = res.data.todos;
      // console.log(resData);

      updateData();
    })
    .catch((err) => {
      // console.log(err.response);
    });
}

//渲染
const list = document.querySelector(".list");

function renderData(arr) {
  let str = "";
  arr.forEach((i) => {
    str += `<li data-id=${i.id}>
        <label class="checkbox" >
          <input type="checkbox"  data-state=${i.state} ${i.state}/>
          <span>${i.content}</span>
        </label>
        <a href="#" class="delete">X</a>
      </li>`;
  });

  list.innerHTML = str;
}

//新增todo
const inputTodo = document.querySelector(".inputTodo");
const add = document.querySelector(".btn_add");

add.addEventListener("click", () => {
  let text = inputTodo.value.trim();
  if (text === "") {
    Swal.fire({
      icon: "warning",
      title: "請輸入代辦事項！",
    });
    return;
  }

  addTodo(text);

  inputTodo.value = "";
});

function addTodo(todo) {
  axios
    .post(`${apiUrl}/todos`, {
      todo: {
        content: todo,
      },
    })
    .then((res) => {
      // console.log(res);
      getTodo();
    })
    .catch((err) => {
      // console.log(err.response);
    });
}
//刪除代辦、切換代辦狀態
list.addEventListener("click", (e) => {
  const id = e.target.closest("li").dataset.id;
  // console.log(e.target.dataset.state)
  if (e.target.getAttribute("class") === "delete") {
    deleteTodo(id);
  } else {
    toggleTodo(id);
  }
});

function deleteTodo(id) {
  axios
    .delete(`${apiUrl}/todos/${id}`)
    .then((res) => {
      // console.log(res);
      getTodo();
    })
    .catch((err) => {
      // console.log(err.response);
    });
}

function toggleTodo(id) {
  axios
    .patch(`${apiUrl}/todos/${id}/toggle`, {})
    .then((res) => {
      // console.log(res);
      getTodo();
    })
    .catch((err) => {
      // console.log(err.response);
    });
}

//tab狀態、tab篩選
const tab = document.querySelector(".tab");
let tabState = "all";
// console.log(tabState);
tab.addEventListener("click", (e) => {
  const tabs = document.querySelectorAll(".tab li");
  tabState = e.target.dataset.state;
  tabs.forEach((i) => {
    i.classList.remove("active");
  });

  e.target.classList.add("active");

  updateData();
});

function updateData() {
  let updateList = [];

  resData.forEach((i) => {
    if (i.completed_at === null) {
      i.state = "";
    } else {
      i.state = "checked";
    }
  });

  if (tabState == "all") {
    updateList = resData;
  } else if (tabState == "undo") {
    updateList = resData.filter((i) => i.state == "");
  } else {
    updateList = resData.filter((i) => i.state == "checked");
  }

  renderData(updateList);

  const todoNum = document.querySelector("#todoNum");
  todoNum.innerText = resData.filter((i) => i.state == "").length;
}

//刪除完成代辦
const clearDone = document.querySelector("#clearDone");
// console.log(clearDone);
clearDone.addEventListener("click", () => {
  resData.forEach((i) => {
    if (i.state == "checked") {
      deleteTodo(i.id);
    }
  });
});

//登出
const lognOutText = document.querySelector(".lognOut");
lognOutText.addEventListener("click", () => {
  lognOut();
});

function lognOut() {
  axios
    .delete(`${apiUrl}/users/sign_out`)
    .then((res) => {
      // console.log(res);

      Swal.fire({
        icon: "success",
        title: res.data.message,
      }).then((result) => {
        listPage.classList.add("none");
        listPageNav.classList.add("none");
        lognInPage.classList.remove("none");
      });
    })
    .catch((err) => {
      // console.log(err.response);
    });
}
