POST http://localhost:3001/auth/register 
Content-Type: application/json

{
    "username": "coderwhy",
    "password": "123456"
}

# "id": "64a067e2e799d3448a6e9bbd",
#  "username": "coderwhy"

###
POST http://localhost:3001/auth/login
Content-Type: application/json

{
    "username": "coderwhy",
    "password": "123456"
}


# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvZGVyd2h5IiwiaWF0IjoxNjg4MjM0MTM1LCJleHAiOjE2ODgyMzQ0MzV9.bF7L2V1Jz7K71nwlLZZs4qVGuENu8tW2TrltO-V3SGI",
#   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvZGVyd2h5IiwiaWF0IjoxNjg4MjM0MTM1LCJleHAiOjE2ODg0OTMzMzV9.yCdB2EWw1saaK3cEk1qVciVaicCZwUtF6U6BQxEDczQ"
# }

###
POST http://localhost:3001/auth/refresh
Content-Type: application/json

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvZGVyd2h5IiwiaWF0IjoxNjg4MjQwMzc4LCJleHAiOjE2ODgyNDA2Nzh9.bTdRdbeADTsmfolqZSJXhBgn3iXIvuqHR7Y3N1VCCUw"
}

###
@accessToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvZGVyd2h5IiwiaWF0IjoxNjg4MjQwMzc4LCJleHAiOjE2ODgyNDA2Nzh9.bTdRdbeADTsmfolqZSJXhBgn3iXIvuqHR7Y3N1VCCUw


###
POST http://localhost:3001/category
Authorization: Basic {{accessToken}}
Content-Type: application/json

{
    "name": "床上用品"
}

###
curl --url 'http://localhost:3001/category' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvZGVyd2h5IiwiaWF0IjoxNjg4MjM0ODI5LCJleHAiOjE2ODgyMzUxMjl9.186H7wyCXXJIyXJ5YUJ9NACis0iiZ8NJD7tzClX8vgc' \
  --request POST \
  --data '{
    "name": "床上用品"
}'