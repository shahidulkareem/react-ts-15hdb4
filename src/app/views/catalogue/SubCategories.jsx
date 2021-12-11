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
} from "react-bootstrap";

import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import swal from "sweetalert2";
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import * as common from "app/services/common";
import { getSubCategory } from "app/redux/actions/CatalogActions";
import { useDispatch, useSelector } from "react-redux";

const SubCategories = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSubCategory())
    }, [dispatch])

    const subcategoryList = useSelector((state) => (state.catalog.subcategoryList))

    const [subcategoryModal, setSubCategoryModal] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    const [imageUrl, setImageUrl] = useState('')
    const [dragClass, setDragClass] = useState('');

    const [files, setFiles] = useState([])
    const [ids, setIds] = useState([])

    const [subcategory, setSubCategory] = useState({
        _id: '',
        subcategory: '',
        description: '',
        filename: '',
        sequence: '',
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
        setSubCategoryModal(false)
    }

    const subcategoryEdit = (id) => {
        axios
            .get(apiUrl + "catalog/subcategory/" + id)
            .then((res) => {
                setSubCategoryModal(true)
                var data = common.decryptJWT(res.data.token, true)
                setSubCategory(data[0])
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const checkExist = (e, subcategory, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "catalog/subcategory_exist/" + id, { subcategory: subcategory, id: id })
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
                .post(apiUrl + "catalog/subcategory_exist/", { subcategory: subcategory })
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
                        .post(apiUrl + "catalog/subcategory_action", { type: type, ids: ids })
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
                            dispatch(getSubCategory())
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
                width: '9%',
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            classes: 'text-center',
            editable: false,
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
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            subcategoryEdit(row._id);
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
                                            .put(apiUrl + 'catalog/subcategory_delete/' + row._id)
                                            .then((res) => {
                                                NotificationManager.success(
                                                    res.data.message
                                                );
                                                dispatch(getSubCategory())
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
            editable: false,
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            dataField: "subcategory",
            text: "Sub Category",
            editable: false,
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            dataField: "description",
            text: "Description",
            editable: false,
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            text: "Image",
            formatter: (cell, row, index) => {
                return <img onError={common.addDefaultSrc} className="zoom" style={{ width: '50px', height: '50px' }} src={process.env.PUBLIC_URL + '/subcategory/' + row.filename} alt="" />;
            },
            classes: 'text-center',
            editable: false,
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
                        .put(apiUrl + "catalog/subcategory_sequence/" + row._id, { sequence: parseInt(newValue) })
                        .then(res => {
                            if (res.data.status) {
                                NotificationManager.success(
                                    row.subcategory + ' Sequence No Updated'
                                );
                            }
                            else {
                                NotificationManager.warning(
                                    res.data.message
                                );
                            }
                            dispatch(getSubCategory())
                        })
                        .catch((err) => {
                            NotificationManager.warning(
                                err.message
                            );
                        })
                }
                return true;
            },
            text: "Sequence",
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
        totalSize: subcategoryList.length
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

    let subcategory_title = <>
        Sub Categories List
        <Button
            variant="outline-success float-right"
            onClick={(e) => {
                setSubCategoryModal(true)
                setSubCategory({
                    _id: '',
                    category: '',
                    filename: '',
                    sequence: subcategoryList[(subcategoryList.length - 1)] ? (parseInt(subcategoryList[(subcategoryList.length - 1)].sequence) + 1) : 1,
                    description: '',
                    status: 1,
                })
                setImageUrl('')
                setFiles([])
                setIsExist(false)
            }}
        >
            Add Sub Category
        </Button>
    </>

    const handleSubmit = (values, { setSubmitting }) => {
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }
        fd.append('subcategory', values.subcategory);
        fd.append('description', values.description);
        fd.append('sequence', values.sequence);
        fd.append('status', values.status);

        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "catalog/subcategory/" + values._id, fd)
                .then(res => {
                    dispatch(getSubCategory())
                    setSubCategoryModal(false)
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post(apiUrl + "catalog/subcategory", fd)
                .then(res => {
                    dispatch(getSubCategory())
                    setSubCategoryModal(false)
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
                    { name: "Catalog", path: "/catalogue/subcategories" },
                    { name: "Sub Category" }
                ]}
            />
            <SimpleCard title={subcategory_title}>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={subcategoryList}
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
                                defaultSorted={defaultSorted}
                                loading={true}
                                headerClasses="datatable-header"
                                pagination={paginationFactory(paginationOptions)}
                                noDataIndication={"Sub Category is empty"}
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

            <Modal show={subcategoryModal} onHide={handleClose} backdrop="static" keyboard={false} centered={true}>
                <Formik
                    initialValues={{ ...subcategory }}
                    validationSchema={
                        yup.object().shape({
                            subcategory: yup.string().required("Sub Category is required"),
                            description: yup.string().required("Description is required"),
                            sequence: yup.string().required("Sequence is required"),
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
                                encType
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{(values._id) ? 'Edit' : 'Add'} Sub Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FormGroup className="col-md-12 mb-3 pl-0">
                                        <FormControl
                                            type="text"
                                            className="form-control col-md-12"
                                            name='subcategory'
                                            placeholder="Sub Category Name"
                                            value={values.subcategory}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                checkExist(e, e.target.value, values._id)
                                                setFieldValue('subcategory', e.target.value)
                                            }}
                                            onBlur={handleBlur}
                                            isInvalid={
                                                errors.subcategory &&
                                                touched.subcategory
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
                                    <FormGroup className="col-md-12 mb-3 pl-0">
                                        <FormControl
                                            type="text"
                                            className="form-control col-md-12"
                                            name='sequence'
                                            placeholder="Sequence No"
                                            value={values.sequence}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                                errors.sequence &&
                                                touched.sequence
                                            }
                                        />
                                    </FormGroup>

                                    <FormGroup className="col-md-12 mb-3 pl-0">
                                        <FormControl
                                            as="textarea"
                                            rows={3}
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
                                    <div className='col-md-12 mb-3 pl-0 form-group'>
                                        <div
                                            className={`${dragClass} dropzone d-flex justify-content-center align-items-center`}
                                            onDragEnter={(e) => handleDragStart(e)}
                                            onDragOver={(e) => handleDragOver(e)}
                                            onDrop={(e) => handleDrop(e)}
                                        >
                                            <span class="removeicon"
                                                style={{ display: (showBtn || (values.filename !== undefined)) ? 'block' : 'none', marginTop: '-155px' }}
                                                onClick={() => {
                                                    setShowBtn(false)
                                                    setFiles([])
                                                    setImageUrl('')
                                                    setFieldValue('filename', '')
                                                }}
                                            >x</span>
                                            {(isEmpty && (values.filename === '')) ? <span>Drop your files here</span> : <img onError={common.addDefaultSrc} src={(values.filename) ? process.env.PUBLIC_URL + '/subcategory/' + values.filename : imageUrl} alt="" />}
                                        </div>
                                        <div className="d-flex flex-wrap m-1">
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
                                            <div className="px-2"></div>
                                            <label htmlFor="upload-multiple-file">
                                                <Button
                                                    variant="outline-danger"
                                                    as="span"
                                                    onClick={() => {
                                                        setFiles([])
                                                        setImageUrl('')
                                                    }}
                                                >
                                                    <div className="flex flex-middle">
                                                        <span>Remove</span>
                                                    </div>
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                    {values._id &&
                                        <FormGroup className="col-md-12 mb-3 pl-0">
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
                                        </FormGroup>
                                    }
                                </Modal.Body>
                                <Modal.Footer>
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
    );
}

export default SubCategories;