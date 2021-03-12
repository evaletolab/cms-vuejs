
# milid analytics php sqlite version

implements a route to add a Milid event object to an sqlite database.
expects a json encoded object of format: 
```
{
	"uid": "2bdaf3e1-39653661",
	"username": "marcus",
	"module": 1,
	"lesson":1,
	"state": 0
}
```

## install it

- copy **empty.sqlite** and rename it **db.sqlite** 
- copy **db.sqlite** and **event_add.php** to target apache directory

## todo
- auth ??
- protect sqlite file from download

## curl test
- curl -v -H "Content-Type: application/json" --data @test.json http://site-address/event_add.php
- curl -v -H "Content-Type: application/json" -H "Authorization: Bearer abcd"  http://localhost:4000/event/2bdaf3e1-39653661
