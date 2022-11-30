import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../_services/DatabaseService';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
@Component({
  selector: 'app-coupon-code-data-detail',
  templateUrl: './coupon-code-data-detail.component.html',
  styleUrls: ['./coupon-code-data-detail.component.scss']
})
export class CouponCodeDataDetailComponent implements OnInit {

  value: any = 'Techiediaries';
  getData: any = {};
  coupon_id: any = '';
  loading_list: boolean = false;
  showDivpdf: boolean = false;
  imgFile: any = [];
  constructor(private route: ActivatedRoute, public db: DatabaseService, public router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);

      this.coupon_id = params['id'];

      console.log(this.coupon_id);

      // this.page_number = params['page'];
      // this.status = params['status'];
      if (this.coupon_id) {
        this.getCouponDetails();
        // this.getSiteDetails();
      }
    });
  }


  getCouponDetails() {
    this.loading_list = true;
    this.db.post_rqst({ 'id': this.coupon_id }, 'offer/qrCodeDetail').subscribe((result) => {
      console.log(result)
      this.loading_list = false;
      this.getData = result['qr_code_detail'];
      console.log(this.getData)

    }, err => {
      this.loading_list = false;

    });

  }

  // exportAsPDF(div_id)
  // {
  //   let data = document.getElementById(div_id);  
  //   html2canvas(data).then(canvas => {
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
  //     // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
  //     pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
  //     pdf.save('Filename.pdf');   
  //   }); 
  // }


  printPdf(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    window.close();

    document.body.innerHTML = originalContents;
    // this.router.navigate(['coupon-code-list'])
  }
  printPdf2(divName){
    var divContents = document.getElementById(divName).innerHTML;
    var a = window.open('','',`height=700, width:500`);
    a.document.write('<html>');
    a.document.write('<body>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
  }

  exportPDF(div_id) {
    this.loading_list = true;
    this.showDivpdf = true;
    this.imgFile = []

    var imgWidth = 0;
    var pageHeight = 0;
    var imgHeight = 0;
    var heightLeft = 0;
    var position = 0;
    let pdf = null;
    let coponId = this.getData.id;
    var element: HTMLElement = null;

    setTimeout(() => {

      if (this.showDivpdf == true) {
        element = document.getElementById(div_id);

        htmlToImage.toPng(element).then(function (dataUrl) {

          console.log(dataUrl);

          const imgFile = dataUrl;

          imgWidth = 200;
          pageHeight = 295;
          imgHeight = element.offsetHeight * imgWidth / element.offsetWidth;
          heightLeft = imgHeight;

          pdf = new jspdf('p', 'mm');
          position = 5;
          console.log('image width 1 ' + imgWidth)
          console.log('image imgHeight 1 ' + imgHeight)

          pdf.addImage(imgFile, 'PNG', 5, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {

            position = heightLeft - imgHeight + 5;

            pdf.addPage();
            pdf.addImage(imgFile, 'PNG', 5, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`Coupon${coponId}.pdf`);
        });


      }
      this.loading_list = false;

    }, 1000);

    setTimeout(() => {
      this.loading_list = false;

      //  this.showDivpdf=false;
      // window.location.reload();
    }, 5000);


  }

  exportAsPDF2(div_id) {
    this.loading_list = true;

    this.showDivpdf = true;
    this.imgFile = []

    var imgWidth = 0;
    var pageHeight = 0;
    var imgHeight = 0;
    var heightLeft = 0;
    var position = 0;
    let pdf = null;
    let coponId = this.getData.id;

    var element: HTMLElement = null;

    setTimeout(() => {

      if (this.showDivpdf == true) {
        element = document.getElementById(div_id);

        htmlToImage.toPng(element).then(function (dataUrl) {

          console.log(dataUrl);

          const imgFile = dataUrl;
          imgWidth = 200;
          pageHeight = 295;
          imgHeight = element.offsetHeight * imgWidth / element.offsetWidth;
          heightLeft = imgHeight;

          pdf = new jspdf('p', 'mm');
          position = 5;
          console.log('image width 1 ' + imgWidth)
          console.log('image imgHeight 1 ' + imgHeight)

          pdf.addImage(imgFile, 'PNG', 5, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {

            position = heightLeft - imgHeight + 5;

            pdf.addPage();
            pdf.addImage(imgFile, 'PNG', 5, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`Coupon${coponId}.pdf`);
        });


      }
      this.loading_list = false;

    }, 1000);

    setTimeout(() => {

      //  this.showDivpdf=false;
      // window.location.reload();
    }, 5000);


  }

}
