import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-add-coupon-points',
  templateUrl: './add-coupon-points.component.html',
  styleUrls: ['./add-coupon-points.component.scss']
})
export class AddCouponPointsComponent implements OnInit {

  Couponform:any ={};
  userId:any;
  target:any ={};
  couponData:any ={}
  loading = false;
  couponsList: any = [];
  id:any;
  
  constructor(public db: DatabaseService,public dialog: DialogComponent, public alrt:MatDialog,
      public dialogRef: MatDialogRef<AddCouponPointsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.id = data["id"];
        console.log('Karigar Id Is ->', this.id);
       }
  ngOnInit() {
  }

  saveCoupon = ()  => {
    this.Couponform;
    console.log(this.Couponform.coupon_points);
    if(this.Couponform.coupon_points == undefined){
        this.dialog.warning('Coupon points are required');
        return;
    }
    if(this.Couponform.remarks == undefined){
      this.dialog.warning('Remarks are required');
      return;
      }
    const coupon_points = this.Couponform.coupon_points;
    const remarks = this.Couponform.remarks;

    this.db.insert_rqst({"id":this.id, "point":coupon_points, "remark": remarks}, 'karigar/bonus_points')
    .subscribe(response => {
        console.log(response);
        this.dialogRef.close();
        this.loading = false;
    });
  }
}
