<?php

class BaseController extends Controller {
	protected $layout = 'layouts.master';
	protected $layout_ajax = 'layouts.ajax';
	protected $ajax = false;

	protected function setupLayout()
	{


		$login = false;
		if(Auth::check()){
			$v['user'] = Auth::user()->toArray();
			$v['user']['avatar'] = 'https://scontent-a-gru.xx.fbcdn.net/hphotos-prn2/v/t1.0-9/541899_608907005834244_1196288044_n.jpg?oh=ca0ee85cccd252b6876ffe9986a68924&oe=54863764';
			$login = true;
		}
		$v['user']['login'] = $login;
		
		$this->layout = View::make(!Request::ajax()?$this->layout:$this->layout_ajax,$v);
		$this->layout->title = 'LFApp';

	}

}
