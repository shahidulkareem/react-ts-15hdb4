import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import BootstrapTable from "react-bootstrap-table-next";
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
    Card
} from "react-bootstrap";

import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import swal from "sweetalert2";
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import * as common from "app/services/common";

const Attachment = (props) => {
    const [categoryModal, setCategoryModal] = useState(false);
    // const [isCheck, setIsCheck] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isExist, setIsExist] = useState(false);

    const [imageUrl, setImageUrl] = useState('')
    const [dragClass, setDragClass] = useState('');

    const [categoryList, setCategoryList] = useState([])
    // const [allIds, setAllIds] = useState([])
    const [files, setFiles] = useState([])
    const [category, setCategory] = useState({
        _id: '',
        category: '',
        description: '',
        filename: '',
        status: '',
    })

    useEffect(() => {
        setIsDisabled(false)
        get_category()
    }, [])

    const handleDragOver = event => {
        event.preventDefault();
        setDragClass("drag-shadow");
    };

    const handleDrop = event => {
        event.preventDefault();
        event.persist();

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
        let files = event.target.files;
        let list = [];
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
        setDragClass("drag-shadow")
    };

    const get_category = () => {
        axios.get(apiUrl + "catalog/category").then(res => {
            var data = common.decryptJWT(res.data.token, true)

            let categoryList = data?.map(
                ({ _id, category, filename, description, status }, ind) => ({
                    index: ind + 1,
                    _id,
                    category,
                    filename,
                    description,
                    status
                })
            );
            setCategoryList(categoryList);
        })
            .catch((err) => {
                NotificationManager.warning(
                    err.message
                );
            })
    }

    const handleClose = () => {
        setCategoryModal(false)
    }

    const categoryEdit = (id) => {
        axios
            .get(apiUrl + "catalog/category/" + id)
            .then((res) => {
                setCategoryModal(true)
                var data = common.decryptJWT(res.data.token, true)
                setCategory(data[0])
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const checkExist = (e, category, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "catalog/category_exist/" + id, { category: category, id: id })
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
                .post(apiUrl + "catalog/category_exist/", { category: category })
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
    let isEmpty = files.length === 0;

    let sortableColumn = [
        // {
        //     text: <label className="checkbox checkbox-primary">
        //         <input type="checkbox" onChange={() => checkAll()} />
        //         <span className="checkmark"></span>
        //     </label>,
        //     headerStyle: {
        //         width: '5%',
        //         textAlign: 'center'
        //     },
        //     formatter: (cell, row, index) => {
        //         setAllIds(...row._id)
        //         return <label className="checkbox checkbox-primary">
        //             <input key={index} id={index} name={index} type="checkbox" defaultChecked={isCheck} />
        //             <span className="checkmark"></span>
        //         </label>
        //     },
        // },
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
            sort: true
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
                            categoryEdit(row._id);
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
                                            .put(apiUrl + 'catalog/category_delete/' + row._id)
                                            .then((res) => {
                                                NotificationManager.success(
                                                    res.data.message
                                                );
                                                get_category()
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
            sort: true
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            dataField: "category",
            text: "Category Name",
            sort: true
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            dataField: "description",
            text: "Description",
            sort: true
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            text: "Category Image",
            formatter: (cell, row, index) => {
                return <img  onError={common.addDefaultSrc} style={{ width: '100px', height: '100px' }} src={process.env.PUBLIC_URL + '/category/' + row.filename} alt="" />;
            },
            classes: 'text-center',
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
            classes: 'text-center',
            sort: true
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
        totalSize: categoryList.length
    };


    let { SearchBar } = Search;

    let category_title = <>
        Categories List
        <Button
            variant="outline-success float-right"
            onClick={(e) => {
                setCategoryModal(true)
                setCategory({
                    _id: '',
                    category: '',
                    filename: '',
                    description: '',
                    status: 1,
                })
                setIsExist(false)
            }}
        >
            Add Category
        </Button>
    </>

    const handleSubmit = (values, { setSubmitting }) => {
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }
        fd.append('category', values.category);
        fd.append('description', values.description);
        fd.append('status', values.status);
        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "catalog/category/" + values._id, fd)
                .then(res => {
                    get_category()
                    setCategoryModal(false)
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post(apiUrl + "catalog/category", fd)
                .then(res => {
                    get_category()
                    setCategoryModal(false)
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
                    { name: "Catalogue", path: "/master/price-list" },
                    { name: "Categories" }
                ]}
            />
            <SimpleCard title={category_title}>
                <ToolkitProvider
                    striped
                    keyField='id'
                    data={categoryList}
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
                                loading={true}
                                headerClasses="datatable-header"
                                pagination={paginationFactory(paginationOptions)}
                                noDataIndication={"Category is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>
            </SimpleCard>

            <Card.Footer>
                <Button disabled={isDisabled} variant="outline-info m-1">Active</Button>
                <Button disabled={isDisabled} variant="outline-secondary m-1">In Active</Button>
                <Button disabled={isDisabled} variant="outline-danger m-1">Delete</Button>
            </Card.Footer>

            <Modal show={categoryModal} onHide={handleClose} backdrop="static" keyboard={false} centered={true}>
                <Formik
                    initialValues={{ ...category }}
                    validationSchema={
                        yup.object().shape({
                            category: yup.string().required("Category is required"),
                            description: yup.string().required("Description is required"),
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
                                    <Modal.Title>{(values._id) ? 'Edit' : 'Add'} Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FormGroup className="col-md-12 mb-3 pl-0">
                                        <FormControl
                                            type="text"
                                            className="form-control col-md-12"
                                            name='category'
                                            placeholder="Category Name"
                                            value={values.category}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                checkExist(e, e.target.value, values._id)
                                                setFieldValue('category', e.target.value)
                                            }}
                                            onBlur={handleBlur}
                                            isInvalid={
                                                errors.category &&
                                                touched.category
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
                                            {(isEmpty && (values.filename === '')) ? <span>Drop your files here</span> : <img  onError={common.addDefaultSrc} src={(values.filename) ? process.env.PUBLIC_URL + '/category/' + values.filename : imageUrl} alt="" />}
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
                                        <Button disabled={isExist} type="submit" variant="outline-primary m-1 text-capitalize">Submit</Button>
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

export default Attachment;