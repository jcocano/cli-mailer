# cli-mailer
cli-mailer is a tool created for sending emails, whether to one person or for mass distribution, based on the implementations of usvc-messaging by tokenproof.

## Prerequisites

 - NodeJS
 - Text-Editor (optional)

## General Configuration

This script works with a JSON Array where the sending properties are located, the data that has to go in each json object is at least "to": the data that is inside the payload will change depending on the sendgrid template to be used.

The Json should look similar to this example [(see reference in example.json here code)](https://github.com/tokenproof/cli-mailer/blob/main/example.json)
```
[
  {
    "to": "user@domain.xyz",
     "payload": {
        "pickupTimeWindow": "9:00 AM to 11:00 AM",
        "host": "tokenproof",
        "hhDateTime": "November 3, 7:00 - 10:00 pm",
        "hhLocation": "this is a location",
        "hhName": "gm"
        }
  },
  { ... }
]
```

Then you have to change the value of the EMAIL_TEMPLATE constant in the config.js file to the value of the template to be used (use the usvc-messaging list function to obtain the template)

    const EMAIL_TEMPLATE = 'MY_TEMPLETE_HERE!'
    
The program needs the MAILING_LIST and START_AT env vars to be passed in order to be executed

*MAILING_LIST*:
This variable refers to the location of the JSON file. If it is in the same folder, the path would be like this:
    
    MAILING_LIST = ./my_file.json

*START_AT*:
This variable refers to the index from which the emails will begin to be sent. This is useful if you have 2 or more recipients, you can decide where to start sending the emails from.
    
    START_AT = 0

## Usage

 *MacOS - Linux UNIX Like OS*:
 
    MAILING_LIST=./json/path START_AT=0 node index.js

 *Windows*:

    set MAILING_LIST=./json/path && set START_AT=0 && node index.js

*npm*

    npm install && npm run start

*yarn*

    yarn install && yarn start

## License

MIT © [Jesus Cocaño](https://github.com/tokenproof)