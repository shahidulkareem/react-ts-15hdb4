import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from 'react-bootstrap-table2-editor';
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
import { getBanner } from "app/redux/actions/MasterActions";
import { useDispatch, useSelector } from "react-redux";

const Banner = () => {

    const dispatch = useDispatch()

    const bannerList = useSelector((state) => (state.master.bannerList))

    const [bannerModal, setBannerModal] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    const [imageUrl, setImageUrl] = useState('')
    const [dragClass, setDragClass] = useState('');

    const [partnerData, setPartnerData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [files, setFiles] = useState([])
    const [ids, setIds] = useState([])

    const [banner, setBanner] = useState({
        _id: '',
        title: '',
        banner_location: '',
        banner_sublocation: '',
        description: '',
        sequence: '',
        mode: '',
        category: '',
        partner: '',
        product: '',
        size: '',
        file: '',
        status: '',
    })

    useEffect(() => {
        dispatch(getBanner())
        axios.get(apiUrl + "partner/partner").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            setPartnerData(data);
        }).catch((e) => {
            console.log(e.message);
        });

        axios.get(apiUrl + "catalog/category").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            setCategoryData(data);
        }).catch((e) => {
            console.log(e.message);
        });
    }, [dispatch])

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
        setBannerModal(false)
    }

    const bannerEdit = (id, category) => {
        getPartner(category)
        axios
            .get(apiUrl + "master/banner/" + id)
            .then((res) => {
                setBannerModal(true)
                var data = common.decryptJWT(res.data.token, true)
                console.log(data[0]);
                setBanner(data[0])
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const checkExist = (e, title, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "master/banner_exist/" + id, { title: title, id: id })
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
                .post(apiUrl + "master/banner_exist", { title: title })
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

    const getPartner = (category) => {
        axios.post(apiUrl + "catalog/get_product", { cat_ids: category }).then(res => {
            var data = common.decryptJWT(res.data.token, true)
            setProductData(data);
        }).catch((e) => {
            console.log(e.message);
        });

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
                        .post(apiUrl + "master/banner_action", { type: type, ids: ids })
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
                            dispatch(getBanner())
                            // document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false );
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
            })
    }

    let isEmpty = files.length === 0;

    let sortableColumn = [
        {
            text: "S.No",
            headerStyle: {
                width: '8%',
                textAlign: 'center'
            },
            editable: false,
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
            editable: false,
            classes: 'text-center',
            formatter: (cell, row, index) => {
                return <>
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            bannerEdit(row._id, row.category);
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
                                            .put(apiUrl + 'master/banner_delete/' + row._id)
                                            .then((res) => {
                                                NotificationManager.success(
                                                    res.data.message
                                                );
                                                dispatch(getBanner())
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
            editable: false,
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            text: "Image",
            formatter: (cell, row, index) => {
                return <img onError={common.addDefaultSrc} style={{ width: '50px', height: '50px' }} className="zoom123" src={process.env.PUBLIC_URL + '/banner/' + row.image} alt="" />;
            },
            classes: 'text-center',
            editable: false,
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
            editable: false,
            text: "Screen",
            formatter: (cell, row, index) => {
                return <code>{row.banner_location}</code>;
            },
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
                return <code>{row.banner_sublocation}</code>;
            },
            editable: false,
            text: "Position",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
                width: '11%',
            },
            style: {
                textAlign: 'center',
            },
            dataField: "sequence",
            validator: (newValue, row, column) => {
                if (newValue !== row.sequence) {
                    axios
                        .put(apiUrl + "master/banner_sequence/" + row._id, { sequence: parseInt(newValue) })
                        .then(res => {
                            if (res.data.status) {
                                NotificationManager.success(
                                    row.title + ' Sequence No Updated'
                                );
                            }
                            else {
                                NotificationManager.warning(
                                    res.data.message
                                );
                            }
                            dispatch(getBanner())
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
                return true;
            },
            text: "Seq",
            sort: true
        },
        {
            headerStyle: {
                textAlign: 'center',
                width: '11%',
            },
            style: {
                textAlign: 'center',
            },
            dataField: "size",
            validator: (newValue, row, column) => {
                if (newValue !== row.size) {
                    axios
                        .put(apiUrl + "master/banner_size/" + row._id, { size: newValue })
                        .then(res => {
                            if (res.data.status) {
                                NotificationManager.success(
                                    row.title + ' Size Updated'
                                );
                            }
                            else {
                                NotificationManager.warning(
                                    res.data.message
                                );
                            }
                            dispatch(getBanner())
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
                return true;
            },
            text: "Size",
            sort: true
        },
        {
            headerStyle: {
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
        totalSize: bannerList.length
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

    let banner_title = <div>
        Banner List
        <Button
            variant="outline-success float-right"
            onClick={(e) => {
                setBannerModal(true)
                setBanner({
                    _id: '',
                    title: '',
                    banner_location: '',
                    banner_sublocation: '',
                    description: '',
                    mode: '',
                    category: '',
                    partner: '',
                    product: '',
                    sequence: bannerList[(bannerList.length - 1)] ? (parseInt(bannerList[(bannerList.length - 1)].sequence) + 1) : 1,
                    size: '',
                    file: '',
                    status: 1,
                })
                setImageUrl('')
                setFiles([])
                setIsExist(false)
            }}
        >
            Add Banner
        </Button>
    </div>

    const handleSubmit = (values, { setSubmitting }) => {
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }
        fd.append('title', values.title);
        fd.append('banner_location', values.banner_location);
        fd.append('banner_sublocation', values.banner_sublocation);
        fd.append('description', values.description);
        fd.append('mode', values.mode);
        if (values.mode === 2) {
            fd.append('category', values.category);
            fd.append('product', values.product);
            fd.append('partner', '');
        }
        else {
            fd.append('partner', values.partner);
            fd.append('category', '');
            fd.append('product', '');
        }
        fd.append('sequence', values.sequence);
        fd.append('size', values.size);
        fd.append('status', values.status);

        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "master/banner/" + values._id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    dispatch(getBanner())
                    setBannerModal(false)
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post(apiUrl + "master/banner", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    dispatch(getBanner())
                    setBannerModal(false)
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
                    { name: "Master", path: "/master/banner" },
                    { name: "Banner" }
                ]}
            />
            <SimpleCard title={banner_title}>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={bannerList}
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
                                cellEdit={cellEditFactory({
                                    mode: 'click',
                                    blurToSave: true
                                })}
                                headerClasses="datatable-header"
                                defaultSorted={defaultSorted}
                                pagination={paginationFactory(paginationOptions)}
                                noDataIndication={"Banner is empty"}
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

            <Modal show={bannerModal} onHide={handleClose} backdrop="static" size="lg" keyboard={false} centered={true}>
                <Formik
                    initialValues={{ ...banner }}
                    validationSchema={
                        yup.object().shape({
                            title: yup.string().required("Title is required"),
                            sequence: yup.string().required("Sequence is required"),
                            size: yup.string().required("Size is required"),
                            status: yup.string().required("Status is required"),
                            // partner: yup.string().required("Partner is required"),
                            // category: yup.string().required("Category is required"),
                            // mode: yup.string().required("Mode is required")
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
                                    <Modal.Title>{(values._id) ? 'Edit' : 'Add'} Banner</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Row>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Select Screen <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                as="select"
                                                className="form-control col-md-12"
                                                name='banner_location'
                                                value={values.banner_location}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.banner_location &&
                                                    touched.banner_location
                                                }
                                            >
                                                <option value="">Select Screen</option>
                                                <option value="home">Home</option>
                                                <option value="master">Master</option>
                                            </FormControl>
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Select Position <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                as="select"
                                                className="form-control col-md-12"
                                                name='banner_sublocation'
                                                value={values.banner_sublocation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.banner_sublocation &&
                                                    touched.banner_sublocation
                                                }
                                            >
                                                <option value="">Select Position</option>
                                                <option value="top">Top</option>
                                                <option value="side">Side</option>
                                            </FormControl>
                                        </FormGroup>

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
                                            <FormLabel className="font-weight-bold">Size <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='size'
                                                placeholder="Size"
                                                value={values.size}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.size &&
                                                    touched.size
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Sequence <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='sequence'
                                                placeholder="Sequence"
                                                value={values.sequence}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.sequence &&
                                                    touched.sequence
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Select Vendor</FormLabel>
                                            <FormControl
                                                as="select"
                                                className="form-control col-md-12"
                                                name='partnerid'
                                                value={values.partnerid}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.partnerid &&
                                                    touched.partnerid
                                                }
                                            >
                                                <option value="">Select Vendor</option>
                                                <option value="null">Default</option>
                                                <option value="null">None</option>
                                            </FormControl>
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Select Mode</FormLabel>
                                            <FormControl
                                                as="select"
                                                className="form-control col-md-12"
                                                name='mode'
                                                value={values.mode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.mode &&
                                                    touched.mode
                                                }
                                            >
                                                <option value="">Select Mode</option>
                                                <option value="1">Partner</option>
                                                <option value="2">Product</option>
                                            </FormControl>
                                        </FormGroup>

                                        {parseInt(values.mode) === 1 &&
                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Select Partner</FormLabel>
                                                <FormControl
                                                    as="select"
                                                    className="form-control col-md-12"
                                                    name='partner'
                                                    value={values.partner}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.partner &&
                                                        touched.partner
                                                    }
                                                >
                                                    <option value="">Select Partner</option>
                                                    {partnerData.map((data, index) => <option key={index} selected={values.partner === data._id ? true : false} value={data._id}>{data.name}</option>)}
                                                </FormControl>
                                            </FormGroup>
                                        }

                                        {parseInt(values.mode) === 2 &&
                                            <>
                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Select Category</FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        className="form-control col-md-12"
                                                        name='category'
                                                        value={values.category}
                                                        onChange={(e) => {
                                                            getPartner(e.target.value)
                                                            setFieldValue('category', e.target.value)
                                                        }}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.category &&
                                                            touched.category
                                                        }
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categoryData.map((data, index) =>
                                                            <option key={index} selected={values.category === data._id ? true : false} value={data._id}>{data.category}</option>
                                                        )}
                                                    </FormControl>
                                                </FormGroup>
                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Select Product</FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        className="form-control col-md-12"
                                                        name='product'
                                                        value={values.product}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.product &&
                                                            touched.product
                                                        }
                                                    >
                                                        <option value="">Select Product</option>
                                                        {productData.map((data, index) =>
                                                            <option key={index} selected={values.product === data._id ? true : false} value={data._id}>{data.name}</option>
                                                        )}
                                                    </FormControl>
                                                </FormGroup>
                                            </>
                                        }

                                        <FormGroup className={(values.mode) ? "col-md-12 mb-3 pl-0" : "col-md-8 mb-3 pl-0"}>
                                            <FormLabel className="font-weight-bold">Description</FormLabel>
                                            <FormControl
                                                as="textarea"
                                                rows={2}
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
                                            <FormLabel className="font-weight-bold">Banner Image</FormLabel>
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

                                            {errors.file && (
                                                <div className="text-danger mt-1 ml-2">
                                                    {errors.file}
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
                                                accept="image/*"
                                            />
                                            {/* <Button
                                                variant="outline-danger"
                                                as="span"
                                                onClick={() => {
                                                    setFiles([])
                                                    setShowUpload(!showUpload)
                                                    setImageUrl('')
                                                }}
                                            >
                                                <div className="flex flex-middle">
                                                    <span>Remove</span>
                                                </div>
                                            </Button> */}
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
        </div>
    )
}

export default Banner;