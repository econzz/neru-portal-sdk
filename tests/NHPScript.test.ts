import NHPScript from "../src/NHPScript";


export {}
declare global {
    interface Window { NHPScript:NHPScript}
}

window.NHPScript = new NHPScript();

describe('initializePlayer', function() {
  it('should generate new ID for new player', function() {
    return window.NHPScript.initialize().then(function(){
      expect(window.NHPScript.player).toBeDefined();
    }).catch(function(e:any){
      expect(window.NHPScript.player).toBeDefined();
    });
  });
});
