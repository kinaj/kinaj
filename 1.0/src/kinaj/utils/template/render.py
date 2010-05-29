# -*- coding: utf-8 -*-
from werkzeug import Response

from jinja2 import Environment, FileSystemLoader

from kinaj.utils import url_for
from kinaj.utils.text.filters import markup, smartmarkup
from kinaj.templates import TEMPLATE_PATH


env = Environment(loader=FileSystemLoader(TEMPLATE_PATH),
                  extensions=['jinja2.ext.loopcontrols'])

env.filters['markup'] = markup
env.filters['smartmarkup'] = smartmarkup

env.globals['url_for'] = url_for

def render_html(template, context={}):
    return Response(env.get_template(template).render(context),
                    mimetype='text/html')


def render_xml(template, context={}):
    return Response(env.get_template(template).render(context),
                    mimetype='application/rss+xml')

     
def render_atom(template, context={}):
    """docstring for render_atom"""
    return Response(env.get_template(template).render(context),
                    mimetype='application/atom+xml')