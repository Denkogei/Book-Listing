// script.js
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

            const rating = Math.floor(book.rating) || 0;
            const stars = generateStars(rating); 
            // Add content to the book item
            bookItem.innerHTML = `
                <h2 class="book-title">${book.title}</h2>
                <p class="book-authors">${book.authors.join(', ')}</p>
                <p class="book-description">${book.description}</p>
                <p class="book-rating">${stars}</p>
                <img src="${book.image || 'default.jpg'}" alt="Book Cover" class="book-cover" />
            `;

            // Append the book item to the books list
            booksList.appendChild(bookItem);
        });
    }
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '★'; 
            } else {
                stars += '☆'; 
            }
        }
        return stars;
    }
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase(); // Get the search term
        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.authors.some(author => author.toLowerCase().includes(searchTerm))
        );
        displayBooks(filteredBooks); // Display the filtered books
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase(); // Get the search term
            const filteredBooks = allBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.authors.some(author => author.toLowerCase().includes(searchTerm))
            );
            displayBooks(filteredBooks); // Display the filtered books
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

        // Save the current theme preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-lightbulb', isDark);
    }
});
