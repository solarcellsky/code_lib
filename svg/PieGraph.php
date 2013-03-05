<?php require_once('lib/SVGGraph.php');
    $width = 900;
    $height = 600;
    $settings = array( 
        'back_colour' => '#eee', 
        'stroke_colour' => '#000', 
        'back_stroke_width' => 0, 
        'back_stroke_colour' => '#000',
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
        'show_labels' => true, 
        'show_label_amount' => true, 
        'label_font' => 'Georgia',
        'label_font_size' => 40,
        'label_fade_in_speed' => 30,
        'label_fade_out_speed' => 15,
        'depth' => 50,
        'start_angle' => 30,
        'sort' => false
    );
    $values = array(
        'Dough' => 30, 
        'Ray' => 50, 
        'Me' => 40, 
        'So' => 25, 
        'Far' => 45, 
        'Lard' => 35
    ); 
    $colours = array(
        '#ccf',
        '#699',
        '#93c',
        '#996',
        '#f39',
        '#0f3',
        '#339'
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
    $graph->Render('Pie3DGraph');
?>