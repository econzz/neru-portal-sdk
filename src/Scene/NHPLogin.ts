
import * as style from '../../assets/css/common.css'
import NHPScene from "./NHPScene";
import $ from "jquery";
var styleLogin = require("../../assets/css/Login/login.css");
export default class NHPLogin extends NHPScene{

    loginSceneDiv:any;

    registerPopupDiv:any;
    loginAsPopupDiv:any;
    public getSceneDiv(){
        return this.loginSceneDiv;
    }

    constructor(){
        super();
        if($( "#nhp-login" ).length){//if div exists
            this.loginSceneDiv = $( "#nhp-login" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.loginSceneDiv = $("<div id='nhp-login'/>");
            this.loginSceneDiv.appendTo(super.getOverlayDiv());
        } 

        this.constructRegisterName();
        this.constructLoginName();
    }

    constructRegisterName(){
        if($( "#nhp-register" ).length){//if div exists
            this.registerPopupDiv = $( "#nhp-register" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.registerPopupDiv = $("<div id='nhp-register'/>");
            this.registerPopupDiv.appendTo(this.loginSceneDiv);
        } 
    }

    constructLoginName(){
        if($( "#nhp-loginas" ).length){//if div exists
            this.loginAsPopupDiv = $( "#nhp-loginas" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.loginAsPopupDiv = $("<div id='nhp-loginas'/>");
            this.loginAsPopupDiv.appendTo(this.loginSceneDiv);
        } 
    }
}