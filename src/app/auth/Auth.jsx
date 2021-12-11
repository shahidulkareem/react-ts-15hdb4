import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setUserData } from "../redux/actions/UserActions";
import jwtAuthService from "../services/jwtAuthService";
import localStorageService from "../services/localStorageService";
import firebaseAuthService from "../services/firebase/firebaseAuthService";

class Auth extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.props.setUserData(localStorageService.getItem("auth_user"));
        this.checkJwtAuth();
        // this.checkFirebaseAuth();
    }

    checkJwtAuth = () => {
        let token = localStorageService.getItem("auth_user")
        let userData = {}
        if (token !== null) {
            if (Object.keys(token).length !== 0) {
                userData.role = 'ADMIN';
                userData.token = token.token
            }
        }
        jwtAuthService.loginWithToken(userData).then(user => {
            this.props.setUserData(user);
        });
    };

    checkFirebaseAuth = () => {
        firebaseAuthService.checkAuthStatus(user => {
            if (user) {
                console.log(user.uid);
                console.log(user.email);
                console.log(user.emailVerified);
            } else {
                console.log("not logged in");
            }
        });
    };

    render() {
        const { children } = this.props;
        return <Fragment>{children}</Fragment>;
    }
}

const mapStateToProps = state => ({
    setUserData: PropTypes.func.isRequired,
    login: state.login
});

export default connect(mapStateToProps, { setUserData })(Auth);
