# ItemsPerFamilyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch**](ItemsPerFamilyApi.md#addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch) | **PATCH** /families/{family_id}/items/bulk-add-tags | Add Tags To Item |
| [**createItemEndpointFamiliesFamilyIdItemsPost**](ItemsPerFamilyApi.md#createItemEndpointFamiliesFamilyIdItemsPost) | **POST** /families/{family_id}/items/ | Create Item Endpoint |
| [**getItemsByTagsFamiliesFamilyIdItemsGet**](ItemsPerFamilyApi.md#getItemsByTagsFamiliesFamilyIdItemsGet) | **GET** /families/{family_id}/items/ | Get Items By Tags |
| [**getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet**](ItemsPerFamilyApi.md#getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet) | **GET** /families/{family_id}/items/check-needed | Get Items Needing Check |
| [**markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch**](ItemsPerFamilyApi.md#markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch) | **PATCH** /families/{family_id}/items/bulk-check | Mark Items Checked |
| [**removeItemFamiliesFamilyIdItemsItemIdDelete**](ItemsPerFamilyApi.md#removeItemFamiliesFamilyIdItemsItemIdDelete) | **DELETE** /families/{family_id}/items/{item_id} | Remove Item |
| [**updateItemFamiliesFamilyIdItemsItemIdPut**](ItemsPerFamilyApi.md#updateItemFamiliesFamilyIdItemsItemIdPut) | **PUT** /families/{family_id}/items/{item_id} | Update Item |
| [**updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch**](ItemsPerFamilyApi.md#updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch) | **PATCH** /families/{family_id}/items/{item_id}/check | Update Last Check |


<a name="addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch"></a>
# **addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch**
> BulkResponseOut addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch(family\_id, ItemList)

Add Tags To Item

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **ItemList** | [**ItemList**](../Models/ItemList.md)|  | |

### Return type

[**BulkResponseOut**](../Models/BulkResponseOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="createItemEndpointFamiliesFamilyIdItemsPost"></a>
# **createItemEndpointFamiliesFamilyIdItemsPost**
> ItemOut createItemEndpointFamiliesFamilyIdItemsPost(family\_id, ItemCreate)

Create Item Endpoint

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **ItemCreate** | [**ItemCreate**](../Models/ItemCreate.md)|  | |

### Return type

[**ItemOut**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getItemsByTagsFamiliesFamilyIdItemsGet"></a>
# **getItemsByTagsFamiliesFamilyIdItemsGet**
> List getItemsByTagsFamiliesFamilyIdItemsGet(family\_id, tags)

Get Items By Tags

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tags** | [**List**](../Models/Integer.md)|  | [optional] [default to null] |

### Return type

[**List**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet"></a>
# **getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet**
> List getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet(family\_id)

Get Items Needing Check

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |

### Return type

[**List**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch"></a>
# **markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch**
> BulkResponseOut markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch(family\_id, ItemList)

Mark Items Checked

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **ItemList** | [**ItemList**](../Models/ItemList.md)|  | |

### Return type

[**BulkResponseOut**](../Models/BulkResponseOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="removeItemFamiliesFamilyIdItemsItemIdDelete"></a>
# **removeItemFamiliesFamilyIdItemsItemIdDelete**
> ItemOut removeItemFamiliesFamilyIdItemsItemIdDelete(family\_id, item\_id)

Remove Item

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **item\_id** | **Integer**|  | [default to null] |

### Return type

[**ItemOut**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateItemFamiliesFamilyIdItemsItemIdPut"></a>
# **updateItemFamiliesFamilyIdItemsItemIdPut**
> ItemOut updateItemFamiliesFamilyIdItemsItemIdPut(family\_id, item\_id, ItemUpdate)

Update Item

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **item\_id** | **Integer**|  | [default to null] |
| **ItemUpdate** | [**ItemUpdate**](../Models/ItemUpdate.md)|  | |

### Return type

[**ItemOut**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch"></a>
# **updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch**
> ItemOut updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch(family\_id, item\_id)

Update Last Check

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **item\_id** | **Integer**|  | [default to null] |

### Return type

[**ItemOut**](../Models/ItemOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

