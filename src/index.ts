import NHPScript from "./NHPScript";

export {}
declare global {
    interface Window { NHPScript:NHPScript}
}

window.NHPScript = new NHPScript();