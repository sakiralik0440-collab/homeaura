export const uploadProductImage = async (
    req,
    res
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });
        }

        const imageUrl =
            `/uploads/products/${req.file.filename}`;

        res.status(201).json({
            success: true,
            message:
                "Product image uploaded successfully.",
            imageUrl,
        });
    } catch (error) {
        console.error(
            "Upload product image error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to upload product image.",
        });
    }
};
