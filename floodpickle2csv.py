#!/usr/bin/env python

import pandas as pd
import pickle
import sys

def p2c(pickle_in, csv_out):
    """resaves a pickle file with a list of identically structured dictionaries as a csv"""
    with open(pickle_in) as f:
        dat = pickle.load(f)[0]
    dicts_to_df(dat).to_csv(csv_out)

def dicts_to_df(dat):
    """descends a list of identically structured dictionaries and returns a dataframe with unique column names"""
    cols = descend_dict_keys(dat[0])
    li = [descend_dict_values(dat[i]) for i in range(len(dat))]
    return  pd.DataFrame(li, columns = cols)

def descend_dict_keys(obj, s='', connector='_'):
    """descends a python dictionary or list and generates a unique key for every item in the dict"""
    keys=[]
    if type(obj) is dict:
        for k in obj.iterkeys():
            keys.extend(descend_dict_keys(
                obj[k], "%s%s%s" % (s,connector,k), connector))
    elif type(obj) is list or type(obj) is tuple or isinstance(obj,pd.np.ndarray):
        for i in range(len(obj)):
            keys.extend(descend_dict_keys(
                obj[i], "%s%s%s" % (s,connector,i), connector))
    else:
        return [s]
    return keys

def descend_dict_values(obj):
    """descends a python dictionary or list and generates a unique key for every item in the dict"""
    keys=[]
    if type(obj) is dict:
        for k in obj.iterkeys():
            keys.extend(descend_dict_values(obj[k]))
    elif type(obj) is list or type(obj) is tuple or isinstance(obj,pd.np.ndarray):
        for i in range(len(obj)):
            keys.extend(descend_dict_values(obj[i]))
    else:
        return [obj]
    return keys

if __name__=="__main__":
    if len(sys.argv) == 3:
        p2c(*sys.argv[1:])
    else:
        print "Usage: %s <in.pickle> <out.csv>" % sys.argv[0]












