// script.js
document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.querySelector('.books-list');

    // Fetching data from the API
    fetch('http://localhost:3000/books')
        .then(response => {
            if (!response.ok) {
            console.log(response)
            }
            return response.json(); // Convert the response to JSON
        })
        .then(data => {
            // Assuming data is an array of books
            data.forEach(book => {
                // Create elements for each book
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');

                // Add content to the book item
                bookItem.innerHTML = `
                    <h2 class="book-title">${book.title}</h2>
                    <p class="book-authors">${book.authors}</p>
                    <p class="book-description">${book.description}</p>
                    <p class="book-rating">${book.ratings}</p>
                     <img src="${book.image || 'default.jpg'}" alt="Book Cover" class="book-cover" />
                `;

                // Append the book item to the books list
                booksList.appendChild(bookItem);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
