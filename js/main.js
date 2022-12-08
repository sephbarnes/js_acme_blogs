//Joseph Barnes
//12/8/2022
//Front End Web Development
//#1
function createElemWithText(elemStrName = "p", textContent = "", className) {
  const myElem = document.createElement(elemStrName);
  //myElem.id = ""; //TODO DO I NEED THIS??
  myElem.textContent = textContent;
  if (className) myElem.classList.add(className);
  return myElem;
}

//#2
function createSelectOptions(data) {
  if (!data) {
    return undefined;
  }
  return data.map((user) => {
    var option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    return option;
  });
}

//#3
function toggleCommentSection(postId) {
  if (!postId) return;
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (section) {
    section.classList.toggle("hide");
  }
  return section;
}

//#4
function toggleCommentButton(postId) {
  if (!postId) return;

  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (button == null) return button;
  //console.log(button);

  if (button.textContent == "Show Comments") {
    button.textContent = "Hide Comments";
  } else button.textContent = "Show Comments";

  return button;
}

//#5
function deleteChildElements(parentElement) {
  if (!parentElement?.tagName) return;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  for (const button of buttons) {
    const postId = button.dataset.postId;
    button.addEventListener(
      "click",
      function (event) {
        toggleComments(event, postId);
      },
      false
    );
  }
  return buttons;
}

//#7
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  for (const button of buttons) {
    const postId = button.dataset.id;
    button.removeEventListener(
      "click",
      function (event) {
        toggleComments(event, postId);
      },
      false
    );
  }
  return buttons;
}

//#8
function createComments(comments) {
  if (!comments) return;
  const fragment = document.createDocumentFragment();
  for (let comment of comments) {
    const article = document.createElement("article");
    const h3Elem = createElemWithText("h3", comment.name);
    const pElement = createElemWithText("p", comment.body);
    const pElementEmail = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3Elem);
    article.append(pElement);
    article.append(pElementEmail);
    fragment.append(article);
  }
  return fragment;
}

//#9
function populateSelectMenu(users) {
  if (!users) return;
  const selectMenu = document.getElementById("selectMenu");
  const options = createSelectOptions(users); //receives array
  //console.log(users); 
  for (let option of options) {
    //console.log(option); 
    selectMenu.append(option);
  }
  //console.log(selectMenu);
  return selectMenu;
}

//#10
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const jsonUserData = await response.json();
    return jsonUserData;
  } catch (e) {
    console.error(e);
  }
}

//#11
async function getUserPosts(userId) {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const jsonUserData = await response.json();
    return jsonUserData;
  } catch (e) {
    console.error(e);
  }
}

//#12
async function getUser(userId) {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const jsonUserData = await response.json();
    return jsonUserData;
  } catch (e) {
    console.error(e);
  }
}

//#13
async function getPostComments(postId) {
  if (!postId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );
    const jsonUserData = await response.json();
    return jsonUserData;
  } catch (e) {
    console.error(e);
  }
}

//#14
async function displayComments(postId) {
  if (!postId) return;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments");
  section.classList.add("hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  return section;
}

//#15
async function createPosts(posts) {
  if (!posts) return;
  var fragment = document.createDocumentFragment();
  for (let post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const p = createElemWithText("p", post.body);
    const p2 = createElemWithText("p", `Post ID: ${post.id}`);
    var author = await getUser(post.userId);
    const p3 = await createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const p4 = await createElemWithText("p", `${author.company.catchPhrase}`);
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = await post.id;
    const section = await displayComments(post.id);
    article.append(h2, p, p2, p3, p4, button, section);
    fragment.append(article);
  }
  return fragment;
}

//#16
async function displayPosts(posts) {
  let mainElem = document.querySelector("main");
  let element = await posts
    ? await createPosts(posts)
    : createElemWithText(
        "p",
        "Select an Employee to display their posts.",
        "default-text"
      );
  mainElem.append(element);
  return element;
}

//#17
function toggleComments(event, postId) {
  if (!event || !postId) return;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}

//#18
async function refreshPosts(posts) {
  if (!posts) return;
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector("main"));
  const fragment = document.createDocumentFragment();
  fragment.append(await displayPosts(posts));
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}

//#19
async function selectMenuChangeEventHandler(event) {
  if(!event) return;
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.setAttribute("disabled",true); 
  const userId = event?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  selectMenu.removeAttribute("disabled");
  return [userId, posts, refreshPostsArray];
}

//#20
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

//#21
const initApp = () => {
  initPage();
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.addEventListener("change", function (event) {selectMenuChangeEventHandler(event)})
};

// Launch app
document.addEventListener("DOMContentLoaded", (event) => {
  initApp();
});
