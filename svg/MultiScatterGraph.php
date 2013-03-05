<?php require_once('lib/SVGGraph.php');
    $width = 900;
    $height = 600;
    $settings = array( 
        'back_colour' => '#eee', 
        'stroke_colour' => '#000', 
        'back_stroke_width' => 0, 
        'back_stroke_colour' => '#eee', 
        'axis_colour' => '#333', 
        'axis_overlap' => 2, 
        'axis_font' => 'Georgia', 
        'axis_font_size' => 10, 
        'grid_colour' => '#666', 
        'label_colour' => '#000', 
        'pad_right' => 20, 
        'pad_left' => 20, 
        'marker_colour' => array('red', 'blue', 'green', 'orange'), 
        'marker_type' => array('square', 'triangle', 'x', 'cross'), 
        'marker_size' => array(5, 10, 15, 20), 
        'scatter_2d' => true, 
        'best_fit' => 'straight', 
        'best_fit_dash' => '2,2', 
        'best_fit_colour' => array('red', 'blue', 'green', 'orange')
    );
    $values =array(
        array( 
            array(1,10),
            array(3,10), 
            array(4,10), 
            array(5,10), 
            array(7,10), 
            array(9,10) 
        ),
        array( 
            array(1,20),
            array(3,20), 
            array(4,20), 
            array(5,20), 
            array(7,20), 
            array(9,20) 
        ),
        array( 
            array(1,30),
            array(3,25), 
            array(4,40), 
            array(5,45), 
            array(7,30), 
            array(9,30) 
        ),
        array( 
            array(1,50),
            array(3,15), 
            array(4,45), 
            array(5,60), 
            array(7,65), 
            array(9,55) 
        )
    );
    $graph = new SVGGraph($width, $height, $settings);
    $graph->Values($values);
    $graph->Render('MultiScatterGraph');
?>