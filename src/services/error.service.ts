export class ErrorService {

    /**
     * Returns User friendly formatted error
     * @param error
     * @returns {any}
     */
    clean(error) {
        const d_error = {code: 'ERROR_UNKNOWN', message: 'Something Went Wrong, Please restart app', type: 'UNKNOWN'};
        if(error && error.code && error.message) {
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
                case 'auth/wrong-password':
                    d_error.message = error.message;
                    break;
                case 'auth/provider-already-linked':
                    d_error.message = error.message;
                    break;
                case 'auth/invalid-credential':
                    d_error.message = error.message;
                    break;
                case 'auth/credential-already-in-use':
                    d_error.message = error.message;
                    break;
                case 'auth/invalid-email':
                    d_error.message = error.message;
                    break;
                case 'auth/user-not-found':
                    d_error.message = error.message;
                    break;
                case 'auth/user-mismatch':
                    d_error.message = error.message;
                    break;
                case '':
                    d_error.message = error.message;
                    break;
                default:
                    d_error.message = 'UNKNOWN ERROR OCCURRED';
                    break;
            }
            let f_data = this.formatCode(error.code);
            d_error.code = f_data.code || '';
            d_error.type = f_data.type || '';
        }
        return d_error;
    }

    /**
     * Replace error code {auth/unknown-error} to {unknown_error}
     * @param code
     * @returns {string}
     */
    formatCode(code: string) {
        let type = code.replace(/(?!.+\/).+/, '');
        code = code.replace(/.+\//, '').replace(/-/gi, '_');
        return { type: type, code: code };
    }
}