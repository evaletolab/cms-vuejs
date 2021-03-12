# start CMS-frontend
  cd frontend
  npm run serve
  open http://localhost:8080/

# start CMS-backend
  cd php
  php -S localhost:4000


# TODO
* create default SQLite table **EDITORS**
  * slug
  * content
  * version
  * published
  * time
* copy **empty.sqlite** and rename it **db.sqlite** 
* debug (create and load)

* create curl test
  * curl -v -H "Content-Type: application/json" --data @test.json http://site-address/event_add.php
  * curl -v -H "Content-Type: application/json" -H "Authorization: Bearer abcd"  http://localhost:4000/event/2bdaf3e1-39653661
