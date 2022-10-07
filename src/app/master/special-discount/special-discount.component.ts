import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import * as moment from 'moment';

@Component({
    selector: 'app-special-discount',
    templateUrl: './special-discount.component.html',
})
export class SpecialDiscountComponent implements OnInit {
    
    constructor(public db:DatabaseService,public dialog:DialogComponent) { }
    
    ngOnInit() {
        this.get_discount();
    }
    
    discount:any={};
    get_discount()
    {
        this.db.post_rqst({},"master/get_special_discount")
        .subscribe(resp=>{
            console.log(resp);
            this.discount = resp['discount'];
        })
    }
    
    number(event: any) {
        const pattern = /^\d*(?:[.,]\d{1,2})?$/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    update_details()
    {
        this.discount.start_date= moment(this.discount.start_date).format("YYYY-MM-DD");
        this.discount.end_date= moment(this.discount.end_date).format("YYYY-MM-DD");
        this.db.post_rqst({"discount":this.discount},"master/update_special_discount")
        .subscribe(resp=>{
            console.log(resp);
            if(resp['result'])
            {
                this.dialog.success("Updated Successfully !");
            }
        })
    }
    openDatePicker(picker : MatDatepicker<Date>)
    {
        picker.open();
    }
    openDatePicker2(picker2 : MatDatepicker<Date>)
    {
        picker2.open();
    }
}
