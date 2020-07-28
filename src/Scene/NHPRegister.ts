// import { PLAYER } from "../types/NHPType";

// var styleLogin = require("../../assets/css/Login/login.css");
// export default class NHPRegister{
//     registerPopupDiv:any;
//     constructor(){
//         if($( "#nhp-register" ).length){//if div exists
//             this.registerPopupDiv = $( "#nhp-register" ); //use it
//         }
//         else{
//             //if it is not existed, create and append to body
//             this.registerPopupDiv = $("<div id='nhp-register'/>");
//             this.registerPopupDiv.attr("class",styleLogin["register-popup"]);

//         }

//         this.constructRegisterName();
//         this.hideRegisterNickName();
//     }

//     setData(player:PLAYER){
//         $("#nhp-nickname-field").val(player.name);

//     }

//     registerCallBack(onClosed:(nickname:string)=>void){
//         var self = this;
//         $("#nhp-button-nickname").click(function(e){
//             e.preventDefault();
            
//             let nickName:string = ""+$("#nhp-nickname-field").val();
//             console.log(nickName);
//             self.hideRegisterNickName();

//             onClosed(nickName);
            
//         });

//         $("#nhp-button-nickname-later").click(function(e){
//             e.preventDefault();

//             let nickName:string = ""+$("#nhp-nickname-field").val();
//             console.log(nickName);
//             self.hideRegisterNickName();

//             onClosed(nickName);
//         });
//     }

//     hideRegisterNickName(){
//         this.registerPopupDiv.hide();
//     }

//     showRegisterNickName(isFirst:boolean){ 
//         if(!isFirst){
//             $("#nhp-nickname-label").html("Greetings! <br>Update your nickname to use in the games!");
//         }
//         this.registerPopupDiv.show();
//     }

//     constructRegisterName(){
       
//         //title
//         let titleLabel = $("<div/>").attr({id: 'nhp-nickname-label'});
//         titleLabel.attr("class",styleLogin["register-popup-label"]);
//         titleLabel.html("Looks like you are New here! <br>Enter your nickname to use in the games!");
//         titleLabel.appendTo(this.registerPopupDiv);
//         //textfield
//         let textField = $('<input/>').attr({ type: 'text', id: 'nhp-nickname-field', name: 'nhp-nickname-field', class:styleLogin["register-popup-textfield"]});
//         textField.show().focus();
//         textField.appendTo(this.registerPopupDiv);

//         //submit
//         let submitButton = $('<button/>', { text: 'Submit', id: 'nhp-button-nickname', class:styleLogin["register-popup-submit"]});
//         submitButton.appendTo(this.registerPopupDiv);

//         //later
//         let cancelButton = $('<button/>', { text: 'Later', id: 'nhp-button-nickname-later', class:styleLogin["register-popup-submit-later"]});
//         cancelButton.appendTo(this.registerPopupDiv);
//     }
// }