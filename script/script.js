const books = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const LOCAL_STORAGE_KEY = 'books';

const checkStorageExist = () => {
  if (typeof Storage == undefined) {
    alert("Sorry, your browser isn't supported for local storage");
    return false;
  }

  return true;
};

const generateId = () => new Date().getTime().toString();

const generateBookObj = (id, title, author, year, description, isFinishedRead) => { 
  return { id, title, author, year, description, isFinishedRead };
};

const saveData = () => {
  if (checkStorageExist()) {
    const parsedBooksData = JSON.stringify(books);
    localStorage.setItem(LOCAL_STORAGE_KEY, parsedBooksData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const loadData = () => {
  const serializedBooksData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let data = JSON.parse(serializedBooksData);

  if (data !== null) {
    for (let todo of data) {
      books.push(todo);
    }
  }

  // document.dispatchEvent(new Event(RENDER_EVENT));
};

const createNewBook = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const description = document.getElementById('description').value;

  const id = generateId();
  const book = generateBookObj(id, title, author, year, description, false);
  books.push(book);

  // document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const formClassValue = form.getAttribute('class');

  if (formClassValue == 'add-form') {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      createNewBook();
    })
  }

  if (checkStorageExist()) loadData();

});

document.addEventListener(SAVED_EVENT, () => console.log(localStorage.getItem(LOCAL_STORAGE_KEY)));
