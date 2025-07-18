// Book data
const books = [
  {
    cover: 'content/Issue_1/Cover.jpg',
    spreads: [
      'content/Issue_1/1.jpg', 'content/Issue_1/2.jpg', 'content/Issue_1/3.jpg',
      'content/Issue_1/4.jpg', 'content/Issue_1/5.jpg', 'content/Issue_1/6.jpg',
      'content/Issue_1/7.jpg', 'content/Issue_1/8.jpg', 'content/Issue_1/9.jpg',
      'content/Issue_1/10.jpg', 'content/Issue_1/11.jpg', 'content/Issue_1/12.jpg',
      'content/Issue_1/13.jpg', 'content/Issue_1/14.jpg'
    ]
  },
  {
    cover: 'content/Issue_2/Cover.jpg',
    spreads: [
      'content/Issue_2/2.jpg', 'content/Issue_2/3.jpg', 'content/Issue_2/4.jpg',
      'content/Issue_2/5.jpg', 'content/Issue_2/6.jpg', 'content/Issue_2/7.jpg',
      'content/Issue_2/8.jpg', 'content/Issue_2/9.jpg', 'content/Issue_2/10.jpg',
      'content/Issue_2/11.jpg', 'content/Issue_2/12.jpg', 'content/Issue_2/13.jpg',
      'content/Issue_2/14.jpg', 'content/Issue_2/15.jpg', 'content/Issue_2/16.jpg',
      'content/Issue_2/17.jpg', 'content/Issue_2/18.jpg', 'content/Issue_2/19.jpg',
      'content/Issue_2/20.jpg', 'content/Issue_2/21.jpg', 'content/Issue_2/22.jpg',
      'content/Issue_2/23.jpg', 'content/Issue_2/24.jpg',
    ]
  },
  {
    cover: 'content/Issue_3/Cover.jpg',
    spreads: [
      'content/Issue_3/1.jpg', 'content/Issue_3/2.jpg', 'content/Issue_3/3.jpg',
      'content/Issue_3/4.jpg', 'content/Issue_3/5.jpg', 'content/Issue_3/6.jpg',
      'content/Issue_3/7.jpg', 'content/Issue_3/8.jpg', 'content/Issue_3/9.jpg',
      'content/Issue_3/10.jpg', 'content/Issue_3/11.jpg', 'content/Issue_3/12.jpg',
      'content/Issue_3/13.jpg', 'content/Issue_3/14.jpg', 'content/Issue_3/15.jpg',
      'content/Issue_3/16.jpg', 'content/Issue_3/17.jpg', 'content/Issue_3/18.jpg',
      'content/Issue_3/19.jpg'
    ]
  }
];

let mobileInitialized = false;

// DOM ready handler
function docReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function () {
  // Init desktop books
  initBooks('.image-scroll');

  const tabs = document.querySelectorAll('.mobile-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.mobile-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      const contentDiv = document.getElementById(tabId);
      contentDiv.classList.add('active');
      window.scrollTo(0, 0);

      // Only init mobile books once
      if (tabId === "content" && !mobileInitialized) {
        initBooks('.mobile-image-scroll');
        mobileInitialized = true;
      }
    });
  });

  // Scroll desktop left side to bottom
  const leftSide = document.querySelector('.left-side');
  if (leftSide) {
    leftSide.scrollTop = leftSide.scrollHeight;
  }

  // Fallback: auto-init mobile if it's already visible and active
  if (window.innerWidth <= 779 && document.getElementById("content").classList.contains("active")) {
    initBooks('.mobile-image-scroll');
    mobileInitialized = true;
  }
});

function initBooks(containerSelector) {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) return;

  containers.forEach(container => {
    container.innerHTML = '';
    books.forEach((book, bookIndex) => {
      createBookElement(book, bookIndex, container);
    });
  });
}

function createBookElement(book, bookIndex, container) {
  const bookContainer = document.createElement('div');
  bookContainer.className = 'book-container';
  bookContainer.dataset.bookIndex = bookIndex;
  bookContainer.dataset.currentPage = '-1';

  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '✕';
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    resetToCover(bookContainer);
  });

  const img = document.createElement('img');
  img.className = 'book-image';
  img.src = book.cover;
  img.alt = `Issue ${bookIndex + 1}`;
  img.dataset.isAnimating = 'false';

  bookContainer.appendChild(img);
  bookContainer.appendChild(closeBtn);
  container.appendChild(bookContainer);

  bookContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('close-btn')) return;
    if (img.dataset.isAnimating === 'true') return;

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRight = clickX > rect.width / 2;

    const currentPage = parseInt(this.dataset.currentPage);
    const totalPages = book.spreads.length;

    let newPage = currentPage;

    if (currentPage === -1) {
      newPage = 0;
    } else if (isRight) {
      newPage = Math.min(currentPage + 1, totalPages - 1);
    } else {
      newPage = Math.max(currentPage - 1, -1);
    }

    const newSrc = newPage === -1 ? book.cover : book.spreads[newPage];
    this.dataset.currentPage = newPage.toString();
    img.dataset.isAnimating = 'true';
    img.src = newSrc;

    const tempImg = new Image();
    tempImg.onload = () => {
      img.dataset.isAnimating = 'false';
    };
    tempImg.src = newSrc;
  });
}

function resetToCover(container) {
  const bookIndex = container.dataset.bookIndex;
  const img = container.querySelector('img');
  img.src = books[bookIndex].cover;
  container.dataset.currentPage = '-1';
}

// Accent color randomizer
(function setAccentColor() {
  const vibrantColors = ['#dff054', '#9acbff', '#ffd75c'];
  const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
  document.documentElement.style.setProperty('--accent-color', color);
})();
