<?php
//08002803566 unimed boleto

class ModelController extends MyController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function getIndex($model = null, $id = null)
	{

		$this->isModel($model, true);
		$rels = Input::get('rels');
		if(is_string($rels) && $rels[0] == '[')
			$rels = json_decode($rels);
#$this->res->rels = $rels;
#return Response::json($this->res);



		if(!empty($id)){
			if($rels)
				$item = $model::find($id)->load($rels);
			else
				$item = $model::find($id);

			$this->res->query=DB::getQueryLog();
			if(empty($item))
				App::abort(400, 'O item não está cadastrado!');

			//$item->onSelect();
			$this->res->item = $item;
		}else{

			$per_page = Input::get('per_page');
			
			//filters and relations
			$filters = Input::get('filters');
	//foreach($filters as $k=>$v)$arr[$k] = $v;
			$filters = (array) json_decode($filters);
			
			if($rels)
				$item = $model::with($rels)->filter($filters);
			else
				$item = $model::filter($filters);
			
			//order_by
			if(Input::has('orderBy') || Input::has('order'))
				//$item->orderBy((Input::get('orderBy') ?: 'id'), Input::('order')=='asc' ? 'asc':'desc');
				$item->orderBy(Input::get('orderBy') ?: 'id', Input::get('order'));
			//, Input::('order')

			$item->take(Input::get('take') ?: 30);
			$item->skip(Input::get('skip'));
			
			$this->res = $item->paginate($per_page)->toArray();

			//$this->res->items->toArray();
		}
		return Response::json($this->res);
	}

	public function postIndex($model = null, $id = null){

		$this->isModel($model, true);
		if($id===null){
			$item = new $model;
		}else{
			$item = $model::find($id);
			if(empty($item))
				App::abort(400, 'O item não está cadastrado!');

		}
		$item->byPost();
		$this->res->ok = $item->save();
		$this->res->item = $item->onSelect();
		return Response::json($this->res);
	}
	public function missingMethods($model = null, $args = null){

		$this->res = array($model, $args, Input::all());
		return Response::json($this->res);

		$this->isModel($model, true);
		
		if(sizeof($args)==1){
			$this->res->item = $model::find($args[0]);
			return Response::json($this->res);
		}
		App::abort(404);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($model, $id=null)
	{
		$this->isModel($model, true);
		$this->res->users = $model::find(2);
		return Response::json($this->res);
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
