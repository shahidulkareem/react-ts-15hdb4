import React, { useEffect, useState } from "react";
import MultiSelect from "react-multi-select-component";
import { Breadcrumb, SimpleCard } from "@gull";

import {
    Form,
    FormLabel,
    FormGroup,
    FormControl,
    Button,
    Modal
} from "react-bootstrap";
import swal from "sweetalert2";
import { Formik, FieldArray } from "formik";
import axios from "axios";
import * as yup from "yup";
import { apiUrl, imagePath } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import * as common from "app/services/common";
import { useDispatch, useSelector } from "react-redux";
import { getGstList } from "app/redux/actions/CatalogActions";
import uuid from 'react-uuid'

const Product = (props) => {

    const dispatch = useDispatch()

    const gst = useSelector((state) => (state.catalog.gstList))

    const [showVariant, setShowVariant] = useState(false)
    const [isExist, setIsExist] = useState(false);

    const [category, setCategory] = useState([])
    const [subcategory, setSubCategory] = useState([])
    const [variant_ar, setVariant_ar] = useState([])
    const [images_ar, setImages] = useState([])
    const [files, setFiles] = useState([])

    const [isDefault_variant, setIsDefault_variant] = useState(0)
    const [isDefault_image, setIsDefault_image] = useState(0)

    const [product, setProduct] = useState({
        _id: '',
        name: '',
        category: [],
        subcategory: [],
        // images: [],
        description: '',
        type: '',
        price: '',
        packing_cost: '',
        tax: '',
        taxvalue: '',
        totalprice: '',
        min_qty: '',
        unit: '',
        is_inventory: 0,
        status: 1,
    })

    const [variant, setVariant] = useState({
        _id: '',
        groupname: '',
        details: [],
    })

    let isNewProduct = props.isNewProduct === undefined ? props.match.params.id : props.isNewProduct

    useEffect(() => {
        dispatch(getGstList())

        axios.get(apiUrl + "catalog/category").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let categoryList = data.map((e, ind) => ({
                label: e.category,
                value: e._id
            }));
            setCategory(categoryList);
        }).catch((e) => {
            console.log(e.message);
        });

        axios.get(apiUrl + "catalog/subcategory").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let subcategoryList = data.map((e, ind) => ({
                label: e.subcategory,
                value: e._id
            }));
            setSubCategory(subcategoryList);
        }).catch((e) => {
            console.log(e.message);
        });

        if (isNewProduct !== '') {
            axios
                .post(apiUrl + 'catalog/product_list_id/', { id: isNewProduct })
                .then((res) => {
                    var data = common.decryptJWT(res.data.token, true)
                    setProduct({
                        _id: data[0]._id,
                        name: data[0].name,
                        category: data[0].category,
                        subcategory: data[0].subcategory,
                        description: data[0].description,
                        type: data[0].type,
                        price: data[0].price,
                        packing_cost: data[0].packing_cost,
                        tax: data[0].tax,
                        taxvalue: data[0].taxvalue,
                        totalprice: data[0].totalprice,
                        min_qty: data[0].min_qty,
                        unit: data[0].unit,
                        is_inventory: data[0].is_inventory,
                        status: data[0].status,
                    })
                    setImages(data[0].images)
                    setVariant_ar(data[0].variant)
                })
                .catch((err) => {
                    console.log(err.message);
                })
        }

    }, [props, dispatch, isNewProduct])


    const handleFileSelect = event => {
        let files = event.target.files;

        let list = [];
        let i = 0;
        for (const iterator of files) {
            list.push({
                file: iterator,
                preview: URL.createObjectURL(event.target.files[i]),
                uploading: false,
                sequance: (i + 1),
                name: event.target.files[i].name,
                error: false,
            });
            i++;
        }
        setFiles([...list])
    };

    const handleSingleRemove = index => {
        let file = [...files];
        file.splice(index, 1);
        setFiles([...file])
    };

    const handleAllRemove = () => {
        setFiles([])
    };

    const handleClose = () => {
        setShowVariant(false)
    }

    const editVariant = (index) => {
        setVariant(variant_ar[index])
        setShowVariant(true)
    }

    const checkExist = (e, name, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "catalog/product_exist/" + id, { name: name, id: id })
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
                .post(apiUrl + "catalog/product_exist/", { name: name })
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

    const handleSubmit = (values, { setSubmitting }) => {
        // let image_ar = []
        // if (files) {
        //     for (var i = 0; i > files.length; i++) {
        //         image_ar.push({
        //             sequance: files[i].sequance,
        //             name: files[i].name
        //         })
        //     }
        // }

        // fd.append('file', multipleFile)
        // console.log();

        const fd = new FormData();

        if (files.length !== 0) {
            fd.append('file', files[0].file);
            fd.append('images', JSON.stringify({
                sequance: files[0].sequance,
                name: imagePath + '/product/' + files[0].name
            }));
        }

        fd.append('name', values.name);
        fd.append('category', JSON.stringify(values.category));
        fd.append('subcategory', JSON.stringify(values.subcategory));
        fd.append('description', values.description);
        fd.append('type', values.type);
        fd.append('price', values.price);
        fd.append('packing_cost', values.packing_cost);
        fd.append('tax', values.tax);
        fd.append('taxvalue', values.taxvalue);
        fd.append('totalprice', values.totalprice);
        fd.append('min_qty', values.min_qty);
        fd.append('unit', values.unit);
        fd.append('is_inventory', values.is_inventory);
        fd.append('status', values.status);
        fd.append('tracking', values.tracking);
        fd.append('minstock', values.minstock);
        fd.append('variant', JSON.stringify(variant_ar));

        if (values._id) {
            fd.append('_id', values._id);
            axios
                .post(apiUrl + "catalog/product_list_id", { id: values._id }, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    if (res.data.status) {
                        NotificationManager.success(
                            res.data.message
                        );
                        props.productManage()
                        setSubmitting(true)
                    }
                    else {
                        NotificationManager.warning(
                            res.data.message
                        );
                        setSubmitting(false)
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                    setSubmitting(false)
                })
        }
        else {
            axios
                .post(apiUrl + "catalog/product_add", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    if (res.data.status) {
                        NotificationManager.success(
                            res.data.message
                        );
                        props.productManage()
                        setSubmitting(true)
                    }
                    else {
                        NotificationManager.warning(
                            res.data.message
                        );
                        setSubmitting(false)
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                    setSubmitting(false)
                })
        }
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Product", path: "manage-product" },
                    { name: isNewProduct ? "Update Product" : "Add Product" }
                ]}
            ></Breadcrumb>

            <div className="row">
                <div className="col-md-12">
                    <Formik
                        initialValues={{ ...product }}
                        validationSchema={
                            yup.object().shape({
                                name: yup.string().required('Name is required'),
                                // category: yup.string().required('Category is required'),
                                // images: yup.array().of(
                                //     yup.object().shape({
                                //         sequance: yup.string().required("Sequance is required"),
                                //     })
                                // ).min(1, "Minimum 1 Images is required"),
                                type: yup.string().required('Type is required'),
                                price: yup.string().required('Price is required'),
                                packing_cost: yup.string().required('Packing Cost is required'),
                                tax: yup.string().required('Tax is required'),
                                taxvalue: yup.string().required('Tax Value is required'),
                                totalprice: yup.string().required('Total Price is required'),
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
                                    autoComplete="off"
                                    encType={`true`}
                                >
                                    <SimpleCard title="Product Details">
                                        <Form.Row>
                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Type</FormLabel>
                                                <FormControl
                                                    as="select"
                                                    name='type'
                                                    placeholder="Type"
                                                    value={values.type}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.type &&
                                                        touched.type
                                                    }
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="1">Non Inventory</option>
                                                    <option value="2">Inventory</option>
                                                    <option value="3">Service</option>
                                                </FormControl>
                                            </FormGroup>

                                            {(values.type === "2" || values.type === 2) &&
                                                <FormGroup className="col-md-4 mb-3 pl-0" style={{ top: '35px', left: '10px' }}>
                                                    <input
                                                        type="checkbox"
                                                        name='tracking'
                                                        checked={product.tracking}
                                                        value={values.tracking}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.tracking &&
                                                            touched.tracking
                                                        }
                                                    />&nbsp;&nbsp;&nbsp;
                                                    <FormLabel className="font-weight-bold">Turn On Inventory Tracking</FormLabel>
                                                </FormGroup>
                                            }

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Product Name<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    type="text"
                                                    name='name'
                                                    placeholder="Name"
                                                    value={values.name}
                                                    onChange={(e) => {
                                                        checkExist(e, e.target.value, values._id)
                                                        setFieldValue('name', e.target.value)
                                                    }}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.name &&
                                                        touched.name
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
                                                <FormLabel className="font-weight-bold">Category<span className="m-1 text-danger">*</span></FormLabel>
                                                <MultiSelect
                                                    options={category}
                                                    value={values.category ? values.category : []}
                                                    onChange={(e) => {
                                                        setFieldValue('category', e)
                                                    }}
                                                    // className={classList({
                                                    //     "multi-chk-err": errors.category || touched.category,
                                                    // })}
                                                    onBlur={handleBlur}
                                                    label={"Select Category"}
                                                    name="category"
                                                />
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Sub Category</FormLabel>
                                                <MultiSelect
                                                    options={subcategory}
                                                    value={values.subcategory ? values.subcategory : []}
                                                    // className={classList({
                                                    //     "multi-chk-err": errors.subcategory || touched.subcategory,
                                                    // })}
                                                    onChange={(e) => {
                                                        setFieldValue('subcategory', e)
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select SubCategory"}
                                                    name="subcategory"
                                                />
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Price<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    type="text"
                                                    name='price'
                                                    placeholder="Price"
                                                    value={values.price}
                                                    onChange={handleChange}
                                                    maxLength="6"
                                                    onKeyPress={(event) => {
                                                        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.price &&
                                                        touched.price
                                                    }
                                                />
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Packing Cost<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    type="text"
                                                    name='packing_cost'
                                                    placeholder="Packing Cost"
                                                    value={values.packing_cost}
                                                    onChange={handleChange}
                                                    maxLength="6"
                                                    onBlur={handleBlur}
                                                    onKeyPress={(event) => {
                                                        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    isInvalid={
                                                        errors.packing_cost &&
                                                        touched.packing_cost
                                                    }
                                                />
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">TAX<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    as="select"
                                                    name="tax"
                                                    value={values.tax}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.tax &&
                                                        touched.tax
                                                    }
                                                >
                                                    <option value="">Select GST</option>
                                                    {gst.map((data, index) =>
                                                        <option key={index} value={data.id}>{data.gstname}</option>
                                                    )}
                                                </FormControl>
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">TAX Value<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    type="text"
                                                    name='taxvalue'
                                                    placeholder="taxvalue"
                                                    value={values.taxvalue}
                                                    maxLength="6"
                                                    onChange={handleChange}
                                                    onKeyPress={(event) => {
                                                        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.taxvalue &&
                                                        touched.taxvalue
                                                    }
                                                />
                                            </FormGroup>

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Total Price<span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    type="text"
                                                    name='totalprice'
                                                    placeholder="totalprice"
                                                    value={values.totalprice}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    maxLength="6"
                                                    onKeyPress={(event) => {
                                                        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    isInvalid={
                                                        errors.totalprice &&
                                                        touched.totalprice
                                                    }
                                                />
                                            </FormGroup>

                                            {values.tracking &&
                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Min - Stock<span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        name='minstock'
                                                        placeholder="minstock"
                                                        value={values.minstock}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.minstock &&
                                                            touched.minstock
                                                        }
                                                    />
                                                </FormGroup>
                                            }

                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Description</FormLabel>
                                                <FormControl
                                                    as="textarea"
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
                                                    <FormLabel className="font-weight-bold">Status<span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
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
                                        </Form.Row>
                                    </SimpleCard>
                                    <div className="m-1 pt-3"></div>

                                    <SimpleCard title={
                                        <>
                                            Image Details
                                                <label htmlFor="upload-multiple-file" style={{ float: 'right', fontSize: '12px' }}>
                                                {files.length > 2 &&
                                                    <Button variant="outline-danger m-1 float-right" onClick={handleAllRemove}>Remove All</Button>
                                                }
                                                <label htmlFor="upload-single-file">
                                                    {/* <span className="upload-btn"> */}
                                                    <span className="btn btn-outline-info m-1">
                                                        <div className="flex flex-middle">
                                                            <span>Click here to upload file</span>
                                                        </div>
                                                    </span>
                                                    {/* </span> */}
                                                </label>
                                                <input
                                                    className="d-none"
                                                    onChange={handleFileSelect}
                                                    id="upload-single-file"
                                                    type="file"
                                                    // multiple={true}
                                                    accept="image/*"
                                                />
                                            </label>

                                        </>}>

                                        <table id="user_table" className="table table-bordered text-center w-100">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Sequance</th>
                                                    <th scope="col">Is Default</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {files?.map((item, index) => {
                                                    let { preview, name } = item
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>
                                                                <img
                                                                    onError={common.addDefaultSrc}
                                                                    src={preview}
                                                                    alt=""
                                                                    style={{ width: '200px', height: '200px' }}
                                                                    className="m-0 avatar-sm-table"
                                                                />
                                                            </td>
                                                            <td>
                                                                <FormGroup className="col-md-12 mb-3 pl-0">
                                                                    <FormControl
                                                                        name={`images[${index}].sequance`}
                                                                        type="text"
                                                                        // value={sequance}
                                                                        maxLength="3"
                                                                        onKeyPress={(event) => {
                                                                            if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        isInvalid={
                                                                            errors.images &&
                                                                            touched.images &&
                                                                            errors.images[index] &&
                                                                            touched.images[index] &&
                                                                            errors.images[index].sequance &&
                                                                            touched.images[index].sequance
                                                                        }
                                                                    />
                                                                    <FormControl
                                                                        type="hidden"
                                                                        name={`images[${index}].name`}
                                                                        value={name}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </FormGroup>
                                                            </td>
                                                            <td>
                                                                <FormGroup className="col-md-12 mb-3 pl-0">
                                                                    <input
                                                                        name={`images[${index}].is_default`}
                                                                        type="radio"
                                                                        checked={isDefault_image === index}
                                                                        onClick={() => setIsDefault_image(index)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        isInvalid={
                                                                            errors.images &&
                                                                            touched.images &&
                                                                            errors.images[index] &&
                                                                            touched.images[index] &&
                                                                            errors.images[index].is_default &&
                                                                            touched.images[index].is_default
                                                                        }
                                                                    />
                                                                </FormGroup>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    disabled={isDefault_image === index ? true : false}
                                                                    variant="outline-danger"
                                                                    onClick={() => {
                                                                        handleSingleRemove(index)
                                                                        if (isDefault_image > index) {
                                                                            setIsDefault_image(isDefault_image - 1)
                                                                        }
                                                                        setFieldValue(`images[${(index + 1)}].sequance`, (index - 1))
                                                                    }}
                                                                >Remove</Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {(images_ar.length > 0) && (
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td>
                                                            <img
                                                                onError={common.addDefaultSrc}
                                                                src={process.env.PUBLIC_URL + '/product/' + (images_ar.length > 0) ? images_ar[0].name : ''}
                                                                alt=""
                                                                style={{ width: '200px', height: '200px' }}
                                                                className="m-0 avatar-sm-table"
                                                            />
                                                        </td>
                                                        <td>
                                                            <FormGroup className="col-md-12 mb-3 pl-0">
                                                                <FormControl
                                                                    name={`images_ar[0].sequance`}
                                                                    type="text"
                                                                    value={images_ar[0].sequance}
                                                                    maxLength="3"
                                                                    onKeyPress={(event) => {
                                                                        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
                                                                            event.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.images &&
                                                                        touched.images &&
                                                                        errors.images[0] &&
                                                                        touched.images[0] &&
                                                                        errors.images_ar[0].sequance &&
                                                                        touched.images_ar[0].sequance
                                                                    }
                                                                />
                                                                <FormControl
                                                                    type="hidden"
                                                                    name={`images[${0}].name`}
                                                                    value={images_ar[0].name}
                                                                    onBlur={handleBlur}
                                                                />
                                                            </FormGroup>
                                                        </td>
                                                        <td>
                                                            <FormGroup className="col-md-12 mb-3 pl-0">
                                                                <input
                                                                    name={`images[${0}].is_default`}
                                                                    type="radio"
                                                                    checked={isDefault_image === 0}
                                                                    onClick={() => setIsDefault_image(0)}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.images &&
                                                                        touched.images &&
                                                                        errors.images[0] &&
                                                                        touched.images[0] &&
                                                                        errors.images_ar[0].is_default &&
                                                                        touched.images_ar[0].is_default
                                                                    }
                                                                />
                                                            </FormGroup>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                disabled={isDefault_image === 0 ? true : false}
                                                                variant="outline-danger"
                                                                onClick={() => {
                                                                    handleSingleRemove(0)
                                                                    if (isDefault_image > 0) {
                                                                        setIsDefault_image(isDefault_image - 1)
                                                                    }
                                                                    setFieldValue(`images[${(0 + 1)}].sequance`, (0 - 1))
                                                                }}
                                                            >Remove</Button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        {errors.images && (
                                            <small className="text-danger">
                                                {errors.images}
                                            </small>
                                        )}
                                    </SimpleCard>

                                    <div className="m-1 pt-3"></div>

                                    <SimpleCard title={<>Variant Details<Button onClick={() => {
                                        setVariant({
                                            _id: '',
                                            groupname: '',
                                            details: []
                                        })
                                        setShowVariant(true)
                                    }} variant="outline-info float-right">Add Variant</Button></>}>
                                        <FormGroup className="col-md-12 mb-3 pl-0">
                                            <table id="user_table" className="table table-bordered text-center w-100">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Action</th>
                                                        <th scope="col">Group Name</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Additional Price</th>
                                                        <th scope="col">Is Default</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {variant_ar?.map((item, index) => {
                                                        return item.details?.map((details, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    {i === 0 && (
                                                                        <>
                                                                            <td style={{ verticalAlign: 'middle' }} colSpan="1" rowSpan={variant_ar[index].details.length}><span className="font-weight-bold">{(index + 1)}</span></td>
                                                                            <td style={{ verticalAlign: 'middle' }} colSpan="1" rowSpan={variant_ar[index].details.length}>
                                                                                <Button
                                                                                    variant="outline-primary m-1 text-capitalize"
                                                                                    onClick={() => {
                                                                                        editVariant(index)
                                                                                    }}
                                                                                >
                                                                                    Edit
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline-danger m-1 text-capitalize"
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
                                                                                                    let new_arr = variant_ar.filter(function (item, i) {
                                                                                                        return i !== index
                                                                                                    })
                                                                                                    setVariant_ar(new_arr)
                                                                                                }
                                                                                            })
                                                                                    }}
                                                                                >
                                                                                    Remove
                                                                                </Button>
                                                                            </td>
                                                                            <td style={{ verticalAlign: 'middle' }} colSpan="1" rowSpan={variant_ar[index].details.length}><span className="font-weight-bold">{item.groupname}</span></td>
                                                                        </>
                                                                    )}
                                                                    <td>{details.name}</td>
                                                                    <td>{details.additional_price}</td>
                                                                    <td>{(details.is_default === 'on') ? 'Yes' : 'No'}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    })}
                                                </tbody>
                                            </table>
                                        </FormGroup>
                                    </SimpleCard>
                                    <div className="card-footer">
                                        <div className="float-right">
                                            <Button onClick={() => props.productManage()} variant="outline-danger m-1 text-capitalize">Cancel</Button>
                                            <Button disabled={isExist} type="submit" variant="outline-primary m-1 text-capitalize"> {(values._id ? 'Update' : 'Submit')}</Button>
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>

            <NotificationContainer />

            <Modal show={showVariant} onHide={handleClose} backdrop="static" keyboard={false} size="lg" className="right">
                <Formik
                    initialValues={{ ...variant }}
                    validationSchema={
                        yup.object().shape({
                            groupname: yup.string().required("Group Name is required"),
                            details: yup.array().of(
                                yup.object().shape({
                                    name: yup.string().required('Name is required'),
                                    additional_price: yup.string().required('Additional Price is required'),
                                })
                            ).min(2, "Minimum 2 variant detail is required"),
                        })
                    }
                    onSubmit={(values, { setSubmitting }) => {
                        if (values._id === '') {
                            variant_ar.push({ ...values })
                            variant_ar.filter((e) => e._id = uuid())

                            setVariant_ar(variant_ar)
                        }
                        else {
                            let i = variant_ar.findIndex((obj => obj._id === values._id));
                            variant_ar[i].groupname = values.groupname;
                            variant_ar[i]._id = values._id;
                            variant_ar[i].details = values.details;

                            setVariant_ar(variant_ar)
                        }

                        setVariant({
                            _id: '',
                            groupname: '',
                            details: []
                        })
                        setShowVariant(false)
                        setSubmitting(false)
                    }}
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
                                encType={`true`}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{(variant.groupname === '') ? 'Add' : 'Edit'} Variant Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FieldArray name="details">
                                        {arrayHelpers => (
                                            <div>
                                                {values.details.length > 1 && (
                                                    <Button
                                                        onClick={() => {
                                                            values.details.filter((e) => arrayHelpers.remove(e))
                                                        }}
                                                        variant="outline-danger float-right mt-4 mx-1"
                                                    >Remove All</Button>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        arrayHelpers.push({
                                                            name: "",
                                                            additional_price: "",
                                                            is_default: ","
                                                        })
                                                    }
                                                    variant="outline-info float-right mt-4 mx-1"
                                                >Add Detail</Button>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Group Name <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        name="groupname"
                                                        value={values.groupname}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.groupname &&
                                                            touched.groupname
                                                        }
                                                    />
                                                    <FormControl
                                                        type="hidden"
                                                        name="_id"
                                                        value={values._id}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </FormGroup>

                                                <div className="col-md-12 table-responsive p-0 w-100">
                                                    <table className="table table-hover mb-3">
                                                        <thead className="bg-gray-300">
                                                            <tr>
                                                                <th className="text-center" scope="col">#</th>
                                                                <th className="text-center" scope="col">Name</th>
                                                                <th className="text-center" scope="col">Additional Price</th>
                                                                <th className="text-center" scope="col">Is Default</th>
                                                                <th className="text-center" scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {values.details.map((details, ind) => (
                                                                <tr key={ind}>
                                                                    <th className="text-middle" scope="row">
                                                                        {ind + 1}
                                                                    </th>
                                                                    <td>
                                                                        <FormControl
                                                                            value={values.details[ind].name}
                                                                            name={`details[${ind}].name`}
                                                                            type="text"
                                                                            placeholder="Name"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={
                                                                                errors.details &&
                                                                                touched.details &&
                                                                                errors.details[ind] &&
                                                                                touched.details[ind] &&
                                                                                errors.details[ind].name &&
                                                                                touched.details[ind].name
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <FormControl
                                                                            value={values.details[ind].additional_price}
                                                                            name={`details[${ind}].additional_price`}
                                                                            type="number"
                                                                            placeholder="Additional Price"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={
                                                                                errors.details &&
                                                                                touched.details &&
                                                                                errors.details[ind] &&
                                                                                touched.details[ind] &&
                                                                                errors.details[ind].additional_price &&
                                                                                touched.details[ind].additional_price
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="text-middle">
                                                                        <input
                                                                            name={`details[${ind}].is_default`}
                                                                            type="radio"
                                                                            checked={isDefault_variant === ind}
                                                                            onClick={() => setIsDefault_variant(ind)}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={
                                                                                errors.details &&
                                                                                touched.details &&
                                                                                errors.details[ind] &&
                                                                                touched.details[ind] &&
                                                                                errors.details[ind].is_default &&
                                                                                touched.details[ind].is_default
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {values.details.length > 0 && (
                                                                            <Button
                                                                                disabled={isDefault_variant === ind ? true : false}
                                                                                onClick={() => {
                                                                                    arrayHelpers.remove(ind)
                                                                                    if (isDefault_variant > ind) {
                                                                                        setIsDefault_variant(isDefault_variant - 1)
                                                                                    }
                                                                                }}
                                                                                variant="outline-danger float-right m-1"
                                                                            >
                                                                                <i className="ion-ios-remove" />
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            onClick={() =>
                                                                                arrayHelpers.push({
                                                                                    name: "",
                                                                                    additional_price: "",
                                                                                    is_default: '',
                                                                                })}
                                                                            variant="outline-info float-right m-1"
                                                                        ><i className="ion-ios-add" /></Button>

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {values.details.length === 1 && (
                                                        <small className="text-danger">
                                                            Minimum 2 Variant Details is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="float-right">
                                        <Button variant="outline-danger m-1 text-capitalize" onClick={handleClose}>Cancel</Button>
                                        <Button type="submit" variant="outline-primary m-1 text-capitalize">Submit</Button>
                                    </div>
                                </Modal.Footer>
                            </Form>

                        )
                    }}
                </Formik>
            </Modal>
        </>
    )
}

export default Product