# TransactionsPerFamilyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete**](TransactionsPerFamilyApi.md#cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete) | **DELETE** /families/{family_id}/transactions/{tx_id} | Cancel Transaction |
| [**createTransactionFamiliesFamilyIdTransactionsBatchPost**](TransactionsPerFamilyApi.md#createTransactionFamiliesFamilyIdTransactionsBatchPost) | **POST** /families/{family_id}/transactions/batch | Create Transaction |
| [**createTransactionFamiliesFamilyIdTransactionsPost**](TransactionsPerFamilyApi.md#createTransactionFamiliesFamilyIdTransactionsPost) | **POST** /families/{family_id}/transactions/ | Create Transaction |
| [**getTransactionFamiliesFamilyIdTransactionsTxIdGet**](TransactionsPerFamilyApi.md#getTransactionFamiliesFamilyIdTransactionsTxIdGet) | **GET** /families/{family_id}/transactions/{tx_id} | Get Transaction |
| [**updateTransactionFamiliesFamilyIdTransactionsTxIdPut**](TransactionsPerFamilyApi.md#updateTransactionFamiliesFamilyIdTransactionsTxIdPut) | **PUT** /families/{family_id}/transactions/{tx_id} | Update Transaction |


<a name="cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete"></a>
# **cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete**
> TransactionOut cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete(family\_id, tx\_id)

Cancel Transaction

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tx\_id** | **Integer**|  | [default to null] |

### Return type

[**TransactionOut**](../Models/TransactionOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="createTransactionFamiliesFamilyIdTransactionsBatchPost"></a>
# **createTransactionFamiliesFamilyIdTransactionsBatchPost**
> List createTransactionFamiliesFamilyIdTransactionsBatchPost(family\_id, TransactionCreate)

Create Transaction

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **TransactionCreate** | [**List**](../Models/TransactionCreate.md)|  | |

### Return type

[**List**](../Models/TransactionOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="createTransactionFamiliesFamilyIdTransactionsPost"></a>
# **createTransactionFamiliesFamilyIdTransactionsPost**
> TransactionOut createTransactionFamiliesFamilyIdTransactionsPost(family\_id, TransactionCreate)

Create Transaction

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **TransactionCreate** | [**TransactionCreate**](../Models/TransactionCreate.md)|  | |

### Return type

[**TransactionOut**](../Models/TransactionOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getTransactionFamiliesFamilyIdTransactionsTxIdGet"></a>
# **getTransactionFamiliesFamilyIdTransactionsTxIdGet**
> TransactionOut getTransactionFamiliesFamilyIdTransactionsTxIdGet(family\_id, tx\_id)

Get Transaction

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tx\_id** | **Integer**|  | [default to null] |

### Return type

[**TransactionOut**](../Models/TransactionOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateTransactionFamiliesFamilyIdTransactionsTxIdPut"></a>
# **updateTransactionFamiliesFamilyIdTransactionsTxIdPut**
> TransactionOut updateTransactionFamiliesFamilyIdTransactionsTxIdPut(family\_id, tx\_id, TransactionUpdate)

Update Transaction

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **family\_id** | **Integer**|  | [default to null] |
| **tx\_id** | **Integer**|  | [default to null] |
| **TransactionUpdate** | [**TransactionUpdate**](../Models/TransactionUpdate.md)|  | |

### Return type

[**TransactionOut**](../Models/TransactionOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

