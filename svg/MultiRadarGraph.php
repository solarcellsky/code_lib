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
        'link_base' => '/', 
        'link_target' => '_top', 
        'fill_under' => true, 
        'marker_size' => 8, 
        'marker_type' => array('x', 'cross'), 
        'marker_colour' => array('blue', 'red') 
    );
    $values = array(
        array(
            'Dough' => 30, 
            'Ray' => 50, 
            'Me' => 40, 
            'So' => 25, 
            'Far' => 45, 
            'Lard' => 35
        ),
        array(
            'Dough' => 20, 
            'Ray' => 30, 
            'Me' => 20, 
            'So' => 15, 
            'Far' => 25, 
            'Lard' => 35, 
            'Tea' => 45
        )
    );
    $colours = array(
        array('red', 'yellow'), 
        array('blue', 'white')
    );
    $links = array(
        'Dough' => 'jpegsaver.php', 
        'Ray' => 'crcdropper.php', 
        'Me' => 'svggraph.php'
    );
    $graph = new SVGGraph($width, $height, $settings);
    $graph->colours = $colours;
    $graph->Values($values);
    $graph->Links($links);
    $graph->Render('MultiRadarGraph');
?>