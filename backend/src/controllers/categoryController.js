
import Category from "../models/Category.js";

/* GET ALL CATEGORIES */
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Get categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

/* GET CATEGORY BY ID */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            category,
        });
    } catch (error) {
        console.error("Get category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
};

/* CREATE CATEGORY */
export const createCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            isActive,
        } = req.body;

        if (!name || !image) {
            return res.status(400).json({
                success: false,
                message: "Category name and image are required",
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name,
            description,
            image,
            isActive,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
};

/* UPDATE CATEGORY */
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
};

/* DELETE CATEGORY */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Delete category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};
