<?php

/**
 * Holds the registered routes
 *
 * @var array $routes
 */
$routes = [];
$pathNotFound = NULL;


function router_not_found($callback) {
  $pathNotFound = $callback;
}

/**
 * Register a new route
 *
 * @param $action string
 * @param \Closure $callback Called when current URL matches provided action
 */
function router_add($expression, Closure $callback, $method = NULL) {
  global $routes;
  // $action = trim($action, '/');
  // $routes[$action] = $callback;

  array_push($routes,Array(
    'expression' => ('^'.$expression),
    'function' => $callback,
    'method' => ($method ?? NULL)
  ));
}

function router_parse_authorization() {
  $headers = apache_request_headers();
  if(isset($headers['Authorization'])){
    return $headers['Authorization'];
  }
  if(isset($headers['Authorization '])){
    return $headers['Authorization '];
  }
  return NULL;
}

/**
 * Parse body content as JSON
 */
function router_parse_payload() {
  try{
    $json = file_get_contents('php://input');

    // Converts it into a PHP object
    $payload = (object)json_decode($json, false);  
  } catch(Exception $exception) {
    $payload = NULL;
  }
  return $payload;
}

/**
 * Dispatch the router
 *
 * @param $action string
 */
function router_dispatch(){
  $query = $_GET ?? [];
  $payload = router_parse_payload();
  $method = $_SERVER["REQUEST_METHOD"];
  $action = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $uri = explode( '/', $action );
  $token = $_SERVER['Authorization'];


  global $routes;
  global $pathNotFound;
  // $action = trim($action, '/');
  // $callback = $routes[$action];

  // echo call_user_func($callback);

  // Parse current url
  $parsed_url = parse_url($action);
  $path = $parsed_url['path'];

  $basepath = '/';
  $path_match_found = false;
  $route_match_found = false;

  foreach($routes as $route){
    // Check path match	
    if(preg_match('#'.$route['expression'].'#',$path,$matches)){

      $path_match_found = true;

      // Check method match
      if($route['method']){
        if(strtolower($method) == strtolower($route['method'])) {
          call_user_func_array($route['function'], array($method, $uri, $query, $payload));
          $route_match_found = true;
          break;
        }  
      } else {
        call_user_func_array($route['function'], array($method, $uri, $query, $payload));
        $route_match_found = true;
        break;
      }
    }
  }

  // No matching route was found
  if(!$route_match_found){

    // But a matching path exists
    if($path_match_found){
      header("HTTP/1.0 405 Method Not Allowed");
      // if(self::$methodNotAllowed){
      //   call_user_func_array(self::$methodNotAllowed, Array($path,$method));
      // }
    }else{
      header("HTTP/1.0 404 Not Found");
      if($pathNotFound){
        call_user_func_array($pathNotFound, Array($path));
      }
    }

  }
}


// require_once "router.php";

// route('/', function () {
//     return "Hello World";
// });

// route('/about', function () {
//     return "Hello form the about route";
// });

// $method = $_SERVER['REQUEST_METHOD'];
// $action = $_SERVER['REQUEST_URI'];
// dispatch($action,$method);