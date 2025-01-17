import express from 'express'
import morgan from 'morgan'
import { uploader } from './utils/multer.js';
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import cartRouter from './routers/cart.router.js'
import productsRouter from "./routers/product.router.js"
import realTimeProducts from "./routers/realTimeProducts.router.js"
import viewsRouter from "./routers/views.router.js"
import { Server } from 'socket.io';
import { prodManager } from './managers/product.manager.js';


const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true})) 
app.use(morgan('dev')) 

app.engine('hbs', handlebars.engine({
    extname:'hbs',
    defaultLayout: false
}))

app.set('view engine', 'hbs')
app.set('views', './src/views/layouts')

app.use(express.static(__dirname + '/public'))

app.post('/subirarchivo', uploader.single('myFile'), (req, res) => {
    res.send('Archivo subido')
})

app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/realTimeProducts', realTimeProducts)

const httpServer = app.listen(port, () => {
    console.log(`Servidos corriendo en el puerto: ${port}`);
    
})


export const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket)=>{
    console.log(`Nuevo dispositivo conectado ID: ${socket.id}`);
    const productsList = await prodManager.getAllProducts()
    //socket.emit('home', productsList)
    socket.emit('realTime', productsList)

    // socket.on('new-product', async (producto) => {
    //     await prodManager.createProduct(producto)
    //     //const updatedProducts = await prodManager.getAllProducts();
    //     socketServer.emit('realTime', productsList)
    // })

    socket.on('new-product', async (producto) => {
        await prodManager.createProduct(producto); // Agrega el nuevo producto
        const updatedProducts = await prodManager.getAllProducts(); // Obtén la lista actualizada
        socketServer.emit('realTime', updatedProducts); // Envía la lista actualizada a todos los clientes
    });
    

    socket.on('delete-product', async (id) => {
        await prodManager.deleteProduct(id)
        const updatedProducts = await prodManager.getAllProducts();
        socketServer.emit('realTime', updatedProducts)
    })
})

