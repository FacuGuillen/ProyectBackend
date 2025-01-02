import express from 'express'
import { Router } from "express";
import {prodManager} from '../managers/product.manager.js';
import { json } from 'node:stream/consumers';
import { stat } from 'node:fs';

const router = express.Router()



router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await prodManager.getAll(); // Obtienes todos los productos

        // Verifica si no hay productos
        if (products.length === 0) {
            return res.status(404).json({ message: "No se encontró ningún producto" });
        }

        // Si existe 'limit', devolvemos solo esa cantidad de productos
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit)); // Limitamos el array
            return res.status(200).json(limitedProducts);
        }

        // Si no hay 'limit', devolvemos todos los productos
        res.status(200).json(products);
    } catch (error) {
        // Si hay otro tipo de error, lo manejamos
        res.status(500).json({ message: error.message });
    }
});



router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const product = await prodManager.getById(id)
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
            const {id} = req.params
            const product = await prodManager.delete(id)
            res.status(200).json({message: `El producto ${product.title} fue eliminado con exito`})
        } catch (error){
            res.status(500).json({message: error.message})
        }
    })


    router.put('/:id', async (req, res) => {
        try{
            const {id} = req.params
        } catch (error){
            res.status(500).json({message: error.message})
        }
    })


export default router;