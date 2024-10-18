document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTableBody');

    // Load products on page load
    loadProducts();

    // Handle form submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value)
        };
        const productId = document.getElementById('productId').value;

        if (productId) {
            updateProduct(productId, product);
        } else {
            createProduct(product);
        }
    });

    // Load all products
    function loadProducts() {
        fetch('/products')
            .then(response => response.json())
            .then(products => {
                productTableBody.innerHTML = '';
                products.forEach(product => {
                    const row = createProductRow(product);
                    productTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading products:', error));
    }

    // Create a new product
    function createProduct(product) {
        fetch('/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(() => {
                loadProducts();
                productForm.reset();
            })
            .catch(error => console.error('Error creating product:', error));
    }

    // Update an existing product
    function updateProduct(id, product) {
        fetch(`/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(() => {
                loadProducts();
                productForm.reset();
                document.getElementById('productId').value = '';
            })
            .catch(error => console.error('Error updating product:', error));
    }

    // Delete a product
    function deleteProduct(id) {
        fetch(`/products/${id}`, { method: 'DELETE' })
            .then(() => loadProducts())
            .catch(error => console.error('Error deleting product:', error));
    }

    // Create a table row for a product
    function createProductRow(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-success edit-btn">
                    <i class="fa fa-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn">
                    <i class="fa fa-times"></i>
                </button>
            </td>
        `;

        // Add event listeners for edit and delete buttons
        row.querySelector('.edit-btn').addEventListener('click', () => {
            document.getElementById('productId').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Está seguro de eliminar este producto?')) {
                deleteProduct(product.id);
            }
        });

        return row;
    }
});