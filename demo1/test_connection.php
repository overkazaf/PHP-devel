<?php
	$database = '127.0.0.1';
	$username = 'root';
	$password = '';
	$dbname   = 'test';

	$conn = mysqli_connect($database, $username, $password);
    if (!$conn) {
    	die('Cannot connect');
    }

    echo 'Connection created<br>';

    $sql = 'select * from '. $dbname .'.user';
    $res = $conn->query($sql);

    if ($res->num_rows > 0) {
    	
    	echo '<br>';
    	$html = '';

		$html .= '<table border="1" width="100%">';
		$html .= '<thead>';
		$html .= '<tr>';
		$html .= '<th width="15%">ID</th>';
		$html .= '<th width="50%">NAME</th>';
		$html .= '<th width="35%">AGE</th>';
		$html .= '</tr>';
		$html .= '</thead>';
		$html .= '<tbody>';

    	while ($row = $res->fetch_assoc()) {
    		$html .= '<tr>';
    		$html .= "<td>$row[id]</td>";
    		$html .= "<td>$row[name]</td>";
    		$html .= "<td>$row[age]</td>";
    		$html .= '</tr>';
    	}

    	$html .= '</tbody>';
    	$html .= '</table>';
    	echo $html;
    }
?>