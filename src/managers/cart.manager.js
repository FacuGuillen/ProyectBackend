import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import path from 'path'
import { json } from "node:stream/consumers";
import { promises } from "node:dns";
import { prodManager } from "./product.manager.js";
import { error } from "node:console";

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
        try{
            const cart = {
                id : uuidv4(),
                products : []
            }

            const cartsFile = await this.getAllCarts()
            cartsFile.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile))
            return cart

        } catch (error) {
            throw new Error(error)
        }
    }


    async getCartById(id){
        try{
            const carts = await this.getAllCarts();
            return carts.find((cart) => cart.id === id);
        } catch (error){
            throw new Error(error.message)
        }
    }


    async saveProductToCart(idCart, idProd){
        try{
            const prodExists = await prodManager.getById(idProd)
            if (!prodExists){
                throw new Error ('Product not exists')
            }

            let cartsFile = await this.getAllCarts();

            const cartExists = await cartManager.getById(idCart)
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

        } catch (error) {
            throw new Error (error)
        }
    }



}

export const cartManager = new CartManager(path.join(process.cwd(), "src/data/cart.json"));
