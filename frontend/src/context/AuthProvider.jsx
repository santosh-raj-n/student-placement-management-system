import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };
    const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    };

    useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");

        if (savedLogin) {
            setIsLoggedIn(JSON.parse(savedLogin));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
                    {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;