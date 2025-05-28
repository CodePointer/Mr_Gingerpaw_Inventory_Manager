# TagsPerFamilyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createNewTagFamiliesFamilyIdTagsPost**](TagsPerFamilyApi.md#createNewTagFamiliesFamilyIdTagsPost) | **POST** /families/{family_id}/tags/ | Create New Tag |
| [**getFamilyTagsFamiliesFamilyIdTagsGet**](TagsPerFamilyApi.md#getFamilyTagsFamiliesFamilyIdTagsGet) | **GET** /families/{family_id}/tags/ | Get Family Tags |
| [**modifyTagFamiliesFamilyIdTagsTagIdPut**](TagsPerFamilyApi.md#modifyTagFamiliesFamilyIdTagsTagIdPut) | **PUT** /families/{family_id}/tags/{tag_id} | Modify Tag |
| [**removeTagFamiliesFamilyIdTagsTagIdDelete**](TagsPerFamilyApi.md#removeTagFamiliesFamilyIdTagsTagIdDelete) | **DELETE** /families/{family_id}/tags/{tag_id} | Remove Tag |


<a name="createNewTagFamiliesFamilyIdTagsPost"></a>
# **createNewTagFamiliesFamilyIdTagsPost**
> TagOut createNewTagFamiliesFamilyIdTagsPost(family\_id, TagCreate)

Create New Tag

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **TagCreate** | [**TagCreate**](../Models/TagCreate.md)|  | |

### Return type

[**TagOut**](../Models/TagOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getFamilyTagsFamiliesFamilyIdTagsGet"></a>
# **getFamilyTagsFamiliesFamilyIdTagsGet**
> List getFamilyTagsFamiliesFamilyIdTagsGet(family\_id)

Get Family Tags

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |

### Return type

[**List**](../Models/TagOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="modifyTagFamiliesFamilyIdTagsTagIdPut"></a>
# **modifyTagFamiliesFamilyIdTagsTagIdPut**
> TagOut modifyTagFamiliesFamilyIdTagsTagIdPut(family\_id, tag\_id, TagUpdate)

Modify Tag

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tag\_id** | **Integer**|  | [default to null] |
| **TagUpdate** | [**TagUpdate**](../Models/TagUpdate.md)|  | |

### Return type

[**TagOut**](../Models/TagOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="removeTagFamiliesFamilyIdTagsTagIdDelete"></a>
# **removeTagFamiliesFamilyIdTagsTagIdDelete**
> TagOut removeTagFamiliesFamilyIdTagsTagIdDelete(family\_id, tag\_id)

Remove Tag

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tag\_id** | **Integer**|  | [default to null] |

### Return type

[**TagOut**](../Models/TagOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

