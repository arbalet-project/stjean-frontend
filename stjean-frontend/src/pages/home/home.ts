import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Vibration } from '@ionic-native/vibration';
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public screenOrientation: ScreenOrientation,
              public platform: Platform,
              public vibration: Vibration) {
      if (this.platform.is('mobile')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
  }
  onUp() {
    this.vibration.vibrate(40);
    $('#upArrow').hide({duration:0, done: function() {$('#upArrow').fadeIn(200);}});
  }
  onDown() {
    this.vibration.vibrate(40);
    $('#downArrow').hide({duration:0, done: function() {$('#downArrow').fadeIn(200);}});
  }
  onLeft() {
    this.vibration.vibrate(40);
    $('#leftArrow').hide({duration:0, done: function() {$('#leftArrow').fadeIn(200);}});
  }
  onRight() {
    this.vibration.vibrate(40);
    $('#rightArrow').hide({duration:0, done: function() {$('#rightArrow').fadeIn(200);}});
  }
  onRotate() {
    this.vibration.vibrate(40);
    $('#rotateArrow').hide({duration:0, done: function() {$('#rotateArrow').fadeIn(200);}});
  }
  onRestart() {
    this.vibration.vibrate(40);
    $('#restartArrow').hide({duration:0, done: function() {$('#restartArrow').fadeIn(200);}});
  }
  onNext() {
    this.vibration.vibrate(40);
    $('#nextArrow').hide({duration:0, done: function() {$('#nextArrow').fadeIn(200);}});
  }
  ionViewDidLeave() {
    if (this.platform.is('mobile')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.screenOrientation.unlock();
    }
  }
}
