<?php
class AuthController extends MyController {

	public function getIndex()
	{
		$gbl = App::make('gbl');
		//$this->res->user = Session::get('user');
		$this->res->ok = Session::get('check') && Session::token() == Request::header('X-CSRF-Token');
		$this->res->ctn = Session::get('cnt_check');
		$this->res->query=DB::getQueryLog();
//		$this->res->tk = Request::header('X-CSRF-Token');
		return Response::json($this->res);
	}

	public function postIndex()
	{
		Session::forget('check');

		$userdata = array(
			'username' => Input::get('username'),
			'password' => Input::get('password')
		);
		if($userdata['username'] && $userdata['password']){
			Session::forget('user');
			if(Auth::attempt($userdata)){
				$this->res->token = Session::token();
				Session::put('user', Auth::user()->toArray());
			}
			else
				$this->res->error = true;
		}
		
		$this->res->user = Session::get('user');

		return Response::json($this->res);
	}
	public function getLogout()
	{
		!Auth::guest() && Auth::logout();
		Session::forget('check');
		Session::forget('cnt_check');
		$this->res->ok = true;
		
		return Response::json($this->res);

	}
	public function getClear()
	{
		!Auth::guest() && Auth::logout();
		Session::forget('user');
		Session::forget('check');
		Session::forget('cnt_check');
		$this->res->ok = true;
		return Response::json($this->res);

	}

}
