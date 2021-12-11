import React, { Component } from 'react';
import { Breadcrumb,SimpleCard} from "@gull";
import { rootPath } from 'app/config';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator"; 
import FilterComponent from "./filterComponent";
import {Button} from "react-bootstrap";
import ReactTooltip from "react-tooltip";

export const constData  = { enquiry_index_id:''}

const rowEvents = {onClick: (e, row, rowIndex) => {
    constData.enquiry_index_id=row.action;
}};

export class ViewEnquiryList extends Component {
    
    constructor(props){
        super(props);
        this.state={
            tableHead:[
                { dataField: 'sNo', text: 'S.No',headerStyle: { width: '7%',textAlign: 'center'},style:{} },
                { dataField: 'enquiryDate', text: 'Enq.Date',headerStyle: { width: '15%',textAlign: 'center'},style:{} },
                { dataField: 'enquiryNumber', text: 'Enq.No',headerStyle: { width: '11%',textAlign: 'center'},style:{} },
                { dataField: 'customerName', text: 'Customer Name',headerStyle: { width: '16%',textAlign: 'center'},style:{} },
                { dataField: 'phoneNumber', text: 'Phone No',headerStyle: { width: '12%',textAlign: 'center'},style:{} },
                { dataField: 'quantity', text: 'Qty',headerStyle: { width: '7%',textAlign: 'center'},style:{} },
                { dataField: 'total', text: 'Total',headerStyle: { width: '9%',textAlign: 'center'},style:{} },
                { dataField: 'status', text: 'Status',headerStyle: { width: '11%',textAlign: 'center'},style:{} },
                { dataField: 'action', text: 'Action',headerStyle: { width: '11%',textAlign: 'center'},
                    style:{},
                    formatter: (cell, row, index) => {
                        return <>
                            <Button
                                className='m-1 w-75'
                                variant='outline-primary'
                                data-tip data-for="viewEnquiry"
                                // onClick={() => this.nextPath(rootPath + "order/view-enquiry") }
                                onClick={() => this.viewEnquiry() }
                            >
                            <ReactTooltip id="viewEnquiry" place="bottom" effect="solid">
                                View Enquiry
                            </ReactTooltip>
                            <i className='text-18 ion-ios-eye'></i>
                            </Button>

                        </>;
                    },
                },
            ],
            tableBody:[
                { sNo: '...', enquiryDate: '...', enquiryNumber: '...' ,customerName:'...',phoneNumber:'...', quantity:"...", total:"...", status:"...",action:"..."},
                { sNo: '. .', enquiryDate: '...', enquiryNumber: '...' ,customerName:'...',phoneNumber:'...', quantity:"...", total:"...", status:"...",action:"..."},
            ],
            paginationOptions : {
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
                totalSize: ''
            },
        }
    }
    viewEnquiry() {
        setTimeout(() => {
            this.props.history.push({ 
                pathname: rootPath + "order/view-enquiry",
                state: constData.enquiry_index_id
               });
        }, 200);
        
    }
    
      

    // Get Table value From Filter Component
    handleData=(data)=>{
        this.setState({tableBody:[]});
        this.setState({tableBody:data.EnquiryListAll})
        console.log(this.state.paginationOptions.totalSize)
        this.setState({
        paginationOptions: {
            ...this.state.paginationOptions,
            totalSize: this.state.tableBody.length
        }
        });
        console.log(this.state.paginationOptions.totalSize)
    }

    render() {
        return (
        <div>
            <Breadcrumb
                routeSegments={[
                    { name: "Manage Orders", path:  rootPath + "order" },
                    { name: "View Enquiry List" }
                ]}
            />


            <SimpleCard title="Filter">
                <FilterComponent filterData={this.handleData} ></FilterComponent>
            </SimpleCard>

            <SimpleCard className="mt-4">  
                <div className="custom-table-design">        
                    <BootstrapTable 
                        bootstrap4
                        headerClasses="datatable-header"
                        className="table-responsive"
                        keyField="sNo"
                        data={this.state.tableBody}
                        columns={this.state.tableHead}
                        noDataIndication={"Product is empty"}
                        pagination={paginationFactory(this.state.paginationOptions)}
                        rowEvents={ rowEvents } 
                    />
                </div>  
            </SimpleCard>
        </div>
        );
    }
}

export default ViewEnquiryList;