import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
    selector: 'app-referral-master',
    templateUrl: './referral-master.component.html',
})
export class ReferralMasterComponent implements OnInit {
    
    constructor(public db:DatabaseService,public toastr:DialogComponent) { }
    
    ngOnInit() {
        this.get_refer_detail();
    }
    
    refer:any={};
    get_refer_detail()
    {
        this.loading_list = true;
        this.db.post_rqst({},"master/point_master")
        .subscribe(resp=>{
            console.log(resp);
            this.refer.referral_point = resp['points']['referral_point'];
            this.loading_list = false;
        })
    }
    
    number(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    loading_list:any;
    update_details()
    {
        // this.loading_list = true;
        this.db.post_rqst({"data":this.refer},"master/update_ref_detail")
        .subscribe(resp=>{
            console.log(resp);
            // this.loading_list = false;
            this.toastr.success("Updated!");
        })
    }
}
