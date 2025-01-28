import path from 'path'
import { ProductsModels } from '../models/products.model.js'

class ProductManager {
    constructor(path) {
    this.path = path;
}



    async getAllProducts({ limit = 10, page = 1, sort }) {
        try {
            // Crear un objeto de opciones de consulta
            const options = { limit, page };
    
            // Si se recibe sort, agregar el ordenamiento
            if (sort === 'asc') {
                options.sort = { price: 1 }; // Orden ascendente por precio
            } else if (sort === 'desc') {
                options.sort = { price: -1 }; // Orden descendente por precio
            }
    
            const result = await ProductsModels.paginate({}, options);
    
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    


    async getProductById(id){
        try{
            const product = await ProductsModels.findById(id)
            if(!product){
                throw new Error('Product not found')
            }
            return product
        } catch (e) {
            throw new Error(error.message)
        }
    }


    async updateProduct(obj, id) {
        try {
            const updatedProduct = await ProductsModels.findByIdAndUpdate(
                id,
                obj,
                { new: true } // `new: true` devuelve el producto actualizado
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async createProduct(obj) {
        try {
            const product = new ProductsModels(obj); // Crea una instancia del modelo
            await product.save(); // Guarda el producto en la base de datos
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async deleteProduct(code) {
        try {
            const deletedProduct = await ProductsModels.findOneAndDelete({ code });
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            return deletedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

export const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));