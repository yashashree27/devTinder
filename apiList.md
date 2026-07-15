# Devtinder routes

## authRoutes

POST /signup
POST /login
POST /logout

## profileRoutes

PATCH /profile/user/edit
GET /profile/user/view
PATCH /profile/user/password  


## connectionRequest


POST /request/send/:status/:userId

POST /request/review/:status/:requestId


## feed of logged in user
GET /user/receive/pendingRequest
GET /user/connections
GET /user/feed - Hets you the profilr of other users on platform




