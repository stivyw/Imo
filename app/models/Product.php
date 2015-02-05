<?php
class Product extends MyModel{
	
	public function scopeFilter($q, $filter){
		if(is_array($filter)){
			
			foreach($filter as $k=>$v){

				switch($k){

					case 'nome':!empty($v) && $q->where('nome', 'like', '%'.$v.'%');break;
					case 'user':!empty($v) && $q->where('user_id', $v);break;
					default:;
				}

			}
		}
	}
}