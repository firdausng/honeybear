
import type {AuthenticationResponse} from "@workos-inc/node";
import jwt from "@tsndr/cloudflare-worker-jwt";
import type {WorkOSToken} from "$lib/server/auth-service.svelte";
import {createRemoteJWKSet, jwtVerify} from "jose";

export class AuthenticationManager {
    #state = $state<AuthenticationState>({
        authData: undefined,
    })
    
    #sessionId = $derived.by(()=>{
        const accessToken = this.#state.authData?.accessToken;
        if(accessToken === undefined){
            return undefined;
        }
        
        const verifiedToken = jwt.decode<WorkOSToken>(accessToken);
        return verifiedToken.payload.sid;
    });

    get authState(){
        return this.#state.authData;
    }
    
    get sessionId(){
        return this.#sessionId;
    }

    public setAuthenticationResponse(response: AuthenticationResponse){
        this.#state.authData = response;
    }
    
    public clearSession(){
        this.#state.authData = undefined;
    }
    
    public async verifiedSession(jwtkUrl: URL){
        const accessToken = this.#state.authData?.accessToken;
        if(accessToken === undefined){
            return false;
        }
        
        const jwks = createRemoteJWKSet(jwtkUrl);
        const verifiedToken = await jwtVerify(accessToken, jwks);
        return jwtVerify(accessToken, jwks);
    }
}

export type AuthenticationState = {
    authData?: AuthenticationResponse
}

export const authManager = new AuthenticationManager();