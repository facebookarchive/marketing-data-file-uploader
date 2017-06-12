# FB Marketing Data File Uploader
FB Marketing Data File Uploader (referred as 'MDFU' hereinafter) is a command line tool and node.js module that helps Facebook advertisers and marketing partners upload offline transactions to the FB marketing API without building their own application for API integration.

## Why use MDFU?
* Building API integration will require engineering resources and takes many development hours.   Typically one engineer will need to spend about 3 weeks for development and testing to build reliable integration.
* In order to achieve the best possible match between your customers and FB users, the data needs to be normalized and hashed correctly.  This tool uses the library written by FB to ensure the best possible match rate.
* For any issues with this tool, you will get support from Facebook.
* This tool will be updated periodically to support more advanced features.

## Requirements
FB Marketing Data File Uploader requires or works with
* Mac OS X, Linux, or Windows
* Offline conversions data in CSV format.  Download Example [Here](http://facebook.com/images/ads/signals/example_files/example_events_file.csv)
* User configured settings file.  See example [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_file_uploader.conf.yml.example)
* User configured column mapping file.  See example [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_column_mapping.json.example)
* FB App used for API calls.  See [this guide](https://developers.facebook.com/docs/apps/register) for instructions.
* FB system user token that has access to the offline event set used for the upload.  For creating system user and token, see instructions [here](https://www.facebook.com/business/help/755714304604753?helpref=search&sr=2&query=system%20user).  (Regular user access token can be used, but using system user token is highly recommended)

## Installing FB Marketing Data File Uploader
MDFU can be used in 3 different ways based on your environment and need:

(*Note*: If your organization does not support node.js, please see answer to question #2 in FAQ section below.)

**Option 1**: Install globally and use as command line tool

```
$ npm install -g marketing-data-file-uploader
$ marketing-data-file-uploader --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
2017-05-15T15:52:55.176Z INFO Rows 1 - 500 - Successfully uploaded 10 events.
...
```

**Option2**: Install locally and require the module to use it inside your own node app
```
$ npm install marketing-data-file-uploader --save

(In your app's .js file)
const MDFU = require('marketing-data-file-uploader');
MDFU.uploadConversionsFeed();

$ node your_app.js --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
2017-05-15T15:52:55.176Z INFO Rows 1 - 500 - Successfully uploaded 10 events.
...
```

**Options 3**. Build binary deployable to windows/linux/mac

```
$ git clone https://github.com/facebookincubator/marketing-data-file-uploader

$ npm install
$ npm run build-binary (or build-binary-exe for Windows)
$./build/marketing-data-file-uploader --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
2017-05-15T15:52:55.176Z INFO Rows 1 - 500 - Successfully uploaded 10 events.
...
```

## How MDFU works

This is a node.js application that will go through following steps to upload your offline conversions to FB's marketing API.
1. Read configurations and column mappings
2. Read input file in stream
3. For each line read, columns are normalized and hashed for upload.
4. Collect normalized and hashed data into batches (per batch size configured.  Default: 500)
5. POST each batch to the API endpoint
6. *How the binary is built*: Binary file containing node runtime is built using an open source utility called [nexe](https://github.com/nexe/nexe).

## How to use MDFU

1. Install per instruction above.
2. Set up tool configuration file and column mapping file
3. Get access token for API calls
4. Run on command line or schedule execution with tools such as crontab



### Available Configuration options

Configuration options can either be stored in a file (.yml format) or passed in as command line arguments.  See following for available options:

|Option       |Description        | default |
|-------------|-------------------|---------|
|accessToken*  |  Access token for API call |  |
|columnMappingFilePath| File containing column mapping info. For more info see **Column Mapping File** section below.|oca_column_mapping.json in current directory|
|configFilePath*| File containing offline conversions data|   oca_file_uploader.conf.yml in current directory.  For more info about config options see **Available Configuration options** section below.|
|dataSetId| ID of your offline event data set| |
|inputFilePath| File containing offline conversions data | |
|logging| Control the logging level of program (available options: silly, debug, info, warn, error)| info |
|uploadTag| Tag to identify the events uploaded.  Should use unique string for each distinct file uploaded. | Offline Conversions |
|uploadTagPrefix| Instead of providing uploadTag, you can also define prefix (ex: Offline Conversions), then the tool will append filename/timestamp and use it as the uploadTag. If uploadTag is set, uploadTagPrefix is ignored.  ex) *Offline Conversions (example_events_big_100k.csv@1493837377000)* |  |

* These options can only be passed in as command line arguments and cannot be set in configuration file.

See example file here:  [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_file_uploader.conf.yml.example)

### Column Mapping File

You need to define what each column in the file is for.  See an example [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_column_mapping.json.example)

and description of each key in the JSON file below:

| Field | Description | Required? |
|-------|-------------|-----------|
|header | Whether the file has header row or not | Yes |
|delimiter | The delimiter for column.  comma for CSV, tab for TSV, etc...| Yes |
|mapping| The mapping for columns in the file.  key-value pair represents "column index": "column type".  For more detailed description for each column type, please see **Column Types** section below| Yes |
|infoForNormalization| Format of your dob field to help with the normalization. See **infoForNormalization** section below for more info | No |
|customTypeInfo| Info for the key-value pairs of custom_data fields. See **customTypeInfo** section below for more info. | No |

#### Column Types

|Column Type| Required? | Description |
|-----------|-----------|-------------|
|event_time | Yes | Use ISO8601 format or unixtime timestamp |
|event_name | Yes | See event_time row in the [data parameters table](https://developers.intern.facebook.com/docs/marketing-api/offline-conversions/#data-parameters)|
|currency   | Yes | Three-letter ISO currency for this conversion event. Required for Purchase events. |
| value | Yes | Value of conversion event. Required for Purchase event. ex) 16.00 |
| match_keys.xxxxx | Yes | The identifier info used to match people.  xxxxx needs to be replaced with the match key type such as email, phone, etc... For list of available match key types, please see 'Key name' column in [this table](https://developers.intern.facebook.com/docs/marketing-api/offline-conversions#match-keys)|
| custom_data.xxxxx | No | Additional information about the conversion event.  For example, send store location ID as custom_data.location_id or product category as custom_data.category |

#### infoForNormalization

For **dob** choose one of following format:

- MM/DD/YYYY
- DD/MM/YYYY
- YYYY/MM/DD
- MM/DD/YY
- DD/MM/YY
- YY/MM/DD

Note: '/' can be skipped (MMDDYYYY) or replaced with '-' (MM-DD-YYYY)

#### customTypeInfo

For each custom data column, add following JSON object to customTypeInfo.

If you added custom_data.store_num as one of the mapped columns in "mapping", you should add following:

```
"customTypeInfo": {
  "store_num" : {
    "key": "store_id",    // key used in upload
    "baseType": "number"  // number or string
  }
...
}
```

### FAQ

1. My company has firewall which will block API calls to Facebook.  What are my options?
  - Whitelist FB IP's:  Contact your security team to whitelist IP addresses returned by this command:  

  ```
  whois -h whois.radb.net -- '-i origin AS32934' | grep ^route
  ```
  For more information, please refer to [this guide](https://developers.facebook.com/docs/sharing/webmasters/crawler) which explains whitelisting for FB crawlers, but the same set of IP's are used for API servers.
  - Request your security team to create DMZ where outbound HTTP request is allowed.

2. My company does not support running node.js.  Can we still use file uploader?
  - Pre-built binary executable files are available.  Please contact FB team for access to these files.  If your company has node.js install on any one of the machines, you could also try building these binary files using **Option 3** above in the *Installing FB Marketing Data File Uploader* section.l

### Code organization
- **/lib**: Source code Transpiled to ES5 for npm
- **/src**: Original source code written in ES6 with FB's flow type system
- /cli.js: For when using MDFU as command line tool
- /index.js: For when requiring MDFU as a module
- /nexe.js: For building binary file with nexe

## License
FB Marketing Data File Uploader is BSD-licensed. We also provide an additional patent grant.
