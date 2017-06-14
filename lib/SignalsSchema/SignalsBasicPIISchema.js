/**
*  Copyright (c) 2017-present, Facebook, Inc.
*  All rights reserved.
*  
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*  
*  @generated
**/"use strict";

module.exports = {
    "additionalInfoURL": "https:\/\/www.facebook.com\/help\/606443329504150",
    "id": "basic_pii_schema",
    "version": "0.0.1",
    "type": "pii_keys",
    "exampleFiles": {
        "csv": "https:\/\/www.facebook.com\/images\/ads\/signals\/example_files\/example_audience_file.csv"
    },
    "validIf": {
        "rule": "minValidProps",
        "args": 1
    },
    "transform": ["processPIISignalBeforeUpload"],
    "props": [{
        "key": "email",
        "maxOccurrence": 3,
        "label": "Email",
        "examples": ["Emily@example.com", "John@example.com", "Helena@example.com"],
        "type": "email"
    }, {
        "key": "phone",
        "maxOccurrence": 3,
        "label": "Phone Number",
        "examples": ["1(222)333-4444", "001(222)333-4444", "+12223334444"],
        "type": "phone_number"
    }, {
        "key": "madid",
        "label": "Mobile Advertiser ID",
        "formats": ["Android's Advertising ID(AAID)", "Apple's Advertising Identifier(IDFA)"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_only",
            "test": "^([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}|[a-zA-Z0-9]{6}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{13})$"
        }
    }, {
        "key": "fn",
        "label": "First Name",
        "examples": ["John", "F.", "Fr&eacute;d&eacute;drique"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_and_punctuation"
        }
    }, {
        "key": "ln",
        "label": "Last Name",
        "examples": ["Smith", "S&oslash;rensen", "Jacobs-Anderson"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_and_punctuation"
        }
    }, {
        "key": "zip",
        "label": "ZIP\/Postal Code",
        "examples": ["94025", "94025-3215", "L3T 5M7"],
        "type": "postal_code"
    }, {
        "key": "ct",
        "label": "City",
        "examples": ["Menlo Park", "Seattle", "London"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "all_non_latin_alpha_numeric",
            "test": "^[a-z]+"
        }
    }, {
        "key": "st",
        "label": "State\/Province",
        "examples": ["CA", "Califonia", "Texas"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "truncate": 2,
            "strip": "all_non_latin_alpha_numeric",
            "test": "^[a-z]+"
        }
    }, {
        "key": "country",
        "label": "Country",
        "examples": ["US", "GB", "FR"],
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_only",
            "test": "^[a-zA-Z]{2,2}"
        }
    }, {
        "key": "dob",
        "label": "Date of Birth",
        "examples": ["mm\/dd\/yyyy", "mm\/dd\/yy", "yyyy-mm-dd", "+ 15 more"],
        "type": "date"
    }, {
        "key": "doby",
        "label": "Year of Birth",
        "type": "string",
        "typeParams": {
            "test": "^[0-9]{4,4}$"
        },
        "examples": ["1978", "1962", "1990"]
    }, {
        "key": "gen",
        "label": "Gender",
        "examples": ["M", "F"],
        "type": "enum",
        "typeParams": {
            "lowercase": true,
            "options": ["f", "m"]
        }
    }, {
        "key": "age",
        "label": "Age",
        "examples": [65, 42, 21],
        "type": "number",
        "typeParams": {
            "min": 0
        }
    }, {
        "key": "appuid",
        "label": "Facebook App User ID",
        "examples": ["1234567890", "1443637309", "1234567892"],
        "type": "fbid",
        "typeParams": {
            "scoped": true,
            "rejectHashed": true
        }
    }, {
        "key": "fi",
        "noUI": true,
        "label": "First name initial",
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_only",
            "test": "^[a-z]{1,1}$"
        }
    }, {
        "key": "f5first",
        "noUI": true,
        "label": "First five letters of first name",
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_only",
            "test": "^[a-z]{5,5}$"
        }
    }, {
        "key": "f5last",
        "noUI": true,
        "label": "First five letters of last name",
        "type": "string",
        "typeParams": {
            "lowercase": true,
            "strip": "whitespace_only",
            "test": "^[a-z]{5,5}$"
        }
    }, {
        "key": "pageuid",
        "label": "Facebook Page User ID",
        "examples": ["1234567890", "1443637309", "1234567892"],
        "type": "fbid",
        "typeParams": {
            "scoped": true,
            "rejectHashed": true
        }
    }]
};