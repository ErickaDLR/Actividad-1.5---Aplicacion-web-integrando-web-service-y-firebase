// Inicializa Firebase
const firebaseConfig = {
    apiKey: "AIzaSyARTGeR8UytAV2-yLu52wBo4YnOUodU6Lc",
    authDomain: "inventario-cdbfc.firebaseapp.com",
    databaseURL: "https://inventario-cdbfc-default-rtdb.firebaseio.com",
    projectId: "inventario-cdbfc",
    storageBucket: "inventario-cdbfc.firebasestorage.app",
    messagingSenderId: "1085005899859",
    appId: "1:1085005899859:web:f376b802651381a655bea6",
    measurementId: "G-QMVQVVRQ9P"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Función para manejar el login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('Usuario autenticado:', userCredential.user);
            // Oculta el formulario de login y muestra el inventario
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('inventory-section').style.display = 'block';
        })
        .catch(error => {
            console.error('Error de autenticación:', error);
        });
});

// Función para manejar el alta de productos (agregar producto)
const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const quantity = document.getElementById('product-quantity').value;
    const price = document.getElementById('product-price').value;

    db.collection('productos').add({
        name: name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        created_at: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log('Producto agregado');
        alert('Producto agregado');
        // Limpiar formulario después de agregar el producto
        addProductForm.reset();
    })
    .catch((error) => {
        console.error('Error al agregar producto', error);
    });
});

// Función para eliminar un producto
const deleteProductButton = document.getElementById('delete-product');
deleteProductButton.addEventListener('click', () => {
    const productId = prompt("Ingresa el ID del producto a eliminar:");
    if (productId) {
        db.collection('productos').doc(productId).delete()
            .then(() => {
                console.log('Producto eliminado');
                alert('Producto eliminado');
            })
            .catch((error) => {
                console.error('Error al eliminar producto', error);
            });
    }
});

// Función para actualizar un producto
const updateProductButton = document.getElementById('update-product');
updateProductButton.addEventListener('click', () => {
    const productId = prompt("Ingresa el ID del producto a actualizar:");
    if (productId) {
        const newName = prompt("Nuevo nombre del producto:");
        const newQuantity = prompt("Nueva cantidad:");
        const newPrice = prompt("Nuevo precio:");

        db.collection('productos').doc(productId).update({
            name: newName,
            quantity: parseInt(newQuantity),
            price: parseFloat(newPrice)
        })
        .then(() => {
            console.log('Producto actualizado');
            alert('Producto actualizado');
        })
        .catch((error) => {
            console.error('Error al actualizar producto', error);
        });
    }
});

// Función para consultar todos los productos
const viewProductsButton = document.getElementById('view-products');
const productList = document.getElementById('product-list');
viewProductsButton.addEventListener('click', () => {
    db.collection('productos').get()
        .then((querySnapshot) => {
            productList.innerHTML = ''; // Limpiar lista de productos antes de mostrar nuevos
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productList.innerHTML += `
                    <div>
                        <p><strong>Producto:</strong> ${product.name}</p>
                        <p><strong>Cantidad:</strong> ${product.quantity}</p>
                        <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                        <p><strong>Fecha de creación:</strong> ${product.created_at ? product.created_at.toDate().toLocaleString() : 'Desconocida'}</p>
                        <hr />
                    </div>
                `;
            });
        })
        .catch((error) => {
            console.error('Error al obtener productos', error);
        });
});
