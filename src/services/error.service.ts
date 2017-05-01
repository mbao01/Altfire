export class ErrorService {

    /**
     * Returns User friendly formatted error
     * @param error
     * @returns {any}
     */
    clean(error) {
        let d_error: any;
        let f_code = this.formatCode(error.code);
        switch(error.code) {
            case 'auth/app-deleted':
                d_error.message = error.message;
                break;
            case 'auth/app-not-authorized':
                d_error.message = error.message;
                break;
            case 'auth/argument-error':
                d_error.message = error.message;
                break;
            case 'auth/invalid-api-key':
                d_error.message = error.message;
                break;
            case 'auth/invalid-user-token':
                d_error.message = error.message;
                break;
            case 'auth/network-request-failed':
                d_error.message = error.message;
                break;
            case 'auth/operation-not-allowed':
                d_error.message = error.message;
                break;
            case 'auth/requires-recent-login':
                d_error.message = error.message;
                break;
            case 'auth/too-many-requests':
                d_error.message = error.message;
                break;
            case 'auth/unauthorized-domain':
                d_error.message = error.message;
                break;
            case 'auth/user-disabled':
                d_error.message = error.message;
                break;
            case 'auth/user-token-expired':
                d_error.message = error.message;
                break;
            case 'auth/web-storage-unsupported':
                d_error.message = error.message;
                break;
            default:
                d_error.message = 'UNKNOWN ERROR OCCURRED';
                break;
        }
        d_error.code = f_code;
        return d_error;
    }

    /**
     * Replace error code {auth/unknown-error} to {unknown_error}
     * @param code
     * @returns {string}
     */
    formatCode(code: string) {
        return code.replace(/^auth/, '').replace(/-/gi, '_');
    }
}