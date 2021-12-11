import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    setLayoutSettings,
    setDefaultSettings
} from "app/redux/actions/LayoutActions";
import { logoutUser } from "app/redux/actions/UserActions";
import { withRouter } from "react-router-dom";
import { merge } from "lodash";
import * as common from "app/services/common"

class Layout2Header extends Component {

    state = {
        user: common.getUserData()
    }

    handleMenuClick = () => {
        let { setLayoutSettings, settings } = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout2Settings: {
                    leftSidebar: {
                        open: !settings.layout2Settings.leftSidebar.open,
                        secondaryNavOpen: !settings.layout2Settings.leftSidebar.open
                    }
                }
            })
        );
    };

    toggleFullScreen = () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreen) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        }
    };

    handleSearchBoxOpen = () => {
        let { setLayoutSettings, settings } = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout2Settings: {
                    searchBox: {
                        open: true
                    }
                }
            })
        );
    };

    render() {
        return (
            <div className="main-header">
                <div className="logo">
                    <img  onError={common.addDefaultSrc} src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="" />
                </div>

                <div className="menu-toggle" onClick={this.handleMenuClick}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div style={{ margin: "auto" }}></div>

                <div className="header-part-right">
                    <i
                        className="i-Full-Screen header-icon d-none d-sm-inline-block"
                        data-fullscreen
                        onClick={this.toggleFullScreen}
                    ></i>

                    <div className="user col align-self-end">
                        <Dropdown>
                            <DropdownToggle variant="link" className="toggle-hidden">
                                <img
                                    src={process.env.PUBLIC_URL + "/assets/images/faces/user.png"}
                                    id="userDropdown"
                                    alt=""
                                    onError={common.addDefaultSrc}
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                />
                            </DropdownToggle>
                            <DropdownMenu>
                                <div className="dropdown-header font-weight-bold text-dark">
                                    <i className="i-Lock-User mr-1"></i>{(this.state.user) ? this.state.user.name : ''}
                                </div>
                                <span className="dropdown-item cursor-pointer">Account settings</span>
                                <span className="dropdown-item cursor-pointer">Billing history</span>
                                <span className="dropdown-item cursor-pointer" onClick={this.props.logoutUser}>Sign out</span>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }
}

Layout2Header.propTypes = {
    setLayoutSettings: PropTypes.func.isRequired,
    setDefaultSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    setDefaultSettings: PropTypes.func.isRequired,
    setLayoutSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    user: state.user,
    settings: state.layout.settings
});

export default withRouter(
    connect(mapStateToProps, {
        setLayoutSettings,
        setDefaultSettings,
        logoutUser
    })(Layout2Header)
);
