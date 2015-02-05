<?php

Route::controller('/auth', 'AuthController');
Route::controller('tools', 'ToolsController');

Route::group(array('prefix' => 'api/v1', 'before' => 'csrf'), function()
{
	Route::controller('model/{name}/{id}', 'ModelController');
	Route::controller('model/{name}', 'ModelController');
	
});
