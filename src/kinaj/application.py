# -*- coding: utf-8 -*-
import uuid

from werkzeug import Request, ClosingIterator, redirect
from werkzeug.exceptions import HTTPException, NotFound, Unauthorized

from simplecouchdb import Server
from simplecouchdb.resource import ResourceConflict

from kinaj import views
from kinaj.models import Project, User
from kinaj.utils import local, local_manager, url_map, url_for


class Kinaj(object):
    
    def __init__(self, debug=False):
        local.debug = debug
        local.application = self
        Project.db = Server()['kinaj-projects']
        User.db = Server()['kinaj-users']
        
        
    def dispatch(self, environ, start_response):
        local.application = self
        request = Request(environ)
        local.url_adapter = adapter = url_map.bind_to_environ(environ)
        try:
            endpoint, values = adapter.match()
            handler = getattr(views, endpoint)
            response = handler(request, **values)
            
        except NotFound, e:
            response = views.not_found(request)
            response.status_code = 404
            
        except Unauthorized, e:
            response = redirect(url_for('login', referrer=request.url))
            
        except HTTPException, e:
            response = e
        
        return ClosingIterator(response(environ, start_response), 
                                        [local_manager.cleanup])
    
    def __call__(self, environ, start_response):
        return self.dispatch(environ, start_response)
