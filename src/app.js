import express from 'express'
import morgan from 'morgan'
import { uploader } from './utils/multer.js';
import handlebars from 'express-handlebars'

import cartRouter from './routers/cart.router.js'
import productsRouter from "./routers/product.router.js"
import viewsRouter from "./routers/views.router.js"


const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true})) 
app.use(morgan('dev')) 

app.engine('hbs', handlebars.engine({
    extname:'hbs'
}))

app.set('view engine', 'hbs')
app.set('views', './src/views')

app.use(express.static('public'));

app.post('/subirarchivo', uploader.single('myFile'), (req, res) => {
    res.send('Archivo subido')
})

app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.listen(port, () => {
    console.log(`Servidos corriendo en el puerto: ${port}`);
    
})
