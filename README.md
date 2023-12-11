# cli-mailing
Cli-mailing is a tool created for sending emails, whether to one person or for mass distribution, based on the implementations of usvc-messaging by tokenproof.

## Prerequisites

 - NodeJS
 - Text-Editor

## Usage

Copy the file `config-example.js` as `config.js` in the root of the project.
  
 *MacOS - Linux UNIX Like OS*:

    cp config-example.js config.js

*Windows:*

    copy config-example.js config.js

Translate the values to the actual values of the following configuration parameters in the `config.js` file:

    const API_URL = "https://api.here.com/"
    const EMAIL_TEMPLATE = "EXAMPLE_TEMPLATE"
    const TEST_EMAILS = [ 
    // Test emails here:
    "user@domain.com",
    ]
    const EMAILS  = [
    // Users emails here:
    "user@domain.com",
    ]

Once the `config.js` file within the root has been completed with the desired parameters, this command should be executed in the terminal.

*npm*

    npm install && npm run start

*yarn*

    yarn install && yarn start

## License

MIT © [Jesus Cocaño](https://github.com/tokenproof)