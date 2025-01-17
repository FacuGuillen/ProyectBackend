const socket = io();

const contenedorProductosRTP = document.querySelector('tbody'); // Ajustado para apuntar al cuerpo de la tabla

socket.on('realTime', (data) => {
    contenedorProductosRTP.innerHTML = ''; // Limpiar el contenido previo
    data.forEach(product => {
        // Crear una fila por cada producto
        const row = `
            <tr>
                <th scope="row">${product.code}</th>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
            </tr>
        `;
        contenedorProductosRTP.innerHTML += row;
    });
});


const addProduct = () => {
    const title = document.querySelector('#add-title').value
    const description = document.querySelector('#add-description').value
    const code = document.querySelector('#add-code').value
    const price = document.querySelector('#add-price').value
    const category = document.querySelector('#add-category').value
    const state = document.querySelector('#add-state').value
    const stock = document.querySelector('#add-stock').value

    const infoProd = {title, description, code, price, category, state, stock }
    socket.emit("new-product", infoProd)

}

document.querySelector('#btn-add-product').addEventListener('click', ()=>{
    addProduct()
})

document.querySelector('#btn-delete-product').addEventListener('click', () => {
    const id = document.querySelector('#delete-id').value
    deleteProduct(id)
})

const deleteProduct = (id) => {
    socket.emit('delete-product', id)
}