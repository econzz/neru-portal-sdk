import $ from "jquery";
var styleCommon = require("../../assets/css/common.css");
export default class NHPScene{
    
    private sceneDiv:any;
    public getSceneDiv(){
        return this.sceneDiv;
    }

    private overlayDiv:any;
    public getOverlayDiv(){
        return this.overlayDiv;
    }


    constructor(){
        if($( "#nhp-scene" ).length){//if div exists
            this.sceneDiv = $( "#nhp-scene" ); //use it
            return;
        }

        //if it is not existed, create and append to body
        this.sceneDiv = $("<div id='nhp-scene'/>");
        

        this.constructOverlay();

        this.sceneDiv.appendTo('body');
    }

    

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

}