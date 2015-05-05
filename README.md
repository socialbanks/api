# api
Parse.com API

## You need to create the ParseCloudCode/config/global.json
- move the file example-global.json for ParseCloudCode/config
- name it global.json
- fill the strings "---" with the actual keys

Veja o exemplo abaixo:

```javascript
{
  "global": {
    "parseVersion": "1.4.2"
  },
  "applications": {
    "SocialBanks-DEV": {
      "applicationId": "---",
      "masterKey": "---"
    },
    "_default": {
      "link": "SocialBanks-DEV"
    }
  }
}
```
