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
    li = [descend_dict_values(d) for d in dat]
    return  pd.DataFrame(li, columns = cols)

def descend_dict_keys(obj, s=(), connector='_'):
    """descends a python dictionary or list and generates a unique key for every item in the dict"""
    keys=[]
    if type(obj) is dict:
        for k,v in obj.iteritems():
            keys.extend(descend_dict_keys(v, s+(k,), connector))
    elif type(obj) is list or type(obj) is tuple or isinstance(obj,pd.np.ndarray):
        for i in range(len(obj)):
            keys.extend(descend_dict_keys(obj[i], s+(str(i),), connector))
    else:
        return [connector.join(s)]
    return keys

def descend_dict_values(obj):
    """descends a python dictionary or list and returns a list of every non-dictlike or arraylike value"""
    vs=[]
    if type(obj) is dict:
        for k in obj.iterkeys():
            vs.extend(descend_dict_values(obj[k]))
    elif type(obj) is list or type(obj) is tuple or isinstance(obj,pd.np.ndarray):
        for i in range(len(obj)):
            vs.extend(descend_dict_values(obj[i]))
    else:
        return [obj]
    return vs


def descend_and_apply(obj, f):
    """descends a python dictionary and applys a function f to every node"""
    if type(obj) is dict:
        for k in obj.iterkeys():
            obj[k] = descend_and_apply(obj[k],f)
    elif type(obj) is list or type(obj) is tuple:
        for i in range(len(obj)):
            obj[i] = descend_and_apply(obj[i],f)
    return f(obj)


if __name__=="__main__":
    if len(sys.argv) == 3:
        p2c(*sys.argv[1:])
    else:
        print "Usage: %s <in.pickle> <out.csv>" % sys.argv[0]












