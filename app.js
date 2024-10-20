document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.querySelector('.books-list');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    let allBooks = [];

    // Fetching data from the JSON file
    fetch('https://denkogei.github.io/Book-Listing/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data); // Log the data for debugging
            allBooks = Array.isArray(data) ? data : data.books; 
            displayBooks(allBooks);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function displayBooks(books) {
        booksList.innerHTML = ''; // Clear existing books
        if (!Array.isArray(books)) {
            console.error('Expected books to be an array, but got:', books);
            return;
        }

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            // Load likes from local storage or use the default value
            const storedLikes = localStorage.getItem(`likes_${book.id}`);
            book.likes = storedLikes ? parseInt(storedLikes) : (book.likes || 0);

            // Add content to the book item
            bookItem.innerHTML = `
                <img src="${book.image || 'default.jpg'}" alt="Book Cover" class="book-cover" />
                <h2 class="book-title">${book.title}</h2>
                <button class="show-more">Show More</button>
                <div class="book-details" style="display: none;">
                    <p class="book-authors">Authors: ${book.authors.join(', ')}</p>
                    <p class="book-description">About Book: ${book.description}</p>
                </div>
                <button class="like-button">
                    <i class="fa-solid fa-heart"></i> Like
                </button>
                <span class="like-count">${book.likes} Likes</span>
            `;

            // Append the book item to the books list
            booksList.appendChild(bookItem);

            // Event listeners for show more and like button
            const button = bookItem.querySelector('.show-more');
            button.addEventListener('click', () => {
                const detailsElement = bookItem.querySelector('.book-details');
                detailsElement.style.display = detailsElement.style.display === 'none' ? 'block' : 'none';
                button.innerText = detailsElement.style.display === 'block' ? 'Show Less' : 'Show More';
            });

            const likeButton = bookItem.querySelector('.like-button');
            likeButton.addEventListener('click', () => {
                book.likes += 1;
                bookItem.querySelector('.like-count').innerText = `${book.likes} Likes`;
                localStorage.setItem(`likes_${book.id}`, book.likes);
            });
        });
    }
    
    // Search functionality
    // Select the not found message element
const notFoundMessage = document.querySelector('.not-found-message');

// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.authors.some(author => author.toLowerCase().includes(searchTerm))
    );

    if (filteredBooks.length > 0) {
        notFoundMessage.style.display = 'none'; // Hide the not found message
        displayBooks(filteredBooks); // Display the filtered books
    } else {
        notFoundMessage.style.display = 'block'; // Show the not found message
        booksList.innerHTML = ''; // Clear the book list
    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.authors.some(author => author.toLowerCase().includes(searchTerm))
        );

        if (filteredBooks.length > 0) {
            notFoundMessage.style.display = 'none'; // Hide the not found message
            displayBooks(filteredBooks); // Display the filtered books
        } else {
            notFoundMessage.style.display = 'block'; // Show the not found message
            booksList.innerHTML = ''; // Clear the book list
        }
    }
});


    // Theme toggle functionality
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        updateIcon(savedTheme === 'dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        updateIcon(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-lightbulb', isDark);
    }
});
