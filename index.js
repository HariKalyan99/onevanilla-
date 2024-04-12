let mainSidebar = document.querySelector("#main-sidebar");
let mainForm = document.querySelector("#main-form");

function onLoad() {
  const sidebarDivElement = document.createElement("div");
  sidebarDivElement.setAttribute(
    "class",
    "d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
  );
  sidebarDivElement.setAttribute("style", "width: 280px; height: 100vh");
  sidebarDivElement.innerHTML = `
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <svg class="bi pe-none me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">Sidebar</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item" >
        <a href="#" class="nav-link text-white active" aria-current="page" >
          Createpost
        </a>
      </li>
      <li >
        <a href="dashboard.html" class="nav-link text-white ">
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

  const formElement = document.createElement("form");

  formElement.setAttribute(
    "class",
    "d-flex flex-column justify-content-center align-items-center w-100 h-100"
  );
  formElement.setAttribute("id", "postForm");
  formElement.innerHTML = `
  <h1>Create Post</h1>
    <label for="userId">UserId</label>
    <input type="text" id="userId" required>

    <label for="title">Title</label>
    <input type="text" id="title" required>

    <label for="body">Body</label>
    <textarea name="body" id="body" cols="30" rows="10"></textarea>

    <label for="tags">Tags</label>
    <input type="text" id="tags" required>

    <label for="reactions">Reactions</label>
    <input type="text" id="reactions" required>

    <button type="submit" class="btn btn-primary m-5">Add Post</button>
    `;

  mainSidebar.append(sidebarDivElement);
  mainForm.append(formElement);
}

onLoad();

const createForm = document.querySelector("#postForm");

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    userId: createForm.elements["userId"].value,
    title: createForm.elements["title"].value,
    body: createForm.elements["body"].value,
    tags: createForm.elements["tags"].value.split(","),
    reactions: createForm.elements["reactions"].value,
  };

  addPost(data);

  console.log("form clicked", data);
});

async function addPost({ userId, title, body, tags, reactions }) {
  try {
    const response = await fetch("http://localhost:8081/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: Number(userId),
        title,
        body,
        tags,
        reactions: Number(reactions),
      }),
    });
    const jsonRes = await response.json();
  } catch (error) {
    console.log("Error", error);
  }
}
