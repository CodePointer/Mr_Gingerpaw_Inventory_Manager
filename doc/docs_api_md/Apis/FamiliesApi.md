# FamiliesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createFamilyFromMeFamiliesPost**](FamiliesApi.md#createFamilyFromMeFamiliesPost) | **POST** /families/ | Create Family From Me |
| [**deactivateFamilyFromMeFamiliesFamilyIdDelete**](FamiliesApi.md#deactivateFamilyFromMeFamiliesFamilyIdDelete) | **DELETE** /families/{family_id} | Deactivate Family From Me |
| [**getFamilyDetailsFamiliesFamilyIdGet**](FamiliesApi.md#getFamilyDetailsFamiliesFamilyIdGet) | **GET** /families/{family_id} | Get Family Details |
| [**getFamilyMembersFamiliesFamilyIdMembersGet**](FamiliesApi.md#getFamilyMembersFamiliesFamilyIdMembersGet) | **GET** /families/{family_id}/members | Get Family Members |
| [**updateFamilyFromMeFamiliesFamilyIdPut**](FamiliesApi.md#updateFamilyFromMeFamiliesFamilyIdPut) | **PUT** /families/{family_id} | Update Family From Me |


<a name="createFamilyFromMeFamiliesPost"></a>
# **createFamilyFromMeFamiliesPost**
> FamilyOut createFamilyFromMeFamiliesPost(FamilyCreate)

Create Family From Me

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **FamilyCreate** | [**FamilyCreate**](../Models/FamilyCreate.md)|  | |

### Return type

[**FamilyOut**](../Models/FamilyOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deactivateFamilyFromMeFamiliesFamilyIdDelete"></a>
# **deactivateFamilyFromMeFamiliesFamilyIdDelete**
> FamilyOut deactivateFamilyFromMeFamiliesFamilyIdDelete(family\_id)

Deactivate Family From Me

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |

### Return type

[**FamilyOut**](../Models/FamilyOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getFamilyDetailsFamiliesFamilyIdGet"></a>
# **getFamilyDetailsFamiliesFamilyIdGet**
> FamilyOut getFamilyDetailsFamiliesFamilyIdGet(family\_id)

Get Family Details

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |

### Return type

[**FamilyOut**](../Models/FamilyOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getFamilyMembersFamiliesFamilyIdMembersGet"></a>
# **getFamilyMembersFamiliesFamilyIdMembersGet**
> List getFamilyMembersFamiliesFamilyIdMembersGet(family\_id)

Get Family Members

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |

### Return type

[**List**](../Models/UserOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateFamilyFromMeFamiliesFamilyIdPut"></a>
# **updateFamilyFromMeFamiliesFamilyIdPut**
> FamilyOut updateFamilyFromMeFamiliesFamilyIdPut(family\_id, FamilyUpdate)

Update Family From Me

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **FamilyUpdate** | [**FamilyUpdate**](../Models/FamilyUpdate.md)|  | |

### Return type

[**FamilyOut**](../Models/FamilyOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

