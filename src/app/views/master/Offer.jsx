import React, { useEffect, useState } from 'react'
import { Breadcrumb } from "@gull";
import { Formik } from "formik";
import * as yup from "yup";
import {
    Button,
    Form,
    FormControl,
    FormLabel,
    FormGroup
} from 'react-bootstrap';
// import { classList } from "@utils";
import axios from 'axios';
import { apiUrl } from 'app/config';
import { decryptJWT, num_valid } from 'app/services/common'
import MultiSelect from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as common from "app/services/common";
import { NotificationContainer, NotificationManager } from "react-notifications";

const AddOffer = (props) => {
    const [offer, setOffer] = useState({
        _id: '',
        offercode: '',
        offertitle: '',
        description: '',
        offerMode: '',
        offerdaysetting: [],
        product: [],
        partner: [],
        category: [],
        offerapplysetting: '',
        minordervalue: 0,
        maximumdiscount: '',
        offertype: '',
        offervalue: '',
        validitytype: "1",
        validitydate: new Date(),
        status: 1
    })

    const options = [
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
        { label: "Sunday", value: "7" },
    ];

    const [partnerData, setPartnerData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    let isNewOffer = (props.isNewOffer === undefined) ? props.match.params.id : props.isNewOffer

    useEffect(() => {
        axios.get(apiUrl + "partner/partner").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let partnerList = data.map((e, ind) => ({
                label: e.name,
                value: e._id
            }));
            setPartnerData(partnerList);
        }).catch((e) => {
            console.log(e.message);
        });

        axios.get(apiUrl + "catalog/category").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let categoryList = data.map((e, ind) => ({
                label: e.category,
                value: e._id
            }));
            setCategoryData(categoryList);
        }).catch((e) => {
            console.log(e.message);
        });

        if ((isNewOffer === undefined) || (isNewOffer !== '')) {
            axios
                .get(apiUrl + 'master/offer/' + isNewOffer)
                .then((res) => {
                    var data = decryptJWT(res.data.token, true)
                    setOffer({
                        _id: data[0]._id,
                        offercode: data[0].offercode,
                        offertitle: data[0].offertitle,
                        description: data[0].description,
                        offerMode: data[0].offermode,
                        partner: data[0].partner,
                        category: data[0].category,
                        product: data[0].product,
                        offerdaysetting: data[0].offerdaysetting,
                        offerapplysetting: data[0].offerapplysetting,
                        minordervalue: data[0].minordervalue,
                        maximumdiscount: data[0].maximumdiscount,
                        offertype: data[0].offertype,
                        offervalue: data[0].offervalue,
                        validitytype: data[0].validitytype,
                        validitydate: new Date(data[0].validitydate),
                        status: data[0].status
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    }, [props, isNewOffer])

    // UPLOAD
    const [dragClass, setDragClass] = useState('');
    const [files, setFiles] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [image, setImage] = useState('')
    const [isExist, setIsExist] = useState(false);

    const handleDragOver = event => {
        event.preventDefault();
        setDragClass("drag-shadow");
    };

    const handleDrop = event => {
        event.preventDefault();
        event.persist();
        console.log(image);
        let list = [];
        let reader = new FileReader();
        let files = event.dataTransfer.files;
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setImage(e.target.result)
        }
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
        let reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setImage(e.target.result)
        }
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

    const checkExist = (e, title, id) => {
        e.preventDefault()
        if (id) {
            axios
                .put(apiUrl + "master/offer_exist/" + id, { title: title, id: id })
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
                .post(apiUrl + "master/offer_exist/", { title: title })
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
        console.log(values);
        let fd = new FormData()
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }
        fd.append('offercode', values.offercode)
        fd.append('offertitle', values.offertitle)
        fd.append('description', values.description)
        fd.append('offermode', values.offerMode)
        fd.append('partner', JSON.stringify(values.partner))
        fd.append('category', JSON.stringify(values.category))
        fd.append('product', JSON.stringify(values.product))
        fd.append('offerdaysetting', JSON.stringify(values.offerdaysetting))
        fd.append('offerapplysetting', values.offerapplysetting)
        fd.append('minordervalue', values.minordervalue)
        fd.append('maximumdiscount', values.maximumdiscount)
        fd.append('offertype', values.offertype)
        fd.append('offervalue', values.offervalue)
        fd.append('validitytype', values.validitytype)
        fd.append('validitydate', values.validitydate)
        fd.append('status', values.status)

        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "master/offer/" + values._id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    props.offerManage()
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post(apiUrl + "master/offer", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    props.offerManage()
                    setSubmitting(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const getPartner = (category) => {
        var cat_ids = category.reduce((acc, curr) => `${acc}${curr.value},`, '').slice(0, -1);
        axios.post(apiUrl + "catalog/get_product", { cat_ids: cat_ids }).then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let productList = data.map((e, ind) => ({
                label: e.name,
                value: Object(e._id)
            }));
            setProductData(productList);
        }).catch((e) => {
            console.log(e.message);
        });

    }

    let isEmpty = files.length === 0;

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Offer", path: "/master/discounts-offer" },
                    { name: isNewOffer ? "Update Offer" : "Add Offer" }
                ]}
            ></Breadcrumb>
            <div className="row">
                <div className="col-md-12">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ ...offer }}
                        validationSchema={basicFormSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            isSubmitting
                        }) => {
                            return (
                                <Form
                                    className="needs-validation"
                                    onSubmit={handleSubmit}
                                    noValidate
                                    encType={`true`}
                                    autoComplete={false}
                                >
                                    <div className="card mb-4  rounded-0">
                                        <div className="card-body">
                                            <h4 className="font-weight-bold text-capitalize card-title">Offer Details</h4>
                                            <Form.Row>
                                                <div className="form-row col-md-8">
                                                    <FormGroup className="col-md-6 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">Offer Code <span className="m-1 text-danger">*</span></FormLabel>
                                                        <FormControl
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Offer Code"
                                                            name="offercode"
                                                            value={values.offercode}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            isInvalid={
                                                                errors.offercode &&
                                                                touched.offercode
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

                                                    <FormGroup className="col-md-6 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">Offer Title <span className="m-1 text-danger">*</span></FormLabel>
                                                        <FormControl
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom222"
                                                            placeholder="Offer Title"
                                                            value={values.offertitle}
                                                            onChange={(e) => {
                                                                checkExist(e, e.target.value, values._id)
                                                                setFieldValue('offertitle', e.target.value)
                                                            }}
                                                            // onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="offertitle"
                                                            required
                                                            isInvalid={
                                                                errors.offertitle &&
                                                                touched.offertitle
                                                            }
                                                        />
                                                    </FormGroup>

                                                    <FormGroup className="col-md-12 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">Description</FormLabel>
                                                        <FormControl
                                                            as="textarea"
                                                            className="form-control"
                                                            placeholder="Description"
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            isInvalid={
                                                                errors.description &&
                                                                touched.description
                                                            }
                                                        />
                                                    </FormGroup>
                                                </div>

                                                <div className='form-row col-md-4'>
                                                    <FormLabel className="font-weight-bold mx-5">Offer Image</FormLabel>
                                                    <div
                                                        className={`${dragClass} dropzone d-flex justify-content-center align-items-center mx-5`}
                                                        onDragEnter={handleDragStart}
                                                        onDragOver={handleDragOver}
                                                        onDrop={handleDrop}
                                                    >
                                                        {isEmpty ? <span>Drop your files here</span> : <img onError={common.addDefaultSrc} src={imageUrl} alt="" />}
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center mx-5">
                                                        <label htmlFor="upload-single-file">
                                                            <button
                                                                className="btn btn-outline-primary m-1"
                                                                type="button"
                                                            >
                                                                Upload
                                                            </button>
                                                        </label>
                                                        <input
                                                            style={{
                                                                marginLeft: '-97px',
                                                                position: 'relative',
                                                                zIndex: '999',
                                                                opacity: '0',
                                                                width: '98px'
                                                            }}
                                                            className="cursor-pointer"
                                                            onChange={handleFileSelect}
                                                            id="upload-single-file"
                                                            type="file"
                                                        />
                                                        <button
                                                            className="btn btn-outline-danger m-1 ml-3"
                                                            onClick={() => {
                                                                setFiles([])
                                                                setImageUrl('')
                                                            }}
                                                            type="button"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form.Row>

                                            <h4 className="font-weight-bold text-capitalize card-title">Offer Mode</h4>
                                            <Form.Row className="mb-4">
                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Offer Mode <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        placeholder="Offer Mode"
                                                        name="offerMode"
                                                        value={values.offerMode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        isInvalid={
                                                            errors.offerMode &&
                                                            touched.offerMode
                                                        }
                                                    >
                                                        <option value="">Select Offer Apply</option>
                                                        <option value="1">Partner</option>
                                                        <option value="2">Product</option>
                                                    </FormControl>
                                                </FormGroup>

                                                {parseInt(values.offerMode) === 1 &&
                                                    <FormGroup className="col-md-4 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">Partner <span className="m-1 text-danger">*</span></FormLabel>
                                                        {/* {errors.partner + '--' + touched.partner} */}
                                                        <MultiSelect
                                                            options={partnerData}
                                                            value={values.partner}
                                                            onChange={(e) => {
                                                                setFieldValue('partner', e)
                                                            }}
                                                            // className={classList({
                                                            //     "multi-chk-err": errors.partner || touched.partner,
                                                            // })}
                                                            // onBlur={handleBlur}
                                                            label={"Select Partner"}
                                                            name="partner"
                                                            // required={true}
                                                            // isInvalid={
                                                            //     errors.partner &&
                                                            //     touched.partner
                                                            // }
                                                        />
                                                    </FormGroup>
                                                }

                                                {parseInt(values.offerMode) === 2 && (
                                                    <>
                                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                                            <FormLabel className="font-weight-bold">Category <span className="m-1 text-danger">*</span></FormLabel>
                                                            <MultiSelect
                                                                options={categoryData}
                                                                value={values.category}
                                                                onChange={(e) => {
                                                                    getPartner(e)
                                                                    setFieldValue('category', e)
                                                                }}
                                                                // className={classList({
                                                                //     "multi-chk-err": errors.category || touched.category,
                                                                // })}
                                                                onBlur={handleBlur}
                                                                label={"Select category"}
                                                                name="category"
                                                                // required={true}
                                                                // isInvalid={
                                                                //     errors.category &&
                                                                //     touched.category
                                                                // }
                                                            />
                                                        </FormGroup>

                                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                                            <FormLabel className="font-weight-bold">Product <span className="m-1 text-danger">*</span></FormLabel>
                                                            <MultiSelect
                                                                options={productData}
                                                                value={values.product}
                                                                onChange={(e) => {
                                                                    setFieldValue('product', e)
                                                                }}
                                                                // className={classList({
                                                                //     "multi-chk-err": errors.product || touched.product,
                                                                // })}
                                                                onBlur={handleBlur}
                                                                label={"Select Product"}
                                                                name="product"
                                                                // required={true}
                                                                // isInvalid={
                                                                //     errors.product &&
                                                                //     touched.product
                                                                // }
                                                            />
                                                        </FormGroup>
                                                    </>
                                                )}
                                            </Form.Row>

                                            <h4 className="font-weight-bold text-capitalize card-title">Offer Settings</h4>

                                            <Form.Row>
                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Offer Day <span className="m-1 text-danger">*</span></FormLabel>
                                                    <MultiSelect
                                                        options={options}
                                                        value={values.offerdaysetting}
                                                        onChange={(e) => {
                                                            setFieldValue('offerdaysetting', e)
                                                        }}
                                                        // className={classList({
                                                        //     "multi-chk-err": (errors.offerdaysetting || touched.offerdaysetting) ? true : false,
                                                        // })}
                                                        onBlur={handleBlur}
                                                        label={"Select Offer Days"}
                                                        name="offerdaysetting"
                                                        // required={true}
                                                        // isInvalid={
                                                        //     errors.offerdaysetting &&
                                                        //     touched.offerdaysetting
                                                        // }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Offer Type <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        id="validationCustom202"
                                                        placeholder="Offer Apply"
                                                        name="offerapplysetting"
                                                        value={values.offerapplysetting}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        isInvalid={
                                                            errors.offerapplysetting &&
                                                            touched.offerapplysetting
                                                        }
                                                    >
                                                        <option value="">Select Offer Apply</option>
                                                        <option value="1">Every Day</option>
                                                        <option value="2">Offer Perday</option>
                                                        <option value="3">Offer Per Week</option>
                                                        <option value="4">Offer Per Month</option>
                                                        <option value="5">Till End Date - One Order</option>
                                                    </FormControl>
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Offer Type <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        id="validationCustom202"
                                                        name="offertype"
                                                        value={values.offertype}
                                                        onChange={(e) => {
                                                            setFieldValue("offervalue", '')
                                                            setFieldValue("offertype", e.target.value)
                                                        }}
                                                        onBlur={handleBlur}
                                                        required
                                                        isInvalid={
                                                            errors.offertype &&
                                                            touched.offertype
                                                        }
                                                    >
                                                        <option value="">Select Offer Type</option>
                                                        <option value="1">Percentage</option>
                                                        <option value="2">Flat</option>
                                                    </FormControl>
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Offer Value <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        className="form-control"
                                                        id="validationCustom202"
                                                        placeholder="EX: 10% or 100"
                                                        name="offervalue"
                                                        value={values.offervalue}
                                                        onChange={(e) => num_valid(e, setFieldValue, 'offervalue')}
                                                        pattern="^-?[0-9]\d*\.?\d*$"
                                                        onBlur={handleBlur}
                                                        maxLength={values.offertype === "1" ? 3 : 4}
                                                        required
                                                        isInvalid={
                                                            errors.offertype &&
                                                            touched.offertype
                                                        }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Minimum Order Value</FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        className="form-control"
                                                        id="validationCustom202"
                                                        placeholder="Minimum Order Value"
                                                        name="minordervalue"
                                                        value={values.minordervalue}
                                                        onBlur={handleBlur}
                                                        maxLength="5"
                                                        onChange={(e) => num_valid(e, setFieldValue, 'minordervalue')}
                                                        pattern="^-?[0-9]\d*\.?\d*$"
                                                        required
                                                        isInvalid={
                                                            errors.minordervalue &&
                                                            touched.minordervalue
                                                        }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Maximum Discount <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        className="form-control"
                                                        id="validationCustom202"
                                                        placeholder="Maximum Discount"
                                                        name="maximumdiscount"
                                                        value={values.maximumdiscount}
                                                        onBlur={handleBlur}
                                                        maxLength="5"
                                                        onChange={(e) => num_valid(e, setFieldValue, 'maximumdiscount')}
                                                        pattern="^-?[0-9]\d*\.?\d*$"
                                                        required
                                                        isInvalid={
                                                            errors.maximumdiscount &&
                                                            touched.maximumdiscount
                                                        }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-4 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Validity Type <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        id="validationCustom202"
                                                        placeholder="Validity Type"
                                                        name="validitytype"
                                                        value={values.validitytype}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}

                                                        isInvalid={
                                                            errors.validitytype &&
                                                            touched.validitytype
                                                        }
                                                    >
                                                        <option value="">Select Validity Type</option>
                                                        <option value="1">Lifetime</option>
                                                        <option value="2">Set End Period</option>
                                                    </FormControl>
                                                </FormGroup>

                                                {values.validitytype === "2" &&
                                                    <FormGroup className="col-md-4 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">Validity Date<span className="m-1 text-danger">*</span></FormLabel>
                                                        <DatePicker
                                                            selected={values.validitydate}
                                                            dateFormat="dd/MM/yyyy"
                                                            onChange={(date) => setFieldValue('validitydate', date)}
                                                            value={values.validitydate}
                                                            minDate={new Date()}
                                                            className="form-control col-md-12"
                                                            disabled={values.validitytype === "1" || values.validitytype === "" ? true : false}
                                                            showDisabledMonthNavigation={true}
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                errors.validitydate &&
                                                                touched.validitydate
                                                            }
                                                        />
                                                    </FormGroup>
                                                }

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
                                                    </FormGroup>
                                                }

                                            </Form.Row>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="float-right">
                                            <Button disabled={isExist} variant="outline-success m-1 text-capitalize" type="submit">{isNewOffer ? "Update" : "Submit"} </Button>
                                            <Button onClick={() => props.offerManage()} variant="outline-danger m-1 text-capitalize">Cancel</Button>
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
            <NotificationContainer />
        </>
    )
}

const basicFormSchema = yup.object().shape({
    offercode: yup.string().required("Offer Code is required"),
    offertitle: yup.string().required("Offer Title is required"),
    // offerdaysetting: yup.string().required("Offer Day Setting is required"),
    // product: yup.string().required("Product is required"),
    // partner: yup.string().required("Partner is required"),
    offerapplysetting: yup.string().required("Offer Apply Setting is required"),
    // minordervalue: yup.string().required("Min Order Value is required"),
    maximumdiscount: yup.string().required("Maximum Discount is required"),
    offertype: yup.string().required("Offer Type is required"),
    offervalue: yup.string().required("Offer Value is required"),
    validitytype: yup.string().required("Validity Type is required"),
    validitydate: yup.string().required("Validity Date is required"),
});

export default AddOffer;