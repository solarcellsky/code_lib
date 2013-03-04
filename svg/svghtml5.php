<?php require_once 'lib/SVGGraph.php';
$graph = new SVGGraph(400, 300); ?>
<!DOCTYPE html>
<html>
<head>
	<title>SVGGraph HTML5</title>
</head>
<body>
	<h1>Example of SVG in HTML5</h1>
	<div> 
		<?php 
			$graph->Values(10, 14, 6, 3, 20, 14, 16);
			echo $graph->Fetch('BarGraph', false); 
		?>
	</div>
	<div>
		<?php
		$graph->Values(8, 15, 14, 19, 12, 15, 13);
		echo $graph->Fetch('BarGraph', false); ?>
	</div>
	<?php echo $graph->FetchJavascript(); ?>
</body>
</html>