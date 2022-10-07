import { Component, OnInit, Renderer2  } from '@angular/core';
import {SessionStorage} from '../_services/SessionService';
import {Router} from '@angular/router';
import {DatabaseService} from './../_services/DatabaseService';
import {DialogComponent} from './../dialog/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(private renderer: Renderer2, private router: Router, public ses: SessionStorage, public db: DatabaseService , public dialog: DialogComponent) {
    // this.getAbacusConnectCount();
   }

  ngOnInit() {
  }

  status:boolean = false;
  toggleHeader() {
      this.status = !this.status;
      if(this.status) {
          this.renderer.addClass(document.body, 'active');
      }
      else {
          this.renderer.removeClass(document.body, 'active');
      }
  }

  logout(): void {
    this.ses.logoutSession();
    this.router.navigate(['/']);
  }
  taskCount:any={};
  // getAbacusConnectCount()
  // {
  //   console.log('test');
  //   this.db.get_rqst('','getAbacusConnectCount.php').subscribe((resp)=>{
  //     console.log(resp);
  //     this.taskCount = resp['data'];
  //   },err=>{

  //   })
  // }

  goToConnect()
  {
    window.open('http://crmsupport.abacusdesk.com/projecttaskdetail/RlNSTHk1Ujg4Qkdlc3c3RzFhYjhrZz09', "_blank");
  }
  show_actions:any={};

}
