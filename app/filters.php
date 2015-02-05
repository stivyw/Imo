<?php

App::error(function(Exception $e, $code)
{

	$err = new stdClass;
	//$pathInfo = Request::getPathInfo();
	$err->message = $e->getMessage();
	$err->dump = false;
	$err->code=$code;
	
	if(true || App::make('gbl')->debug){
		#$err->line = $e->getLine();
		#$err->file = $e->getFile();
		$err->dump = '';
		do {
			$err->dump .= $e->getFile() .':'. $e->getLine() .' '. $e->getMessage() .' ('. $e->getCode() .') ['. get_class($e) . ")\n";
		} while($e = $e->getPrevious());

	}

//	Log::error("$code - $message @ $pathInfo\r\n$e");

	if (Config::get('app.debug')) {return;}
//return Response::make('errors/asfd');
	if(empty($err->message))
		switch ($code)
		{
			case 403:$err->message = 'Erro( '. $message .' )';break;
			case 404:$err->message = 'Erro! Este local não existe.';break;
			case 500:$err->message = 'Erro interno do servidor( '. $message .' )';break;
			default: $err->message = 'Erro( '. $message .' )';
		}
	$res['error'][] = $err;
	return Response::json($res);
});

App::before(function($request)
{

	$gbl = new stdClass;
	$gbl->debug = false;
	$checkInterval = 20;

	$cnt = (int) Session::get('cnt_check');

	if($cnt>$checkInterval || !Session::get('check')){
		Session::put('check', Auth::check());
		$cnt = 0;
	}
	Session::put('cnt_check', ++$cnt);

/** /
	$gbl->user = $gbl->check ? Cache::rememberForever('user', function(){
		return Auth::user()->toArray();
	}) : (Cache::has('check') && Cache::forget('check')) && false;
/** /
	if($gbl->user){
		$gbl->perms = unserialize($gbl->user['perms']);
	}
/**/
	App::instance('gbl', $gbl);

});


App::after(function($request, $response)
{
	//return Response::json($response);
});


Route::filter('auth', function()
{
	if (Auth::guest())
	{
		if (Request::ajax())
		{
			return Response::make('Unauthorized', 401);
		}
		else
		{
			return Redirect::guest('login');
		}
	}
});


Route::filter('auth.basic', function()
{
	return Auth::basic('username');
});


Route::filter('guest', function()
{
	if (Auth::check()) return Redirect::to('/');
});

/** /
Route::filter('csrf', function()
{
	if (Session::token() != Input::get('_token'))
	{
		throw new Illuminate\Session\TokenMismatchException;
	}
});
/**/

Route::filter('csrf', function()
{
  if(Request::json() && !Input::get('_token'))
  {
    if(Session::token() != Request::header('X-CSRF-Token'))
//      throw new Illuminate\Session\TokenMismatchException;
    	App::abort(403, 'Sua sessão expirou ou você não tem permissão para acessar! Por favor, refaça o login.');
  } else if (!Request::json()) {
    if(Session::token() != Input::get('_token'))
//      throw new Illuminate\Session\TokenMismatchException;
    	App::abort(403, 'Sua sessão expirou ou você não tem permissão para acessar.! Por favor, refaça o login.');
  }
});
/**/
