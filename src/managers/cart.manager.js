import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import path from 'path'
import { prodManager } from "./product.manager.js";

class CartManager {
    constructor(path) {
    this.path = path;
}


    async getAllCarts(){
        try{
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf-8')
                const cartsJSON = JSON.parse(carts)
                return cartsJSON
            }   else {
                return []
            }
        } catch (error) {
            throw new Error (error)
        }
    }


    async createCart(){
            const cart = {
                id : uuidv4(),
                products : []
            }

            const cartsFile = await this.getAllCarts()
            cartsFile.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile))
            return cart
    }


    async getCartById(id){
            const carts = await this.getAllCarts();
            return carts.find((cart) => cart.id === id);
    }


    async saveProductToCart(idCart, idProd){
            const prodExists = await prodManager.getCartById(idProd)
            if (!prodExists){
                throw new Error ('Product not exists')
            }

            let cartsFile = await this.getAllCarts();
            const cartExists = await this.getCartById(idCart)
            if (!cartExists){
                throw new Error ('Cart not exists')
            }

            const existsProductInCart = cartExists.products.find((prod) => prod.id === idProd)
            if (!existsProductInCart){
                const product = {
                    id: idProd,
                    quantity : 1
                } 
                cartExists.products.push(product)
            } else {
                existsProductInCart.quantity +=1 
            }

            const updatedCarts = cartsFile.map((cart) => {
                if (cart.id === idCart) {
                    return cartExists
                }
                return cart
            })

            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts))
            return cartExists
    }



}

export const cartManager = new CartManager(path.join(process.cwd(), "src/data/cart.json"));
