<?php
!defined('BASEPATH') && define('BASEPATH', __DIR__ . '/../../sys');
!defined('APPPATH') && define('APPPATH', __DIR__.'/../app');
define('LARAVEL_START', microtime(true));

require BASEPATH.'/vendor/autoload.php';

if (file_exists($compiled = BASEPATH.'/start/compiled.php')){
	require $compiled;
}
Patchwork\Utf8\Bootup::initMbstring();
Illuminate\Support\ClassLoader::register();

if (is_dir($workbench = __DIR__.'/../workbench')){
	Illuminate\Workbench\Starter::start($workbench);
}

$app = new Illuminate\Foundation\Application;
$env = $app->detectEnvironment(array(

	'local' => array('homestead'),

));

$app->bindInstallPaths(array(
		'app' => APPPATH,
		'public' => __DIR__,
		'base' => BASEPATH,
		'storage' => '/tmp/sw_tmp/apps/storage'

));

$framework = $app['path.base'] . '/vendor/laravel/framework/src';

require $framework.'/Illuminate/Foundation/start.php';

!isset($artisan) && $app->run();
