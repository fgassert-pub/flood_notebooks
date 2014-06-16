
// trapezoidal integration of curve defined by an X and Y vector

var trapz = function(X,Y){
    "use strict";
    // error catching
    if (X.length != Y.length) {
	console.log("Error: X, Y lengths do not match");
	return 0;
    } else if (X.length < 2) {
	console.log("Error: Must have at least two points");	
	return 0;
    };
    
    var v = 0;
    for( var i=0; i<X.length-1; i++ ) {
	var
	w = X[i+1]-X[i],  // width
	h = Y[i],         // height
	th = Y[i+1]-Y[i]; // additional height of topping triangle
	v += w*h+w*th/2;
    };
    return v;
};

// example integrating of flood damage curve
var trapz_test = function() {
    var
    // Return periods
    RPs = [2,5,10,20,50,100,200,500,1000],
    // Damage values
    D = [10,50,70,80,90,100,300,500,800],

    // A 50yr flood happens on average once every 50 years, so:
    // Return frequencies = 1/return periods

    RFs = [];
    for( var i=0; i<RPs.length; i++ ) {
	RFs[i] = 1.0/RPs[i];
    };

    // annual expected damage over all return periods
    // since the arrays are in reverse order (descending X values) take the negative of the integration
    var result = -trapz(RFs,D);    
    console.log("Annual expected damage over all return periods: " + result);

    // we can also get values for just part of the curve
    // e.g. what's the annual expected flood damage when you have a 75yr return 
    var splitRP = 75;

    // first cut the arrays and interpolate where we don't have values
    var RPs2 = [], RFs2 = [], D2 = [];
    for( var i=0; i<RPs.length; i++) {
	if (RPs[i] <= splitRP) {
	    // copy over data as normal
	    RPs2[i] = RPs[i];
	    RFs2[i] = 1.0/RPs[i];
	    D2[i] = D[i];
	} else {
	    // evaluate how far splitRP is between the closest two return periods
	    var p = (RPs[i]-splitRP)/(RPs[i]-RPs[i-1]);
	    RFs2[i] = 1.0/splitRP;
	    // add this extra value to the previous damage value
	    D2[i] = p*(D[i]-D[i-1]) + D[i-1];
	    break;
	};
    };

    var result2 = -trapz(RFs2,D2);    
    console.log("Annual expected damage from floods upto a " + splitRP + "yr return period: " + result2);
    console.log("Annual expected damage from floods above a " + splitRP + "yr return period: " + (result - result2));

};

trapz_test();
