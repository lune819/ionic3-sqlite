import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import { Toast } from '@ionic-native/toast';
import { NewPage} from '../new/new';
import { EditPage} from '../edit/edit';

import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data:any = {};

  username: string;
  password: string;
  gender: boolean;
  age: number;
  intro: string;
  email: string;
  phone: string;
  location: string;
  public result;
  private toast: Toast

  myAppDatabase: SQLiteObject;

  


  constructor(public navCtrl: NavController, private sqlite: SQLite, public http: Http) {
    this.data.username = '';
    this.data.response = '';
    this.http = http;

    this.username = "jyq";
    this.password= "pwd";
    this.gender = true;
    this.age = 22;
    this.intro = "intro";
    this.email = "jyq@666.com";
    this.phone = "18302199093";
    this.location = "default";

  }

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

  queryUserTable() {
    this.result=this.myAppDatabase.executeSql('SELECT age FROM users;', {}).then(() => console.log('query users table successfully')).catch(e => console.log(e));
    alert(this.result);
  }

  updateUserTable() {
    this.myAppDatabase.executeSql('UPDATE users SET username=?, password=?, gender=?, age=?, intro=?, phone=?, location=? WHERE email=?;', [this.username, this.password, this.gender, this.age, this.intro, this.phone, this.location, this.email]).then(() => console.log('update users table successfully')).catch(e => console.log(e));
    
  }
  newfonc(){
  
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

  goNews(){
    this.navCtrl.push(NewPage);
  }
  goedit(){
    this.navCtrl.push(EditPage);
  }

}

