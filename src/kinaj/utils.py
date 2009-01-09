# -*- coding: utf-8 -*-
import os, re

from werkzeug import Local, LocalManager, Response
from werkzeug.routing import Map, Rule

from jinja2 import Environment, FileSystemLoader


TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), 'templates')
STATIC_PATH = os.path.join(os.path.dirname(__file__), 'static')
ALLOWED_SCHEMES = frozenset(['http', 'https', 'ftp', 'ftps'])
URL_CHARS = 'abcdefghijkmpqrstuvwxyzABCDEFGHIJKLMNPQRST23456789'

local = Local()
local_manager = LocalManager([local])
application = local('application')

url_map = Map([Rule('/static/<file>', endpoint='static', build_only=True)])

jinja2_env = Environment(loader=FileSystemLoader(TEMPLATE_PATH))


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
jinja2_env.globals['url_for'] = url_for

def render_html(template, context):
    return Response(jinja2_env.get_template(template).render(context),
                    mimetype='text/html')

def render_xml(template, **context):
    return Response(jinja2_env.get_template(template).render(**context),
                    mimetype='application/rss+xml')
                    
def render_atom(template, **context):
    """docstring for render_atom"""
    return Response(jinja2_env.get_template(template).render(**context),
                    mimetype='application/atom+xml')
