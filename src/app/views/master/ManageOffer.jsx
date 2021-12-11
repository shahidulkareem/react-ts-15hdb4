import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import { Modal, Form, Button, Badge, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { SimpleCard } from "@gull";
import { useDispatch, useSelector } from 'react-redux';
import { getOfferList } from "app/redux/actions/OfferActions";
import swal from "sweetalert2";
import { TableDate, decryptJWT } from 'app/services/common'
import axios from 'axios';
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import * as common from "app/services/common";

const ManageOffer = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOfferList())
    }, [dispatch])

    const offer = useSelector((state) => (state.offer.offerList))

    const [ids, setIds] = useState([])
    const [offerData, setOfferData] = useState([])
    const [offerModal, setOfferModal] = useState(false)

    const handleClose = () => {
        setOfferModal(false)
    }

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
                        .post(apiUrl + "master/offer_action", { type: type, ids: ids })
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
                            dispatch(getOfferList())
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
                        variant='outline-info'
                        onClick={() => {
                            axios
                                .get(apiUrl + 'master/offer/' + row._id)
                                .then((res) => {
                                    var data = decryptJWT(res.data.token, true)
                                    if (res.data.status) {
                                        setOfferData(data)
                                        setOfferModal(true)
                                    }
                                    else {
                                        setOfferModal(false)
                                        setOfferData([])
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-eye'></i>
                    </Button>
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            props.offerEdit(row._id);
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
                                            .put(apiUrl + 'master/offer_delete/' + row._id)
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
                                                dispatch(getOfferList())
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
            dataField: "offercode",
            text: "Off.Code",
            sort: false
        },
        {
            headerStyle: {
                width: '15%',
                textAlign: 'center',
            },
            dataField: "offertitle",
            text: "Off.Title",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
                width: '12%',
            },
            text: "Off.Type",
            formatter: (cell, row, index) => (row.offertype === 1) ? 'Percentage' : 'Flat',
            sort: false
        },
        {
            dataField: "offervalue",
            headerStyle: {
                textAlign: 'center',
                width: '10%',
            },
            classes: 'text-center',
            text: "Off.Value",
            sort: false
        },
        {
            headerStyle: {
                width: '11%',
                textAlign: 'center'
            },
            text: "Exp.Date",
            formatter: (cell, row, index) => (row.validitytype === 1) ? 'Life Time' : TableDate(row.validitydate),
            classes: 'text-center',
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
        totalSize: offer.length
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
                    { name: "Offer", path: "/master/discounts-offer" },
                    { name: "Manage Offer" }
                ]}
            ></Breadcrumb>
            <SimpleCard title={
                <>Offer List
                    <div className="float-right">
                        <Button
                            onClick={() => {
                                props.offerAdd('');
                            }}
                            variant="outline-success m-1 text-capitalize">
                            Add Offer
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch(getOfferList())
                            }}
                            variant="outline-primary m-1 text-capitalize">
                            <i className="i-Data-Refresh nav-icon"></i>
                        </Button>
                    </div>
                </>}>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={offer}
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
                                noDataIndication={"Offer is empty"}
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

            <Modal show={offerModal} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
                <Form className="px-3 needs-validation">
                    <Modal.Header closeButton>
                        <Modal.Title>View Offer Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup className="col-md-12 mb-3 pl-0">
                                    <FormLabel className="font-weight-bold">Offer Code</FormLabel>
                                    <FormControl
                                        type="text"
                                        disabled={true}
                                        value={(offerData.length > 0) ? offerData[0].offercode : ''}
                                        className="form-control col-md-12"
                                    />
                                    <FormLabel className="font-weight-bold">Offer Title</FormLabel>
                                    <FormControl
                                        type="text"
                                        disabled={true}
                                        className="form-control col-md-12"
                                        value={(offerData.length > 0) ? offerData[0].offertitle : ''}
                                    />
                                    <FormLabel className="font-weight-bold">Offer Description</FormLabel>
                                    <FormControl
                                        type="text"
                                        disabled={true}
                                        className="form-control col-md-12"
                                        value={(offerData.length > 0) ? offerData[0].description : ''}
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <img onError={common.addDefaultSrc} src={(offerData.length > 0) ? (offerData[0].image ? process.env.PUBLIC_URL + "/offer/" + offerData[0].image : process.env.PUBLIC_URL + "/placeholder.png") : process.env.PUBLIC_URL + "/placeholder.png"} alt="" style={{
                                    width: '100%',
                                    objectFit: 'contain',
                                    height: '183px'
                                }} />
                            </div>
                        </div>
                        <Form.Row className="col-md-12 p-0">
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Offer Day</FormLabel>
                                <FormControl
                                    as="textarea"
                                    style={{ height: '55px !important' }}
                                    disabled={true}
                                    className="form-control col-md-12"
                                >
                                    {(offerData.length > 0) ? offerData[0].offerdaysetting.reduce((acc, curr) => `${acc}${curr.label},`, "").slice(0, -1) : ''}</FormControl>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Offer Apply</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? (offerData[0].offerapplysetting === "1" ? 'Every Day' : (offerData[0].offerapplysetting === "2" ? 'Offer Perday' : (offerData[0].offerapplysetting === "3" ? 'Offer Per Week' : (offerData[0].offerapplysetting === "4" ? 'Offer Per Month' : (offerData[0].offerapplysetting === "5" ? 'Till End Date - One Order' : ''))))) : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Offer Type</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? (offerData[0].offertype === 1 ? 'Percentage' : 'Flat') : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Offer Value</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? offerData[0].offervalue : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Minimum Order Value</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? offerData[0].minordervalue : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Maximum Discount</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? offerData[0].maximumdiscount : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Validity Type</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? (offerData[0].validitytype === 1 ? 'Lifetime' : 'Set End Period') : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Expiry Date</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    value={(offerData.length > 0) ? TableDate(offerData[0].validitydate) : ''}
                                />
                            </FormGroup>
                        </Form.Row>
                    </Modal.Body>
                </Form>
            </Modal>
        </>
    )
}

export default ManageOffer;