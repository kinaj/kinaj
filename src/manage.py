#!/usr/bin/env python
from werkzeug import script, SharedDataMiddleware

from kinaj.utils import STATIC_PATH

def make_app():
    from kinaj.application import Kinaj
    return SharedDataMiddleware(Kinaj(), {'/static': STATIC_PATH})
    
    
def make_shell():
    from kinaj import models, utils
    application = make_app()
    return locals()
    
    
action_runserver = script.make_runserver(make_app, use_reloader=True)
action_shell = script.make_shell(make_shell)
action_initdb = lambda: make_app().init_database()

script.run()
