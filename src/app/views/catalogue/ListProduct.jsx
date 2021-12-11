import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import { Button, Badge } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { SimpleCard } from "@gull";
import { useDispatch, useSelector } from 'react-redux';
import swal from "sweetalert2";
import axios from 'axios';
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { getPorductList } from "app/redux/actions/CatalogActions";

const ListProduct = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPorductList())
    }, [dispatch])

    const product = useSelector((state) => (state.catalog.productList))

    const [ids, setIds] = useState([])

    const handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            ids.push(row._id)
        }
        else {
            ids.pop(row._id)
        }

        setIds(ids)
        return true;
    }

    const handleOnSelectAll = (isSelect, rows) => {
        var ar = []
        if (isSelect) {
            ar = rows.map((e) => e._id)
        }
        else {
            ar = []
        }

        setIds(ar)
        return true
    }

    const action = (type) => {
        swal
            .fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " it!",
                cancelButtonText: "No"
            })
            .then(result => {
                if (result.value) {
                    axios
                        .post(apiUrl + "catalog/product_action", { type: type, ids: ids })
                        .then((res) => {
                            if (res.data.status) {
                                NotificationManager.success(
                                    res.data.message
                                );
                            }
                            else {
                                NotificationManager.warning(
                                    res.data.message
                                );
                            }
                            dispatch(getPorductList())
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
            })
    }

    let sortableColumn = [
        {
            text: "S.No",
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            headerStyle: {
                width: '7%',
                textAlign: 'center',
            },
            classes: 'text-center',
            sort: false
        },
        {
            text: "Action",
            headerStyle: {

                textAlign: 'center',
            },
            style: {
                whiteSpace: 'nowrap',
            },
            formatter: (cell, row, index) => {
                return <>
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            props.productEdit(row._id);
                        }}
                    >
                        <i className='text-18 ion-ios-create'></i>
                    </Button>
                    <Button
                        className='m-1'
                        variant='outline-danger'
                        onClick={() => {
                            swal
                                .fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    type: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!",
                                    cancelButtonText: "No"
                                })
                                .then(result => {
                                    if (result.value) {
                                        axios
                                            .put(apiUrl + 'catalog/product_delete/' + row._id)
                                            .then((res) => {
                                                if (res.data.status) {
                                                    NotificationManager.success(
                                                        res.data.message
                                                    );
                                                }
                                                else {
                                                    NotificationManager.warning(
                                                        res.data.message
                                                    );
                                                }
                                                dispatch(getPorductList())
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })
                                    }
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-trash'></i>
                    </Button>
                </>;
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                width: '15%',
                textAlign: 'center',
            },
            dataField: "name",
            text: "Pro.Name",
            sort: false
        },
        {
            headerStyle: {
                width: '11%',
                textAlign: 'center'
            },
            formatter: (cell, row, index) => (row.type === 1 ? 'Non Inventory' : (row.type === 2 ? 'Inventory' : (row.type === 3 ? 'Service' : ''))),
            text: "Pro.Type",
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                width: '11%',
                textAlign: 'center'
            },
            formatter: (cell, row, index) => (row.tracking) ? 'Yes' : 'No',
            text: "Tracking",
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                width: '11%',
                textAlign: 'center'
            },
            dataField: "price",
            text: "Price",
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                width: '11%',
                textAlign: 'center'
            },
            dataField: "packing_cost",
            text: "Pack.Cost",
            classes: 'text-center',
            sort: false
        },
        {
            dataField: "description",
            headerStyle: {
                textAlign: 'center',
                width: '10%',
            },
            classes: 'text-center',
            text: "Desc",
            sort: false
        },

        {
            headerStyle: {
                width: '10%',
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return (row.status === 1) ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : <Badge className="p-2 m-1 badge badge-danger">In Active</Badge>;
            },
            text: "Status",
            editable: false,
            classes: 'text-center',
            sort: false
        },
    ];

    let paginationOptions = {
        custom: false,
        paginationSize: 5,
        pageStartIndex: 1,
        firstPageText: "First",
        prePageText: "Back",
        nextPageText: "Next",
        lastPageText: "Last",
        nextPageTitle: "First page",
        prePageTitle: "Pre page",
        firstPageTitle: "Next page",
        lastPageTitle: "Last page",
        showTotal: true,
        totalSize: product.length
    };

    let { SearchBar } = Search;

    const defaultSorted = [{
        dataField: 'sequence',
        order: 'asc'
    }];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        clickToEdit: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Catalog", path: "/catalogue/manage-product" },
                    { name: "Manage Product" }
                ]}
            ></Breadcrumb>
            <SimpleCard title={
                <>Product List
                    <div className="float-right">
                        <Button
                            onClick={() => {
                                props.productAdd('');
                            }}
                            variant="outline-success m-1 text-capitalize">
                            Add Product
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch(getPorductList())
                            }}
                            variant="outline-primary m-1 text-capitalize">
                            <i className="i-Data-Refresh nav-icon"></i>
                        </Button>
                    </div>
                </>}>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={product}
                    columns={sortableColumn}
                    search
                >
                    {props => (
                        <>
                            <div className="d-flex justify-content-end align-items-center">
                                <span className="mb-2 mr-1">Search:</span>
                                <SearchBar {...props.searchProps} className="mb-0" />
                            </div>
                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='_id'
                                selectRow={selectRow}
                                defaultSorted={defaultSorted}
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={"Product is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>

                <div className="card-footer-btn">
                    <Button onClick={() => action('active')} variant="outline-info mr-1">Active</Button>
                    <Button onClick={() => action('inactive')} variant="outline-secondary m-1">In Active</Button>
                    <Button onClick={() => action('delete')} variant="outline-danger m-1">Delete</Button>
                </div>
            </SimpleCard>
            <NotificationContainer />
        </>
    )
}

export default ListProduct;