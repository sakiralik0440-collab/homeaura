import Order from "../models/Order.js";

export const getCustomers = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        const customerMap = new Map();

        orders.forEach((order) => {
            const customer = order.customer;

            if (!customer) return;

            let name = "Guest Customer";
            let email = "";
            let phone = "";

            if (typeof customer === "string") {
                name = customer;
            } else {
                name =
                    customer.name ||
                    customer.fullName ||
                    "Guest Customer";

                email = customer.email || "";
                phone =
                    customer.phone ||
                    customer.mobile ||
                    customer.phoneNumber ||
                    "";
            }

            const key =
                email.toLowerCase().trim() ||
                `${name.toLowerCase().trim()}-${phone}`;

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    id: key,
                    name,
                    email,
                    phone,
                    ordersCount: 0,
                    totalSpent: 0,
                    lastOrder: order.createdAt,
                    orders: [],
                });
            }

            const existingCustomer =
                customerMap.get(key);

            existingCustomer.ordersCount += 1;

            existingCustomer.totalSpent += Number(
                order.total || 0
            );

            existingCustomer.orders.push({
                orderId: order.orderId,
                total: order.total || 0,
                status:
                    order.orderStatus || "placed",
                paymentMethod:
                    order.paymentMethod || "cod",
                createdAt: order.createdAt,
                items: order.items || [],
            });

            if (
                new Date(order.createdAt) >
                new Date(existingCustomer.lastOrder)
            ) {
                existingCustomer.lastOrder =
                    order.createdAt;
            }
        });

        const customers = Array.from(
            customerMap.values()
        ).sort(
            (a, b) =>
                new Date(b.lastOrder) -
                new Date(a.lastOrder)
        );

        res.json({
            success: true,
            customers,
        });
    } catch (error) {
        console.error(
            "Get customers error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        const matchingOrders = [];

        orders.forEach((order) => {
            const customer = order.customer;

            if (!customer) return;

            let name = "Guest Customer";
            let email = "";
            let phone = "";

            if (typeof customer === "string") {
                name = customer;
            } else {
                name =
                    customer.name ||
                    customer.fullName ||
                    "Guest Customer";

                email = customer.email || "";
                phone =
                    customer.phone ||
                    customer.mobile ||
                    customer.phoneNumber ||
                    "";
            }

            const key =
                email.toLowerCase().trim() ||
                `${name.toLowerCase().trim()}-${phone}`;

            if (key === req.params.id) {
                matchingOrders.push({
                    orderId: order.orderId,
                    total: order.total || 0,
                    status:
                        order.orderStatus || "placed",
                    paymentMethod:
                        order.paymentMethod || "cod",
                    createdAt: order.createdAt,
                    items: order.items || [],
                });
            }
        });

        if (!matchingOrders.length) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        const firstOrder = matchingOrders[0];

        const customer = {
            id: req.params.id,
            name:
                firstOrder.customerName ||
                "Customer",
            email: "",
            phone: "",
            ordersCount: matchingOrders.length,
            totalSpent: matchingOrders.reduce(
                (total, order) =>
                    total + Number(order.total || 0),
                0
            ),
            orders: matchingOrders,
        };

        res.json({
            success: true,
            customer,
        });
    } catch (error) {
        console.error(
            "Get customer error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
        });
    }
};