# -*- coding: utf-8 -*-
import os, re

from werkzeug import Local, LocalManager
from werkzeug.exceptions import Unauthorized
from werkzeug.routing import Map, Rule

from kinaj.models import User
from kinaj.static import STATIC_PATH

ALLOWED_SCHEMES = frozenset(['http', 'https', 'ftp', 'ftps'])
URL_CHARS = 'abcdefghijkmpqrstuvwxyzABCDEFGHIJKLMNPQRST23456789'


local = Local()
local_manager = LocalManager([local])
application = local('application')


url_map = Map()


def wrap(doc):
    """docstring for wrap"""
    return doc['value']


def expose(rule, **kw):
    
    def decorate(f):
        # used in wrapper
        roles = set(kw.pop('roles', ()))
        
        kw['endpoint'] = f.__name__
        url_map.add(Rule(rule, **kw))
        
        def wrapper(req, *arg, **kw):
            session_id = req.cookies.get('session_id')
            
            if session_id:
                db_res = tuple(User.db.view('session/roles', key=session_id))
                user_roles = (db_res[0]['value'] if db_res else ())
                
            else:
                user_roles = ()
            
            if roles.isdisjoint(user_roles): raise Unauthorized()
                
            return f(req, *arg, **kw)
            
        if roles:
            return wrapper
        
        return f
        
    return decorate


def url_for(endpoint, _external=False, **values):
    
    return local.url_adapter.build(endpoint, values, force_external=_external)

              
def make_id(text,delim="-"):
    """docstring for make_id"""
    t = text.lower()
    normal_id = delim.join(t.split())
    return normal_id
    
    
