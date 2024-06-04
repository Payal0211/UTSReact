import axios from 'axios';
import { errorDebug } from 'shared/utils/error_debug_utils';

export class HttpServices {
	_contentType = 'application/json; charset=UTF-8';
	_formType = 'multipart/form-data';

	get dataToSend() {
		return this._dataToSend;
	}

	get URL() {
		return this._URL;
	}

	set URL(url) {
		this._URL = url;
	}

	set setAuthToken(authToken) {
		this._authToken = authToken;
	}

	set setAuthRequired(authRequired) {
		this._isAuthRequired = authRequired;
	}

	set dataToSend(data) {
		this._dataToSend = data;
	}

	/**
	 * @Function SEND_POST_REQUEST()
	 * @Methods axios.POST()
	 * @Returns An Object
	 */

	async sendPostRequest() {
		try {
			const response = await axios.post(
				this._URL, // URL Passing
				this._dataToSend, // Data-Body Passing
				{
					headers: {
						'Content-Type': this._contentType,
						Authorization: this._isAuthRequired && this._authToken,
					},
				},
			);

			return {
				statusCode: response.status,
				responseBody: response.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendPostRequest()',
			);

			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
			};
		}
	}

	async sendPostRequestFullResponse() {
		try {
			const response = await axios.post(
				this._URL, // URL Passing
				this._dataToSend, // Data-Body Passing
				{
					headers: {
						'Content-Type': this._contentType,
						Authorization: this._isAuthRequired && this._authToken,
					},
				},
			);
			
			return {
				statusCode: response.status,
				responseBody: response,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendPostRequest()',
			);
			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
				details:error.response?.data?.details

			};
		}
	}

	async sendFileDataPostRequest() {
		try {
			const response = await axios.post(
				this._URL, // URL Passing
				this._dataToSend, // Data-Body Passing
				{
					headers: {
						'Content-Type': this._formType,
						Authorization: this._isAuthRequired && this._authToken,
					},
				},
			);

			return {
				statusCode: response.status,
				responseBody: response.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendPostRequest()',
			);

			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
			};
		}
	}

	/**
	 * @Function SEND_GET_REQUEST()
	 * @Methods axios.GET()
	 * @Returns An Object
	 */

	async sendGetRequest() {
		try {
			const response = await axios.get(this._URL, {
				headers: {
					'Content-Type': this._contentType,
					Authorization: this._isAuthRequired && this._authToken,
					"ngrok-skip-browser-warning":"69420",
				},
			});
			return {
				statusCode: response.status,
				responseBody: response?.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendGetRequest()',
			);
			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
			};
		}
	}

	async sendGetRequestHeader(data) {
		try {
			const response = await axios.get(this._URL, {
				headers: {
					'Content-Type': this._contentType,
					Authorization: this._isAuthRequired && this._authToken,
					"EmailID":data
				},
			});

			return {
				statusCode: response.status,
				responseBody: response.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendGetRequest()',
			);
			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
			};
		}
	}

		/**
	 * @Function SEND_GET_REQUEST_FILE_DOWNLOAD()
	 * @Methods axios.POST()
	 * @Returns An Object
	 */

		async sendPostRequestForDownloadFile() {
			try {
				const response = await axios.post(this._URL,this._dataToSend, {
					responseType : 'blob',
					headers: {
						'Content-Type': this._contentType,
						Authorization: this._isAuthRequired && this._authToken,
					},
				});
				if(response?.status === 401){
					localStorage.clear();
					window.location.reload();
					return
				}
				return {
					statusCode: response.status,
					responseBody: response.data,
				};
			} catch (error) {
				const errorResult = errorDebug(
					error.response.data,
					'httpServices.sendGetRequest()',
				);
				if(errorResult?.statusCode === 401){
					localStorage.clear();
					window.location.reload();
					return
				}
				return {
					statusCode: errorResult.statusCode,
					responseBody: errorResult.responseBody,
				};
			}
		}

	async sendGetRequestWithErrData() {
		try {
			const response = await axios.get(this._URL, {
				headers: {
					'Content-Type': this._contentType,
					Authorization: this._isAuthRequired && this._authToken,
				},
			});

			return {
				statusCode: response.status,
				responseBody: response.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendGetRequest()',
			);
			return {
				statusCode: errorResult.statusCode,
				responseBody: error.response.data,
			};
		}
	}


	/**
	 * @Function SEND_PUT_REQUEST()
	 * @Methods axios.PUT()
	 * @Returns An Object
	 */

	async sendPutRequest() {
		try {
			const response = await axios.put(this._URL, this._dataToSend, {
				headers: {
					'Content-Type': this._contentType,
					Authorization: this._isAuthRequired && this._authToken,
				},
			});
			return {
				statusCode: response.status,
				responseBody: response.data,
			};
		} catch (error) {
			const errorResult = errorDebug(
				error.response.data,
				'httpServices.sendPutRequest()',
			);
			return {
				statusCode: errorResult.statusCode,
				responseBody: errorResult.responseBody,
			};
		}
	}

	//TODO:- Implementation
	async sendDeleteRequest() {}
}
