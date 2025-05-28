# Documentation for GPT 家庭库存管理系统 API

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

