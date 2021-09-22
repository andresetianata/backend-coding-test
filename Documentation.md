# Rides CRUD Backend

## How to run
1. Install npm package inside package.json
```
npm install
```
2. The server will be running on port 8010

## API list
### Insert new Rides
```sh
POST /rides
{
    "start_lat": -7.3193522, #start location latitude value
    "start_long": 112.7032945, #start location longitude value
    "end_lat": -7.317309, #end location latitude value
    "end_long": 112.6544997, #end location longitude value
    "rider_name": "Rider ABC", #rider name
    "driver_name": "Marcus Rashford", #driver name
    "driver_vehicle": "Honda Supra X 125" #vehicle
}
```

### Get Rides by ID
You can get rides data by specific ID
```sh
GET /rides/:id
#where ID is ID of rides
```
### Get Rides All
You can get all rides data by providing  page and limit
```sh
GET /rides?page=1&limit=10
#page : page of pagination
#limit : max data returned per page
```