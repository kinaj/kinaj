# -*- coding: utf-8 -*-
from werkzeug import Request, ClosingIterator
from werkzeug.exceptions import HTTPException, NotFound

from simplecouchdb import Server
from simplecouchdb.resource import ResourceConflict

from kinaj import views
from kinaj.models import Project, User
from kinaj.utils import STATIC_PATH, local, local_manager, url_map


class Kinaj(object):
    
    def __init__(self, debug=False):
        local.application = self
        
        server = Server()
        Project.db = server['kinaj-projects']            
        User.db = server['kinaj-user']
        
        
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
            
        except HTTPException, e:
            response = e
            
        return ClosingIterator(response(environ, start_response), 
                                        [local_manager.cleanup])

    
    def __call__(self, environ, start_response):
        return self.dispatch(environ, start_response)
