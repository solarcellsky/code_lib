<?php require_once('lib/SVGGraph.php');
    $width = 900;
    $height = 600;
    $settings = array( /* settings for grid, legend */ ); 
    $values = array( /* values are generated */ ); 
    $settings['marker_size'] = 10; 
    $settings['marker_type'] = array(
    	"circle", 
    	"square", 
    	"triangle", 
    	"cross", "x", 
    	"pentagon", 
    	"diamond", 
    	"hexagon", 
    	"octagon", 
    	"asterisk", 
    	"star", 
    	"threestar", 
    	"fourstar", 
    	"eightstar"
    );
    $graph = new SVGGraph($width, $height, $settings);
    $graph->colours = array('#e11','#1b1','#11e','#e71','#333');
    $graph->Values($values);
    $graph->Render('MultiScatterGraph');
?>