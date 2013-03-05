<?php require_once('lib/SVGGraph.php');
    $width = 900;
    $height = 600;
    $settings =  array( 
        'back_colour' => 'white',
        'graph_title' => 'Markers',
        'graph_title_position' => 'left',
        'graph_title_colour' => '#900',
        'graph_title_space' => 20,
        'graph_title_font_size' => 40
    );
    $values = array(
        array(
            'Dough' => 10, 
            'Ray' => 10, 
            'Me' => 10, 
            'So' => 10, 
            'Far' => 10, 
            'Lard' => 10
        ),
        array(
            'Dough' => 20, 
            'Ray' => 20, 
            'Me' => 20, 
            'So' => 20, 
            'Far' => 20, 
            'Lard' => 20
        ),
        array(
            'Dough' => 30, 
            'Ray' => 30, 
            'Me' => 30, 
            'So' => 30, 
            'Far' => 30, 
            'Lard' => 30
        )
        ,
        array(
            'Dough' => 40, 
            'Ray' => 40, 
            'Me' => 40, 
            'So' => 40, 
            'Far' => 40, 
            'Lard' => 40
        ),
        array(
            'Dough' => 50, 
            'Ray' => 50, 
            'Me' => 50, 
            'So' => 50, 
            'Far' => 50, 
            'Lard' => 50
        ),
        array(
            'Dough' => 60, 
            'Ray' => 60, 
            'Me' => 60, 
            'So' => 60, 
            'Far' => 60, 
            'Lard' => 60
        ),
        array(
            'Dough' => 70, 
            'Ray' => 70, 
            'Me' => 70, 
            'So' => 70, 
            'Far' => 70, 
            'Lard' => 70
        ),
        array(
            'Dough' => 80, 
            'Ray' => 80, 
            'Me' => 80, 
            'So' => 80, 
            'Far' => 80, 
            'Lard' => 80
        ),
        array(
            'Dough' => 90, 
            'Ray' => 90, 
            'Me' => 90, 
            'So' => 90, 
            'Far' => 90, 
            'Lard' => 90
        ),
        array(
            'Dough' => 100, 
            'Ray' => 100, 
            'Me' => 100, 
            'So' => 100, 
            'Far' => 100, 
            'Lard' => 100
        ),
        array(
            'Dough' => 110, 
            'Ray' => 110, 
            'Me' => 110, 
            'So' => 110, 
            'Far' => 110, 
            'Lard' => 110
        ),
        array(
            'Dough' => 120, 
            'Ray' => 120, 
            'Me' => 120, 
            'So' => 120, 
            'Far' => 120, 
            'Lard' => 120
        ),
        array(
            'Dough' => 130, 
            'Ray' => 130, 
            'Me' => 130, 
            'So' => 130, 
            'Far' => 130, 
            'Lard' => 130
        ),
        array(
            'Dough' => 140, 
            'Ray' => 140, 
            'Me' => 140, 
            'So' => 140, 
            'Far' => 140, 
            'Lard' => 140
        )
    ); 
    $settings['marker_size'] = 8; 
    $settings['marker_type'] = array(
        "circle", 
        "square", 
        "triangle", 
        "cross", 
        "x", 
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
    $settings['legend_entries'] = array(
        "circle", 
        "square", 
        "triangle", 
        "cross", 
        "x", 
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