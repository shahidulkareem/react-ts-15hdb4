import React, { useEffect } from "react";
import { Breadcrumb } from "@gull";
import { Button } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { SimpleCard } from "@gull";
import { useDispatch, useSelector } from 'react-redux';
import { getOfferList } from "app/redux/actions/OfferActions";
import swal from "sweetalert2";
import axios from 'axios';
import { apiUrl } from "app/config";
import { NotificationContainer, NotificationManager } from "react-notifications";

const ManageOffer = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOfferList())
    }, [dispatch])

    const offer = useSelector((state) => (state.offer.offerList))

    let sortableColumn = [
        {
            text: "S.No",
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            classes: 'text-center',
            sort: true
        },
        {
            text: "Action",
            formatter: (cell, row, index) => {
                return <>
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            props.offerEdit(row._id);
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
                                            .post(apiUrl + 'updateoffers', {
                                                id: row._id,
                                                status: 3
                                            })
                                            .then((res) => {
                                                NotificationManager.success(
                                                    'Offer Deleted Successfully'
                                                );
                                                dispatch(getOfferList())
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })
                                    }
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-trash'></i>
                    </Button>
                </>;
            },
            classes: 'text-center',
            sort: true
        },
        {
            dataField: "offercode",
            text: "Offer Code",
            sort: true
        },
        {
            dataField: "offertitle",
            text: "Offer Title",
            sort: true
        },
        {
            dataField: "validitydate",
            text: "Validity Date",
            sort: true
        },
        {
            dataField: "validitytype",
            text: "Validity Type",
            sort: true
        },
        {
            dataField: "offertype",
            text: "Offer Type",
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
        totalSize: offer.length
    };

    let { SearchBar } = Search;

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Offer", path: "/manage-offer" },
                    { name: "Manage Offer" }
                ]}
            ></Breadcrumb>
            <SimpleCard title="Offer List">
                <ToolkitProvider
                    striped
                    keyField="id"
                    data={offer}
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
                                pagination={paginationFactory(paginationOptions)}
                                noDataIndication={"Offer is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>
            </SimpleCard>
            <NotificationContainer />
        </>
    )
}

export default ManageOffer;