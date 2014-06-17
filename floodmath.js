//
FloodMath = new function(){
    "use strict";

    var _ = this,

    FloodFrequencies = [.000001,.001,.002,.005,.01,.02,.05,.1,.2,.5,1/1.5];

    _.process_loss_data = function(D) {
	// the damage data comes in as an array of values corresponding to how much loss
	// a flood of return periods [2,5,10,20,50,100,200,500,1000] years respectively would cause
	// e.g. D[0] is the damage of a flood which occurs on average every two years
	
	// to calculate the annual average damage, we flip the return periods over into probabilities
	// [2,5,10,20,50,100,200,1000] becomes [1/2,1/5,...,1/1000]
	
	// if the 2 year flood causes non-zero loss we need to add a zero damage flood at the beginning
	// which we assume to be 1.5 yr return period
	D.unshift(0);
	
	// we also finish out the curve by adding a flood with an extremely rare return period
	// e.g. 1/1,000,000 years and assume no additional damage increase on top of the 1/1000yr flood
	D.push(D[D.length-1]);

	// finally reverse the array so that it goes in increasing order of probability
	// i.e. [.000001,.001,.002,.005,.01,.02,.05,.1,.2,.5,1/1.5]
	D.reverse();

	// return loss values
	return D;
    },

    // trapezoidal integration of curve defined by an X and Y vector
    _.trapz = function(X,Y){    
	var v = 0;
	for( var i=0; i<X.length-1; i++ ) {
	    var
	    w = X[i+1]-X[i],  // width
	    h = Y[i],         // height
	    th = Y[i+1]-Y[i]; // additional height of topping triangle
	    v += w*h+w*th/2;
	};
	return v;
    },

    _.integrate_loss_curve = function(D) {
	// D = loss vector in increasing order of probability 
	// should be preprocessed to match FloodFrequencies
	if (D.length != FloodFrequencies.length) {console.log("Error: Loss data does not match frequencies");return 0;}
	return _.trapz(FloodFrequencies,D);
    },

    _.integrate_partial_loss_curve = function(D, s) {
	// D = loss vector in increasing order of probability 
	// should be preprocessed to match FloodFrequencies
	// s = probability (return frequency) to split on (between 0-1)
	//
	// returns the integration of the curve above s

	if (D.length != FloodFrequencies.length) {console.log("Error: Loss data does not match frequencies");return 0;}
	var P = FloodFrequencies;
	
	// since s is not necessarily in P, we need to interpolate

	// find the index of the first return frequency greater than s
	var i = 0;
	while (s>=P[i]&&i<P.length) i++;
	
	// evaluate how far s is between the closest two probabilities
	var p = (P[i]-s)/(P[i]-P[i-1]);

	var P2 = P.slice(0,i);
	P2[i] = s;

	// add this extra value to the previous damage value
	var D2 = D.slice(0,i)
	D2[i] = p*(D[i]-D[i-1]) + D[i-1];

	return _.trapz(P2,D2);
    },

    _.flood_test = function() {
	var D = [10,50,70,80,90,100,300,500,800];
	D = _.process_loss_data(D);    
	var P = FloodFrequencies;

	var r = _.integrate_loss_curve(D);
	console.log("Annual expected damage over all return periods: " + r);
	
	// return period on which to split the curve
	var splitRP = 25;
	// flip to get return frequency (probability of event)
	var s = 1/splitRP;

	var r2 = _.integrate_partial_loss_curve(D,s);
	console.log("Annual expected damage from floods above a " + splitRP + "yr return period: " + r2);
	console.log("Annual expected damage from floods up to a " + splitRP + "yr return period: " + (r-r2));
    };
};

FloodMath.flood_test();
