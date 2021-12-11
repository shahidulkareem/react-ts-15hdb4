import React, { Component }  from 'react';
import { Breadcrumb,SimpleCard} from "@gull";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator"; 
import { rootPath } from 'app/config';
import axios from 'axios';
import { apiUrl } from "app/config";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import './orderStyle.css';
 


export class ViewEnquiry extends Component {
    constructor(props){
        super(props);
        this.state={
            ViewEnquiryId:(props.location && props.location.state)?props.location.state:'',
            viewEnquiryListData:'',
            ViewEnquiryDetail:'',
            tableHead:[
                { dataField: 'sNo', text: 'S.No',headerStyle: { width: '8%',textAlign: 'center'},style:{} },
                { dataField: 'itemName', text: 'Item Name',headerStyle: { width: '14%',textAlign: 'center'},style:{} },
                { dataField: 'varientName', text: 'Varient Name',headerStyle: { width: '20%',textAlign: 'center'},style:{} },
                { dataField: 'itemPrice', text: 'Price',headerStyle: { width: '18%',textAlign: 'center'},style:{} },
                { dataField: 'quantity', text: 'Quantity',headerStyle: { width: '20%',textAlign: 'center'},style:{} },
                { dataField: 'totalPrice', text: 'Total Price',headerStyle: { width: '20%',textAlign: 'center'},style:{} },
                ],
            tableBody:[
                {
                    sNo: "...",
                    itemName: "...",
                    itemPrice: "...",
                    quantity: "...",
                    totalPrice: "....",
                    varientName: "...."
                }
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

    /***
     *    Desc : Get table data on load
     */
    componentDidMount(){
     let requestData={
        member_id: '',
        from_date:'',
        to_date:'',
        status:'',
        id:this.state.ViewEnquiryId,
        enquiry_code:''
      };
      axios.post(apiUrl + 'order/list_enquiry_all',requestData )
      .then((res) => {
        this.setState({viewEnquiryListData:res.data.data[0]})
        this.setState({ViewEnquiryDetail: res.data.data[0].enquiry_details});
        this.setState({
            paginationOptions: {
                ...this.state.paginationOptions,
                totalSize: this.state.ViewEnquiryDetail.length
            }
        });
        console.log(this.state.viewEnquiryListData);
        

        // 
        this.state.ViewEnquiryDetail.map((el, i) => 
        {
            let dataFormat={
                sNo: i+1,
                itemName: el.item_name,
                itemPrice: el.item_price,
                quantity: el.quantity,
                totalPrice: el.total_price,
                varientName: el.varient_name
            }
            this.setState({tableBody: []});
            this.setState({
                tableBody: this.state.tableBody.concat(dataFormat)
            });
        })
        // 
        console.log(this.state.viewEnquiryListData);
      })
      .catch((err) => {
          console.log(err)
      }) 
      
    //   

    console.log(this.state.viewEnquiryListData);
    }

    render() {
        return (
            <div>
                <Breadcrumb
                    routeSegments={[
                        { name: "Manage Order", path:  rootPath + "order" },
                        { name: "View Enquiry List", path:  rootPath + "order/view-enquiry-list" },
                        { name: "View Enquiry" }
                    ]}
                />

                <SimpleCard title="Customer Details">
                <div className="row align-items-start">
                    <div className="col">
                    Customer Name : {this.state.viewEnquiryListData.member_name}
                    </div>
                    <div className="col">
                    Customer Contact No {this.state.viewEnquiryListData.contact_no}
                    </div>
                    <div className="col">
                    Enquiry Number : {this.state.viewEnquiryListData.code}
                    </div>
                </div>
                
        
        
                </SimpleCard>

                <SimpleCard className="mt-4" title="Enquiry Details">  
                    <div className="custom-table-design">        
                        <BootstrapTable 
                            bootstrap4
                            headerClasses="datatable-header"
                            className="table-responsive"
                            keyField="sNo"
                            data={this.state.tableBody}
                            columns={this.state.tableHead}
                            noDataIndication={"Sorry No Data Found"}
                            pagination={paginationFactory(this.state.paginationOptions)}
                        />
                    </div>  
                </SimpleCard>
            </div>
        )
    }
}
export default ViewEnquiry;