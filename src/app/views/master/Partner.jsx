import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import MultiSelect from "react-multi-select-component";
import {
    Form,
    Card,
    Col,
    Row,
    FormGroup,
    FormControl,
    Button,
    FormLabel,
} from "react-bootstrap";
import * as common from "app/services/common";
import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { classList } from "@utils";

const Partner = (props) => {
    const [imageUrl, setImageUrl] = useState('')
    const [dragClass, setDragClass] = useState('');

    const [files, setFiles] = useState([])
    const [category_arr, setCategory_arr] = useState([]);

    const [partner, setPartner] = useState({
        _id: '',
        name: '',
        mobile: '',
        email: '',
        gstno: '',
        gsttype: 1,
        address1: '',
        address2: '',
        pincode: '',
        latitude: '',
        longitude: '',
        image: '',
        category: [],
        status: 1,
    })

    let isNewPartner = props.isNewPartner === undefined ? props.match.params.id : props.isNewPartner

    useEffect(() => {

        axios.get(apiUrl + "catalog/category").then(res => {
            var data = common.decryptJWT(res.data.token, true)
            let categoryList = data.map((e, ind) => ({
                label: e.category,
                value: e._id
            }));
            setCategory_arr(categoryList);
        })

        if (isNewPartner !== '') {
            axios
                .get(apiUrl + 'partner/partner/' + isNewPartner)
                .then((res) => {
                    var data = common.decryptJWT(res.data.token, true)
                    setPartner({
                        _id: data[0]._id,
                        name: data[0].name,
                        mobile: data[0].mobile,
                        email: data[0].email,
                        gstno: data[0].gstno,
                        gsttype: data[0].gsttype,
                        category: data[0].category,
                        address1: data[0].address1,
                        address2: data[0].address2,
                        pincode: data[0].pincode,
                        image: data[0].image,
                        latitude: data[0].latitude,
                        longitude: data[0].longitude,
                        status: data[0].status,
                    })
                })
                .catch((err) => {
                    console.log(err.message);
                })
        }
        else {
            getMyLocation();
        }
    }, [props, isNewPartner])

    const getMyLocation = () => {
        const location = window.navigator && window.navigator.geolocation;

        if (location) {
            location.getCurrentPosition(
                (position) => {
                    setPartner({
                        _id: '',
                        name: '',
                        mobile: '',
                        email: '',
                        gstno: '',
                        gsttype: 1,
                        address1: '',
                        address2: '',
                        pincode: '',
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        status: 1
                    })
                },
                (error) => {
                    setPartner({
                        _id: '',
                        name: '',
                        mobile: '',
                        email: '',
                        gstno: '',
                        gsttype: 1,
                        address1: '',
                        address2: '',
                        pincode: '',
                        latitude: '',
                        longitude: '',
                        status: 1
                    })
                }
            );
        }
    };

    const handleDragOver = event => {
        event.preventDefault();
        setDragClass("drag-shadow");
    };

    const handleDrop = event => {
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
        event.preventDefault()
        setDragClass("drag-shadow")
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('file', files[0].file);
        }

        fd.append('name', values.name);
        fd.append('mobile', values.mobile);
        fd.append('email', values.email);
        fd.append('gstno', values.gstno);
        fd.append('gsttype', values.gsttype);
        fd.append('address1', values.address1);
        fd.append('address2', values.address2);
        fd.append('pincode', values.pincode);
        fd.append('latitude', values.latitude);
        fd.append('longitude', values.longitude);
        fd.append('category', JSON.stringify(values.category));
        fd.append('status', values.status);

        if (values._id !== '') {
            fd.append('_id', values._id);
            axios
                .put(apiUrl + "partner/partner/" + values._id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    if (res.data.status) {
                        NotificationManager.success(
                            res.data.message
                        );
                        props.partnerManage()
                        setSubmitting(true)
                    }
                    else {
                        if (res.data.status) {
                            NotificationManager.warning(
                                res.data.message
                            );
                            setSubmitting(false)
                        }
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                })
        }
        else {
            axios
                .post(apiUrl + "partner/partner", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    if (res.data.status) {
                        NotificationManager.success(
                            res.data.message
                        );
                        props.partnerManage()
                        setSubmitting(true)
                    }
                    else {
                        if (res.data.status) {
                            NotificationManager.warning(
                                res.data.message
                            );
                            setSubmitting(false)
                        }
                    }
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                })
        }
    }

    let isEmpty = files.length === 0;

    return (
        <div>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Partner", path: "/master/manage-partner" },
                    { name: isNewPartner ? "Update Partner" : "Add Partner" }
                ]}
            ></Breadcrumb>

            <Formik
                initialValues={{ ...partner }}
                validationSchema={
                    yup.object().shape({
                        name: yup.string().required("Partner Name is required"),
                        mobile: yup.string().required("Mobile No is required"),
                        email: yup.string().required("E-Mail is required").email(),
                        // gstno: yup.string().required("GST No is required"),
                        gsttype: yup.string().required("GST Type is required"),
                        address1: yup.string().required("Address Line 1 is required"),
                        pincode: yup.string().required("Pincode is required"),
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
                            encType={true}
                        >
                            <Card className="rounded-0">
                                <Card.Header>
                                    <Card.Title className="m-0">Partner Details</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md="8">
                                            <Form.Row>
                                                <FormGroup className="col-md-6 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Partner Name<span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"

                                                        className="form-control col-md-12"
                                                        name='name'
                                                        placeholder="Partner Name"
                                                        value={values.name}
                                                        onChange={handleChange}
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

                                                <FormGroup className="col-md-6 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Mobile<span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        className="form-control col-md-12"
                                                        name='mobile'
                                                        placeholder="Mobile"
                                                        maxlength="10"
                                                        minlength='10'
                                                        onKeyPress={(e) => {
                                                            let value = e.target.value
                                                            value = value.replace(/[^0-9]/ig, '')
                                                            setFieldValue('mobile', value)
                                                        }}
                                                        value={values.mobile}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.mobile &&
                                                            touched.mobile
                                                        }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-6 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">E-Mail<span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        className="form-control col-md-12"
                                                        name='email'
                                                        placeholder="sample@mail.com"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.email &&
                                                            touched.email
                                                        }
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-6 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">Category</FormLabel>
                                                    <MultiSelect
                                                        options={category_arr}
                                                        value={values.category ? values.category : []}
                                                        onChange={(e) => {
                                                            setFieldValue('category', e)
                                                        }}
                                                        className={classList({
                                                            "multi-chk-err": errors.category || touched.category,
                                                        })}
                                                        onBlur={handleBlur}
                                                        label={"Select Category"}
                                                        name="category"
                                                    />
                                                </FormGroup>

                                                <FormGroup className="col-md-6 mb-3 pl-0">
                                                    <FormLabel className="font-weight-bold">GST Type <span className="m-1 text-danger">*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        className="form-control col-md-12"
                                                        name='gsttype'
                                                        value={values.gsttype}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={
                                                            errors.gsttype &&
                                                            touched.gsttype
                                                        }
                                                    >
                                                        <option value="">Select GST Types</option>
                                                        <option value="1">GST Registered - Regular</option>
                                                        <option value="2">GST Registered - Composition</option>
                                                        <option value="3">GST UnRegistered</option>
                                                        <option value="4">Consumer</option>
                                                    </FormControl>
                                                </FormGroup>

                                                {(values.gsttype === 1 || values.gsttype === 2 || values.gsttype === '1' || values.gsttype === '2') &&
                                                    <FormGroup className="col-md-6 mb-3 pl-0">
                                                        <FormLabel className="font-weight-bold">GST No <span className="m-1 text-danger">*</span></FormLabel>
                                                        <FormControl
                                                            type="text"
                                                            className="form-control col-md-12"
                                                            name='gstno'
                                                            placeholder="GST No"
                                                            value={values.gstno}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                errors.gstno &&
                                                                touched.gstno
                                                            }
                                                        />
                                                        Not yet GST registered? Register at <a href="https://www.gst.gov.in/" rel="noopener noreferrer" target="_blank">Here</a>
                                                    </FormGroup>
                                                }

                                                {values._id &&
                                                    <FormGroup className="col-md-6 mb-3 pl-0">
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
                                            </Form.Row>
                                        </Col>
                                        <Col md="4">
                                            <div className='col-md-12 m-0 pl-0 form-group'>
                                                <FormLabel className="font-weight-bold">Partner Image</FormLabel>
                                                <div
                                                    className={`${dragClass} dropzone d-flex justify-content-center align-items-center`}
                                                    onDragEnter={(e) => handleDragStart(e)}
                                                    onDragOver={(e) => handleDragOver(e)}
                                                    onDrop={(e) => handleDrop(e)}
                                                >
                                                    <span class="removeicon"
                                                        onClick={() => {
                                                            setFiles([])
                                                            setFieldValue('image', undefined)
                                                        }}
                                                    >x</span>
                                                    {(isEmpty && (values.image === undefined)) ? <span>Drop your files here</span> : <img onError={common.addDefaultSrc} style={{ width: '100%', height: '100px' }} src={(values.image) ? process.env.PUBLIC_URL + '/partner/' + values.image : imageUrl} alt="" />}
                                                </div>
                                                <div className="float-left col-md-9 pl-0">
                                                    <label htmlFor="upload-multiple-file">
                                                        <label htmlFor="upload-single-file">
                                                            <span className="upload-btn" as="span">
                                                                <div className="flex flex-middle">
                                                                    <span>Click here to upload file</span>
                                                                </div>
                                                            </span>
                                                        </label>
                                                        <input
                                                            className="d-none"
                                                            onChange={handleFileSelect}
                                                            id="upload-single-file"
                                                            type="file"
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                                {errors.file && (
                                                    <div className="text-danger mt-1 ml-2">
                                                        {errors.file}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Header>
                                    <Card.Title className="m-0">Address Details</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Row>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Address Line 1<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='address1'
                                                placeholder="Address Line 1"
                                                value={values.address1}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.address1 &&
                                                    touched.address1
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Address Line 2</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='address2'
                                                placeholder="Address Line 2"
                                                value={values.address2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.address2 &&
                                                    touched.address2
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Pincode<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='pincode'
                                                placeholder="Pincode"
                                                maxlength="6"
                                                minlength='6'
                                                value={values.pincode}
                                                onChange={handleChange}
                                                onKeyPress={(e) => {
                                                    let value = e.target.value
                                                    value = value.replace(/[^0-9]/ig, '')
                                                    setFieldValue('pincode', value)
                                                }}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.pincode &&
                                                    touched.pincode
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Latitude<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='latitude'
                                                placeholder="Latitude"
                                                value={values.latitude}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.latitude &&
                                                    touched.latitude
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Longitude<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='longitude'
                                                placeholder="Longitude"
                                                value={values.longitude}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.longitude &&
                                                    touched.longitude
                                                }
                                            />
                                        </FormGroup>
                                    </Form.Row>
                                </Card.Body>
                                <Card.Footer>

                                    <div className="float-right">
                                        <Button variant="outline-danger m-1 text-capitalize" onClick={() => props.partnerManage()}>Cancel</Button>
                                        <Button type="submit" variant="outline-primary m-1 text-capitalize">{(values._id ? 'Update' : 'Submit')}</Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Form>
                    )
                }}
            </Formik>
            <NotificationContainer />
        </div>
    )
}

export default Partner;