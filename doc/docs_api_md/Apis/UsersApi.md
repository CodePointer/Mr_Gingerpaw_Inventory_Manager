# UsersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deactivateMeUsersMeDeactivatePost**](UsersApi.md#deactivateMeUsersMeDeactivatePost) | **POST** /users/me/deactivate | Deactivate Me |
| [**getMeUsersMeGet**](UsersApi.md#getMeUsersMeGet) | **GET** /users/me | Get Me |
| [**getMyFamiliesUsersMeFamiliesGet**](UsersApi.md#getMyFamiliesUsersMeFamiliesGet) | **GET** /users/me/families | Get My Families |
| [**getMyMembershipsUsersMeMembershipsGet**](UsersApi.md#getMyMembershipsUsersMeMembershipsGet) | **GET** /users/me/memberships | Get My Memberships |
| [**updateMeBasicUsersMeUpdatePut**](UsersApi.md#updateMeBasicUsersMeUpdatePut) | **PUT** /users/me/update | Update Me Basic |
| [**updateMePasswordUsersMePasswordPatch**](UsersApi.md#updateMePasswordUsersMePasswordPatch) | **PATCH** /users/me/password | Update Me Password |
| [**updateMeResetQuestionUsersMeResetQuestionPut**](UsersApi.md#updateMeResetQuestionUsersMeResetQuestionPut) | **PUT** /users/me/reset-question | Update Me Reset Question |


<a name="deactivateMeUsersMeDeactivatePost"></a>
# **deactivateMeUsersMeDeactivatePost**
> UserOut deactivateMeUsersMeDeactivatePost(UserDelete)

Deactivate Me

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserDelete** | [**UserDelete**](../Models/UserDelete.md)|  | |

### Return type

[**UserOut**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getMeUsersMeGet"></a>
# **getMeUsersMeGet**
> UserOut getMeUsersMeGet()

Get Me

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserOut**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getMyFamiliesUsersMeFamiliesGet"></a>
# **getMyFamiliesUsersMeFamiliesGet**
> List getMyFamiliesUsersMeFamiliesGet()

Get My Families

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/FamilyOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getMyMembershipsUsersMeMembershipsGet"></a>
# **getMyMembershipsUsersMeMembershipsGet**
> List getMyMembershipsUsersMeMembershipsGet()

Get My Memberships

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/MembershipOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateMeBasicUsersMeUpdatePut"></a>
# **updateMeBasicUsersMeUpdatePut**
> UserOut updateMeBasicUsersMeUpdatePut(UserUpdateBasic)

Update Me Basic

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserUpdateBasic** | [**UserUpdateBasic**](../Models/UserUpdateBasic.md)|  | |

### Return type

[**UserOut**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateMePasswordUsersMePasswordPatch"></a>
# **updateMePasswordUsersMePasswordPatch**
> UserOut updateMePasswordUsersMePasswordPatch(UserUpdatePassword)

Update Me Password

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserUpdatePassword** | [**UserUpdatePassword**](../Models/UserUpdatePassword.md)|  | |

### Return type

[**UserOut**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateMeResetQuestionUsersMeResetQuestionPut"></a>
# **updateMeResetQuestionUsersMeResetQuestionPut**
> UserOut updateMeResetQuestionUsersMeResetQuestionPut(UserUpdateResetQuestion)

Update Me Reset Question

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserUpdateResetQuestion** | [**UserUpdateResetQuestion**](../Models/UserUpdateResetQuestion.md)|  | |

### Return type

[**UserOut**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

