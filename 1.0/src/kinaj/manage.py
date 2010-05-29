#!/usr/bin/env python
import werkzeug

from kinaj.utils import STATIC_PATH

def make_app():
    from kinaj.application import Kinaj
    return werkzeug.SharedDataMiddleware(Kinaj(debug=True), {'/static': STATIC_PATH,
                                          '/favicon.ico': '%s/img/favicon.ico' % STATIC_PATH})
    
    
def make_shell():
    from kinaj import models, utils
    application = make_app()
    return locals()
    
    
action_runserver = werkzeug.script.make_runserver(make_app, use_reloader=True, threaded=True)
action_shell = werkzeug.script.make_shell(make_shell)
action_initdb = lambda: make_app().init_database()

werkzeug.script.run()
