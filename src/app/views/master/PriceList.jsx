import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory from 'react-bootstrap-table2-editor';
import fileDownload from 'js-file-download';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { SimpleCard } from "@gull";
import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Button,
    Badge,
    FormLabel,
} from "react-bootstrap";

import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import swal from "sweetalert2";
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import * as common from "app/services/common";
import { getPriceList } from "app/redux/actions/MasterActions";
import { useDispatch, useSelector } from "react-redux";

const PriceList = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPriceList())
    }, [dispatch])

    const priceList = useSelector((state) => (state.master.priceList))

    const [priceModal, setPriceModal] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    const [imageUrl, setImageUrl] = useState('')
    const [dragClass, setDragClass] = useState('');

    const [files, setFiles] = useState([])
    const [ids, setIds] = useState([])

    const [price, setPrice] = useState({
        _id: '',
        title: '',
        date: '',
        filename: '',
        description: '',
        status: '',
    })

    const handleDragOver = event => {
        event.preventDefault();
        setDragClass("drag-shadow");
    };

    const handleDrop = event => {
        event.persist();
        setShowBtn(true)
        let files = event.dataTransfer.files;
        let list = [];
        setImageUrl(URL.createObjectURL(event.dataTransfer.files[0]))
        for (const iterator of files) {
            list.push({
                file: iterator,
                uploading: false,
                error: false,
                progress: 0
            });
        }

        setDragClass("");
        setFiles([...list]);
        return false;
    };

    const handleFileSelect = event => {
        setShowBtn(true)
        let files = event.target.files;
        let list = [];
        console.log(files)
        setImageUrl(URL.createObjectURL(event.target.files[0]))
        for (const iterator of files) {
            list.push({
                file: iterator,
                uploading: false,
                error: false,
                progress: 0
            });
        }
        setFiles([...list]);
    };

    const handleDragStart = event => {
        event.preventDefault()
        setDragClass("drag-shadow")
    };

    const handleClose = () => {
        setPriceModal(false)
    }

    // const priceEdit = (id) => {
    //     axios
    //         .get(apiUrl + "catalog/pricelist/" + id)
    //         .then((res) => {
    //             setPriceModal(true)
    //             var data = common.decryptJWT(res.data.token, true)
    //             setPrice(data[0])
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }

    const checkExist = (e, title, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "catalog/pricelist_exist/" + id, { title: title, id: id })
                .then((res) => {
                    if (!res.data.status) {
                        NotificationManager.warning(
                            res.data.message
                        );
                        setIsExist(true)
                    }
                    else {
                        setIsExist(false)
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                    setIsExist(true)
                })
        }
        else {
            axios
                .post(apiUrl + "catalog/pricelist_exist", { title: title })
                .then((res) => {
                    if (!res.data.status) {
                        NotificationManager.warning(
                            res.data.message
                        );
                        setIsExist(true)
                    }
                    else {
                        setIsExist(false)
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                    setIsExist(true)
                })
        }
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
                        .post(apiUrl + "catalog/pricelist_action", { type: type, ids: ids })
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
                            dispatch(getPriceList())
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
            })
    }

    const downloadFile = (fileName) => {
        if (fileName === '') {
            NotificationManager.warning(
                'File Cannot be download !!!, File Missing or Not uploading !!!'
            );
        }
        else {
            axios
                .get(process.env.PUBLIC_URL + '/PriceLists/' + fileName, {
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

    let isEmpty = files.length === 0;

    let sortableColumn = [
        {
            text: "S.No",
            headerStyle: {
                width: '8%',
                textAlign: 'center'
            },

            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            classes: 'text-center',
            sort: false
        },
        {
            text: "Action",
            headerStyle: {
                width: '13%',
                textAlign: 'center'
            },

            classes: 'text-center',
            formatter: (cell, row, index) => {
                return <>
                    {/* <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            priceEdit(row._id);
                        }}
                    >
                        <i className='text-18 ion-ios-create'></i>
                    </Button> */}
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
                                            .put(apiUrl + 'catalog/pricelist_delete/' + row._id)
                                            .then((res) => {
                                                NotificationManager.success(
                                                    res.data.message
                                                );
                                                dispatch(getPriceList())
                                            })
                                            .catch((err) => {
                                                NotificationManager.success(
                                                    err
                                                );
                                            })
                                    }
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-trash'></i>
                    </Button>
                </>;
            },
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            dataField: "title",
            text: "Title",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            text: "Date",
            formatter: (cell, row, index) => {
                return common.TableDate(row.date);
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            style: {
                textAlign: 'center',
                textTransform: 'capitalize'
            },
            dataField: "description",
            text: "Description",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            style: {
                textAlign: 'center',
                textTransform: 'capitalize'
            },
            formatter: (cell, row, index) => {
                return <span onClick={() => downloadFile(row.filename)} className="m-1 btn btn-outline-primary"><i className="font-weight-bold nav-icon i-Download"></i></span>
            },
            text: "Attachment",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return (row.status === 1) ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : <Badge className="p-2 m-1 badge badge-danger">In Active</Badge>;
            },
            text: "Status",
            classes: 'text-center',
            sort: false
        },
    ];

    let paginationOptions = {
        custom: false,
        paginationSize: 10,
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
        totalSize: priceList.length
    };

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

    let { SearchBar } = Search;

    let price_title = <div>
        Price List
        <Button
            variant="outline-success float-right"
            onClick={(e) => {
                setPriceModal(true)
                setPrice({
                    _id: '',
                    title: '',
                    date: '',
                    filename: '',
                    description: '',
                    status: 1,
                })
                setIsExist(false)
            }}
        >
            Add Price List
        </Button>
    </div>

    const handleSubmit = (values, { setSubmitting }) => {
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }
        fd.append('title', values.title);
        fd.append('date', values.date);
        fd.append('description', values.description);
        fd.append('status', values.status);

        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "catalog/pricelist/" + values._id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    dispatch(getPriceList())
                    setPriceModal(false)
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post(apiUrl + "catalog/pricelist", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    dispatch(getPriceList())
                    setPriceModal(false)
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    return (
        <div>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Master", path: "/master/price-list" },
                    { name: "Price List" }
                ]}
            />
            
            <SimpleCard title={price_title}>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={priceList}
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
                                keyField='_id'
                                selectRow={selectRow}
                                // cellEdit={cellEditFactory({
                                //     mode: 'click',
                                //     blurToSave: true
                                // })}
                                defaultSorted={defaultSorted}
                                headerClasses="datatable-header"
                                pagination={paginationFactory(paginationOptions)}
                                noDataIndication={"Price List is empty"}
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
            <Modal show={priceModal} onHide={handleClose} backdrop="static" size="lg" keyboard={false} centered={true}>
                <Formik
                    initialValues={{ ...price }}
                    validationSchema={
                        yup.object().shape({
                            title: yup.string().required("Title is required"),
                            date: yup.string().required("Date is required"),
                            filename: yup.mixed()
                                .test(
                                    "type",
                                    "We only support PDF",
                                    (value) => { return !value || (value && value[0].type === "application/pdf") }
                                ),
                            status: yup.string().required("Status is required"),
                        })
                    }
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        touched,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setSubmitting,
                        setFieldValue
                    }) => {
                        return (
                            <Form
                                onSubmit={handleSubmit}
                                className="px-3 needs-validation"
                                noValidate
                                encType={true}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{(values._id) ? 'Edit' : 'Add'} Price List</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Row>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Title <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='title'
                                                placeholder="Title"
                                                value={values.title}
                                                onChange={(e) => {
                                                    checkExist(e, e.target.value, values._id)
                                                    setFieldValue('title', e.target.value)
                                                }}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.title &&
                                                    touched.title
                                                }
                                            />
                                            <FormControl
                                                type="hidden"
                                                name='_id'
                                                value={values._id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors._id &&
                                                    touched._id
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Date <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="date"
                                                className="form-control col-md-12"
                                                name='date'
                                                value={values.date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.date &&
                                                    touched.date
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Description</FormLabel>
                                            <FormControl
                                                as="textarea"
                                                rows={1}
                                                className="form-control col-md-12"
                                                name='description'
                                                placeholder="Description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.description &&
                                                    touched.description
                                                }
                                            />
                                        </FormGroup>

                                        {values._id &&
                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Status <span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    as="select"
                                                    className="form-control col-md-12"
                                                    name='status'
                                                    placeholder="status"
                                                    value={values.status}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.status &&
                                                        touched.status
                                                    }
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="2">In Active</option>
                                                </FormControl>
                                                {errors.status && (
                                                    <div className="text-danger mt-1 ml-2">
                                                        {errors.status}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        }

                                        <div className='col-md-12 m-0 pl-0 form-group'>
                                            <FormLabel className="font-weight-bold">Price List Attachment</FormLabel>
                                            <div
                                                className={`${dragClass} dropzone d-flex justify-content-center align-items-center`}
                                                style={{ minHeight: '100px' }}
                                                onDragEnter={(e) => handleDragStart(e)}
                                                onDragOver={(e) => handleDragOver(e)}
                                                onDrop={(e) => handleDrop(e)}
                                            >
                                                <span class="removeicon"
                                                    style={{ display: (showBtn || (values.image !== undefined)) ? 'block' : 'none' }}
                                                    onClick={() => {
                                                        setShowBtn(false)
                                                        setFiles([])
                                                        setImageUrl('')
                                                        setFieldValue('image', undefined)
                                                    }}
                                                >x</span>
                                                {(isEmpty && (values.image === undefined)) ? <span>Drop your files here</span> : <img onError={common.addDefaultSrc} style={{ width: '100%', height: '100px' }} src={(values.image) ? process.env.PUBLIC_URL + '/banner/' + values.image : imageUrl} alt="" />}
                                            </div>

                                            {errors.filename && (
                                                <div className="text-danger mt-1 ml-2">
                                                    {errors.filename}
                                                </div>
                                            )}
                                        </div>
                                    </Form.Row>
                                </Modal.Body>
                                <Modal.Footer className="row">
                                    <div className="float-left col-md-9 pl-0">
                                        <label htmlFor="upload-multiple-file">
                                            <label htmlFor="upload-single-file">
                                                <Button variant="outline-primary" as="span">
                                                    <div className="flex flex-middle">
                                                        <span>Choose File</span>
                                                    </div>
                                                </Button>
                                            </label>
                                            <input
                                                className="d-none"
                                                onChange={handleFileSelect}
                                                id="upload-single-file"
                                                type="file"
                                                name="filename"
                                                value={values.filename}
                                                accept="application/pdf"
                                            />
                                        </label>
                                    </div>
                                    <div className="float-right">
                                        <Button variant="outline-danger m-1 text-capitalize" onClick={handleClose}>Cancel</Button>
                                        <Button disabled={isExist} type="submit" variant="outline-primary m-1 text-capitalize">{(values._id ? 'Update' : 'Submit')}</Button>
                                    </div>
                                </Modal.Footer>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal>
            <NotificationContainer />
        </div >
    )
}

export default PriceList