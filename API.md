
# Trace - API Documentation
Trace is built with a Node.js backend to facilitate all manner of common functionality throughout the site.
This reference is written to help with identifying what all of our public endpoints are responsible for and how to go about using them.
  
If config.json has not been modified, these endpoints are accessible from http://localhost:3000 once the backend is up and running.  
See INSTALL.md for details on how to set up and run the backend.

---

## Authentication Endpoints - '/auth'
**Overview:**
Request | Endpoint | Functionality | Implemented?
--------|----------|---------------|-------------
POST | /login | N/A | No
POST | /signup | N/A | No
  
### [POST] - '/auth/login'  
This endpoint is used for [PLACEHOLDER].  
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```
  
### [POST] - '/auth/signup'  
This endpoint is used for [PLACEHOLDER].  
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```
---

## Image Endpoints - '/image'
**Overview:**
Request | Endpoint | Functionality | Implemented?
--------|----------|---------------|-------------
GET | /:id | Returns the specified image from our database. | No
POST | /create | Creates a new image from provided information and stores it in our database. | No
POST | /update/:id | Updates the properties of the specified image in our database with provided information. | No
DELETE | /delete/:id | Deletes the specified image from our database. | No
POST | /against/:id | Checks provided image data for our watermarking and returns the payload if found. | No

### [GET] - '/image/:id'
This endpoint returns the specified image from our database.
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```

#### [POST] - '/image/create'
This endpoint creates a new image from provided information and stores it in our database.
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```

#### [POST] - '/image/update/:id'
This endpoint updates the properties of the specified image in our database with provided information.
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```

#### [DELETE] - '/image/delete/:id'
This endpoint deletes the specified image from our database.
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```

#### [POST] - '/image/against/:id'
This endpoint checks provided image data for our watermarking and returns the payload if found.
#### Sample Request:
```javascript
```
#### Sample Output:
```json
```
---

## Organization Endpoints
**Overview:**
Request | Endpoint | Functionality | Implemented?
--------|----------|---------------|-------------
---

## Permission Endpoints
**Overview:**
Request | Endpoint | Functionality | Implemented?
--------|----------|---------------|-------------
---

## User Endpoints
**Overview:**
Request | Endpoint | Functionality | Implemented?
--------|----------|---------------|-------------
