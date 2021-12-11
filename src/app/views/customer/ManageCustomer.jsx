import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import {
    Modal,
    Form,
    FormLabel,
    FormGroup,
    FormControl,
    Dropdown,
    Button,
    Badge
} from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { SimpleCard } from "@gull";
import { useDispatch, useSelector } from 'react-redux';
import swal from "sweetalert2";
import axios from 'axios';
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { getCustomer } from "app/redux/actions/CustomerActions";
import fileDownload from 'js-file-download';
import * as common from "app/services/common";

const ManageCustomer = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCustomer())
    }, [dispatch])

    const customer = useSelector((state) => (state.customer.customerList))
    const [customerData, setCustomerData] = useState([])
    const [customerModal, setCustomerModal] = useState(false)

    const downloadFile = (fileName) => {
        if (fileName === '') {
            NotificationManager.warning(
                'File Cannot be download !!!, File Missing or Not uploading !!!'
            );
        }
        else {
            axios
                .get(process.env.PUBLIC_URL + '/product/' + fileName, {
                    responseType: 'blob',
                })
                .then((res, err) => {
                    if (err)
                        NotificationManager.warning('File Cannot be download !!!, File Missing or Not uploading !!!');
                    else
                        fileDownload(res.data, fileName)
                })
        }
    }

    const handleClose = () => {
        setCustomerModal(false)
    }

    const memberVerifed = (event) => {
        let id = event.target[0].form.customer_id.value;
        let status = event.target[0].form.status.value;
        if (status !== '') {
            axios
                .post(apiUrl + "member/customer_verified", {
                    id: id,
                    statuscode: status
                })
                .then((res) => {
                    (res.data.message) ? NotificationManager.success(res.data.message) : NotificationManager.warning(res.data.message);
                    setCustomerModal(false)
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                })
        }
        else {
            NotificationManager.warning('Please Select Customer Status !!!');
        }

        dispatch(getCustomer())
        event.preventDefault()
    }

    let sortableColumn = [
        {
            text: "#",
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            headerStyle: {
                width: '5%',
                textAlign: 'center',
            },
            classes: 'text-center',
            sort: false
        },

        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "name",
            text: "Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "email",
            text: "E-Mail",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "mobile",
            text: "Mobile",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "shopname",
            text: "Shop Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            text: 'Attachment',
            formatter: (cell, row, index) => {
                let attach = <div className="d-flex flex-wrap">
                    <Dropdown key={index}>
                        <Dropdown.Toggle variant='outline-primary' className="mr-3 mb-3">Attacment</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                row.attachments?.map((e, i) => <Dropdown.Item onClick={() => downloadFile(e.filename)} eventKey={i}><i className="i-Download-from-Cloud"> </i> {e.type}</Dropdown.Item>)
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                return attach;
            },
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
                            axios
                                .post(apiUrl + "member/customer_by_id", { id: row._id })
                                .then((res) => {
                                    var data = common.decryptJWT(res.data.token, true)
                                    setCustomerData(data)
                                    setCustomerModal(true)
                                })
                                .catch((err) => {
                                    NotificationManager.warning(
                                        err.message
                                    );
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-eye'></i>
                    </Button>
                    <Button
                        className='m-1'
                        variant='outline-info'
                        onClick={() => {
                            swal
                                .fire({
                                    title: "Are you sure?",
                                    text: "Do you want to verified this customer!",
                                    icon: "warning",
                                    type: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, verified it!",
                                    cancelButtonText: "No"
                                })
                                .then(result => {
                                    if (result.value) {
                                        axios
                                            .post(apiUrl + "member/customer_verified/", { id: row._id, statuscode: 1 })
                                            .then((res) => {
                                                (res.data.message) ? NotificationManager.success(res.data.message) : NotificationManager.warning(res.data.message);
                                                setCustomerModal(false)
                                            })
                                            .catch((err) => {
                                                NotificationManager.warning(
                                                    err.message
                                                );
                                            })
                                    }
                                    dispatch(getCustomer())
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-checkmark'></i>
                    </Button>
                </>;
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return (row.status === 1 ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : (row.status === 2 ? <Badge className="p-2 m-1 badge badge-dark">In Active</Badge> : (row.status === 3 ? <Badge className="p-2 m-1 badge badge-danger">Delete</Badge> : (row.status === 4 ? <Badge className="p-2 m-1 badge badge-warning">In Progress</Badge> : (row.status === 5 ? <Badge className="p-2 m-1 badge badge-danger">Rejected</Badge> : (row.status === 6 ? <Badge className="p-2 m-1 badge badge-light">Hold</Badge> : ''))))));
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
        totalSize: customer.length
    };

    let { SearchBar } = Search;

    const MyExportCSV = (props) => {
        const handleClick = () => {
            let customer_export = []
            customer.forEach((e, i) => {
                customer_export.push({
                    _id: i,
                    name: e.name,
                    email: e.email,
                    mobile: e.mobile,
                    shopname: e.shopname,
                    status: (e.status === 1 ? 'Active' : (e.status === 2 ? 'In Active' : (e.status === 3 ? 'Delete' : (e.status === 4 ? 'In Progress' : (e.status === 5 ? 'Rejected' : (e.status === 6 ? 'Hold' : '')))))),
                })
            });
            console.log(customer_export);
            props.onExport(customer_export);
        };
        return (
            <div>
                <button className="btn btn-outline-success" onClick={handleClick}>Export to CSV</button>
            </div>
        );
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Customer", path: "/customer/manage-customer" },
                    { name: "Manage Customer" }
                ]}
            ></Breadcrumb>
            <SimpleCard title="Customer List">
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={customer}
                    columns={sortableColumn}
                    search
                    exportCSV={{
                        fileName: 'customer-details-' + new Date() + '.csv',
                        blobType: 'text/csv;charset=ansi',
                        noAutoBOM: false,
                    }}
                >
                    {props => (
                        <>
                            <div>
                                <MyExportCSV {...props.csvProps} />
                            </div>

                            <div className="d-flex justify-content-end align-items-center">
                                <span className="mb-2 mr-1">Search:</span>
                                <SearchBar {...props.searchProps} className="mb-0" />
                            </div>

                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='_id'
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={"Customer is empty"}

                            />
                        </>
                    )}

                </ToolkitProvider>
            </SimpleCard>
            <NotificationContainer />
            <Modal show={customerModal} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
                <Form method="POST" onSubmit={event => memberVerifed(event)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Customer Name</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    placeholder="Customer Name"
                                    value={(customerData.length > 0) ? customerData[0].name : ''}
                                />
                                <FormControl
                                    type="hidden"
                                    name='_id'
                                    value={(customerData.length > 0) ? customerData[0]._id : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>E-Mail</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                    name='email'
                                    disabled={true}
                                    placeholder="E-Mail"
                                    value={(customerData.length > 0) ? customerData[0].email : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Mobile</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    name='mobile'
                                    placeholder="Mobile"
                                    value={(customerData.length > 0) ? customerData[0].mobile : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Shop.Name</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    name='shopname'
                                    placeholder="Shop.Name"
                                    value={(customerData.length > 0) ? customerData[0].shopname : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Status</FormLabel>
                                <FormControl
                                    as="select"
                                    className="form-control col-md-12"
                                    name='status'
                                    disabled={(customerData.length > 0 ? (customerData[0].status === 1 ? true : false) : false)}
                                >
                                    <option value="">Select Status</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].status === 5 ? true : false) : false)} value="5">Rejected</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].status === 6 ? true : false) : false)} value="6">Hold</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].status === 1 ? true : false) : false)} value="1">Verified</option>
                                </FormControl>
                                <FormControl
                                    type="hidden"
                                    name='customer_id'
                                    value={(customerData.length > 0) ? customerData[0]._id : 0}
                                />
                            </FormGroup>
                        </Form.Row>
                        <div class="row">
                            <div class="column">
                                <img src={(customerData.length > 0) ? process.env.PUBLIC_URL + '/member/attachment/gst/' + customerData[0].attachments[0].filename : ''} alt="" />
                            </div>
                            <div class="column">
                                <img src={(customerData.length > 0) ? process.env.PUBLIC_URL + '/member/attachment/business_card/' + customerData[0].attachments[1].filename : ''} alt="" />
                            </div>
                            <div class="column">
                                <img src={(customerData.length > 0) ? process.env.PUBLIC_URL + '/member/attachment/profile/' + customerData[0].attachments[2].filename : ''} alt="" />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="float-right">
                            <Button variant="outline-danger m-1 text-capitalize" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="outline-primary m-1 text-capitalize" disabled={(customerData.length > 0 ? (customerData[0].status === 1 ? true : false) : false)}>Submit</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ManageCustomer;