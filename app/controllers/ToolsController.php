<?php

class ToolsController extends MyController {
	function getFile(){

	}
	function postUpload(){
		if(Input::hasFile('file')){
			$f = Input::file('file');

			$dir = $this->gbl->files;
			$ext = $f->getClientOriginalExtension();

			do{
				$name = str_random(50);
				$file = $dir . '/' . $name . '.' . $ext;
			}while(is_file($file));
			$data['formName'] = $f->getRealPath();
			if($f->move($dir, $file)){
				$data['name'] = $name;
				$data['ext'] = $ext;

				$this->res = $data;
			}
				
				

		}else
			App::abort(400, 'Nenhum arquivo mandado, verifique se os arquivos estão no tamanho correto.');
		return Response::json($this->res);
	}
	function postRemove(){
		$p = Input::all();
		if(isset($p['name'],$p['ext'])){
			$file=$this->gbl->files . '/' . $p['name'] . '.' . $p['ext'];
			$this->res->file = $file;
			$this->res->ok = is_file($file) && unlink($file);
		}
		return Response::json($this->res);
		
	}
}
