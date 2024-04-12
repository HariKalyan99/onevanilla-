let mainSidebar2 = document.querySelector("#main-sidebar2");
let mainCards = document.querySelector("#post-list");

const fetchBlogs = async () => {
  const response = await fetch("http://localhost:8081/posts");
  const jsonRes = await response.json();
  return jsonRes;
};

let postList = [];

async function onLoad() {
  const sidebarDivElement2 = document.createElement("div");
  sidebarDivElement2.setAttribute(
    "class",
    "d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
  );
  sidebarDivElement2.setAttribute("style", "width: 280px; height: 100%");
  sidebarDivElement2.innerHTML = `
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <svg class="bi pe-none me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">Sidebar</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <a href="index.html" class="nav-link text-white" aria-current="page">
          Createpost
        </a>
      </li>
      <li>
        <a href="#"  class="nav-link text-white active">
          Dashboard
        </a>
      </li>
    </ul>
    <hr>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
        <strong>mdo</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
        <li><a class="dropdown-item" href="#">New project...</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
    `;
  const fetchList = await fetchBlogs();

  postList = fetchList;
  // let blogCardElement = "";
  for (let i = 0; i < postList.length; i++) {
    const divEl = document.createElement("div");
    divEl.setAttribute("class", "col");
    divEl.setAttribute("id", `blog${postList[i].id}`);
    divEl.innerHTML = `
    <div class="card shadow-sm" >
    <div class="card-body">
      <p class="card-text">${postList[i].title}</p>
      <p class="card-text">${postList[i].body}</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group" id="btn-grp">
        <button class="btn btn-sm btn-outline-secondary">${postList[i].tags[0]}</button>
        <button class="btn btn-sm btn-outline-secondary">${postList[i].tags[2]}</button>
        </div>
        <small class="text-body-secondary">9 mins</small>
      </div>
      <button onclick="deletePost(${postList[i].id})">Delete Post</button>
      <button onclick="updatePost(${postList[i].id})">Update Post</button>
    </div>
  </div>
    `;

    mainCards.appendChild(divEl);

    // blogCardElement += `
    //     <div class="col">
    //       <div class="card shadow-sm">
    //         <div class="card-body">
    //           <p class="card-text">${postList[i].body}</p>
    //           <div class="d-flex justify-content-between align-items-center">
    //             <div class="btn-group">
    //               <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
    //               <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
    //             </div>
    //             <small class="text-body-secondary">9 mins</small>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    // `;
  }

  let btnGrp = document.querySelector("#btn-grp");
  for (let i = 0; i < postList.length; i++) {
    let btnElement = "";
    postList[i].tags.forEach((tag) => {
      btnElement += `
        <button class="btn btn-sm btn-outline-secondary">${tag}</button>
      `;
    });
    btnGrp.innerHTML = btnElement;
  }

  mainSidebar2.append(sidebarDivElement2);
}

onLoad();

async function deletePost(id) {
  try {
    const response = await fetch("http://localhost:8081/posts/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonRes = await response.json();
  } catch (error) {
    console.log(error);
  }
}

function updatePost(id) {
  // console.log(id, postList);

  const search = postList.find((x) => x.id == id);
  localStorage.setItem("post", JSON.stringify(search));

  showEditPost();
}

function showEditPost() {
  const getFromLocal = localStorage.getItem("post");

  const jsonParser = JSON.parse(getFromLocal);

  const blogEl = document.getElementById(`editBlogs`);

  const { userId, title, body, tags, reactions, id } = jsonParser;

  const formEle = document.createElement("form");
  formEle.setAttribute("class", "main-form2");

  formEle.innerHTML = `
  <form >
  <h1>Edit Post</h1>
  <label for="userIdEdit">UserId</label>
  <input type="text" id="userIdEdit">

  <label for="titleEdit">Title</label>
  <input type="text" id="titleEdit"  >

  <label for="bodyEdit">Body</label>
  <textarea name="body" id="bodyEdit"  cols="30" rows="10"></textarea>

  <label for="tagsEdit">Tags</label>
  <input type="text" id="tagsEdit">

  <label for="reactionsEdit">Reactions</label>
  <input type="text" id="reactionsEdit"  >

  <button type="submit" class="btn btn-primary m-5">Update Post</button>
  </form>

`;

  blogEl.append(formEle);

  document.querySelector(".main-form2").elements["userIdEdit"].value =
    Number(userId);
  document.querySelector(".main-form2").elements["titleEdit"].value = title;

  document.getElementById("bodyEdit").innerText = body;
  document.querySelector(".main-form2").elements["tagsEdit"].value =
    tags.join(",");
  document.querySelector(".main-form2").elements["reactionsEdit"].value =
    Number(reactions);

  canEdit(id);
}

function canEdit(id) {
  const formEle2 = document.querySelector(".main-form2");
  formEle2.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      userId: formEle2.elements["userIdEdit"].value,
      title: formEle2.elements["titleEdit"].value,
      body: formEle2.elements["bodyEdit"].value,
      tags: formEle2.elements["tagsEdit"].value.split(","),
      reactions: formEle2.elements["reactionsEdit"].value,
    };

    updateNewPost(data, id);
  });
}

async function updateNewPost({ userId, title, body, tags, reactions }, id) {
  try {
    const response = await fetch(`http://localhost:8081/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        body,
        tags,
        reactions,
      }),
    });
    const jsonRes = response.json();
    console.log(jsonRes);
  } catch (error) {
    console.log(error);
  }
}
