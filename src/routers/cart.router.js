import express from 'express'
import {cartManager} from '../managers/cart.manager.js';



const router = express.Router()


router.post('/', async (req, res) => {
    try{
        res.json(await cartManager.createCart())
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


router.get('/:cid', async (req, res) => {
    try{
        const {cid} = req.params
        const carrito = await cartManager.getCartById(cid)
        res.status(200).json(carrito)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


router.post('/:idCart/product/:idProd', async (req, res) => {
    try{
        const {idProd} = req.params
        const {idCart} = req.params
        const response = await cartManager.saveProductToCart(idCart, idProd)
        res.json(response)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


export default router;