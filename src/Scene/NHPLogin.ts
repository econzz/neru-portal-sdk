
import $ from "jquery";
import { ERROR_CODE, ERROR, PLAYER } from "../types/NHPType";
var styleLogin = require("../../assets/css/Login/login.css");
export default class NHPLogin{

    loginSceneDiv:any;//parent

    registerPopupDiv:any;
    loginAsPopupDiv:any;


    constructor(){

        if($( "#nhp-login" ).length){//if div exists
            this.loginSceneDiv = $( "#nhp-login" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.loginSceneDiv = $("<div id='nhp-login'/>");
            this.loginSceneDiv.hide();
        } 

        this.constructRegisterName();
        this.constructLoginName();

        this.hideRegisterNickName();
        this.hideLoginPopup();
    }

    setData(player:PLAYER){
        $("#nhp-nickname-field").html(player.name);

        $("#nhp-loginas-nickname-label").html("welcome "+player.name+"!");
    }

    showRegisterNickName(isFirst:boolean){ 
        if(!isFirst){
            $("#nhp-nickname-label").html("Greetings! <br>Update your nickname to use in the games!");
        }
        this.loginSceneDiv.show();
        this.registerPopupDiv.show();
    }

    hideRegisterNickName(){
        this.loginSceneDiv.hide();
        this.registerPopupDiv.hide();
    }

    showLoginPopup(){
        this.loginSceneDiv.show();
        this.loginAsPopupDiv.show();
    }
    hideLoginPopup(){
        this.loginSceneDiv.hide();
        this.loginAsPopupDiv.hide();
    }

    registerCallBackOnUpdateName(onClosed:(nickname:string)=>void){
        var self = this;
        $("#nhp-button-nickname").click(function(e){
            e.preventDefault();
            
            let nickName:string = ""+$("#nhp-nickname-field").val();
            console.log(nickName);
            self.hideRegisterNickName();

            onClosed(nickName);
            
        });

        $("#nhp-button-nickname-later").click(function(e){
            e.preventDefault();

            let nickName:string = ""+$("#nhp-nickname-field").val();
            console.log(nickName);
            self.hideRegisterNickName();

            onClosed(nickName);
        });
    }

    constructRegisterName(){
        if($( "#nhp-register" ).length){//if div exists
            this.registerPopupDiv = $( "#nhp-register" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.registerPopupDiv = $("<div id='nhp-register'/>");
            this.registerPopupDiv.attr("class",styleLogin["register-popup"]);
            this.registerPopupDiv.appendTo(this.loginSceneDiv);
        }
        //title
        let titleLabel = $("<div/>").attr({id: 'nhp-nickname-label'});
        titleLabel.attr("class",styleLogin["register-popup-label"]);
        titleLabel.html("Looks like you are New here! <br>Enter your nickname to use in the games!");
        titleLabel.appendTo(this.registerPopupDiv);
        //textfield
        let textField = $('<input/>').attr({ type: 'text', id: 'nhp-nickname-field', name: 'nhp-nickname-field', class:styleLogin["register-popup-textfield"]});
        textField.show().focus();
        textField.appendTo(this.registerPopupDiv);

        //submit
        let submitButton = $('<button/>', { text: 'Submit', id: 'nhp-button-nickname', class:styleLogin["register-popup-submit"]});
        submitButton.appendTo(this.registerPopupDiv);

        //later
        let cancelButton = $('<button/>', { text: 'Later', id: 'nhp-button-nickname-later', class:styleLogin["register-popup-submit-later"]});
        cancelButton.appendTo(this.registerPopupDiv);
    }

    constructLoginName(){
        if($( "#nhp-loginas" ).length){//if div exists
            this.loginAsPopupDiv = $( "#nhp-loginas" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.loginAsPopupDiv = $("<div id='nhp-loginas'/>");
            this.loginAsPopupDiv.attr("class",styleLogin["loginas-popup"]);
            this.loginAsPopupDiv.appendTo(this.loginSceneDiv);
        }

        //title
        let titleLabel = $("<div/>").attr({id: 'nhp-loginas-nickname-label'});
        titleLabel.attr("class",styleLogin["loginas-popup-label"]);
        titleLabel.html("Greetings! xxx");
        titleLabel.appendTo(this.loginAsPopupDiv);

        //update
        let updateButton = $('<button/>', { text: 'Update', id: 'nhp-loginas-button-update', class:styleLogin["loginas-popup-update"]});
        updateButton.appendTo(this.loginAsPopupDiv);
        var self = this;
        updateButton.click(function(e){
            self.hideLoginPopup();
            self.showRegisterNickName(false);
        });

        // setTimeout(function(){
        //     self.hideLoginPopup();
        // },2000);
    }
}