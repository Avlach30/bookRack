const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
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
    for (let book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const createNewBook = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const description = document.getElementById('description').value;

  const id = generateId();
  const book = generateBookObj(id, title, author, year, description, false);
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findBookById = (bookId) => {
  for (let book of books) {
    if (book.id === bookId) return book;
  }

  return null;
};

const getDetailBook = (bookId) => {
  const detailContainer = document.getElementById('details');
  const detail = document.createElement('ul');
  detail.classList.add('details');
  const listTitle = document.createElement('li');
  const listAuthor = document.createElement('li');
  const listYear = document.createElement('li');
  const listDescription = document.createElement('li');

  const book = findBookById(bookId);

  if (!book) return;

  detailContainer.innerHTML = '<h2 class="header">Book details</h2>';

  listTitle.innerText = `Title: ${book.title}`;
  listAuthor.innerText = `Author: ${book.author}`;
  listYear.innerText = `Year Release: ${book.year}`;
  listDescription.innerText = `Description: ${book.description}`;

  console.log(book);

  detail.append(listTitle, listAuthor, listYear, listDescription);
  detailContainer.append(detail);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const renderBookItem = (book) => {
  const table = document.createElement('table');

  const titleRowData = document.createElement('td');
  const title = document.createElement('h3');
  title.innerText = book.title;
  titleRowData.append(title);
  table.append(titleRowData);

  const yearRowData = document.createElement('td');
  const year = document.createElement('h3');
  year.innerText = book.year;
  yearRowData.append(year);
  table.appendChild(yearRowData);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(table);
  container.setAttribute('id', `book-${book.id}`);


  if (book.isFinishedRead) {
    const btnActionRowData = document.createElement('td');

    const detailBtn = document.createElement('button');
    detailBtn.innerText = 'details';
    detailBtn.classList.add('action-btn', 'detail-button');
    detailBtn.addEventListener('click', () => { getDetailBook(book.id) });

    const undoBtn = document.createElement('button');
    undoBtn.innerText = 'undo';
    undoBtn.classList.add('action-btn', 'undo-button');

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'delete';
    deleteBtn.classList.add('action-btn', 'delete-button');

    btnActionRowData.append(detailBtn, undoBtn, deleteBtn);
    table.append(btnActionRowData);
  } else {
    const btnActionRowData = document.createElement('td');

    const detailBtn = document.createElement('button');
    detailBtn.innerText = 'details';
    detailBtn.classList.add('action-btn', 'detail-button');
    detailBtn.addEventListener('click', () => { getDetailBook(book.id) });

    const updateBtn = document.createElement('button');
    updateBtn.innerText = 'update';
    updateBtn.classList.add('action-btn', 'update-button');

    const finishBtn = document.createElement('button');
    finishBtn.innerText = 'finish';
    finishBtn.classList.add('action-btn', 'finish-button');

    btnActionRowData.append(detailBtn, updateBtn, finishBtn);
    table.append(btnActionRowData);
  }

  return container;
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

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedReadBooks = document.getElementById('books');
  unfinishedReadBooks.innerHTML = '';

  const finishedReadBooks = document.getElementById('finishedReads');
  finishedReadBooks.innerHTML = '';

  for (let book of books) {
    const bookItemElement = renderBookItem(book);

    !bookItemElement.isFinishedRead ? unfinishedReadBooks.append(bookItemElement) : finishedReadBooks.append(bookItemElement);
  }
});

document.addEventListener(SAVED_EVENT, () => console.log(localStorage.getItem(LOCAL_STORAGE_KEY)));
