import express from 'express'
import {prodManager} from '../managers/product.manager.js';

const router = express.Router()




// router.get('/', async (req, res) => {
//     try {
//         // Obtener los parámetros de la query: 'limit' y 'page'
//         const { limit = 10, page = 1 } = req.query;

//         // Convierte limit y page a números, ya que vienen como cadenas de texto
//         const limitNumber = parseInt(limit, 10);
//         const pageNumber = parseInt(page, 10);

//         console.log(`Valores que da en ${limitNumber} ${pageNumber}`);
        
        

//         // Llamar al método 'getAllProducts' pasando los parámetros de paginación
//         const result = await prodManager.getAllProducts({ limit: limitNumber, page: pageNumber });

//         // Verificar si no hay productos
//         if (result.docs.length === 0) {
//             return res.status(404).json({ message: "No se encontró ningún producto" });
//         }

//         // Preparar la respuesta
//         const response = {
//             docs: result.docs, // Los productos obtenidos
//             totalDocs: result.totalDocs, // Total de documentos
//             limit: result.limit, // Límite de productos por página
//             page: result.page, // Página actual
//             totalPages: result.totalPages, // Total de páginas
//             hasNextPage: result.hasNextPage, // Si hay siguiente página
//             hasPrevPage: result.hasPrevPage, // Si hay página anterior
//             prev: `$page=${result.prevPage}`,
//             next: `$page=${result.nextPage}`
//         };

//         // Devolver la respuesta con los productos paginados
//         res.status(200).json(response);
//     } catch (error) {
//         // Si hay un error, lo manejamos
//         res.status(500).json({ message: error.message });
//     }
// })



router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort } = req.query;

        // Convertimos limit y page a números
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);

        // Validar el valor de sort (debe ser 'asc' o 'desc')
        const validSort = sort === 'asc' || sort === 'desc' ? sort : undefined;

        // Llamar al método getAllProducts con los parámetros
        const result = await prodManager.getAllProducts({
            limit: limitNumber,
            page: pageNumber,
            sort: validSort,
        });

        if (result.docs.length === 0) {
            return res.status(404).json({ message: 'No se encontró ningún producto' });
        }

        // Preparar la respuesta
        const response = {
            docs: result.docs,
            totalDocs: result.totalDocs,
            limit: result.limit,
            page: result.page,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            prev: result.hasPrevPage ? `$page=${result.prevPage}` : null,
            next: result.hasNextPage ? `$page=${result.nextPage}` : null,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const product = await prodManager.getProductById(id)
        res.status(200).json(product)
    } catch (error){
        res.status(500).json({message: error.message})
    }
})


router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category } = req.body;

        const productStatus = status !== undefined ? status : true;

        if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
            return res.status(400).json({ message: 'Los campos title, description, code y category son obligatorios y deben ser de tipo texto (string)' });
        }

        if (typeof price !== 'number' || isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'El campo price debe ser un número mayor que 0' });
        }

        if (status !== undefined && typeof productStatus !== 'boolean') {
            return res.status(400).json({ message: 'El campo status debe ser de tipo booleano (true o false)' });
        }

        if (typeof stock !== 'number' || stock < 1) {
            return res.status(400).json({ message: 'El stock debe ser un número mayor a cero' });
        }



        // Si todo está correcto, se agrega el producto
        const addProduct = await prodManager.createProduct({
            title,
            description,
            code,
            price,
            status: productStatus, // Asignamos el status (por defecto 'true' si no se pasa)
            stock,
            category
        });

        res.status(201).json(addProduct);
    } catch (error) {


        res.status(500).json({ message: error.message });
    }
});


    router.delete('/:id', async (req, res) => {
        try{
            const {code} = req.params
            const product = await prodManager.deleteProduct(code)
            res.status(200).json({message: `El producto ${product.title} fue eliminado con exito`})
        } catch (error){
            res.status(500).json({message: error.message})
        }
    })


    router.put('/:id', async (req, res) => {
        try{
            const {id} = req.params
            const prodUpdate = await prodManager.updateProduct(req.body, id)
            res.status(200).json(prodUpdate)
        } catch (error){
            res.status(500).json({message: error.message})
        }
    })


export default router;