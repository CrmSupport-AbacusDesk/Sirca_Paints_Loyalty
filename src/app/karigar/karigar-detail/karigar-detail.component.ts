import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';
import {ChangeKarigarStatusComponent} from '../../karigar/change-karigar-status/change-karigar-status.component';
import { KarigarBalanceModelComponent } from '../../karigar/karigar-balance-model/karigar-balance-model.component';
import * as moment from 'moment';
import {ChangeStatusComponent} from '../../gift-gallery/change-status/change-status.component';
import { AddCouponPointsComponent } from 'src/app/add-coupon-points/add-coupon-points.component';


@Component({
    selector: 'app-karigar-detail',
    templateUrl: './karigar-detail.component.html',
})
export class KarigarDetailComponent implements OnInit {
    constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
        public dialog: DialogComponent, public alrt: MatDialog ) {}
        karigar_gift: any = [];
        
        karigar_id;
        loading_list = false;
        total_reedam = 0;
        reedam: any = [];
        reedam_all: any = 0;
        reedam_pending: any = 0;
        reedam_approved: any = 0;
        reedam_reject: any = 0;
        reedam_verified: any = 0;
        filtering: any = false;
        filter: any = {};
        all_gifts:any =[];
        last_page: number ;
        current_page = 1;
        search: any = '';
        mindate: any = new Date();
        mode: any = 1;
        getData: any = {};
        remark: any = [];

        total_points: any = 0;
        // gift_points: any = 0;
        
        coupandetail: any = [];
        
        coupon_scanned_count: any = 0;
        scanned_coupon: any = [];
        
        complaint: any = [];
        complaint_total: any = 0;
        
        // submit_manual_permission() {
        //   this.loading_list = true;
        
        //   this.db.post_rqst({ 'manual' : this.getData  }, 'karigar/manual_permission')
        //   .subscribe(d => {
        //     //console.log(d);
        //     this.loading_list = false;
        //     this.dialog.warning('Permission set Successfully!');
        
        //     this.getKarigarDetails();
        //   });
        // }
        
        
        
        step = 1;
        complaint_status: any = {};
        karigar_gifcount: any = [];
        karigar: any = [];
        
        ngOnInit() {
            this.route.params.subscribe(params => {
                
                console.log(params);
                
                console.log((params.karigar_id.toString()).length);
                
                if ((params.karigar_id.toString()).length > 3) {
                    
                    this.karigar_id = this.db.crypto(params.karigar_id, false);
                    
                } else {
                    
                    this.karigar_id = params.karigar_id;
                }
                
                console.log(this.karigar_id);
                if (this.karigar_id) {
                    this.getKarigarDetails();
                    this.getScannedList();
                }
            });
        }
        
        toInt(i) {
            return parseInt(i);
        }
        openDatePicker(picker: MatDatepicker<Date>) {
            picker.open();
        }
        edit() {
            this.router.navigate(['/karigar-add/' + this.db.crypto(this.karigar_id)]);
        }
        getKarigarDetails() {
            this.loading_list = true;
            this.db.post_rqst(  {karigar_id: this.karigar_id}, 'karigar/karigarDetail')
            .subscribe(d => {
                this.loading_list = false;
                console.log(d);
                
                if (d.karigar.profile == 'Array') {
                    
                    d.karigar.profile = ''; 
                }
                this.getData = d.karigar;
                this.remark = this.getData.remark_history;

                console.log(this.getData);
                
                // this.total_points = parseInt(this.getData.balance_point) + parseInt(this.getData.referal_point_balance);
                
                this.total_points = parseInt(this.getData.total_scanned_points) + parseInt(this.getData.referal_point_balance) + parseInt(this.getData.reg_points);
            });
        }
        
        karigarsSatus() {
            if ( this.getData.status == 'Reject' ||  this.getData.status == 'Suspect' || this.getData.status == 'Verified' || this.getData.status == 'Pending') {
                this.model();
                return;
            }
        }
        
        model() {
            const dialogRef = this.alrt.open(ChangeKarigarStatusComponent, {
                width: '500px',
                height: '500px',
                
                data: {
                    karigar_id:  this.getData.id ,
                    status    :  this.getData.status,
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if ( result ) {
                    this.getKarigarDetails();
                }
                if ( result ) {
                    this.getKarigarDetails();
                } else {
                    this.getKarigarDetails();
                }
            });
            
        }
        couponDetail() {
            this.loading_list = true;
            this.db.post_rqst({ karigar_id: this.karigar_id }, 'karigar/coupanDetail')
            .subscribe(d => {
                this.loading_list = false;
                // console.log(d);
                this.coupandetail = d.coupan;
                // console.log( this.coupandetail );
            });
        }
        
        redirect_previous1() {
            this.current_page--;
            this.getScannedList();
        }
        redirect_next1() {
            if (this.current_page < this.last_page) { this.current_page++; } else { this.current_page = 1; }
            this.getScannedList();
        }
        
        redirect_previous2() {
            this.current_page--;
            this.getComplaintsList();
        }
        redirect_next2() {
            if (this.current_page < this.last_page) { this.current_page++; } else { this.current_page = 1; }
            this.getComplaintsList();
        }
        
        
        
        
        
        redirect_previous3() {
            this.current_page--;
            this.getScannedList1();
        }
        
        
        referal_logs: any = [];
        totalReferal: number = 0;
        totalEarnPoint: number = 0;
        
        resetCurrentPage = (type): void => {
            this.current_page = 1;
            if (type == "scanned") {
                this.getScannedList();
            } else if (type == "complaint") {
                this.getComplaintsList();
            } else if (type == "referal") {
                this.getReferal();
            } else if (type == "redeem") {
                this.getRedeemList();
            }
        };
        

        getRedeemList() {
            this.loading_list = true;
            this.filter.date = this.filter.date ? this.db.pickerFormat(this.filter.date): "";
            this.filter.start_date = this.filter.start_date? this.db.pickerFormat(this.filter.start_date): "";
            this.filter.end_date = this.filter.end_date? this.db.pickerFormat(this.filter.end_date): "";
            this.filter.karigar_id = this.karigar_id;
        
            if (this.filter.date) this.filtering = true;
            this.filter.mode = 0;
            this.db.post_rqst({ filter: this.filter, login: this.db.datauser },
                "offer/redeemList?page=" + this.current_page
              )
              .subscribe((d) => {
                this.loading_list = false;
                this.current_page = d.redeem.current_page;
                this.last_page = d.redeem.last_page;
                this.total_reedam = d.redeem.total;
                this.reedam = d.redeem.data;
                this.reedam_all = d.redeem_all;
                this.reedam_pending = d.redeem_pending;
                this.reedam_approved = d.redeem_approved;
                this.reedam_reject = d.redeem_reject;
              });
          };
        
        getReferal() {
            this.loading_list = true;
            this.filter.date = this.filter.date
            ? this.db.pickerFormat(this.filter.date)
            : "";
            if (this.filter.date) {
                this.filtering = true;
            }
            this.filter.mode = 0;
            this.filter.karigar_id = this.karigar_id;
            this.db.post_rqst({ karigar_id: this.karigar_id }, "karigar/get_referal_logs")
            .subscribe((d) => {
                this.loading_list = false;
                this.current_page = d["referal_logs"]["current_page"];
                this.referal_logs = d["referal_logs"]["data"];
                this.totalReferal = d["referal_logs"]["total"];
                console.log(this.referal_logs);
                
            });
        };
        
        
        openAddCouponPoints(){
            console.log('check coupon called');
            const dialogRef = this.alrt.open(AddCouponPointsComponent,{
                width: '500px',
                data:{
                    id: this.karigar_id
                }
            });
            
            dialogRef.afterClosed().subscribe(result => {
                this.getKarigarDetails();
                this.getReferal();
                // this.getReedamList();
            });
        }
        
        
        
        
        
        
        
        
        
        
        
        
        getScannedList1() {
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            this.filter.used_date = this.filter.used_date  ? this.db.pickerFormat(this.filter.used_date) : '';
            this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
            if ( this.filter.date  || this.filter.used_date || this.filter.end_date) {this.filtering = true; }
            
            this.filter.karigar_id = this.karigar_id;
            this.db.post_rqst(  {  filter: this.filter ,'search_type': 'redeem','login': this.db.datauser}, 'offer/couponScannedList?page=' + this.current_page)
            .subscribe( d => {
                this.loading_list = false;
                console.log(d);
                this.all_gifts = d.all_gifts;
                this.current_page = d.scanned_coupon.current_page;
                this.last_page = d.scanned_coupon.last_page;
                this.scanned_coupon = d.scanned_coupon.total;
                
                this.coupon_scanned_count = this.getData.reg;
                for (let index = 0; index < this.scanned_coupon.length; index++) {
                    
                    this.coupon_scanned_count += this.scanned_coupon[index].coupon_value;
                    
                }
                
                // this.coupon_scanned_count = d.scanned_coupon.total;
                this.complaint_total = d.complaint_total;
                this.total_gift_points = d.total_gift_points;
                
            });
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        getScannedList() {
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            this.filter.used_date = this.filter.used_date  ? this.db.pickerFormat(this.filter.used_date) : '';
            this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
            if ( this.filter.date  || this.filter.used_date || this.filter.end_date) {this.filtering = true; }
            
            this.filter.karigar_id = this.karigar_id;
            this.db.post_rqst(  {  'filter': this.filter , 'login': this.db.datauser}, 'offer/couponScannedList?page=' + this.current_page)
            .subscribe( d => {
                this.loading_list = false;
                // console.log(d);
                
                this.current_page = d.scanned_coupon.current_page;
                this.last_page = d.scanned_coupon.last_page;
                this.scanned_coupon = d.scanned_coupon.data;
                
                this.coupon_scanned_count = this.getData.reg;
                for (let index = 0; index < this.scanned_coupon.length; index++) {
                    
                    this.coupon_scanned_count += this.scanned_coupon[index].coupon_value;
                    
                }
                
                // this.coupon_scanned_count = d.scanned_coupon.total;
                this.complaint_total = d.complaint_total;
                this.total_gift_points = d.total_gift_points;
                
            });
        }
        // tslint:disable-next-line:variable-name
        //      gift_points: any =  0;
        getComplaintsList() {
            // console.log(this.filter);
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            if ( this.filter.date) {this.filtering = true; }
            this.filter.mode = 0;
            this.filter.karigar_id = this.karigar_id;
            
            // tslint:disable-next-line:max-line-length
            this.db.post_rqst(  {type: '' , filter: this.filter , login: this.db.datauser}, 'karigar/complaintList?page=' + this.current_page)
            .subscribe( d => {
                this.loading_list = false;
                // console.log(d);
                this.current_page = d.karigars.current_page;
                this.last_page = d.karigars.last_page;
                this.complaint = d.karigars.data;
                this.complaint_total = d.karigars.total;
                // this.total_gift_points = d.karigars.total_gift_points;
                console.log(d);
                
            });
        }
        setStep(index: number) {
            this.step = index;
        }
        nextStep() {
            this.step++;
        }
        prevStep() {
            this.step--;
        }
        openDialog(id , string ) {
            const dialogRef = this.alrt.open(ProductImageModuleComponent,
                {
                    width: '1024px',
                    
                    data: {
                        id : id,
                        mode : string,
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    // console.log(`Dialog result: ${result}`);
                });
            }
            
            // changeStatus(id)
            // {
            //   const dialogRef = this.alrt.open(ChangeKarigarStatusComponent,
            //     {
            //       width: '500px',
            //       height:'500px',
            
            //     data: {
            //       'id' : id,
            //       }
            //     });
            //     dialogRef.afterClosed().subscribe(result => {
            //       if( result ){
            //         this.getReedamList();
            //       }
            //     });
            //   }
            
            // requestchangeStatus(i,id,status)
            // {
            //   //console.log(status);
            
            //   const dialogRef = this.alrt.open(ChangeStatusComponent,
            //     {
            //       width: '500px',
            //       height:'500px',
            
            //       data: {
            //         'id' : id,
            //         'status' : status,
            //       }
            //     });
            //     dialogRef.afterClosed().subscribe(result => {
            //       if( result ){
            //         this.getReedamList();
            //       }
            //     });
            
            //   }
            reg_points: any;
            total_gift_points: any=0;
            reddem: any;
            
            coupon_available_count: any= {};
            
            balanceModel(id) {
                const dialogRef = this.alrt.open(KarigarBalanceModelComponent,
                    {
                        width: '650px',
                        height: '500px',
                        
                        data: {
                            id : id,
                            // 'offer_id'  :   this.offer_id,
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        // console.log(`Dialog result: ${result}`);
                    });
                    
                }
                
                
                karigarsComplaintSatus() {
                    
                    
                    
                    this.loading_list = true;
                    
                    this.db.post_rqst( { complaint_status : this.complaint_status , karigar_id: this.getData.id  }, 'karigar/karigarsComplaintSatus')
                    .subscribe( d => {
                        this.loading_list = false;
                        this.dialog.success('Plumber Compaint Status successfully Change');
                        
                    });
                }
                redeem(id) {
                    this.loading_list = true;
                    console.log(id);
                    this.db.post_rqst( { karigar_id: this.getData.id  }, 'karigar/redeem')
                    .subscribe( d => {
                        this.loading_list = false;
                        this.dialog.success('Wallet Updated');
                        
                    }, err => {
                        this.loading_list = false;
                        this.dialog.error('Error,Please Try Again');
                    });
                    setTimeout(() => {
                        this.loading_list = false;
                        this.getKarigarDetails();
                    }, 100);
                }
                
                
                redirect_next3() {
                    if(this.current_page <this.last_page){this.current_page ++;}else {this.current_page =1}
                }
                
                
            }
            