document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.querySelector('.books-list');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    let allBooks = [];

    // Fetching data from the API
    fetch('http://localhost:3000/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            allBooks = data; 
            displayBooks(allBooks); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function displayBooks(books) {
        booksList.innerHTML = ''; // Clear existing books
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
            

             // Add event listener for hover effects
             bookItem.addEventListener('mouseover', () => {
                bookItem.style.backgroundColor = '#ffffff'; // Highlight on hover
                bookItem.p.style.color = 'white';
            });

            bookItem.addEventListener('mouseout', () => {
                bookItem.style.backgroundColor = ''; // Remove highlight
            });

            
            // Add event listener for the "Show More" button
            const button = bookItem.querySelector('.show-more');
            button.addEventListener('click', () => {
                const detailsElement = bookItem.querySelector('.book-details');
                if (detailsElement.style.display === 'none') {
                    detailsElement.style.display = 'block'; // Show details
                    button.innerText = 'Show Less';
                } else {
                    detailsElement.style.display = 'none'; // Hide details
                    button.innerText = 'Show More';
                }
            });

            // Like Button Functionality
            const likeButton = bookItem.querySelector('.like-button');
            likeButton.addEventListener('click', () => {
                book.likes += 1; // Increase the like count
                bookItem.querySelector('.like-count').innerText = `${book.likes} Likes`; // Update the display
                
                // Save the likes in local storage
                localStorage.setItem(`likes_${book.id}`, book.likes);
            });
        });
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.authors.some(author => author.toLowerCase().includes(searchTerm))
        );
        displayBooks(filteredBooks);
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredBooks = allBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.authors.some(author => author.toLowerCase().includes(searchTerm))
            );
            displayBooks(filteredBooks);
        }
    });

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
