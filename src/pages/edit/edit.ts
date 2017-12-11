import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, AlertController} from 'ionic-angular';

import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import { NewPage } from '../new/new';

//import {Observable} from "rxjs";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//import {Logger} from "./Logger";

import { Http } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  data:any = {};

  avatar: string = "";
  //public logger: Logger,
  public scannedText: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public actionSheetCtrl: ActionSheetController, 
    public alertCtrl: AlertController, 
    public imagePicker: ImagePicker, 
    public camera: Camera,
    public http: Http,
  private barcodeScanner: BarcodeScanner) {

    this.data.username = '';
    this.data.response = '';
    this.http = http;

  }

  envphoto

  submit() {
    var link = 'http://tuxa.sme.utc/~na17a023/testphp.php';
    var myData = JSON.stringify({username: this.data.username});
    
    this.http.post(link, myData)
    .subscribe(data => {
      this.data.response = data["_body"];
    }, error => {
        console.log("Oooops!");
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: '拍照',
        role: 'takePhoto',
        handler: () => {
          this.takePhoto();
        }
      }, {
        text: '从相册选择',
        role: 'chooseFromAlbum',
        handler: () => {
          this.chooseFromAlbum();
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log("cancel");
        }
      }]
    });

    actionSheet.present().then(value => {
      return value;
    });
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
    };

    this.camera.getPicture(options).then(image => {
      console.log('Image URI: ' + image);
      this.avatar = image.slice(7);
    }, error => {
      console.log('Error: ' + error);
    });
  }

  chooseFromAlbum() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: 200,
      height: 200
    };
    this.imagePicker.getPictures(options).then(images => {
      if (images.length > 1) {
        this.presentAlert();
      } else if (images.length === 1) {
        console.log('Image URI: ' + images[0]);
        this.avatar = images[0].slice(7);
      }
    }, error => {
      console.log('Error: ' + error);
    });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({title: "上传失败", message: "只能选择一张图片作为头像哦", buttons: ["确定"]});
    alert.present().then(value => {
      return value;
    });
  }

  public scanQR() {
    
       this.barcodeScanner.scan().then((barcodeData) => {
         if (barcodeData.cancelled) {
           console.log("User cancelled the action!");
           return false;
         }
         console.log("Scanned successfully!");
         console.log(barcodeData);
         alert(barcodeData);
         this.scannedText=JSON.stringify(barcodeData);
         alert(this.scannedText);
       }, (err) => {
         console.log(err);
       });
     } 


  /**
   * 扫描二维码
   *
   */
 
/*
  scan() {
    return Observable.create(observer => {
      this.barcodeScanner.scan().then((barcodeData) => {
        observer.next(barcodeData.text);
        console.log(barcodeData);
      }).catch(err => {
        //this.logger.log(err, '扫描二维码失败');
        console.log(err);
      });
    });
  }
*/

  goNews(){
    this.navCtrl.push(NewPage,{
      url: this.avatar
});
  }
}