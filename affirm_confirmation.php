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
// setTimeout(function() {sendMessage("<?php  $checkout_token?>")}, 3000);
var result = "<?php echo $result?>";
var checkout_token = "<?php echo $checkout_token?>";

sendMessage();

function sendMessage(event) {
    console.log("attempting to send message to parent");
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
