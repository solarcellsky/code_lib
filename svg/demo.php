<?php require_once('lib/SVGGraph.php');
    $width = 900;
    $height = 600;
    $settings = array( 
        'back_colour' => 'white',
        'graph_title' => 'Start of Fibonacci series'
    );
    $graph = new SVGGraph($width, $height, $settings);
    $graph->Values(0, 1, 1, 2, 3, 5, 8, 13, 21);
    $graph->Render('BarGraph'); 
?>