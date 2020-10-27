import $ from "jquery";
import { PLAYER, RANKING, HOME_BUTTON_POSITION, NHPHomeParameter } from "../types/NHPType";
import NHPLogin from "./NHPLogin";
import NHPRanking from "./NHPRanking";
import NHPHome from "./NHPHome";
var styleCommon = require("../../assets/css/common.css");
/**
 * Class that manage all UI components
 */
export default class NHPSceneController{
  private static instance:NHPSceneController = null; 
  
  
  // static method to create instance of Singleton class 
  static getInstance():NHPSceneController
  { 
      if (this.instance == null) 
          this.instance = new NHPSceneController(); 

      return this.instance; 
  } 

  private sceneDiv:any;
  private overlayDiv:any;

  private loginClass:NHPLogin;
  private rankingClass:NHPRanking;
  private homeClass: NHPHome;

  constructor(){
    if($( "#nhp-scene" ).length){//if div exists
      this.sceneDiv = $( "#nhp-scene" ); //use it
      return;
    }

    //if it is not existed, create and append to body
    this.sceneDiv = $("<div id='nhp-scene'/>");

    this.constructOverlay();

    this.sceneDiv.appendTo('body');

    this.loginClass = new NHPLogin();
    this.loginClass.loginSceneDiv.appendTo(this.sceneDiv);

    this.rankingClass = new NHPRanking();
    this.rankingClass.rankingSceneDiv.appendTo(this.sceneDiv);

    this.homeClass = new NHPHome();
    this.homeClass.homeSceneDiv.appendTo(this.sceneDiv);

    window.addEventListener('resize',this.onWindowResize.bind(this));
  }

  /**
     * called when window is resized
     */
  onWindowResize(){
    this.rankingClass.onWindowResize();
    this.loginClass.onWindowResize();
    this.homeClass.onWindowResize();
  }

  /**
     * construct overlay
     */
  constructOverlay(){
    if($( "#nhp-overlay" ).length){//if div exists
        this.overlayDiv = $( "#nhp-overlay" );
        return;
    }

    //if it is not existed, create and append to scenediv
    this.overlayDiv = $("<div id='nhp-overlay' class='"+styleCommon.overlay+"'/>");
    this.overlayDiv.appendTo(this.sceneDiv);
    this.overlayDiv.hide();//default hide

    
  }

 /**
  * called when player is new
  * @param player {PLAYER} player object with new playerid
  * @param onClose {function} callback function when closed
  */
  showFirstPlay(player:PLAYER,onClose:(updatedPlayer:PLAYER)=>void){
    
    this.loginClass.setData(player);
    this.loginClass.showRegisterNickName(true);
    this.loginClass.registerCallBackOnUpdateName(function(nickname:string){
      player.name = nickname;
      onClose(player);
    });

    this.onWindowResize();
  }

  /**
  * called when player is already logged in
  * @param player {PLAYER} current logged in player object
  * @param onClose {function} callback function when nickname is updated
  */
  processLogin(player:PLAYER,onClose:(updatedPlayer:PLAYER)=>void){
    this.loginClass.setData(player);
    this.loginClass.showLoginPopup();
    this.loginClass.registerCallBackOnUpdateName(function(nickname:string){
      player.name = nickname;
      onClose(player);
    });
    this.onWindowResize();
  }

  /**
  * called when player is register their score (at the end of the play session)
  * @param score {number} player object with new playerid
  * @param rankData {function} callback function when closed
  */
  registerScore(score:number,rankData:RANKING,onClose:()=>void){
    this.rankingClass.showRanking(score,rankData);
    this.onWindowResize();
  }

  /**
   * show Home Button with parameters to set
   * @param parameter {NHPHomeParameter} home parameter
   */
  showHomeButton(parameter:NHPHomeParameter){
    this.homeClass.showElement({
      url:(parameter && parameter.url?parameter.url:"javascript:history.back()"),
      position:parameter && parameter.position?parameter.position:HOME_BUTTON_POSITION.BOTTOM_LEFT
    });
    this.onWindowResize();
  }

  /**
   * hide Home Button
   */
  hideHomeButton(){
    this.homeClass.hideElement();
  }
}