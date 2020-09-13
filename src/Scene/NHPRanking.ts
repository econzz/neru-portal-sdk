var styleRanking = require("../../assets/css/Ranking/ranking.css");
import $ from "jquery";
import 'slick-carousel';
import { PLAYER, RANKING, RANKING_DATA } from "../types/NHPType";
import NHPScript from "../NHPScript";
export default class NHPRanking{

    rankingSceneDiv:any;

    rankingPopupDiv:any;
    rankingScrollableContentDiv:any;

    currentScale:number;

    constructor(){
        if($( "#nhp-ranking" ).length){//if div exists
            this.rankingSceneDiv = $( "#nhp-ranking" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.rankingSceneDiv = $("<div id='nhp-ranking'/>");
            this.rankingSceneDiv.hide();
        } 

        this.constructRanking();

        
    }

    onWindowResize(){

        let rankingSceneDiv = $( "#nhp-ranking" );
		var elWidth,elHeight,windowWidth,windowHeight;
		
		
		elWidth = 400; 
		elHeight = 520;
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		
		
		this.currentScale = Math.min(
			(windowWidth/elWidth) * 0.8,    
			(windowHeight/elHeight) * 0.8
        );
        
        if(this.currentScale > 1.2)
            this.currentScale = 1.2;
        
        rankingSceneDiv.css("zoom",this.currentScale);
	}

    
    constructRanking(){
        if($( "#nhp-ranking-popup" ).length){//if div exists
            this.rankingPopupDiv = $( "#nhp-ranking-popup" ); //use it
        }
        else{
            //if it is not existed, create and append to body
            this.rankingPopupDiv = $("<div id='nhp-ranking-popup'/>");
            this.rankingPopupDiv.attr("class",styleRanking["ranking-popup"]);
            this.rankingPopupDiv.appendTo(this.rankingSceneDiv);
        }

        let upperDiv = $("<div id='nhp-ranking-upper'/>").attr("class",styleRanking["ranking-upper"]);
        upperDiv.appendTo(this.rankingPopupDiv);

        $("<div/>").attr("class",styleRanking["nhp-ranking-upper-label"]).html("RANKING").appendTo(upperDiv);

        let yourAchievedSScore = $("<div/>").attr("class",styleRanking["ranking-upper-achieved"]).appendTo(upperDiv);

        $("<div/>").attr("class",styleRanking["ranking-upper-label-achievedscore"]).html("YOUR ACHIEVED SCORE").appendTo(yourAchievedSScore);
        $("<div/>").attr({id:"nhp-ranking-achievedscore", class:styleRanking["ranking-upper-achievedscore"]}).html("999").appendTo(yourAchievedSScore);
        $("<div/>").attr("class",styleRanking["ranking-upper-label-achievedrank"]).html("Rank:").appendTo(yourAchievedSScore);
        $("<div/>").attr({id:"nhp-ranking-ranked",class:styleRanking["ranking-upper-achievedrank"]}).html("1").appendTo(yourAchievedSScore);

        
        $("<div/>").attr("class",styleRanking["ranking-upper-rankingLabel-rank"]).html("Rank").appendTo(upperDiv);
        $("<div/>").attr("class",styleRanking["ranking-upper-rankingLabel-name"]).html("Name").appendTo(upperDiv);
        $("<div/>").attr("class",styleRanking["ranking-upper-rankingLabel-score"]).html("Score").appendTo(upperDiv);
        // $("<div/>").attr("class",styleRanking["nhp-ranking-upper-label"]).html("xxx").appendTo(upperDiv);
        // $("<div/>").attr("class",styleRanking["nhp-ranking-upper-label"]).html("YOUR RANK").appendTo(upperDiv);
        // $("<div/>").attr("class",styleRanking["nhp-ranking-upper-label"]).html("yyy").appendTo(upperDiv);

        this.rankingScrollableContentDiv =  $("<div id='nhp-ranking-scrollable'/>").attr("class",styleRanking["ranking-scrollable"]);
        this.rankingScrollableContentDiv.appendTo(this.rankingPopupDiv);
        


        

        let lowerDiv = $("<div id='nhp-ranking-lower'/>").attr("class",styleRanking["ranking-lower"]);
        lowerDiv.appendTo(this.rankingPopupDiv);
        

        let closeButton = $('<button/>', { text: 'Close', id: 'nhp-ranking-lower-close', class:styleRanking["ranking-lower-close"]});
        closeButton.appendTo(lowerDiv);
        var self = this;
        closeButton.click(function(e){
            self.hideRanking();
            
        });

        
    }
    

    loadRankingData(rankingData:RANKING){
        this.rankingScrollableContentDiv.empty();
        //this.rankingScrollableContentDiv.slick("unslick");
        

        for(let i = 0; i< rankingData.ranks.length;i++){
            let rankData:RANKING_DATA = rankingData.ranks[i];

            if(rankData.player.id === rankingData.myPlayer.id){
                $("#nhp-ranking-ranked").html(""+rankData.rank);
            }

            let rowDiv = $("<div/>").attr("class",styleRanking["ranking-row"]);

            $("<div/>").attr("class",styleRanking["ranking-row-rank"]).html(""+rankData.rank).appendTo(rowDiv);
            $("<div/>").attr("class",styleRanking["ranking-row-name"]).html(""+rankData.player.name).appendTo(rowDiv);
            $("<div/>").attr("class",styleRanking["ranking-row-score"]).html(""+rankData.score).appendTo(rowDiv);
            rowDiv.appendTo(this.rankingScrollableContentDiv);
        }

        this.rankingScrollableContentDiv.slick({
            infinite:false,
            vertical: true,
            verticalSwiping: true,
            slidesToShow:10,
            focusOnSelect:false,
            touchThreshold:15,
            slidesToScroll: 10,
            prevArrow: false,
            nextArrow: false
        });
    }

    showRanking(myAchievedScore:number,data:RANKING){
        $("#nhp-ranking-achievedscore").html(""+myAchievedScore);

        this.loadRankingData(data);

        this.rankingSceneDiv.show();
        this.rankingSceneDiv.css("zoom",this.currentScale*0.2);
        this.rankingSceneDiv.css("top","-100px");
        this.rankingSceneDiv.css("opacity","0");
        this.rankingSceneDiv.animate({zoom: this.currentScale,opacity:"1"},500,function(){
            //callback
        });
    }

    hideRanking(){
        this.rankingScrollableContentDiv.slick("unslick");
        var self = this;
        this.rankingSceneDiv.animate({opacity:"0"},500,function(){
            //callback
            self.rankingSceneDiv.hide();
        });
    }
}