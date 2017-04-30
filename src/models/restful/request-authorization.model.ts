export interface ReqAuthorization {
    basic_auth?: {
        username: string;
        password: string;
    };
    digest_auth?: {
        username?: string;
        realm?: string;
        nonce?: string;
        algorithm?: string;
        qop?: string;
        nonce_count?: number;
        nonce_client?: string;
        opaque?: string;
    };
    oauth1?: {
        consumer_key?: string;
        consumer_secret?: string;
        token?: string;
        token_secret?: string;
        signature_method?: string;
        timestamp?: string;
        nonce?: string;
        version?: string;
        realm?: string;
    };
    oauth2?: {
        hawk_auth_id?: string;
        hawk_auth_key?: string;
        algorithm?: string;
        user?: string;
        nonce?: string;
        extra_data_ext?: string;
        app_id?: string;
        delegation?: string;
        timestamp?: string;
    };
    aws?: {
        access_key?: string;
        secret_key?: string;
        aws_region?: string;
        service_name?: string;
    };
}