import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
    const categories = await Category.find();

    res.json({
        success: true,
        categories
    });
};

export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    const category = await Category.create({
        name,
        description
    });

    res.status(201).json({
        success: true,
        category
    });
};

export const updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        category
    });
};

export const deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        message: "Category deleted successfully"
    });
};