# Deprecated
If you are looking for the tool to automate your offline conversion and custom audience upload to Facebook, please refer to [MDFU V2](https://github.com/facebookincubator/offline-conversion-file-uploader). This tool will no longer be officially maintained and will receive limited support.

# FB Marketing Data File Uploader
FB Marketing Data File Uploader (referred as 'MDFU' hereinafter) is a command line tool and node.js module that helps Facebook advertisers and marketing partners upload offline transactions and customer lists to the FB marketing API without building their own application for API integration.

## Why use MDFU?
* Building API integration will require engineering resources.  Typically, an engineer without experience working with our FB marketing API will need about 3 weeks for development and testing.
* In order to achieve the best possible match between your customers and FB users, the data needs to be normalized and hashed correctly.  MDFU tool uses the libraries written by FB to ensure the best possible match rate.
* For any issues with this tool, you will get support from Facebook.
* This tool will be updated periodically to support more features.

## Requirements
**FB Marketing Data File Uploader requires or works with**
* Mac OS X, Linux, or Windows
* FB App used for API calls.  See [this guide](https://developers.facebook.com/docs/apps/register) for instructions.
* FB system user token that has access to the asset you are uploading to: offline event set or custom audience.  See instructions [here](https://www.facebook.com/business/help/755714304604753?helpref=search&sr=2&query=system%20user).  (Regular user access token can be used, but using system user token is highly recommended)

To upload **offline conversions**, you will also need
* Offline conversions data in CSV format.  Download sample file [Here](http://facebook.com/images/ads/signals/example_files/example_events_file.csv)
* User configured settings file.  See sample file [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_file_uploader.conf.yml.example)
* User configured column mapping file.  See sample file [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_column_mapping.json.example)

To upload **customer lists** to update your **FB custom audience**, you will instead need
* Customer profile data in CSV format. Download sample file [Here](http://facebook.com/images/ads/signals/example_files/example_audience_file.csv)
* User configured settings file.  See example [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/ca_file_uploader.conf.yml.example)
* User configured column mapping file.  See example [here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/ca_column_mapping.json.example)

## Step-by-Step instructions

### 0. Prepare data for upload

The input for upload is the CSV file with either offline transactions or customer list.

- **Offline conversions**: Download sample file [Here](http://facebook.com/images/ads/signals/example_files/example_events_file.csv)
- **Custom Audiences**: Download sample file [Here](http://facebook.com/images/ads/signals/example_files/example_audience_file.csv)

- If you have not tried yet, it's highly recommended to try uploading in our UI.
  - **Offline Conversions**: Please see [this guide](https://www.facebook.com/business/help/155437961572700?helpref=search&sr=4&query=upload%20offline%20) for upload instructions
  - **Custom Audiences**: Please see [this guide](https://www.facebook.com/business/help/170456843145568?helpref=search&sr=13&query=create%20custom%20audience) for upload instructions.

### 1. Set up upload destinations

- **Offline Conversions**: Create offline event in the business manager and have the offline event set id ready. Please see [this guide](https://www.facebook.com/business/help/339320669734609?helpref=search&sr=1&query=create%20offline%20event%20set) for instructions
- **Custom Audience**:
  - Create custom audience in ads manager and have the audience id ready.  Please see [this guide](https://www.facebook.com/business/help/170456843145568?helpref=search&sr=13&query=create%20custom%20audience) for instructions.
  - Alternatively, if not given an audience id, we will create a new custom audience with each customer file you upload. The file name will be used as the audience name. You will need to provide your ad account id in this case.

### 2. Install MDFU

MDFU comes both as a pre-built binary and as a node.js program. If your organization does not support node.js, please see answer to question #2 in FAQ section below to learn how to obtain pre-built binary from Facebook. You can then **run the pre-built binary** from the command line or a script:

```
$ marketing-data-file-uploader offline-conversions --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

(Standard output)
2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
...
```

For the node.js program, you have three options depending on your environment and need:

Option 1: **Run as node.js script** - Install globally and use as command line tool

```
$ npm install -g marketing-data-file-uploader
$ marketing-data-file-uploader offline-conversions --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

(Standard output)
2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
...
```

Option2: **Import into your own node.js app** - Install locally and require the module from your app
```
$ npm install marketing-data-file-uploader --save

(In your app's .js file)
const MDFU = require('marketing-data-file-uploader');
MDFU.upload();

$ node your_app.js offline-conversions --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

(Standard output)
2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
...
```

**Options 3**. Build binary deployable to windows/linux/mac

```
$ git clone https://github.com/facebookincubator/marketing-data-file-uploader

$ npm install
$ npm run build-binary (or build-binary-exe for Windows)
$./build/marketing-data-file-uploader offline-conversions --accessToken YOUR_ACCESS_TOKEN... --uploadTagPrefix "Offline Sales xx/xx/xxxx"...

(Standard output)
2017-05-15T15:52:52.265Z INFO Posting events 1 - 500 to http://graph.facebook.com/v2.9/00000000000000/events
...
```

**Options 4**. Download pre-build binary deployable for windows/mac

- windows binary deployable: [Download latest here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/releases/windows/latest/marketing-data-file-uploader.exe)
- mac binary deployable: [Download latest here](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/releases/mac/latest/marketing-data-file-uploader)


### 3. Set up Facebook app

You need to create a FB app to make requests to FB Marketing API.

- Create FB app.  See [this guide](https://developers.facebook.com/docs/apps/register) for instructions.
- Add the app to your business manager.  See [this guide](https://www.facebook.com/business/help/451645801684919) for instructions.

### 4. Set up system user and generate system user token

System user is a special type of user for doing API integration without the need to use someone's personal FB account to generate access token.  System user token, unlike regular access token, never expires.

- Create system user in your business manager and generate new token with the app in #3 above and give 'ads_management' scope. See instructions [here](https://www.facebook.com/business/help/755714304604753?helpref=search&sr=2&query=system%20user).  (*Ask the admin of business manager to do this*)
- (**Offline Conversions only**) Add system user to offline event Set.
  - Go to 'offline event set' tab in business manager and select an event set
  - Click 'Add People', select system user, then click 'Save Changes'
- (**Custom Audience only**) Assign ad accounts to system user
  - Go to 'System Users' tab and select the system user
  - Click 'Assign Assets', then select 'Ad Accounts'
  - Choose ad accounts that owns the audiences you will upload to, then click 'Save Changes'

### 5. Set up configuration file

Add configuration file that contains static settings.

- **Offline Conversions**: Add static settings such as 'dataSetId' (ID of the offline event set) or uploadTagPrefix (prefix for the label of each upload). By default a file named oca_file_uploader.conf.yml in the same directory is used.  See [an example file](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_file_uploader.conf.yml.example)
- **Custom Audience**: Add static settings such as 'adAccountId' or 'customAudienceId' (if updating audience)  By default a file named ca_file_uploader.conf.yml in the same directory is used.  See [an example file](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/ca_file_uploader.conf.yml.example)

**Available Configuration options**

Configuration options can either be stored in a file (.yml format) or passed in as command line arguments.  Values provided on command line always overwrites settings from the config file.  See following for available options:

|Option       |Description        | default |
|-------------|-------------------|---------|
|accessToken*  |  Access token for API call |  |
|columnMappingFilePath| File containing column mapping info. For more info see **Column Mapping File** section below.|`oca_column_mapping.json` (if command is `offline-conversions`) or `ca_column_mapping.json` (if command is `custom-audiences`) in current directory|
|configFilePath*| File containing configurations| `oca_file_uploader.conf.yml` (if command is `offline-conversions`) or `ca_file_uploader.conf.yml` (if command is `custom-audiences`) in current directory.  |
|dataSetId| ID of your offline event data set if you are uploading offline conversions| |
|customAudienceId| ID of your custom audience if you are uploading to an existing audience| |
|adAccountId| ID of your ad account if you are creating a new audience with this upload| |
|inputFilePath| File containing offline conversions data | |
|logging| Control the logging level of program (available options: `silly`, `debug`, `info`, `warn`, `error`)| `info` |
|uploadTag| Tag to identify the events uploaded.  Should use unique string for each distinct file uploaded. | Offline Conversions |
|uploadTagPrefix| Instead of providing uploadTag, you can also define prefix (ex: Offline Conversions), then the tool will append filename/timestamp and use it as the uploadTag. If uploadTag is set, uploadTagPrefix is ignored.  ex) *Offline Conversions (example_events_big_100k.csv@1493837377000)* |  |

\* These options MUST be passed in as command line arguments and cannot be set in configuration file.

### 6. Set up column mapping

For each file you upload you need to provide a corresponding column mapping file which defines what each column in the file is for.  See an [example](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/oca_column_mapping.json.example) for the column mapping for an offline conversion file, and [another](https://github.com/facebookincubator/marketing-data-file-uploader/blob/master/ca_column_mapping.json.example) for the mapping for a customer PII file. The description of each key in the JSON file is below:

#### Fields in column mapping file

| Field | Description | Required? |
|-------|-------------|-----------|
|header | Whether the file has header row or not | Yes |
|delimiter | The delimiter for column.  comma for CSV, tab for TSV, etc...| Yes |
|mapping| The mapping for columns in the file.  key-value pair represents "column index": "column type".  For more detailed description for each column type, please see **Column Types** section below| Yes |
|format| Format of your dob field to help with the normalization. See **foramt** section below for more info | No |
|customTypeInfo| Info for the key-value pairs of custom_data fields. See **customTypeInfo** section below for more info. | No |

#### Column Types for 'mapping' field

|Column Type| Required by `offline-conversions`? | Required by `custome-audiences` | Description |
|-----------|-----------|-------------|-------------|
|event_time | Yes | No | Use ISO8601 format or unixtime timestamp |
|event_name | Yes | No | See event_time row in the [data parameters table](https://developers.facebook.com/docs/marketing-api/offline-conversions/#data-parameters)|
|currency   | Yes | No | Three-letter ISO currency for this conversion event. Required for Purchase events. |
| value | Yes | No | Value of conversion event. Required for Purchase event. ex) 16.00 |
| match_keys.xxxxx | Yes | Yes | The identifier info used to match people.  xxxxx needs to be replaced with the match key type such as email, phone, etc... For list of available match key types, please see 'Key name' column in [this table](https://developers.facebook.com/docs/marketing-api/offline-conversions#match-keys)|
| custom_data.xxxxx | No | No | Additional information about the conversion event.  For example, send store location ID as custom_data.location_id or product category as custom_data.category |

#### format

Provide more information about the formatting of certain types of columns

For **dob** choose one of following format:

- `MM/DD/YYYY`
- `DD/MM/YYYY`
- `YYYY/MM/DD`
- `MM/DD/YY`
- `DD/MM/YY`
- `YY/MM/DD`

Note: '/' can be skipped (`MMDDYYYY`) or replaced with '-' (`MM-DD-YYYY`)

#### customTypeInfo

*Applies to offline conversion uploading only*.
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

### 7. Upload!

**Available Commands**

You need to supply one of the following commands to the tool to specify action.
* `offline-conversions`: Upload offline conversion event data
* `custom-audiences`: Upload customer PII data
* `version`: Print the version of the tool

For example:
```
$ marketing-data-file-uploader offline-conversions [configs...]
$ marketing-data-file-uploader custom-audiences [configs...]
$ marketing-data-file-uploader version
```

**Command Line Examples**

This will upload offline transactions from /data/offline_transactions_20170701.csv file using oca_file_uploader.conf.yml and oca_column_mapping.json in the current directory and use 'Offline Sales for July 1st' as the upload tag.

```
marketing-data-file-uploader offline-conversions --accessToken XXXXAAAA... --inputFilePath /data/offline_transactions_20170701.csv --uploadTag 'Offline Sales for July 1st'
```

This will upload offline transactions from /data/offline_transactions_20170701.csv file using oca_file_uploader.conf.yml in the current directory and /home/custom_mapping_file.json

```
marketing-data-file-uploader offline-conversions --accessToken XXXXAAAA... --inputFilePath /data/offline_transactions_20170701.csv --columnMappingFilePath /home/custom_mapping_file.json
```

This will add customer profiles from /data/email_list_for_brand_XYZ_201707.csv file to audience 12345 using ca_file_uploader.conf.yml and ca_column_mapping.json in the current directory.

```
marketing-data-file-uploader custom-audiences --accessToken XXXXAAAA... --inputFilePath /data/email_list_for_brand_XYZ_201707.csv --customAudienceId 12345
```

This will create a new audience under the ad account 98765, and add customer profiles from /data/email_list_for_brand_XYZ_201707.csv file to the newly created audience (using ca_file_uploader.conf.yml and ca_column_mapping.json in the current directory). The file name will be used as the audience name
```
marketing-data-file-uploader custom-audiences --accessToken XXXXAAAA... --inputFilePath /data/email_list_for_brand_XYZ_201707.csv --adAccountId 98765
```

**Scheduling MDFU**

The main benefit of using MDFU is the ability to automate the uploads.  Although the way the upload is scheduled can vary based on the environment and different use cases, please see following for a couple of examples of using cron and windows schedule/power shell

**Using crontab**: This will schedule the tool to run every day @ 2am with the filename formatted with the date string,  ex) offline_conversions_YYYY_MM_DD.csv (offline_conversions_2017-04-07.csv)

```
0 2 * * * cd <Path to the tool and config file> && ./marketing-data-file-uploader offline-conversions —accessToken <Your_Access_token> —inputFilePath <Path to your data file>/offline_conversions_$(date +%F).csv —uploadTag offline_conversions_$(date +%F)
```

**On Windows using Powershell and Task Scheduler**: This will schedule the tool to run every day @ 2am with the filename formatted with the date string,  ex) offline_conversions_YYYY_MM_DD.csv (offline_conversions_2017-04-07.csv)

1. Create a Powershell script.  

  ```
# offline-coversions-upload.ps1
cd c:\marketing-data-file-uploader
marketing-data-file-uploader.exe offline-conversions --accessToken xxxxxx --inputFilePath ('c:\data\offline_conversions_' + $(get-date -f yyyy_MM_dd) + '.csv')
  ```

2. Schedule execution of the script
  ```
Schtasks /create /tn "Offline Conversions Daily Upload" /sc daily /st 02:00 /tr "PowerShell -noexit & c:\Users\Ryan\scripts\offline-coversions-upload.ps1"
  ```


### Code organization
- **/lib**: Source code Transpiled to ES5 for npm
- **/src**: Original source code written in ES6 with FB's flow type system
- /cli.js: For when using MDFU as command line tool
- /index.js: For when requiring MDFU as a module
- /nexe.js: For building binary file with nexe

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

3. How MDFU works

  This is a node.js application that will go through following steps to upload your offline conversions to FB's marketing API.

  1. Read command which specifies whether to upload offline events or customer lists
  2. Read configurations and column mappings
  3. Read input file in stream
  4. For each line read, columns are normalized and hashed for upload.
  5. Collect normalized and hashed data into batches (per batch size configured.  Default: 500)
  6. POST each batch to the API endpoint
  7. *How the binary is built*: Binary file containing node runtime is built using an open source utility called [nexe](https://github.com/nexe/nexe).


## License
FB Marketing Data File Uploader is BSD-licensed. We also provide an additional patent grant.
