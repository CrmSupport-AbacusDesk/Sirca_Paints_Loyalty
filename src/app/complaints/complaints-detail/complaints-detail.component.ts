import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';
import { ComplaintsChangeStatusComponent } from '../../complaints/complaints-change-status/complaints-change-status.component';
import { ComplaintsEditGalleryComponent } from '../complaints-edit-gallery/complaints-edit-gallery.component';
import { ComplaintsAssignPlumberComponent } from '../complaints-assign-plumber/complaints-assign-plumber.component';
import { ComplaintRemarkComponent } from '../complaint-remark/complaint-remark.component';


@Component({
  selector: 'app-complaints-detail',
  templateUrl: './complaints-detail.component.html',
})
export class ComplaintsDetailComponent implements OnInit {
  
  complaints_id;
  loading_list = false;
  
  filtering : any = false;
  filter:any = {};
  last_page: number ;
  current_page = 1;
  search: any = '';
  mindate :any = new Date();  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public dialog: DialogComponent, public alrt:MatDialog ) {}
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.complaints_id =  this.db.crypto(params['complaints_id'],false);
        if (this.complaints_id) {
          this.getComplaintDetails();
        }

        this.getVedioList();
      });
    }
    
    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    edit(){
      this.router.navigate(['/customer-edit/' +this.getData.customer_id]);
    }
    getData:any = {};
    image:any = 0;
    video:any = 0;
    getComplaintDetails() {
      this.loading_list = true;
      this.db.post_rqst(  {'complaints_id':this.complaints_id}, 'karigar/complaintDetailById')
      .subscribe(d => {
        this.loading_list = false;
        this.image = 0;
        this.video = 0;
        
        ////console.log(d);
        this.getData = d.complaints;
        for (let i = 0; i < this.getData.image.length; i++) {
    
          if( this.getData.image[i].type == 'image' ){
            this.image++;
          }else{
            this.video++;
          }
          
        }
      });
    }
    karigarsSatus() {
      this.db.post_rqst({ 'status' : this.getData.status, 'id' : this.getData.id }, 'karigar/karigarStatus')
      .subscribe(d => {
        ////console.log(d);
        this.getComplaintDetails();
      });
    }
    
    openDialog(id ,string ) {
      const dialogRef = this.alrt.open(ProductImageModuleComponent,
        {
          // width: '500px',
          // height:'500px',
          data: {
            'id' : id,
            'mode' : string,
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          ////console.log(`Dialog result: ${result}`);
        });
      }
      
      changeStatus(i,id,status)
      {
        ////console.log(status);
        
        const dialogRef = this.alrt.open(ComplaintsChangeStatusComponent,
          {
            width: '500px',
            height:'500px',
            
            data: {
              'id' : id,
              'status' : status,
              'type' : 'status',
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if( result ){
              this.getComplaintDetails();
            }
          });
          
        }
        addPayment(plumberId,complaintId)
        {
          ////console.log(status);
          
          const dialogRef = this.alrt.open(ComplaintsChangeStatusComponent,
            {
              width: '500px',
              height:'500px',
              
              data: {
                'plumberId' : plumberId,
                'complaintId' : complaintId,
                'type' : 'payment',
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if( result ){
                this.getComplaintDetails();
              }
            });
            
          }
        openRemark(id)
        {
          ////console.log(status);
          
          const dialogRef = this.alrt.open(ComplaintRemarkComponent,
            {
              width: '500px',
              height:'500px',
              
              data: {
                'id' : id,
              }
            });
            dialogRef.afterClosed().subscribe(result => {
             
            });
            
          }
        
        openDialog4(id ,string ) {
          const dialogRef = this.alrt.open(ProductImageModuleComponent,
            {
              // width: '500px',
              // height:'500px',
              data: {
                'id' : id,
                'mode' : string,
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              ////console.log(`Dialog result: ${result}`);
            });
          }
          vedios:any= [];
          getVedioList() {
            ////console.log(this.db.datauser);
            
            this.loading_list = true;
            if( this.filter.date || this.filter.location_id )this.filtering = true;
            this.db.post_rqst({ 'filter': this.filter}, 'master/videoList?page=' + this.current_page )
            .subscribe(d => {
              ////console.log(d);
              
              this.vedios = d.video.data;
              
              this.loading_list = false;
            });
          }

          deleteGallery(id) {
            this.dialog.delete('Complaint Gallery').then((result) => {
              if(result) {
            this.db.post_rqst({id : id}, 'karigar/imageComplaintDelete')
            .subscribe(d => {
              //console.log(d);
              this.getComplaintDetails();
              this.dialog.successfully();
            });
          }
            });
          } 

          editGallery() {
            const dialogRef = this.alrt.open(ComplaintsEditGalleryComponent,
                {
                    width: '800px',
                    data: {
                        'compliant_id':this.complaints_id,
                        // 'mode' : string,
                    }
                });
                dialogRef.afterClosed().subscribe( r => {
                    if( r ) this.getComplaintDetails();
                });
            }

            assignPlumber(id, assigned_plumber)
            {
              
              const dialogRef = this.alrt.open(ComplaintsAssignPlumberComponent,
                {
                  width: '500px',
                  height:'500px',
                  
                  data: {
                    'id' : id,
                    'assigned_plumber' : assigned_plumber,
                  }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if( result ){
                    this.getComplaintDetails();
                  }
                });
                
              }

          
          
        }
        