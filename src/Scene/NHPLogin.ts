
import $ from "jquery";
import { ERROR_CODE, ERROR, PLAYER } from "../types/NHPType";
import NHPScript from "../NHPScript";
var styleLogin = require("../../assets/css/Login/login.css");
/**
 * Class that construct register and login form for SDK
 */
export default class NHPLogin{

    loginSceneDiv:any;//parent

    registerPopupDiv:any;
    loginAsPopupDiv:any;

    currentRegisterPopupScale:number;
    currentLoginPopupScale:number;

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

        //this.hideRegisterNickName();
        // this.hideLoginPopup();

        
    }

    /**
     * called when window is resized
     */
    onWindowResize(){
        let registerSceneDiv = $( "#nhp-register" );
        let loginAsSceneDiv = $( "#nhp-loginas" );
        var elWidth,elHeight;
        var elRegisterWidth,elRegisterHeight;
        var windowWidth,windowHeight;
		
		elWidth = 400; 
        elHeight = 80;
        
        elRegisterWidth = 300;
        elRegisterHeight = 350;

		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		
		
		this.currentLoginPopupScale = Math.min(
			(windowWidth/elWidth) * 0.8,    
			(windowHeight/elHeight) * 0.8
        );

        this.currentRegisterPopupScale = Math.min(
			(windowWidth/elRegisterWidth) * 0.8,    
			(windowHeight/elRegisterHeight) * 0.8
        );
        
        if(this.currentLoginPopupScale > 1.2)
            this.currentLoginPopupScale = 1.2;

        if(this.currentRegisterPopupScale > 1.2)
        this.currentRegisterPopupScale = 1.2;
        
        loginAsSceneDiv.css("zoom",this.currentLoginPopupScale);

        registerSceneDiv.css("zoom",this.currentRegisterPopupScale);

	}

    /**
     * set data to appropriate field text
     * @param player {PLAYER} playerData
     */
    setData(player:PLAYER){
        $("#nhp-nickname-field").val(player.name);

        $("#nhp-loginas-nickname-label").html("welcome "+player.name+"!");
    }

    /**
     * show register nickname form
     * @param isFirst {boolean} is new player or not
     */
    showRegisterNickName(isFirst:boolean){ 
        if(!isFirst){ //名前の更新するため
            $("#nhp-nickname-label").html("Greetings! <br>Update your nickname to use in the games!");
        }
        this.loginSceneDiv.show();
        this.registerPopupDiv.show();
        this.registerPopupDiv.css("zoom",this.currentRegisterPopupScale * 0.2);
        this.registerPopupDiv.css("opacity","0");
        this.registerPopupDiv.animate({zoom: this.currentRegisterPopupScale,opacity:"1"},500,function(){
            //callback
        });
    }

    /**
     * hide register nickname form
     */
    hideRegisterNickName(){
        this.loginSceneDiv.hide();
        
        var self = this;
        this.registerPopupDiv.animate({opacity:"0"},500,function(){
            //callback
            self.registerPopupDiv.hide();
        });
    }

    /**
     * show login popup, for registered player
     */
    showLoginPopup(){
        this.loginSceneDiv.show();
        this.loginAsPopupDiv.show();
        this.loginAsPopupDiv.css("top","-100px");
        this.loginAsPopupDiv.css("opacity","0");
        this.loginAsPopupDiv.animate({top: "0px",opacity:"1"},500,function(){
            //callback
        });
        var self = this;
        setTimeout(function(){
            self.loginAsPopupDiv.animate({top: "-100px",opacity:"0"},500,function(){
                //callback
            });
        },2000);
    }
    /**
     * hide login popup
     */
    hideLoginPopup(isSwitching?:boolean){
        if(isSwitching === false){
            this.loginSceneDiv.hide();
        }
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

    /**
     * construct register html 
     */
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

        this.registerPopupDiv.hide();
    }

    /**
     * construct login popup html
     */
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
        this.loginAsPopupDiv.hide();
        // setTimeout(function(){
        //     self.hideLoginPopup();
        // },2000);
    }
}