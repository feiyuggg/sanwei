//function sendStatus(statusText) {

//    postMessage({"type": "status","statusText": statusText});

//}

self.addEventListener('message', function (e) {
    var data = e.data;
    // Data
    //---------
    // nullValue
    //nullTolerance
    // canvasData
    // width
    // height
    // startX

    //sendStatus("Worker started blur on data in range: " +
        //data.startX + "-" + (data.startX + data.width));
    // 
    
    var pix = data.canvasData;

    var nullColor = data.nullValue;
    var tolerance = (data.nullTolerance != undefined) ? data.nullTolerance : 0;
    var r, g, b, i;
    var nr = nullColor.r,
        ng = nullColor.g,
        nb = nullColor.b,
        length = pix.length;

    for (i = 0; i < length; i += 4) {
         r = pix[i],
         g = pix[i + 1],
         b = pix[i + 2];

         if (!tolerance) {
             if (r == nr && g == ng && b == nb) {

                 //pix[i] = r;
                 //pix[i + 1] = g;
                 //pix[i + 2] = b;
                 pix[i + 3] = 0;
             }
         } else if (pix[i+3] != 0 ) { 
             if (Math.abs(r - nr) <= tolerance && Math.abs(g - ng) <= tolerance && Math.abs(b - nb) <= tolerance)
             {
                 pix[i + 3] = 0;
             }
         }
    }
    data.canvasData = pix;
    
    postMessage(data);

    //sendStatus("Finished blur on data in range: " +
    //                data.startX + "-" + (data.width + data.startX));

});