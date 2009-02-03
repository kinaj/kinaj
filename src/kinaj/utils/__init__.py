# -*- coding: utf-8 -*-
import os, re

from werkzeug import Local, LocalManager
from werkzeug.routing import Map, Rule

from kinaj.static import STATIC_PATH

ALLOWED_SCHEMES = frozenset(['http', 'https', 'ftp', 'ftps'])
URL_CHARS = 'abcdefghijkmpqrstuvwxyzABCDEFGHIJKLMNPQRST23456789'


local = Local()
local_manager = LocalManager([local])
application = local('application')


url_map = Map()


def wrap(doc):
    """docstring for wrap"""
    data = doc['value']
    return data


def expose(rule, **kw):
    
    def decorate(f):
        kw['endpoint'] = f.__name__
        url_map.add(Rule(rule, **kw))
        return f
        
    return decorate


def url_for(endpoint, _external=False, **values):
    
    return local.url_adapter.build(endpoint, values, force_external=_external)

              
def make_id(text,delim="-"):
    """docstring for make_id"""
    t = text.lower()
    normal_id = delim.join(t.split())
    return normal_id

