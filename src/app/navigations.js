import { rootPath } from 'app/config';
export const navigations = [{
        name: "Dashboard",
        description: "",
        type: "dashboard",
        icon: "nav-icon i-Bar-Chart",
        path: rootPath + 'dashboard'
    },
    {
        name: "Master",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Book",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Banner",
                path: rootPath + "master/banner",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Price List",
                path: rootPath + "master/price-list",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Discounts & Offers",
                path: rootPath + "master/discounts-offer",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Partner",
                path: rootPath + "master/manage-partner",
                type: "link"
            }
        ]
    },
    {
        name: "Catalog Management",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Book",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Category",
                path: rootPath + "catalogue/categories",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Sub Category",
                path: rootPath + "catalogue/subcategories",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Product",
                path: rootPath + "catalogue/manage-product",
                type: "link"
            }
        ]
    },
    {
        name: "Customer Management",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Business-Mens",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Customer",
                path: rootPath + "customer/manage-customer",
                type: "link"
            },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Approval Customer",
            //     path: rootPath + "catalogue/categories",
            //     type: "link"
            // },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Block Customer",
            //     path: rootPath + "catalogue/subcategories",
            //     type: "link"
            // }
        ]
    },
    {
        name: "Manage Order",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Business-Mens",
        sub: [
            {
                icon: "nav-icon i-Arrow-Down-in-Circle",
                name: "View Enquiry List",
                path: rootPath + "order/view-enquiry-list",
                type: "link"
            },
            {
                icon: "nav-icon i-Arrow-Down-in-Circle",
                name: "View Order List",
                path: rootPath + "order/view-order",
                type: "link"
            },
            {
                icon: "nav-icon i-Crop-2",
                name: "Payment Details",
                path: rootPath + "partner/new-partner",
                type: "link"
            },
            {
                icon: "nav-icon i-Arrow-Down-in-Circle",
                name: "Shopping Integration",
                path: rootPath + "partner/manage-partner",
                type: "link"
            },
            {
                icon: "nav-icon i-Crop-2",
                name: "Cancel Order",
                path: rootPath + "partner/new-partner",
                type: "link"
            }
        ]
    },
    {
        name: "Settings",
        description: "",
        type: "link",
        icon: "nav-icon i-Gear",
        path: rootPath + 'setting'
    },
    {
        name: "Reports",
        description: "",
        type: "link",
        icon: "nav-icon i-File-Chart",
        path: rootPath + 'report'
    },
];