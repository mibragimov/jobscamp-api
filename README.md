# Jobscamp API v1 documentation

This is the Jobscamp API built with Node.js and Express framework.

#### Important details:

* No need to use CORS proxy or API key
* Supports up to 100 requests per hour
* CRUD operations are allowed

## POST

Create new job. It requires auth token that can be accessed when
        registered as a company.

Path: `https://jobscamp-api.herokuapp.com/jobs`

### Request Body

| Field | Type | Required |
| role | String | Yes |
| type | String | Yes |
| skills | String | No |
| location | String | Yes |

Example:
        `
          https://jobscamp-api.herokuapp.com/jobs/${job},${token}
        `

## GET

Returns list of jobs created by registered company

Path: `https://jobscamp-api.herokuapp.com/jobs/me`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include with request headers |

### Parameters

| Parameter | Required | Description |
| sortBy | Optional | Ex: sortBy 'createdAt:desc', 'updatedAt:asc' |
| skip | Optional | Ex: Integer skip 1,2,3 |
| limit | Optional | Ex: Integer limit 1,2,3 |

Example:
        `https://jobscamp-api.herokuapp.com/jobs/me?limit=10&skip=5`

## PATCH

Update the job object.

Path: `https://jobscamp-api.herokuapp.com/jobs/:id`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include token with the request header |

### Parameters

| ID | Required | Description |
| ObjectID | Yes | String |

Example: `https://jobscamp-api.herokuapp.com/jobs/${id}`

## DELETE

Delete the job object.

Path: `https://jobscamp-api.herokuapp.com/jobs/:id`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include token with the request header |

### Parameters

| ID | Required | Description |
| ObjectID | Yes | String |

## POST

Create new company. It returns authorization token along with the
        company object.

Path: `https://jobscamp-api.herokuapp.com/companies`

### Request Body

| Field | Type | Required |
| name | String | Yes |
| email | String | Yes |
| password | String | Yes |
| logo | Buffer | Optional |

## GET

Returns list of registered companies

Path: `https://jobscamp-api.herokuapp.com/companies`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include token with the request header |

## PATCH

Update the company object.

Path: `https://jobscamp-api.herokuapp.com/companies/me`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include token with the request header |

## DELETE

Delete the company object.

Path: `https://jobscamp-api.herokuapp.com/companies/me`

### Request headers

| Authorization | Required | Description |
| Bearer token | Yes | Include token with the request header |
