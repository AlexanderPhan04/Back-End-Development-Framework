import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    const {
        category,
        minPrice,
        maxPrice,
        search,
        page = 1,
        limit = 10
    } = req.query;

    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
        .populate("category", "name description")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
        success: true,
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        products
    });
};

export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("category", "name description");

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        product
    });
};

export const createProduct = async (req, res) => {

    const imageUrls = req.files
        ? req.files.map(file => file.path)
        : [];

    const product = await Product.create({
        ...req.body,
        images: imageUrls
    });

    res.status(201).json({
        success: true,
        product
    });
};

export const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    ).populate("category", "name description");

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        product
    });
};

export const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product deleted successfully"
    });
};