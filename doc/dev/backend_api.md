# Documentation for GPT 瀹跺涵搴撳瓨绠＄悊绯荤粺 API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *AuthApi* | [**loginAuthLoginPost**](Apis/AuthApi.md#loginauthloginpost) | **POST** /auth/login | Login |
*AuthApi* | [**registerAuthRegisterPost**](Apis/AuthApi.md#registerauthregisterpost) | **POST** /auth/register | Register |
*AuthApi* | [**resetPasswordAuthResetPasswordPatch**](Apis/AuthApi.md#resetpasswordauthresetpasswordpatch) | **PATCH** /auth/reset-password | Reset Password |
*AuthApi* | [**resetQuestionAuthResetQuestionPost**](Apis/AuthApi.md#resetquestionauthresetquestionpost) | **POST** /auth/reset-question | Reset Question |
*AuthApi* | [**verifyAnswerAuthVerifyAnswerPost**](Apis/AuthApi.md#verifyanswerauthverifyanswerpost) | **POST** /auth/verify-answer | Verify Answer |
| *DefaultApi* | [**pingPingGet**](Apis/DefaultApi.md#pingpingget) | **GET** /ping | Ping |
| *FamiliesApi* | [**createFamilyFromMeFamiliesPost**](Apis/FamiliesApi.md#createfamilyfrommefamiliespost) | **POST** /families/ | Create Family From Me |
*FamiliesApi* | [**deactivateFamilyFromMeFamiliesFamilyIdDelete**](Apis/FamiliesApi.md#deactivatefamilyfrommefamiliesfamilyiddelete) | **DELETE** /families/{family_id} | Deactivate Family From Me |
*FamiliesApi* | [**getFamilyDetailsFamiliesFamilyIdGet**](Apis/FamiliesApi.md#getfamilydetailsfamiliesfamilyidget) | **GET** /families/{family_id} | Get Family Details |
*FamiliesApi* | [**getFamilyMembersFamiliesFamilyIdMembersGet**](Apis/FamiliesApi.md#getfamilymembersfamiliesfamilyidmembersget) | **GET** /families/{family_id}/members | Get Family Members |
*FamiliesApi* | [**updateFamilyFromMeFamiliesFamilyIdPut**](Apis/FamiliesApi.md#updatefamilyfrommefamiliesfamilyidput) | **PUT** /families/{family_id} | Update Family From Me |
| *ItemTransferApi* | [**transferItemsEndpointItemsTransferPost**](Apis/ItemTransferApi.md#transferitemsendpointitemstransferpost) | **POST** /items/transfer | Transfer Items Endpoint |
| *ItemsPerFamilyApi* | [**addTagsToItemFamiliesFamilyIdItemsBulkAddTagsPatch**](Apis/ItemsPerFamilyApi.md#addtagstoitemfamiliesfamilyiditemsbulkaddtagspatch) | **PATCH** /families/{family_id}/items/bulk-add-tags | Add Tags To Item |
*ItemsPerFamilyApi* | [**createItemEndpointFamiliesFamilyIdItemsPost**](Apis/ItemsPerFamilyApi.md#createitemendpointfamiliesfamilyiditemspost) | **POST** /families/{family_id}/items/ | Create Item Endpoint |
*ItemsPerFamilyApi* | [**getItemsByTagsFamiliesFamilyIdItemsGet**](Apis/ItemsPerFamilyApi.md#getitemsbytagsfamiliesfamilyiditemsget) | **GET** /families/{family_id}/items/ | Get Items By Tags |
*ItemsPerFamilyApi* | [**getItemsNeedingCheckFamiliesFamilyIdItemsCheckNeededGet**](Apis/ItemsPerFamilyApi.md#getitemsneedingcheckfamiliesfamilyiditemscheckneededget) | **GET** /families/{family_id}/items/check-needed | Get Items Needing Check |
*ItemsPerFamilyApi* | [**markItemsCheckedFamiliesFamilyIdItemsBulkCheckPatch**](Apis/ItemsPerFamilyApi.md#markitemscheckedfamiliesfamilyiditemsbulkcheckpatch) | **PATCH** /families/{family_id}/items/bulk-check | Mark Items Checked |
*ItemsPerFamilyApi* | [**removeItemFamiliesFamilyIdItemsItemIdDelete**](Apis/ItemsPerFamilyApi.md#removeitemfamiliesfamilyiditemsitemiddelete) | **DELETE** /families/{family_id}/items/{item_id} | Remove Item |
*ItemsPerFamilyApi* | [**updateItemFamiliesFamilyIdItemsItemIdPut**](Apis/ItemsPerFamilyApi.md#updateitemfamiliesfamilyiditemsitemidput) | **PUT** /families/{family_id}/items/{item_id} | Update Item |
*ItemsPerFamilyApi* | [**updateLastCheckFamiliesFamilyIdItemsItemIdCheckPatch**](Apis/ItemsPerFamilyApi.md#updatelastcheckfamiliesfamilyiditemsitemidcheckpatch) | **PATCH** /families/{family_id}/items/{item_id}/check | Update Last Check |
| *MembershipsApi* | [**createInvitationTokenMembershipsInvitePost**](Apis/MembershipsApi.md#createinvitationtokenmembershipsinvitepost) | **POST** /memberships/invite | Create Invitation Token |
*MembershipsApi* | [**deleteMembershipMembershipsByKeyDelete**](Apis/MembershipsApi.md#deletemembershipmembershipsbykeydelete) | **DELETE** /memberships/by-key | Delete Membership |
*MembershipsApi* | [**joinWithTokenMembershipsPost**](Apis/MembershipsApi.md#joinwithtokenmembershipspost) | **POST** /memberships/ | Join With Token |
*MembershipsApi* | [**updateMembershipMembershipsByKeyPatch**](Apis/MembershipsApi.md#updatemembershipmembershipsbykeypatch) | **PATCH** /memberships/by-key | Update Membership |
| *TagsPerFamilyApi* | [**createNewTagFamiliesFamilyIdTagsPost**](Apis/TagsPerFamilyApi.md#createnewtagfamiliesfamilyidtagspost) | **POST** /families/{family_id}/tags/ | Create New Tag |
*TagsPerFamilyApi* | [**getFamilyTagsFamiliesFamilyIdTagsGet**](Apis/TagsPerFamilyApi.md#getfamilytagsfamiliesfamilyidtagsget) | **GET** /families/{family_id}/tags/ | Get Family Tags |
*TagsPerFamilyApi* | [**modifyTagFamiliesFamilyIdTagsTagIdPut**](Apis/TagsPerFamilyApi.md#modifytagfamiliesfamilyidtagstagidput) | **PUT** /families/{family_id}/tags/{tag_id} | Modify Tag |
*TagsPerFamilyApi* | [**removeTagFamiliesFamilyIdTagsTagIdDelete**](Apis/TagsPerFamilyApi.md#removetagfamiliesfamilyidtagstagiddelete) | **DELETE** /families/{family_id}/tags/{tag_id} | Remove Tag |
| *TransactionsPerFamilyApi* | [**cancelTransactionFamiliesFamilyIdTransactionsTxIdDelete**](Apis/TransactionsPerFamilyApi.md#canceltransactionfamiliesfamilyidtransactionstxiddelete) | **DELETE** /families/{family_id}/transactions/{tx_id} | Cancel Transaction |
*TransactionsPerFamilyApi* | [**createTransactionFamiliesFamilyIdTransactionsBatchPost**](Apis/TransactionsPerFamilyApi.md#createtransactionfamiliesfamilyidtransactionsbatchpost) | **POST** /families/{family_id}/transactions/batch | Create Transaction |
*TransactionsPerFamilyApi* | [**createTransactionFamiliesFamilyIdTransactionsPost**](Apis/TransactionsPerFamilyApi.md#createtransactionfamiliesfamilyidtransactionspost) | **POST** /families/{family_id}/transactions/ | Create Transaction |
*TransactionsPerFamilyApi* | [**getTransactionFamiliesFamilyIdTransactionsTxIdGet**](Apis/TransactionsPerFamilyApi.md#gettransactionfamiliesfamilyidtransactionstxidget) | **GET** /families/{family_id}/transactions/{tx_id} | Get Transaction |
*TransactionsPerFamilyApi* | [**updateTransactionFamiliesFamilyIdTransactionsTxIdPut**](Apis/TransactionsPerFamilyApi.md#updatetransactionfamiliesfamilyidtransactionstxidput) | **PUT** /families/{family_id}/transactions/{tx_id} | Update Transaction |
| *UsersApi* | [**deactivateMeUsersMeDeactivatePost**](Apis/UsersApi.md#deactivatemeusersmedeactivatepost) | **POST** /users/me/deactivate | Deactivate Me |
*UsersApi* | [**getMeUsersMeGet**](Apis/UsersApi.md#getmeusersmeget) | **GET** /users/me | Get Me |
*UsersApi* | [**getMyFamiliesUsersMeFamiliesGet**](Apis/UsersApi.md#getmyfamiliesusersmefamiliesget) | **GET** /users/me/families | Get My Families |
*UsersApi* | [**getMyMembershipsUsersMeMembershipsGet**](Apis/UsersApi.md#getmymembershipsusersmemembershipsget) | **GET** /users/me/memberships | Get My Memberships |
*UsersApi* | [**updateMeBasicUsersMeUpdatePut**](Apis/UsersApi.md#updatemebasicusersmeupdateput) | **PUT** /users/me/update | Update Me Basic |
*UsersApi* | [**updateMePasswordUsersMePasswordPatch**](Apis/UsersApi.md#updatemepasswordusersmepasswordpatch) | **PATCH** /users/me/password | Update Me Password |
*UsersApi* | [**updateMeResetQuestionUsersMeResetQuestionPut**](Apis/UsersApi.md#updatemeresetquestionusersmeresetquestionput) | **PUT** /users/me/reset-question | Update Me Reset Question |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [BulkResponseOut](./Models/BulkResponseOut.md)
 - [FamilyCreate](./Models/FamilyCreate.md)
 - [FamilyOut](./Models/FamilyOut.md)
 - [FamilyUpdate](./Models/FamilyUpdate.md)
 - [HTTPValidationError](./Models/HTTPValidationError.md)
 - [ItemCreate](./Models/ItemCreate.md)
 - [ItemList](./Models/ItemList.md)
 - [ItemOut](./Models/ItemOut.md)
 - [ItemStatus](./Models/ItemStatus.md)
 - [ItemTransferRequest](./Models/ItemTransferRequest.md)
 - [ItemUpdate](./Models/ItemUpdate.md)
 - [LoginRequest](./Models/LoginRequest.md)
 - [MembershipJoinRequest](./Models/MembershipJoinRequest.md)
 - [MembershipJoinResponse](./Models/MembershipJoinResponse.md)
 - [MembershipOut](./Models/MembershipOut.md)
 - [MembershipTokenRequest](./Models/MembershipTokenRequest.md)
 - [MembershipUpdate](./Models/MembershipUpdate.md)
 - [MemebershipTokenResponse](./Models/MemebershipTokenResponse.md)
 - [RegisterRequest](./Models/RegisterRequest.md)
 - [ResetPasswordRequest](./Models/ResetPasswordRequest.md)
 - [ResetQuestionRequest](./Models/ResetQuestionRequest.md)
 - [ResetQuestionResponse](./Models/ResetQuestionResponse.md)
 - [ResetTokenResponse](./Models/ResetTokenResponse.md)
 - [TagCreate](./Models/TagCreate.md)
 - [TagOut](./Models/TagOut.md)
 - [TagUpdate](./Models/TagUpdate.md)
 - [TokenResponse](./Models/TokenResponse.md)
 - [TransactionCreate](./Models/TransactionCreate.md)
 - [TransactionOut](./Models/TransactionOut.md)
 - [TransactionUpdate](./Models/TransactionUpdate.md)
 - [TransferItem](./Models/TransferItem.md)
 - [UserDelete](./Models/UserDelete.md)
 - [UserOut](./Models/UserOut.md)
 - [UserUpdateBasic](./Models/UserUpdateBasic.md)
 - [UserUpdatePassword](./Models/UserUpdatePassword.md)
 - [UserUpdateResetQuestion](./Models/UserUpdateResetQuestion.md)
 - [ValidationError](./Models/ValidationError.md)
 - [ValidationError_loc_inner](./Models/ValidationError_loc_inner.md)
 - [VerifyAnswerRequest](./Models/VerifyAnswerRequest.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="HTTPBearer"></a>
### HTTPBearer

- **Type**: HTTP Bearer Token authentication

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

# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**pingPingGet**](DefaultApi.md#pingPingGet) | **GET** /ping | Ping |


<a name="pingPingGet"></a>
# **pingPingGet**
> oas_any_type_not_mapped pingPingGet()

Ping

### Parameters
This endpoint does not need any parameter.

### Return type

[**oas_any_type_not_mapped**](../Models/AnyType.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

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

# ItemTransferApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**transferItemsEndpointItemsTransferPost**](ItemTransferApi.md#transferItemsEndpointItemsTransferPost) | **POST** /items/transfer | Transfer Items Endpoint |


<a name="transferItemsEndpointItemsTransferPost"></a>
# **transferItemsEndpointItemsTransferPost**
> oas_any_type_not_mapped transferItemsEndpointItemsTransferPost(ItemTransferRequest)

Transfer Items Endpoint

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemTransferRequest** | [**ItemTransferRequest**](../Models/ItemTransferRequest.md)|  | |

### Return type

[**oas_any_type_not_mapped**](../Models/AnyType.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

# MembershipsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createInvitationTokenMembershipsInvitePost**](MembershipsApi.md#createInvitationTokenMembershipsInvitePost) | **POST** /memberships/invite | Create Invitation Token |
| [**deleteMembershipMembershipsByKeyDelete**](MembershipsApi.md#deleteMembershipMembershipsByKeyDelete) | **DELETE** /memberships/by-key | Delete Membership |
| [**joinWithTokenMembershipsPost**](MembershipsApi.md#joinWithTokenMembershipsPost) | **POST** /memberships/ | Join With Token |
| [**updateMembershipMembershipsByKeyPatch**](MembershipsApi.md#updateMembershipMembershipsByKeyPatch) | **PATCH** /memberships/by-key | Update Membership |


<a name="createInvitationTokenMembershipsInvitePost"></a>
# **createInvitationTokenMembershipsInvitePost**
> MemebershipTokenResponse createInvitationTokenMembershipsInvitePost(MembershipTokenRequest)

Create Invitation Token

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **MembershipTokenRequest** | [**MembershipTokenRequest**](../Models/MembershipTokenRequest.md)|  | |

### Return type

[**MemebershipTokenResponse**](../Models/MemebershipTokenResponse.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteMembershipMembershipsByKeyDelete"></a>
# **deleteMembershipMembershipsByKeyDelete**
> MembershipOut deleteMembershipMembershipsByKeyDelete(MembershipUpdate)

Delete Membership

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **MembershipUpdate** | [**MembershipUpdate**](../Models/MembershipUpdate.md)|  | |

### Return type

[**MembershipOut**](../Models/MembershipOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="joinWithTokenMembershipsPost"></a>
# **joinWithTokenMembershipsPost**
> MembershipJoinResponse joinWithTokenMembershipsPost(MembershipJoinRequest)

Join With Token

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **MembershipJoinRequest** | [**MembershipJoinRequest**](../Models/MembershipJoinRequest.md)|  | |

### Return type

[**MembershipJoinResponse**](../Models/MembershipJoinResponse.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateMembershipMembershipsByKeyPatch"></a>
# **updateMembershipMembershipsByKeyPatch**
> MembershipOut updateMembershipMembershipsByKeyPatch(MembershipUpdate)

Update Membership

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **MembershipUpdate** | [**MembershipUpdate**](../Models/MembershipUpdate.md)|  | |

### Return type

[**MembershipOut**](../Models/MembershipOut.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

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

# BulkResponseOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **success** | [**List**](ItemStatus.md) |  | [default to null] |
| **failed** | [**List**](ItemStatus.md) |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# FamilyCreate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# FamilyOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **id** | **Integer** |  | [default to null] |
| **role** | **String** |  | [optional] [default to null] |
| **isActive** | **Boolean** |  | [optional] [default to true] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# FamilyUpdate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [optional] [default to null] |
| **notes** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# HTTPValidationError
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **detail** | [**List**](ValidationError.md) |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemCreate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [default to null] |
| **unit** | **String** |  | [optional] [default to null] |
| **quantity** | **BigDecimal** |  | [optional] [default to null] |
| **location** | **String** |  | [optional] [default to null] |
| **family\_id** | **Integer** |  | [optional] [default to null] |
| **owner\_id** | **Integer** |  | [optional] [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **raw\_input** | **String** |  | [optional] [default to null] |
| **check\_interval\_days** | **Integer** |  | [optional] [default to null] |
| **tags** | **List** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemList
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **itemList** | **List** |  | [default to null] |
| **tagList** | **List** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **Integer** |  | [default to null] |
| **name** | **String** |  | [default to null] |
| **unit** | **String** |  | [default to null] |
| **quantity** | **BigDecimal** |  | [default to null] |
| **location** | **String** |  | [default to null] |
| **familyId** | **Integer** |  | [default to null] |
| **ownerId** | **Integer** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **rawInput** | **String** |  | [default to null] |
| **checkIntervalDays** | **Integer** |  | [optional] [default to null] |
| **lastCheckedDate** | **Date** |  | [optional] [default to null] |
| **tags** | [**List**](TagOut.md) |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemStatus
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **status** | **String** |  | [optional] [default to success] |
| **code** | **Integer** |  | [optional] [default to 200] |
| **itemId** | **Integer** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemTransferRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **user\_id** | **Integer** |  | [default to null] |
| **from\_family\_id** | **Integer** |  | [default to null] |
| **to\_family\_id** | **Integer** |  | [default to null] |
| **items** | [**List**](TransferItem.md) |  | [default to null] |
| **notes** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ItemUpdate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **notes** | **String** |  | [optional] [default to null] |
| **check\_interval\_days** | **Integer** |  | [optional] [default to null] |
| **tags** | **List** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# LoginRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **email** | **String** |  | [default to null] |
| **password** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MembershipJoinRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **token** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MembershipJoinResponse
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **userId** | **Integer** |  | [default to null] |
| **familyId** | **Integer** |  | [default to null] |
| **role** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MembershipOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **userId** | **Integer** |  | [default to null] |
| **familyId** | **Integer** |  | [default to null] |
| **role** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MembershipTokenRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **familyId** | **Integer** |  | [default to null] |
| **tokenRole** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MembershipUpdate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **userId** | **Integer** |  | [default to null] |
| **familyId** | **Integer** |  | [default to null] |
| **role** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# MemebershipTokenResponse
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **token** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# RegisterRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **username** | **String** |  | [default to null] |
| **email** | **String** |  | [default to null] |
| **password** | **String** |  | [default to null] |
| **phoneNumber** | **String** |  | [optional] [default to null] |
| **securityQuestion** | **String** |  | [default to null] |
| **securityAnswer** | **String** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ResetPasswordRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **token** | **String** |  | [default to null] |
| **newPassword** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ResetQuestionRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **email** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ResetQuestionResponse
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **securityQuestion** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ResetTokenResponse
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **token** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TagCreate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [default to null] |
| **familyId** | **Integer** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TagOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **Integer** |  | [default to null] |
| **name** | **String** |  | [default to null] |
| **familyId** | **Integer** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TagUpdate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TokenResponse
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **accessToken** | **String** |  | [default to null] |
| **tokenType** | **String** |  | [optional] [default to bearer] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TransactionCreate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **itemId** | **Integer** |  | [default to null] |
| **userId** | **Integer** |  | [default to null] |
| **changeType** | **String** |  | [optional] [default to ADD] |
| **quantity** | **BigDecimal** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **rawInput** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TransactionOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **itemId** | **Integer** |  | [default to null] |
| **userId** | **Integer** |  | [default to null] |
| **changeType** | **String** |  | [optional] [default to ADD] |
| **quantity** | **BigDecimal** |  | [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **rawInput** | **String** |  | [optional] [default to null] |
| **id** | **Integer** |  | [default to null] |
| **timestamp** | **Date** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TransactionUpdate
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **notes** | **String** |  | [optional] [default to null] |
| **rawInput** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TransferItem
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **item\_id** | **Integer** |  | [default to null] |
| **quantity** | **BigDecimal** |  | [default to null] |
| **location** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserDelete
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **reason** | **String** |  | [default to null] |
| **confirmed** | **Boolean** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserOut
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **Integer** |  | [default to null] |
| **username** | **String** |  | [default to null] |
| **email** | **String** |  | [default to null] |
| **phoneNumber** | **String** |  | [optional] [default to null] |
| **securityQuestion** | **String** |  | [optional] [default to null] |
| **notes** | **String** |  | [optional] [default to null] |
| **role** | **String** |  | [optional] [default to null] |
| **isActive** | **Boolean** |  | [optional] [default to true] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserUpdateBasic
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **username** | **String** |  | [optional] [default to null] |
| **email** | **String** |  | [optional] [default to null] |
| **phoneNumber** | **String** |  | [optional] [default to null] |
| **notes** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserUpdatePassword
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **oldPassword** | **String** |  | [optional] [default to null] |
| **newPassword** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserUpdateResetQuestion
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **password** | **String** |  | [default to null] |
| **securityQuestion** | **String** |  | [optional] [default to null] |
| **securityAnswer** | **String** |  | [optional] [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ValidationError
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **loc** | [**List**](ValidationError_loc_inner.md) |  | [default to null] |
| **msg** | **String** |  | [default to null] |
| **type** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# ValidationError_loc_inner
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# VerifyAnswerRequest
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **email** | **String** |  | [default to null] |
| **securityAnswer** | **String** |  | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

