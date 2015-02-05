<?php
class Simbologia extends MyModel{

	public function scopeFilter($q, $filter){
		if(is_array($filter)){
			foreach($filter as $k=>$v){

				switch($k){
					case 'nome':!empty($v) && $q->where('nome', 'like', '%'.$v.'%');break;
					default:;
				}

			}
		}
	}	
}