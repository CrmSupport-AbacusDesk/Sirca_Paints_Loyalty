import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { ImportStatusModelComponent } from 'src/app/offer/import-status-model/import-status-model.component';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-category-model',
    templateUrl: './category-model.component.html',
    styleUrls: ['./category-model.component.scss']
})
export class CategoryModelComponent implements OnInit {
    filter:any={};
    offer_list:any=[];
    loading = false;
    formData = new FormData();
    exist_coupon:any=[];
    offer_data:any={};
    coupon_ex:any = '';
    file:any = {};
    
    constructor(public db: DatabaseService,public dialog: DialogComponent, public alrt:MatDialog,public dialogRef: MatDialogRef<CategoryModelComponent>) { }
    
    ngOnInit()
    {  
        this.getOfferList();
    }
    
    getOfferList()
    {
        this.filter.mode=0;
        this.db.post_rqst(  {  'filter': this.filter ,'login':this.db.datauser}, 'offer/offerList' )
        .subscribe( response => {
            console.log(response);
            this.offer_list = response.offer.data;
        })
    }
    
    
    
    onUploadChange(evt) 
    {
        this.file = evt.target.files[0];
        console.log(this.file);
    }
    
    uploadCoupon()
    {
        this.dialogRef.disableClose = true;
        console.log(this.offer_data.offer_id);
        this.loading = true; 
        this.formData.append('category', this.file, this.file.name);
        console.log(this.file);
        console.log(this.file.name);

        
        console.log(this.formData);
        
        this.db.fileData( this.formData, 'app_master/upload_cat_excel')
        .subscribe(d => {  
            this.loading = false;
            this.dialogRef.disableClose = false;
            this.formData = new FormData();
            if(d['status'] == 'INTERNAL ERROR'){
                this.dialog.success('There is some internal error');
                return;
            }
            
            if(d['status'] == 'INCORRECT FILE'){
                this.dialog.success('File Data is incorrect');
                return;
            }
            
            if(d['status'] == 'UPLOADED'){
                this.dialog.success('File has been uploaded');
                return;
            }
        },err => {console.log(err);  this.formData = new FormData(); this.loading = false; });
    }
    
}
