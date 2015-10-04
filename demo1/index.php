<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<form action="<?=$_SERVER['PHP_SELF'] ?>" method="POST">
		Username : <input type="text" name="username">
		<button type="Submit"> POST</button>
	</form>

	<?php
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$name = $_POST['username'];
			if (empty($name)) {
				echo 'empty';
			} else {
				echo $name.'<br>';
			}
		}

	?>
</body>
</html>