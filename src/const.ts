import { ENVIRONMENT,ASSET_LIST } from "./types/NHPType";

export const LIVE_SERVER_URL:string = "https://portal.neruchan.com";
export const DEV_SERVER_URL:string = "https://portal.neruchan.com";
export const LOCAL_SERVER_URL:string = "http://localhost:3000";
export const API_VERSION:string = "v1";

export const SDK_VERSION:string = "v1.0";

export const CURRENT_ENV:ENVIRONMENT = ENVIRONMENT.LIVE;

export const SAVE_DATA_KEY:string = "NHP_savekey";
export const SAVE_DATA_KEY_LIVE:string = "NHP_savekey_LIVE";
export const SAVE_VERSION:number = 2;

export const DEFAULT_PLAYER_NAME:string = "New Player";

export const assets:ASSET_LIST = {
    homeScene:{
        background:"https://portal.neruchan.com/sdk/"+SDK_VERSION+"/img/home/bg_home.png",
        home:"https://portal.neruchan.com/sdk/"+SDK_VERSION+"/img/home/home.png"
    }
};