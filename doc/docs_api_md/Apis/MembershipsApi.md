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

