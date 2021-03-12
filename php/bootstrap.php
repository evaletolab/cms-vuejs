<?php
  $sqliteDebug = true;
  $db = null;

  //
  // verify token
  function bootstrap_authenticate($token) {
    if(!isset($token)) {
      return false;
    }

    preg_match('/Bearer\s(\S+)/', $token, $matches);
    if(!isset($matches[1])) {
      return false;
    }

    //
    // hardcoded security
    $content = $matches[1];
    if($content != 'abcd') {
      return false;
    }

    //
    // should return role instead true 
    // token X1 => user, 
    // token X2 => admin
    return true;
  }

  function response_to_console($data, $name) {
      $output = $data;
      if (is_array($output)) {
        $output = implode(',', $output);
      }

      //echo "<script>console.log('--DBG " . ($name ?? 'object') .": " . $output . "' );</script>\n";
  }


  function bootstrap_parse_payload() {
    try{
      $json = file_get_contents('php://input');
  
      // Converts it into a PHP object
      $payload = (object)json_decode($json, false);  
    } catch(Exception $exception) {
      $payload = NULL;
    }
    return $payload;
  }


  function response_fail(){
      http_response_code(400);
      exit();
  }

  function db_init(){
    try {
      global $db;
      // connect to your database
      $db = new SQLite3('./db.sqlite');
      $db->busyTimeout(5000);
      // WAL mode has better control over concurrency.
      // Source: https://www.sqlite.org/wal.html
      $db->exec('PRAGMA journal_mode = wal;');
      return $db;
  
    }
    catch (Exception $exception) {
      // sqlite3 throws an exception when it is unable to connect
      echo '<p>There was an error connecting to the database!</p>';
      if ($sqliteDebug) {
          echo $exception->getMessage();
      }
      http_response_code(500);
      exit();
    }
  
  }

  function db() {
    global $db;
    return $db;
  }

  function db_close() {
    global $db;
    $db->close();
  }

  function db_exit() {
    global $db;
    $db->close();
    exit();
  }

?>