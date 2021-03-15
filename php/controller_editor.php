<?php
  //
  // naive security
  function controller_editor_security_post($token, $method) {
  }

  //
  // naive validation
  function controller_editor_validate($data){
    if(!property_exists($data, 'slug')){
        return False;
    }
    if(!property_exists($data, 'content')){
        return False;
    }
    if(!property_exists($data, 'version')){
        return False;
    }
    if(!property_exists($data, 'published')){
      return False;
    }
    if(!property_exists($data, 'time')){
      return False;
    }
    return True;
  }

  //
  // GET /editor/slug?published=true&lang=fr
  function controller_editor_get($db,$slug,$query) {
    $published = $query["published"] == "true" ? 1:0;
    // echo "----pub :" . $published ;
    // echo "----slug:" . $slug;
    // content:
    //    fr: any;
    //    en: any;
    // version: string;
    // time: Date|number;
    // published: boolean;
    // slug: string;
    $statement = $db->prepare("SELECT * FROM editors WHERE slug=:slug AND published=:published ORDER BY time DESC LIMIT 1;");
    $statement->bindValue(":published", $published);
    $statement->bindValue(":slug",$slug);

    if(!$statement){
        echo "statement failed\n";
        echo $statement;
        response_fail();
        exit();
    }

    $res = $statement->execute();

    if(!$res){
        echo $db->lastErrorMsg();
        http_response_code(500);
        exit();
    }
    $jsonArray = array();
    while($row = $res->fetchArray(SQLITE3_ASSOC)){ 
      //json_decode($row->content)
      $jsonArray[] = $row;
    }

    
    // free the memory, this in NOT done automatically, while your script is running
    $res->finalize();
    http_response_code(200);
    echo json_encode($jsonArray[0] ?? array());
  }

  //
  // POST /editor $payload
  function controller_editor_add($db, $payload) {
    if(!controller_editor_validate($payload)){
      response_fail();
    }

    $time = date("Y-m-d H:i:s");
    $statement = $db->prepare("INSERT INTO editors (slug, content,version, published, time) VALUES (:slug, :content,:version, :published, :time)");
    if(!$statement){
        echo "statement failed\n";
        echo $statement;
        response_fail();
    }
    $statement->bindValue(':slug', $payload->slug);
    $statement->bindValue(':content', json_encode($payload->content));
    $statement->bindValue(':version', $payload->version);
    $statement->bindValue(':published', $payload->published);
    $statement->bindValue(':time', $payload->time);
    
    $res = $statement->execute();

    if(!$res){
        echo $db->lastErrorMsg();
        http_response_code(500);
        exit();
    }
    $payload->id =  $db->lastInsertRowID();
    
    // free the memory, this in NOT done automatically, while your script is running
    $res->finalize();
    http_response_code(200);
    echo json_encode($payload);
  }


  //
  // PUT /editor $payload
  function controller_editor_update($db, $slug, $payload) {
    if(!controller_editor_validate($payload)){
      response_fail();
    }

    $time = date("Y-m-d H:i:s");
    $statement = $db->prepare("UPDATE editors SET content=:content,version=:version,published=:published,time=:time WHERE slug = :slug");
    if(!$statement){
        echo "statement failed\n";
        echo $statement;
        response_fail();
    }
    $statement->bindValue(':slug', $payload->slug);
    $statement->bindValue(':content', json_encode($payload->content));
    $statement->bindValue(':version', $payload->version);
    $statement->bindValue(':published', $payload->published);
    $statement->bindValue(':time', $payload->time);
    
    $res = $statement->execute();

    if(!$res){
        echo $db->lastErrorMsg();
        http_response_code(500);
        exit();
    }
    
    // free the memory, this in NOT done automatically, while your script is running
    $res->finalize();
    http_response_code(200);
    echo json_encode($payload);
  }  
  //
  // url form /param/param ?query body
  function controller_editor($db, $method, $params, $query, $body) {
    response_to_console($method,'event');
    switch ($method) {
      case 'GET':
        controller_editor_get($db, $params[2],$query);
        break;
      case 'POST':
        controller_editor_add($db, $body);
        break;
      case 'PUT':
        controller_editor_update($db,$params[2], $body);
        break;
      case 'DELETE':
        break;
      default:
      http_response_code(400);
      break;
    }
  }
?>