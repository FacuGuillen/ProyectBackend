import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import path from 'path'

class ProductManager {
    constructor(path) {
    this.path = path;
}

    async getAllProducts(){
        try{
            if(fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, "utf-8")
                return JSON.parse(products)
            } else return []
        } catch (error){
            throw new Error(error.message)
        }
    }


    async updateProduct(obj, id){
        const products = await this.getAllProducts()
        const product = await this.getProductById(id)

        prod = {...prod, ...obj}

        const newArray = products.filter((prod) => {prod.id !== id})
        newArray.push(prod)
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
        return prod;
        
    }


    async getProductById(id){
        try{
            const allProducts = await this.getAllProducts()
            const product = allProducts.find((product) => product.id === id)
            if(!product) {
                throw new Error('Product not found')
            }
            return product
        } catch (error){
            throw new Error(error.message)
        }
    }


    async createProduct(obj){
        try {
            const product = {
                id: uuidv4(),
                ...obj
            }
            const products = await this.getAllProducts()
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return product
        } catch (error){
            throw new Error(error.message)
        }
    }


    async deleteProduct(id){
        try{
            const prod = await this.getProductById(id)
            const products = await this.getAllProducts()
            const newArray = products.filter((prod) => prod.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            return prod
        } catch (error){
            throw new Error(error)
        }
    }

}

export const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));