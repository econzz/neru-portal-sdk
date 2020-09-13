import $ from "jquery";
import { NHPHomeParameter, HOME_BUTTON_POSITION } from "../types/NHPType";
import NHPScript from "../NHPScript";
import { assets } from "../const";
var styleHome = require("../../assets/css/Home/home.css");
export default class NHPHome{
    
    homeSceneDiv: JQuery<HTMLElement>;
    aHrefHomeButton: JQuery<HTMLElement>;
    imageHomeButton: JQuery<HTMLElement>;
    constructor(){
        if($( "#nhp-home" ).length){//if div exists
            this.homeSceneDiv = $( "#nhp-home" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.homeSceneDiv = $("<div id='nhp-home'/>");
            this.homeSceneDiv.attr("class",styleHome["nhp-home"]);
            this.homeSceneDiv.css("left","-200px");
            this.homeSceneDiv.hide();
        } 

        this.constructHome();
    }

    onWindowResize(){
        let homeSceneDiv = $( "#nhp-home" );
		var elWidth,elHeight,windowWidth,windowHeight,scale;
		
		
		elWidth = 64; 
		elHeight = 44;
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		
		
		scale = Math.min(
			(windowWidth/elWidth) * 0.8,    
			(windowHeight/elHeight) * 0.8
        );
        
        if(scale > 1.2)
            scale = 1.2;
        
        homeSceneDiv.css("zoom",scale);
	}

    showElement(parameter:NHPHomeParameter){
        this.homeSceneDiv.css("left","-200px");
        if(!parameter.position || parameter.position === HOME_BUTTON_POSITION.TOP_LEFT){
            this.homeSceneDiv.css("bottom","");
            this.homeSceneDiv.css("top","0");
        }
        else if(parameter.position === HOME_BUTTON_POSITION.CENTER_LEFT){
            this.homeSceneDiv.css("bottom","40%");
            this.homeSceneDiv.css("top","");
        }
        else if(parameter.position === HOME_BUTTON_POSITION.BOTTOM_LEFT){
            this.homeSceneDiv.css("bottom","0");
            this.homeSceneDiv.css("top","");
        }
        this.homeSceneDiv.show();
        this.homeSceneDiv.animate({left: '0px'}, 1000, 'linear');
        
        this.aHrefHomeButton.unbind('click');
        if(parameter.url)
            this.aHrefHomeButton.attr("href",parameter.url)
       
        this.refreshAsset();
    }

    refreshAsset(){
        this.imageHomeButton.css("background-image","url('"+assets.homeScene.home+"')");
        this.homeSceneDiv.css("background-image","url('"+assets.homeScene.background+"')");
    }

    hideElement(){
        var self = this;
        this.homeSceneDiv.animate({left: '-200px'}, 1000, 'linear',function(){
            self.homeSceneDiv.hide();
        });
    }
    constructHome() {
        this.aHrefHomeButton = $("<a id='nhp-homehref'/>");
        
        this.imageHomeButton = $('<div>');
        this.imageHomeButton.attr("class",styleHome["nhp-homebutton"]);

        this.imageHomeButton.attr("class",styleHome["nhp-homebutton"]);
        
        this.imageHomeButton.appendTo(this.aHrefHomeButton);
        this.aHrefHomeButton.appendTo(this.homeSceneDiv);
    }
}