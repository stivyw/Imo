<?php
class MyModel extends Eloquent{
	public function setFields($fields){
		foreach($fields as $k=>$v)
			$this->$k = $v;
	}
	public function scopeFilter($q, $filter){
		if(is_array($filter)){
			foreach($filter as $k=>$v){
				$operand = null;
				if(is_array($v)){
					$value = $v[1];
					$operand = $v[0];
				}else
					$value = $v;
				$q->where($k, $value, $operand);
			}
		}
	}
	public function byPost(){
		foreach($this->attributes as $k=>$v){
			$pval = Input::get($k);
			if($pval && $pval!==$this->$k)
				$this->$k = $pval;
		}

	}
	public function onSelect(){}
}
