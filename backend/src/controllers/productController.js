import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            room,
            price,
            oldPrice,
            rating,
            reviews,
            badge,
            material,
            color,
            dimensions,
            image,
            description,
            stock,
            isActive,
        } = req.body;

        if (
            !name ||
            !category ||
            !room ||
            price === undefined ||
            !image
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, category, room, price and image are required",
            });
        }

        const product = await Product.create({
            name,
            category,
            room,
            price,
            oldPrice,
            rating,
            reviews,
            badge,
            material,
            color,
            dimensions,
            image,
            description,
            stock,
            isActive,
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
};
