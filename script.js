const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.getElementById("filter");
const submitBtn = itemForm.querySelector("button");
let isEditMode = false;

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  button.appendChild(createIcon("fa-solid fa-xmark"));
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function displayItems() {
  const storageItems = getStorageItems();
  storageItems.forEach((item) => addtoDOM(item));
  checkUI();
}

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (newItem == "") {
    alert("Please add an item");
    return;
  }

  if (isEditMode) {
    const editItem = itemList.querySelector(".edit-mode");
    removeStorageItem(editItem.textContent);
    editItem.remove();
    isEditMode = false;
  } else {
    if (itemExists(newItem)) {
      alert("Item already exists!");
      return;
    }
  }
  addtoDOM(newItem);
  addtoStorage(newItem);

  checkUI();

  itemInput.value = "";
}

function addtoDOM(newItem) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
}

function addtoStorage(newItem) {
  const storageItems = getStorageItems();

  storageItems.push(newItem);
  localStorage.setItem("items", JSON.stringify(storageItems));
}

function getStorageItems() {
  let storageItems;
  if (localStorage.getItem("items") === null) {
    storageItems = [];
  } else {
    storageItems = JSON.parse(localStorage.getItem("items"));
  }
  return storageItems;
}

function clickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    deleteItem(e.target.parentElement.parentElement);
  } else {
    editMode(e.target);
  }
}

function itemExists(item) {
  const storageItems = getStorageItems();
  return storageItems.includes(item);
}

function editMode(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Item';
  submitBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function deleteItem(item) {
  if (confirm("Are you sure?")) {
    item.remove();
    removeStorageItem(item.textContent);
    checkUI();
  }
}

function removeStorageItem(item) {
  let storageItems = getStorageItems();
  storageItems = storageItems.filter((storageItem) => storageItem !== item);
  localStorage.setItem("items", JSON.stringify(storageItems));
}

function clearItems(e) {
  if (confirm("Are you sure?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem("items");
    checkUI();
  }
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    filter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filter.style.display = "block";
    clearBtn.style.display = "block";
  }

  submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  submitBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function init() {
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", clickItem);
  clearBtn.addEventListener("click", clearItems);
  filter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
