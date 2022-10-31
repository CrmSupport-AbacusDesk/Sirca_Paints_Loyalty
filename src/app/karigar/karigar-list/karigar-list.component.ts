import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { ChangeKarigarStatusComponent } from '../../karigar/change-karigar-status/change-karigar-status.component';
import { PopupComponent } from 'src/app/popup/popup.component';



@Component({
    selector: 'app-karigar-list',
    templateUrl: './karigar-list.component.html',
})
export class KarigarListComponent implements OnInit {

    loading_list = false;
    karigars: any = [];
    total_karigars = 0;
    karigar_all: any = 0;

    last_page: number;
    current_page = 1;
    search: any = '';
    filter: any = {};
    filtering: any = false;

    karigar_pending: any = 0;
    karigar_reject: any = 0;
    karigar_suspect: any = 0;
    karigar_verified: any = 0;

    constructor(public db: DatabaseService, public dialog: DialogComponent, public alrt: MatDialog) {
    }

    ngOnInit() {
        this.filter = this.db.karigarListingFilter;
        this.filter.status = '';
        this.getKarigarList();
        this.AssignSaleUser();
    }

    openDatePicker(picker: MatDatepicker<Date>) {
        picker.open();
    }

    redirect_previous() {
        this.current_page--;
        this.getKarigarList();
    }

    redirect_next() {
        if (this.current_page < this.last_page) {
            this.current_page++;
        } else {
            this.current_page = 1;
        }
        this.getKarigarList();
    }

    getKarigarList() {
        //console.log(this.filter);
        this.loading_list = true;
        this.filter.date = this.filter.date ? this.db.pickerFormat(this.filter.date) : '';
        if (this.filter.date) this.filtering = true;
        this.filter.mode = 0;
        this.db.post_rqst({
            'filter': this.filter,
            'login': this.db.datauser
        }, 'karigar/contractorList?page=' + this.current_page)
            .subscribe(d => {
                this.loading_list = false;
                console.log(d['contractorData']['data']);

                this.current_page=d['contractorData'].current_page;
                this.last_page=d['contractorData'].last_page;
                this.total_karigars=d['contractorData'].total;
                this.karigars=d['contractorData']['data'];
                this.karigar_all=d.karigar_all;
                this.karigar_pending = d.karigar_pending;
                this.karigar_reject = d.karigar_reject;
                this.karigar_suspect = d.karigar_suspect;
                this.karigar_verified = d.karigar_verified;
            });
    }

    ConvertToInt(val) {
        return parseInt(val);
    }

    exportKarigar() {
        this.filter.mode = 1;
        this.db.post_rqst({'filter': this.filter, 'login': this.db.datauser}, 'karigar/exportKarigar')
            .subscribe(d => {
                document.location.href = this.db.myurl + '/app/uploads/exports/Karigars.csv';
                //console.log(d);
            });
    }


    sales_users: any = [];

    AssignSaleUser() {
        // this.loading_list = true;
        this.db.get_rqst('', 'karigar/sales_users')
            .subscribe(d => {
                // this.loading_list = false;
                //console.log(d);
                this.sales_users = d.sales_users;
            });
    }

    getDealer: any = [];

    dealer() {
        this.loading_list = true;
        this.db.get_rqst('', 'karigar/dealer_contact_person')
            .subscribe(d => {
                this.loading_list = false;
                //console.log(d);
                this.getDealer = d.dealer_contact_person;
            });
    }

    // } 
    deleteKarigar(id) {
        this.dialog.delete('Karigar').then((result) => {
            if (result) {
                this.db.post_rqst({'id': id}, 'karigar/remove')
                    .subscribe(d => {
                        //console.log(d);
                        this.getKarigarList();
                        this.dialog.successfully();
                    });
            }
        });
    }

    complaint: any = {};

    karigarsSatus(i) {
        if (this.karigars[i].status == 'Reject' || this.karigars[i].status == 'Suspect' || this.karigars[i].status == 'Verified') {
            this.model(i);
            return;
        }
        else if( this.karigars[i].status == 'Verified'){
           this.addStock(i);
           return;
        }
        else  {


            this.loading_list = true;
            this.complaint.created_by = this.db.datauser.id;
            this.complaint.karigar_id = this.karigars[i].id;
            this.complaint.status = this.karigars[i].status;
            this.db.post_rqst( this.complaint, 'karigar/karigarStatus')
                .subscribe(d => {
                    this.loading_list = false;
                    this.dialog.success('Status successfully Change');
                    this.getKarigarList();
                });
        }



    }

// verify()
// {
//     if (this.karigars.status == 'Verified') {
//         this.addStock();
//         return;
//     }
// }



updateRemark(id, status_remark, type) {
    
    const dialogRef = this.alrt.open(ChangeKarigarStatusComponent,
        {
            width: '500px',
            height: '500px',

            data: {
                'karigar_id':id,
                'status_remark':status_remark,
                'type': type,
            }
        });
    dialogRef.afterClosed().subscribe(result => {
        this.getKarigarList();
    });

}



    model(i) {

        const dialogRef = this.alrt.open(ChangeKarigarStatusComponent,
            {
                width: '500px',
                height: '500px',

                data: {
                    karigar_id: this.karigars[i].id,
                    status: this.karigars[i].status,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getKarigarList();
            }
            if (result) {
                this.getKarigarList();
            } else {
                this.getKarigarList();
            }
        });

    }

    karigarsComplaintSatus(i) {


        this.loading_list = true;
        this.complaint.created_by = this.db.datauser.id;
        this.complaint.karigar_id = this.karigars[i].id;
        this.complaint.complaint_status = this.karigars[i].complaint_status;

        this.db.post_rqst({'complaint_status': this.complaint}, 'karigar/karigarsComplaintSatus')
            .subscribe(d => {
                this.loading_list = false;
                this.dialog.success('Plumber Compaint Status successfully Change');

            });
    }


    addStock(i) {
        // alert( this.lead_id);


                // this.db.post_rqst1({}, 'Distributors/all_distributors').subscribe((result => {
                //     console.log(result);

                const dialogRef = this.alrt.open(PopupComponent, {
                    width: '500px',


                    data: {
                        // karigar_id: this.karigars[i].id,
                        // status: this.karigars[i].status,
                    }
                });

                dialogRef.afterClosed().subscribe(r => {
                    // if(r){
                    //   this.getFranchiseOrderList();
                    // }
                });


    }


    goToKarigarDetailPage(){

        this.db.karigarListingFilter = this.filter;


    }

    karigarFilterBlank(){

        console.log('karigarFilterBlank Method Called : ');

        this.db.karigarListingFilter = {};

        this.getKarigarList();

    }


}




