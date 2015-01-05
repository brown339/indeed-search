/*
* Using the indeed api, pull information about any jobs
* Using this information, parse the company, job title, and snippet
*/

// require http
var http = require ('http');

function main (args) {
    if (args.length != 2) {
        console.log ('Please provide parameters. <job_title>, <city_state>\n>   Example: node indeed.js software_engineer orlando_FL')
        return false;
    }
    
    var job = args[0].replace('_', ' ');
    var location = args[1].replace('_', ',');


    // Url to get an xml list of job information
    // DOCS : https://ads.indeed.com/jobroll/xmlfeed
    var url = 'http://api.indeed.com/ads/apisearch?' + 
        'publisher=9859331795026923&' +             // Publisher ID
        'q='+encodeURI(job)+'&' +                   // Query
        'l='+encodeURI(location)+'&' +              // Location
        'sort=&' +                                  // Sort by relevance or date (Default - relevance)
        'format=json&' +                            // Output format (Default - xml)
        'radius=&' +                                // Radius
        'st=&' +                                    // Site type
        'jt=&' +                                    // Job Type
        'start=&' +                                 // Start results at this result number (Default - 0)
        'limit=100&' +                               // Max number of results (Default - 10)
        'fromage=&' +                               // Number of days back to search
        'filter=&' +                                // Filter duplicate results. 0 is off. (Default - 0)
        'latlong=1&' +                              // If 1, return lat, long information (Default - 0)
        'co=us&' +                                  // Country search (Default - US)
        'chnl=&' +                                  // Channel name
        'userip=1.2.3.4&' +                         // IP number of end-user (Req)
        'useragent=Mozilla/%2F4.0%28Firefox%29&' +  //Browser (Req)
        'v=2';                                      // Version (Use 2)
    
    // DOCS : http://nodejs.org/api/http.html#http_http_get_options_callback
    var request = http.get (url, function (response) {
        
        var xmlInfo = '';
        
        // Data stream is in flowing mode.
        // Data passed will be passed to handler as soon as it's available
        // DOCS : http://nodejs.org/api/stream.html#stream_event_data
        response.on ('data', function (chunk) {
            // Aggregate information
            xmlInfo += chunk;
        });
        
        // No more data to read.
        // DOCS : http://nodejs.org/api/stream.html#stream_event_end
        response.on ('end', function () {
            var info = JSON.parse(xmlInfo);
            var jobs = info.results;
            
            console.log ('%d %s jobs found within the %s area\n\n-------------------\n\n', jobs.length, job, location);
            
            /* Out keys:
            *   jobtitle
            *   company
            *   city
            *   state
            *   country
            *   formattedLocation
            *   source
            *   date
            *   snippet
            *   url
            *   onmousedown
            *   latitude
            *   longitude
            *   jobkey
            *   sponsored
            *   expired
            *   indeedApply
            *   formattedLocationFull
            *   formattedRelativeTime
            */
            for (job in jobs) {
                console.log (jobs[job].company + ' - ' +jobs[job].jobtitle + ':\n+  ' +jobs[job].snippet);
                console.log ('\n');
            }
            
        });
         
    });
    
    // Error handling
    request.on ('error', function () {
        
    });
    
}

main (process.argv.slice(2));