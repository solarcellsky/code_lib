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
        'grid_colour' => '#ccc', 
        'label_colour' => '#000', 
        'pad_right' => 20, 
        'pad_left' => 20, 
        'fill_under' => array(true, false), 
        'marker_size' => 5, 
        'marker_type' => array('circle', 'square'), 
        'marker_colour' => array('blue', 'red') ,
        'graph_title' => 'elevation chart'
    );
    $values = array( 1000, 1500, 300, 500,  900, 813);
    $colours = array(
        array('#fff', '#000')
    ); 
    $graph = new SVGGraph($width, $height, $settings); 
    $graph->colours = $colours;
    $graph->Values($values);
    $graph->Render('LineGraph');
?>