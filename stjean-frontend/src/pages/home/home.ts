import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, ToastController, AlertController, Loading } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Vibration } from '@ionic-native/vibration';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as $ from 'jquery';
import { Subscription, Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checkConnectionSub : Subscription;
  loadingWindow : Loading;
  isInFailureState : Boolean = false;

  constructor(public navCtrl: NavController,
              public screenOrientation: ScreenOrientation,
              public platform: Platform,
              public vibration: Vibration,
              public loadingCtrl: LoadingController,
              private bluetoothSerial: BluetoothSerial,
              private toastController: ToastController,
              private alertController: AlertController) {
      if (this.platform.is('mobile')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
  }
  ionViewWillEnter() {
    this.connectBluetoothIfNecessary();
  }
  showToast(content: string, timeout: number=4000) {
    let toast = this.toastController.create({
      message: content,
      duration: timeout,
      position: 'top'
    });
    toast.present();
  }
  showAlert(title, message) {
    let popUp = this.alertController.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Réessayer maintenant',
        handler: () => {
          this.connectBluetoothIfNecessary();
        }
      }]
    });
    popUp.present();
  }
  checkBluetoothList(list) {
    let found : boolean = false;
    let macAddress : string;

    list.forEach(element => {
      if(element["name"] == "ARBALET_SAINT_JEAN") {
        found = true;
        macAddress = element["address"];
      }
    });

    if(found) {
      this.bluetoothSerial.connect(macAddress).subscribe(
        () => {
          // Success case
          this.showToast("Vous pouvez maintenant jouer !");
          this.isInFailureState = false;
          this.loadingWindow.dismiss();
          // Start the observable to check every second if connect is lost
          this.checkConnectionSub = Observable.interval(1000).subscribe(() => {
            this.connectBluetoothIfNecessary();
          });
        },
        (reason) => { this.raiseConnectionFailureRoutine(false, reason); });    
    }
    else {
      this.raiseConnectionFailureRoutine(false);
    }
  }
  connectBluetoothIfNecessary() {
    this.bluetoothSerial.isConnected()
    .then().catch(() => {
      this.presentLoadingDefault();
      this.bluetoothSerial.enable();
      this.bluetoothSerial.list().then(list => this.checkBluetoothList(list),
                                       reason => this.raiseConnectionFailureRoutine(reason));
    });
  }
  presentLoadingDefault() {
    this.loadingWindow = this.loadingCtrl.create({
      content: 'Nous cherchons Arbalet Saint Jean près de vous ...'
    });
  
    this.loadingWindow.present();
  
    setTimeout(() => {
      this.bluetoothSerial.isConnected()
      .then().catch(() => {
        this.raiseConnectionFailureRoutine(true, "TIMEOUT");
      });
    }, 10000);
  }

  raiseConnectionFailureRoutine(isAssociated: Boolean, reason: string = "") {
    let wasInFailureState = this.isInFailureState;
    this.isInFailureState = true;
    if(this.checkConnectionSub && !this.checkConnectionSub.closed) {
      this.checkConnectionSub.unsubscribe();
    }

    if(!wasInFailureState) {
      let title : string = "";
      if(isAssociated) {
        title = "Connexion impossible";
      }
      else {
        title = "Associez votre smartphone";
      }

      let text : string = "";
      if(isAssociated) {
        text += "Veuillez vous approcher d'Arbalet Saint Jean puis essayer à nouveau. ";
      }
      else {
        text += "Veuillez vous associer à ARBALET_SAINT_JEAN avec le mot de passe 1234 via l'utilitaire Bluetooth de votre smartphone puis réessayez";
      }
      if(reason != "") {
        text += "Code d'erreur : " + reason;
      }

      this.showAlert(title, text);
    }
  }

  onUp() {
    this.bluetoothSerial.write('Up').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#upArrow').hide({duration:0, done: function() {$('#upArrow').fadeIn(200);}});
  }
  onDown() {
    this.bluetoothSerial.write('Down').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#downArrow').hide({duration:0, done: function() {$('#downArrow').fadeIn(200);}});
  }
  onLeft() {
    this.bluetoothSerial.write('Left').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#leftArrow').hide({duration:0, done: function() {$('#leftArrow').fadeIn(200);}});
  }
  onRight() {
    this.bluetoothSerial.write('Right').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#rightArrow').hide({duration:0, done: function() {$('#rightArrow').fadeIn(200);}});
  }
  onRotate() {
    this.bluetoothSerial.write('Btn1').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#rotateArrow').hide({duration:0, done: function() {$('#rotateArrow').fadeIn(200);}});
  }
  onRestart() {
    this.bluetoothSerial.write('Select').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#restartArrow').hide({duration:0, done: function() {$('#restartArrow').fadeIn(200);}});
  }
  onNext() {
    this.bluetoothSerial.write('Start').then(() => { /* success */ }, this.raiseConnectionFailureRoutine);
    this.vibration.vibrate(40);
    $('#nextArrow').hide({duration:0, done: function() {$('#nextArrow').fadeIn(200);}});
  }
}
