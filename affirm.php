<?php

$public_key = "PreSeededApiKeyDirect";
$private_key = "PreSeededMerchantSecretKeyDirect";
$base_url = "https://cherry-ave-sandbox.affirm-odin.com/api/v2/";
// $base_url = "https://cherry-ave.affirm-odin.com/api/v2/";
// $public_key = "ARQBLCL7NAMBTZ7F";
// $private_key = "RkHBmVSP5ayC2rCUujwhArpGWPxpuTtv";
// $base_url = "https://sandbox.affirm.com/api/v2/";

$action = $_REQUEST["action"];

$affirm = new Affirm();

switch ($action) {
    case 'checkout':
        $affirm->checkout();
        break;
    case 'card':
        $affirm->card();
        break;
    default:
        echo "Hi!";
        break;
}

class Affirm {

    public function checkout() {

        $checkout_object = urldecode($_REQUEST["checkout_object"]);
        $endpoint = "checkout/direct";
        $method = "POST";
        $data = $checkout_object;
        $env = $_REQUEST["env"];
        $this->request($endpoint, $method, $data, $env);
    }

    public function card() {

        $checkout_token = $_REQUEST["checkout_token"];
        $endpoint = "checkout/" . $checkout_token . "/checkout_instrument";
        $method = "GET";
        $data = "";
        $env = $_REQUEST["env"];
        $this->request($endpoint, $method, $data, $env);
    
    }

    public function request($a, $b, $c, $d) {

        global $public_key, $private_key, $base_url;

        $url = $base_url . $a;
        $json;
        if ($a === "checkout/direct") {
            $json = $c;
        }
        else {
            $json = json_encode($c);
        }
        $header = array('Content-Type: application/json','Content-Length: ' . strlen($json));
        $keypair = $public_key . ":" . $private_key;

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $b);
        curl_setopt($curl, CURLOPT_USERPWD, $keypair);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

        $response = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
        http_response_code($status); 
        echo $response;
    }
}

?>
