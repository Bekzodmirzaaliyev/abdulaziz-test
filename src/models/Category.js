const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive'] , default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
})

const Category = mongoose.model('CategoryAbdulaziz', CategorySchema)