# -*- coding: utf-8 -*-

from werkzeug import Request, ClosingIterator, redirect
from werkzeug.exceptions import HTTPException, NotFound, Unauthorized
from werkzeug.contrib.securecookie import SecureCookie

from simplecouchdb import Server
from simplecouchdb.resource import ResourceConflict

from kinaj import views
from kinaj.models import Project, User, Up
from kinaj.utils import local, local_manager, url_map, url_for


class Kinaj(object):
    
    def __init__(self, debug=False):
        self.debug = debug
        local.application = self
        Project.db = Server()['kinaj-projects']
        User.db = Server()['kinaj-users']
        Up.db = Server()['kinaj-uploads']
        
        
    def dispatch(self, environ, start_response):
        local.application = self
        request = Request(environ)
        local.url_adapter = adapter = url_map.bind_to_environ(environ)

        request.debug = self.debug
        
        request.session = SecureCookie.load_cookie(request, 
                                                   key='com.kinaj.session', 
                                                   secret_key='kinaj')
        
        try:
            endpoint, values = adapter.match()
            handler = getattr(views, endpoint)
            response = handler(request, **values)
            
        except NotFound, e:
            response = views.not_found(request)
            response.status_code = 404
            
        except Unauthorized, e:
            response = redirect(url_for('login', referrer=request.url))
        
        # TODO: CouchDB resource conflict exception handling
        except ResourceConflict, e:
            pass
        
        except HTTPException, e:
            response = e

        request.session.save_cookie(response, key='com.kinaj.session')
        
        return ClosingIterator(response(environ, start_response), 
                                        [local_manager.cleanup])
    
    def __call__(self, environ, start_response):
        return self.dispatch(environ, start_response)
