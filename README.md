# example-code
You can use the project to test various forms of checkout, promos, and prequals.

The following configurations are available: 
- local js pointing to integration
- local js pointing to local server
- integration js pointing to integration server

TODO:
- integration/prod js pointing to local server (currently provided by test merchant running in vagrant)

## Running the Project ##
1. Follow [these instructions](https://discussions.apple.com/docs/DOC-3083) to set up Apache.
The PHP bits aren't relevant
2. Set up a sym link from the directory you pointed apache to -> this repo.
3. If you followed the instructions above you'll be able to direct your browser to something like `http://localhost/~brianregan/example-code/index.html`
4. Choose the environment you want to test, and enter a valid public api key for a merchant in that environment.

## Testing with local affirm.js ##
1. If you want to use your local affirm.js you'll have to modify web-ux dev_keys.json.
   	Set affirm_api_url to localhost:3000/api/v2/, frontend url to localhost:3001
2. From your web-ux/affirm-js directory, run `make serve`
3. From your web-ux/checkout directory, run `make serve`

You can also modify dev_keys.json to point to a locally running instance of platform.

## Testing Promos ##
1. In promos.html, you'll have to set data-promo-id to the externalId of the promo, which you can find in mordor.
2. have to set the promos_url_prefix and dev_keys.js in web-ux if you're testing the local affirm.js

