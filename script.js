// This list shall store data (which was retrieved from the database)
let products = [];

// Toggles the add-form
function toggleForm() {
    const form = document.getElementById('productForm');
    form.classList.toggle('hidden');
}

// Hides the product-table
function clearScreen() {
    const productListContainer = document.getElementById('productList');
    productListContainer.classList.add('hidden');
}

// Adds a new product
function addProduct() {

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;

    const check = name && !isNaN(price);

    if (!check)
    {
        alert('Required fields: Product Name & Price. Price must be a number.');
    }
    else
    {
        // Send data to the backend
        fetch('http://localhost:5000/insert_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({ name: name, price: price,
                                  description: description,}),
        })

        .then(response => response.json())

        .then(data => {
            console.log(data); // Display on the console
            alert('Product Added'); // Informs the user
        })

        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add product'); // Display an error message to the user
        })

        .finally(() => {

            // Clear the form fields
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productDescription').value = '';

            // Hides the display
            toggleForm();

            // Hides the table (in case it was made visible)
            clearScreen();
        });
    }
}

// Function to display the list of products
function displayProductList() {
    const productListContainer = document.getElementById('productList');

    // Toggle the display
    productListContainer.classList.toggle('hidden');

    // Clears the existing table
    productListContainer.innerHTML = '';

    // Fetch data from the backend
    fetch('http://localhost:5000/get_data')

    .then(response => response.json())

    .then(data => {

        console.log("Clicked display", data);
        products = data; // Set the products variable with the fetched data

        if (products.length === 0)
        {
            alert('No products available');
        }
        else
        {
            const table = document.createElement('table');
            table.border = '1';

            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Name', 'Price', 'Description'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create table rows
            const tbody = document.createElement('tbody');

            products.forEach(product => {
                const tr = document.createElement('tr');
                const tdName = document.createElement('td');
                const tdPrice = document.createElement('td');
                const tdDescription = document.createElement('td');

                tdName.textContent = product.name;
                tdPrice.textContent = `$${product.price}`;
                tdDescription.textContent = product.description;

                tr.appendChild(tdName);
                tr.appendChild(tdPrice);
                tr.appendChild(tdDescription);
                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            productListContainer.appendChild(table);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve products'); // Informs the user
    });
}
