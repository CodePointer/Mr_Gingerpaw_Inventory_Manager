# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**loginAuthLoginPost**](AuthApi.md#loginAuthLoginPost) | **POST** /auth/login | Login |
| [**registerAuthRegisterPost**](AuthApi.md#registerAuthRegisterPost) | **POST** /auth/register | Register |
| [**resetPasswordAuthResetPasswordPatch**](AuthApi.md#resetPasswordAuthResetPasswordPatch) | **PATCH** /auth/reset-password | Reset Password |
| [**resetQuestionAuthResetQuestionPost**](AuthApi.md#resetQuestionAuthResetQuestionPost) | **POST** /auth/reset-question | Reset Question |
| [**verifyAnswerAuthVerifyAnswerPost**](AuthApi.md#verifyAnswerAuthVerifyAnswerPost) | **POST** /auth/verify-answer | Verify Answer |


<a name="loginAuthLoginPost"></a>
# **loginAuthLoginPost**
> TokenResponse loginAuthLoginPost(LoginRequest)

Login

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **LoginRequest** | [**LoginRequest**](../Models/LoginRequest.md)|  | |

### Return type

[**TokenResponse**](../Models/TokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="registerAuthRegisterPost"></a>
# **registerAuthRegisterPost**
> TokenResponse registerAuthRegisterPost(RegisterRequest)

Register

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **RegisterRequest** | [**RegisterRequest**](../Models/RegisterRequest.md)|  | |

### Return type

[**TokenResponse**](../Models/TokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="resetPasswordAuthResetPasswordPatch"></a>
# **resetPasswordAuthResetPasswordPatch**
> TokenResponse resetPasswordAuthResetPasswordPatch(ResetPasswordRequest)

Reset Password

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ResetPasswordRequest** | [**ResetPasswordRequest**](../Models/ResetPasswordRequest.md)|  | |

### Return type

[**TokenResponse**](../Models/TokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="resetQuestionAuthResetQuestionPost"></a>
# **resetQuestionAuthResetQuestionPost**
> ResetQuestionResponse resetQuestionAuthResetQuestionPost(ResetQuestionRequest)

Reset Question

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ResetQuestionRequest** | [**ResetQuestionRequest**](../Models/ResetQuestionRequest.md)|  | |

### Return type

[**ResetQuestionResponse**](../Models/ResetQuestionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="verifyAnswerAuthVerifyAnswerPost"></a>
# **verifyAnswerAuthVerifyAnswerPost**
> ResetTokenResponse verifyAnswerAuthVerifyAnswerPost(VerifyAnswerRequest)

Verify Answer

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **VerifyAnswerRequest** | [**VerifyAnswerRequest**](../Models/VerifyAnswerRequest.md)|  | |

### Return type

[**ResetTokenResponse**](../Models/ResetTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

