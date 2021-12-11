import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { classList } from "@utils";
import MultiSelect from "react-multi-select-component";
import TimeKeeper from 'react-timekeeper';
import axios from 'axios';
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { Button } from 'react-bootstrap'
import * as common from "app/services/common";

const NewPartner = (props) => {
    const [lunch, setLunch] = useState([]);
    const [dinner, setDinner] = useState([]);
    const [category_arr, setCategory_arr] = useState([]);
    const [category_list, setCategory_list] = useState([]);
    const [lst, setLst] = useState('0.00')
    const [luet, setLet] = useState('0.00')
    const [dst, setDst] = useState('0.00')
    const [det, setDet] = useState('0.00')
    const [avcnt, setAvcnt] = useState(5)
    const [lunchcnt, setLunchcnt] = useState(0)
    const [dinnercnt, setDinnercnt] = useState(0)
    const [showlst, setShowlst] = useState(false)
    const [showlet, setShowlet] = useState(false)
    const [showdst, setShowdst] = useState(false)
    const [showdet, setShowdet] = useState(false)
    const [dragClass, setDragClass] = useState('');
    const [files, setFiles] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [image, setImage] = useState('')
    const [partner, setPartner] = useState({
        partner_name: '',
        mobileno: "",
        email: "",
        gstin: '',
        address: {
            address1: '',
            address2: '',
            pincode: '',
            lat: '',
            long: ''
        },
        is_outlet: "",
        is_availability: "",
        is_brand: "",
        status: "",
    })

    let isNewPartner = props.isNewPartner === undefined ? props.match.params.id : props.isNewPartner

    useEffect(() => {
        getMyLocation();
        axios.post(apiUrl + "category").then(res => {
            let categoryList = res.data.results.map((e, ind) => ({
                label: e.category_name,
                value: e._id
            }));
            setCategory_arr(categoryList);
        })

        if (isNewPartner !== undefined) {
            axios
                .post(apiUrl + 'partner', {
                    id: isNewPartner
                })
                .then((res) => {
                    console.log(res.data.results[0]);
                    setPartner(res.data.results[0])
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [props, isNewPartner])

    const getMyLocation = () => {
        const location = window.navigator && window.navigator.geolocation;

        if (location) {
            location.getCurrentPosition(
                (position) => {
                    setPartner({
                        address: {
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                        }
                    })
                },
                (error) => {
                    setPartner({
                        address: {
                            lat: '',
                            long: ''
                        }
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
        event.preventDefault();
        event.persist();


        let files = event.dataTransfer.files;
        let list = [];
        let reader = new FileReader();
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
        // console.log(list);
        setFiles([...list]);
    };

    const handleDragStart = event => {
        setDragClass("drag-shadow")
    };

    const options = [
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
        { label: "Sunday", value: "7" },
    ];

    const handleSubmit = (values, { setSubmitting }) => {
        let cat_arr = [];
        const lunch_day = lunch.reduce((acc, curr) => `${acc}${curr.value},`, '')
        const dinner_day = dinner.reduce((acc, curr) => `${acc}${curr.value},`, '')
        category_list.map((e, i) =>
            cat_arr.push(e.value)
        )

        const partner_arr = Object.assign({}, values, {
            prepration_time: {
                default_time: avcnt,
                lunch_time: {
                    day: lunch_day.slice(0, -1),
                    from_time: lst,
                    end_time: luet,
                    time: lunchcnt
                },
                dinner_time: {
                    day: dinner_day.slice(0, -1),
                    from_time: dst,
                    end_time: det,
                    time: dinnercnt
                }
            },
            logo: image,
            category: [Object.assign({}, cat_arr)],
            status: "1",
        })

        axios
            .post(apiUrl + "addpartner", partner_arr, (res) => {
                NotificationManager.success(
                    'Partner Added Successfully'
                );

            })
            .catch((err) => {
                NotificationManager.success(
                    err
                );
            })
        // setUser(partner_arr);
        console.log(partner_arr);
    };

    let isEmpty = files.length === 0;

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Partner", path: "/partner" },
                    { name: "New Partner" }
                ]}
            />
            <div className="row">
                <div className="col-md-12">
                    <Formik
                        initialValues={{ ...partner }}
                        validationSchema={basicFormSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
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
                                        <div className="card-header">
                                            <h4>Partner Details</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="form-row col-md-8">
                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field":
                                                                !errors.partner_name && touched.partner_name,
                                                            "invalid-field":
                                                                errors.partner_name && touched.partner_name
                                                        })}
                                                    >
                                                        <label htmlFor="validationCustom202">Partner name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom202"
                                                            placeholder="Partner name"
                                                            name="partner_name"
                                                            value={values.partner_name}
                                                            onChange={handleChange}
                                                            onKeyPress={(e) => {
                                                                let value = e.target.value
                                                                value = value.replace(/[^A-Za-z]/ig, '')
                                                                setFieldValue('partner_name', value)
                                                            }}
                                                            required
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Partner name is required</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field": touched.mobileno && !errors.mobileno,
                                                            "invalid-field": touched.mobileno && errors.mobileno
                                                        })}
                                                    >
                                                        <label htmlFor="validationCustom222">Mobile No</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom222"
                                                            placeholder="Mobile No"
                                                            maxLength="10"
                                                            value={values.mobileno}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            onKeyPress={(e) => {
                                                                let value = e.target.value
                                                                value = value.replace(/[^0-9]/ig, '')
                                                                setFieldValue('mobileno', value)
                                                            }}
                                                            name="mobileno"
                                                            required
                                                        />
                                                        <div className="valid-feedback">Looks good!</div>
                                                        <div className="invalid-feedback">Mobile No is required</div>
                                                    </div>

                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field": touched.email && !errors.email,
                                                            "invalid-field": touched.email && errors.email
                                                        })}
                                                    >
                                                        <label htmlFor="validationCustom03">E-Mail ID</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom03"
                                                            placeholder="E-Mail ID"
                                                            name="email"
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">Please provide a valid E-Mail ID.</div>
                                                    </div>
                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field": touched.gstin && !errors.gstin,
                                                            "invalid-field": touched.gstin && errors.gstin
                                                        })}
                                                    >
                                                        <label htmlFor="validationCustom03">GST No</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="GST No"
                                                            name="gstin"
                                                            maxLength="15"
                                                            value={values.gstin}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            onKeyPress={(e) => {
                                                                let value = e.target.value
                                                                value = value.replace(/[^a-zA-Z0-9]/ig, '')
                                                                setFieldValue('gstin', value)
                                                            }}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">Please provide a valid GST No.</div>
                                                    </div>

                                                    <div
                                                        className={classList({
                                                            "col-md-6 mb-3": true,
                                                            "valid-field": touched.category && !errors.category,
                                                            "invalid-field": touched.category && errors.category
                                                        })}
                                                    >
                                                        <label htmlFor="validationCustom03">Category</label>
                                                        <MultiSelect
                                                            className={classList({
                                                                "multi-chk-err": errors.category || touched.category,
                                                            })}
                                                            options={category_arr}
                                                            value={category_list}
                                                            onChange={setCategory_list}
                                                            label={"Select Category"}
                                                        />
                                                        <div className="invalid-feedback">Please provide a valid Category.</div>
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
                                                    <div className="d-flex flex-wrap m-2 ml-5">
                                                        <label htmlFor="upload-single-file">
                                                            <Button variant="outline-primary" as="span">
                                                                <div className="flex flex-middle">
                                                                    <span>Upload</span>
                                                                </div>
                                                            </Button>
                                                        </label>
                                                        <input
                                                            className="d-none"
                                                            onChange={handleFileSelect}
                                                            id="upload-single-file"
                                                            type="file"
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
                                            </div>
                                        </div>

                                        <div className="card-header">
                                            <h4>Address Details</h4>
                                        </div>

                                        <div className="card-body">
                                            <div className="form-row">

                                                <div
                                                    className={classList({
                                                        "col-md-4 mb-3": true,
                                                        "valid-field": touched.address && errors.address && touched.address.address1 && !errors.address.address1,
                                                        "invalid-field": touched.address && errors.address && touched.address.address1 && errors.address.address1
                                                    })}
                                                >
                                                    <label>Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Address Line 1"
                                                        name="address.address1"
                                                        value={values.address.address1}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">Please provide a valid Address Line 1.</div>
                                                </div>
                                                <div
                                                    className={classList({
                                                        "col-md-4 mb-3": true,
                                                        "valid-field": touched.address && errors.address && touched.address.address2 && !errors.address.address2,
                                                        "invalid-field": touched.address && errors.address && touched.address.address2 && errors.address.address2
                                                    })}
                                                >
                                                    <label>Address Line 2</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Address Line 2"
                                                        name="address.address2"
                                                        value={values.address.address2}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">Please provide a valid Address Line 2.</div>
                                                </div>
                                                <div
                                                    className={classList({
                                                        "col-md-4 mb-3": true,
                                                        "valid-field": touched.address && errors.address && touched.address.pincode && !errors.address.pincode,
                                                        "invalid-field": touched.address && errors.address && touched.address.pincode && errors.address.pincode
                                                    })}
                                                >
                                                    <label>Pincode</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Pincode"
                                                        name="address.pincode"
                                                        maxLength="6"
                                                        value={values.address.pincode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        onKeyPress={(e) => {
                                                            let value = e.target.value
                                                            value = value.replace(/[^0-9]/ig, '')
                                                            setFieldValue('address.pincode', value)
                                                        }}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">Please provide a valid Pincode.</div>
                                                </div>
                                                <div
                                                    className={classList({
                                                        "col-md-4 mb-3": true,
                                                        "valid-field": touched.address && errors.address && touched.address.lat && !errors.address.lat,
                                                        "invalid-field": touched.address && errors.address && touched.address.lat && errors.address.lat
                                                    })}
                                                >
                                                    <label>Latitude</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Latitude"
                                                        name="address.lat"
                                                        value={values.address.lat}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required />
                                                    <div className="invalid-feedback">Please provide a valid Latitude.</div>
                                                </div>
                                                <div
                                                    className={classList({
                                                        "col-md-4 mb-3": true,
                                                        "valid-field": touched.address && errors.address && touched.address.long && !errors.address.long,
                                                        "invalid-field": touched.address && errors.address && touched.address.long && errors.address.long
                                                    })}
                                                >
                                                    <label>Longitude</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Longitude"
                                                        name="address.long"
                                                        value={values.address.long}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">Please provide a valid Longitude.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-header">
                                            <h4>Preparation Time</h4>
                                        </div>

                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="col-md-8 mb-3">
                                                    <p>Avarage Preparation Time</p>
                                                    <span>Tell us the time you usally take to prepare an order</span>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Preparation Time</label>
                                                    <div className="form-control col-md-12 text-center">
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-right ml-1 mt-1 cursor-pointer ion-md-add"
                                                            onClick={() => {
                                                                if (avcnt < 60) {
                                                                    setAvcnt(avcnt + 5)
                                                                }
                                                            }}
                                                        />
                                                        <span className='font-weight-bold text-uppercase'>{avcnt}</span>&nbsp;<span className='font-weight-bold text-uppercase'>minutes</span>
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-left ml-1 mt-1 cursor-pointer ion-md-remove"
                                                            onClick={() => {
                                                                if (avcnt > 5) {
                                                                    setAvcnt(avcnt - 5)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="valid-feedback">Looks good!</div>
                                                    <div className="invalid-feedback">Partner name is required</div>
                                                </div>
                                            </div>
                                            <div className="mt-3 mb-4 border-top"></div>
                                            <div className="form-row">
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="validationCustom202">Lunch Rush Hours</label>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Days</label>
                                                    <MultiSelect
                                                        options={options}
                                                        value={lunch}
                                                        onChange={setLunch}
                                                        className={classList({
                                                            "multi-chk-err": errors.lunch || touched.lunch,
                                                        })}
                                                        label={"Select Days"}
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Time</label>
                                                    {showlst &&
                                                        <TimeKeeper
                                                            starttime={lst}
                                                            onChange={(newTime) => setLst(newTime.formatted24)}
                                                            onDoneClick={() => setShowlst(false)}
                                                            switchToMinuteOnHourSelect
                                                        />
                                                    }
                                                    {showlet &&
                                                        <TimeKeeper
                                                            endtime={luet}
                                                            onChange={(newTime) => {
                                                                if (lst !== newTime.formatted24) {
                                                                    setLet(newTime.formatted24)
                                                                }
                                                                else {
                                                                    alert('Select Valid Time')
                                                                }
                                                            }}
                                                            onDoneClick={(newTime) => {
                                                                if (lst !== newTime.formatted24) {
                                                                    setShowlet(false)
                                                                }
                                                                else {
                                                                    alert('Select Valid Time')
                                                                }
                                                            }}
                                                            switchToMinuteOnHourSelect
                                                        />
                                                    }
                                                    <div
                                                        className={classList({
                                                            'b-1 col-md-12 form-control text-center': true,
                                                        })}
                                                    >
                                                        <span className="cursor-pointer float-left pl-1" onClick={() => {
                                                            setShowlst(true)
                                                        }}>{lst}</span>
                                                        <span className='font-weight-bold text-uppercase'>to</span>
                                                        <span className="cursor-pointer float-right pr-1" onClick={() => {
                                                            setShowlet(true)
                                                        }}>{luet}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Preparation Time</label>
                                                    <div className="form-control col-md-12 text-center">
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-right ml-1 mt-1 cursor-pointer ion-md-add"
                                                            onClick={() => {
                                                                if (lunchcnt < 60) {
                                                                    setLunchcnt(lunchcnt + 5)
                                                                }
                                                            }}
                                                        />
                                                        <span className='font-weight-bold text-uppercase'>{lunchcnt}</span>&nbsp;<span className='font-weight-bold text-uppercase'>minutes</span>
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-left ml-1 mt-1 cursor-pointer ion-md-remove"
                                                            onClick={() => {
                                                                if (lunchcnt > 0) {
                                                                    setLunchcnt(lunchcnt - 5)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 mb-4 border-top"></div>
                                            <div className="form-row">
                                                <div className="col-md-12 mb-2">
                                                    <label htmlFor="validationCustom202">Dinner Rush Hours</label>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Days</label>
                                                    <MultiSelect
                                                        options={options}
                                                        value={dinner}
                                                        onChange={setDinner}
                                                        className={classList({
                                                            "multi-chk-err": errors.dinner || touched.dinner,
                                                        })}
                                                        label={"Select Days"}
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Time</label>
                                                    {showdst &&
                                                        <TimeKeeper
                                                            starttime={dst}
                                                            onChange={(newTime) => setDst(newTime.formatted24)}
                                                            onDoneClick={() => setShowdst(false)}
                                                            switchToMinuteOnHourSelect
                                                        />
                                                    }
                                                    {showdet &&
                                                        <TimeKeeper
                                                            endtime={det}
                                                            onChange={(newTime) => {
                                                                if (dst !== newTime.formatted24) {
                                                                    setDet(newTime.formatted24)
                                                                }
                                                                else {
                                                                    alert('Select Valid Time')
                                                                }
                                                            }}
                                                            onDoneClick={(newTime) => {
                                                                if (dst !== newTime.formatted24) {
                                                                    setShowdet(false)
                                                                }
                                                                else {
                                                                    alert('Select Valid Time')
                                                                }
                                                            }}
                                                            switchToMinuteOnHourSelect
                                                        />
                                                    }
                                                    <div
                                                        className={classList({
                                                            'b-1 col-md-12 form-control text-center': true,
                                                        })}
                                                    >
                                                        <span className="cursor-pointer float-left pl-1" onClick={() => {
                                                            setShowdst(true)
                                                        }}>{dst}</span>
                                                        <span className='font-weight-bold text-uppercase'>to</span>
                                                        <span className="cursor-pointer float-right pr-1" onClick={() => {
                                                            setShowdet(true)
                                                        }}>{det}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="validationCustom202">Preparation Time</label>
                                                    <div className="form-control col-md-12 text-center">
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-right ml-1 mt-1 cursor-pointer ion-md-add"
                                                            onClick={() => {
                                                                if (dinnercnt < 60) {
                                                                    setDinnercnt(dinnercnt + 5)
                                                                }
                                                            }}
                                                        />
                                                        <span className='font-weight-bold text-uppercase'>{dinnercnt}</span>&nbsp;<span className='font-weight-bold text-uppercase'>minutes</span>
                                                        <i
                                                            style={{ width: '25px' }}
                                                            className="float-left ml-1 mt-1 cursor-pointer ion-md-remove"
                                                            onClick={() => {
                                                                if (dinnercnt > 0) {
                                                                    setDinnercnt(dinnercnt - 5)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <div className="float-right">
                                                <button className="btn btn-outline-success m-1 text-capitalize" type="submit">Submit</button>
                                                <button
                                                    className="btn btn-outline-danger m-1 text-capitalize"
                                                    type="reset"
                                                    onClick={() => {
                                                        setLunch([])
                                                        setDinner([])
                                                        setLst('0.00')
                                                        setLet('0.00')
                                                        setDst('0.00')
                                                        setDet('0.00')
                                                        setAvcnt(5)
                                                        setLunchcnt(5)
                                                        setDinnercnt(5)
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
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
    partner_name: yup.string().strict().trim().matches(/^[a-zA-Z]+$/, "Must be only digits").required("Partner Name is required"),
    mobileno: yup.string().strict().trim().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Must be only digits").min(10, 'Enter Valid Number').max(10, 'Enter Valid Number').required('Mobile no is required'),
    email: yup.string().strict().required("Email is required").email(),
    gstin: yup.string().strict().trim().matches(/^[a-zA-Z0-9.]+$/, "Must be only digits").required("GST No is required"),
    address: yup.object().shape({
        address1: yup.string().strict().required("Address Line 1 is required"),
        address2: yup.string().strict().required("Address Line 2 is required"),
        pincode: yup.string().strict().trim().matches(/^[0-9]+$/, "Must be only digits").min(6, 'Must be exactly 6 digits').max(6, 'Must be exactly 5 digits').required('is required'),
    }),
});

export default NewPartner;