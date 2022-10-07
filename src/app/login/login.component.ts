import { Component, OnInit } from '@angular/core';
import {SessionStorage} from '../_services/SessionService';
import {DatabaseService} from '../_services/DatabaseService';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public ses: SessionStorage, public db: DatabaseService, public sanitizer: DomSanitizer) { }
  form: any = {};
  loading = false;
  DDVideoUrl: string;
  sendingData = false;
  banner: any = [];


  edit_view:boolean=false;
  visible_password(){
    this.edit_view =true
  }
  not_visible_password(){
    this.edit_view =false
  }

  ngOnInit() {
    this.loginBanners();
  }

  login() {
    this.form.mode = 'Portal';
    this.ses.setSession(this.form);
  }
  loginBanners() {
    this.db.login_get_rqst( '', 'app_karigar/banners' )
    .subscribe(d => {
        this.banner = d.banner;
    });
  }


}
