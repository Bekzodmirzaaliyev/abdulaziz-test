const Product = require('../models/Product')
const StockMovement = require('../models/StockMovement')

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body
        const product = await Product.create({
            name, 
            category,  
            price, 
            quantity,
            description
        })

        await StockMovement.create({
            product: product._id,
            quantity, 
            type: "IN"
        })

        res.status(201).json({ message: "Product created successfully", product})
    }  catch (error) {
        res.status(500).json({ message: "Product create error", error})
    }
}

exports.addStock = async (req, res) => {
    try {

        const { productId } = req.params
        const { quantity } = req.body
    
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json(message, "Product is not found")
    
        product.quantity += quantity
        await product.save()
    
        await StockMovement.create({
            product: productId, 
            quantity,
            type: "IN"
        });
    
        res.status(200).json({message: "stock addded", product})
    }   catch (error) {
        res.status(500).json({message: "Error adding stock", error})
    }
}   