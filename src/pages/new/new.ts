import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import { Toast } from '@ionic-native/toast';
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
/**
 * Generated class for the NewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-new',
  templateUrl: 'new.html',
})
export class NewPage {

  username: string;
  password: string;
  gender: boolean;
  age: number;
  intro: string;
  email: string;
  phone: string;
  location: string;
  public avatar;
  private toast: Toast

  public img="";

  //new
  lastImage: string = null;
  loading: Loading;
  
    myAppDatabase: SQLiteObject;
    public result;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    private sqlite: SQLite,
 
   
    private camera: Camera, 
    private transfer: Transfer,
    private file: File, 
    private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController
  ) {
    //this.myAppDatabase=homepage.myAppDatabase;
    this.avatar=this.navParams.get('url');
    this.username = "jyq";
    this.password= "pwd";
    this.gender = true;
    this.age = 22;
    this.intro = "intro";
    this.email = "jyq@666.com";
    this.phone = "18302199093";
    this.location = "default";
    this.sqlite.create({
      name: 'myApp.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      database.executeSql('CREATE TABLE IF NOT EXISTS users(email VARCHAR(320) PRIMARY KEY, username VARCHAR(20) NOT NULL, password VARCHAR(30) NOT NULL, gender BOOLEAN, age TINYINT, intro VARCHAR(300), phone CHAR(11), location VARCHAR(100));', {}).then(() => console.log('init database successfully')).catch(e => console.log(e));
      this.myAppDatabase = database;
    })
  }


  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      alert(cordova.file.dataDirectory);
      alert(namePath);
      alert(newFileName);
      alert(currentName);
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public justfortest(){
    return cordova.file.dataDirectory + "cdv_photo_013.jpg";
  }

  public uploadImage() {
    // Destination URL
    var url = "http://tuxa.sme.utc/~na17a023/photo.php";
   
    // File for Upload
    //var targetPath = this.pathForImage(this.lastImage);
    var targetPath = this.img;
    

    // File name only
    //var filename = this.lastImage;
    //var filename = "toto.jpg";
   
    var options = {
      fileKey: "file",
      //fileName: filename,
      fileName: targetPath.substr(targetPath.lastIndexOf('/') + 1),
      chunkedMode: false,
      mimeType: "image/jpg",
      //params : {'fileName': filename}
    };
   
    const fileTransfer: TransferObject = this.transfer.create();
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
      console.log("SUCCESS: " + JSON.stringify(data.response));
      console.log('Result_' + data.response[0] + '_ending');
      alert("success");
      alert(JSON.stringify(data.response));
      //alert(data["_body"]);
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
      //encodingType: this.camera.EncodingType.JPEG, 
      //destinationType: this.camera.DestinationType.DATA_URL
      
    };

    this.camera.getPicture(options).then(image => {
      console.log('Image URI: ' + image);
      this.avatar = image.slice(7);
      this.img = image;
    }, error => {
      console.log('Error: ' + error);
    });
  }

  //end of PHOTO PHP

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPage');
  }


initDatabase() {
    this.sqlite.create({
      name: 'myApp.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      database.executeSql('CREATE TABLE IF NOT EXISTS users(email VARCHAR(320) PRIMARY KEY, username VARCHAR(20) NOT NULL, password VARCHAR(30) NOT NULL, gender BOOLEAN, age TINYINT, intro VARCHAR(300), phone CHAR(11), location VARCHAR(100));', {}).then(() => console.log('init database successfully')).catch(e => console.log(e));
      this.myAppDatabase = database;
    })
  }

  insertIntoUserTable() {
    this.myAppDatabase.executeSql('INSERT INTO users VALUES (?, ?, ?, NULL, NULL, NULL, NULL, NULL);', [this.email, this.username, this.password]).then(() => console.log('insert into users table successfully')).catch(e => console.log(e));
  }
  getCurrentData() {
    
    this.myAppDatabase.executeSql('SELECT * FROM users',{}).then(res => {
      alert("jin le");  
      if(res.rows.length > 0) {
          alert("yesss");
          this.result = res.rows.item(0).username;
          alert(this.result);
}

}).catch(e => {
console.log(e);
this.toast.show(e, '5000', 'center').subscribe(
  toast => {
    console.log(toast);
  }
);
});
  }


  
}
