#!/usr/bin/env python
from werkzeug import script, DebuggedApplication, run_simple

def make_app():
    """

    """
    from kinaj.application import Kinaj
    return Kinaj('http://localhost:5984')

def make_shell():
    """

    """
    from kinaj import models, utils
    application = make_app()
    return locals()
    
def make_debugger():
    """

    """
    from kinaj.application import Kinaj
    application = DebuggedApplication(Kinaj('http://localhost:5984'), evalex=True)
    
    run_simple('localhost', 5000, application)

action_runserver = script.make_runserver(make_app, use_reloader=True)
action_shell = script.make_shell(make_shell)
action_debugger = make_debugger()

script.run()
