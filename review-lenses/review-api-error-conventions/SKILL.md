---
name: review-api-error-conventions
description: |
  Use when reviewing changes to HTTP handlers under src/api/ to check that error responses go through apiError() with a status and code from the team's tables.
---

# review-api-error-conventions

A code convention review lens for Tessl code review. This lens covers error
handling within the API section of a TypeScript project where the API is under
`src/api` and error handling use a common error handling function `apiError`
which accepts the HTTP response object, an HTTP status code, and a structure
error code.

## Stance

* Review all changed TypeScript API code. 
* Only raise a finding when the code violates the rules below.
* Each finding must cite the specific file and line(s) and name the rule it
  violates.
* Even if the code is not reachable, report the finding.

## Rules

### Using the function

Each instance of error handling code that reports an error to the user,
whether logically reachable or not, must use `apiError`. Not using `apiError`
will cause API clients to fail hard with no change to recover from the error.
This is a critical failure that must be fixed.

### Correct HTTP status

Every use of `apiError` must use a valid HTTP status code from the HTTP Status
Table.

### Correct error codes

Every use of `apiError` must use a structured error code found under "Error
code table"

### Consistent codes

The chosen HTTP status code and error code must be consistent, e.g. do not
return `418` ("I am a teapot") with error code `order_not_found`.

## Findings to Raise

* Not using `apiError` is a critical, MUST FIX error. Clients will fail hard
  if passed an unstructured error causing the whole system to fail.
* Code that uses a _more_ specific status code (e.g. `503` vs. `500`) is a
  minor finding when the choice is defensible, or a major finding when the
  code does not apply to the error (e.g. `503` instead of `404`).
* Using a _less_ specific status code (e.g. `500` for a `503`) is a major
  finding, but not a MUST FIX
* A status code not in the table, but within the same family (e.g. `422`
  instead of `400`, `502` instead of `500`) is a minor finding.
* An error code not in the table is a minor finding.

## What not to flag

* Any code that is not providing an error response to the user.
* Do not flag the definition of `apiError`.
* Any other errors inside error handling code.

## HTTP Status Table


|Status Code|When
|----|----|
| 400 | The request has an invalidate structure |  
| 401 | Authentication fails | 
| 403 | User is not authorized to make the request |
| 404 | The requested resources does not exixt |
| 405 | A resource exists, the user can access it, but they specific HTTP verb is not allowed |
| 415 | A resources exists and is authorized, but not for the content type requested |
| 418 | The applications is a teapot |
| 503 | The applicaiton could not access a downstream service required to respond |
| 500 | Any other error |


## Error Code Table


| Error Code|When|
|----|----|
| order_not_found | Order cannot be found | 
| order_access_denied | Access to the given order is not allowed |
| cannot_update_order | The user can access but not update the order |
| invoice_not_found | Invoice cannot be found |
| invoice_access_denied | Access to the given invoice is not allowed |
| cannot_update_invoice | The user can access but not update the order |
| cannot_provide_format | The system is unable to provide the expected response format |
| database_unavailable | Cannot access the database |
| system_is_a_teapot | The system is, in fact, a teapot |


## Examples

### Good examples

#### An invoice is not found

```
if (!invoice) return apiError(res, 404, 'invoice_not_found');
```

#### The user is not allowed to access a specific order

```
if (!allowed) return apiError(res, 403, 'order_access_denied');
```


### Bad example

#### Does not use the function

```
if (!allowed) {
  return res.status(403).send('access denied');
}
```

#### Status code too broad

```
if (!database_reached) return apiError(res, 500, 'database_unavailable')
```


#### Status and error don't match

```
if (!order) return apiError(res, 404, 'system_is_a_teapot')
```
