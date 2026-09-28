import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

export function AuthProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // ============================================
    // CHECK EXISTING LOGIN
    // ============================================

    useEffect(() => {
        const token =
            localStorage.getItem(
                "homeAuraToken"
            );

        const savedCustomer =
            localStorage.getItem(
                "homeAuraCustomer"
            );

        if (!token) {
            setLoading(false);
            return;
        }

        if (savedCustomer) {
            try {
                setCustomer(
                    JSON.parse(savedCustomer)
                );
            } catch {
                localStorage.removeItem(
                    "homeAuraCustomer"
                );
            }
        }

        setLoading(false);
    }, []);

    // ============================================
    // REGISTER
    // ============================================

    const register = async (userData) => {
        const response = await axios.post(
            `${API_URL}/api/auth/register`,
            userData
        );

        const {
            token,
            customer: newCustomer,
        } = response.data;

        localStorage.setItem(
            "homeAuraToken",
            token
        );

        localStorage.setItem(
            "homeAuraCustomer",
            JSON.stringify(newCustomer)
        );

        setCustomer(newCustomer);

        return response.data;
    };

    // ============================================
    // LOGIN
    // ============================================

    const login = async (
        email,
        password
    ) => {
        const response = await axios.post(
            `${API_URL}/api/auth/login`,
            {
                email,
                password,
            }
        );

        const {
            token,
            customer: loggedInCustomer,
        } = response.data;

        localStorage.setItem(
            "homeAuraToken",
            token
        );

        localStorage.setItem(
            "homeAuraCustomer",
            JSON.stringify(
                loggedInCustomer
            )
        );

        setCustomer(
            loggedInCustomer
        );

        return response.data;
    };

    // ============================================
    // LOGOUT
    // ============================================

    const logout = () => {
        localStorage.removeItem(
            "homeAuraToken"
        );

        localStorage.removeItem(
            "homeAuraCustomer"
        );

        setCustomer(null);
    };

    // ============================================
    // AUTH STATUS
    // ============================================

    const isAuthenticated =
        Boolean(customer);

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated,
                loading,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
