import NHPScript from "./NHPScript";

export {}
declare global {
    interface Window { NHPScript:NHPScript}
}

//NHPScript window declaration
window.NHPScript = new NHPScript();