import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
    selector: 'app-change-price-model',
    templateUrl: './change-price-model.component.html'
})
export class ChangePriceModelComponent implements OnInit
{
    loading_list:boolean=  false
    form:any={};
    
    constructor(public db:DatabaseService,public dialogref:MatDialog,public dialog:DialogComponent) { }
    
    ngOnInit() {
        this.get_categories();
    }
    
    category_list:any=[];
    get_categories()
    {
        this.db.post_rqst({}, 'master/get_categories' )
        .subscribe(resp => {
            console.log(resp);
            this.category_list = resp['category'];
        });
    }
    
    select_cat(row)
    {
        console.log(this.form.category);
        
    }
    
    save_price()
    {
        this.loading_list = true;
        this.db.post_rqst({data:this.form},"master/change_price")
        .subscribe(resp=>{
            console.log(resp);
            this.loading_list = false;
            this.dialogref.closeAll();
            this.dialog.success("Price Updated");
        })
    }
}
