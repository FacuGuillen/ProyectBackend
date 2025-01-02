import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import path from 'path'
import { json } from "node:stream/consumers";
import { promises } from "node:dns";

class ProductManager {
    constructor(path) {
    this.path = path;
}

    async getAll(){
        try{
            if(fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, "utf-8")
                return JSON.parse(products)
            } else return []
        } catch (error){
            throw new Error(error.message)
        }
    }


    async getById(id){
        try{
            const allProducts = await this.getAll()
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
            const products = await this.getAll()
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return product
        } catch (error){
            throw new Error(error.message)
        }
    }


    async delete(id){
        try{
            const prod = await this.getById(id)
            const products = await this.getAll()
            const newArray = products.filter((prod) => prod.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            return prod
        } catch (error){
            throw new Error(error)
        }
    }

}

export const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));