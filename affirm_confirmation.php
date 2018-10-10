<?php
$result = $_REQUEST["result"];
$checkout_token = $_REQUEST["checkout_token"];
?>
<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <title>Confirmation</title>
</head>
<body>
    <?php echo $checkout_token?>
</body>
<script>
var result = "<?php echo $result?>";
var checkout_token = "<?php echo $checkout_token?>";

sendMessage();

function sendMessage(event) {
    console.log("Sending checkout confirmation/cancellation postMessage to parent window.");
    _a = {
        "close_modal": true,
        "result": result,
        "checkout_token": checkout_token
    };
    if (window.opener) {
        window.opener.postMessage(_a,"*");
    }
    else {
        window.parent.postMessage(_a, "*");
    }
}
</script>
</html>
