import re
from datetime import datetime

from jinja2 import Environment
from jinja2 import FileSystemLoader
from os import path
from werkzeug import Local
from werkzeug import LocalManager
from werkzeug import Response
from werkzeug.routing import Map
from werkzeug.routing import Rule

import rfc822

TEMPLATE_PATH = path.join(path.dirname(__file__), 'templates')
STATIC_PATH = path.join(path.dirname(__file__), 'static')
ALLOWED_SCHEMES = frozenset(['http', 'https', 'ftp', 'ftps'])
URL_CHARS = 'abcdefghijkmpqrstuvwxyzABCDEFGHIJKLMNPQRST23456789'

local = Local()
local_manager = LocalManager([local])
application = local('application')

url_map = Map([Rule('/static/<file>', endpoint='static', build_only=True)])

jinja2_env = Environment(loader=FileSystemLoader(TEMPLATE_PATH))


def expose(rule, **kw):
    def decorate(f):
        kw['endpoint'] = f.__name__
        url_map.add(Rule(rule, **kw))
        return f
    return decorate

def url_for(endpoint, _external=False, **values):
    return local.url_adapter.build(endpoint, values, force_external=_external)
jinja2_env.globals['url_for'] = url_for

def render_html(template, **context):
    return Response(jinja2_env.get_template(template).render(**context),
                    mimetype='text/html')

def render_xml(template, **context):
    return Response(jinja2_env.get_template(template).render(**context),
                    mimetype='application/xml')
    
def datetimeTorfc822(datetime):
    return rfc822.formatdate(rfc822.mktime_tz(rfc822.parsedate_tz(datetime.strftime( "%a, %d %b %Y %H:%M:%S"))))

def parseDateTime(s):
	"""Create datetime object representing date/time
	   expressed in a string

	Takes a string in the format produced by calling str()
	on a python datetime object and returns a datetime
	instance that would produce that string.

	Acceptable formats are: "YYYY-MM-DD HH:MM:SS.ssssss+HH:MM",
							"YYYY-MM-DD HH:MM:SS.ssssss",
							"YYYY-MM-DD HH:MM:SS+HH:MM",
							"YYYY-MM-DD HH:MM:SS"
	Where ssssss represents fractional seconds.	 The timezone
	is optional and may be either positive or negative
	hours/minutes east of UTC.
	"""
	if s is None:
		return None
	# Split string in the form 2007-06-18 19:39:25.3300-07:00
	# into its constituent date/time, microseconds, and
	# timezone fields where microseconds and timezone are
	# optional.
	m = re.match(r'(.*?)(?:\.(\d+))?(([-+]\d{1,2}):(\d{2}))?$',
				 str(s))
	datestr, fractional, tzname, tzhour, tzmin = m.groups()

	# Create tzinfo object representing the timezone
	# expressed in the input string.  The names we give
	# for the timezones are lame: they are just the offset
	# from UTC (as it appeared in the input string).  We
	# handle UTC specially since it is a very common case
	# and we know its name.
	if tzname is None:
		tz = None
	else:
		tzhour, tzmin = int(tzhour), int(tzmin)
		if tzhour == tzmin == 0:
			tzname = 'UTC'
		tz = FixedOffset(timedelta(hours=tzhour,
								   minutes=tzmin), tzname)

	# Convert the date/time field into a python datetime
	# object.
	x = datetime.strptime(datestr, "%Y-%m-%d %H:%M:%S")

	# Convert the fractional second portion into a count
	# of microseconds.
	if fractional is None:
		fractional = '0'
	fracpower = 6 - len(fractional)
	fractional = float(fractional) * (10 ** fracpower)

	# Return updated datetime object with microseconds and
	# timezone information.
	return x.replace(microsecond=int(fractional), tzinfo=tz)
