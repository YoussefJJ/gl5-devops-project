# Twitter Clone Demo API

The application allows us to register accounts (basic info for demo purposes: username, password, email) and post tweets.

The general idea is to allow access to resources only if the user is authenticated (validating his access token). The verification is established through the JWT Standard.

![Microservices Diagram](../assets/Microservices.png)

# Microservices
The application is composed of 2 microservices:
## 1 - Authentication Service
As mentioned above, it allows us to connect to the application and keeping communication by sending token to verify the user with each request.
The service has the following endpoints


**POST** `/auth/register`

Allows to register to the service by providing some basic info: username, email and password.

```console
$ curl -X POST http://20.85.249.217/auth/register -H "Context-type: application/json" -d '{"name": "name", "password": "password", "email": "youssef@gmail.com"}'
```

Returns HTTP Status Code **201**
```json
// Request Body example:
{
    "name": "user",
    "email": "user@gmail.com",
    "password": "my_password"
}
```
Returns HTTP Status Code **400** in case of missing data
***
**POST** `/auth/login`

Allows logging in to the service

```console
$ curl -X POST http://20.85.249.217/auth/register -H "Context-type: application/json" -d '{"password": "password", "email": "youssef@gmail.com"}'
```
Returns HTTP Status Code **200**
```json
// Response Body Example:
{
    "user": {
        "id": 1
        "email": "user@gmail.com",
        "name": "User"
    },
    "token": "SOME_TOKEN"
}
```
Returns HTTP Status Code **400** in case of invalid credentials
***
**POST** `/auth/token`

This endpoint triggers a handler that checks for `Authorization` header inside the request and:

- Returns HTTP Status Code **200** for valid token responses

- Returns HTTP Status Code **400** for invalid token responses
***
## 2 - Tweet Service
The microservice responsible for handling tweet creation, update and deletion. It is also used to get tweets by users or a single tweet by its id.

**POST** `/tweet/`

```console
$ curl -X POST http://20.85.249.217/tweet -H "Authorization: <TOKEN>" -d '{"text": "Some text"}'
```

```json
// Request Body Example
{
    "text": "Some tweet"
}
```
Return HTTP Status Code **201**
```json
// Example:
{
    "userId": 1,
    "tweetId": 1,
    "tweet": "This is a tweet",
}
```
Returns HTTP Status Code **400** in case of error
***
**GET** `/tweet/:id` 

Return HTTP Status Code **200**
```json
// Example:
{   
    "tweetId": 1,
    "userId": 1,
    "text": "Some text"
}
```

***
**GET** `/tweet/user/:id`

Get information about a tweet made by a specific user

Has 2 query parameters:
    
- `perPage`: number of items per page (by default all)
- `page`: number of page (by default none, takes all)

```console
$ curl http://20.85.249.217/tweet/user/1?perPage=3&page=2 -H "Authorization: <TOKEN>"
```

Return HTTP Status Code **200**
```json
// Response Example:
[
    {
        "userId": 1,
        "tweetId": 1,
        "tweet": "This is a tweet",
    },
    {
        "userId": 1,
        "tweetId": 2,
        "tweet": "This is a second tweet",
    }
]
```
Returns HTTP Status Code **400** in case of error


***
**PUT** `/tweet/:id`

Modify a tweet
```console
$ curl http://20.85.249.217/tweet/1 -X PUT -H "Authorization: <TOKEN> -d '{"text": "some text"}'"
```
Returns HTTP Status Code **200**
```json
// Response Body Example
{   
    "userId": 1,
    "tweetId": 1,
    "text": "text modified"
}
```
Returns HTTP Status Code **400** in case of error
***

**DELETE** `/tweet/:id`

Delete a tweet
```console
$ curl http://20.85.249.217/tweet/1 -X DELETE -H "Authorization: <TOKEN>"
```
Returns HTTP Status Code **200**
```json
// Response Body Example
{   
    "userId": 1,
    "tweetId": 1,
    "text": "text modified"
}
```
Return HTTP Status Code **400** in case of error
***
**POST** `/retweet/`
Retweet a post

```console
$ curl -X POST http://20.85.249.217/retweet -H "Authorization: <TOKEN>"
```
Return HTTP Status Code **201**
```json
// Response Body Example
{   
    "retweetId": 1,
    "tweetId": 1,
}
```
Return HTTP Status Code **400** in case of error

***
**DELETE** `/retweet/:id`
Delete a post

```console
$ curl -X DELETE http://20.85.249.217/retweet/1 -H "Authorization: <TOKEN>"
```

Return **200**
```json
// Response Body Example
{   
    "retweetId": 1,
    "tweetId": 1,
}
```
Return HTTP Status Code **200**
