import React, { useEffect, useState } from 'react'
import { Breadcrumb } from "@gull";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { classList } from "@utils";
import axios from 'axios';
import { apiUrl } from 'app/config';
import { decryptJWT, num_valid } from 'app/services/common'
import { Link } from 'react-router-dom';
import MultiSelect from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as common from "app/services/common";

const AddOffer = (props) => {
    const [offer, setOffer] = useState({
        offercode: '',
        offertitle: '',
        description: '',
        restaurant: [],
        offerdaysetting: [],
        offerapplysetting: '',
        minordervalue: '',
        maximumdiscount: '',
        offertype: '',
        offervalue: '',
        validitytype: "1",
        validitydate: new Date(),
    })

    const [restaurant, setRestaurant] = useState([])

    const options = [
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
        { label: "Sunday", value: "7" },
    ];

    let isNewOffer = props.isNewOffer === undefined ? props.match.params.id : props.isNewOffer

    useEffect(() => {
        if (isNewOffer !== undefined) {
            get_partner(isNewOffer)
        }
        axios
            .post(apiUrl + 'partners_list')
            .then((res) => {
                setRestaurant(decryptJWT(res.data.token, true))
            })
            .catch((err) => {
                console.log(err);
            })
    }, [props, isNewOffer])

    const get_partner = (offer_id) => {
        axios
            .post(apiUrl + 'offers', {
                id: offer_id
            })
            .then((res) => {
                setOffer(res.data.data[0])
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // UPLOAD
    const [dragClass, setDragClass] = useState('');
    const [files, setFiles] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [image, setImage] = useState('')

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

    const handleSubmit = (values, { setSubmitting }) => {

    }

    let isEmpty = files.length === 0;

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Offer", path: isNewOffer ? `/offer/update-offer/${isNewOffer}` : "/offer/add-offer" },
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
                                    encType
                                >
                                    <div className="card mb-4  rounded-0">
                                        <div className="card-body">
                                            <h4 className="font-weight-bold text-capitalize card-title">Offer Details</h4>
                                            <div className="row">
                                                <div className="form-row col-md-8">
                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field":
                                                                !errors.offercode && touched.offercode,
                                                            "invalid-field":
                                                                errors.offercode && touched.offercode
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Code<span className="text-danger m-1">*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Offer Code"
                                                            name="offercode"
                                                            value={values.offercode}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Code is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field": touched.offertitle && !errors.offertitle,
                                                            "invalid-field": touched.offertitle && errors.offertitle
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Title<span className="text-danger m-1">*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom222"
                                                            placeholder="Offer Title"
                                                            value={values.offertitle}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="offertitle"
                                                            required
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Title is required</div>
                                                    </div>

                                                    <div
                                                        className={classList({
                                                            "col-md-12 mb-4": true,
                                                            "valid-field": touched.description && !errors.description,
                                                            "invalid-field": touched.description && errors.description
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Description<span className="text-danger m-1">*</span></label>
                                                        <textarea
                                                            className="form-control"
                                                            placeholder="Description"
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">Description is required</div>
                                                    </div>
                                                </div>
                                                <div className='form-row col-md-4'>
                                                    <div
                                                        className={`${dragClass} dropzone d-flex justify-content-center align-items-center mx-5`}
                                                        onDragEnter={handleDragStart}
                                                        onDragOver={handleDragOver}
                                                        onDrop={handleDrop}
                                                    >
                                                        {isEmpty ? <span>Drop your files here</span> : <img onError={common.addDefaultSrc} src={imageUrl} alt="" />}
                                                    </div>
                                                    <div class="d-flex justify-content-center align-items-center mx-5">
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
                                            </div>

                                            <h4 className="font-weight-bold text-capitalize card-title">Offer Settings</h4>
                                            <div className="row">
                                                <div className="form-row col-md-12">
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.restaurant && touched.restaurant,
                                                            "invalid-field":
                                                                errors.restaurant && touched.restaurant
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Restaurants<span className="text-danger m-1">*</span></label>
                                                        <MultiSelect
                                                            options={restaurant}
                                                            value={values.restaurant}
                                                            onChange={(e) => {
                                                                setFieldValue('restaurant', e)
                                                            }}
                                                            className={classList({
                                                                "multi-chk-err": errors.category || touched.category,
                                                            })}
                                                            onBlur={handleBlur}
                                                            label={"Select Restaurants"}
                                                            name="restaurant"
                                                            required={true}
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Day is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.offerdaysetting && touched.offerdaysetting,
                                                            "invalid-field":
                                                                errors.offerdaysetting && touched.offerdaysetting
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Day<span className="text-danger m-1">*</span></label>
                                                        <MultiSelect
                                                            options={options}
                                                            value={values.offerdaysetting}
                                                            onChange={(e) => {
                                                                setFieldValue('offerdaysetting', e)
                                                            }}
                                                            className={classList({
                                                                "multi-chk-err": errors.offerdaysetting || touched.offerdaysetting,
                                                            })}
                                                            onBlur={handleBlur}
                                                            label={"Select Offer Days"}
                                                            name="offerdaysetting"
                                                            required={true}
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Day is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.offerapplysetting && touched.offerapplysetting,
                                                            "invalid-field":
                                                                errors.offerapplysetting && touched.offerapplysetting
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Apply<span className="text-danger m-1">*</span></label>
                                                        <select
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Offer Apply"
                                                            name="offerapplysetting"
                                                            value={values.offerapplysetting}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                        >
                                                            <option value="">Select Offer Apply</option>
                                                            <option value="1">Every Day</option>
                                                            <option value="2">Offer Perday</option>
                                                            <option value="3">Offer Per Week</option>
                                                            <option value="4">Offer Per Month</option>
                                                            <option value="5">Till End Date - One Order</option>
                                                        </select>
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Apply is required</div>
                                                    </div>

                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.offertype && touched.offertype,
                                                            "invalid-field":
                                                                errors.offertype && touched.offertype
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Type<span className="text-danger m-1">*</span></label>
                                                        <select
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Offer Type"
                                                            name="offertype"
                                                            value={values.offertype}
                                                            onChange={() => {
                                                                setFieldValue("offervalue", '')
                                                            }}
                                                            onBlur={handleBlur}
                                                            required
                                                        >
                                                            <option value="">Select Offer Type</option>
                                                            <option value="1">Percentage</option>
                                                            <option value="2">Flat</option>
                                                        </select>
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Type is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.offervalue && touched.offervalue,
                                                            "invalid-field":
                                                                errors.offervalue && touched.offervalue
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Offer Value<span className="text-danger m-1">*</span></label>
                                                        <input
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
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Offer Value is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.minordervalue && touched.minordervalue,
                                                            "invalid-field":
                                                                errors.minordervalue && touched.minordervalue
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Minimum Order Value<span className="text-danger m-1">*</span></label>
                                                        <input
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
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Minimum Order Value is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.maximumdiscount && touched.maximumdiscount,
                                                            "invalid-field":
                                                                errors.maximumdiscount && touched.maximumdiscount
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Maximum Discount<span className="text-danger m-1">*</span></label>
                                                        <input
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
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Maximum Discount is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.validitytype && touched.validitytype,
                                                            "invalid-field":
                                                                errors.validitytype && touched.validitytype
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Validity Type<span className="text-danger m-1">*</span></label>
                                                        <select
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Validity Type"
                                                            name="validitytype"
                                                            value={values.validitytype}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                        >
                                                            <option value="">Select Validity Type</option>
                                                            <option value="1">Lifetime</option>
                                                            <option value="2">Set End Period</option>
                                                        </select>
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Validity Type is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-4 mb-3": true,
                                                            "valid-field":
                                                                !errors.validitydate && touched.validitydate,
                                                            "invalid-field":
                                                                errors.validitydate && touched.validitydate
                                                        })}
                                                    >
                                                        <label className="font-weight-bold">Validity Date<span className="text-danger m-1">*</span></label><br />
                                                        <DatePicker
                                                            selected={values.validitydate}
                                                            dateFormat="dd/MM/yyyy"
                                                            onChange={(date) => setFieldValue('validitydate', date)}
                                                            minDate={new Date()}
                                                            className="form-control col-md-12"
                                                            disabled={values.validitytype === "1" || values.validitytype === "" ? true : false}
                                                            showDisabledMonthNavigation={true}
                                                            onBlur={handleBlur}
                                                        />
                                                        {/* <input
                                                            type="date"
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Validity Date"
                                                            name="validitydate"
                                                            value={values.validitydate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            readOnly={false}
                                                            required={true}
                                                            disabled={values.validitytype === "1" || values.validitytype === "" ? true : false}
                                                        /> */}
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Validity Date is required</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <div className="float-right">
                                                <button className="btn btn-outline-success m-1 text-capitalize" type="submit">{isNewOffer ? "Update" : "Submit"} </button>
                                                {isNewOffer ?
                                                    <Link to="/offer/manage-offer" className="btn btn-outline-danger m-1 text-capitalize" >Cancel</Link>
                                                    :
                                                    <button className="btn btn-outline-danger m-1 text-capitalize" type="reset">Cancel</button>}
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </>
    )
}

const basicFormSchema = yup.object().shape({
    offercode: yup.string().required("Offer Code is required"),
    offertitle: yup.string().required("Offer Title is required"),
    description: yup.string().required("Description is required"),
    offerdaysetting: yup.string().required("Offer Day Setting is required"),
    offerapplysetting: yup.string().required("Offer Apply Setting is required"),
    minordervalue: yup.string().required("Min Order Value is required"),
    maximumdiscount: yup.string().required("Maximum Discount is required"),
    offertype: yup.string().required("Offer Type is required"),
    offervalue: yup.string().required("Offer Value is required"),
    validitytype: yup.string().required("Validity Type is required"),
    validitydate: yup.string().required("Validity Date is required"),
});

export default AddOffer;