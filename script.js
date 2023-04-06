const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmark-container');

let bookmarks = []

// show modal, focus on input
function showModal() {
  modal.classList.add('show-modal');
  websiteName.focus();
}

// build bookmark using DOM
function buildBookmark() {
  // remove all bookmark element
  bookmarkContainer.textContent = '';

  // build item
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    // item
    const item = document.createElement('div');
    item.classList.add('item');

    // close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete');
    closeIcon.setAttribute('onclick', `deletebookmark('${url}')`);

    // link container & favicon
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
    favicon.setAttribute('alt', 'favicon')

    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    // append to bookmarkContainer
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item)
  });
}

// delete bookmark
function deletebookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });

  // update bookmark in local storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmark()
}

// fetch bookmark from local storage
function fetchBookmark() {
  // get bookmark if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // create a bookmarks array in local storage
    bookmarks = [
      {
        name: 'Github',
        url: ' ',
      }
    ]
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  buildBookmark();
}

// handle form data
function storeBookmark(e) {
  e.preventDefault();

  const nameVal = websiteName.value;
  let urlVal = websiteUrl.value;

  if (!urlVal.includes('http://', 'https://')) {
    urlVal = `https://${urlVal}`
  }
  if (!validate(nameVal, urlVal)) {
    return false;
  };

  const bookmark = {
    name: nameVal,
    url: urlVal
  };
  bookmarks.push(bookmark)
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmark();

  bookmarkForm.reset();
  websiteName.focus();
}

// validate form
function validate(nameVal, urlVal) {
  const express = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g;

  const regex = new RegExp(express);
  if (!nameVal || !urlVal) {
    alert('Please fill both field value');
    return false;
  }
  if (!urlVal.match(regex)) {
    alert('Please provide a valid address');
    return false;
  }
  return true;
}

// event listener
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));
bookmarkForm.addEventListener('submit', storeBookmark);

// on load
fetchBookmark();