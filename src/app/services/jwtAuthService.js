import axios from "axios";
import localStorageService from "./localStorageService";

class JwtAuthService {

    loginWithEmailAndPassword = (token) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let userData = {}
                if (token) {
                    userData.role = 'ADMIN';
                    userData.token = token;
                }
                resolve(userData);
            }, 1000);
        }).then(data => {
            this.setSession(data.token);
            this.setUser(data);
            return data;
        });
    };

    loginWithToken = (userData) => {
        if (userData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(userData);
                }, 100);
            }).then(data => {
                this.setSession(data.token);
                this.setUser(data);
                return data;
            });
        }
    };



    logout = () => {
        this.setSession(null);
        this.removeUser();
    }

    setSession = token => {
        if (token) {
            localStorage.setItem("jwt_token", token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        } else {
            localStorage.removeItem("jwt_token");
            delete axios.defaults.headers.common["Authorization"];
        }
    };
    setUser = (user) => {
        localStorageService.setItem("auth_user", user);
    }
    removeUser = () => {
        localStorage.removeItem("auth_user");
    }
}

export default new JwtAuthService();
