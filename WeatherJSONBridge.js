/**
* @fileOverview A bridge to provide weather updates in JSON from the Cambridge Computer Lab, UK.
* @name WeatherJSONBridge.js
* @author <a href="mailto:cce25@cl.cam.ac.uk">Chris Elsmore</a>
* @version V1.00
*/

/**
* @class Weather Bridge for fetching JS weather objects.
* @property {String} url The url of the weather data server.
*/
function WeatherJSONBridge(url) {
    
    this.tempurl = url;
    
    /**
    * Fetch a single type of weather data.
    * @param {String} resource The type of data to be fetched: 'temperature','humidity','dew point','pressure','wind speed','wind direction','sun hours','rain','max wind speed' are avalible.
    * @param {String} datestr The date on which the readings were taken, in the form "YYYY-MM-DD"
    * @returns {Object} A JS object representing the requested data.
    */
    this.getData = function (datestr, resource){
        
        if(typeof datestr != "string" || typeof resource != "string"){ return -1; }
        
        switch(resource.toLowerCase()){
            case 'temperature':
                var col = 1;
                break;
            case 'humidity':
                var col = 2;
                break;
            case 'dew point':
                var col = 3;
                break;
            case 'pressure':
                var col = 4;
                break;
            case 'wind speed':
                var col = 5;
                break;
            case 'wind direction':
                var col = 6;
                break;
            case 'sun hours':
                var col = 7;
                break;
            case 'rain':
                var col = 8;
                break;
            case 'max wind speed':
                var col = 9;
                break;
            default:
                return -1;
                break;
        }
        
        resource = resource.charAt(0).toUpperCase() + resource.slice(1);
        
        var readobj = {
            "resource":resource,
            "units":null,
            "description":resource+" at the Computer Lab, Cambridge UK.",
            "data":[]
            }
        
        theurl = this.tempurl+datestr;
        var readings = $.ajax({ type: "GET", url: theurl,async: false }).responseText.split('\n');
        
        readobj.units = readings[7].split('\t')[col].replace(/(^\s*)|(\s*$)/gi,"");
        
        for (i=8; i<readings.length-1;i++){
            var reading = readings[i].split('\t')[col];
            var time = readings[i].split('\t')[0].split(':');
            
            var da = datestr.split('-');
            var year = parseInt(da[0], 10);
            var month = parseInt(da[1], 10)-1;
            var day = parseInt(da[2], 10);
            var hour = parseInt(time[0], 10);
            var min = parseInt(time[1], 10);
            
            var dateobj = new Date(year,month,day,hour,min);
            readobj.data.push([dateobj,reading]);
        }
        return readobj;
    };
    
    /**
    * Fetch all avalible weather data.
    * @param {Integer} resource The type of data to be fetched.
    * @param {String} datestr The date on which the readings were taken, in the form "YYYY-MM-DD"
    * @returns {Object} A JS object representing the requested data.
    */
    
    this.getWeather = function (datestr){
        if(typeof datestr != "string"){ return -1; }
        
        var readobj = {
            "resource":null,
            "units":null,
            "description":"Full weather report at the Computer Lab, Cambridge UK.",
            "data":[]
            }
        
        theurl = this.tempurl+datestr;
        var readings = $.ajax({ type: "GET", url: theurl,async: false }).responseText.split('\n');
        
        readobj.units = readings[7].split('\t');
        readobj.resource = readings[6].split('\t');
        
        for (i=8; i<readings.length-1;i++){
            var reading = readings[i].split('\t');
            var time = readings[i].split('\t')[0].split(':');
            
            var da = datestr.split('-');
            var year = parseInt(da[0], 10);
            var month = parseInt(da[1], 10)-1;
            var day = parseInt(da[2], 10);
            var hour = parseInt(time[0], 10);
            var min = parseInt(time[1], 10);
            
            var dateobj = new Date(year,month,day,hour,min);
            readobj.data.push([dateobj,reading]);
        }
        return readobj;
    };

}