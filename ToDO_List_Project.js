// Function to submit the task
function submit(event) {
    event.preventDefault();
    var inputValue = document.getElementById('Submit').value;
    if (inputValue.trim() === '') {
        noSuccess();
    } else {
        var newId = new Date().getTime().toString();
        var text = '';
        text += "<ul class='list-items1' id ='" + newId + "'>";
        text += "<li class='list-link1'>";
        text += "<input type='checkbox' id='" + newId + "_checkbox' onclick = 'cross(\"" + newId + "\")'>";
        text += "<p>" + inputValue + "</p>";
        text += "<a href='#' onclick='edit(\"" + newId + "\")'>" + "<i class='fa-solid fa-pen-to-square'>" + "</i>" + "</a>";
        text += "<a href='#' onclick='showDeleteModal(\"" + newId + "\")' type='button'> " + "<i class='fa-solid fa-trash'>" + "</i>" + "</a>";
        text += "<a href='#' onclick='moveUp(\"" + newId + "\")'><i class='fa-solid fa-arrow-up'></i></a>";
        text += "<a href='#' onclick='moveDown(\"" + newId + "\")'><i class='fa-solid fa-arrow-down'></i></a>";
        text += "<a href='#' onclick='duplicate(\"" + newId + "\")'><i class='fa-solid fa-copy'></i></a>";
        text += "</li>";
        text += "</ul>";
        document.querySelector('.list1').innerHTML += text;
        document.getElementById('Submit').value = '';
        addToLocalStorage(newId, text, false);
        updateAllMoveButtons();
        success();
    }
}

// Event listener for submit button
document.getElementById('submit-button').addEventListener('click', submit);

document.getElementById('Submit').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        submit(event);
    }
});

// Function to show delete modal
let itemToDelete = null;
function showDeleteModal(itemId) {
    itemToDelete = itemId;
    const item = document.getElementById(itemId);
    if (item) {
        const itemContent = item.querySelector('p').innerText;
        document.getElementById('deleteItemContent').innerText = `Are you sure you want to delete this item: =>[${itemContent}]?`;
    }
    $('#confirmDeleteModal').modal('show');
}

// Function to delete item
function deleteItem() {
    if (itemToDelete) {
        const item = document.getElementById(itemToDelete);
        if (item) {
            item.remove();
            removeFromLocalStorage(itemToDelete);
            updateAllMoveButtons();
        }
        $('#confirmDeleteModal').modal('hide');
    }
}

document.getElementById('confirmDeleteButton').addEventListener('click', deleteItem);

// Function to move item up
function moveUp(id) {
    var item = document.getElementById(id);
    var previousItem = item.previousElementSibling;
    if (previousItem) {
        item.parentNode.insertBefore(item, previousItem);
        upSwappingInLocalStorage(id);
        updateAllMoveButtons();
    }
}

// Function to move item down
function moveDown(id) {
    var item = document.getElementById(id);
    var nextItem = item.nextElementSibling;
    if (nextItem) {
        item.parentNode.insertBefore(nextItem, item);
        downSwappingInLocalStorage(id);
        updateAllMoveButtons();
    }
}

// Function to update all move buttons
function updateAllMoveButtons() {
    const items = document.querySelectorAll('.list-items1');
    items.forEach((item, index) => {
        const moveUpButton = item.querySelector("a[onclick*='moveUp']");
        const moveDownButton = item.querySelector("a[onclick*='moveDown']");
        if (index === 0) {
            moveUpButton.style.color = 'rgba(128, 128, 128, 0.416)';
            moveUpButton.style.opacity = 0.4;
            moveUpButton.style.cursor = "not-allowed";
            moveUpButton.style.pointerEvents = "none";
        } else {
            moveUpButton.style.color = '';
            moveUpButton.style.opacity = 1;
            moveUpButton.style.cursor = "";
            moveUpButton.style.pointerEvents = "";
        }
        if (index === items.length - 1) {
            moveDownButton.style.color = 'rgba(128, 128, 128, 0.416)';
            moveDownButton.style.opacity = 0.4;
            moveDownButton.style.cursor = "not-allowed";
            moveDownButton.style.pointerEvents = "none";
        } else {
            moveDownButton.style.color = '';
            moveDownButton.style.opacity = 1;
            moveDownButton.style.cursor = "";
            moveDownButton.style.pointerEvents = "";
        }
    });
}

// Function to duplicate item
function duplicate(id) {
    var item = document.getElementById(id);
    var clonedMenu = item.cloneNode(true);
    var clonedId = new Date().getTime().toString();
    clonedMenu.id = clonedId;

    // Update the IDs and onclick events in the cloned item to reference the new ID
    clonedMenu.querySelectorAll('a').forEach(function (aTag) {
        var onclickValue = aTag.getAttribute('onclick');
        var newOnclickValue = onclickValue.replace(id, clonedId);
        aTag.setAttribute('onclick', newOnclickValue);
    });

    // Ensure checkbox state is cloned and uniquely identified
    let checkbox = clonedMenu.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.id = clonedId + "_checkbox";
        checkbox.setAttribute('onclick', 'cross("' + clonedId + '")');
        checkbox.checked = true;  // New checkbox should be unchecked initially
    }

    item.parentNode.insertBefore(clonedMenu, item.nextSibling);
    addToLocalStorage(clonedId, clonedMenu.outerHTML, checkbox.checked);
    updateAllMoveButtons();
}

// Function to add item to localStorage
function addToLocalStorage(id, text, checked) {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    list.push({ id: id, text: text, checked: checked });
    localStorage.setItem('list', JSON.stringify(list));
}

// Function to load state from localStorage
function loadState() {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    list.forEach(element => {
        let item = document.getElementById(element.id);
        if (item) {
            let checkbox = item.querySelector("input[type='checkbox']");
            if (element.checked) {
                checkbox.checked = true;
                item.querySelector("p").style.textDecoration = "line-through";
            } else {
                checkbox.checked = false;
                item.querySelector("p").style.textDecoration = "none";
            }
        } else {
            // Handle case where item was deleted from DOM but still exists in localStorage
            document.querySelector('.list1').innerHTML += element.text;
        }
    });
    updateAllMoveButtons();
}

document.addEventListener("DOMContentLoaded", () => {
    storingToLocalStorage();
    loadState();
});

// Function to store state to localStorage
function storingToLocalStorage() {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    list.forEach(element => {
        if (!document.getElementById(element.id)) {
            document.querySelector('.list1').innerHTML += element.text;
        }
    });
    updateAllMoveButtons();
}

// Function to remove item from localStorage
function removeFromLocalStorage(id) {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    list = list.filter(item => item.id !== id.toString());
    localStorage.setItem('list', JSON.stringify(list));
}

// Function to update checked state in localStorage
function updateCheckedStateInLocalStorage(id, checked) {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    let item = list.find(item => item.id === id.toString());
    if (item) {
        item.checked = checked;
        localStorage.setItem('list', JSON.stringify(list));
    }
}

// Function to handle text crossing
function cross(id) {
    var para = document.getElementById(id).querySelector("p");
    var checkbox = document.getElementById(id).querySelector("input[type='checkbox']");
    if (checkbox.checked) {
        para.style.textDecoration = "line-through";
    } else {
        para.style.textDecoration = "none";
    }
    updateCheckedStateInLocalStorage(id, checkbox.checked);
}

// Function to swap items in localStorage when moved up
function upSwappingInLocalStorage(uniqueId1) {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    let index = list.findIndex(item => item.id == uniqueId1.toString());
    if (index > 0) {
        let temp = list[index - 1];
        list[index - 1] = list[index];
        list[index] = temp;
        localStorage.setItem('list', JSON.stringify(list));
    }
}

// Function to swap items in localStorage when moved down
function downSwappingInLocalStorage(uniqueId1) {
    let list = JSON.parse(localStorage.getItem('list')) || [];
    let index = list.findIndex(item => item.id == uniqueId1.toString());
    if (index < list.length - 1) {
        let temp = list[index + 1];
        list[index + 1] = list[index];
        list[index] = temp;
        localStorage.setItem('list', JSON.stringify(list));
    }
}



// function showDeleteAllButton(){
//     document.getElementById("removeEmpty").style.display = "flex"
// }

// function removeAll(event) {
//     event.preventDefault();
//     let remo = document.querySelectorAll(".list-items1")
//     for (var i = 0; i < remo.length; i++) {
//         remo[i].remove();
//         removeFromLocalStorage();
//     }
//     setTimeout(removeButton(), 3000)
// }
// function removeButton(){
//     document.getElementById("removeEmpty").style.display = "none";
// }
// function removeFromLocalStorage() {
//     localStorage.removeItem('list');
// }


        // showDeleteAllButton();
