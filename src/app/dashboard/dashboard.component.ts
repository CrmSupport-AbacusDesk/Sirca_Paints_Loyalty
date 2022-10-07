import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  
  loading_list:any = true;
  store:any;

  state_wise_plumber:any=[];
  complaint_state_wise:any=[];
  plumber_state_wise:any=[];
  dataSource : any;
  dataSource1:any=[];
  scan_coupon_count:any=[];
  data_Source:any;
  complaint:any;
  karigar_state_wise:any=[];
  stateWiseKarigar:any=[];
  
  constructor(public db: DatabaseService, private router:Router) 
  {
    this.get_counts();
  }
  
  ngOnInit() 
  {
    
  }
  
  get_counts() 
  {
    this.loading_list = true;
    
    this.db.post_rqst( '', 'dashboard/getDashboard').subscribe(d => 
      {
        this.loading_list = false;
        ////console.log(d);
        this.store = d.store;
this.coupon_code_graph();
//////////////////////////////////////////////////  state_wise_plumber ///////////////////
       
        for (let i=0;i < this.store.state_wise_plumber.length; i++)
        {
          this.plumber_state_wise.push({"label": this.store.state_wise_plumber[i].state,"value": this.store.state_wise_plumber[i].total_plumber});
        }
        
        this.data_Source = {
          "chart": {
            "xAxisName": "States",
            "yAxisName": "Plumber",
            "numberSuffix": " Plumber",
            "theme": "fusion",
          },
          "data": this.plumber_state_wise            
        };

//////////////////////////////////////////////////  state_wise_complaint ///////////////////


        for (let i=0;i < this.store.state_wise_complaint.length; i++)
        {
          this.complaint_state_wise.push({"label": this.store.state_wise_complaint[i].state,"value": this.store.state_wise_complaint[i].total_complaint});
        }
        
        this.complaint = {
          "chart": {
            "xAxisName": "States",
            "yAxisName": "Customer",
            "numberSuffix": " Complaint",
            "theme": "fusion",
          },
          "data": this.complaint_state_wise            
        };

      });
    }
    
          
          
        
          coupon_code_graph()
          {
   
                this.dataSource = {
                  chart: {
                    xaxisname: "",
                    yaxisname: "Total Number of Coupons and Complaint",
                    formatnumberscale: "1",
                    plottooltext:
                    "<b>$seriesName</b> total ",
                    theme: "fusion",
                    drawcrossline: "1"
                  },
                  categories: [{category : this.store.gday }],
                  dataset:[{seriesname:"Scanned Coupons", data:this.store.gscanned_coupon}, {seriesname:"Complaint", data:this.store.gcomplaint_count}]
                };

            }

            
            
            
            goto_offerPage()
            {
              this.router.navigate(["offer-list"]);
            }
            
            goto_offergiftPage()
            {
              this.router.navigate(['gift-list']);
            }
            
            goto_plumberPage()
            {
              this.router.navigate(['karigar-list']);
            } 
            
            goto_balance_coupon_page()
            {
              this.router.navigate(['coupon-code-list']);
            }
            
            goto_customerPage()
            {
              this.router.navigate(['customer-list']);
            }
            
            goto_productPage()
            {
              this.router.navigate(['products-list']);
            }
            goto_complaintPage()
            {
              // this.router.navigate(['complaints-list']);
              this.router.navigate(['complaints-list/service']);
            }
            
          }
          