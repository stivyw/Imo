<?php

class MyController extends Controller {
	protected $res;//return
	protected $gbl;//global
	protected function setupLayout()
	{
		$this->res = new stdClass;
		$this->base = URL::to('/');
		$this->gbl = App::make('gbl');
		$this->gbl->files = '/tmp/sw_tmp/www/files';
		$this->gbl->debug = true;
		

	}
	function isModel($name, $abort = false){
		!($res = is_subclass_of($name, 'Eloquent')) && $abort && App::abort('404');
		return $res;
	}
}
