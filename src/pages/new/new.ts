import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  
    myAppDatabase: SQLiteObject;
    public result;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
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
